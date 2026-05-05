import { Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";
import { XP_MAP, getXPRequired } from "../utils/xp";
import { getTodayStart, toDateString } from "../utils/date";

/* ─────────────────────────────────────────
   GET /dashboard
───────────────────────────────────────── */
export async function getDashboard(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId     = req.user!.id;
    const todayStart = getTodayStart();
    const todayStr   = toDateString(new Date());

    // Parallel fetch: user + all completed tasks + today's task count
    const [user, completedTasks, totalTodayTasks] = await Promise.all([
      prisma.user.findUnique({
        where:  { id: userId },
        select: {
          level:          true,
          currentXP:      true,
          totalXP:        true,
          streak:         true,
          lastActiveDate: true,
        },
      }),

      prisma.task.findMany({
        where:  { userId, status: "COMPLETED" },
        select: { completedAt: true, difficulty: true },
      }),

      prisma.task.count({
        where: { userId, createdAt: { gte: todayStart } },
      }),
    ]);

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    // Single pass: build contribution graph + today's stats together
    let completedToday = 0;
    let xpEarnedToday  = 0;
    const graphMap: Record<string, number> = {};

    for (const task of completedTasks) {
      if (!task.completedAt) continue;

      const dateStr = toDateString(new Date(task.completedAt));
      graphMap[dateStr] = (graphMap[dateStr] ?? 0) + 1;

      if (dateStr === todayStr) {
        completedToday += 1;
        xpEarnedToday  += XP_MAP[task.difficulty] ?? 0;
      }
    }

    const xpRequired  = getXPRequired(user.level);
    const xpRemaining = Math.max(0, xpRequired - user.currentXP);

    res.json({
      user: {
        level:     user.level,
        currentXP: user.currentXP,
        totalXP:   user.totalXP,
        streak:    user.streak,
      },
      xpRequired,
      xpRemaining,
      todayStats: {
        totalTasks:     totalTodayTasks,
        completedTasks: completedToday,
        xpEarnedToday,
      },
      contributionGraph: graphMap,
    });
  } catch (err) {
    console.error("[getDashboard]", err);
    res.status(500).json({ message: "Internal server error." });
  }
}