import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Flame,
  Swords,
  Trophy,
  Clock,
  ChevronRight,
  Plus,
  Zap,
  Star,
  Target,
} from "lucide-react";

type StatCardProps = {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  accent: string;
  glow: string;
  delay: number;
};

type Quest = {
  id: number;
  title: string;
  category: string;
  xp: number;
  progress: number;
  due: string;
  priority: "HIGH" | "MED" | "LOW";
};

type Activity = {
  id: number;
  avatar: string;
  name: string;
  action: string;
  time: string;
  xp?: number;
};

const QUESTS: Quest[] = [
  { id: 1, title: "Flowio — Dashboard Design", category: "Design", xp: 250, progress: 75, due: "Today", priority: "HIGH" },
  { id: 2, title: "Meeting — Alex B.", category: "Motion Design", xp: 120, progress: 40, due: "Tue, 10", priority: "MED" },
  { id: 3, title: "Meet with PM", category: "New AI", xp: 80, progress: 20, due: "Wed, 11", priority: "LOW" },
  { id: 4, title: "Landing Page", category: "Development", xp: 300, progress: 55, due: "Thu, 12", priority: "HIGH" },
];

const ACTIVITY: Activity[] = [
  { id: 1, avatar: "https://i.pravatar.cc/32?img=11", name: "Alex Brown", action: "Finished the project. Looking forward to feedback.", time: "2m ago", xp: 150 },
  { id: 2, avatar: "https://i.pravatar.cc/32?img=32", name: "Team Meeting — Liza K.", action: "Call about a new project launching next week.", time: "1h ago" },
  { id: 3, avatar: "https://i.pravatar.cc/32?img=53", name: "Robert Johnson", action: "New AI updates — team and project finished.", time: "3h ago", xp: 75 },
];

const SKILL_BARS = [
  { label: "Development", pct: 82, color: "#7c3aed" },
  { label: "Design", pct: 64, color: "#a855f7" },
  { label: "Leadership", pct: 47, color: "#8b5cf6" },
  { label: "Research", pct: 91, color: "#6d28d9" },
];

const PRIORITY_COLOR: Record<Quest["priority"], string> = {
  HIGH: "#f472b6",
  MED: "#facc15",
  LOW: "#34d399",
};

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] as const },
});

function StatCard({ label, value, sub, icon, accent, glow, delay }: StatCardProps) {
  return (
    <motion.div
      {...fadeUp(delay)}
      className="relative rounded-2xl p-4 sm:p-5 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(15,10,40,0.95) 0%, rgba(10,6,28,0.98) 100%)",
        border: "1px solid rgba(139,92,246,0.15)",
        boxShadow: `0 0 30px ${glow}`,
      }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at top right, ${glow} 0%, transparent 70%)` }} />
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${accent}20`, border: `1px solid ${accent}40`, color: accent }}>
          {icon}
        </div>
        <ArrowUpRight size={14} style={{ color: accent }} />
      </div>
      <p className="text-xl sm:text-2xl font-black text-white mb-0.5" style={{ fontFamily: "'Barlow', sans-serif" }}>{value}</p>
      <p className="text-xs font-medium text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>{label}</p>
      <p className="text-[10px] mt-1" style={{ color: accent, fontFamily: "'DM Sans', sans-serif" }}>{sub}</p>
    </motion.div>
  );
}

function DonutChart() {
  const segments = [
    { label: "Competitors", pct: 53, color: "#a855f7" },
    { label: "Task Flow",   pct: 24, color: "#ec4899" },
    { label: "User Journey",pct: 23, color: "#6d28d9" },
  ];
  const r = 38;
  const circ = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="relative rounded-2xl p-4 sm:p-5"
      style={{ background: "linear-gradient(135deg, rgba(15,10,40,0.95), rgba(10,6,28,0.98))", border: "1px solid rgba(139,92,246,0.15)" }}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-slate-100" style={{ fontFamily: "'DM Sans', sans-serif" }}>AI Reports</p>
        <button className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.2)" }}>
          <Plus size={12} style={{ color: "#a78bfa" }} />
        </button>
      </div>
      <div className="flex items-center gap-4 sm:gap-6">
        <div className="relative shrink-0">
          <svg width="90" height="90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(139,92,246,0.08)" strokeWidth="12" />
            {segments.map((seg) => {
              const dash = (seg.pct / 100) * circ;
              const el = (
                <circle key={seg.label} cx="50" cy="50" r={r} fill="none"
                  stroke={seg.color} strokeWidth="12"
                  strokeDasharray={`${dash} ${circ}`}
                  strokeDashoffset={-(offset)}
                  strokeLinecap="round"
                  style={{ transform: "rotate(-90deg)", transformOrigin: "50px 50px" }} />
              );
              offset += dash;
              return el;
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap size={18} style={{ color: "#a78bfa" }} />
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:gap-2.5 flex-1">
          {segments.map((seg) => (
            <div key={seg.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: seg.color }} />
                <span className="text-xs text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>{seg.label}</span>
              </div>
              <span className="text-sm font-bold text-white" style={{ fontFamily: "'Barlow', sans-serif" }}>{seg.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PassingRate() {
  const points = [30,55,40,70,45,80,35,65,50,75,42,68,55,78,48,62,70,45,58,80,52,65,72,50,68];
  const max = Math.max(...points);
  const w = 220; const h = 70;
  const coords = points.map((v, i) => `${(i / (points.length - 1)) * w},${h - (v / max) * (h - 8)}`).join(" ");

  return (
    <div className="relative rounded-2xl p-4 sm:p-5"
      style={{ background: "linear-gradient(135deg, rgba(15,10,40,0.95), rgba(10,6,28,0.98))", border: "1px solid rgba(139,92,246,0.15)" }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-slate-100" style={{ fontFamily: "'DM Sans', sans-serif" }}>Passing Rate</p>
        <Star size={14} style={{ color: "rgba(139,92,246,0.5)" }} />
      </div>
      <div className="grid grid-cols-3 gap-x-2 gap-y-1 mb-3">
        {[["28%","Failed","#f472b6"],["61%","Complete","#34d399"],["11%","Partial","#facc15"]].map(([val, lbl, col]) => (
          <div key={lbl as string}>
            <p className="text-lg sm:text-xl font-black" style={{ fontFamily: "'Barlow', sans-serif", color: col as string }}>{val}</p>
            <p className="text-[10px] text-slate-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>{lbl}</p>
          </div>
        ))}
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: 52 }}>
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6d28d9" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
        <polyline points={coords} fill="none" stroke="url(#lineGrad)" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function ProjectTime() {
  const bars = [
    { day: "Sun", h: 60 }, { day: "Mon", h: 80 }, { day: "Tue", h: 110 }, { day: "Wed", h: 140 }, { day: "Thu", h: 95 },
  ];
  return (
    <div className="relative rounded-2xl p-4 sm:p-5"
      style={{ background: "linear-gradient(135deg, rgba(15,10,40,0.95), rgba(10,6,28,0.98))", border: "1px solid rgba(139,92,246,0.15)" }}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-slate-100" style={{ fontFamily: "'DM Sans', sans-serif" }}>Project Time</p>
        <button className="flex items-center gap-1 text-xs px-2 sm:px-2.5 py-1 rounded-lg"
          style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.2)", color: "#a78bfa", fontFamily: "'DM Sans', sans-serif" }}>
          Last Week <ChevronRight size={11} />
        </button>
      </div>
      <div className="flex items-end gap-2 h-[90px] sm:h-[100px]">
        {bars.map((b) => (
          <div key={b.day} className="flex flex-col items-center gap-1.5 flex-1">
            <div className="w-full rounded-lg relative overflow-hidden"
              style={{ height: (b.h / 140) * 80, background: "rgba(109,40,217,0.15)", border: "1px solid rgba(139,92,246,0.15)" }}>
              <div className="absolute inset-0 rounded-lg"
                style={{ background: "repeating-linear-gradient(45deg, rgba(139,92,246,0.3) 0px, rgba(139,92,246,0.3) 4px, transparent 4px, transparent 10px)" }} />
            </div>
            <span className="text-[10px] text-slate-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>{b.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuestCard({ quest }: { quest: Quest }) {
  return (
    <div className="relative rounded-xl p-3 sm:p-4 cursor-pointer transition-all duration-200 hover:border-violet-500/30"
      style={{ background: "rgba(10,6,28,0.6)", border: "1px solid rgba(139,92,246,0.1)" }}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0 pr-3">
          <p className="text-sm font-semibold text-slate-100 truncate mb-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>{quest.title}</p>
          <p className="text-xs text-slate-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>{quest.category}</p>
        </div>
        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md shrink-0"
          style={{ background: `${PRIORITY_COLOR[quest.priority]}15`, border: `1px solid ${PRIORITY_COLOR[quest.priority]}30`, color: PRIORITY_COLOR[quest.priority], fontFamily: "'DM Sans', sans-serif" }}>
          {quest.priority}
        </span>
      </div>
      <div className="mb-2.5">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] text-slate-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>Progress</span>
          <span className="text-[10px] font-semibold text-violet-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>{quest.progress}%</span>
        </div>
        <div className="w-full h-1.5 rounded-full" style={{ background: "rgba(109,40,217,0.15)" }}>
          <div className="h-full rounded-full" style={{ width: `${quest.progress}%`, background: "linear-gradient(90deg, #6d28d9, #a855f7)", boxShadow: "0 0 8px rgba(139,92,246,0.5)" }} />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <Clock size={10} />{quest.due}
        </div>
        <div className="flex items-center gap-1 text-[10px] font-semibold" style={{ color: "#a78bfa", fontFamily: "'DM Sans', sans-serif" }}>
          <Zap size={10} />+{quest.xp} XP
        </div>
      </div>
    </div>
  );
}

function InboxItem({ item }: { item: Activity }) {
  return (
    <div className="flex items-start gap-3 py-3" style={{ borderBottom: "1px solid rgba(139,92,246,0.06)" }}>
      <img src={item.avatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" style={{ border: "1.5px solid rgba(139,92,246,0.3)" }} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <p className="text-xs font-semibold text-slate-200 truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.name}</p>
          {item.xp && <span className="text-[10px] font-bold shrink-0" style={{ color: "#a78bfa", fontFamily: "'DM Sans', sans-serif" }}>+{item.xp} XP</span>}
        </div>
        <p className="text-[11px] text-slate-500 line-clamp-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.action}</p>
        <p className="text-[10px] text-slate-600 mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.time}</p>
      </div>
    </div>
  );
}

export default function DashboardHome() {
  return (
    <div className="min-h-full p-4 sm:p-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <motion.div {...fadeUp(0)} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-7">
        <div>
          <p className="text-xs font-medium tracking-widest uppercase mb-1" style={{ color: "rgba(139,92,246,0.5)" }}>✦ WELCOME BACK</p>
          <h1 className="text-2xl sm:text-3xl font-black text-white" style={{ fontFamily: "'Barlow', sans-serif", letterSpacing: "-0.01em" }}>
            Welcome,{" "}
            <span style={{ background: "linear-gradient(90deg, #a78bfa, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Ethan
            </span>
          </h1>
        </div>
        <button className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #6d28d9, #a855f7)", border: "1px solid rgba(167,139,250,0.3)", boxShadow: "0 0 20px rgba(109,40,217,0.4)", fontFamily: "'DM Sans', sans-serif" }}>
          <Plus size={14} /> Add Quest
        </button>
      </motion.div>

      {/* Stat Cards — 2 cols on mobile, 4 on lg */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-5">
        <StatCard label="Total XP Earned" value="12,847" sub="↑ 340 XP this week" icon={<Zap size={16} />} accent="#a855f7" glow="rgba(168,85,247,0.08)" delay={0.05} />
        <StatCard label="Current Streak" value="14 Days" sub="Personal best: 21" icon={<Flame size={16} />} accent="#f97316" glow="rgba(249,115,22,0.06)" delay={0.1} />
        <StatCard label="Active Quests" value="7" sub="3 due this week" icon={<Swords size={16} />} accent="#ec4899" glow="rgba(236,72,153,0.06)" delay={0.15} />
        <StatCard label="Global Rank" value="#284" sub="Top 2% this season" icon={<Trophy size={16} />} accent="#facc15" glow="rgba(250,204,21,0.05)" delay={0.2} />
      </div>

      {/* Chart row — 1 col on mobile, 3 on lg */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-5">
        <motion.div {...fadeUp(0.2)}><DonutChart /></motion.div>
        <motion.div {...fadeUp(0.25)}><PassingRate /></motion.div>
        <motion.div {...fadeUp(0.3)} className="sm:col-span-2 lg:col-span-1"><ProjectTime /></motion.div>
      </div>

      {/* Bottom panels — stack on mobile, 3-col grid on xl */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">

        {/* Quest Manager */}
        <motion.div {...fadeUp(0.32)} className="lg:col-span-5 rounded-2xl p-4 sm:p-5"
          style={{ background: "linear-gradient(135deg, rgba(15,10,40,0.95), rgba(10,6,28,0.98))", border: "1px solid rgba(139,92,246,0.15)" }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-slate-100">Quest Manager</p>
            <div className="flex items-center gap-2">
              <span className="hidden sm:block text-xs text-slate-500">March 2025</span>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white"
                style={{ background: "linear-gradient(135deg, #6d28d9, #a855f7)", border: "1px solid rgba(167,139,250,0.3)" }}>
                <Plus size={11} /> Add Task
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {QUESTS.map((q) => <QuestCard key={q.id} quest={q} />)}
          </div>
        </motion.div>

        {/* Skill Tree */}
        <motion.div {...fadeUp(0.36)} className="lg:col-span-3 rounded-2xl p-4 sm:p-5"
          style={{ background: "linear-gradient(135deg, rgba(15,10,40,0.95), rgba(10,6,28,0.98))", border: "1px solid rgba(139,92,246,0.15)" }}>
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm font-semibold text-slate-100">Skill Tree</p>
            <Target size={14} style={{ color: "rgba(139,92,246,0.5)" }} />
          </div>
          <div className="flex flex-col gap-4">
            {SKILL_BARS.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + i * 0.08 }}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>{s.label}</span>
                  <span className="text-xs font-bold" style={{ color: s.color, fontFamily: "'Barlow', sans-serif" }}>{s.pct}</span>
                </div>
                <div className="h-2 w-full rounded-full" style={{ background: "rgba(109,40,217,0.12)" }}>
                  <motion.div className="h-full rounded-full"
                    initial={{ width: 0 }} animate={{ width: `${s.pct}%` }}
                    transition={{ duration: 1, delay: 0.6 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    style={{ background: `linear-gradient(90deg, ${s.color}aa, ${s.color})`, boxShadow: `0 0 8px ${s.color}60` }} />
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-6 pt-5" style={{ borderTop: "1px solid rgba(139,92,246,0.1)" }}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-slate-300" style={{ fontFamily: "'DM Sans', sans-serif" }}>Level 7 → 8</span>
              <span className="text-xs font-bold text-violet-400" style={{ fontFamily: "'Barlow', sans-serif" }}>3,800 / 5,000</span>
            </div>
            <div className="h-2.5 w-full rounded-full" style={{ background: "rgba(109,40,217,0.15)", border: "1px solid rgba(139,92,246,0.15)" }}>
              <motion.div className="h-full rounded-full"
                initial={{ width: 0 }} animate={{ width: "76%" }}
                transition={{ duration: 1.2, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                style={{ background: "linear-gradient(90deg, #6d28d9, #a855f7)", boxShadow: "0 0 12px rgba(139,92,246,0.6)" }} />
            </div>
          </div>
        </motion.div>

        {/* Inboxes */}
        <motion.div {...fadeUp(0.4)} className="lg:col-span-4 rounded-2xl p-4 sm:p-5"
          style={{ background: "linear-gradient(135deg, rgba(15,10,40,0.95), rgba(10,6,28,0.98))", border: "1px solid rgba(139,92,246,0.15)" }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-slate-100">Inboxes</p>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                style={{ background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.3)", color: "#c4b5fd" }}>16</span>
            </div>
            <button className="text-xs text-violet-400 hover:text-violet-300 transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>View All</button>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl mb-4"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-slate-500 shrink-0">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="text-xs text-slate-600" style={{ fontFamily: "'DM Sans', sans-serif" }}>Search messages…</span>
          </div>
          <div>{ACTIVITY.map((item) => <InboxItem key={item.id} item={item} />)}</div>
          <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background: "rgba(109,40,217,0.06)", border: "1px solid rgba(139,92,246,0.12)" }}>
            <span className="text-xs text-slate-500 flex-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>Send later…</span>
            <button className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.25)" }}>
              <ArrowUpRight size={11} style={{ color: "#a78bfa" }} />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}