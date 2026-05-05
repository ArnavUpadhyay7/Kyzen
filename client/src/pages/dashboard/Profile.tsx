import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Zap, Flame, Trophy, Star, Shield, Target, Edit3, MapPin,
  Link2, Calendar, TrendingUp, Swords, Clock, CheckCircle2,
  Lock, LogOut, UserX, ChevronDown, Users, GitCommit,
  Activity, Award, Sparkles, ExternalLink,
} from "lucide-react";
import { authApi } from "../../api/auth";
import { toast } from "../../components/ui/Toast";

/* ─── Types ─── */
type Tab = "overview" | "quests" | "achievements";

type Badge = {
  id: number;
  icon: React.ReactNode;
  label: string;
  desc: string;
  earned: boolean;
  rarity: "common" | "rare" | "epic" | "legendary";
};

type Achievement = {
  id: number;
  title: string;
  desc: string;
  xp: number;
  icon: React.ReactNode;
  date: string;
  earned: boolean;
  category: string;
};

type Quest = {
  id: number;
  title: string;
  category: string;
  xp: number;
  status: "completed" | "active" | "failed";
  date: string;
  difficulty: "easy" | "medium" | "hard";
};

/* ─── Style maps ─── */
const RARITY: Record<string, { glow: string; border: string; text: string; bg: string }> = {
  common:    { glow: "rgba(156,163,175,0.15)", border: "rgba(156,163,175,0.2)",  text: "#9CA3AF", bg: "rgba(156,163,175,0.06)" },
  rare:      { glow: "rgba(59,130,246,0.2)",   border: "rgba(59,130,246,0.25)",  text: "#60A5FA", bg: "rgba(59,130,246,0.07)" },
  epic:      { glow: "rgba(139,92,246,0.25)",  border: "rgba(139,92,246,0.3)",   text: "#A78BFA", bg: "rgba(139,92,246,0.08)" },
  legendary: { glow: "rgba(251,191,36,0.25)",  border: "rgba(251,191,36,0.3)",   text: "#FCD34D", bg: "rgba(251,191,36,0.07)" },
};

const DIFF: Record<string, { label: string; color: string; bg: string }> = {
  easy:   { label: "Easy",   color: "#10B981", bg: "rgba(16,185,129,0.1)"  },
  medium: { label: "Medium", color: "#F59E0B", bg: "rgba(245,158,11,0.1)"  },
  hard:   { label: "Hard",   color: "#EF4444", bg: "rgba(239,68,68,0.1)"   },
};

const STATUS: Record<string, { dot: string; text: string; label: string }> = {
  completed: { dot: "#10B981", text: "#6B7280", label: "Completed" },
  active:    { dot: "#8B5CF6", text: "#8B5CF6", label: "Active"    },
  failed:    { dot: "#EF4444", text: "#6B7280", label: "Failed"    },
};

const CAT_COLOR: Record<string, string> = {
  Design: "#EC4899", Development: "#8B5CF6", Leadership: "#F59E0B",
  Research: "#06B6D4", Communication: "#10B981",
};

/* ─── Data ─── */
const BADGES: Badge[] = [
  { id: 1, icon: <Flame size={15} />,  label: "Streak Master", desc: "30-day streak",  earned: true,  rarity: "epic"      },
  { id: 2, icon: <Trophy size={15} />, label: "Top 1%",        desc: "Season II rank", earned: true,  rarity: "legendary" },
  { id: 3, icon: <Shield size={15} />, label: "Defender",      desc: "Protected 7d",   earned: true,  rarity: "rare"      },
  { id: 4, icon: <Star size={15} />,   label: "Legend",        desc: "1000 quests",    earned: true,  rarity: "legendary" },
  { id: 5, icon: <Zap size={15} />,    label: "Speed Run",     desc: "5 quests/day",   earned: false, rarity: "epic"      },
  { id: 6, icon: <Target size={15} />, label: "Precision",     desc: "100% accuracy",  earned: false, rarity: "rare"      },
];

const ACHIEVEMENTS: Achievement[] = [
  { id: 1, title: "First Blood",  desc: "Complete your first quest",  xp: 100,  icon: <Swords size={13} />,       date: "Jan 2, 2025",  earned: true,  category: "Milestone" },
  { id: 2, title: "On Fire",      desc: "Maintain a 14-day streak",   xp: 350,  icon: <Flame size={13} />,        date: "Feb 14, 2025", earned: true,  category: "Streak"    },
  { id: 3, title: "Century Club", desc: "Complete 100 quests total",  xp: 1000, icon: <CheckCircle2 size={13} />, date: "Mar 5, 2025",  earned: true,  category: "Volume"    },
  { id: 4, title: "Ranked Up",    desc: "Reach Global Top 500",       xp: 750,  icon: <TrendingUp size={13} />,   date: "Mar 20, 2025", earned: true,  category: "Rank"      },
  { id: 5, title: "Elite Guard",  desc: "Hold rank for 30 days",      xp: 500,  icon: <Shield size={13} />,       date: "—",            earned: false, category: "Rank"      },
  { id: 6, title: "Mythic",       desc: "Reach level 20",             xp: 2000, icon: <Star size={13} />,         date: "—",            earned: false, category: "Milestone" },
];

const QUESTS: Quest[] = [
  { id: 1, title: "Redesign onboarding flow",  category: "Design",       xp: 280, status: "completed", date: "Today",     difficulty: "medium" },
  { id: 2, title: "API integration sprint",    category: "Development",  xp: 420, status: "completed", date: "Yesterday", difficulty: "hard"   },
  { id: 3, title: "Q2 strategy deck",          category: "Leadership",   xp: 150, status: "active",    date: "Due Fri",   difficulty: "medium" },
  { id: 4, title: "Competitor analysis",       category: "Research",     xp: 200, status: "completed", date: "Apr 28",    difficulty: "easy"   },
  { id: 5, title: "Mobile nav refactor",       category: "Development",  xp: 190, status: "failed",    date: "Apr 25",    difficulty: "hard"   },
  { id: 6, title: "Brand guidelines v3",       category: "Design",       xp: 310, status: "completed", date: "Apr 22",    difficulty: "medium" },
];

const SKILLS = [
  { label: "Research",      pct: 91, xp: 4550, color: "#06B6D4" },
  { label: "Development",   pct: 82, xp: 4100, color: "#8B5CF6" },
  { label: "Communication", pct: 73, xp: 3650, color: "#10B981" },
  { label: "Design",        pct: 64, xp: 3200, color: "#EC4899" },
  { label: "Leadership",    pct: 47, xp: 2350, color: "#F59E0B" },
];

/* ─── Heatmap ─── */
const WEEKS = 26;
const DAYS  = 7;
const HEAT  = Array.from({ length: WEEKS * DAYS }, (_, i) => {
  const r = Math.random();
  if (i > WEEKS * DAYS - 14) return Math.floor(r * 3);
  return r > 0.6 ? Math.floor(r * 5) : 0;
});

/* ─── Shared animation ─── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] as const },
});

/* ══════════════════════════════════════════
   ACCOUNT MENU
══════════════════════════════════════════ */
function AccountMenu() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<"logout" | "signout" | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const handleLogout = async () => {
    setBusy("logout");
    try {
      await authApi.logout();
      toast("Logged out successfully. See you soon! 👋", "success");
      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? (err.response?.data?.message ?? "Logout failed. Please try again.")
        : "Something went wrong.";
      toast(msg, "error");
    } finally { setBusy(null); setOpen(false); }
  };

  const handleSignout = async () => {
    setBusy("signout");
    try {
      await authApi.signout();
      toast("All sessions signed out. Stay safe! 🔒", "success");
      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? (err.response?.data?.message ?? "Sign out failed. Please try again.")
        : "Something went wrong.";
      toast(msg, "error");
    } finally { setBusy(null); setOpen(false); }
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-90 active:scale-95"
        style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "#CBD5E1" }}
      >
        <Edit3 size={12} />
        Edit
        <ChevronDown
          size={11}
          className="opacity-50"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .18s" }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{ opacity: 0, scale: 0.95,    y: -4 }}
            transition={{ duration: 0.14 }}
            className="absolute right-0 mt-2 w-52 z-50 rounded-2xl overflow-hidden"
            style={{
              background: "#16161F",
              border: "1px solid rgba(255,255,255,0.09)",
              boxShadow: "0 24px 60px rgba(0,0,0,0.65)",
            }}
          >
            <div className="p-1.5 space-y-0.5">
              <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-white/5 transition-colors text-left">
                <Edit3 size={13} className="text-slate-600" /> Edit profile
              </button>
              <div className="h-px mx-2" style={{ background: "rgba(255,255,255,0.06)" }} />
              <button
                onClick={handleLogout}
                disabled={!!busy}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-white/5 transition-colors text-left disabled:opacity-50"
              >
                <LogOut size={13} className="text-slate-600" />
                {busy === "logout" ? "Logging out…" : "Log out"}
              </button>
              <button
                onClick={handleSignout}
                disabled={!!busy}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left disabled:opacity-50"
              >
                <UserX size={13} className="text-red-500/70" />
                {busy === "signout" ? "Signing out…" : "Sign out all devices"}
              </button>
            </div>
            <div
              className="px-4 py-2.5"
              style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.2)" }}
            >
              <p className="text-[10px] text-slate-700">"Sign out" clears all active sessions.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════
   LEVEL RING
══════════════════════════════════════════ */
function LevelRing({ level, pct }: { level: number; pct: number }) {
  const R = 34, C = 2 * Math.PI * R;
  return (
    <div className="relative w-21 h-21 shrink-0">
      <svg width="84" height="84" viewBox="0 0 84 84">
        <defs>
          <linearGradient id="ring" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#C084FC" />
          </linearGradient>
        </defs>
        <circle cx="42" cy="42" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
        <circle
          cx="42" cy="42" r={R} fill="none"
          stroke="url(#ring)" strokeWidth="4"
          strokeDasharray={`${(pct / 100) * C} ${C}`}
          strokeLinecap="round"
          style={{ transform: "rotate(-90deg)", transformOrigin: "42px 42px" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-white leading-none">{level}</span>
        <span className="text-[8px] font-bold tracking-[0.14em] text-slate-600 mt-0.5">LVL</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   HEATMAP
══════════════════════════════════════════ */
function HeatMap() {
  const levels = ["#1a1a24", "rgba(109,40,217,0.28)", "rgba(124,58,237,0.48)", "rgba(139,92,246,0.68)", "#A78BFA"];
  const MONTHS = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];

  return (
    <div className="flex flex-col gap-1.5">
      {/* Month labels */}
      <div className="flex pl-7">
        {MONTHS.map(m => (
          <span key={m} className="flex-1 text-[10px] text-slate-700 text-center" style={{ fontFamily: "'DM Mono', monospace" }}>{m}</span>
        ))}
      </div>

      <div className="flex gap-2">
        {/* Day labels */}
        <div className="flex flex-col justify-between py-px" style={{ width: 20 }}>
          {["Mon", "Wed", "Fri"].map(d => (
            <span key={d} className="text-[9px] text-slate-700 leading-none" style={{ fontFamily: "'DM Mono', monospace" }}>{d}</span>
          ))}
        </div>

        {/* Cell grid */}
        <div
          style={{
            display: "grid",
            gridTemplateRows: `repeat(${DAYS}, 12px)`,
            gridTemplateColumns: `repeat(${WEEKS}, 12px)`,
            gap: "3px",
          }}
        >
          {Array.from({ length: WEEKS }).map((_, w) =>
            Array.from({ length: DAYS }).map((_, d) => {
              const v = Math.min(HEAT[w * DAYS + d] ?? 0, 4);
              return (
                <div
                  key={`${w}-${d}`}
                  className="rounded-[3px] cursor-pointer transition-all hover:ring-1 hover:ring-violet-400/60 hover:scale-110"
                  style={{ width: 12, height: 12, background: levels[v], gridColumn: w + 1, gridRow: d + 1 }}
                  title={`${v} quest${v !== 1 ? "s" : ""}`}
                />
              );
            })
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1.5 mt-0.5">
        <span className="text-[10px] text-slate-700" style={{ fontFamily: "'DM Mono', monospace" }}>Less</span>
        {levels.map((c, i) => (
          <div key={i} className="w-3 h-3 rounded-[3px]" style={{ background: c }} />
        ))}
        <span className="text-[10px] text-slate-700" style={{ fontFamily: "'DM Mono', monospace" }}>More</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   OVERVIEW TAB
══════════════════════════════════════════ */
function OverviewTab() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
        {/* Activity */}
        <motion.div
          {...fadeUp(0)}
          className="lg:col-span-3 rounded-2xl p-5"
          style={{ background: "#13131A", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <Activity size={14} className="text-violet-400" />
              <span className="text-sm font-semibold text-slate-200">Activity</span>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.2)", color: "#A78BFA" }}
              >
                182 this year
              </span>
            </div>
            <span className="text-[10px] text-slate-600 flex items-center gap-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
              <Calendar size={9} /> Nov 2024 – Apr 2025
            </span>
          </div>
          <div className="overflow-x-auto">
            <HeatMap />
          </div>
        </motion.div>

        {/* Skills */}
        <motion.div
          {...fadeUp(0.06)}
          className="lg:col-span-2 rounded-2xl p-5"
          style={{ background: "#13131A", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-center gap-2.5 mb-5">
            <Target size={14} className="text-violet-400" />
            <span className="text-sm font-semibold text-slate-200">Skill Tree</span>
          </div>
          <div className="space-y-4">
            {SKILLS.map((s, i) => (
              <div key={s.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-slate-400">{s.label}</span>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] text-slate-600" style={{ fontFamily: "'DM Mono', monospace" }}>
                      {s.xp.toLocaleString()} XP
                    </span>
                    <span className="text-[11px] font-bold w-5 text-right" style={{ color: s.color, fontFamily: "'DM Mono', monospace" }}>
                      {s.pct}
                    </span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${s.pct}%` }}
                    transition={{ duration: 0.9, delay: 0.15 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                    style={{ background: `linear-gradient(90deg, ${s.color}80, ${s.color})` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Badges */}
      <motion.div
        {...fadeUp(0.1)}
        className="rounded-2xl p-5"
        style={{ background: "#13131A", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <Award size={14} className="text-violet-400" />
            <span className="text-sm font-semibold text-slate-200">Badges</span>
          </div>
          <span className="text-[11px] text-slate-600 font-medium" style={{ fontFamily: "'DM Mono', monospace" }}>
            {BADGES.filter(b => b.earned).length}/{BADGES.length} earned
          </span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {BADGES.map((b, i) => {
            const r = RARITY[b.rarity];
            return (
              <motion.div
                key={b.id}
                {...fadeUp(i * 0.04)}
                className="relative flex flex-col items-center gap-2.5 p-4 rounded-2xl cursor-pointer group transition-all duration-200 hover:scale-105 hover:-translate-y-0.5"
                style={{
                  background:  b.earned ? r.bg : "rgba(255,255,255,0.02)",
                  border:      `1px solid ${b.earned ? r.border : "rgba(255,255,255,0.05)"}`,
                  opacity:     b.earned ? 1 : 0.35,
                  boxShadow:   b.earned ? `0 0 24px ${r.glow}` : "none",
                }}
              >
                {!b.earned && <Lock size={8} className="absolute top-2 right-2 text-slate-800" />}
                {b.earned && b.rarity === "legendary" && (
                  <Sparkles size={8} className="absolute top-2 right-2" style={{ color: r.text }} />
                )}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: b.earned ? `${r.text}20` : "rgba(255,255,255,0.04)", color: b.earned ? r.text : "#374151" }}
                >
                  {b.icon}
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-semibold text-slate-300 leading-tight">{b.label}</p>
                  <p className="text-[9px] text-slate-600 mt-0.5">{b.desc}</p>
                  {b.earned && (
                    <p className="text-[8px] mt-1.5 font-bold uppercase tracking-widest" style={{ color: r.text }}>
                      {b.rarity}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════
   QUESTS TAB
══════════════════════════════════════════ */
function QuestsTab() {
  const done     = QUESTS.filter(q => q.status === "completed");
  const totalXP  = done.reduce((s, q) => s + q.xp, 0);

  return (
    <div className="space-y-3">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Completed", value: done.length,                                   color: "#10B981" },
          { label: "Total XP",  value: `${totalXP.toLocaleString()}`,                 color: "#8B5CF6" },
          { label: "Active",    value: QUESTS.filter(q => q.status === "active").length, color: "#F59E0B" },
        ].map((s, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-4 py-3.5 rounded-2xl"
            style={{ background: "#13131A", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="w-2 h-8 rounded-full shrink-0" style={{ background: `${s.color}50` }} />
            <div>
              <p className="text-lg font-bold text-white leading-none">{s.value}</p>
              <p className="text-[11px] text-slate-600 mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* List */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "#13131A", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-2.5">
            <Swords size={14} className="text-violet-400" />
            <span className="text-sm font-semibold text-slate-200">Quest History</span>
          </div>
          <button className="flex items-center gap-1 text-[11px] text-slate-600 hover:text-slate-400 transition-colors">
            View all <ExternalLink size={9} />
          </button>
        </div>

        {QUESTS.map((q, i) => {
          const st   = STATUS[q.status];
          const df   = DIFF[q.difficulty];
          const cat  = CAT_COLOR[q.category] ?? "#8B5CF6";
          return (
            <motion.div
              key={q.id}
              {...fadeUp(i * 0.04)}
              className="flex items-center gap-4 px-5 py-4 group hover:bg-white/2 transition-colors cursor-pointer"
              style={{ borderBottom: i < QUESTS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
            >
              <div className="w-1.5 h-9 rounded-full shrink-0" style={{ background: `${cat}55` }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate group-hover:text-white transition-colors">{q.title}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[10px] px-1.5 py-px rounded-md font-medium" style={{ background: `${cat}18`, color: cat }}>
                    {q.category}
                  </span>
                  <span className="text-[10px] px-1.5 py-px rounded-md font-medium" style={{ background: df.bg, color: df.color }}>
                    {df.label}
                  </span>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-600" style={{ fontFamily: "'DM Mono', monospace" }}>
                <Clock size={9} /> {q.date}
              </div>
              <div className="text-sm font-bold text-right" style={{ color: "#A78BFA", fontFamily: "'DM Mono', monospace", minWidth: 52 }}>
                +{q.xp}
              </div>
              <div className="flex items-center gap-1.5" style={{ minWidth: 76 }}>
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: st.dot }} />
                <span className="text-[11px]" style={{ color: st.text }}>{st.label}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   ACHIEVEMENTS TAB
══════════════════════════════════════════ */
function AchievementsTab() {
  const earned   = ACHIEVEMENTS.filter(a => a.earned);
  const totalXP  = earned.reduce((s, a) => s + a.xp, 0);

  return (
    <div className="space-y-3">
      {/* Progress header */}
      <div
        className="flex items-center gap-4 px-5 py-4 rounded-2xl"
        style={{ background: "#13131A", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <Trophy size={15} className="text-amber-400 shrink-0" />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">{earned.length} of {ACHIEVEMENTS.length} achievements unlocked</span>
            <span className="text-xs font-bold" style={{ color: "#A78BFA", fontFamily: "'DM Mono', monospace" }}>
              {totalXP.toLocaleString()} XP total
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(earned.length / ACHIEVEMENTS.length) * 100}%` }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              style={{ background: "linear-gradient(90deg, #7C3AED, #C084FC)" }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {ACHIEVEMENTS.map((a, i) => (
          <motion.div
            key={a.id}
            {...fadeUp(i * 0.05)}
            className="relative rounded-2xl p-4 group transition-all duration-200 hover:scale-[1.01] cursor-pointer"
            style={{
              background:  a.earned ? "#13131A" : "#0F0F16",
              border:      `1px solid ${a.earned ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.05)"}`,
              opacity:     a.earned ? 1 : 0.45,
              boxShadow:   a.earned ? "0 0 28px rgba(139,92,246,0.07)" : "none",
            }}
          >
            {!a.earned && <Lock size={10} className="absolute top-4 right-4 text-slate-800" />}
            <div className="flex items-start gap-3 mb-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: a.earned ? "rgba(139,92,246,0.12)" : "rgba(255,255,255,0.04)", color: a.earned ? "#A78BFA" : "#374151" }}
              >
                {a.icon}
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-sm font-semibold text-slate-200">{a.title}</p>
                <p className="text-[11px] text-slate-600 mt-0.5">{a.desc}</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              <span
                className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide"
                style={{ background: "rgba(255,255,255,0.05)", color: "#6B7280" }}
              >
                {a.category}
              </span>
              <div className="flex items-center gap-2">
                {a.earned ? (
                  <>
                    <CheckCircle2 size={9} style={{ color: "#10B981" }} />
                    <span className="text-[10px] text-slate-600" style={{ fontFamily: "'DM Mono', monospace" }}>{a.date}</span>
                  </>
                ) : (
                  <span className="text-[10px] text-slate-800">Locked</span>
                )}
                <span
                  className="text-[11px] font-bold"
                  style={{ color: a.earned ? "#A78BFA" : "#374151", fontFamily: "'DM Mono', monospace" }}
                >
                  +{a.xp.toLocaleString()}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN PROFILE PAGE
══════════════════════════════════════════ */
export default function Profile() {
  const [tab, setTab] = useState<Tab>("overview");

  const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "overview",     label: "Overview",     icon: <Activity size={12} />      },
    { key: "quests",       label: "Quests",        icon: <Swords size={12} />        },
    { key: "achievements", label: "Achievements",  icon: <Trophy size={12} />        },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        body, * { font-family: 'Sora', sans-serif !important; }
        code, pre, .mono { font-family: 'DM Mono', monospace !important; }
      `}</style>

      <div className="min-h-screen" style={{ background: "#0C0C13" }}>

        {/* ── HERO BANNER ── */}
        <div className="relative h-48 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: [
                "radial-gradient(ellipse 80% 140% at 15% -20%, rgba(109,40,217,0.45) 0%, transparent 55%)",
                "radial-gradient(ellipse 50% 100% at 80% 10%, rgba(59,130,246,0.14) 0%, transparent 60%)",
                "radial-gradient(ellipse 40% 80% at 50% 100%, rgba(139,92,246,0.06) 0%, transparent 70%)",
              ].join(","),
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-32"
            style={{ background: "linear-gradient(to bottom, transparent, #0C0C13)" }}
          />
        </div>

        {/* ── CONTENT ── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 -mt-20">

          {/* PROFILE CARD */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl overflow-hidden mb-4"
            style={{
              background: "#13131A",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.03)",
            }}
          >
            {/* Top section */}
            <div className="px-6 sm:px-8 pt-6 pb-5">
              <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <LevelRing level={7} pct={76} />
                  <img
                    src="https://i.pravatar.cc/100?u=kyzen"
                    alt="avatar"
                    className="absolute rounded-full object-cover"
                    style={{ inset: 10, border: "2.5px solid #13131A" }}
                  />
                  <span
                    className="absolute bottom-1.5 right-1.5 w-3 h-3 rounded-full"
                    style={{ background: "#10B981", border: "2.5px solid #13131A", boxShadow: "0 0 10px #10B98155" }}
                  />
                </div>

                {/* Identity */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <h1 className="text-2xl font-bold text-white" style={{ letterSpacing: "-0.03em" }}>
                      Ethan Reynolds
                    </h1>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-lg tracking-widest uppercase"
                      style={{ background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.25)", color: "#A78BFA" }}
                    >
                      PRO
                    </span>
                    <span
                      className="flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-lg"
                      style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.18)", color: "#10B981" }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                      Online
                    </span>
                  </div>

                  <p className="text-sm text-slate-500 leading-relaxed mb-3 max-w-lg">
                    Product designer & developer chasing the leaderboard one quest at a time.
                  </p>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[12px] text-slate-500">
                      <span className="flex items-center gap-1.5 hover:text-slate-300 transition-colors cursor-default">
                        <MapPin size={11} className="text-violet-400 shrink-0" /> San Francisco, CA
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar size={11} className="text-violet-400 shrink-0" /> Joined Jan 2025
                      </span>
                      <a href="#" className="flex items-center gap-1.5 hover:text-violet-400 transition-colors">
                        <Link2 size={11} className="text-violet-400 shrink-0" /> kyzen.gg/ethan
                      </a>
                    </div>
                    <div className="flex items-center gap-3 text-[12px] text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Users size={11} className="text-violet-400" />
                        <strong className="text-slate-300 font-semibold">248</strong> followers
                      </span>
                      <span className="text-slate-700">·</span>
                      <span className="flex items-center gap-1">
                        <strong className="text-slate-300 font-semibold">91</strong> following
                      </span>
                    </div>
                  </div>
                </div>

                {/* CTA buttons */}
                <div className="flex items-center gap-2 shrink-0 pt-1">
                  <button
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                    style={{
                      background: "linear-gradient(135deg, #7C3AED, #6D28D9)",
                      boxShadow: "0 4px 20px rgba(124,58,237,0.35)",
                    }}
                  >
                    Follow
                  </button>
                  <AccountMenu />
                </div>
              </div>

              {/* XP Bar */}
              <div className="mt-6 pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <GitCommit size={11} className="text-violet-400" />
                    <span>Level 7 → 8</span>
                  </div>
                  <span className="text-xs font-semibold mono" style={{ color: "#A78BFA" }}>
                    3,800 / 5,000 XP · 76%
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "76%" }}
                    transition={{ duration: 1.3, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    style={{ background: "linear-gradient(90deg, #6D28D9, #C084FC)" }}
                  />
                </div>
              </div>
            </div>

            {/* Stat row — flush bottom */}
            <div
              className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0"
              style={{
                borderTop: "1px solid rgba(255,255,255,0.06)",
                "--tw-divide-opacity": 1,
                borderColor: "rgba(255,255,255,0.06)",
              } as React.CSSProperties}
            >
              {[
                { value: "12,847", label: "Total XP",    sub: "↑ 340 this week", icon: <Zap size={14} />,          color: "#8B5CF6" },
                { value: "14",     label: "Day Streak",  sub: "Best: 21 days",   icon: <Flame size={14} />,        color: "#F97316" },
                { value: "#284",   label: "Global Rank", sub: "Top 2% season",   icon: <Trophy size={14} />,       color: "#FBBF24" },
                { value: "97",     label: "Quests Done", sub: "3 this week",     icon: <CheckCircle2 size={14} />, color: "#10B981" },
              ].map((s, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3.5 px-5 sm:px-6 py-5 hover:bg-white/25 transition-colors cursor-default group"
                  style={{ borderColor: "rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                    style={{ background: `${s.color}18`, color: s.color }}
                  >
                    {s.icon}
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white leading-none" style={{ letterSpacing: "-0.02em" }}>
                      {s.value}
                    </p>
                    <p className="text-[11px] text-slate-600 mt-0.5">{s.label}</p>
                    <p className="text-[10px] font-semibold mt-0.5" style={{ color: s.color }}>{s.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* TABS */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="flex gap-1 mb-4 p-1 rounded-2xl w-fit"
            style={{ background: "#13131A", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className="relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 outline-none"
                style={{ color: tab === t.key ? "#DDD6FE" : "#6B7280" }}
              >
                {tab === t.key && (
                  <motion.div
                    layoutId="tab-bg"
                    className="absolute inset-0 rounded-xl"
                    style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.22)" }}
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative flex items-center gap-2">
                  {t.icon}
                  {t.label}
                </span>
              </button>
            ))}
          </motion.div>

          {/* TAB CONTENT */}
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {tab === "overview"     && <OverviewTab />}
              {tab === "quests"       && <QuestsTab />}
              {tab === "achievements" && <AchievementsTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}