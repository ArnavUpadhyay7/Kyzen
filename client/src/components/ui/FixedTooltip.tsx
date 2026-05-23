import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface FixedTooltipProps {
  x: number;
  y: number;
  visible?: boolean;
  children: ReactNode;
  className?: string;
}

/** Positions a tooltip at viewport coordinates via CSS variables (dynamic API/cursor position). */
export function FixedTooltip({ x, y, visible = true, children, className }: FixedTooltipProps) {
  if (!visible) return null;

  return (
    <div
      className={cn(
        "pointer-events-none fixed z-[9999] left-[var(--tip-x)] top-[var(--tip-y)]",
        className,
      )}
      style={{ "--tip-x": `${x}px`, "--tip-y": `${y}px` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
