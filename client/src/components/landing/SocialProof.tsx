import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.58, delay, ease: [0.22, 1, 0.36, 1] as const },
});

function BlueEdge({ bright }: { bright?: boolean }) {
  return (
    <div
      className={[
        "absolute inset-x-0 top-0 h-px pointer-events-none z-10",
        bright ? "bg-landing-edge-blue-bright" : "bg-landing-edge-blue",
      ].join(" ")}
    />
  );
}

function StatCard({ label, value, delay }: { label: string; value: string; delay: number }) {
  return (
    <motion.div
      {...fadeUp(delay)}
      className="relative rounded-2xl overflow-hidden p-6 text-center bg-landing-card-bg-alt border border-landing-border backdrop-blur-[20px]"
    >
      <BlueEdge bright />
      <div className="absolute inset-0 pointer-events-none bg-landing-stat-card-glow" />
      <div className="relative z-10">
        <div className="font-landing-display font-black mb-1.5 text-[clamp(2rem,4vw,2.8rem)] tracking-[-0.03em] leading-none text-gradient-landing-stat text-glow-landing-stat">
          {value}
        </div>
        <div className="text-[10px] tracking-[0.18em] uppercase mt-1 text-landing-text-muted-alt font-landing-mono">
          {label}
        </div>
      </div>
    </motion.div>
  );
}

function TestimonialCard({
  handle,
  rank,
  text,
  xp,
  delay,
}: {
  handle: string;
  rank: string;
  text: string;
  xp: string;
  delay: number;
}) {
  return (
    <motion.div
      {...fadeUp(delay)}
      className="relative rounded-2xl overflow-hidden p-6 bg-landing-card-bg-alt border border-landing-border backdrop-blur-[20px] shadow-landing-testimonial"
    >
      <BlueEdge />
      <div className="absolute inset-0 pointer-events-none bg-landing-testimonial-glow" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 bg-landing-avatar border border-landing-border-accent text-landing-white font-landing-display text-sm">
            {handle[1].toUpperCase()}
          </div>

          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-[rgba(245,247,255,0.88)] font-landing-body">{handle}</span>
            <span className="text-[9.5px] tracking-[0.12em] uppercase text-landing-text-muted-alt font-landing-mono">
              {rank}
            </span>
          </div>

          <div className="ml-auto shrink-0 px-2 py-1 rounded-lg bg-landing-badge-blue-bg border border-landing-border">
            <span className="text-[9.5px] font-semibold text-landing-blue-mid font-landing-mono">{xp}</span>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-landing-text-sub-alt font-landing-body">"{text}"</p>
      </div>
    </motion.div>
  );
}

export default function SocialProof() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const opacity = useTransform(scrollYProgress, [0.1, 0.35], [0, 1]);
  const y = useTransform(scrollYProgress, [0.1, 0.4], [60, 0]);

  const WORLD_STATS = [
    { label: "XP Earned Today", value: "84.2M" },
    { label: "Active Players", value: "31,420" },
    { label: "Quests Completed", value: "218K" },
    { label: "Guilds Formed", value: "4,200+" },
  ];

  const testimonials = [
    {
      handle: "@nullbyte",
      rank: "CODER II",
      text: "First time I've ever felt excited about LeetCode. When a hard problem becomes a quest with XP, your brain processes it differently.",
      xp: "14,700 XP",
    },
    {
      handle: "@nullbyte",
      rank: "CODER II",
      text: "First time I've ever felt excited about LeetCode. When a hard problem becomes a quest with XP, your brain processes it differently.",
      xp: "14,700 XP",
    },
    {
      handle: "@nullbyte",
      rank: "CODER II",
      text: "First time I've ever felt excited about LeetCode. When a hard problem becomes a quest with XP, your brain processes it differently.",
      xp: "14,700 XP",
    },
    {
      handle: "@nullbyte",
      rank: "CODER II",
      text: "First time I've ever felt excited about LeetCode. When a hard problem becomes a quest with XP, your brain processes it differently.",
      xp: "14,700 XP",
    },
    {
      handle: "@nullbyte",
      rank: "CODER II",
      text: "First time I've ever felt excited about LeetCode. When a hard problem becomes a quest with XP, your brain processes it differently.",
      xp: "14,700 XP",
    },
    {
      handle: "@nullbyte",
      rank: "CODER II",
      text: "First time I've ever felt excited about LeetCode. When a hard problem becomes a quest with XP, your brain processes it differently.",
      xp: "14,700 XP",
    },
  ];

  return (
    <section ref={sectionRef} className="relative py-28 overflow-hidden bg-landing-surface">
      <div className="absolute inset-0 pointer-events-none bg-landing-grid-accent opacity-[0.65]" />
      <div className="absolute w-[700px] h-[500px] -top-[5%] -right-[8%] pointer-events-none bg-landing-ambient-glow-right blur-[80px]" />
      <div className="absolute w-[500px] h-[400px] -bottom-[5%] -left-[8%] pointer-events-none bg-landing-ambient-glow-left blur-[90px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div style={{ y, opacity }} className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-10 bg-landing-eyebrow-line-left" />
            <span className="text-[10px] tracking-[0.26em] uppercase font-semibold text-[rgba(110,168,255,0.52)] font-landing-mono">
              In-World Stats
            </span>
            <div className="h-px w-10 bg-landing-eyebrow-line-right" />
          </div>

          <h2 className="text-center font-landing-display font-black uppercase leading-[0.93] mb-5 text-[clamp(2.6rem,6vw,4.8rem)] tracking-[-0.025em]">
            <span className="text-landing-white">The World is</span>{" "}
            <span className="text-gradient-landing-accent">Grinding</span>
          </h2>

          <p className="max-w-md mx-auto text-center text-[13.5px] leading-relaxed text-landing-text-muted-alt font-landing-body">
            You're not alone. Thousands of developers are leveling up right now.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {WORLD_STATS.map((stat, i) => (
            <StatCard key={i} label={stat.label} value={stat.value} delay={0.08 + i * 0.07} />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <div key={i} className={i >= 3 ? "hidden md:block" : ""}>
              <TestimonialCard
                handle={t.handle}
                rank={t.rank}
                text={t.text}
                xp={t.xp}
                delay={0.16 + i * 0.08}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
