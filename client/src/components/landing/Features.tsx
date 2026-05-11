import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { typography } from "./design-system";
import { Link } from "react-router-dom";

// ── Design tokens ─────────────────────────────────────────────────────────────
const T = {
  text:     "rgba(255,255,255,0.88)",
  textSub:  "rgba(200,185,235,0.55)",
  textMute: "rgba(160,145,200,0.38)",
  border:   "rgba(255,255,255,0.06)",
  borderHov:"rgba(139,92,246,0.32)",
  surface:  "rgba(10,6,24,0.72)",
  purpleLo: "rgba(109,40,217,0.10)",
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as any },
});

// ── Illustration components ───────────────────────────────────────────────────

function GoalRings() {
  const rings = [
    { r: 54, pct: 0.83, color: "#a855f7", delay: 0.1 },
    { r: 38, pct: 0.65, color: "#818cf8", delay: 0.2 },
    { r: 22, pct: 0.91, color: "#c084fc", delay: 0.3 },
  ];
  return (
    <div className="flex items-center justify-center py-6">
      <svg viewBox="0 0 140 140" className="w-32 h-32">
        <defs>
          <radialGradient id="fg-rg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.2"/>
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0"/>
          </radialGradient>
        </defs>
        <circle cx="70" cy="70" r="65" fill="url(#fg-rg)"/>
        {rings.map(({ r, pct, color, delay }, i) => {
          const circ = 2 * Math.PI * r;
          return (
            <g key={i}>
              <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="7"/>
              <motion.circle
                cx="70" cy="70" r={r}
                fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={circ}
                style={{ rotate: -90, transformOrigin: "70px 70px" }}
                whileInView={{ strokeDashoffset: circ * (1 - pct) }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
              />
            </g>
          );
        })}
        <text x="70" y="66" textAnchor="middle" fontSize="13" fontWeight="800" fill="white" fontFamily="Barlow,sans-serif">83%</text>
        <text x="70" y="80" textAnchor="middle" fontSize="6.5" fill="rgba(180,160,255,0.45)" letterSpacing="2.5" fontFamily="monospace">DONE</text>
      </svg>
    </div>
  );
}

function XPBars() {
  const bars = [
    { h: 32, on: true  }, { h: 52, on: true  }, { h: 28, on: true  },
    { h: 68, on: true  }, { h: 44, on: true  }, { h: 80, on: true  },
    { h: 38, on: false }, { h: 22, on: false },
  ];
  const days = ["M","T","W","T","F","S","S","M"];
  return (
    <div className="w-full">
      <div className="flex items-end gap-1.5 h-20">
        {bars.map(({ h, on }, i) => (
          <motion.div
            key={i} className="flex-1 rounded-[4px]"
            style={{
              background: on
                ? "linear-gradient(180deg,#a855f7 0%,#6d28d9 100%)"
                : "rgba(255,255,255,0.04)",
              border: on ? "1px solid rgba(168,85,247,0.25)" : "1px solid rgba(255,255,255,0.04)",
            }}
            initial={{ height: 0 }}
            whileInView={{ height: h }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 + i * 0.055, ease: [0.22,1,0.36,1] }}
          />
        ))}
      </div>
      <div className="flex mt-1.5">
        {days.map((d, i) => (
          <span key={i} className="flex-1 text-center text-[8px]" style={{ color: T.textMute, fontFamily: typography.mono }}>{d}</span>
        ))}
      </div>
    </div>
  );
}

function StreakDots() {
  const grid = [
    [1,1,0,1,1,1,0],
    [1,1,1,1,0,1,1],
    [0,1,1,1,1,1,0],
    [1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1],
    [1,1,1,1,1,0,0],
  ];
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {grid.map((row, ri) => (
        <div key={ri} className="flex gap-1.5">
          {row.map((on, ci) => (
            <motion.div
              key={ci}
              className="flex-1 h-4 rounded-[3px]"
              style={{
                background: on
                  ? ri >= 4 ? "linear-gradient(135deg,#c084fc,#7c3aed)" : "rgba(139,92,246,0.48)"
                  : "rgba(255,255,255,0.04)",
                border: on ? "1px solid rgba(192,132,252,0.18)" : "1px solid rgba(255,255,255,0.03)",
              }}
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.22, delay: (ri * 7 + ci) * 0.01 + 0.2 }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function CodeBlock() {
  const lines = [
    { k: "const",   v: " session = await kyzen.track()",   c: "#c084fc" },
    { k: "// +320", v: " XP earned today",                 c: "#86efac" },
    { k: "commit",  v: `.push({ xp: 80, skill: "React" })`,c: "#7dd3fc" },
    { k: "streak",  v: ".extend(today) // 🔥 27 days",     c: "#c084fc" },
  ];
  return (
    <div className="rounded-xl overflow-hidden" style={{ background:"rgba(4,2,12,0.95)", border:"1px solid rgba(255,255,255,0.055)" }}>
      <div className="flex items-center gap-1.5 px-3 py-2 border-b" style={{ borderColor:"rgba(255,255,255,0.04)" }}>
        {["#ff5f57","#febc2e","#28c840"].map(c => <div key={c} className="w-2 h-2 rounded-full opacity-65" style={{ background:c }}/>)}
        <span className="text-[8.5px] ml-2 tracking-widest" style={{ color:"rgba(167,139,250,0.3)", fontFamily:typography.mono }}>session.ts</span>
      </div>
      <div className="p-3 space-y-1">
        {lines.map((l, i) => (
          <motion.div key={i} className="text-[10px] leading-relaxed" style={{ fontFamily:typography.mono }}
            initial={{ opacity:0, x:-4 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
            transition={{ duration:0.3, delay:0.2 + i*0.08 }}>
            <span style={{ color:l.c }}>{l.k}</span>
            <span style={{ color:"rgba(200,185,235,0.38)" }}>{l.v}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Leaderboard() {
  const rows: [string, string, string, boolean][] = [
    ["01","⚡ Storm Clan",  "48,200 XP", true ],
    ["02","🔮 Arcane Dev",  "31,850 XP", false],
    ["03","🦅 Vanguard",    "29,400 XP", false],
    ["04","💎 Sigma Grind", "22,100 XP", false],
  ];
  return (
    <div className="space-y-1.5 w-full">
      {rows.map(([n, name, xp, top], i) => (
        <motion.div key={i} className="flex items-center justify-between px-3 py-2.5 rounded-xl"
          style={{ background: top ? "rgba(109,40,217,0.14)" : "rgba(255,255,255,0.025)", border:`1px solid ${top ? "rgba(139,92,246,0.28)" : "rgba(255,255,255,0.04)"}` }}
          initial={{ opacity:0, x:10 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
          transition={{ duration:0.35, delay:0.15 + i*0.07 }}>
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-bold w-4" style={{ color: top ? "#c084fc" : T.textMute, fontFamily:typography.mono }}>{n}</span>
            <span className="text-[11.5px] font-medium" style={{ color: top ? "rgba(225,210,255,0.9)" : T.textSub, fontFamily:typography.body }}>{name}</span>
          </div>
          <span className="text-[10px] font-semibold" style={{ color: top ? "#c084fc" : T.textMute, fontFamily:typography.mono }}>{xp}</span>
        </motion.div>
      ))}
    </div>
  );
}

// ── Feature Card ──────────────────────────────────────────────────────────────
type FeatureDef = {
  n: string; label: string;
  title: string; body: string;
  col: string;
  illustration: React.ReactNode;
  accent?: boolean;
  glowX?: string; glowY?: string;
};

function FeatureCard({ f, delay }: { f: FeatureDef; delay: number }) {
  const [hov, setHov] = useState(false);

  return (
    <motion.div
      {...fadeUp(delay)}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      whileHover={{ y: -3, scale: 1.005 }}
      className={`relative flex flex-col rounded-2xl overflow-hidden ${f.col}`}
      style={{
        background: f.accent ? "rgba(14,8,32,0.9)" : T.surface,
        border: `1px solid ${hov ? T.borderHov : T.border}`,
        backdropFilter: "blur(20px)",
        boxShadow: hov
          ? f.accent
            ? "0 12px 56px rgba(109,40,217,0.28), 0 2px 20px rgba(0,0,0,0.65)"
            : "0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(139,92,246,0.12)"
          : f.accent
            ? "0 6px 36px rgba(109,40,217,0.16), 0 2px 12px rgba(0,0,0,0.55)"
            : "0 2px 20px rgba(0,0,0,0.38)",
        transition: "box-shadow 0.3s ease, border-color 0.3s ease",
      }}
    >
      {/* Top edge shimmer */}
      <div className="absolute inset-x-0 top-0 h-px pointer-events-none z-10"
        style={{ background: f.accent
          ? "linear-gradient(90deg, transparent 8%, rgba(139,92,246,0.6) 50%, transparent 92%)"
          : `linear-gradient(90deg, transparent 15%, rgba(255,255,255,${hov?"0.1":"0.045"}) 50%, transparent 85%)`,
          transition: "background 0.3s ease" }} />

      {/* Ambient corner glow */}
      <div className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse 60% 55% at ${f.glowX ?? "80%"} ${f.glowY ?? "0%"}, rgba(109,40,217,${hov ? "0.14" : "0.07"}), transparent 70%)`,
          opacity: 1,
        }} />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full p-6 gap-4">
        {/* Tag */}
        <div className="flex items-center gap-2">
          <span className="text-[9.5px] font-semibold tracking-[0.18em] uppercase px-2.5 py-1 rounded-full"
            style={{ background: T.purpleLo, border:"1px solid rgba(139,92,246,0.22)", color:"rgba(192,166,255,0.72)", fontFamily:typography.mono }}>
            {f.n} / {f.label}
          </span>
        </div>

        {/* Title */}
        <div>
          <h3 className="font-black uppercase leading-[0.94] text-white mb-2"
            style={{ fontFamily:typography.display, fontSize:"clamp(1.1rem,2vw,1.45rem)", letterSpacing:"-0.02em" }}
            dangerouslySetInnerHTML={{ __html: f.title }} />
          <p className="text-[13px] leading-relaxed" style={{ color:T.textSub, fontFamily:typography.body }}>{f.body}</p>
        </div>

        {/* Illustration — pushed to bottom */}
        <div className="mt-auto pt-2">{f.illustration}</div>
      </div>
    </motion.div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "start start"] });
  const headerY = useTransform(scrollYProgress, [0, 1], [24, 0]);
  const MotionLink = motion(Link);

  const features: FeatureDef[] = [
    {
      n: "01", label: "Goal System",
      title: "Set Goals.<br/>Watch&nbsp;Them&nbsp;Fall.",
      body: "Daily and weekly targets structured into milestones. No willpower drama — just momentum that compounds.",
      col: "col-span-12 md:col-span-4 min-h-[420px]",
      accent: true,
      glowX: "30%", glowY: "10%",
      illustration: (
        <div className="flex flex-col gap-3">
          <GoalRings />
          <div className="grid grid-cols-2 gap-2">
            {[["Goals Hit","94%",true],["This Week","7/7",false]].map(([l,v,p]) => (
              <div key={String(l)} className="flex flex-col px-3 py-2.5 rounded-xl" style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.05)" }}>
                <span className="text-[1.4rem] font-black leading-none" style={{ fontFamily:typography.display, color: p ? "#c084fc" : "white" }}>{String(v)}</span>
                <span className="text-[8.5px] tracking-[0.14em] uppercase mt-1" style={{ color:T.textMute, fontFamily:typography.mono }}>{String(l)}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      n: "02", label: "XP & Leveling",
      title: "Every Action.<br/>Real&nbsp;Progress.",
      body: "Instant XP for every task you close. Watch your level climb — no lag between effort and reward.",
      col: "col-span-12 md:col-span-8 min-h-[220px]",
      accent: true,
      glowX: "75%", glowY: "0%",
      illustration: (
        <div className="flex flex-col sm:flex-row gap-6 items-end">
          <div className="flex items-center gap-3 flex-wrap">
            {[["Total XP","2,450",true],["Level","Lv.12",false],["Today","+320",true]].map(([l,v,p]) => (
              <div key={String(l)} className="flex flex-col px-3 py-2.5 rounded-xl" style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.05)" }}>
                <span className="text-[1.35rem] font-black leading-none" style={{ fontFamily:typography.display, color: p ? "#c084fc" : "white" }}>{String(v)}</span>
                <span className="text-[8px] tracking-[0.14em] uppercase mt-1" style={{ color:T.textMute, fontFamily:typography.mono }}>{String(l)}</span>
              </div>
            ))}
          </div>
          <div className="flex-1 min-w-[140px]"><XPBars /></div>
        </div>
      ),
    },
    {
      n: "03", label: "Streaks",
      title: "Momentum Is<br/>Your&nbsp;Superpower.",
      body: "Build streaks, multiply XP gains. Freeze tokens protect your chain when life gets in the way.",
      col: "col-span-12 md:col-span-5 min-h-[220px]",
      glowX: "20%", glowY: "50%",
      illustration: (
        <div className="flex flex-col sm:flex-row gap-5 items-end">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔥</span>
            <div className="flex flex-col px-3 py-2.5 rounded-xl" style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.05)" }}>
              <span className="text-[1.35rem] font-black leading-none" style={{ fontFamily:typography.display, color:"#c084fc" }}>27</span>
              <span className="text-[8px] tracking-[0.14em] uppercase mt-1" style={{ color:T.textMute, fontFamily:typography.mono }}>Streak</span>
            </div>
            <div className="flex flex-col px-3 py-2.5 rounded-xl" style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.05)" }}>
              <span className="text-[1.35rem] font-black leading-none" style={{ fontFamily:typography.display, color:"white" }}>×1.8</span>
              <span className="text-[8px] tracking-[0.14em] uppercase mt-1" style={{ color:T.textMute, fontFamily:typography.mono }}>Multiplier</span>
            </div>
          </div>
          <div className="flex-1 min-w-[120px]"><StreakDots /></div>
        </div>
      ),
    },
    {
      n: "04", label: "Dev Mode",
      title: "Real Work.<br/>Measured&nbsp;XP.",
      body: "Connect GitHub, track sessions, convert every commit into visible progress.",
      col: "col-span-12 md:col-span-3 min-h-[220px]",
      glowX: "80%", glowY: "20%",
      illustration: <CodeBlock />,
    },
    {
      n: "05", label: "Quests",
      title: "Side Quests.<br/>Main&nbsp;Missions.",
      body: "Structured challenges tied to real XP and skill points. Ship, learn, grow.",
      col: "col-span-12 md:col-span-4 min-h-[220px]",
      glowX: "50%", glowY: "90%",
      illustration: (
        <div className="space-y-2.5">
          {[
            { name:"Ship a side project", xp:"+200 XP", pct:70, c:"#a855f7" },
            { name:"Solve 5 LeetCode hard", xp:"+150 XP", pct:40, c:"#818cf8" },
            { name:"30-day streak", xp:"+500 XP", pct:90, c:"#c084fc" },
          ].map(({ name, xp, pct, c }) => (
            <div key={name}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[11px] font-medium" style={{ color:"rgba(210,195,255,0.7)", fontFamily:typography.body }}>{name}</span>
                <span className="text-[9.5px] font-semibold" style={{ color:c, fontFamily:typography.mono }}>{xp}</span>
              </div>
              <div className="h-1 rounded-full" style={{ background:"rgba(255,255,255,0.055)" }}>
                <motion.div className="h-full rounded-full" style={{ background:`linear-gradient(90deg,${c},${c}88)` }}
                  initial={{ width:0 }} whileInView={{ width:`${pct}%` }} viewport={{ once:true }}
                  transition={{ duration:0.75, delay:0.25, ease:[0.22,1,0.36,1] }} />
              </div>
            </div>
          ))}
        </div>
      ),
    }
  ];

  return (
    <section ref={sectionRef} className="relative py-28 overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background:"radial-gradient(ellipse 65% 40% at 50% 0%, rgba(88,28,220,0.08) 0%, transparent 70%)" }} />

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6">

        {/* ── Header ── */}
        <motion.div style={{ y: headerY }} className="mb-16">
          <motion.div {...fadeUp(0)} className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-10" style={{ background:"linear-gradient(90deg, transparent, rgba(139,92,246,0.5))" }} />
            <span className="text-[10px] tracking-[0.26em] uppercase font-semibold"
              style={{ color:"rgba(192,166,255,0.45)", fontFamily:typography.mono }}>
              Features
            </span>
            <div className="h-px w-10" style={{ background:"linear-gradient(90deg, rgba(139,92,246,0.5), transparent)" }} />
          </motion.div>

          <motion.h2 {...fadeUp(0.06)}
            className="text-center font-black uppercase leading-[0.93] mb-5"
            style={{ fontFamily:typography.display, fontSize:"clamp(2.6rem,6vw,4.8rem)", letterSpacing:"-0.025em" }}>
            <span className="text-white">Your life.</span>
            <br/>
            <span style={{
              background:"linear-gradient(110deg,#a855f7 0%,#818cf8 50%,#c084fc 100%)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
            }}>Gamified.</span>
          </motion.h2>

          <motion.p {...fadeUp(0.1)} className="text-center max-w-[440px] mx-auto text-[13.5px] leading-relaxed"
            style={{ color:T.textMute, fontFamily:typography.body }}>
            Kyzen turns real effort — goals, sessions, commits — into a living progression system
            that rewards consistency and fuels momentum.
          </motion.p>
        </motion.div>

        {/* ── Bento grid ── */}
        <div className="grid grid-cols-12 gap-3.5 auto-rows-auto">
          {features.map((f, i) => (
            <FeatureCard key={f.n} f={f} delay={0.04 + i * 0.05} />
          ))}
        </div>

        {/* ── CTA ── */}
        <motion.div {...fadeUp(0.24)} className="flex justify-center mt-16">
          <MotionLink
            to="/dashboard"
            whileHover={{
              scale: 1.03,
              boxShadow: "0 0 40px rgba(109,40,217,0.5), 0 4px 18px rgba(0,0,0,0.4)",
            }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2.5 rounded-full text-white font-medium cursor-pointer select-none"
            style={{
              fontFamily: typography.body,
              fontSize: 14,
              letterSpacing: "0.01em",
              paddingLeft: 28,
              paddingRight: 28,
              paddingTop: 13,
              paddingBottom: 13,
              background: "linear-gradient(135deg, #6d28d9 0%, #7c3aed 50%, #9333ea 100%)",
              boxShadow: "0 0 24px rgba(109,40,217,0.36), 0 2px 12px rgba(0,0,0,0.35)",
              border: "1px solid rgba(167,139,250,0.18)",
            }}
          >
            Explore Features
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </MotionLink>
        </motion.div>

      </div>
    </section>
  );
}