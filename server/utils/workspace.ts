import { Mood } from "@prisma/client";
import prisma from "../lib/prisma";
import { getXPRequired } from "./xp";

export const VALID_MOODS: Mood[] = [
  "LOCKED_IN",
  "GOOD",
  "TIRED",
  "BURNED_OUT",
  "DISTRACTED",
];

const XP_PER_FIELD = 25;

/** XP granted when creating workspace items (not battle logs). */
export const WORKSPACE_CREATE_XP = {
  idea: 25,
  project: 30,
  inspiration: 20,
  note: 25,
} as const;

/** Normalises a date to midnight UTC — one battle log row per user per day. */
export function toMidnightUTC(d = new Date()): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

export function computeBattleLogXP(fields: {
  completed?: string | null;
  win?: string | null;
  learned?: string | null;
  bug?: string | null;
  tomorrow?: string | null;
}): number {
  return [
    fields.completed,
    fields.win,
    fields.learned,
    fields.bug,
    fields.tomorrow,
  ].reduce((sum, value) => sum + (value?.trim() ? XP_PER_FIELD : 0), 0);
}

export function hasBattleLogContent(fields: {
  completed?: string | null;
  win?: string | null;
  learned?: string | null;
  bug?: string | null;
  tomorrow?: string | null;
}): boolean {
  return computeBattleLogXP(fields) > 0;
}

export function trimOrNull(value?: string | null): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

/** Updates streak and lastActiveDate when logging a new calendar day. */
export async function recordActivity(userId: string, today: Date): Promise<void> {
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

/** Awards XP to the user and handles level-ups. Returns updated user stats. */
export async function awardXP(userId: string, xpGained: number) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return null;

  let { currentXP, totalXP, level } = user;
  currentXP += xpGained;
  totalXP += xpGained;

  while (currentXP >= getXPRequired(level)) {
    currentXP -= getXPRequired(level);
    level += 1;
  }

  return prisma.user.update({
    where: { id: userId },
    data: { currentXP, totalXP, level },
    select: { currentXP: true, totalXP: true, level: true, streak: true },
  });
}
