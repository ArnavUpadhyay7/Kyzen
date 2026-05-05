/** Start of today: 00:00:00.000 */
export function getTodayStart(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Tomorrow at 00:00:00.000 — used as task `expiresAt` */
export function getTomorrowMidnight(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Yesterday at 00:00:00.000 — used for streak comparison */
export function getYesterdayStart(): Date {
  const d = getTodayStart();
  d.setDate(d.getDate() - 1);
  return d;
}

/**
 * Converts a Date to a "YYYY-MM-DD" string using UTC.
 * Using UTC avoids day-boundary drift from toISOString().
 */
export function toDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}