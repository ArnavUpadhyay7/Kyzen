import { create } from "zustand";
import api from "../lib/axios";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Difficulty = "E" | "M" | "H";

export interface Task {
  id: string;
  title: string;
  difficulty: Difficulty;
  completed: boolean;
  completedAt?: string;
  xpReward: number;
}

export interface DashboardData {
  username: string;
  avatarUrl?: string;
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXPForLevel: number;
  streak: number;
  todayStats: {
    totalTasks: number;
    completedTasks: number;
    xpEarned: number;
  };
  contributionGraph: { date: string; count: number }[];
}

interface DashboardStore {
  dashboard: DashboardData | null;
  tasks: Task[];
  loading: boolean;
  error: string | null;
  xpPopup: number | null; // XP gained to show in popup

  fetchDashboard: () => Promise<void>;
  fetchTasks: () => Promise<void>;
  createTask: (title: string, difficulty: Difficulty) => Promise<void>;
  updateTask: (id: string, data: Partial<Pick<Task, "title" | "difficulty">>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  clearXpPopup: () => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  dashboard: null,
  tasks: [],
  loading: false,
  error: null,
  xpPopup: null,

  fetchDashboard: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get<DashboardData>("/dashboard");
      set({ dashboard: data });
    } catch {
      set({ error: "Failed to load dashboard" });
    } finally {
      set({ loading: false });
    }
  },

  fetchTasks: async () => {
    try {
      const { data } = await api.get<Task[]>("/tasks");
      set({ tasks: data });
    } catch {
      set({ error: "Failed to load tasks" });
    }
  },

  createTask: async (title, difficulty) => {
    try {
      const { data } = await api.post<Task>("/tasks", { title, difficulty });
      set((s) => ({ tasks: [...s.tasks, data] }));
    } catch {
      set({ error: "Failed to create task" });
    }
  },

  updateTask: async (id, updates) => {
    try {
      const { data } = await api.patch<Task>(`/tasks/${id}`, updates);
      set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? data : t)) }));
    } catch {
      set({ error: "Failed to update task" });
    }
  },

  deleteTask: async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }));
    } catch {
      set({ error: "Failed to delete task" });
    }
  },

  completeTask: async (id) => {
    try {
      const { data } = await api.post<{ xpGained: number; dashboard: DashboardData }>(
        `/tasks/${id}/complete`
      );
      set((s) => ({
        tasks: s.tasks.map((t) => (t.id === id ? { ...t, completed: true } : t)),
        dashboard: data.dashboard,
        xpPopup: data.xpGained,
      }));
      // Mark task complete locally even without API response shape
    } catch {
      // Optimistic fallback
      const task = get().tasks.find((t) => t.id === id);
      if (task) {
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, completed: true } : t)),
          xpPopup: task.xpReward ?? 50,
        }));
      }
    }
  },

  clearXpPopup: () => set({ xpPopup: null }),
}));