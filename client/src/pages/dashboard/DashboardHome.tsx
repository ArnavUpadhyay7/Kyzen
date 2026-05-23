import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useDashboardStore, type Difficulty, type Task } from "../../state/dashboard/usedashboardstore";
import ContributionGraph from "../../components/dashboard/ContributionGraph";
import { useAuth } from "../../state/auth/AuthContext";
import character_mascot from "../../assets/logo.png";
import {
  DashboardBadge,
  DashboardButton,
  DashboardCard,
  DashboardInput,
  DashboardProgress,
} from "../../components/dashboard/ui";
import { cn } from "../../lib/utils";

// ─── Constants ────────────────────────────────────────────────────────────────

const DIFF_META: Record<
  Difficulty,
  { label: string; xp: number; badgeVariant: "success" | "warning" | "danger" }
> = {
  EASY: { label: "Easy", xp: 30, badgeVariant: "success" },
  MEDIUM: { label: "Medium", xp: 60, badgeVariant: "warning" },
  HARD: { label: "Hard", xp: 100, badgeVariant: "danger" },
};

const DIFF_TEXT_CLASS: Record<Difficulty, string> = {
  EASY: "text-dash-success",
  MEDIUM: "text-dash-warning",
  HARD: "text-dash-danger",
};

const CHARACTER_TITLES: Record<number, { title: string }> = {
  1: { title: "Novice" },
  2: { title: "Apprentice" },
  3: { title: "Adept" },
  4: { title: "Veteran" },
  5: { title: "Champion" },
};

function getCharacter(level: number) {
  return CHARACTER_TITLES[Math.min(Math.max(level, 1), 5)] ?? CHARACTER_TITLES[1];
}

function groupByDate(tasks: Task[]): Record<string, Task[]> {
  return tasks
    .filter((task) => task.completed && task.completedAt)
    .reduce<Record<string, Task[]>>((acc, task) => {
      const date = new Date(task.completedAt!).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      (acc[date] ??= []).push(task);
      return acc;
    }, {});
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function DiffBadge({ diff }: { diff: Difficulty }) {
  const m = DIFF_META[diff] ?? DIFF_META.MEDIUM;
  return (
    <DashboardBadge variant={m.badgeVariant} className="text-[10px]">
      {m.label}
    </DashboardBadge>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 font-dash-mono text-[11px] uppercase tracking-[0.07em] text-dash-faint">
      {children}
    </p>
  );
}

function XpPopup({ xp, onDone }: { xp: number; onDone: () => void }) {
  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="flex items-center gap-2 rounded-2xl border border-dash-accent-border bg-dash-accent-soft px-6 py-3 font-dash-sans text-2xl font-bold tracking-tight text-dash-primary backdrop-blur-md"
        initial={{ scale: 0.6, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: -20, opacity: 1 }}
        exit={{ scale: 0.8, y: -60, opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        onAnimationComplete={onDone}
      >
        <Zap size={20} className="text-dash-violet" />
        +{xp} XP
      </motion.div>
    </motion.div>
  );
}

function ErrorToast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <motion.div
      className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2.5 rounded-xl border border-dash-danger/25 bg-dash-danger/15 px-4 py-2.5 backdrop-blur-md"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
    >
      <AlertCircle size={13} className="shrink-0 text-dash-danger" />
      <span className="font-dash-sans text-[12px] text-dash-secondary">{message}</span>
      <button type="button" onClick={onDismiss} className="text-dash-faint hover:text-dash-muted">
        <X size={12} />
      </button>
    </motion.div>
  );
}

function HistoryModal({ tasks, onClose }: { tasks: Task[]; onClose: () => void }) {
  const grouped = useMemo(() => groupByDate(tasks), [tasks]);
  const dates = useMemo(() => Object.keys(grouped).reverse(), [grouped]);

  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="max-h-[80vh] w-full max-w-md overflow-y-auto rounded-2xl border border-dash-border bg-dash-modal p-6"
        initial={{ scale: 0.94, y: 16, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.94, y: 8, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-dash-sans text-base font-semibold tracking-tight text-dash-primary">
            Task History
          </h2>
          <DashboardButton variant="muted" size="sm" onClick={onClose} className="h-7 w-7 p-0">
            <X size={13} />
          </DashboardButton>
        </div>
        {dates.length === 0 ? (
          <p className="py-8 text-center font-dash-sans text-[13px] text-dash-faint">
            No completed tasks yet.
          </p>
        ) : (
          <div className="flex flex-col gap-5">
            {dates.map((date) => (
              <div key={date}>
                <p className="mb-2 font-dash-mono text-[10px] uppercase tracking-widest text-dash-faint">
                  {date}
                </p>
                <div className="flex flex-col gap-1.5">
                  {grouped[date].map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between rounded-lg border border-dash-border bg-dash-card-alt px-3 py-2"
                    >
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 size={13} className="shrink-0 text-dash-accent" />
                        <span className="font-dash-sans text-[13px] text-dash-muted line-through">
                          {task.title}
                        </span>
                      </div>
                      <DiffBadge diff={task.difficulty} />
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

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-dash-page p-4 md:p-6 lg:p-8">
      <div className="mb-8 flex items-center gap-4">
        <div className="h-10 w-10 animate-pulse rounded-xl bg-dash-input" />
        <div className="flex flex-1 flex-col gap-2">
          <div className="h-3.5 w-28 animate-pulse rounded bg-dash-input" />
          <div className="h-1.5 w-full animate-pulse rounded-full bg-dash-input" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="flex flex-col gap-4 lg:col-span-8">
          <div className="h-[220px] animate-pulse rounded-2xl bg-dash-card" />
          <div className="h-12 animate-pulse rounded-2xl bg-dash-card" />
          <div className="h-40 animate-pulse rounded-2xl bg-dash-card" />
        </div>
        <div className="flex flex-col gap-4 lg:col-span-4">
          <div className="h-40 animate-pulse rounded-2xl bg-dash-card" />
          <div className="h-28 animate-pulse rounded-2xl bg-dash-card" />
          <div className="h-[72px] animate-pulse rounded-2xl bg-dash-card" />
        </div>
      </div>
    </div>
  );
}

function DifficultyPicker({
  value,
  onChange,
  open,
  onOpenChange,
}: {
  value: Difficulty;
  onChange: (d: Difficulty) => void;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        className={cn(
          "flex items-center gap-1.5 rounded-lg border border-dash-input-border bg-dash-input px-2.5 py-2 font-dash-mono text-[12px] transition-colors",
          DIFF_TEXT_CLASS[value],
        )}
      >
        {DIFF_META[value]?.label ?? "Medium"}
        <ChevronDown size={11} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute right-0 top-full z-20 mt-1 min-w-[100px] overflow-hidden rounded-xl border border-dash-border-med bg-dash-card"
            initial={{ opacity: 0, y: -4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96 }}
            transition={{ duration: 0.15 }}
          >
            {(["EASY", "MEDIUM", "HARD"] as Difficulty[]).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => {
                  onChange(d);
                  onOpenChange(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2 font-dash-mono text-[12px] transition-colors hover:bg-dash-muted-btn-hover",
                  DIFF_TEXT_CLASS[d],
                )}
              >
                {DIFF_META[d].label}
                <span className="ml-auto text-[10px] text-dash-faint">+{DIFF_META[d].xp}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function DashboardHome() {
  const {
    dashboard,
    tasks,
    loading,
    tasksLoading,
    error,
    xpPopup,
    fetchDashboard,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    clearXpPopup,
  } = useDashboardStore();

  const [newTitle, setNewTitle] = useState("");
  const [newDiff, setNewDiff] = useState<Difficulty>("MEDIUM");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDiff, setEditDiff] = useState<Difficulty>("MEDIUM");
  const [showHistory, setShowHistory] = useState(false);
  const [diffOpen, setDiffOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboard();
    fetchTasks();
  }, [fetchDashboard, fetchTasks]);

  useEffect(() => {
    if (error) setToastMsg(error);
  }, [error]);

  useEffect(() => {
    if (xpPopup) {
      const timer = setTimeout(clearXpPopup, 1600);
      return () => clearTimeout(timer);
    }
  }, [xpPopup, clearXpPopup]);

  const activeTasks = useMemo(() => tasks.filter((t) => !t.completed), [tasks]);
  const completedTasks = useMemo(() => tasks.filter((t) => t.completed), [tasks]);

  const displayName = user?.username ?? "User";
  const displayInitial = displayName[0]?.toUpperCase() ?? "K";

  const handleCreate = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = newTitle.trim();
      if (!trimmed) return;
      setNewTitle("");
      await createTask(trimmed, newDiff);
    },
    [newTitle, newDiff, createTask],
  );

  const startEdit = useCallback((task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDiff(task.difficulty);
  }, []);

  const handleEditSave = useCallback(
    async (id: string) => {
      const trimmed = editTitle.trim();
      if (!trimmed) return;
      setEditingId(null);
      await updateTask(id, { title: trimmed, difficulty: editDiff });
    },
    [editTitle, editDiff, updateTask],
  );

  const dismissToast = useCallback(() => setToastMsg(null), []);
  const closeHistory = useCallback(() => setShowHistory(false), []);

  if (loading && !dashboard) return <DashboardSkeleton />;

  return (
    <div className="min-h-screen bg-dash-page p-4 font-dash-sans transition-colors duration-300 md:p-6 lg:p-8">
      <AnimatePresence>
        {xpPopup != null && <XpPopup xp={xpPopup} onDone={clearXpPopup} />}
      </AnimatePresence>
      <AnimatePresence>
        {showHistory && <HistoryModal tasks={tasks} onClose={closeHistory} />}
      </AnimatePresence>
      <AnimatePresence>
        {toastMsg && <ErrorToast message={toastMsg} onDismiss={dismissToast} />}
      </AnimatePresence>

      <motion.header
        className="mb-8 flex items-center gap-4"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-dash-accent to-dash-violet text-sm font-bold text-white">
          {displayInitial}
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center gap-2">
            <span className="truncate text-[15px] font-semibold tracking-tight text-dash-primary">
              {displayName}
            </span>
            <DashboardBadge variant="violet">LVL {dashboard?.level ?? "─"}</DashboardBadge>
            <span className="hidden items-center gap-1 font-dash-mono text-[11px] text-dash-orange sm:flex">
              <Flame size={12} />
              {dashboard?.streak ?? 0}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <DashboardProgress
              value={dashboard?.currentXP ?? 0}
              max={dashboard?.totalXPForLevel || 1}
              className="flex-1"
            />
            <span className="shrink-0 font-dash-mono text-[10px] text-dash-muted">
              {dashboard ? `${dashboard.xpToNextLevel} XP left` : "─"}
            </span>
          </div>
        </div>
      </motion.header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="flex flex-col gap-4 lg:col-span-8">
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <DashboardCard className="rounded-2xl p-5">
              <SectionLabel>Active Quests</SectionLabel>

              <form onSubmit={handleCreate} className="mb-4 flex items-center gap-2">
                <DashboardInput
                  ref={inputRef}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Add a new task…"
                  inputSize="sm"
                  className="flex-1 text-[13px]"
                />
                <DifficultyPicker
                  value={newDiff}
                  onChange={setNewDiff}
                  open={diffOpen}
                  onOpenChange={setDiffOpen}
                />
                <DashboardButton
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={!newTitle.trim()}
                  className="h-9 w-9 p-0"
                >
                  <Plus size={14} />
                </DashboardButton>
              </form>

              <div className="flex flex-col gap-2">
                <AnimatePresence initial={false}>
                  {tasksLoading && activeTasks.length === 0 ? (
                    <div className="flex flex-col gap-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-10 animate-pulse rounded-xl bg-dash-input"
                        />
                      ))}
                    </div>
                  ) : activeTasks.length === 0 ? (
                    <p className="py-6 text-center font-dash-mono text-[13px] text-dash-faint">
                      All caught up ✦
                    </p>
                  ) : (
                    activeTasks.map((task) => (
                      <motion.div
                        key={task.id}
                        layout
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      >
                        {editingId === task.id ? (
                          <div className="flex items-center gap-2 rounded-xl border border-dash-accent-border bg-dash-accent-soft p-3">
                            <DashboardInput
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && handleEditSave(task.id)}
                              inputSize="sm"
                              className="flex-1 border-transparent bg-transparent text-[13px] focus:ring-0"
                              autoFocus
                            />
                            {(["EASY", "MEDIUM", "HARD"] as Difficulty[]).map((d) => (
                              <button
                                key={d}
                                type="button"
                                onClick={() => setEditDiff(d)}
                                className={cn(
                                  "rounded-md px-1.5 py-0.5 font-dash-mono text-[10px] transition-all",
                                  DIFF_TEXT_CLASS[d],
                                  editDiff === d
                                    ? "bg-dash-accent-soft opacity-100"
                                    : "opacity-40",
                                )}
                              >
                                {DIFF_META[d].label}
                              </button>
                            ))}
                            <DashboardButton
                              variant="primary"
                              size="sm"
                              onClick={() => handleEditSave(task.id)}
                            >
                              Save
                            </DashboardButton>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="text-dash-muted hover:text-dash-secondary"
                            >
                              <X size={13} />
                            </button>
                          </div>
                        ) : (
                          <div className="group flex items-center gap-3 rounded-xl border border-dash-border bg-dash-card-alt px-3 py-2.5 transition-colors">
                            <button
                              type="button"
                              onClick={() => completeTask(task.id)}
                              className="group/cb flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-[1.5px] border-dash-accent-border"
                            >
                              <CheckCircle2
                                size={13}
                                className="text-dash-accent opacity-0 transition-opacity group-hover/cb:opacity-100"
                              />
                            </button>
                            <span className="flex-1 truncate text-[13px] text-dash-secondary">
                              {task.title}
                            </span>
                            <DiffBadge diff={task.difficulty} />
                            <span className="hidden font-dash-mono text-[10px] text-dash-faint sm:block">
                              +{task.xpReward}
                            </span>
                            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                              <DashboardButton
                                variant="muted"
                                size="sm"
                                onClick={() => startEdit(task)}
                                className="h-6 w-6 p-0"
                              >
                                <Pencil size={10} />
                              </DashboardButton>
                              <DashboardButton
                                variant="danger"
                                size="sm"
                                onClick={() => deleteTask(task.id)}
                                className="h-6 w-6 p-0"
                              >
                                <Trash2 size={10} />
                              </DashboardButton>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </DashboardCard>
          </motion.section>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <DashboardCard
              hover
              className="flex cursor-pointer items-center justify-between rounded-2xl px-5 py-3"
              onClick={() => setShowHistory(true)}
            >
              <div className="flex items-center gap-2.5">
                <History
                  size={14}
                  className="text-dash-muted transition-colors group-hover:text-dash-violet"
                />
                <span className="text-[13px] text-dash-muted transition-colors">View History</span>
                {completedTasks.length > 0 && (
                  <DashboardBadge variant="violet">{completedTasks.length} completed</DashboardBadge>
                )}
              </div>
              <ChevronDown size={13} className="-rotate-90 text-dash-faint" />
            </DashboardCard>
          </motion.div>

          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <DashboardCard className="rounded-2xl p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-dash-mono text-[11px] uppercase tracking-[0.07em] text-dash-faint">Activity</p>
                <span className="font-dash-mono text-[10px] text-dash-faint">Last 53 weeks</span>
              </div>
              {loading ? (
                <div className="h-32.5 animate-pulse rounded-lg bg-dash-input" />
              ) : (
                <ContributionGraph data={dashboard?.contributionGraph ?? []} />
              )}
            </DashboardCard>
          </motion.section>
        </div>

        <div className="flex flex-col gap-4 lg:col-span-4">
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <DashboardCard className="relative overflow-hidden rounded-2xl">
              <div className="relative z-10 flex items-center justify-between px-5 pt-5">
                <SectionLabel>Character</SectionLabel>
                <div className="flex items-center gap-2">
                  {dashboard && (
                    <div className="flex items-center gap-1 rounded-lg border border-dash-orange/20 bg-dash-orange/10 px-2 py-0.5">
                      <Flame size={10} className="text-dash-orange" />
                      <span className="font-dash-mono text-[10px] font-semibold text-dash-orange">
                        {dashboard.streak}
                      </span>
                    </div>
                  )}
                  <DashboardBadge variant="violet">LVL {dashboard?.level ?? "─"}</DashboardBadge>
                </div>
              </div>

              <div className="relative z-10 flex items-stretch gap-0 px-5 pb-5 pt-4">
                <div className="mr-5 shrink-0">
                  <div className="flex h-25 w-25 items-center justify-center overflow-hidden rounded-3xl border border-dash-accent-border bg-[radial-gradient(ellipse_at_50%_120%,color-mix(in_srgb,var(--dash-accent)_35%,transparent)_0%,var(--dash-page)_60%)]">
                    <img
                      src={character_mascot}
                      alt="character"
                      className="h-[200%] w-full object-contain"
                      draggable={false}
                    />
                  </div>
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div>
                    <p className="mb-1 text-[24px] font-semibold leading-none tracking-tight text-dash-primary">
                      {getCharacter(dashboard?.level ?? 1).title}
                    </p>
                    <p className="font-dash-mono text-[11px] text-dash-faint">
                      Level {dashboard?.level ?? "─"} · {dashboard?.currentXP ?? 0} XP earned
                    </p>
                  </div>

                  <div className="mt-3">
                    <DashboardProgress
                      value={dashboard?.currentXP ?? 0}
                      max={dashboard?.totalXPForLevel || 1}
                      showValue
                      label={`${dashboard?.currentXP ?? 0} / ${dashboard?.totalXPForLevel ?? "─"} XP`}
                    />
                    <p className="mt-1.5 font-dash-mono text-[10px] text-dash-faint">
                      {dashboard?.xpToNextLevel ?? "─"} XP to next level
                    </p>
                  </div>
                </div>
              </div>
            </DashboardCard>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <DashboardCard className="rounded-2xl p-5">
              <SectionLabel>Today</SectionLabel>
              <div className="grid grid-cols-3 gap-3">
                {(
                  [
                    { label: "Tasks", value: dashboard?.todayStats.totalTasks ?? activeTasks.length },
                    { label: "Done", value: dashboard?.todayStats.completedTasks ?? completedTasks.length },
                    { label: "XP", value: dashboard?.todayStats.xpEarned ?? 0 },
                  ] as const
                ).map(({ label, value }) => (
                  <div
                    key={label}
                    className="rounded-xl border border-dash-border bg-dash-card-alt p-3 text-center"
                  >
                    {loading ? (
                      <div className="mx-auto h-5 w-8 animate-pulse rounded bg-dash-input" />
                    ) : (
                      <p className="text-[18px] font-semibold tracking-tight text-dash-primary">{value}</p>
                    )}
                    <p className="mt-0.5 font-dash-mono text-[10px] text-dash-faint">{label}</p>
                  </div>
                ))}
              </div>
            </DashboardCard>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <DashboardCard className="flex items-center gap-3 rounded-2xl px-5 py-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-dash-accent-soft">
                {loading ? (
                  <Loader2 size={15} className="animate-spin text-dash-violet" />
                ) : (
                  <Zap size={15} className="text-dash-violet" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold tracking-tight text-dash-primary">
                  {dashboard?.xpToNextLevel ?? "─"} XP to Level {dashboard ? dashboard.level + 1 : "─"}
                </p>
                <p className="mt-0.5 font-dash-mono text-[10px] text-dash-faint">
                  keep completing quests to rank up
                </p>
              </div>
            </DashboardCard>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
