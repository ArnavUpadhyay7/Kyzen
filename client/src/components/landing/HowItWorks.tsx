import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { palette, typography } from "./design-system";

const ease = [0.16, 1, 0.3, 1] as const;

const STEPS = [
  {
    num: "01", label: "Connect",
    title: "Plug in everything\nyou already use",
    body: "Kyzen syncs with GitHub, Linear, Jira, Notion, and 40+ tools. Every commit, task, and PR flows automatically — zero manual logging.",
    tags: ["GitHub", "Linear", "Jira", "Notion", "Figma", "Slack"],
    stat: { val: "40+", unit: "integrations" },
  },
  {
    num: "02", label: "Earn XP",
    title: "Every action\nbecomes progress",
    body: "Ship a PR, close a task, hit a deadline — each action earns XP calibrated to impact. Watch your level climb in real time.",
    tags: ["Commits", "Pull Requests", "Tasks", "Reviews"],
    stat: { val: "3.2×", unit: "avg velocity boost" },
  },
  {
    num: "03", label: "Build Streaks",
    title: "Consistency\nbecomes power",
    body: "Daily streaks compound your XP multiplier. The longer your streak, the greater your rewards — and your edge.",
    tags: ["Daily Goals", "Multipliers", "Streak Shield"],
    stat: { val: "127d", unit: "longest streak" },
  },
  {
    num: "04", label: "Own Your Identity",
    title: "Your rank is\nirrefutable proof",
    body: "Your Kyzen profile is a living record of everything you've shipped. Shareable, verifiable, always up to date.",
    tags: ["Rank Card", "Badges", "Leaderboard", "Portfolio"],
    stat: { val: "∞", unit: "legacy" },
  },
];

// ── Visuals ───────────────────────────────────────────────────────────────────

function VisualConnect() {
  const integrations = [
    { label: "GitHub",  icon: "⌥", color: "#a78bfa" },
    { label: "Linear",  icon: "◆", color: "#818cf8" },
    { label: "Jira",    icon: "◉", color: "#c084fc" },
    { label: "Notion",  icon: "▣", color: "#a78bfa" },
    { label: "Figma",   icon: "◈", color: "#c084fc" },
    { label: "Slack",   icon: "⬡", color: "#818cf8" },
    { label: "VS Code", icon: "⬧", color: "#a78bfa" },
    { label: "GitLab",  icon: "▲", color: "#c084fc" },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-6 px-6 py-8">
      <div className="flex items-center gap-2 flex-wrap justify-center max-w-sm">
        {integrations.map((item, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06, ease }}
            className="flex items-center gap-2 px-3 py-2 rounded-full"
            style={{ background: "rgba(20,12,44,0.9)", border: "1px solid rgba(139,92,246,0.25)", backdropFilter: "blur(10px)" }}>
            <span style={{ fontSize: 12, color: item.color }}>{item.icon}</span>
            <span style={{ fontSize: 11, color: "rgba(220,205,255,0.78)", fontFamily: typography.body, fontWeight: 500 }}>{item.label}</span>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center gap-8">
        {[["40+", "TOOLS"], ["0ms", "LAG"], ["∞", "SYNC"]].map(([val, label], i) => (
          <motion.div key={i} className="flex flex-col items-center gap-0.5"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.5 + i * 0.1 }}>
            <span style={{ fontFamily: typography.display, fontSize: 22, fontWeight: 900, color: "#a78bfa", letterSpacing: "-0.02em" }}>{val}</span>
            <span style={{ fontFamily: typography.mono, fontSize: 8.5, color: "rgba(192,166,255,0.5)", letterSpacing: "0.18em" }}>{label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function VisualEarnXP() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let n = 0;
    const iv = setInterval(() => {
      n = Math.min(n + Math.floor(Math.random() * 100 + 40), 4280);
      setCount(n);
      if (n >= 4280) clearInterval(iv);
    }, 55);
    return () => clearInterval(iv);
  }, []);

  const bars = [0.38, 0.62, 0.48, 0.80, 0.58, 0.92, 0.52, 0.72, 0.85, 0.68];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-5 px-6 py-8">
      <div className="text-center">
        <div style={{ fontSize: 10, letterSpacing: "0.22em", color: "rgba(192,166,255,0.55)", fontFamily: typography.mono, marginBottom: 6 }}>TOTAL XP EARNED</div>
        <div style={{ fontSize: 58, fontWeight: 900, fontFamily: typography.display, background: "linear-gradient(135deg,#a78bfa,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.03em", lineHeight: 1 }}>
          {count.toLocaleString()}
        </div>
        <div style={{ fontSize: 12, color: "rgba(210,192,255,0.58)", marginTop: 4, fontFamily: typography.body }}>+320 XP this session</div>
      </div>

      <div className="flex items-end gap-1.5 w-full max-w-[300px]" style={{ height: 48 }}>
        {bars.map((h, i) => (
          <motion.div key={i} className="flex-1 rounded-sm"
            style={{ height: `${h * 100}%`, background: i === bars.length - 1 ? "linear-gradient(180deg,#a78bfa,#7c3aed)" : "rgba(139,92,246,0.22)", borderRadius: 3 }}
            initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
            transition={{ duration: 0.55, delay: i * 0.065, ease }} />
        ))}
      </div>

      <div className="flex gap-2.5">
        {[{ label: "PR merged", val: "+15 XP" }, { label: "Task closed", val: "+8 XP" }, { label: "Review given", val: "+5 XP" }].map((item, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="flex flex-col items-center px-4 py-2.5 rounded-xl"
            style={{ background: "rgba(20,12,44,0.85)", border: "1px solid rgba(139,92,246,0.22)" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#a78bfa", fontFamily: typography.mono }}>{item.val}</span>
            <span style={{ fontSize: 10, color: "rgba(210,195,255,0.58)", fontFamily: typography.body, marginTop: 2 }}>{item.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function VisualStreaks() {
  const weeks = 15; const days = 7;
  const grid = Array.from({ length: weeks }, (_, w) =>
    Array.from({ length: days }, (_, d) => {
      const t = w * days + d;
      if (t > weeks * days - 8) return 4;
      if (t > weeks * days - 35) return Math.floor(Math.random() * 4) + 1;
      return Math.random() > 0.38 ? Math.floor(Math.random() * 3) + 1 : 0;
    })
  );
  const color = (v: number) => ["rgba(20,10,40,0.6)", "rgba(70,30,140,0.4)", "rgba(95,50,180,0.58)", "rgba(109,40,217,0.75)", "#a78bfa"][v] || "rgba(20,10,40,0.6)";

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-5 px-6 py-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: "linear-gradient(135deg,#6d28d9,#4c1d95)", boxShadow: "0 8px 24px rgba(109,40,217,0.45)" }}>🔥</div>
        <div>
          <div style={{ fontSize: 10, letterSpacing: "0.18em", color: "rgba(192,166,255,0.5)", fontFamily: typography.mono }}>CURRENT STREAK</div>
          <div style={{ fontSize: 38, fontWeight: 900, fontFamily: typography.display, background: "linear-gradient(135deg,#fff,#c4b5fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.03em", lineHeight: 1.05 }}>127 days</div>
          <div style={{ fontSize: 12, color: "rgba(210,192,255,0.62)", fontFamily: typography.body }}>2.4× XP multiplier active</div>
        </div>
      </div>

      <div className="flex gap-1.5">
        {grid.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1.5">
            {week.map((val, di) => (
              <motion.div key={di} className="rounded-[3px]"
                style={{ width: 10, height: 10, background: color(val) }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: (wi * days + di) * 0.003 }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function VisualIdentity() {
  const leaders = [
    { rank: 1, name: "Alex Chen",   xp: "87,200", badge: "🧙", tier: "Grandmaster", you: true  },
    { rank: 2, name: "Priya Mehta", xp: "81,450", badge: "⚡", tier: "Grandmaster", you: false },
    { rank: 3, name: "Tom Ryder",   xp: "74,900", badge: "🦅", tier: "Diamond",     you: false },
    { rank: 4, name: "Sara Kim",    xp: "68,100", badge: "💎", tier: "Diamond",     you: false },
  ];

  const achievements = [
    { icon: "🏆", label: "Top 200 Global", unlocked: true  },
    { icon: "🔥", label: "127-Day Streak",  unlocked: true  },
    { icon: "⚡", label: "Speed Shipper",   unlocked: true  },
    { icon: "💎", label: "Diamond Tier",    unlocked: false },
  ];

  return (
    <div className="w-full h-full flex flex-col lg:flex-row items-stretch justify-center gap-3 p-4 overflow-auto">
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(192,166,255,0.45)", fontFamily: typography.mono, marginBottom: 2 }}>GLOBAL LEADERBOARD</div>
        {leaders.map((p, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07, duration: 0.35, ease }}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl"
            style={{
              background: p.you ? "rgba(109,40,217,0.18)" : "rgba(14,8,32,0.7)",
              border: `1px solid ${p.you ? "rgba(167,139,250,0.35)" : "rgba(139,92,246,0.1)"}`,
              boxShadow: p.you ? "0 0 16px rgba(109,40,217,0.15)" : "none",
            }}>
            <span style={{ fontFamily: typography.mono, fontSize: 10, fontWeight: 700, minWidth: 16, textAlign: "center", flexShrink: 0, color: p.rank === 1 ? "#fbbf24" : p.rank === 2 ? "#94a3b8" : p.rank === 3 ? "#c084fc" : "rgba(167,139,250,0.35)" }}>
              {p.rank === 1 ? "①" : p.rank === 2 ? "②" : p.rank === 3 ? "③" : `#${p.rank}`}
            </span>
            <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs flex-shrink-0"
              style={{ background: p.you ? "linear-gradient(135deg,#4c1d95,#7c3aed)" : "rgba(255,255,255,0.04)", border: `1px solid ${p.you ? "rgba(167,139,250,0.4)" : "rgba(255,255,255,0.07)"}` }}>
              {p.badge}
            </div>
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
              <div className="flex items-center gap-1.5">
                <span style={{ fontSize: 11, fontWeight: p.you ? 700 : 500, color: p.you ? "rgba(235,225,255,0.95)" : "rgba(200,185,250,0.65)", fontFamily: typography.body, lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</span>
                {p.you && <span style={{ fontSize: 8, color: "#a78bfa", fontFamily: typography.mono, fontWeight: 700, flexShrink: 0, background: "rgba(109,40,217,0.25)", padding: "1px 5px", borderRadius: 4 }}>YOU</span>}
              </div>
              <span style={{ fontSize: 8, color: "rgba(167,139,250,0.38)", fontFamily: typography.mono, letterSpacing: "0.06em" }}>{p.tier}</span>
            </div>
            <span style={{ fontFamily: typography.mono, fontSize: 10, fontWeight: 700, color: p.you ? "#a78bfa" : "rgba(167,139,250,0.45)", flexShrink: 0 }}>{p.xp}</span>
          </motion.div>
        ))}
      </div>

      <div className="lg:hidden h-px w-full" style={{ background: "rgba(139,92,246,0.1)" }} />
      <div className="hidden lg:block w-px self-stretch" style={{ background: "rgba(139,92,246,0.1)" }} />

      <div className="flex flex-col gap-1.5 lg:w-44 lg:flex-shrink-0">
        <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(192,166,255,0.45)", fontFamily: typography.mono, marginBottom: 2 }}>ACHIEVEMENTS</div>
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-1.5">
          {achievements.map((a, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: a.unlocked ? 1 : 0.32, y: 0 }}
              transition={{ delay: 0.2 + i * 0.07, duration: 0.32, ease }}
              className="flex items-center gap-2 px-2.5 py-2 rounded-lg"
              style={{ background: a.unlocked ? "rgba(109,40,217,0.1)" : "rgba(255,255,255,0.02)", border: `1px solid ${a.unlocked ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.05)"}` }}>
              <span style={{ fontSize: 12, filter: a.unlocked ? "none" : "grayscale(1)", flexShrink: 0 }}>{a.icon}</span>
              <span style={{ fontSize: 9.5, color: a.unlocked ? "rgba(215,200,255,0.78)" : "rgba(160,145,195,0.38)", fontFamily: typography.body, fontWeight: a.unlocked ? 500 : 400, lineHeight: 1.3, flex: 1 }}>{a.label}</span>
              {a.unlocked && (
                <motion.div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}
                  style={{ background: "#a78bfa" }} />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

const VISUALS = [VisualConnect, VisualEarnXP, VisualStreaks, VisualIdentity];

// ── Main ──────────────────────────────────────────────────────────────────────
export default function HowItWorks() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);

  const onScroll = useCallback(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const range = el.offsetHeight - window.innerHeight;
    const p = Math.min(1, Math.max(0, (window.scrollY - top) / range));
    const next = Math.min(STEPS.length - 1, Math.floor(p * STEPS.length));
    setActive(prev => { if (next !== prev) setDir(next > prev ? 1 : -1); return next; });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  const ActiveVisual = VISUALS[active];

  return (
    <div ref={wrapperRef} style={{ height: "400vh", position: "relative" }}>
      <div
        className="sticky top-0 overflow-hidden"
        style={{
          height: "100vh",
          width: "100%",
          backgroundColor: palette.canvas,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Ambient */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(88,28,220,0.07) 0%, transparent 70%)" }} />

        {/* Grain */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "180px" }} />

        <div
          className="relative z-10 px-6"
          style={{
            width: "100%",
            maxWidth: "48rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.75rem",
          }}
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-3">
            <div className="h-px w-8" style={{ background: "rgba(139,92,246,0.38)" }} />
            <span style={{ fontFamily: typography.mono, fontSize: 9.5, letterSpacing: "0.26em", color: "rgba(200,180,255,0.55)" }}>HOW IT WORKS</span>
            <div className="h-px w-8" style={{ background: "rgba(139,92,246,0.38)" }} />
          </div>

          {/* Step tabs */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            {STEPS.map((s, i) => (
              <motion.div key={i}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full cursor-default select-none"
                animate={{
                  background: i === active ? "rgba(109,40,217,0.22)" : "transparent",
                  borderColor: i === active ? "rgba(139,92,246,0.4)" : "rgba(255,255,255,0.08)",
                }}
                style={{ border: "1px solid" }}
                transition={{ duration: 0.25 }}>
                <motion.div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  animate={{ background: i === active ? "#a78bfa" : i < active ? "rgba(139,92,246,0.5)" : "rgba(255,255,255,0.18)" }}
                  transition={{ duration: 0.22 }} />
                <motion.span
                  animate={{ color: i === active ? "rgba(235,222,255,0.95)" : i < active ? "rgba(180,158,230,0.55)" : "rgba(160,145,200,0.38)" }}
                  style={{ fontSize: 11, fontFamily: typography.body, fontWeight: i === active ? 600 : 400 }}
                  transition={{ duration: 0.22 }}>
                  {s.label}
                </motion.span>
              </motion.div>
            ))}
          </div>

          {/* Title */}
          <AnimatePresence mode="wait" custom={dir}>
            <motion.h2 key={`title-${active}`} custom={dir}
              initial={{ opacity: 0, y: dir * 28, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: dir * -28, filter: "blur(8px)" }}
              transition={{ duration: 0.48, ease }}
              className="text-center font-black leading-[1.05] whitespace-pre-line"
              style={{ fontFamily: typography.display, fontSize: "clamp(2.4rem,5vw,3.8rem)", letterSpacing: "-0.028em", background: "linear-gradient(135deg,#ffffff 0%,rgba(218,205,255,0.92) 50%,rgba(167,139,250,0.82) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              {STEPS[active].title}
            </motion.h2>
          </AnimatePresence>

          {/* Visual card */}
          <div className="w-full rounded-2xl overflow-hidden relative"
            style={{ background: "rgba(10,5,24,0.82)", border: "1px solid rgba(139,92,246,0.2)", minHeight: 260, backdropFilter: "blur(24px)", boxShadow: "0 24px 64px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)" }}>
            <div className="absolute inset-x-0 top-0 h-px pointer-events-none"
              style={{ background: "linear-gradient(90deg, transparent 10%, rgba(139,92,246,0.5) 50%, transparent 90%)" }} />
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse 50% 55% at 50% 0%, rgba(109,40,217,0.1) 0%, transparent 70%)" }} />
            <AnimatePresence mode="wait">
              <motion.div key={`vis-${active}`} className="w-full h-full"
                initial={{ opacity: 0, scale: 0.96, filter: "blur(14px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.03, filter: "blur(14px)" }}
                transition={{ duration: 0.5, ease }}>
                <ActiveVisual />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Body + stat */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.p key={`body-${active}`}
                initial={{ opacity: 0, y: dir * 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.04, ease }}
                className="text-center flex-1"
                style={{ fontFamily: typography.body, fontSize: "clamp(0.875rem,1.3vw,0.97rem)", lineHeight: 1.82, color: "rgba(215,200,255,0.62)" }}>
                {STEPS[active].body}
              </motion.p>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div key={`stat-${active}`}
                initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.88 }}
                transition={{ duration: 0.32, delay: 0.06 }}
                className="flex-shrink-0 flex flex-col items-center px-7 py-3.5 rounded-xl"
                style={{ background: "rgba(109,40,217,0.12)", border: "1px solid rgba(139,92,246,0.24)" }}>
                <span style={{ fontFamily: typography.display, fontSize: 28, fontWeight: 900, color: "#a78bfa", letterSpacing: "-0.02em", lineHeight: 1 }}>
                  {STEPS[active].stat.val}
                </span>
                <span style={{ fontFamily: typography.body, fontSize: 10.5, color: "rgba(200,180,255,0.55)", marginTop: 3 }}>
                  {STEPS[active].stat.unit}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress */}
          <div className="w-full max-w-xs space-y-1.5">
            <div className="h-px rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
              <motion.div className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg,rgba(109,40,217,0.55),#a78bfa)" }}
                animate={{ width: `${((active + 1) / STEPS.length) * 100}%` }}
                transition={{ duration: 0.5, ease }} />
            </div>
            <div className="flex justify-between">
              <span style={{ fontFamily: typography.mono, fontSize: 7.5, letterSpacing: "0.2em", color: "rgba(180,158,230,0.35)" }}>STEP {String(active + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}</span>
              <span style={{ fontFamily: typography.mono, fontSize: 7.5, letterSpacing: "0.2em", color: "rgba(180,158,230,0.35)" }}>{Math.round(((active + 1) / STEPS.length) * 100)}%</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}