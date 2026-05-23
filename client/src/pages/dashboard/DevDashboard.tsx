import { useState, useEffect, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal, Flame, Code2, Activity, GitCommit,
  ArrowRight, RefreshCw, Star, GitPullRequest,
  AlertCircle, Users, Zap, TrendingUp, CalendarDays,
  Trophy, Loader2,
} from "lucide-react";
import api from "../../lib/axios";
import ContributionGraph, { type GraphEntry } from "../../components/dashboard/ContributionGraph";
import {
  DashboardBadge,
  DashboardButton,
  DashboardCard,
  DashboardInput,
} from "../../components/dashboard/ui";
import { ColorDot } from "../../components/ui/ColorDot";
import { cn } from "../../lib/utils";

const GH_USERNAME_KEY = "kyzen-gh-username";

interface ContribDay {
  date: string;
  contributionCount?: number;
  count?: number;
}
interface ContribWeek { contributionDays: ContribDay[] }

interface GithubData {
  username: string;
  avatarUrl: string;
  name: string | null;
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

type RankTier = "S" | "A" | "B" | "C" | "D" | "E";

interface RankScore {
  final: number;
  volume: number;
  consistency: number;
  activity: number;
  stars: number;
  community: number;
  tier: RankTier;
  nextTier: RankTier | null;
  pctToNext: number;
}

const RANK_TIERS: Record<RankTier, { min: number; label: string; desc: string }> = {
  S: { min: 75, label: "S", desc: "Elite" },
  A: { min: 60, label: "A", desc: "Expert" },
  B: { min: 45, label: "B", desc: "Advanced" },
  C: { min: 30, label: "C", desc: "Intermediate" },
  D: { min: 15, label: "D", desc: "Developing" },
  E: { min: 0, label: "E", desc: "Beginner" },
};

const RANK_CLASS: Record<RankTier, { text: string; border: string; bg: string; stroke: string; glow: string }> = {
  S: { text: "text-amber-300", border: "border-amber-300/30", bg: "bg-amber-300/12", stroke: "stroke-amber-300", glow: "shadow-[0_0_60px_rgba(252,211,77,0.25)]" },
  A: { text: "text-violet-400", border: "border-violet-400/30", bg: "bg-violet-400/12", stroke: "stroke-violet-400", glow: "shadow-[0_0_60px_rgba(167,139,250,0.22)]" },
  B: { text: "text-blue-400", border: "border-blue-400/30", bg: "bg-blue-400/12", stroke: "stroke-blue-400", glow: "shadow-[0_0_60px_rgba(96,165,250,0.2)]" },
  C: { text: "text-emerald-400", border: "border-emerald-400/30", bg: "bg-emerald-400/12", stroke: "stroke-emerald-400", glow: "shadow-[0_0_60px_rgba(52,211,153,0.18)]" },
  D: { text: "text-slate-400", border: "border-slate-400/30", bg: "bg-slate-400/12", stroke: "stroke-slate-400", glow: "shadow-[0_0_40px_rgba(148,163,184,0.15)]" },
  E: { text: "text-slate-500", border: "border-slate-500/30", bg: "bg-slate-500/12", stroke: "stroke-slate-500", glow: "shadow-[0_0_32px_rgba(100,116,139,0.12)]" },
};

const TIER_ORDER: RankTier[] = ["S", "A", "B", "C", "D", "E"];

const SCORE_METRICS: { key: keyof Pick<RankScore, "volume" | "consistency" | "activity" | "stars" | "community">; label: string; weight: string; bar: string; text: string }[] = [
  { key: "volume", label: "Volume", weight: "30%", bar: "bg-blue-400", text: "text-blue-400" },
  { key: "consistency", label: "Consistency", weight: "25%", bar: "bg-violet-400", text: "text-violet-400" },
  { key: "activity", label: "Recent Activity", weight: "20%", bar: "bg-emerald-400", text: "text-emerald-400" },
  { key: "stars", label: "Stars", weight: "15%", bar: "bg-amber-300", text: "text-amber-300" },
  { key: "community", label: "Community", weight: "10%", bar: "bg-pink-400", text: "text-pink-400" },
];

function getTier(score: number): RankTier {
  for (const tier of TIER_ORDER) {
    if (score >= RANK_TIERS[tier].min) return tier;
  }
  return "E";
}

function getNextTier(tier: RankTier): RankTier | null {
  const idx = TIER_ORDER.indexOf(tier);
  return idx > 0 ? TIER_ORDER[idx - 1] : null;
}

function flattenContribWeeks(weeks: ContribWeek[]): GraphEntry[] {
  if (!Array.isArray(weeks)) return [];
  const entries: GraphEntry[] = [];
  for (const week of weeks) {
    if (!Array.isArray(week?.contributionDays)) continue;
    for (const day of week.contributionDays) {
      if (!day?.date || typeof day.date !== "string" || !day.date.trim()) continue;
      const raw = day.contributionCount ?? (day as { count?: number }).count ?? 0;
      const count = Math.max(0, Number(raw) || 0);
      entries.push({ date: day.date.trim(), count });
    }
  }
  return entries;
}

function computeScore(d: GithubData): RankScore {
  const totalContribs = Number(d.totalContribs) || 0;
  const activeWeeks = Number(d.activeWeeks) || 0;
  const last30 = Number(d.last30) || 0;
  const prev30 = Number(d.prev30) || 0;
  const totalStars = Number(d.totalStars) || 0;
  const pullRequests = Number(d.pullRequests) || 0;
  const issues = Number(d.issues) || 0;

  const volume = Math.min(100, (totalContribs / 500) * 100);
  const consistency = Math.min(100, (activeWeeks / 52) * 100);

  let activity: number;
  if (last30 > 0 && prev30 > 0) {
    activity = Math.min(100, (last30 / prev30) * 80 + (last30 / 25) * 20);
  } else if (last30 > 0) {
    activity = Math.min(100, 50 + (last30 / 25) * 50);
  } else {
    activity = Math.min(100, (totalContribs / 365) * 50);
  }

  const stars = Math.min(100, (Math.log10(totalStars + 1) / Math.log10(50)) * 100);
  const community = Math.min(
    100,
    (Math.log10(pullRequests + issues + 1) / Math.log10(40)) * 100,
  );

  const final =
    volume * 0.30 +
    consistency * 0.25 +
    activity * 0.20 +
    stars * 0.15 +
    community * 0.10;

  const tier = getTier(final);
  const nextTier = getNextTier(tier);
  const curMin = RANK_TIERS[tier].min;
  const nextMin = nextTier ? RANK_TIERS[nextTier].min : curMin;
  const pctToNext = nextTier
    ? Math.min(100, ((final - curMin) / (nextMin - curMin)) * 100)
    : 100;

  return {
    final: Math.round(final * 10) / 10,
    volume: Math.round(volume),
    consistency: Math.round(consistency),
    activity: Math.round(activity),
    stars: Math.round(stars),
    community: Math.round(community),
    tier,
    nextTier,
    pctToNext: Math.round(pctToNext),
  };
}

async function fetchGithubData(username: string): Promise<GithubData> {
  const { data } = await api.get<GithubData>(`/github/${encodeURIComponent(username)}`);
  return data;
}

function Counter({ to, duration = 1.2 }: { to: number; duration?: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / (duration * 1000), 1);
      const ease = 1 - (1 - progress) ** 3;
      setVal(Math.round(ease * to));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [to, duration]);
  return <>{val}</>;
}

function ScoreRing({ score, tier }: { score: number; tier: RankTier }) {
  const rank = RANK_CLASS[tier];
  const size = 180;
  const cx = size / 2;
  const cy = size / 2;
  const rad = 72;
  const circ = 2 * Math.PI * rad;
  const dash = (score / 100) * circ;

  return (
    <div className="relative flex h-[180px] w-[180px] items-center justify-center">
      <svg
        width={size}
        height={size}
        className="absolute inset-0 -rotate-90"
      >
        <circle
          cx={cx}
          cy={cy}
          r={rad}
          fill="none"
          className="stroke-dash-muted-btn"
          strokeWidth={6}
        />
        <motion.circle
          cx={cx}
          cy={cy}
          r={rad}
          fill="none"
          className={cn(rank.stroke, "drop-shadow-[0_0_8px_currentColor]")}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
        {[25, 50, 75].map((pct) => {
          const angle = (pct / 100) * 2 * Math.PI - Math.PI / 2;
          const ox = cx + (rad + 10) * Math.cos(angle);
          const oy = cy + (rad + 10) * Math.sin(angle);
          return (
            <circle
              key={pct}
              cx={ox}
              cy={oy}
              r={1.5}
              className="fill-dash-faint"
            />
          );
        })}
      </svg>
      <div className="relative z-10 flex flex-col items-center gap-0.5">
        <span
          className={cn(
            "font-dash-mono text-[52px] leading-none font-black tracking-[-0.05em]",
            rank.text,
          )}
        >
          {tier}
        </span>
        <span className="font-dash-mono text-[10px] uppercase tracking-[0.15em] text-dash-faint">
          {RANK_TIERS[tier].desc}
        </span>
      </div>
    </div>
  );
}

function ScoreBar({
  label,
  value,
  weight,
  barClass,
  textClass,
}: {
  label: string;
  value: number;
  weight: string;
  barClass: string;
  textClass: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-dash-mono text-[11px] font-medium text-dash-secondary">{label}</span>
          <span className={cn("rounded px-1.5 py-0.5 font-dash-mono text-[9px]", textClass, "bg-current/10")}>
            {weight}
          </span>
        </div>
        <span className={cn("font-dash-mono text-[11px] font-bold tabular-nums", textClass)}>
          {value}
        </span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-dash-muted-btn">
        <motion.div
          className={cn("h-full rounded-full shadow-[0_0_8px_color-mix(in_srgb,currentColor_40%,transparent)]", barClass)}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}

function MicroStat({
  icon,
  label,
  value,
  sub,
  iconWrapClass = "bg-dash-accent-soft text-dash-violet",
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  iconWrapClass?: string;
}) {
  return (
    <DashboardCard alt className="flex flex-col gap-2 rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <div
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-lg",
            iconWrapClass,
          )}
        >
          {icon}
        </div>
        <span className="font-dash-mono text-[9px] uppercase tracking-[0.1em] text-dash-faint">
          {label}
        </span>
      </div>
      <div>
        <p className="font-dash-mono text-[20px] leading-none font-bold tracking-[-0.03em] text-dash-primary tabular-nums">
          {value}
        </p>
        {sub && (
          <p className="mt-1 font-dash-mono text-[9px] text-dash-faint">{sub}</p>
        )}
      </div>
    </DashboardCard>
  );
}

function ConnectForm({ onSubmit }: { onSubmit: (u: string) => void }) {
  const [value, setValue] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim().replace(/^@/, "");
    if (trimmed) onSubmit(trimmed);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto max-w-md"
    >
      <DashboardCard
        alt
        className="relative flex flex-col items-center gap-6 overflow-hidden rounded-2xl p-8 text-center"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,color-mix(in_srgb,var(--dash-accent)_12%,transparent),transparent)]" />
        <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-dash-accent-border bg-dash-accent-soft shadow-[0_0_32px_color-mix(in_srgb,var(--dash-accent)_15%,transparent)]">
          <Terminal size={28} className="text-dash-violet" />
        </div>
        <div className="relative">
          <h2 className="mb-2 font-dash-sans text-[18px] font-bold tracking-[-0.02em] text-dash-primary">
            Analyse Developer Profile
          </h2>
          <p className="mx-auto max-w-[300px] font-dash-mono text-[12px] leading-relaxed text-dash-faint">
            Enter a GitHub username to compute your developer rank, score breakdown, and intelligence report.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="relative flex w-full flex-col gap-3">
          <div className="flex items-center gap-2.5 rounded-xl border border-dash-input-border bg-dash-input px-4 py-3">
            <span className="font-dash-mono text-[13px] text-dash-faint">@</span>
            <DashboardInput
              type="text"
              placeholder="github-username"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="border-0 bg-transparent p-0 font-dash-mono text-[13px] focus:ring-0"
              autoFocus
            />
          </div>
          <DashboardButton
            type="submit"
            variant="primary"
            disabled={!value.trim()}
            className="rounded-xl py-3 font-dash-mono text-[13px] font-semibold"
          >
            Compute Rank <ArrowRight size={14} />
          </DashboardButton>
        </form>
      </DashboardCard>
    </motion.div>
  );
}

function LoadingState({ username }: { username: string }) {
  const steps = [
    "Fetching profile data",
    "Analysing contributions",
    "Computing consistency",
    "Calculating rank score",
  ];
  const [step, setStep] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setStep((s) => Math.min(s + 1, steps.length - 1)), 700);
    return () => clearInterval(iv);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-md"
    >
      <DashboardCard alt className="flex flex-col items-center gap-5 rounded-2xl p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-dash-accent-soft">
          <Loader2 size={22} className="animate-spin text-dash-violet" />
        </div>
        <div className="text-center">
          <p className="mb-1 font-dash-sans text-[13px] font-semibold text-dash-primary">
            Analysing @{username}
          </p>
          <p className="font-dash-mono text-[11px] text-dash-faint">{steps[step]}…</p>
        </div>
        <div className="flex gap-1">
          {steps.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1 rounded-full transition-all duration-300",
                i <= step ? "w-6 bg-dash-accent" : "w-2 bg-dash-muted-btn",
              )}
            />
          ))}
        </div>
      </DashboardCard>
    </motion.div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-md"
    >
      <DashboardCard className="flex flex-col items-center gap-4 rounded-2xl border-dash-danger/30 bg-dash-danger/5 p-8 text-center">
        <AlertCircle size={24} className="text-dash-danger" />
        <div>
          <p className="mb-1 font-dash-sans text-[13px] font-semibold text-dash-primary">Analysis Failed</p>
          <p className="font-dash-mono text-[11px] text-dash-faint">{message}</p>
        </div>
        <DashboardButton variant="danger" size="sm" className="rounded-xl font-dash-mono" onClick={onRetry}>
          <RefreshCw size={11} /> Try again
        </DashboardButton>
      </DashboardCard>
    </motion.div>
  );
}

function IntelPanel({ data, onReset }: { data: GithubData; onReset: () => void }) {
  const score = computeScore(data);
  const rank = RANK_CLASS[score.tier];
  const nextRank = score.nextTier ? RANK_CLASS[score.nextTier] : null;

  const graphEntries: GraphEntry[] = flattenContribWeeks(data.contribWeeks);

  const stagger = (i: number) => ({
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] as const },
  });

  const accountYears = (data.accountAgeDays / 365).toFixed(1);
  const trendPct =
    data.prev30 === 0
      ? 0
      : Math.round(((data.last30 - data.prev30) / Math.max(data.prev30, 1)) * 100);
  const trendUp = trendPct >= 0;

  return (
    <div className="space-y-5">
      <motion.div {...stagger(0)} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={data.avatarUrl}
            alt={data.username}
            className="h-9 w-9 rounded-xl border border-dash-border object-cover"
          />
          <div>
            <p className="font-dash-sans text-[14px] leading-tight font-semibold tracking-[-0.01em] text-dash-primary">
              {data.name ?? data.username}
            </p>
            <p className="font-dash-mono text-[10px] text-dash-faint">@{data.username}</p>
          </div>
          <DashboardBadge className={cn("ml-1 gap-1 px-2.5 py-1", rank.bg, rank.border, rank.text)}>
            RANK {score.tier}
          </DashboardBadge>
        </div>
        <DashboardButton variant="ghost" size="sm" className="font-dash-mono text-[11px]" onClick={onReset}>
          <RefreshCw size={10} /> Change
        </DashboardButton>
      </motion.div>

      <motion.div {...stagger(1)}>
        <DashboardCard
          className={cn(
            "relative overflow-hidden rounded-2xl border bg-gradient-to-br from-dash-card-alt to-dash-card",
            rank.border,
            rank.glow,
          )}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_70%_at_10%_50%,color-mix(in_srgb,var(--dash-accent)_4%,transparent),transparent_60%),radial-gradient(ellipse_30%_50%_at_90%_20%,color-mix(in_srgb,var(--dash-accent)_6%,transparent),transparent_60%)]" />
          <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-dash-accent/60 to-transparent" />
          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
              <div className="flex shrink-0 flex-col items-center gap-3">
                <ScoreRing score={score.final} tier={score.tier} />
                <div className="text-center">
                  <p className="mb-0.5 font-dash-mono text-[10px] uppercase tracking-[0.12em] text-dash-faint">
                    Final Score
                  </p>
                  <p className={cn("font-dash-mono text-[28px] font-black tracking-[-0.04em] tabular-nums", rank.text)}>
                    <Counter to={score.final} duration={1.2} />
                    <span className="text-[14px] opacity-50">/100</span>
                  </p>
                </div>
              </div>

              <div className="min-w-0 w-full flex-1">
                <p className="mb-4 font-dash-mono text-[10px] uppercase tracking-[0.1em] text-dash-faint">
                  Score Breakdown
                </p>
                <div className="space-y-3">
                  {SCORE_METRICS.map((m) => (
                    <ScoreBar
                      key={m.key}
                      label={m.label}
                      value={score[m.key]}
                      weight={m.weight}
                      barClass={m.bar}
                      textClass={m.text}
                    />
                  ))}
                </div>

                {score.nextTier && nextRank ? (
                  <div className="mt-5 border-t border-dash-border pt-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-dash-mono text-[10px] text-dash-faint">
                        Progress to Rank {score.nextTier}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <DashboardBadge className={cn(nextRank.bg, nextRank.border, nextRank.text)}>
                          {score.nextTier} — {RANK_TIERS[score.nextTier].desc}
                        </DashboardBadge>
                        <span className={cn("font-dash-mono text-[10px] font-bold tabular-nums", nextRank.text)}>
                          {score.pctToNext}%
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-dash-muted-btn">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-dash-accent to-dash-violet"
                        initial={{ width: 0 }}
                        animate={{ width: `${score.pctToNext}%` }}
                        transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 flex items-center gap-2 border-t border-dash-border pt-4">
                    <Trophy size={13} className="text-amber-300" />
                    <span className="font-dash-mono text-[11px] text-dash-muted">
                      Maximum rank achieved
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DashboardCard>
      </motion.div>

      <motion.div {...stagger(2)} className="flex flex-wrap items-center justify-center gap-1">
        {TIER_ORDER.slice()
          .reverse()
          .map((tier) => {
            const tierRank = RANK_CLASS[tier];
            const active = tier === score.tier;
            return (
              <div
                key={tier}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl px-3 py-2 transition-all",
                  active ? tierRank.bg : "bg-dash-card-alt",
                  active ? tierRank.border : "border border-dash-border",
                  active ? "opacity-100" : "opacity-40",
                )}
              >
                <span className={cn("font-dash-mono text-[14px] font-black", tierRank.text)}>{tier}</span>
                <span className="font-dash-mono text-[8px] uppercase tracking-wider text-dash-faint">
                  {RANK_TIERS[tier].desc}
                </span>
                <span className="font-dash-mono text-[8px] text-dash-faint">{RANK_TIERS[tier].min}+</span>
              </div>
            );
          })}
      </motion.div>

      {graphEntries.length > 0 && (
        <motion.div {...stagger(3)}>
          <DashboardCard alt className="overflow-hidden rounded-2xl">
            <div className="flex items-center justify-between border-b border-dash-border px-5 py-4">
              <div className="flex items-center gap-2">
                <Activity size={13} className="text-dash-accent" />
                <span className="font-dash-sans text-[12px] font-medium text-dash-primary">
                  Contribution Graph
                </span>
                <DashboardBadge variant="violet">Last 52 weeks</DashboardBadge>
              </div>
              <span className="font-dash-mono text-[11px] font-semibold text-dash-accent tabular-nums">
                {data.totalContribs.toLocaleString()} contributions
              </span>
            </div>
            <div className="px-5 py-4">
              <ContributionGraph
                data={graphEntries}
                activityLabel="contributions"
                levelMode="scaled"
                totalMode="window"
                aggregateDuplicates
              />
            </div>
          </DashboardCard>
        </motion.div>
      )}

      <motion.div {...stagger(4)}>
        <p className="mb-3 font-dash-mono text-[10px] uppercase tracking-[0.1em] text-dash-faint">
          Intelligence Report
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <MicroStat icon={<Flame size={13} />} label="Current Streak" value={`${data.currentStreak}d`} sub="active days" iconWrapClass="bg-dash-orange/15 text-dash-orange" />
          <MicroStat icon={<Trophy size={13} />} label="Longest Streak" value={`${data.longestStreak}d`} sub="personal best" iconWrapClass="bg-amber-300/15 text-amber-300" />
          <MicroStat icon={<Star size={13} />} label="Total Stars" value={data.totalStars.toLocaleString()} sub="across repos" iconWrapClass="bg-amber-300/15 text-amber-300" />
          <MicroStat icon={<GitPullRequest size={13} />} label="Pull Requests" value={data.pullRequests} sub="last 100 events" iconWrapClass="bg-violet-400/15 text-violet-400" />
          <MicroStat icon={<AlertCircle size={13} />} label="Issues" value={data.issues} sub="last 100 events" iconWrapClass="bg-blue-400/15 text-blue-400" />
          <MicroStat icon={<Users size={13} />} label="Followers" value={data.followers.toLocaleString()} sub={`following ${data.following}`} iconWrapClass="bg-emerald-400/15 text-emerald-400" />
          <MicroStat icon={<Activity size={13} />} label="Active Weeks" value={`${data.activeWeeks}/52`} sub="this year" iconWrapClass="bg-dash-accent-soft text-dash-violet" />
          <MicroStat icon={<TrendingUp size={13} />} label="30d Trend" value={`${trendUp ? "+" : ""}${trendPct}%`} sub="vs prev 30 days" iconWrapClass={trendUp ? "bg-emerald-400/15 text-emerald-400" : "bg-dash-danger/15 text-dash-danger"} />
          <MicroStat icon={<GitCommit size={13} />} label="Yearly Contribs" value={data.totalContribs.toLocaleString()} sub="last 365 days" iconWrapClass="bg-dash-accent-soft text-dash-accent" />
          <MicroStat icon={<CalendarDays size={13} />} label="Peak Day" value={(data.peakDay ?? "—").slice(0, 3)} sub="most active" iconWrapClass="bg-dash-orange/15 text-dash-orange" />
          <MicroStat icon={<Code2 size={13} />} label="Public Repos" value={data.publicRepos} sub="own repos" iconWrapClass="bg-dash-accent-soft text-dash-violet" />
          <MicroStat icon={<Zap size={13} />} label="Account Age" value={`${accountYears}y`} sub="on GitHub" iconWrapClass="bg-slate-400/15 text-slate-400" />
        </div>
      </motion.div>

      {data.topLanguages.length > 0 && (
        <motion.div {...stagger(5)}>
          <p className="mb-3 font-dash-mono text-[10px] uppercase tracking-[0.1em] text-dash-faint">
            Language Profile
          </p>
          <DashboardCard alt className="rounded-2xl p-5">
            <div className="mb-4 flex h-2.5 gap-0.5 overflow-hidden rounded-lg">
              {data.topLanguages.map((lang) => (
                <motion.div
                  key={lang.name}
                  initial={{ width: 0 }}
                  animate={{ width: `${lang.percent}%` }}
                  transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-sm bg-[var(--lang-color)]"
                  style={{ "--lang-color": lang.color } as React.CSSProperties}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {data.topLanguages.map((lang) => (
                <div key={lang.name} className="flex items-center gap-1.5">
                  <ColorDot color={lang.color} className="h-2 w-2" />
                  <span className="font-dash-sans text-[11px] font-medium text-dash-secondary">{lang.name}</span>
                  <span className="font-dash-mono text-[10px] text-dash-faint">{lang.percent}%</span>
                </div>
              ))}
            </div>
          </DashboardCard>
        </motion.div>
      )}

      {data.pinnedRepos.length > 0 && (
        <motion.div {...stagger(6)}>
          <p className="mb-3 font-dash-mono text-[10px] tracking-widest text-dash-faint uppercase">
            Top Repositories
          </p>
          <div className="grid grid-cols-1 gap-3 pb-4 sm:grid-cols-3">
            {data.pinnedRepos.map((repo) => (
              <DashboardCard key={repo.name} alt className="flex flex-col gap-2 rounded-2xl p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate font-dash-sans text-[12px] font-semibold tracking-[-0.01em] text-dash-primary">
                    {repo.name}
                  </p>
                  <div className="flex shrink-0 items-center gap-1">
                    <Star size={10} className="text-amber-300" />
                    <span className="font-dash-mono text-[10px] font-bold text-amber-300 tabular-nums">
                      {repo.stars}
                    </span>
                  </div>
                </div>
                {repo.desc && (
                  <p className="line-clamp-2 font-dash-sans text-[10px] leading-relaxed text-dash-faint">
                    {repo.desc}
                  </p>
                )}
                <div className="mt-auto flex items-center gap-3 pt-1">
                  <span className="font-dash-mono text-[9px] font-medium text-dash-faint">{repo.lang}</span>
                  <span className="flex items-center gap-1 font-dash-mono text-[9px] text-dash-faint">
                    <GitCommit size={9} /> {repo.forks} forks
                  </span>
                </div>
              </DashboardCard>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function DevDashboard() {
  const [username, setUsername] = useState<string>(() => localStorage.getItem(GH_USERNAME_KEY) ?? "");
  const [data, setData] = useState<GithubData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (u: string) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const result = await fetchGithubData(u);
      setData(result);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } }; message?: string })?.response?.data
          ?.message ??
        (err as Error)?.message ??
        "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (username) load(username);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleSubmit(u: string) {
    setUsername(u);
    localStorage.setItem(GH_USERNAME_KEY, u);
    load(u);
  }

  function handleReset() {
    setUsername("");
    setData(null);
    setError(null);
    localStorage.removeItem(GH_USERNAME_KEY);
  }

  return (
    <div className="min-h-screen bg-dash-page p-4 font-dash-sans transition-colors duration-300 md:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8 flex items-center gap-3"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-dash-accent-border bg-dash-accent-soft">
          <Terminal size={15} className="text-dash-violet" />
        </div>
        <div>
          <h1 className="font-dash-sans text-[18px] leading-tight font-bold tracking-[-0.02em] text-dash-primary">
            Dev Intelligence
          </h1>
          <p className="font-dash-mono text-[10px] text-dash-faint">GitHub rank · scoring · analytics</p>
        </div>
        <DashboardBadge variant="violet" className="ml-auto uppercase tracking-widest">
          Beta
        </DashboardBadge>
      </motion.div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <LoadingState username={username} />
          </motion.div>
        ) : error ? (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ErrorState message={error} onRetry={() => load(username)} />
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={handleReset}
                className="font-dash-mono text-[11px] text-dash-faint transition-colors hover:text-dash-muted"
              >
                ← Use different username
              </button>
            </div>
          </motion.div>
        ) : data ? (
          <motion.div key="data" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <IntelPanel data={data} onReset={handleReset} />
          </motion.div>
        ) : (
          <motion.div key="connect" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ConnectForm onSubmit={handleSubmit} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
