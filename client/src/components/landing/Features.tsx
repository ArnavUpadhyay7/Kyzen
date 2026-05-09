import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { palette, typography } from "./design-system";

// ─── SHARED TOKENS ────────────────────────────────────────────────────────────
const V = {
  purple: "rgba(139,92,246,1)",
  purpleMid: "rgba(139,92,246,0.5)",
  purpleLow: "rgba(139,92,246,0.12)",
  border: "rgba(255,255,255,0.065)",
  borderAccent: "rgba(139,92,246,0.3)",
  text: "rgba(255,255,255,0.9)",
  textSub: "rgba(200,185,235,0.62)",
  textMuted: "rgba(170,155,210,0.42)",
  surface: "rgba(12,7,28,0.7)",
  surfaceHigh: "rgba(18,10,40,0.85)",
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as any },
});

// ─── CARD SHELL ───────────────────────────────────────────────────────────────
function Card({
  children,
  className = "",
  accent = false,
  delay = 0,
  glowPos = "50% 0%",
}: {
  children: React.ReactNode;
  className?: string;
  accent?: boolean;
  delay?: number;
  glowPos?: string;
}) {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      {...fadeUp(delay)}
      whileHover={{ y: -4, scale: 1.007 }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      className={`relative rounded-2xl overflow-hidden flex flex-col ${className}`}
      style={{
        background: accent ? V.surfaceHigh : V.surface,
        border: `1px solid ${accent ? V.borderAccent : V.border}`,
        backdropFilter: "blur(24px)",
        boxShadow: accent
          ? "0 8px 48px rgba(109,40,217,0.22), 0 2px 16px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)"
          : "0 4px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.035)",
      }}
    >
      {/* top shimmer */}
      <div
        className="absolute inset-x-0 top-0 h-px pointer-events-none z-10"
        style={{
          background: accent
            ? "linear-gradient(90deg, transparent 10%, rgba(139,92,246,0.65) 50%, transparent 90%)"
            : "linear-gradient(90deg, transparent 20%, rgba(255,255,255,0.07) 50%, transparent 80%)",
        }}
      />
      {/* ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(ellipse at ${glowPos}, rgba(109,40,217,${hov ? "0.16" : "0.09"}), transparent 55%)`,
        }}
      />
      {/* hover border */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={{ opacity: hov ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ border: "1px solid rgba(139,92,246,0.38)", borderRadius: "inherit" }}
      />
      <div className="relative z-10 flex flex-col h-full">{children}</div>
    </motion.div>
  );
}

// ─── LABEL TAG ────────────────────────────────────────────────────────────────
function Tag({ n, label }: { n: string; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span
        className="text-[10px] font-bold tracking-[0.18em] uppercase px-2.5 py-1 rounded-full"
        style={{
          background: V.purpleLow,
          border: `1px solid ${V.borderAccent}`,
          color: "rgba(192,166,255,0.82)",
          fontFamily: typography.mono,
        }}
      >
        {n} / {label}
      </span>
    </div>
  );
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="font-black uppercase leading-[0.95] text-white mb-2.5"
      style={{ fontFamily: typography.display, fontSize: "clamp(1.25rem, 2.2vw, 1.6rem)", letterSpacing: "-0.02em" }}
    >
      {children}
    </h3>
  );
}

function CardBody({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[13.5px] leading-relaxed" style={{ color: V.textSub, fontFamily: typography.body }}>
      {children}
    </p>
  );
}

// ─── STAT CHIP ────────────────────────────────────────────────────────────────
function Stat({ label, value, purple = false }: { label: string; value: string; purple?: boolean }) {
  return (
    <div
      className="flex flex-col px-4 py-3 rounded-xl"
      style={{ background: "rgba(255,255,255,0.032)", border: "1px solid rgba(255,255,255,0.052)" }}
    >
      <span
        className="text-[1.6rem] font-black leading-none tracking-tight"
        style={{ fontFamily: typography.display, color: purple ? "#c084fc" : "white" }}
      >
        {value}
      </span>
      <span className="text-[9px] tracking-[0.14em] uppercase mt-1" style={{ color: V.textMuted, fontFamily: typography.mono }}>
        {label}
      </span>
    </div>
  );
}

// ─── ILLUSTRATIONS ────────────────────────────────────────────────────────────

function RingsIllustration() {
  const rings = [
    { r: 82, dash: 515, offset: 105, color: "#a855f7", delay: 0.2 },
    { r: 64, dash: 402, offset: 130, color: "#818cf8", delay: 0.35 },
    { r: 46, dash: 289, offset: 55,  color: "#c084fc", delay: 0.5 },
  ];
  return (
    <div className="flex items-center justify-center flex-1 py-4">
      <svg viewBox="0 0 200 200" className="w-40 h-40">
        <defs>
          <radialGradient id="rg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="90" fill="url(#rg)" />
        {rings.map(({ r, dash, offset, color, delay }, i) => (
          <g key={i}>
            <circle cx="100" cy="100" r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="10" />
            <motion.circle
              cx="100" cy="100" r={r}
              fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
              strokeDasharray={dash} strokeDashoffset={dash}
              style={{ rotate: -90, transformOrigin: "100px 100px" }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.4, delay, ease: [0.22, 1, 0.36, 1] }}
            />
          </g>
        ))}
        <text x="100" y="96" textAnchor="middle" fontSize="14" fontWeight="800" fill="white" fontFamily="Barlow, sans-serif">83%</text>
        <text x="100" y="112" textAnchor="middle" fontSize="8" fill="rgba(192,166,255,0.5)" letterSpacing="2.5" fontFamily="JetBrains Mono, monospace">DONE</text>
      </svg>
    </div>
  );
}

function XPBarsIllustration() {
  const bars = [55, 80, 42, 95, 68, 112, 48, 30];
  const active = [true, true, true, true, true, true, false, false];
  return (
    <div className="w-full pt-2">
      <div className="flex items-end gap-1.5 h-24 px-1">
        {bars.map((h, i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-[5px]"
            style={{
              background: active[i]
                ? "linear-gradient(180deg, #a855f7 0%, #6d28d9 100%)"
                : "rgba(255,255,255,0.045)",
              border: active[i] ? "1px solid rgba(192,132,252,0.3)" : "1px solid rgba(255,255,255,0.04)",
            }}
            initial={{ height: 0 }}
            whileInView={{ height: h }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.12 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
      </div>
      <div className="flex px-1 mt-1.5">
        {["M","T","W","T","F","S","S","M"].map((d, i) => (
          <span key={i} className="flex-1 text-center text-[8.5px]" style={{ color: V.textMuted, fontFamily: typography.mono }}>{d}</span>
        ))}
      </div>
    </div>
  );
}

function StreakGrid() {
  const pattern = [1,1,0,1,1,1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1];
  const weeks = Array.from({ length: 6 }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => pattern[w * 7 + d] ?? 0)
  );
  return (
    <div className="flex flex-col gap-1.5 pt-3 mt-auto">
      {weeks.map((week, wi) => (
        <div key={wi} className="flex gap-1.5">
          {week.map((on, di) => (
            <motion.div
              key={di}
              className="flex-1 h-[18px] rounded-[3px]"
              style={{
                background: on
                  ? wi >= 4 ? "linear-gradient(135deg,#c084fc,#7c3aed)" : "rgba(139,92,246,0.5)"
                  : "rgba(255,255,255,0.04)",
                border: on ? "1px solid rgba(192,132,252,0.2)" : "1px solid rgba(255,255,255,0.03)",
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.28, delay: (wi * 7 + di) * 0.012 + 0.25 }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function CodeSnippet() {
  const lines = [
    { k: "const",   v: " session = await kyzen.track()" },
    { k: "// +320", v: " XP earned today" },
    { k: "commit",  v: `.push({ xp: 80, skill: "React" })` },
    { k: "streak",  v: ".extend(today) // 🔥 27 days" },
    { k: "rank",    v: `.update("Gold III") // ↑ 3` },
  ];
  const colors = ["#c084fc","#86efac","#7dd3fc","#c084fc","#fbbf24"];
  return (
    <div
      className="rounded-xl overflow-hidden mt-auto"
      style={{ background: "rgba(4,2,12,0.96)", border: "1px solid rgba(255,255,255,0.055)" }}
    >
      <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-white/[0.04]">
        {["#ff5f57","#febc2e","#28c840"].map(c => (
          <div key={c} className="w-2 h-2 rounded-full opacity-70" style={{ background: c }} />
        ))}
        <span className="text-[9px] ml-2 tracking-widest opacity-35" style={{ color: "#a78bfa", fontFamily: typography.mono }}>kyzen — session.ts</span>
      </div>
      <div className="p-3.5 space-y-1.5">
        {lines.map((l, i) => (
          <motion.div
            key={i}
            className="text-[10.5px] leading-relaxed"
            style={{ fontFamily: typography.mono }}
            initial={{ opacity: 0, x: -6 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: 0.28 + i * 0.09 }}
          >
            <span style={{ color: colors[i] }}>{l.k}</span>
            <span style={{ color: "rgba(200,185,235,0.42)" }}>{l.v}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ClanBoard() {
  const rows: [string, string, boolean][] = [
    ["⚡ Storm Clan", "48,200 XP", true],
    ["🔮 Arcane Dev", "31,850 XP", false],
    ["🦅 Vanguard",   "29,400 XP", false],
    ["💎 Sigma Grind","22,100 XP", false],
  ];
  return (
    <div className="space-y-2 mt-auto pt-3">
      {rows.map(([name, xp, top], i) => (
        <motion.div
          key={i}
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl"
          style={{
            background: top ? "rgba(139,92,246,0.14)" : "rgba(255,255,255,0.025)",
            border: `1px solid ${top ? "rgba(139,92,246,0.32)" : "rgba(255,255,255,0.042)"}`,
          }}
          initial={{ opacity: 0, x: 12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
        >
          <div className="flex items-center gap-2.5">
            <span
              className="text-[11px] font-bold tabular-nums w-5 text-center"
              style={{ color: top ? "#c084fc" : V.textMuted, fontFamily: typography.mono }}
            >
              {i + 1}
            </span>
            <span className="text-[12px] font-medium" style={{ color: top ? "rgba(230,215,255,0.9)" : V.textSub, fontFamily: typography.body }}>
              {name}
            </span>
          </div>
          <span className="text-[11px] font-semibold" style={{ color: top ? "#c084fc" : V.textMuted, fontFamily: typography.mono }}>
            {xp}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "start start"] });
  const headerY = useTransform(scrollYProgress, [0, 1], [32, 0]);

  return (
    <section ref={sectionRef} className="relative py-28 overflow-hidden">
      {/* Ambient bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 45% at 50% 0%, rgba(109,40,217,0.09) 0%, transparent 70%)" }}
      />
      <div
        className="absolute pointer-events-none"
        style={{ width: 560, height: 380, bottom: "8%", right: "-8%", background: "radial-gradient(circle, rgba(79,70,229,0.07) 0%, transparent 70%)", filter: "blur(80px)" }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6">

        {/* ── SECTION HEADER ── */}
        <motion.div style={{ y: headerY }} className="mb-14">
          <motion.div {...fadeUp(0)} className="flex items-center gap-3 mb-5">
            <div className="h-px w-10" style={{ background: "rgba(139,92,246,0.45)" }} />
            <span
              className="text-[10.5px] tracking-[0.22em] uppercase font-semibold"
              style={{ color: "rgba(192,166,255,0.58)", fontFamily: typography.mono }}
            >
              Platform Features
            </span>
          </motion.div>

          <motion.h2
            {...fadeUp(0.06)}
            className="font-black uppercase leading-[0.93] mb-5"
            style={{
              fontFamily: typography.display,
              fontSize: "clamp(2.8rem, 6.5vw, 5.2rem)",
              letterSpacing: "-0.025em",
            }}
          >
            <span className="text-white">Your life.</span>
            <br />
            <span
              style={{
                background: "linear-gradient(110deg, #a855f7 0%, #818cf8 50%, #c084fc 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Gamified.
            </span>
          </motion.h2>

          <motion.p
            {...fadeUp(0.12)}
            className="max-w-[480px] leading-relaxed text-[14.5px]"
            style={{ color: V.textMuted, fontFamily: typography.body }}
          >
            Kyzen turns your real effort — goals, focus sessions, commits — into a living
            progression system that rewards consistency and fuels momentum.
          </motion.p>
        </motion.div>

        {/* ── BENTO GRID ── */}
        <div className="grid grid-cols-12 gap-4 auto-rows-auto">

          {/* ── 1. GOAL SYSTEM — tall left ── */}
          <Card className="col-span-12 md:col-span-4" accent delay={0.05} glowPos="40% 0%">
            <div className="p-6 flex flex-col h-full min-h-[440px]">
              <Tag n="01" label="Goal System" />
              <CardTitle>Set Goals.<br />Watch Them Fall.</CardTitle>
              <CardBody>
                Daily and weekly targets structured into milestones. No willpower drama — just momentum that compounds.
              </CardBody>
              <div className="grid grid-cols-2 gap-2.5 mt-5">
                <Stat label="Goals Hit" value="94%" purple />
                <Stat label="This Week" value="7/7" />
              </div>
              <RingsIllustration />
            </div>
          </Card>

          {/* ── 2. XP & LEVELING — wide right ── */}
          <Card className="col-span-12 md:col-span-8" accent delay={0.10} glowPos="65% 15%">
            <div className="p-6 flex flex-col md:flex-row gap-6 min-h-[220px]">
              <div className="flex-1 flex flex-col">
                <Tag n="02" label="XP & Leveling" />
                <CardTitle>Every Action.<br />Real Progress.</CardTitle>
                <CardBody>
                  Instant XP for every task you close. Watch your level climb — no lag between effort and reward.
                </CardBody>
                <div className="flex items-center gap-4 mt-auto pt-5 flex-wrap">
                  <Stat label="Total XP"   value="2,450" purple />
                  <div className="w-px h-9" style={{ background: "rgba(255,255,255,0.06)" }} />
                  <Stat label="Level"      value="Lv.12" />
                  <div className="w-px h-9" style={{ background: "rgba(255,255,255,0.06)" }} />
                  <Stat label="Today"      value="+320" purple />
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-end min-w-0">
                <XPBarsIllustration />
              </div>
            </div>
          </Card>

          {/* ── 3. STREAKS — medium ── */}
          <Card className="col-span-12 md:col-span-5" delay={0.14} glowPos="30% 50%">
            <div className="p-6 flex flex-col md:flex-row gap-5 min-h-[220px]">
              <div className="flex-1 flex flex-col">
                <Tag n="03" label="Streaks" />
                <CardTitle>Momentum Is<br />Your Superpower.</CardTitle>
                <CardBody>
                  Build streaks, multiply XP gains. Miss a day? Freeze tokens let you protect the chain.
                </CardBody>
                <div className="flex items-center gap-4 mt-auto pt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🔥</span>
                    <Stat label="Streak" value="27" purple />
                  </div>
                  <div className="w-px h-9" style={{ background: "rgba(255,255,255,0.06)" }} />
                  <Stat label="Multiplier" value="×1.8" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <StreakGrid />
              </div>
            </div>
          </Card>

          {/* ── 4. DEV MODE — narrow ── */}
          <Card className="col-span-12 md:col-span-3" delay={0.18} glowPos="80% 25%">
            <div className="p-6 flex flex-col min-h-[220px]">
              <Tag n="04" label="Dev Mode" />
              <CardTitle>Real Work.<br />Measured XP.</CardTitle>
              <CardBody>
                Connect GitHub, track sessions, convert every commit into visible progress.
              </CardBody>
              <CodeSnippet />
            </div>
          </Card>

          {/* ── 5. QUESTS — narrow ── */}
          <Card className="col-span-12 md:col-span-4" delay={0.20} glowPos="50% 80%">
            <div className="p-6 flex flex-col min-h-[220px]">
              <Tag n="05" label="Quests" />
              <CardTitle>Side Quests.<br />Main Missions.</CardTitle>
              <CardBody>
                Structured challenges that push you to ship, learn, and grow — each one tied to real XP and skill points.
              </CardBody>
              {/* Quest list */}
              <div className="mt-auto pt-4 space-y-2.5">
                {[
                  { name: "Ship a side project", xp: "+200 XP", pct: 70, c: "#a855f7" },
                  { name: "Solve 5 LeetCode hard", xp: "+150 XP", pct: 40, c: "#818cf8" },
                  { name: "30-day streak", xp: "+500 XP", pct: 90, c: "#c084fc" },
                ].map(({ name, xp, pct, c }) => (
                  <div key={name}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[11.5px] font-medium" style={{ color: "rgba(210,195,255,0.75)", fontFamily: typography.body }}>{name}</span>
                      <span className="text-[10px] font-semibold" style={{ color: c, fontFamily: typography.mono }}>{xp}</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${c}, ${c}99)` }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* ── 6. CLANS — wide bottom ── */}
          <Card className="col-span-12 md:col-span-8" delay={0.22} glowPos="50% 100%">
            <div className="p-6 flex flex-col md:flex-row gap-8 min-h-[240px]">
              <div className="flex-1 max-w-[300px]">
                <Tag n="06" label="Clans" />
                <CardTitle>Compete.<br />Collaborate.<br />Dominate.</CardTitle>
                <CardBody>
                  Create or join Clans of fellow grinders. Pool XP, climb leaderboards, and take on clan-exclusive challenges.
                </CardBody>
                <div className="flex gap-2.5 mt-5 flex-wrap">
                  {[
                    { icon: "⚡", label: "Clan XP", val: "48K" },
                    { icon: "🏆", label: "Rank",    val: "#3" },
                    { icon: "👥", label: "Members", val: "20" },
                  ].map(({ icon, label, val }) => (
                    <div
                      key={label}
                      className="flex-1 px-3 py-2.5 rounded-xl text-center min-w-[72px]"
                      style={{ background: V.purpleLow, border: `1px solid ${V.borderAccent}` }}
                    >
                      <div className="text-base mb-0.5">{icon}</div>
                      <div className="text-[15px] font-black text-white" style={{ fontFamily: typography.display }}>{val}</div>
                      <div className="text-[8.5px] tracking-widest uppercase mt-0.5" style={{ color: V.textMuted, fontFamily: typography.mono }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <ClanBoard />
              </div>
            </div>
          </Card>

        </div>{/* /grid */}

        {/* ── BOTTOM CTA ── */}
        <motion.div {...fadeUp(0.28)} className="flex flex-col items-center text-center mt-20 gap-5">
          <p className="text-[13px] tracking-[0.06em] uppercase font-semibold" style={{ color: V.textMuted, fontFamily: typography.mono }}>
            Ready to start your journey?
          </p>
          <motion.a
            href="/signup"
            whileHover={{ scale: 1.04, boxShadow: "0 0 52px rgba(124,58,237,0.65), 0 4px 20px rgba(0,0,0,0.4)" }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-[13px] text-white font-semibold text-[15px] tracking-[0.01em] cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #6d28d9 0%, #7c3aed 50%, #9333ea 100%)",
              boxShadow: "0 0 28px rgba(109,40,217,0.42), 0 4px 18px rgba(0,0,0,0.38)",
              border: "1px solid rgba(167,139,250,0.2)",
              fontFamily: typography.body,
            }}
          >
            Get Early Access
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.a>
        </motion.div>

      </div>
    </section>
  );
}