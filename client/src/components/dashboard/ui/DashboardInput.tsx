import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../../../lib/utils";

export interface DashboardInputProps extends InputHTMLAttributes<HTMLInputElement> {
  inputSize?: "sm" | "md";
}

export const DashboardInput = forwardRef<HTMLInputElement, DashboardInputProps>(
  function DashboardInput({ className, inputSize = "md", ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full rounded-lg border border-dash-input-border bg-dash-input font-dash-sans text-dash-primary placeholder:text-dash-faint outline-none transition-colors duration-150",
          "focus:border-dash-accent-border focus:ring-1 focus:ring-dash-accent-border",
          inputSize === "sm" ? "px-2.5 py-1.5 text-xs" : "px-3 py-2 text-sm",
          className,
        )}
        {...props}
      />
    );
  },
);
