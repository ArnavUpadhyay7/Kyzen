import { Response } from "express";
import { Mood } from "@prisma/client";
import prisma from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

const VALID_MOODS: Mood[] = [
  "LOCKED_IN",
  "GOOD",
  "TIRED",
  "BURNED_OUT",
  "DISTRACTED",
];

/** Normalises a date to midnight UTC — one Journal row per user per day. */
function toMidnightUTC(d = new Date()): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

/**
 * Updates lastActiveDate and streak when a new journal entry is created.
 * Isolated here so a contribution-log table can be wired in later without
 * touching any other call-site.
 */
async function recordActivity(userId: string, today: Date): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { lastActiveDate: true, streak: true },
  });

  if (!user) return;

  const yesterday = new Date(today);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);

  const lastActive = user.lastActiveDate
    ? toMidnightUTC(user.lastActiveDate)
    : null;

  // Already recorded for today — nothing to do
  if (lastActive && lastActive.getTime() === today.getTime()) return;

  const extendStreak =
    lastActive && lastActive.getTime() === yesterday.getTime();

  await prisma.user.update({
    where: { id: userId },
    data: {
      lastActiveDate: today,
      streak: extendStreak ? user.streak + 1 : 1,
    },
  });
}

/* ─────────────────────────────────────────
   POST /api/journal
   Create today's entry. 409 if one already exists.
───────────────────────────────────────── */
export async function createJournal(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const {
      completed,
      distractedBy,
      biggestWin,
      tomorrowFocus,
      mood = "GOOD",
    } = req.body as {
      completed?: string;
      distractedBy?: string;
      biggestWin?: string;
      tomorrowFocus?: string;
      mood?: Mood;
    };

    if (!VALID_MOODS.includes(mood)) {
      res.status(400).json({
        message: `Invalid mood. Must be one of: ${VALID_MOODS.join(", ")}.`,
      });
      return;
    }

    const hasContent =
      completed?.trim() ||
      distractedBy?.trim() ||
      biggestWin?.trim() ||
      tomorrowFocus?.trim();

    if (!hasContent) {
      res.status(400).json({
        message: "At least one journal field must contain content.",
      });
      return;
    }

    const today = toMidnightUTC();
    const userId = req.user!.id;

    const existing = await prisma.journal.findUnique({
      where: { userId_date: { userId, date: today } },
      select: { id: true },
    });

    if (existing) {
      res.status(409).json({
        message: "A journal entry already exists for today. Use PATCH to update it.",
      });
      return;
    }

    const journal = await prisma.journal.create({
      data: {
        userId,
        date: today,
        completed: completed?.trim() ?? null,
        distractedBy: distractedBy?.trim() ?? null,
        biggestWin: biggestWin?.trim() ?? null,
        tomorrowFocus: tomorrowFocus?.trim() ?? null,
        mood,
      },
    });

    await recordActivity(userId, today);

    res.status(201).json({ journal });
  } catch (err) {
    console.error("[createJournal]", err);
    res.status(500).json({ message: "Internal server error." });
  }
}

/* ─────────────────────────────────────────
   GET /api/journal
   All entries for the authenticated user, newest first.
───────────────────────────────────────── */
export async function getJournals(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const journals = await prisma.journal.findMany({
      where: { userId: req.user!.id },
      orderBy: { date: "desc" },
    });

    res.status(200).json({ journals });
  } catch (err) {
    console.error("[getJournals]", err);
    res.status(500).json({ message: "Internal server error." });
  }
}

/* ─────────────────────────────────────────
   GET /api/journal/today
   Returns today's entry or null — used to preload the frontend form.
───────────────────────────────────────── */
export async function getTodayJournal(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const today = toMidnightUTC();

    const journal = await prisma.journal.findUnique({
      where: { userId_date: { userId: req.user!.id, date: today } },
    });

    // Always 200 — null means "no entry yet", which is not an error
    res.status(200).json({ journal: journal ?? null });
  } catch (err) {
    console.error("[getTodayJournal]", err);
    res.status(500).json({ message: "Internal server error." });
  }
}

/* ─────────────────────────────────────────
   PATCH /api/journal/:id
   Update any field on an owned entry.
───────────────────────────────────────── */
export async function updateJournal(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;
    const {
      completed,
      distractedBy,
      biggestWin,
      tomorrowFocus,
      mood,
    } = req.body as {
      completed?: string;
      distractedBy?: string;
      biggestWin?: string;
      tomorrowFocus?: string;
      mood?: Mood;
    };

    if (mood !== undefined && !VALID_MOODS.includes(mood)) {
      res.status(400).json({
        message: `Invalid mood. Must be one of: ${VALID_MOODS.join(", ")}.`,
      });
      return;
    }

    const existing = await prisma.journal.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing) {
      res.status(404).json({ message: "Journal entry not found." });
      return;
    }

    if (existing.userId !== req.user!.id) {
      res.status(403).json({ message: "Forbidden." });
      return;
    }

    const journal = await prisma.journal.update({
      where: { id },
      data: {
        ...(completed     !== undefined && { completed:     completed.trim()     || null }),
        ...(distractedBy  !== undefined && { distractedBy:  distractedBy.trim()  || null }),
        ...(biggestWin    !== undefined && { biggestWin:    biggestWin.trim()    || null }),
        ...(tomorrowFocus !== undefined && { tomorrowFocus: tomorrowFocus.trim() || null }),
        ...(mood          !== undefined && { mood }),
      },
    });

    res.status(200).json({ journal });
  } catch (err) {
    console.error("[updateJournal]", err);
    res.status(500).json({ message: "Internal server error." });
  }
}

/* ─────────────────────────────────────────
   DELETE /api/journal/:id
   Permanently removes an owned entry.
───────────────────────────────────────── */
export async function deleteJournal(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;

    const existing = await prisma.journal.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing) {
      res.status(404).json({ message: "Journal entry not found." });
      return;
    }

    if (existing.userId !== req.user!.id) {
      res.status(403).json({ message: "Forbidden." });
      return;
    }

    await prisma.journal.delete({ where: { id } });

    res.status(200).json({ message: "Journal entry deleted." });
  } catch (err) {
    console.error("[deleteJournal]", err);
    res.status(500).json({ message: "Internal server error." });
  }
}