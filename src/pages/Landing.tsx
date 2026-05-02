import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useInView,
} from "framer-motion";
import Lenis from "lenis";
import Navbar from "../components/global/Navbar";
import Footer from "../components/global/Footer";
import Hero from "../components/landing/Hero";
import { RANKS } from "../constants/rank";
import { SKILLS } from "../constants/skills";
import LiveSystemPreview from "../components/landing/Features";

function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);
}

const HOW_IT_WORKS = [
  { step: "01", icon: "🎯", title: "Accept Quests",  desc: "Daily quests auto-generated from your GitHub activity, calendar, and stated goals. Each quest has XP, tags, and difficulty tiers.", color: "#818cf8" },
  { step: "02", icon: "⚡", title: "Earn XP",        desc: "Complete focus sessions, push commits, solve problems. Every productive action translates into quantified experience points.", color: "#a78bfa" },
  { step: "03", icon: "📈", title: "Level Up",       desc: "XP accumulates into levels. Levels unlock ranks, titles, cosmetic themes, and exclusive guild access.", color: "#c084fc" },
  { step: "04", icon: "🏆", title: "Build Identity", desc: "Your rank, skill tree, and achievements form a permanent developer identity — a living record of your journey.", color: "#e879f9" },
];

const WORLD_STATS = [
  { label: "XP Earned Today",  value: "84.2M",  color: "#a78bfa" },
  { label: "Active Players",   value: "31,420", color: "#818cf8" },
  { label: "Quests Completed", value: "218K",   color: "#c084fc" },
  { label: "Guilds Formed",    value: "4,200+", color: "#7dd3fc" },
];

const COMMITS = [4,7,2,9,5,12,8,3,11,6,9,14,7,5,10,13,8,6,11,15,9,7,12,10,4,8,13,6,11,9];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as any },
});

const GlowOrb = ({ className }: { className: string }) => (
  <div className={`absolute rounded-full blur-[120px] pointer-events-none select-none ${className}`} />
);

const SectionBadge = ({ text }: { text: string }) => (
  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
    style={{ background: "rgba(109,40,217,0.12)", border: "1px solid rgba(139,92,246,0.28)" }}>
    <span style={{ color: "#a78bfa", fontSize: 12 }}>✦</span>
    <span className="font-medium tracking-widest uppercase"
      style={{ fontSize: 10, color: "rgba(167,139,250,0.85)", letterSpacing: "0.14em", fontFamily: "'DM Sans', sans-serif" }}>
      {text}
    </span>
  </div>
);

const SectionHeading = ({ white, purple, sub }: { white: string; purple: string; sub: string }) => (
  <>
    <h2 className="font-black uppercase text-white leading-none mb-4"
      style={{ fontSize: "clamp(2.4rem,5.5vw,4.2rem)", fontFamily: "'Barlow', sans-serif", letterSpacing: "-0.02em" }}>
      {white}{" "}
      <span style={{
        background: "linear-gradient(135deg,#7c3aed 0%,#9333ea 40%,#a855f7 70%,#c084fc 100%)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
      }}>{purple}</span>
    </h2>
    <p className="max-w-lg mx-auto text-center leading-relaxed"
      style={{ fontSize: "clamp(0.85rem,1.3vw,0.95rem)", color: "rgba(190,175,230,0.45)", fontFamily: "'DM Sans', sans-serif" }}>
      {sub}
    </p>
  </>
);

type SkillItem = { name: string; level: number; max: number; color: string };
const SkillRow = ({ skill, delay }: { skill: SkillItem; delay: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="flex items-center gap-3">
      <span className="text-[11px] text-white/40 font-mono tracking-wide w-28 truncate">{skill.name}</span>
      <div className="flex gap-[3px] flex-1">
        {Array.from({ length: skill.max }).map((_, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, scaleY: 0.3 }}
            animate={inView ? { opacity: 1, scaleY: 1 } : {}}
            transition={{ delay: delay + i * 0.05, duration: 0.3 }}
            className="flex-1 h-1.5 rounded-[2px]"
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

const HowItWorks = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const headerY = useTransform(scrollYProgress, [0, 0.3], [60, 0]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.25], [0, 1]);

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden" style={{ background: "#05030f" }}>
      <GlowOrb className="w-[600px] h-[400px] bg-indigo-900/15 top-0 right-0" />
      <GlowOrb className="w-[400px] h-[400px] bg-purple-900/10 bottom-0 left-0" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div style={{ y: headerY, opacity: headerOpacity }} className="text-center mb-16">
          <SectionBadge text="How It Works" />
          <SectionHeading white="The" purple="Loop" sub="Four steps. One continuous cycle of growth." />
        </motion.div>

        <div className="relative">
          <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.25), transparent)" }} />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div key={i} {...fadeUp(0.15 + i * 0.1)}
                className="relative flex flex-col items-center text-center p-6 rounded-2xl group transition-all duration-300"
                style={{ background: "rgba(10,5,28,0.6)", border: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(20px)" }}
                whileHover={{ y: -4, borderColor: `${step.color}30` }}>
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `radial-gradient(ellipse at 50% 0%, ${step.color}12, transparent 60%)` }} />
                <div className="text-[10px] font-mono text-white/20 tracking-widest mb-4"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>{step.step}</div>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-5"
                  style={{ background: `${step.color}15`, border: `1px solid ${step.color}30` }}>{step.icon}</div>
                <h3 className="text-white font-black text-lg mb-3" style={{ fontFamily: "'Barlow', sans-serif" }}>{step.title}</h3>
                <p className="text-xs leading-relaxed"
                  style={{ color: "rgba(190,175,230,0.4)", fontFamily: "'DM Sans', sans-serif" }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div {...fadeUp(0.4)} className="mt-14 rounded-2xl overflow-hidden"
          style={{ background: "rgba(8,5,20,0.85)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(20px)" }}>
          <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            {["#ff5f57", "#febc2e", "#28c840"].map(c => (
              <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c, opacity: 0.75 }} />
            ))}
            <div className="text-[10px] font-mono tracking-widest ml-2"
              style={{ color: "rgba(167,139,250,0.3)", fontFamily: "'DM Sans', sans-serif" }}>
              COMMIT ACTIVITY · LIVE
            </div>
          </div>
          <div className="p-6">
            <div className="flex gap-1 flex-wrap mb-6">
              {COMMITS.map((val, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }} transition={{ delay: 0.1 + i * 0.025 }}
                  className="w-5 h-5 rounded-sm"
                  style={{
                    background: val === 0 ? "rgba(255,255,255,0.03)"
                      : val < 5 ? "rgba(99,102,241,0.3)"
                      : val < 9 ? "rgba(139,92,246,0.55)"
                      : "rgba(168,85,247,0.85)"
                  }} />
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "GitHub Commits", count: "1,284", color: "#34d399" },
                { label: "LeetCode Solved", count: "347",   color: "#818cf8" },
                { label: "Focus Hours",    count: "892h",  color: "#a78bfa" },
                { label: "Total XP",       count: "284K",  color: "#e879f9" },
              ].map((item, i) => (
                <motion.div key={i} {...fadeUp(0.3 + i * 0.08)} className="text-center">
                  <div className="font-black text-2xl mb-1"
                    style={{ color: item.color, fontFamily: "'Barlow', sans-serif" }}>{item.count}</div>
                  <div className="text-[10px] font-mono tracking-widest uppercase"
                    style={{ color: "rgba(190,175,230,0.3)", fontFamily: "'DM Sans', sans-serif" }}>{item.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const BuildCharacter = () => {
  const [activeRank, setActiveRank] = useState(2);
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0.1, 0.5], [80, 0]);
  const opacity = useTransform(scrollYProgress, [0.1, 0.4], [0, 1]);
  const rank = RANKS[activeRank];

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center py-24 overflow-hidden"
      style={{ background: "#04020d" }}>
      <GlowOrb className="w-[700px] h-[400px] bg-purple-900/15 bottom-0 left-1/2 -translate-x-1/2" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <motion.div style={{ y, opacity }} className="text-center mb-12">
          <SectionBadge text="Build Your Character" />
          <SectionHeading white="Earn Your" purple="Rank"
            sub="Five tiers of developer identity. Each rank reflects mastery, consistency, and depth of craft." />
        </motion.div>

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
                fontFamily: "'DM Sans', sans-serif",
              }}>
              {r.tier} · {r.name}
            </motion.button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div key={activeRank}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.35 }}
            className="mb-8 p-5 rounded-2xl border text-center"
            style={{ borderColor: `${rank.color}30`, background: rank.glow, backdropFilter: "blur(16px)" }}>
            <div className="text-3xl font-black mb-1"
              style={{ color: rank.color, fontFamily: "'Barlow', sans-serif" }}>
              TIER {rank.tier} · {rank.name}
            </div>
            <div className="text-sm" style={{ color: "rgba(190,175,230,0.4)", fontFamily: "'DM Sans', sans-serif" }}>
              {rank.desc}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <motion.div {...fadeUp(0.2)} className="p-6 rounded-2xl"
            style={{ background: "rgba(8,5,20,0.8)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(20px)" }}>
            <div className="text-[11px] font-mono tracking-widest uppercase mb-6"
              style={{ color: "rgba(167,139,250,0.35)", fontFamily: "'DM Sans', sans-serif" }}>Skill Tree</div>
            <div className="space-y-4">
              {SKILLS.map((skill, i) => <SkillRow key={i} skill={skill} delay={0.3 + i * 0.07} />)}
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.3)} className="p-6 rounded-2xl"
            style={{ background: "rgba(8,5,20,0.8)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(20px)" }}>
            <div className="text-[11px] font-mono tracking-widest uppercase mb-6"
              style={{ color: "rgba(167,139,250,0.35)", fontFamily: "'DM Sans', sans-serif" }}>Achievements</div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: "🏆", name: "First Merge",   rare: "COMMON",    color: "#64748b" },
                { icon: "⚡", name: "Speed Coder",   rare: "RARE",      color: "#6366f1" },
                { icon: "🔥", name: "30-Day Flame",  rare: "EPIC",      color: "#a855f7" },
                { icon: "💎", name: "Deep Worker",   rare: "LEGENDARY", color: "#e879f9" },
                { icon: "🎯", name: "Zero Bug Day",  rare: "EPIC",      color: "#a855f7" },
                { icon: "🌌", name: "Night Coder",   rare: "RARE",      color: "#6366f1" },
              ].map((ach, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }} transition={{ delay: 0.4 + i * 0.07 }}
                  whileHover={{ scale: 1.06, y: -3 }}
                  className="p-3 rounded-xl cursor-pointer group relative overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `radial-gradient(circle at 50% 0%, ${ach.color}15, transparent 60%)` }} />
                  <div className="text-2xl mb-2">{ach.icon}</div>
                  <div className="text-white/70 text-[11px] font-bold leading-tight"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}>{ach.name}</div>
                  <div className="text-[10px] font-mono mt-1 tracking-wider" style={{ color: ach.color }}>{ach.rare}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const SocialProof = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const opacity = useTransform(scrollYProgress, [0.1, 0.35], [0, 1]);
  const y = useTransform(scrollYProgress, [0.1, 0.4], [60, 0]);

  const testimonials = [
    { handle: "@0xmarcel", rank: "ARCHITECT III", text: "I've shipped more in the last 30 days than in the previous 6 months. Kyzen's quest system rewired how I think about work.", xp: "28,400 XP" },
    { handle: "@devkira_",  rank: "SENTINEL IV",  text: "The streak system is ruthless. Miss one day and you feel it. That friction is exactly the accountability I needed.", xp: "91,200 XP" },
    { handle: "@nullbyte",  rank: "CODER II",     text: "First time I've ever felt excited about LeetCode. When a hard problem becomes a quest with XP, your brain processes it differently.", xp: "14,700 XP" },
  ];

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden" style={{ background: "#05030f" }}>
      <GlowOrb className="w-[600px] h-[500px] bg-violet-900/15 top-0 right-0" />
      <GlowOrb className="w-[500px] h-[400px] bg-indigo-900/10 bottom-0 left-0" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div style={{ y, opacity }} className="text-center mb-16">
          <SectionBadge text="In-World Stats" />
          <SectionHeading white="The World is" purple="Grinding"
            sub="You're not alone. Thousands of developers are leveling up right now." />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {WORLD_STATS.map((stat, i) => (
            <motion.div key={i} {...fadeUp(0.1 + i * 0.08)}
              className="p-6 rounded-2xl text-center group transition-all duration-300"
              style={{ background: "rgba(10,5,28,0.6)", border: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(20px)" }}
              whileHover={{ borderColor: `${stat.color}25`, y: -3 }}>
              <div className="text-4xl font-black mb-2"
                style={{ color: stat.color, fontFamily: "'Barlow', sans-serif", textShadow: `0 0 30px ${stat.color}50` }}>
                {stat.value}
              </div>
              <div className="text-[10px] font-mono tracking-widest uppercase"
                style={{ color: "rgba(190,175,230,0.3)", fontFamily: "'DM Sans', sans-serif" }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div key={i} {...fadeUp(0.2 + i * 0.1)}
              whileHover={{ y: -4, scale: 1.01 }}
              className="p-6 rounded-2xl group relative overflow-hidden transition-all duration-300"
              style={{ background: "rgba(10,5,28,0.6)", border: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(20px)" }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.06), transparent 60%)" }} />
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: "rgba(109,40,217,0.3)", border: "1px solid rgba(139,92,246,0.3)" }}>
                  {t.handle[1].toUpperCase()}
                </div>
                <div>
                  <div className="text-white/80 text-xs font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>{t.handle}</div>
                  <div className="text-[10px] font-mono tracking-widest" style={{ color: "rgba(167,139,250,0.55)" }}>{t.rank}</div>
                </div>
                <div className="ml-auto text-[10px] font-mono" style={{ color: "rgba(52,211,153,0.65)" }}>{t.xp}</div>
              </div>
              <p className="text-sm leading-relaxed"
                style={{ color: "rgba(190,175,230,0.4)", fontFamily: "'DM Sans', sans-serif" }}>"{t.text}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function Landing() {
  useLenis();

  return (
    <div className="min-h-screen bg-[#07041a] overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        /* Disable native smooth-scroll — Lenis handles it */
        html { scroll-behavior: auto; }
        body { font-family: 'DM Sans', sans-serif; }
        h1, h2, h3, h4 { font-family: 'Barlow', sans-serif !important; }
        ::selection { background: rgba(139,92,246,0.3); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #07041a; }
        ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.4); border-radius: 2px; }
      `}</style>

      <Navbar />
      <Hero />
      <LiveSystemPreview />
      <HowItWorks />
      <BuildCharacter />
      <SocialProof />
      <Footer />
    </div>
  );
}