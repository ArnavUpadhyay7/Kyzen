import { useCallback, useState } from "react";
import { useTokens } from "../../state/theme/ThemeContext";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GraphEntry {
  date: string;  // YYYY-MM-DD
  count: number;
}

export interface ContributionGraphProps {
  /**
   * Flat array of { date, count } entries.
   * Accepts task-tracker data or GitHub contribution data
   * (flattened from ContribWeek[]).
   */
  data: GraphEntry[];
  /** Label used in the summary line. Defaults to "tasks completed". */
  activityLabel?: string;
  /** Override the year shown in the summary line. Defaults to current local year. */
  year?: number;
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  date: string;
  count: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CELL        = 13;
const GAP         = 3;
const STEP        = CELL + GAP;
const TOTAL_WEEKS = 53;
const DAY_LABEL_W = 28;
const MONTH_ROW_H = 18;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Convert a Date to a local YYYY-MM-DD string.
 * Never uses .toISOString() — that converts to UTC and can produce the previous
 * calendar day for users ahead of UTC (e.g. IST = UTC+5:30).
 */
function localIso(d: Date): string {
  const y  = d.getFullYear();
  const m  = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

/**
 * Map a contribution count to a colour level 0–4.
 *
 * Uses fixed absolute thresholds so that zero always renders as "empty"
 * (graphEmpty token) and non-zero days always get visible colour.
 * When the dataset's busiest day is below 20, thresholds are scaled down
 * proportionally so sparse profiles still use the full colour range.
 *
 *   0        → level 0  (graphEmpty — dim background square)
 *   1–3      → level 1  (faint)
 *   4–9      → level 2  (medium)
 *   10–19    → level 3  (strong)
 *   20+      → level 4  (brightest)
 */
function levelOf(count: number, max: number): number {
  if (count <= 0 || max === 0) return 0;
  // Scale thresholds down for sparse profiles so the full range is always used.
  const scale  = max < 20 ? 20 / max : 1;
  const scaled = count * scale;
  if (scaled < 4)  return 1;
  if (scaled < 10) return 2;
  if (scaled < 20) return 3;
  return 4;
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "long",
    month:   "long",
    day:     "numeric",
    year:    "numeric",
  });
}

// ─── Tooltip ─────────────────────────────────────────────────────────────────

function Tooltip({ state, activityLabel }: { state: TooltipState; activityLabel: string }) {
  if (!state.visible || !state.date) return null;

  return (
    <div
      style={{
        position:       "fixed",
        left:           state.x,
        top:            state.y,
        transform:      "translate(-50%, calc(-100% - 10px))",
        pointerEvents:  "none",
        zIndex:         9999,
        background:     "rgba(8, 8, 16, 0.96)",
        border:         "1px solid rgba(129,140,248,0.18)",
        borderRadius:   10,
        padding:        "8px 11px",
        boxShadow:      "0 16px 48px rgba(0,0,0,0.8), 0 0 0 1px rgba(129,140,248,0.06), inset 0 1px 0 rgba(255,255,255,0.04)",
        backdropFilter: "blur(16px)",
        minWidth:       160,
        opacity:        state.visible ? 1 : 0,
        transition:     "opacity 0.08s ease",
      }}
    >
      <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#4b5563", marginBottom: 5, letterSpacing: "0.025em" }}>
        {formatDate(state.date)}
      </p>
      {state.count === 0 ? (
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#6b7280" }}>
          No contributions
        </p>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              display:        "inline-flex",
              alignItems:     "center",
              justifyContent: "center",
              width:          22,
              height:         22,
              borderRadius:   6,
              background:     "rgba(99,102,241,0.15)",
              border:         "1px solid rgba(129,140,248,0.2)",
              fontFamily:     "'DM Mono', monospace",
              fontSize:       11,
              fontWeight:     700,
              color:          "#818cf8",
            }}
          >
            {state.count}
          </span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#d1d5db" }}>
            {activityLabel}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ContributionGraph({
  data,
  activityLabel = "tasks completed",
  year,
}: ContributionGraphProps) {
  const t      = useTokens();
  const LEVELS = [t.graphEmpty, t.graphL1, t.graphL2, t.graphL3, t.graphL4];

  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false, x: 0, y: 0, date: "", count: 0,
  });

  // ── Build lookup: date → safe integer count ───────────────────────────────
  // Coerce every value with (Number(x) || 0) to guard against null / undefined
  // / NaN values that might arrive from the API before reaching this component.
  const lookup: Record<string, number> = {};
  let maxCount = 0;

  for (const entry of data) {
    if (!entry.date) continue;
    const safe = Math.max(0, Number(entry.count) || 0);
    lookup[entry.date] = (lookup[entry.date] ?? 0) + safe;
    if (lookup[entry.date] > maxCount) maxCount = lookup[entry.date];
  }

  // ── Grid construction ────────────────────────────────────────────────────
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayIso  = localIso(today);
  const dayOfWeek = today.getDay(); // 0 = Sun

  // Start on the Sunday 52 full weeks before the current week's Sunday.
  const startSunday = new Date(today);
  startSunday.setDate(today.getDate() - dayOfWeek - 52 * 7);
  const windowStartIso = localIso(startSunday);

  type Cell = { iso: string; count: number; level: number; empty: boolean };
  const weeks: Cell[][] = [];

  for (let w = 0; w < TOTAL_WEEKS; w++) {
    const week: Cell[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(startSunday);
      date.setDate(startSunday.getDate() + w * 7 + d);

      if (date > today) {
        // Future day — transparent placeholder, no hover
        week.push({ iso: "", count: 0, level: 0, empty: true });
      } else {
        const iso   = localIso(date);
        const count = lookup[iso] ?? 0;
        week.push({ iso, count, level: levelOf(count, maxCount), empty: false });
      }
    }
    weeks.push(week);
  }

  // ── Month labels ──────────────────────────────────────────────────────────
  // Record the first week-index where each calendar month starts, keyed by
  // year*12 + (month-1) so Dec 2024 ≠ Dec 2025 across a year boundary.
  const monthMap = new Map<number, { label: string; weekIdx: number }>();

  for (let wi = 0; wi < weeks.length; wi++) {
    const firstReal = weeks[wi].find((c) => !c.empty);
    if (!firstReal) continue;

    const parts = firstReal.iso.split("-");
    const y     = Number(parts[0]);
    const m     = Number(parts[1]);
    const day   = Number(parts[2]);
    const key   = y * 12 + (m - 1);

    // Only label the week that contains the 1st–7th of the month.
    if (day <= 7 && !monthMap.has(key)) {
      const label = new Date(y, m - 1, 1).toLocaleString("en-US", { month: "short" });
      monthMap.set(key, { label, weekIdx: wi });
    }
  }

  const monthLabels = Array.from(monthMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([, v]) => v);

  // ── Totals for summary line ───────────────────────────────────────────────
  // Sum only entries that fall within the rendered 52-week window.
  let totalInWindow = 0;
  for (const entry of data) {
    if (!entry.date) continue;
    if (entry.date >= windowStartIso && entry.date <= todayIso) {
      totalInWindow += Math.max(0, Number(entry.count) || 0);
    }
  }

  // ── SVG dimensions ────────────────────────────────────────────────────────
  const svgW = DAY_LABEL_W + TOTAL_WEEKS * STEP;
  const svgH = MONTH_ROW_H + 7 * STEP;

  const displayYear = year ?? today.getFullYear();

  const DAY_ROW_LABELS = [
    { row: 1, label: "Mon" },
    { row: 3, label: "Wed" },
    { row: 5, label: "Fri" },
  ] as const;

  // ── Event handlers ────────────────────────────────────────────────────────
  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<SVGRectElement>, iso: string, count: number) => {
      const rect = (e.target as SVGRectElement).getBoundingClientRect();
      (e.target as SVGRectElement).style.opacity = "0.7";
      setTooltip({ visible: true, x: rect.left + rect.width / 2, y: rect.top, date: iso, count });
    },
    [],
  );

  const handleMouseLeave = useCallback((e: React.MouseEvent<SVGRectElement>) => {
    (e.target as SVGRectElement).style.opacity = "1";
    setTooltip((prev) => ({ ...prev, visible: false }));
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-3">
      <Tooltip state={tooltip} activityLabel={activityLabel} />

      {/* Summary line */}
      <div className="flex items-center justify-between">
        <p className="text-[12px]" style={{ color: t.contribText, fontFamily: "'DM Sans', sans-serif" }}>
          <span className="font-semibold" style={{ color: t.textPrimary }}>
            {totalInWindow.toLocaleString()}
          </span>{" "}
          {activityLabel} in {displayYear}
        </p>
      </div>

      {/* Graph */}
      <div className="overflow-x-auto pb-1" style={{ WebkitOverflowScrolling: "touch" }}>
        <svg
          width={svgW}
          height={svgH}
          style={{ display: "block", fontFamily: "'DM Mono', monospace" }}
        >
          {/* Month labels */}
          {monthLabels.map(({ label, weekIdx }) => (
            <text
              key={`${label}-${weekIdx}`}
              x={DAY_LABEL_W + weekIdx * STEP}
              y={12}
              fontSize={10}
              fill={t.graphLabel}
            >
              {label}
            </text>
          ))}

          {/* Day-of-week labels */}
          {DAY_ROW_LABELS.map(({ row, label }) => (
            <text
              key={label}
              x={0}
              y={MONTH_ROW_H + row * STEP + CELL - 1}
              fontSize={9}
              fill={t.graphDayLabel}
              textAnchor="start"
            >
              {label}
            </text>
          ))}

          {/* Cells */}
          {weeks.map((week, wi) =>
            week.map((cell, di) => {
              const x = DAY_LABEL_W + wi * STEP;
              const y = MONTH_ROW_H + di * STEP;

              if (cell.empty) {
                return (
                  <rect
                    key={`${wi}-${di}`}
                    x={x} y={y}
                    width={CELL} height={CELL}
                    rx={2} ry={2}
                    fill="transparent"
                  />
                );
              }

              return (
                <rect
                  key={`${wi}-${di}`}
                  x={x} y={y}
                  width={CELL} height={CELL}
                  rx={2} ry={2}
                  fill={LEVELS[cell.level]}
                  style={{ cursor: "default", transition: "opacity 0.15s" }}
                  onMouseEnter={(e) => handleMouseEnter(e, cell.iso, cell.count)}
                  onMouseLeave={handleMouseLeave}
                />
              );
            })
          )}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1.5">
        <span className="text-[10px]" style={{ color: t.textFaint, fontFamily: "'DM Mono', monospace" }}>
          Less
        </span>
        {LEVELS.map((c, i) => (
          <div key={i} className="w-2.5 h-2.5 rounded-sm" style={{ background: c }} />
        ))}
        <span className="text-[10px]" style={{ color: t.textFaint, fontFamily: "'DM Mono', monospace" }}>
          More
        </span>
      </div>
    </div>
  );
}