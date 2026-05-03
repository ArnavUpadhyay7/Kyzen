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
  color: string;
  earned: boolean;
};

type Achievement = {
  id: number;
  title: string;
  desc: string;
  xp: number;
  icon: React.ReactNode;
  color: string;
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
  { id: 1, icon: <Flame size={18} />, label: "Streak Master", desc: "30-day streak", color: "#f97316", earned: true },
  { id: 2, icon: <Trophy size={18} />, label: "Top 1%", desc: "Season II rank", color: "#facc15", earned: true },
  { id: 3, icon: <Shield size={18} />, label: "Defender", desc: "Protected rank 7d", color: "#38bdf8", earned: true },
  { id: 4, icon: <Star size={18} />, label: "Legend", desc: "1000 quests done", color: "#a855f7", earned: true },
  { id: 5, icon: <Zap size={18} />, label: "Speed Run", desc: "5 quests in 1 day", color: "#34d399", earned: false },
  { id: 6, icon: <Target size={18} />, label: "Precision", desc: "100% accuracy", color: "#f472b6", earned: false },
];

const ACHIEVEMENTS: Achievement[] = [
  { id: 1, title: "First Blood", desc: "Complete your very first quest", xp: 100, icon: <Swords size={15} />, color: "#a855f7", date: "Jan 2, 2025", earned: true },
  { id: 2, title: "On Fire", desc: "Maintain a 14-day streak", xp: 350, icon: <Flame size={15} />, color: "#f97316", date: "Feb 14, 2025", earned: true },
  { id: 3, title: "Century Club", desc: "Complete 100 quests total", xp: 1000, icon: <CheckCircle2 size={15} />, color: "#34d399", date: "Mar 5, 2025", earned: true },
  { id: 4, title: "Ranked Up", desc: "Reach Global Top 500", xp: 750, icon: <TrendingUp size={15} />, color: "#facc15", date: "Mar 20, 2025", earned: true },
  { id: 5, title: "Elite Guard", desc: "Hold rank for 30 days", xp: 500, icon: <Shield size={15} />, color: "#38bdf8", date: "—", earned: false },
  { id: 6, title: "Mythic", desc: "Reach level 20", xp: 2000, icon: <Star size={15} />, color: "#f472b6", date: "—", earned: false },
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
  { label: "Development", pct: 82, color: "#7c3aed", xp: 4100 },
  { label: "Design", pct: 64, color: "#a855f7", xp: 3200 },
  { label: "Leadership", pct: 47, color: "#8b5cf6", xp: 2350 },
  { label: "Research", pct: 91, color: "#6d28d9", xp: 4550 },
  { label: "Communication", pct: 73, color: "#c084fc", xp: 3650 },
];

const HEATMAP_WEEKS = 18;
const HEATMAP_DAYS = 7;
const heatmapData = Array.from({ length: HEATMAP_WEEKS * HEATMAP_DAYS }, (_, i) => {
  const rand = Math.random();
  if (i > HEATMAP_WEEKS * HEATMAP_DAYS - 10) return Math.floor(rand * 3);
  return rand > 0.65 ? Math.floor(rand * 4) + 1 : 0;
});

const STATUS_META = {
  completed: { label: "Completed", color: "#34d399", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.25)" },
  active:    { label: "Active",    color: "#a78bfa", bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.25)" },
  failed:    { label: "Failed",    color: "#f87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.25)" },
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] as const },
});

/* ─── Sub-components ─── */

function StatPill({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div className="flex flex-col items-center px-4 sm:px-6 py-3 rounded-2xl"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,92,246,0.12)" }}>
      <span className="text-xl sm:text-2xl font-black" style={{ fontFamily: "'Barlow', sans-serif", color }}>{value}</span>
      <span className="text-[10px] sm:text-xs text-slate-500 mt-0.5 whitespace-nowrap" style={{ fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
    </div>
  );
}

function HeatMap() {
  const intensity = ["rgba(109,40,217,0.08)", "rgba(109,40,217,0.25)", "rgba(139,92,246,0.5)", "rgba(167,139,250,0.75)", "#a78bfa"];
  return (
    <div>
      <div className="flex gap-0.5 flex-wrap" style={{ display: "grid", gridTemplateColumns: `repeat(${HEATMAP_WEEKS}, 1fr)`, gap: 3 }}>
        {Array.from({ length: HEATMAP_WEEKS }).map((_, w) => (
          <div key={w} className="flex flex-col gap-[3px]">
            {Array.from({ length: HEATMAP_DAYS }).map((_, d) => {
              const val = heatmapData[w * HEATMAP_DAYS + d];
              return (
                <div key={d} className="rounded-[2px]"
                  style={{ width: "100%", aspectRatio: "1", background: intensity[val] }} />
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 mt-2 justify-end">
        <span className="text-[10px] text-slate-600" style={{ fontFamily: "'DM Sans', sans-serif" }}>Less</span>
        {intensity.map((c, i) => (
          <div key={i} className="w-2.5 h-2.5 rounded-[2px]" style={{ background: c }} />
        ))}
        <span className="text-[10px] text-slate-600" style={{ fontFamily: "'DM Sans', sans-serif" }}>More</span>
      </div>
    </div>
  );
}

function XPBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="h-1.5 w-full rounded-full" style={{ background: "rgba(109,40,217,0.12)" }}>
      <motion.div className="h-full rounded-full"
        initial={{ width: 0 }} animate={{ width: `${pct}%` }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        style={{ background: `linear-gradient(90deg, ${color}99, ${color})`, boxShadow: `0 0 6px ${color}55` }} />
    </div>
  );
}

/* ─── Tabs ─── */

function OverviewTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Activity Heatmap */}
      <motion.div {...fadeUp(0.1)} className="lg:col-span-2 rounded-2xl p-4 sm:p-5"
        style={{ background: "linear-gradient(135deg, rgba(15,10,40,0.95), rgba(10,6,28,0.98))", border: "1px solid rgba(139,92,246,0.15)" }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-slate-100" style={{ fontFamily: "'DM Sans', sans-serif" }}>Activity</p>
          <div className="flex items-center gap-1.5">
            <Calendar size={12} style={{ color: "rgba(139,92,246,0.5)" }} />
            <span className="text-xs text-slate-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>Last 18 weeks</span>
          </div>
        </div>
        <HeatMap />
      </motion.div>

      {/* Skill Tree */}
      <motion.div {...fadeUp(0.15)} className="rounded-2xl p-4 sm:p-5"
        style={{ background: "linear-gradient(135deg, rgba(15,10,40,0.95), rgba(10,6,28,0.98))", border: "1px solid rgba(139,92,246,0.15)" }}>
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm font-semibold text-slate-100" style={{ fontFamily: "'DM Sans', sans-serif" }}>Skill Tree</p>
          <Target size={13} style={{ color: "rgba(139,92,246,0.5)" }} />
        </div>
        <div className="flex flex-col gap-4">
          {SKILL_DATA.map((s) => (
            <div key={s.label}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>{s.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-600" style={{ fontFamily: "'DM Sans', sans-serif" }}>{s.xp.toLocaleString()} XP</span>
                  <span className="text-xs font-bold" style={{ color: s.color, fontFamily: "'Barlow', sans-serif" }}>{s.pct}</span>
                </div>
              </div>
              <XPBar pct={s.pct} color={s.color} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Badges */}
      <motion.div {...fadeUp(0.2)} className="lg:col-span-3 rounded-2xl p-4 sm:p-5"
        style={{ background: "linear-gradient(135deg, rgba(15,10,40,0.95), rgba(10,6,28,0.98))", border: "1px solid rgba(139,92,246,0.15)" }}>
        <p className="text-sm font-semibold text-slate-100 mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>Badges</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {BADGES.map((b) => (
            <div key={b.id} className={`relative flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 ${b.earned ? "hover:border-violet-500/30" : "opacity-40"}`}
              style={{ background: b.earned ? `${b.color}0d` : "rgba(255,255,255,0.02)", border: `1px solid ${b.earned ? b.color + "30" : "rgba(139,92,246,0.08)"}` }}>
              {!b.earned && <Lock size={10} className="absolute top-2 right-2 text-slate-600" />}
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: b.earned ? `${b.color}20` : "rgba(255,255,255,0.04)", color: b.earned ? b.color : "#4b5563", border: `1px solid ${b.earned ? b.color + "40" : "transparent"}` }}>
                {b.icon}
              </div>
              <div className="text-center">
                <p className="text-[11px] font-semibold text-slate-200" style={{ fontFamily: "'DM Sans', sans-serif" }}>{b.label}</p>
                <p className="text-[10px] text-slate-600" style={{ fontFamily: "'DM Sans', sans-serif" }}>{b.desc}</p>
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
    <motion.div {...fadeUp(0.05)} className="rounded-2xl p-4 sm:p-5"
      style={{ background: "linear-gradient(135deg, rgba(15,10,40,0.95), rgba(10,6,28,0.98))", border: "1px solid rgba(139,92,246,0.15)" }}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-slate-100" style={{ fontFamily: "'DM Sans', sans-serif" }}>Quest History</p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {RECENT_QUESTS.filter(q => q.status === "completed").length} completed
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {RECENT_QUESTS.map((q, i) => {
          const meta = STATUS_META[q.status];
          return (
            <motion.div key={q.id} {...fadeUp(0.05 + i * 0.04)}
              className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl transition-all duration-200 hover:border-violet-500/25"
              style={{ background: "rgba(10,6,28,0.6)", border: "1px solid rgba(139,92,246,0.08)" }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(109,40,217,0.15)", border: "1px solid rgba(139,92,246,0.2)" }}>
                <Swords size={15} style={{ color: "#a78bfa" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-100 truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>{q.title}</p>
                <p className="text-[11px] text-slate-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>{q.category}</p>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-600" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <Clock size={10} />{q.date}
              </div>
              <div className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: "#a78bfa", fontFamily: "'DM Sans', sans-serif" }}>
                <Zap size={11} />+{q.xp}
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded-lg shrink-0"
                style={{ background: meta.bg, border: `1px solid ${meta.border}`, color: meta.color, fontFamily: "'DM Sans', sans-serif" }}>
                {meta.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function AchievementsTab() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
      {ACHIEVEMENTS.map((a, i) => (
        <motion.div key={a.id} {...fadeUp(0.05 + i * 0.05)}
          className={`relative rounded-2xl p-4 sm:p-5 transition-all duration-200 ${a.earned ? "hover:border-violet-500/30" : "opacity-50"}`}
          style={{ background: a.earned ? `linear-gradient(135deg, ${a.color}08, rgba(10,6,28,0.98))` : "rgba(10,6,28,0.6)", border: `1px solid ${a.earned ? a.color + "25" : "rgba(139,92,246,0.08)"}` }}>
          {!a.earned && (
            <div className="absolute top-3 right-3">
              <Lock size={12} className="text-slate-600" />
            </div>
          )}
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: a.earned ? `${a.color}20` : "rgba(255,255,255,0.04)", color: a.earned ? a.color : "#4b5563", border: `1px solid ${a.earned ? a.color + "40" : "transparent"}`, boxShadow: a.earned ? `0 0 12px ${a.color}30` : "none" }}>
              {a.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-100" style={{ fontFamily: "'DM Sans', sans-serif" }}>{a.title}</p>
              <p className="text-[11px] text-slate-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>{a.desc}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: a.earned ? a.color : "#4b5563", fontFamily: "'DM Sans', sans-serif" }}>
              <Zap size={11} />+{a.xp.toLocaleString()} XP
            </div>
            {a.earned ? (
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <CheckCircle2 size={10} style={{ color: "#34d399" }} />{a.date}
              </div>
            ) : (
              <span className="text-[10px] text-slate-600" style={{ fontFamily: "'DM Sans', sans-serif" }}>Locked</span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Level ring SVG ─── */
function LevelRing({ level, pct }: { level: number; pct: number }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div className="relative w-[110px] h-[110px] shrink-0">
      <svg width="110" height="110" viewBox="0 0 110 110">
        <circle cx="55" cy="55" r={r} fill="none" stroke="rgba(109,40,217,0.12)" strokeWidth="7" />
        <circle cx="55" cy="55" r={r} fill="none"
          stroke="url(#ringGrad)" strokeWidth="7"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transform: "rotate(-90deg)", transformOrigin: "55px 55px" }} />
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6d28d9" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-black text-white" style={{ fontFamily: "'Barlow', sans-serif" }}>{level}</span>
        <span className="text-[9px] text-violet-400/70 font-semibold tracking-widest" style={{ fontFamily: "'DM Sans', sans-serif" }}>LVL</span>
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
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Barlow:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>

      <div className="min-h-full p-4 sm:p-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>

        {/* ── Hero card ── */}
        <motion.div {...fadeUp(0)} className="relative rounded-3xl overflow-hidden mb-4 sm:mb-6"
          style={{ background: "linear-gradient(135deg, rgba(15,10,40,0.97), rgba(10,6,28,0.99))", border: "1px solid rgba(139,92,246,0.18)" }}>

          {/* Banner */}
          <div className="relative h-24 sm:h-36 overflow-hidden"
            style={{ background: "linear-gradient(135deg, rgba(109,40,217,0.35) 0%, rgba(6,3,18,0.9) 60%, rgba(139,92,246,0.15) 100%)" }}>
            {/* Geometric accent lines */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="bannerLine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgba(139,92,246,0)" />
                  <stop offset="40%" stopColor="rgba(139,92,246,0.35)" />
                  <stop offset="100%" stopColor="rgba(139,92,246,0)" />
                </linearGradient>
              </defs>
              {[20, 45, 68, 85].map((y) => (
                <line key={y} x1="0" y1={`${y}%`} x2="100%" y2={`${y}%`} stroke="url(#bannerLine)" strokeWidth="0.5" />
              ))}
              <line x1="0" y1="100%" x2="55%" y2="0" stroke="rgba(139,92,246,0.08)" strokeWidth="1" />
            </svg>

            {/* Edit button */}
            <button className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:opacity-80"
              style={{ background: "rgba(10,6,28,0.7)", border: "1px solid rgba(139,92,246,0.25)", color: "#a78bfa", fontFamily: "'DM Sans', sans-serif", backdropFilter: "blur(8px)" }}>
              <Edit3 size={11} /> Edit Profile
            </button>
          </div>

          {/* Info row */}
          <div className="px-4 sm:px-6 pb-5 sm:pb-6">
            {/* Avatar + level ring — pulled up */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6 -mt-10 sm:-mt-14 mb-4 sm:mb-5">
              <div className="relative shrink-0 w-fit">
                <LevelRing level={7} pct={76} />
                <img src="https://i.pravatar.cc/100?u=kyzen"
                  alt="avatar"
                  className="absolute inset-[11px] rounded-full object-cover"
                  style={{ border: "3px solid rgba(10,6,28,0.99)", boxShadow: "0 0 0 1px rgba(139,92,246,0.4), 0 0 20px rgba(109,40,217,0.4)" }} />
                <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ background: "#22c55e", border: "2px solid rgba(10,6,28,0.99)" }} />
              </div>

              {/* Name + meta */}
              <div className="flex-1 min-w-0 pb-1 sm:pb-2">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-black text-white" style={{ fontFamily: "'Barlow', sans-serif", letterSpacing: "-0.01em" }}>
                    Ethan Reynolds
                  </h1>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg"
                    style={{ background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.35)", color: "#c4b5fd", fontFamily: "'DM Sans', sans-serif" }}>
                    PRO
                  </span>
                </div>

                <p className="text-sm text-slate-400 mb-3 max-w-lg" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Product designer & developer chasing the leaderboard one quest at a time. ⚡
                </p>

                <div className="flex flex-wrap gap-3 sm:gap-4 text-[11px] text-slate-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  <span className="flex items-center gap-1.5"><MapPin size={11} />San Francisco, CA</span>
                  <span className="flex items-center gap-1.5"><Calendar size={11} />Joined Jan 2025</span>
                  <a href="#" className="flex items-center gap-1.5 transition-colors hover:text-violet-400">
                    {/* <Twitter size={11} />@ethankyzen */}
                  </a>
                  <a href="#" className="flex items-center gap-1.5 transition-colors hover:text-violet-400">
                    {/* <Github size={11} />ethanreynolds */}
                  </a>
                  <a href="#" className="flex items-center gap-1.5 transition-colors hover:text-violet-400">
                    <Link2 size={11} />kyzen.gg/ethan
                  </a>
                </div>
              </div>
            </div>

            {/* XP progress bar */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-semibold text-slate-300" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Level 7 → 8
                </span>
                <span className="text-xs font-bold text-violet-400" style={{ fontFamily: "'Barlow', sans-serif" }}>
                  3,800 / 5,000 XP
                </span>
              </div>
              <div className="h-2 w-full rounded-full" style={{ background: "rgba(109,40,217,0.12)", border: "1px solid rgba(139,92,246,0.1)" }}>
                <motion.div className="h-full rounded-full"
                  initial={{ width: 0 }} animate={{ width: "76%" }}
                  transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  style={{ background: "linear-gradient(90deg, #6d28d9, #a855f7)", boxShadow: "0 0 10px rgba(139,92,246,0.55)" }} />
              </div>
            </div>

            {/* Stat pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              <StatPill value="12,847" label="Total XP" color="#a855f7" />
              <StatPill value="14" label="Day Streak" color="#f97316" />
              <StatPill value="#284" label="Global Rank" color="#facc15" />
              <StatPill value="97" label="Quests Done" color="#34d399" />
            </div>
          </div>
        </motion.div>

        {/* ── Tabs ── */}
        <motion.div {...fadeUp(0.1)} className="flex gap-1 p-1 rounded-2xl mb-4 sm:mb-5 w-full sm:w-fit"
          style={{ background: "rgba(10,6,28,0.8)", border: "1px solid rgba(139,92,246,0.12)" }}>
          {TABS.map((t) => (
            <button key={t.key}
              onClick={() => setTab(t.key)}
              className="relative flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: tab === t.key ? "#e2d9f3" : "#64748b",
                background: tab === t.key ? "rgba(109,40,217,0.22)" : "transparent",
                border: tab === t.key ? "1px solid rgba(139,92,246,0.3)" : "1px solid transparent",
              }}>
              {t.label}
              {tab === t.key && (
                <motion.div layoutId="tab-indicator"
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  style={{ boxShadow: "inset 0 0 16px rgba(139,92,246,0.08)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 35 }} />
              )}
            </button>
          ))}
        </motion.div>

        {/* ── Tab content ── */}
        {tab === "overview"      && <OverviewTab />}
        {tab === "quests"        && <QuestsTab />}
        {tab === "achievements"  && <AchievementsTab />}
      </div>
    </>
  );
}