import { useState, useEffect } from "react";

const C = {
  bg: "#07091a",
  surface: "rgba(255,255,255,0.035)",
  surfaceHover: "rgba(255,255,255,0.055)",
  border: "rgba(255,255,255,0.07)",
  borderHover: "rgba(255,255,255,0.13)",
  borderAccent: "rgba(139,92,246,0.35)",
  text: "#e8e8f0",
  muted: "rgba(232,232,240,0.45)",
  faint: "rgba(232,232,240,0.22)",
  accent: "#8b5cf6",
  accentBright: "#a78bfa",
  accentDim: "rgba(139,92,246,0.12)",
  accentGlow: "rgba(139,92,246,0.18)",
  green: "#34d399",
  greenDim: "rgba(52,211,153,0.1)",
  amber: "#f59e0b",
  amberDim: "rgba(245,158,11,0.1)",
  amberBright: "#fbbf24",
  blue: "#60a5fa",
  blueDim: "rgba(96,165,250,0.1)",
  gold: "#fbbf24",
  silver: "#94a3b8",
  bronze: "#c084fc",
};

const MOCK_PLAYERS = [
  { rank: 1, name: "Arjun Mehta", handle: "@arjun.dev", xp: 12840, level: 24, streak: 47, avatar: "AM", color: C.accentBright },
  { rank: 2, name: "Priya Sharma", handle: "@prsharma", xp: 11200, level: 22, streak: 38, avatar: "PS", color: C.green },
  { rank: 3, name: "Kai Tanaka", handle: "@kai_builds", xp: 9750, level: 19, streak: 31, avatar: "KT", color: C.amber },
  { rank: 4, name: "Zoe Chen", handle: "@zoechen", xp: 8400, level: 17, streak: 22, avatar: "ZC", color: C.blue },
  { rank: 5, name: "Ethan Reynolds", handle: "@ethan.gg", xp: 7890, level: 15, streak: 18, avatar: "ER", color: C.accentBright },
];

const COUNTDOWN = { days: 12, hours: 7, mins: 34, secs: 51 };

function useCountdown() {
  const [time, setTime] = useState(
    COUNTDOWN.days * 86400 + COUNTDOWN.hours * 3600 + COUNTDOWN.mins * 60 + COUNTDOWN.secs
  );
  useEffect(() => {
    const t = setInterval(() => setTime(p => Math.max(0, p - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const d = Math.floor(time / 86400);
  const h = Math.floor((time % 86400) / 3600);
  const m = Math.floor((time % 3600) / 60);
  const s = time % 60;
  return { d, h, m, s };
}

function Avatar({ initials, color, size = 44 }: { initials: string; color: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: color + "20", border: `1.5px solid ${color}50`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.3, fontWeight: 700, color, flexShrink: 0,
      fontFamily: "monospace", letterSpacing: "0.04em",
    }}>{initials}</div>
  );
}

function RankMedal({ rank }: { rank: number }) {
  const medals: Record<number, { icon: string; color: string }> = {
    1: { icon: "🥇", color: C.gold },
    2: { icon: "🥈", color: C.silver },
    3: { icon: "🥉", color: C.bronze },
  };
  if (medals[rank]) return <span style={{ fontSize: 20 }}>{medals[rank].icon}</span>;
  return <span style={{ fontSize: 13, fontFamily: "monospace", color: C.faint, fontWeight: 700 }}>#{rank}</span>;
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  const v = String(value).padStart(2, "0");
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{
        background: "rgba(139,92,246,0.12)",
        border: `1px solid rgba(139,92,246,0.28)`,
        borderRadius: 12,
        padding: "14px 18px",
        minWidth: 64,
        marginBottom: 6,
      }}>
        <span style={{ fontSize: 28, fontWeight: 800, fontFamily: "monospace", color: C.accentBright, letterSpacing: "0.05em" }}>{v}</span>
      </div>
      <span style={{ fontSize: 10, fontFamily: "monospace", color: C.faint, textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</span>
    </div>
  );
}

export default function LeaderboardPage() {
  const { d, h, m, s } = useCountdown();

  return (
    <div style={{
      minHeight: "100vh",
      background: C.bg,
      color: C.text,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Ambient bg */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: `
          radial-gradient(ellipse 60% 40% at 50% 0%, rgba(139,92,246,0.09) 0%, transparent 60%),
          radial-gradient(ellipse 30% 30% at 10% 80%, rgba(96,165,250,0.05) 0%, transparent 50%),
          radial-gradient(ellipse 30% 30% at 90% 70%, rgba(52,211,153,0.04) 0%, transparent 50%)
        `,
      }} />

      {/* Top header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(7,9,26,0.85)", backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${C.border}`,
        padding: "0 28px",
        display: "flex", alignItems: "center", justifyContent: "space-between", height: 56,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: "rgba(139,92,246,0.15)", border: `1px solid rgba(139,92,246,0.3)`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
          }}>⚔</div>
          <div>
            <span style={{ fontSize: 14, fontWeight: 700, background: `linear-gradient(135deg,#fff 40%,${C.accentBright})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Leaderboard</span>
            <span style={{ fontSize: 11, color: C.faint, fontFamily: "monospace", marginLeft: 10, letterSpacing: "0.03em" }}>Season 1</span>
          </div>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)",
          borderRadius: 99, padding: "4px 12px",
        }}>
          <div style={{ width: 6, height: 6, borderRadius: 99, background: C.amber, boxShadow: `0 0 8px ${C.amber}` }} />
          <span style={{ fontSize: 11, color: C.amberBright, fontFamily: "monospace", fontWeight: 600 }}>Coming Soon</span>
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 860, margin: "0 auto", padding: "52px 24px 80px" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: C.accentDim, border: `1px solid ${C.borderAccent}`,
            borderRadius: 99, padding: "5px 16px", marginBottom: 24,
          }}>
            <span style={{ fontSize: 13 }}>🏆</span>
            <span style={{ fontSize: 11, fontFamily: "monospace", color: C.accentBright, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Season 1 · Global Rankings</span>
          </div>

          <h1 style={{
            fontSize: 52, fontWeight: 800, margin: "0 0 16px",
            background: `linear-gradient(135deg, #fff 30%, ${C.accentBright} 65%, ${C.blue} 100%)`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            letterSpacing: "-0.03em", lineHeight: 1.1,
          }}>
            Who Grinds Hardest?
          </h1>

          <p style={{ fontSize: 16, color: C.muted, maxWidth: 440, margin: "0 auto 36px", lineHeight: 1.7 }}>
            Compete with developers worldwide. Earn XP, climb the ranks, and prove your consistency.
          </p>

          {/* Countdown */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", gap: 16, marginBottom: 12 }}>
            <CountdownUnit value={d} label="Days" />
            <div style={{ fontSize: 28, fontWeight: 800, color: C.faint, paddingTop: 14, fontFamily: "monospace" }}>:</div>
            <CountdownUnit value={h} label="Hours" />
            <div style={{ fontSize: 28, fontWeight: 800, color: C.faint, paddingTop: 14, fontFamily: "monospace" }}>:</div>
            <CountdownUnit value={m} label="Mins" />
            <div style={{ fontSize: 28, fontWeight: 800, color: C.faint, paddingTop: 14, fontFamily: "monospace" }}>:</div>
            <CountdownUnit value={s} label="Secs" />
          </div>
          <p style={{ fontSize: 12, color: C.faint, fontFamily: "monospace", letterSpacing: "0.04em" }}>until season launch</p>
        </div>

        {/* Podium preview */}
        <div style={{ marginBottom: 40 }}>
          <div style={{
            display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 16,
            marginBottom: 32, position: "relative",
          }}>
            {/* 2nd place */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <Avatar initials={MOCK_PLAYERS[1].avatar} color={MOCK_PLAYERS[1].color} size={52} />
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 13, fontWeight: 700, margin: "0 0 2px", color: C.text }}>{MOCK_PLAYERS[1].name}</p>
                <p style={{ fontSize: 11, color: C.muted, margin: 0, fontFamily: "monospace" }}>{MOCK_PLAYERS[1].xp.toLocaleString()} XP</p>
              </div>
              <div style={{
                width: 120, height: 80, borderRadius: "10px 10px 0 0",
                background: "rgba(148,163,184,0.08)", border: `1px solid rgba(148,163,184,0.18)`,
                borderBottom: "none",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28,
              }}>🥈</div>
            </div>

            {/* 1st place */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginBottom: -20 }}>
              <div style={{ position: "relative" }}>
                <div style={{
                  position: "absolute", inset: -3, borderRadius: "50%",
                  border: `2px solid ${C.gold}50`, boxShadow: `0 0 20px ${C.gold}25`,
                }} />
                <Avatar initials={MOCK_PLAYERS[0].avatar} color={C.gold} size={64} />
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 14, fontWeight: 800, margin: "0 0 2px", color: C.gold }}>{MOCK_PLAYERS[0].name}</p>
                <p style={{ fontSize: 11, color: C.muted, margin: 0, fontFamily: "monospace" }}>{MOCK_PLAYERS[0].xp.toLocaleString()} XP</p>
              </div>
              <div style={{
                width: 130, height: 110, borderRadius: "10px 10px 0 0",
                background: "rgba(251,191,36,0.07)", border: `1px solid rgba(251,191,36,0.2)`,
                borderBottom: "none",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32,
              }}>👑</div>
            </div>

            {/* 3rd place */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <Avatar initials={MOCK_PLAYERS[2].avatar} color={MOCK_PLAYERS[2].color} size={52} />
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 13, fontWeight: 700, margin: "0 0 2px", color: C.text }}>{MOCK_PLAYERS[2].name}</p>
                <p style={{ fontSize: 11, color: C.muted, margin: 0, fontFamily: "monospace" }}>{MOCK_PLAYERS[2].xp.toLocaleString()} XP</p>
              </div>
              <div style={{
                width: 120, height: 60, borderRadius: "10px 10px 0 0",
                background: "rgba(192,132,252,0.08)", border: `1px solid rgba(192,132,252,0.18)`,
                borderBottom: "none",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
              }}>🥉</div>
            </div>
          </div>

          {/* Stage base */}
          <div style={{ height: 3, background: `linear-gradient(90deg, transparent, rgba(139,92,246,0.3), rgba(251,191,36,0.4), rgba(139,92,246,0.3), transparent)`, borderRadius: 99 }} />
        </div>

        {/* Rankings table (blurred/locked) */}
        <div style={{ position: "relative", marginBottom: 48 }}>
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden",
          }}>
            {/* Header */}
            <div style={{
              display: "grid", gridTemplateColumns: "60px 1fr 100px 100px 90px",
              padding: "12px 20px", borderBottom: `1px solid ${C.border}`,
              fontSize: 10, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.1em", color: C.faint,
            }}>
              <span>Rank</span><span>Developer</span><span style={{ textAlign: "center" }}>Streak</span><span style={{ textAlign: "center" }}>XP</span><span style={{ textAlign: "right" }}>Level</span>
            </div>

            {MOCK_PLAYERS.map((p, i) => (
              <div key={p.rank} style={{
                display: "grid", gridTemplateColumns: "60px 1fr 100px 100px 90px",
                padding: "14px 20px",
                borderBottom: i < MOCK_PLAYERS.length - 1 ? `1px solid ${C.border}` : "none",
                alignItems: "center",
                filter: i >= 3 ? "blur(4px)" : "none",
                opacity: i >= 3 ? 0.5 : 1,
                background: i === 0 ? "rgba(251,191,36,0.04)" : "transparent",
                transition: "background 0.2s",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
                  <RankMedal rank={p.rank} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Avatar initials={p.avatar} color={p.color} size={36} />
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, margin: 0, color: C.text }}>{p.name}</p>
                    <p style={{ fontSize: 11, color: C.faint, margin: 0, fontFamily: "monospace" }}>{p.handle}</p>
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <span style={{
                    fontSize: 11, fontFamily: "monospace", fontWeight: 700,
                    color: p.streak > 30 ? C.amber : C.muted,
                    background: p.streak > 30 ? C.amberDim : "transparent",
                    padding: "2px 8px", borderRadius: 99,
                    border: p.streak > 30 ? `1px solid rgba(245,158,11,0.2)` : "none",
                  }}>
                    🔥 {p.streak}d
                  </span>
                </div>
                <div style={{ textAlign: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "monospace", color: C.accentBright }}>{p.xp.toLocaleString()}</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{
                    fontSize: 11, fontFamily: "monospace", fontWeight: 700,
                    color: C.accent, background: C.accentDim,
                    border: `1px solid rgba(139,92,246,0.25)`,
                    padding: "2px 9px", borderRadius: 99,
                  }}>Lv {p.level}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Lock overlay */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "55%",
            background: `linear-gradient(transparent, ${C.bg})`,
            display: "flex", alignItems: "flex-end", justifyContent: "center",
            paddingBottom: 24, borderRadius: "0 0 16px 16px",
            pointerEvents: "none",
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "rgba(7,9,26,0.9)", border: `1px solid ${C.borderAccent}`,
              borderRadius: 99, padding: "8px 20px",
              backdropFilter: "blur(8px)",
            }}>
              <span style={{ fontSize: 14 }}>🔒</span>
              <span style={{ fontSize: 12, fontFamily: "monospace", color: C.accentBright, fontWeight: 600 }}>Rankings unlock at season launch</span>
            </div>
          </div>
        </div>

        {/* Feature teasers */}
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 12, fontFamily: "monospace", color: C.faint, textAlign: "center", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 20 }}>What's Coming</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {[
              { icon: "🌍", title: "Global Rankings", desc: "Compete against thousands of developers worldwide in real-time" },
              { icon: "⚡", title: "Weekly Sprints", desc: "7-day challenges with bonus XP multipliers for top performers" },
              { icon: "🏅", title: "Achievement Badges", desc: "Unlock rare badges for streaks, milestones, and challenge wins" },
            ].map(f => (
              <div key={f.title} style={{
                background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14,
                padding: "18px 18px", textAlign: "center",
                transition: "border-color 0.2s",
              }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = C.borderHover}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = C.border}
              >
                <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
                <p style={{ fontSize: 13, fontWeight: 700, margin: "0 0 6px", color: C.text }}>{f.title}</p>
                <p style={{ fontSize: 12, color: C.muted, margin: 0, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Notify CTA */}
        <div style={{
          textAlign: "center",
          background: C.surface, border: `1px solid ${C.borderAccent}`, borderRadius: 18,
          padding: "36px 32px",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${C.accent}60,transparent)` }} />
          <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 200, height: 100, background: `radial-gradient(ellipse, ${C.accentGlow} 0%, transparent 70%)`, pointerEvents: "none" }} />

          <p style={{ fontSize: 12, fontFamily: "monospace", color: C.accentBright, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 10px" }}>Get Notified</p>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 8px", color: C.text, letterSpacing: "-0.02em" }}>Be First on the Board</h2>
          <p style={{ fontSize: 14, color: C.muted, margin: "0 0 24px", lineHeight: 1.6 }}>Early entrants get a 500 XP head-start. Don't miss it.</p>
          <div style={{ display: "flex", gap: 10, maxWidth: 380, margin: "0 auto", justifyContent: "center" }}>
            <input
              placeholder="your@email.com"
              style={{
                flex: 1, padding: "10px 14px", borderRadius: 10,
                background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`,
                color: C.text, fontSize: 13, outline: "none",
              }}
            />
            <button style={{
              padding: "10px 20px", borderRadius: 10,
              background: `linear-gradient(135deg, ${C.accent}, #7c3aed)`,
              color: "#fff", border: "none", fontSize: 13, fontWeight: 700,
              cursor: "pointer", fontFamily: "monospace", whiteSpace: "nowrap",
              boxShadow: `0 0 20px rgba(139,92,246,0.3)`,
            }}>
              Notify Me →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 