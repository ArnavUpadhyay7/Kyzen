import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, Flame, Trophy, Shield, Star, Sword, Circle,
  CheckCircle2, TrendingUp, Swords, Award, Target,
  Lock, Sparkles, ChevronRight, Users, Hash,
} from "lucide-react";
import { useDashboardStore } from "../../state/dashboard/usedashboardstore";
import { useTokens } from "../../state/theme/ThemeContext";
import character_mascot from "../../assets/character_mascot.png"

type Rarity = "common" | "rare" | "epic" | "legendary";

interface Badge {
  id: number;
  icon: React.ReactNode;
  label: string;
  desc: string;
  earned: boolean;
  rarity: Rarity;
  featured?: boolean;
}

interface Activity {
  id: number;
  icon: React.ReactNode;
  text: string;
  sub: string;
  xp?: number;
  color: string;
}

// Rarity colors: dark uses bright/neon variants, light uses richer saturated tones
const RARITY_META: Record<Rarity, {
  glow: string; border: string;
  darkText: string; lightText: string;
  bg: string; label: string;
}> = {
  common:    { glow: "rgba(148,163,184,0.15)", border: "rgba(148,163,184,0.25)", darkText: "#94A3B8", lightText: "#475569", bg: "rgba(148,163,184,0.08)", label: "Common"    },
  rare:      { glow: "rgba(59,130,246,0.18)",  border: "rgba(59,130,246,0.28)",  darkText: "#60A5FA", lightText: "#2563eb", bg: "rgba(59,130,246,0.08)",  label: "Rare"       },
  epic:      { glow: "rgba(139,92,246,0.20)",  border: "rgba(139,92,246,0.30)",  darkText: "#A78BFA", lightText: "#7c3aed", bg: "rgba(139,92,246,0.08)",  label: "Epic"       },
  legendary: { glow: "rgba(234,179,8,0.20)",   border: "rgba(234,179,8,0.30)",   darkText: "#FBBF24", lightText: "#b45309", bg: "rgba(234,179,8,0.08)",   label: "Legendary"  },
};

const BADGES: Badge[] = [
  { id: 1, icon: <Flame size={20} />,      label: "Streak Master",  desc: "Maintained a 30-day streak without breaking.",  earned: true,  rarity: "epic",      featured: true  },
  { id: 2, icon: <Trophy size={20} />,     label: "Top 1%",         desc: "Ranked in the global top 1% this season.",      earned: true,  rarity: "legendary", featured: true  },
  { id: 3, icon: <Shield size={20} />,     label: "Iron Guard",     desc: "Protected your streak for 7 consecutive days.", earned: true,  rarity: "rare"                       },
  { id: 4, icon: <Star size={20} />,       label: "Legend",         desc: "Completed over 1000 lifetime tasks.",           earned: true,  rarity: "legendary"                  },
  { id: 5, icon: <Zap size={20} />,        label: "Speed Run",      desc: "Complete 5 hard tasks in a single day.",        earned: false, rarity: "epic"                       },
  { id: 6, icon: <Target size={20} />,     label: "Precision",      desc: "Complete 100 tasks with no deletions.",         earned: false, rarity: "rare"                       },
  { id: 7, icon: <Swords size={20} />,     label: "Gladiator",      desc: "Win 10 consecutive hard difficulty tasks.",     earned: false, rarity: "epic"                       },
  { id: 8, icon: <TrendingUp size={20} />, label: "Momentum",       desc: "Earn 500 XP in a single day.",                 earned: false, rarity: "common"                     },
];

const RECENT_ACTIVITY: Activity[] = [
  { id: 1, icon: <CheckCircle2 size={12} />, text: "Completed DSA Practice",     sub: "2 min ago",  xp: 50,  color: "#6366f1" },
  { id: 2, icon: <TrendingUp size={12} />,   text: "Reached Level 5",            sub: "1 hr ago",            color: "#8b5cf6" },
  { id: 3, icon: <CheckCircle2 size={12} />, text: "Finished System Design Doc", sub: "3 hr ago",   xp: 100, color: "#6366f1" },
  { id: 4, icon: <Flame size={12} />,        text: "7-day streak achieved",      sub: "Yesterday",           color: "#f97316" },
  { id: 5, icon: <CheckCircle2 size={12} />, text: "Reviewed PR #42",            sub: "Yesterday",  xp: 30,  color: "#6366f1" },
  { id: 6, icon: <Award size={12} />,        text: 'Earned "Iron Guard" badge',  sub: "2 days ago",          color: "#2563eb" },
];

const CHARACTER_DATA: Record<number, { title: string; tagline: string; rank: string; icon: React.ReactNode; color: string }> = {
  1: { title: "Novice",     tagline: "Just getting started",       rank: "I",   color: "#6366f1", icon: <Circle size={64} strokeWidth={1.2} /> },
  2: { title: "Apprentice", tagline: "Skill is sharpening",        rank: "II",  color: "#6366f1", icon: <Star   size={64} strokeWidth={1.2} /> },
  3: { title: "Adept",      tagline: "Comfortable in the grind",   rank: "III", color: "#8b5cf6", icon: <Shield size={64} strokeWidth={1.2} /> },
  4: { title: "Veteran",    tagline: "Battle-hardened",            rank: "IV",  color: "#8b5cf6", icon: <Sword  size={64} strokeWidth={1.2} /> },
  5: { title: "Champion",   tagline: "Feared on the leaderboard",  rank: "V",   color: "#7c3aed", icon: <Sword  size={64} strokeWidth={1.2} /> },
};

function getCharacter(level: number) {
  return CHARACTER_DATA[Math.min(Math.max(level, 1), 5)];
}

// ─── Badge Card ───────────────────────────────────────────────────────────────

function BadgeCard({ badge, large = false }: { badge: Badge; large?: boolean }) {
  const [hovered, setHovered] = useState(false);
  const t = useTokens();
  const r = RARITY_META[badge.rarity];
  const textColor = t.isDark ? r.darkText : r.lightText;

  return (
    <div
      className="relative cursor-default select-none"
      style={{ perspective: 600 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        animate={{ y: hovered ? -3 : 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-2xl flex flex-col items-center justify-center gap-3 transition-shadow duration-300"
        style={{
          padding: large ? "24px 16px" : "20px 12px",
          background: badge.earned
            ? t.isDark
              ? `linear-gradient(145deg, ${r.bg}, transparent)`
              : t.card
            : t.isDark ? "rgba(255,255,255,0.02)" : t.mutedBtn,
          border: `1px solid ${badge.earned ? r.border : t.border}`,
          boxShadow: badge.earned
            ? hovered
              ? t.isDark
                ? `0 8px 32px ${r.glow}, inset 0 1px 0 rgba(255,255,255,0.06)`
                : `0 6px 20px ${r.glow}, 0 2px 8px rgba(0,0,0,0.08)`
              : t.isDark
                ? "none"
                : "0 1px 3px rgba(0,0,0,0.06)"
            : "none",
          opacity: badge.earned ? 1 : t.isDark ? 0.28 : 0.38,
        }}
      >
        {badge.earned && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full"
            style={{ width: 40, height: 1, background: `linear-gradient(90deg, transparent, ${textColor}, transparent)` }} />
        )}

        {!badge.earned && <Lock size={8} className="absolute top-2.5 right-2.5" style={{ color: t.textFaint }} />}
        {badge.earned && badge.rarity === "legendary" && (
          <Sparkles size={9} className="absolute top-2.5 right-2.5" style={{ color: textColor, opacity: 0.75 }} />
        )}

        <div className="flex items-center justify-center rounded-xl"
          style={{
            width: large ? 52 : 44, height: large ? 52 : 44,
            background: badge.earned ? `${textColor}18` : t.mutedBtn,
            color: badge.earned ? textColor : t.textFaint,
            border: `1px solid ${badge.earned ? `${textColor}28` : t.border}`,
          }}
        >
          {badge.icon}
        </div>

        <div className="text-center">
          <p className="text-[11px] font-semibold" style={{ color: badge.earned ? t.textPrimary : t.textFaint, letterSpacing: "-0.01em" }}>
            {badge.label}
          </p>
          {badge.earned && (
            <p className="text-[9px] font-bold uppercase tracking-widest mt-1" style={{ color: textColor, fontFamily: "'DM Mono', monospace", opacity: 0.85 }}>
              {r.label}
            </p>
          )}
        </div>

        <AnimatePresence>
          {hovered && badge.earned && (
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 translate-y-full z-20 rounded-xl px-3 py-2 pointer-events-none"
              style={{
                background: t.card,
                border: `1px solid ${r.border}`,
                boxShadow: t.isDark ? `0 8px 24px rgba(0,0,0,0.6)` : `0 8px 24px rgba(0,0,0,0.12)`,
                backdropFilter: "blur(12px)",
                width: 160,
                marginTop: 8,
              }}
            >
              <p className="text-[10px] leading-relaxed text-center" style={{ color: t.textMuted }}>
                {badge.desc}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// ─── Stat pill ────────────────────────────────────────────────────────────────

function StatPill({ icon, label, value, color, sub }: {
  icon: React.ReactNode; label: string; value: string; color: string; sub?: string;
}) {
  const t = useTokens();
  return (
    <div className="flex flex-col gap-1.5 px-5 py-4">
      <div className="flex items-center gap-1.5 mb-0.5">
        <span style={{ color, opacity: 0.75 }}>{icon}</span>
        <span className="text-[9px] uppercase tracking-[0.1em]" style={{ color: t.textFaint, fontFamily: "'DM Mono', monospace" }}>{label}</span>
      </div>
      <span className="text-[22px] font-bold tabular-nums" style={{ color: t.textPrimary, letterSpacing: "-0.03em" }}>{value}</span>
      {sub && <span className="text-[9px]" style={{ color, fontFamily: "'DM Mono', monospace", opacity: 0.8 }}>{sub}</span>}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Profile() {
  const t = useTokens();
  const { dashboard } = useDashboardStore();

  const level     = dashboard?.level           ?? 5;
  const currentXP = dashboard?.currentXP       ?? 3800;
  const totalXP   = dashboard?.totalXPForLevel ?? 5000;
  const streak    = dashboard?.streak          ?? 14;
  const username  = dashboard?.username        ?? "Kyzen";
  const xpPct     = Math.min(Math.round((currentXP / totalXP) * 100), 100);
  const char      = getCharacter(level);

  const earnedBadges   = BADGES.filter(b => b.earned);
  const featuredBadges = BADGES.filter(b => b.featured && b.earned);

  // Surfaces — dark uses near-transparent overlays, light uses white cards with shadow
  const surface    = t.isDark ? "rgba(255,255,255,0.03)" : t.card;
  const surfaceBox = t.isDark ? "none" : "0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)";

  // Semantic colors that flip between light/dark
  const successColor = t.isDark ? "#4ade80" : "#16a34a";
  const warningColor = t.isDark ? "#facc15" : "#ca8a04";
  const orangeColor  = t.orange;

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ background: t.page, fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <div className="relative w-full overflow-hidden" style={{ minHeight: 360 }}>

        {/* Atmospheric bg — softer in light */}
        <div className="absolute inset-0" style={{
          background: t.isDark
            ? `radial-gradient(ellipse 70% 100% at 20% 0%, ${char.color}18 0%, transparent 65%),
               radial-gradient(ellipse 50% 80% at 80% 20%, rgba(139,92,246,0.08) 0%, transparent 60%),
               linear-gradient(180deg, rgba(99,102,241,0.04) 0%, transparent 100%)`
            : `radial-gradient(ellipse 70% 100% at 20% 0%, ${char.color}12 0%, transparent 65%),
               radial-gradient(ellipse 50% 80% at 80% 20%, rgba(139,92,246,0.05) 0%, transparent 60%)`,
        }} />

        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `radial-gradient(circle, ${t.isDark ? "rgba(255,255,255,0.035)" : "rgba(0,0,0,0.05)"} 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
          maskImage: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0.5) 70%, transparent)",
        }} />

        {/* Page-color fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: `linear-gradient(to bottom, transparent, ${t.page})` }} />

        <div className="relative px-4 md:px-8 lg:px-12 pt-10 pb-16">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start gap-8 sm:gap-12">

            {/* Character orb */}
            <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="relative shrink-0">
              <div
                className="relative flex items-center justify-center rounded-3xl"
                style={{
                  width: 120, height: 120,
                  background: `linear-gradient(145deg, ${char.color}${t.isDark ? "20" : "16"}, ${char.color}08)`,
                  border: `1px solid ${char.color}${t.isDark ? "30" : "25"}`,
                  boxShadow: t.isDark
                    ? `0 0 60px ${char.color}20, 0 0 120px ${char.color}08, inset 0 1px 0 rgba(255,255,255,0.08)`
                    : `0 4px 24px ${char.color}22, 0 1px 3px rgba(0,0,0,0.06)`,
                  color: char.color,
                }}
              >
                {char.icon}
                <div className="absolute -bottom-3 -right-3 flex items-center justify-center rounded-xl text-[10px] font-bold text-white"
                  style={{
                    width: 36, height: 36,
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    border: `2px solid ${t.page}`,
                    fontFamily: "'DM Mono', monospace",
                    boxShadow: "0 4px 16px rgba(99,102,241,0.4)",
                  }}
                >
                  {char.rank}
                </div>
              </div>
            </motion.div>

            {/* Identity */}
            <div className="flex-1 min-w-0 pt-1">
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full"
                  style={{ color: char.color, background: `${char.color}${t.isDark ? "15" : "12"}`, border: `1px solid ${char.color}28`, fontFamily: "'DM Mono', monospace" }}>
                  {char.title}
                </span>
                <span className="text-[10px] uppercase tracking-widest" style={{ color: t.textFaint, fontFamily: "'DM Mono', monospace" }}>
                  {char.tagline}
                </span>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="font-bold mb-3"
                style={{ fontSize: "clamp(28px, 5vw, 44px)", color: t.textPrimary, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                {username}
              </motion.h1>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.35 }}
                className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-5">
                <span className="flex items-center gap-1.5 text-[11px]" style={{ color: t.textMuted, fontFamily: "'DM Mono', monospace" }}>
                  <Hash size={10} style={{ opacity: 0.5 }} /> Level {level}
                </span>
                <span className="flex items-center gap-1.5 text-[11px]" style={{ color: orangeColor, fontFamily: "'DM Mono', monospace" }}>
                  <Flame size={10} /> {streak}-day streak
                </span>
                <span className="flex items-center gap-1.5 text-[11px]" style={{ color: t.textMuted, fontFamily: "'DM Mono', monospace" }}>
                  <Award size={10} style={{ opacity: 0.5 }} /> {earnedBadges.length} badges
                </span>
                <span className="text-[11px]" style={{ color: t.textFaint, fontFamily: "'DM Mono', monospace" }}>
                  Since Jan 2025
                </span>
                <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full"
                  style={{ color: t.textFaint, border: `1px dashed ${t.border}`, fontFamily: "'DM Mono', monospace" }}>
                  <Users size={8} /> No Clan
                </span>
              </motion.div>

              {/* XP progress */}
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4, ease: [0.16, 1, 0.3, 1] }} style={{ maxWidth: 380 }}>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-[10px]" style={{ color: t.textFaint, fontFamily: "'DM Mono', monospace" }}>
                    Level {level} → {level + 1}
                  </span>
                  <span className="text-[10px] font-semibold" style={{ color: t.accent, fontFamily: "'DM Mono', monospace" }}>
                    {currentXP.toLocaleString()} / {totalXP.toLocaleString()} XP
                  </span>
                </div>
                <div className="relative h-2 rounded-full overflow-hidden" style={{ background: t.mutedBtn }}>
                  <motion.div className="absolute inset-y-0 left-0 rounded-full"
                    initial={{ width: 0 }} animate={{ width: `${xpPct}%` }}
                    transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    style={{ background: "linear-gradient(90deg, #6366f1, #a78bfa)" }} />
                </div>
                <p className="text-[10px] mt-1.5" style={{ color: t.textFaint, fontFamily: "'DM Mono', monospace" }}>
                  {(totalXP - currentXP).toLocaleString()} XP to next level · {xpPct}% complete
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* ── BODY ──────────────────────────────────────────────────────────── */}
      <div className="px-4 md:px-8 lg:px-12 pb-16">
        <div className="max-w-5xl mx-auto space-y-10">

          <img src={character_mascot} alt="Character Mascot" />

          {/* Stats strip */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl overflow-hidden"
            style={{ background: surface, border: `1px solid ${t.border}`, boxShadow: surfaceBox }}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-y sm:divide-y-0" style={{ borderColor: t.border }}>
              <StatPill icon={<Zap size={11} />}          label="Total XP"    value="12,847"            color={t.accent}      sub="↑ 340 this week" />
              <StatPill icon={<CheckCircle2 size={11} />}  label="Completed"   value="97"                color={successColor}  sub="3 this week" />
              <StatPill icon={<Flame size={11} />}         label="Streak"      value={`${streak}d`}      color={orangeColor}   sub="current" />
              <StatPill icon={<Trophy size={11} />}        label="Best Streak" value="21d"               color={warningColor}  sub="personal best" />
              <StatPill icon={<TrendingUp size={11} />}    label="Consistency" value="78%"               color={successColor}  sub="last 30 days" />
              <StatPill icon={<Target size={11} />}        label="Focus Score" value="—"                 color={t.textMuted}   sub="coming soon" />
            </div>
          </motion.div>

          {/* Badges */}
          <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
            <div className="flex items-end justify-between mb-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.1em] mb-1" style={{ color: t.textFaint, fontFamily: "'DM Mono', monospace" }}>Achievements</p>
                <h2 className="text-[18px] font-bold" style={{ color: t.textPrimary, letterSpacing: "-0.02em" }}>
                  {earnedBadges.length} / {BADGES.length} Unlocked
                </h2>
              </div>
              <span className="text-[10px] uppercase tracking-widest" style={{ color: t.textFaint, fontFamily: "'DM Mono', monospace", opacity: 0.55 }}>
                Hover to inspect
              </span>
            </div>

            {featuredBadges.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mb-3">
                {featuredBadges.map((badge, i) => (
                  <motion.div key={badge.id} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.36 + i * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
                    <BadgeCard badge={badge} large />
                  </motion.div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
              {BADGES.filter(b => !b.featured || !b.earned).map((badge, i) => (
                <motion.div key={badge.id} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.38 + i * 0.04, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
                  <BadgeCard badge={badge} />
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Activity */}
          <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.44, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
            <p className="text-[10px] uppercase tracking-[0.1em] mb-1" style={{ color: t.textFaint, fontFamily: "'DM Mono', monospace" }}>Activity</p>
            <h2 className="text-[18px] font-bold mb-5" style={{ color: t.textPrimary, letterSpacing: "-0.02em" }}>Grind History</h2>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

              <div className="lg:col-span-2">
                <div className="rounded-2xl overflow-hidden h-full" style={{ background: surface, border: `1px solid ${t.border}`, boxShadow: surfaceBox }}>
                  <div className="px-5 pt-4 pb-3" style={{ borderBottom: `1px solid ${t.border}` }}>
                    <p className="text-[11px] font-semibold" style={{ color: t.textSecondary }}>Recent Activity</p>
                  </div>
                  <div className="px-5 pt-1 pb-3">
                    {RECENT_ACTIVITY.map((item, i) => (
                      <motion.div key={item.id}
                        initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="flex items-center gap-3 py-2.5"
                        style={{ borderBottom: i < RECENT_ACTIVITY.length - 1 ? `1px solid ${t.border}` : "none" }}>
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: `${item.color}15`, color: item.color }}>
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] truncate leading-tight" style={{ color: t.textSecondary }}>{item.text}</p>
                          <p className="text-[9px] mt-0.5" style={{ color: t.textFaint, fontFamily: "'DM Mono', monospace" }}>{item.sub}</p>
                        </div>
                        {item.xp && (
                          <span className="text-[9px] font-semibold shrink-0 px-1.5 py-0.5 rounded"
                            style={{ color: t.accent, background: t.accentSoft, fontFamily: "'DM Mono', monospace" }}>
                            +{item.xp}
                          </span>
                        )}
                      </motion.div>
                    ))}
                  </div>
                  <div className="px-5 pb-5">
                    <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-[10px] transition-colors"
                      style={{ background: t.mutedBtn, border: `1px solid ${t.border}`, color: t.textMuted, fontFamily: "'DM Mono', monospace" }}
                      onMouseEnter={e => (e.currentTarget.style.background = t.mutedBtnHov)}
                      onMouseLeave={e => (e.currentTarget.style.background = t.mutedBtn)}>
                      View all <ChevronRight size={10} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Difficulty breakdown */}
          <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
            <p className="text-[10px] uppercase tracking-[0.1em] mb-1" style={{ color: t.textFaint, fontFamily: "'DM Mono', monospace" }}>Performance</p>
            <h2 className="text-[18px] font-bold mb-5" style={{ color: t.textPrimary, letterSpacing: "-0.02em" }}>Difficulty Breakdown</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Easy",   count: 41, total: 60, xp: 1230,
                  darkColor: "#4ade80", lightColor: "#16a34a",
                  darkBg: "rgba(74,222,128,0.06)",   lightBg: "rgba(22,163,74,0.05)"  },
                { label: "Medium", count: 33, total: 50, xp: 1980,
                  darkColor: "#facc15", lightColor: "#ca8a04",
                  darkBg: "rgba(250,204,21,0.06)",   lightBg: "rgba(202,138,4,0.05)"  },
                { label: "Hard",   count: 23, total: 40, xp: 2300,
                  darkColor: "#f87171", lightColor: "#dc2626",
                  darkBg: "rgba(248,113,113,0.06)",  lightBg: "rgba(220,38,38,0.05)"  },
              ].map((d, i) => {
                const pct   = Math.round((d.count / d.total) * 100);
                const color = t.isDark ? d.darkColor : d.lightColor;
                const bg    = t.isDark ? d.darkBg    : d.lightBg;
                return (
                  <motion.div key={d.label}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.54 + i * 0.06, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="rounded-2xl p-5"
                    style={{
                      background: bg,
                      border: `1px solid ${color}22`,
                      boxShadow: t.isDark ? "none" : `0 1px 4px rgba(0,0,0,0.05)`,
                    }}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color, fontFamily: "'DM Mono', monospace" }}>{d.label}</span>
                      <span className="text-[10px]" style={{ color, fontFamily: "'DM Mono', monospace", opacity: 0.75 }}>+{d.xp.toLocaleString()} XP</span>
                    </div>
                    <div className="flex items-end gap-2 mb-3">
                      <span className="text-[32px] font-bold leading-none" style={{ color: t.textPrimary, letterSpacing: "-0.04em" }}>{d.count}</span>
                      <span className="text-[13px] pb-1" style={{ color: t.textMuted, fontFamily: "'DM Mono', monospace" }}>/ {d.total}</span>
                    </div>
                    <div className="h-1 w-full rounded-full overflow-hidden" style={{ background: t.mutedBtn }}>
                      <motion.div className="h-full rounded-full"
                        initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.9, delay: 0.58 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                        style={{ background: color }} />
                    </div>
                    <p className="text-[9px] mt-2" style={{ color: t.textMuted, fontFamily: "'DM Mono', monospace" }}>{pct}% of goal</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          {/* Coming soon */}
          <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
            <div className="rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between"
              style={{ background: t.accentSoft, border: `1px dashed ${t.accentBorder}` }}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: t.accentSoft, border: `1px solid ${t.accentBorder}` }}>
                  <Users size={16} style={{ color: t.accent, opacity: 0.7 }} />
                </div>
                <div>
                  <p className="text-[13px] font-semibold" style={{ color: t.textSecondary, letterSpacing: "-0.01em" }}>
                    Clans & Social — Coming Soon
                  </p>
                  <p className="text-[10px] mt-0.5" style={{ color: t.textFaint, fontFamily: "'DM Mono', monospace" }}>
                    Compete with friends · Clan wars · Leaderboards
                  </p>
                </div>
              </div>
              <span className="text-[9px] px-3 py-1.5 rounded-full uppercase tracking-widest shrink-0"
                style={{ background: t.accentSoft, color: t.accent, border: `1px solid ${t.accentBorder}`, fontFamily: "'DM Mono', monospace" }}>
                Planned
              </span>
            </div>
          </motion.section>

        </div>
      </div>
    </div>
  );
}