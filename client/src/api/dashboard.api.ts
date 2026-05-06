import api from "../lib/axios";

// ─── Public Types ─────────────────────────────────────────────────────────────

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

// ─── Raw Backend Shape ────────────────────────────────────────────────────────

export interface RawUser {
  level: number;
  currentXP: number;
  totalXP: number;
  streak: number;
  username?: string;
  name?: string;
  email?: string;
}

export interface RawDashboard {
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function resolveUsername(user: RawUser): string {
  return user.username ?? user.name ?? user.email?.split("@")[0] ?? "You";
}

/**
 * Returns today's date as a local YYYY-MM-DD string (not UTC).
 * Using new Date().toISOString() shifts to UTC which can land on
 * the previous calendar day for users ahead of UTC — this avoids that.
 */
export function localIsoDate(d: Date = new Date()): string {
  const y  = d.getFullYear();
  const m  = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

export function mapDashboard(raw: RawDashboard): DashboardData {
  const graph = raw.contributionGraph
    ? Object.entries(raw.contributionGraph).map(([date, count]) => ({ date, count }))
    : [];

  return {
    username:        resolveUsername(raw.user),
    level:           raw.user.level     ?? 1,
    currentXP:       raw.user.currentXP ?? 0,
    totalXPForLevel: raw.xpRequired     ?? 1000,
    xpToNextLevel:   raw.xpRemaining    ?? 1000,
    streak:          raw.user.streak    ?? 0,
    todayStats: {
      totalTasks:     raw.todayStats?.totalTasks     ?? 0,
      completedTasks: raw.todayStats?.completedTasks ?? 0,
      xpEarned:       raw.todayStats?.xpEarnedToday  ?? 0,
    },
    contributionGraph: graph,
  };
}

// ─── API ──────────────────────────────────────────────────────────────────────

export const dashboardApi = {
  /** GET /dashboard */
  get: async (): Promise<DashboardData> => {
    const { data } = await api.get<RawDashboard>("/dashboard");
    return mapDashboard(data);
  },
};