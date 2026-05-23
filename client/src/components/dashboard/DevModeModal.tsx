import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Terminal, X, Zap, GitBranch, BarChart2, Wrench } from "lucide-react";
import { useDevMode } from "../../state/devmode/DevModeContext";
import {
  DashboardBadge,
  DashboardButton,
  DashboardCard,
} from "./ui";

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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            key="dev-modal-panel"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <DashboardCard className="overflow-hidden rounded-2xl border-dash-accent-border bg-dash-modal shadow-[0_24px_64px_rgba(0,0,0,0.45),0_0_40px_color-mix(in_srgb,var(--dash-accent)_8%,transparent)]">
              <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-dash-accent to-transparent opacity-60" />

              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 rounded-lg bg-dash-muted-btn p-1.5 text-dash-muted transition-colors hover:bg-dash-muted-btn-hover"
              >
                <X size={14} />
              </button>

              <div className="p-7">
                <div className="mb-6 flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-dash-accent-border bg-dash-accent-soft shadow-[0_0_16px_color-mix(in_srgb,var(--dash-accent)_15%,transparent)]">
                    <Terminal size={18} className="text-dash-accent" />
                  </div>
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <DashboardBadge variant="accent">Premium Feature</DashboardBadge>
                    </div>
                    <h2 className="font-dash-sans text-[17px] font-semibold tracking-tight text-dash-primary">
                      Unlock Developer Mode
                    </h2>
                  </div>
                </div>

                <p className="mb-5 font-dash-sans text-[13px] leading-relaxed text-dash-secondary">
                  Get access to coding-focused tracking, GitHub activity, developer stats, and builder tools. Don&apos;t worry — you can change this later.
                </p>

                <DashboardCard alt className="mb-6 flex flex-col gap-2.5 rounded-xl p-4">
                  {PERKS.map((perk) => (
                    <div key={perk.label} className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-dash-accent-soft text-dash-accent">
                        {perk.icon}
                      </span>
                      <span className="font-dash-sans text-[12px] text-dash-secondary">{perk.label}</span>
                    </div>
                  ))}
                </DashboardCard>

                <div className="flex flex-col gap-2">
                  <DashboardButton
                    variant="primary"
                    className="w-full rounded-xl py-2.5 font-dash-mono text-[13px] font-semibold"
                    onClick={handleUnlock}
                  >
                    <Zap size={14} />
                    Yes, I&apos;m a developer
                  </DashboardButton>
                  <DashboardButton
                    variant="muted"
                    className="w-full rounded-xl py-2.5 font-dash-sans text-[13px] font-medium"
                    onClick={onClose}
                  >
                    Maybe later
                  </DashboardButton>
                </div>
              </div>
            </DashboardCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
