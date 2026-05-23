import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Moon,
  Sun,
  LogOut,
  Trash2,
  Palette,
  Monitor,
  Bell,
  Flame,
  Gamepad2,
  Eye,
  User,
  Mail,
  Key,
  Smartphone,
  Download,
  ChevronRight,
  Zap,
  Target,
  Focus,
  Globe,
  BarChart2,
  Search,
  Link2,
  Shield,
  Database,
  AlertTriangle,
  CheckCircle,
  Trophy,
  Volume2,
  Wifi,
} from "lucide-react";
import { useTheme, type Theme } from "../../state/theme/ThemeContext";
import { authApi } from "../../api/auth";
import { toast } from "../../components/ui/Toast";
import axios from "axios";
import { useAuth } from "../../state/auth/AuthContext";
import {
  DashboardBadge,
  DashboardButton,
  DashboardCard,
} from "../../components/dashboard/ui";
import { cn } from "../../lib/utils";

// ── Toggle ────────────────────────────────────────────────────────────────────

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={cn(
        "relative h-6 w-[42px] shrink-0 cursor-pointer rounded-full border transition-all duration-300",
        on
          ? "border-dash-accent bg-dash-accent shadow-[0_0_12px_color-mix(in_srgb,var(--dash-accent)_33%,transparent)]"
          : "border-dash-input-border bg-dash-input",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-[18px] w-[18px] rounded-full transition-all duration-300",
          on ? "left-5 bg-white shadow-sm" : "left-0.5 bg-dash-muted",
        )}
      />
    </button>
  );
}

// ── Section wrapper ───────────────────────────────────────────────────────────

type SectionAccent = "accent" | "violet" | "success" | "warning" | "danger";

const SECTION_ACCENT: Record<SectionAccent, { header: string; icon: string; title: string }> = {
  accent: {
    header: "bg-gradient-to-br from-dash-accent/10 to-transparent",
    icon: "border-dash-accent-border bg-dash-accent-soft text-dash-accent shadow-[0_0_12px_color-mix(in_srgb,var(--dash-accent)_12%,transparent)]",
    title: "text-dash-accent",
  },
  violet: {
    header: "bg-gradient-to-br from-dash-violet/10 to-transparent",
    icon: "border-dash-accent-border bg-dash-accent-soft text-dash-violet shadow-[0_0_12px_color-mix(in_srgb,var(--dash-violet)_12%,transparent)]",
    title: "text-dash-violet",
  },
  success: {
    header: "bg-gradient-to-br from-dash-success/10 to-transparent",
    icon: "border-dash-success/30 bg-dash-success/15 text-dash-success",
    title: "text-dash-success",
  },
  warning: {
    header: "bg-gradient-to-br from-dash-warning/10 to-transparent",
    icon: "border-dash-warning/30 bg-dash-warning/15 text-dash-warning",
    title: "text-dash-warning",
  },
  danger: {
    header: "bg-gradient-to-br from-dash-danger/10 to-transparent",
    icon: "border-dash-danger/30 bg-dash-danger/15 text-dash-danger",
    title: "text-dash-danger",
  },
};

function Section({
  icon,
  title,
  accent = "accent",
  children,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  accent?: SectionAccent;
  children: React.ReactNode;
  badge?: string;
}) {
  const a = SECTION_ACCENT[accent];

  return (
    <DashboardCard className="overflow-hidden rounded-2xl p-0 backdrop-blur-xl">
      <div className={cn("flex items-center gap-3 border-b border-dash-border px-5 py-4", a.header)}>
        <div className={cn("flex h-8 w-8 items-center justify-center rounded-xl border", a.icon)}>
          {icon}
        </div>
        <p className={cn("font-dash-mono text-[11px] font-semibold uppercase tracking-widest", a.title)}>
          {title}
        </p>
        {badge && (
          <DashboardBadge variant={accent === "danger" ? "danger" : "accent"} className="ml-auto">
            {badge}
          </DashboardBadge>
        )}
      </div>
      <div className="flex flex-col">{children}</div>
    </DashboardCard>
  );
}

// ── Row ───────────────────────────────────────────────────────────────────────

function Row({
  icon,
  label,
  sub,
  children,
  first,
}: {
  icon?: React.ReactNode;
  label: string;
  sub?: string;
  children: React.ReactNode;
  first?: boolean;
}) {
  return (
    <div
      className={cn(
        "group flex items-center justify-between gap-4 px-5 py-3.5 transition-colors duration-150 hover:bg-dash-muted-btn/50",
        !first && "border-t border-dash-border",
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        {icon && <div className="shrink-0 text-dash-muted">{icon}</div>}
        <div className="min-w-0">
          <p className="font-dash-sans text-[13px] font-medium leading-tight text-dash-primary">{label}</p>
          {sub && (
            <p className="mt-0.5 font-dash-mono text-[11px] leading-snug text-dash-faint">{sub}</p>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">{children}</div>
    </div>
  );
}

// ── Select pill ───────────────────────────────────────────────────────────────

function SelectPill({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex gap-1.5">
      {options.map((opt) => (
        <DashboardButton
          key={opt.value}
          size="sm"
          variant={opt.value === value ? "primary" : "muted"}
          onClick={() => onChange(opt.value)}
          className="font-dash-mono text-[11px]"
        >
          {opt.label}
        </DashboardButton>
      ))}
    </div>
  );
}

// ── Confirm modal ─────────────────────────────────────────────────────────────

function ConfirmModal({
  title,
  body,
  confirmLabel,
  onConfirm,
  onCancel,
  loading,
}: {
  title: string;
  body: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
      onClick={onCancel}
    >
      <DashboardCard
        className="w-full max-w-sm rounded-2xl border-dash-danger/25 p-6 shadow-[0_0_40px_color-mix(in_srgb,var(--dash-danger)_10%,transparent)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-dash-danger/30 bg-dash-danger/15">
            <AlertTriangle size={14} className="text-dash-danger" />
          </div>
          <p className="font-dash-sans text-[14px] font-semibold text-dash-primary">{title}</p>
        </div>
        <p className="mb-6 font-dash-sans text-[12px] leading-relaxed text-dash-secondary">{body}</p>
        <div className="flex justify-end gap-2">
          <DashboardButton variant="muted" size="sm" onClick={onCancel}>
            Cancel
          </DashboardButton>
          <DashboardButton
            variant="danger"
            size="sm"
            onClick={onConfirm}
            disabled={loading}
            className="text-white bg-dash-danger border-dash-danger hover:bg-dash-danger/90"
          >
            {loading ? "Deleting…" : confirmLabel}
          </DashboardButton>
        </div>
      </DashboardCard>
    </div>
  );
}

// ── Sidebar Nav ───────────────────────────────────────────────────────────────

const NAV_ITEMS: {
  id: string;
  icon: React.ReactNode;
  label: string;
  accent: SectionAccent;
}[] = [
  { id: "appearance", icon: <Palette size={14} />, label: "Appearance", accent: "accent" },
  { id: "notifications", icon: <Bell size={14} />, label: "Notifications", accent: "violet" },
  { id: "gameplay", icon: <Gamepad2 size={14} />, label: "Gameplay", accent: "accent" },
  { id: "privacy", icon: <Shield size={14} />, label: "Privacy", accent: "success" },
  { id: "account", icon: <User size={14} />, label: "Account", accent: "warning" },
  { id: "danger", icon: <AlertTriangle size={14} />, label: "Danger Zone", accent: "danger" },
];

// ── Main ──────────────────────────────────────────────────────────────────────

export default function Settings() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { setUser } = useAuth();

  const [active, setActive] = useState("appearance");
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [signoutLoading, setSignoutLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [dailyReminder, setDailyReminder] = useState(true);
  const [streakWarning, setStreakWarning] = useState(true);
  const [xpMilestone, setXpMilestone] = useState(false);
  const [questComplete, setQuestComplete] = useState(true);
  const [leaderboardAlerts, setLeaderboardAlerts] = useState(false);

  const [xpAnimations, setXpAnimations] = useState(true);
  const [soundEffects, setSoundEffects] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [defaultDiff, setDefaultDiff] = useState("medium");
  const [autoArchive, setAutoArchive] = useState(true);

  const [publicProfile, setPublicProfile] = useState(true);
  const [showActivity, setShowActivity] = useState(true);
  const [leaderboard, setLeaderboard] = useState(true);
  const [discoverability, setDiscoverability] = useState(false);
  const [showXP, setShowXP] = useState(true);

  const scrollTo = useCallback((id: string) => {
    setActive(id);
    document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleLogout = useCallback(async () => {
    setLogoutLoading(true);
    try {
      await authApi.logout();
      setUser(null);
      toast("Logged out successfully.", "success");
      navigate("/login");
    } catch (err) {
      if (axios.isAxiosError(err)) toast(err.response?.data?.message ?? "Logout failed.", "error");
      else toast("Something went wrong.", "error");
    } finally {
      setLogoutLoading(false);
    }
  }, [navigate, setUser]);

  const handleSignout = useCallback(async () => {
    setSignoutLoading(true);
    try {
      await authApi.signout();
      setUser(null);
      toast("Account deleted. Goodbye.");
      navigate("/login");
    } catch (err) {
      if (axios.isAxiosError(err)) toast(err.response?.data?.message ?? "Failed to delete account.", "error");
      else toast("Something went wrong.", "error");
    } finally {
      setSignoutLoading(false);
      setShowConfirm(false);
    }
  }, [navigate, setUser]);

  const navAccentClasses = (item: (typeof NAV_ITEMS)[number], isActive: boolean) => {
    const a = SECTION_ACCENT[item.accent];
    return cn(
      "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left font-dash-mono text-[12px] font-medium transition-all duration-150",
      isActive
        ? cn("border", a.icon, a.title)
        : "border border-transparent text-dash-faint hover:bg-dash-muted-btn hover:text-dash-secondary",
    );
  };

  return (
    <div className="relative min-h-screen bg-dash-page font-dash-sans transition-colors duration-300">
      <div
        className="pointer-events-none fixed inset-0 opacity-50 bg-[linear-gradient(color-mix(in_srgb,var(--dash-accent)_3%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_srgb,var(--dash-accent)_3%,transparent)_1px,transparent_1px)] bg-[length:40px_40px]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-8 md:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="h-6 w-1.5 rounded-full bg-gradient-to-b from-dash-accent to-dash-violet" />
              <h1 className="text-[24px] font-bold tracking-tight text-dash-primary">Settings</h1>
            </div>
            <p className="font-dash-mono text-[13px] text-dash-faint">Control panel · Kyzen OS v2.6</p>
          </div>
          <DashboardBadge variant="success">Auto-saved</DashboardBadge>
        </div>

        <div className="flex items-start gap-6">
          <nav className="sticky top-8 hidden w-48 shrink-0 flex-col gap-1 rounded-2xl border border-dash-border bg-dash-sidebar/95 p-2 backdrop-blur-xl lg:flex">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollTo(item.id)}
                className={navAccentClasses(item, active === item.id)}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex min-w-0 flex-1 flex-col gap-5">
            <div id="section-appearance">
              <Section icon={<Palette size={14} />} title="Appearance" accent="accent">
                <Row
                  first
                  icon={<Monitor size={14} />}
                  label="Theme"
                  sub={`Currently: ${theme === "dark" ? "Dark mode" : "Light mode"}`}
                >
                  <div className="flex gap-1.5">
                    {(["dark", "light"] as Theme[]).map((v) => (
                      <DashboardButton
                        key={v}
                        size="sm"
                        variant={theme === v ? "primary" : "muted"}
                        onClick={() => setTheme(v)}
                        className="font-dash-mono text-[11px]"
                      >
                        {v === "dark" ? <Moon size={11} /> : <Sun size={11} />}
                        {v === "dark" ? "Dark" : "Light"}
                      </DashboardButton>
                    ))}
                  </div>
                </Row>
                <Row icon={<Monitor size={14} />} label="Font & Density" sub="Interface typography and layout compactness">
                  <span className="rounded-xl border border-dash-border bg-dash-muted-btn px-3 py-1.5 font-dash-mono text-[11px] text-dash-faint">
                    DM Sans · Comfortable
                  </span>
                </Row>
                <Row icon={<Zap size={14} />} label="Reduce Motion" sub="Disable animations for accessibility">
                  <Toggle on={false} onChange={() => {}} />
                </Row>
              </Section>
            </div>

            <div id="section-notifications">
              <Section icon={<Bell size={14} />} title="Notifications" accent="violet">
                <div className="mx-5 mb-1 mt-4 flex items-start gap-3 rounded-xl border border-dash-accent-border bg-dash-accent-soft p-3.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-dash-accent-border bg-dash-accent-soft text-dash-violet">
                    <Flame size={12} />
                  </div>
                  <div className="flex-1">
                    <p className="font-dash-sans text-[12px] font-semibold text-dash-primary">
                      🔥 Streak at risk — 2 hrs left
                    </p>
                    <p className="mt-0.5 font-dash-mono text-[11px] text-dash-faint">
                      Complete a quest to keep your 14-day streak alive
                    </p>
                  </div>
                  <DashboardBadge variant="violet">Preview</DashboardBadge>
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

            <div id="section-gameplay">
              <Section icon={<Gamepad2 size={14} />} title="Gameplay" accent="accent">
                <Row
                  first
                  icon={<Target size={14} />}
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

            <div id="section-privacy">
              <Section icon={<Shield size={14} />} title="Privacy" accent="success">
                <Row first icon={<Globe size={14} />} label="Public Profile" sub="Allow others to view your profile and stats">
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

                <div className="mx-5 mb-4 mt-1 flex items-start gap-2.5 rounded-xl border border-dash-success/20 bg-dash-success/10 p-3">
                  <Eye size={12} className="mt-px shrink-0 text-dash-success" />
                  <p className="font-dash-mono text-[11px] leading-relaxed text-dash-faint">
                    Private profiles are never indexed or searchable. Only your username is ever shared — quest content is always private.
                  </p>
                </div>
              </Section>
            </div>

            <div id="section-account">
              <Section icon={<User size={14} />} title="Account" accent="warning">
                <Row first icon={<Mail size={14} />} label="Email" sub="ethan@kyzen.gg · Verified">
                  <div className="flex items-center gap-2">
                    <DashboardBadge variant="success">Verified</DashboardBadge>
                    <DashboardButton variant="muted" size="sm" className="font-dash-mono text-[11px]">
                      <ChevronRight size={12} /> Change
                    </DashboardButton>
                  </div>
                </Row>
                <Row icon={<Key size={14} />} label="Password" sub="Last changed 3 months ago">
                  <DashboardButton variant="muted" size="sm" className="font-dash-mono text-[11px]">
                    <Key size={12} /> Update
                  </DashboardButton>
                </Row>
                <Row icon={<Link2 size={14} />} label="Connected Accounts" sub="Google, Discord — 2 linked">
                  <div className="flex items-center gap-2">
                    <DashboardBadge variant="accent">2 linked</DashboardBadge>
                    <DashboardButton variant="muted" size="sm" className="font-dash-mono text-[11px]">
                      <ChevronRight size={12} /> Manage
                    </DashboardButton>
                  </div>
                </Row>
                <Row icon={<Smartphone size={14} />} label="Active Sessions" sub="2 devices — this browser, iPhone 15">
                  <div className="flex items-center gap-2">
                    <DashboardBadge variant="violet">2 active</DashboardBadge>
                    <DashboardButton variant="muted" size="sm" className="font-dash-mono text-[11px]">
                      <Wifi size={12} /> View
                    </DashboardButton>
                  </div>
                </Row>
                <Row icon={<Database size={14} />} label="Export Data" sub="Download all your quests, XP history, and stats">
                  <DashboardButton variant="muted" size="sm" className="font-dash-mono text-[11px]">
                    <Download size={12} /> Export
                  </DashboardButton>
                </Row>
              </Section>
            </div>

            <div id="section-danger">
              <div className="overflow-hidden rounded-2xl border border-dash-danger/20 bg-dash-danger/5 shadow-[0_0_30px_color-mix(in_srgb,var(--dash-danger)_6%,transparent)]">
                <div className="flex items-center gap-3 border-b border-dash-danger/15 bg-gradient-to-br from-dash-danger/10 to-transparent px-5 py-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-dash-danger/30 bg-dash-danger/15 text-dash-danger">
                    <AlertTriangle size={14} />
                  </div>
                  <p className="font-dash-mono text-[11px] font-semibold uppercase tracking-widest text-dash-danger">
                    Danger Zone
                  </p>
                  <DashboardBadge variant="danger" className="ml-auto">
                    Irreversible
                  </DashboardBadge>
                </div>

                <div className="flex items-center justify-between gap-4 border-b border-dash-danger/10 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <LogOut size={14} className="text-dash-orange/70" />
                    <div>
                      <p className="font-dash-sans text-[13px] font-medium text-dash-primary">Sign out</p>
                      <p className="mt-0.5 font-dash-mono text-[11px] text-dash-faint">
                        Clears session cookie — you can log back in anytime
                      </p>
                    </div>
                  </div>
                  <DashboardButton
                    variant="danger"
                    size="sm"
                    onClick={handleLogout}
                    disabled={logoutLoading}
                    className="font-dash-mono text-[12px] text-dash-orange border-dash-orange/30 bg-dash-orange/15 hover:bg-dash-orange/25"
                  >
                    <LogOut size={13} />
                    {logoutLoading ? "Please wait…" : "Log out"}
                  </DashboardButton>
                </div>

                <div className="flex items-center justify-between gap-4 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Trash2 size={14} className="text-dash-danger/70" />
                    <div>
                      <p className="font-dash-sans text-[13px] font-medium text-dash-primary">Delete account</p>
                      <p className="mt-0.5 font-dash-mono text-[11px] text-dash-faint">
                        Permanently erases all data — quests, XP, progress. Cannot be undone.
                      </p>
                    </div>
                  </div>
                  <DashboardButton
                    variant="danger"
                    size="sm"
                    onClick={() => setShowConfirm(true)}
                    disabled={signoutLoading}
                    className="font-dash-mono text-[12px]"
                  >
                    <Trash2 size={13} />
                    {signoutLoading ? "Please wait…" : "Delete"}
                  </DashboardButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
