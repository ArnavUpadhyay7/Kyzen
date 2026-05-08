import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame, Trophy, Shield, Star, Zap, Target,
  Swords, TrendingUp, Lock, Sparkles, Award,
  CheckCircle2, Hash, Users, ChevronRight,
} from "lucide-react";
import { useDashboardStore } from "../../state/dashboard/usedashboardstore";
import { useTokens } from "../../state/theme/ThemeContext";
import character_mascot from "../../assets/character_mascot.png";
import { useAuth } from "../../state/auth/AuthContext";

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

// ─── Constants ────────────────────────────────────────────────────────────────

const RARITY: Record<Rarity, {
  dark: string; light: string;
  border: string; glow: string; bg: string; label: string;
}> = {
  common:    { dark: "#94A3B8", light: "#64748b", border: "rgba(148,163,184,0.3)",  glow: "rgba(148,163,184,0.12)", bg: "rgba(148,163,184,0.06)", label: "Common"    },
  rare:      { dark: "#60A5FA", light: "#2563eb", border: "rgba(59,130,246,0.35)",   glow: "rgba(59,130,246,0.15)",  bg: "rgba(59,130,246,0.07)",  label: "Rare"       },
  epic:      { dark: "#A78BFA", light: "#7c3aed", border: "rgba(139,92,246,0.38)",   glow: "rgba(139,92,246,0.18)",  bg: "rgba(139,92,246,0.08)",  label: "Epic"       },
  legendary: { dark: "#FBBF24", light: "#b45309", border: "rgba(234,179,8,0.38)",    glow: "rgba(234,179,8,0.18)",   bg: "rgba(234,179,8,0.08)",   label: "Legendary"  },
};

const RANK: Record<number, { title: string; tagline: string; color: string }> = {
  1: { title: "Novice",     tagline: "Just getting started",      color: "#6366f1" },
  2: { title: "Apprentice", tagline: "Skill is sharpening",       color: "#6366f1" },
  3: { title: "Adept",      tagline: "Comfortable in the grind",  color: "#8b5cf6" },
  4: { title: "Veteran",    tagline: "Battle-hardened",           color: "#8b5cf6" },
  5: { title: "Champion",   tagline: "Feared on the leaderboard", color: "#7c3aed" },
};

const BADGES: Badge[] = [
  { id: 1, icon: <Flame size={15} />,      label: "Streak Master", desc: "Maintained a 30-day streak without breaking.",  earned: true,  rarity: "epic"      },
  { id: 2, icon: <Trophy size={15} />,     label: "Top 1%",        desc: "Ranked in the global top 1% this season.",      earned: true,  rarity: "legendary" },
  { id: 3, icon: <Shield size={15} />,     label: "Iron Guard",    desc: "Protected your streak for 7 consecutive days.", earned: true,  rarity: "rare"      },
  { id: 4, icon: <Star size={15} />,       label: "Legend",        desc: "Completed over 1000 lifetime tasks.",           earned: true,  rarity: "legendary" },
  { id: 5, icon: <Zap size={15} />,        label: "Speed Run",     desc: "Complete 5 hard tasks in a single day.",        earned: false, rarity: "epic"      },
  { id: 6, icon: <Target size={15} />,     label: "Precision",     desc: "Complete 100 tasks with no deletions.",         earned: false, rarity: "rare"      },
  { id: 7, icon: <Swords size={15} />,     label: "Gladiator",     desc: "Win 10 consecutive hard difficulty tasks.",     earned: false, rarity: "epic"      },
  { id: 8, icon: <TrendingUp size={15} />, label: "Momentum",      desc: "Earn 500 XP in a single day.",                  earned: false, rarity: "common"    },
];

const ACTIVITY = [
  { id: 1, icon: <CheckCircle2 size={11} />, text: "Completed DSA Practice",     sub: "2 min ago",  xp: 50,  color: "#6366f1" },
  { id: 2, icon: <TrendingUp size={11} />,   text: "Reached Level 5",            sub: "1 hr ago",            color: "#8b5cf6" },
  { id: 3, icon: <CheckCircle2 size={11} />, text: "Finished System Design Doc", sub: "3 hr ago",   xp: 100, color: "#6366f1" },
  { id: 4, icon: <Flame size={11} />,        text: "7-day streak achieved",      sub: "Yesterday",           color: "#f97316" },
  { id: 5, icon: <Award size={11} />,        text: "Earned 'Iron Guard' badge",  sub: "2 days ago",          color: "#2563eb" },
];

// ─── BadgeCard ────────────────────────────────────────────────────────────────

function BadgeCard({ badge, index }: { badge: Badge; index: number }) {
  const [hovered, setHovered] = useState(false);
  const t = useTokens();
  const r = RARITY[badge.rarity];
  const accent = t.isDark ? r.dark : r.light;

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
        className="relative rounded-2xl p-4 cursor-default select-none overflow-hidden"
        style={{
          background: badge.earned
            ? t.isDark
              ? `linear-gradient(135deg, ${r.bg}, rgba(255,255,255,0.01))`
              : `linear-gradient(135deg, ${r.bg}, rgba(0,0,0,0.01))`
            : t.isDark ? "rgba(255,255,255,0.018)" : "rgba(0,0,0,0.018)",
          border: `1px solid ${badge.earned ? r.border : t.border}`,
          opacity: badge.earned ? 1 : 0.38,
          boxShadow: badge.earned && hovered
            ? `0 8px 32px ${r.glow}, inset 0 1px 0 rgba(255,255,255,${t.isDark ? "0.06" : "0.5"})`
            : t.isDark ? "none" : "0 1px 3px rgba(0,0,0,0.04)",
          transition: "box-shadow 0.25s",
        }}
      >
        {badge.earned && (
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${accent}60, transparent)` }} />
        )}

        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center rounded-xl shrink-0"
            style={{
              width: 38, height: 38,
              background: badge.earned ? `${accent}15` : t.mutedBtn,
              border: `1px solid ${badge.earned ? `${accent}28` : t.border}`,
              color: badge.earned ? accent : t.textFaint,
            }}>
            {badge.earned ? badge.icon : <Lock size={11} style={{ color: t.textFaint }} />}
            {badge.earned && badge.rarity === "legendary" && (
              <Sparkles size={7} className="absolute -top-1 -right-1" style={{ color: accent }} />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold leading-tight" style={{ color: badge.earned ? t.textPrimary : t.textFaint, letterSpacing: "-0.01em" }}>
              {badge.label}
            </p>
            <span className="text-[9px] font-bold uppercase tracking-widest"
              style={{ color: badge.earned ? accent : t.textFaint, fontFamily: "'DM Mono', monospace", opacity: badge.earned ? 0.85 : 0.5 }}>
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
              <p className="text-[10px] leading-relaxed mt-2.5 pt-2.5"
                style={{ color: t.textFaint, borderTop: `1px solid ${t.border}` }}>
                {badge.desc}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

// ─── StatChip ─────────────────────────────────────────────────────────────────

function StatChip({ icon, label, value, color }: {
  icon: React.ReactNode; label: string; value: string; color: string;
}) {
  const t = useTokens();
  return (
    <div className="flex items-center gap-2.5 rounded-xl px-4 py-3"
      style={{
        background: t.isDark ? "rgba(255,255,255,0.04)" : t.card,
        border: `1px solid ${t.border}`,
        boxShadow: t.isDark ? "none" : "0 1px 3px rgba(0,0,0,0.05)",
      }}>
      <span style={{ color, opacity: 0.8 }}>{icon}</span>
      <div>
        <p className="text-[8px] uppercase tracking-widest leading-none mb-1" style={{ color: t.textFaint, fontFamily: "'DM Mono', monospace" }}>
          {label}
        </p>
        <p className="text-[15px] font-black leading-none tabular-nums" style={{ color: t.textPrimary, letterSpacing: "-0.03em", fontFamily: "'DM Mono', monospace" }}>
          {value}
        </p>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function Profile() {
  const t = useTokens();
  const { dashboard } = useDashboardStore();
  const { user } = useAuth();

  const level     = dashboard?.level           ?? 4;
  const currentXP = dashboard?.currentXP       ?? 325;
  const totalXP   = dashboard?.totalXPForLevel ?? 900;
  const streak    = dashboard?.streak          ?? 1;
  const username  = user?.username        ?? "heya";
  const xpPct     = Math.min(Math.round((currentXP / totalXP) * 100), 100);
  const rank      = RANK[Math.min(Math.max(level, 1), 5)];
  const earnedCount = BADGES.filter(b => b.earned).length;

  const cardRarity: Rarity = level >= 5 ? "legendary" : level >= 4 ? "epic" : level >= 3 ? "rare" : "common";
  const cr = RARITY[cardRarity];
  const cardAccent = t.isDark ? cr.dark : cr.light;

  const panelBg     = t.isDark ? "rgba(255,255,255,0.026)" : t.card;
  const panelShadow = t.isDark
    ? "0 1px 0 rgba(255,255,255,0.05), 0 0 0 1px rgba(255,255,255,0.04)"
    : "0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)";

  const successC = t.isDark ? "#4ade80" : "#16a34a";
  const warnC    = t.isDark ? "#facc15" : "#ca8a04";

  return (
    <div className="min-h-screen transition-colors duration-300"
      style={{ background: t.page, fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Fixed ambient glow ─────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div style={{
          position: "absolute", inset: 0,
          background: t.isDark
            ? `radial-gradient(ellipse 55% 45% at 25% 0%, ${rank.color}12 0%, transparent 55%),
               radial-gradient(ellipse 35% 35% at 78% 8%, rgba(139,92,246,0.07) 0%, transparent 50%)`
            : `radial-gradient(ellipse 55% 45% at 25% 0%, ${rank.color}09 0%, transparent 55%)`,
        }} />
        <div style={{
          position: "absolute", inset: 0,
          opacity: t.isDark ? 0.022 : 0.016,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }} />
      </div>

      <div className="relative w-full">
        {/* ── HERO ZONE ───────────────────────────────────────────────────── */}
        <div className="relative overflow-hidden" style={{ minHeight: 520 }}>
          {/* Hero atmosphere */}
          <div className="absolute inset-0" style={{
            background: t.isDark
              ? `linear-gradient(150deg, ${rank.color}18 0%, rgba(139,92,246,0.07) 40%, transparent 65%)`
              : `linear-gradient(150deg, ${rank.color}0e 0%, rgba(139,92,246,0.04) 40%, transparent 65%)`,
          }} />
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: `radial-gradient(circle, ${t.isDark ? "rgba(255,255,255,0.028)" : "rgba(0,0,0,0.04)"} 1px, transparent 1px)`,
            backgroundSize: "30px 30px",
            maskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 72%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 72%, transparent 100%)",
          }} />
          <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
            style={{ background: `linear-gradient(to bottom, transparent, ${t.page})` }} />

          <div className="relative px-6 md:px-10 lg:px-16 xl:px-20 pt-8 pb-0">
            {/* Page header */}
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.38 }}
              className="flex items-center justify-between mb-10"
            >
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] mb-0.5"
                  style={{ color: t.textFaint, fontFamily: "'DM Mono', monospace" }}>
                  Player Profile
                </p>
                <h1 className="text-[30px] font-black leading-none"
                  style={{ color: t.textPrimary, letterSpacing: "-0.04em" }}>
                  {username}
                </h1>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.35 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full"
                style={{
                  background: `${rank.color}14`,
                  border: `1px solid ${rank.color}28`,
                  backdropFilter: "blur(8px)",
                }}
              >
                <Hash size={10} style={{ color: rank.color }} />
                <span className="text-[11px] font-bold"
                  style={{ color: rank.color, fontFamily: "'DM Mono', monospace" }}>
                  Level {level} · {rank.title}
                </span>
              </motion.div>
            </motion.div>

            {/* ── MAIN HERO GRID ── */}
            <div className="pb-4 grid grid-cols-1 lg:grid-cols-[320px_1fr] xl:grid-cols-[340px_1fr] gap-8 items-start">

              {/* CHARACTER CARD */}
              <motion.div
                initial={{ opacity: 0, y: 28, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="relative rounded-[28px] overflow-hidden"
                style={{
                  background: "linear-gradient(160deg, #12111a 0%, #0c0b14 100%)",
                  border: `1px solid ${cardAccent}28`,
                  boxShadow: t.isDark
                    ? `0 0 0 1px ${cardAccent}12, 0 32px 80px rgba(0,0,0,0.65), 0 0 100px ${cardAccent}0e`
                    : `0 0 0 1px ${cardAccent}18, 0 32px 80px rgba(0,0,0,0.4), 0 0 80px ${cardAccent}14`,
                }}
              >
                {/* Image area */}
                <div className="relative overflow-hidden" style={{ height: 360 }}>
                  <div className="absolute inset-0" style={{
                    background: `radial-gradient(ellipse 85% 65% at 50% 80%, ${rank.color}28 0%, transparent 60%)`,
                  }} />
                  <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)`,
                    backgroundSize: "22px 22px",
                    maskImage: "linear-gradient(to bottom, transparent 0%, black 30%)",
                    WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 30%)",
                  }} />

                  {/* Character — object-cover, object-top so it fills the space */}
                  <motion.img
                    src={character_mascot}
                    alt="Character"
                    initial={{ scale: 1.07, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.22, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 w-full h-full object-cover object-top"
                    style={{ filter: `drop-shadow(0 20px 48px ${rank.color}50)` }}
                  />

                  {/* Bottom fade */}
                  <div className="absolute bottom-0 left-0 right-0 h-24"
                    style={{ background: "linear-gradient(to bottom, transparent, #0c0b14)" }} />

                  {/* Rarity pill */}
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.88 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.38 }}
                    className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-1.5 rounded-full"
                    style={{
                      background: `${cardAccent}20`,
                      border: `1px solid ${cardAccent}45`,
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    {cardRarity === "legendary" && <Sparkles size={8} style={{ color: cardAccent }} />}
                    <span className="text-[10px] font-black uppercase tracking-[0.14em]"
                      style={{ color: cardAccent, fontFamily: "'DM Mono', monospace" }}>
                      {cr.label}
                    </span>
                  </motion.div>

                  {/* Level badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.44, duration: 0.33 }}
                    className="absolute top-4 right-4 flex items-center justify-center rounded-2xl text-[15px] font-black"
                    style={{
                      width: 44, height: 44,
                      background: `linear-gradient(135deg, ${rank.color}cc, ${rank.color}88)`,
                      border: "1.5px solid rgba(255,255,255,0.14)",
                      boxShadow: `0 6px 20px ${rank.color}55`,
                      color: "#fff",
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    {level}
                  </motion.div>

                  {/* XP overlay */}
                  <div className="absolute bottom-3 left-5 right-5">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[9px] font-semibold"
                        style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'DM Mono', monospace" }}>
                        {currentXP.toLocaleString()} XP
                      </span>
                      <span className="text-[9px] font-bold"
                        style={{ color: cardAccent, fontFamily: "'DM Mono', monospace" }}>
                        {xpPct}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${xpPct}%` }}
                        transition={{ delay: 0.68, duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${rank.color}99, ${cardAccent})`,
                          boxShadow: `0 0 10px ${cardAccent}70`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card info panel */}
                <div className="px-5 pt-4 pb-5">
                  <h2 className="text-[24px] font-black text-white mb-1 leading-none"
                    style={{ letterSpacing: "-0.04em" }}>
                    {username}
                  </h2>
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-4 h-4 rounded-md flex items-center justify-center"
                      style={{ background: `${rank.color}28`, border: `1px solid ${rank.color}40` }}>
                      <Zap size={8} style={{ color: cardAccent }} />
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider"
                      style={{ color: "rgba(255,255,255,0.38)", fontFamily: "'DM Mono', monospace" }}>
                      {rank.title} · {rank.tagline}
                    </span>
                  </div>

                  <div className="h-px mb-4" style={{ background: "rgba(255,255,255,0.07)" }} />

                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[
                      { label: "Streak",  value: `${streak}d`,                       color: "#f97316", icon: <Flame size={9} />        },
                      { label: "XP Left", value: `${(totalXP - currentXP).toLocaleString()}`, color: cardAccent, icon: <Zap size={9} /> },
                      { label: "Badges",  value: `${earnedCount}/${BADGES.length}`,  color: "#a78bfa", icon: <Award size={9} />        },
                    ].map((s) => (
                      <div key={s.label} className="rounded-xl p-3 text-center"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <div className="flex items-center justify-center gap-1 mb-1.5" style={{ color: s.color }}>
                          {s.icon}
                          <span className="text-[7px] uppercase tracking-wider font-bold"
                            style={{ fontFamily: "'DM Mono', monospace" }}>
                            {s.label}
                          </span>
                        </div>
                        <p className="text-[16px] font-black leading-none"
                          style={{ color: "#fff", letterSpacing: "-0.035em", fontFamily: "'DM Mono', monospace" }}>
                          {s.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <p className="text-[9px] text-center"
                    style={{ color: "rgba(255,255,255,0.22)", fontFamily: "'DM Mono', monospace" }}>
                    {(totalXP - currentXP).toLocaleString()} XP to Level {level + 1}
                  </p>
                </div>
              </motion.div>

              {/* ── IDENTITY + STATS RIGHT PANEL ── */}
              <div className="flex flex-col gap-5 pt-1 pb-12">

                {/* Large identity block */}
                <motion.div
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.12, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p className="text-[13px] font-medium mb-1" style={{ color: t.textFaint }}>
                    {rank.tagline}
                  </p>
                  <p className="font-black leading-none tracking-tight mb-3"
                    style={{ fontSize: "clamp(38px, 4.5vw, 56px)", color: t.textPrimary, letterSpacing: "-0.05em" }}>
                    {username}
                  </p>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="flex items-center gap-1.5 text-[10px] font-semibold px-3 py-1.5 rounded-full"
                      style={{ color: rank.color, background: `${rank.color}12`, border: `1px solid ${rank.color}25`, fontFamily: "'DM Mono', monospace" }}>
                      <Hash size={8} /> {rank.title}
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px]"
                      style={{ color: "#f97316", fontFamily: "'DM Mono', monospace" }}>
                      <Flame size={10} /> {streak}-day streak
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px]"
                      style={{ color: t.textFaint, fontFamily: "'DM Mono', monospace" }}>
                      <Award size={10} style={{ opacity: 0.5 }} /> {earnedCount} badges · Since Jan 2025
                    </span>
                    <span className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full"
                      style={{ color: t.textFaint, border: `1px dashed ${t.border}`, fontFamily: "'DM Mono', monospace" }}>
                      <Users size={8} /> No Clan
                    </span>
                  </div>
                </motion.div>

                {/* XP progress */}
                <motion.div
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.18, duration: 0.4 }}
                  className="rounded-2xl p-5"
                  style={{ background: panelBg, border: `1px solid ${t.border}`, boxShadow: panelShadow }}
                >
                  <div className="flex justify-between items-baseline mb-3">
                    <span className="text-[11px] font-semibold" style={{ color: t.textSecondary }}>
                      Level {level} → {level + 1}
                    </span>
                    <span className="text-[11px] font-bold"
                      style={{ color: t.accent, fontFamily: "'DM Mono', monospace" }}>
                      {currentXP.toLocaleString()} / {totalXP.toLocaleString()} XP
                    </span>
                  </div>
                  <div className="relative h-2.5 rounded-full overflow-hidden" style={{ background: t.mutedBtn }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${xpPct}%` }}
                      transition={{ delay: 0.6, duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{
                        background: "linear-gradient(90deg, #6366f1, #a78bfa)",
                        boxShadow: "0 0 12px rgba(139,92,246,0.5)",
                      }}
                    />
                  </div>
                  <p className="text-[10px] mt-2" style={{ color: t.textFaint, fontFamily: "'DM Mono', monospace" }}>
                    {(totalXP - currentXP).toLocaleString()} XP to next level · {xpPct}% complete
                  </p>
                </motion.div>

                {/* Stat chips */}
                <motion.div
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.24, duration: 0.4 }}
                  className="grid grid-cols-2 sm:grid-cols-4 gap-3"
                >
                  <StatChip icon={<Zap size={13} />}          label="Total XP"    value="12,847" color={t.accent} />
                  <StatChip icon={<CheckCircle2 size={13} />}  label="Completed"   value="97"     color={successC} />
                  <StatChip icon={<Trophy size={13} />}        label="Best Streak" value="21d"    color={warnC}    />
                  <StatChip icon={<TrendingUp size={13} />}    label="Consistency" value="78%"    color={successC} />
                </motion.div>

                {/* Difficulty strip */}
                <motion.div
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="rounded-2xl overflow-hidden"
                  style={{ background: panelBg, border: `1px solid ${t.border}`, boxShadow: panelShadow }}
                >
                  <div className="px-5 pt-4 pb-3" style={{ borderBottom: `1px solid ${t.border}` }}>
                    <p className="text-[9px] uppercase tracking-[0.14em]"
                      style={{ color: t.textFaint, fontFamily: "'DM Mono', monospace" }}>
                      Difficulty Breakdown
                    </p>
                  </div>
                  <div className="grid grid-cols-3 divide-x" style={{ borderColor: t.border }}>
                    {[
                      { label: "Easy",   count: 41, total: 60, dk: "#4ade80", lk: "#16a34a" },
                      { label: "Medium", count: 33, total: 50, dk: "#facc15", lk: "#ca8a04" },
                      { label: "Hard",   count: 23, total: 40, dk: "#f87171", lk: "#dc2626" },
                    ].map((d) => {
                      const pct = Math.round((d.count / d.total) * 100);
                      const c   = t.isDark ? d.dk : d.lk;
                      return (
                        <div key={d.label} className="px-5 py-4">
                          <span className="text-[8px] uppercase tracking-widest font-bold block mb-2"
                            style={{ color: c, fontFamily: "'DM Mono', monospace" }}>
                            {d.label}
                          </span>
                          <div className="flex items-end gap-1.5 mb-2">
                            <span className="text-[24px] font-black leading-none"
                              style={{ color: t.textPrimary, letterSpacing: "-0.04em" }}>
                              {d.count}
                            </span>
                            <span className="text-[11px] pb-0.5"
                              style={{ color: t.textFaint, fontFamily: "'DM Mono', monospace" }}>
                              /{d.total}
                            </span>
                          </div>
                          <div className="h-1 rounded-full overflow-hidden" style={{ background: t.mutedBtn }}>
                            <motion.div className="h-full rounded-full"
                              initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                              transition={{ delay: 0.85, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                              style={{ background: c }} />
                          </div>
                          <p className="text-[8px] mt-1.5"
                            style={{ color: t.textFaint, fontFamily: "'DM Mono', monospace" }}>
                            {pct}%
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* ── LOWER: Achievements + Activity ──────────────────────────────── */}
        <div className="px-6 pt-4 md:pt-6 md:px-10 lg:px-16 xl:px-20 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">

            {/* Achievements */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.14em] mb-0.5"
                    style={{ color: t.textFaint, fontFamily: "'DM Mono', monospace" }}>
                    Achievements
                  </p>
                  <h2 className="text-[20px] font-black"
                    style={{ color: t.textPrimary, letterSpacing: "-0.03em" }}>
                    {earnedCount} / {BADGES.length} Unlocked
                  </h2>
                </div>
                <span className="text-[9px] px-3 py-1.5 rounded-full uppercase tracking-widest"
                  style={{ color: t.textFaint, border: `1px dashed ${t.border}`, fontFamily: "'DM Mono', monospace" }}>
                  Hover to inspect
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {BADGES.map((badge, i) => (
                  <BadgeCard key={badge.id} badge={badge} index={i} />
                ))}
              </div>
            </motion.section>

            {/* Activity feed */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.44, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mb-5">
                <p className="text-[9px] uppercase tracking-[0.14em] mb-0.5"
                  style={{ color: t.textFaint, fontFamily: "'DM Mono', monospace" }}>
                  Activity
                </p>
                <h2 className="text-[20px] font-black"
                  style={{ color: t.textPrimary, letterSpacing: "-0.03em" }}>
                  Grind History
                </h2>
              </div>

              <div className="rounded-2xl overflow-hidden mb-4"
                style={{ background: panelBg, border: `1px solid ${t.border}`, boxShadow: panelShadow }}>
                <div className="px-5 py-3 relative">
                  {/* Timeline spine */}
                  <div className="absolute left-7.5 top-5 bottom-5 w-px pointer-events-none"
                    style={{ background: `linear-gradient(to bottom, ${t.border}, ${t.border} 80%, transparent)` }} />

                  {ACTIVITY.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.52 + i * 0.06, duration: 0.3 }}
                      className="flex items-start gap-3.5 py-3 relative"
                      style={{ borderBottom: i < ACTIVITY.length - 1 ? `1px solid ${t.border}` : "none" }}
                    >
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 z-10"
                        style={{ background: `${item.color}18`, color: item.color, border: `1px solid ${item.color}28` }}>
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <p className="text-[12px] font-medium leading-tight" style={{ color: t.textSecondary }}>
                          {item.text}
                        </p>
                        <p className="text-[9px] mt-0.5" style={{ color: t.textFaint, fontFamily: "'DM Mono', monospace" }}>
                          {item.sub}
                        </p>
                      </div>
                      {item.xp && (
                        <span className="text-[9px] font-bold shrink-0 px-2 py-1 rounded-lg mt-0.5"
                          style={{ color: t.accent, background: t.accentSoft, fontFamily: "'DM Mono', monospace" }}>
                          +{item.xp}
                        </span>
                      )}
                    </motion.div>
                  ))}
                </div>

                <div className="px-5 pb-4">
                  <button
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[10px] font-medium transition-colors"
                    style={{ background: t.mutedBtn, border: `1px solid ${t.border}`, color: t.textMuted, fontFamily: "'DM Mono', monospace" }}
                    onMouseEnter={e => (e.currentTarget.style.background = t.mutedBtnHov)}
                    onMouseLeave={e => (e.currentTarget.style.background = t.mutedBtn)}
                  >
                    View all activity <ChevronRight size={10} />
                  </button>
                </div>
              </div>

              {/* Clans teaser */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.72, duration: 0.4 }}
                className="rounded-2xl px-5 py-4 flex items-center gap-4"
                style={{ background: t.accentSoft, border: `1px dashed ${t.accentBorder}` }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: t.accentSoft, border: `1px solid ${t.accentBorder}` }}>
                  <Users size={14} style={{ color: t.accent, opacity: 0.7 }} />
                </div>
                <div className="flex-1">
                  <p className="text-[12px] font-semibold" style={{ color: t.textSecondary, letterSpacing: "-0.01em" }}>
                    Clans & Social — Coming Soon
                  </p>
                  <p className="text-[9px] mt-0.5" style={{ color: t.textFaint, fontFamily: "'DM Mono', monospace" }}>
                    Compete with friends · Clan wars · Leaderboards
                  </p>
                </div>
                <span className="text-[8px] px-2.5 py-1 rounded-full uppercase tracking-widest shrink-0"
                  style={{ color: t.accent, background: t.accentSoft, border: `1px solid ${t.accentBorder}`, fontFamily: "'DM Mono', monospace" }}>
                  Planned
                </span>
              </motion.div>
            </motion.section>
          </div>
        </div>
      </div>
    </div>
  );
}