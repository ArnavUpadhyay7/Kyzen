import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

const STEPS = [
  {
    num: "01",
    label: "Connect",
    title: "Plug in everything\nyou already use",
    body: "Kyzen syncs with GitHub, Linear, Jira, Notion, and 40+ tools. Every commit, task, and PR flows automatically — zero manual logging.",
    stat: { val: "40+", unit: "integrations" },
  },
  {
    num: "02",
    label: "Earn XP",
    title: "Every action\nbecomes progress",
    body: "Ship a PR, close a task, hit a deadline — each action earns XP calibrated to impact. Watch your level climb in real time.",
    stat: { val: "3.2×", unit: "avg velocity boost" },
  },
  {
    num: "03",
    label: "Build Streaks",
    title: "Consistency\nbecomes power",
    body: "Daily streaks compound your XP multiplier. The longer your streak, the greater your rewards — and your edge.",
    stat: { val: "127d", unit: "longest streak" },
  },
  {
    num: "04",
    label: "Own Your Identity",
    title: "Your rank is\nirrefutable proof",
    body: "Your Kyzen profile is a living record of everything you've shipped. Shareable, verifiable, always up to date.",
    stat: { val: "∞", unit: "legacy" },
  },
];

function BlueEdge({ bright }: { bright?: boolean }) {
  return (
    <div
      className={[
        "absolute inset-x-0 top-0 h-px pointer-events-none z-10",
        bright ? "bg-landing-edge-blue-bright" : "bg-landing-edge-blue",
      ].join(" ")}
    />
  );
}

function VisualConnect() {
  const integrations = [
    { label: "GitHub", icon: "⌥" },
    { label: "Linear", icon: "◆" },
    { label: "Jira", icon: "◉" },
    { label: "Notion", icon: "▣" },
    { label: "Figma", icon: "◈" },
    { label: "Slack", icon: "⬡" },
    { label: "VS Code", icon: "⬧" },
    { label: "GitLab", icon: "▲" },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-6 px-6 py-8">
      <div className="flex items-center gap-2 flex-wrap justify-center max-w-sm">
        {integrations.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06, ease }}
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-landing-card-bg-accent border border-landing-border backdrop-blur-[10px]"
          >
            <span className="text-xs text-landing-blue-mid">{item.icon}</span>
            <span className="text-[11px] text-landing-text-sub font-landing-body font-medium">{item.label}</span>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center gap-8">
        {[["40+", "TOOLS"], ["0ms", "LAG"], ["∞", "SYNC"]].map(([val, label], i) => (
          <motion.div
            key={i}
            className="flex flex-col items-center gap-0.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 + i * 0.1 }}
          >
            <span className="font-landing-display text-[22px] font-black text-landing-blue-mid tracking-[-0.02em]">
              {val}
            </span>
            <span className="font-landing-mono text-[8.5px] text-landing-text-muted-alt tracking-[0.18em]">
              {label}
            </span>
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

  const bars = [
    "h-[38%]",
    "h-[62%]",
    "h-[48%]",
    "h-[80%]",
    "h-[58%]",
    "h-[92%]",
    "h-[52%]",
    "h-[72%]",
    "h-[85%]",
    "h-[68%]",
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-5 px-6 py-8">
      <div className="text-center">
        <div className="text-[10px] tracking-[0.22em] text-landing-text-muted-alt font-landing-mono mb-1.5">
          TOTAL XP EARNED
        </div>
        <div className="text-[58px] font-black font-landing-display text-gradient-landing-xp tracking-[-0.03em] leading-none">
          {count.toLocaleString()}
        </div>
        <div className="text-xs text-landing-text-sub mt-1 font-landing-body">+320 XP this session</div>
      </div>

      <div className="flex items-end gap-1.5 w-full max-w-[300px] h-12">
        {bars.map((heightClass, i) => (
          <motion.div
            key={i}
            className={[
              "flex-1 rounded-sm origin-bottom",
              heightClass,
              i === bars.length - 1 ? "bg-landing-xp-bar-on" : "bg-landing-blue/20",
            ].join(" ")}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.55, delay: i * 0.065, ease }}
          />
        ))}
      </div>

      <div className="flex gap-2.5">
        {[
          { label: "PR merged", val: "+15 XP" },
          { label: "Task closed", val: "+8 XP" },
          { label: "Review given", val: "+5 XP" },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="flex flex-col items-center px-4 py-2.5 rounded-xl bg-landing-card-bg-alt border border-landing-border"
          >
            <span className="text-xs font-bold text-landing-blue-mid font-landing-mono">{item.val}</span>
            <span className="text-[10px] text-landing-text-sub font-landing-body mt-0.5">{item.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const HEAT_CLASSES = [
  "bg-landing-heat-0",
  "bg-landing-heat-1",
  "bg-landing-heat-2",
  "bg-landing-heat-3",
  "bg-landing-blue-mid",
] as const;

function VisualStreaks() {
  const weeks = 15;
  const days = 7;
  const grid = Array.from({ length: weeks }, (_, w) =>
    Array.from({ length: days }, (_, d) => {
      const t = w * days + d;
      if (t > weeks * days - 8) return 4;
      if (t > weeks * days - 35) return Math.floor(Math.random() * 4) + 1;
      return Math.random() > 0.38 ? Math.floor(Math.random() * 3) + 1 : 0;
    }),
  );

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-5 px-6 py-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0 bg-landing-streak-badge shadow-landing-streak border border-landing-border-accent">
          🔥
        </div>
        <div>
          <div className="text-[10px] tracking-[0.18em] text-landing-text-muted-alt font-landing-mono">
            CURRENT STREAK
          </div>
          <div className="text-[38px] font-black font-landing-display text-gradient-landing-streak tracking-[-0.03em] leading-[1.05]">
            127 days
          </div>
          <div className="text-xs text-landing-text-sub font-landing-body">2.4× XP multiplier active</div>
        </div>
      </div>

      <div className="flex gap-1.5">
        {grid.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1.5">
            {week.map((val, di) => (
              <motion.div
                key={di}
                className={`w-2.5 h-2.5 rounded-[3px] ${HEAT_CLASSES[val] ?? HEAT_CLASSES[0]}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: (wi * days + di) * 0.003 }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function VisualIdentity() {
  const leaders: [number, string, string, string, boolean][] = [
    [1, "Alex Chen", "87,200", "🧙", true],
    [2, "Priya Mehta", "81,450", "⚡", false],
    [3, "Tom Ryder", "74,900", "🦅", false],
    [4, "Sara Kim", "68,100", "💎", false],
  ];
  const achievements = [
    { icon: "🏆", label: "Top 200 Global", unlocked: true },
    { icon: "🔥", label: "127-Day Streak", unlocked: true },
    { icon: "⚡", label: "Speed Shipper", unlocked: true },
    { icon: "💎", label: "Diamond Tier", unlocked: false },
  ];

  const rankColor = (rank: number) => {
    if (rank === 1) return "text-[#fbbf24]";
    if (rank === 2) return "text-[#94a3b8]";
    if (rank === 3) return "text-landing-blue-light";
    return "text-landing-text-muted-alt";
  };

  return (
    <div className="w-full h-full flex flex-col lg:flex-row items-stretch justify-center gap-3 p-4 overflow-auto">
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <div className="text-[8px] tracking-[0.2em] text-landing-text-muted-alt font-landing-mono mb-0.5">
          GLOBAL LEADERBOARD
        </div>
        {leaders.map(([rank, name, xp, badge, you], i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07, duration: 0.35, ease }}
            className={[
              "flex items-center gap-2.5 px-3 py-2 rounded-xl border",
              you
                ? "bg-landing-badge-blue-bg border-landing-border-accent shadow-[0_0_18px_rgba(77,124,255,0.12)]"
                : "bg-landing-card-bg-accent border-landing-border",
            ].join(" ")}
          >
            <span
              className={[
                "font-landing-mono text-[10px] font-bold min-w-4 text-center shrink-0",
                rankColor(rank),
              ].join(" ")}
            >
              {rank === 1 ? "①" : rank === 2 ? "②" : rank === 3 ? "③" : `#${rank}`}
            </span>
            <div
              className={[
                "w-6 h-6 rounded-md flex items-center justify-center text-xs shrink-0 border",
                you
                  ? "bg-landing-streak-badge border-landing-border-accent"
                  : "bg-landing-text-08 border-landing-text-08",
              ].join(" ")}
            >
              {badge}
            </div>
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
              <div className="flex items-center gap-1.5">
                <span
                  className={[
                    "text-[11px] font-landing-body whitespace-nowrap overflow-hidden text-ellipsis",
                    you ? "font-bold text-[rgba(245,247,255,0.88)]" : "font-medium text-landing-text-sub",
                  ].join(" ")}
                >
                  {name}
                </span>
                {you && (
                  <span className="text-[8px] text-landing-blue-mid font-landing-mono font-bold shrink-0 bg-landing-badge-blue-bg px-1.5 py-px rounded">
                    YOU
                  </span>
                )}
              </div>
              <span className="text-[8px] text-landing-text-muted-alt font-landing-mono tracking-[0.06em]">
                Grandmaster
              </span>
            </div>
            <span
              className={[
                "font-landing-mono text-[10px] font-bold shrink-0",
                you ? "text-landing-blue-mid" : "text-landing-text-muted-alt",
              ].join(" ")}
            >
              {xp}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="lg:hidden h-px w-full bg-landing-border" />
      <div className="hidden lg:block w-px self-stretch bg-landing-border" />

      <div className="flex flex-col gap-1.5 lg:w-44 lg:shrink-0">
        <div className="text-[8px] tracking-[0.2em] text-landing-text-muted-alt font-landing-mono mb-0.5">
          ACHIEVEMENTS
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-1.5">
          {achievements.map((a, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: a.unlocked ? 1 : 0.32, y: 0 }}
              transition={{ delay: 0.2 + i * 0.07, duration: 0.32, ease }}
              className={[
                "flex items-center gap-2 px-2.5 py-2 rounded-lg border",
                a.unlocked
                  ? "bg-landing-badge-blue-bg border-landing-border"
                  : "bg-landing-text-08 border-landing-text-08",
              ].join(" ")}
            >
              <span className={`text-xs shrink-0 ${a.unlocked ? "" : "grayscale"}`}>{a.icon}</span>
              <span
                className={[
                  "text-[9.5px] font-landing-body leading-snug flex-1",
                  a.unlocked ? "font-medium text-landing-text-sub" : "font-normal text-landing-text-muted-alt",
                ].join(" ")}
              >
                {a.label}
              </span>
              {a.unlocked && (
                <motion.div
                  className="w-1.5 h-1.5 rounded-full shrink-0 bg-landing-blue-mid"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

const VISUALS = [VisualConnect, VisualEarnXP, VisualStreaks, VisualIdentity];

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
    setActive((prev) => {
      if (next !== prev) setDir(next > prev ? 1 : -1);
      return next;
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  const ActiveVisual = VISUALS[active];

  return (
    <div ref={wrapperRef} className="h-[400vh] relative">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-landing-surface flex items-center justify-center">
        <div className="absolute inset-0 pointer-events-none bg-landing-grid-accent opacity-70" />
        <div className="absolute inset-0 pointer-events-none bg-landing-ambient-howitworks" />

        <div className="relative z-10 px-6 w-full max-w-3xl flex flex-col items-center justify-center gap-7">
          <div className="flex items-center gap-3">
            <div className="h-px w-8 bg-landing-eyebrow-line-left" />
            <span className="font-landing-mono text-[9.5px] tracking-[0.26em] text-[rgba(110,168,255,0.52)]">
              HOW IT WORKS
            </span>
            <div className="h-px w-8 bg-landing-eyebrow-line-right" />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            {STEPS.map((s, i) => (
              <div
                key={i}
                className={[
                  "flex items-center gap-2 px-3.5 py-1.5 rounded-full cursor-default select-none border transition-colors duration-[250ms]",
                  i === active
                    ? "bg-landing-tab-active-bg border-landing-border-accent"
                    : "bg-transparent border-landing-text-08",
                ].join(" ")}
              >
                <div
                  className={[
                    "w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-[220ms]",
                    i === active
                      ? "bg-landing-blue-mid"
                      : i < active
                        ? "bg-landing-blue/45"
                        : "bg-landing-text-20",
                  ].join(" ")}
                />
                <span
                  className={[
                    "text-[11px] font-landing-body transition-colors duration-[220ms]",
                    i === active
                      ? "font-semibold text-[rgba(245,247,255,0.88)]"
                      : i < active
                        ? "font-normal text-[rgba(150,175,230,0.55)]"
                        : "font-normal text-landing-text-muted-alt",
                  ].join(" ")}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait" custom={dir}>
            <motion.h2
              key={`title-${active}`}
              custom={dir}
              initial={{ opacity: 0, y: dir * 28, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: dir * -28, filter: "blur(8px)" }}
              transition={{ duration: 0.48, ease }}
              className="text-center font-landing-display font-black leading-[1.05] whitespace-pre-line text-gradient-landing-step-title text-[clamp(2.4rem,5vw,3.8rem)] tracking-[-0.025em]"
            >
              {STEPS[active].title}
            </motion.h2>
          </AnimatePresence>

          <div className="w-full rounded-2xl overflow-hidden relative bg-landing-card-bg-alt border border-landing-border-accent min-h-[260px] backdrop-blur-[24px] shadow-landing-visual-card">
            <BlueEdge bright />
            <div className="absolute inset-0 pointer-events-none bg-landing-visual-inner-glow" />
            <AnimatePresence mode="wait">
              <motion.div
                key={`vis-${active}`}
                className="w-full h-full"
                initial={{ opacity: 0, scale: 0.96, filter: "blur(14px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.03, filter: "blur(14px)" }}
                transition={{ duration: 0.5, ease }}
              >
                <ActiveVisual />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.p
                key={`body-${active}`}
                initial={{ opacity: 0, y: dir * 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.04, ease }}
                className="text-center flex-1 font-landing-body text-[clamp(0.875rem,1.3vw,0.97rem)] leading-[1.82] text-landing-text-sub"
              >
                {STEPS[active].body}
              </motion.p>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={`stat-${active}`}
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.88 }}
                transition={{ duration: 0.32, delay: 0.06 }}
                className="shrink-0 flex flex-col items-center px-7 py-3.5 rounded-xl bg-landing-stat-bg border border-landing-border"
              >
                <span className="font-landing-display text-[28px] font-black text-landing-blue-mid tracking-[-0.02em] leading-none">
                  {STEPS[active].stat.val}
                </span>
                <span className="font-landing-body text-[10.5px] text-landing-text-muted-alt mt-0.5">
                  {STEPS[active].stat.unit}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="w-full max-w-xs space-y-1.5">
            <div className="h-px rounded-full overflow-hidden bg-landing-xp-track">
              <motion.div
                className="h-full rounded-full bg-landing-progress-bar"
                animate={{ width: `${((active + 1) / STEPS.length) * 100}%` }}
                transition={{ duration: 0.5, ease }}
              />
            </div>
            <div className="flex justify-between">
              <span className="font-landing-mono text-[7.5px] tracking-[0.2em] text-landing-text-muted-alt">
                STEP {String(active + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
              </span>
              <span className="font-landing-mono text-[7.5px] tracking-[0.2em] text-landing-text-muted-alt">
                {Math.round(((active + 1) / STEPS.length) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
