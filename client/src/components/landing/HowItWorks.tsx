/**
 * HowItWorks.tsx — Premium Cinematic Scroll Experience
 * ─────────────────────────────────────────────────────
 * A world-class sticky scroll section with:
 *  • 2-column layout: full-bleed left visual + right step content
 *  • Scroll-driven step progression (400vh total)
 *  • Per-step animated canvas on the left
 *  • Strong visual hierarchy, layered depth, glassmorphism
 *  • Framer Motion for all transitions
 */

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const V = {
  accent: "#7c3aed",
  accentBright: "#a78bfa",
  accentGlow: "rgba(124,58,237,0.45)",
  accentSoft: "rgba(124,58,237,0.12)",
  canvas: "#060410",
  surface: "rgba(14,9,32,0.92)",
  surfaceBright: "rgba(22,14,50,0.95)",
  border: "rgba(139,92,246,0.18)",
  borderBright: "rgba(139,92,246,0.45)",
  text: "rgba(230,220,255,0.92)",
  textMuted: "rgba(180,165,220,0.48)",
  textDim: "rgba(140,120,180,0.28)",
};

const ease = [0.16, 1, 0.3, 1] as const;
const easeOut = [0.0, 0.0, 0.2, 1] as const;

// ─── STEP DATA ────────────────────────────────────────────────────────────────
const STEPS = [
  {
    num: "01",
    id: "connect",
    label: "Connect",
    title: "Plug in everything\nyou already use",
    body: "Kyzen syncs with GitHub, Linear, Jira, Notion, and 40+ more tools. Every commit, task, and PR flows automatically — zero manual logging required.",
    tags: ["GitHub", "Linear", "Jira", "Notion", "Slack", "Figma"],
    stat: { val: "40+", unit: "integrations" },
    color: "#6d28d9",
    colorBright: "#a78bfa",
  },
  {
    num: "02",
    id: "earn",
    label: "Earn XP",
    title: "Every action\nbecomes progress",
    body: "Ship a PR, close a task, hit a deadline — each action earns XP calibrated to impact and difficulty. Watch your level climb in real time.",
    tags: ["Commits", "Pull Requests", "Tasks", "Reviews", "Milestones"],
    stat: { val: "3.2×", unit: "avg velocity boost" },
    color: "#5b21b6",
    colorBright: "#c4b5fd",
  },
  {
    num: "03",
    id: "streaks",
    label: "Build Streaks",
    title: "Consistency\nbecomes power",
    body: "Daily streaks compound your XP multiplier. Miss a day, lose momentum. The longer your streak, the greater your rewards — and your edge over the competition.",
    tags: ["Daily Goals", "Multipliers", "Streak Shield", "Milestones"],
    stat: { val: "127d", unit: "longest streak" },
    color: "#7c3aed",
    colorBright: "#ddd6fe",
  },
  {
    num: "04",
    id: "identity",
    label: "Own Your Identity",
    title: "Your rank is\nirrefutable proof",
    body: "Your Kyzen profile is a living record of everything you've shipped. Shareable, verifiable, and always up to date — the credential that speaks for itself.",
    tags: ["Rank Card", "Badges", "Leaderboard", "Portfolio", "Aura"],
    stat: { val: "∞", unit: "legacy" },
    color: "#4c1d95",
    colorBright: "#ede9fe",
  },
];

// ─── LEFT VISUALS ─────────────────────────────────────────────────────────────

/** Step 01 — Connection network nodes */
function VisualConnect() {
  const nodes = [
    { x: 50, y: 50, label: "Kyzen", main: true },
    { x: 18, y: 22, label: "GitHub", icon: "⌥" },
    { x: 78, y: 18, label: "Linear", icon: "◆" },
    { x: 82, y: 72, label: "Jira", icon: "◉" },
    { x: 20, y: 76, label: "Notion", icon: "▣" },
    { x: 50, y: 88, label: "Figma", icon: "◈" },
    { x: 14, y: 50, label: "Slack", icon: "⬡" },
    { x: 86, y: 45, label: "VS Code", icon: "⬧" },
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        {nodes.slice(1).map((n, i) => (
          <motion.line
            key={i}
            x1="50" y1="50" x2={n.x} y2={n.y}
            stroke="rgba(139,92,246,0.25)"
            strokeWidth="0.4"
            strokeDasharray="2 2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: easeOut }}
          />
        ))}
        {/* Animated pulse along lines */}
        {nodes.slice(1).map((n, i) => (
          <motion.circle
            key={`pulse-${i}`}
            r="0.8"
            fill="#a78bfa"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 0],
              cx: [50, n.x],
              cy: [50, n.y],
            }}
            transition={{
              duration: 2,
              delay: i * 0.3,
              repeat: Infinity,
              repeatDelay: 1.5,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>

      {/* Node chips */}
      {nodes.map((n, i) => (
        <motion.div
          key={i}
          className="absolute flex flex-col items-center"
          style={{ left: `${n.x}%`, top: `${n.y}%`, transform: "translate(-50%,-50%)" }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: i * 0.08, ease }}
        >
          {n.main ? (
            <motion.div
              animate={{ boxShadow: ["0 0 20px rgba(124,58,237,0.4)", "0 0 40px rgba(124,58,237,0.8)", "0 0 20px rgba(124,58,237,0.4)"] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-xs font-bold"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #4c1d95)",
                border: "1.5px solid rgba(167,139,250,0.6)",
                color: "white",
                fontFamily: "'Barlow', sans-serif",
                fontSize: 10,
                letterSpacing: "0.1em",
              }}
            >
              KZN
            </motion.div>
          ) : (
            <motion.div
              whileHover={{ scale: 1.1 }}
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: "rgba(22,10,50,0.9)",
                border: "1px solid rgba(139,92,246,0.3)",
                color: "rgba(167,139,250,0.9)",
                fontSize: 14,
                backdropFilter: "blur(10px)",
              }}
            >
              {n.icon}
            </motion.div>
          )}
          <span style={{ fontSize: 8, color: "rgba(180,160,230,0.5)", marginTop: 4, fontFamily: "'DM Sans', sans-serif" }}>
            {n.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

/** Step 02 — XP counter with floating stats */
function VisualEarnXP() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let n = 0;
    const interval = setInterval(() => {
      n = Math.min(n + Math.floor(Math.random() * 120 + 40), 4280);
      setCount(n);
      if (n >= 4280) clearInterval(interval);
    }, 60);
    return () => clearInterval(interval);
  }, []);

  const bars = [0.4, 0.65, 0.5, 0.82, 0.6, 0.9, 0.55, 0.75, 0.88, 0.7];

  return (
    <div className="relative w-full h-full flex items-center justify-center p-6">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div style={{ width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(109,40,217,0.15) 0%, transparent 70%)" }} />
      </div>

      <div className="relative w-full max-w-sm space-y-5">
        {/* XP Counter card */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="rounded-2xl p-5"
          style={{
            background: "linear-gradient(135deg, rgba(22,10,50,0.95) 0%, rgba(12,5,30,0.98) 100%)",
            border: "1px solid rgba(139,92,246,0.35)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03) inset",
          }}
        >
          <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "rgba(167,139,250,0.5)", fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>TOTAL XP</div>
          <div style={{ fontSize: 52, fontWeight: 900, fontFamily: "'Barlow', sans-serif", background: "linear-gradient(135deg, #a78bfa, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.03em", lineHeight: 1 }}>
            {count.toLocaleString()}
          </div>
          <div style={{ fontSize: 11, color: "rgba(167,139,250,0.4)", marginTop: 4, fontFamily: "'DM Sans', sans-serif" }}>+320 XP this session</div>

          {/* Mini bar chart */}
          <div className="flex items-end gap-1 mt-4" style={{ height: 40 }}>
            {bars.map((h, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-sm"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: h }}
                style={{
                  height: `${h * 100}%`,
                  background: i === bars.length - 1 ? "linear-gradient(180deg, #a78bfa, #7c3aed)" : "rgba(139,92,246,0.22)",
                  borderRadius: 3,
                }}
                transition={{ duration: 0.6, delay: i * 0.07, ease }}
              />
            ))}
          </div>
        </motion.div>

        {/* Floating stat pills */}
        {[
          { label: "PRs merged", val: "+15 XP", delay: 0 },
          { label: "Tasks closed", val: "+8 XP", delay: 0.15 },
          { label: "Review given", val: "+5 XP", delay: 0.3 },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0, y: [0, i % 2 === 0 ? -4 : 4, 0] }}
            transition={{ opacity: { delay: 0.3 + i * 0.15 }, y: { duration: 4 + i, repeat: Infinity, ease: "easeInOut" } }}
            className="flex items-center justify-between px-4 py-2.5 rounded-xl"
            style={{
              background: "rgba(14,8,36,0.8)",
              border: "1px solid rgba(139,92,246,0.2)",
              backdropFilter: "blur(12px)",
            }}
          >
            <span style={{ fontSize: 11, color: "rgba(200,180,240,0.6)", fontFamily: "'DM Sans', sans-serif" }}>{item.label}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#a78bfa", fontFamily: "'JetBrains Mono', monospace" }}>{item.val}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/** Step 03 — Streak calendar heatmap */
function VisualStreaks() {
  const weeks = 18;
  const days = 7;
  const grid = Array.from({ length: weeks }, (_, w) =>
    Array.from({ length: days }, (_, d) => {
      const totalDays = w * days + d;
      if (totalDays > weeks * days - 10) return 4; // recent streak
      if (totalDays > weeks * days - 40) return Math.floor(Math.random() * 4) + 1;
      return Math.random() > 0.35 ? Math.floor(Math.random() * 3) + 1 : 0;
    })
  );

  const intensityColor = (v: number) => {
    const colors = ["rgba(20,12,40,0.6)", "rgba(80,40,160,0.4)", "rgba(100,60,190,0.65)", "rgba(124,58,237,0.8)", "#a78bfa"];
    return colors[v] || colors[0];
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center p-6">
      <div className="relative w-full max-w-sm space-y-5">
        {/* Streak badge */}
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center gap-4 rounded-2xl p-5"
          style={{
            background: "linear-gradient(135deg, rgba(22,10,50,0.95), rgba(12,5,30,0.98))",
            border: "1px solid rgba(139,92,246,0.35)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          }}
        >
          <div className="flex flex-col items-center justify-center w-16 h-16 rounded-xl" style={{ background: "linear-gradient(135deg, #7c3aed, #4c1d95)", boxShadow: "0 8px 24px rgba(124,58,237,0.5)" }}>
            <span style={{ fontSize: 24 }}>🔥</span>
          </div>
          <div>
            <div style={{ fontSize: 10, letterSpacing: "0.18em", color: "rgba(167,139,250,0.5)", fontFamily: "'JetBrains Mono', monospace" }}>CURRENT STREAK</div>
            <div style={{ fontSize: 40, fontWeight: 900, fontFamily: "'Barlow', sans-serif", background: "linear-gradient(135deg, #fff, #c4b5fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.03em", lineHeight: 1 }}>127 days</div>
            <div style={{ fontSize: 11, color: "rgba(167,139,250,0.45)", fontFamily: "'DM Sans', sans-serif" }}>2.4× XP multiplier active</div>
          </div>
        </motion.div>

        {/* Heatmap grid */}
        <div className="rounded-2xl p-4" style={{ background: "rgba(14,8,36,0.75)", border: "1px solid rgba(139,92,246,0.18)" }}>
          <div style={{ fontSize: 9, letterSpacing: "0.18em", color: "rgba(167,139,250,0.4)", fontFamily: "'JetBrains Mono', monospace", marginBottom: 8 }}>ACTIVITY HEATMAP</div>
          <div className="flex gap-1">
            {grid.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-1">
                {week.map((val, di) => (
                  <motion.div
                    key={di}
                    className="rounded-sm"
                    style={{ width: 11, height: 11, background: intensityColor(val) }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: (wi * days + di) * 0.003 }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Step 04 — Identity / rank card */
function VisualIdentity() {
  const badges = ["🏆", "⚡", "🔥", "💎", "🎯", "🚀"];

  return (
    <div className="relative w-full h-full flex items-center justify-center p-6">
      {/* Outer ambient */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        <div style={{ width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle, rgba(109,40,217,0.2) 0%, transparent 70%)" }} />
      </motion.div>

      <div className="relative w-full max-w-xs space-y-4">
        {/* Profile rank card */}
        <motion.div
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(145deg, rgba(30,12,70,0.97), rgba(12,5,32,0.99))",
            border: "1px solid rgba(167,139,250,0.35)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 60px rgba(109,40,217,0.15)",
          }}
        >
          {/* Card header gradient */}
          <div className="h-20 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #6d28d9 100%)" }}>
            <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(167,139,250,0.3) 0%, transparent 70%)" }} />
            <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)" }} />
          </div>

          <div className="px-5 pb-5 -mt-8">
            {/* Avatar */}
            <motion.div
              animate={{ boxShadow: ["0 0 20px rgba(124,58,237,0.5)", "0 0 40px rgba(124,58,237,0.9)", "0 0 20px rgba(124,58,237,0.5)"] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mb-3"
              style={{ background: "linear-gradient(135deg, #1e0a50, #3b0764)", border: "2.5px solid rgba(167,139,250,0.5)" }}
            >
              🧙
            </motion.div>

            <div style={{ fontSize: 16, fontWeight: 800, color: "rgba(235,225,255,0.95)", fontFamily: "'Barlow', sans-serif", letterSpacing: "-0.01em" }}>Alex Chen</div>
            <div style={{ fontSize: 10, letterSpacing: "0.14em", color: "#a78bfa", fontFamily: "'JetBrains Mono', monospace", marginTop: 1 }}>GRANDMASTER · LVL 94</div>

            {/* XP bar */}
            <div className="mt-4 mb-1">
              <div className="flex justify-between mb-1.5" style={{ fontSize: 9, color: "rgba(167,139,250,0.4)", fontFamily: "'JetBrains Mono', monospace" }}>
                <span>XP TO LVL 95</span><span>87,200 / 100,000</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, #7c3aed, #a78bfa)" }}
                  initial={{ width: 0 }}
                  animate={{ width: "87.2%" }}
                  transition={{ duration: 1.2, ease, delay: 0.2 }}
                />
              </div>
            </div>

            {/* Badge row */}
            <div className="flex gap-2 mt-4">
              {badges.map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.08, type: "spring", stiffness: 300 }}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
                  style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(139,92,246,0.25)" }}
                >
                  {b}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats row */}
        {[
          { label: "Global Rank", val: "#142" },
          { label: "Streak", val: "127d 🔥" },
        ].map((s, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, i === 0 ? -3 : 3, 0] }}
            transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center justify-between px-4 py-3 rounded-xl"
            style={{ background: "rgba(14,8,36,0.75)", border: "1px solid rgba(139,92,246,0.2)" }}
          >
            <span style={{ fontSize: 11, color: V.textMuted, fontFamily: "'DM Sans', sans-serif" }}>{s.label}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#a78bfa", fontFamily: "'Barlow', sans-serif" }}>{s.val}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const VISUALS = [VisualConnect, VisualEarnXP, VisualStreaks, VisualIdentity];

// ─── BACKGROUND PARTICLES ─────────────────────────────────────────────────────
function Particles() {
  const pts = Array.from({ length: 28 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2.5 + 0.5,
    dur: Math.random() * 8 + 6,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {pts.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: "rgba(167,139,250,0.5)",
          }}
          animate={{
            opacity: [0, 0.7, 0],
            y: [0, -30, -60],
          }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

// ─── STEP PROGRESS NAV ────────────────────────────────────────────────────────
function StepNav({ active }: { active: number }) {
  return (
    <div className="flex flex-col gap-3">
      {STEPS.map((s, i) => (
        <motion.div
          key={i}
          className="flex items-center gap-3"
          animate={{ opacity: i === active ? 1 : i < active ? 0.45 : 0.2 }}
          transition={{ duration: 0.4 }}
        >
          {/* Step dot/check */}
          <motion.div
            className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
            animate={{
              background: i === active ? V.accent : i < active ? "rgba(124,58,237,0.35)" : "rgba(255,255,255,0.06)",
              boxShadow: i === active ? "0 0 14px rgba(124,58,237,0.6)" : "none",
              scale: i === active ? 1.15 : 1,
            }}
            transition={{ duration: 0.35 }}
            style={{ border: `1.5px solid ${i === active ? V.accentBright : i < active ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.08)"}` }}
          >
            {i < active ? (
              <svg viewBox="0 0 20 20" width="11" height="11" fill="none">
                <path d="M4 10 L8 14 L16 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <span style={{ fontSize: 7, color: i === active ? "white" : "rgba(200,180,240,0.4)", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{s.num}</span>
            )}
          </motion.div>

          {/* Label */}
          <div>
            <motion.div
              animate={{ color: i === active ? "rgba(230,220,255,0.95)" : i < active ? "rgba(180,160,220,0.5)" : "rgba(140,120,180,0.25)" }}
              style={{ fontSize: 12, fontWeight: i === active ? 600 : 400, fontFamily: "'DM Sans', sans-serif" }}
              transition={{ duration: 0.3 }}
            >
              {s.label}
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function HowItWorks() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [progress, setProgress] = useState(0);

  const onScroll = useCallback(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const sectionTop = el.getBoundingClientRect().top + window.scrollY;
    const scrollRange = el.offsetHeight - window.innerHeight;
    const scrolled = window.scrollY - sectionTop;
    const p = Math.min(1, Math.max(0, scrolled / scrollRange));
    setProgress(p);
    const next = Math.min(STEPS.length - 1, Math.floor(p * STEPS.length));
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

  const LeftVisual = VISUALS[active];

  return (
    <div ref={wrapperRef} style={{ height: "400vh", position: "relative" }}>
      <div
        className="sticky top-0 h-screen overflow-hidden"
        style={{ backgroundColor: V.canvas }}
      >
        {/* ── Atmosphere ── */}
        <Particles />

        {/* Grid */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: "radial-gradient(rgba(139,92,246,0.06) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Grain */}
        <div
          className="absolute inset-0 pointer-events-none z-0 opacity-[0.035]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "200px",
          }}
        />

        {/* Center glow */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-0"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{ background: "radial-gradient(ellipse 70% 50% at 30% 50%, rgba(88,28,220,0.12) 0%, transparent 70%)" }}
        />

        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{ background: "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 30%, rgba(6,4,16,0.92) 100%)" }}
        />

        {/* ── TWO-COLUMN LAYOUT ── */}
        <div className="relative z-10 h-full flex">

          {/* ════ LEFT COLUMN: Animated Visual ════ */}
          <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden">
            {/* Left panel subtle bg */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(135deg, rgba(18,8,44,0.6) 0%, rgba(8,4,20,0.3) 100%)",
                borderRight: "1px solid rgba(139,92,246,0.1)",
              }}
            />

            {/* Step counter watermark */}
            <div className="absolute top-10 left-10 z-10 select-none">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 20, filter: "blur(12px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -20, filter: "blur(12px)" }}
                  transition={{ duration: 0.5, ease }}
                >
                  <span
                    style={{
                      fontFamily: "'Barlow', sans-serif",
                      fontSize: "clamp(7rem, 14vw, 11rem)",
                      fontWeight: 900,
                      color: "transparent",
                      WebkitTextStroke: "1px rgba(139,92,246,0.12)",
                      letterSpacing: "-0.05em",
                      lineHeight: 1,
                    }}
                  >
                    {STEPS[active].num}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Visual canvas */}
            <div className="flex-1 flex items-center justify-center relative z-10">
              <div className="w-full h-[75%] max-w-lg">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`visual-${active}`}
                    className="w-full h-full"
                    initial={{ opacity: 0, scale: 0.92, filter: "blur(16px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 1.05, filter: "blur(16px)" }}
                    transition={{ duration: 0.65, ease }}
                  >
                    <LeftVisual />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Bottom: Integration label */}
            <div className="absolute bottom-8 left-10 right-10 z-10">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, rgba(139,92,246,0.3), transparent)" }} />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`tags-${active}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="flex gap-2 flex-shrink-0"
                  >
                    {STEPS[active].tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-lg text-[10px]"
                        style={{
                          background: "rgba(22,10,50,0.8)",
                          border: "1px solid rgba(139,92,246,0.2)",
                          color: "rgba(192,166,255,0.5)",
                          fontFamily: "'DM Sans', sans-serif",
                          backdropFilter: "blur(8px)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* ════ RIGHT COLUMN: Step Content ════ */}
          <div className="w-full lg:w-[48%] xl:w-[42%] flex-shrink-0 flex flex-col justify-center px-8 lg:px-12 xl:px-16 py-12 gap-8 relative">

            {/* Eyebrow */}
            <div className="flex items-center gap-3">
              <div className="h-px w-6" style={{ background: "rgba(139,92,246,0.4)" }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.22em", color: "rgba(167,139,250,0.4)" }}>
                HOW IT WORKS
              </span>
              <div className="h-px w-6" style={{ background: "rgba(139,92,246,0.4)" }} />
            </div>

            {/* Mobile visual (shows on small screens) */}
            <div className="lg:hidden w-full h-56 rounded-2xl overflow-hidden relative" style={{ background: "rgba(14,8,36,0.7)", border: "1px solid rgba(139,92,246,0.2)" }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`mobile-visual-${active}`}
                  className="w-full h-full"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease }}
                >
                  <LeftVisual />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Title */}
            <div className="overflow-hidden">
              <AnimatePresence mode="wait" custom={dir}>
                <motion.h2
                  key={`title-${active}`}
                  custom={dir}
                  initial={{ opacity: 0, y: dir * 40, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: dir * -40, filter: "blur(8px)" }}
                  transition={{ duration: 0.55, ease }}
                  className="font-black leading-[1.06] whitespace-pre-line"
                  style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontSize: "clamp(2rem, 4vw, 3.4rem)",
                    letterSpacing: "-0.025em",
                    background: "linear-gradient(135deg, #ffffff 0%, rgba(192,132,252,0.9) 60%, rgba(139,92,246,0.8) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {STEPS[active].title}
                </motion.h2>
              </AnimatePresence>
            </div>

            {/* Body */}
            <AnimatePresence mode="wait" custom={dir}>
              <motion.p
                key={`body-${active}`}
                custom={dir}
                initial={{ opacity: 0, y: dir * 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: dir * -24 }}
                transition={{ duration: 0.5, delay: 0.06, ease }}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "clamp(0.9rem, 1.5vw, 1.05rem)",
                  lineHeight: 1.85,
                  color: "rgba(200,185,240,0.65)",
                  maxWidth: "36ch",
                }}
              >
                {STEPS[active].body}
              </motion.p>
            </AnimatePresence>

            {/* Stat callout */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`stat-${active}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="inline-flex items-baseline gap-3 px-5 py-3 rounded-xl self-start"
                style={{
                  background: "rgba(124,58,237,0.1)",
                  border: "1px solid rgba(139,92,246,0.25)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 32, fontWeight: 900, color: "#a78bfa", letterSpacing: "-0.02em", lineHeight: 1 }}>
                  {STEPS[active].stat.val}
                </span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(167,139,250,0.45)" }}>
                  {STEPS[active].stat.unit}
                </span>
              </motion.div>
            </AnimatePresence>

            {/* Divider */}
            <div className="h-px" style={{ background: "rgba(139,92,246,0.1)" }} />

            {/* Step nav */}
            <StepNav active={active} />

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="h-px rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, rgba(124,58,237,0.5), #a78bfa)" }}
                  animate={{ width: `${((active + 1) / STEPS.length) * 100}%` }}
                  transition={{ duration: 0.6, ease }}
                />
              </div>
              <div className="flex justify-between">
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: "0.2em", color: "rgba(140,120,180,0.28)" }}>
                  STEP {String(active + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
                </span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: "0.2em", color: "rgba(140,120,180,0.28)" }}>
                  {Math.round(((active + 1) / STEPS.length) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll cue — first step only */}
        <AnimatePresence>
          {active === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 1.2 } }}
              exit={{ opacity: 0 }}
              className="absolute bottom-6 left-[25%] -translate-x-1/2 flex flex-col items-center gap-2 z-20 hidden lg:flex"
            >
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: "0.28em", color: "rgba(140,120,180,0.22)" }}>
                SCROLL TO EXPLORE
              </span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-px h-8 rounded-full"
                style={{ background: "linear-gradient(180deg, rgba(124,58,237,0.6), transparent)" }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}