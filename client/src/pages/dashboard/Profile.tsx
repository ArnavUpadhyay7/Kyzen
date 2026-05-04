import { useState } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  Flame,
  Trophy,
  Star,
  Shield,
  Target,
  Edit3,
  MapPin,
  Link2,
  Calendar,
  TrendingUp,
  Award,
  Swords,
  Clock,
  CheckCircle2,
  Lock,
} from "lucide-react";

/* ─── Types ─── */
type Tab = "overview" | "quests" | "achievements";

type Badge = {
  id: number;
  icon: React.ReactNode;
  label: string;
  desc: string;
  earned: boolean;
};

type Achievement = {
  id: number;
  title: string;
  desc: string;
  xp: number;
  icon: React.ReactNode;
  date: string;
  earned: boolean;
};

type RecentQuest = {
  id: number;
  title: string;
  category: string;
  xp: number;
  status: "completed" | "active" | "failed";
  date: string;
};

/* ─── Data ─── */
const BADGES: Badge[] = [
  { id: 1, icon: <Flame size={16} />, label: "Streak Master", desc: "30-day streak", earned: true },
  { id: 2, icon: <Trophy size={16} />, label: "Top 1%", desc: "Season II rank", earned: true },
  { id: 3, icon: <Shield size={16} />, label: "Defender", desc: "Protected rank 7d", earned: true },
  { id: 4, icon: <Star size={16} />, label: "Legend", desc: "1000 quests done", earned: true },
  { id: 5, icon: <Zap size={16} />, label: "Speed Run", desc: "5 quests in 1 day", earned: false },
  { id: 6, icon: <Target size={16} />, label: "Precision", desc: "100% accuracy", earned: false },
];

const ACHIEVEMENTS: Achievement[] = [
  { id: 1, title: "First Blood", desc: "Complete your very first quest", xp: 100, icon: <Swords size={14} />, date: "Jan 2, 2025", earned: true },
  { id: 2, title: "On Fire", desc: "Maintain a 14-day streak", xp: 350, icon: <Flame size={14} />, date: "Feb 14, 2025", earned: true },
  { id: 3, title: "Century Club", desc: "Complete 100 quests total", xp: 1000, icon: <CheckCircle2 size={14} />, date: "Mar 5, 2025", earned: true },
  { id: 4, title: "Ranked Up", desc: "Reach Global Top 500", xp: 750, icon: <TrendingUp size={14} />, date: "Mar 20, 2025", earned: true },
  { id: 5, title: "Elite Guard", desc: "Hold rank for 30 days", xp: 500, icon: <Shield size={14} />, date: "—", earned: false },
  { id: 6, title: "Mythic", desc: "Reach level 20", xp: 2000, icon: <Star size={14} />, date: "—", earned: false },
];

const RECENT_QUESTS: RecentQuest[] = [
  { id: 1, title: "Redesign onboarding flow", category: "Design", xp: 280, status: "completed", date: "Today" },
  { id: 2, title: "API integration sprint", category: "Development", xp: 420, status: "completed", date: "Yesterday" },
  { id: 3, title: "Q2 strategy deck", category: "Leadership", xp: 150, status: "active", date: "Due Fri" },
  { id: 4, title: "Competitor analysis", category: "Research", xp: 200, status: "completed", date: "Apr 28" },
  { id: 5, title: "Mobile nav refactor", category: "Development", xp: 190, status: "failed", date: "Apr 25" },
  { id: 6, title: "Brand guidelines v3", category: "Design", xp: 310, status: "completed", date: "Apr 22" },
];

const SKILL_DATA = [
  { label: "Development", pct: 82, xp: 4100 },
  { label: "Design", pct: 64, xp: 3200 },
  { label: "Leadership", pct: 47, xp: 2350 },
  { label: "Research", pct: 91, xp: 4550 },
  { label: "Communication", pct: 73, xp: 3650 },
];

const HEATMAP_WEEKS = 18;
const HEATMAP_DAYS = 7;
const heatmapData = Array.from({ length: HEATMAP_WEEKS * HEATMAP_DAYS }, (_, i) => {
  const rand = Math.random();
  if (i > HEATMAP_WEEKS * HEATMAP_DAYS - 10) return Math.floor(rand * 3);
  return rand > 0.65 ? Math.floor(rand * 4) + 1 : 0;
});

const STATUS_META = {
  completed: { label: "Completed", color: "#6B7280", bg: "rgba(107,114,128,0.08)", border: "rgba(107,114,128,0.15)", dot: "#10B981" },
  active:    { label: "Active",    color: "#7C3AED", bg: "rgba(124,58,237,0.08)", border: "rgba(124,58,237,0.2)", dot: "#7C3AED" },
  failed:    { label: "Failed",    color: "#6B7280", bg: "rgba(107,114,128,0.06)", border: "rgba(107,114,128,0.12)", dot: "#EF4444" },
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] as const },
});

/* ─── Sub-components ─── */

function StatCard({ value, label, sub }: { value: string; label: string; sub?: string }) {
  return (
    <div
      className="flex flex-col px-5 py-4 rounded-xl"
      style={{
        background: "#111115",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <span
        className="text-2xl font-bold text-white mb-0.5"
        style={{ fontFamily: "'DM Mono', monospace", letterSpacing: "-0.02em" }}
      >
        {value}
      </span>
      <span className="text-xs text-slate-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {label}
      </span>
      {sub && (
        <span className="text-[10px] mt-1" style={{ color: "#7C3AED", fontFamily: "'DM Sans', sans-serif" }}>
          {sub}
        </span>
      )}
    </div>
  );
}

function HeatMap() {
  const intensities = [
    "rgba(255,255,255,0.04)",
    "rgba(124,58,237,0.18)",
    "rgba(124,58,237,0.35)",
    "rgba(124,58,237,0.55)",
    "rgba(124,58,237,0.75)",
  ];
  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${HEATMAP_WEEKS}, 1fr)`,
          gap: 3,
        }}
      >
        {Array.from({ length: HEATMAP_WEEKS }).map((_, w) => (
          <div key={w} className="flex flex-col gap-[3px]">
            {Array.from({ length: HEATMAP_DAYS }).map((_, d) => {
              const val = heatmapData[w * HEATMAP_DAYS + d];
              return (
                <div
                  key={d}
                  className="rounded-[2px]"
                  style={{ width: "100%", aspectRatio: "1", background: intensities[val] }}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 mt-3 justify-end">
        <span className="text-[10px] text-slate-600" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Less
        </span>
        {intensities.map((c, i) => (
          <div key={i} className="w-2.5 h-2.5 rounded-[2px]" style={{ background: c }} />
        ))}
        <span className="text-[10px] text-slate-600" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          More
        </span>
      </div>
    </div>
  );
}

function SkillBar({ pct }: { pct: number }) {
  return (
    <div
      className="h-[3px] w-full rounded-full"
      style={{ background: "rgba(255,255,255,0.06)" }}
    >
      <motion.div
        className="h-full rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{ background: "#7C3AED" }}
      />
    </div>
  );
}

/* ─── Tabs ─── */

function OverviewTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Activity Heatmap */}
      <motion.div
        {...fadeUp(0.05)}
        className="lg:col-span-2 rounded-xl p-5"
        style={{ background: "#111115", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm font-medium text-slate-200" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Activity
          </p>
          <div className="flex items-center gap-1.5">
            <Calendar size={11} className="text-slate-600" />
            <span className="text-xs text-slate-600" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Last 18 weeks
            </span>
          </div>
        </div>
        <HeatMap />
      </motion.div>

      {/* Skill Tree */}
      <motion.div
        {...fadeUp(0.08)}
        className="rounded-xl p-5"
        style={{ background: "#111115", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm font-medium text-slate-200" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Skills
          </p>
          <Target size={12} className="text-slate-600" />
        </div>
        <div className="flex flex-col gap-4">
          {SKILL_DATA.map((s) => (
            <div key={s.label}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {s.label}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-600" style={{ fontFamily: "'DM Mono', monospace" }}>
                    {s.xp.toLocaleString()} XP
                  </span>
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "#7C3AED", fontFamily: "'DM Mono', monospace", minWidth: 24, textAlign: "right" }}
                  >
                    {s.pct}
                  </span>
                </div>
              </div>
              <SkillBar pct={s.pct} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Badges */}
      <motion.div
        {...fadeUp(0.12)}
        className="lg:col-span-3 rounded-xl p-5"
        style={{ background: "#111115", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <p className="text-sm font-medium text-slate-200 mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Badges
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {BADGES.map((b) => (
            <div
              key={b.id}
              className="relative flex flex-col items-center gap-2.5 p-4 rounded-xl"
              style={{
                background: b.earned ? "rgba(124,58,237,0.06)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${b.earned ? "rgba(124,58,237,0.18)" : "rgba(255,255,255,0.04)"}`,
                opacity: b.earned ? 1 : 0.4,
              }}
            >
              {!b.earned && (
                <Lock size={9} className="absolute top-2.5 right-2.5 text-slate-700" />
              )}
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{
                  background: b.earned ? "rgba(124,58,237,0.12)" : "rgba(255,255,255,0.04)",
                  color: b.earned ? "#7C3AED" : "#4B5563",
                }}
              >
                {b.icon}
              </div>
              <div className="text-center">
                <p className="text-[11px] font-medium text-slate-300" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {b.label}
                </p>
                <p className="text-[10px] text-slate-600 mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {b.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function QuestsTab() {
  return (
    <motion.div
      {...fadeUp(0.05)}
      className="rounded-xl"
      style={{ background: "#111115", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        <p className="text-sm font-medium text-slate-200" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Quest History
        </p>
        <span className="text-xs text-slate-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          {RECENT_QUESTS.filter((q) => q.status === "completed").length} completed
        </span>
      </div>
      <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
        {RECENT_QUESTS.map((q, i) => {
          const meta = STATUS_META[q.status];
          return (
            <motion.div
              key={q.id}
              {...fadeUp(0.03 + i * 0.03)}
              className="flex items-center gap-4 px-5 py-4"
              style={{ borderColor: "rgba(255,255,255,0.04)" }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "rgba(255,255,255,0.04)", color: "#6B7280" }}
              >
                <Swords size={13} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {q.title}
                </p>
                <p className="text-[11px] text-slate-600 mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {q.category}
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-600" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <Clock size={10} />
                {q.date}
              </div>
              <div
                className="text-[11px] font-medium"
                style={{ color: "#7C3AED", fontFamily: "'DM Mono', monospace", minWidth: 48, textAlign: "right" }}
              >
                +{q.xp}
              </div>
              <div className="flex items-center gap-1.5" style={{ minWidth: 80 }}>
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: meta.dot }} />
                <span
                  className="text-[11px]"
                  style={{ color: meta.color, fontFamily: "'DM Sans', sans-serif" }}
                >
                  {meta.label}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function AchievementsTab() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
      {ACHIEVEMENTS.map((a, i) => (
        <motion.div
          key={a.id}
          {...fadeUp(0.03 + i * 0.04)}
          className="relative rounded-xl p-4"
          style={{
            background: "#111115",
            border: `1px solid ${a.earned ? "rgba(124,58,237,0.15)" : "rgba(255,255,255,0.04)"}`,
            opacity: a.earned ? 1 : 0.45,
          }}
        >
          {!a.earned && (
            <Lock size={11} className="absolute top-3.5 right-3.5 text-slate-700" />
          )}
          <div className="flex items-start gap-3 mb-4">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{
                background: a.earned ? "rgba(124,58,237,0.1)" : "rgba(255,255,255,0.04)",
                color: a.earned ? "#7C3AED" : "#4B5563",
              }}
            >
              {a.icon}
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <p className="text-sm font-medium text-slate-200" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {a.title}
              </p>
              <p className="text-[11px] text-slate-600 mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {a.desc}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <span
              className="text-xs font-medium"
              style={{ color: a.earned ? "#7C3AED" : "#4B5563", fontFamily: "'DM Mono', monospace" }}
            >
              +{a.xp.toLocaleString()} XP
            </span>
            {a.earned ? (
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={10} style={{ color: "#10B981" }} />
                <span className="text-[10px] text-slate-600" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {a.date}
                </span>
              </div>
            ) : (
              <span className="text-[10px] text-slate-700" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Locked
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Level ring ─── */
function LevelRing({ level, pct }: { level: number; pct: number }) {
  const r = 32;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div className="relative w-20 h-20 shrink-0">
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
        <circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke="#7C3AED"
          strokeWidth="4"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transform: "rotate(-90deg)", transformOrigin: "40px 40px" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-white" style={{ fontFamily: "'DM Mono', monospace" }}>
          {level}
        </span>
        <span className="text-[8px] text-slate-600 font-medium tracking-widest" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          LVL
        </span>
      </div>
    </div>
  );
}

/* ─── Main Profile Page ─── */
export default function Profile() {
  const [tab, setTab] = useState<Tab>("overview");

  const TABS: { key: Tab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "quests", label: "Quests" },
    { key: "achievements", label: "Achievements" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap');
      `}</style>

      <div
        className="min-h-full p-4 sm:p-6"
        style={{ background: "#0B0B0F", fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* ── Profile Header ── */}
        <motion.div
          {...fadeUp(0)}
          className="rounded-xl overflow-hidden mb-4"
          style={{ background: "#111115", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          {/* Banner — flat, minimal */}
          <div
            className="relative h-16 sm:h-20"
            style={{ background: "rgba(124,58,237,0.06)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}
          >
            <button
              className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-opacity hover:opacity-70"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#9CA3AF",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <Edit3 size={10} /> Edit
            </button>
          </div>

          <div className="px-5 sm:px-6 pb-5">
            {/* Avatar + name row */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-8 sm:-mt-10 mb-5">
              <div className="relative shrink-0 w-fit">
                <LevelRing level={7} pct={76} />
                <img
                  src="https://i.pravatar.cc/100?u=kyzen"
                  alt="avatar"
                  className="absolute inset-[10px] rounded-full object-cover"
                  style={{ border: "2px solid #111115" }}
                />
                <span
                  className="absolute bottom-1 right-1 w-3 h-3 rounded-full"
                  style={{ background: "#10B981", border: "2px solid #111115" }}
                />
              </div>

              <div className="flex-1 min-w-0 pb-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1
                    className="text-xl sm:text-2xl font-semibold text-white"
                    style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.02em" }}
                  >
                    Ethan Reynolds
                  </h1>
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded"
                    style={{
                      background: "rgba(124,58,237,0.12)",
                      border: "1px solid rgba(124,58,237,0.2)",
                      color: "#7C3AED",
                      fontFamily: "'DM Sans', sans-serif",
                      letterSpacing: "0.06em",
                    }}
                  >
                    PRO
                  </span>
                </div>

                <p className="text-sm text-slate-500 mb-3 max-w-md" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Product designer & developer chasing the leaderboard one quest at a time.
                </p>

                <div className="flex flex-wrap gap-4 text-[11px] text-slate-600" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={10} />
                    San Francisco, CA
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={10} />
                    Joined Jan 2025
                  </span>
                  <a href="#" className="flex items-center gap-1.5 hover:text-slate-400 transition-colors">
                    <Link2 size={10} />
                    kyzen.gg/ethan
                  </a>
                </div>
              </div>
            </div>

            {/* XP progress */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[11px] text-slate-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Level 7 → 8
                </span>
                <span className="text-[11px] text-slate-400" style={{ fontFamily: "'DM Mono', monospace" }}>
                  3,800 / 5,000 XP
                </span>
              </div>
              <div
                className="h-[3px] w-full rounded-full"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "76%" }}
                  transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  style={{ background: "#7C3AED" }}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <StatCard value="12,847" label="Total XP" sub="↑ 340 this week" />
              <StatCard value="14" label="Current Streak" sub="Best: 21 days" />
              <StatCard value="#284" label="Global Rank" sub="Top 2% this season" />
              <StatCard value="97" label="Quests Done" />
            </div>
          </div>
        </motion.div>

        {/* ── Tabs ── */}
        <motion.div
          {...fadeUp(0.08)}
          className="flex gap-0 mb-4 border-b"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="relative px-4 py-2.5 text-sm font-medium transition-colors duration-150"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: tab === t.key ? "#E2E8F0" : "#6B7280",
                background: "transparent",
                border: "none",
              }}
            >
              {t.label}
              {tab === t.key && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full"
                  style={{ background: "#7C3AED" }}
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* ── Tab content ── */}
        {tab === "overview" && <OverviewTab />}
        {tab === "quests" && <QuestsTab />}
        {tab === "achievements" && <AchievementsTab />}
      </div>
    </>
  );
}