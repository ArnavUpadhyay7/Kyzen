export const STEPS = [
  {
    num: "01",
    label: "Quest Engine",
    title: "Turn chaos\ninto missions.",
    body: "Raw goals become structured quests with difficulty ratings, XP rewards, and deadlines — auto-pulled from your tools so you never start from scratch.",
    accent: "#818cf8",
    accentDim: "rgba(129,140,248,0.12)",
    accentGlow: "rgba(129,140,248,0.35)",
    stat: { val: "∞", unit: "quests possible" },
    tags: ["GitHub", "Linear", "Notion"],
    symbol: (
      <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
        <circle cx="60" cy="60" r="50" stroke="rgba(129,140,248,0.15)" strokeWidth="1" />
        <circle cx="60" cy="60" r="34" stroke="rgba(129,140,248,0.25)" strokeWidth="1" strokeDasharray="5 4" />
        <circle cx="60" cy="60" r="18" fill="rgba(129,140,248,0.18)" stroke="rgba(129,140,248,0.5)" strokeWidth="1" />
        <line x1="60" y1="10" x2="60" y2="42" stroke="rgba(129,140,248,0.5)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="60" y1="78" x2="60" y2="110" stroke="rgba(129,140,248,0.5)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="10" y1="60" x2="42" y2="60" stroke="rgba(129,140,248,0.5)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="78" y1="60" x2="110" y2="60" stroke="rgba(129,140,248,0.5)" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="60" cy="60" r="6" fill="#818cf8" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
          <line
            key={i}
            x1={60 + 48 * Math.cos((deg * Math.PI) / 180)}
            y1={60 + 48 * Math.sin((deg * Math.PI) / 180)}
            x2={60 + 53 * Math.cos((deg * Math.PI) / 180)}
            y2={60 + 53 * Math.sin((deg * Math.PI) / 180)}
            stroke="rgba(129,140,248,0.5)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        ))}
      </svg>
    ),
  },
  {
    num: "02",
    label: "XP Engine",
    title: "Work converts\nto progress.",
    body: "Every commit, Pomodoro, and task close triggers an instant XP calculation. Real work, real numbers — no manual input, no guesswork.",
    accent: "#a78bfa",
    accentDim: "rgba(167,139,250,0.12)",
    accentGlow: "rgba(167,139,250,0.35)",
    stat: { val: "+320", unit: "XP this session" },
    tags: ["Instant", "Automatic", "Real-time"],
    symbol: (
      <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
        <defs>
          <linearGradient id="bolt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
        {[52, 40, 28].map((r, i) => (
          <circle
            key={i}
            cx="60"
            cy="60"
            r={r}
            stroke={`rgba(167,139,250,${0.12 + i * 0.1})`}
            strokeWidth="1"
            strokeDasharray={i === 1 ? "3 5" : undefined}
          />
        ))}
        <path d="M68 20 L48 58 L60 58 L52 100 L80 50 L66 50 Z" fill="url(#bolt)" opacity="0.95" />
        {[[20, 30], [96, 45], [15, 80], [100, 75]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.5" fill="rgba(192,132,252,0.6)" />
        ))}
      </svg>
    ),
  },
  {
    num: "03",
    label: "Progression",
    title: "Levels unlock\nnew power.",
    body: "As XP accumulates, your rank advances and new systems unlock — skill trees, clan perks, harder quests. Progress compounds. Growth accelerates.",
    accent: "#c084fc",
    accentDim: "rgba(192,132,252,0.12)",
    accentGlow: "rgba(192,132,252,0.35)",
    stat: { val: "Lv.12", unit: "Gold rank" },
    tags: ["8 skill trees", "40+ perks", "Ranks"],
    symbol: (
      <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
        <defs>
          <linearGradient id="bar1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e879f9" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
        {[
          { x: 15, h: 30, o: 0.35 },
          { x: 33, h: 50, o: 0.5 },
          { x: 51, h: 70, o: 0.7 },
          { x: 69, h: 90, o: 0.85 },
          { x: 87, h: 108, o: 1 },
        ].map((b, i) => (
          <rect key={i} x={b.x} y={110 - b.h} width="15" height={b.h} rx="4" fill="url(#bar1)" opacity={b.o} />
        ))}
        <path
          d="M100 18 L100 8 M100 8 L94 15 M100 8 L106 15"
          stroke="rgba(232,121,249,0.8)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    num: "04",
    label: "Identity",
    title: "Your proof of\nconsistency.",
    body: "Streaks, commits, ranks, and milestones crystallize into a living developer profile. Not a portfolio — a record of daily momentum that speaks for itself.",
    accent: "#e879f9",
    accentDim: "rgba(232,121,249,0.12)",
    accentGlow: "rgba(232,121,249,0.3)",
    stat: { val: "847d", unit: "streak record" },
    tags: ["Shareable", "Verified", "Public"],
    symbol: (
      <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
        <defs>
          <linearGradient id="shield" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e879f9" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.7" />
          </linearGradient>
        </defs>
        <path
          d="M60 10 L100 28 L100 68 Q100 95 60 112 Q20 95 20 68 L20 28 Z"
          fill="rgba(232,121,249,0.1)"
          stroke="rgba(232,121,249,0.4)"
          strokeWidth="1.5"
        />
        <path
          d="M60 22 L90 36 L90 66 Q90 86 60 100 Q30 86 30 66 L30 36 Z"
          fill="rgba(192,132,252,0.08)"
          stroke="rgba(192,132,252,0.25)"
          strokeWidth="1"
        />
        <path
          d="M60 42 L63.5 52.5 L75 52.5 L65.5 59 L69 70 L60 63 L51 70 L54.5 59 L45 52.5 L56.5 52.5 Z"
          fill="url(#shield)"
          opacity="0.9"
        />
      </svg>
    ),
  },
];