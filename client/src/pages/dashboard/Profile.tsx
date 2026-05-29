import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  Trophy,
  Shield,
  Star,
  Zap,
  Target,
  Swords,
  TrendingUp,
  Lock,
  Sparkles,
  Award,
  CheckCircle2,
  Hash,
  Users,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import type { ActivityItem } from "../../api/dashboard.api";
import type { Difficulty } from "../../api/tasks.api";
import { useDashboardStore } from "../../state/dashboard/usedashboardstore";
import character_mascot from "../../assets/character_mascot.png";
import { useAuth } from "../../state/auth/AuthContext";
import {
  DashboardBadge,
  DashboardButton,
  DashboardCard,
  DashboardProgress,
} from "../../components/dashboard/ui";
import { cn } from "../../lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type Rarity = "common" | "rare" | "epic" | "legendary";

interface BadgeItem {
  id: number;
  icon: React.ReactNode;
  label: string;
  desc: string;
  earned: boolean;
  rarity: Rarity;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const RARITY_CLASSES: Record<
  Rarity,
  {
    label: string;
    cardEarned: string;
    cardLocked: string;
    iconEarned: string;
    text: string;
    hoverShadow: string;
  }
> = {
  common: {
    label: "Common",
    cardEarned: "border-dash-border bg-dash-muted-btn/50",
    cardLocked: "border-dash-border opacity-40",
    iconEarned: "border-dash-border bg-dash-muted-btn text-dash-muted",
    text: "text-dash-muted",
    hoverShadow: "hover:shadow-[0_8px_32px_color-mix(in_srgb,var(--dash-muted-btn)_40%,transparent)]",
  },
  rare: {
    label: "Rare",
    cardEarned: "border-dash-accent-border bg-dash-accent-soft/40",
    cardLocked: "border-dash-border opacity-40",
    iconEarned: "border-dash-accent-border bg-dash-accent-soft text-dash-accent",
    text: "text-dash-accent",
    hoverShadow: "hover:shadow-[0_8px_32px_color-mix(in_srgb,var(--dash-accent)_20%,transparent)]",
  },
  epic: {
    label: "Epic",
    cardEarned: "border-dash-accent-border bg-dash-accent-soft/60",
    cardLocked: "border-dash-border opacity-40",
    iconEarned: "border-dash-accent-border bg-dash-accent-soft text-dash-violet",
    text: "text-dash-violet",
    hoverShadow: "hover:shadow-[0_8px_32px_color-mix(in_srgb,var(--dash-violet)_25%,transparent)]",
  },
  legendary: {
    label: "Legendary",
    cardEarned: "border-dash-warning/40 bg-dash-warning/10",
    cardLocked: "border-dash-border opacity-40",
    iconEarned: "border-dash-warning/40 bg-dash-warning/15 text-dash-warning",
    text: "text-dash-warning",
    hoverShadow: "hover:shadow-[0_8px_32px_color-mix(in_srgb,var(--dash-warning)_25%,transparent)]",
  },
};

const LEVEL_RANK: Record<
  number,
  { title: string; tagline: string; accent: string; glow: string }
> = {
  1: {
    title: "Novice",
    tagline: "Just getting started",
    accent: "text-dash-accent",
    glow: "from-dash-accent/15",
  },
  2: {
    title: "Apprentice",
    tagline: "Skill is sharpening",
    accent: "text-dash-accent",
    glow: "from-dash-accent/15",
  },
  3: {
    title: "Adept",
    tagline: "Comfortable in the grind",
    accent: "text-dash-violet",
    glow: "from-dash-violet/15",
  },
  4: {
    title: "Veteran",
    tagline: "Battle-hardened",
    accent: "text-dash-violet",
    glow: "from-dash-violet/15",
  },
  5: {
    title: "Champion",
    tagline: "Feared on the leaderboard",
    accent: "text-dash-violet",
    glow: "from-dash-violet/20",
  },
};

const ACTIVITY_TONE: Record<string, string> = {
  accent: "bg-dash-accent-soft text-dash-accent border-dash-accent-border",
  violet: "bg-dash-accent-soft text-dash-violet border-dash-accent-border",
  orange: "bg-dash-orange/15 text-dash-orange border-dash-orange/30",
};

function getRank(level: number) {
  return LEVEL_RANK[Math.min(Math.max(level, 1), 5)] ?? LEVEL_RANK[1];
}

function cardRarityForLevel(level: number): Rarity {
  if (level >= 5) return "legendary";
  if (level >= 4) return "epic";
  if (level >= 3) return "rare";
  return "common";
}

function buildBadges(
  streak: number,
  totalCompleted: number,
  hardCompleted: number,
  xpEarnedToday: number,
): BadgeItem[] {
  return [
    {
      id: 1,
      icon: <Shield size={15} />,
      label: "Iron Guard",
      desc: "Reach a 7-day streak.",
      earned: streak >= 7,
      rarity: "rare",
    },
    {
      id: 2,
      icon: <Flame size={15} />,
      label: "Streak Master",
      desc: "Reach a 30-day streak.",
      earned: streak >= 30,
      rarity: "epic",
    },
    {
      id: 3,
      icon: <Target size={15} />,
      label: "First Quest",
      desc: "Complete your first task.",
      earned: totalCompleted >= 1,
      rarity: "common",
    },
    {
      id: 4,
      icon: <Star size={15} />,
      label: "Centurion",
      desc: "Complete 100 tasks.",
      earned: totalCompleted >= 100,
      rarity: "legendary",
    },
    {
      id: 5,
      icon: <Swords size={15} />,
      label: "Gladiator",
      desc: "Complete 10 hard tasks.",
      earned: hardCompleted >= 10,
      rarity: "epic",
    },
    {
      id: 6,
      icon: <Zap size={15} />,
      label: "Speed Run",
      desc: "Complete 5 hard tasks in one day.",
      earned: false,
      rarity: "epic",
    },
    {
      id: 7,
      icon: <TrendingUp size={15} />,
      label: "Momentum",
      desc: "Earn 500 XP in a single day.",
      earned: xpEarnedToday >= 500,
      rarity: "common",
    },
    {
      id: 8,
      icon: <Trophy size={15} />,
      label: "Grinder",
      desc: "Complete 25 tasks total.",
      earned: totalCompleted >= 25,
      rarity: "rare",
    },
  ];
}

function activityIcon(tone: ActivityItem["tone"]) {
  if (tone === "orange") return <Flame size={11} />;
  if (tone === "violet") return <Award size={11} />;
  return <CheckCircle2 size={11} />;
}

const DIFFICULTY_ROWS: {
  key: Difficulty;
  label: string;
  tone: "success" | "warning" | "danger";
}[] = [
  { key: "EASY", label: "Easy", tone: "success" },
  { key: "MEDIUM", label: "Medium", tone: "warning" },
  { key: "HARD", label: "Hard", tone: "danger" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function BadgeCard({ badge, index }: { badge: BadgeItem; index: number }) {
  const [hovered, setHovered] = useState(false);
  const r = RARITY_CLASSES[badge.rarity];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        animate={{ y: hovered && badge.earned ? -2 : 0 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "relative cursor-default select-none overflow-hidden rounded-2xl border p-4 transition-shadow duration-250",
          badge.earned ? r.cardEarned : r.cardLocked,
          badge.earned && hovered && r.hoverShadow,
          !badge.earned && "opacity-40",
          badge.earned && "shadow-dash-card",
        )}
      >
        {badge.earned && (
          <div
            className={cn(
              "absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent",
              badge.rarity === "legendary" ? "via-dash-warning/40" : "via-dash-accent/40",
            )}
          />
        )}

        <div className="flex items-center gap-3">
          <div
            className={cn(
              "relative flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-xl border",
              badge.earned ? r.iconEarned : "border-dash-border bg-dash-muted-btn text-dash-faint",
            )}
          >
            {badge.earned ? badge.icon : <Lock size={11} />}
            {badge.earned && badge.rarity === "legendary" && (
              <Sparkles size={7} className={cn("absolute -right-1 -top-1", r.text)} />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p
              className={cn(
                "text-[12px] font-semibold leading-tight tracking-tight",
                badge.earned ? "text-dash-primary" : "text-dash-faint",
              )}
            >
              {badge.label}
            </p>
            <span
              className={cn(
                "font-dash-mono text-[9px] font-bold uppercase tracking-widest",
                badge.earned ? r.text : "text-dash-faint",
                badge.earned ? "opacity-85" : "opacity-50",
              )}
            >
              {r.label}
            </span>
          </div>
        </div>

        <AnimatePresence>
          {hovered && badge.earned && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden"
            >
              <p className="mt-2.5 border-t border-dash-border pt-2.5 text-[10px] leading-relaxed text-dash-faint">
                {badge.desc}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

function StatChip({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "accent" | "success" | "warning";
}) {
  const toneClass = {
    accent: "text-dash-accent",
    success: "text-dash-success",
    warning: "text-dash-warning",
  }[tone];

  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-dash-border bg-dash-card px-4 py-3 shadow-dash-card">
      <span className={cn(toneClass, "opacity-80")}>{icon}</span>
      <div>
        <p className="mb-1 font-dash-mono text-[8px] uppercase leading-none tracking-widest text-dash-faint">
          {label}
        </p>
        <p className="font-dash-mono text-[15px] font-black leading-none tabular-nums tracking-tight text-dash-primary">
          {value}
        </p>
      </div>
    </div>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-0.5 font-dash-mono text-[9px] uppercase tracking-[0.14em] text-dash-faint">
      {children}
    </p>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const ACTIVITY_PAGE_SIZE = 5;

export default function Profile() {
  const { dashboard, loading, fetchDashboard } = useDashboardStore();
  const { user } = useAuth();

  const [activityPage, setActivityPage] = useState(0);

  useEffect(() => {
    if (!dashboard) void fetchDashboard();
  }, [dashboard, fetchDashboard]);

  const level = dashboard?.level ?? 1;
  const currentXP = dashboard?.currentXP ?? 0;
  const totalXP = dashboard?.totalXPForLevel ?? 250;
  const streak = dashboard?.streak ?? 0;
  const profileStats = dashboard?.profileStats;
  const username = user?.username ?? dashboard?.username ?? "Player";
  const xpPct = useMemo(
    () => (totalXP > 0 ? Math.min(Math.round((currentXP / totalXP) * 100), 100) : 0),
    [currentXP, totalXP],
  );
  const rank = getRank(level);

  const badges = useMemo(
    () =>
      buildBadges(
        streak,
        profileStats?.totalCompleted ?? 0,
        dashboard?.difficultyStats.HARD.completed ?? 0,
        dashboard?.todayStats.xpEarned ?? 0,
      ),
    [streak, profileStats, dashboard],
  );

  const earnedCount = useMemo(() => badges.filter((b) => b.earned).length, [badges]);
  const activity = dashboard?.recentActivity ?? [];
  const cardRarity = cardRarityForLevel(level);
  const cr = RARITY_CLASSES[cardRarity];

  const activityPageCount = Math.ceil(activity.length / ACTIVITY_PAGE_SIZE);
  const pagedActivity = activity.slice(
    activityPage * ACTIVITY_PAGE_SIZE,
    (activityPage + 1) * ACTIVITY_PAGE_SIZE,
  );

  if (loading && !dashboard) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dash-page font-dash-sans">
        <p className="font-dash-mono text-sm text-dash-muted">Loading profile…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dash-page font-dash-sans transition-colors duration-300">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_25%_0%,color-mix(in_srgb,var(--dash-accent)_var(--dash-hero-accent-mix),transparent)_0%,transparent_55%)]"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_35%_35%_at_78%_8%,color-mix(in_srgb,var(--dash-violet)_var(--dash-hero-violet-mix),transparent)_0%,transparent_50%)]"
          aria-hidden
        />
      </div>

      <div className="relative w-full">
        <div className="relative min-h-[520px] overflow-hidden">
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br to-transparent",
              rank.glow,
              "via-dash-violet/5",
            )}
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,var(--dash-border)_1px,transparent_1px)] bg-[length:30px_30px] opacity-[var(--dash-hero-grid-opacity)] mask-[linear-gradient(to_bottom,transparent_0%,black_12%,black_72%,transparent_100%)]"
            aria-hidden
          />
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent to-dash-page" />

          <div className="relative px-6 pb-0 pt-8 md:px-10 lg:px-16 xl:px-20">
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.38 }}
              className="mb-10 flex items-center justify-between"
            >
              <div>
                <SectionEyebrow>Player Profile</SectionEyebrow>
                <h1 className="text-[30px] font-black leading-none tracking-tight text-dash-primary">
                  {username}
                </h1>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.35 }}
                className="flex items-center gap-2 rounded-full border border-dash-accent-border bg-dash-accent-soft px-4 py-2 backdrop-blur-md"
              >
                <Hash size={10} className="text-dash-accent" />
                <span className="font-dash-mono text-[11px] font-bold text-dash-accent">
                  Level {level} · {rank.title}
                </span>
              </motion.div>
            </motion.div>

            <div className="grid grid-cols-1 items-start gap-8 pb-4 lg:grid-cols-[320px_1fr] xl:grid-cols-[340px_1fr]">
              <motion.div
                initial={{ opacity: 0, y: 28, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "relative overflow-hidden rounded-[28px] border bg-dash-sidebar shadow-2xl",
                  cr.cardEarned,
                )}
              >
                <div className="relative h-[360px] overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_65%_at_50%_80%,color-mix(in_srgb,var(--dash-accent)_25%,transparent)_0%,transparent_60%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle,color-mix(in_srgb,var(--dash-primary)_3%,transparent)_1px,transparent_1px)] bg-[length:22px_22px] mask-[linear-gradient(to_bottom,transparent_0%,black_30%)]" />

                  <motion.img
                    src={character_mascot}
                    alt="Character"
                    initial={{ scale: 1.07, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.22, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 h-full w-full object-cover drop-shadow-[0_20px_48px_color-mix(in_srgb,var(--dash-accent)_30%,transparent)]"
                  />

                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-dash-sidebar" />

                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.88 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.38 }}
                    className={cn(
                      "absolute left-1/2 top-4 flex -translate-x-1/2 items-center gap-1.5 rounded-full border px-4 py-1.5 backdrop-blur-md",
                      cr.iconEarned,
                    )}
                  >
                    {cardRarity === "legendary" && <Sparkles size={8} className={cr.text} />}
                    <span className={cn("font-dash-mono text-[10px] font-black uppercase tracking-[0.14em]", cr.text)}>
                      {cr.label}
                    </span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.44, duration: 0.33 }}
                    className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-gradient-to-br from-dash-accent to-dash-violet font-dash-mono text-[15px] font-black text-white shadow-lg shadow-dash-accent/40"
                  >
                    {level}
                  </motion.div>

                  <div className="absolute bottom-3 left-5 right-5">
                    <DashboardProgress value={currentXP} max={totalXP} showValue className="[&_span]:text-white/40" />
                  </div>
                </div>

                <div className="px-5 pb-5 pt-4">
                  <h2 className="mb-1 text-[24px] font-black leading-none tracking-tight text-dash-primary">
                    {username}
                  </h2>
                  <div className="mb-5 flex items-center gap-2">
                    <div className="flex h-4 w-4 items-center justify-center rounded-md border border-dash-accent-border bg-dash-accent-soft">
                      <Zap size={8} className="text-dash-violet" />
                    </div>
                    <span className="font-dash-mono text-[10px] font-semibold uppercase tracking-wider text-dash-faint">
                      {rank.title} · {rank.tagline}
                    </span>
                  </div>

                  <div className="mb-4 h-px bg-dash-border" />

                  <div className="mb-4 grid grid-cols-3 gap-2">
                    {[
                      { label: "Streak", value: `${streak}d`, tone: "text-dash-orange" as const, icon: <Flame size={9} /> },
                      { label: "XP Left", value: (totalXP - currentXP).toLocaleString(), tone: cr.text, icon: <Zap size={9} /> },
                      { label: "Badges", value: `${earnedCount}/${badges.length}`, tone: "text-dash-violet" as const, icon: <Award size={9} /> },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="rounded-xl border border-dash-border bg-dash-card-alt p-3 text-center"
                      >
                        <div className={cn("mb-1.5 flex items-center justify-center gap-1", s.tone)}>
                          {s.icon}
                          <span className="font-dash-mono text-[7px] font-bold uppercase tracking-wider">
                            {s.label}
                          </span>
                        </div>
                        <p className="font-dash-mono text-[16px] font-black leading-none tracking-tight text-dash-primary">
                          {s.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <p className="text-center font-dash-mono text-[9px] text-dash-faint">
                    {(totalXP - currentXP).toLocaleString()} XP to Level {level + 1}
                  </p>
                </div>
              </motion.div>

              <div className="flex flex-col gap-5 pb-12 pt-1">
                <motion.div
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.12, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p className="mb-1 text-[13px] font-medium text-dash-faint">{rank.tagline}</p>
                  <p className="mb-3 text-[clamp(38px,4.5vw,56px)] font-black leading-none tracking-tight text-dash-primary">
                    {username}
                  </p>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="flex items-center gap-1.5 rounded-full border border-dash-accent-border bg-dash-accent-soft px-3 py-1.5 font-dash-mono text-[10px] font-semibold text-dash-accent">
                      <Hash size={8} /> {rank.title}
                    </span>
                    <span className="flex items-center gap-1.5 font-dash-mono text-[11px] text-dash-orange">
                      <Flame size={10} /> {streak}-day streak
                    </span>
                    <span className="flex items-center gap-1.5 font-dash-mono text-[11px] text-dash-faint">
                      <Award size={10} className="opacity-50" /> {earnedCount} badges unlocked
                    </span>
                    <span className="flex items-center gap-1 rounded-full border border-dashed border-dash-border px-2.5 py-1 font-dash-mono text-[10px] text-dash-faint">
                      <Users size={8} /> No Clan
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.18, duration: 0.4 }}
                >
                  <DashboardCard className="rounded-2xl p-5">
                    <div className="mb-3 flex items-baseline justify-between">
                      <span className="text-[11px] font-semibold text-dash-secondary">
                        Level {level} → {level + 1}
                      </span>
                      <span className="font-dash-mono text-[11px] font-bold text-dash-accent">
                        {currentXP.toLocaleString()} / {totalXP.toLocaleString()} XP
                      </span>
                    </div>
                    <DashboardProgress value={currentXP} max={totalXP} />
                    <p className="mt-2 font-dash-mono text-[10px] text-dash-faint">
                      {(totalXP - currentXP).toLocaleString()} XP to next level · {xpPct}% complete
                    </p>
                  </DashboardCard>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.24, duration: 0.4 }}
                  className="grid grid-cols-2 gap-3 sm:grid-cols-4"
                >
                  <StatChip
                    icon={<Zap size={13} />}
                    label="Total XP"
                    value={(profileStats?.totalXP ?? 0).toLocaleString()}
                    tone="accent"
                  />
                  <StatChip
                    icon={<CheckCircle2 size={13} />}
                    label="Completed"
                    value={String(profileStats?.totalCompleted ?? 0)}
                    tone="success"
                  />
                  <StatChip
                    icon={<Trophy size={13} />}
                    label="Streak"
                    value={`${streak}d`}
                    tone="warning"
                  />
                  <StatChip
                    icon={<TrendingUp size={13} />}
                    label="Consistency"
                    value={`${profileStats?.consistency ?? 0}%`}
                    tone="success"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <DashboardCard className="overflow-hidden rounded-2xl p-0">
                    <div className="border-b border-dash-border px-5 pb-3 pt-4">
                      <SectionEyebrow>Difficulty Breakdown</SectionEyebrow>
                    </div>
                    <div className="grid grid-cols-3 divide-x divide-dash-border">
                      {DIFFICULTY_ROWS.map((d) => {
                        const stat = dashboard?.difficultyStats[d.key] ?? {
                          created: 0,
                          completed: 0,
                        };
                        const total = Math.max(stat.created, 1);
                        const pct = Math.round((stat.completed / total) * 100);
                        const toneClass = {
                          success: "text-dash-success",
                          warning: "text-dash-warning",
                          danger: "text-dash-danger",
                        }[d.tone];
                        return (
                          <div key={d.key} className="px-5 py-4">
                            <span
                              className={cn(
                                "mb-2 block font-dash-mono text-[8px] font-bold uppercase tracking-widest",
                                toneClass,
                              )}
                            >
                              {d.label}
                            </span>
                            <div className="mb-2 flex items-end gap-1.5">
                              <span className="text-[24px] font-black leading-none tracking-tight text-dash-primary">
                                {stat.completed}
                              </span>
                              <span className="pb-0.5 font-dash-mono text-[11px] text-dash-faint">
                                /{stat.created}
                              </span>
                            </div>
                            <DashboardProgress
                              value={stat.completed}
                              max={total}
                              className="[&>div]:h-1"
                            />
                            <p className="mt-1.5 font-dash-mono text-[8px] text-dash-faint">
                              {stat.created === 0 ? "No tasks yet" : `${pct}% done`}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </DashboardCard>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 pb-20 pt-4 md:px-10 md:pt-6 lg:px-16 xl:px-20">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <SectionEyebrow>Achievements</SectionEyebrow>
                  <h2 className="text-[20px] font-black tracking-tight text-dash-primary">
                    {earnedCount} / {badges.length} Unlocked
                  </h2>
                </div>
                <span className="rounded-full border border-dashed border-dash-border px-3 py-1.5 font-dash-mono text-[9px] uppercase tracking-widest text-dash-faint">
                  Hover to inspect
                </span>
              </div>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {badges.map((badge, i) => (
                  <BadgeCard key={badge.id} badge={badge} index={i} />
                ))}
              </div>
            </motion.section>

            {/* ─── Activity / Grind History ─────────────────────────────── */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.44, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mb-5">
                <SectionEyebrow>Activity</SectionEyebrow>
                <h2 className="text-[20px] font-black tracking-tight text-dash-primary">Grind History</h2>
              </div>

              <DashboardCard className="mb-4 overflow-hidden rounded-2xl p-0">
                <div className="relative px-5 py-3">

                  {activity.length === 0 ? (
                    <p className="py-6 text-center font-dash-mono text-[11px] text-dash-muted">
                      Complete tasks or add workspace items to see activity.
                    </p>
                  ) : (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activityPage}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      >
                        {pagedActivity.map((item, i) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05, duration: 0.25 }}
                            className={cn(
                              "relative flex items-start gap-3.5 py-3",
                              i < pagedActivity.length - 1 && "border-b border-dash-border",
                            )}
                          >
                            <div
                              className={cn(
                                "z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border",
                                ACTIVITY_TONE[item.tone],
                              )}
                            >
                              {activityIcon(item.tone)}
                            </div>
                            <div className="min-w-0 flex-1 pt-0.5">
                              <p className="text-[12px] font-semibold leading-tight text-dash-primary">
                                {item.text}
                              </p>
                              <p className="mt-0.5 font-dash-mono text-[9px] text-dash-muted">
                                {item.sub}
                              </p>
                            </div>
                            {item.xp != null && item.xp > 0 && (
                              <DashboardBadge variant="accent" className="mt-0.5 shrink-0">
                                +{item.xp}
                              </DashboardBadge>
                            )}
                          </motion.div>
                        ))}
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>

                {/* Pagination controls — only shown when there's more than one page */}
                {activityPageCount > 1 && (
                  <div className="flex items-center justify-between border-t border-dash-border px-5 py-3">
                    <button
                      onClick={() => setActivityPage((p) => Math.max(0, p - 1))}
                      disabled={activityPage === 0}
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-lg border transition-colors duration-150",
                        activityPage === 0
                          ? "cursor-not-allowed border-dash-border text-dash-faint opacity-30"
                          : "border-dash-border bg-dash-card text-dash-secondary hover:border-dash-accent-border hover:text-dash-accent",
                      )}
                    >
                      <ChevronLeft size={13} />
                    </button>

                    <div className="flex items-center gap-1.5">
                      {Array.from({ length: activityPageCount }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setActivityPage(i)}
                          className={cn(
                            "h-1.5 rounded-full transition-all duration-200",
                            i === activityPage
                              ? "w-4 bg-dash-accent"
                              : "w-1.5 bg-dash-border hover:bg-dash-muted",
                          )}
                        />
                      ))}
                    </div>

                    <button
                      onClick={() => setActivityPage((p) => Math.min(activityPageCount - 1, p + 1))}
                      disabled={activityPage === activityPageCount - 1}
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-lg border transition-colors duration-150",
                        activityPage === activityPageCount - 1
                          ? "cursor-not-allowed border-dash-border text-dash-faint opacity-30"
                          : "border-dash-border bg-dash-card text-dash-secondary hover:border-dash-accent-border hover:text-dash-accent",
                      )}
                    >
                      <ChevronRight size={13} />
                    </button>
                  </div>
                )}
              </DashboardCard>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.72, duration: 0.4 }}
              >
                <DashboardCard className="flex items-center gap-4 rounded-2xl border-dashed border-dash-accent-border bg-dash-accent-soft px-5 py-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-dash-accent-border bg-dash-accent-soft">
                    <Users size={14} className="text-dash-accent opacity-70" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[12px] font-semibold tracking-tight text-dash-secondary">
                      Clans & Social — Coming Soon
                    </p>
                    <p className="mt-0.5 font-dash-mono text-[9px] text-dash-faint">
                      Compete with friends · Clan wars · Leaderboards
                    </p>
                  </div>
                  <DashboardBadge variant="accent">Planned</DashboardBadge>
                </DashboardCard>
              </motion.div>
            </motion.section>
          </div>
        </div>
      </div>
    </div>
  );
}