import { useRef, useState } from "react";
import {AnimatePresence, motion, useScroll, useTransform} from "framer-motion";
import { RANKS } from "../../constants/rank";
import { SKILLS } from "../../constants/skills";
import { borders, spacing, typography } from "../../design-system";
import { SectionBadge } from "../ui/SectionBadge";
import { SectionHeading } from "../ui/SectionHeading";
import { Card } from "../ui/Card";
import { SkillRow } from "../ui/SkillRow";

export default function BuildCharacter () {
  const [activeRank, setActiveRank] = useState(2);
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0.1, 0.5], [80, 0]);
  const opacity = useTransform(scrollYProgress, [0.1, 0.4], [0, 1]);
  const rank = RANKS[activeRank];

  return (
    <section ref={sectionRef} className={`relative min-h-screen flex items-center ${spacing.sectionY} overflow-hidden`}>
      {/* Ambient — centered bottom, different shape from HowItWorks */}
      <div className="absolute pointer-events-none rounded-full"
        style={{
          width: 800, height: 500,
          bottom: "-10%", left: "50%", transform: "translateX(-50%)",
          background: "radial-gradient(circle, rgba(109,40,217,0.10) 0%, transparent 70%)",
          filter: "blur(100px)",
        }} />
      <div className="absolute pointer-events-none rounded-full"
        style={{
          width: 400, height: 400,
          top: "5%", left: "-5%",
          background: "radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)",
          filter: "blur(80px)",
        }} />

      <div className={`relative z-10 ${spacing.maxWidth} ${spacing.contentX} w-full`}>
        <motion.div style={{ y, opacity }} className="text-center mb-12">
          <SectionBadge text="Build Your Character" />
          <SectionHeading white="Earn Your" purple="Rank"
            sub="Five tiers of developer identity. Each rank reflects mastery, consistency, and depth of craft." />
        </motion.div>

        {/* Rank selector */}
        <motion.div style={{ y, opacity }} className="flex justify-center gap-2 mb-10 flex-wrap">
          {RANKS.map((r, i) => (
            <motion.button key={i} onClick={() => setActiveRank(i)}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-xl border text-[11px] font-mono tracking-widest uppercase transition-all duration-300"
              style={{
                borderColor: activeRank === i ? r.color : "rgba(255,255,255,0.08)",
                color: activeRank === i ? r.color : "rgba(255,255,255,0.3)",
                background: activeRank === i ? r.glow : "transparent",
                boxShadow: activeRank === i ? `0 0 20px ${r.glow}` : "none",
                fontFamily: typography.body,
              }}>
              {r.tier} · {r.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Active rank card */}
        <AnimatePresence mode="wait">
          <motion.div key={activeRank}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.35 }}
            className="mb-8 p-5 rounded-2xl border text-center"
            style={{ borderColor: `${rank.color}30`, background: rank.glow, backdropFilter: "blur(16px)" }}>
            <div className="text-3xl font-black mb-1"
              style={{ color: rank.color, fontFamily: typography.display }}>
              TIER {rank.tier} · {rank.name}
            </div>
            <div className="text-sm" style={{ color: "rgba(190,175,230,0.4)", fontFamily: typography.body }}>
              {rank.desc}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Skill tree + achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card delay={0.2} className="p-6">
            <div className="text-[11px] font-mono tracking-widest uppercase mb-6"
              style={{ color: "rgba(167,139,250,0.35)", fontFamily: typography.body }}>Skill Tree</div>
            <div className="space-y-4">
              {SKILLS.map((skill, i) => <SkillRow key={i} skill={skill} delay={0.3 + i * 0.07} />)}
            </div>
          </Card>

          <Card delay={0.3} className="p-6">
            <div className="text-[11px] font-mono tracking-widest uppercase mb-6"
              style={{ color: "rgba(167,139,250,0.35)", fontFamily: typography.body }}>Achievements</div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: "🏆", name: "First Merge",  rare: "COMMON",    color: "#64748b" },
                { icon: "⚡", name: "Speed Coder",  rare: "RARE",      color: "#6366f1" },
                { icon: "🔥", name: "30-Day Flame", rare: "EPIC",      color: "#a855f7" },
                { icon: "💎", name: "Deep Worker",  rare: "LEGENDARY", color: "#e879f9" },
                { icon: "🎯", name: "Zero Bug Day", rare: "EPIC",      color: "#a855f7" },
                { icon: "🌌", name: "Night Coder",  rare: "RARE",      color: "#6366f1" },
              ].map((ach, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }} transition={{ delay: 0.4 + i * 0.07 }}
                  whileHover={{ scale: 1.06, y: -3 }}
                  className="p-3 rounded-xl cursor-pointer group relative overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.02)", border: borders.subtle }}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `radial-gradient(circle at 50% 0%, ${ach.color}15, transparent 60%)` }} />
                  <div className="text-2xl mb-2">{ach.icon}</div>
                  <div className="text-white/70 text-[11px] font-bold leading-tight"
                    style={{ fontFamily: typography.body }}>{ach.name}</div>
                  <div className="text-[10px] font-mono mt-1 tracking-wider" style={{ color: ach.color }}>{ach.rare}</div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};