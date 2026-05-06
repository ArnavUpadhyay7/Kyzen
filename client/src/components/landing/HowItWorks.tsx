/**
 * HowItWorks.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Scroll-driven sticky section that advances through steps as the user scrolls.
 * Design rules:
 *  • Single accent colour: violet (#8b5cf6) — no per-step colour shifts
 *  • No glow ring on step 04 (Identity)
 *  • Slides up over Features with the same panel-over-hero mechanic
 *  • Matches Kyzen design system: Barlow / DM Sans / JetBrains Mono, #080612 canvas
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { STEPS } from "../../constants/steps";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const ACCENT = "#8b5cf6";
const ACCENT_MID = "rgba(139,92,246,0.5)";
const ACCENT_DIM = "rgba(139,92,246,0.12)";
const CANVAS = "#080612";

const ease = [0.22, 1, 0.36, 1] as const;

// ─── TYPES ────────────────────────────────────────────────────────────────────

type Step = (typeof STEPS)[number];

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

/** Minimal ticking noise grain overlay */
function GrainOverlay() {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-0 opacity-[0.032]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "200px",
      }}
    />
  );
}

/** Subtle dot-grid texture */
function GridOverlay() {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-0 opacity-[0.018]"
      style={{
        backgroundImage: `radial-gradient(circle, rgba(139,92,246,0.9) 1px, transparent 1px)`,
        backgroundSize: "44px 44px",
      }}
    />
  );
}

/** Left sidebar: large ghost number + step navigation pills */
function StepSidebar({ active, total }: { active: number; total: number }) {
  return (
    <aside className="hidden lg:flex flex-col justify-between py-16 pl-12 pr-8 w-56 flex-shrink-0 border-r border-white/[0.04]">
      {/* Ghost numeral */}
      <div className="relative select-none overflow-hidden h-36">
        <AnimatePresence mode="wait">
          <motion.span
            key={active}
            initial={{ opacity: 0, y: 28, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -28, filter: "blur(12px)" }}
            transition={{ duration: 0.5, ease }}
            className="absolute inset-0 flex items-end leading-none font-black"
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: "9rem",
              color: "transparent",
              WebkitTextStroke: `1px rgba(139,92,246,0.18)`,
              letterSpacing: "-0.05em",
            }}
          >
            {STEPS[active].num}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Nav pills */}
      <nav className="flex flex-col gap-3">
        {STEPS.map((s, i) => (
          <motion.div
            key={i}
            className="flex items-center gap-3"
            animate={{ opacity: i === active ? 1 : 0.2 }}
            transition={{ duration: 0.4 }}
          >
            {/* Pill indicator */}
            <motion.div
              className="rounded-full flex-shrink-0"
              style={{
                height: 2,
                background: i <= active ? ACCENT : "rgba(255,255,255,0.1)",
              }}
              animate={{ width: i === active ? 32 : i < active ? 16 : 10 }}
              transition={{ duration: 0.4, ease }}
            />
            <span
              className="text-[11px] font-medium tracking-wide truncate"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: i === active ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.18)",
              }}
            >
              {s.label}
            </span>
          </motion.div>
        ))}
      </nav>
    </aside>
  );
}

/** Right sidebar: vertical timeline */
function StepTimeline({ active }: { active: number }) {
  return (
    <aside className="hidden xl:flex flex-col justify-center py-16 pl-8 pr-12 w-56 flex-shrink-0 border-l border-white/[0.04]">
      <div className="relative flex flex-col gap-0">
        {/* Track */}
        <div
          className="absolute left-[9px] top-3 bottom-3 w-px"
          style={{ background: "rgba(255,255,255,0.06)" }}
        />
        {/* Fill */}
        <motion.div
          className="absolute left-[9px] top-3 w-px origin-top"
          style={{ background: `linear-gradient(180deg, ${ACCENT}, rgba(139,92,246,0.1))` }}
          animate={{ height: `${((active + 0.5) / STEPS.length) * 100}%` }}
          transition={{ duration: 0.55, ease }}
        />

        {STEPS.map((s, i) => (
          <div key={i} className="flex items-start gap-4 pb-10 last:pb-0 relative">
            {/* Node */}
            <motion.div
              className="flex-shrink-0 relative z-10 rounded-full flex items-center justify-center"
              style={{ marginTop: 2 }}
              animate={{
                width: i === active ? 20 : 18,
                height: i === active ? 20 : 18,
                background:
                  i === active
                    ? ACCENT
                    : i < active
                    ? "rgba(139,92,246,0.3)"
                    : "rgba(255,255,255,0.05)",
                border: `1.5px solid ${
                  i === active
                    ? ACCENT
                    : i < active
                    ? "rgba(139,92,246,0.4)"
                    : "rgba(255,255,255,0.07)"
                }`,
                boxShadow:
                  i === active ? `0 0 14px rgba(139,92,246,0.55)` : "none",
              }}
              transition={{ duration: 0.35 }}
            >
              {i < active && (
                <svg viewBox="0 0 20 20" className="w-full h-full p-1.5" fill="none">
                  <path
                    d="M4 10 L8 14 L16 6"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </motion.div>

            {/* Label */}
            <motion.div
              animate={{ opacity: i === active ? 1 : i < active ? 0.45 : 0.18 }}
              transition={{ duration: 0.4 }}
            >
              <div
                className="text-[9px] tracking-[0.18em] uppercase mb-0.5"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  color:
                    i === active ? ACCENT_MID : "rgba(160,140,200,0.3)",
                }}
              >
                {s.num}
              </div>
              <div
                className="text-xs font-medium leading-tight"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color:
                    i === active
                      ? "rgba(255,255,255,0.82)"
                      : "rgba(200,180,230,0.22)",
                }}
              >
                {s.label}
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </aside>
  );
}

/** The main step card — no per-step tint, clean uniform violet */
function StepCard({ step, dir }: { step: Step; dir: number }) {
  return (
    <AnimatePresence mode="wait" custom={dir}>
      <motion.div
        key={step.num}
        custom={dir}
        initial={{ opacity: 0, scale: 0.95, y: dir * 28 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: dir * -28 }}
        transition={{ duration: 0.55, ease }}
        className="relative w-full max-w-[600px]"
      >
        {/* Soft ambient behind card — uniform violet, no per-step colour */}
        <div
          className="absolute -inset-10 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(109,40,217,0.10) 0%, transparent 68%)",
            filter: "blur(32px)",
          }}
        />

        {/* Card shell */}
        <div
          className="relative rounded-[28px] overflow-hidden"
          style={{
            background:
              "linear-gradient(145deg, rgba(18,12,42,0.97) 0%, rgba(10,7,26,0.99) 100%)",
            border: "1px solid rgba(139,92,246,0.22)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
            boxShadow:
              "0 32px 80px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.035) inset, 0 1px 0 rgba(139,92,246,0.25) inset",
          }}
        >
          {/* Top shimmer line */}
          <div
            className="absolute top-0 inset-x-0 h-px pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(139,92,246,0.75) 50%, transparent)",
            }}
          />

          {/* Body */}
          <div className="p-7 flex flex-col sm:flex-row gap-7 items-center">
            {/* Symbol area — no glow pulse on step 04 */}
            <div className="relative flex-shrink-0 flex items-center justify-center w-[120px] h-[120px]">
              {/* Rotating dashed orbit — hidden on last step */}
              {step.num !== "04" && (
                <motion.div
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    width: 148,
                    height: 148,
                    border: "1px dashed rgba(139,92,246,0.2)",
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                />
              )}

              {/* Breathing glow — hidden on step 04 */}
              {step.num !== "04" && (
                <motion.div
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    width: 160,
                    height: 160,
                    background:
                      "radial-gradient(circle, rgba(109,40,217,0.18) 0%, transparent 70%)",
                  }}
                  animate={{ scale: [1, 1.18, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />
              )}

              {/* Icon — subtle float */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                {step.symbol}
              </motion.div>
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0 text-center sm:text-left">
              {/* Step badge */}
              <div
                className="inline-flex items-center gap-2 text-[10px] tracking-[0.18em] uppercase font-semibold px-3 py-1.5 rounded-full mb-4"
                style={{
                  background: ACCENT_DIM,
                  border: "1px solid rgba(139,92,246,0.3)",
                  color: "rgba(192,166,255,0.8)",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: ACCENT }}
                />
                {step.label}
              </div>

              <p
                className="text-sm leading-[1.9] mb-5"
                style={{
                  color: "rgba(195,180,235,0.52)",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {step.body}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {step.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] px-3 py-1 rounded-lg font-medium"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      color: "rgba(200,185,230,0.42)",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Footer stat bar */}
          <div
            className="px-7 py-4 flex items-center justify-end"
            style={{ borderTop: "1px solid rgba(139,92,246,0.1)" }}
          >
            <div className="flex items-baseline gap-2">
              <AnimatePresence mode="wait">
                <motion.span
                  key={step.stat.val}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                  className="text-2xl font-black"
                  style={{ color: ACCENT, fontFamily: "'Barlow', sans-serif" }}
                >
                  {step.stat.val}
                </motion.span>
              </AnimatePresence>
              <span
                className="text-[11px]"
                style={{
                  color: "rgba(180,165,220,0.3)",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {step.stat.unit}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/** Section title with scroll-in animation */
function SectionTitle({ active, dir }: { active: number; dir: number }) {
  return (
    <div className="overflow-hidden">
      <AnimatePresence mode="wait" custom={dir}>
        <motion.h2
          key={`title-${active}`}
          custom={dir}
          initial={{ opacity: 0, y: dir * 32, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: dir * -32, filter: "blur(10px)" }}
          transition={{ duration: 0.52, ease }}
          className="text-center font-black leading-[1.04] whitespace-pre-line"
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: "clamp(2.4rem,5.5vw,4.6rem)",
            letterSpacing: "-0.03em",
            background: `linear-gradient(135deg, #ffffff 0%, rgba(192,132,252,0.92) 70%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {STEPS[active].title}
        </motion.h2>
      </AnimatePresence>
    </div>
  );
}

/** Progress bar + step counter */
function ProgressBar({ active }: { active: number }) {
  return (
    <div className="w-full max-w-[600px]">
      <div
        className="h-px w-full rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.05)" }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, rgba(139,92,246,0.5), ${ACCENT})`,
          }}
          animate={{ width: `${((active + 1) / STEPS.length) * 100}%` }}
          transition={{ duration: 0.6, ease }}
        />
      </div>
      <div className="flex justify-between mt-2">
        <span
          className="text-[9px] tracking-widest"
          style={{
            color: "rgba(160,140,200,0.28)",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          STEP {String(active + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
        </span>
        <span
          className="text-[9px] tracking-widest"
          style={{
            color: "rgba(160,140,200,0.28)",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {Math.round(((active + 1) / STEPS.length) * 100)}%
        </span>
      </div>
    </div>
  );
}

/** Scroll cue shown on first step */
function ScrollCue() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 1.4 } }}
      exit={{ opacity: 0 }}
      className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
    >
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 9,
          letterSpacing: "0.25em",
          color: "rgba(160,140,200,0.26)",
        }}
      >
        SCROLL
      </span>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
        className="w-px h-7 rounded-full"
        style={{
          background: `linear-gradient(180deg, ${ACCENT}70, transparent)`,
        }}
      />
    </motion.div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function HowItWorks() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);

  const onScroll = useCallback(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const sectionTop = el.getBoundingClientRect().top + window.scrollY;
    const scrollRange = el.offsetHeight - window.innerHeight;
    const scrolled = window.scrollY - sectionTop;
    const progress = Math.min(1, Math.max(0, scrolled / scrollRange));
    const next = Math.min(STEPS.length - 1, Math.floor(progress * STEPS.length));

    setActive((prev) => {
      if (next !== prev) setDir(next > prev ? 1 : -1);
      return next;
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  // Mobile dots for small screens
  const mobileDots = (
    <div className="flex lg:hidden gap-2 items-center">
      {STEPS.map((_, i) => (
        <motion.div
          key={i}
          className="rounded-full"
          style={{
            background: i === active ? ACCENT : "rgba(255,255,255,0.1)",
            height: 5,
          }}
          animate={{ width: i === active ? 24 : 8 }}
          transition={{ duration: 0.35, ease }}
        />
      ))}
    </div>
  );

  return (
    /*
     * ── WRAPPER ────────────────────────────────────────────────────────────
     * N × 100vh = total scroll distance. sticky child pins for N-1 screens.
     * No overflow here — would break sticky positioning.
     * ──────────────────────────────────────────────────────────────────────
     */
    <div
      ref={wrapperRef}
      style={{ height: `${STEPS.length * 100}vh`, position: "relative" }}
    >
      {/* ── STICKY PANEL ─────────────────────────────────────────────────── */}
      <div
        className="sticky top-0 h-screen overflow-hidden flex flex-col"
        style={{ backgroundColor: CANVAS }}
      >
        {/* ── Atmosphere layers ── */}
        <GrainOverlay />
        <GridOverlay />

        {/* Uniform violet ambient — no hue shift between steps */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 45%, rgba(88,28,220,0.09) 0%, transparent 68%)",
          }}
        />

        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background:
              "radial-gradient(ellipse 95% 95% at 50% 50%, transparent 28%, rgba(8,6,18,0.88) 100%)",
          }}
        />

        {/* ── Layout ── */}
        <div className="relative z-10 flex h-full">
          {/* Left sidebar */}
          <StepSidebar active={active} total={STEPS.length} />

          {/* Centre */}
          <div className="flex-1 flex flex-col items-center justify-center px-4 py-10 gap-5">
            {/* Eyebrow */}
            <div className="flex items-center gap-3">
              <div
                className="h-px w-8"
                style={{ background: "rgba(139,92,246,0.3)" }}
              />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  letterSpacing: "0.22em",
                  color: "rgba(192,166,255,0.38)",
                }}
              >
                HOW IT WORKS
              </span>
              <div
                className="h-px w-8"
                style={{ background: "rgba(139,92,246,0.3)" }}
              />
            </div>

            {/* Mobile dots */}
            {mobileDots}

            {/* Title */}
            <SectionTitle active={active} dir={dir} />

            {/* Step card */}
            <StepCard step={STEPS[active]} dir={dir} />

            {/* Progress bar */}
            <ProgressBar active={active} />
          </div>

          {/* Right timeline */}
          <StepTimeline active={active} />
        </div>

        {/* Scroll cue — first step only */}
        <AnimatePresence>{active === 0 && <ScrollCue />}</AnimatePresence>
      </div>
    </div>
  );
}