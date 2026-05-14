import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { typography } from "./design-system";

// ── Design tokens — blue system matching Hero/Features/HowItWorks ─────────────
const T = {
  bg: "#07090D",
  cardBg: "rgba(8,12,32,0.88)",
  cardInner: "rgba(255,255,255,0.025)",
  border: "rgba(77,124,255,0.16)",
  borderAcc: "rgba(110,168,255,0.32)",
  borderHov: "rgba(77,124,255,0.40)",
  blue: "#4D7CFF",
  blueMid: "#6EA8FF",
  blueLight: "#93C5FD",
  text: "rgba(245,247,255,0.88)",
  textSub: "rgba(180,200,240,0.58)",
  textMute: "rgba(130,155,210,0.42)",
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.58, delay, ease: [0.22, 1, 0.36, 1] as any },
});

// Blue top-edge shimmer — shared across Features, HowItWorks, now SocialProof
function BlueEdge({ bright }: { bright?: boolean }) {
  return (
    <div className="absolute inset-x-0 top-0 h-px pointer-events-none z-10" style={{
      background: bright
        ? "linear-gradient(90deg, transparent 5%, rgba(77,124,255,0.50) 28%, rgba(110,168,255,0.88) 50%, rgba(77,124,255,0.50) 72%, transparent 95%)"
        : "linear-gradient(90deg, transparent 15%, rgba(77,124,255,0.28) 50%, transparent 85%)",
    }} />
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, delay }: { label: string; value: string; delay: number }) {
  return (
    <motion.div {...fadeUp(delay)} className="relative rounded-2xl overflow-hidden p-6 text-center"
      style={{
        background: T.cardBg,
        border: `1px solid ${T.border}`,
        backdropFilter: "blur(20px)",
      }}>
      <BlueEdge bright />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(77,124,255,0.07) 0%, transparent 70%)",
      }} />
      <div className="relative z-10">
        <div className="font-black mb-1.5"
          style={{
            fontFamily: typography.display,
            fontSize: "clamp(2rem, 4vw, 2.8rem)",
            letterSpacing: "-0.03em",
            lineHeight: 1,
            background: `linear-gradient(135deg, #ffffff 0%, ${T.blueLight} 50%, ${T.blueMid} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            // Blue bloom behind the number
            filter: `drop-shadow(0 0 16px rgba(77,124,255,0.35))`,
          }}>
          {value}
        </div>
        <div className="text-[10px] tracking-[0.18em] uppercase mt-1"
          style={{ color: T.textMute, fontFamily: typography.mono }}>{label}</div>
      </div>
    </motion.div>
  );
}

// ── Testimonial card ──────────────────────────────────────────────────────────
function TestimonialCard({ handle, rank, text, xp, delay }: {
  handle: string; rank: string; text: string; xp: string; delay: number;
}) {
  return (
    <motion.div {...fadeUp(delay)} className="relative rounded-2xl overflow-hidden p-6"
      style={{
        background: T.cardBg,
        border: `1px solid ${T.border}`,
        backdropFilter: "blur(20px)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
      }}>
      <BlueEdge />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 60% 40% at 80% 0%, rgba(77,124,255,0.05) 0%, transparent 65%)",
      }} />

      <div className="relative z-10">
        {/* Header row */}
        <div className="flex items-center gap-3 mb-4">
          {/* Avatar */}
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, rgba(30,55,180,0.55), rgba(77,124,255,0.7))",
              border: `1px solid ${T.borderAcc}`,
              color: "#fff",
              fontFamily: typography.display,
              fontSize: 14,
            }}>
            {handle[1].toUpperCase()}
          </div>

          {/* Name + rank */}
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold"
              style={{ color: T.text, fontFamily: typography.body }}>{handle}</span>
            <span className="text-[9.5px] tracking-[0.12em] uppercase"
              style={{ color: T.textMute, fontFamily: typography.mono }}>{rank}</span>
          </div>

          {/* XP badge */}
          <div className="ml-auto flex-shrink-0 px-2 py-1 rounded-lg"
            style={{
              background: "rgba(77,124,255,0.10)",
              border: `1px solid ${T.border}`,
            }}>
            <span className="text-[9.5px] font-semibold"
              style={{ color: T.blueMid, fontFamily: typography.mono }}>
              {xp}
            </span>
          </div>
        </div>

        {/* Quote */}
        <p className="text-sm leading-relaxed"
          style={{ color: T.textSub, fontFamily: typography.body }}>
          "{text}"
        </p>
      </div>
    </motion.div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
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
    { handle: "@nullbyte", rank: "CODER II", text: "First time I've ever felt excited about LeetCode. When a hard problem becomes a quest with XP, your brain processes it differently.", xp: "14,700 XP" },
    { handle: "@nullbyte", rank: "CODER II", text: "First time I've ever felt excited about LeetCode. When a hard problem becomes a quest with XP, your brain processes it differently.", xp: "14,700 XP" },
    { handle: "@nullbyte", rank: "CODER II", text: "First time I've ever felt excited about LeetCode. When a hard problem becomes a quest with XP, your brain processes it differently.", xp: "14,700 XP" },
    { handle: "@nullbyte", rank: "CODER II", text: "First time I've ever felt excited about LeetCode. When a hard problem becomes a quest with XP, your brain processes it differently.", xp: "14,700 XP" },
    { handle: "@nullbyte", rank: "CODER II", text: "First time I've ever felt excited about LeetCode. When a hard problem becomes a quest with XP, your brain processes it differently.", xp: "14,700 XP" },
    { handle: "@nullbyte", rank: "CODER II", text: "First time I've ever felt excited about LeetCode. When a hard problem becomes a quest with XP, your brain processes it differently.", xp: "14,700 XP" },

  ];

  return (
    <section ref={sectionRef} className="relative py-28 overflow-hidden" style={{ background: T.bg }}>

      {/* Grid — same as Hero/Features/HowItWorks */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `
          linear-gradient(rgba(77,124,255,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(77,124,255,0.04) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        opacity: 0.65,
      }} />

      {/* Ambient glows — blue, not purple */}
      <div className="absolute pointer-events-none" style={{
        width: 700, height: 500, top: "-5%", right: "-8%",
        background: "radial-gradient(circle, rgba(77,124,255,0.07) 0%, transparent 68%)",
        filter: "blur(80px)",
      }} />
      <div className="absolute pointer-events-none" style={{
        width: 500, height: 400, bottom: "-5%", left: "-8%",
        background: "radial-gradient(circle, rgba(50,100,230,0.05) 0%, transparent 68%)",
        filter: "blur(90px)",
      }} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">

        {/* ── Section header ── */}
        <motion.div style={{ y, opacity }} className="text-center mb-16">

          {/* Label row — matches Features eyebrow */}
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-10" style={{ background: "linear-gradient(90deg, transparent, rgba(77,124,255,0.45))" }} />
            <span className="text-[10px] tracking-[0.26em] uppercase font-semibold"
              style={{ color: "rgba(110,168,255,0.52)", fontFamily: typography.mono }}>
              In-World Stats
            </span>
            <div className="h-px w-10" style={{ background: "linear-gradient(90deg, rgba(77,124,255,0.45), transparent)" }} />
          </div>

          {/* Heading — Barlow Condensed, blue accent matching Features/Hero */}
          <h2 className="text-center font-black uppercase leading-[0.93] mb-5"
            style={{
              fontFamily: typography.display,
              fontSize: "clamp(2.6rem, 6vw, 4.8rem)",
              letterSpacing: "-0.025em",
            }}>
            <span style={{ color: "#ffffff" }}>The World is</span>
            {" "}
            <span style={{
              background: "linear-gradient(135deg, #B7CCFF 0%, #6EA8FF 40%, #4D7CFF 75%, #7AA2FF 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Grinding
            </span>
          </h2>

          <p className="max-w-md mx-auto text-center text-[13.5px] leading-relaxed"
            style={{ color: T.textMute, fontFamily: typography.body }}>
            You're not alone. Thousands of developers are leveling up right now.
          </p>
        </motion.div>

        {/* ── World stats grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {WORLD_STATS.map((stat, i) => (
            <StatCard key={i} label={stat.label} value={stat.value} delay={0.08 + i * 0.07} />
          ))}
        </div>

        {/* ── Testimonials grid ── */}
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