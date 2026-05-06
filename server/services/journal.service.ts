import { Mood } from "@prisma/client";
import prisma from "../lib/prisma";
import { UpsertJournalBody } from "../controllers/journal.types";

// ─── Date helpers ─────────────────────────────────────────────────────────────

/**
 * Returns midnight UTC for the given date (or today).
 * Used as the canonical `date` value stored on every Journal row.
 */
export function normalizeToDayUTC(d = new Date()): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

// ─── Activity / streak helper ─────────────────────────────────────────────────

/**
 * Called whenever a journal entry is created for a new calendar day.
 * Updates `lastActiveDate` on the User and advances the streak if
 * the previous active date was yesterday.
 *
 * Structured so a richer activity-log table can be added later
 * without changing the call-site in the service.
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
    ? normalizeToDayUTC(user.lastActiveDate)
    : null;

  const alreadyActiveToday =
    lastActive && lastActive.getTime() === today.getTime();

  if (alreadyActiveToday) return; // streak already counted for today

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

// ─── Service methods ──────────────────────────────────────────────────────────

/**
 * Creates today's journal entry, or updates it if one already exists.
 * Returns the upserted journal row.
 */
export async function upsertTodayJournal(
  userId: string,
  body: UpsertJournalBody
) {
  const today = normalizeToDayUTC();

  // Check whether today already has an entry (drives create vs. update)
  const existing = await prisma.journal.findUnique({
    where: { userId_date: { userId, date: today } },
    select: { id: true },
  });

  const data = {
    completed: body.completed?.trim() ?? null,
    distractedBy: body.distractedBy?.trim() ?? null,
    biggestWin: body.biggestWin?.trim() ?? null,
    tomorrowFocus: body.tomorrowFocus?.trim() ?? null,
    mood: body.mood ?? ("GOOD" as Mood),
  };

  const journal = await prisma.journal.upsert({
    where: { userId_date: { userId, date: today } },
    create: { userId, date: today, ...data },
    update: data,
  });

  // Record activity only on first create, not on every update
  if (!existing) {
    await recordActivity(userId, today);
  }

  return journal;
}

/**
 * Returns all journal entries for a user, newest first.
 */
export async function getAllJournals(userId: string) {
  return prisma.journal.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    select: {
      id: true,
      date: true,
      completed: true,
      distractedBy: true,
      biggestWin: true,
      tomorrowFocus: true,
      mood: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

/**
 * Returns today's journal entry, or null if none exists yet.
 */
export async function getTodayJournal(userId: string) {
  const today = normalizeToDayUTC();

  return prisma.journal.findUnique({
    where: { userId_date: { userId, date: today } },
    select: {
      id: true,
      date: true,
      completed: true,
      distractedBy: true,
      biggestWin: true,
      tomorrowFocus: true,
      mood: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}