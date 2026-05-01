import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────
interface QuestItem { title: string; xp: number; done: boolean; tag: string }
interface FloatingBadge { id: number; label: string; color: string; x: number; y: number }

// ─── Constants ────────────────────────────────────────────────────────────────
const QUESTS: QuestItem[] = [
  { title: "Ship feature branch before 18:00", xp: 450, done: true,  tag: "DEV"   },
  { title: "30-min deep work session",         xp: 200, done: true,  tag: "FOCUS" },
  { title: "Solve 2 LeetCode mediums",         xp: 300, done: false, tag: "DSA"   },
  { title: "Push daily commit streak",         xp: 150, done: false, tag: "HABIT" },
];

const LIVE_STATS = [
  { label: "XP/hr",        value: "2,840", accent: "#22c55e", icon: "⚡" },
  { label: "Online",       value: "4,201", accent: "#06b6d4", icon: "◉"  },
  { label: "Quests done",  value: "98%",   accent: "#a78bfa", icon: "✓"  },
];

const FLOATING_BADGES: Omit<FloatingBadge, "id">[] = [
  { label: "+450 XP",   color: "#22c55e", x: 8,  y: 28  },
  { label: "QUEST ✓",   color: "#a78bfa", x: 82, y: 18  },
  { label: "+DEV RANK", color: "#06b6d4", x: 88, y: 62  },
  { label: "STREAK 34🔥", color: "#f97316", x: 5, y: 68 },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Dot-matrix star field with two depth layers */
const Starfield = () => {
  const stars = useRef(
    Array.from({ length: 120 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() > 0.92 ? 1.5 : 0.8,
      opacity: Math.random() * 0.5 + 0.05,
      duration: 3 + Math.random() * 6,
      delay: Math.random() * 8,
    }))
  ).current;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{ top: `${s.y}%`, left: `${s.x}%`, width: s.size, height: s.size, opacity: s.opacity }}
          animate={{ opacity: [s.opacity, s.opacity * 0.15, s.opacity] }}
          transition={{ duration: s.duration, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};

/** SVG perspective grid — receding toward center horizon */
const HorizonGrid = () => (
  <div className="absolute inset-x-0 bottom-0 h-[55%] overflow-hidden pointer-events-none" aria-hidden>
    <svg
      viewBox="0 0 1200 500"
      preserveAspectRatio="xMidYMax slice"
      className="absolute bottom-0 w-full h-full"
      style={{ opacity: 0.18 }}
    >
      <defs>
        <radialGradient id="gridFade" cx="50%" cy="100%" r="75%">
          <stop offset="0%"   stopColor="#8b5cf6" stopOpacity="0.9" />
          <stop offset="55%"  stopColor="#4c1d95" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#0b0618" stopOpacity="0"   />
        </radialGradient>
        <linearGradient id="lineOpacity" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="white" stopOpacity="0" />
          <stop offset="100%" stopColor="white" stopOpacity="1" />
        </linearGradient>
        <mask id="gridMask">
          <rect width="1200" height="500" fill="url(#lineOpacity)" />
        </mask>
      </defs>

      <g mask="url(#gridMask)" stroke="url(#gridFade)" strokeWidth="0.6">
        {/* Horizontal lines — perspective scaled */}
        {[0.96, 0.88, 0.76, 0.6, 0.42, 0.24, 0.1].map((t, i) => {
          const y = 500 * t;
          const spread = 600 * (1 - t) * 2.2;
          return (
            <motion.line
              key={`h${i}`}
              x1={600 - spread} y1={y} x2={600 + spread} y2={y}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 1.2 + i * 0.08, duration: 0.6 }}
            />
          );
        })}
        {/* Vertical perspective lines radiating from vanishing point */}
        {Array.from({ length: 15 }, (_, i) => {
          const frac = i / 14;
          const x2 = frac * 1200;
          return (
            <motion.line
              key={`v${i}`}
              x1={600} y1={0} x2={x2} y2={500}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 1.5 + i * 0.04, duration: 0.5 }}
            />
          );
        })}
      </g>
      {/* Horizon glow line */}
      <motion.line
        x1="0" y1="2" x2="1200" y2="2"
        stroke="#8b5cf6" strokeWidth="1.5" strokeOpacity="0.55"
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ delay: 1.0, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "600px 2px" }}
      />
    </svg>
  </div>
);

/** Faint concentric orbit rings */
const OrbitRings = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden
    style={{ top: "10%" }}>
    {[340, 520, 720].map((r, i) => (
      <motion.div
        key={r}
        className="absolute rounded-full border"
        style={{
          width: r, height: r,
          borderColor: `rgba(139,92,246,${0.07 - i * 0.018})`,
        }}
        animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
        transition={{ duration: 60 + i * 30, repeat: Infinity, ease: "linear" }}
      >
        {/* Orbiting dot */}
        <motion.div
          className="absolute w-1 h-1 rounded-full"
          style={{
            top: -2, left: "50%",
            background: `rgba(139,92,246,${0.5 - i * 0.1})`,
            boxShadow: `0 0 6px rgba(139,92,246,0.8)`,
          }}
        />
      </motion.div>
    ))}
  </div>
);

/** Floating XP / event badges that drift and fade */
const FloatingBadges = () => {
  const [visible, setVisible] = useState<number[]>([]);

  useEffect(() => {
    const show = (idx: number) => {
      setVisible((v) => [...v, idx]);
      setTimeout(() => setVisible((v) => v.filter((x) => x !== idx)), 3200);
    };
    const schedule = () => {
      const delays = FLOATING_BADGES.map((_, i) => i * 1800 + Math.random() * 600);
      delays.forEach((d, i) => setTimeout(() => show(i), d));
      setTimeout(schedule, FLOATING_BADGES.length * 1800 + 1200);
    };
    const t = setTimeout(schedule, 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      {FLOATING_BADGES.map((b, i) => (
        <AnimatePresence key={i}>
          {visible.includes(i) && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.88 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.92 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="absolute flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest border"
              style={{
                left: `${b.x}%`, top: `${b.y}%`,
                color: b.color,
                borderColor: `${b.color}35`,
                background: `${b.color}0f`,
                backdropFilter: "blur(12px)",
                boxShadow: `0 0 18px ${b.color}22`,
              }}
            >
              {b.label}
            </motion.div>
          )}
        </AnimatePresence>
      ))}
    </div>
  );
};

/** Live animated XP tick counter */
const XpTicker = ({ base = 284_320 }: { base?: number }) => {
  const [xp, setXp] = useState(base);
  useEffect(() => {
    const id = setInterval(() => setXp((v) => v + Math.floor(Math.random() * 12 + 3)), 900);
    return () => clearInterval(id);
  }, []);
  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={xp}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 10, opacity: 0 }}
        transition={{ duration: 0.22 }}
        className="tabular-nums"
      >
        {xp.toLocaleString()}
      </motion.span>
    </AnimatePresence>
  );
};

/** Boot-sequence text reveal */
const BootLine = ({ text, delay }: { text: string; delay: number }) => {
  const [shown, setShown] = useState("");
  useEffect(() => {
    const t = setTimeout(() => {
      let i = 0;
      const tick = setInterval(() => {
        setShown(text.slice(0, ++i));
        if (i >= text.length) clearInterval(tick);
      }, 28);
      return () => clearInterval(tick);
    }, delay);
    return () => clearTimeout(t);
  }, [text, delay]);
  return <span>{shown}<span className="animate-pulse">_</span></span>;
};

/** The dashboard preview panel with 3D tilt + live internals */
const DashboardPreview = () => {
  const [completedIdx, setCompletedIdx] = useState<number | null>(null);
  const [xpBar, setXpBar] = useState(79);
  const [sessionXp, setSessionXp] = useState(3240);

  useEffect(() => {
    // Pulse a "just completed" quest highlight every ~4s
    const id = setInterval(() => {
      const i = Math.floor(Math.random() * QUESTS.length);
      setCompletedIdx(i);
      setTimeout(() => setCompletedIdx(null), 1400);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setSessionXp((v) => v + Math.floor(Math.random() * 7 + 2));
      setXpBar((v) => Math.min(v + 0.06, 100));
    }, 1100);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="relative rounded-2xl border border-white/[0.09] overflow-hidden w-full"
      style={{
        background: "linear-gradient(160deg, rgba(11,6,24,0.98) 0%, rgba(5,1,10,0.99) 100%)",
        backdropFilter: "blur(40px)",
        boxShadow:
          "0 0 0 1px rgba(139,92,246,0.1), 0 50px 120px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.06), inset 0 0 80px rgba(139,92,246,0.03)",
      }}
    >
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.05]">
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
        ))}
        <div className="flex-1 flex justify-center">
          <div
            className="flex items-center gap-2 px-4 py-1 rounded-full border border-white/[0.07]"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-emerald-400"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            />
            <span className="text-[10px] font-mono text-white/20 tracking-widest">kyzen.app · dashboard</span>
          </div>
        </div>
        {/* System status pill */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/8 border border-emerald-500/15">
          <span className="text-[9px] font-mono text-emerald-400/70 tracking-widest">SYS LIVE</span>
        </div>
      </div>

      <div className="flex min-h-0">
        {/* Sidebar */}
        <div
          className="hidden sm:flex w-44 shrink-0 flex-col p-4 gap-0.5 border-r border-white/[0.04]"
          style={{ background: "rgba(0,0,0,0.2)" }}
        >
          <div className="text-[9px] font-mono text-white/15 tracking-[0.25em] uppercase mb-3 px-2">
            KYZEN OS v2.1
          </div>
          {[
            { icon: "⚡", label: "Dashboard", active: true  },
            { icon: "🏹", label: "Quests",    active: false },
            { icon: "🧠", label: "Skills",    active: false },
            { icon: "🔥", label: "Streaks",   active: false },
            { icon: "⚔",  label: "Guild",    active: false },
          ].map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] font-mono cursor-pointer transition-all ${
                item.active
                  ? "text-purple-300 border border-purple-500/25"
                  : "text-white/18 hover:text-white/35"
              }`}
              style={item.active ? { background: "rgba(139,92,246,0.12)" } : {}}
            >
              <span className="text-sm">{item.icon}</span>
              {item.label}
            </div>
          ))}

          <div className="mt-auto pt-4 border-t border-white/[0.04]">
            <div
              className="px-3 py-3 rounded-xl border border-white/[0.05]"
              style={{ background: "rgba(139,92,246,0.06)" }}
            >
              <div className="flex justify-between text-[9px] font-mono text-white/25 mb-2">
                <span>LVL 42</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={Math.floor(sessionXp / 50)}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="text-emerald-400/70"
                  >
                    +{sessionXp.toLocaleString()}
                  </motion.span>
                </AnimatePresence>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-1">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg,#7c3aed,#a855f7,#e879f9)", width: `${xpBar}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
              <div className="text-[9px] font-mono text-white/12">14,320 / 18,000 XP</div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-5 min-w-0 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="text-white font-black text-sm mb-0.5" style={{ fontFamily: "'Syne',sans-serif" }}>
                Good morning, Dev.
              </div>
              <div className="text-white/25 text-[10px] font-mono">
                Quest board refreshed · 4 active
              </div>
            </div>
            <motion.div
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full shrink-0 border border-emerald-500/15"
              style={{ background: "rgba(34,197,94,0.08)" }}
            >
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              />
              <span className="text-emerald-400 text-[9px] font-mono">
                +<XpTicker base={3240} /> XP live
              </span>
            </motion.div>
          </div>

          {/* Stat chips */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Streak", value: "34🔥", color: "#fb923c" },
              { label: "Done",   value: "12 ✓", color: "#34d399" },
              { label: "Rank",   value: "ARCH·III", color: "#a78bfa" },
            ].map((s) => (
              <div
                key={s.label}
                className="p-2.5 rounded-xl border border-white/[0.04] text-center"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                <div className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-1">{s.label}</div>
                <div
                  className="font-black text-xs"
                  style={{ color: s.color, fontFamily: "'Syne',sans-serif" }}
                >
                  {s.value}
                </div>
              </div>
            ))}
          </div>

          {/* Quest list */}
          <div>
            <div className="text-[9px] font-mono text-white/15 uppercase tracking-widest mb-2">
              Active Quests
            </div>
            <div className="space-y-1.5">
              {QUESTS.map((q, i) => (
                <motion.div
                  key={i}
                  animate={
                    completedIdx === i
                      ? { backgroundColor: "rgba(34,197,94,0.08)", borderColor: "rgba(34,197,94,0.3)" }
                      : { backgroundColor: q.done ? "rgba(34,197,94,0.03)" : "rgba(255,255,255,0.012)", borderColor: q.done ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.04)" }
                  }
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg border"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  style={{ transitionProperty: "background-color, border-color" }}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded flex-shrink-0 flex items-center justify-center text-[9px] font-bold transition-all ${
                      q.done ? "bg-emerald-500 text-black" : "border border-white/15"
                    }`}
                  >
                    {q.done ? "✓" : ""}
                  </div>
                  <span
                    className={`flex-1 text-[10px] font-mono truncate transition-all ${
                      q.done ? "text-white/18 line-through" : "text-white/55"
                    }`}
                  >
                    {q.title}
                  </span>
                  <span
                    className="text-[9px] font-mono px-1.5 py-0.5 rounded shrink-0"
                    style={{ color: "#a78bfa", background: "rgba(167,139,250,0.08)" }}
                  >
                    {q.tag}
                  </span>
                  <span className="text-[9px] font-mono text-yellow-400/45 shrink-0 hidden md:block">
                    +{q.xp}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Hero component ──────────────────────────────────────────────────────
const Hero = () => {
  const { scrollY } = useScroll();
  const containerRef = useRef<HTMLElement>(null);

  // Parallax transforms
  const previewY     = useTransform(scrollY, [0, 700], [0, 90]);
  const heroOpacity  = useTransform(scrollY, [0, 520], [1, 0]);
  const orbScale     = useTransform(scrollY, [0, 600], [1, 1.18]);

  // Mouse-follow radial light
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = containerRef.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    mouseX.set((e.clientX - left) / width);
    mouseY.set((e.clientY - top) / height);
  }, [mouseX, mouseY]);

  // Boot sequence state
  const [booted, setBooted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setBooted(true), 200);
    return () => clearTimeout(t);
  }, []);

  // Headline gradient animation
  const [gradientAngle, setGradientAngle] = useState(135);
  useEffect(() => {
    let frame: number;
    let t = 0;
    const animate = () => {
      t += 0.003;
      setGradientAngle(135 + Math.sin(t) * 25);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex flex-col overflow-hidden select-none"
      style={{ background: "linear-gradient(180deg, #05010a 0%, #0b0618 45%, #140a2a 100%)" }}
    >
      {/* ── Layer 0: noise grain texture (CSS-only) ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          opacity: 0.022,
          mixBlendMode: "overlay",
          zIndex: 0,
        }}
      />

      {/* ── Layer 1: starfield ── */}
      <div style={{ zIndex: 1 }} className="absolute inset-0">
        <Starfield />
      </div>

      {/* ── Layer 2: orbit rings ── */}
      <div style={{ zIndex: 2 }} className="absolute inset-0">
        <OrbitRings />
      </div>

      {/* ── Layer 3: atmospheric orb system ── */}
      <motion.div
        style={{ scale: orbScale, zIndex: 3 }}
        className="absolute inset-x-0 top-0 pointer-events-none flex justify-center"
      >
        {/* Deep outer halo */}
        <div
          className="absolute left-1/2 -translate-x-1/2 rounded-full"
          style={{
            top: "-140px",
            width: "1300px", height: "650px",
            background: "radial-gradient(ellipse at 50% 28%, rgba(109,40,217,0.5) 0%, rgba(76,29,149,0.18) 40%, transparent 68%)",
            filter: "blur(70px)",
          }}
        />
        {/* Mid orb — primary glow */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 rounded-full"
          style={{ top: "-60px", width: "600px", height: "380px", filter: "blur(44px)" }}
          animate={{
            background: [
              "radial-gradient(ellipse at 50% 40%, rgba(192,132,252,0.52) 0%, rgba(139,92,246,0.22) 45%, transparent 70%)",
              "radial-gradient(ellipse at 50% 40%, rgba(139,92,246,0.6) 0%, rgba(192,132,252,0.2) 45%, transparent 70%)",
              "radial-gradient(ellipse at 50% 40%, rgba(192,132,252,0.52) 0%, rgba(139,92,246,0.22) 45%, transparent 70%)",
            ],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Bright inner core */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 rounded-full"
          style={{ top: "-20px", width: "260px", height: "200px" }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-full h-full rounded-full"
            style={{
              background: "radial-gradient(ellipse at 50% 50%, rgba(245,208,254,0.7) 0%, rgba(192,132,252,0.4) 35%, transparent 65%)",
              filter: "blur(22px)",
            }}
          />
        </motion.div>
        {/* Horizon rim line */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2"
          style={{ top: "180px", width: "500px", height: "1px" }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.9, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="w-full h-full"
            style={{ background: "linear-gradient(90deg, transparent 0%, rgba(216,180,254,0.55) 40%, rgba(139,92,246,0.8) 50%, rgba(216,180,254,0.55) 60%, transparent 100%)" }}
          />
        </motion.div>
      </motion.div>

      {/* ── Layer 4: perspective grid ── */}
      <div style={{ zIndex: 4 }} className="absolute inset-0">
        <HorizonGrid />
      </div>

      {/* ── Layer 5: mouse-follow radial light ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 5,
          background: useTransform(
            [springX, springY],
            ([x, y]: number[]) =>
              `radial-gradient(600px circle at ${x * 100}% ${y * 100}%, rgba(139,92,246,0.06) 0%, transparent 60%)`
          ),
        }}
      />

      {/* ── Layer 6: vignette ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 6,
          background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(5,1,10,0.75) 100%)",
        }}
      />

      {/* ── Layer 7: floating XP badges ── */}
      <div style={{ zIndex: 7 }} className="absolute inset-0">
        <FloatingBadges />
      </div>

      {/* Gradient fades */}
      <div className="absolute inset-x-0 top-[300px] h-48 pointer-events-none"
        style={{ zIndex: 8, background: "linear-gradient(to bottom, transparent, #0b0618)" }} />
      <div className="absolute inset-x-0 bottom-0 h-36 pointer-events-none"
        style={{ zIndex: 8, background: "linear-gradient(to top, #05010a, transparent)" }} />

      {/* ── Layer 9: boot init lines (top-left) ── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="absolute top-20 left-6 hidden lg:block pointer-events-none font-mono text-[10px] space-y-0.5"
        style={{ zIndex: 9, color: "rgba(139,92,246,0.35)" }}
      >
        <div><BootLine text="KYZEN OS v2.1.0 — initializing..." delay={300} /></div>
        <div><BootLine text="► Loading quest engine............. OK" delay={1100} /></div>
        <div><BootLine text="► XP ledger synced................. OK" delay={1900} /></div>
        <div><BootLine text="► Guild network connected........... OK" delay={2700} /></div>
      </motion.div>

      {/* ── Layer 9: system status (top-right) ── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
        className="absolute top-20 right-6 hidden lg:flex flex-col items-end gap-1 pointer-events-none"
        style={{ zIndex: 9 }}
      >
        {[
          { label: "UPTIME",  value: "99.98%", color: "#22c55e" },
          { label: "LATENCY", value: "12ms",   color: "#06b6d4" },
          { label: "SYNC",    value: "LIVE",   color: "#a78bfa"  },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-2 font-mono text-[10px]">
            <span style={{ color: "rgba(255,255,255,0.2)" }}>{s.label}</span>
            <span className="font-bold" style={{ color: s.color }}>{s.value}</span>
          </div>
        ))}
      </motion.div>

      {/* ── FOREGROUND: hero content ── */}
      <motion.div
        style={{ opacity: heroOpacity, zIndex: 10 }}
        className="relative flex flex-col items-center text-center w-full px-6 pt-32 pb-0"
      >
        {/* Badge pill */}
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[11px] font-mono tracking-[0.2em] mb-8 uppercase"
          style={{
            borderColor: "rgba(139,92,246,0.3)",
            background: "rgba(139,92,246,0.08)",
            color: "rgba(192,132,252,0.9)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 0 24px rgba(139,92,246,0.15), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          <motion.span
            className="w-1.5 h-1.5 rounded-full bg-purple-400"
            animate={{ opacity: [1, 0.25, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          ⚡ Season 01 · System Online
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="font-black tracking-tight leading-[1.03] mb-5 max-w-[740px]"
          style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(2.5rem, 6.5vw, 4.8rem)" }}
        >
          <span
            className="block"
            style={{ color: "#f5f3ff", textShadow: "0 0 80px rgba(139,92,246,0.2)" }}
          >
            Turn Your Life Into a
          </span>
          <span
            className="block bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(${gradientAngle}deg, #ddd6fe 0%, #a78bfa 38%, #e879f9 72%, #c084fc 100%)`,
              filter: "drop-shadow(0 0 28px rgba(168,85,247,0.45))",
            }}
          >
            Game Engine.
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.44 }}
          className="max-w-[460px] mx-auto mb-10 font-light leading-relaxed tracking-wide"
          style={{ fontSize: "clamp(0.9rem, 2vw, 1.05rem)", color: "#a1a1aa" }}
        >
          Accept quests, earn XP from every commit and focus session, level your skills, and forge a developer identity that compounds.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.56 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8"
        >
          <motion.button
            whileHover={{
              scale: 1.06,
              boxShadow: "0 0 60px rgba(139,92,246,0.65), 0 0 120px rgba(139,92,246,0.25)",
            }}
            whileTap={{ scale: 0.97 }}
            className="relative px-9 py-3.5 rounded-xl font-bold text-[11px] tracking-widest uppercase text-white overflow-hidden transition-all"
            style={{
              background: "linear-gradient(135deg, #6d28d9 0%, #8b5cf6 50%, #a855f7 80%, #c026d3 100%)",
              boxShadow: "0 0 32px rgba(139,92,246,0.45), inset 0 1px 0 rgba(255,255,255,0.15)",
            }}
          >
            {/* Button shimmer */}
            <motion.span
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{
                background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)",
                backgroundSize: "200% 100%",
              }}
              animate={{ backgroundPosition: ["200% 0%", "-200% 0%"] }}
              transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
            />
            Initialize Character
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03, borderColor: "rgba(255,255,255,0.22)" }}
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl border border-white/10 text-[11px] tracking-widest uppercase transition-all"
            style={{
              color: "rgba(161,161,170,0.8)",
              backdropFilter: "blur(12px)",
              background: "rgba(255,255,255,0.025)",
            }}
          >
            <span
              className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center shrink-0"
            >
              <span
                className="w-0 h-0 ml-0.5"
                style={{
                  borderTop: "4px solid transparent",
                  borderBottom: "4px solid transparent",
                  borderLeft: "6px solid rgba(255,255,255,0.5)",
                }}
              />
            </span>
            Watch Demo
          </motion.button>
        </motion.div>

        {/* Live stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.72, duration: 0.6 }}
          className="flex items-center gap-0 mb-12 rounded-2xl border border-white/[0.06] overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.02)",
            backdropFilter: "blur(16px)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          {LIVE_STATS.map((s, i) => (
            <div
              key={s.label}
              className={`flex items-center gap-2.5 px-5 py-2.5 ${i < LIVE_STATS.length - 1 ? "border-r border-white/[0.06]" : ""}`}
            >
              <motion.span
                className="text-sm"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2 + i * 0.4, repeat: Infinity }}
                style={{ color: s.accent }}
              >
                {s.icon}
              </motion.span>
              <div>
                <div className="text-[9px] font-mono text-white/25 tracking-widest uppercase mb-0.5">{s.label}</div>
                <div className="font-black text-xs" style={{ color: s.accent, fontFamily: "'Syne',sans-serif" }}>
                  {s.label === "XP/hr" ? <XpTicker base={2840} /> : s.value}
                </div>
              </div>
            </div>
          ))}
          {/* Trust avatars */}
          <div className="flex items-center gap-2.5 px-5 py-2.5 border-l border-white/[0.06]">
            <div className="flex -space-x-1.5">
              {["#7c3aed","#6366f1","#a855f7","#8b5cf6","#c026d3"].map((c, i) => (
                <div
                  key={i}
                  className="w-5 h-5 rounded-full border border-[#05010a] flex items-center justify-center text-[7px] text-white/70 font-bold"
                  style={{ background: `linear-gradient(135deg, ${c}bb, ${c})` }}
                >
                  {["M","K","A","J","R"][i]}
                </div>
              ))}
            </div>
            <span className="text-[9px] font-mono text-white/25 tracking-wide whitespace-nowrap">31,420+ devs</span>
          </div>
        </motion.div>

        {/* ── Dashboard preview ── */}
        <motion.div
          style={{ y: previewY }}
          className="relative w-full max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 60, rotateX: 6 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Depth glow behind card */}
          <div
            className="absolute pointer-events-none"
            style={{
              inset: "-32px",
              background: "radial-gradient(ellipse at 50% 0%, rgba(109,40,217,0.4) 0%, rgba(76,29,149,0.12) 50%, transparent 70%)",
              filter: "blur(32px)",
            }}
          />
          {/* Secondary side glows */}
          <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-32 h-64 pointer-events-none"
            style={{ background: "radial-gradient(ellipse, rgba(139,92,246,0.15), transparent 70%)", filter: "blur(20px)" }} />
          <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-32 h-64 pointer-events-none"
            style={{ background: "radial-gradient(ellipse, rgba(192,132,252,0.12), transparent 70%)", filter: "blur(20px)" }} />

          {/* Float animation wrapper */}
          <motion.div
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <DashboardPreview />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        style={{ zIndex: 11 }}
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <div
            className="w-5 h-8 rounded-full border border-white/10 flex items-start justify-center pt-1.5"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <div className="w-1 h-2 rounded-full" style={{ background: "rgba(139,92,246,0.6)" }} />
          </div>
        </motion.div>
      </motion.div>

      {/* Global styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=JetBrains+Mono:wght@300;400;700&display=swap');
      `}</style>
    </section>
  );
};

export default Hero;