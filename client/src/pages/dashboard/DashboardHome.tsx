import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  Plus,
  Zap,
  Trash2,
  Pencil,
  CheckCircle2,
  X,
  ChevronDown,
  History,
  Circle,
  Sword,
  Shield,
  Star,
} from "lucide-react";
import { useDashboardStore, type Difficulty, type Task } from "../../store/usedashboardstore";

// ─── Constants ────────────────────────────────────────────────────────────────

const DIFF_META: Record<Difficulty, { label: string; color: string; bg: string; xp: number }> = {
  E: { label: "Easy",   color: "#4ade80", bg: "rgba(74,222,128,0.10)",  xp: 30  },
  M: { label: "Medium", color: "#facc15", bg: "rgba(250,204,21,0.10)",  xp: 60  },
  H: { label: "Hard",   color: "#f87171", bg: "rgba(248,113,113,0.10)", xp: 100 },
};

const CHARACTER_TITLES: Record<number, { title: string; icon: React.ReactNode }> = {
  1: { title: "Novice",      icon: <Circle size={28} className="text-[#6366f1]" /> },
  2: { title: "Apprentice",  icon: <Star size={28} className="text-[#6366f1]" /> },
  3: { title: "Adept",       icon: <Shield size={28} className="text-[#6366f1]" /> },
  4: { title: "Veteran",     icon: <Sword size={28} className="text-[#6366f1]" /> },
  5: { title: "Champion",    icon: <Sword size={28} className="text-[#a78bfa]" /> },
};
function getCharacter(level: number) {
  return CHARACTER_TITLES[Math.min(level, 5)] ?? CHARACTER_TITLES[5];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function groupByDate(tasks: Task[]): Record<string, Task[]> {
  return tasks
    .filter((t) => t.completed && t.completedAt)
    .reduce<Record<string, Task[]>>((acc, t) => {
      const date = new Date(t.completedAt!).toLocaleDateString("en-US", {
        weekday: "short", month: "short", day: "numeric",
      });
      (acc[date] ??= []).push(t);
      return acc;
    }, {});
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function DiffBadge({ diff }: { diff: Difficulty }) {
  const m = DIFF_META[diff];
  return (
    <span
      className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md tracking-wide"
      style={{ color: m.color, background: m.bg, fontFamily: "'DM Mono', monospace" }}
    >
      {m.label}
    </span>
  );
}

function XpPopup({ xp, onDone }: { xp: number; onDone: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onAnimationComplete={onDone}
    >
      <motion.div
        className="flex items-center gap-2 px-6 py-3 rounded-2xl text-white font-bold text-2xl"
        style={{
          background: "rgba(99,102,241,0.18)",
          border: "1px solid rgba(139,92,246,0.4)",
          backdropFilter: "blur(12px)",
          fontFamily: "'DM Sans', sans-serif",
          letterSpacing: "-0.02em",
        }}
        initial={{ scale: 0.6, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: -20, opacity: 1 }}
        exit={{ scale: 0.8, y: -60, opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        onAnimationComplete={onDone}
      >
        <Zap size={20} className="text-[#a78bfa]" />
        +{xp} XP
      </motion.div>
    </motion.div>
  );
}

function HistoryModal({ tasks, onClose }: { tasks: Task[]; onClose: () => void }) {
  const grouped = groupByDate(tasks);
  const dates = Object.keys(grouped).reverse();

  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-md rounded-2xl p-6 overflow-y-auto max-h-[80vh]"
        style={{ background: "#111115", border: "1px solid rgba(255,255,255,0.08)" }}
        initial={{ scale: 0.94, y: 16, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.94, y: 8, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2
            className="text-base font-semibold text-white"
            style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.02em" }}
          >
            Task History
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <X size={13} className="text-[#666]" />
          </button>
        </div>

        {dates.length === 0 ? (
          <p className="text-[13px] text-[#444] text-center py-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            No completed tasks yet.
          </p>
        ) : (
          <div className="flex flex-col gap-5">
            {dates.map((date) => (
              <div key={date}>
                <p
                  className="text-[10px] uppercase tracking-widest text-[#444] mb-2"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  {date}
                </p>
                <div className="flex flex-col gap-1.5">
                  {grouped[date].map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between px-3 py-2 rounded-lg"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
                    >
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 size={13} className="text-[#6366f1] shrink-0" />
                        <span
                          className="text-[13px] text-[#777] line-through"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {t.title}
                        </span>
                      </div>
                      <DiffBadge diff={t.difficulty} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function DashboardHome() {
  const {
    dashboard, tasks, xpPopup,
    fetchDashboard, fetchTasks,
    createTask, updateTask, deleteTask, completeTask,
    clearXpPopup,
  } = useDashboardStore();

  // Local UI state
  const [newTitle, setNewTitle] = useState("");
  const [newDiff, setNewDiff] = useState<Difficulty>("M");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDiff, setEditDiff] = useState<Difficulty>("M");
  const [showHistory, setShowHistory] = useState(false);
  const [diffOpen, setDiffOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchDashboard();
    fetchTasks();
  }, []);

  // Auto-clear popup
  useEffect(() => {
    if (xpPopup) {
      const t = setTimeout(clearXpPopup, 1600);
      return () => clearTimeout(t);
    }
  }, [xpPopup]);

  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  const xpPct = dashboard
    ? Math.round((dashboard.currentXP / dashboard.totalXPForLevel) * 100)
    : 0;

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    createTask(trimmed, newDiff);
    setNewTitle("");
  }

  function startEdit(task: Task) {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDiff(task.difficulty);
  }

  function handleEditSave(id: string) {
    updateTask(id, { title: editTitle.trim(), difficulty: editDiff });
    setEditingId(null);
  }

  // Contribution graph (last 12 weeks × 7 days)
  const today = new Date();
  const graphCells = Array.from({ length: 84 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (83 - i));
    const iso = d.toISOString().slice(0, 10);
    const entry = dashboard?.contributionGraph?.find((c) => c.date === iso);
    return { iso, count: entry?.count ?? 0 };
  });

  function cellColor(count: number) {
    if (count === 0) return "rgba(255,255,255,0.05)";
    if (count < 2) return "rgba(99,102,241,0.25)";
    if (count < 4) return "rgba(99,102,241,0.50)";
    if (count < 6) return "rgba(99,102,241,0.75)";
    return "#6366f1";
  }

  return (
    <div
      className="min-h-screen p-4 md:p-6 lg:p-8"
      style={{ background: "#0c0c0f", fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* ── XP Popup ── */}
      <AnimatePresence>
        {xpPopup && <XpPopup xp={xpPopup} onDone={clearXpPopup} />}
      </AnimatePresence>

      {/* ── History Modal ── */}
      <AnimatePresence>
        {showHistory && (
          <HistoryModal tasks={tasks} onClose={() => setShowHistory(false)} />
        )}
      </AnimatePresence>

      {/* ── Top Header ── */}
      <motion.header
        className="flex items-center gap-4 mb-8"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-sm"
          style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
        >
          {dashboard?.username?.[0]?.toUpperCase() ?? "K"}
        </div>

        {/* Name + level */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="text-[15px] font-semibold text-white truncate"
              style={{ letterSpacing: "-0.01em" }}
            >
              {dashboard?.username ?? "Kyzen"}
            </span>
            <span
              className="text-[10px] font-medium px-2 py-0.5 rounded-full"
              style={{
                background: "rgba(99,102,241,0.15)",
                border: "1px solid rgba(99,102,241,0.25)",
                color: "#818cf8",
                fontFamily: "'DM Mono', monospace",
              }}
            >
              LVL {dashboard?.level ?? 1}
            </span>
            <span
              className="hidden sm:flex items-center gap-1 text-[11px] text-[#f97316]"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              <Flame size={12} className="text-[#f97316]" />
              {dashboard?.streak ?? 0}
            </span>
          </div>

          {/* XP Bar */}
          <div className="flex items-center gap-2">
            <div
              className="flex-1 h-1.5 rounded-full overflow-hidden"
              style={{ background: "rgba(255,255,255,0.07)" }}
            >
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${xpPct}%` }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                style={{ background: "linear-gradient(90deg, #6366f1, #a78bfa)" }}
              />
            </div>
            <span
              className="text-[10px] shrink-0"
              style={{ color: "#555", fontFamily: "'DM Mono', monospace" }}
            >
              {dashboard ? `${dashboard.xpToNextLevel} XP left` : "─"}
            </span>
          </div>
        </div>
      </motion.header>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* ═══════════════════════════════════ LEFT ═══════════════════════════ */}
        <div className="lg:col-span-8 flex flex-col gap-4">

          {/* ── Task Section ── */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl p-5"
            style={{ background: "#111115", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <p
              className="text-[11px] uppercase tracking-[0.07em] text-[#444] mb-4"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              Active Quests
            </p>

            {/* Inline create */}
            <form onSubmit={handleCreate} className="flex items-center gap-2 mb-4">
              <input
                ref={inputRef}
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Add a new task…"
                className="flex-1 bg-transparent text-[13px] text-white placeholder:text-[#333] outline-none rounded-lg px-3 py-2"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              />

              {/* Difficulty picker */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDiffOpen((v) => !v)}
                  className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-[12px] transition-colors"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    color: DIFF_META[newDiff].color,
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  {DIFF_META[newDiff].label}
                  <ChevronDown size={11} />
                </button>
                <AnimatePresence>
                  {diffOpen && (
                    <motion.div
                      className="absolute right-0 top-full mt-1 rounded-xl z-20 overflow-hidden"
                      style={{ background: "#18181c", border: "1px solid rgba(255,255,255,0.09)", minWidth: 100 }}
                      initial={{ opacity: 0, y: -4, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                    >
                      {(["E", "M", "H"] as Difficulty[]).map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => { setNewDiff(d); setDiffOpen(false); }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-[12px] transition-colors hover:bg-white/5"
                          style={{ color: DIFF_META[d].color, fontFamily: "'DM Mono', monospace" }}
                        >
                          {DIFF_META[d].label}
                          <span className="ml-auto text-[10px] text-[#444]">+{DIFF_META[d].xp}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                type="submit"
                disabled={!newTitle.trim()}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-opacity disabled:opacity-30"
                style={{ background: "#6366f1" }}
              >
                <Plus size={14} className="text-white" />
              </button>
            </form>

            {/* Task list */}
            <div className="flex flex-col gap-2">
              <AnimatePresence initial={false}>
                {activeTasks.length === 0 && (
                  <p
                    className="text-[13px] text-center py-6 text-[#333]"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    All caught up ✦
                  </p>
                )}
                {activeTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {editingId === task.id ? (
                      /* Edit row */
                      <div
                        className="flex items-center gap-2 p-3 rounded-xl"
                        style={{ background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.2)" }}
                      >
                        <input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleEditSave(task.id)}
                          autoFocus
                          className="flex-1 bg-transparent text-[13px] text-white outline-none"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        />
                        {(["E", "M", "H"] as Difficulty[]).map((d) => (
                          <button
                            key={d}
                            onClick={() => setEditDiff(d)}
                            className="text-[10px] px-1.5 py-0.5 rounded-md transition-opacity"
                            style={{
                              color: DIFF_META[d].color,
                              background: editDiff === d ? DIFF_META[d].bg : "transparent",
                              opacity: editDiff === d ? 1 : 0.4,
                              fontFamily: "'DM Mono', monospace",
                            }}
                          >
                            {DIFF_META[d].label}
                          </button>
                        ))}
                        <button
                          onClick={() => handleEditSave(task.id)}
                          className="text-[11px] px-2.5 py-1 rounded-lg text-white"
                          style={{ background: "#6366f1", fontFamily: "'DM Sans', sans-serif" }}
                        >
                          Save
                        </button>
                        <button onClick={() => setEditingId(null)}>
                          <X size={13} className="text-[#555]" />
                        </button>
                      </div>
                    ) : (
                      /* Normal row */
                      <div
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl group transition-colors"
                        style={{
                          background: "rgba(255,255,255,0.025)",
                          border: "1px solid rgba(255,255,255,0.05)",
                        }}
                      >
                        {/* Complete btn */}
                        <button
                          onClick={() => completeTask(task.id)}
                          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors group/cb"
                          style={{ border: "1.5px solid rgba(99,102,241,0.4)" }}
                          title="Complete"
                        >
                          <CheckCircle2
                            size={13}
                            className="text-[#6366f1] opacity-0 group-hover/cb:opacity-100 transition-opacity"
                          />
                        </button>

                        <span
                          className="flex-1 text-[13px] text-[#bbb] truncate"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {task.title}
                        </span>

                        <DiffBadge diff={task.difficulty} />

                        <span
                          className="text-[10px] text-[#444] hidden sm:block"
                          style={{ fontFamily: "'DM Mono', monospace" }}
                        >
                          +{DIFF_META[task.difficulty].xp}
                        </span>

                        {/* Actions (shown on hover) */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => startEdit(task)}
                            className="w-6 h-6 rounded-md flex items-center justify-center"
                            style={{ background: "rgba(255,255,255,0.05)" }}
                            title="Edit"
                          >
                            <Pencil size={10} className="text-[#555]" />
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="w-6 h-6 rounded-md flex items-center justify-center"
                            style={{ background: "rgba(248,113,113,0.08)" }}
                            title="Delete"
                          >
                            <Trash2 size={10} className="text-[#f87171]" />
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.section>

          {/* ── History ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-between px-5 py-3 rounded-2xl cursor-pointer group transition-colors"
            style={{
              background: "#111115",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
            onClick={() => setShowHistory(true)}
          >
            <div className="flex items-center gap-2.5">
              <History size={14} className="text-[#555] group-hover:text-[#818cf8] transition-colors" />
              <span
                className="text-[13px] text-[#555] group-hover:text-[#999] transition-colors"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                View History
              </span>
              {completedTasks.length > 0 && (
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full"
                  style={{
                    background: "rgba(99,102,241,0.12)",
                    color: "#818cf8",
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  {completedTasks.length} completed
                </span>
              )}
            </div>
            <ChevronDown size={13} className="text-[#333] group-hover:text-[#555] transition-colors -rotate-90" />
          </motion.div>

          {/* ── Contribution Graph ── */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl p-5"
            style={{ background: "#111115", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <p
              className="text-[11px] uppercase tracking-[0.07em] text-[#444] mb-4"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              Activity
            </p>
            <div
              className="grid gap-1"
              style={{ gridTemplateColumns: "repeat(12, 1fr)" }}
            >
              {graphCells.map((cell, i) => (
                <div
                  key={i}
                  title={`${cell.iso}: ${cell.count} tasks`}
                  className="rounded-sm aspect-square"
                  style={{ background: cellColor(cell.count) }}
                />
              ))}
            </div>
            <div className="flex items-center gap-1.5 mt-3 justify-end">
              <span className="text-[10px] text-[#333]" style={{ fontFamily: "'DM Mono', monospace" }}>Less</span>
              {[0, 1, 3, 5, 7].map((n) => (
                <div key={n} className="w-2.5 h-2.5 rounded-sm" style={{ background: cellColor(n) }} />
              ))}
              <span className="text-[10px] text-[#333]" style={{ fontFamily: "'DM Mono', monospace" }}>More</span>
            </div>
          </motion.section>
        </div>

        {/* ═══════════════════════════════════ RIGHT ══════════════════════════ */}
        <div className="lg:col-span-4 flex flex-col gap-4">

          {/* ── Character Card ── */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl p-5"
            style={{ background: "#111115", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <p
              className="text-[11px] uppercase tracking-[0.07em] text-[#444] mb-4"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              Character
            </p>
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}
              >
                {getCharacter(dashboard?.level ?? 1).icon}
              </div>
              <div>
                <p
                  className="text-[16px] font-semibold text-white mb-0.5"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  {getCharacter(dashboard?.level ?? 1).title}
                </p>
                <p className="text-[12px] text-[#444]" style={{ fontFamily: "'DM Mono', monospace" }}>
                  Level {dashboard?.level ?? 1}
                </p>
              </div>
            </div>

            {/* XP progress */}
            <div className="mt-4">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[11px] text-[#444]" style={{ fontFamily: "'DM Mono', monospace" }}>
                  {dashboard?.currentXP ?? 0} / {dashboard?.totalXPForLevel ?? 1000} XP
                </span>
                <span className="text-[11px] text-[#6366f1]" style={{ fontFamily: "'DM Mono', monospace" }}>
                  {xpPct}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpPct}%` }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  style={{ background: "linear-gradient(90deg, #6366f1, #a78bfa)" }}
                />
              </div>
            </div>
          </motion.section>

          {/* ── Today Summary ── */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl p-5"
            style={{ background: "#111115", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <p
              className="text-[11px] uppercase tracking-[0.07em] text-[#444] mb-4"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              Today
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Tasks",     value: dashboard?.todayStats.totalTasks ?? activeTasks.length },
                { label: "Done",      value: dashboard?.todayStats.completedTasks ?? completedTasks.length },
                { label: "XP Earned", value: dashboard?.todayStats.xpEarned ?? 0 },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="rounded-xl p-3 text-center"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <p
                    className="text-[18px] font-semibold text-white"
                    style={{ letterSpacing: "-0.02em", fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {value}
                  </p>
                  <p className="text-[10px] text-[#3a3a3a] mt-0.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* ── XP Remaining ── */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl p-5 flex items-center gap-3"
            style={{ background: "#111115", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "rgba(167,139,250,0.10)" }}
            >
              <Zap size={15} className="text-[#a78bfa]" />
            </div>
            <div>
              <p
                className="text-[15px] font-semibold text-white"
                style={{ letterSpacing: "-0.02em" }}
              >
                {dashboard?.xpToNextLevel ?? "─"} XP
              </p>
              <p className="text-[11px] text-[#444]" style={{ fontFamily: "'DM Mono', monospace" }}>
                to reach Level {(dashboard?.level ?? 1) + 1}
              </p>
            </div>
            {dashboard && (
              <div className="ml-auto flex items-center gap-1 text-[#f97316]">
                <Flame size={13} />
                <span className="text-[12px] font-medium" style={{ fontFamily: "'DM Mono', monospace" }}>
                  {dashboard.streak}
                </span>
              </div>
            )}
          </motion.section>
        </div>
      </div>
    </div>
  );
}