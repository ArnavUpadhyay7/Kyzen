import { create } from "zustand";
import { dashboardApi, localIsoDate, type DashboardData } from "../../api/dashboard.api";
import { tasksApi, XP_MAP, type Task, type Difficulty } from "../../api/tasks.api";

export type { DashboardData, Task, Difficulty };

interface DashboardStore {
  dashboard: DashboardData | null;
  tasks: Task[];
  loading: boolean;
  tasksLoading: boolean;
  error: string | null;
  xpPopup: number | null;

  fetchDashboard: () => Promise<void>;
  fetchTasks: () => Promise<void>;
  createTask: (title: string, difficulty: Difficulty) => Promise<void>;
  updateTask: (id: string, data: Partial<Pick<Task, "title" | "difficulty">>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  grantXp: (xpGained: number, dashboard?: DashboardData) => void;
  clearXpPopup: () => void;
}

function applyXpToDashboard(prev: DashboardData, xpGained: number): Partial<DashboardData> {
  const newXP = prev.currentXP + xpGained;
  const levelCap = prev.totalXPForLevel;
  const didLevelUp = newXP >= levelCap;

  const currentXP = didLevelUp ? newXP - levelCap : newXP;
  const level = didLevelUp ? prev.level + 1 : prev.level;
  const xpToNextLevel = Math.max(
    0,
    (didLevelUp ? levelCap : prev.xpToNextLevel) - xpGained,
  );

  const today = localIsoDate();
  const graph = prev.contributionGraph.map((entry) =>
    entry.date === today ? { ...entry, count: entry.count + 1 } : entry,
  );
  if (!prev.contributionGraph.some((e) => e.date === today)) {
    graph.push({ date: today, count: 1 });
  }

  return {
    currentXP,
    level,
    xpToNextLevel,
    contributionGraph: graph,
    profileStats: {
      ...prev.profileStats,
      totalXP: prev.profileStats.totalXP + xpGained,
    },
    todayStats: {
      ...prev.todayStats,
      completedTasks: prev.todayStats.completedTasks + 1,
      xpEarned: prev.todayStats.xpEarned + xpGained,
    },
  };
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  dashboard: null,
  tasks: [],
  loading: false,
  tasksLoading: false,
  error: null,
  xpPopup: null,

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

  grantXp: (xpGained, dashboard) => {
    set((s) => ({
      xpPopup: xpGained,
      dashboard: dashboard ?? s.dashboard,
    }));
    if (!dashboard) {
      void get().fetchDashboard();
    }
  },

  clearXpPopup: () => set({ xpPopup: null }),

  createTask: async (title, difficulty) => {
    const tempId = `optimistic-${Date.now()}`;
    const optimistic: Task = {
      id: tempId,
      title,
      difficulty,
      completed: false,
      xpReward: XP_MAP[difficulty],
    };

    set((s) => ({
      tasks: [optimistic, ...s.tasks],
      dashboard: s.dashboard
        ? {
            ...s.dashboard,
            todayStats: {
              ...s.dashboard.todayStats,
              totalTasks: s.dashboard.todayStats.totalTasks + 1,
            },
            difficultyStats: {
              ...s.dashboard.difficultyStats,
              [difficulty]: {
                ...s.dashboard.difficultyStats[difficulty],
                created: s.dashboard.difficultyStats[difficulty].created + 1,
              },
            },
            profileStats: {
              ...s.dashboard.profileStats,
              totalCreated: s.dashboard.profileStats.totalCreated + 1,
            },
          }
        : null,
    }));

    try {
      const created = await tasksApi.create(title, difficulty);
      set((s) => ({
        tasks: s.tasks.map((t) => (t.id === tempId ? created : t)),
      }));
      void get().fetchDashboard();
    } catch {
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

  deleteTask: async (id) => {
    const previous = get().tasks;
    const task = previous.find((t) => t.id === id);
    const wasActive = task && !task.completed;

    set((s) => ({
      tasks: s.tasks.filter((t) => t.id !== id),
      dashboard:
        s.dashboard && task
          ? {
              ...s.dashboard,
              todayStats: wasActive
                ? {
                    ...s.dashboard.todayStats,
                    totalTasks: Math.max(0, s.dashboard.todayStats.totalTasks - 1),
                  }
                : s.dashboard.todayStats,
              difficultyStats: {
                ...s.dashboard.difficultyStats,
                [task.difficulty]: {
                  created: Math.max(
                    0,
                    s.dashboard.difficultyStats[task.difficulty].created - 1,
                  ),
                  completed: task.completed
                    ? Math.max(
                        0,
                        s.dashboard.difficultyStats[task.difficulty].completed - 1,
                      )
                    : s.dashboard.difficultyStats[task.difficulty].completed,
                },
              },
              profileStats: {
                ...s.dashboard.profileStats,
                totalCreated: Math.max(0, s.dashboard.profileStats.totalCreated - 1),
                totalCompleted: task.completed
                  ? Math.max(0, s.dashboard.profileStats.totalCompleted - 1)
                  : s.dashboard.profileStats.totalCompleted,
              },
            }
          : s.dashboard,
    }));

    try {
      await tasksApi.delete(id);
    } catch {
      set({ tasks: previous, error: "Failed to delete task." });
      void get().fetchDashboard();
    }
  },

  completeTask: async (id) => {
    const task = get().tasks.find((t) => t.id === id);
    const previous = get().tasks;
    const prevDash = get().dashboard;
    const xpReward = task?.xpReward ?? 0;

    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === id
          ? { ...t, completed: true, completedAt: new Date().toISOString() }
          : t,
      ),
    }));

    if (prevDash) {
      const diff = task?.difficulty ?? "MEDIUM";
      set((s) => ({
        dashboard: s.dashboard
          ? {
              ...s.dashboard,
              ...applyXpToDashboard(s.dashboard, xpReward),
              difficultyStats: {
                ...s.dashboard.difficultyStats,
                [diff]: {
                  ...s.dashboard.difficultyStats[diff],
                  completed: s.dashboard.difficultyStats[diff].completed + 1,
                },
              },
              profileStats: {
                ...s.dashboard.profileStats,
                totalCompleted: s.dashboard.profileStats.totalCompleted + 1,
              },
            }
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
          t.id === id ? (confirmed ?? { ...t, completed: true }) : t,
        ),
        ...(dashboard ? { dashboard } : {}),
        xpPopup: xpGained,
      }));
    } catch {
      set({
        tasks: previous,
        dashboard: prevDash,
        xpPopup: null,
        error: "Failed to complete task.",
      });
    }
  },
}));
