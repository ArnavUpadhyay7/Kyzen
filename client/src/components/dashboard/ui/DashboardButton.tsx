import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../../lib/utils";

type DashboardButtonVariant = "primary" | "muted" | "ghost" | "danger";
type DashboardButtonSize = "sm" | "md";

export interface DashboardButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: DashboardButtonVariant;
  size?: DashboardButtonSize;
}

const variantClasses: Record<DashboardButtonVariant, string> = {
  primary:
    "bg-dash-accent text-white border border-dash-accent hover:brightness-110 shadow-[0_0_12px_color-mix(in_srgb,var(--dash-accent)_33%,transparent)]",
  muted:
    "bg-dash-muted-btn text-dash-secondary border border-dash-border hover:bg-dash-muted-btn-hover",
  ghost:
    "bg-transparent text-dash-muted border border-transparent hover:bg-dash-muted-btn hover:text-dash-secondary",
  danger:
    "bg-dash-danger/15 text-dash-danger border border-dash-danger/30 hover:bg-dash-danger/25",
};

const sizeClasses: Record<DashboardButtonSize, string> = {
  sm: "px-2.5 py-1 text-xs rounded-md",
  md: "px-3.5 py-2 text-sm rounded-lg",
};

export function DashboardButton({
  children,
  className,
  variant = "muted",
  size = "md",
  type = "button",
  ...props
}: DashboardButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium font-dash-sans transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
