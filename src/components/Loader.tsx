"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────
interface KyzenLoaderProps {
  /** Called once the exit animation fully completes */
  onComplete?: () => void;
  /** How long (ms) the logo stays fully visible before it fades. Default 1400 */
  holdDuration?: number;
}

// ─────────────────────────────────────────────
//  Animated mesh-gradient background
//  (mirrors the Orbit Studio reference: dark centre, vivid purple/blue blobs)
// ─────────────────────────────────────────────
function MeshBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* base */}
      <div className="absolute inset-0 bg-[#050509]" />

      {/* bottom-left violet blob */}
      <motion.div
        className="absolute -bottom-32 -left-32 w-[560px] h-[560px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(109,40,217,0.55) 0%, rgba(76,29,149,0.25) 50%, transparent 75%)",
          filter: "blur(72px)",
        }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* bottom-right blue blob */}
      <motion.div
        className="absolute -bottom-20 -right-20 w-[480px] h-[480px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(59,130,246,0.45) 0%, rgba(37,99,235,0.2) 50%, transparent 75%)",
          filter: "blur(80px)",
        }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.85, 0.5] }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
      />

      {/* top-centre subtle teal */}
      <motion.div
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-[400px] h-[300px] rounded-full"
        style={{
          background:
            "radial-gradient(ellipse, rgba(20,184,166,0.18) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────
//  Particle ring that orbits the wordmark
// ─────────────────────────────────────────────
function OrbitRing() {
  const particles = Array.from({ length: 14 }, (_, i) => i);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <motion.div
        className="relative w-56 h-56"
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      >
        {particles.map((i) => {
          const angle = (i / particles.length) * 360;
          const rad = (angle * Math.PI) / 180;
          const r = 108; // orbit radius px
          const x = Math.cos(rad) * r;
          const y = Math.sin(rad) * r;
          const size = i % 3 === 0 ? 3 : 2;
          const opacity = 0.3 + (i % 4) * 0.15;
          return (
            <span
              key={i}
              className="absolute rounded-full bg-violet-400"
              style={{
                width: size,
                height: size,
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: "translate(-50%,-50%)",
                opacity,
              }}
            />
          );
        })}
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  Progress bar at the bottom
// ─────────────────────────────────────────────
function ProgressBar({ holdDuration }: { holdDuration: number }) {
  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-48 h-[2px] bg-white/10 rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{
          background: "linear-gradient(90deg, #7c3aed, #3b82f6, #7c3aed)",
          backgroundSize: "200% 100%",
        }}
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: holdDuration / 1000, ease: "linear" }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────
//  Main Loader
// ─────────────────────────────────────────────
export default function Loader({
  onComplete,
  holdDuration = 1400,
}: KyzenLoaderProps) {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");

  useEffect(() => {
    // enter → hold
    const t1 = setTimeout(() => setPhase("hold"), 900);
    // hold → exit
    const t2 = setTimeout(() => setPhase("exit"), 900 + holdDuration);
    // notify parent after exit animation (800 ms)
    const t3 = setTimeout(
      () => onComplete?.(),
      900 + holdDuration + 800
    );
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [holdDuration, onComplete]);

  // ── wordmark letter stagger ──
  const letters = "KYZEN".split("");

  const letterVariants = {
    hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    }),
    exit: (i: number) => ({
      opacity: 0,
      y: -18,
      filter: "blur(6px)",
      transition: {
        delay: i * 0.05,
        duration: 0.45,
        ease: [0.55, 0, 0.78, 0],
      },
    }),
  };

  const containerVariants = {
    exit: {
      opacity: 0,
      transition: { duration: 0.8, ease: "easeInOut", delay: 0.3 },
    },
  };

  return (
    <AnimatePresence>
      {phase !== "exit" ? (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          variants={containerVariants}
          exit="exit"
        >
          {/* ── Background ── */}
          <MeshBackground />

          {/* ── Grain overlay ── */}
          <div
            className="absolute inset-0 opacity-[0.035] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
              backgroundSize: "128px",
            }}
          />

          {/* ── Orbit ring (behind wordmark) ── */}
          <div className="relative">
            <OrbitRing />

            {/* ── Wordmark ── */}
            <div className="relative flex items-center gap-[0.04em]">
              {letters.map((char, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={letterVariants}
                  initial="hidden"
                  animate={phase === "hold" ? "visible" : "hidden"}
                  exit="exit"
                  className="text-6xl font-black tracking-[0.15em] select-none"
                  style={{
                    fontFamily: "'Orbitron', 'Rajdhani', sans-serif",
                    background:
                      "linear-gradient(135deg, #e2d9f3 0%, #a78bfa 40%, #818cf8 70%, #38bdf8 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    textShadow: "none",
                  }}
                >
                  {char}
                </motion.span>
              ))}

              {/* glow pulse behind letters */}
              <motion.div
                className="absolute inset-0 rounded-lg pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(139,92,246,0.35) 0%, transparent 70%)",
                  filter: "blur(20px)",
                }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
            </div>

            {/* ── Tagline ── */}
            <motion.p
              className="text-center mt-3 text-[11px] tracking-[0.35em] uppercase text-violet-300/60 font-medium"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}
              initial={{ opacity: 0 }}
              animate={
                phase === "hold" ? { opacity: 1 } : { opacity: 0 }
              }
              transition={{ delay: 0.55, duration: 0.6 }}
            >
              Level up your life
            </motion.p>
          </div>

          {/* ── Progress bar ── */}
          {phase === "hold" && (
            <ProgressBar holdDuration={holdDuration} />
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}