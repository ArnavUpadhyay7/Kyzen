import { create } from "zustand";
import { dashboardApi, localIsoDate, type DashboardData } from "../../api/dashboard.api";
import { tasksApi, XP_MAP, type Task, type Difficulty } from "../../api/tasks.api";

// Re-export shared types so existing component imports don't break
export type { DashboardData, Task, Difficulty };

// ─── Store Interface ──────────────────────────────────────────────────────────

interface DashboardStore {
  dashboard:    DashboardData | null;
  tasks:        Task[];
  loading:      boolean;
  tasksLoading: boolean;
  error:        string | null;
  xpPopup:      number | null;

  fetchDashboard: () => Promise<void>;
  fetchTasks:     () => Promise<void>;
  createTask:     (title: string, difficulty: Difficulty) => Promise<void>;
  updateTask:     (id: string, data: Partial<Pick<Task, "title" | "difficulty">>) => Promise<void>;
  deleteTask:     (id: string) => Promise<void>;
  completeTask:   (id: string) => Promise<void>;
  clearXpPopup:   () => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Apply earned XP optimistically to the current dashboard snapshot.
 * Handles level-up by carrying over excess XP.
 */
function applyXpToDashboard(
  prev: DashboardData,
  xpGained: number,
): Partial<DashboardData> {
  const newXP      = prev.currentXP + xpGained;
  const levelCap   = prev.totalXPForLevel;
  const didLevelUp = newXP >= levelCap;

  const currentXP     = didLevelUp ? newXP - levelCap : newXP;
  const level         = didLevelUp ? prev.level + 1   : prev.level;
  // Keep totalXPForLevel as-is; server will correct on next fetch
  const xpToNextLevel = Math.max(0, (didLevelUp ? levelCap : prev.xpToNextLevel) - xpGained);

  // Bump today's contribution graph entry using LOCAL date
  const today = localIsoDate();
  const graph  = prev.contributionGraph.map((entry) =>
    entry.date === today
      ? { ...entry, count: entry.count + 1 }
      : entry,
  );
  // If today has no existing entry yet, add it
  if (!prev.contributionGraph.some((e) => e.date === today)) {
    graph.push({ date: today, count: 1 });
  }

  return {
    currentXP,
    level,
    xpToNextLevel,
    contributionGraph: graph,
    todayStats: {
      ...prev.todayStats,
      completedTasks: prev.todayStats.completedTasks + 1,
      xpEarned:       prev.todayStats.xpEarned + xpGained,
    },
  };
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  dashboard:    null,
  tasks:        [],
  loading:      false,
  tasksLoading: false,
  error:        null,
  xpPopup:      null,

  // ── Dashboard ──────────────────────────────────────────────────────────────

  fetchDashboard: async () => {
    set({ loading: true, error: null });
    try {
      const dashboard = await dashboardApi.get();
      set({ dashboard });
    } catch {
      set({ error: "Failed to load dashboard." });
    } finally {
      set({ loading: false });
    }
  },

  // ── Tasks ──────────────────────────────────────────────────────────────────

  fetchTasks: async () => {
    set({ tasksLoading: true, error: null });
    try {
      const tasks = await tasksApi.getAll();
      set({ tasks });
    } catch {
      set({ error: "Failed to load tasks." });
    } finally {
      set({ tasksLoading: false });
    }
  },

  // ── Create ─────────────────────────────────────────────────────────────────

  createTask: async (title, difficulty) => {
    const tempId = `optimistic-${Date.now()}`;
    const optimistic: Task = {
      id:        tempId,
      title,
      difficulty,
      completed: false,
      xpReward:  XP_MAP[difficulty],
    };

    // Optimistically bump today's totalTasks
    set((s) => ({
      tasks: [optimistic, ...s.tasks],
      dashboard: s.dashboard
        ? {
            ...s.dashboard,
            todayStats: {
              ...s.dashboard.todayStats,
              totalTasks: s.dashboard.todayStats.totalTasks + 1,
            },
          }
        : null,
    }));

    try {
      const created = await tasksApi.create(title, difficulty);
      set((s) => ({
        tasks: s.tasks.map((t) => (t.id === tempId ? created : t)),
      }));
    } catch {
      // Roll back task + today counter
      set((s) => ({
        tasks: s.tasks.filter((t) => t.id !== tempId),
        error: "Failed to create task.",
        dashboard: s.dashboard
          ? {
              ...s.dashboard,
              todayStats: {
                ...s.dashboard.todayStats,
                totalTasks: Math.max(0, s.dashboard.todayStats.totalTasks - 1),
              },
            }
          : null,
      }));
    }
  },

  // ── Update ─────────────────────────────────────────────────────────────────

  updateTask: async (id, updates) => {
    const previous = get().tasks;

    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));

    try {
      const updated = await tasksApi.update(id, updates);
      if (updated) {
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? updated : t)),
        }));
      }
    } catch {
      set({ tasks: previous, error: "Failed to update task." });
    }
  },

  // ── Delete ─────────────────────────────────────────────────────────────────

  deleteTask: async (id) => {
    const previous  = get().tasks;
    const wasActive = previous.find((t) => t.id === id && !t.completed);

    set((s) => ({
      tasks: s.tasks.filter((t) => t.id !== id),
      dashboard: s.dashboard && wasActive
        ? {
            ...s.dashboard,
            todayStats: {
              ...s.dashboard.todayStats,
              totalTasks: Math.max(0, s.dashboard.todayStats.totalTasks - 1),
            },
          }
        : s.dashboard,
    }));

    try {
      await tasksApi.delete(id);
    } catch {
      set({ tasks: previous, error: "Failed to delete task." });
      // Restore today counter if we rolled back
      if (wasActive) {
        set((s) => ({
          dashboard: s.dashboard
            ? {
                ...s.dashboard,
                todayStats: {
                  ...s.dashboard.todayStats,
                  totalTasks: s.dashboard.todayStats.totalTasks + 1,
                },
              }
            : null,
        }));
      }
    }
  },

  // ── Complete ───────────────────────────────────────────────────────────────

  completeTask: async (id) => {
    const task      = get().tasks.find((t) => t.id === id);
    const previous  = get().tasks;
    const prevDash  = get().dashboard;
    const xpReward  = task?.xpReward ?? 0;

    // 1. Optimistic: mark task done immediately
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === id
          ? { ...t, completed: true, completedAt: new Date().toISOString() }
          : t,
      ),
    }));

    // 2. Optimistic: update dashboard — XP, level, today stats, graph
    if (prevDash) {
      set((s) => ({
        dashboard: s.dashboard
          ? { ...s.dashboard, ...applyXpToDashboard(s.dashboard, xpReward) }
          : null,
        xpPopup: xpReward,
      }));
    } else {
      set({ xpPopup: xpReward });
    }

    try {
      const { task: confirmed, xpGained, dashboard } = await tasksApi.complete(
        id,
        xpReward,
      );

      set((s) => ({
        tasks: s.tasks.map((t) =>
          t.id === id
            ? confirmed ?? { ...t, completed: true }
            : t,
        ),
        // Prefer authoritative server dashboard; keep optimistic if not returned
        ...(dashboard ? { dashboard } : {}),
        // Show real xpGained from server (overrides optimistic popup if it
        // already cleared; if not yet cleared it stays)
        xpPopup: s.xpPopup !== null ? xpGained : null,
      }));
    } catch {
      // Full rollback
      set({
        tasks:     previous,
        dashboard: prevDash,
        xpPopup:   xpReward,
        error:     "Failed to complete task.",
      });
    }
  },

  clearXpPopup: () => set({ xpPopup: null }),
}));