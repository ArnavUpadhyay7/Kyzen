import { cn } from "../../../lib/utils";

interface PillProps {
  label: string;
  className?: string;
  small?: boolean;
}

export function Pill({ label, className, small }: PillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-mono font-semibold tracking-wide whitespace-nowrap",
        small ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-[11px]",
        className
      )}
    >
      {label}
    </span>
  );
}

interface WorkspaceCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  accentBarClass?: string;
  topGlow?: boolean;
}

export function WorkspaceCard({
  children,
  className,
  onClick,
  accentBarClass,
  topGlow = false,
}: WorkspaceCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative overflow-hidden rounded-xl border border-indigo-500/15 bg-white/[0.035] transition-all duration-200",
        onClick && "cursor-pointer hover:border-indigo-500/25 hover:bg-white/[0.055]",
        className
      )}
    >
      {topGlow && (
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
      )}
      {accentBarClass && (
        <div className={cn("absolute bottom-2.5 left-0 top-2.5 w-0.5 rounded-full", accentBarClass)} />
      )}
      {children}
    </div>
  );
}

interface SectionHeaderProps {
  title: string;
  count?: number;
  action?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, count, action, onAction }: SectionHeaderProps) {
  return (
    <div className="mb-5 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <h2 className="text-sm font-semibold tracking-wide text-white">{title}</h2>
        {count != null && (
          <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 font-mono text-[11px] text-violet-400">
            {count}
          </span>
        )}
      </div>
      {action && (
        <button
          type="button"
          onClick={onAction}
          className="flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 font-mono text-[11px] font-semibold tracking-wide text-violet-400 transition-colors hover:bg-indigo-500/15"
        >
          + {action}
        </button>
      )}
    </div>
  );
}

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  return (
    <div className="relative mb-4">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-white/20">
        ⌕
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Search…"}
        className="w-full rounded-lg border border-indigo-500/15 bg-white/[0.03] py-2.5 pl-9 pr-3 text-[13px] text-white outline-none transition-all placeholder:text-white/25 focus:border-indigo-500/30 focus:bg-white/[0.05] focus:ring-2 focus:ring-indigo-500/10"
      />
    </div>
  );
}

interface ProgressBarProps {
  value: number;
  className?: string;
  barClassName?: string;
}

export function ProgressBar({ value, className, barClassName }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={cn("h-1 overflow-hidden rounded-full bg-white/[0.06]", className)}>
      <div
        className={cn("h-full rounded-full bg-violet-400 opacity-90 transition-all duration-500", barClassName)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return <p className="py-12 text-center text-[13px] text-white/40">{message}</p>;
}

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading…" }: LoadingStateProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-[13px] text-white/40">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-500/20 border-t-violet-400" />
      {message}
    </div>
  );
}

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingLabel?: string;
}

export function PrimaryButton({
  children,
  loading,
  loadingLabel,
  className,
  disabled,
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={cn(
        "w-full rounded-lg py-2.5 font-mono text-[13px] font-semibold tracking-wide transition-all",
        disabled || loading
          ? "cursor-not-allowed bg-white/[0.05] text-white/40"
          : "bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30",
        className
      )}
      {...props}
    >
      {loading ? loadingLabel ?? "Saving…" : children}
    </button>
  );
}

export function SecondaryButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "rounded-lg border border-indigo-500/15 bg-transparent px-3.5 py-2 font-mono text-xs text-white/40 transition-colors hover:text-white/60",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function AccentButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 font-mono text-xs font-semibold text-violet-400 transition-colors hover:bg-indigo-500/15",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function FormLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1 block font-mono text-[9px] font-semibold uppercase tracking-widest text-white/20">
      {children}
    </label>
  );
}

export function FormInput({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-lg border border-indigo-500/15 bg-white/[0.04] px-2.5 py-2 text-[13px] text-white outline-none transition-colors focus:border-indigo-500/30 focus:bg-white/[0.05]",
        className
      )}
      {...props}
    />
  );
}

export function FormTextarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full resize-none rounded-lg border border-indigo-500/15 bg-white/[0.04] px-2.5 py-2 text-[13px] leading-relaxed text-white outline-none transition-colors focus:border-indigo-500/30 focus:bg-white/[0.05]",
        className
      )}
      {...props}
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
        "w-full rounded-lg border border-indigo-500/15 bg-white/[0.04] px-2.5 py-2 text-[13px] text-white outline-none transition-colors focus:border-indigo-500/30",
        className
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
        "rounded-lg border px-3 py-1.5 font-mono text-[11px] font-semibold transition-all",
        active
          ? activeClassName ?? "border-indigo-500/30 bg-indigo-500/10 text-violet-400"
          : "border-indigo-500/15 bg-white/[0.03] text-white/40 hover:text-white/60"
      )}
    >
      {children}
    </button>
  );
}
