import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Zap } from "lucide-react";
import { useDashboardStore } from "../../state/dashboard/usedashboardstore";

export function XpRewardOverlay() {
  const xpPopup = useDashboardStore((s) => s.xpPopup);
  const clearXpPopup = useDashboardStore((s) => s.clearXpPopup);

  useEffect(() => {
    if (xpPopup == null) return;
    const timer = setTimeout(clearXpPopup, 1800);
    return () => clearTimeout(timer);
  }, [xpPopup, clearXpPopup]);

  return (
    <AnimatePresence>
      {xpPopup != null && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="flex items-center gap-2.5 rounded-2xl border border-dash-accent-border bg-dash-modal/95 px-7 py-3.5 font-dash-sans text-2xl font-bold tracking-tight text-dash-primary shadow-dash-modal backdrop-blur-md"
            initial={{ scale: 0.55, y: 28, opacity: 0 }}
            animate={{ scale: 1, y: -24, opacity: 1 }}
            exit={{ scale: 0.85, y: -56, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.span
              animate={{ rotate: [0, -12, 12, 0] }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Zap size={22} className="text-dash-violet" fill="currentColor" />
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 }}
            >
              +{xpPopup.toLocaleString()} XP
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
