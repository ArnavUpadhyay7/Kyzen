import { useEffect, useState, useCallback } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────

export type ToastType = "success" | "error";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

// ── Hook ──────────────────────────────────────────────────────

let externalSetToasts: React.Dispatch<React.SetStateAction<Toast[]>> | null = null;

export function toast(message: string, type: ToastType = "success") {
  if (!externalSetToasts) return;
  const id = Math.random().toString(36).slice(2);
  externalSetToasts((prev) => [...prev, { id, type, message }]);
}

// ── Single Toast Item ─────────────────────────────────────────

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: string) => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    const show = setTimeout(() => setVisible(true), 10);
    // Auto-dismiss after 3.5s
    const hide = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss(toast.id), 300);
    }, 3500);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [toast.id, onDismiss]);

  const isSuccess = toast.type === "success";

  return (
    <div
      style={{
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        transform: visible ? "translateY(0) scale(1)" : "translateY(16px) scale(0.95)",
        opacity: visible ? 1 : 0,
      }}
      className={`
        flex items-start gap-3 w-full max-w-sm
        px-4 py-3.5 rounded-2xl
        border backdrop-blur-md shadow-2xl
        ${isSuccess
          ? "bg-[#0d0d0d]/90 border-white/10"
          : "bg-[#0d0d0d]/90 border-red-500/20"
        }
      `}
    >
      {/* Icon */}
      <div className={`shrink-0 mt-0.5 ${isSuccess ? "text-violet-400" : "text-red-400"}`}>
        {isSuccess
          ? <CheckCircle size={16} strokeWidth={2.5} />
          : <XCircle size={16} strokeWidth={2.5} />
        }
      </div>

      {/* Message */}
      <p className="text-white/80 text-sm leading-snug flex-1">{toast.message}</p>

      {/* Dismiss */}
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(() => onDismiss(toast.id), 300);
        }}
        className="shrink-0 text-white/20 hover:text-white/50 transition-colors mt-0.5"
      >
        <X size={14} />
      </button>
    </div>
  );
}

// ── Toast Container ───────────────────────────────────────────

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    externalSetToasts = setToasts;
    return () => { externalSetToasts = null; };
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 items-end">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
      ))}
    </div>
  );
}