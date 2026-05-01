import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
export function useLoaderGuard() {
  const KEY = "kyzen_seen";
  const [shouldShow] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return !sessionStorage.getItem(KEY);
  });
  const markSeen = () => {
    if (typeof window !== "undefined") sessionStorage.setItem(KEY, "1");
  };
  return { shouldShow, markSeen };
}

interface LoaderProps {
  onComplete?: () => void;
  holdMs?: number;
}

export default function Loader({ onComplete, holdMs = 1200 }: LoaderProps) {
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 650);
    const t2 = setTimeout(() => setPhase("out"), 650 + holdMs);
    const t3 = setTimeout(() => onComplete?.(), 650 + holdMs + 700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [holdMs, onComplete]);

  const letters = "KYZEN".split("");

  return (
    <AnimatePresence>
      {phase !== "out" && (
        <motion.div
          key="loader"
          exit={{
            opacity: 0,
            y: -18,
            filter: "blur(6px)",
            transition: { duration: 0.65, ease: [0.4, 0, 0.2, 1] },
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#060412]"
        >
          {/* Subtle center bloom */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 52%, rgba(109,40,217,0.13) 0%, transparent 70%)",
            }}
          />

          {/* Wordmark */}
          <div className="relative flex items-center" style={{ gap: "0.16em" }}>
            {letters.map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
                animate={
                  phase === "in" || phase === "hold"
                    ? {
                        opacity: 1,
                        y: 0,
                        filter: "blur(0px)",
                        transition: {
                          delay: 0.06 + i * 0.07,
                          duration: 0.55,
                          ease: [0.22, 1, 0.36, 1],
                        },
                      }
                    : {}
                }
                className="select-none"
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: "clamp(3rem, 8vw, 5.5rem)",
                  fontWeight: 300,
                  letterSpacing: "0.28em",
                  background:
                    "linear-gradient(160deg, rgba(255,255,255,0.95) 0%, rgba(196,181,253,0.8) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {char}
              </motion.span>
            ))}
          </div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={
              phase === "hold"
                ? {
                    opacity: 1,
                    y: 0,
                    transition: { delay: 0.18, duration: 0.5, ease: "easeOut" },
                  }
                : { opacity: 0 }
            }
            className="mt-4 select-none"
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: "clamp(0.55rem, 1.1vw, 0.68rem)",
              fontWeight: 400,
              letterSpacing: "0.38em",
              color: "rgba(196,181,253,0.35)",
              textTransform: "uppercase",
            }}
          >
            Earn your progress
          </motion.p>

          {/* Bottom progress line */}
          <div
            className="absolute bottom-0 left-0 right-0 h-px"
            style={{ background: "rgba(139,92,246,0.1)" }}
          >
            <motion.div
              className="h-full origin-left"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(139,92,246,0.6) 25%, rgba(167,139,250,1) 50%, rgba(139,92,246,0.6) 75%, transparent)",
              }}
              initial={{ scaleX: 0 }}
              animate={
                phase === "hold"
                  ? {
                      scaleX: 1,
                      transition: {
                        duration: holdMs / 1000,
                        ease: "linear",
                        delay: 0.05,
                      },
                    }
                  : {}
              }
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function LoaderWrapper({ children }: { children: React.ReactNode }) {
  const { shouldShow, markSeen } = useLoaderGuard();
  const [done, setDone] = useState(!shouldShow);

  const handleComplete = () => {
    markSeen();
    setDone(true);
  };

  return (
    <>
      {!done && <Loader onComplete={handleComplete} />}
      <motion.div
        initial={shouldShow ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.55, ease: "easeOut", delay: shouldShow ? 0.1 : 0 }}
      >
        {children}
      </motion.div>
    </>
  );
}