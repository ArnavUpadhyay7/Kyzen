import { Difficulty, TaskStatus } from "@prisma/client";
import prisma from "../lib/prisma";
import { XP_MAP, getXPRequired } from "./xp";
import { WORKSPACE_CREATE_XP } from "./workspace";
import { getTodayStart, toDateString } from "./date";

export interface DifficultyStat {
  created: number;
  completed: number;
}

export interface ActivityEntry {
  id: string;
  text: string;
  sub: string;
  xp?: number;
  tone: "accent" | "violet" | "orange";
  at: string;
}

function emptyDifficultyStats(): Record<Difficulty, DifficultyStat> {
  return {
    EASY: { created: 0, completed: 0 },
    MEDIUM: { created: 0, completed: 0 },
    HARD: { created: 0, completed: 0 },
  };
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

/** Shared dashboard payload for GET /dashboard and post-XP responses. */
export async function buildDashboardPayload(userId: string) {
  const todayStart = getTodayStart();
  const todayStr = toDateString(new Date());

  const [
    user,
    completedTasks,
    allTasks,
    totalTodayTasks,
    recentCompletedTasks,
    recentBattleLogs,
    recentIdeas,
    recentProjects,
    recentInspirations,
    recentNotes,
  ] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        username: true,
        email: true,
        level: true,
        currentXP: true,
        totalXP: true,
        streak: true,
        lastActiveDate: true,
      },
    }),

    prisma.task.findMany({
      where: { userId, status: TaskStatus.COMPLETED },
      select: { completedAt: true, difficulty: true },
    }),

    prisma.task.findMany({
      where: { userId },
      select: { difficulty: true, status: true },
    }),

    prisma.task.count({
      where: { userId, createdAt: { gte: todayStart } },
    }),

    prisma.task.findMany({
      where: { userId, status: TaskStatus.COMPLETED },
      orderBy: { completedAt: "desc" },
      take: 8,
      select: { id: true, title: true, difficulty: true, completedAt: true },
    }),

    prisma.battleLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, xpEarned: true, createdAt: true, completed: true },
    }),

    prisma.workspaceIdea.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { id: true, title: true, createdAt: true },
    }),

    prisma.workspaceProject.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { id: true, name: true, createdAt: true },
    }),

    prisma.workspaceInspiration.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { id: true, title: true, createdAt: true },
    }),

    prisma.workspaceNote.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { id: true, title: true, createdAt: true },
    }),
  ]);

  if (!user) return null;

  const difficultyStats = emptyDifficultyStats();
  let totalCompleted = 0;

  for (const task of allTasks) {
    difficultyStats[task.difficulty].created += 1;
    if (task.status === TaskStatus.COMPLETED) {
      difficultyStats[task.difficulty].completed += 1;
      totalCompleted += 1;
    }
  }

  let completedToday = 0;
  let xpEarnedToday = 0;
  const graphMap: Record<string, number> = {};

  for (const task of completedTasks) {
    if (!task.completedAt) continue;

    const dateStr = toDateString(new Date(task.completedAt));
    graphMap[dateStr] = (graphMap[dateStr] ?? 0) + 1;

    if (dateStr === todayStr) {
      completedToday += 1;
      xpEarnedToday += XP_MAP[task.difficulty] ?? 0;
    }
  }

  const totalCreated = allTasks.length;
  const consistency =
    totalCreated > 0 ? Math.round((totalCompleted / totalCreated) * 100) : 0;

  const activity: ActivityEntry[] = [];

  for (const task of recentCompletedTasks) {
    if (!task.completedAt) continue;
    activity.push({
      id: `task-${task.id}`,
      text: `Completed ${task.title}`,
      sub: relativeTime(task.completedAt.toISOString()),
      xp: XP_MAP[task.difficulty],
      tone: "accent",
      at: task.completedAt.toISOString(),
    });
  }

  for (const log of recentBattleLogs) {
    activity.push({
      id: `battle-${log.id}`,
      text: log.completed ? `Battle log: ${log.completed.slice(0, 48)}` : "Logged today's battle",
      sub: relativeTime(log.createdAt.toISOString()),
      xp: log.xpEarned > 0 ? log.xpEarned : undefined,
      tone: "orange",
      at: log.createdAt.toISOString(),
    });
  }

  for (const idea of recentIdeas) {
    activity.push({
      id: `idea-${idea.id}`,
      text: `Saved idea: ${idea.title}`,
      sub: relativeTime(idea.createdAt.toISOString()),
      xp: WORKSPACE_CREATE_XP.idea,
      tone: "violet",
      at: idea.createdAt.toISOString(),
    });
  }

  for (const project of recentProjects) {
    activity.push({
      id: `project-${project.id}`,
      text: `Created project: ${project.name}`,
      sub: relativeTime(project.createdAt.toISOString()),
      xp: WORKSPACE_CREATE_XP.project,
      tone: "violet",
      at: project.createdAt.toISOString(),
    });
  }

  for (const item of recentInspirations) {
    activity.push({
      id: `inspiration-${item.id}`,
      text: `Added inspiration: ${item.title}`,
      sub: relativeTime(item.createdAt.toISOString()),
      xp: WORKSPACE_CREATE_XP.inspiration,
      tone: "violet",
      at: item.createdAt.toISOString(),
    });
  }

  for (const note of recentNotes) {
    activity.push({
      id: `note-${note.id}`,
      text: `Saved note: ${note.title}`,
      sub: relativeTime(note.createdAt.toISOString()),
      xp: WORKSPACE_CREATE_XP.note,
      tone: "violet",
      at: note.createdAt.toISOString(),
    });
  }

  activity.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());

  const xpRequired = getXPRequired(user.level);
  const xpRemaining = Math.max(0, xpRequired - user.currentXP);

  return {
    user: {
      username: user.username,
      email: user.email,
      level: user.level,
      currentXP: user.currentXP,
      totalXP: user.totalXP,
      streak: user.streak,
    },
    xpRequired,
    xpRemaining,
    todayStats: {
      totalTasks: totalTodayTasks,
      completedTasks: completedToday,
      xpEarnedToday,
    },
    contributionGraph: graphMap,
    profileStats: {
      totalXP: user.totalXP,
      totalCompleted,
      totalCreated,
      streak: user.streak,
      consistency,
    },
    difficultyStats,
    recentActivity: activity.slice(0, 12),
  };
}
