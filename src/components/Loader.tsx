"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

// ─────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────
interface KyzenLoaderProps {
  onComplete?: () => void;
  holdDuration?: number;
}

// ─────────────────────────────────────────────
//  Noise texture SVG (inline, no file deps)
// ─────────────────────────────────────────────
const NoiseOverlay = () => (
  <div
    className="absolute inset-0 pointer-events-none z-10"
    style={{
      opacity: 0.04,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      backgroundSize: "200px",
    }}
  />
);

// ─────────────────────────────────────────────
//  Animated warp-speed background streaks
// ─────────────────────────────────────────────
function WarpStreaks() {
  const streaks = Array.from({ length: 24 }, (_, i) => i);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {streaks.map((i) => {
        const angle = (i / streaks.length) * 360;
        const length = 80 + (i % 5) * 40;
        const delay = (i * 0.15) % 2;
        const opacity = 0.04 + (i % 4) * 0.025;
        return (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 origin-left"
            style={{
              width: length,
              height: 1,
              background: `linear-gradient(90deg, rgba(139,92,246,${opacity * 8}), transparent)`,
              rotate: angle,
              translateX: "-50%",
              translateY: "-50%",
            }}
            animate={{ scaleX: [0, 1, 0], opacity: [0, opacity * 4, 0] }}
            transition={{
              duration: 2.5 + (i % 3) * 0.8,
              repeat: Infinity,
              delay,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────
//  Crystalline hex grid (subtle background pattern)
// ─────────────────────────────────────────────
function HexGrid() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.06]">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hex" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
            <polygon
              points="30,2 55,16 55,44 30,58 5,44 5,16"
              fill="none"
              stroke="rgba(139,92,246,1)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hex)" />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────
//  Deep space gradient background
// ─────────────────────────────────────────────
function Background() {
  return (
    <div className="absolute inset-0">
      {/* Deep base */}
      <div className="absolute inset-0" style={{ background: "#03020d" }} />

      {/* Hex grid */}
      <HexGrid />

      {/* Warp streaks */}
      <WarpStreaks />

      {/* Central void glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(88,28,220,0.18) 0%, rgba(55,10,160,0.08) 35%, transparent 70%)",
          filter: "blur(40px)",
        }}
        animate={{ scale: [1, 1.06, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Bottom-left violet */}
      <motion.div
        className="absolute -bottom-40 -left-40 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(109,40,217,0.5) 0%, rgba(76,29,149,0.2) 45%, transparent 72%)",
          filter: "blur(90px)",
        }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.65, 0.95, 0.65] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Bottom-right cobalt */}
      <motion.div
        className="absolute -bottom-20 -right-20 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(59,130,246,0.35) 0%, rgba(37,99,235,0.12) 50%, transparent 75%)",
          filter: "blur(80px)",
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Top faint teal crown */}
      <motion.div
        className="absolute -top-20 left-1/2 -translate-x-1/2 w-[480px] h-[280px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(20,184,166,0.12) 0%, transparent 65%)",
          filter: "blur(60px)",
        }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────
//  Dual concentric scan rings
// ─────────────────────────────────────────────
function ScanRings() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {/* Outer slow ring */}
      <motion.div
        className="absolute rounded-full border border-violet-500/10"
        style={{ width: 320, height: 320 }}
        animate={{ rotate: 360, scale: [1, 1.02, 1] }}
        transition={{ rotate: { duration: 30, repeat: Infinity, ease: "linear" }, scale: { duration: 5, repeat: Infinity } }}
      >
        {/* Tick marks */}
        {Array.from({ length: 32 }).map((_, i) => (
          <span
            key={i}
            className="absolute bg-violet-400"
            style={{
              width: i % 8 === 0 ? 6 : i % 4 === 0 ? 4 : 2,
              height: 1,
              top: "50%",
              left: 0,
              transformOrigin: "160px 0.5px",
              transform: `rotate(${(i / 32) * 360}deg)`,
              opacity: i % 8 === 0 ? 0.5 : i % 4 === 0 ? 0.25 : 0.1,
            }}
          />
        ))}
      </motion.div>

      {/* Middle spin ring with dot accent */}
      <motion.div
        className="absolute rounded-full border border-violet-400/15"
        style={{ width: 230, height: 230 }}
        animate={{ rotate: -360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      >
        {/* Bright leading dot */}
        <motion.span
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
          style={{
            background: "#a78bfa",
            boxShadow: "0 0 10px 3px rgba(167,139,250,0.6)",
          }}
        />
      </motion.div>

      {/* Inner pulse ring */}
      <motion.div
        className="absolute rounded-full border border-indigo-400/20"
        style={{ width: 150, height: 150 }}
        animate={{ scale: [1, 1.04, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Ripple bursts */}
      {[0, 1.4, 2.8].map((delay, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-violet-500/20"
          style={{ width: 180, height: 180 }}
          animate={{ scale: [1, 2.2], opacity: [0.4, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
//  Corner bracket decorations
// ─────────────────────────────────────────────
function CornerBrackets({ visible }: { visible: boolean }) {
  const corners = [
    { top: 0, left: 0, rotate: 0 },
    { top: 0, right: 0, rotate: 90 },
    { bottom: 0, right: 0, rotate: 180 },
    { bottom: 0, left: 0, rotate: 270 },
  ] as const;

  return (
    <>
      {corners.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute w-8 h-8"
          style={{ ...pos, rotate: pos.rotate }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={visible ? { opacity: 0.35, scale: 1 } : { opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.5, delay: i * 0.08 }}
        >
          <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 30 L2 2 L30 2" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </motion.div>
      ))}
    </>
  );
}

// ─────────────────────────────────────────────
//  Scanline horizontal sweep
// ─────────────────────────────────────────────
function ScanLine() {
  return (
    <motion.div
      className="absolute left-0 right-0 h-px pointer-events-none"
      style={{
        background:
          "linear-gradient(90deg, transparent, rgba(139,92,246,0.6) 30%, rgba(167,139,250,0.9) 50%, rgba(139,92,246,0.6) 70%, transparent)",
        boxShadow: "0 0 12px 2px rgba(139,92,246,0.3)",
      }}
      initial={{ top: "-2%" }}
      animate={{ top: ["0%", "100%", "0%"] }}
      transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 1.5 }}
    />
  );
}

// ─────────────────────────────────────────────
//  Progress bar — segmented, tactical look
// ─────────────────────────────────────────────
function ProgressBar({ holdDuration, visible }: { holdDuration: number; visible: boolean }) {
  const segments = 20;
  return (
    <motion.div
      className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      initial={{ opacity: 0, y: 10 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex gap-[3px]">
        {Array.from({ length: segments }).map((_, i) => (
          <motion.div
            key={i}
            className="w-[7px] h-[3px] rounded-sm"
            style={{ background: "rgba(255,255,255,0.06)" }}
            initial={{ background: "rgba(255,255,255,0.06)" }}
            animate={{
              background: [
                "rgba(255,255,255,0.06)",
                "rgba(167,139,250,0.9)",
                "rgba(167,139,250,0.9)",
              ],
            }}
            transition={{
              duration: holdDuration / 1000,
              delay: (i / segments) * (holdDuration / 1000),
              ease: "linear",
              times: [0, 0.01, 1],
            }}
          />
        ))}
      </div>
      <span className="text-[9px] font-mono tracking-[0.3em] text-violet-400/40 uppercase">
        Initializing
      </span>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
//  The KYZEN wordmark — letter by letter, no variants error
// ─────────────────────────────────────────────
function Wordmark({ phase }: { phase: "enter" | "hold" | "exit" }) {
  const letters = "KYZEN".split("");

  return (
    <div className="relative flex items-end gap-[0.06em] select-none">
      {letters.map((char, i) => {
        const isEntering = phase === "hold";
        const isExiting = phase === "exit";

        return (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 28, filter: "blur(12px)" }}
            animate={
              isExiting
                ? {
                    opacity: 0,
                    y: -20,
                    filter: "blur(8px)",
                    transition: {
                      delay: i * 0.04,
                      duration: 0.4,
                      ease: [0.55, 0, 0.78, 0],
                    },
                  }
                : isEntering
                ? {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: {
                      delay: 0.1 + i * 0.09,
                      duration: 0.65,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  }
                : { opacity: 0, y: 28, filter: "blur(12px)" }
            }
            className="text-7xl font-black leading-none"
            style={{
              fontFamily: "'Syne', 'Orbitron', sans-serif",
              letterSpacing: "0.18em",
              background:
                "linear-gradient(160deg, #f0e6ff 0%, #c4b5fd 25%, #a78bfa 50%, #818cf8 75%, #60a5fa 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {char}
          </motion.span>
        );
      })}

      {/* Glow halo behind text */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 60%, rgba(139,92,246,0.45) 0%, transparent 70%)",
          filter: "blur(24px)",
          zIndex: -1,
        }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────
//  Status line — small tactical readout
// ─────────────────────────────────────────────
function StatusLine({ visible }: { visible: boolean }) {
  const [dots, setDots] = useState(".");
  useEffect(() => {
    const id = setInterval(() => setDots(d => d.length >= 3 ? "." : d + "."), 400);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      className="flex items-center gap-2 mt-4"
      initial={{ opacity: 0 }}
      animate={visible ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <motion.span
        className="w-1.5 h-1.5 rounded-full bg-emerald-400"
        animate={{ opacity: [1, 0.2, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      <span
        className="text-[10px] tracking-[0.3em] uppercase text-violet-300/50"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        Season 01 · Online{dots}
      </span>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
//  Main Loader
// ─────────────────────────────────────────────
export default function Loader({ onComplete, holdDuration = 1600 }: KyzenLoaderProps) {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 800);
    const t2 = setTimeout(() => setPhase("exit"), 800 + holdDuration);
    const t3 = setTimeout(() => onComplete?.(), 800 + holdDuration + 900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [holdDuration, onComplete]);

  return (
    <AnimatePresence>
      {phase !== "exit" && (
        <motion.div
          key="kyzen-loader"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          exit={{ opacity: 0, transition: { duration: 0.85, ease: "easeInOut", delay: 0.25 } }}
        >
          {/* ── Deep space background ── */}
          <Background />

          {/* ── Noise grain ── */}
          <NoiseOverlay />

          {/* ── Scan rings ── */}
          <ScanRings />

          {/* ── Scanline sweep ── */}
          <ScanLine />

          {/* ── Corner brackets ── */}
          <CornerBrackets visible={phase === "hold"} />

          {/* ── Central content ── */}
          <div className="relative z-20 flex flex-col items-center">
            {/* Top label */}
            <motion.div
              className="mb-6 flex items-center gap-3"
              initial={{ opacity: 0, y: -10 }}
              animate={phase === "hold" ? { opacity: 1, y: 0 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="h-px w-10 bg-gradient-to-r from-transparent to-violet-500/50" />
              <span
                className="text-[9px] tracking-[0.45em] text-violet-400/50 uppercase"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                v1.0.0 · Season 01
              </span>
              <div className="h-px w-10 bg-gradient-to-l from-transparent to-violet-500/50" />
            </motion.div>

            {/* Wordmark */}
            <Wordmark phase={phase} />

            {/* Tagline */}
            <motion.p
              className="mt-3 text-[11px] tracking-[0.4em] uppercase text-violet-300/45"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
              initial={{ opacity: 0 }}
              animate={phase === "hold" ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              Level up your life
            </motion.p>

            {/* Status */}
            <StatusLine visible={phase === "hold"} />
          </div>

          {/* ── Progress bar ── */}
          <ProgressBar holdDuration={holdDuration} visible={phase === "hold"} />

          {/* ── Bottom edge line ── */}
          <motion.div
            className="absolute bottom-0 inset-x-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(139,92,246,0.5) 30%, rgba(167,139,250,0.8) 50%, rgba(139,92,246,0.5) 70%, transparent)",
            }}
            initial={{ scaleX: 0 }}
            animate={phase === "hold" ? { scaleX: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}