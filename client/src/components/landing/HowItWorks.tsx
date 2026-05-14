import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { typography } from "./design-system";

const ease = [0.16, 1, 0.3, 1] as const;

// ── Design tokens — exactly matching Hero/Features blue system ────────────────
const T = {
  bg:          "#07090D",
  cardBg:      "rgba(8,12,32,0.88)",
  cardInner:   "rgba(255,255,255,0.025)",
  border:      "rgba(77,124,255,0.16)",
  borderAcc:   "rgba(110,168,255,0.32)",
  borderHov:   "rgba(77,124,255,0.40)",
  blue:        "#4D7CFF",
  blueMid:     "#6EA8FF",
  blueLight:   "#93C5FD",
  text:        "rgba(245,247,255,0.88)",
  textSub:     "rgba(180,200,240,0.58)",
  textMute:    "rgba(130,155,210,0.42)",
};

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

// ── Shared sub-components ─────────────────────────────────────────────────────

function BlueEdge({ bright }: { bright?: boolean }) {
  return (
    <div className="absolute inset-x-0 top-0 h-px pointer-events-none z-10" style={{
      background: bright
        ? "linear-gradient(90deg, transparent 5%, rgba(77,124,255,0.50) 30%, rgba(110,168,255,0.88) 50%, rgba(77,124,255,0.50) 70%, transparent 95%)"
        : "linear-gradient(90deg, transparent 15%, rgba(77,124,255,0.28) 50%, transparent 85%)",
    }} />
  );
}

// ── Visuals ───────────────────────────────────────────────────────────────────

function VisualConnect() {
  const integrations = [
    { label: "GitHub",  icon: "⌥" },
    { label: "Linear",  icon: "◆" },
    { label: "Jira",    icon: "◉" },
    { label: "Notion",  icon: "▣" },
    { label: "Figma",   icon: "◈" },
    { label: "Slack",   icon: "⬡" },
    { label: "VS Code", icon: "⬧" },
    { label: "GitLab",  icon: "▲" },
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
            style={{
              background: "rgba(8,12,32,0.90)",
              border: `1px solid ${T.border}`,
              backdropFilter: "blur(10px)",
            }}>
            <span style={{ fontSize: 12, color: T.blueMid }}>{item.icon}</span>
            <span style={{ fontSize: 11, color: T.textSub, fontFamily: typography.body, fontWeight: 500 }}>{item.label}</span>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center gap-8">
        {[["40+", "TOOLS"], ["0ms", "LAG"], ["∞", "SYNC"]].map(([val, label], i) => (
          <motion.div key={i} className="flex flex-col items-center gap-0.5"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.5 + i * 0.1 }}>
            <span style={{ fontFamily: typography.display, fontSize: 22, fontWeight: 900, color: T.blueMid, letterSpacing: "-0.02em" }}>{val}</span>
            <span style={{ fontFamily: typography.mono, fontSize: 8.5, color: T.textMute, letterSpacing: "0.18em" }}>{label}</span>
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
        <div style={{ fontSize: 10, letterSpacing: "0.22em", color: T.textMute, fontFamily: typography.mono, marginBottom: 6 }}>TOTAL XP EARNED</div>
        <div style={{ fontSize: 58, fontWeight: 900, fontFamily: typography.display, background: `linear-gradient(135deg, ${T.blueLight}, ${T.blue})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.03em", lineHeight: 1 }}>
          {count.toLocaleString()}
        </div>
        <div style={{ fontSize: 12, color: T.textSub, marginTop: 4, fontFamily: typography.body }}>+320 XP this session</div>
      </div>

      <div className="flex items-end gap-1.5 w-full max-w-[300px]" style={{ height: 48 }}>
        {bars.map((h, i) => (
          <motion.div key={i} className="flex-1 rounded-sm"
            style={{
              height: `${h * 100}%`,
              background: i === bars.length - 1
                ? `linear-gradient(180deg, ${T.blueMid}, ${T.blue})`
                : "rgba(77,124,255,0.20)",
              borderRadius: 3,
            }}
            initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
            transition={{ duration: 0.55, delay: i * 0.065, ease }} />
        ))}
      </div>

      <div className="flex gap-2.5">
        {[
          { label: "PR merged",    val: "+15 XP" },
          { label: "Task closed",  val: "+8 XP"  },
          { label: "Review given", val: "+5 XP"  },
        ].map((item, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="flex flex-col items-center px-4 py-2.5 rounded-xl"
            style={{ background: T.cardBg, border: `1px solid ${T.border}` }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: T.blueMid, fontFamily: typography.mono }}>{item.val}</span>
            <span style={{ fontSize: 10, color: T.textSub, fontFamily: typography.body, marginTop: 2 }}>{item.label}</span>
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
  // Blue heatmap — matches dashboard activity grid
  const color = (v: number) => [
    "rgba(10,14,30,0.7)",
    "rgba(40,70,180,0.30)",
    "rgba(55,95,210,0.48)",
    "rgba(70,115,235,0.68)",
    T.blueMid,
  ][v] ?? "rgba(10,14,30,0.7)";

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-5 px-6 py-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, rgba(40,70,200,0.6), ${T.blue})`,
            boxShadow: `0 8px 24px rgba(77,124,255,0.35)`,
            border: `1px solid ${T.borderAcc}`,
          }}>🔥</div>
        <div>
          <div style={{ fontSize: 10, letterSpacing: "0.18em", color: T.textMute, fontFamily: typography.mono }}>CURRENT STREAK</div>
          <div style={{ fontSize: 38, fontWeight: 900, fontFamily: typography.display, background: `linear-gradient(135deg,#fff,${T.blueLight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.03em", lineHeight: 1.05 }}>127 days</div>
          <div style={{ fontSize: 12, color: T.textSub, fontFamily: typography.body }}>2.4× XP multiplier active</div>
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
  const leaders: [number, string, string, string, boolean][] = [
    [1, "Alex Chen",   "87,200", "🧙", true ],
    [2, "Priya Mehta", "81,450", "⚡", false],
    [3, "Tom Ryder",   "74,900", "🦅", false],
    [4, "Sara Kim",    "68,100", "💎", false],
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
        <div style={{ fontSize: 8, letterSpacing: "0.2em", color: T.textMute, fontFamily: typography.mono, marginBottom: 2 }}>GLOBAL LEADERBOARD</div>
        {leaders.map(([rank, name, xp, badge, you], i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07, duration: 0.35, ease }}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl"
            style={{
              background: you ? "rgba(77,124,255,0.14)" : "rgba(8,12,32,0.75)",
              border: `1px solid ${you ? T.borderAcc : T.border}`,
              boxShadow: you ? `0 0 18px rgba(77,124,255,0.12)` : "none",
            }}>
            <span style={{ fontFamily: typography.mono, fontSize: 10, fontWeight: 700, minWidth: 16, textAlign: "center", flexShrink: 0, color: rank === 1 ? "#fbbf24" : rank === 2 ? "#94a3b8" : rank === 3 ? T.blueLight : T.textMute }}>
              {rank === 1 ? "①" : rank === 2 ? "②" : rank === 3 ? "③" : `#${rank}`}
            </span>
            <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs flex-shrink-0"
              style={{
                background: you ? `linear-gradient(135deg, rgba(30,55,180,0.7), ${T.blue})` : "rgba(255,255,255,0.04)",
                border: `1px solid ${you ? T.borderAcc : "rgba(255,255,255,0.07)"}`,
              }}>
              {badge}
            </div>
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
              <div className="flex items-center gap-1.5">
                <span style={{ fontSize: 11, fontWeight: you ? 700 : 500, color: you ? T.text : T.textSub, fontFamily: typography.body, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</span>
                {you && <span style={{ fontSize: 8, color: T.blueMid, fontFamily: typography.mono, fontWeight: 700, flexShrink: 0, background: "rgba(77,124,255,0.18)", padding: "1px 5px", borderRadius: 4 }}>YOU</span>}
              </div>
              <span style={{ fontSize: 8, color: T.textMute, fontFamily: typography.mono, letterSpacing: "0.06em" }}>Grandmaster</span>
            </div>
            <span style={{ fontFamily: typography.mono, fontSize: 10, fontWeight: 700, color: you ? T.blueMid : T.textMute, flexShrink: 0 }}>{xp}</span>
          </motion.div>
        ))}
      </div>

      <div className="lg:hidden h-px w-full" style={{ background: T.border }} />
      <div className="hidden lg:block w-px self-stretch" style={{ background: T.border }} />

      <div className="flex flex-col gap-1.5 lg:w-44 lg:flex-shrink-0">
        <div style={{ fontSize: 8, letterSpacing: "0.2em", color: T.textMute, fontFamily: typography.mono, marginBottom: 2 }}>ACHIEVEMENTS</div>
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-1.5">
          {achievements.map((a, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: a.unlocked ? 1 : 0.32, y: 0 }}
              transition={{ delay: 0.2 + i * 0.07, duration: 0.32, ease }}
              className="flex items-center gap-2 px-2.5 py-2 rounded-lg"
              style={{
                background: a.unlocked ? "rgba(77,124,255,0.09)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${a.unlocked ? T.border : "rgba(255,255,255,0.05)"}`,
              }}>
              <span style={{ fontSize: 12, filter: a.unlocked ? "none" : "grayscale(1)", flexShrink: 0 }}>{a.icon}</span>
              <span style={{ fontSize: 9.5, color: a.unlocked ? T.textSub : T.textMute, fontFamily: typography.body, fontWeight: a.unlocked ? 500 : 400, lineHeight: 1.3, flex: 1 }}>{a.label}</span>
              {a.unlocked && (
                <motion.div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}
                  style={{ background: T.blueMid }} />
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
          backgroundColor: T.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Grid — same as hero and features */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `
            linear-gradient(rgba(77,124,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(77,124,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          opacity: 0.7,
        }} />

        {/* Ambient glow — blue, matching hero spotlight energy */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `
            radial-gradient(ellipse 65% 45% at 50% 50%, rgba(77,124,255,0.06) 0%, transparent 70%),
            radial-gradient(ellipse 40% 30% at 15% 10%, rgba(77,124,255,0.04) 0%, transparent 60%)
          `,
        }} />

        <div
          className="relative z-10 px-6"
          style={{ width: "100%", maxWidth: "48rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.75rem" }}
        >

          {/* Eyebrow — blue accent lines matching Features section */}
          <div className="flex items-center gap-3">
            <div className="h-px w-8" style={{ background: "linear-gradient(90deg, transparent, rgba(77,124,255,0.45))" }} />
            <span style={{ fontFamily: typography.mono, fontSize: 9.5, letterSpacing: "0.26em", color: "rgba(110,168,255,0.52)" }}>HOW IT WORKS</span>
            <div className="h-px w-8" style={{ background: "linear-gradient(90deg, rgba(77,124,255,0.45), transparent)" }} />
          </div>

          {/* Step tabs — blue active state */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            {STEPS.map((s, i) => (
              <motion.div key={i}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full cursor-default select-none"
                animate={{
                  background: i === active ? "rgba(77,124,255,0.16)" : "transparent",
                  borderColor: i === active ? T.borderAcc : "rgba(255,255,255,0.08)",
                }}
                style={{ border: "1px solid" }}
                transition={{ duration: 0.25 }}>
                <motion.div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  animate={{
                    background: i === active ? T.blueMid : i < active ? "rgba(77,124,255,0.45)" : "rgba(255,255,255,0.18)",
                  }}
                  transition={{ duration: 0.22 }} />
                <motion.span
                  animate={{ color: i === active ? T.text : i < active ? "rgba(150,175,230,0.55)" : T.textMute }}
                  style={{ fontSize: 11, fontFamily: typography.body, fontWeight: i === active ? 600 : 400 }}
                  transition={{ duration: 0.22 }}>
                  {s.label}
                </motion.span>
              </motion.div>
            ))}
          </div>

          {/* Title — Barlow Condensed, blue→white gradient matching hero heading style */}
          <AnimatePresence mode="wait" custom={dir}>
            <motion.h2 key={`title-${active}`} custom={dir}
              initial={{ opacity: 0, y: dir * 28, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: dir * -28, filter: "blur(8px)" }}
              transition={{ duration: 0.48, ease }}
              className="text-center font-black leading-[1.05] whitespace-pre-line"
              style={{
                fontFamily: typography.display,
                fontSize: "clamp(2.4rem,5vw,3.8rem)",
                letterSpacing: "-0.025em",
                background: "linear-gradient(135deg, #ffffff 0%, #E0EEFF 50%, rgba(110,168,255,0.90) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
              {STEPS[active].title}
            </motion.h2>
          </AnimatePresence>

          {/* Visual card — blue border language, matches Features cards */}
          <div className="w-full rounded-2xl overflow-hidden relative"
            style={{
              background: T.cardBg,
              border: `1px solid ${T.borderAcc}`,
              minHeight: 260,
              backdropFilter: "blur(24px)",
              boxShadow: `0 24px 64px rgba(0,0,0,0.55), 0 0 40px rgba(77,124,255,0.06), inset 0 1px 0 rgba(255,255,255,0.05)`,
            }}>
            {/* Blue top-edge shimmer — matches dashboard card + Features cards */}
            <BlueEdge bright />
            {/* Inner ambient glow */}
            <div className="absolute inset-0 pointer-events-none" style={{
              background: `radial-gradient(ellipse 55% 50% at 50% 0%, rgba(77,124,255,0.08) 0%, transparent 65%)`,
            }} />
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
                style={{ fontFamily: typography.body, fontSize: "clamp(0.875rem,1.3vw,0.97rem)", lineHeight: 1.82, color: T.textSub }}>
                {STEPS[active].body}
              </motion.p>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div key={`stat-${active}`}
                initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.88 }}
                transition={{ duration: 0.32, delay: 0.06 }}
                className="flex-shrink-0 flex flex-col items-center px-7 py-3.5 rounded-xl"
                style={{
                  background: "rgba(77,124,255,0.10)",
                  border: `1px solid ${T.border}`,
                }}>
                <span style={{
                  fontFamily: typography.display,
                  fontSize: 28, fontWeight: 900,
                  color: T.blueMid,
                  letterSpacing: "-0.02em", lineHeight: 1,
                }}>
                  {STEPS[active].stat.val}
                </span>
                <span style={{ fontFamily: typography.body, fontSize: 10.5, color: T.textMute, marginTop: 3 }}>
                  {STEPS[active].stat.unit}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress bar — blue */}
          <div className="w-full max-w-xs space-y-1.5">
            <div className="h-px rounded-full overflow-hidden" style={{ background: "rgba(77,124,255,0.12)" }}>
              <motion.div className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, rgba(77,124,255,0.55), ${T.blueMid})` }}
                animate={{ width: `${((active + 1) / STEPS.length) * 100}%` }}
                transition={{ duration: 0.5, ease }} />
            </div>
            <div className="flex justify-between">
              <span style={{ fontFamily: typography.mono, fontSize: 7.5, letterSpacing: "0.2em", color: T.textMute }}>
                STEP {String(active + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
              </span>
              <span style={{ fontFamily: typography.mono, fontSize: 7.5, letterSpacing: "0.2em", color: T.textMute }}>
                {Math.round(((active + 1) / STEPS.length) * 100)}%
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}