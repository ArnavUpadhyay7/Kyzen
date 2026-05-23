import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const },
});

function CardEdge({ accent }: { accent?: boolean }) {
  return (
    <div
      className={[
        "absolute inset-x-0 top-0 h-px pointer-events-none z-10",
        accent ? "bg-landing-edge-blue-bright" : "bg-landing-edge-blue",
      ].join(" ")}
    />
  );
}

function GoalRings() {
  const rings = [
    { r: 54, pct: 0.83, strokeClass: "stroke-landing-blue-mid", delay: 0.1 },
    { r: 38, pct: 0.65, strokeClass: "stroke-landing-blue", delay: 0.2 },
    { r: 22, pct: 0.91, strokeClass: "stroke-landing-blue-light", delay: 0.3 },
  ];
  return (
    <div className="flex items-center justify-center py-4">
      <svg viewBox="0 0 140 140" className="w-32 h-32">
        <defs>
          <radialGradient id="fg-rg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4D7CFF" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#4D7CFF" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="70" cy="70" r="65" fill="url(#fg-rg)" />
        {rings.map(({ r, pct, strokeClass, delay }, i) => {
          const circ = 2 * Math.PI * r;
          return (
            <g key={i}>
              <circle
                cx="70"
                cy="70"
                r={r}
                fill="none"
                className="stroke-landing-blue/10"
                strokeWidth="7"
              />
              <motion.circle
                cx="70"
                cy="70"
                r={r}
                fill="none"
                className={`${strokeClass} -rotate-90 origin-[70px_70px]`}
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={circ}
                whileInView={{ strokeDashoffset: circ * (1 - pct) }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
              />
            </g>
          );
        })}
        <text
          x="70"
          y="66"
          textAnchor="middle"
          fontSize="13"
          fontWeight="800"
          fill="white"
          className="font-landing-display"
        >
          83%
        </text>
        <text
          x="70"
          y="80"
          textAnchor="middle"
          fontSize="6.5"
          fill="rgba(110,168,255,0.50)"
          letterSpacing="2.5"
          className="font-landing-mono"
        >
          DONE
        </text>
      </svg>
    </div>
  );
}

function XPBars() {
  const bars = [
    { h: 32, on: true },
    { h: 52, on: true },
    { h: 28, on: true },
    { h: 68, on: true },
    { h: 44, on: true },
    { h: 80, on: true },
    { h: 38, on: false },
    { h: 22, on: false },
  ];
  const days = ["M", "T", "W", "T", "F", "S", "S", "M"];
  return (
    <div className="w-full">
      <div className="flex items-end gap-1.5 h-20">
        {bars.map(({ h, on }, i) => (
          <motion.div
            key={i}
            className={[
              "flex-1 rounded-[4px]",
              on
                ? "bg-landing-xp-bar-on border border-landing-border-blue-mid"
                : "bg-landing-xp-bar-off border border-landing-xp-empty",
            ].join(" ")}
            initial={{ height: 0 }}
            whileInView={{ height: h }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 + i * 0.055, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
      </div>
      <div className="flex mt-1.5">
        {days.map((d, i) => (
          <span key={i} className="flex-1 text-center text-[8px] text-landing-text-muted font-landing-mono">
            {d}
          </span>
        ))}
      </div>
    </div>
  );
}

function StreakDots() {
  const grid = [
    [1, 1, 0, 1, 1, 1, 0],
    [1, 1, 1, 1, 0, 1, 1],
    [0, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 0, 0],
  ];
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {grid.map((row, ri) => (
        <div key={ri} className="flex gap-1.5">
          {row.map((on, ci) => (
            <motion.div
              key={ci}
              className={[
                "flex-1 h-4 rounded-[3px] border",
                on
                  ? ri >= 4
                    ? "bg-landing-streak-on border-landing-border-blue-mid"
                    : "bg-landing-streak-mid border-landing-border-blue-mid"
                  : "bg-landing-xp-empty border-landing-xp-empty",
              ].join(" ")}
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.22, delay: (ri * 7 + ci) * 0.01 + 0.2 }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function CodeBlock() {
  const lines = [
    { k: "const", v: " session = await kyzen.track()", keyClass: "text-landing-blue-mid" },
    { k: "// +320", v: " XP earned today", keyClass: "text-[#86efac]" },
    { k: "commit", v: `.push({ xp: 80, skill: "React" })`, keyClass: "text-landing-blue-light" },
    { k: "streak", v: ".extend(today) // 🔥 27 days", keyClass: "text-landing-blue-mid" },
  ];
  return (
    <div className="rounded-xl overflow-hidden bg-landing-code-bg border border-landing-border-soft">
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-landing-border-soft">
        <div className="w-2 h-2 rounded-full opacity-65 bg-[#ff5f57]" />
        <div className="w-2 h-2 rounded-full opacity-65 bg-[#febc2e]" />
        <div className="w-2 h-2 rounded-full opacity-65 bg-[#28c840]" />
        <span className="text-[8.5px] ml-2 tracking-widest text-[rgba(110,168,255,0.35)] font-landing-mono">
          session.ts
        </span>
      </div>
      <div className="p-3 space-y-1">
        {lines.map((l, i) => (
          <motion.div
            key={i}
            className="text-[10px] leading-relaxed font-landing-mono"
            initial={{ opacity: 0, x: -4 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.2 + i * 0.08 }}
          >
            <span className={l.keyClass}>{l.k}</span>
            <span className="text-[rgba(180,195,235,0.38)]">{l.v}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function StatChip({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div
      className={[
        "flex flex-col px-3 py-2.5 rounded-xl border bg-landing-card-inner",
        accent ? "border-landing-border-blue-mid" : "border-landing-xp-empty",
      ].join(" ")}
    >
      <span
        className={[
          "text-[1.35rem] font-black leading-none font-landing-display",
          accent ? "text-landing-blue-mid" : "text-landing-white",
        ].join(" ")}
      >
        {value}
      </span>
      <span className="text-[8px] tracking-[0.14em] uppercase mt-1 text-landing-text-muted font-landing-mono">
        {label}
      </span>
    </div>
  );
}

type FeatureDef = {
  n: string;
  label: string;
  title: string;
  body: string;
  col: string;
  illustration: React.ReactNode;
  accent?: boolean;
};

function FeatureCard({ f, delay }: { f: FeatureDef; delay: number }) {
  const [hov, setHov] = useState(false);

  return (
    <motion.div
      {...fadeUp(delay)}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      whileHover={{ y: -3, scale: 1.005 }}
      className={[
        "relative flex flex-col rounded-2xl overflow-hidden backdrop-blur-[20px] transition-[box-shadow,border-color] duration-300",
        f.col,
        f.accent ? "bg-landing-card-bg-accent" : "bg-landing-card-bg",
        hov ? "border-landing-border-hover" : "border-landing-border-soft",
        hov
          ? f.accent
            ? "shadow-landing-card-accent-hover"
            : "shadow-landing-card-hover"
          : f.accent
            ? "shadow-landing-card-accent"
            : "shadow-[0_2px_20px_rgba(0,0,0,0.38)]",
      ].join(" ")}
    >
      <CardEdge accent={f.accent} />

      <div
        className={[
          "absolute inset-0 pointer-events-none transition-[background] duration-300",
          hov ? "bg-landing-card-glow-hover" : "bg-landing-card-glow",
        ].join(" ")}
      />

      <div className="relative z-10 flex flex-col h-full p-6 gap-4">
        <div className="flex items-center gap-2">
          <span className="text-[9.5px] font-semibold tracking-[0.18em] uppercase px-2.5 py-1 rounded-full bg-landing-badge-blue-bg border border-landing-border-blue-mid text-[rgba(110,168,255,0.75)] font-landing-mono">
            {f.n} / {f.label}
          </span>
        </div>

        <div>
          <h3
            className="font-landing-display font-black uppercase leading-[0.94] text-landing-white mb-2 text-[clamp(1.1rem,2vw,1.45rem)] tracking-[-0.02em]"
            dangerouslySetInnerHTML={{ __html: f.title }}
          />
          <p className="text-[13px] leading-relaxed text-landing-text-sub font-landing-body">{f.body}</p>
        </div>

        <div className="mt-auto pt-2">{f.illustration}</div>
      </div>
    </motion.div>
  );
}

const questBarClass: Record<string, string> = {
  "#6EA8FF": "bg-landing-blue-mid",
  "#4D7CFF": "bg-landing-blue",
  "#93C5FD": "bg-landing-blue-light",
};

const questTextClass: Record<string, string> = {
  "#6EA8FF": "text-landing-blue-mid",
  "#4D7CFF": "text-landing-blue",
  "#93C5FD": "text-landing-blue-light",
};

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "start start"] });
  const headerY = useTransform(scrollYProgress, [0, 1], [24, 0]);
  const MotionLink = motion(Link);

  const features: FeatureDef[] = [
    {
      n: "01",
      label: "Goal System",
      title: "Set Goals.<br/>Watch&nbsp;Them&nbsp;Fall.",
      body: "Daily and weekly targets structured into milestones. No willpower drama — just momentum that compounds.",
      col: "col-span-12 md:col-span-4 min-h-[420px]",
      accent: true,
      illustration: (
        <div className="flex flex-col gap-3">
          <GoalRings />
          <div className="grid grid-cols-2 gap-2">
            <StatChip label="Goals Hit" value="94%" accent />
            <StatChip label="This Week" value="7/7" />
          </div>
        </div>
      ),
    },
    {
      n: "02",
      label: "XP & Leveling",
      title: "Every Action.<br/>Real&nbsp;Progress.",
      body: "Instant XP for every task you close. Watch your level climb — no lag between effort and reward.",
      col: "col-span-12 md:col-span-8 min-h-[220px]",
      accent: true,
      illustration: (
        <div className="flex flex-col sm:flex-row gap-6 items-end">
          <div className="flex items-center gap-3 flex-wrap">
            <StatChip label="Total XP" value="2,450" accent />
            <StatChip label="Level" value="Lv.12" />
            <StatChip label="Today" value="+320" accent />
          </div>
          <div className="flex-1 min-w-[140px]">
            <XPBars />
          </div>
        </div>
      ),
    },
    {
      n: "03",
      label: "Streaks",
      title: "Momentum Is<br/>Your&nbsp;Superpower.",
      body: "Build streaks, multiply XP gains. Freeze tokens protect your chain when life gets in the way.",
      col: "col-span-12 md:col-span-5 min-h-[220px]",
      illustration: (
        <div className="flex flex-col sm:flex-row gap-5 items-end">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔥</span>
            <StatChip label="Streak" value="27" accent />
            <StatChip label="Multiplier" value="×1.8" />
          </div>
          <div className="flex-1 min-w-[120px]">
            <StreakDots />
          </div>
        </div>
      ),
    },
    {
      n: "04",
      label: "Dev Mode",
      title: "Real Work.<br/>Measured&nbsp;XP.",
      body: "Connect GitHub, track sessions, convert every commit into visible progress.",
      col: "col-span-12 md:col-span-3 min-h-[220px]",
      illustration: <CodeBlock />,
    },
    {
      n: "05",
      label: "Quests",
      title: "Side Quests.<br/>Main&nbsp;Missions.",
      body: "Structured challenges tied to real XP and skill points. Ship, learn, grow.",
      col: "col-span-12 md:col-span-4 min-h-[220px]",
      illustration: (
        <div className="space-y-2.5">
          {[
            { name: "Ship a side project", xp: "+200 XP", pct: 70, c: "#6EA8FF" },
            { name: "Solve 5 LeetCode hard", xp: "+150 XP", pct: 40, c: "#4D7CFF" },
            { name: "30-day streak", xp: "+500 XP", pct: 90, c: "#93C5FD" },
          ].map(({ name, xp, pct, c }) => (
            <div key={name}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[11px] font-medium text-[rgba(180,210,255,0.72)] font-landing-body">
                  {name}
                </span>
                <span className={`text-[9.5px] font-semibold font-landing-mono ${questTextClass[c]}`}>
                  {xp}
                </span>
              </div>
              <div className="h-1 rounded-full bg-landing-xp-track">
                <motion.div
                  className={`h-full rounded-full ${questBarClass[c]}`}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.75, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <section ref={sectionRef} className="relative py-28 overflow-hidden bg-landing-surface">
      <div className="absolute inset-0 pointer-events-none bg-landing-ambient-features" />
      <div className="absolute inset-0 pointer-events-none bg-landing-grid-accent opacity-60" />

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6">
        <motion.div style={{ y: headerY }} className="mb-16">
          <motion.div {...fadeUp(0)} className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-10 bg-landing-eyebrow-line-left" />
            <span className="text-[10px] tracking-[0.26em] uppercase font-semibold text-[rgba(110,168,255,0.50)] font-landing-mono">
              Features
            </span>
            <div className="h-px w-10 bg-landing-eyebrow-line-right" />
          </motion.div>

          <motion.h2
            {...fadeUp(0.06)}
            className="text-center font-landing-display font-black uppercase leading-[0.93] mb-5 text-[clamp(2.6rem,6vw,4.8rem)] tracking-[-0.025em]"
          >
            <span className="text-landing-white">Your life.</span>
            <br />
            <span className="text-gradient-landing-accent">Gamified.</span>
          </motion.h2>

          <motion.p
            {...fadeUp(0.1)}
            className="text-center max-w-[440px] mx-auto text-[13.5px] leading-relaxed text-landing-text-muted font-landing-body"
          >
            Kyzen turns real effort — goals, sessions, commits — into a living progression system that
            rewards consistency and fuels momentum.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-12 gap-3.5 auto-rows-auto">
          {features.map((f, i) => (
            <FeatureCard key={f.n} f={f} delay={0.04 + i * 0.05} />
          ))}
        </div>

        <motion.div {...fadeUp(0.24)} className="flex justify-center mt-16">
          <MotionLink
            to="/dashboard"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2.5 rounded-full text-landing-white font-medium cursor-pointer select-none font-landing-body text-sm tracking-[0.01em] px-7 py-3.5 bg-landing-cta-blue shadow-landing-cta-blue border border-landing-border-blue-mid"
          >
            Explore Features
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="white"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </MotionLink>
        </motion.div>
      </div>
    </section>
  );
}
