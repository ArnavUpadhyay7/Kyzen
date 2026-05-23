import { Response } from "express";
import {
  IdeaCategory,
  InspirationType,
  Mood,
  NoteCategory,
  ProjectStatus,
} from "@prisma/client";
import prisma from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  VALID_MOODS,
  awardXP,
  computeBattleLogXP,
  hasBattleLogContent,
  recordActivity,
  toMidnightUTC,
  trimOrNull,
} from "../utils/workspace";

const VALID_IDEA_CATEGORIES: IdeaCategory[] = [
  "PROJECT",
  "STARTUP",
  "TOOL",
  "EXPERIMENT",
];

const VALID_PROJECT_STATUSES: ProjectStatus[] = [
  "PLANNING",
  "BUILDING",
  "SHIPPING",
  "PAUSED",
];

const VALID_INSPIRATION_TYPES: InspirationType[] = [
  "UI",
  "REPO",
  "DESIGN",
  "CONCEPT",
];

const VALID_NOTE_CATEGORIES: NoteCategory[] = [
  "DSA",
  "COMMAND",
  "INTERVIEW",
  "LEARNING",
];

function ownedOr404<T extends { userId: string }>(
  record: T | null,
  res: Response,
  userId: string,
  label: string
): T | null {
  if (!record) {
    res.status(404).json({ message: `${label} not found.` });
    return null;
  }
  if (record.userId !== userId) {
    res.status(403).json({ message: "Forbidden." });
    return null;
  }
  return record;
}

function parseStringArray(value: unknown): string[] | null {
  if (value === undefined) return null;
  if (!Array.isArray(value)) return null;
  return value.map((item) => String(item).trim()).filter(Boolean);
}

// ─── Battle logs ─────────────────────────────────────────────────────────────

export async function getBattleLogs(req: AuthRequest, res: Response): Promise<void> {
  try {
    const logs = await prisma.battleLog.findMany({
      where: { userId: req.user!.id },
      orderBy: { date: "desc" },
    });
    res.json({ logs });
  } catch (err) {
    console.error("[getBattleLogs]", err);
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function getTodayBattleLog(req: AuthRequest, res: Response): Promise<void> {
  try {
    const today = toMidnightUTC();
    const log = await prisma.battleLog.findUnique({
      where: { userId_date: { userId: req.user!.id, date: today } },
    });
    res.json({ log: log ?? null });
  } catch (err) {
    console.error("[getTodayBattleLog]", err);
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function createBattleLog(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { completed, win, learned, bug, tomorrow, mood = "GOOD" } = req.body as {
      completed?: string;
      win?: string;
      learned?: string;
      bug?: string;
      tomorrow?: string;
      mood?: Mood;
    };

    if (!VALID_MOODS.includes(mood)) {
      res.status(400).json({
        message: `Invalid mood. Must be one of: ${VALID_MOODS.join(", ")}.`,
      });
      return;
    }

    const fields = {
      completed: trimOrNull(completed),
      win: trimOrNull(win),
      learned: trimOrNull(learned),
      bug: trimOrNull(bug),
      tomorrow: trimOrNull(tomorrow),
    };

    if (!hasBattleLogContent(fields)) {
      res.status(400).json({ message: "At least one battle log field must contain content." });
      return;
    }

    const today = toMidnightUTC();
    const userId = req.user!.id;

    const existing = await prisma.battleLog.findUnique({
      where: { userId_date: { userId, date: today } },
      select: { id: true },
    });

    if (existing) {
      res.status(409).json({
        message: "A battle log already exists for today. Use PATCH to update it.",
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { level: true },
    });

    const xpEarned = computeBattleLogXP(fields);

    const log = await prisma.battleLog.create({
      data: {
        userId,
        date: today,
        mood,
        ...fields,
        xpEarned,
        userLevel: user?.level ?? 1,
      },
    });

    await recordActivity(userId, today);
    const userStats = await awardXP(userId, xpEarned);

    res.status(201).json({ log, user: userStats });
  } catch (err) {
    console.error("[createBattleLog]", err);
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function updateBattleLog(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { completed, win, learned, bug, tomorrow, mood } = req.body as {
      completed?: string;
      win?: string;
      learned?: string;
      bug?: string;
      tomorrow?: string;
      mood?: Mood;
    };

    if (mood !== undefined && !VALID_MOODS.includes(mood)) {
      res.status(400).json({
        message: `Invalid mood. Must be one of: ${VALID_MOODS.join(", ")}.`,
      });
      return;
    }

    const existing = await prisma.battleLog.findUnique({ where: { id } });
    if (!ownedOr404(existing, res, req.user!.id, "Battle log")) return;

    const nextFields = {
      completed: completed !== undefined ? trimOrNull(completed) : existing!.completed,
      win: win !== undefined ? trimOrNull(win) : existing!.win,
      learned: learned !== undefined ? trimOrNull(learned) : existing!.learned,
      bug: bug !== undefined ? trimOrNull(bug) : existing!.bug,
      tomorrow: tomorrow !== undefined ? trimOrNull(tomorrow) : existing!.tomorrow,
    };

    if (!hasBattleLogContent(nextFields)) {
      res.status(400).json({ message: "At least one battle log field must contain content." });
      return;
    }

    const xpEarned = computeBattleLogXP(nextFields);
    const xpDelta = xpEarned - existing!.xpEarned;

    const log = await prisma.battleLog.update({
      where: { id },
      data: {
        ...(completed !== undefined && { completed: nextFields.completed }),
        ...(win !== undefined && { win: nextFields.win }),
        ...(learned !== undefined && { learned: nextFields.learned }),
        ...(bug !== undefined && { bug: nextFields.bug }),
        ...(tomorrow !== undefined && { tomorrow: nextFields.tomorrow }),
        ...(mood !== undefined && { mood }),
        xpEarned,
      },
    });

    const userStats = xpDelta > 0 ? await awardXP(req.user!.id, xpDelta) : null;

    res.json({ log, user: userStats });
  } catch (err) {
    console.error("[updateBattleLog]", err);
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function deleteBattleLog(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const existing = await prisma.battleLog.findUnique({ where: { id } });
    if (!ownedOr404(existing, res, req.user!.id, "Battle log")) return;

    await prisma.battleLog.delete({ where: { id } });
    res.json({ message: "Battle log deleted." });
  } catch (err) {
    console.error("[deleteBattleLog]", err);
    res.status(500).json({ message: "Internal server error." });
  }
}

// ─── Ideas ───────────────────────────────────────────────────────────────────

export async function getIdeas(req: AuthRequest, res: Response): Promise<void> {
  try {
    const ideas = await prisma.workspaceIdea.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: "desc" },
    });
    res.json({ ideas });
  } catch (err) {
    console.error("[getIdeas]", err);
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function createIdea(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { title, category = "PROJECT", problem, tags } = req.body as {
      title?: string;
      category?: IdeaCategory;
      problem?: string;
      tags?: string[];
    };

    if (!title?.trim()) {
      res.status(400).json({ message: "Title is required." });
      return;
    }

    if (!VALID_IDEA_CATEGORIES.includes(category)) {
      res.status(400).json({ message: "Invalid idea category." });
      return;
    }

    const parsedTags = parseStringArray(tags) ?? [];

    const idea = await prisma.workspaceIdea.create({
      data: {
        userId: req.user!.id,
        title: title.trim(),
        category,
        problem: trimOrNull(problem),
        tags: parsedTags,
      },
    });

    res.status(201).json({ idea });
  } catch (err) {
    console.error("[createIdea]", err);
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function updateIdea(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { title, category, problem, tags } = req.body as {
      title?: string;
      category?: IdeaCategory;
      problem?: string;
      tags?: string[];
    };

    const existing = await prisma.workspaceIdea.findUnique({ where: { id } });
    if (!ownedOr404(existing, res, req.user!.id, "Idea")) return;

    if (category !== undefined && !VALID_IDEA_CATEGORIES.includes(category)) {
      res.status(400).json({ message: "Invalid idea category." });
      return;
    }

    const parsedTags = tags !== undefined ? parseStringArray(tags) : undefined;
    if (tags !== undefined && parsedTags === null) {
      res.status(400).json({ message: "Tags must be an array of strings." });
      return;
    }

    const idea = await prisma.workspaceIdea.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(category !== undefined && { category }),
        ...(problem !== undefined && { problem: trimOrNull(problem) }),
        ...(parsedTags !== undefined && { tags: parsedTags ?? [] }),
      },
    });

    res.json({ idea });
  } catch (err) {
    console.error("[updateIdea]", err);
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function deleteIdea(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const existing = await prisma.workspaceIdea.findUnique({ where: { id } });
    if (!ownedOr404(existing, res, req.user!.id, "Idea")) return;

    await prisma.workspaceIdea.delete({ where: { id } });
    res.json({ message: "Idea deleted." });
  } catch (err) {
    console.error("[deleteIdea]", err);
    res.status(500).json({ message: "Internal server error." });
  }
}

// ─── Projects ────────────────────────────────────────────────────────────────

export async function getProjects(req: AuthRequest, res: Response): Promise<void> {
  try {
    const projects = await prisma.workspaceProject.findMany({
      where: { userId: req.user!.id },
      orderBy: { updatedAt: "desc" },
    });
    res.json({ projects });
  } catch (err) {
    console.error("[getProjects]", err);
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function createProject(req: AuthRequest, res: Response): Promise<void> {
  try {
    const {
      name,
      description,
      why,
      mvp,
      stretch,
      tech,
      status = "PLANNING",
      progress = 0,
    } = req.body as {
      name?: string;
      description?: string;
      why?: string;
      mvp?: string[];
      stretch?: string[];
      tech?: string[];
      status?: ProjectStatus;
      progress?: number;
    };

    if (!name?.trim()) {
      res.status(400).json({ message: "Name is required." });
      return;
    }

    if (!VALID_PROJECT_STATUSES.includes(status)) {
      res.status(400).json({ message: "Invalid project status." });
      return;
    }

    if (progress < 0 || progress > 100) {
      res.status(400).json({ message: "Progress must be between 0 and 100." });
      return;
    }

    const project = await prisma.workspaceProject.create({
      data: {
        userId: req.user!.id,
        name: name.trim(),
        description: trimOrNull(description),
        why: trimOrNull(why),
        mvp: parseStringArray(mvp) ?? [],
        stretch: parseStringArray(stretch) ?? [],
        tech: parseStringArray(tech) ?? [],
        status,
        progress,
      },
    });

    res.status(201).json({ project });
  } catch (err) {
    console.error("[createProject]", err);
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function updateProject(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const body = req.body as Record<string, unknown>;

    const existing = await prisma.workspaceProject.findUnique({ where: { id } });
    if (!ownedOr404(existing, res, req.user!.id, "Project")) return;

    const status = body.status as ProjectStatus | undefined;
    if (status !== undefined && !VALID_PROJECT_STATUSES.includes(status)) {
      res.status(400).json({ message: "Invalid project status." });
      return;
    }

    const progress = body.progress as number | undefined;
    if (progress !== undefined && (progress < 0 || progress > 100)) {
      res.status(400).json({ message: "Progress must be between 0 and 100." });
      return;
    }

    const project = await prisma.workspaceProject.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: String(body.name).trim() }),
        ...(body.description !== undefined && { description: trimOrNull(String(body.description)) }),
        ...(body.why !== undefined && { why: trimOrNull(String(body.why)) }),
        ...(body.mvp !== undefined && { mvp: parseStringArray(body.mvp) ?? [] }),
        ...(body.stretch !== undefined && { stretch: parseStringArray(body.stretch) ?? [] }),
        ...(body.tech !== undefined && { tech: parseStringArray(body.tech) ?? [] }),
        ...(status !== undefined && { status }),
        ...(progress !== undefined && { progress }),
      },
    });

    res.json({ project });
  } catch (err) {
    console.error("[updateProject]", err);
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function deleteProject(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const existing = await prisma.workspaceProject.findUnique({ where: { id } });
    if (!ownedOr404(existing, res, req.user!.id, "Project")) return;

    await prisma.workspaceProject.delete({ where: { id } });
    res.json({ message: "Project deleted." });
  } catch (err) {
    console.error("[deleteProject]", err);
    res.status(500).json({ message: "Internal server error." });
  }
}

// ─── Inspirations ────────────────────────────────────────────────────────────

export async function getInspirations(req: AuthRequest, res: Response): Promise<void> {
  try {
    const inspirations = await prisma.workspaceInspiration.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: "desc" },
    });
    res.json({ inspirations });
  } catch (err) {
    console.error("[getInspirations]", err);
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function createInspiration(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { type, title, url, tag } = req.body as {
      type?: InspirationType;
      title?: string;
      url?: string;
      tag?: string;
    };

    if (!title?.trim() || !url?.trim() || !tag?.trim()) {
      res.status(400).json({ message: "Title, url, and tag are required." });
      return;
    }

    if (!type || !VALID_INSPIRATION_TYPES.includes(type)) {
      res.status(400).json({ message: "Invalid inspiration type." });
      return;
    }

    const inspiration = await prisma.workspaceInspiration.create({
      data: {
        userId: req.user!.id,
        type,
        title: title.trim(),
        url: url.trim(),
        tag: tag.trim(),
      },
    });

    res.status(201).json({ inspiration });
  } catch (err) {
    console.error("[createInspiration]", err);
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function updateInspiration(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { type, title, url, tag } = req.body as {
      type?: InspirationType;
      title?: string;
      url?: string;
      tag?: string;
    };

    const existing = await prisma.workspaceInspiration.findUnique({ where: { id } });
    if (!ownedOr404(existing, res, req.user!.id, "Inspiration")) return;

    if (type !== undefined && !VALID_INSPIRATION_TYPES.includes(type)) {
      res.status(400).json({ message: "Invalid inspiration type." });
      return;
    }

    const inspiration = await prisma.workspaceInspiration.update({
      where: { id },
      data: {
        ...(type !== undefined && { type }),
        ...(title !== undefined && { title: title.trim() }),
        ...(url !== undefined && { url: url.trim() }),
        ...(tag !== undefined && { tag: tag.trim() }),
      },
    });

    res.json({ inspiration });
  } catch (err) {
    console.error("[updateInspiration]", err);
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function deleteInspiration(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const existing = await prisma.workspaceInspiration.findUnique({ where: { id } });
    if (!ownedOr404(existing, res, req.user!.id, "Inspiration")) return;

    await prisma.workspaceInspiration.delete({ where: { id } });
    res.json({ message: "Inspiration deleted." });
  } catch (err) {
    console.error("[deleteInspiration]", err);
    res.status(500).json({ message: "Internal server error." });
  }
}

// ─── Notes ───────────────────────────────────────────────────────────────────

export async function getNotes(req: AuthRequest, res: Response): Promise<void> {
  try {
    const notes = await prisma.workspaceNote.findMany({
      where: { userId: req.user!.id },
      orderBy: { updatedAt: "desc" },
    });
    res.json({ notes });
  } catch (err) {
    console.error("[getNotes]", err);
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function createNote(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { category, title, content, tags, isCode = false } = req.body as {
      category?: NoteCategory;
      title?: string;
      content?: string;
      tags?: string[];
      isCode?: boolean;
    };

    if (!title?.trim() || !content?.trim()) {
      res.status(400).json({ message: "Title and content are required." });
      return;
    }

    if (!category || !VALID_NOTE_CATEGORIES.includes(category)) {
      res.status(400).json({ message: "Invalid note category." });
      return;
    }

    const note = await prisma.workspaceNote.create({
      data: {
        userId: req.user!.id,
        category,
        title: title.trim(),
        content: content.trim(),
        tags: parseStringArray(tags) ?? [],
        isCode: Boolean(isCode),
      },
    });

    res.status(201).json({ note });
  } catch (err) {
    console.error("[createNote]", err);
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function updateNote(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { category, title, content, tags, isCode } = req.body as {
      category?: NoteCategory;
      title?: string;
      content?: string;
      tags?: string[];
      isCode?: boolean;
    };

    const existing = await prisma.workspaceNote.findUnique({ where: { id } });
    if (!ownedOr404(existing, res, req.user!.id, "Note")) return;

    if (category !== undefined && !VALID_NOTE_CATEGORIES.includes(category)) {
      res.status(400).json({ message: "Invalid note category." });
      return;
    }

    const parsedTags = tags !== undefined ? parseStringArray(tags) : undefined;
    if (tags !== undefined && parsedTags === null) {
      res.status(400).json({ message: "Tags must be an array of strings." });
      return;
    }

    const note = await prisma.workspaceNote.update({
      where: { id },
      data: {
        ...(category !== undefined && { category }),
        ...(title !== undefined && { title: title.trim() }),
        ...(content !== undefined && { content: content.trim() }),
        ...(parsedTags !== undefined && { tags: parsedTags ?? [] }),
        ...(isCode !== undefined && { isCode: Boolean(isCode) }),
      },
    });

    res.json({ note });
  } catch (err) {
    console.error("[updateNote]", err);
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function deleteNote(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const existing = await prisma.workspaceNote.findUnique({ where: { id } });
    if (!ownedOr404(existing, res, req.user!.id, "Note")) return;

    await prisma.workspaceNote.delete({ where: { id } });
    res.json({ message: "Note deleted." });
  } catch (err) {
    console.error("[deleteNote]", err);
    res.status(500).json({ message: "Internal server error." });
  }
}
