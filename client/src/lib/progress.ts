/** Tailwind scale-x classes in 5% steps (0–100). Safe for JIT — no dynamic class strings. */
const PROGRESS_SCALE: readonly string[] = [
  "scale-x-0",
  "scale-x-[0.05]",
  "scale-x-10",
  "scale-x-[0.15]",
  "scale-x-20",
  "scale-x-25",
  "scale-x-30",
  "scale-x-[0.35]",
  "scale-x-40",
  "scale-x-[0.45]",
  "scale-x-50",
  "scale-x-[0.55]",
  "scale-x-60",
  "scale-x-[0.65]",
  "scale-x-70",
  "scale-x-[0.75]",
  "scale-x-80",
  "scale-x-[0.85]",
  "scale-x-90",
  "scale-x-[0.95]",
  "scale-x-100",
];

export function progressScaleClass(value: number, max = 100): string {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const index = Math.round(pct / 5);
  return PROGRESS_SCALE[index] ?? PROGRESS_SCALE[PROGRESS_SCALE.length - 1];
}
