import { useState } from "react";
import { motion } from "framer-motion";
import {
  Zap, Flame, Trophy, Shield, Star, Sword, Circle,
  CheckCircle2, TrendingUp, Swords, Award, Target,
  Lock, Sparkles, ChevronRight,
} from "lucide-react";
import { useDashboardStore } from "../../store/usedashboardstore";

// ─── Types ────────────────────────────────────────────────────────────────────

type Rarity = "common" | "rare" | "epic" | "legendary";

interface Badge {
  id: number;
  icon: React.ReactNode;
  label: string;
  desc: string;
  earned: boolean;
  rarity: Rarity;
}

interface Activity {
  id: number;
  icon: React.ReactNode;
  text: string;
  sub: string;
  xp?: number;
  color: string;
}

// ─── Style maps ───────────────────────────────────────────────────────────────

const RARITY_META: Record<Rarity, { glow: string; border: string; text: string; bg: string; label: string }> = {
  common:    { glow: "rgba(148,163,184,0.12)", border: "rgba(148,163,184,0.18)", text: "#94A3B8", bg: "rgba(148,163,184,0.06)", label: "Common"    },
  rare:      { glow: "rgba(59,130,246,0.18)",  border: "rgba(59,130,246,0.22)",  text: "#60A5FA", bg: "rgba(59,130,246,0.07)", label: "Rare"       },
  epic:      { glow: "rgba(139,92,246,0.22)",  border: "rgba(139,92,246,0.28)",  text: "#A78BFA", bg: "rgba(139,92,246,0.09)", label: "Epic"       },
  legendary: { glow: "rgba(251,191,36,0.22)",  border: "rgba(251,191,36,0.28)",  text: "#FCD34D", bg: "rgba(251,191,36,0.07)", label: "Legendary"  },
};

// ─── Static data ──────────────────────────────────────────────────────────────

const BADGES: Badge[] = [
  { id: 1, icon: <Flame size={18} />,        label: "Streak Master",  desc: "Maintained a 30-day streak without breaking.",   earned: true,  rarity: "epic"      },
  { id: 2, icon: <Trophy size={18} />,       label: "Top 1%",         desc: "Ranked in the global top 1% this season.",       earned: true,  rarity: "legendary" },
  { id: 3, icon: <Shield size={18} />,       label: "Iron Guard",     desc: "Protected your streak for 7 consecutive days.",  earned: true,  rarity: "rare"      },
  { id: 4, icon: <Star size={18} />,         label: "Legend",         desc: "Completed over 1000 lifetime tasks.",            earned: true,  rarity: "legendary" },
  { id: 5, icon: <Zap size={18} />,          label: "Speed Run",      desc: "Complete 5 hard tasks in a single day.",         earned: false, rarity: "epic"      },
  { id: 6, icon: <Target size={18} />,       label: "Precision",      desc: "Complete 100 tasks with no deletions.",          earned: false, rarity: "rare"      },
  { id: 7, icon: <Swords size={18} />,       label: "Gladiator",      desc: "Win 10 consecutive hard difficulty tasks.",      earned: false, rarity: "epic"      },
  { id: 8, icon: <TrendingUp size={18} />,   label: "Momentum",       desc: "Earn 500 XP in a single day.",                  earned: false, rarity: "common"    },
];

const RECENT_ACTIVITY: Activity[] = [
  { id: 1, icon: <CheckCircle2 size={13} />, text: "Completed DSA Practice",    sub: "2 min ago",  xp: 50,   color: "#6366f1" },
  { id: 2, icon: <TrendingUp size={13} />,   text: "Reached Level 5",           sub: "1 hr ago",              color: "#a78bfa" },
  { id: 3, icon: <CheckCircle2 size={13} />, text: "Finished System Design Doc",sub: "3 hr ago",  xp: 100,  color: "#6366f1" },
  { id: 4, icon: <Flame size={13} />,        text: "7-day streak achieved",     sub: "Yesterday",             color: "#f97316" },
  { id: 5, icon: <CheckCircle2 size={13} />, text: "Reviewed PR #42",           sub: "Yesterday", xp: 30,   color: "#6366f1" },
  { id: 6, icon: <Award size={13} />,        text: 'Earned "Iron Guard" badge', sub: "2 days ago",            color: "#60a5fa" },
];

const CHARACTER_DATA: Record<number, { title: string; tagline: string; icon: React.ReactNode }> = {
  1: { title: "Novice",      tagline: "Just getting started",     icon: <Circle size={52} strokeWidth={1.5} className="text-[#6366f1]" />     },
  2: { title: "Apprentice",  tagline: "Skill is sharpening",      icon: <Star size={52} strokeWidth={1.5} className="text-[#6366f1]" />       },
  3: { title: "Adept",       tagline: "Comfortable in the grind", icon: <Shield size={52} strokeWidth={1.5} className="text-[#6366f1]" />     },
  4: { title: "Veteran",     tagline: "Battle-hardened",          icon: <Sword size={52} strokeWidth={1.5} className="text-[#6366f1]" />      },
  5: { title: "Champion",    tagline: "Feared on the leaderboard",icon: <Sword size={52} strokeWidth={1.5} className="text-[#a78bfa]" />      },
};

function getCharacter(level: number) {
  return CHARACTER_DATA[Math.min(level, 5)] ?? CHARACTER_DATA[5];
}

// ─── Flip Badge Card ──────────────────────────────────────────────────────────

function BadgeCard({ badge }: { badge: Badge }) {
  const [flipped, setFlipped] = useState(false);
  const r = RARITY_META[badge.rarity];

  return (
    <div
      className="cursor-pointer"
      style={{ perspective: 800, height: 140 }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <motion.div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transformStyle: "preserve-3d",
        }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-2.5 px-3"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            background: badge.earned ? r.bg : "rgba(255,255,255,0.02)",
            border: `1px solid ${badge.earned ? r.border : "rgba(255,255,255,0.05)"}`,
            boxShadow: badge.earned ? `0 0 28px ${r.glow}` : "none",
            opacity: badge.earned ? 1 : 0.38,
          }}
        >
          {!badge.earned && (
            <Lock size={9} className="absolute top-2.5 right-2.5 text-[#333]" />
          )}
          {badge.earned && badge.rarity === "legendary" && (
            <Sparkles size={9} className="absolute top-2.5 right-2.5" style={{ color: r.text }} />
          )}
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{
              background: badge.earned ? `${r.text}1a` : "rgba(255,255,255,0.04)",
              color: badge.earned ? r.text : "#374151",
            }}
          >
            {badge.icon}
          </div>
          <div className="text-center">
            <p className="text-[11px] font-semibold text-[#ccc] leading-tight">{badge.label}</p>
            {badge.earned && (
              <p
                className="text-[9px] font-bold uppercase tracking-widest mt-1"
                style={{ color: r.text, fontFamily: "'DM Mono', monospace" }}
              >
                {r.label}
              </p>
            )}
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-2 px-4 text-center"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: badge.earned ? `${r.text}0d` : "rgba(255,255,255,0.03)",
            border: `1px solid ${badge.earned ? r.border : "rgba(255,255,255,0.06)"}`,
          }}
        >
          <p className="text-[11px] font-semibold leading-tight" style={{ color: badge.earned ? r.text : "#444" }}>
            {badge.label}
          </p>
          <p className="text-[10px] text-[#555] leading-relaxed">{badge.desc}</p>
          {!badge.earned && (
            <span
              className="text-[9px] px-2 py-0.5 rounded-full mt-1"
              style={{ background: "rgba(255,255,255,0.05)", color: "#333", fontFamily: "'DM Mono', monospace" }}
            >
              LOCKED
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl p-5 ${className}`}
      style={{ background: "#111115", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      {children}
    </div>
  );
}

function SectionLabel({ icon, children }: { icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      {icon && <span className="text-[#6366f1]">{icon}</span>}
      <p
        className="text-[11px] uppercase tracking-[0.08em] text-[#444]"
        style={{ fontFamily: "'DM Mono', monospace" }}
      >
        {children}
      </p>
    </div>
  );
}

// ─── Main Profile Component ───────────────────────────────────────────────────

export default function Profile() {
  const { dashboard } = useDashboardStore();

  const level = dashboard?.level ?? 5;
  const currentXP = dashboard?.currentXP ?? 3800;
  const totalXP = dashboard?.totalXPForLevel ?? 5000;
  const streak = dashboard?.streak ?? 14;
  const username = dashboard?.username ?? "Kyzen";

  const xpPct = Math.round((currentXP / totalXP) * 100);
  const char = getCharacter(level);

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <div
      className="min-h-screen p-4 md:p-6 lg:p-8"
      style={{ background: "#0c0c0f", fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="max-w-4xl mx-auto space-y-4">

        {/* ── Hero ── */}
        <motion.div
          {...fadeUp(0)}
          className="relative rounded-2xl overflow-hidden"
          style={{ background: "#111115", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          {/* Ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: [
                "radial-gradient(ellipse 60% 80% at 10% -10%, rgba(99,102,241,0.12) 0%, transparent 60%)",
                "radial-gradient(ellipse 40% 60% at 90% 110%, rgba(139,92,246,0.08) 0%, transparent 60%)",
              ].join(","),
            }}
          />
          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "24px 24px" }}
          />

          <div className="relative px-6 pt-8 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Character icon */}
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative shrink-0"
              >
                <div
                  className="w-24 h-24 rounded-2xl flex items-center justify-center"
                  style={{
                    background: "rgba(99,102,241,0.1)",
                    border: "1px solid rgba(99,102,241,0.22)",
                    boxShadow: "0 0 40px rgba(99,102,241,0.14)",
                  }}
                >
                  {char.icon}
                </div>
                {/* Level badge */}
                <div
                  className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-lg text-[10px] font-bold"
                  style={{
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    color: "#fff",
                    fontFamily: "'DM Mono', monospace",
                    boxShadow: "0 4px 12px rgba(99,102,241,0.4)",
                  }}
                >
                  LV {level}
                </div>
              </motion.div>

              {/* Identity */}
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <motion.p
                  {...fadeUp(0.08)}
                  className="text-[11px] uppercase tracking-widest text-[#555] mb-1"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  {char.tagline}
                </motion.p>
                <motion.h1
                  {...fadeUp(0.1)}
                  className="text-[28px] font-bold text-white mb-0.5"
                  style={{ letterSpacing: "-0.025em" }}
                >
                  {username}
                </motion.h1>
                <motion.p
                  {...fadeUp(0.12)}
                  className="text-[15px] font-semibold mb-5"
                  style={{ color: "#818cf8" }}
                >
                  {char.title}
                </motion.p>

                {/* XP Bar */}
                <motion.div {...fadeUp(0.14)} className="max-w-sm">
                  <div className="flex justify-between items-center mb-1.5">
                    <span
                      className="text-[10px] text-[#444]"
                      style={{ fontFamily: "'DM Mono', monospace" }}
                    >
                      Level {level} → {level + 1}
                    </span>
                    <span
                      className="text-[10px] font-medium"
                      style={{ color: "#818cf8", fontFamily: "'DM Mono', monospace" }}
                    >
                      {currentXP.toLocaleString()} / {totalXP.toLocaleString()} XP · {xpPct}%
                    </span>
                  </div>
                  <div
                    className="h-2 rounded-full overflow-hidden w-full"
                    style={{ background: "rgba(255,255,255,0.07)" }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${xpPct}%` }}
                      transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      style={{ background: "linear-gradient(90deg, #6366f1, #a78bfa)" }}
                    />
                  </div>
                  <p
                    className="text-[10px] text-[#444] mt-1.5"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    {(totalXP - currentXP).toLocaleString()} XP to next level
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Stats Row ── */}
        <motion.div {...fadeUp(0.1)} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: <Zap size={15} />,      label: "Total XP",       value: "12,847",  sub: "↑ 340 this week", color: "#6366f1" },
            { icon: <CheckCircle2 size={15} />, label: "Tasks Done",  value: "97",      sub: "3 this week",     color: "#4ade80" },
            { icon: <Flame size={15} />,     label: "Current Streak", value: `${streak}d`, sub: "days",         color: "#f97316" },
            { icon: <Trophy size={15} />,    label: "Best Streak",    value: "21d",     sub: "personal best",   color: "#facc15" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 + i * 0.05, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl p-4 flex items-center gap-3"
              style={{ background: "#111115", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${s.color}16`, color: s.color }}
              >
                {s.icon}
              </div>
              <div className="min-w-0">
                <p
                  className="text-[19px] font-bold text-white leading-none"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  {s.value}
                </p>
                <p className="text-[10px] text-[#3a3a3a] mt-0.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                  {s.label}
                </p>
                <p
                  className="text-[9px] mt-0.5 font-semibold"
                  style={{ color: s.color, fontFamily: "'DM Mono', monospace" }}
                >
                  {s.sub}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Badges ── */}
        <motion.div {...fadeUp(0.2)}>
          <Section>
            <SectionLabel icon={<Award size={13} />}>
              Badges — {BADGES.filter(b => b.earned).length}/{BADGES.length} earned
            </SectionLabel>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {BADGES.map((badge, i) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.22 + i * 0.04, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <BadgeCard badge={badge} />
                </motion.div>
              ))}
            </div>
          </Section>
        </motion.div>

        {/* ── Progress Breakdown + Activity ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Progress Breakdown */}
          <motion.div {...fadeUp(0.28)}>
            <Section className="h-full">
              <SectionLabel icon={<Target size={13} />}>Progress Breakdown</SectionLabel>
              <div className="space-y-4">
                {[
                  { label: "Easy",   count: 41, total: 60, color: "#4ade80", bg: "rgba(74,222,128,0.1)"   },
                  { label: "Medium", count: 33, total: 50, color: "#facc15", bg: "rgba(250,204,21,0.1)"   },
                  { label: "Hard",   count: 23, total: 40, color: "#f87171", bg: "rgba(248,113,113,0.1)"  },
                ].map((d, i) => {
                  const pct = Math.round((d.count / d.total) * 100);
                  return (
                    <motion.div
                      key={d.label}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + i * 0.07 }}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                            style={{ color: d.color, background: d.bg, fontFamily: "'DM Mono', monospace" }}
                          >
                            {d.label}
                          </span>
                        </div>
                        <span
                          className="text-[11px] text-[#555] tabular-nums"
                          style={{ fontFamily: "'DM Mono', monospace" }}
                        >
                          {d.count} / {d.total}
                        </span>
                      </div>
                      <div
                        className="h-1.5 w-full rounded-full overflow-hidden"
                        style={{ background: "rgba(255,255,255,0.05)" }}
                      >
                        <motion.div
                          className="h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.9, delay: 0.35 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                          style={{ background: d.color }}
                        />
                      </div>
                    </motion.div>
                  );
                })}

                {/* Total summary */}
                <div
                  className="mt-2 pt-4 flex items-center justify-between"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <span className="text-[11px] text-[#444]" style={{ fontFamily: "'DM Mono', monospace" }}>
                    Total completed
                  </span>
                  <span
                    className="text-[13px] font-semibold text-white"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    97 tasks
                  </span>
                </div>
              </div>
            </Section>
          </motion.div>

          {/* Recent Activity */}
          <motion.div {...fadeUp(0.32)}>
            <Section className="h-full">
              <SectionLabel icon={<TrendingUp size={13} />}>Recent Activity</SectionLabel>
              <div className="flex flex-col">
                {RECENT_ACTIVITY.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.34 + i * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center gap-3 py-2.5"
                    style={{
                      borderBottom: i < RECENT_ACTIVITY.length - 1
                        ? "1px solid rgba(255,255,255,0.04)"
                        : "none",
                    }}
                  >
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `${item.color}18`, color: item.color }}
                    >
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-[12px] text-[#bbb] truncate"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {item.text}
                      </p>
                      <p
                        className="text-[10px] text-[#333] mt-0.5"
                        style={{ fontFamily: "'DM Mono', monospace" }}
                      >
                        {item.sub}
                      </p>
                    </div>
                    {item.xp && (
                      <span
                        className="text-[10px] font-semibold shrink-0"
                        style={{ color: "#818cf8", fontFamily: "'DM Mono', monospace" }}
                      >
                        +{item.xp} XP
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
              <button
                className="w-full mt-3 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] transition-colors"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  color: "#444",
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                View all <ChevronRight size={11} />
              </button>
            </Section>
          </motion.div>
        </div>
      </div>
    </div>
  );
}