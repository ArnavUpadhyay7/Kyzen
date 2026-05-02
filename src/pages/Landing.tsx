import { useRef, useState } from "react";
import {
  motion, 
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import Navbar from "../components/global/Navbar";
import Footer from "../components/global/Footer";
import Hero from "../components/landing/Hero";
import { RANKS } from "../constants/rank";
import { SKILLS } from "../constants/skills";
import LiveSystemPreview from "../components/landing/LiveSystemPreview";

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