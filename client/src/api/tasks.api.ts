import api from "../lib/axios";
import { type RawDashboard, mapDashboard, type DashboardData } from "./dashboard.api";

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

export interface CompleteTaskResult {
  task: Task;
  xpGained: number;
  dashboard?: DashboardData;
}

// ─── Raw Backend Shape ────────────────────────────────────────────────────────

interface RawTask {
  id: string;
  title: string;
  difficulty: string; // intentionally loose — normalized in mapTask
  status: "ACTIVE" | "COMPLETED";
  completedAt?: string | null;
  xpReward?: number;
  createdAt: string;
}

interface RawCompleteTaskResponse {
  xpGained?: number;
  xp?: number;
  task?: RawTask;
  dashboard?: RawDashboard;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const XP_MAP: Record<Difficulty, number> = {
  EASY: 30,
  MEDIUM: 60,
  HARD: 100,
};

const VALID_DIFFICULTIES: Difficulty[] = ["EASY", "MEDIUM", "HARD"];

/**
 * Normalize any difficulty string the backend might send.
 * Handles "EASY"/"Easy"/"easy"/"E"/"M"/"H" gracefully.
 */
export function normalizeDifficulty(raw: string): Difficulty {
  const upper = raw?.toUpperCase() ?? "";
  if (upper === "E" || upper === "EASY")   return "EASY";
  if (upper === "M" || upper === "MEDIUM") return "MEDIUM";
  if (upper === "H" || upper === "HARD")   return "HARD";
  if (VALID_DIFFICULTIES.includes(upper as Difficulty)) return upper as Difficulty;
  return "MEDIUM"; // safe fallback — never crashes DiffBadge
}

/**
 * The backend may return tasks as:
 *   - RawTask[]            (bare array)
 *   - { tasks: RawTask[] } (wrapped)
 *   - { task: RawTask }    (single, e.g. create/update)
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

export function mapTask(raw: RawTask): Task {
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

// ─── API ──────────────────────────────────────────────────────────────────────

export const tasksApi = {
  /** GET /tasks */
  getAll: async (): Promise<Task[]> => {
    const { data } = await api.get("/tasks");
    return extractTasks(data).map(mapTask);
  },

  /** POST /tasks */
  create: async (title: string, difficulty: Difficulty): Promise<Task> => {
    const { data } = await api.post("/tasks", { title, difficulty });
    const [created] = extractTasks(data);
    if (!created) throw new Error("Empty response from server");
    return mapTask(created);
  },

  /** PATCH /tasks/:id */
  update: async (
    id: string,
    updates: Partial<Pick<Task, "title" | "difficulty">>,
  ): Promise<Task | null> => {
    const { data } = await api.patch(`/tasks/${id}`, updates);
    const [updated] = extractTasks(data);
    return updated ? mapTask(updated) : null;
  },

  /** DELETE /tasks/:id */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },

  /** POST /tasks/:id/complete */
  complete: async (id: string, fallbackXp: number): Promise<CompleteTaskResult> => {
    const { data } = await api.post<RawCompleteTaskResponse>(`/tasks/${id}/complete`);

    const xpGained = data.xpGained ?? data.xp ?? fallbackXp;
    const task     = data.task ? mapTask(data.task) : null;
    const dashboard = data.dashboard ? mapDashboard(data.dashboard) : undefined;

    return {
      // task field typed as Task but may be null when server doesn't return it;
      // the store handles this gracefully via its optimistic state
      task:    task as Task,
      xpGained,
      dashboard,
    };
  },
};