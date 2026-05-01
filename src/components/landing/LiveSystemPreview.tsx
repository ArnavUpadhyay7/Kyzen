import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { STATS } from "../../constants/stats";
import { QUESTS } from "../../constants/quests";
import { SKILLS } from "../../constants/skills";

// ─── Shared fade-up animation ─────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] as any },
});

// ─── Glass card base ──────────────────────────────────────────────────────────
function BentoCard({
  children,
  className = "",
  delay = 0,
  accentColor = "rgba(124,58,237,0.12)",
  accentPos = "30% 0%",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  accentColor?: string;
  accentPos?: string;
}) {
  return (
    <motion.div
      {...fadeUp(delay)}
      whileHover={{ scale: 1.014, y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`relative rounded-2xl overflow-hidden flex flex-col ${className}`}
      style={{
        background: "rgba(10, 5, 28, 0.55)",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
        boxShadow:
          "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      {/* Radial glow accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at ${accentPos}, ${accentColor}, transparent 65%)`,
        }}
      />
      {/* Top edge shimmer */}
      <div
        className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 10%, rgba(139,92,246,0.3) 50%, transparent 90%)",
        }}
      />
      <div className="relative z-10 flex flex-col h-full p-6">
        {children}
      </div>
    </motion.div>
  );
}

// ─── Card header helper ───────────────────────────────────────────────────────
function CardHeader({
  eyebrow,
  title,
  eyebrowColor = "rgba(167,139,250,0.5)",
}: {
  eyebrow: string;
  title: string;
  eyebrowColor?: string;
}) {
  return (
    <div className="mb-3">
      <p
        className="text-[10px] font-mono tracking-[0.28em] uppercase mb-1.5"
        style={{ color: eyebrowColor }}
      >
        {eyebrow}
      </p>
      <h3
        className="text-xl font-extrabold text-white leading-tight"
        style={{ fontFamily: "'Sora', sans-serif", letterSpacing: "-0.02em" }}
      >
        {title}
      </h3>
    </div>
  );
}

// ─── Animated progress bar ────────────────────────────────────────────────────
function AnimatedBar({
  value,
  color,
  delay,
}: {
  value: number;
  color: string;
  delay: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div
      ref={ref}
      className="h-1.5 rounded-full overflow-hidden"
      style={{ background: "rgba(255,255,255,0.05)" }}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={inView ? { width: `${value}%` } : {}}
        transition={{ duration: 1.3, delay, ease: "easeOut" }}
        className="h-full rounded-full"
        style={{
          background: `linear-gradient(90deg, ${color}66, ${color})`,
          boxShadow: `0 0 8px ${color}55`,
        }}
      />
    </div>
  );
}

// ─── Streak calendar grid ─────────────────────────────────────────────────────
function StreakCalendar() {
  const weeks = 8;
  const days = 7;
  const data = useRef(
    Array.from({ length: weeks * days }, () => Math.random())
  ).current;

  return (
    <div
      className="grid gap-[3px]"
      style={{ gridTemplateColumns: `repeat(${weeks}, 1fr)` }}
    >
      {Array.from({ length: weeks }).map((_, w) => (
        <div key={w} className="flex flex-col gap-[3px]">
          {Array.from({ length: days }).map((_, d) => {
            const v = data[w * days + d];
            return (
              <motion.div
                key={d}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + (w * days + d) * 0.005 }}
                className="w-full aspect-square rounded-[3px]"
                style={{
                  background:
                    v > 0.7
                      ? "rgba(168,85,247,0.95)"
                      : v > 0.4
                      ? "rgba(139,92,246,0.55)"
                      : v > 0.15
                      ? "rgba(99,102,241,0.22)"
                      : "rgba(255,255,255,0.04)",
                  boxShadow: v > 0.7 ? "0 0 5px rgba(168,85,247,0.5)" : "none",
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ─── Skill row ────────────────────────────────────────────────────────────────
function SkillRow({ skill, delay }: { skill: any; delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="flex items-center gap-3">
      <span className="text-[11px] text-white/35 font-mono tracking-wide w-28 truncate">
        {skill.name}
      </span>
      <div className="flex gap-[3px] flex-1">
        {Array.from({ length: skill.max }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scaleY: 0.3 }}
            animate={inView ? { opacity: 1, scaleY: 1 } : {}}
            transition={{ delay: delay + i * 0.045, duration: 0.28 }}
            className="flex-1 h-1.5 rounded-sm"
            style={{
              background:
                i < skill.level
                  ? `linear-gradient(90deg, ${skill.color}77, ${skill.color})`
                  : "rgba(255,255,255,0.05)",
              boxShadow:
                i < skill.level ? `0 0 5px ${skill.color}44` : "none",
            }}
          />
        ))}
      </div>
      <span
        className="text-[11px] font-mono w-4 text-right"
        style={{ color: skill.color }}
      >
        {skill.level}
      </span>
    </div>
  );
}

// ─── Network visualization ────────────────────────────────────────────────────
function NetworkViz() {
  const nodes = [
    { cx: 100, cy: 90, r: 22, icon: "⚡", color: "#a855f7" },
    { cx: 30, cy: 38, r: 14, icon: "📦", color: "#818cf8" },
    { cx: 170, cy: 38, r: 14, icon: "🔮", color: "#c084fc" },
    { cx: 170, cy: 142, r: 14, icon: "⚔", color: "#7dd3fc" },
    { cx: 30, cy: 142, r: 14, icon: "🏆", color: "#e879f9" },
  ];
  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 200 180" className="w-full max-w-[200px]">
        <defs>
          {nodes.slice(1).map((n, i) => (
            <filter key={i} id={`glow-${i}`}>
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}
        </defs>
        {nodes.slice(1).map((n, i) => (
          <motion.line
            key={i}
            x1={nodes[0].cx}
            y1={nodes[0].cy}
            x2={n.cx}
            y2={n.cy}
            stroke={n.color}
            strokeOpacity="0.35"
            strokeWidth="1"
            strokeDasharray="4 4"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, delay: 0.4 + i * 0.12 }}
          />
        ))}
        {nodes.map((n, i) => (
          <motion.g
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: `${n.cx}px ${n.cy}px` }}
          >
            {/* Glow ring */}
            <circle
              cx={n.cx}
              cy={n.cy}
              r={n.r + 4}
              fill="none"
              stroke={n.color}
              strokeOpacity="0.12"
              strokeWidth="1"
            />
            <circle
              cx={n.cx}
              cy={n.cy}
              r={n.r}
              fill={`${n.color}18`}
              stroke={n.color}
              strokeOpacity="0.5"
              strokeWidth="1"
            />
            <circle cx={n.cx} cy={n.cy} r={n.r * 0.5} fill={`${n.color}35`} />
            <text
              x={n.cx}
              y={n.cy + 5}
              textAnchor="middle"
              fontSize={i === 0 ? 13 : 9}
              fill="white"
            >
              {n.icon}
            </text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}

// ─── Stat badge (streak / done) ───────────────────────────────────────────────
function StatBadge({
  label,
  value,
  colorClass,
  borderClass,
  bgClass,
}: {
  label: string;
  value: string;
  colorClass: string;
  borderClass: string;
  bgClass: string;
}) {
  return (
    <div
      className={`flex-1 p-3 rounded-xl text-center ${bgClass} ${borderClass} border`}
      style={{ backdropFilter: "blur(12px)" }}
    >
      <div className={`text-[9px] font-mono uppercase tracking-widest mb-0.5 ${colorClass} opacity-60`}>
        {label}
      </div>
      <div className={`text-lg font-extrabold ${colorClass}`}
        style={{ fontFamily: "'Sora', sans-serif" }}>
        {value}
      </div>
    </div>
  );
}

// ─── Section label ────────────────────────────────────────────────────────────
function SectionLabel({ index, text }: { index: string; text: string }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-4">
      <div className="h-px w-10 bg-gradient-to-r from-transparent to-violet-500/40" />
      <span
        className="text-[10px] font-mono tracking-[0.3em] uppercase"
        style={{ color: "rgba(167,139,250,0.5)" }}
      >
        {index} · {text}
      </span>
      <div className="h-px w-10 bg-gradient-to-l from-transparent to-violet-500/40" />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
const LiveSystemPreview = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const headerY = useTransform(scrollYProgress, [0, 0.3], [50, 0]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.22], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center py-28 overflow-hidden"
      style={{ background: "#060412", fontFamily: "'Sora', sans-serif" }}
    >
      {/* ── Background atmosphere ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 120% 60% at 50% 50%, rgba(88,28,220,0.12) 0%, rgba(6,4,18,0) 65%)",
        }}
      />
      {/* Corner orbs */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(109,40,217,0.12) 0%, transparent 65%)",
          filter: "blur(80px)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(79,22,220,0.1) 0%, transparent 65%)",
          filter: "blur(90px)",
        }}
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(139,92,246,0.055) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(ellipse 80% 70% at 50% 50%, black 10%, transparent 85%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
        {/* ── Section header ── */}
        <motion.div
          style={{ y: headerY, opacity: headerOpacity }}
          className="text-center mb-16"
        >
          <SectionLabel index="01" text="Live System" />
          <h2
            className="text-5xl md:text-6xl font-extrabold text-white leading-[1.06] mb-4"
            style={{ letterSpacing: "-0.04em" }}
          >
            Life as an{" "}
            <span
              style={{
                background:
                  "linear-gradient(125deg, #ddd6fe 0%, #a78bfa 30%, #7c3aed 60%, #c084fc 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              RPG
            </span>
          </h2>
          <p
            className="text-sm max-w-md mx-auto leading-relaxed"
            style={{ color: "rgba(200,190,230,0.4)" }}
          >
            Your habits, goals, and work sessions converted into game mechanics.
            Progress isn't abstract — it's measurable.
          </p>
        </motion.div>

        {/* ── Bento grid ── */}
        <div className="grid grid-cols-12 gap-4">

          {/* ── XP / Stats card ── */}
          <BentoCard
            delay={0.08}
            accentColor="rgba(124,58,237,0.18)"
            accentPos="40% 0%"
            className="col-span-12 md:col-span-4 row-span-2"
          >
            <div className="flex items-start justify-between mb-4">
              <CardHeader eyebrow="Daily XP" title="⚡ Experience" />
              <span
                className="px-2.5 py-1 rounded-full text-[9px] font-mono tracking-widest flex-shrink-0 mt-0.5"
                style={{
                  background: "rgba(124,58,237,0.15)",
                  border: "1px solid rgba(124,58,237,0.3)",
                  color: "#c4b5fd",
                }}
              >
                ACTIVE
              </span>
            </div>

            <p className="text-xs leading-relaxed mb-5" style={{ color: "rgba(200,185,240,0.35)" }}>
              Every commit, focus session, and completed task earns XP. Your
              effort is never invisible.
            </p>

            {/* Stat bars */}
            <div className="space-y-3.5 mb-6">
              {STATS.map((s, i) => (
                <div key={s.label} className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span
                      className="text-[10px] font-mono tracking-widest uppercase"
                      style={{ color: "rgba(255,255,255,0.3)" }}
                    >
                      {s.label}
                    </span>
                    <span
                      className="text-[10px] font-mono font-bold"
                      style={{ color: s.color }}
                    >
                      {s.value}
                    </span>
                  </div>
                  <AnimatedBar value={s.value} color={s.color} delay={0.2 + i * 0.1} />
                </div>
              ))}
            </div>

            {/* Level progress */}
            <div className="mt-auto space-y-3">
              <div>
                <div
                  className="flex justify-between text-[10px] font-mono mb-1.5"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                >
                  <span>LVL 42</span>
                  <span>14,320 / 18,000 XP</span>
                </div>
                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "79%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.6, delay: 0.4, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{
                      background:
                        "linear-gradient(90deg,#7c3aed,#a855f7,#e879f9)",
                      boxShadow: "0 0 14px rgba(168,85,247,0.55)",
                    }}
                  />
                </div>
              </div>

              {/* Streak + Done badges */}
              <div className="flex gap-2">
                <StatBadge
                  label="Streak"
                  value="34 🔥"
                  colorClass="text-orange-400"
                  bgClass="bg-orange-500/10"
                  borderClass="border-orange-500/20"
                />
                <StatBadge
                  label="Done"
                  value="12 ✓"
                  colorClass="text-emerald-400"
                  bgClass="bg-emerald-500/10"
                  borderClass="border-emerald-500/20"
                />
              </div>
            </div>
          </BentoCard>

          {/* ── Quest System ── */}
          <BentoCard
            delay={0.18}
            accentColor="rgba(99,102,241,0.14)"
            accentPos="70% 0%"
            className="col-span-12 md:col-span-5"
          >
            <CardHeader
              eyebrow="Quest System"
              title="🏹 Active Quests"
              eyebrowColor="rgba(129,140,248,0.55)"
            />
            <p className="text-xs leading-relaxed mb-4" style={{ color: "rgba(200,185,240,0.35)" }}>
              Auto-generated from your GitHub activity, calendar, and goals.
            </p>
            <div className="space-y-2">
              {QUESTS.map((q, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.25 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                  style={{
                    background: q.done
                      ? "rgba(16,185,129,0.07)"
                      : "rgba(255,255,255,0.025)",
                    border: q.done
                      ? "1px solid rgba(16,185,129,0.18)"
                      : "1px solid rgba(255,255,255,0.05)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  {/* Checkbox */}
                  <div
                    className="w-4 h-4 rounded-md flex items-center justify-center flex-shrink-0 text-[9px] font-bold"
                    style={{
                      background: q.done
                        ? "rgba(16,185,129,0.9)"
                        : "rgba(255,255,255,0.05)",
                      border: q.done ? "none" : "1px solid rgba(255,255,255,0.15)",
                      color: q.done ? "#000" : "transparent",
                    }}
                  >
                    ✓
                  </div>
                  <span
                    className="flex-1 text-xs truncate"
                    style={{
                      color: q.done ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.72)",
                      textDecoration: q.done ? "line-through" : "none",
                    }}
                  >
                    {q.title}
                  </span>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span
                      className="text-[9px] font-mono px-1.5 py-0.5 rounded"
                      style={{
                        color: "#a78bfa",
                        background: "rgba(167,139,250,0.1)",
                        border: "1px solid rgba(167,139,250,0.15)",
                      }}
                    >
                      {q.tag}
                    </span>
                    <span className="text-[10px] font-mono" style={{ color: "rgba(250,204,21,0.65)" }}>
                      +{q.xp}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </BentoCard>

          {/* ── Streak card ── */}
          <BentoCard
            delay={0.28}
            accentColor="rgba(234,88,12,0.1)"
            accentPos="50% 100%"
            className="col-span-12 md:col-span-3"
          >
            <CardHeader
              eyebrow="Streak Engine"
              title="🔥 Streaks"
              eyebrowColor="rgba(251,146,60,0.55)"
            />
            <p className="text-[11px] leading-relaxed mb-4" style={{ color: "rgba(200,185,240,0.35)" }}>
              Maintain momentum chains. Break one and your score drops.
            </p>
            <div className="flex-1 mb-5">
              <StreakCalendar />
            </div>
            <div
              className="text-center py-3 rounded-xl"
              style={{
                background: "rgba(234,88,12,0.08)",
                border: "1px solid rgba(234,88,12,0.15)",
              }}
            >
              <div
                className="text-3xl font-extrabold text-orange-400"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                34
              </div>
              <div className="text-[9px] font-mono tracking-widest uppercase mt-0.5" style={{ color: "rgba(251,146,60,0.5)" }}>
                day streak
              </div>
            </div>
          </BentoCard>

          {/* ── Skill Trees ── */}
          <BentoCard
            delay={0.14}
            accentColor="rgba(192,132,252,0.12)"
            accentPos="20% 50%"
            className="col-span-12 md:col-span-5"
          >
            <CardHeader
              eyebrow="Skill Trees"
              title="🧠 Mastery"
              eyebrowColor="rgba(192,132,252,0.55)"
            />
            <p className="text-xs leading-relaxed mb-6" style={{ color: "rgba(200,185,240,0.35)" }}>
              Unlock branches in DSA, System Design, Deep Work. Your growth, mapped visually.
            </p>
            <div className="space-y-3 mt-auto">
              {SKILLS.map((s, i) => (
                <SkillRow key={i} skill={s} delay={0.2 + i * 0.06} />
              ))}
            </div>
          </BentoCard>

          {/* ── Guild Network ── */}
          <BentoCard
            delay={0.34}
            accentColor="rgba(125,211,252,0.08)"
            accentPos="50% 80%"
            className="col-span-12 md:col-span-3"
          >
            <CardHeader
              eyebrow="Guild Network"
              title="⚔ Social"
              eyebrowColor="rgba(125,211,252,0.5)"
            />
            <p className="text-[11px] leading-relaxed mb-3" style={{ color: "rgba(200,185,240,0.35)" }}>
              Form parties, compete in weekly wars, share quests with your guild.
            </p>
            <div className="flex-1 flex items-center justify-center min-h-[150px]">
              <NetworkViz />
            </div>
          </BentoCard>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
      `}</style>
    </section>
  );
};

export default LiveSystemPreview;