import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Flame,
  Swords,
  Trophy,
  Clock,
  Plus,
  Zap,
  Star,
  Target,
  ChevronRight,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type StatCardProps = {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
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

// ─── Data ─────────────────────────────────────────────────────────────────────

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
  { label: "Development", pct: 82 },
  { label: "Design", pct: 64 },
  { label: "Leadership", pct: 47 },
  { label: "Research", pct: 91 },
];

const PRIORITY_META: Record<Quest["priority"], { label: string; color: string; bg: string }> = {
  HIGH: { label: "High",   color: "#e879f9", bg: "rgba(232,121,249,0.08)" },
  MED:  { label: "Medium", color: "#a3a3a3", bg: "rgba(163,163,163,0.08)" },
  LOW:  { label: "Low",    color: "#525252", bg: "rgba(82,82,82,0.08)"    },
};

// ─── Animation ────────────────────────────────────────────────────────────────

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] as const },
});

// ─── Shared card shell ────────────────────────────────────────────────────────

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-xl ${className}`}
      style={{ background: "#111115", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-medium text-[#444] uppercase tracking-[0.07em]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {children}
    </p>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, icon, delay }: StatCardProps) {
  return (
    <motion.div {...fadeUp(delay)}>
      <Card className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.04)", color: "#555" }}
          >
            {icon}
          </div>
          <ArrowUpRight size={12} className="text-[#333] mt-0.5" />
        </div>
        <p
          className="text-[22px] font-semibold text-white mb-0.5 tabular-nums"
          style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.02em" }}
        >
          {value}
        </p>
        <p className="text-[12px] text-[#555]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{label}</p>
        <p className="text-[11px] text-[#8b5cf6] mt-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>{sub}</p>
      </Card>
    </motion.div>
  );
}

// ─── Donut ────────────────────────────────────────────────────────────────────

function DonutChart() {
  const segments = [
    { label: "Competitors", pct: 53, color: "#7c3aed" },
    { label: "Task Flow",   pct: 24, color: "#6d28d9" },
    { label: "User Journey",pct: 23, color: "#4c1d95" },
  ];
  const r = 36;
  const circ = 2 * Math.PI * r;
  let offset = 0;

  return (
    <Card className="p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <SectionLabel>AI Reports</SectionLabel>
        <button
          className="w-6 h-6 rounded-md flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <Plus size={11} className="text-[#555]" />
        </button>
      </div>
      <div className="flex items-center gap-5">
        <div className="relative shrink-0">
          <svg width="80" height="80" viewBox="0 0 84 84">
            <circle cx="42" cy="42" r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="10" />
            {segments.map((seg) => {
              const dash = (seg.pct / 100) * circ;
              const el = (
                <circle key={seg.label} cx="42" cy="42" r={r} fill="none"
                  stroke={seg.color} strokeWidth="10"
                  strokeDasharray={`${dash} ${circ}`}
                  strokeDashoffset={-offset}
                  style={{ transform: "rotate(-90deg)", transformOrigin: "42px 42px" }} />
              );
              offset += dash;
              return el;
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap size={14} className="text-[#8b5cf6]" />
          </div>
        </div>
        <div className="flex flex-col gap-2 flex-1">
          {segments.map((seg) => (
            <div key={seg.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: seg.color }} />
                <span className="text-[12px] text-[#555]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{seg.label}</span>
              </div>
              <span className="text-[12px] font-medium text-[#888] tabular-nums" style={{ fontFamily: "'DM Mono', monospace" }}>
                {seg.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

// ─── Passing Rate ─────────────────────────────────────────────────────────────

function PassingRate() {
  const points = [30,55,40,70,45,80,35,65,50,75,42,68,55,78,48,62,70,45,58,80,52,65,72,50,68];
  const max = Math.max(...points);
  const w = 220; const h = 60;
  const coords = points.map((v, i) => `${(i / (points.length - 1)) * w},${h - (v / max) * (h - 6)}`).join(" ");

  return (
    <Card className="p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <SectionLabel>Passing Rate</SectionLabel>
        <Star size={12} className="text-[#333]" />
      </div>
      <div className="grid grid-cols-3 gap-x-2 gap-y-0.5 mb-4">
        {([["28%","Failed","#e879f9"],["61%","Complete","#a3a3a3"],["11%","Partial","#525252"]] as const).map(([val, lbl, col]) => (
          <div key={lbl}>
            <p className="text-[18px] font-semibold tabular-nums" style={{ color: col, fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.02em" }}>
              {val}
            </p>
            <p className="text-[11px] text-[#3a3a3a]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{lbl}</p>
          </div>
        ))}
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: 44 }}>
        <polyline
          points={coords}
          fill="none"
          stroke="rgba(139,92,246,0.4)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </Card>
  );
}

// ─── Project Time ─────────────────────────────────────────────────────────────

function ProjectTime() {
  const bars = [
    { day: "Sun", h: 42 }, { day: "Mon", h: 57 }, { day: "Tue", h: 78 },
    { day: "Wed", h: 100 }, { day: "Thu", h: 68 },
  ];
  return (
    <Card className="p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <SectionLabel>Project Time</SectionLabel>
        <button
          className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-md transition-colors"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
            color: "#555",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Last Week <ChevronRight size={10} />
        </button>
      </div>
      <div className="flex items-end gap-2 h-[84px]">
        {bars.map((b) => (
          <div key={b.day} className="flex flex-col items-center gap-1.5 flex-1">
            <div
              className="w-full rounded-md"
              style={{
                height: (b.h / 100) * 68,
                background: b.day === "Wed"
                  ? "rgba(139,92,246,0.25)"
                  : "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.04)",
              }}
            />
            <span className="text-[10px] text-[#3a3a3a]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{b.day}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Quest Card ───────────────────────────────────────────────────────────────

function QuestCard({ quest }: { quest: Quest }) {
  const p = PRIORITY_META[quest.priority];
  return (
    <div
      className="p-3.5 rounded-lg cursor-pointer group transition-colors"
      style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div className="flex items-start justify-between mb-2.5">
        <div className="flex-1 min-w-0 pr-3">
          <p className="text-[13px] font-medium text-[#ccc] truncate mb-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {quest.title}
          </p>
          <p className="text-[11px] text-[#3d3d3d]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{quest.category}</p>
        </div>
        <span
          className="text-[10px] font-medium px-2 py-0.5 rounded-[4px] shrink-0"
          style={{ background: p.bg, color: p.color, fontFamily: "'DM Sans', sans-serif" }}
        >
          {p.label}
        </span>
      </div>

      <div className="mb-2.5">
        <div className="flex justify-between mb-1">
          <span className="text-[10px] text-[#333]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Progress</span>
          <span className="text-[10px] text-[#555] tabular-nums" style={{ fontFamily: "'DM Mono', monospace" }}>{quest.progress}%</span>
        </div>
        <div className="w-full h-1 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div
            className="h-full rounded-full"
            style={{ width: `${quest.progress}%`, background: "rgba(139,92,246,0.6)" }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[10px] text-[#3a3a3a]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <Clock size={9} />{quest.due}
        </div>
        <div className="flex items-center gap-1 text-[10px] text-[#555]" style={{ fontFamily: "'DM Mono', monospace" }}>
          <Zap size={9} />+{quest.xp} XP
        </div>
      </div>
    </div>
  );
}

// ─── Inbox Item ───────────────────────────────────────────────────────────────

function InboxItem({ item }: { item: Activity }) {
  return (
    <div className="flex items-start gap-3 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <img
        src={item.avatar}
        alt=""
        className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
        style={{ border: "1px solid rgba(255,255,255,0.08)" }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <p className="text-[12px] font-medium text-[#999] truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.name}</p>
          {item.xp && (
            <span className="text-[10px] text-[#8b5cf6] shrink-0 tabular-nums" style={{ fontFamily: "'DM Mono', monospace" }}>
              +{item.xp}
            </span>
          )}
        </div>
        <p className="text-[11px] text-[#3d3d3d] line-clamp-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          {item.action}
        </p>
        <p className="text-[10px] text-[#2e2e2e] mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.time}</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardHome() {
  return (
    <div className="min-h-full p-6 lg:p-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* Header */}
      <motion.div {...fadeUp(0)} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-[11px] text-[#444] uppercase tracking-[0.07em] mb-1">Welcome back</p>
          <h1
            className="text-[26px] font-semibold text-white"
            style={{ letterSpacing: "-0.02em", fontFamily: "'DM Sans', sans-serif" }}
          >
            Ethan
          </h1>
        </div>
        <button
          className="self-start sm:self-auto flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-medium text-white transition-opacity hover:opacity-80"
          style={{
            background: "#7c3aed",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <Plus size={13} /> Add Quest
        </button>
      </motion.div>

      {/* Stats — 2 cols on mobile, 4 on lg */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total XP" value="12,847" sub="↑ 340 this week" icon={<Zap size={14} />} delay={0.04} />
        <StatCard label="Current Streak" value="14 days" sub="Best: 21 days" icon={<Flame size={14} />} delay={0.07} />
        <StatCard label="Active Quests" value="7" sub="3 due this week" icon={<Swords size={14} />} delay={0.1} />
        <StatCard label="Global Rank" value="#284" sub="Top 2% this season" icon={<Trophy size={14} />} delay={0.13} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        <motion.div {...fadeUp(0.15)} className="h-full"><DonutChart /></motion.div>
        <motion.div {...fadeUp(0.18)} className="h-full"><PassingRate /></motion.div>
        <motion.div {...fadeUp(0.21)} className="sm:col-span-2 lg:col-span-1 h-full"><ProjectTime /></motion.div>
      </div>

      {/* Bottom panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">

        {/* Quest Manager */}
        <motion.div {...fadeUp(0.22)} className="lg:col-span-5">
          <Card className="p-5 h-full">
            <div className="flex items-center justify-between mb-4">
              <div>
                <SectionLabel>Quest Manager</SectionLabel>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden sm:block text-[11px] text-[#333]" style={{ fontFamily: "'DM Mono', monospace" }}>
                  Mar 2025
                </span>
                <button
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[12px] font-medium text-white"
                  style={{ background: "#7c3aed", fontFamily: "'DM Sans', sans-serif" }}
                >
                  <Plus size={10} /> Add Task
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {QUESTS.map((q) => <QuestCard key={q.id} quest={q} />)}
            </div>
          </Card>
        </motion.div>

        {/* Skill Tree */}
        <motion.div {...fadeUp(0.25)} className="lg:col-span-3">
          <Card className="p-5 h-full">
            <div className="flex items-center justify-between mb-5">
              <SectionLabel>Skill Tree</SectionLabel>
              <Target size={12} className="text-[#333]" />
            </div>
            <div className="flex flex-col gap-4">
              {SKILL_BARS.map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.06 }}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[12px] text-[#555]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{s.label}</span>
                    <span className="text-[11px] text-[#444] tabular-nums" style={{ fontFamily: "'DM Mono', monospace" }}>{s.pct}</span>
                  </div>
                  <div className="h-1 w-full rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${s.pct}%` }}
                      transition={{ duration: 0.8, delay: 0.45 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                      style={{ background: "rgba(139,92,246,0.7)" }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Level progress */}
            <div className="mt-6 pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[12px] text-[#555]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Level 7 → 8</span>
                <span className="text-[11px] text-[#444] tabular-nums" style={{ fontFamily: "'DM Mono', monospace" }}>3,800 / 5,000</span>
              </div>
              <div className="h-1.5 w-full rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "76%" }}
                  transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  style={{ background: "rgba(139,92,246,0.8)" }}
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Inboxes */}
        <motion.div {...fadeUp(0.28)} className="lg:col-span-4">
          <Card className="p-5 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <SectionLabel>Inbox</SectionLabel>
                <span
                  className="text-[10px] font-medium px-1.5 py-0.5 rounded-[4px] tabular-nums"
                  style={{ background: "rgba(255,255,255,0.06)", color: "#555", fontFamily: "'DM Mono', monospace" }}
                >
                  16
                </span>
              </div>
              <button className="text-[11px] text-[#555] hover:text-[#888] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                View all
              </button>
            </div>

            {/* Search */}
            <div
              className="flex items-center gap-2 px-2.5 py-2 rounded-md mb-4"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none" className="text-[#333] shrink-0">
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="text-[12px] text-[#2e2e2e]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Search messages…
              </span>
            </div>

            {/* Items */}
            <div className="flex-1">
              {ACTIVITY.map((item) => <InboxItem key={item.id} item={item} />)}
            </div>

            {/* Compose */}
            <div
              className="mt-3 flex items-center gap-2 px-3 py-2 rounded-md"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <span className="text-[12px] text-[#2e2e2e] flex-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Send later…
              </span>
              <button
                className="w-6 h-6 rounded-md flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <ArrowUpRight size={10} className="text-[#444]" />
              </button>
            </div>
          </Card>
        </motion.div>

      </div>
    </div>
  );
}