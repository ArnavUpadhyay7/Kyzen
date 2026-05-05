import { Response } from "express";
import { Difficulty, TaskStatus } from "@prisma/client";
import prisma from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";
import { XP_MAP, getXPRequired } from "../utils/xp";
import {
  getTodayStart,
  getTomorrowMidnight,
  getYesterdayStart,
  toDateString,
} from "../utils/date";

const VALID_DIFFICULTIES: Difficulty[] = ["EASY", "MEDIUM", "HARD"];

/* ─────────────────────────────────────────
   POST /tasks
───────────────────────────────────────── */
export async function createTask(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { title, difficulty = "EASY" } = req.body as {
      title?: string;
      difficulty?: Difficulty;
    };

    if (!title?.trim()) {
      res.status(400).json({ message: "Title is required." });
      return;
    }

    if (!VALID_DIFFICULTIES.includes(difficulty)) {
      res.status(400).json({ message: "Difficulty must be EASY, MEDIUM, or HARD." });
      return;
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        difficulty,
        expiresAt: getTomorrowMidnight(),
        userId: req.user!.id,
      },
    });

    res.status(201).json({ task });
  } catch (err) {
    console.error("[createTask]", err);
    res.status(500).json({ message: "Internal server error." });
  }
}

/* ─────────────────────────────────────────
   GET /tasks  — today's tasks only
───────────────────────────────────────── */
export async function getTasks(req: AuthRequest, res: Response): Promise<void> {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        userId:    req.user!.id,
        createdAt: { gte: getTodayStart() },
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "asc" },
    });

    res.json({ tasks });
  } catch (err) {
    console.error("[getTasks]", err);
    res.status(500).json({ message: "Internal server error." });
  }
}

/* ─────────────────────────────────────────
   PATCH /tasks/:id
───────────────────────────────────────── */
export async function updateTask(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { title, difficulty } = req.body as {
      title?: string;
      difficulty?: Difficulty;
    };

    const task = await prisma.task.findUnique({ where: { id } });

    if (!task || task.userId !== req.user!.id) {
      res.status(404).json({ message: "Task not found." });
      return;
    }

    if (task.status === TaskStatus.COMPLETED) {
      res.status(400).json({ message: "Cannot edit a completed task." });
      return;
    }

    const updateData: { title?: string; difficulty?: Difficulty } = {};

    if (title?.trim()) updateData.title = title.trim();

    if (difficulty !== undefined) {
      if (!VALID_DIFFICULTIES.includes(difficulty)) {
        res.status(400).json({ message: "Difficulty must be EASY, MEDIUM, or HARD." });
        return;
      }
      updateData.difficulty = difficulty;
    }

    if (Object.keys(updateData).length === 0) {
      res.status(400).json({ message: "No valid fields provided to update." });
      return;
    }

    const updated = await prisma.task.update({ where: { id }, data: updateData });
    res.json({ task: updated });
  } catch (err) {
    console.error("[updateTask]", err);
    res.status(500).json({ message: "Internal server error." });
  }
}

/* ─────────────────────────────────────────
   DELETE /tasks/:id
───────────────────────────────────────── */
export async function deleteTask(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({ where: { id } });

    if (!task || task.userId !== req.user!.id) {
      res.status(404).json({ message: "Task not found." });
      return;
    }

    await prisma.task.delete({ where: { id } });
    res.json({ message: "Task deleted." });
  } catch (err) {
    console.error("[deleteTask]", err);
    res.status(500).json({ message: "Internal server error." });
  }
}

/* ─────────────────────────────────────────
   POST /tasks/:id/complete
───────────────────────────────────────── */
export async function completeTask(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    // 1. Validate ownership
    const task = await prisma.task.findUnique({ where: { id } });

    if (!task || task.userId !== req.user!.id) {
      res.status(404).json({ message: "Task not found." });
      return;
    }

    // 2. Guard against invalid states
    if (task.status === TaskStatus.COMPLETED) {
      res.status(400).json({ message: "Task already completed." });
      return;
    }

    if (task.status === TaskStatus.MISSED) {
      res.status(400).json({ message: "Cannot complete a missed task." });
      return;
    }

    // 3. Compute XP
    const xpGained = XP_MAP[task.difficulty];
    const now      = new Date();

    // 4. Fetch user
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    // 5. Level-up loop (handles multiple level-ups in one completion)
    let { currentXP, totalXP, level } = user;
    currentXP += xpGained;
    totalXP   += xpGained;

    while (currentXP >= getXPRequired(level)) {
      currentXP -= getXPRequired(level);
      level     += 1;
    }

    // 6. Streak logic
    let { streak, lastActiveDate } = user;
    const todayStr     = toDateString(now);
    const yesterdayStr = toDateString(getYesterdayStart());

    if (!lastActiveDate) {
      streak = 1;
    } else {
      const lastStr = toDateString(new Date(lastActiveDate));
      if (lastStr === yesterdayStr) {
        streak += 1;           // consecutive day
      } else if (lastStr !== todayStr) {
        streak = 1;            // gap — reset
      }
      // lastStr === todayStr → already active today, no change
    }

    // 7. Atomic persist
    const [, updatedUser] = await prisma.$transaction([
      prisma.task.update({
        where: { id },
        data:  { status: TaskStatus.COMPLETED, completedAt: now },
      }),
      prisma.user.update({
        where: { id: req.user!.id },
        data:  { currentXP, totalXP, level, streak, lastActiveDate: now },
      }),
    ]);

    res.json({
      xpGained,
      currentXP:  updatedUser.currentXP,
      totalXP:    updatedUser.totalXP,
      level:      updatedUser.level,
      streak:     updatedUser.streak,
    });
  } catch (err) {
    console.error("[completeTask]", err);
    res.status(500).json({ message: "Internal server error." });
  }
}