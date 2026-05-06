import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Moon, Sun, LogOut, Trash2, ShieldAlert, Palette, Monitor } from "lucide-react";
import { useTheme, type Theme } from "../../context/ThemeContext";
import { authApi } from "../../api/auth";
import { toast } from "../../components/ui/Toast";
import axios from "axios";

// ── Shared token helpers (reads data-theme from layout wrapper) ──────────────

function useTokens() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  return {
    dark,
    page:        dark ? "#0B0B0F"                    : "#F4F4F6",
    card:        dark ? "#111115"                    : "#FFFFFF",
    cardBorder:  dark ? "rgba(255,255,255,0.06)"     : "rgba(0,0,0,0.08)",
    label:       dark ? "rgba(255,255,255,0.38)"     : "rgba(0,0,0,0.42)",
    heading:     dark ? "#FFFFFF"                    : "#0D0D10",
    body:        dark ? "rgba(255,255,255,0.70)"     : "rgba(0,0,0,0.72)",
    divider:     dark ? "rgba(255,255,255,0.06)"     : "rgba(0,0,0,0.08)",
    mutedBtn:    dark ? "rgba(255,255,255,0.05)"     : "rgba(0,0,0,0.06)",
    mutedBtnHov: dark ? "rgba(255,255,255,0.09)"     : "rgba(0,0,0,0.10)",
  };
}

// ── Section wrapper ───────────────────────────────────────────────────────────

function Section({
  icon, title, children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  const t = useTokens();
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-5"
      style={{ background: t.card, border: `1px solid ${t.cardBorder}` }}
    >
      <div className="flex items-center gap-2.5">
        <span style={{ color: "#6366f1" }}>{icon}</span>
        <p
          className="text-[11px] uppercase tracking-[0.07em]"
          style={{ color: t.label, fontFamily: "'DM Mono', monospace" }}
        >
          {title}
        </p>
      </div>
      {children}
    </div>
  );
}

// ── Row ───────────────────────────────────────────────────────────────────────

function Row({
  label, sub, children,
}: {
  label: string;
  sub?: string;
  children: React.ReactNode;
}) {
  const t = useTokens();
  return (
    <div
      className="flex items-center justify-between gap-4 py-3"
      style={{ borderTop: `1px solid ${t.divider}` }}
    >
      <div>
        <p className="text-[13px] font-medium" style={{ color: t.heading, fontFamily: "'DM Sans', sans-serif" }}>
          {label}
        </p>
        {sub && (
          <p className="text-[11px] mt-0.5" style={{ color: t.label, fontFamily: "'DM Mono', monospace" }}>
            {sub}
          </p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

// ── Theme Picker ──────────────────────────────────────────────────────────────

const THEMES: { value: Theme; label: string; icon: React.ReactNode }[] = [
  { value: "dark",  label: "Dark",   icon: <Moon  size={14} /> },
  { value: "light", label: "Light",  icon: <Sun   size={14} /> },
];

function ThemePicker() {
  const { theme, setTheme } = useTheme();
  const t = useTokens();

  return (
    <div className="flex gap-2">
      {THEMES.map((opt) => {
        const active = theme === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => setTheme(opt.value)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-medium transition-all duration-200"
            style={{
              fontFamily: "'DM Mono', monospace",
              background: active ? "#6366f1" : t.mutedBtn,
              color:      active ? "#fff"    : t.label,
              border: `1px solid ${active ? "#6366f1" : t.cardBorder}`,
            }}
          >
            {opt.icon}
            {opt.label}
          </button>
        );
      })}
    </div>
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
  const t = useTokens();
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-[12px] font-medium transition-all duration-150 disabled:opacity-50"
      style={{
        fontFamily: "'DM Mono', monospace",
        background: `${color}14`,
        border:     `1px solid ${color}33`,
        color,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = `${color}22`)}
      onMouseLeave={(e) => (e.currentTarget.style.background = `${color}14`)}
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
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }}
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6"
        style={{ background: t.card, border: `1px solid ${t.cardBorder}` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 mb-2">
          <ShieldAlert size={16} className="text-[#f87171]" />
          <p className="text-[14px] font-semibold" style={{ color: t.heading, fontFamily: "'DM Sans', sans-serif" }}>
            {title}
          </p>
        </div>
        <p className="text-[12px] mb-6 leading-relaxed" style={{ color: t.label, fontFamily: "'DM Sans', sans-serif" }}>
          {body}
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-[12px] font-medium"
            style={{ background: t.mutedBtn, color: t.label, fontFamily: "'DM Mono', monospace", border: `1px solid ${t.cardBorder}` }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-xl text-[12px] font-medium text-white disabled:opacity-50"
            style={{ background: "#f87171", fontFamily: "'DM Mono', monospace" }}
          >
            {loading ? "Please wait…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function Settings() {
  const navigate  = useNavigate();
  const t         = useTokens();
  const { theme } = useTheme();

  const [logoutLoading,  setLogoutLoading]  = useState(false);
  const [signoutLoading, setSignoutLoading] = useState(false);
  const [showConfirm,    setShowConfirm]    = useState(false);

  // ── Logout ────────────────────────────────────────────────────────────────
  async function handleLogout() {
    setLogoutLoading(true);
    try {
      await authApi.logout();
      toast("Logged out successfully.", "success");
      setTimeout(() => navigate("/login"), 600);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast(err.response?.data?.message ?? "Logout failed.", "error");
      } else {
        toast("Something went wrong.", "error");
      }
    } finally {
      setLogoutLoading(false);
    }
  }

  // ── Delete account ────────────────────────────────────────────────────────
  async function handleSignout() {
    setSignoutLoading(true);
    try {
      await authApi.signout();
      toast("Account deleted. Goodbye.");
      setTimeout(() => navigate("/login"), 600);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast(err.response?.data?.message ?? "Failed to delete account.", "error");
      } else {
        toast("Something went wrong.", "error");
      }
    } finally {
      setSignoutLoading(false);
      setShowConfirm(false);
    }
  }

  return (
    <div
      className="min-h-screen p-4 md:p-6 lg:p-8 transition-colors duration-300"
      style={{ background: t.page, fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Page header */}
      <div className="mb-8">
        <h1
          className="text-[22px] font-semibold tracking-tight mb-1"
          style={{ color: t.heading, letterSpacing: "-0.02em" }}
        >
          Settings
        </h1>
        <p className="text-[13px]" style={{ color: t.label, fontFamily: "'DM Mono', monospace" }}>
          Manage your preferences and account.
        </p>
      </div>

      <div className="max-w-xl flex flex-col gap-4">

        {/* ── Appearance ─────────────────────────────────────────────────── */}
        <Section icon={<Palette size={14} />} title="Appearance">
          <Row
            label="Theme"
            sub={`Currently: ${theme === "dark" ? "Dark mode" : "Light mode"}`}
          >
            <ThemePicker />
          </Row>

          <Row label="Interface" sub="Dashboard font & density">
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px]"
              style={{
                background: t.mutedBtn,
                border: `1px solid ${t.cardBorder}`,
                color: t.label,
                fontFamily: "'DM Mono', monospace",
              }}
            >
              <Monitor size={12} />
              DM Sans · Comfortable
            </div>
          </Row>
        </Section>

        {/* ── Session ────────────────────────────────────────────────────── */}
        <Section icon={<LogOut size={14} />} title="Session">
          <Row
            label="Sign out"
            sub="Clears your session cookie. You can log back in anytime."
          >
            <DangerButton
              icon={<LogOut size={13} />}
              label="Log out"
              loading={logoutLoading}
              onClick={handleLogout}
              color="#f97316"
            />
          </Row>

          <Row
            label="Delete account"
            sub="Permanently removes your data. This cannot be undone."
          >
            <DangerButton
              icon={<Trash2 size={13} />}
              label="Delete account"
              loading={signoutLoading}
              onClick={() => setShowConfirm(true)}
              color="#f87171"
            />
          </Row>
        </Section>

      </div>

      {/* Confirm modal */}
      {showConfirm && (
        <ConfirmModal
          title="Delete your account?"
          body="All your quests, XP, and progress will be permanently erased. This action cannot be undone."
          confirmLabel="Yes, delete my account"
          onConfirm={handleSignout}
          onCancel={() => setShowConfirm(false)}
          loading={signoutLoading}
        />
      )}
    </div>
  );
}