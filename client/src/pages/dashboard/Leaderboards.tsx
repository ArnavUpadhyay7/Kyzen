import { useState, useEffect } from "react";
import { useTheme } from "../../state/theme/ThemeContext"; // used only to drive dark class on wrapper

function useCountdown() {
  const [remaining, setRemaining] = useState(
    12 * 86400 + 7 * 3600 + 34 * 60 + 51
  );
  useEffect(() => {
    const t = setInterval(() => setRemaining((p) => Math.max(0, p - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  return {
    d: Math.floor(remaining / 86400),
    h: Math.floor((remaining % 86400) / 3600),
    m: Math.floor((remaining % 3600) / 60),
    s: remaining % 60,
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="bg-white/5 dark:bg-white/5 border border-white/10 dark:border-white/10 rounded-xl px-4 py-2.5 min-w-[56px] text-center">
        <span className="text-2xl font-bold font-mono text-gray-900 dark:text-white tracking-wide">
          {pad(value)}
        </span>
      </div>
      <span className="text-[11px] uppercase tracking-widest text-gray-400 dark:text-white/30">
        {label}
      </span>
    </div>
  );
}

function PlaceholderRow({ rank, blurred }: { rank: number; blurred?: boolean }) {
  const medals: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

  return (
    <div
      className={[
        "grid items-center px-4 py-3 border-b border-gray-100 dark:border-white/[0.06] last:border-b-0",
        blurred ? "blur-[4px] opacity-40 pointer-events-none select-none" : "",
      ].join(" ")}
      style={{ gridTemplateColumns: "52px 1fr 80px 80px 72px" }}
    >
      {/* Rank */}
      <div className="text-sm font-mono text-gray-400 dark:text-white/30">
        {medals[rank] ? (
          <span className="text-lg">{medals[rank]}</span>
        ) : (
          `#${rank}`
        )}
      </div>

      {/* Player */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/[0.06] border border-gray-200 dark:border-white/10 flex items-center justify-center text-[11px] font-mono text-gray-400 dark:text-white/30 shrink-0">
          —
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800 dark:text-white/80 m-0">———</p>
          <p className="text-[11px] font-mono text-gray-400 dark:text-white/25 m-0">@———</p>
        </div>
      </div>

      {/* Streak */}
      <div className="text-center">
        <span className="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-400/10 px-2 py-0.5 rounded-full">
          — d
        </span>
      </div>

      {/* XP */}
      <div className="text-center text-sm font-bold font-mono text-gray-700 dark:text-white/70">
        ——
      </div>

      {/* Level */}
      <div className="text-right">
        <span className="text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/25 px-2 py-0.5 rounded-full">
          Lv —
        </span>
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  const { theme } = useTheme();
  const { d, h, m, s } = useCountdown();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const features = [
    { icon: "🌍", title: "Global rankings", desc: "Compete against thousands of developers worldwide in real-time." },
    { icon: "⚡", title: "Weekly sprints", desc: "7-day challenges with bonus XP multipliers for top performers." },
    { icon: "🏅", title: "Achievement badges", desc: "Unlock rare badges for streaks, milestones, and challenge wins." },
  ];

  const podiumOrder = [
    { pos: 2, label: "2nd", icon: "🥈", platH: "h-[72px]", platW: "w-[104px]", avatarSize: "w-11 h-11", isGold: false, mbBottom: "" },
    { pos: 1, label: "1st", icon: "👑", platH: "h-[96px]", platW: "w-[120px]", avatarSize: "w-14 h-14", isGold: true, mbBottom: "-mb-4" },
    { pos: 3, label: "3rd", icon: "🥉", platH: "h-[52px]", platW: "w-[104px]", avatarSize: "w-11 h-11", isGold: false, mbBottom: "" },
  ];

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <div className="min-h-screen bg-gray-50 dark:bg-[#080c1a] text-gray-900 dark:text-white overflow-y-auto">

        {/* Ambient top glow */}
        <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(99,102,241,0.06)_0%,transparent_60%)]" />

        {/* Sticky topbar */}
        <div className="sticky top-0 z-50 flex items-center justify-between h-14 px-7 bg-white/90 dark:bg-[rgba(7,11,28,0.95)] backdrop-blur-xl border-b border-gray-200 dark:border-white/[0.07]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[9px] bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/25 flex items-center justify-center text-base">
              ⚔
            </div>
            <span className="text-sm font-bold text-gray-900 dark:text-white">Leaderboard</span>
            <span className="text-[11px] font-mono text-gray-400 dark:text-white/25 tracking-wide">Season 1</span>
          </div>

          <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-400/10 border border-amber-200 dark:border-amber-400/20 rounded-full px-3 py-1">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400" />
            <span className="text-[11px] font-mono font-semibold text-amber-700 dark:text-amber-400">Coming soon</span>
          </div>
        </div>

        {/* Page content */}
        <div className="relative z-10 max-w-3xl mx-auto px-6 pt-14 pb-24">

          {/* Hero */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/25 rounded-full px-4 py-1.5 mb-6">
              <span className="text-sm">🏆</span>
              <span className="text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                Season 1 · Global rankings
              </span>
            </div>

            <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight mb-4">
              Who grinds hardest?
            </h1>
            <p className="text-base text-gray-500 dark:text-white/40 max-w-sm mx-auto leading-relaxed mb-10">
              Compete with developers worldwide. Earn XP, climb the ranks, and prove your consistency.
            </p>

            {/* Countdown */}
            <div className="flex items-start justify-center gap-3 mb-3">
              <CountdownUnit value={d} label="Days" />
              <span className="text-xl font-bold font-mono text-gray-300 dark:text-white/20 pt-3">:</span>
              <CountdownUnit value={h} label="Hours" />
              <span className="text-xl font-bold font-mono text-gray-300 dark:text-white/20 pt-3">:</span>
              <CountdownUnit value={m} label="Mins" />
              <span className="text-xl font-bold font-mono text-gray-300 dark:text-white/20 pt-3">:</span>
              <CountdownUnit value={s} label="Secs" />
            </div>
            <p className="text-[11px] font-mono text-gray-400 dark:text-white/25 tracking-widest">
              until season launch
            </p>
          </div>

          {/* Podium */}
          <div className="mb-12">
            <div className="flex items-end justify-center gap-3">
              {podiumOrder.map(({ pos, label, icon, platH, platW, avatarSize, isGold, mbBottom }) => (
                <div key={pos} className={`flex flex-col items-center gap-2 ${mbBottom}`}>
                  {/* Avatar */}
                  <div className={`${avatarSize} rounded-full flex items-center justify-center text-xs font-bold font-mono border ${
                    isGold
                      ? "bg-amber-50 dark:bg-amber-400/10 border-amber-300 dark:border-amber-400/30 text-amber-600 dark:text-amber-400"
                      : "bg-gray-100 dark:bg-white/[0.05] border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/25"
                  }`}>
                    ??
                  </div>
                  {/* Label */}
                  <div className="text-center">
                    <p className={`text-sm font-bold m-0 ${isGold ? "text-amber-600 dark:text-amber-400" : "text-gray-500 dark:text-white/40"}`}>
                      {label}
                    </p>
                    <p className="text-[11px] font-mono text-gray-400 dark:text-white/25 m-0">TBA</p>
                  </div>
                  {/* Block */}
                  <div className={`${platW} ${platH} rounded-t-xl flex items-center justify-center border border-b-0 text-2xl ${
                    isGold
                      ? "bg-amber-50 dark:bg-amber-400/[0.07] border-amber-200 dark:border-amber-400/20"
                      : "bg-gray-50 dark:bg-white/[0.03] border-gray-200 dark:border-white/[0.06]"
                  }`}>
                    {icon}
                  </div>
                </div>
              ))}
            </div>
            {/* Stage base */}
            <div className="h-px bg-gray-200 dark:bg-white/10 rounded-full" />
          </div>

          {/* Rankings table */}
          <div className="relative mb-14">
            <div className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.07] rounded-2xl overflow-hidden">
              {/* Header */}
              <div
                className="grid px-4 py-2.5 border-b border-gray-100 dark:border-white/[0.06]"
                style={{ gridTemplateColumns: "52px 1fr 80px 80px 72px" }}
              >
                {["Rank", "Developer", "Streak", "XP", "Level"].map((col, i) => (
                  <span
                    key={col}
                    className={`text-[10px] font-mono uppercase tracking-widest text-gray-400 dark:text-white/25 ${
                      i === 2 || i === 3 ? "text-center" : i === 4 ? "text-right" : ""
                    }`}
                  >
                    {col}
                  </span>
                ))}
              </div>

              {[1, 2, 3, 4, 5].map((rank) => (
                <PlaceholderRow key={rank} rank={rank} blurred={rank > 2} />
              ))}
            </div>

            {/* Lock overlay */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[55%] bg-gradient-to-t from-gray-50 dark:from-[#080c1a] to-transparent flex items-end justify-center pb-5 rounded-b-2xl">
              <div className="pointer-events-auto flex items-center gap-2 bg-white dark:bg-[#080c1a] border border-indigo-200 dark:border-indigo-500/30 rounded-full px-4 py-2">
                <span className="text-sm">🔒</span>
                <span className="text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                  Rankings unlock at season launch
                </span>
              </div>
            </div>
          </div>

          {/* Feature teasers */}
          <div className="mb-14">
            <p className="text-[11px] font-mono text-gray-400 dark:text-white/25 text-center uppercase tracking-widest mb-5">
              What's coming
            </p>
            <div className="grid grid-cols-3 gap-3">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.07] rounded-xl p-4 text-center hover:border-gray-300 dark:hover:border-white/[0.13] transition-colors duration-200"
                >
                  <div className="text-2xl mb-2">{f.icon}</div>
                  <p className="text-[13px] font-bold text-gray-800 dark:text-white/80 mb-1">{f.title}</p>
                  <p className="text-xs text-gray-500 dark:text-white/40 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Notify CTA */}
          <div className="relative text-center bg-white dark:bg-white/[0.03] border border-indigo-200 dark:border-indigo-500/25 rounded-2xl px-8 py-10 overflow-hidden">
            {/* Top shimmer line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-400/50 dark:via-indigo-500/40 to-transparent" />

            <p className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2">
              Get notified
            </p>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
              Be first on the board
            </h2>
            <p className="text-sm text-gray-500 dark:text-white/40 leading-relaxed mb-7">
              Early entrants get a 500 XP head-start. Don't miss it.
            </p>

            {submitted ? (
              <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/25 rounded-full px-5 py-2.5">
                <span className="text-sm">✅</span>
                <span className="text-sm font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                  You're on the list!
                </span>
              </div>
            ) : (
              <div className="flex gap-2 max-w-sm mx-auto">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && email) setSubmitted(true);
                  }}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/25 text-sm outline-none focus:border-indigo-400 dark:focus:border-indigo-500/50 transition-colors"
                />
                <button
                  onClick={() => { if (email) setSubmitted(true); }}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-sm font-bold font-mono whitespace-nowrap transition-all duration-150 cursor-pointer border-0"
                >
                  Notify me →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}