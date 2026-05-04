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
import { palette, gradients, borders, shadows, anim, typography, spacing } from "../design-system";

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
    return () => { cancelAnimationFrame(rafId); lenis.destroy(); };
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

const { fadeUp } = anim;

// ─── SHARED PRIMITIVES ───────────────────────────────────────────────────────

const SectionBadge = ({ text }: { text: string }) => (
  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
    style={{ background: "rgba(109,40,217,0.12)", border: borders.accent }}>
    <span style={{ color: "#a78bfa", fontSize: 12 }}>✦</span>
    <span className="font-medium tracking-widest uppercase"
      style={{ fontSize: 10, color: "rgba(167,139,250,0.85)", letterSpacing: "0.14em", fontFamily: typography.body }}>
      {text}
    </span>
  </div>
);

const SectionHeading = ({ white, purple, sub }: { white: string; purple: string; sub: string }) => (
  <>
    <h2 className="font-black uppercase text-white leading-none mb-4"
      style={{ fontSize: "clamp(2.4rem,5.5vw,4.2rem)", fontFamily: typography.display, letterSpacing: "-0.02em" }}>
      {white}{" "}
      <span style={{ background: gradients.purpleText, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
        {purple}
      </span>
    </h2>
    <p className="max-w-lg mx-auto text-center leading-relaxed"
      style={{ fontSize: "clamp(0.85rem,1.3vw,0.95rem)", color: "rgba(190,175,230,0.45)", fontFamily: typography.body }}>
      {sub}
    </p>
  </>
);

// ─── CARD WRAPPER ─────────────────────────────────────────────────────────────
type CardProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  featured?: boolean;
  accentColor?: string;
  hover?: boolean;
};

const Card = ({ children, className = "", delay = 0, featured = false, accentColor, hover = true }: CardProps) => (
  <motion.div
    {...fadeUp(delay)}
    whileHover={hover ? { y: -4, scale: 1.008 } : undefined}
    transition={{ type: "spring", stiffness: 280, damping: 28 }}
    className={`relative rounded-2xl overflow-hidden ${className}`}
    style={{
      background: featured ? "rgba(14,6,38,0.85)" : "rgba(10,5,28,0.65)",
      border: featured ? borders.featured : borders.subtle,
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      boxShadow: featured ? shadows.cardFeatured : shadows.card,
    }}
  >
    <div className="absolute inset-x-0 top-0 h-px pointer-events-none z-10"
      style={{ background: featured ? gradients.cardEdgeShimmerFeatured : gradients.cardEdgeShimmer }} />
    {accentColor && (
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-400"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${accentColor}18, transparent 55%)` }} />
    )}
    {children}
  </motion.div>
);

// ─── SKILL ROW ───────────────────────────────────────────────────────────────
type SkillItem = { name: string; level: number; max: number; color: string };
const SkillRow = ({ skill, delay }: { skill: SkillItem; delay: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="flex items-center gap-3">
      <span className="text-[11px] font-mono tracking-wide w-28 truncate" style={{ color: palette.text35 }}>{skill.name}</span>
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

// ─── HOW IT WORKS ─────────────────────────────────────────────────────────────
const HowItWorks = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const headerY = useTransform(scrollYProgress, [0, 0.3], [60, 0]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.25], [0, 1]);

  return (
    <section ref={sectionRef} className={`relative ${spacing.sectionY} overflow-hidden`}>
      {/* Ambient — unique positions per section, shared palette */}
      <div className="absolute pointer-events-none rounded-full"
        style={{
          width: 600, height: 400, top: "-5%", right: "-8%",
          background: "radial-gradient(circle, rgba(99,102,241,0.09) 0%, transparent 70%)",
          filter: "blur(80px)",
        }} />
      <div className="absolute pointer-events-none rounded-full"
        style={{
          width: 500, height: 400, bottom: "-5%", left: "-8%",
          background: "radial-gradient(circle, rgba(109,40,217,0.08) 0%, transparent 70%)",
          filter: "blur(90px)",
        }} />

      <div className={`relative z-10 ${spacing.maxWidth} ${spacing.contentX}`}>
        <motion.div style={{ y: headerY, opacity: headerOpacity }} className="text-center mb-16">
          <SectionBadge text="How It Works" />
          <SectionHeading white="The" purple="Loop" sub="Four steps. One continuous cycle of growth." />
        </motion.div>

        <div className="relative">
          <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.20), transparent)" }} />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {HOW_IT_WORKS.map((step, i) => (
              <Card key={i} delay={0.15 + i * 0.1} accentColor={step.color} className="group p-6 flex flex-col items-center text-center">
                <div className="text-[10px] font-mono mb-4" style={{ color: palette.text20, letterSpacing: "0.14em", fontFamily: typography.body }}>
                  {step.step}
                </div>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-5"
                  style={{ background: `${step.color}15`, border: `1px solid ${step.color}30` }}>
                  {step.icon}
                </div>
                <h3 className="text-white font-black text-lg mb-3" style={{ fontFamily: typography.display }}>{step.title}</h3>
                <p className="text-xs leading-relaxed"
                  style={{ color: "rgba(190,175,230,0.40)", fontFamily: typography.body }}>{step.desc}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Commit activity widget */}
        <Card delay={0.4} className="mt-14">
          <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            {["#ff5f57","#febc2e","#28c840"].map(c => (
              <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c, opacity: 0.75 }} />
            ))}
            <div className="text-[10px] font-mono tracking-widest ml-2"
              style={{ color: "rgba(167,139,250,0.3)", fontFamily: typography.body }}>
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
                      : val < 5  ? "rgba(99,102,241,0.3)"
                      : val < 9  ? "rgba(139,92,246,0.55)"
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
                    style={{ color: item.color, fontFamily: typography.display }}>{item.count}</div>
                  <div className="text-[10px] font-mono tracking-widest uppercase"
                    style={{ color: "rgba(190,175,230,0.3)", fontFamily: typography.body }}>{item.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

// ─── BUILD CHARACTER ──────────────────────────────────────────────────────────
const BuildCharacter = () => {
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

// ─── SOCIAL PROOF ─────────────────────────────────────────────────────────────
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

// ─── SECTION TRANSITION ───────────────────────────────────────────────────────
const SectionTransition = ({ flip = false }: { flip?: boolean }) => (
  <div
    className="relative h-32 pointer-events-none -my-1 z-10"
    style={{
      background: flip
        ? "linear-gradient(to top, rgba(109,40,217,0.04) 0%, transparent 100%)"
        : "linear-gradient(to bottom, rgba(109,40,217,0.04) 0%, transparent 100%)",
    }}
  />
);

// ─── ROOT LANDING ─────────────────────────────────────────────────────────────
export default function Landing() {
  useLenis();

  // Drive Hero scale + dim as the panel scrolls over it
  const scrollRef = useRef(null);
  const { scrollY } = useScroll();
  const heroScale = useTransform(scrollY, [0, window.innerHeight * 0.6], [1, 0.92]);
  const heroBrightness = useTransform(scrollY, [0, window.innerHeight * 0.5], [1, 0.35]);

  return (
    <div className="overflow-x-hidden" style={{ backgroundColor: palette.canvas }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: auto; }
        body { font-family: 'DM Sans', sans-serif; }
        h1, h2, h3, h4 { font-family: 'Barlow', sans-serif !important; }
        ::selection { background: rgba(139,92,246,0.3); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${palette.canvas}; }
        ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.4); border-radius: 2px; }
      `}</style>

      {/* ── NAVBAR — fixed, always on top ── */}
      <div className="fixed inset-x-0 top-0 z-[100]">
        <Navbar />
      </div>

      {/*
        ── HERO LAYER — truly fixed, never moves ──────────────────────────────
        Hero is position:fixed so it is completely frozen in the viewport.
        It scales down and dims as the content panel scrolls over it,
        giving a cinematic "scene receding behind new content" feel.
      */}
      <motion.div
        className="fixed inset-0 z-[10]"
        style={{
          scale: heroScale,
          filter: useTransform(heroBrightness, (v) => `brightness(${v})`),
          transformOrigin: "center center",
          willChange: "transform, filter",
        }}
      >
        <Hero />
      </motion.div>

      {/*
        ── SCROLL SPACER ─────────────────────────────────────────────────────
        This invisible div is 100vh tall and sits in normal document flow.
        It creates the scroll distance the user needs to travel before the
        panel starts appearing — so the page "waits" on the Hero for one
        full viewport height before anything else comes up.
      */}
      <div style={{ height: "100vh" }} aria-hidden />

      {/*
        ── CONTENT PANEL — slides up over the frozen Hero ────────────────────
        z-[30] puts it above the Hero (z-10). As the user scrolls past the
        spacer, this panel naturally rises into view from below the fold.
        The rounded top corners + glowing edge + deep shadow make it feel
        like a physical card lifting off the scene beneath.
      */}
      <div
        className="relative"
        style={{
          zIndex: 30,
          backgroundColor: palette.canvas,
          borderRadius: "32px 32px 0 0",
          boxShadow: `
            0 -1px 0 rgba(167,139,250,0.35),
            0 -2px 0 rgba(124,58,237,0.15),
            0 -60px 120px rgba(0,0,0,0.9),
            0 -30px 60px rgba(0,0,0,0.7)
          `,
          // Overflow hidden so border-radius clips children at the top
          overflow: "hidden",
        }}
      >
        {/* ── PANEL TOP EDGE — the glowing lip that appears first ── */}
        {/* Bright gradient line across the very top */}
        <div
          className="absolute inset-x-0 top-0 h-px pointer-events-none z-10"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(109,40,217,0.4) 15%, rgba(167,139,250,0.9) 40%, rgba(196,181,253,1) 50%, rgba(167,139,250,0.9) 60%, rgba(109,40,217,0.4) 85%, transparent 100%)",
          }}
        />
        {/* Inner bloom below the lip — purple aura bleeding downward */}
        <div
          className="absolute inset-x-0 top-0 pointer-events-none z-10"
          style={{
            height: 200,
            background: "radial-gradient(ellipse 70% 100% at 50% 0%, rgba(124,58,237,0.18) 0%, rgba(109,40,217,0.08) 40%, transparent 100%)",
          }}
        />
        {/* Subtle handle pill — visual affordance that there's content below */}
        <div className="flex justify-center pt-4 pb-0 relative z-10">
          <div
            className="w-10 h-1 rounded-full"
            style={{ background: "rgba(139,92,246,0.4)" }}
          />
        </div>

        {/* All sections live inside the panel */}
        <LiveSystemPreview />
        <SectionTransition flip />
        <HowItWorks />
        <SectionTransition />
        <BuildCharacter />
        <SectionTransition flip />
        <SocialProof />
        <Footer />
      </div>
    </div>
  );
}