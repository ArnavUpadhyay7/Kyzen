import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { gradients, borders, shadows, anim, typography } from "../../design-system";

const { fadeUp } = anim;

function Diamond({ style }: { style: React.CSSProperties }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        width: 9, height: 9,
        background: "rgba(139,92,246,0.45)",
        rotate: 45,
        ...style,
      }}
      animate={{ y: [0, -12, 0], opacity: [0.35, 0.8, 0.35] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function Bullet({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span style={{ color: "rgba(167,139,250,0.55)", fontSize: 13 }} className="flex-shrink-0">{icon}</span>
      <span className="text-[13px]" style={{ color: "rgba(200,185,240,0.55)", fontFamily: typography.body }}>{text}</span>
    </div>
  );
}

function IconBox({ children, color = "rgba(109,40,217,0.3)" }: { children: React.ReactNode; color?: string }) {
  return (
    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4 flex-shrink-0"
      style={{ background: color, border: borders.accent, boxShadow: "0 0 20px rgba(109,40,217,0.18)" }}>
      {children}
    </div>
  );
}

function BentoCard({
  children, className = "", delay = 0,
  glowColor = "rgba(109,40,217,0.12)", glowPos = "50% 0%", featured = false,
}: {
  children: React.ReactNode; className?: string; delay?: number;
  glowColor?: string; glowPos?: string; featured?: boolean;
}) {
  return (
    <motion.div
      {...fadeUp(delay)}
      whileHover={{ scale: 1.012, y: -4 }}
      transition={{ type: "spring", stiffness: 280, damping: 28 }}
      className={`relative rounded-2xl overflow-hidden flex flex-col ${className}`}
      style={{
        background: featured ? "rgba(18,8,45,0.88)" : "rgba(10,5,28,0.65)",
        border: featured ? borders.featured : borders.subtle,
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        boxShadow: featured ? shadows.cardFeatured : shadows.card,
      }}
    >
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at ${glowPos}, ${glowColor}, transparent 60%)` }} />
      <div className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{ background: featured ? gradients.cardEdgeShimmerFeatured : gradients.cardEdgeShimmer }} />
      <div className="relative z-10 h-full p-6 flex flex-col">
        {children}
      </div>
    </motion.div>
  );
}

// ─── ILLUSTRATIONS ────────────────────────────────────────────────────────────
function QuestIllustration() {
  return (
    <div className="flex-1 flex items-end justify-center min-h-35 relative">
      <svg viewBox="0 0 160 140" className="w-36 h-32 opacity-80">
        <defs>
          <radialGradient id="scrollGlow" cx="50%" cy="80%" r="60%">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="scrollBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4c1d95" />
            <stop offset="100%" stopColor="#2e1065" />
          </linearGradient>
        </defs>
        <ellipse cx="80" cy="125" rx="55" ry="10" fill="url(#scrollGlow)" />
        <rect x="42" y="20" width="76" height="90" rx="6" fill="url(#scrollBody)" stroke="rgba(139,92,246,0.5)" strokeWidth="1" />
        <rect x="36" y="14" width="88" height="16" rx="8" fill="#3b0764" stroke="rgba(139,92,246,0.6)" strokeWidth="1" />
        <rect x="36" y="90" width="88" height="16" rx="8" fill="#3b0764" stroke="rgba(139,92,246,0.6)" strokeWidth="1" />
        {[35, 47, 59, 71].map((y, i) => (
          <rect key={i} x="54" y={y} width={30 + (i % 2) * 14} height="3" rx="1.5" fill="rgba(139,92,246,0.35)" />
        ))}
        <circle cx="80" cy="78" r="14" fill="rgba(109,40,217,0.4)" stroke="rgba(139,92,246,0.6)" strokeWidth="1" />
        <text x="80" y="83" textAnchor="middle" fontSize="14" fill="rgba(196,181,253,0.9)">✦</text>
      </svg>
    </div>
  );
}

function XPIllustration() {
  return (
    <div className="flex-1 flex items-end justify-center min-h-[160px] relative">
      <svg viewBox="0 0 180 170" className="w-44 h-40">
        <defs>
          <radialGradient id="xpGlow" cx="50%" cy="85%" r="50%">
            <stop offset="0%" stopColor="#9333ea" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#9333ea" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="topFace" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          <linearGradient id="leftFace" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6d28d9" />
            <stop offset="100%" stopColor="#4c1d95" />
          </linearGradient>
          <linearGradient id="rightFace" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5b21b6" />
            <stop offset="100%" stopColor="#3b0764" />
          </linearGradient>
        </defs>
        <ellipse cx="90" cy="150" rx="60" ry="12" fill="url(#xpGlow)" />
        <polygon points="90,50 140,75 90,100 40,75" fill="url(#topFace)" stroke="rgba(196,181,253,0.4)" strokeWidth="0.8" />
        <polygon points="40,75 90,100 90,140 40,115" fill="url(#leftFace)" stroke="rgba(139,92,246,0.3)" strokeWidth="0.8" />
        <polygon points="140,75 90,100 90,140 140,115" fill="url(#rightFace)" stroke="rgba(109,40,217,0.4)" strokeWidth="0.8" />
        <polygon points="90,18 108,42 98,42 98,65 82,65 82,42 72,42" fill="#c084fc" opacity="0.9" stroke="rgba(232,121,249,0.5)" strokeWidth="0.8" />
        <text x="90" y="120" textAnchor="middle" fontSize="20" fontWeight="900" fill="white" fontFamily="Barlow, sans-serif" opacity="0.95">03</text>
        <text x="90" y="132" textAnchor="middle" fontSize="7" fill="rgba(196,181,253,0.6)" letterSpacing="3">LEVEL</text>
      </svg>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-28 h-4 rounded-full"
        style={{ background: "radial-gradient(ellipse, rgba(139,92,246,0.5) 0%, transparent 70%)", filter: "blur(6px)" }} />
    </div>
  );
}

function StreakIllustration() {
  return (
    <div className="flex-1 flex items-end justify-center min-h-[140px] relative">
      <svg viewBox="0 0 160 150" className="w-36 h-36">
        <defs>
          <radialGradient id="fireGlow" cx="50%" cy="90%" r="55%">
            <stop offset="0%" stopColor="#9333ea" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#9333ea" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="flame1" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="60%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#e9d5ff" />
          </linearGradient>
        </defs>
        <ellipse cx="80" cy="136" rx="45" ry="9" fill="url(#fireGlow)" />
        <path d="M80,22 C80,22 105,50 108,80 C111,100 100,118 80,124 C60,118 49,100 52,80 C55,50 80,22 80,22Z" fill="url(#flame1)" opacity="0.9" />
        <path d="M80,45 C80,45 95,65 96,85 C97,98 89,108 80,111 C71,108 63,98 64,85 C65,65 80,45 80,45Z" fill="rgba(232,121,249,0.5)" />
        <circle cx="80" cy="92" r="28" fill="none" stroke="rgba(139,92,246,0.35)" strokeWidth="1.5" strokeDasharray="5 4" />
        <rect x="108" y="55" width="40" height="46" rx="8" fill="rgba(15,8,40,0.9)" stroke="rgba(139,92,246,0.5)" strokeWidth="1" />
        <text x="128" y="72" textAnchor="middle" fontSize="7" fill="rgba(167,139,250,0.6)" letterSpacing="1">STREAK</text>
        <text x="128" y="90" textAnchor="middle" fontSize="18" fontWeight="900" fill="white" fontFamily="Barlow, sans-serif">14</text>
        <text x="128" y="100" textAnchor="middle" fontSize="6" fill="rgba(167,139,250,0.5)" letterSpacing="1">DAYS</text>
      </svg>
    </div>
  );
}

function SkillTreeIllustration() {
  const nodes = [
    { cx: 100, cy: 30, label: "🧠", size: 22 },
    { cx: 55, cy: 75, label: "💪", size: 18 },
    { cx: 145, cy: 75, label: "📖", size: 18 },
    { cx: 40, cy: 125, label: "❤️", size: 16 },
    { cx: 100, cy: 125, label: "🔒", size: 16 },
    { cx: 160, cy: 125, label: "🎯", size: 16 },
  ];
  const edges = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5]];
  return (
    <div className="flex-1 flex items-center justify-center min-h-[140px]">
      <svg viewBox="0 0 200 155" className="w-40 h-36">
        {edges.map(([a, b], i) => (
          <motion.line key={i}
            x1={nodes[a].cx} y1={nodes[a].cy} x2={nodes[b].cx} y2={nodes[b].cy}
            stroke="rgba(139,92,246,0.4)" strokeWidth="1.5" strokeDasharray="4 3"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }} />
        ))}
        {nodes.map((n, i) => (
          <motion.g key={i} initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: `${n.cx}px ${n.cy}px` }}>
            <circle cx={n.cx} cy={n.cy} r={n.size + 4} fill="none" stroke="rgba(139,92,246,0.15)" strokeWidth="1" />
            <circle cx={n.cx} cy={n.cy} r={n.size} fill="rgba(88,28,220,0.35)" stroke="rgba(139,92,246,0.5)" strokeWidth="1" />
            <text x={n.cx} y={n.cy + 5} textAnchor="middle" fontSize={n.size * 0.85}>{n.label}</text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}

function DevIllustration() {
  return (
    <div className="flex-1 flex items-end justify-end min-h-[140px] relative overflow-hidden">
      <div className="absolute top-2 right-0 z-20">
        <div className="px-3 py-2 rounded-xl text-right"
          style={{ background: "rgba(10,5,28,0.92)", border: borders.accent, backdropFilter: "blur(12px)" }}>
          <div className="text-[9px] font-mono tracking-widest uppercase mb-0.5" style={{ color: "rgba(167,139,250,0.55)", fontFamily: typography.mono }}>TOTAL XP</div>
          <div className="text-2xl font-black text-white" style={{ fontFamily: typography.display, lineHeight: 1 }}>2,450</div>
          <div className="text-[10px] font-mono" style={{ color: "#a855f7", fontFamily: typography.mono }}>+250 today</div>
        </div>
      </div>
      <div className="w-48 rounded-xl overflow-hidden"
        style={{ background: "rgba(8,4,22,0.92)", border: borders.subtle }}>
        <div className="flex items-center gap-1.5 px-3 py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          {["#ff5f57","#febc2e","#28c840"].map(c => (
            <div key={c} className="w-2 h-2 rounded-full" style={{ background: c, opacity: 0.7 }} />
          ))}
        </div>
        <div className="p-3 font-mono text-[9px] leading-5">
          <div><span style={{ color: "#c084fc" }}>const</span> <span style={{ color: "#7dd3fc" }}>xp</span> <span style={{ color: "white" }}>= </span><span style={{ color: "#86efac" }}>2450</span></div>
          <div><span style={{ color: "#c084fc" }}>function</span> <span style={{ color: "#fbbf24" }}>commit</span><span style={{ color: "white" }}>()</span></div>
          <div style={{ paddingLeft: 10 }}><span style={{ color: "#86efac" }}>"+250 XP"</span></div>
          <div className="mt-2 flex flex-wrap gap-[2px]">
            {Array.from({ length: 40 }).map((_, i) => {
              const v = [0.8,0.3,0.9,0.1,0.7,0.5,0.2,0.85,0.4,0.6,0.75,0.15,0.9,0.35,0.55,0.8,0.25,0.7,0.45,0.95,0.1,0.6,0.8,0.3,0.7,0.5,0.9,0.2,0.65,0.85,0.4,0.75,0.15,0.9,0.5,0.3,0.8,0.6,0.25,0.7][i];
              return <div key={i} className="w-2 h-2 rounded-[1px]"
                style={{ background: v > 0.65 ? "rgba(168,85,247,0.9)" : v > 0.35 ? "rgba(109,40,217,0.5)" : "rgba(255,255,255,0.06)" }} />;
            })}
          </div>
        </div>
        <div className="flex items-center justify-center py-2" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="rgba(139,92,246,0.7)">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const Features = () => {
  const sectionRef = useRef(null);

  // Drive the header reveal off scroll — starts as soon as this section enters view
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const headerY = useTransform(scrollYProgress, [0, 0.18], [40, 0]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);

  return (
    <section ref={sectionRef} className="relative pt-20 pb-28 overflow-hidden">
      {/* Floating diamonds */}
      <Diamond style={{ top: "15%", left: "8%", width: 8, height: 8 }} />
      <Diamond style={{ top: "35%", right: "6%", width: 10, height: 10 }} />
      <Diamond style={{ top: "65%", left: "5%", width: 7, height: 7 }} />
      <Diamond style={{ bottom: "20%", right: "10%", width: 9, height: 9 }} />
      <Diamond style={{ top: "20%", right: "18%", width: 6, height: 6 }} />

      {/* Ambient orbs — distinct from other sections */}
      <div className="absolute pointer-events-none rounded-full"
        style={{
          width: 700, height: 500, top: "5%", left: "50%", transform: "translateX(-50%)",
          background: "radial-gradient(circle, rgba(109,40,217,0.09) 0%, transparent 68%)",
          filter: "blur(90px)",
        }} />
      <div className="absolute pointer-events-none rounded-full"
        style={{
          width: 400, height: 400, bottom: "10%", right: "-8%",
          background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 68%)",
          filter: "blur(80px)",
        }} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 w-full">
        {/* Section header */}
        <motion.div style={{ y: headerY, opacity: headerOpacity }} className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
            style={{ background: "rgba(109,40,217,0.12)", border: borders.accent }}>
            <span style={{ color: "#a78bfa", fontSize: 12 }}>✦</span>
            <span className="font-medium tracking-widest uppercase"
              style={{ fontSize: 10, color: "rgba(167,139,250,0.85)", letterSpacing: "0.14em", fontFamily: typography.body }}>
              Built for Growth
            </span>
          </div>

          <h2 className="font-black uppercase text-white leading-none mb-5"
            style={{ fontSize: "clamp(2.8rem,7vw,5.5rem)", fontFamily: typography.display, letterSpacing: "-0.02em" }}>
            Level Up Your
            <span className="block font-black uppercase"
              style={{
                fontSize: "clamp(3.6rem,8vw,6.4rem)",
                fontFamily: typography.display,
                background: gradients.purpleText,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
              System
            </span>
          </h2>

          <p className="max-w-xl mx-auto leading-relaxed text-center"
            style={{ fontSize: "clamp(0.88rem,1.4vw,1rem)", color: "rgba(190,175,230,0.5)", fontFamily: typography.body }}>
            Build habits, earn XP, and evolve your character.<br />
            Kyzen turns your daily grind into a progression system that actually feels rewarding.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <BentoCard delay={0.1} glowColor="rgba(99,102,241,0.12)" glowPos="30% 0%">
            <IconBox>📋</IconBox>
            <h3 className="font-black text-white text-xl mb-2" style={{ fontFamily: typography.display }}>Daily Quests &amp; Missions</h3>
            <p className="text-sm mb-5" style={{ color: "rgba(190,175,230,0.45)", fontFamily: typography.body, lineHeight: 1.6 }}>
              Turn tasks into structured quests with rewards.
            </p>
            <div className="space-y-2.5 mb-4">
              <Bullet icon="◎" text="Daily / Weekly challenges" />
              <Bullet icon="✦" text="XP rewards on completion" />
              <Bullet icon="▐" text="Dynamic difficulty scaling" />
            </div>
            <QuestIllustration />
          </BentoCard>

          <BentoCard delay={0.18} featured glowColor="rgba(139,92,246,0.2)" glowPos="50% 10%">
            <div className="flex items-start gap-3 mb-1">
              <IconBox color="rgba(139,92,246,0.4)">
                <span className="text-white font-black text-base" style={{ fontFamily: typography.display }}>XP</span>
              </IconBox>
            </div>
            <h3 className="font-black text-white text-xl mb-2" style={{ fontFamily: typography.display }}>Real-Time XP &amp; Leveling</h3>
            <p className="text-sm mb-5" style={{ color: "rgba(190,175,230,0.45)", fontFamily: typography.body, lineHeight: 1.6 }}>
              Every action contributes to your growth.
            </p>
            <div className="space-y-2.5 mb-4">
              <Bullet icon="⚡" text="Instant XP feedback" />
              <Bullet icon="↗" text="Level progression system" />
              <Bullet icon="◎" text="Visual progress tracking" />
            </div>
            <XPIllustration />
          </BentoCard>

          <BentoCard delay={0.26} glowColor="rgba(168,85,247,0.1)" glowPos="70% 0%">
            <IconBox color="rgba(139,92,246,0.3)">🔥</IconBox>
            <h3 className="font-black text-white text-xl mb-2" style={{ fontFamily: typography.display }}>Streaks &amp; Consistency</h3>
            <p className="text-sm mb-5" style={{ color: "rgba(190,175,230,0.45)", fontFamily: typography.body, lineHeight: 1.6 }}>
              Stay locked in and build momentum.
            </p>
            <div className="space-y-2.5 mb-4">
              <Bullet icon="📅" text="Daily streak tracking" />
              <Bullet icon="↑" text="Multipliers for consistency" />
              <Bullet icon="◎" text="Recovery systems (no harsh resets)" />
            </div>
            <StreakIllustration />
          </BentoCard>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BentoCard delay={0.14} glowColor="rgba(192,132,252,0.1)" glowPos="20% 50%">
            <div className="flex flex-col md:flex-row gap-6 h-full">
              <div className="flex-1">
                <IconBox>🔗</IconBox>
                <h3 className="font-black text-white text-xl mb-2" style={{ fontFamily: typography.display }}>Skill Trees &amp; Stats</h3>
                <p className="text-sm mb-5" style={{ color: "rgba(190,175,230,0.45)", fontFamily: typography.body, lineHeight: 1.6 }}>
                  Upgrade real-life abilities like a game.
                </p>
                <div className="space-y-2.5">
                  <Bullet icon="🧠" text="Logic, Discipline, Health, Focus" />
                  <Bullet icon="↑" text="Level-based progression" />
                  <Bullet icon="🔒" text="Unlock advanced perks" />
                </div>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <SkillTreeIllustration />
              </div>
            </div>
          </BentoCard>

          <BentoCard delay={0.22} glowColor="rgba(125,211,252,0.07)" glowPos="80% 50%">
            <div className="flex flex-col md:flex-row gap-6 h-full">
              <div className="flex-1">
                <IconBox color="rgba(88,28,220,0.35)">
                  <span className="text-[13px] font-mono" style={{ color: "rgba(196,181,253,0.9)", fontFamily: typography.mono }}>{"</>"}</span>
                </IconBox>
                <h3 className="font-black text-white text-xl mb-2" style={{ fontFamily: typography.display }}>Built for Developers</h3>
                <p className="text-sm mb-5" style={{ color: "rgba(190,175,230,0.45)", fontFamily: typography.body, lineHeight: 1.6 }}>
                  Connect your actual work to your progress.
                </p>
                <div className="space-y-2.5">
                  <Bullet icon="⬡" text="GitHub activity → XP" />
                  <Bullet icon="◇" text="Coding time tracking" />
                  <Bullet icon="▐" text="Real productivity signals" />
                </div>
              </div>
              <div className="flex-1 flex items-end justify-end">
                <DevIllustration />
              </div>
            </div>
          </BentoCard>
        </div>
      </div>
    </section>
  );
};

export default Features;