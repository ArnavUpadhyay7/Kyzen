import { useRef } from "react";
import { motion, useScroll, useTransform, } from "framer-motion";
import { borders, spacing, typography } from "../../design-system";
import { SectionBadge } from "../ui/SectionBadge";
import { SectionHeading } from "../ui/SectionHeading";
import { Card } from "../ui/Card";

export default function SocialProof() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const opacity = useTransform(scrollYProgress, [0.1, 0.35], [0, 1]);
  const y = useTransform(scrollYProgress, [0.1, 0.4], [60, 0]);

  const WORLD_STATS = [
    { label: "XP Earned Today", value: "84.2M", color: "#a78bfa" },
    { label: "Active Players", value: "31,420", color: "#818cf8" },
    { label: "Quests Completed", value: "218K", color: "#c084fc" },
    { label: "Guilds Formed", value: "4,200+", color: "#7dd3fc" },
  ];

  const testimonials = [
    { handle: "@0xmarcel", rank: "ARCHITECT III", text: "I've shipped more in the last 30 days than in the previous 6 months. Kyzen's quest system rewired how I think about work.", xp: "28,400 XP" },
    { handle: "@devkira_", rank: "SENTINEL IV", text: "The streak system is ruthless. Miss one day and you feel it. That friction is exactly the accountability I needed.", xp: "91,200 XP" },
    { handle: "@nullbyte", rank: "CODER II", text: "First time I've ever felt excited about LeetCode. When a hard problem becomes a quest with XP, your brain processes it differently.", xp: "14,700 XP" },
  ];

  return (
    <section ref={sectionRef} className={`relative ${spacing.sectionY} overflow-hidden`}>
      {/* Ambient — top-right and bottom-left, different from BuildCharacter */}
      <div className="absolute pointer-events-none rounded-full"
        style={{
          width: 700, height: 500, top: "-5%", right: "-8%",
          background: "radial-gradient(circle, rgba(109,40,217,0.09) 0%, transparent 70%)",
          filter: "blur(80px)",
        }} />
      <div className="absolute pointer-events-none rounded-full"
        style={{
          width: 500, height: 400, bottom: "-5%", left: "-8%",
          background: "radial-gradient(circle, rgba(79,22,220,0.07) 0%, transparent 70%)",
          filter: "blur(90px)",
        }} />

      <div className={`relative z-10 ${spacing.maxWidth} ${spacing.contentX}`}>
        <motion.div style={{ y, opacity }} className="text-center mb-16">
          <SectionBadge text="In-World Stats" />
          <SectionHeading white="The World is" purple="Grinding"
            sub="You're not alone. Thousands of developers are leveling up right now." />
        </motion.div>

        {/* World stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {WORLD_STATS.map((stat, i) => (
            <Card key={i} delay={0.1 + i * 0.08} className="p-6 text-center group" accentColor={stat.color}>
              <div className="text-4xl font-black mb-2"
                style={{ color: stat.color, fontFamily: typography.display, textShadow: `0 0 30px ${stat.color}50` }}>
                {stat.value}
              </div>
              <div className="text-[10px] font-mono tracking-widest uppercase"
                style={{ color: "rgba(190,175,230,0.3)", fontFamily: typography.body }}>{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <Card key={i} delay={0.2 + i * 0.1} className="p-6 group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: "rgba(109,40,217,0.3)", border: borders.accent }}>
                  {t.handle[1].toUpperCase()}
                </div>
                <div>
                  <div className="text-white/80 text-xs font-bold" style={{ fontFamily: typography.body }}>{t.handle}</div>
                  <div className="text-[10px] font-mono tracking-widest" style={{ color: "rgba(167,139,250,0.55)" }}>{t.rank}</div>
                </div>
                <div className="ml-auto text-[10px] font-mono" style={{ color: "rgba(52,211,153,0.65)" }}>{t.xp}</div>
              </div>
              <p className="text-sm leading-relaxed"
                style={{ color: "rgba(190,175,230,0.40)", fontFamily: typography.body }}>"{t.text}"</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};