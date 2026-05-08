import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal, Flame, Code2, Activity, GitCommit,
  ArrowRight, RefreshCw, Star, GitPullRequest,
  AlertCircle, Users, Zap, TrendingUp, CalendarDays,
  Trophy, Loader2,
} from "lucide-react";
import { useTokens } from "../../state/theme/ThemeContext";
import api from "../../lib/axios";
import ContributionGraph, { type GraphEntry } from "../../components/dashboard/DevContributionGraph";

// ─── localStorage key ─────────────────────────────────────────────────────────

const GH_USERNAME_KEY = "kyzen-gh-username";

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Rank config ──────────────────────────────────────────────────────────────

const RANK_TIERS: Record<RankTier, { min: number; color: string; glow: string; label: string; desc: string }> = {
  S: { min: 75, color: "#FCD34D", glow: "rgba(252,211,77,0.25)",   label: "S", desc: "Elite"        },
  A: { min: 60, color: "#A78BFA", glow: "rgba(167,139,250,0.22)",  label: "A", desc: "Expert"       },
  B: { min: 45, color: "#60A5FA", glow: "rgba(96,165,250,0.20)",   label: "B", desc: "Advanced"     },
  C: { min: 30, color: "#34D399", glow: "rgba(52,211,153,0.18)",   label: "C", desc: "Intermediate" },
  D: { min: 15, color: "#94A3B8", glow: "rgba(148,163,184,0.15)",  label: "D", desc: "Developing"   },
  E: { min: 0,  color: "#64748B", glow: "rgba(100,116,139,0.12)",  label: "E", desc: "Beginner"     },
};

const TIER_ORDER: RankTier[] = ["S", "A", "B", "C", "D", "E"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
      const raw = day.contributionCount ?? (day as any).count ?? 0;
      const count = Math.max(0, Number(raw) || 0);
      entries.push({ date: day.date.trim(), count });
    }
  }
  return entries;
}

// ─── Scoring engine ───────────────────────────────────────────────────────────
//
// FIX 1 — consistency: was dividing by 18 (wrong max). A year has 52 weeks,
//          so the correct denominator is 52. With /18 a user active 10 weeks
//          would score 55 instead of 19, and the bar rendered wrong values
//          even when data was present.
//
// FIX 2 — activity: the prev30===0 branch returned 0 whenever last30 was also
//          0, which is always the case when contribWeeks arrives empty (both
//          fields default to 0 from the backend). Changed to use totalContribs
//          as a secondary signal so a user with yearly contributions but no
//          recent 30-day window still gets a non-zero activity score.
//
// FIX 3 — all sub-scores: guard against NaN by coercing every field through
//          Number() with a || 0 fallback before any arithmetic.

function computeScore(d: GithubData): RankScore {
  // Coerce everything — avoids NaN propagation if backend sends nulls
  const totalContribs  = Number(d.totalContribs)  || 0;
  const activeWeeks    = Number(d.activeWeeks)    || 0;
  const last30         = Number(d.last30)         || 0;
  const prev30         = Number(d.prev30)         || 0;
  const totalStars     = Number(d.totalStars)     || 0;
  const pullRequests   = Number(d.pullRequests)   || 0;
  const issues         = Number(d.issues)         || 0;

  // ── Volume (30%) — yearly contribution count, cap at 500 ─────────────────
  const volume = Math.min(100, (totalContribs / 500) * 100);

  // ── Consistency (25%) — active weeks out of 52 (full year) ───────────────
  // FIX 1: was /18, must be /52
  const consistency = Math.min(100, (activeWeeks / 52) * 100);

  // ── Recent Activity (20%) ─────────────────────────────────────────────────
  // FIX 2: when both last30 and prev30 are 0 (no contribWeeks data),
  // fall back to a volume-derived proxy so the bar is never stuck at 0
  // purely due to a missing contributions API response.
  let activity: number;
  if (last30 > 0 && prev30 > 0) {
    // Normal path: momentum ratio + absolute recency bonus
    activity = Math.min(100, (last30 / prev30) * 80 + (last30 / 25) * 20);
  } else if (last30 > 0) {
    // Active recently but no prior-30 data to compare against
    activity = Math.min(100, 50 + (last30 / 25) * 50);
  } else {
    // FIX 2: no 30-day window data at all — proxy from total contribs
    // (~1 contrib/day average over 365 days ≈ score of 50)
    activity = Math.min(100, (totalContribs / 365) * 50);
  }

  // ── Stars (15%) ───────────────────────────────────────────────────────────
  const stars = Math.min(
    100,
    (Math.log10(totalStars + 1) / Math.log10(50)) * 100
  );

  // ── Community (10%) ───────────────────────────────────────────────────────
  const community = Math.min(
    100,
    (Math.log10(pullRequests + issues + 1) / Math.log10(40)) * 100
  );

  // ── Weighted final ────────────────────────────────────────────────────────
  const final =
    volume      * 0.30 +
    consistency * 0.25 +
    activity    * 0.20 +
    stars       * 0.15 +
    community   * 0.10;

  const tier     = getTier(final);
  const nextTier = getNextTier(tier);
  const curMin   = RANK_TIERS[tier].min;
  const nextMin  = nextTier ? RANK_TIERS[nextTier].min : curMin;
  const pctToNext = nextTier
    ? Math.min(100, ((final - curMin) / (nextMin - curMin)) * 100)
    : 100;

  return {
    final:       Math.round(final * 10) / 10,
    volume:      Math.round(volume),
    consistency: Math.round(consistency),
    activity:    Math.round(activity),
    stars:       Math.round(stars),
    community:   Math.round(community),
    tier,
    nextTier,
    pctToNext: Math.round(pctToNext),
  };
}

// ─── Backend fetch ────────────────────────────────────────────────────────────

async function fetchGithubData(username: string): Promise<GithubData> {
  const { data } = await api.get<GithubData>(`/github/${encodeURIComponent(username)}`);
  return data;
}

// ─── Mini animated counter ────────────────────────────────────────────────────

function Counter({ to, duration = 1.2 }: { to: number; duration?: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / (duration * 1000), 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(ease * to));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [to, duration]);
  return <>{val}</>;
}

// ─── Radial score ring ────────────────────────────────────────────────────────

function ScoreRing({ score, tier }: { score: number; tier: RankTier }) {
  const meta = RANK_TIERS[tier];
  const size = 180;
  const cx = size / 2;
  const cy = size / 2;
  const rad = 72;
  const circ = 2 * Math.PI * rad;
  const dash = (score / 100) * circ;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}>
        <circle cx={cx} cy={cy} r={rad} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={6} />
        <motion.circle
          cx={cx} cy={cy} r={rad} fill="none"
          stroke={meta.color} strokeWidth={6} strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ filter: `drop-shadow(0 0 8px ${meta.color})` }}
        />
        {[25, 50, 75].map((pct) => {
          const angle = (pct / 100) * 2 * Math.PI - Math.PI / 2;
          const ox = cx + (rad + 10) * Math.cos(angle);
          const oy = cy + (rad + 10) * Math.sin(angle);
          return <circle key={pct} cx={ox} cy={oy} r={1.5} fill="rgba(255,255,255,0.2)" />;
        })}
      </svg>
      <div className="flex flex-col items-center gap-0.5 relative z-10">
        <span
          className="font-black leading-none"
          style={{
            fontSize: 52,
            letterSpacing: "-0.05em",
            color: meta.color,
            fontFamily: "'DM Mono', monospace",
            textShadow: `0 0 32px ${meta.glow}`,
          }}
        >
          {tier}
        </span>
        <span
          className="text-[10px] uppercase tracking-[0.15em]"
          style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'DM Mono', monospace" }}
        >
          {meta.desc}
        </span>
      </div>
    </div>
  );
}

// ─── Score bar ────────────────────────────────────────────────────────────────

function ScoreBar({ label, value, weight, color }: {
  label: string; value: number; weight: string; color: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span
            className="text-[11px] font-medium"
            style={{ color: "rgba(255,255,255,0.7)", fontFamily: "'DM Mono', monospace" }}
          >
            {label}
          </span>
          <span
            className="text-[9px] px-1.5 py-0.5 rounded"
            style={{ color, background: `${color}15`, fontFamily: "'DM Mono', monospace" }}
          >
            {weight}
          </span>
        </div>
        <span
          className="text-[11px] font-bold tabular-nums"
          style={{ color, fontFamily: "'DM Mono', monospace" }}
        >
          {value}
        </span>
      </div>
      <div className="h-1 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ background: color, boxShadow: `0 0 8px ${color}60` }}
        />
      </div>
    </div>
  );
}

// ─── Micro stat tile ──────────────────────────────────────────────────────────

function MicroStat({ icon, label, value, sub, color = "#818cf8" }: {
  icon: React.ReactNode; label: string; value: string | number; sub?: string; color?: string;
}) {
  const t = useTokens();
  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-2"
      style={{ background: t.isDark ? "rgba(255,255,255,0.03)" : t.card, border: `1px solid ${t.border}` }}
    >
      <div className="flex items-center justify-between">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}15`, color }}>
          {icon}
        </div>
        <span
          className="text-[9px] uppercase tracking-[0.1em]"
          style={{ color: t.textFaint, fontFamily: "'DM Mono', monospace" }}
        >
          {label}
        </span>
      </div>
      <div>
        <p
          className="text-[20px] font-bold tabular-nums leading-none"
          style={{ color: "rgba(255,255,255,0.88)", letterSpacing: "-0.03em", fontFamily: "'DM Mono', monospace" }}
        >
          {value}
        </p>
        {sub && (
          <p className="text-[9px] mt-1" style={{ color: t.textFaint, fontFamily: "'DM Mono', monospace" }}>
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Connect form ─────────────────────────────────────────────────────────────

function ConnectForm({ onSubmit }: { onSubmit: (u: string) => void }) {
  const t = useTokens();
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
      className="max-w-md mx-auto"
    >
      <div
        className="rounded-2xl p-8 flex flex-col items-center text-center gap-6 relative overflow-hidden"
        style={{ background: t.isDark ? "rgba(255,255,255,0.03)" : t.card, border: `1px solid ${t.border}` }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% -10%, rgba(99,102,241,0.12), transparent)" }}
        />
        <div
          className="relative w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
          style={{
            background: "rgba(99,102,241,0.1)",
            border: "1px solid rgba(99,102,241,0.25)",
            boxShadow: "0 0 32px rgba(99,102,241,0.15)",
          }}
        >
          <Terminal size={28} style={{ color: "#818cf8" }} />
        </div>
        <div className="relative">
          <h2 className="text-[18px] font-bold mb-2" style={{ color: t.textPrimary, letterSpacing: "-0.02em" }}>
            Analyse Developer Profile
          </h2>
          <p
            className="text-[12px] leading-relaxed"
            style={{ color: t.textFaint, fontFamily: "'DM Mono', monospace", maxWidth: 300 }}
          >
            Enter a GitHub username to compute your developer rank, score breakdown, and intelligence report.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="w-full relative flex flex-col gap-3">
          <div
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
            style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}` }}
          >
            <span style={{ color: t.textFaint, fontFamily: "'DM Mono', monospace", fontSize: 13 }}>@</span>
            <input
              type="text"
              placeholder="github-username"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="flex-1 bg-transparent outline-none text-[13px] placeholder:opacity-30"
              style={{ color: t.textPrimary, fontFamily: "'DM Mono', monospace" }}
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={!value.trim()}
            className="flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-semibold transition-all disabled:opacity-30"
            style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff",
              fontFamily: "'DM Mono', monospace",
              boxShadow: "0 4px 24px rgba(99,102,241,0.3)",
            }}
          >
            Compute Rank <ArrowRight size={14} />
          </button>
        </form>
      </div>
    </motion.div>
  );
}

// ─── Loading state ────────────────────────────────────────────────────────────

function LoadingState({ username }: { username: string }) {
  const t = useTokens();
  const steps = ["Fetching profile data", "Analysing contributions", "Computing consistency", "Calculating rank score"];
  const [step, setStep] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setStep((s) => Math.min(s + 1, steps.length - 1)), 700);
    return () => clearInterval(iv);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-md mx-auto rounded-2xl p-8 flex flex-col items-center gap-5"
      style={{ background: t.isDark ? "rgba(255,255,255,0.03)" : t.card, border: `1px solid ${t.border}` }}
    >
      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(99,102,241,0.1)" }}>
        <Loader2 size={22} className="animate-spin" style={{ color: "#818cf8" }} />
      </div>
      <div className="text-center">
        <p className="text-[13px] font-semibold mb-1" style={{ color: t.textPrimary }}>
          Analysing @{username}
        </p>
        <p className="text-[11px]" style={{ color: t.textFaint, fontFamily: "'DM Mono', monospace" }}>
          {steps[step]}…
        </p>
      </div>
      <div className="flex gap-1">
        {steps.map((_, i) => (
          <div
            key={i}
            className="h-1 rounded-full transition-all duration-300"
            style={{ width: i <= step ? 24 : 8, background: i <= step ? "#6366f1" : "rgba(255,255,255,0.08)" }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// ─── Error state ──────────────────────────────────────────────────────────────

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  const t = useTokens();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-md mx-auto rounded-2xl p-8 flex flex-col items-center gap-4 text-center"
      style={{ background: "rgba(248,113,113,0.05)", border: "1px solid rgba(248,113,113,0.15)" }}
    >
      <AlertCircle size={24} className="text-[#f87171]" />
      <div>
        <p className="text-[13px] font-semibold mb-1" style={{ color: t.textPrimary }}>Analysis Failed</p>
        <p className="text-[11px]" style={{ color: t.textFaint, fontFamily: "'DM Mono', monospace" }}>{message}</p>
      </div>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-[11px]"
        style={{
          background: "rgba(248,113,113,0.1)",
          color: "#f87171",
          border: "1px solid rgba(248,113,113,0.2)",
          fontFamily: "'DM Mono', monospace",
        }}
      >
        <RefreshCw size={11} /> Try again
      </button>
    </motion.div>
  );
}

// ─── Main intel panel ─────────────────────────────────────────────────────────

function IntelPanel({ data, onReset }: { data: GithubData; onReset: () => void }) {
  const t = useTokens();
  const score = computeScore(data);
  const meta = RANK_TIERS[score.tier];
  const nextM = score.nextTier ? RANK_TIERS[score.nextTier] : null;

  const graphEntries: GraphEntry[] = flattenContribWeeks(data.contribWeeks);

  const stagger = (i: number) => ({
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] as const },
  });

  const accountYears = (data.accountAgeDays / 365).toFixed(1);
  const trendPct = data.prev30 === 0
    ? 0
    : Math.round(((data.last30 - data.prev30) / Math.max(data.prev30, 1)) * 100);
  const trendUp = trendPct >= 0;

  return (
    <div className="space-y-5">

      {/* Header strip */}
      <motion.div {...stagger(0)} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={data.avatarUrl}
            alt={data.username}
            className="w-9 h-9 rounded-xl object-cover"
            style={{ border: "1px solid rgba(255,255,255,0.1)" }}
          />
          <div>
            <p
              className="text-[14px] font-semibold leading-tight"
              style={{ color: t.textPrimary, letterSpacing: "-0.01em" }}
            >
              {data.name ?? data.username}
            </p>
            <p className="text-[10px]" style={{ color: t.textFaint, fontFamily: "'DM Mono', monospace" }}>
              @{data.username}
            </p>
          </div>
          <div
            className="ml-1 flex items-center gap-1 px-2.5 py-1 rounded-full"
            style={{ background: `${meta.color}12`, border: `1px solid ${meta.color}30` }}
          >
            <span className="text-[10px] font-bold" style={{ color: meta.color, fontFamily: "'DM Mono', monospace" }}>
              RANK {score.tier}
            </span>
          </div>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] transition-colors"
          style={{
            color: t.textMuted,
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${t.border}`,
            fontFamily: "'DM Mono', monospace",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = t.mutedBtnHov)}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
        >
          <RefreshCw size={10} /> Change
        </button>
      </motion.div>

      {/* Rank card */}
      <motion.div
        {...stagger(1)}
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: t.isDark
            ? "linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))"
            : t.card,
          border: `1px solid ${meta.color}20`,
          boxShadow: `0 0 60px ${meta.glow}`,
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 50% 70% at 10% 50%, ${meta.color}0a, transparent 60%),
                         radial-gradient(ellipse 30% 50% at 90% 20%, rgba(99,102,241,0.06), transparent 60%)`,
          }}
        />
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${meta.color}60, transparent)` }}
        />
        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">

            {/* Ring */}
            <div className="flex flex-col items-center gap-3 shrink-0">
              <ScoreRing score={score.final} tier={score.tier} />
              <div className="text-center">
                <p
                  className="text-[10px] uppercase tracking-[0.12em] mb-0.5"
                  style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'DM Mono', monospace" }}
                >
                  Final Score
                </p>
                <p
                  className="text-[28px] font-black tabular-nums"
                  style={{ color: meta.color, fontFamily: "'DM Mono', monospace", letterSpacing: "-0.04em" }}
                >
                  <Counter to={score.final} duration={1.2} />
                  <span className="text-[14px] opacity-50">/100</span>
                </p>
              </div>
            </div>

            {/* Breakdown */}
            <div className="flex-1 w-full min-w-0">
              <p
                className="text-[10px] uppercase tracking-[0.1em] mb-4"
                style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'DM Mono', monospace" }}
              >
                Score Breakdown
              </p>
              <div className="space-y-3">
                <ScoreBar label="Volume"          value={score.volume}      weight="30%" color="#60A5FA" />
                <ScoreBar label="Consistency"     value={score.consistency} weight="25%" color="#A78BFA" />
                <ScoreBar label="Recent Activity" value={score.activity}    weight="20%" color="#34D399" />
                <ScoreBar label="Stars"           value={score.stars}       weight="15%" color="#FCD34D" />
                <ScoreBar label="Community"       value={score.community}   weight="10%" color="#F472B6" />
              </div>

              {score.nextTier && nextM ? (
                <div className="mt-5 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-[10px]"
                      style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'DM Mono', monospace" }}
                    >
                      Progress to Rank {score.nextTier}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                        style={{ color: nextM.color, background: `${nextM.color}15`, fontFamily: "'DM Mono', monospace" }}
                      >
                        {score.nextTier} — {nextM.desc}
                      </span>
                      <span
                        className="text-[10px] font-bold tabular-nums"
                        style={{ color: nextM.color, fontFamily: "'DM Mono', monospace" }}
                      >
                        {score.pctToNext}%
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${score.pctToNext}%` }}
                      transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        background: `linear-gradient(90deg, ${meta.color}, ${nextM.color})`,
                        boxShadow: `0 0 8px ${nextM.color}60`,
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div
                  className="mt-5 pt-4 flex items-center gap-2"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <Trophy size={13} style={{ color: "#FCD34D" }} />
                  <span
                    className="text-[11px]"
                    style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'DM Mono', monospace" }}
                  >
                    Maximum rank achieved
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Rank ladder */}
      <motion.div {...stagger(2)} className="flex items-center justify-center gap-1 flex-wrap">
        {TIER_ORDER.slice().reverse().map((tier) => {
          const m = RANK_TIERS[tier];
          const active = tier === score.tier;
          return (
            <div
              key={tier}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all"
              style={{
                background: active ? `${m.color}12` : "rgba(255,255,255,0.02)",
                border: `1px solid ${active ? `${m.color}30` : "rgba(255,255,255,0.05)"}`,
                opacity: active ? 1 : 0.4,
              }}
            >
              <span className="text-[14px] font-black" style={{ color: m.color, fontFamily: "'DM Mono', monospace" }}>
                {tier}
              </span>
              <span
                className="text-[8px] uppercase tracking-wider"
                style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'DM Mono', monospace" }}
              >
                {m.desc}
              </span>
              <span className="text-[8px]" style={{ color: "rgba(255,255,255,0.2)", fontFamily: "'DM Mono', monospace" }}>
                {m.min}+
              </span>
            </div>
          );
        })}
      </motion.div>

      {/* Contribution graph */}
      {graphEntries.length > 0 && (
        <motion.div
          {...stagger(3)}
          className="rounded-2xl overflow-hidden"
          style={{ background: t.isDark ? "rgba(255,255,255,0.025)" : t.card, border: `1px solid ${t.border}` }}
        >
          <div
            className="px-5 py-4 flex items-center justify-between"
            style={{ borderBottom: `1px solid ${t.border}` }}
          >
            <div className="flex items-center gap-2">
              <Activity size={13} style={{ color: "#6366f1" }} />
              <span className="log text-[12px] font-medium" style={{ color: t.textPrimary }}>
                Contribution Graph
              </span>
              <span
                className="text-[9px] px-1.5 py-0.5 rounded"
                style={{
                  background: "rgba(99,102,241,0.1)",
                  color: "#818cf8",
                  fontFamily: "'DM Mono', monospace",
                  border: "1px solid rgba(99,102,241,0.2)",
                }}
              >
                Last 52 weeks
              </span>
            </div>
            <span
              className="text-[11px] font-semibold tabular-nums"
              style={{ color: "#6366f1", fontFamily: "'DM Mono', monospace" }}
            >
              {data.totalContribs.toLocaleString()} contributions
            </span>
          </div>
          <div className="px-5 py-4">
            <ContributionGraph
              data={graphEntries}
              activityLabel="contributions"
            />
          </div>
        </motion.div>
      )}

      {/* Intelligence report */}
      <motion.div {...stagger(4)}>
        <p
          className="text-[10px] uppercase tracking-[0.1em] mb-3"
          style={{ color: t.textFaint, fontFamily: "'DM Mono', monospace" }}
        >
          Intelligence Report
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <MicroStat icon={<Flame size={13} />}         label="Current Streak"  value={`${data.currentStreak}d`}                sub="active days"        color="#f97316" />
          <MicroStat icon={<Trophy size={13} />}        label="Longest Streak"  value={`${data.longestStreak}d`}                sub="personal best"      color="#FCD34D" />
          <MicroStat icon={<Star size={13} />}          label="Total Stars"     value={data.totalStars.toLocaleString()}        sub="across repos"       color="#FCD34D" />
          <MicroStat icon={<GitPullRequest size={13} />} label="Pull Requests"  value={data.pullRequests}                       sub="last 100 events"    color="#A78BFA" />
          <MicroStat icon={<AlertCircle size={13} />}   label="Issues"          value={data.issues}                             sub="last 100 events"    color="#60A5FA" />
          <MicroStat icon={<Users size={13} />}         label="Followers"       value={data.followers.toLocaleString()}         sub={`following ${data.following}`} color="#34D399" />
          <MicroStat icon={<Activity size={13} />}      label="Active Weeks"    value={`${data.activeWeeks}/52`}                sub="this year"          color="#818cf8" />
          <MicroStat icon={<TrendingUp size={13} />}    label="30d Trend"       value={`${trendUp ? "+" : ""}${trendPct}%`}    sub="vs prev 30 days"    color={trendUp ? "#34D399" : "#f87171"} />
          <MicroStat icon={<GitCommit size={13} />}     label="Yearly Contribs" value={data.totalContribs.toLocaleString()}    sub="last 365 days"      color="#6366f1" />
          <MicroStat icon={<CalendarDays size={13} />}  label="Peak Day"        value={(data.peakDay ?? "—").slice(0, 3)}      sub="most active"        color="#f97316" />
          <MicroStat icon={<Code2 size={13} />}         label="Public Repos"    value={data.publicRepos}                        sub="own repos"          color="#818cf8" />
          <MicroStat icon={<Zap size={13} />}           label="Account Age"     value={`${accountYears}y`}                      sub="on GitHub"          color="#94a3b8" />
        </div>
      </motion.div>

      {/* Language profile */}
      {data.topLanguages.length > 0 && (
        <motion.div {...stagger(5)}>
          <p
            className="text-[10px] uppercase tracking-[0.1em] mb-3"
            style={{ color: t.textFaint, fontFamily: "'DM Mono', monospace" }}
          >
            Language Profile
          </p>
          <div
            className="rounded-2xl p-5"
            style={{ background: t.isDark ? "rgba(255,255,255,0.025)" : t.card, border: `1px solid ${t.border}` }}
          >
            <div className="flex rounded-lg overflow-hidden h-2.5 mb-4" style={{ gap: 2 }}>
              {data.topLanguages.map((lang) => (
                <motion.div
                  key={lang.name}
                  initial={{ width: 0 }}
                  animate={{ width: `${lang.percent}%` }}
                  transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  style={{ background: lang.color, height: "100%", borderRadius: 2 }}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {data.topLanguages.map((lang) => (
                <div key={lang.name} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: lang.color }} />
                  <span className="text-[11px] font-medium" style={{ color: t.textSecondary }}>{lang.name}</span>
                  <span className="text-[10px]" style={{ color: t.textFaint, fontFamily: "'DM Mono', monospace" }}>
                    {lang.percent}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Top repos */}
      {data.pinnedRepos.length > 0 && (
        <motion.div {...stagger(6)}>
          <p
            className="text-[10px] uppercase tracking-widest mb-3"
            style={{ color: t.textFaint, fontFamily: "'DM Mono', monospace" }}
          >
            Top Repositories
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pb-4">
            {data.pinnedRepos.map((repo) => (
              <div
                key={repo.name}
                className="rounded-2xl p-4 flex flex-col gap-2"
                style={{ background: t.isDark ? "rgba(255,255,255,0.025)" : t.card, border: `1px solid ${t.border}` }}
              >
                <div className="flex items-start justify-between gap-2">
                  <p
                    className="text-[12px] font-semibold truncate"
                    style={{ color: t.textPrimary, letterSpacing: "-0.01em" }}
                  >
                    {repo.name}
                  </p>
                  <div className="flex items-center gap-1 shrink-0">
                    <Star size={10} style={{ color: "#FCD34D" }} />
                    <span
                      className="text-[10px] font-bold tabular-nums"
                      style={{ color: "#FCD34D", fontFamily: "'DM Mono', monospace" }}
                    >
                      {repo.stars}
                    </span>
                  </div>
                </div>
                {repo.desc && (
                  <p className="text-[10px] leading-relaxed line-clamp-2" style={{ color: t.textFaint }}>
                    {repo.desc}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-auto pt-1">
                  <span className="text-[9px] font-medium" style={{ color: t.textFaint, fontFamily: "'DM Mono', monospace" }}>
                    {repo.lang}
                  </span>
                  <span
                    className="flex items-center gap-1 text-[9px]"
                    style={{ color: t.textFaint, fontFamily: "'DM Mono', monospace" }}
                  >
                    <GitCommit size={9} /> {repo.forks} forks
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DevDashboard() {
  const t = useTokens();

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
    } catch (err: any) {
      const message: string =
        err?.response?.data?.message ?? err?.message ?? "Unknown error";
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
    <div
      className="min-h-screen p-4 md:p-6 lg:p-8 transition-colors duration-300"
      style={{ background: t.page, fontFamily: "'DM Sans', sans-serif" }}
    >
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-3 mb-8"
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}
        >
          <Terminal size={15} style={{ color: "#818cf8" }} />
        </div>
        <div>
          <h1
            className="text-[18px] font-bold leading-tight"
            style={{ color: t.textPrimary, letterSpacing: "-0.02em" }}
          >
            Dev Intelligence
          </h1>
          <p className="text-[10px]" style={{ color: t.textFaint, fontFamily: "'DM Mono', monospace" }}>
            GitHub rank · scoring · analytics
          </p>
        </div>
        <div
          className="ml-auto text-[9px] px-2.5 py-1 rounded-full uppercase tracking-widest"
          style={{
            background: "rgba(99,102,241,0.08)",
            color: "#818cf8",
            border: "1px solid rgba(99,102,241,0.15)",
            fontFamily: "'DM Mono', monospace",
          }}
        >
          Beta
        </div>
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
                onClick={handleReset}
                className="text-[11px]"
                style={{ color: t.textFaint, fontFamily: "'DM Mono', monospace" }}
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