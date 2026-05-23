import { useEffect, useState, useCallback } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";
import { cn } from "../../lib/utils";

export type ToastType = "success" | "error";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

let externalSetToasts: React.Dispatch<React.SetStateAction<Toast[]>> | null = null;

export function toast(message: string, type: ToastType = "success") {
  if (!externalSetToasts) return;
  const id = Math.random().toString(36).slice(2);
  externalSetToasts((prev) => [...prev, { id, type, message }]);
}

function ToastItem({
  toast: item,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: string) => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = setTimeout(() => setVisible(true), 10);
    const hide = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss(item.id), 300);
    }, 3500);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [item.id, onDismiss]);

  const isSuccess = item.type === "success";

  return (
    <div
      className={cn(
        "flex w-full max-w-sm items-start gap-3 rounded-2xl border px-4 py-3.5 shadow-2xl backdrop-blur-md",
        "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        isSuccess
          ? "border-dash-border bg-dash-modal/90"
          : "border-dash-danger/30 bg-dash-modal/90",
        visible
          ? "translate-y-0 scale-100 opacity-100"
          : "translate-y-4 scale-95 opacity-0",
      )}
    >
      <div className={cn("mt-0.5 shrink-0", isSuccess ? "text-dash-violet" : "text-dash-danger")}>
        {isSuccess ? (
          <CheckCircle size={16} strokeWidth={2.5} />
        ) : (
          <XCircle size={16} strokeWidth={2.5} />
        )}
      </div>

      <p className="flex-1 font-dash-sans text-sm leading-snug text-dash-secondary">{item.message}</p>

      <button
        type="button"
        onClick={() => {
          setVisible(false);
          setTimeout(() => onDismiss(item.id), 300);
        }}
        className="mt-0.5 shrink-0 text-dash-faint transition-colors hover:text-dash-muted"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    externalSetToasts = setToasts;
    return () => {
      externalSetToasts = null;
    };
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-6 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
      ))}
    </div>
  );
}
