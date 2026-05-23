import { cn } from "../../lib/utils";

interface ColorDotProps {
  color: string;
  className?: string;
}

/** Renders a dot using a dynamic color from API data via CSS variable (no hardcoded palette). */
export function ColorDot({ color, className }: ColorDotProps) {
  return (
    <span
      className={cn("inline-block shrink-0 rounded-full bg-[var(--dot-color)]", className)}
      style={{ "--dot-color": color } as React.CSSProperties}
    />
  );
}
