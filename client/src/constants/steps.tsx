export const STEPS = [
  {
    num: "01",
    label: "Connect",
    title: "Link Your\nReal Work",
    body: "Connect GitHub, your task manager, or any productivity tool. Kyzen listens silently — every commit, every closed ticket, every focus session becomes raw material for your progression.",
    tags: ["GitHub Sync", "Jira / Linear", "Focus Timer", "Manual Log"],
    stat: { val: "12+", unit: "integrations" },
    symbol: (
      <svg viewBox="0 0 120 120" width={120} height={120} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Central node */}
        <circle cx="60" cy="60" r="14" fill="rgba(139,92,246,0.25)" stroke="rgba(139,92,246,0.7)" strokeWidth="1.5" />
        <circle cx="60" cy="60" r="6" fill="#8b5cf6" />
        {/* Spokes */}
        {[0, 60, 120, 180, 240, 300].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const x2 = 60 + Math.cos(rad) * 36;
          const y2 = 60 + Math.sin(rad) * 36;
          const xEnd = 60 + Math.cos(rad) * 46;
          const yEnd = 60 + Math.sin(rad) * 46;
          return (
            <g key={i}>
              <line x1="60" y1="60" x2={x2} y2={y2} stroke="rgba(139,92,246,0.3)" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx={xEnd} cy={yEnd} r="7" fill="rgba(139,92,246,0.15)" stroke="rgba(139,92,246,0.5)" strokeWidth="1" />
            </g>
          );
        })}
        {/* Outer ring */}
        <circle cx="60" cy="60" r="54" stroke="rgba(139,92,246,0.1)" strokeWidth="1" strokeDasharray="4 6" />
      </svg>
    ),
  },
  {
    num: "02",
    label: "Earn XP",
    title: "Every Action\nRewarded",
    body: "Tasks close, XP lands instantly. The system weighs effort, complexity, and consistency — so a focused deep-work session hits different than a quick checkbox. Your level reflects your reality.",
    tags: ["Instant XP", "Effort Weighting", "Streak Bonus", "Level Up"],
    stat: { val: "+320", unit: "XP today" },
    symbol: (
      <svg viewBox="0 0 120 120" width={120} height={120} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Bar chart */}
        {[
          { x: 14, h: 38, active: true },
          { x: 30, h: 55, active: true },
          { x: 46, h: 32, active: true },
          { x: 62, h: 72, active: true },
          { x: 78, h: 50, active: true },
          { x: 94, h: 28, active: false },
        ].map((b, i) => (
          <g key={i}>
            <rect x={b.x} y={108 - b.h} width="12" height={b.h} rx="3"
              fill={b.active ? "rgba(139,92,246,0.35)" : "rgba(255,255,255,0.05)"}
              stroke={b.active ? "rgba(139,92,246,0.6)" : "rgba(255,255,255,0.08)"}
              strokeWidth="0.75"
            />
          </g>
        ))}
        {/* Trend line */}
        <polyline points="20,80 36,65 52,78 68,40 84,58" stroke="rgba(192,132,252,0.7)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {/* Highlight dot */}
        <circle cx="68" cy="40" r="4" fill="#c084fc" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        {/* Baseline */}
        <line x1="10" y1="108" x2="110" y2="108" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      </svg>
    ),
  },
  {
    num: "03",
    label: "Build Streaks",
    title: "Momentum\nCompounds",
    body: "Miss nothing. Keep the chain alive. Each consecutive day multiplies your XP — a 7-day streak hits 1.5×, a 30-day streak hits 2×. Missed a day? Recovery quests let you bounce back without starting from zero.",
    tags: ["Daily Streak", "XP Multiplier", "Recovery Quest", "Milestone Badge"],
    stat: { val: "×1.8", unit: "multiplier" },
    symbol: (
      <svg viewBox="0 0 120 120" width={120} height={120} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Flame body */}
        <path
          d="M60,108 C38,108 22,90 22,70 C22,52 34,42 42,36 C40,50 48,54 52,52 C44,40 56,18 60,12 C64,18 76,40 68,52 C72,54 80,50 78,36 C86,42 98,52 98,70 C98,90 82,108 60,108 Z"
          fill="rgba(139,92,246,0.2)"
          stroke="rgba(139,92,246,0.6)"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        {/* Inner flame */}
        <path
          d="M60,98 C48,98 40,86 40,74 C40,64 46,58 52,56 C50,64 56,68 60,68 C64,68 70,64 68,56 C74,58 80,64 80,74 C80,86 72,98 60,98 Z"
          fill="rgba(167,139,250,0.3)"
          stroke="rgba(192,132,252,0.5)"
          strokeWidth="1"
        />
        {/* Core */}
        <ellipse cx="60" cy="82" rx="8" ry="10" fill="rgba(192,132,252,0.4)" />
      </svg>
    ),
  },
  {
    num: "04",
    label: "Own Your Identity",
    title: "Build Your\nDev Identity",
    body: "Your rank, title, and progression arc become a public ledger of your work ethic. Choose your class — Builder, Architect, Hacker — and unlock abilities, badges, and perks that reflect your actual specialisation.",
    tags: ["Class System", "Rank Titles", "Badge Collection", "Public Profile"],
    stat: { val: "Level 5", unit: "current rank" },
    symbol: (
      <svg viewBox="0 0 120 120" width={120} height={120} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Shield */}
        <path
          d="M60,16 L96,34 L96,70 Q96,100 60,112 Q24,100 24,70 L24,34 Z"
          fill="rgba(139,92,246,0.18)"
          stroke="rgba(139,92,246,0.55)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Inner shield */}
        <path
          d="M60,28 L84,40 L84,68 Q84,90 60,100 Q36,90 36,68 L36,40 Z"
          fill="rgba(139,92,246,0.12)"
          stroke="rgba(167,139,250,0.35)"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        {/* Star / emblem */}
        <path
          d="M60,42 L63.5,53 L75,53 L66,60 L69.5,71 L60,64 L50.5,71 L54,60 L45,53 L56.5,53 Z"
          fill="rgba(192,132,252,0.6)"
          stroke="rgba(192,132,252,0.8)"
          strokeWidth="0.75"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
] as const;