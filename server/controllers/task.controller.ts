import { Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

// ── Controllers ───────────────────────────────────────────────

/**
 * POST /api/tasks
 */
export async function createTask(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.userId!;
  const { title, description } = req.body as {
    title?: string;
    description?: string;
  };

  if (!title || title.trim().length === 0) {
    res.status(400).json({ message: "Title is required." });
    return;
  }

  try {
    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() ?? null,
        userId,
      },
    });

    res.status(201).json({ task });
  } catch (err) {
    console.error("[createTask]", err);
    res.status(500).json({ message: "Internal server error." });
  }
}

/**
 * GET /api/tasks
 */
export async function getTasks(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.userId!;

  try {
    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ tasks });
  } catch (err) {
    console.error("[getTasks]", err);
    res.status(500).json({ message: "Internal server error." });
  }
}

/**
 * PATCH /api/tasks/:id
 */
export async function updateTask(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.userId!;
  const { id } = req.params;
  const { title, description, completed } = req.body as {
    title?: string;
    description?: string;
    completed?: boolean;
  };

  try {
    const existing = await prisma.task.findUnique({ where: { id } });

    if (!existing) {
      res.status(404).json({ message: "Task not found." });
      return;
    }

    if (existing.userId !== userId) {
      res.status(403).json({ message: "Forbidden." });
      return;
    }

    // Build update payload — only include fields that were actually sent
    const data: {
      title?: string;
      description?: string | null;
      completed?: boolean;
      completedAt?: Date | null;
    } = {};

    if (title !== undefined) {
      if (title.trim().length === 0) {
        res.status(400).json({ message: "Title cannot be empty." });
        return;
      }
      data.title = title.trim();
    }

    if (description !== undefined) {
      data.description = description.trim() || null;
    }

    if (completed !== undefined) {
      if (typeof completed !== "boolean") {
        res.status(400).json({ message: "completed must be a boolean." });
        return;
      }
      data.completed = completed;
      // Set completedAt when marking done; clear it when un-marking
      data.completedAt = completed ? new Date() : null;
    }

    const task = await prisma.task.update({ where: { id }, data });

    res.status(200).json({ task });
  } catch (err) {
    console.error("[updateTask]", err);
    res.status(500).json({ message: "Internal server error." });
  }
}

/**
 * DELETE /api/tasks/:id
 */
export async function deleteTask(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.userId!;
  const { id } = req.params;

  try {
    const existing = await prisma.task.findUnique({ where: { id } });

    if (!existing) {
      res.status(404).json({ message: "Task not found." });
      return;
    }

    if (existing.userId !== userId) {
      res.status(403).json({ message: "Forbidden." });
      return;
    }

    await prisma.task.delete({ where: { id } });

    res.status(200).json({ message: "Task deleted successfully." });
  } catch (err) {
    console.error("[deleteTask]", err);
    res.status(500).json({ message: "Internal server error." });
  }
}