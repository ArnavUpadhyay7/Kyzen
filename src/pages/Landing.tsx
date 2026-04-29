import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";

// ─── Shared helpers ───────────────────────────────────────────────────────────
const GlowOrb = ({ className }: { className: string }) => (
  <div className={`absolute rounded-full blur-[120px] pointer-events-none select-none ${className}`} />
);

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as any },
});

// ─── Data ─────────────────────────────────────────────────────────────────────
const STATS = [
  { label: "Focus",      value: 87, color: "#a78bfa" },
  { label: "Discipline", value: 74, color: "#818cf8" },
  { label: "Output",     value: 92, color: "#c084fc" },
  { label: "Recovery",   value: 61, color: "#7dd3fc" },
];

const QUESTS = [
  { title: "Ship feature branch before 18:00", xp: 450, done: true,  tag: "DEV"   },
  { title: "30-min deep work session",         xp: 200, done: true,  tag: "FOCUS" },
  { title: "Solve 2 LeetCode mediums",         xp: 300, done: false, tag: "DSA"   },
  { title: "Push daily commit streak",         xp: 150, done: false, tag: "HABIT" },
];

const SKILLS = [
  { name: "TypeScript",    level: 8, max: 10, color: "#818cf8" },
  { name: "System Design", level: 6, max: 10, color: "#a78bfa" },
  { name: "Focus Mode",    level: 9, max: 10, color: "#c084fc" },
  { name: "Consistency",   level: 7, max: 10, color: "#7dd3fc" },
  { name: "Deep Work",     level: 5, max: 10, color: "#f0abfc" },
];

const RANKS = [
  { name: "INITIATE",  tier: "I",   color: "#64748b", glow: "rgba(100,116,139,0.3)" },
  { name: "CODER",     tier: "II",  color: "#6366f1", glow: "rgba(99,102,241,0.4)"  },
  { name: "ARCHITECT", tier: "III", color: "#8b5cf6", glow: "rgba(139,92,246,0.5)"  },
  { name: "SENTINEL",  tier: "IV",  color: "#a855f7", glow: "rgba(168,85,247,0.6)"  },
  { name: "KYZEN",     tier: "V",   color: "#e879f9", glow: "rgba(232,121,249,0.7)" },
];

const COMMITS = [4,7,2,9,5,12,8,3,11,6,9,14,7,5,10,13,8,6,11,15,9,7,12,10,4,8,13,6,11,9];

// ─── Reusable sub-components ──────────────────────────────────────────────────
const AnimatedBar = ({ value, color, delay }: { value: number; color: string; delay: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="h-1.5 bg-white/5 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={inView ? { width: `${value}%` } : {}}
        transition={{ duration: 1.2, delay, ease: "easeOut" }}
        className="h-full rounded-full"
        style={{ background: `linear-gradient(90deg,${color}88,${color})` }}
      />
    </div>
  );
};

const SkillRow = ({ skill, delay }: { skill: typeof SKILLS[0]; delay: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="flex items-center gap-3">
      <span className="text-[11px] text-white/40 font-mono tracking-wide w-28 truncate">{skill.name}</span>
      <div className="flex gap-[3px] flex-1">
        {Array.from({ length: skill.max }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scaleY: 0.3 }}
            animate={inView ? { opacity: 1, scaleY: 1 } : {}}
            transition={{ delay: delay + i * 0.05, duration: 0.3 }}
            className="flex-1 h-2 rounded-[2px]"
            style={{
              background: i < skill.level
                ? `linear-gradient(90deg,${skill.color}88,${skill.color})`
                : "rgba(255,255,255,0.05)",
              boxShadow: i < skill.level ? `0 0 6px ${skill.color}55` : "none",
            }}
          />
        ))}
      </div>
      <span className="text-[11px] font-mono w-4 text-right" style={{ color: skill.color }}>{skill.level}</span>
    </div>
  );
};

// ─── Network node SVG ─────────────────────────────────────────────────────────
const NetworkViz = () => {
  const nodes = [
    { cx: 100, cy: 90,  r: 22, icon: "⚡", color: "#a855f7" },
    { cx: 30,  cy: 40,  r: 14, icon: "📦", color: "#818cf8" },
    { cx: 170, cy: 40,  r: 14, icon: "🔮", color: "#c084fc" },
    { cx: 170, cy: 140, r: 14, icon: "⚔",  color: "#7dd3fc" },
    { cx: 30,  cy: 140, r: 14, icon: "🏆", color: "#e879f9" },
  ];
  const lines = [[0,1],[0,2],[0,3],[0,4]] as const;
  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 200 180" className="w-full max-w-[200px]">
        {lines.map(([a, b], i) => (
          <motion.line
            key={i}
            x1={nodes[a].cx} y1={nodes[a].cy}
            x2={nodes[b].cx} y2={nodes[b].cy}
            stroke={nodes[b].color} strokeOpacity="0.4" strokeWidth="1" strokeDasharray="4 4"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 + i * 0.15 }}
          />
        ))}
        {nodes.map((n, i) => (
          <motion.g key={i}
            initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.1 }}
            style={{ transformOrigin: `${n.cx}px ${n.cy}px` }}>
            <circle cx={n.cx} cy={n.cy} r={n.r} fill={`${n.color}20`} stroke={n.color} strokeOpacity="0.6" strokeWidth="1" />
            <circle cx={n.cx} cy={n.cy} r={n.r * 0.55} fill={`${n.color}40`} />
            <text x={n.cx} y={n.cy + 5} textAnchor="middle" fontSize={i === 0 ? 12 : 9} fill="white">{n.icon}</text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
};

// ─── Streak calendar ──────────────────────────────────────────────────────────
const StreakViz = () => {
  const weeks = 8;
  const days = 7;
  const data = useRef(Array.from({ length: weeks * days }, () => Math.random())).current;
  return (
    <div className="grid gap-[3px]" style={{ gridTemplateColumns: `repeat(${weeks},1fr)` }}>
      {Array.from({ length: weeks }).map((_, w) => (
        <div key={w} className="flex flex-col gap-[3px]">
          {Array.from({ length: days }).map((_, d) => {
            const v = data[w * days + d];
            return (
              <motion.div
                key={d}
                initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: 0.3 + (w * days + d) * 0.007 }}
                className="w-full aspect-square rounded-[2px]"
                style={{
                  background: v > 0.7 ? "rgba(168,85,247,0.9)"
                    : v > 0.4 ? "rgba(139,92,246,0.5)"
                    : v > 0.15 ? "rgba(99,102,241,0.25)"
                    : "rgba(255,255,255,0.04)",
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

// ─── Bento Card wrapper ───────────────────────────────────────────────────────
const BentoCard = ({
  children, className = "", delay = 0, glowColor = "rgba(139,92,246,0.08)",
}: {
  children: React.ReactNode; className?: string; delay?: number; glowColor?: string;
}) => (
  <motion.div
    {...fadeUp(delay)}
    whileHover={{ scale: 1.015, y: -4 }}
    transition={{ type: "spring", stiffness: 280, damping: 28 }}
    className={`relative rounded-3xl border border-white/8 overflow-hidden p-6 flex flex-col ${className}`}
    style={{ background: "rgba(8,6,20,0.72)", backdropFilter: "blur(24px)" }}
  >
    <div className="absolute inset-0 pointer-events-none"
      style={{ background: `radial-gradient(ellipse at 30% 0%, ${glowColor}, transparent 60%)` }} />
    {children}
  </motion.div>
);

// ─── NAV ──────────────────────────────────────────────────────────────────────
const Nav = () => {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const u = scrollY.on("change", v => setScrolled(v > 50));
    return u;
  }, [scrollY]);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 inset-x-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(2,2,12,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(24px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "none",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="text-white font-black text-lg tracking-widest" style={{ fontFamily: "'Syne',sans-serif" }}>
          KYZEN<span className="text-purple-500">.</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {["Product","Ranks","Guilds","Changelog"].map(l => (
            <a key={l} href="#" className="text-white/40 text-[11px] font-mono tracking-widest uppercase hover:text-white/80 transition-colors">{l}</a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button className="text-white/40 text-[11px] font-mono tracking-widest uppercase hover:text-white/80 transition-colors">Login</button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
            className="px-4 py-2 rounded-lg text-white text-[11px] font-bold tracking-widest uppercase"
            style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)" }}>
            Start Free
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};

// ─── HERO — Full bleed image, Reflect-style ───────────────────────────────────
const Hero = () => {
  const { scrollY } = useScroll();
  const imgScale = useTransform(scrollY, [0, 600], [1, 1.08]);
  const imgOpacity = useTransform(scrollY, [0, 500], [1, 0.3]);
  const contentOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const contentY = useTransform(scrollY, [0, 400], [0, -40]);
  const [xp, setXp] = useState(3240);

  useEffect(() => {
    const id = setInterval(() => setXp(v => v + Math.floor(Math.random() * 3)), 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-[#05030f]">

      {/* Black hole image — fills the section */}
      <motion.div
        style={{ scale: imgScale, opacity: imgOpacity }}
        className="absolute inset-0 flex items-center justify-center"
      >
      </motion.div>

      {/* Very subtle top gradient to let nav breathe */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#05030f] to-transparent pointer-events-none" />

      {/* Bottom fade — pulls image into content below */}
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#02020c] to-transparent pointer-events-none" />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div key={i} className="absolute w-px h-px bg-white rounded-full"
            style={{ top:`${Math.random()*100}%`, left:`${Math.random()*100}%`, opacity: Math.random()*0.3+0.05 }}
            animate={{ opacity: [null, 0.05, 0.5] }}
            transition={{ duration: 2+Math.random()*5, repeat: Infinity, repeatType: "reverse", delay: Math.random()*6 }} />
        ))}
      </div>

      {/* Hero copy — sits above the image center */}
      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-10 flex flex-col items-center text-center px-6"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-[11px] font-mono tracking-[0.2em] mb-8 uppercase"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          Season 01 · Now Live
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] mb-5"
          style={{ fontFamily: "'Syne',sans-serif" }}
        >
          <span className="block text-white">Your Life.</span>
          <span className="block bg-gradient-to-r from-violet-300 via-purple-300 to-fuchsia-300 bg-clip-text text-transparent">
            Leveled Up.
          </span>
        </motion.h1>

        {/* Subline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-white/40 text-base max-w-sm mx-auto mb-10 font-light tracking-wide leading-relaxed"
        >
          Turn your developer journey into an RPG. Earn XP, complete quests, master skills, build your legend.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.62 }}
          className="flex flex-col sm:flex-row gap-3 items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="px-7 py-3 rounded-xl font-bold text-[11px] tracking-widest uppercase text-white"
            style={{
              background: "linear-gradient(135deg,#7c3aed,#a855f7,#c026d3)",
              boxShadow: "0 0 40px rgba(168,85,247,0.35)",
            }}
          >
            Enter the World
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            className="px-7 py-3 rounded-xl border border-white/10 text-white/40 text-[11px] tracking-widest uppercase hover:border-purple-500/30 hover:text-white/70 transition-all"
          >
            Watch Demo
          </motion.button>
        </motion.div>

        {/* Live XP counter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/3 border border-white/8"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white/30 text-[11px] font-mono tracking-widest">XP THIS SESSION</span>
          <AnimatePresence mode="wait">
            <motion.span key={xp} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 8, opacity: 0 }}
              className="text-emerald-400 text-[11px] font-mono font-bold">
              +{xp.toLocaleString()}
            </motion.span>
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border border-white/15 flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 bg-white/30 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
};

// ─── LIFE RPG — BENTO GRID ────────────────────────────────────────────────────
const LifeRPG = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end","end start"] });
  const headerY = useTransform(scrollYProgress, [0,0.3], [60,0]);
  const headerOpacity = useTransform(scrollYProgress, [0,0.25], [0,1]);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex flex-col justify-center py-24 overflow-hidden bg-[#02020c]">
      <GlowOrb className="w-[700px] h-[400px] bg-violet-900/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      <GlowOrb className="w-[300px] h-[300px] bg-purple-800/15 top-0 right-0" />
      <GlowOrb className="w-[250px] h-[250px] bg-indigo-900/15 bottom-0 left-0" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
        <motion.div style={{ y: headerY, opacity: headerOpacity }} className="text-center mb-14">
          <div className="text-purple-400/60 text-[11px] font-mono tracking-[0.3em] uppercase mb-4">01 · Game Mechanics</div>
          <h2 className="text-5xl md:text-6xl font-black text-white leading-tight" style={{ fontFamily:"'Syne',sans-serif" }}>
            Life as an{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">RPG</span>
          </h2>
          <p className="text-white/30 mt-4 max-w-lg mx-auto text-sm">
            Your habits, goals, and work sessions converted into game mechanics. Progress isn't abstract — it's measurable.
          </p>
        </motion.div>

        <div className="grid grid-cols-12 gap-4 auto-rows-auto">
          <BentoCard delay={0.1} glowColor="rgba(139,92,246,0.14)" className="col-span-12 md:col-span-4 row-span-2">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-[11px] text-purple-400/60 font-mono tracking-[0.2em] uppercase mb-1">Daily XP</div>
                <div className="text-3xl font-black text-white" style={{ fontFamily:"'Syne',sans-serif" }}>⚡ Experience</div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[10px] font-mono tracking-widest">ACTIVE</span>
            </div>
            <p className="text-white/30 text-xs leading-relaxed mb-5">Every commit, focus session, and completed task earns XP. Your effort is never invisible.</p>
            <div className="space-y-3 mb-5">
              {STATS.map((s, i) => (
                <div key={s.label} className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-white/40 tracking-widest uppercase">{s.label}</span>
                    <span style={{ color: s.color }} className="font-bold">{s.value}</span>
                  </div>
                  <AnimatedBar value={s.value} color={s.color} delay={0.2 + i * 0.1} />
                </div>
              ))}
            </div>
            <div className="mt-auto space-y-3">
              <div>
                <div className="text-[10px] font-mono text-white/30 mb-1.5 flex justify-between">
                  <span>LVL 42</span><span>14,320 / 18,000 XP</span>
                </div>
                <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div initial={{ width:0 }} whileInView={{ width:"79%" }} viewport={{ once:true }}
                    transition={{ duration:1.5, delay:0.4, ease:"easeOut" }}
                    className="h-full rounded-full"
                    style={{ background:"linear-gradient(90deg,#7c3aed,#a855f7,#e879f9)", boxShadow:"0 0 12px rgba(168,85,247,0.5)" }} />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-center">
                  <div className="text-[10px] text-orange-400/60 font-mono uppercase mb-0.5">Streak</div>
                  <div className="text-xl font-black text-orange-400">34🔥</div>
                </div>
                <div className="flex-1 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                  <div className="text-[10px] text-emerald-400/60 font-mono uppercase mb-0.5">Done</div>
                  <div className="text-xl font-black text-emerald-400">12✓</div>
                </div>
              </div>
            </div>
          </BentoCard>

          <BentoCard delay={0.2} glowColor="rgba(99,102,241,0.1)" className="col-span-12 md:col-span-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-[11px] text-indigo-400/60 font-mono tracking-[0.2em] uppercase mb-1">Quest System</div>
                <div className="text-2xl font-black text-white" style={{ fontFamily:"'Syne',sans-serif" }}>🏹 Quests</div>
              </div>
            </div>
            <p className="text-white/30 text-xs leading-relaxed mb-4">Auto-generated quests based on your GitHub activity, calendar, and goals.</p>
            <div className="space-y-2">
              {QUESTS.map((q, i) => (
                <motion.div key={i} initial={{ opacity:0,x:-10 }} whileInView={{ opacity:1,x:0 }} viewport={{ once:true }}
                  transition={{ delay:0.3+i*0.08 }}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${q.done ? "border-emerald-500/20 bg-emerald-500/5" : "border-white/5 bg-white/2"}`}>
                  <div className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] flex-shrink-0 font-bold ${q.done ? "bg-emerald-500 text-black" : "border border-white/20"}`}>
                    {q.done ? "✓" : ""}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs truncate ${q.done ? "text-white/25 line-through" : "text-white/75"}`}>{q.title}</div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ color:"#a78bfa", background:"rgba(167,139,250,0.1)" }}>{q.tag}</span>
                    <span className="text-[10px] font-mono text-yellow-400/70 whitespace-nowrap">+{q.xp}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </BentoCard>

          <BentoCard delay={0.3} glowColor="rgba(249,115,22,0.08)" className="col-span-12 md:col-span-3">
            <div className="mb-3">
              <div className="text-[11px] text-orange-400/60 font-mono tracking-[0.2em] uppercase mb-1">Streak Engine</div>
              <div className="text-2xl font-black text-white" style={{ fontFamily:"'Syne',sans-serif" }}>🔥 Streaks</div>
            </div>
            <p className="text-white/30 text-[11px] leading-relaxed mb-4">Maintain momentum chains. Break one and your score drops.</p>
            <div className="flex-1 mb-4"><StreakViz /></div>
            <div className="text-center pt-2 border-t border-white/5">
              <div className="text-3xl font-black text-orange-400">34</div>
              <div className="text-[10px] text-orange-400/50 font-mono uppercase tracking-wider">day streak</div>
            </div>
          </BentoCard>

          <BentoCard delay={0.15} glowColor="rgba(192,132,252,0.1)" className="col-span-12 md:col-span-5">
            <div className="mb-4">
              <div className="text-[11px] text-purple-400/60 font-mono tracking-[0.2em] uppercase mb-1">Skill Trees</div>
              <div className="text-2xl font-black text-white" style={{ fontFamily:"'Syne',sans-serif" }}>🧠 Mastery</div>
            </div>
            <p className="text-white/30 text-xs leading-relaxed mb-6">Unlock branches in DSA, System Design, Deep Work. Your growth, mapped visually.</p>
            <div className="space-y-3 mt-auto">
              {SKILLS.map((s, i) => <SkillRow key={i} skill={s} delay={0.2 + i * 0.07} />)}
            </div>
          </BentoCard>

          <BentoCard delay={0.35} glowColor="rgba(99,102,241,0.12)" className="col-span-12 md:col-span-3">
            <div className="mb-3">
              <div className="text-[11px] text-indigo-400/60 font-mono tracking-[0.2em] uppercase mb-1">Guild Network</div>
              <div className="text-2xl font-black text-white" style={{ fontFamily:"'Syne',sans-serif" }}>⚔ Social</div>
            </div>
            <p className="text-white/30 text-[11px] leading-relaxed mb-3">Form parties, compete in weekly wars, share quests with your guild.</p>
            <div className="flex-1 flex items-center justify-center min-h-[140px]"><NetworkViz /></div>
          </BentoCard>
        </div>
      </div>
    </section>
  );
};

// ─── DEV DASHBOARD ────────────────────────────────────────────────────────────
const DevDashboard = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end","end start"] });
  const leftX = useTransform(scrollYProgress, [0.1,0.4], [-60,0]);
  const rightX = useTransform(scrollYProgress, [0.1,0.4], [60,0]);
  const opacity = useTransform(scrollYProgress, [0.1,0.35], [0,1]);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center py-24 overflow-hidden bg-[#030308]">
      <GlowOrb className="w-[600px] h-[600px] bg-indigo-900/20 top-0 right-0" />
      <GlowOrb className="w-[400px] h-[400px] bg-purple-900/15 bottom-0 left-0" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div style={{ x: leftX, opacity }}>
            <div className="text-purple-400/60 text-[11px] font-mono tracking-[0.3em] uppercase mb-4">02 · Analytics</div>
            <h2 className="text-5xl font-black text-white leading-tight mb-6" style={{ fontFamily:"'Syne',sans-serif" }}>
              Your code,<br />
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">quantified.</span>
            </h2>
            <p className="text-white/30 mb-8 leading-relaxed text-sm">Connect GitHub, LeetCode, and WakaTime. Kyzen translates your engineering output into real XP and rank progression.</p>
            <div className="space-y-3">
              {[
                { label:"GitHub Commits",   count:"1,284", badge:"SYNCED",  color:"#34d399" },
                { label:"LeetCode Problems",count:"347",   badge:"TRACKED", color:"#818cf8" },
                { label:"Focus Hours",      count:"892h",  badge:"LIVE",    color:"#a78bfa" },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity:0,x:-20 }} whileInView={{ opacity:1,x:0 }} viewport={{ once:true }}
                  transition={{ delay:0.2+i*0.1 }}
                  className="flex items-center justify-between p-4 rounded-2xl border border-white/6 bg-white/2 hover:border-purple-500/20 transition-colors">
                  <span className="text-white/60 text-sm">{item.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-white font-bold font-mono">{item.count}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                      style={{ color:item.color, background:`${item.color}15` }}>{item.badge}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div style={{ x: rightX, opacity }}>
            <div className="rounded-2xl border border-white/8 overflow-hidden"
              style={{ background:"rgba(8,6,18,0.9)", backdropFilter:"blur(20px)", boxShadow:"0 0 60px rgba(99,102,241,0.1)" }}>
              <div className="p-4 border-b border-white/5 flex items-center gap-2">
                {["#ff5f57","#febc2e","#28c840"].map(c => <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background:c }} />)}
                <div className="text-[10px] text-white/20 font-mono tracking-widest ml-2">COMMIT ACTIVITY · 2024</div>
              </div>
              <div className="p-5">
                <div className="flex gap-1 flex-wrap mb-6">
                  {COMMITS.map((val, i) => (
                    <motion.div key={i} initial={{ opacity:0,scale:0 }} whileInView={{ opacity:1,scale:1 }} viewport={{ once:true }}
                      transition={{ delay:0.1+i*0.025 }}
                      className="w-5 h-5 rounded-sm"
                      style={{ background: val===0 ? "rgba(255,255,255,0.03)" : val<5 ? "rgba(99,102,241,0.3)" : val<9 ? "rgba(139,92,246,0.55)" : "rgba(168,85,247,0.85)" }} />
                  ))}
                </div>
                <div className="text-[10px] text-white/20 font-mono tracking-widest uppercase mb-3">Language Breakdown</div>
                <div className="space-y-2">
                  {[
                    { lang:"TypeScript", pct:58, color:"#818cf8" },
                    { lang:"Python",     pct:24, color:"#a78bfa" },
                    { lang:"Rust",       pct:12, color:"#c084fc" },
                    { lang:"Other",      pct:6,  color:"rgba(255,255,255,0.15)" },
                  ].map((l, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background:l.color }} />
                      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width:0 }} whileInView={{ width:`${l.pct}%` }} viewport={{ once:true }}
                          transition={{ duration:1, delay:0.4+i*0.1, ease:"easeOut" }}
                          className="h-full rounded-full" style={{ background:l.color }} />
                      </div>
                      <span className="text-white/30 text-[10px] font-mono w-7 text-right">{l.pct}%</span>
                      <span className="text-white/40 text-[11px] w-20">{l.lang}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ─── PROGRESSION ──────────────────────────────────────────────────────────────
const Progression = () => {
  const [activeRank, setActiveRank] = useState(3);
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end","end start"] });
  const y = useTransform(scrollYProgress, [0.1,0.5], [80,0]);
  const opacity = useTransform(scrollYProgress, [0.1,0.4], [0,1]);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center py-24 overflow-hidden bg-[#02020c]">
      <GlowOrb className="w-[700px] h-[400px] bg-purple-900/20 bottom-0 left-1/2 -translate-x-1/2" />
      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
        <motion.div style={{ y, opacity }} className="text-center mb-16">
          <div className="text-purple-400/60 text-[11px] font-mono tracking-[0.3em] uppercase mb-4">03 · Ranking</div>
          <h2 className="text-5xl md:text-6xl font-black text-white" style={{ fontFamily:"'Syne',sans-serif" }}>
            Earn Your{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Rank</span>
          </h2>
        </motion.div>

        <motion.div style={{ y, opacity }} className="flex justify-center gap-3 mb-14 flex-wrap">
          {RANKS.map((rank, i) => (
            <motion.button key={i} onClick={() => setActiveRank(i)} whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
              className="px-5 py-2.5 rounded-xl border text-[11px] font-mono tracking-widest uppercase transition-all duration-300"
              style={{
                borderColor: activeRank===i ? rank.color : "rgba(255,255,255,0.08)",
                color: activeRank===i ? rank.color : "rgba(255,255,255,0.3)",
                background: activeRank===i ? rank.glow : "transparent",
                boxShadow: activeRank===i ? `0 0 20px ${rank.glow}` : "none",
              }}>
              {rank.tier} · {rank.name}
            </motion.button>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div {...fadeUp(0.2)} className="p-6 rounded-3xl border border-white/8"
            style={{ background:"rgba(8,6,18,0.8)", backdropFilter:"blur(20px)" }}>
            <div className="text-[11px] text-white/20 font-mono tracking-widest uppercase mb-6">Skill Tree</div>
            <div className="space-y-4">
              {SKILLS.map((skill, i) => <SkillRow key={i} skill={skill} delay={0.3 + i * 0.07} />)}
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.3)} className="p-6 rounded-3xl border border-white/8"
            style={{ background:"rgba(8,6,18,0.8)", backdropFilter:"blur(20px)" }}>
            <div className="text-[11px] text-white/20 font-mono tracking-widest uppercase mb-6">Achievements</div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon:"🏆", name:"First Merge",    rare:"COMMON",    color:"#64748b" },
                { icon:"⚡", name:"Speed Coder",    rare:"RARE",      color:"#6366f1" },
                { icon:"🔥", name:"30-Day Flame",   rare:"EPIC",      color:"#a855f7" },
                { icon:"💎", name:"Deep Worker",    rare:"LEGENDARY", color:"#e879f9" },
                { icon:"🎯", name:"Zero Bug Day",   rare:"EPIC",      color:"#a855f7" },
                { icon:"🌌", name:"Midnight Coder", rare:"RARE",      color:"#6366f1" },
              ].map((ach, i) => (
                <motion.div key={i} initial={{ opacity:0,scale:0.8 }} whileInView={{ opacity:1,scale:1 }}
                  viewport={{ once:true }} transition={{ delay:0.4+i*0.07 }}
                  whileHover={{ scale:1.06,y:-3 }}
                  className="p-3 rounded-2xl border border-white/5 bg-white/2 cursor-pointer group relative overflow-hidden">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background:`radial-gradient(circle at 50% 0%,${ach.color}15,transparent 60%)` }} />
                  <div className="text-2xl mb-2">{ach.icon}</div>
                  <div className="text-white/70 text-[11px] font-bold leading-tight">{ach.name}</div>
                  <div className="text-[10px] font-mono mt-1 tracking-wider" style={{ color:ach.color }}>{ach.rare}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ─── GUILDS ───────────────────────────────────────────────────────────────────
const Guilds = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end","end start"] });
  const leftX = useTransform(scrollYProgress, [0.1,0.4], [-60,0]);
  const rightX = useTransform(scrollYProgress, [0.1,0.4], [60,0]);
  const opacity = useTransform(scrollYProgress, [0.1,0.35], [0,1]);

  const guilds = [
    { name:"Void Architects",  members:284, tag:"SYS_DESIGN", color:"#818cf8", rank:"#1" },
    { name:"Null Terminators",  members:197, tag:"BACKEND",    color:"#a78bfa", rank:"#2" },
    { name:"Recursive Monks",   members:156, tag:"DSA",        color:"#c084fc", rank:"#3" },
    { name:"Pixel Sorcerers",   members:134, tag:"FRONTEND",   color:"#7dd3fc", rank:"#4" },
  ];

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center py-24 overflow-hidden bg-[#030308]">
      <GlowOrb className="w-[600px] h-[500px] bg-violet-900/20 top-0 left-0" />
      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div style={{ x: leftX, opacity }}>
            <div className="text-purple-400/60 text-[11px] font-mono tracking-[0.3em] uppercase mb-4">04 · Social Layer</div>
            <h2 className="text-5xl font-black text-white leading-tight mb-6" style={{ fontFamily:"'Syne',sans-serif" }}>
              Join a<br />
              <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Guild.</span>
            </h2>
            <p className="text-white/30 mb-8 leading-relaxed text-sm">Form parties with other ambitious developers. Compete in weekly guild wars. Share quests, celebrate wins.</p>
            <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.97 }}
              className="px-6 py-3 rounded-xl border border-violet-500/40 text-violet-300 text-[11px] font-mono tracking-widest uppercase hover:bg-violet-500/10 transition-all">
              Browse Guilds →
            </motion.button>
          </motion.div>

          <motion.div style={{ x: rightX, opacity }} className="space-y-3">
            {guilds.map((guild, i) => (
              <motion.div key={i} initial={{ opacity:0,y:20 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }}
                transition={{ delay:0.2+i*0.1 }}
                whileHover={{ x:6, scale:1.01 }}
                className="flex items-center justify-between p-5 rounded-2xl border border-white/6 bg-white/2 cursor-pointer group transition-all hover:border-purple-500/20"
                style={{ borderLeftColor:guild.color, borderLeftWidth:2 }}>
                <div className="flex items-center gap-4">
                  <div className="text-xs font-mono text-white/20 w-6">{guild.rank}</div>
                  <div>
                    <div className="text-white font-bold text-sm">{guild.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                        style={{ color:guild.color, background:`${guild.color}15` }}>{guild.tag}</span>
                      <span className="text-white/30 text-[10px] font-mono">{guild.members} members</span>
                    </div>
                  </div>
                </div>
                <div className="text-white/20 group-hover:text-white/60 transition-colors">→</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ─── THEMES ───────────────────────────────────────────────────────────────────
const Themes = () => {
  const [active, setActive] = useState(0);
  const themes = [
    { name:"Void",       desc:"Dark purple. Your default ascension.", from:"#1e1b4b", to:"#0f0a23", accent:"#a78bfa" },
    { name:"Neon Tokyo", desc:"Cyberpunk cyan. For night grinders.",  from:"#083344", to:"#020617", accent:"#22d3ee" },
    { name:"Blood Moon", desc:"Crimson shadow. For the relentless.",  from:"#450a0a", to:"#0c0a09", accent:"#f43f5e" },
    { name:"Emerald",    desc:"Forest depths. For the patient ones.", from:"#052e16", to:"#020c07", accent:"#34d399" },
  ];
  const t = themes[active];

  return (
    <section className="relative min-h-screen flex items-center py-24 overflow-hidden bg-[#02020c]">
      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
        <motion.div {...fadeUp(0)} className="text-center mb-16">
          <div className="text-purple-400/60 text-[11px] font-mono tracking-[0.3em] uppercase mb-4">05 · Identity</div>
          <h2 className="text-5xl md:text-6xl font-black text-white" style={{ fontFamily:"'Syne',sans-serif" }}>
            Make it{" "}
            <span className="bg-gradient-to-r from-fuchsia-400 to-pink-400 bg-clip-text text-transparent">yours.</span>
          </h2>
          <p className="text-white/30 mt-4 max-w-lg mx-auto text-sm">Choose from premium themes that match your energy and grind style.</p>
        </motion.div>

        <div className="flex justify-center gap-3 mb-10 flex-wrap">
          {themes.map((th, i) => (
            <motion.button key={i} whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
              onClick={() => setActive(i)}
              className="px-4 py-2 rounded-xl border text-[11px] font-mono tracking-widest uppercase transition-all duration-300"
              style={{
                borderColor: active===i ? th.accent : "rgba(255,255,255,0.08)",
                color: active===i ? th.accent : "rgba(255,255,255,0.3)",
                background: active===i ? `${th.accent}15` : "transparent",
              }}>
              {th.name}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={active}
            initial={{ opacity:0, scale:0.97, y:10 }} animate={{ opacity:1, scale:1, y:0 }}
            exit={{ opacity:0, scale:0.97, y:-10 }}
            transition={{ duration:0.45, ease:[0.22,1,0.36,1] }}
            className="rounded-3xl border border-white/8 overflow-hidden"
            style={{ background:`linear-gradient(135deg,${t.from},${t.to})`, boxShadow:`0 0 80px ${t.accent}20` }}>
            <div className="p-4 border-b border-white/5 flex items-center gap-2">
              {["#ff5f57","#febc2e","#28c840"].map(c => <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background:c }} />)}
              <div className="flex-1 text-center text-[10px] font-mono tracking-widest text-white/20">
                KYZEN · {t.name.toUpperCase()} THEME
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4 mb-4">
                {[0,1,2].map(i => (
                  <div key={i} className="p-4 rounded-2xl bg-black/25 border border-white/5">
                    <div className="h-2 bg-white/10 rounded mb-3 w-3/4" />
                    <div className="h-12 rounded-xl mb-3" style={{ background:`${t.accent}20`, border:`1px solid ${t.accent}20` }} />
                    <div className="space-y-1.5">
                      {[100,66,44].map(w => (
                        <div key={w} className="h-1.5 rounded-full"
                          style={{ width:`${w}%`, background: i===0 ? `${t.accent}40` : "rgba(255,255,255,0.06)" }} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <span className="text-[11px] font-mono tracking-widest" style={{ color:t.accent }}>{t.desc}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

// ─── FINAL CTA ────────────────────────────────────────────────────────────────
const FinalCTA = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end","end start"] });
  const scale = useTransform(scrollYProgress, [0.1,0.5], [0.92,1]);
  const opacity = useTransform(scrollYProgress, [0.1,0.4], [0,1]);

  return (
    <footer ref={sectionRef} className="relative min-h-screen flex flex-col items-center justify-center py-40 overflow-hidden bg-[#030308]">
      <GlowOrb className="w-[900px] h-[600px] bg-purple-900/25 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div key={i} className="absolute w-px h-px bg-white rounded-full"
            style={{ top:`${Math.random()*100}%`, left:`${Math.random()*100}%`, opacity:Math.random()*0.4+0.1 }}
            animate={{ opacity:[null,0.05,0.5] }}
            transition={{ duration:3+Math.random()*4, repeat:Infinity, repeatType:"reverse", delay:Math.random()*5 }} />
        ))}
      </div>

      <motion.div style={{ scale, opacity }} className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div className="text-purple-400/60 text-[11px] font-mono tracking-[0.3em] uppercase mb-6">Your Journey Begins</div>
        <h2 className="text-6xl md:text-8xl font-black text-white leading-none mb-8" style={{ fontFamily:"'Syne',sans-serif" }}>
          Ready to<br />
          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">level up?</span>
        </h2>
        <p className="text-white/30 text-lg mb-12 max-w-lg mx-auto">
          Join thousands of developers who transformed their routine into a legendary quest.
        </p>
        <motion.button whileHover={{ scale:1.07 }} whileTap={{ scale:0.96 }}
          className="px-12 py-5 rounded-xl font-black text-white text-[11px] tracking-widest uppercase"
          style={{ background:"linear-gradient(135deg,#7c3aed,#a855f7,#c026d3)", boxShadow:"0 0 60px rgba(168,85,247,0.4)" }}>
          Create Your Character
        </motion.button>
        <div className="mt-8 text-white/20 text-[11px] font-mono tracking-widest">
          Free to start · No credit card required
        </div>
      </motion.div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 mt-32 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-white font-black text-xl tracking-widest" style={{ fontFamily:"'Syne',sans-serif" }}>
          KYZEN<span className="text-purple-500">.</span>
        </div>
        <div className="flex gap-8">
          {["Privacy","Terms","Status","GitHub"].map(l => (
            <a key={l} href="#" className="text-white/20 text-[11px] font-mono tracking-wider hover:text-white/50 transition-colors">{l}</a>
          ))}
        </div>
        <div className="text-white/15 text-[11px] font-mono">© 2024 KYZEN SYSTEMS</div>
      </div>
    </footer>
  );
};

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function Landing() {
  return (
    <div className="min-h-screen bg-[#030308] overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800;900&family=JetBrains+Mono:wght@300;400;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        * { font-family: 'JetBrains Mono', monospace; }
        h1, h2, h3 { font-family: 'Syne', sans-serif !important; }
        ::selection { background: rgba(139,92,246,0.3); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #030308; }
        ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.4); border-radius: 2px; }
      `}</style>
      <Nav />
      <Hero />
      <LifeRPG />
      <DevDashboard />
      <Progression />
      <Guilds />
      <Themes />
      <FinalCTA />
    </div>
  );
}