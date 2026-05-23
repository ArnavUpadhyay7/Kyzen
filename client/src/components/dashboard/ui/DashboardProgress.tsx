import type { HTMLAttributes } from "react";
import { progressScaleClass } from "../../../lib/progress";
import { cn } from "../../../lib/utils";

export interface DashboardProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
}

export function DashboardProgress({
  value,
  max = 100,
  label,
  showValue = false,
  className,
  ...props
}: DashboardProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn("w-full", className)} {...props}>
      {(label || showValue) && (
        <div className="mb-1.5 flex items-center justify-between gap-2">
          {label && (
            <span className="text-xs text-dash-muted font-dash-sans">{label}</span>
          )}
          {showValue && (
            <span className="text-xs text-dash-faint font-dash-mono tabular-nums">
              {Math.round(pct)}%
            </span>
          )}
        </div>
      )}
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-dash-muted-btn"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={cn(
            "h-full w-full origin-left rounded-full bg-dash-accent transition-transform duration-300 ease-out",
            progressScaleClass(value, max),
          )}
        />
      </div>
    </div>
  );
}
