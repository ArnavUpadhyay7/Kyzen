import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../components/Hero";

// Types
interface StatItem  { label: string; value: number; color: string }
interface QuestItem { title: string; xp: number; done: boolean; tag: string }
interface SkillItem { name: string; level: number; max: number; color: string }
interface RankItem  { name: string; tier: string; color: string; glow: string; desc: string }

// Data
const STATS: StatItem[] = [
  { label: "Focus",      value: 87, color: "#a78bfa" },
  { label: "Discipline", value: 74, color: "#818cf8" },
  { label: "Output",     value: 92, color: "#c084fc" },
  { label: "Recovery",   value: 61, color: "#7dd3fc" },
];

const QUESTS: QuestItem[] = [
  { title: "Ship feature branch before 18:00", xp: 450, done: true,  tag: "DEV"   },
  { title: "30-min deep work session",         xp: 200, done: true,  tag: "FOCUS" },
  { title: "Solve 2 LeetCode mediums",         xp: 300, done: false, tag: "DSA"   },
  { title: "Push daily commit streak",         xp: 150, done: false, tag: "HABIT" },
];

const SKILLS: SkillItem[] = [
  { name: "TypeScript",    level: 8, max: 10, color: "#818cf8" },
  { name: "System Design", level: 6, max: 10, color: "#a78bfa" },
  { name: "Focus Mode",    level: 9, max: 10, color: "#c084fc" },
  { name: "Consistency",   level: 7, max: 10, color: "#7dd3fc" },
  { name: "Deep Work",     level: 5, max: 10, color: "#f0abfc" },
];

const RANKS: RankItem[] = [
  { name: "INITIATE",  tier: "I",   color: "#64748b", glow: "rgba(100,116,139,0.3)", desc: "The starting point. Your code is sparse but the hunger is real." },
  { name: "CODER",     tier: "II",  color: "#6366f1", glow: "rgba(99,102,241,0.4)",  desc: "Patterns emerge. PRs get merged. The grind solidifies." },
  { name: "ARCHITECT", tier: "III", color: "#8b5cf6", glow: "rgba(139,92,246,0.5)",  desc: "Systems thinking. You design before you build." },
  { name: "SENTINEL",  tier: "IV",  color: "#a855f7", glow: "rgba(168,85,247,0.6)",  desc: "Legendary consistency. Your streak is unbroken." },
  { name: "KYZEN",     tier: "V",   color: "#e879f9", glow: "rgba(232,121,249,0.7)", desc: "The apex. You don't just build software — you shape craft." },
];

const HOW_IT_WORKS = [
  { step:"01", icon:"🎯", title:"Accept Quests",  desc:"Daily quests auto-generated from your GitHub activity, calendar, and stated goals. Each quest has XP, tags, and difficulty tiers.", color:"#818cf8" },
  { step:"02", icon:"⚡", title:"Earn XP",        desc:"Complete focus sessions, push commits, solve problems. Every productive action translates into quantified experience points.", color:"#a78bfa" },
  { step:"03", icon:"📈", title:"Level Up",       desc:"XP accumulates into levels. Levels unlock ranks, titles, cosmetic themes, and exclusive guild access.", color:"#c084fc" },
  { step:"04", icon:"🏆", title:"Build Identity", desc:"Your rank, skill tree, and achievements form a permanent developer identity — a living record of your journey.", color:"#e879f9" },
];

const WORLD_STATS = [
  { label: "XP Earned Today",  value: "84.2M",  color: "#a78bfa" },
  { label: "Active Players",   value: "31,420", color: "#818cf8" },
  { label: "Quests Completed", value: "218K",   color: "#c084fc" },
  { label: "Guilds Formed",    value: "4,200+", color: "#7dd3fc" },
];

const COMMITS = [4,7,2,9,5,12,8,3,11,6,9,14,7,5,10,13,8,6,11,15,9,7,12,10,4,8,13,6,11,9];

const GlowOrb = ({ className }: { className: string }) => (
  <div className={`absolute rounded-full blur-[120px] pointer-events-none select-none ${className}`} />
);

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as any },
});

const SectionLabel = ({ index, text }: { index: string; text: string }) => (
  <div className="text-purple-400/60 text-[11px] font-mono tracking-[0.3em] uppercase mb-4">
    {index} · {text}
  </div>
);

const AnimatedBar = ({ value, color, delay }: { value: number; color: string; delay: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="h-1.5 bg-white/5 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={inView ? { width: `${value}%` } : {}}
        transition={{ duration: 1.2, delay, ease: "easeOut" }}
        className="h-full rounded-full"
        style={{ background: `linear-gradient(90deg,${color}88,${color})` }}
      />
    </div>
  );
};

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
            className="flex-1 h-2 rounded-[2px]"
            style={{
              background: i < skill.level ? `linear-gradient(90deg,${skill.color}88,${skill.color})` : "rgba(255,255,255,0.05)",
              boxShadow: i < skill.level ? `0 0 6px ${skill.color}55` : "none",
            }}
          />
        ))}
      </div>
      <span className="text-[11px] font-mono w-4 text-right" style={{ color: skill.color }}>{skill.level}</span>
    </div>
  );
};

const StreakCalendar = () => {
  const weeks = 8; const days = 7;
  const data = useRef(Array.from({ length: weeks * days }, () => Math.random())).current;
  return (
    <div className="grid gap-[3px]" style={{ gridTemplateColumns: `repeat(${weeks},1fr)` }}>
      {Array.from({ length: weeks }).map((_, w) => (
        <div key={w} className="flex flex-col gap-[3px]">
          {Array.from({ length: days }).map((_, d) => {
            const v = data[w * days + d];
            return (
              <motion.div key={d}
                initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                transition={{ delay: 0.2 + (w * days + d) * 0.006 }}
                className="w-full aspect-square rounded-[2px]"
                style={{ background: v > 0.7 ? "rgba(168,85,247,0.9)" : v > 0.4 ? "rgba(139,92,246,0.5)" : v > 0.15 ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.04)" }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

const BentoCard = ({ children, className = "", delay = 0, glowColor = "rgba(139,92,246,0.08)" }: {
  children: React.ReactNode; className?: string; delay?: number; glowColor?: string;
}) => (
  <motion.div
    {...fadeUp(delay)}
    whileHover={{ scale: 1.012, y: -4 }}
    transition={{ type: "spring", stiffness: 280, damping: 28 }}
    className={`relative rounded-3xl border border-white/[0.07] overflow-hidden p-6 flex flex-col ${className}`}
    style={{ background: "rgba(8,6,20,0.75)", backdropFilter: "blur(24px)" }}
  >
    <div className="absolute inset-0 pointer-events-none"
      style={{ background: `radial-gradient(ellipse at 30% 0%, ${glowColor}, transparent 60%)` }} />
    {children}
  </motion.div>
);

const NetworkViz = () => {
  const nodes = [
    { cx: 100, cy: 90,  r: 22, icon: "⚡", color: "#a855f7" },
    { cx: 30,  cy: 40,  r: 14, icon: "📦", color: "#818cf8" },
    { cx: 170, cy: 40,  r: 14, icon: "🔮", color: "#c084fc" },
    { cx: 170, cy: 140, r: 14, icon: "⚔",  color: "#7dd3fc" },
    { cx: 30,  cy: 140, r: 14, icon: "🏆", color: "#e879f9" },
  ];
  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 200 180" className="w-full max-w-[200px]">
        {nodes.slice(1).map((n, i) => (
          <motion.line key={i} x1={nodes[0].cx} y1={nodes[0].cy} x2={n.cx} y2={n.cy}
            stroke={n.color} strokeOpacity="0.4" strokeWidth="1" strokeDasharray="4 4"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 + i * 0.15 }} />
        ))}
        {nodes.map((n, i) => (
          <motion.g key={i} initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.1 }}
            style={{ transformOrigin: `${n.cx}px ${n.cy}px` }}>
            <circle cx={n.cx} cy={n.cy} r={n.r} fill={`${n.color}20`} stroke={n.color} strokeOpacity="0.6" strokeWidth="1" />
            <circle cx={n.cx} cy={n.cy} r={n.r * 0.55} fill={`${n.color}40`} />
            <text x={n.cx} y={n.cy + 5} textAnchor="middle" fontSize={i === 0 ? 12 : 9} fill="white">{n.icon}</text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
};

const LiveSystemPreview = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end","end start"] });
  const headerY = useTransform(scrollYProgress, [0,0.3], [60,0]);
  const headerOpacity = useTransform(scrollYProgress, [0,0.25], [0,1]);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex flex-col justify-center py-24 overflow-hidden bg-[#02020c]">
      <GlowOrb className="w-[700px] h-[400px] bg-violet-900/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      <GlowOrb className="w-[300px] h-[300px] bg-purple-800/15 top-0 right-0" />
      <GlowOrb className="w-[250px] h-[250px] bg-indigo-900/15 bottom-0 left-0" />
      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
        <motion.div style={{ y: headerY, opacity: headerOpacity }} className="text-center mb-14">
          <SectionLabel index="01" text="Live System" />
          <h2 className="text-5xl md:text-6xl font-black text-white leading-tight" style={{ fontFamily:"'Syne',sans-serif" }}>
            Life as an <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">RPG</span>
          </h2>
          <p className="text-white/30 mt-4 max-w-lg mx-auto text-sm">Your habits, goals, and work sessions converted into game mechanics. Progress isn't abstract — it's measurable.</p>
        </motion.div>
        <div className="grid grid-cols-12 gap-4">
          <BentoCard delay={0.1} glowColor="rgba(139,92,246,0.14)" className="col-span-12 md:col-span-4 row-span-2">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-[11px] text-purple-400/60 font-mono tracking-[0.2em] uppercase mb-1">Daily XP</div>
                <div className="text-3xl font-black text-white" style={{ fontFamily:"'Syne',sans-serif" }}>⚡ Experience</div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[10px] font-mono tracking-widest">ACTIVE</span>
            </div>
            <p className="text-white/30 text-xs leading-relaxed mb-5">Every commit, focus session, and completed task earns XP. Your effort is never invisible.</p>
            <div className="space-y-3 mb-5">
              {STATS.map((s, i) => (
                <div key={s.label} className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-white/40 tracking-widest uppercase">{s.label}</span>
                    <span style={{ color: s.color }} className="font-bold">{s.value}</span>
                  </div>
                  <AnimatedBar value={s.value} color={s.color} delay={0.2+i*0.1} />
                </div>
              ))}
            </div>
            <div className="mt-auto space-y-3">
              <div>
                <div className="text-[10px] font-mono text-white/30 mb-1.5 flex justify-between"><span>LVL 42</span><span>14,320 / 18,000 XP</span></div>
                <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div initial={{ width:0 }} whileInView={{ width:"79%" }} viewport={{ once:true }}
                    transition={{ duration:1.5, delay:0.4, ease:"easeOut" }}
                    className="h-full rounded-full"
                    style={{ background:"linear-gradient(90deg,#7c3aed,#a855f7,#e879f9)", boxShadow:"0 0 12px rgba(168,85,247,0.5)" }} />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-center">
                  <div className="text-[10px] text-orange-400/60 font-mono uppercase mb-0.5">Streak</div>
                  <div className="text-xl font-black text-orange-400">34🔥</div>
                </div>
                <div className="flex-1 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                  <div className="text-[10px] text-emerald-400/60 font-mono uppercase mb-0.5">Done</div>
                  <div className="text-xl font-black text-emerald-400">12✓</div>
                </div>
              </div>
            </div>
          </BentoCard>
          <BentoCard delay={0.2} glowColor="rgba(99,102,241,0.1)" className="col-span-12 md:col-span-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-[11px] text-indigo-400/60 font-mono tracking-[0.2em] uppercase mb-1">Quest System</div>
                <div className="text-2xl font-black text-white" style={{ fontFamily:"'Syne',sans-serif" }}>🏹 Quests</div>
              </div>
            </div>
            <p className="text-white/30 text-xs leading-relaxed mb-4">Auto-generated from your GitHub activity, calendar, and goals.</p>
            <div className="space-y-2">
              {QUESTS.map((q, i) => (
                <motion.div key={i} initial={{ opacity:0,x:-10 }} whileInView={{ opacity:1,x:0 }} viewport={{ once:true }}
                  transition={{ delay:0.3+i*0.08 }}
                  className={`flex items-center gap-3 p-3 rounded-xl border ${q.done?"border-emerald-500/20 bg-emerald-500/5":"border-white/5 bg-white/2"}`}>
                  <div className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] flex-shrink-0 font-bold ${q.done?"bg-emerald-500 text-black":"border border-white/20"}`}>{q.done?"✓":""}</div>
                  <div className="flex-1 min-w-0"><div className={`text-xs truncate ${q.done?"text-white/25 line-through":"text-white/75"}`}>{q.title}</div></div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ color:"#a78bfa",background:"rgba(167,139,250,0.1)" }}>{q.tag}</span>
                    <span className="text-[10px] font-mono text-yellow-400/70 whitespace-nowrap">+{q.xp}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </BentoCard>
          <BentoCard delay={0.3} glowColor="rgba(249,115,22,0.08)" className="col-span-12 md:col-span-3">
            <div className="mb-3">
              <div className="text-[11px] text-orange-400/60 font-mono tracking-[0.2em] uppercase mb-1">Streak Engine</div>
              <div className="text-2xl font-black text-white" style={{ fontFamily:"'Syne',sans-serif" }}>🔥 Streaks</div>
            </div>
            <p className="text-white/30 text-[11px] leading-relaxed mb-4">Maintain momentum chains. Break one and your score drops.</p>
            <div className="flex-1 mb-4"><StreakCalendar /></div>
            <div className="text-center pt-2 border-t border-white/5">
              <div className="text-3xl font-black text-orange-400">34</div>
              <div className="text-[10px] text-orange-400/50 font-mono uppercase tracking-wider">day streak</div>
            </div>
          </BentoCard>
          <BentoCard delay={0.15} glowColor="rgba(192,132,252,0.1)" className="col-span-12 md:col-span-5">
            <div className="mb-4">
              <div className="text-[11px] text-purple-400/60 font-mono tracking-[0.2em] uppercase mb-1">Skill Trees</div>
              <div className="text-2xl font-black text-white" style={{ fontFamily:"'Syne',sans-serif" }}>🧠 Mastery</div>
            </div>
            <p className="text-white/30 text-xs leading-relaxed mb-6">Unlock branches in DSA, System Design, Deep Work. Your growth, mapped visually.</p>
            <div className="space-y-3 mt-auto">{SKILLS.map((s,i)=><SkillRow key={i} skill={s} delay={0.2+i*0.07}/>)}</div>
          </BentoCard>
          <BentoCard delay={0.35} glowColor="rgba(99,102,241,0.12)" className="col-span-12 md:col-span-3">
            <div className="mb-3">
              <div className="text-[11px] text-indigo-400/60 font-mono tracking-[0.2em] uppercase mb-1">Guild Network</div>
              <div className="text-2xl font-black text-white" style={{ fontFamily:"'Syne',sans-serif" }}>⚔ Social</div>
            </div>
            <p className="text-white/30 text-[11px] leading-relaxed mb-3">Form parties, compete in weekly wars, share quests with your guild.</p>
            <div className="flex-1 flex items-center justify-center min-h-[140px]"><NetworkViz /></div>
          </BentoCard>
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end","end start"] });
  const headerY = useTransform(scrollYProgress, [0,0.3], [60,0]);
  const headerOpacity = useTransform(scrollYProgress, [0,0.25], [0,1]);
  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden bg-[#030308]">
      <GlowOrb className="w-[600px] h-[400px] bg-indigo-900/20 top-0 right-0" />
      <GlowOrb className="w-[400px] h-[400px] bg-purple-900/15 bottom-0 left-0" />
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div style={{ y: headerY, opacity: headerOpacity }} className="text-center mb-16">
          <SectionLabel index="02" text="How It Works" />
          <h2 className="text-5xl md:text-6xl font-black text-white" style={{ fontFamily:"'Syne',sans-serif" }}>
            The <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Loop</span>
          </h2>
          <p className="text-white/30 mt-4 max-w-lg mx-auto text-sm">Four steps. One continuous cycle of growth.</p>
        </motion.div>
        <div className="relative">
          <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div key={i} {...fadeUp(0.15+i*0.1)}
                className="relative flex flex-col items-center text-center p-6 rounded-3xl border border-white/6 bg-white/2 group hover:border-purple-500/20 transition-all duration-300">
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background:`radial-gradient(ellipse at 50% 0%, ${step.color}10, transparent 60%)` }} />
                <div className="text-[10px] font-mono text-white/20 tracking-widest mb-4">{step.step}</div>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-5"
                  style={{ background:`${step.color}15`, border:`1px solid ${step.color}30` }}>{step.icon}</div>
                <h3 className="text-white font-black text-lg mb-3" style={{ fontFamily:"'Syne',sans-serif" }}>{step.title}</h3>
                <p className="text-white/30 text-xs leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <motion.div {...fadeUp(0.4)} className="mt-16 rounded-2xl border border-white/8 overflow-hidden"
          style={{ background:"rgba(8,6,18,0.9)", backdropFilter:"blur(20px)" }}>
          <div className="p-4 border-b border-white/5 flex items-center gap-2">
            {["#ff5f57","#febc2e","#28c840"].map(c=><div key={c} className="w-2.5 h-2.5 rounded-full" style={{background:c}}/>)}
            <div className="text-[10px] text-white/20 font-mono tracking-widest ml-2">COMMIT ACTIVITY · LIVE</div>
          </div>
          <div className="p-6">
            <div className="flex gap-1 flex-wrap mb-6">
              {COMMITS.map((val,i)=>(
                <motion.div key={i} initial={{opacity:0,scale:0}} whileInView={{opacity:1,scale:1}} viewport={{once:true}}
                  transition={{delay:0.1+i*0.025}} className="w-5 h-5 rounded-sm"
                  style={{background:val===0?"rgba(255,255,255,0.03)":val<5?"rgba(99,102,241,0.3)":val<9?"rgba(139,92,246,0.55)":"rgba(168,85,247,0.85)"}}/>
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[{label:"GitHub Commits",count:"1,284",color:"#34d399"},{label:"LeetCode Solved",count:"347",color:"#818cf8"},{label:"Focus Hours",count:"892h",color:"#a78bfa"},{label:"Total XP",count:"284K",color:"#e879f9"}].map((item,i)=>(
                <motion.div key={i} {...fadeUp(0.3+i*0.08)} className="text-center">
                  <div className="font-black text-2xl mb-1" style={{color:item.color,fontFamily:"'Syne',sans-serif"}}>{item.count}</div>
                  <div className="text-[10px] font-mono text-white/30 tracking-widest uppercase">{item.label}</div>
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
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end","end start"] });
  const y = useTransform(scrollYProgress, [0.1,0.5], [80,0]);
  const opacity = useTransform(scrollYProgress, [0.1,0.4], [0,1]);
  const rank = RANKS[activeRank];
  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center py-24 overflow-hidden bg-[#02020c]">
      <GlowOrb className="w-[700px] h-[400px] bg-purple-900/20 bottom-0 left-1/2 -translate-x-1/2" />
      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
        <motion.div style={{ y, opacity }} className="text-center mb-12">
          <SectionLabel index="03" text="Build Your Character" />
          <h2 className="text-5xl md:text-6xl font-black text-white" style={{ fontFamily:"'Syne',sans-serif" }}>
            Earn Your <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Rank</span>
          </h2>
          <p className="text-white/30 mt-4 max-w-lg mx-auto text-sm">Five tiers of developer identity. Each rank reflects mastery, consistency, and depth of craft.</p>
        </motion.div>
        <motion.div style={{ y, opacity }} className="flex justify-center gap-3 mb-10 flex-wrap">
          {RANKS.map((r, i) => (
            <motion.button key={i} onClick={()=>setActiveRank(i)} whileHover={{scale:1.05}} whileTap={{scale:0.95}}
              className="px-5 py-2.5 rounded-xl border text-[11px] font-mono tracking-widest uppercase transition-all duration-300"
              style={{ borderColor:activeRank===i?r.color:"rgba(255,255,255,0.08)", color:activeRank===i?r.color:"rgba(255,255,255,0.3)", background:activeRank===i?r.glow:"transparent", boxShadow:activeRank===i?`0 0 20px ${r.glow}`:"none" }}>
              {r.tier} · {r.name}
            </motion.button>
          ))}
        </motion.div>
        <AnimatePresence mode="wait">
          <motion.div key={activeRank}
            initial={{opacity:0,y:10,scale:0.98}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:-10,scale:0.98}}
            transition={{duration:0.35}} className="mb-8 p-5 rounded-2xl border text-center"
            style={{borderColor:`${rank.color}30`,background:rank.glow,backdropFilter:"blur(16px)"}}>
            <div className="text-4xl font-black mb-2" style={{color:rank.color,fontFamily:"'Syne',sans-serif"}}>TIER {rank.tier} · {rank.name}</div>
            <div className="text-white/40 text-sm">{rank.desc}</div>
          </motion.div>
        </AnimatePresence>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div {...fadeUp(0.2)} className="p-6 rounded-3xl border border-white/8" style={{background:"rgba(8,6,18,0.8)",backdropFilter:"blur(20px)"}}>
            <div className="text-[11px] text-white/20 font-mono tracking-widest uppercase mb-6">Skill Tree</div>
            <div className="space-y-4">{SKILLS.map((skill,i)=><SkillRow key={i} skill={skill} delay={0.3+i*0.07}/>)}</div>
          </motion.div>
          <motion.div {...fadeUp(0.3)} className="p-6 rounded-3xl border border-white/8" style={{background:"rgba(8,6,18,0.8)",backdropFilter:"blur(20px)"}}>
            <div className="text-[11px] text-white/20 font-mono tracking-widest uppercase mb-6">Achievements</div>
            <div className="grid grid-cols-3 gap-3">
              {[{icon:"🏆",name:"First Merge",rare:"COMMON",color:"#64748b"},{icon:"⚡",name:"Speed Coder",rare:"RARE",color:"#6366f1"},{icon:"🔥",name:"30-Day Flame",rare:"EPIC",color:"#a855f7"},{icon:"💎",name:"Deep Worker",rare:"LEGENDARY",color:"#e879f9"},{icon:"🎯",name:"Zero Bug Day",rare:"EPIC",color:"#a855f7"},{icon:"🌌",name:"Night Coder",rare:"RARE",color:"#6366f1"}].map((ach,i)=>(
                <motion.div key={i} initial={{opacity:0,scale:0.8}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{delay:0.4+i*0.07}}
                  whileHover={{scale:1.06,y:-3}} className="p-3 rounded-2xl border border-white/5 bg-white/2 cursor-pointer group relative overflow-hidden">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{background:`radial-gradient(circle at 50% 0%,${ach.color}15,transparent 60%)`}}/>
                  <div className="text-2xl mb-2">{ach.icon}</div>
                  <div className="text-white/70 text-[11px] font-bold leading-tight">{ach.name}</div>
                  <div className="text-[10px] font-mono mt-1 tracking-wider" style={{color:ach.color}}>{ach.rare}</div>
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
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end","end start"] });
  const opacity = useTransform(scrollYProgress, [0.1,0.35], [0,1]);
  const y = useTransform(scrollYProgress, [0.1,0.4], [60,0]);
  const testimonials = [
    { handle:"@0xmarcel", rank:"ARCHITECT III", text:"I've shipped more in the last 30 days than in the previous 6 months. Kyzen's quest system rewired how I think about work.", xp:"28,400 XP" },
    { handle:"@devkira_",  rank:"SENTINEL IV",  text:"The streak system is ruthless. Miss one day and you feel it. That friction is exactly the accountability I needed.", xp:"91,200 XP" },
    { handle:"@nullbyte",  rank:"CODER II",     text:"First time I've ever felt excited about LeetCode. When a hard problem becomes a quest with XP, your brain processes it differently.", xp:"14,700 XP" },
  ];
  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden bg-[#030308]">
      <GlowOrb className="w-[600px] h-[500px] bg-violet-900/20 top-0 right-0" />
      <GlowOrb className="w-[500px] h-[400px] bg-indigo-900/15 bottom-0 left-0" />
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div style={{ y, opacity }} className="text-center mb-16">
          <SectionLabel index="04" text="In-World Stats" />
          <h2 className="text-5xl md:text-6xl font-black text-white" style={{ fontFamily:"'Syne',sans-serif" }}>
            The <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">World</span> is Grinding
          </h2>
          <p className="text-white/30 mt-4 max-w-lg mx-auto text-sm">You're not alone. Thousands of developers are leveling up right now.</p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {WORLD_STATS.map((stat,i)=>(
            <motion.div key={i} {...fadeUp(0.1+i*0.08)} className="p-6 rounded-3xl border border-white/6 bg-white/2 text-center group hover:border-purple-500/20 transition-all">
              <div className="text-4xl font-black mb-2" style={{color:stat.color,fontFamily:"'Syne',sans-serif",textShadow:`0 0 30px ${stat.color}60`}}>{stat.value}</div>
              <div className="text-[10px] font-mono text-white/30 tracking-widest uppercase">{stat.label}</div>
            </motion.div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t,i)=>(
            <motion.div key={i} {...fadeUp(0.2+i*0.1)} whileHover={{y:-4,scale:1.01}}
              className="p-6 rounded-3xl border border-white/6 bg-white/2 group hover:border-purple-500/15 transition-all relative overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{background:"radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.06), transparent 60%)"}}/>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-xs">{t.handle[1].toUpperCase()}</div>
                <div>
                  <div className="text-white/80 text-xs font-mono font-bold">{t.handle}</div>
                  <div className="text-[10px] font-mono text-purple-400/60 tracking-widest">{t.rank}</div>
                </div>
                <div className="ml-auto text-[10px] font-mono text-emerald-400/70">{t.xp}</div>
              </div>
              <p className="text-white/40 text-sm leading-relaxed">"{t.text}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#03020e] overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800;900&family=JetBrains+Mono:wght@300;400;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        * { font-family: 'JetBrains Mono', monospace; }
        h1, h2, h3 { font-family: 'Syne', sans-serif !important; }
        ::selection { background: rgba(139,92,246,0.3); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #03020e; }
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