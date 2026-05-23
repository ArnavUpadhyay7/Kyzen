import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../../lib/utils";

export interface DashboardCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  alt?: boolean;
}

export function DashboardCard({
  children,
  className,
  hover = false,
  alt = false,
  ...props
}: DashboardCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-dash-border shadow-dash-card transition-colors duration-200",
        alt ? "bg-dash-card-alt" : "bg-dash-card",
        hover && "hover:bg-dash-card-hover",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
