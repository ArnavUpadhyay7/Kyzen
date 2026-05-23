import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../../lib/utils";

type DashboardBadgeVariant = "accent" | "violet" | "success" | "warning" | "danger" | "muted";

export interface DashboardBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: DashboardBadgeVariant;
}

const variantClasses: Record<DashboardBadgeVariant, string> = {
  accent: "bg-dash-accent-soft text-dash-accent border-dash-accent-border",
  violet: "bg-dash-accent-soft text-dash-violet border-dash-accent-border",
  success: "bg-dash-success/15 text-dash-success border-dash-success/30",
  warning: "bg-dash-warning/15 text-dash-warning border-dash-warning/30",
  danger: "bg-dash-danger/15 text-dash-danger border-dash-danger/30",
  muted: "bg-dash-muted-btn text-dash-muted border-dash-border",
};

export function DashboardBadge({
  children,
  className,
  variant = "accent",
  ...props
}: DashboardBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-semibold tracking-wide font-dash-mono",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
