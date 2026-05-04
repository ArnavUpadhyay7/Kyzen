import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { palette, spacing, typography, anim } from "../../design-system";
import { SectionHeading } from "../ui/SectionHeading";
import { SectionBadge } from "../ui/SectionBadge";
import { Card } from "../ui/Card";

export default function HowItWorks() {

  const HOW_IT_WORKS = [
      {
        step: "01",
        icon: "🎯",
        title: "Define Your Quests",
        desc: "Your goals become structured missions. Pulled from your workflow, enriched with difficulty, rewards, and clear outcomes.",
        color: "#818cf8",
      },
      {
        step: "02",
        icon: "⚡",
        title: "Generate Real XP",
        desc: "Every commit, focus session, and completed task converts into experience points — instantly and automatically.",
        color: "#a78bfa",
      },
      {
        step: "03",
        icon: "📈",
        title: "Level & Unlock",
        desc: "Progress compounds into levels. Unlock new ranks, abilities, and deeper progression systems as you grow.",
        color: "#c084fc",
      },
      {
        step: "04",
        icon: "🏆",
        title: "Build Your Identity",
        desc: "Your skills, streaks, and achievements form a living developer profile — proof of consistent growth.",
        color: "#e879f9",
      },
  ];

  const COMMITS = [4,7,2,9,5,12,8,3,11,6,9,14,7,5,10,13,8,6,11,15,9,7,12,10,4,8,13,6,11,9];
  const { fadeUp } = anim;
  

  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const headerY = useTransform(scrollYProgress, [0, 0.3], [60, 0]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.25], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className={`relative ${spacing.sectionY} overflow-hidden`}>
      {/* Ambient — unique positions per section, shared palette */}
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: 600,
          height: 400,
          top: "-5%",
          right: "-8%",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.09) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: 500,
          height: 400,
          bottom: "-5%",
          left: "-8%",
          background:
            "radial-gradient(circle, rgba(109,40,217,0.08) 0%, transparent 70%)",
          filter: "blur(90px)",
        }}
      />

      <div className={`relative z-10 ${spacing.maxWidth} ${spacing.contentX}`}>
        <motion.div
          style={{ y: headerY, opacity: headerOpacity }}
          className="text-center mb-16">
          <SectionBadge text="How It Works" />
          <SectionHeading
            white="The"
            purple="Loop"
            sub="Four steps. One continuous cycle of growth."
          />
        </motion.div>

        <div className="relative">
          <div
            className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(139,92,246,0.20), transparent)",
            }}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {HOW_IT_WORKS.map((step, i) => (
              <Card
                key={i}
                delay={0.15 + i * 0.1}
                accentColor={step.color}
                className="group p-6 flex flex-col items-center text-center">
                <div
                  className="text-[10px] font-mono mb-4"
                  style={{
                    color: palette.text20,
                    letterSpacing: "0.14em",
                    fontFamily: typography.body,
                  }}>
                  {step.step}
                </div>
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-5"
                  style={{
                    background: `${step.color}15`,
                    border: `1px solid ${step.color}30`,
                  }}>
                  {step.icon}
                </div>
                <h3
                  className="text-white font-black text-lg mb-3"
                  style={{ fontFamily: typography.display }}>
                  {step.title}
                </h3>
                <p
                  className="text-xs leading-relaxed"
                  style={{
                    color: "rgba(190,175,230,0.40)",
                    fontFamily: typography.body,
                  }}>
                  {step.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Commit activity widget */}
        <Card delay={0.4} className="mt-14">
          <div
            className="flex items-center gap-2 px-4 py-3 border-b"
            style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
              <div
                key={c}
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: c, opacity: 0.75 }}
              />
            ))}
            <div
              className="text-[10px] font-mono tracking-widest ml-2"
              style={{
                color: "rgba(167,139,250,0.3)",
                fontFamily: typography.body,
              }}>
              COMMIT ACTIVITY · LIVE
            </div>
          </div>
          <div className="p-6">
            <div className="flex gap-1 flex-wrap mb-6">
              {COMMITS.map((val, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.025 }}
                  className="w-5 h-5 rounded-sm"
                  style={{
                    background:
                      val === 0
                        ? "rgba(255,255,255,0.03)"
                        : val < 5
                          ? "rgba(99,102,241,0.3)"
                          : val < 9
                            ? "rgba(139,92,246,0.55)"
                            : "rgba(168,85,247,0.85)",
                  }}
                />
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "GitHub Commits", count: "1,284", color: "#34d399" },
                { label: "LeetCode Solved", count: "347", color: "#818cf8" },
                { label: "Focus Hours", count: "892h", color: "#a78bfa" },
                { label: "Total XP", count: "284K", color: "#e879f9" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  {...fadeUp(0.3 + i * 0.08)}
                  className="text-center">
                  <div
                    className="font-black text-2xl mb-1"
                    style={{
                      color: item.color,
                      fontFamily: typography.display,
                    }}>
                    {item.count}
                  </div>
                  <div
                    className="text-[10px] font-mono tracking-widest uppercase"
                    style={{
                      color: "rgba(190,175,230,0.3)",
                      fontFamily: typography.body,
                    }}>
                    {item.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
