import { create } from "zustand";
import { dashboardApi, type DashboardData } from "../api/dashboard.api";
import { tasksApi, XP_MAP, type Task, type Difficulty } from "../api/tasks.api";

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
      id: tempId,
      title,
      difficulty,
      completed: false,
      xpReward:  XP_MAP[difficulty],
    };

    set((s) => ({ tasks: [optimistic, ...s.tasks] }));

    try {
      const created = await tasksApi.create(title, difficulty);
      set((s) => ({
        tasks: s.tasks.map((t) => (t.id === tempId ? created : t)),
      }));
    } catch {
      set((s) => ({
        tasks: s.tasks.filter((t) => t.id !== tempId),
        error: "Failed to create task.",
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
    const previous = get().tasks;
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }));

    try {
      await tasksApi.delete(id);
    } catch {
      set({ tasks: previous, error: "Failed to delete task." });
    }
  },

  // ── Complete ───────────────────────────────────────────────────────────────

  completeTask: async (id) => {
    const task     = get().tasks.find((t) => t.id === id);
    const previous = get().tasks;

    // Optimistic: mark done immediately
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === id
          ? { ...t, completed: true, completedAt: new Date().toISOString() }
          : t,
      ),
    }));

    try {
      const { task: confirmed, xpGained, dashboard } = await tasksApi.complete(
        id,
        task?.xpReward ?? 0,
      );

      set((s) => ({
        tasks: s.tasks.map((t) =>
          t.id === id
            ? confirmed ?? { ...t, completed: true } // prefer server record; fall back to optimistic
            : t,
        ),
        ...(dashboard ? { dashboard } : {}),
        xpPopup: xpGained,
      }));
    } catch {
      set({
        tasks:   previous,
        xpPopup: task?.xpReward ?? null,
        error:   "Failed to complete task.",
      });
    }
  },

  clearXpPopup: () => set({ xpPopup: null }),
}));