import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Stat { label: string; value: string; color: string }
interface Quest { title: string; xp: number; done: boolean; tag: string }
interface Skill { name: string; level: number; max: number; color: string }
interface Rank { name: string; tier: string; color: string; glow: string }

// ─── Data ─────────────────────────────────────────────────────────────────────
const STATS: Stat[] = [
  { label: "Focus", value: "87", color: "#a78bfa" },
  { label: "Discipline", value: "74", color: "#818cf8" },
  { label: "Output", value: "92", color: "#c084fc" },
  { label: "Recovery", value: "61", color: "#7dd3fc" },
];

const QUESTS: Quest[] = [
  { title: "Ship feature branch before 18:00", xp: 450, done: true, tag: "DEV" },
  { title: "30-min deep work session", xp: 200, done: true, tag: "FOCUS" },
  { title: "Solve 2 LeetCode mediums", xp: 300, done: false, tag: "DSA" },
  { title: "Push daily commit streak", xp: 150, done: false, tag: "HABIT" },
];

const SKILLS: Skill[] = [
  { name: "TypeScript", level: 8, max: 10, color: "#818cf8" },
  { name: "System Design", level: 6, max: 10, color: "#a78bfa" },
  { name: "Focus Mode", level: 9, max: 10, color: "#c084fc" },
  { name: "Consistency", level: 7, max: 10, color: "#7dd3fc" },
  { name: "Deep Work", level: 5, max: 10, color: "#f0abfc" },
];

const RANKS: Rank[] = [
  { name: "INITIATE", tier: "I", color: "#64748b", glow: "rgba(100,116,139,0.3)" },
  { name: "CODER", tier: "II", color: "#6366f1", glow: "rgba(99,102,241,0.4)" },
  { name: "ARCHITECT", tier: "III", color: "#8b5cf6", glow: "rgba(139,92,246,0.5)" },
  { name: "SENTINEL", tier: "IV", color: "#a855f7", glow: "rgba(168,85,247,0.6)" },
  { name: "KYZEN", tier: "V", color: "#e879f9", glow: "rgba(232,121,249,0.7)" },
];

const COMMITS = [4, 7, 2, 9, 5, 12, 8, 3, 11, 6, 9, 14, 7, 5, 10, 13, 8, 6, 11, 15, 9, 7, 12, 10, 4, 8, 13, 6, 11, 9];

// ─── Utility components ───────────────────────────────────────────────────────
const GlowOrb = ({ className }: { className: string }) => (
  <div className={`absolute rounded-full blur-[120px] pointer-events-none ${className}`} />
);

const StatBar = ({ stat, delay }: { stat: Stat; delay: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="space-y-1">
      <div className="flex justify-between text-xs font-mono">
        <span className="text-white/50 tracking-widest uppercase">{stat.label}</span>
        <span style={{ color: stat.color }} className="font-bold">{stat.value}</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${stat.value}%` } : {}}
          transition={{ duration: 1.2, delay, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${stat.color}88, ${stat.color})` }}
        />
      </div>
    </div>
  );
};

const SkillNode = ({ skill, delay }: { skill: Skill; delay: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="flex items-center gap-3">
      <span className="text-xs text-white/40 w-28 font-mono tracking-wide truncate">{skill.name}</span>
      <div className="flex gap-1 flex-1">
        {Array.from({ length: skill.max }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: delay + i * 0.06, duration: 0.3 }}
            className="flex-1 h-2 rounded-sm"
            style={{
              background: i < skill.level
                ? `linear-gradient(90deg, ${skill.color}99, ${skill.color})`
                : "rgba(255,255,255,0.06)",
              boxShadow: i < skill.level ? `0 0 6px ${skill.color}66` : "none",
            }}
          />
        ))}
      </div>
      <span className="text-xs font-mono w-6 text-right" style={{ color: skill.color }}>{skill.level}</span>
    </div>
  );
};

// ─── Sections ─────────────────────────────────────────────────────────────────

const Hero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 150]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const [xp, setXp] = useState(3240);

  useEffect(() => {
    const id = setInterval(() => setXp(v => v + Math.floor(Math.random() * 3)), 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Cosmic background */}
      <div className="absolute inset-0 bg-[#030308]" />
      <GlowOrb className="w-[800px] h-[400px] bg-purple-700/20 top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      <GlowOrb className="w-[400px] h-[400px] bg-violet-600/15 top-1/2 left-1/4" />
      <GlowOrb className="w-[300px] h-[300px] bg-fuchsia-700/10 top-1/2 right-1/4" />

      {/* Star field */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 80 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px h-px bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.6 + 0.1,
            }}
            animate={{ opacity: [null, 0.1, 0.8] }}
            transition={{ duration: 2 + Math.random() * 4, repeat: Infinity, repeatType: "reverse", delay: Math.random() * 5 }}
          />
        ))}
      </div>

      {/* Ring portal */}
      <motion.div style={{ y, opacity }} className="absolute top-[28%] left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative w-[500px] h-[500px]">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border border-purple-500/20"
              style={{ scale: 1 + i * 0.15 }}
              animate={{ rotate: i % 2 === 0 ? 360 : -360, scale: [1 + i * 0.15, 1.05 + i * 0.15, 1 + i * 0.15] }}
              transition={{ rotate: { duration: 20 + i * 10, repeat: Infinity, ease: "linear" }, scale: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
            />
          ))}
          <div className="absolute inset-[20%] rounded-full bg-gradient-to-b from-purple-600/30 via-violet-800/20 to-transparent blur-xl" />
          <div className="absolute inset-[30%] rounded-full bg-gradient-radial from-white/5 to-transparent" />
          <motion.div
            className="absolute inset-[35%] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(167,139,250,0.4) 0%, rgba(139,92,246,0.1) 50%, transparent 70%)" }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Horizon glow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[60px] bg-purple-500/20 blur-2xl rounded-full" />
        </div>
      </motion.div>

      {/* Content */}
      <motion.div className="relative z-10 text-center px-6 mt-40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-mono tracking-widest mb-8 uppercase"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          Season 01 · Now Live
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-6xl md:text-8xl font-black tracking-tight leading-none mb-6"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          <span className="block text-white">Your Life.</span>
          <span className="block bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
            Leveled Up.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-white/40 text-lg max-w-md mx-auto mb-10 font-light tracking-wide"
        >
          Turn your developer journey into an RPG. Earn XP, complete quests, master skills, and build your legend.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="relative px-8 py-3.5 rounded-lg font-bold text-sm tracking-widest uppercase overflow-hidden group"
            style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7, #c026d3)" }}
          >
            <span className="relative z-10 text-white">Enter the World</span>
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: "linear-gradient(135deg, #6d28d9, #9333ea, #a21caf)" }}
            />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            className="px-8 py-3.5 rounded-lg border border-white/10 text-white/50 text-sm tracking-widest uppercase hover:border-purple-500/40 hover:text-white/80 transition-all"
          >
            Watch Demo
          </motion.button>
        </motion.div>

        {/* Live XP counter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-12 inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/3 border border-white/8"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white/30 text-xs font-mono tracking-widest">XP THIS SESSION</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={xp}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              className="text-emerald-400 text-xs font-mono font-bold"
            >
              +{xp.toLocaleString()}
            </motion.span>
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Dashboard mockup */}
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1, ease: "easeOut" }}
        style={{ y }}
        className="relative z-10 w-full max-w-4xl mx-auto px-6 mt-16"
      >
        <div
          className="rounded-2xl border border-white/8 overflow-hidden"
          style={{ background: "rgba(10,8,20,0.85)", backdropFilter: "blur(20px)", boxShadow: "0 0 80px rgba(139,92,246,0.15), 0 40px 80px rgba(0,0,0,0.6)" }}
        >
          {/* Window bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
            {["#ff5f57","#febc2e","#28c840"].map(c => (
              <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
            ))}
            <div className="flex-1 text-center text-xs text-white/20 font-mono tracking-widest">KYZEN · DASHBOARD · v2.1</div>
          </div>

          <div className="grid grid-cols-3 gap-0 divide-x divide-white/5">
            {/* Left panel */}
            <div className="p-4 space-y-4">
              <div className="text-xs text-white/20 font-mono tracking-widest uppercase mb-3">Character</div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 to-purple-900 flex items-center justify-center text-lg">⚔</div>
                <div>
                  <div className="text-white text-sm font-bold">dev_ronin</div>
                  <div className="text-purple-400 text-xs font-mono">LVL 42 · ARCHITECT</div>
                </div>
              </div>
              <div className="space-y-2 pt-2">
                {STATS.map((s, i) => <StatBar key={s.label} stat={s} delay={i * 0.1} />)}
              </div>
            </div>

            {/* Center panel */}
            <div className="col-span-1 p-4">
              <div className="text-xs text-white/20 font-mono tracking-widest uppercase mb-3">Active Quests</div>
              <div className="space-y-2">
                {QUESTS.map((q, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className={`p-2.5 rounded-lg border flex items-start gap-2.5 ${q.done ? "border-emerald-500/20 bg-emerald-500/5" : "border-white/5 bg-white/2"}`}
                  >
                    <div className={`mt-0.5 w-3.5 h-3.5 rounded-sm flex items-center justify-center text-[9px] flex-shrink-0 ${q.done ? "bg-emerald-500 text-black" : "border border-white/20"}`}>
                      {q.done && "✓"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-xs truncate ${q.done ? "text-white/30 line-through" : "text-white/80"}`}>{q.title}</div>
                      <div className="flex gap-1.5 mt-1">
                        <span className="text-[10px] font-mono text-purple-400/70 bg-purple-500/10 px-1.5 py-0.5 rounded">{q.tag}</span>
                        <span className="text-[10px] font-mono text-yellow-400/70">+{q.xp} XP</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right panel */}
            <div className="p-4">
              <div className="text-xs text-white/20 font-mono tracking-widest uppercase mb-3">XP Progress</div>
              <div className="mb-4">
                <div className="text-2xl font-black text-white mb-1">42</div>
                <div className="text-xs text-white/30 font-mono mb-2">14,320 / 18,000 XP to LVL 43</div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "79%" }}
                    transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(90deg, #7c3aed, #a855f7, #e879f9)" }}
                  />
                </div>
              </div>
              {/* Streak */}
              <div className="p-2.5 rounded-lg bg-orange-500/10 border border-orange-500/20 mb-3">
                <div className="text-[10px] text-orange-400/70 font-mono uppercase tracking-wider mb-1">🔥 Daily Streak</div>
                <div className="text-xl font-black text-orange-400">34 days</div>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 21 }).map((_, i) => (
                  <div key={i} className={`aspect-square rounded-sm ${i < 16 ? "bg-purple-500/60" : i < 19 ? "bg-purple-500/20" : "bg-white/5"}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Ground glow */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-purple-600/20 blur-2xl rounded-full" />
      </motion.div>
    </section>
  );
};

// ─── RPG Life Section ─────────────────────────────────────────────────────────
const LifeRPG = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const cards = [
    { icon: "⚡", title: "Daily XP", desc: "Every commit, focus session, and completed task earns XP. Your effort is never invisible.", color: "#a78bfa" },
    { icon: "🏹", title: "Quest System", desc: "Auto-generated quests based on your GitHub activity, calendar, and goals.", color: "#818cf8" },
    { icon: "🔥", title: "Streak Engine", desc: "Maintain momentum chains. Break one, and your streak score drops. Guard it fiercely.", color: "#f97316" },
    { icon: "🧠", title: "Skill Trees", desc: "Unlock branches in DSA, System Design, Deep Work, or Communication. Your growth, mapped.", color: "#c084fc" },
  ];

  return (
    <section className="relative py-40 overflow-hidden bg-[#030308]">
      <GlowOrb className="w-[600px] h-[300px] bg-violet-800/15 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-20"
        >
          <div className="text-purple-400/60 text-xs font-mono tracking-[0.3em] uppercase mb-4">01 · Game Mechanics</div>
          <h2 className="text-5xl md:text-6xl font-black text-white leading-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
            Life as an <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">RPG</span>
          </h2>
          <p className="text-white/30 mt-4 max-w-lg mx-auto">Your habits, goals, and work sessions are converted into game mechanics. Progress isn't abstract — it's measurable.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="p-6 rounded-2xl border border-white/6 bg-white/2 cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `radial-gradient(circle at 50% 0%, ${card.color}15, transparent 60%)` }} />
              <div className="text-3xl mb-4">{card.icon}</div>
              <div className="text-white font-bold mb-2 text-sm">{card.title}</div>
              <div className="text-white/30 text-xs leading-relaxed">{card.desc}</div>
              <div className="mt-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div className="mt-3 text-[10px] font-mono tracking-widest uppercase" style={{ color: card.color }}>Learn more →</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Developer Dashboard ──────────────────────────────────────────────────────
const DevDashboard = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-40 overflow-hidden bg-[#02020c]">
      <GlowOrb className="w-[500px] h-[500px] bg-indigo-900/20 top-0 right-0" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
          >
            <div className="text-purple-400/60 text-xs font-mono tracking-[0.3em] uppercase mb-4">02 · Analytics</div>
            <h2 className="text-5xl font-black text-white leading-tight mb-6" style={{ fontFamily: "'Syne', sans-serif" }}>
              Your code,<br />
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">quantified.</span>
            </h2>
            <p className="text-white/30 mb-8 leading-relaxed">Connect GitHub, LeetCode, and WakaTime. Kyzen translates your engineering output into real XP and rank progression.</p>

            <div className="space-y-3">
              {[
                { label: "GitHub Commits", count: "1,284", badge: "SYNCED" },
                { label: "LeetCode Problems", count: "347", badge: "TRACKED" },
                { label: "Focus Hours", count: "892h", badge: "LIVE" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-xl border border-white/6 bg-white/2"
                >
                  <span className="text-white/60 text-sm">{item.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-white font-bold font-mono">{item.count}</span>
                    <span className="text-[10px] font-mono text-emerald-400/70 bg-emerald-500/10 px-2 py-0.5 rounded">{item.badge}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-white/8 overflow-hidden"
            style={{ background: "rgba(8,6,18,0.9)", backdropFilter: "blur(20px)", boxShadow: "0 0 60px rgba(99,102,241,0.1)" }}
          >
            <div className="p-4 border-b border-white/5">
              <div className="text-xs text-white/20 font-mono tracking-widest uppercase">Commit Activity · 2024</div>
            </div>
            <div className="p-4">
              {/* Commit grid */}
              <div className="flex gap-1 flex-wrap">
                {COMMITS.map((val, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.3 + i * 0.03 }}
                    className="w-4 h-4 rounded-sm"
                    style={{
                      background: val === 0 ? "rgba(255,255,255,0.04)"
                        : val < 5 ? "rgba(99,102,241,0.3)"
                          : val < 9 ? "rgba(139,92,246,0.5)"
                            : "rgba(168,85,247,0.8)",
                    }}
                    title={`${val} commits`}
                  />
                ))}
              </div>

              {/* Language breakdown */}
              <div className="mt-6 space-y-2">
                <div className="text-[10px] text-white/20 font-mono tracking-widest uppercase mb-3">Language Breakdown</div>
                {[
                  { lang: "TypeScript", pct: 58, color: "#818cf8" },
                  { lang: "Python", pct: 24, color: "#a78bfa" },
                  { lang: "Rust", pct: 12, color: "#c084fc" },
                  { lang: "Other", pct: 6, color: "#ffffff20" },
                ].map((l, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: l.color }} />
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${l.pct}%` } : {}}
                        transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                        className="h-full rounded-full"
                        style={{ background: l.color }}
                      />
                    </div>
                    <span className="text-white/30 text-xs font-mono w-8 text-right">{l.pct}%</span>
                    <span className="text-white/40 text-xs w-20">{l.lang}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ─── Progression Section ──────────────────────────────────────────────────────
const Progression = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [activeRank, setActiveRank] = useState(3);

  return (
    <section className="relative py-40 overflow-hidden bg-[#030308]">
      <GlowOrb className="w-[700px] h-[300px] bg-purple-900/20 bottom-0 left-1/2 -translate-x-1/2" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-20"
        >
          <div className="text-purple-400/60 text-xs font-mono tracking-[0.3em] uppercase mb-4">03 · Ranking System</div>
          <h2 className="text-5xl md:text-6xl font-black text-white leading-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
            Earn Your <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Rank</span>
          </h2>
        </motion.div>

        {/* Rank selector */}
        <div className="flex justify-center gap-3 mb-16 flex-wrap">
          {RANKS.map((rank, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              onClick={() => setActiveRank(i)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative px-5 py-2.5 rounded-xl border text-xs font-mono tracking-widest uppercase transition-all duration-300"
              style={{
                borderColor: activeRank === i ? rank.color : "rgba(255,255,255,0.08)",
                color: activeRank === i ? rank.color : "rgba(255,255,255,0.3)",
                background: activeRank === i ? `${rank.glow}` : "transparent",
                boxShadow: activeRank === i ? `0 0 20px ${rank.glow}` : "none",
              }}
            >
              {rank.tier} · {rank.name}
            </motion.button>
          ))}
        </div>

        {/* Skill tree */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <div
            className="p-6 rounded-2xl border border-white/8"
            style={{ background: "rgba(8,6,18,0.8)", backdropFilter: "blur(20px)" }}
          >
            <div className="text-xs text-white/20 font-mono tracking-widest uppercase mb-6">Skill Tree</div>
            <div className="space-y-3">
              {SKILLS.map((skill, i) => <SkillNode key={i} skill={skill} delay={0.5 + i * 0.05} />)}
            </div>
          </div>

          {/* Achievement showcase */}
          <div
            className="p-6 rounded-2xl border border-white/8"
            style={{ background: "rgba(8,6,18,0.8)", backdropFilter: "blur(20px)" }}
          >
            <div className="text-xs text-white/20 font-mono tracking-widest uppercase mb-6">Recent Achievements</div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: "🏆", name: "First Merge", rare: "COMMON", color: "#64748b" },
                { icon: "⚡", name: "Speed Coder", rare: "RARE", color: "#6366f1" },
                { icon: "🔥", name: "30-Day Flame", rare: "EPIC", color: "#a855f7" },
                { icon: "💎", name: "Deep Worker", rare: "LEGENDARY", color: "#e879f9" },
                { icon: "🎯", name: "Zero Bug Day", rare: "EPIC", color: "#a855f7" },
                { icon: "🌌", name: "Midnight Coder", rare: "RARE", color: "#6366f1" },
              ].map((ach, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.6 + i * 0.08 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="p-3 rounded-xl border border-white/5 bg-white/2 cursor-pointer group"
                >
                  <div className="text-2xl mb-1.5">{ach.icon}</div>
                  <div className="text-white/70 text-xs font-bold">{ach.name}</div>
                  <div className="text-[10px] font-mono mt-1 tracking-wider" style={{ color: ach.color }}>{ach.rare}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ─── Guilds Section ───────────────────────────────────────────────────────────
const Guilds = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const guilds = [
    { name: "Void Architects", members: 284, tag: "SYS_DESIGN", color: "#818cf8", rank: "#1" },
    { name: "Null Terminators", members: 197, tag: "BACKEND", color: "#a78bfa", rank: "#2" },
    { name: "Recursive Monks", members: 156, tag: "DSA", color: "#c084fc", rank: "#3" },
  ];

  return (
    <section className="relative py-40 overflow-hidden bg-[#02020c]">
      <GlowOrb className="w-[600px] h-[400px] bg-violet-900/20 top-0 left-0" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
          >
            <div className="text-purple-400/60 text-xs font-mono tracking-[0.3em] uppercase mb-4">04 · Social</div>
            <h2 className="text-5xl font-black text-white leading-tight mb-6" style={{ fontFamily: "'Syne', sans-serif" }}>
              Join a<br />
              <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Guild.</span>
            </h2>
            <p className="text-white/30 mb-8 leading-relaxed">Form parties with other ambitious developers. Compete in weekly guild wars. Share quests, celebrate wins.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-3 rounded-xl border border-violet-500/40 text-violet-300 text-sm font-mono tracking-widest uppercase hover:bg-violet-500/10 transition-all"
            >
              Browse Guilds
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            {guilds.map((guild, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1 }}
                whileHover={{ x: 6, scale: 1.01 }}
                className="flex items-center justify-between p-5 rounded-2xl border border-white/6 bg-white/2 cursor-pointer group"
                style={{ borderLeftColor: guild.color, borderLeftWidth: 2 }}
              >
                <div className="flex items-center gap-4">
                  <div className="text-xs font-mono text-white/20 w-6">{guild.rank}</div>
                  <div>
                    <div className="text-white font-bold text-sm">{guild.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ color: guild.color, background: `${guild.color}15` }}>{guild.tag}</span>
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

// ─── Themes Section ───────────────────────────────────────────────────────────
const Themes = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [active, setActive] = useState(0);

  const themes = [
    { name: "Void", desc: "Dark purple. Your default ascension.", gradient: "from-violet-950 to-purple-950", accent: "#a78bfa" },
    { name: "Neon Tokyo", desc: "Cyberpunk cyan. For night grinders.", gradient: "from-cyan-950 to-blue-950", accent: "#22d3ee" },
    { name: "Blood Moon", desc: "Crimson shadow. For the relentless.", gradient: "from-red-950 to-rose-950", accent: "#f43f5e" },
    { name: "Emerald", desc: "Forest depths. For the patient ones.", gradient: "from-emerald-950 to-teal-950", accent: "#34d399" },
  ];

  return (
    <section className="relative py-40 overflow-hidden bg-[#030308]">
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-20"
        >
          <div className="text-purple-400/60 text-xs font-mono tracking-[0.3em] uppercase mb-4">05 · Identity</div>
          <h2 className="text-5xl md:text-6xl font-black text-white leading-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
            Make it <span className="bg-gradient-to-r from-fuchsia-400 to-pink-400 bg-clip-text text-transparent">yours.</span>
          </h2>
          <p className="text-white/30 mt-4 max-w-lg mx-auto">Your dashboard, your aesthetic. Choose from premium themes that match your energy and grind style.</p>
        </motion.div>

        <div className="flex justify-center gap-3 mb-12 flex-wrap">
          {themes.map((t, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              onClick={() => setActive(i)}
              className="px-4 py-2 rounded-lg border text-xs font-mono tracking-widest uppercase transition-all"
              style={{
                borderColor: active === i ? t.accent : "rgba(255,255,255,0.08)",
                color: active === i ? t.accent : "rgba(255,255,255,0.3)",
                background: active === i ? `${t.accent}15` : "transparent",
              }}
            >
              {t.name}
            </motion.button>
          ))}
        </div>

        <motion.div
          key={active}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className={`rounded-2xl border border-white/8 p-8 bg-gradient-to-br ${themes[active].gradient} relative overflow-hidden`}
        >
          <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 30% 50%, ${themes[active].accent}15, transparent 60%)` }} />
          <div className="relative grid grid-cols-3 gap-6">
            {[0, 1, 2].map(i => (
              <div key={i} className="p-4 rounded-xl bg-black/30 border border-white/5">
                <div className="h-2 bg-white/10 rounded mb-2 w-3/4" />
                <div className="h-8 rounded mb-3" style={{ background: `${themes[active].accent}20` }} />
                <div className="h-1.5 bg-white/5 rounded mb-1.5 w-full" />
                <div className="h-1.5 bg-white/5 rounded mb-1.5 w-2/3" />
                <div className="h-1.5 rounded w-1/2" style={{ background: `${themes[active].accent}40` }} />
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <span className="text-xs font-mono tracking-widest" style={{ color: themes[active].accent }}>{themes[active].desc}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ─── Final CTA ────────────────────────────────────────────────────────────────
const FinalCTA = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <footer className="relative py-40 overflow-hidden bg-[#02020c]">
      <GlowOrb className="w-[800px] h-[500px] bg-purple-900/25 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* Stars */}
      <div className="absolute inset-0">
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px h-px bg-white rounded-full"
            style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, opacity: Math.random() * 0.4 + 0.1 }}
            animate={{ opacity: [null, 0.05, 0.5] }}
            transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, repeatType: "reverse", delay: Math.random() * 5 }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 60 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="text-purple-400/60 text-xs font-mono tracking-[0.3em] uppercase mb-6">Your Journey Begins</div>
          <h2 className="text-6xl md:text-8xl font-black text-white leading-none mb-8" style={{ fontFamily: "'Syne', sans-serif" }}>
            Ready to<br />
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              level up?
            </span>
          </h2>
          <p className="text-white/30 text-lg mb-12 max-w-lg mx-auto">Join thousands of developers who transformed their routine into a legendary quest.</p>

          <motion.button
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.96 }}
            className="relative px-12 py-5 rounded-xl font-black text-white text-sm tracking-widest uppercase overflow-hidden group"
            style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7, #c026d3)", boxShadow: "0 0 60px rgba(168,85,247,0.4)" }}
          >
            <span className="relative z-10">Create Your Character</span>
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: "linear-gradient(135deg, #6d28d9, #9333ea, #a21caf)" }}
            />
          </motion.button>

          <div className="mt-8 text-white/20 text-xs font-mono tracking-widest">Free to start · No credit card required</div>
        </motion.div>

        <div className="mt-32 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-white font-black text-xl tracking-widest" style={{ fontFamily: "'Syne', sans-serif" }}>
            KYZEN<span className="text-purple-500">.</span>
          </div>
          <div className="flex gap-8">
            {["Privacy", "Terms", "Status", "GitHub"].map(l => (
              <a key={l} href="#" className="text-white/20 text-xs font-mono tracking-wider hover:text-white/50 transition-colors">{l}</a>
            ))}
          </div>
          <div className="text-white/15 text-xs font-mono">© 2024 KYZEN SYSTEMS</div>
        </div>
      </div>
    </footer>
  );
};

// ─── Nav ──────────────────────────────────────────────────────────────────────
const Nav = () => {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const unsub = scrollY.on("change", v => setScrolled(v > 40));
    return unsub;
  }, [scrollY]);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(3,3,8,0.9)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "none",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="text-white font-black text-lg tracking-widest" style={{ fontFamily: "'Syne', sans-serif" }}>
          KYZEN<span className="text-purple-500">.</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {["Product", "Ranks", "Guilds", "Changelog"].map(l => (
            <a key={l} href="#" className="text-white/40 text-xs font-mono tracking-widest uppercase hover:text-white/80 transition-colors">{l}</a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button className="text-white/40 text-xs font-mono tracking-widest uppercase hover:text-white/80 transition-colors">Login</button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="px-4 py-2 rounded-lg text-white text-xs font-bold tracking-widest uppercase"
            style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
          >
            Start Free
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function Landing() {
  return (
    <div className="min-h-screen bg-[#030308] overflow-x-hidden">
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800;900&family=JetBrains+Mono:wght@300;400;700&display=swap');
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