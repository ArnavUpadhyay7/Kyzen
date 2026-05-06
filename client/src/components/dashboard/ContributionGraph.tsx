import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTokens } from "../../context/ThemeContext";

// ─── Types ────────────────────────────────────────────────────────────────────

type ViewMode = "month" | "year";

interface GraphEntry { date: string; count: number }

interface ContributionGraphProps {
  data: GraphEntry[];
  /** Earliest date user has data for (their join date). ISO string "YYYY-MM-DD". */
  joinDate?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CELL   = 13;
const GAP    = 3;
const STEP   = CELL + GAP;
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toIso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function levelOf(count: number): number {
  if (count === 0) return 0;
  if (count < 2)   return 1;
  if (count < 4)   return 2;
  if (count < 6)   return 3;
  return 4;
}

// ─── Month View ───────────────────────────────────────────────────────────────

function MonthView({
  year, month, lookup, colors,
}: {
  year: number;
  month: number; // 0-indexed
  lookup: Record<string, number>;
  colors: string[];
}) {
  const today     = new Date();
  const todayIso  = toIso(today);

  // First day of month → find its day-of-week (0=Sun)
  const firstDay  = new Date(year, month, 1);
  const startDow  = firstDay.getDay(); // 0-6

  // Days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Build a grid: rows = weeks, cols = days (Sun-Sat)
  // We pad the front with empty slots
  type Cell = { day: number | null; iso: string | null; count: number; level: number; isFuture: boolean };
  const cells: Cell[] = [];

  for (let i = 0; i < startDow; i++) {
    cells.push({ day: null, iso: null, count: 0, level: 0, isFuture: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const date     = new Date(year, month, d);
    const iso      = toIso(date);
    const isFuture = iso > todayIso;
    const count    = isFuture ? 0 : (lookup[iso] ?? 0);
    cells.push({ day: d, iso, count, level: levelOf(count), isFuture });
  }

  // Pad end to complete last week row
  while (cells.length % 7 !== 0) {
    cells.push({ day: null, iso: null, count: 0, level: 0, isFuture: false });
  }

  const weeks: Cell[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  const DAY_LABELS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const DAY_LABEL_W = 30;
  const HEADER_H = 16;
  const svgW = DAY_LABEL_W + 7 * STEP;
  const svgH = HEADER_H + weeks.length * STEP;

  const totalMonth = cells.reduce((s, c) => s + (c.day ? c.count : 0), 0);

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[11px]" style={{ color: "#9ca3af", fontFamily: "'DM Mono', monospace" }}>
        <span style={{ color: "#e5e7eb", fontWeight: 600 }}>{totalMonth}</span> tasks this month
      </p>
      <div className="overflow-x-auto">
        <svg width={svgW} height={svgH} style={{ display: "block", fontFamily: "'DM Mono', monospace" }}>
          {/* Day-of-week headers */}
          {DAY_LABELS.map((label, i) => (
            <text
              key={label}
              x={DAY_LABEL_W + i * STEP + CELL / 2}
              y={11}
              fontSize={8}
              fill={colors[0] === "#1e1e2e" ? "#6b7280" : "#9ca3af"}
              textAnchor="middle"
            >
              {label[0]}
            </text>
          ))}

          {/* Day cells */}
          {weeks.map((week, wi) =>
            week.map((cell, di) => {
              const x = DAY_LABEL_W + di * STEP;
              const y = HEADER_H + wi * STEP;
              if (!cell.day) {
                return <rect key={`${wi}-${di}`} x={x} y={y} width={CELL} height={CELL} rx={2} fill="transparent" />;
              }
              const fill = cell.isFuture ? "transparent" : colors[cell.level];
              return (
                <g key={`${wi}-${di}`}>
                  <rect
                    x={x} y={y} width={CELL} height={CELL} rx={2}
                    fill={fill}
                    stroke={cell.iso ? "rgba(255,255,255,0.04)" : "none"}
                    strokeWidth={0.5}
                    style={{ cursor: cell.count > 0 ? "pointer" : "default", transition: "opacity 0.15s" }}
                    onMouseEnter={(e) => { if (cell.count > 0) (e.target as SVGRectElement).style.opacity = "0.7"; }}
                    onMouseLeave={(e) => { (e.target as SVGRectElement).style.opacity = "1"; }}
                  >
                    {cell.iso && cell.count > 0 && (
                      <title>{cell.iso}: {cell.count} task{cell.count !== 1 ? "s" : ""}</title>
                    )}
                  </rect>
                  {/* Day number */}
                  <text
                    x={x + CELL / 2}
                    y={y + CELL / 2 + 3.5}
                    fontSize={7}
                    fill={cell.count > 0 ? "rgba(255,255,255,0.85)" : "rgba(156,163,175,0.5)"}
                    textAnchor="middle"
                    style={{ pointerEvents: "none", userSelect: "none" }}
                  >
                    {cell.day}
                  </text>
                </g>
              );
            })
          )}
        </svg>
      </div>
    </div>
  );
}

// ─── Year View ────────────────────────────────────────────────────────────────

function YearView({ year, lookup, colors }: {
  year: number;
  lookup: Record<string, number>;
  colors: string[];
}) {
  const today        = new Date();
  const todayIso     = toIso(today);
  const isCurrentYr  = year === today.getFullYear();

  // Build Sunday-aligned weeks for the full year
  const jan1    = new Date(year, 0, 1);
  const startDow = jan1.getDay();
  const start   = new Date(jan1);
  start.setDate(jan1.getDate() - startDow);

  const endDate = isCurrentYr ? today : new Date(year, 11, 31);

  type Cell = { iso: string; count: number; level: number; empty: boolean };
  const weeks: Cell[][] = [];
  const cursor = new Date(start);

  while (cursor <= endDate || weeks.length === 0) {
    const week: Cell[] = [];
    for (let d = 0; d < 7; d++) {
      const iso = toIso(cursor);
      const isOutOfYear = cursor.getFullYear() !== year;
      const isFuture    = iso > todayIso;
      if (isOutOfYear || isFuture) {
        week.push({ iso: "", count: 0, level: 0, empty: true });
      } else {
        const count = lookup[iso] ?? 0;
        week.push({ iso, count, level: levelOf(count), empty: false });
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
    if (cursor > endDate && weeks.length > 4) break;
  }

  // Month labels
  const monthLabels: { label: string; weekIdx: number }[] = [];
  weeks.forEach((week, wi) => {
    const firstReal = week.find((c) => !c.empty);
    if (!firstReal) return;
    const d = new Date(firstReal.iso);
    if (d.getDate() <= 7) {
      const label = MONTHS[d.getMonth()];
      if (!monthLabels.find((m) => m.label === label)) {
        monthLabels.push({ label, weekIdx: wi });
      }
    }
  });

  const DAY_LABEL_W = 28;
  const MONTH_ROW_H = 18;
  const svgW = DAY_LABEL_W + weeks.length * STEP;
  const svgH = MONTH_ROW_H + 7 * STEP;
  const totalYear = Object.entries(lookup)
    .filter(([d]) => d.startsWith(`${year}-`))
    .reduce((s, [, v]) => s + v, 0);

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[11px]" style={{ color: "#9ca3af", fontFamily: "'DM Mono', monospace" }}>
        <span style={{ color: "#e5e7eb", fontWeight: 600 }}>{totalYear}</span> tasks in {year}
      </p>
      <div className="overflow-x-auto pb-1" style={{ WebkitOverflowScrolling: "touch" }}>
        <svg width={svgW} height={svgH} style={{ display: "block", fontFamily: "'DM Mono', monospace" }}>
          {monthLabels.map(({ label, weekIdx }) => (
            <text key={label} x={DAY_LABEL_W + weekIdx * STEP} y={12} fontSize={10} fill="#6b7280">
              {label}
            </text>
          ))}
          {[
            { row: 1, label: "Mon" },
            { row: 3, label: "Wed" },
            { row: 5, label: "Fri" },
          ].map(({ row, label }) => (
            <text key={label} x={0} y={MONTH_ROW_H + row * STEP + CELL - 1} fontSize={9} fill="#4b5563" textAnchor="start">
              {label}
            </text>
          ))}
          {weeks.map((week, wi) =>
            week.map((cell, di) => {
              const x = DAY_LABEL_W + wi * STEP;
              const y = MONTH_ROW_H + di * STEP;
              if (cell.empty) return <rect key={`${wi}-${di}`} x={x} y={y} width={CELL} height={CELL} rx={2} fill="transparent" />;
              return (
                <rect
                  key={`${wi}-${di}`}
                  x={x} y={y} width={CELL} height={CELL} rx={2}
                  fill={colors[cell.level]}
                  style={{ cursor: cell.count > 0 ? "pointer" : "default", transition: "opacity 0.15s" }}
                  onMouseEnter={(e) => { if (cell.count > 0) (e.target as SVGRectElement).style.opacity = "0.7"; }}
                  onMouseLeave={(e) => { (e.target as SVGRectElement).style.opacity = "1"; }}
                >
                  <title>{cell.iso}: {cell.count} task{cell.count !== 1 ? "s" : ""}</title>
                </rect>
              );
            })
          )}
        </svg>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ContributionGraph({ data, joinDate }: ContributionGraphProps) {
  const t = useTokens();
  const COLORS = [t.graphEmpty, t.graphL1, t.graphL2, t.graphL3, t.graphL4];

  const today   = new Date();
  const todayYM = { year: today.getFullYear(), month: today.getMonth() };

  const [mode,  setMode]  = useState<ViewMode>("month");
  const [year,  setYear]  = useState(todayYM.year);
  const [month, setMonth] = useState(todayYM.month);

  // Build lookup once
  const lookup = useMemo(() => {
    const m: Record<string, number> = {};
    data.forEach((d) => { m[d.date] = d.count; });
    return m;
  }, [data]);

  // ── Bounds ────────────────────────────────────────────────────────────────
  const minYear  = joinDate ? new Date(joinDate).getFullYear() : today.getFullYear();
  const minMonth = joinDate ? new Date(joinDate).getMonth()    : today.getMonth();

  const canGoBack = mode === "month"
    ? (year > minYear || (year === minYear && month > minMonth))
    : year > minYear;

  const canGoFwd = mode === "month"
    ? (year < todayYM.year || (year === todayYM.year && month < todayYM.month))
    : year < todayYM.year;

  function goBack() {
    if (mode === "month") {
      if (month === 0) { setYear((y) => y - 1); setMonth(11); }
      else setMonth((m) => m - 1);
    } else {
      setYear((y) => y - 1);
    }
  }

  function goFwd() {
    if (mode === "month") {
      if (month === 11) { setYear((y) => y + 1); setMonth(0); }
      else setMonth((m) => m + 1);
    } else {
      setYear((y) => y + 1);
    }
  }

  // ── Nav label ─────────────────────────────────────────────────────────────
  const navLabel = mode === "month"
    ? `${MONTHS[month]} ${year}`
    : `${year}`;

  const navBtnStyle = (enabled: boolean) => ({
    width: 24, height: 24,
    borderRadius: 6,
    display: "flex", alignItems: "center", justifyContent: "center",
    background: enabled ? t.mutedBtn : "transparent",
    opacity: enabled ? 1 : 0.25,
    cursor: enabled ? "pointer" : "default",
    border: `1px solid ${t.border}`,
    transition: "opacity 0.15s, background 0.15s",
  } as React.CSSProperties);

  const toggleBase = {
    fontSize: 10,
    fontFamily: "'DM Mono', monospace",
    padding: "2px 8px",
    borderRadius: 6,
    border: `1px solid ${t.border}`,
    cursor: "pointer",
    transition: "background 0.15s, color 0.15s",
  } as React.CSSProperties;

  return (
    <div className="flex flex-col gap-3">
      {/* Controls row */}
      <div className="flex items-center justify-between gap-2">
        {/* Mode toggle */}
        <div className="flex items-center gap-1">
          {(["month", "year"] as ViewMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                ...toggleBase,
                background: mode === m ? t.accentSoft : "transparent",
                color: mode === m ? "#818cf8" : t.textFaint,
              }}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>

        {/* Navigator */}
        <div className="flex items-center gap-1.5">
          <button
            disabled={!canGoBack}
            onClick={canGoBack ? goBack : undefined}
            style={navBtnStyle(canGoBack)}
          >
            <ChevronLeft size={12} color={t.textMuted} />
          </button>
          <span
            className="text-[11px] select-none"
            style={{ color: t.textMuted, fontFamily: "'DM Mono', monospace", minWidth: 68, textAlign: "center" }}
          >
            {navLabel}
          </span>
          <button
            disabled={!canGoFwd}
            onClick={canGoFwd ? goFwd : undefined}
            style={navBtnStyle(canGoFwd)}
          >
            <ChevronRight size={12} color={t.textMuted} />
          </button>
        </div>
      </div>

      {/* Graph */}
      {mode === "month" ? (
        <MonthView year={year} month={month} lookup={lookup} colors={COLORS} />
      ) : (
        <YearView year={year} lookup={lookup} colors={COLORS} />
      )}

      {/* Legend */}
      <div className="flex items-center justify-end gap-1.5">
        <span className="text-[10px]" style={{ color: t.textFaint, fontFamily: "'DM Mono', monospace" }}>Less</span>
        {COLORS.map((c, i) => (
          <div key={i} className="w-2.5 h-2.5 rounded-sm" style={{ background: c }} />
        ))}
        <span className="text-[10px]" style={{ color: t.textFaint, fontFamily: "'DM Mono', monospace" }}>More</span>
      </div>
    </div>
  );
}