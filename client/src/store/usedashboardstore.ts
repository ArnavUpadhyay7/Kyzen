import { create } from "zustand";
import api from "../lib/axios";

// ─── Public Types ─────────────────────────────────────────────────────────────

export type Difficulty = "EASY" | "MEDIUM" | "HARD";

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

// ─── Raw Backend Shapes ───────────────────────────────────────────────────────

interface RawUser {
  level: number;
  currentXP: number;
  totalXP: number;
  streak: number;
  username?: string;
  name?: string;
  email?: string;
}

interface RawDashboard {
  user: RawUser;
  xpRequired: number;
  xpRemaining: number;
  todayStats: {
    totalTasks: number;
    completedTasks: number;
    xpEarnedToday: number;
  };
  contributionGraph: Record<string, number>;
}

interface RawTask {
  id: string;
  title: string;
  difficulty: string; // intentionally loose — normalized in mapTask
  status: "ACTIVE" | "COMPLETED";
  completedAt?: string | null;
  xpReward?: number;
  createdAt: string;
}

interface CompleteTaskResponse {
  xpGained?: number;
  xp?: number;
  task?: RawTask;
  dashboard?: RawDashboard;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const XP_MAP: Record<Difficulty, number> = { EASY: 30, MEDIUM: 60, HARD: 100 };
const VALID_DIFFICULTIES: Difficulty[]   = ["EASY", "MEDIUM", "HARD"];

/**
 * Normalize any difficulty string the backend might send.
 * Handles "EASY"/"Easy"/"easy"/"E"/"M"/"H" gracefully.
 */
function normalizeDifficulty(raw: string): Difficulty {
  const upper = raw?.toUpperCase() ?? "";
  if (upper === "E" || upper === "EASY")   return "EASY";
  if (upper === "M" || upper === "MEDIUM") return "MEDIUM";
  if (upper === "H" || upper === "HARD")   return "HARD";
  if (VALID_DIFFICULTIES.includes(upper as Difficulty)) return upper as Difficulty;
  return "MEDIUM"; // safe fallback — never crashes DiffBadge
}

/**
 * Extract a display name from whatever the backend user object contains.
 */
function resolveUsername(user: RawUser): string {
  return user.username ?? user.name ?? user.email?.split("@")[0] ?? "You";
}

/**
 * The backend may return tasks as:
 *   - RawTask[]            (bare array)
 *   - { tasks: RawTask[] } (wrapped)
 *   - { task: RawTask }    (single, e.g. create/update)
 * This normalizes all three into RawTask[].
 */
function extractTasks(data: unknown): RawTask[] {
  if (Array.isArray(data)) return data as RawTask[];
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.tasks)) return obj.tasks as RawTask[];
    if (obj.task && typeof obj.task === "object") return [obj.task as RawTask];
  }
  return [];
}

function mapDashboard(raw: RawDashboard): DashboardData {
  const graph = raw.contributionGraph
    ? Object.entries(raw.contributionGraph).map(([date, count]) => ({ date, count }))
    : [];

  return {
    username:        resolveUsername(raw.user),
    level:           raw.user.level           ?? 1,
    currentXP:       raw.user.currentXP       ?? 0,
    totalXPForLevel: raw.xpRequired           ?? 1000,
    xpToNextLevel:   raw.xpRemaining          ?? 1000,
    streak:          raw.user.streak          ?? 0,
    todayStats: {
      totalTasks:     raw.todayStats?.totalTasks     ?? 0,
      completedTasks: raw.todayStats?.completedTasks ?? 0,
      xpEarned:       raw.todayStats?.xpEarnedToday  ?? 0,
    },
    contributionGraph: graph,
  };
}

function mapTask(raw: RawTask): Task {
  const difficulty = normalizeDifficulty(raw.difficulty);
  return {
    id:          raw.id,
    title:       raw.title,
    difficulty,
    completed:   raw.status === "COMPLETED",
    completedAt: raw.completedAt ?? undefined,
    xpReward:    raw.xpReward ?? XP_MAP[difficulty],
  };
}

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
      const { data } = await api.get<RawDashboard>("/dashboard");
      set({ dashboard: mapDashboard(data) });
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
      const { data } = await api.get("/tasks");
      set({ tasks: extractTasks(data).map(mapTask) });
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
    set((s) => ({ tasks: [optimistic, ...s.tasks] }));

    try {
      const { data } = await api.post("/tasks", { title, difficulty });
      const [created] = extractTasks(data);
      if (!created) throw new Error("Empty response from server");
      set((s) => ({
        tasks: s.tasks.map((t) => (t.id === tempId ? mapTask(created) : t)),
      }));
    } catch {
      // Roll back the optimistic entry
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
      const { data } = await api.patch(`/tasks/${id}`, updates);
      const [updated] = extractTasks(data);
      if (updated) {
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? mapTask(updated) : t)),
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
      await api.delete(`/tasks/${id}`);
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
          : t
      ),
    }));

    try {
      const { data } = await api.post<CompleteTaskResponse>(`/tasks/${id}/complete`);

      const xpGained = data.xpGained ?? data.xp ?? task?.xpReward ?? 0;

      set((s) => ({
        tasks: s.tasks.map((t) =>
          t.id === id
            ? data.task
              ? mapTask(data.task)         // use authoritative server record if returned
              : { ...t, completed: true }  // keep optimistic mark otherwise
            : t
        ),
        // Only overwrite dashboard if the backend returned fresh stats
        ...(data.dashboard ? { dashboard: mapDashboard(data.dashboard) } : {}),
        xpPopup: xpGained,
      }));
    } catch {
      // Roll back and still show XP popup for optimistic feel
      set({
        tasks:   previous,
        xpPopup: task?.xpReward ?? null,
        error:   "Failed to complete task.",
      });
    }
  },

  clearXpPopup: () => set({ xpPopup: null }),
}));