const GH_API = "https://api.github.com";
const GH_CONTRIB_API = "https://github-contributions-api.jogruber.de/v4";

function githubHeaders(): Record<string, string> {
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function ghFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${GH_API}${path}`, { headers: githubHeaders() });

  if (res.status === 404) throw new Error("GitHub user not found.");
  if (res.status === 403) {
    const reset = res.headers.get("x-ratelimit-reset");
    const resetTime = reset ? new Date(Number(reset) * 1000).toISOString() : "soon";
    throw new Error(`GitHub API rate limit exceeded. Resets at ${resetTime}.`);
  }
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

  return res.json() as Promise<T>;
}

// ─── Raw types ────────────────────────────────────────────────────────────────

interface GhUser {
  login: string;
  name: string | null;
  avatar_url: string;
  created_at: string;
  followers: number;
  following: number;
  public_repos: number;
}

interface GhRepo {
  name: string;
  fork: boolean;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  description: string | null;
}

interface GhEvent {
  type: string;
  created_at: string;
}

interface ContribDay {
  date: string;
  contributionCount: number;
}

interface ContribWeek {
  contributionDays: ContribDay[];
}

interface ContribApiResponse {
  total: Record<string, number>;
  contributions: ContribDay[];
}

// ─── Public response shape (sent to frontend) ─────────────────────────────────

export interface GithubProfileData {
  username: string;
  name: string | null;
  avatarUrl: string;
  createdAt: string;
  followers: number;
  following: number;
  publicRepos: number;
  totalStars: number;
  totalForks: number;
  totalContribs: number;
  contribWeeks: ContribWeek[];
  topLanguages: { name: string; color: string; percent: number }[];
  pinnedRepos: { name: string; stars: number; forks: number; lang: string; desc: string | null }[];
  pullRequests: number;
  issues: number;
  currentStreak: number;
  longestStreak: number;
  last30: number;
  prev30: number;
  activeWeeks: number;
  peakDay: string;
  accountAgeDays: number;
}

// ─── Language color map ───────────────────────────────────────────────────────

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6", JavaScript: "#f7df1e", Python: "#3572A5",
  Rust: "#dea584", Go: "#00ADD8", Java: "#b07219", "C++": "#f34b7d",
  C: "#555555", "C#": "#178600", Ruby: "#701516", Swift: "#F05138",
  Kotlin: "#A97BFF", Dart: "#00B4AB", HTML: "#e34c26", CSS: "#563d7c",
  Shell: "#89e051", Vue: "#41b883", Svelte: "#ff3e00",
};

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// ─── Fallback: derive contribution-like data from public events ───────────────
//
// When the third-party contributions API fails or returns null, we synthesise
// a sparse ContribDay[] from the user's public events (max 100 events, ~90 days
// coverage in practice). Counts are a lower-bound approximation — every event
// on a given date is counted as one contribution for that date.
//
function contribsFromEvents(events: GhEvent[]): ContribDay[] {
  const dayCounts: Record<string, number> = {};

  for (const e of events) {
    if (!e.created_at) continue;
    // Normalise to YYYY-MM-DD
    const date = e.created_at.slice(0, 10);
    dayCounts[date] = (dayCounts[date] ?? 0) + 1;
  }

  if (Object.keys(dayCounts).length === 0) return [];

  // Build a contiguous day range from earliest date to today
  const dates = Object.keys(dayCounts).sort();
  const start = new Date(dates[0] + "T12:00:00");
  const end = new Date();
  const result: ContribDay[] = [];

  for (const d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const iso = d.toISOString().slice(0, 10);
    result.push({ date: iso, contributionCount: dayCounts[iso] ?? 0 });
  }

  return result;
}

// ─── Main fetch function ──────────────────────────────────────────────────────

export async function getGithubProfile(username: string): Promise<GithubProfileData> {
  const encoded = encodeURIComponent(username);

  // Fire independent requests in parallel
  const [user, repos, events, contribRaw] = await Promise.allSettled([
    ghFetch<GhUser>(`/users/${encoded}`),
    ghFetch<GhRepo[]>(`/users/${encoded}/repos?per_page=100&sort=pushed`),
    ghFetch<GhEvent[]>(`/users/${encoded}/events/public?per_page=100`),
    fetch(`${GH_CONTRIB_API}/${encoded}?y=last`)
      .then((r) => {
        if (!r.ok) return null;
        return r.json() as Promise<ContribApiResponse>;
      })
      .catch(() => null), // <-- BUG FIX: network errors were silently dropping data
  ]);

  // User is mandatory — propagate error if it failed
  if (user.status === "rejected") throw new Error(user.reason?.message ?? "Failed to fetch GitHub user.");

  const userData = user.value;
  const repoList: GhRepo[] = repos.status === "fulfilled" ? repos.value : [];
  const eventList: GhEvent[] = events.status === "fulfilled" ? events.value : [];
  const contribData: ContribApiResponse | null = contribRaw.status === "fulfilled" ? contribRaw.value : null;

  // ── Repos ────────────────────────────────────────────────────────────────
  const ownRepos = repoList.filter((r) => !r.fork);
  const totalStars = ownRepos.reduce((s, r) => s + (r.stargazers_count ?? 0), 0);
  const totalForks = ownRepos.reduce((s, r) => s + (r.forks_count ?? 0), 0);

  const langCounts: Record<string, number> = {};
  ownRepos.forEach((r) => {
    if (r.language) langCounts[r.language] = (langCounts[r.language] ?? 0) + 1;
  });
  const langTotal = Object.values(langCounts).reduce((a, b) => a + b, 0) || 1;
  const topLanguages = Object.entries(langCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, count]) => ({
      name,
      color: LANG_COLORS[name] ?? "#6366f1",
      percent: Math.round((count / langTotal) * 100),
    }));

  const pinnedRepos = [...ownRepos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 3)
    .map((r) => ({
      name: r.name,
      stars: r.stargazers_count,
      forks: r.forks_count,
      lang: r.language ?? "—",
      desc: r.description,
    }));

  // ── Events ───────────────────────────────────────────────────────────────
  const pullRequests = eventList.filter((e) => e.type === "PullRequestEvent").length;
  const issues = eventList.filter((e) => e.type === "IssuesEvent").length;

  // ── Contributions ─────────────────────────────────────────────────────────
  // FIX: when the third-party API returns null, fall back to event-derived data
  // so that Consistency and Recent Activity always have something to work with.
  let rawDays: ContribDay[] = [];
  let totalContribs = 0;

  if (contribData) {
    rawDays = contribData.contributions ?? [];
    totalContribs =
      contribData.total?.["lastYear"] ??
      rawDays.reduce((s, d) => s + d.contributionCount, 0);
  } else if (eventList.length > 0) {
    // Fallback path — derive from events
    rawDays = contribsFromEvents(eventList);
    totalContribs = rawDays.reduce((s, d) => s + d.contributionCount, 0);
  }

  // Chunk flat ContribDay[] into weeks of 7
  const contribWeeks: ContribWeek[] = [];
  for (let i = 0; i < rawDays.length; i += 7) {
    contribWeeks.push({ contributionDays: rawDays.slice(i, i + 7) });
  }

  // ── Derived stats ─────────────────────────────────────────────────────────
  const allDays = contribWeeks.flatMap((w) => w.contributionDays);
  // FIX: sort by date before slicing; rawDays from the fallback path are already
  // sorted, but the API path order is not guaranteed.
  const sorted = [...allDays].sort((a, b) => a.date.localeCompare(b.date));

  const activeWeeks = contribWeeks.filter((w) =>
    w.contributionDays.some((d) => d.contributionCount > 0),
  ).length;

  // FIX: guard against empty sorted array to avoid NaN on slice(-30) etc.
  const last30 = sorted.length > 0
    ? sorted.slice(-30).reduce((s, d) => s + d.contributionCount, 0)
    : 0;
  const prev30 = sorted.length > 30
    ? sorted.slice(-60, -30).reduce((s, d) => s + d.contributionCount, 0)
    : 0;

  // Current streak (from end)
  let currentStreak = 0;
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (sorted[i].contributionCount > 0) currentStreak++;
    else break;
  }

  // Longest streak
  let longestStreak = 0;
  let run = 0;
  for (const d of sorted) {
    if (d.contributionCount > 0) { run++; longestStreak = Math.max(longestStreak, run); }
    else run = 0;
  }

  // Peak day
  const dayTotals = [0, 0, 0, 0, 0, 0, 0];
  allDays.forEach((d) => {
    const dow = new Date(d.date + "T12:00:00").getDay();
    dayTotals[dow] += d.contributionCount;
  });
  const peakDow = dayTotals.every((v) => v === 0) ? 0 : dayTotals.indexOf(Math.max(...dayTotals));
  const peakDay = DAY_NAMES[peakDow] ?? "Monday";

  const accountAgeDays = Math.floor(
    (Date.now() - new Date(userData.created_at).getTime()) / 86_400_000,
  );

  return {
    username: userData.login,
    name: userData.name,
    avatarUrl: userData.avatar_url,
    createdAt: userData.created_at,
    followers: userData.followers,
    following: userData.following,
    publicRepos: userData.public_repos,
    totalStars,
    totalForks,
    totalContribs,
    contribWeeks,
    topLanguages,
    pinnedRepos,
    pullRequests,
    issues,
    currentStreak,
    longestStreak,
    last30,
    prev30,
    activeWeeks,
    peakDay,
    accountAgeDays,
  };
}