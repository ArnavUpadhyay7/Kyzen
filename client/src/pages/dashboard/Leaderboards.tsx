import { useState, useEffect } from "react";
import {
  DashboardBadge,
  DashboardButton,
  DashboardCard,
  DashboardInput,
} from "../../components/dashboard/ui";
import { cn } from "../../lib/utils";

function useCountdown() {
  const [remaining, setRemaining] = useState(
    12 * 86400 + 7 * 3600 + 34 * 60 + 51,
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
      <div className="min-w-14 rounded-xl border border-dash-border bg-dash-card-alt px-4 py-2.5 text-center">
        <span className="font-dash-mono text-2xl font-bold tracking-wide text-dash-primary">
          {pad(value)}
        </span>
      </div>
      <span className="text-[11px] font-dash-sans uppercase tracking-widest text-dash-faint">
        {label}
      </span>
    </div>
  );
}

function PlaceholderRow({ rank, blurred }: { rank: number; blurred?: boolean }) {
  const medals: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

  return (
    <div
      className={cn(
        "grid grid-cols-[52px_1fr_80px_80px_72px] items-center border-b border-dash-border px-4 py-3 last:border-b-0",
        blurred && "pointer-events-none select-none opacity-40 blur-[4px]",
      )}
    >
      <div className="font-dash-mono text-sm text-dash-faint">
        {medals[rank] ? <span className="text-lg">{medals[rank]}</span> : `#${rank}`}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-dash-border bg-dash-muted-btn font-dash-mono text-[11px] text-dash-faint">
          —
        </div>
        <div>
          <p className="m-0 text-sm font-semibold text-dash-secondary">———</p>
          <p className="m-0 font-dash-mono text-[11px] text-dash-faint">@———</p>
        </div>
      </div>

      <div className="text-center">
        <DashboardBadge variant="warning" className="font-bold">
          — d
        </DashboardBadge>
      </div>

      <div className="text-center font-dash-mono text-sm font-bold text-dash-secondary">
        ——
      </div>

      <div className="text-right">
        <DashboardBadge variant="accent" className="font-bold">
          Lv —
        </DashboardBadge>
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
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
    <div className="min-h-screen overflow-y-auto bg-dash-page text-dash-primary">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,color-mix(in_srgb,var(--dash-accent)_6%,transparent)_0%,transparent_60%)]" />

      <div className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-dash-border bg-dash-topbar/95 px-7 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-[9px] border border-dash-accent-border bg-dash-accent-soft text-base">
            ⚔
          </div>
          <span className="font-dash-sans text-sm font-bold text-dash-primary">Leaderboard</span>
          <span className="font-dash-mono text-[11px] tracking-wide text-dash-faint">Season 1</span>
        </div>

        <DashboardBadge variant="warning" className="gap-1.5 px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-dash-warning" />
          Coming soon
        </DashboardBadge>
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-6 pt-14 pb-24">
        <div className="mb-14 text-center">
          <DashboardBadge variant="accent" className="mb-6 gap-2 px-4 py-1.5 uppercase tracking-widest">
            <span className="text-sm">🏆</span>
            Season 1 · Global rankings
          </DashboardBadge>

          <h1 className="mb-4 font-dash-sans text-5xl leading-tight font-extrabold tracking-tight text-dash-primary">
            Who grinds hardest?
          </h1>
          <p className="mx-auto mb-10 max-w-sm font-dash-sans text-base leading-relaxed text-dash-muted">
            Compete with developers worldwide. Earn XP, climb the ranks, and prove your consistency.
          </p>

          <div className="mb-3 flex items-start justify-center gap-3">
            <CountdownUnit value={d} label="Days" />
            <span className="pt-3 font-dash-mono text-xl font-bold text-dash-faint">:</span>
            <CountdownUnit value={h} label="Hours" />
            <span className="pt-3 font-dash-mono text-xl font-bold text-dash-faint">:</span>
            <CountdownUnit value={m} label="Mins" />
            <span className="pt-3 font-dash-mono text-xl font-bold text-dash-faint">:</span>
            <CountdownUnit value={s} label="Secs" />
          </div>
          <p className="font-dash-mono text-[11px] tracking-widest text-dash-faint">
            until season launch
          </p>
        </div>

        <div className="mb-12">
          <div className="flex items-end justify-center gap-3">
            {podiumOrder.map(({ pos, label, icon, platH, platW, avatarSize, isGold, mbBottom }) => (
              <div key={pos} className={cn("flex flex-col items-center gap-2", mbBottom)}>
                <div
                  className={cn(
                    "flex items-center justify-center rounded-full border font-dash-mono text-xs font-bold",
                    avatarSize,
                    isGold
                      ? "border-dash-warning/30 bg-dash-warning/10 text-dash-warning"
                      : "border-dash-border bg-dash-card-alt text-dash-faint",
                  )}
                >
                  ??
                </div>
                <div className="text-center">
                  <p
                    className={cn(
                      "m-0 text-sm font-bold",
                      isGold ? "text-dash-warning" : "text-dash-muted",
                    )}
                  >
                    {label}
                  </p>
                  <p className="m-0 font-dash-mono text-[11px] text-dash-faint">TBA</p>
                </div>
                <div
                  className={cn(
                    "flex items-center justify-center rounded-t-xl border border-b-0 text-2xl",
                    platW,
                    platH,
                    isGold
                      ? "border-dash-warning/20 bg-dash-warning/[0.07]"
                      : "border-dash-border bg-dash-card-alt",
                  )}
                >
                  {icon}
                </div>
              </div>
            ))}
          </div>
          <div className="h-px rounded-full bg-dash-border" />
        </div>

        <div className="relative mb-14">
          <DashboardCard className="overflow-hidden rounded-2xl">
            <div className="grid grid-cols-[52px_1fr_80px_80px_72px] border-b border-dash-border px-4 py-2.5">
              {["Rank", "Developer", "Streak", "XP", "Level"].map((col, i) => (
                <span
                  key={col}
                  className={cn(
                    "font-dash-mono text-[10px] uppercase tracking-widest text-dash-faint",
                    (i === 2 || i === 3) && "text-center",
                    i === 4 && "text-right",
                  )}
                >
                  {col}
                </span>
              ))}
            </div>

            {[1, 2, 3, 4, 5].map((rank) => (
              <PlaceholderRow key={rank} rank={rank} blurred={rank > 2} />
            ))}
          </DashboardCard>

          <div className="pointer-events-none absolute right-0 bottom-0 left-0 flex h-[55%] items-end justify-center rounded-b-2xl bg-gradient-to-t from-dash-page to-transparent pb-5">
            <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-dash-accent-border bg-dash-page px-4 py-2">
              <span className="text-sm">🔒</span>
              <span className="font-dash-mono text-xs font-semibold text-dash-accent">
                Rankings unlock at season launch
              </span>
            </div>
          </div>
        </div>

        <div className="mb-14">
          <p className="mb-5 text-center font-dash-mono text-[11px] uppercase tracking-widest text-dash-faint">
            What&apos;s coming
          </p>
          <div className="grid grid-cols-3 gap-3">
            {features.map((f) => (
              <DashboardCard
                key={f.title}
                hover
                className="rounded-xl p-4 text-center"
              >
                <div className="mb-2 text-2xl">{f.icon}</div>
                <p className="mb-1 font-dash-sans text-[13px] font-bold text-dash-secondary">{f.title}</p>
                <p className="font-dash-sans text-xs leading-relaxed text-dash-muted">{f.desc}</p>
              </DashboardCard>
            ))}
          </div>
        </div>

        <DashboardCard className="relative overflow-hidden rounded-2xl border-dash-accent-border px-8 py-10 text-center">
          <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-dash-accent/50 to-transparent" />

          <p className="mb-2 font-dash-mono text-[11px] uppercase tracking-widest text-dash-accent">
            Get notified
          </p>
          <h2 className="mb-2 font-dash-sans text-2xl font-extrabold tracking-tight text-dash-primary">
            Be first on the board
          </h2>
          <p className="mb-7 font-dash-sans text-sm leading-relaxed text-dash-muted">
            Early entrants get a 500 XP head-start. Don&apos;t miss it.
          </p>

          {submitted ? (
            <DashboardBadge variant="success" className="gap-2 px-5 py-2.5 text-sm">
              <span>✅</span>
              You&apos;re on the list!
            </DashboardBadge>
          ) : (
            <div className="mx-auto flex max-w-sm gap-2">
              <DashboardInput
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && email) setSubmitted(true);
                }}
                className="rounded-xl"
              />
              <DashboardButton
                variant="primary"
                className="rounded-xl px-5 py-2.5 font-dash-mono text-sm font-bold whitespace-nowrap active:scale-95"
                onClick={() => {
                  if (email) setSubmitted(true);
                }}
              >
                Notify me →
              </DashboardButton>
            </div>
          )}
        </DashboardCard>
      </div>
    </div>
  );
}
