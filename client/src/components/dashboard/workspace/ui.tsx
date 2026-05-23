import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../../lib/utils";
import { progressScaleClass } from "../../../lib/progress";
import { DashboardButton, DashboardCard } from "../ui";

export { DashboardButton, DashboardInput, DashboardBadge, DashboardProgress } from "../ui";

interface WorkspaceCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  topGlow?: boolean;
  accentBarClass?: string;
  onClick?: () => void;
}

export function WorkspaceCard({
  children,
  className,
  topGlow = false,
  accentBarClass,
  onClick,
  ...props
}: WorkspaceCardProps) {
  return (
    <DashboardCard
      hover={!!onClick}
      className={cn("relative overflow-hidden", onClick && "cursor-pointer", className)}
      onClick={onClick}
      {...props}
    >
      {topGlow && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-dash-accent-border to-transparent" />
      )}
      {accentBarClass && (
        <div className={cn("absolute bottom-2.5 left-0 top-2.5 w-0.5 rounded-full", accentBarClass)} />
      )}
      {children}
    </DashboardCard>
  );
}

export function Pill({
  label,
  className,
  small,
}: {
  label: string;
  className?: string;
  small?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-dash-mono font-semibold tracking-wide whitespace-nowrap",
        small ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-[11px]",
        className,
      )}
    >
      {label}
    </span>
  );
}

export function SectionHeader({
  title,
  count,
  action,
  onAction,
}: {
  title: string;
  count?: number;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="mb-5 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <h2 className="text-sm font-semibold tracking-wide text-dash-primary font-dash-sans">{title}</h2>
        {count != null && (
          <span className="rounded-full border border-dash-accent-border bg-dash-accent-soft px-2.5 py-0.5 font-dash-mono text-[11px] text-dash-violet">
            {count}
          </span>
        )}
      </div>
      {action && (
        <DashboardButton variant="ghost" size="sm" onClick={onAction}>
          + {action}
        </DashboardButton>
      )}
    </div>
  );
}

export function SearchBar({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative mb-4">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-dash-faint">
        ⌕
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Search…"}
        className="w-full rounded-lg border border-dash-input-border bg-dash-input py-2.5 pl-9 pr-3 text-[13px] text-dash-primary outline-none transition-all placeholder:text-dash-faint focus:border-dash-border-med focus:ring-2 focus:ring-dash-accent-soft font-dash-sans"
      />
    </div>
  );
}

export function ProgressBar({
  value,
  className,
  barClassName,
}: {
  value: number;
  className?: string;
  barClassName?: string;
}) {
  return (
    <div className={cn("h-1 overflow-hidden rounded-full bg-dash-muted-btn", className)}>
      <div
        className={cn(
          "h-full w-full origin-left rounded-full bg-dash-violet opacity-90 transition-transform duration-500",
          progressScaleClass(value),
          barClassName,
        )}
      />
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <p className="text-[13px] text-dash-muted font-dash-sans">{message}</p>
    </div>
  );
}

export function LoadingState({ message = "Loading…" }: { message?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-[13px] text-dash-muted font-dash-sans">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-dash-border border-t-dash-violet" />
      {message}
    </div>
  );
}

export function PrimaryButton({
  children,
  loading,
  loadingLabel,
  className,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  loading?: boolean;
  loadingLabel?: string;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <DashboardButton
      variant="primary"
      className={cn("w-full", className)}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? loadingLabel ?? "Saving…" : children}
    </DashboardButton>
  );
}

export function SecondaryButton({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <DashboardButton variant="ghost" className={className} onClick={onClick}>
      {children}
    </DashboardButton>
  );
}

export function AccentButton({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <DashboardButton variant="ghost" size="sm" className={className} onClick={onClick}>
      {children}
    </DashboardButton>
  );
}

export function FormLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1 block font-dash-mono text-[9px] font-semibold uppercase tracking-widest text-dash-faint">
      {children}
    </label>
  );
}

export function FormInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props;
  return (
    <input
      className={cn(
        "w-full rounded-lg border border-dash-input-border bg-dash-input px-2.5 py-2 text-[13px] text-dash-primary outline-none transition-colors focus:border-dash-border-med font-dash-sans",
        className,
      )}
      {...rest}
    />
  );
}

export function FormTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className, ...rest } = props;
  return (
    <textarea
      className={cn(
        "w-full resize-none rounded-lg border border-dash-input-border bg-dash-input px-2.5 py-2 text-[13px] leading-relaxed text-dash-primary outline-none transition-colors focus:border-dash-border-med font-dash-sans",
        className,
      )}
      {...rest}
    />
  );
}

export function FormSelect({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full rounded-lg border border-dash-input-border bg-dash-input px-2.5 py-2 text-[13px] text-dash-primary outline-none transition-colors focus:border-dash-border-med font-dash-sans",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function FilterChip({
  active,
  onClick,
  children,
  activeClassName,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  activeClassName?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg border px-3 py-1.5 font-dash-mono text-[11px] font-semibold transition-all",
        active
          ? activeClassName ?? "border-dash-accent-border bg-dash-accent-soft text-dash-violet"
          : "border-dash-border bg-dash-card-alt text-dash-muted hover:text-dash-secondary",
      )}
    >
      {children}
    </button>
  );
}