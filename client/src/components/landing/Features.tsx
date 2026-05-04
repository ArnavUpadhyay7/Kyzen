import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useRef, useState, useEffect } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const tokens = {
  font: {
    display: "'Syne', 'DM Sans', sans-serif",
    body: "'DM Sans', 'Inter', sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
  color: {
    accent: "rgba(139,92,246,1)",
    accentMid: "rgba(139,92,246,0.5)",
    accentLow: "rgba(139,92,246,0.15)",
    indigo: "rgba(99,102,241,0.9)",
    surface: "rgba(10,6,25,0.72)",
    surfaceFeature: "rgba(16,8,38,0.88)",
    border: "rgba(255,255,255,0.07)",
    borderAccent: "rgba(139,92,246,0.35)",
    textMuted: "rgba(180,165,220,0.45)",
    textSub: "rgba(200,185,235,0.65)",
  },
  shadow: {
    card: "0 4px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)",
    feature: "0 8px 48px rgba(109,40,217,0.22), 0 2px 16px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)",
    glow: "0 0 40px rgba(139,92,246,0.3)",
  },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function GlassCard({
  children,
  className = "",
  delay = 0,
  featured = false,
  glowFrom = "50% 0%",
  glowColor = "rgba(109,40,217,0.12)",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  featured?: boolean;
  glowFrom?: string;
  glowColor?: string;
  onClick?: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5, scale: 1.008 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onClick}
      className={`relative rounded-[22px] overflow-hidden flex flex-col cursor-default ${className}`}
      style={{
        background: featured ? tokens.color.surfaceFeature : tokens.color.surface,
        border: `1px solid ${featured ? tokens.color.borderAccent : tokens.color.border}`,
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
        boxShadow: featured ? tokens.shadow.feature : tokens.shadow.card,
      }}
    >
      {/* Edge shimmer top */}
      <div
        className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{
          background: featured
            ? "linear-gradient(90deg, transparent 10%, rgba(139,92,246,0.6) 50%, transparent 90%)"
            : "linear-gradient(90deg, transparent 20%, rgba(255,255,255,0.08) 50%, transparent 80%)",
        }}
      />
      {/* Radial glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at ${glowFrom}, ${glowColor}, transparent 55%)` }}
        animate={{ opacity: hovered ? 1.6 : 1 }}
        transition={{ duration: 0.35 }}
      />
      {/* Hover border glow */}
      <motion.div
        className="absolute inset-0 rounded-[22px] pointer-events-none"
        style={{ border: "1px solid rgba(139,92,246,0)" }}
        animate={{ borderColor: hovered ? "rgba(139,92,246,0.35)" : "rgba(139,92,246,0)" }}
        transition={{ duration: 0.35 }}
      />
      <div className="relative z-10 h-full flex flex-col">{children}</div>
    </motion.div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-block text-[10px] font-semibold tracking-[0.18em] uppercase px-2.5 py-1 rounded-full mb-3"
      style={{
        background: "rgba(139,92,246,0.12)",
        border: "1px solid rgba(139,92,246,0.3)",
        color: "rgba(192,166,255,0.8)",
        fontFamily: tokens.font.mono,
      }}
    >
      {children}
    </span>
  );
}

function Stat({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex flex-col">
      <span
        className="text-2xl font-black leading-none"
        style={{ fontFamily: tokens.font.display, color: accent ? "#c084fc" : "white" }}
      >
        {value}
      </span>
      <span className="text-[10px] tracking-widest uppercase mt-0.5" style={{ color: tokens.color.textMuted, fontFamily: tokens.font.mono }}>
        {label}
      </span>
    </div>
  );
}

// ─── ILLUSTRATIONS ────────────────────────────────────────────────────────────

function GoalRingsIllustration() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <svg viewBox="0 0 200 200" className="w-44 h-44">
        <defs>
          <radialGradient id="gr1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
          </radialGradient>
          {/* ring gradients */}
          {[["ring_a", "#c084fc", "#7c3aed"], ["ring_b", "#818cf8", "#4f46e5"], ["ring_c", "#a78bfa", "#5b21b6"]].map(([id, c1, c2]) => (
            <linearGradient key={id} id={id} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={c1} />
              <stop offset="100%" stopColor={c2} />
            </linearGradient>
          ))}
        </defs>
        <circle cx="100" cy="100" r="90" fill="url(#gr1)" />
        {/* Outer ring */}
        <circle cx="100" cy="100" r="82" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="10" />
        <motion.circle
          cx="100" cy="100" r="82" fill="none"
          stroke="url(#ring_a)" strokeWidth="10" strokeLinecap="round"
          strokeDasharray="515" strokeDashoffset="515"
          style={{ rotate: -90, transformOrigin: "100px 100px" }}
          animate={{ strokeDashoffset: 100 }}
          transition={{ duration: 1.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* Mid ring */}
        <circle cx="100" cy="100" r="64" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="10" />
        <motion.circle
          cx="100" cy="100" r="64" fill="none"
          stroke="url(#ring_b)" strokeWidth="10" strokeLinecap="round"
          strokeDasharray="402" strokeDashoffset="402"
          style={{ rotate: -90, transformOrigin: "100px 100px" }}
          animate={{ strokeDashoffset: 120 }}
          transition={{ duration: 1.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* Inner ring */}
        <circle cx="100" cy="100" r="46" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="10" />
        <motion.circle
          cx="100" cy="100" r="46" fill="none"
          stroke="url(#ring_c)" strokeWidth="10" strokeLinecap="round"
          strokeDasharray="289" strokeDashoffset="289"
          style={{ rotate: -90, transformOrigin: "100px 100px" }}
          animate={{ strokeDashoffset: 50 }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
        <text x="100" y="96" textAnchor="middle" fontSize="13" fontWeight="800" fill="white" fontFamily="Syne, sans-serif">83%</text>
        <text x="100" y="111" textAnchor="middle" fontSize="8" fill="rgba(192,166,255,0.55)" letterSpacing="2" fontFamily="JetBrains Mono, monospace">COMPLETE</text>
      </svg>
    </div>
  );
}

function XPBarIllustration() {
  const bars = [
    { h: 55, active: true },
    { h: 80, active: true },
    { h: 40, active: true },
    { h: 95, active: true },
    { h: 65, active: true },
    { h: 110, active: true },
    { h: 45, active: false },
    { h: 30, active: false },
  ];
  return (
    <div className="w-full mt-auto pt-4">
      <div className="flex items-end gap-1.5 h-28 px-1">
        {bars.map((b, i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-md"
            style={{
              background: b.active
                ? "linear-gradient(180deg, #a855f7 0%, #6d28d9 100%)"
                : "rgba(255,255,255,0.05)",
              border: b.active ? "1px solid rgba(192,132,252,0.35)" : "1px solid rgba(255,255,255,0.04)",
            }}
            initial={{ height: 0 }}
            whileInView={{ height: b.h }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
      </div>
      <div className="flex justify-between px-1 mt-2">
        {["M", "T", "W", "T", "F", "S", "S", "M"].map((d, i) => (
          <span key={i} className="flex-1 text-center text-[9px]" style={{ color: "rgba(160,140,200,0.35)", fontFamily: tokens.font.mono }}>{d}</span>
        ))}
      </div>
    </div>
  );
}

function StreakCalendarIllustration() {
  const weeks = Array.from({ length: 6 }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const pos = w * 7 + d;
      if (pos > 38) return 0;
      const pattern = [1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1];
      return pattern[pos] ?? 0;
    })
  );

  return (
    <div className="flex flex-col gap-1.5 mt-auto pt-4">
      {weeks.map((week, wi) => (
        <div key={wi} className="flex gap-1.5">
          {week.map((active, di) => (
            <motion.div
              key={di}
              className="flex-1 h-5 rounded-[4px]"
              style={{
                background: active
                  ? wi >= 4
                    ? "linear-gradient(135deg, #c084fc, #7c3aed)"
                    : "rgba(139,92,246,0.55)"
                  : "rgba(255,255,255,0.04)",
                border: active ? "1px solid rgba(192,132,252,0.25)" : "1px solid rgba(255,255,255,0.03)",
              }}
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: (wi * 7 + di) * 0.015 + 0.3 }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function DevCommitIllustration() {
  const lines = [
    { col: "#c084fc", text: "const", rest: " session = await track()" },
    { col: "#86efac", text: "// +320 XP", rest: " earned" },
    { col: "#7dd3fc", text: "commits", rest: ".push({ xp: 80 })" },
    { col: "#c084fc", text: "streak", rest: ".extend(today)" },
    { col: "#fbbf24", text: "rank", rest: ".update('Gold III')" },
  ];
  return (
    <div
      className="rounded-xl overflow-hidden mt-auto"
      style={{ background: "rgba(6,3,18,0.95)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-white/5">
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c, opacity: 0.75 }} />
        ))}
        <span className="text-[9px] ml-2 tracking-widest" style={{ color: "rgba(160,140,200,0.4)", fontFamily: tokens.font.mono }}>kyzen.dev — session.ts</span>
      </div>
      <div className="p-4 space-y-1.5">
        {lines.map((l, i) => (
          <motion.div
            key={i}
            className="text-[10px] leading-relaxed"
            style={{ fontFamily: tokens.font.mono }}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
          >
            <span style={{ color: l.col }}>{l.text}</span>
            <span style={{ color: "rgba(200,185,235,0.45)" }}>{l.rest}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ClanIllustration() {
  const avatars = ["🧙", "⚔️", "🎯", "🦅", "🔮", "💎"];
  return (
    <div className="flex flex-col items-center gap-4 mt-auto pt-2">
      {/* Clan badge */}
      <motion.div
        className="relative flex items-center justify-center w-20 h-20 rounded-2xl"
        style={{
          background: "linear-gradient(135deg, rgba(109,40,217,0.5), rgba(79,70,229,0.4))",
          border: "1px solid rgba(139,92,246,0.4)",
          boxShadow: "0 0 32px rgba(139,92,246,0.25)",
        }}
        animate={{ boxShadow: ["0 0 24px rgba(139,92,246,0.2)", "0 0 40px rgba(139,92,246,0.35)", "0 0 24px rgba(139,92,246,0.2)"] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <span className="text-3xl">⚡</span>
        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black"
          style={{ background: "#7c3aed", border: "1.5px solid rgba(0,0,0,0.5)", color: "white", fontFamily: tokens.font.display }}>
          S
        </div>
      </motion.div>
      {/* Avatar row */}
      <div className="flex -space-x-2">
        {avatars.map((a, i) => (
          <motion.div
            key={i}
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
            style={{
              background: `rgba(${50 + i * 12},${20 + i * 8},${100 + i * 15},0.8)`,
              border: "2px solid rgba(10,6,25,0.9)",
              zIndex: avatars.length - i,
            }}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
          >
            {a}
          </motion.div>
        ))}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-[9px] font-bold"
          style={{ background: "rgba(139,92,246,0.25)", border: "2px solid rgba(139,92,246,0.4)", color: "#c084fc", fontFamily: tokens.font.mono }}
        >
          +14
        </div>
      </div>
      {/* Leaderboard mini */}
      <div className="w-full space-y-1.5">
        {[["⚡ Storm Clan", "14,200 XP", true], ["🔮 Arcane", "11,850 XP", false], ["🦅 Vanguard", "9,400 XP", false]].map(([name, xp, top], i) => (
          <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg"
            style={{
              background: top ? "rgba(139,92,246,0.15)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${top ? "rgba(139,92,246,0.3)" : "rgba(255,255,255,0.04)"}`,
            }}>
            <span className="text-[11px]" style={{ color: top ? "#e9d5ff" : "rgba(180,165,220,0.45)", fontFamily: tokens.font.body }}>{name as string}</span>
            <span className="text-[10px] font-semibold" style={{ color: top ? "#c084fc" : "rgba(160,140,200,0.35)", fontFamily: tokens.font.mono }}>{xp as string}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── FLOATING PARTICLES ───────────────────────────────────────────────────────
function Particle({ style }: { style: React.CSSProperties }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ width: 5, height: 5, background: "rgba(139,92,246,0.4)", ...style }}
      animate={{ y: [0, -18, 0], opacity: [0.25, 0.65, 0.25] }}
      transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const Features = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const headerY = useTransform(scrollYProgress, [0, 0.2], [48, 0]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.18], [0, 1]);

  return (
    <section ref={sectionRef} className="relative py-24 overflow-hidden">
      {/* ── Background atmosphere ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(109,40,217,0.1) 0%, transparent 70%)" }}
      />
      <div
        className="absolute pointer-events-none rounded-full"
        style={{ width: 600, height: 400, bottom: "5%", right: "-10%", background: "radial-gradient(circle, rgba(79,70,229,0.08) 0%, transparent 70%)", filter: "blur(80px)" }}
      />

      {/* Floating particles */}
      <Particle style={{ top: "12%", left: "7%" }} />
      <Particle style={{ top: "40%", right: "5%", width: 7, height: 7 }} />
      <Particle style={{ top: "70%", left: "4%", width: 4, height: 4 }} />
      <Particle style={{ bottom: "18%", right: "12%", width: 6, height: 6 }} />
      <Particle style={{ top: "25%", right: "20%", width: 4, height: 4 }} />
      <Particle style={{ top: "55%", left: "18%", width: 5, height: 5 }} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* ── Section header ── */}
        <motion.div style={{ y: headerY, opacity: headerOpacity }} className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-5"
          >
            <div className="h-px flex-1 max-w-[48px]" style={{ background: "rgba(139,92,246,0.4)" }} />
            <span
              className="text-[11px] tracking-[0.22em] uppercase font-semibold"
              style={{ color: "rgba(192,166,255,0.6)", fontFamily: tokens.font.mono }}
            >
              Platform Features
            </span>
          </motion.div>

          <h2
            className="font-black leading-[0.95] uppercase"
            style={{
              fontSize: "clamp(3rem,7vw,5.5rem)",
              fontFamily: tokens.font.display,
              background: "linear-gradient(135deg, #ffffff 30%, rgba(192,132,252,0.9) 65%, rgba(99,102,241,0.8) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.02em",
            }}
          >
            Your life.
            <br />
            <span style={{ background: "linear-gradient(90deg, #a855f7, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Gamified.
            </span>
          </h2>

          <p
            className="mt-5 max-w-lg leading-relaxed"
            style={{ fontSize: "clamp(0.88rem,1.3vw,1rem)", color: tokens.color.textMuted, fontFamily: tokens.font.body }}
          >
            Kyzen transforms your real effort — goals, focus sessions, commits — into a living
            progression system that rewards consistency and fuels momentum.
          </p>
        </motion.div>

        {/* ── BENTO GRID ── */}
        <div className="grid grid-cols-12 grid-rows-auto gap-4">

          {/* ── CARD 1: Goal System (tall, left) ── */}
          <GlassCard
            className="col-span-12 md:col-span-4 row-span-2"
            delay={0.08}
            glowColor="rgba(99,102,241,0.14)"
            glowFrom="40% 0%"
          >
            <div className="p-6 flex flex-col h-full min-h-[420px]">
              <Tag>01 / Goal System</Tag>
              <h3
                className="text-2xl font-black text-white leading-tight mb-2"
                style={{ fontFamily: tokens.font.display }}
              >
                Set Goals.<br />Watch Them Fall.
              </h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: tokens.color.textMuted, fontFamily: tokens.font.body }}>
                Define daily and weekly targets. Kyzen structures them into achievable milestones — no willpower drama, just momentum.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-2">
                <div className="px-3 py-2.5 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <Stat label="Goals Hit" value="94%" accent />
                </div>
                <div className="px-3 py-2.5 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <Stat label="This Week" value="7/7" />
                </div>
              </div>
              <GoalRingsIllustration />
            </div>
          </GlassCard>

          {/* ── CARD 2: XP & Leveling (wide, featured) ── */}
          <GlassCard
            className="col-span-12 md:col-span-8 row-span-1"
            delay={0.14}
            featured
            glowColor="rgba(139,92,246,0.18)"
            glowFrom="60% 20%"
          >
            <div className="p-6 flex flex-col md:flex-row gap-6 min-h-[200px]">
              <div className="flex-1">
                <Tag>02 / XP & Leveling</Tag>
                <h3 className="text-2xl font-black text-white leading-tight mb-2" style={{ fontFamily: tokens.font.display }}>
                  Every Action.<br />Real Progress.
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: tokens.color.textMuted, fontFamily: tokens.font.body }}>
                  Instant XP for every task you close. Watch your level climb in real time — no lag between effort and reward.
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <Stat label="Total XP" value="2,450" accent />
                  <div className="h-8 w-px" style={{ background: "rgba(255,255,255,0.07)" }} />
                  <Stat label="Level" value="Lv. 12" />
                  <div className="h-8 w-px" style={{ background: "rgba(255,255,255,0.07)" }} />
                  <Stat label="Today" value="+320" accent />
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-end min-w-0">
                <XPBarIllustration />
              </div>
            </div>
          </GlassCard>

          {/* ── CARD 3: Streak System ── */}
          <GlassCard
            className="col-span-12 md:col-span-5 row-span-1"
            delay={0.2}
            glowColor="rgba(168,85,247,0.1)"
            glowFrom="30% 50%"
          >
            <div className="p-6 flex flex-col md:flex-row gap-6 min-h-[200px]">
              <div className="flex-1">
                <Tag>03 / Streaks</Tag>
                <h3 className="text-xl font-black text-white leading-tight mb-2" style={{ fontFamily: tokens.font.display }}>
                  Momentum Is<br />Your Superpower.
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: tokens.color.textMuted, fontFamily: tokens.font.body }}>
                  Build streaks, multiply XP gains, and keep the chain alive. Miss a day? Recovery systems have you covered.
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-2xl">🔥</span>
                    <Stat label="Day Streak" value="14" accent />
                  </div>
                  <div className="h-8 w-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                  <Stat label="Multiplier" value="×1.8" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <StreakCalendarIllustration />
              </div>
            </div>
          </GlassCard>

          {/* ── CARD 4: Developer Integration ── */}
          <GlassCard
            className="col-span-12 md:col-span-3 row-span-1"
            delay={0.26}
            glowColor="rgba(125,211,252,0.06)"
            glowFrom="80% 30%"
          >
            <div className="p-6 flex flex-col min-h-[200px]">
              <Tag>04 / Dev Mode</Tag>
              <h3 className="text-xl font-black text-white leading-tight mb-2" style={{ fontFamily: tokens.font.display }}>
                Real Work.<br />Measurable XP.
              </h3>
              <p className="text-sm leading-relaxed mb-3" style={{ color: tokens.color.textMuted, fontFamily: tokens.font.body }}>
                Connect GitHub, track coding sessions, and convert every commit into progress you can see.
              </p>
              <DevCommitIllustration />
            </div>
          </GlassCard>

          {/* ── CARD 5: Clans / Social (wide, bottom) ── */}
          <GlassCard
            className="col-span-12 md:col-span-12 lg:col-span-12"
            delay={0.3}
            glowColor="rgba(139,92,246,0.1)"
            glowFrom="50% 100%"
          >
            <div className="p-6 flex flex-col md:flex-row gap-8 min-h-[240px]">
              <div className="flex-1 max-w-sm">
                <Tag>05 / Clans</Tag>
                <h3 className="text-2xl font-black text-white leading-tight mb-3" style={{ fontFamily: tokens.font.display }}>
                  Compete.<br />Collaborate.<br />Dominate.
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: tokens.color.textMuted, fontFamily: tokens.font.body }}>
                  Create or join Clans of fellow grinders. Pool XP, climb leaderboards together, and take on clan-exclusive challenges that push everyone further.
                </p>
                <div className="flex gap-3 mt-5">
                  {[
                    { icon: "⚡", label: "Clan XP Pool", val: "48K" },
                    { icon: "🏆", label: "Global Rank", val: "#3" },
                    { icon: "👥", label: "Members", val: "20" },
                  ].map(({ icon, label, val }) => (
                    <div key={label} className="flex-1 px-3 py-2.5 rounded-xl text-center"
                      style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}>
                      <div className="text-base mb-0.5">{icon}</div>
                      <div className="text-sm font-black text-white" style={{ fontFamily: tokens.font.display }}>{val}</div>
                      <div className="text-[9px] tracking-widest uppercase" style={{ color: tokens.color.textMuted, fontFamily: tokens.font.mono }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <ClanIllustration />
              </div>
              {/* Decorative right side — ambient art */}
              <div className="hidden lg:flex flex-1 items-center justify-center relative">
                <motion.div
                  className="absolute rounded-full"
                  style={{ width: 220, height: 220, background: "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)", filter: "blur(40px)" }}
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />
                <svg viewBox="0 0 200 200" className="w-40 h-40 relative z-10" opacity={0.9}>
                  <defs>
                    <radialGradient id="shieldGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#9333ea" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#9333ea" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <circle cx="100" cy="100" r="88" fill="url(#shieldGlow)" />
                  {/* Shield */}
                  <path
                    d="M100,30 L150,55 L150,105 Q150,150 100,170 Q50,150 50,105 L50,55 Z"
                    fill="rgba(88,28,220,0.35)"
                    stroke="rgba(139,92,246,0.5)"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M100,45 L138,64 L138,105 Q138,140 100,155 Q62,140 62,105 L62,64 Z"
                    fill="rgba(109,40,217,0.3)"
                    stroke="rgba(192,132,252,0.3)"
                    strokeWidth="1"
                  />
                  <text x="100" y="108" textAnchor="middle" fontSize="28" fill="rgba(232,202,255,0.9)">⚔️</text>
                  <text x="100" y="130" textAnchor="middle" fontSize="8" fill="rgba(192,166,255,0.5)" letterSpacing="3" fontFamily="JetBrains Mono, monospace">STORM CLAN</text>
                </svg>
              </div>
            </div>
          </GlassCard>

        </div>
      </div>
    </section>
  );
};

export default Features;