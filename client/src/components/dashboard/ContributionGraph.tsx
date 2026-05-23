import { useCallback, useMemo, useState } from "react";
import { useTheme, getDashCssVar } from "../../state/theme/ThemeContext";
import { FixedTooltip } from "../ui/FixedTooltip";
import { cn } from "../../lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GraphEntry {
  date: string;
  count: number;
}

export type ContributionLevelMode = "fixed" | "scaled";
export type ContributionTotalMode = "all" | "window";

export interface ContributionGraphProps {
  data: GraphEntry[];
  /** Label for summary line and tooltip (e.g. "tasks completed", "contributions"). */
  activityLabel?: string;
  year?: number;
  /** Fixed thresholds (home) vs scaled to max count (dev). */
  levelMode?: ContributionLevelMode;
  /** Sum all data vs only cells in the visible 53-week window. */
  totalMode?: ContributionTotalMode;
  /** Sum duplicate dates instead of last-wins. */
  aggregateDuplicates?: boolean;
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  date: string;
  count: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CELL = 13;
const GAP = 3;
const STEP = CELL + GAP;
const TOTAL_WEEKS = 53;
const DAY_LABEL_W = 28;
const MONTH_ROW_H = 18;

const GRAPH_VAR_KEYS = [
  "--dash-graph-empty",
  "--dash-graph-l1",
  "--dash-graph-l2",
  "--dash-graph-l3",
  "--dash-graph-l4",
] as const;

const LEGEND_CLASSES = [
  "bg-dash-graph-empty",
  "bg-dash-graph-l1",
  "bg-dash-graph-l2",
  "bg-dash-graph-l3",
  "bg-dash-graph-l4",
] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function localIso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

function fixedLevel(count: number): number {
  if (count === 0) return 0;
  if (count < 2) return 1;
  if (count < 4) return 2;
  if (count < 6) return 3;
  return 4;
}

function scaledLevel(count: number, max: number): number {
  if (count <= 0 || max === 0) return 0;
  const scale = max < 20 ? 20 / max : 1;
  const scaled = count * scale;
  if (scaled < 4) return 1;
  if (scaled < 10) return 2;
  if (scaled < 20) return 3;
  return 4;
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function buildLookup(
  data: GraphEntry[],
  aggregateDuplicates: boolean,
): { lookup: Record<string, number>; maxCount: number } {
  const lookup: Record<string, number> = {};
  let maxCount = 0;

  for (const entry of data) {
    if (!entry.date) continue;
    const safe = Math.max(0, Number(entry.count) || 0);
    if (aggregateDuplicates) {
      lookup[entry.date] = (lookup[entry.date] ?? 0) + safe;
    } else {
      lookup[entry.date] = safe;
    }
    if (lookup[entry.date] > maxCount) maxCount = lookup[entry.date];
  }

  return { lookup, maxCount };
}

function useGraphPalette() {
  const { theme } = useTheme();
  return useMemo(() => {
    const fills = GRAPH_VAR_KEYS.map((key) => getDashCssVar(key));
    return {
      fills,
      label: getDashCssVar("--dash-graph-label"),
      dayLabel: getDashCssVar("--dash-graph-day-label"),
    };
  }, [theme]);
}

// ─── Tooltip ─────────────────────────────────────────────────────────────────

function Tooltip({
  state,
  activityLabel,
}: {
  state: TooltipState;
  activityLabel: string;
}) {
  if (!state.visible || !state.date) return null;

  const unit =
    activityLabel === "tasks completed"
      ? `task${state.count !== 1 ? "s" : ""} completed`
      : activityLabel;

  return (
    <FixedTooltip
      x={state.x}
      y={state.y}
      className={cn(
        "min-w-[160px] -translate-x-1/2 -translate-y-[calc(100%+10px)]",
        "rounded-[10px] border border-dash-accent-border/20",
        "bg-dash-modal/95 px-[11px] py-2 shadow-2xl backdrop-blur-2xl",
        "transition-opacity duration-75",
        state.visible ? "opacity-100" : "opacity-0",
      )}
    >
      <p className="mb-1.5 font-dash-mono text-[10px] tracking-wide text-dash-faint">
        {formatDate(state.date)}
      </p>
      {state.count === 0 ? (
        <p className="font-dash-mono text-xs text-dash-muted">No contributions</p>
      ) : (
        <div className="flex items-center gap-1.5">
          <span className="inline-flex h-[22px] w-[22px] items-center justify-center rounded-md border border-dash-accent-border/30 bg-dash-accent-soft font-dash-mono text-[11px] font-bold text-dash-violet">
            {state.count}
          </span>
          <span className="font-dash-mono text-xs text-dash-secondary">{unit}</span>
        </div>
      )}
    </FixedTooltip>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ContributionGraph({
  data,
  activityLabel = "tasks completed",
  year,
  levelMode = "fixed",
  totalMode = "all",
  aggregateDuplicates = false,
}: ContributionGraphProps) {
  const { fills, label, dayLabel } = useGraphPalette();

  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    date: "",
    count: 0,
  });

  const { lookup, maxCount } = useMemo(
    () => buildLookup(data, aggregateDuplicates),
    [data, aggregateDuplicates],
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayIso = localIso(today);
  const dayOfWeek = today.getDay();

  const startSunday = new Date(today);
  startSunday.setDate(today.getDate() - dayOfWeek - 52 * 7);
  const windowStartIso = localIso(startSunday);

  const levelFor = useCallback(
    (count: number) =>
      levelMode === "scaled" ? scaledLevel(count, maxCount) : fixedLevel(count),
    [levelMode, maxCount],
  );

  type Cell = { iso: string; count: number; level: number; empty: boolean };
  const weeks: Cell[][] = [];

  for (let w = 0; w < TOTAL_WEEKS; w++) {
    const week: Cell[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(startSunday);
      date.setDate(startSunday.getDate() + w * 7 + d);

      if (date > today) {
        week.push({ iso: "", count: 0, level: 0, empty: true });
      } else {
        const iso = localIso(date);
        const count = lookup[iso] ?? 0;
        week.push({ iso, count, level: levelFor(count), empty: false });
      }
    }
    weeks.push(week);
  }

  const monthMap = new Map<number, { label: string; weekIdx: number }>();

  for (let wi = 0; wi < weeks.length; wi++) {
    const firstReal = weeks[wi].find((c) => !c.empty);
    if (!firstReal) continue;

    const parts = firstReal.iso.split("-");
    const y = Number(parts[0]);
    const m = Number(parts[1]);
    const day = Number(parts[2]);
    const key = y * 12 + (m - 1);

    if (day <= 7 && !monthMap.has(key)) {
      const monthLabel = new Date(y, m - 1, 1).toLocaleString("en-US", { month: "short" });
      monthMap.set(key, { label: monthLabel, weekIdx: wi });
    }
  }

  const monthLabels = Array.from(monthMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([, v]) => v);

  const totalCount = useMemo(() => {
    if (totalMode === "all") {
      return data.reduce((s, d) => s + Math.max(0, Number(d.count) || 0), 0);
    }
    let sum = 0;
    for (const entry of data) {
      if (!entry.date) continue;
      if (entry.date >= windowStartIso && entry.date <= todayIso) {
        sum += Math.max(0, Number(entry.count) || 0);
      }
    }
    return sum;
  }, [data, totalMode, windowStartIso, todayIso]);

  const svgW = DAY_LABEL_W + TOTAL_WEEKS * STEP;
  const svgH = MONTH_ROW_H + 7 * STEP;
  const displayYear = year ?? today.getFullYear();

  const DAY_ROW_LABELS = [
    { row: 1, label: "Mon" },
    { row: 3, label: "Wed" },
    { row: 5, label: "Fri" },
  ] as const;

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<SVGRectElement>, iso: string, count: number) => {
      const rect = (e.target as SVGRectElement).getBoundingClientRect();
      setTooltip({
        visible: true,
        x: rect.left + rect.width / 2,
        y: rect.top,
        date: iso,
        count,
      });
    },
    [],
  );

  const handleMouseLeave = useCallback(() => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <Tooltip state={tooltip} activityLabel={activityLabel} />

      <div className="flex items-center justify-between">
        <p className="font-dash-sans text-[12px] text-dash-contrib-text">
          <span className="font-semibold text-dash-primary">
            {totalCount.toLocaleString()}
          </span>{" "}
          {activityLabel} in {displayYear}
        </p>
      </div>

      <div className="overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]">
        <svg width={svgW} height={svgH} className="block font-dash-mono">
          {monthLabels.map(({ label: monthLabel, weekIdx }) => (
            <text
              key={`${monthLabel}-${weekIdx}`}
              x={DAY_LABEL_W + weekIdx * STEP}
              y={12}
              fontSize={10}
              fill={label}
            >
              {monthLabel}
            </text>
          ))}

          {DAY_ROW_LABELS.map(({ row, label: dayLabelText }) => (
            <text
              key={dayLabelText}
              x={0}
              y={MONTH_ROW_H + row * STEP + CELL - 1}
              fontSize={9}
              fill={dayLabel}
              textAnchor="start"
            >
              {dayLabelText}
            </text>
          ))}

          {weeks.map((week, wi) =>
            week.map((cell, di) => {
              const x = DAY_LABEL_W + wi * STEP;
              const y = MONTH_ROW_H + di * STEP;

              if (cell.empty) {
                return (
                  <rect
                    key={`${wi}-${di}`}
                    x={x}
                    y={y}
                    width={CELL}
                    height={CELL}
                    rx={2}
                    ry={2}
                    fill="transparent"
                  />
                );
              }

              return (
                <rect
                  key={`${wi}-${di}`}
                  x={x}
                  y={y}
                  width={CELL}
                  height={CELL}
                  rx={2}
                  ry={2}
                  fill={fills[cell.level]}
                  className="cursor-default transition-opacity duration-150 hover:opacity-70"
                  onMouseEnter={(e) => handleMouseEnter(e, cell.iso, cell.count)}
                  onMouseLeave={handleMouseLeave}
                />
              );
            }),
          )}
        </svg>
      </div>

      <div className="flex items-center justify-end gap-1.5">
        <span className="font-dash-mono text-[10px] text-dash-faint">Less</span>
        {LEGEND_CLASSES.map((cls) => (
          <div key={cls} className={cn("h-2.5 w-2.5 rounded-sm", cls)} />
        ))}
        <span className="font-dash-mono text-[10px] text-dash-faint">More</span>
      </div>
    </div>
  );
}
