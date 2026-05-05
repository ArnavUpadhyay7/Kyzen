import { Difficulty } from "@prisma/client";

/** XP awarded per difficulty */
export const XP_MAP: Record<Difficulty, number> = {
  EASY:   25,
  MEDIUM: 50,
  HARD:   100,
};

/**
 * XP required to advance from `level` → `level + 1`.
 * Fixed thresholds for levels 1–4; +500 per level beyond that.
 *
 * Level 1 → 250  |  Level 2 → 400  |  Level 3 → 700  |  Level 4 → 1000
 * Level 5 → 1500 |  Level 6 → 2000 |  …
 */
export function getXPRequired(level: number): number {
  const THRESHOLDS: Record<number, number> = {
    1: 250,
    2: 400,
    3: 650,
    4: 900,
    5: 1250,
    6: 1500,
  };

  return THRESHOLDS[level] ?? 1000 + (level - 4) * 500;
}