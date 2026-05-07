import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Terminal, X, Zap, GitBranch, BarChart2, Wrench } from "lucide-react";
import { useTokens } from "../../state/theme/ThemeContext";
import { useDevMode } from "../../state/devmode/DevModeContext";

interface DevModeModalProps {
  open: boolean;
  onClose: () => void;
  onUnlocked?: () => void;
}

const PERKS = [
  { icon: <GitBranch size={13} />, label: "GitHub activity & contribution graph" },
  { icon: <BarChart2 size={13} />, label: "Coding-focused quest tracking" },
  { icon: <Terminal size={13} />, label: "Developer stats & streaks" },
  { icon: <Wrench size={13} />, label: "Builder tools & integrations" },
];

export default function DevModeModal({ open, onClose, onUnlocked }: DevModeModalProps) {
  const t = useTokens();
  const { unlock } = useDevMode();
  const navigate = useNavigate();

  async function handleUnlock() {
    await unlock();
    onClose();
    onUnlocked?.();
    navigate("/dashboard/dev");
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="dev-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(8px)" }}
          onClick={onClose}
        >
          <motion.div
            key="dev-modal-panel"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md rounded-2xl relative overflow-hidden"
            style={{
              background: t.modal,
              border: `1px solid ${t.accentBorder}`,
              boxShadow: `0 0 0 1px ${t.border}, 0 24px 64px rgba(0,0,0,0.45), 0 0 40px rgba(99,102,241,0.08)`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Subtle top glow strip */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{
                background: `linear-gradient(90deg, transparent, ${t.accent}, transparent)`,
                opacity: 0.6,
              }}
            />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors"
              style={{ color: t.textMuted, background: t.mutedBtn }}
              onMouseEnter={(e) => (e.currentTarget.style.background = t.mutedBtnHov)}
              onMouseLeave={(e) => (e.currentTarget.style.background = t.mutedBtn)}
            >
              <X size={14} />
            </button>

            <div className="p-7">
              {/* Icon + Header */}
              <div className="flex items-start gap-4 mb-6">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: t.accentSoft,
                    border: `1px solid ${t.accentBorder}`,
                    boxShadow: `0 0 16px rgba(99,102,241,0.15)`,
                  }}
                >
                  <Terminal size={18} style={{ color: t.accent }} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-[10px] font-medium tracking-wider uppercase px-2 py-0.5 rounded"
                      style={{
                        background: t.accentSoft,
                        color: t.accent,
                        fontFamily: "'DM Mono', monospace",
                        border: `1px solid ${t.accentBorder}`,
                      }}
                    >
                      Premium Feature
                    </span>
                  </div>
                  <h2
                    className="text-[17px] font-semibold tracking-tight"
                    style={{ color: t.textPrimary, fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Unlock Developer Mode
                  </h2>
                </div>
              </div>

              {/* Description */}
              <p
                className="text-[13px] leading-relaxed mb-5"
                style={{ color: t.textSecondary, fontFamily: "'DM Sans', sans-serif" }}
              >
                Get access to coding-focused tracking, GitHub activity, developer stats, and builder tools. Don&apos;t worry — you can change this later.
              </p>

              {/* Perks list */}
              <div
                className="rounded-xl p-4 mb-6 flex flex-col gap-2.5"
                style={{ background: t.cardAlt, border: `1px solid ${t.border}` }}
              >
                {PERKS.map((perk) => (
                  <div key={perk.label} className="flex items-center gap-2.5">
                    <span
                      className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                      style={{ background: t.accentSoft, color: t.accent }}
                    >
                      {perk.icon}
                    </span>
                    <span
                      className="text-[12px]"
                      style={{ color: t.textSecondary, fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {perk.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleUnlock}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-150"
                  style={{
                    background: t.accent,
                    color: "#fff",
                    fontFamily: "'DM Mono', monospace",
                    boxShadow: `0 0 20px rgba(99,102,241,0.25)`,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  <Zap size={14} />
                  Yes, I&apos;m a developer
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150"
                  style={{
                    background: t.mutedBtn,
                    color: t.textMuted,
                    fontFamily: "'DM Sans', sans-serif",
                    border: `1px solid ${t.border}`,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = t.mutedBtnHov)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = t.mutedBtn)}
                >
                  Maybe later
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}