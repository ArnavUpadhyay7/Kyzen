import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Moon, Sun, LogOut, Trash2, Palette, Monitor,
  Bell, Flame, Gamepad2, Eye,
  User, Mail, Key, Smartphone, Download, ChevronRight,
  Zap, Target, Focus, Globe, BarChart2, Search,
  Link2, Shield, Database, AlertTriangle, CheckCircle,
  Trophy, Volume2, Wifi
} from "lucide-react";
import { useTheme, type Theme } from "../../state/theme/ThemeContext";
import { authApi } from "../../api/auth";
import { toast } from "../../components/ui/Toast";
import axios from "axios";
import { useAuth } from "../../state/auth/AuthContext";

// ── Token hook ────────────────────────────────────────────────────────────────

function useTokens() {
  const { theme } = useTheme();
  const dk = theme === "dark";
  return {
    dk,
    page: dk ? "#0c0c0f" : "#f0f0f5",
    card: dk ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.85)",
    cardSolid: dk ? "#111115" : "#ffffff",
    cardBorder: dk ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.09)",
    cardGlow: dk ? "rgba(99,102,241,0.08)" : "rgba(99,102,241,0.04)",
    accentLine: dk ? "rgba(99,102,241,0.5)" : "rgba(99,102,241,0.4)",
    label: dk ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.40)",
    heading: dk ? "#ffffff" : "#0d0d10",
    body: dk ? "rgba(255,255,255,0.68)" : "rgba(0,0,0,0.68)",
    muted: dk ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.25)",
    divider: dk ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.07)",
    inputBg: dk ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
    inputBorder: dk ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.10)",
    mutedBtn: dk ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)",
    mutedBtnHov: dk ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.10)",
    accent: "#6366f1",
    accentSoft: dk ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.10)",
    violet: "#8b5cf6",
    success: dk ? "#4ade80" : "#16a34a",
    warning: dk ? "#facc15" : "#ca8a04",
    danger: dk ? "#f87171" : "#dc2626",
    orange: dk ? "#f97316" : "#ea580c",
    sidebarBg: dk ? "rgba(10,10,14,0.98)" : "rgba(250,250,252,0.98)",
  };
}

// ── Toggle component ──────────────────────────────────────────────────────────

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  const t = useTokens();
  return (
    <button
      onClick={() => onChange(!on)}
      className="relative shrink-0 cursor-pointer transition-all duration-300"
      style={{
        width: 42, height: 24,
        borderRadius: 12,
        background: on ? t.accent : t.inputBg,
        border: `1px solid ${on ? t.accent : t.inputBorder}`,
        boxShadow: on ? `0 0 12px ${t.accent}55` : "none",
      }}
    >
      <span
        className="absolute top-0.5 transition-all duration-300"
        style={{
          width: 18, height: 18,
          borderRadius: "50%",
          background: on ? "#fff" : t.muted,
          left: on ? 20 : 2,
          boxShadow: on ? "0 1px 4px rgba(0,0,0,0.4)" : "none",
        }}
      />
    </button>
  );
}

// ── Section wrapper ───────────────────────────────────────────────────────────

function Section({
  icon, title, accent = "#6366f1", children, badge,
}: {
  icon: React.ReactNode;
  title: string;
  accent?: string;
  children: React.ReactNode;
  badge?: string;
}) {
  const t = useTokens();
  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: t.card,
        border: `1px solid ${t.cardBorder}`,
        backdropFilter: "blur(20px)",
        boxShadow: `0 0 0 1px ${t.cardBorder}, inset 0 1px 0 ${t.dk ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.9)"}`,
      }}
    >
      {/* Section header */}
      <div
        className="flex items-center gap-3 px-5 py-4"
        style={{
          borderBottom: `1px solid ${t.divider}`,
          background: `linear-gradient(135deg, ${accent}10 0%, transparent 60%)`,
        }}
      >
        <div
          className="flex items-center justify-center w-8 h-8 rounded-xl"
          style={{
            background: `${accent}18`,
            border: `1px solid ${accent}30`,
            boxShadow: `0 0 12px ${accent}20`,
            color: accent,
          }}
        >
          {icon}
        </div>
        <p
          className="text-[11px] uppercase tracking-widest font-semibold"
          style={{ color: accent, fontFamily: "'DM Mono', monospace" }}
        >
          {title}
        </p>
        {badge && (
          <span
            className="ml-auto text-[10px] px-2 py-0.5 rounded-full"
            style={{
              background: `${accent}18`,
              color: accent,
              border: `1px solid ${accent}30`,
              fontFamily: "'DM Mono', monospace",
            }}
          >
            {badge}
          </span>
        )}
      </div>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}

// ── Row ───────────────────────────────────────────────────────────────────────

function Row({
  icon, label, sub, children, first,
}: {
  icon?: React.ReactNode;
  label: string;
  sub?: string;
  children: React.ReactNode;
  first?: boolean;
}) {
  const t = useTokens();
  return (
    <div
      className="flex items-center justify-between gap-4 px-5 py-3.5 group transition-colors duration-150"
      style={{
        borderTop: first ? "none" : `1px solid ${t.divider}`,
      }}
      onMouseEnter={e => (e.currentTarget.style.background = t.dk ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)")}
      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
    >
      <div className="flex items-center gap-3 min-w-0">
        {icon && (
          <div style={{ color: t.muted, flexShrink: 0 }}>{icon}</div>
        )}
        <div className="min-w-0">
          <p
            className="text-[13px] font-medium leading-tight"
            style={{ color: t.heading, fontFamily: "'DM Sans', sans-serif" }}
          >
            {label}
          </p>
          {sub && (
            <p
              className="text-[11px] mt-0.5 leading-snug"
              style={{ color: t.label, fontFamily: "'DM Mono', monospace" }}
            >
              {sub}
            </p>
          )}
        </div>
      </div>
      <div className="shrink-0 flex items-center gap-2">{children}</div>
    </div>
  );
}

// ── Select pill ───────────────────────────────────────────────────────────────

function SelectPill({
  options, value, onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  const t = useTokens();
  return (
    <div className="flex gap-1.5">
      {options.map(opt => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className="px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200 cursor-pointer"
            style={{
              fontFamily: "'DM Mono', monospace",
              background: active ? t.accent : t.mutedBtn,
              color: active ? "#fff" : t.label,
              border: `1px solid ${active ? t.accent : t.cardBorder}`,
              boxShadow: active ? `0 0 10px ${t.accent}44` : "none",
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// ── Badge ─────────────────────────────────────────────────────────────────────

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="text-[10px] px-2 py-0.5 rounded-full font-medium"
      style={{
        background: `${color}18`,
        color,
        border: `1px solid ${color}30`,
        fontFamily: "'DM Mono', monospace",
      }}
    >
      {label}
    </span>
  );
}

// ── Action button ─────────────────────────────────────────────────────────────

function ActionBtn({
  icon, label, onClick, color,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  color?: string;
}) {
  const t = useTokens();
  const c = color || t.accent;
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-medium transition-all duration-200 cursor-pointer"
      style={{
        fontFamily: "'DM Mono', monospace",
        background: t.mutedBtn,
        color: t.label,
        border: `1px solid ${t.cardBorder}`,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = `${c}15`;
        e.currentTarget.style.color = c;
        e.currentTarget.style.borderColor = `${c}35`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = t.mutedBtn;
        e.currentTarget.style.color = t.label;
        e.currentTarget.style.borderColor = t.cardBorder;
      }}
    >
      {icon}
      {label}
    </button>
  );
}

// ── Danger button ─────────────────────────────────────────────────────────────

function DangerButton({
  icon, label, loading, onClick, color = "#f87171",
}: {
  icon: React.ReactNode;
  label: string;
  loading: boolean;
  onClick: () => void;
  color?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-[12px] font-medium transition-all duration-200 disabled:opacity-50 cursor-pointer"
      style={{
        fontFamily: "'DM Mono', monospace",
        background: `${color}12`,
        border: `1px solid ${color}30`,
        color,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = `${color}22`;
        e.currentTarget.style.boxShadow = `0 0 16px ${color}30`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = `${color}12`;
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {icon}
      {loading ? "Please wait…" : label}
    </button>
  );
}

// ── Confirm modal ─────────────────────────────────────────────────────────────

function ConfirmModal({
  title, body, confirmLabel, onConfirm, onCancel, loading,
}: {
  title: string;
  body: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const t = useTokens();
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(8px)" }}
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6"
        style={{
          background: t.cardSolid,
          border: `1px solid rgba(248,113,113,0.25)`,
          boxShadow: "0 0 40px rgba(248,113,113,0.10), 0 20px 40px rgba(0,0,0,0.4)",
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-2.5 mb-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(248,113,113,0.15)", border: "1px solid rgba(248,113,113,0.3)" }}
          >
            <AlertTriangle size={14} className="text-[#f87171]" />
          </div>
          <p className="text-[14px] font-semibold" style={{ color: t.heading, fontFamily: "'DM Sans', sans-serif" }}>
            {title}
          </p>
        </div>
        <p className="text-[12px] mb-6 leading-relaxed" style={{ color: t.body, fontFamily: "'DM Sans', sans-serif" }}>
          {body}
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-[12px] font-medium cursor-pointer transition-all"
            style={{
              background: t.mutedBtn, color: t.label,
              fontFamily: "'DM Mono', monospace",
              border: `1px solid ${t.cardBorder}`,
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-xl text-[12px] font-medium text-white disabled:opacity-50 cursor-pointer transition-all"
            style={{ background: "#f87171", fontFamily: "'DM Mono', monospace", boxShadow: "0 0 16px rgba(248,113,113,0.4)" }}
          >
            {loading ? "Deleting…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Sidebar Nav ───────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "appearance", icon: <Palette size={14} />, label: "Appearance", color: "#6366f1" },
  { id: "notifications", icon: <Bell size={14} />, label: "Notifications", color: "#8b5cf6" },
  { id: "gameplay", icon: <Gamepad2 size={14} />, label: "Gameplay", color: "#06b6d4" },
  { id: "privacy", icon: <Shield size={14} />, label: "Privacy", color: "#10b981" },
  { id: "account", icon: <User size={14} />, label: "Account", color: "#f59e0b" },
  { id: "danger", icon: <AlertTriangle size={14} />, label: "Danger Zone", color: "#f87171" },
];

// ── Main ──────────────────────────────────────────────────────────────────────

export default function Settings() {
  const navigate = useNavigate();
  const t = useTokens();
  const { theme } = useTheme();
  const { setUser } = useAuth();
  const { setTheme } = useTheme();

  const [active, setActive] = useState("appearance");

  // Account states
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [signoutLoading, setSignoutLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Notification states
  const [dailyReminder, setDailyReminder] = useState(true);
  const [streakWarning, setStreakWarning] = useState(true);
  const [xpMilestone, setXpMilestone] = useState(false);
  const [questComplete, setQuestComplete] = useState(true);
  const [leaderboardAlerts, setLeaderboardAlerts] = useState(false);

  // Gameplay states
  const [xpAnimations, setXpAnimations] = useState(true);
  const [soundEffects, setSoundEffects] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [defaultDiff, setDefaultDiff] = useState("medium");
  const [autoArchive, setAutoArchive] = useState(true);

  // Privacy states
  const [publicProfile, setPublicProfile] = useState(true);
  const [showActivity, setShowActivity] = useState(true);
  const [leaderboard, setLeaderboard] = useState(true);
  const [discoverability, setDiscoverability] = useState(false);
  const [showXP, setShowXP] = useState(true);

  async function handleLogout() {
    setLogoutLoading(true);
    try {
      await authApi.logout();
      setUser(null);
      toast("Logged out successfully.", "success");
      navigate("/login");
    } catch (err) {
      if (axios.isAxiosError(err)) toast(err.response?.data?.message ?? "Logout failed.", "error");
      else toast("Something went wrong.", "error");
    } finally { setLogoutLoading(false); }
  }

  async function handleSignout() {
    setSignoutLoading(true);
    try {
      await authApi.signout();
      setUser(null);
      toast("Account deleted. Goodbye.");
      navigate("/login");
    } catch (err) {
      if (axios.isAxiosError(err)) toast(err.response?.data?.message ?? "Failed to delete account.", "error");
      else toast("Something went wrong.", "error");
    } finally { setSignoutLoading(false); setShowConfirm(false); }
  }

  // ── Scroll to section ─────────────────────────────────────────────────────
  const scrollTo = (id: string) => {
    setActive(id);
    document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ── Section renderers ──────────────────────────────────────────────────────

  const appearanceSection = (
    <div id="section-appearance">
      <Section icon={<Palette size={14} />} title="Appearance" accent="#6366f1">
        <Row
          first icon={<Monitor size={14} />}
          label="Theme"
          sub={`Currently: ${theme === "dark" ? "Dark mode" : "Light mode"}`}
        >
          <div className="flex gap-1.5">
            {(["dark", "light"] as Theme[]).map(v => {
              const active = theme === v;
              return (
                <button
                  key={v}
                  onClick={() => setTheme(v)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-medium transition-all duration-200 cursor-pointer"
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    background: active ? t.accent : t.mutedBtn,
                    color: active ? "#fff" : t.label,
                    border: `1px solid ${active ? t.accent : t.cardBorder}`,
                    boxShadow: active ? `0 0 10px ${t.accent}44` : "none",
                  }}
                >
                  {v === "dark" ? <Moon size={11} /> : <Sun size={11} />}
                  {v === "dark" ? "Dark" : "Light"}
                </button>
              );
            })}
          </div>
        </Row>
        <Row icon={<Monitor size={14} />} label="Font & Density" sub="Interface typography and layout compactness">
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px]"
            style={{
              background: t.mutedBtn, border: `1px solid ${t.cardBorder}`,
              color: t.label, fontFamily: "'DM Mono', monospace",
            }}
          >
            DM Sans · Comfortable
          </div>
        </Row>
        <Row icon={<Zap size={14} />} label="Reduce Motion" sub="Disable animations for accessibility">
          <Toggle on={false} onChange={() => { }} />
        </Row>
      </Section>
    </div>
  );

  const notificationsSection = (
    <div id="section-notifications">
      <Section icon={<Bell size={14} />} title="Notifications" accent="#8b5cf6">
        {/* Preview example */}
        <div
          className="mx-5 mt-4 mb-1 p-3.5 rounded-xl flex items-start gap-3"
          style={{
            background: "rgba(139,92,246,0.08)",
            border: "1px solid rgba(139,92,246,0.18)",
          }}
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "rgba(139,92,246,0.2)", color: "#8b5cf6" }}
          >
            <Flame size={12} />
          </div>
          <div>
            <p className="text-[12px] font-semibold" style={{ color: t.heading, fontFamily: "'DM Sans', sans-serif" }}>
              🔥 Streak at risk — 2 hrs left
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: t.label, fontFamily: "'DM Mono', monospace" }}>
              Complete a quest to keep your 14-day streak alive
            </p>
          </div>
          <Badge label="Preview" color="#8b5cf6" />
        </div>

        <Row first icon={<Bell size={14} />} label="Daily Reminder" sub="Morning nudge to check your quest list">
          <Toggle on={dailyReminder} onChange={setDailyReminder} />
        </Row>
        <Row icon={<Flame size={14} />} label="Streak Warning" sub="Alert before your streak is about to break">
          <Toggle on={streakWarning} onChange={setStreakWarning} />
        </Row>
        <Row icon={<Zap size={14} />} label="XP Milestones" sub="Celebrate when you hit major XP thresholds">
          <Toggle on={xpMilestone} onChange={setXpMilestone} />
        </Row>
        <Row icon={<CheckCircle size={14} />} label="Quest Completion" sub="Notify when a quest is marked done">
          <Toggle on={questComplete} onChange={setQuestComplete} />
        </Row>
        <Row icon={<Trophy size={14} />} label="Leaderboard Changes" sub="Alert when your rank changes significantly">
          <Toggle on={leaderboardAlerts} onChange={setLeaderboardAlerts} />
        </Row>
      </Section>
    </div>
  );

  const gameplaySection = (
    <div id="section-gameplay">
      <Section icon={<Gamepad2 size={14} />} title="Gameplay" accent="#06b6d4">
        <Row
          first icon={<Target size={14} />}
          label="Default Task Difficulty"
          sub="Pre-selected difficulty when creating new quests"
        >
          <SelectPill
            options={[
              { value: "easy", label: "Easy" },
              { value: "medium", label: "Medium" },
              { value: "hard", label: "Hard" },
            ]}
            value={defaultDiff}
            onChange={setDefaultDiff}
          />
        </Row>
        <Row icon={<Zap size={14} />} label="XP Animations" sub="Animated XP gain effects when completing tasks">
          <Toggle on={xpAnimations} onChange={setXpAnimations} />
        </Row>
        <Row icon={<Volume2 size={14} />} label="Sound Effects" sub="Subtle audio cues for XP gains and level ups">
          <Toggle on={soundEffects} onChange={setSoundEffects} />
        </Row>
        <Row icon={<Focus size={14} />} label="Focus Mode" sub="Minimise UI chrome — shows only active quests">
          <Toggle on={focusMode} onChange={setFocusMode} />
        </Row>
        <Row icon={<CheckCircle size={14} />} label="Auto-Archive Completed" sub="Automatically move done tasks to history">
          <Toggle on={autoArchive} onChange={setAutoArchive} />
        </Row>
      </Section>
    </div>
  );

  const privacySection = (
    <div id="section-privacy">
      <Section icon={<Shield size={14} />} title="Privacy" accent="#10b981">
        <Row
          first icon={<Globe size={14} />}
          label="Public Profile"
          sub="Allow others to view your profile and stats"
        >
          <Toggle on={publicProfile} onChange={setPublicProfile} />
        </Row>
        <Row icon={<BarChart2 size={14} />} label="Activity Visibility" sub="Show your activity graph to others">
          <Toggle on={showActivity} onChange={setShowActivity} />
        </Row>
        <Row icon={<Trophy size={14} />} label="Leaderboard Appearance" sub="Show your username on global leaderboards">
          <Toggle on={leaderboard} onChange={setLeaderboard} />
        </Row>
        <Row icon={<Search size={14} />} label="Profile Discoverability" sub="Allow users to find you by username search">
          <Toggle on={discoverability} onChange={setDiscoverability} />
        </Row>
        <Row icon={<Zap size={14} />} label="Show XP & Level" sub="Display your level badge on your public profile">
          <Toggle on={showXP} onChange={setShowXP} />
        </Row>

        {/* Helper note */}
        <div
          className="mx-5 mb-4 mt-1 p-3 rounded-xl flex items-start gap-2.5"
          style={{ background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.15)" }}
        >
          <Eye size={12} style={{ color: "#10b981", marginTop: 1, flexShrink: 0 }} />
          <p className="text-[11px] leading-relaxed" style={{ color: t.label, fontFamily: "'DM Mono', monospace" }}>
            Private profiles are never indexed or searchable. Only your username is ever shared — quest content is always private.
          </p>
        </div>
      </Section>
    </div>
  );

  const accountSection = (
    <div id="section-account">
      <Section icon={<User size={14} />} title="Account" accent="#f59e0b">
        <Row
          first icon={<Mail size={14} />}
          label="Email"
          sub="ethan@kyzen.gg · Verified"
        >
          <div className="flex items-center gap-2">
            <Badge label="Verified" color="#10b981" />
            <ActionBtn icon={<ChevronRight size={12} />} label="Change" color="#f59e0b" />
          </div>
        </Row>
        <Row icon={<Key size={14} />} label="Password" sub="Last changed 3 months ago">
          <ActionBtn icon={<Key size={12} />} label="Update" color="#f59e0b" />
        </Row>
        <Row icon={<Link2 size={14} />} label="Connected Accounts" sub="Google, Discord — 2 linked">
          <div className="flex items-center gap-2">
            <Badge label="2 linked" color="#6366f1" />
            <ActionBtn icon={<ChevronRight size={12} />} label="Manage" color="#f59e0b" />
          </div>
        </Row>
        <Row icon={<Smartphone size={14} />} label="Active Sessions" sub="2 devices — this browser, iPhone 15">
          <div className="flex items-center gap-2">
            <Badge label="2 active" color="#06b6d4" />
            <ActionBtn icon={<Wifi size={12} />} label="View" color="#f59e0b" />
          </div>
        </Row>
        <Row icon={<Database size={14} />} label="Export Data" sub="Download all your quests, XP history, and stats">
          <ActionBtn icon={<Download size={12} />} label="Export" color="#f59e0b" />
        </Row>
      </Section>
    </div>
  );

  const dangerSection = (
    <div id="section-danger">
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          border: "1px solid rgba(248,113,113,0.18)",
          background: t.dk ? "rgba(248,113,113,0.03)" : "rgba(248,113,113,0.02)",
          boxShadow: "0 0 30px rgba(248,113,113,0.06)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 px-5 py-4"
          style={{
            borderBottom: "1px solid rgba(248,113,113,0.12)",
            background: "linear-gradient(135deg, rgba(248,113,113,0.08) 0%, transparent 60%)",
          }}
        >
          <div
            className="flex items-center justify-center w-8 h-8 rounded-xl"
            style={{
              background: "rgba(248,113,113,0.15)",
              border: "1px solid rgba(248,113,113,0.30)",
              color: "#f87171",
            }}
          >
            <AlertTriangle size={14} />
          </div>
          <p
            className="text-[11px] uppercase tracking-widest font-semibold"
            style={{ color: "#f87171", fontFamily: "'DM Mono', monospace" }}
          >
            Danger Zone
          </p>
          <Badge label="Irreversible" color="#f87171" />
        </div>

        {/* Sign out row */}
        <div
          className="flex items-center justify-between gap-4 px-5 py-4 transition-colors"
          style={{ borderBottom: "1px solid rgba(248,113,113,0.08)" }}
        >
          <div className="flex items-center gap-3">
            <LogOut size={14} style={{ color: "rgba(249,115,22,0.7)" }} />
            <div>
              <p className="text-[13px] font-medium" style={{ color: t.heading, fontFamily: "'DM Sans', sans-serif" }}>
                Sign out
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: t.label, fontFamily: "'DM Mono', monospace" }}>
                Clears session cookie — you can log back in anytime
              </p>
            </div>
          </div>
          <DangerButton
            icon={<LogOut size={13} />}
            label="Log out"
            loading={logoutLoading}
            onClick={handleLogout}
            color="#f97316"
          />
        </div>

        {/* Delete row */}
        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <div className="flex items-center gap-3">
            <Trash2 size={14} style={{ color: "rgba(248,113,113,0.7)" }} />
            <div>
              <p className="text-[13px] font-medium" style={{ color: t.heading, fontFamily: "'DM Sans', sans-serif" }}>
                Delete account
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: t.label, fontFamily: "'DM Mono', monospace" }}>
                Permanently erases all data — quests, XP, progress. Cannot be undone.
              </p>
            </div>
          </div>
          <DangerButton
            icon={<Trash2 size={13} />}
            label="Delete"
            loading={signoutLoading}
            onClick={() => setShowConfirm(true)}
            color="#f87171"
          />
        </div>
      </div>
    </div>
  );

  // ── Layout ────────────────────────────────────────────────────────────────

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ background: t.page, fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Subtle background grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: t.dk
            ? "linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)"
            : "linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: 0.5,
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-1.5 h-6 rounded-full"
                style={{ background: `linear-gradient(to bottom, ${t.accent}, ${t.violet})` }}
              />
              <h1
                className="text-[24px] font-bold tracking-tight"
                style={{ color: t.heading, letterSpacing: "-0.025em" }}
              >
                Settings
              </h1>
            </div>
            <p className="text-[13px]" style={{ color: t.label, fontFamily: "'DM Mono', monospace" }}>
              Control panel · Kyzen OS v2.6
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge label="Auto-saved" color="#10b981" />
          </div>
        </div>

        {/* Two-column layout */}
        <div className="flex gap-6 items-start">

          {/* Sticky sidebar nav */}
          <div
            className="hidden lg:flex flex-col gap-1 w-48 shrink-0 sticky top-8 rounded-2xl p-2"
            style={{
              background: t.sidebarBg,
              border: `1px solid ${t.cardBorder}`,
              backdropFilter: "blur(20px)",
            }}
          >
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[12px] font-medium text-left transition-all duration-150 cursor-pointer w-full"
                style={{
                  fontFamily: "'DM Mono', monospace",
                  background: active === item.id ? `${item.color}15` : "transparent",
                  color: active === item.id ? item.color : t.label,
                  border: `1px solid ${active === item.id ? `${item.color}25` : "transparent"}`,
                }}
                onMouseEnter={e => {
                  if (active !== item.id) {
                    e.currentTarget.style.background = t.mutedBtn;
                    e.currentTarget.style.color = t.body;
                  }
                }}
                onMouseLeave={e => {
                  if (active !== item.id) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = t.label;
                  }
                }}
              >
                <span style={{ color: active === item.id ? item.color : t.muted }}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 flex flex-col gap-5">
            {appearanceSection}
            {notificationsSection}
            {gameplaySection}
            {privacySection}
            {accountSection}
            {dangerSection}
          </div>
        </div>
      </div>

      {/* Confirm modal */}
      {showConfirm && (
        <ConfirmModal
          title="Delete your account?"
          body="All your quests, XP, streaks, and progress will be permanently erased. This action cannot be undone and your username will be freed."
          confirmLabel="Yes, delete my account"
          onConfirm={handleSignout}
          onCancel={() => setShowConfirm(false)}
          loading={signoutLoading}
        />
      )}
    </div>
  );
}