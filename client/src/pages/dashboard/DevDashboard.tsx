import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Terminal,
  Flame,
  Code2,
  Activity,
  GitCommit,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { useTokens } from "../../context/ThemeContext";

// ── localStorage keys ─────────────────────────────────────────────────────────
const GH_USERNAME_KEY = "kyzen-gh-username";

// ── Contribution graph via github-contributions-canvas or a grass-green SVG
// We use the public GitHub contribution graph embed approach (no API key needed)
// via https://ghchart.rshah.org/{username} — a lightweight public service
// that returns an SVG embed.

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}) {
  const t = useTokens();
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3 transition-colors duration-300"
      style={{
        background: t.card,
        border: `1px solid ${t.border}`,
      }}
    >
      <div className="flex items-center justify-between">
        <span
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: accent ? `${accent}18` : t.accentSoft, color: accent ?? t.accent }}
        >
          {icon}
        </span>
        <span className="text-[10px] font-medium tracking-wider uppercase" style={{ color: t.textFaint, fontFamily: "'DM Mono', monospace" }}>
          {label}
        </span>
      </div>
      <div>
        <p className="text-[24px] font-semibold tracking-tight" style={{ color: t.textPrimary, fontFamily: "'DM Mono', monospace" }}>
          {value}
        </p>
        {sub && (
          <p className="text-[11px] mt-0.5" style={{ color: t.textMuted, fontFamily: "'DM Sans', sans-serif" }}>
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

// ── GitHub input form ─────────────────────────────────────────────────────────
function GithubConnectForm({ onSubmit }: { onSubmit: (username: string) => void }) {
  const t = useTokens();
  const [value, setValue] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim().replace(/^@/, "");
    if (trimmed) onSubmit(trimmed);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl p-8 flex flex-col items-center text-center gap-6"
      style={{
        background: t.card,
        border: `1px solid ${t.border}`,
        boxShadow: `0 0 40px rgba(99,102,241,0.05)`,
      }}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{ background: t.accentSoft, border: `1px solid ${t.accentBorder}`, boxShadow: `0 0 24px rgba(99,102,241,0.12)` }}
      >
        <Code2 size={24} style={{ color: t.accent }} />
      </div>

      <div>
        <h2 className="text-[17px] font-semibold mb-1.5 tracking-tight" style={{ color: t.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>
          Connect your GitHub
        </h2>
        <p className="text-[13px] leading-relaxed max-w-sm" style={{ color: t.textSecondary, fontFamily: "'DM Sans', sans-serif" }}>
          Enter your GitHub username to visualise your contribution history and unlock coding streak tracking.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-3">
        <div
          className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
          style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}` }}
        >
          <span style={{ color: t.textFaint }}>
            <Code2 size={14} />
          </span>
          <input
            type="text"
            placeholder="your-username"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="flex-1 bg-transparent outline-none text-[13px] placeholder:opacity-40"
            style={{ color: t.textPrimary, fontFamily: "'DM Mono', monospace" }}
            autoFocus
          />
        </div>
        <button
          type="submit"
          disabled={!value.trim()}
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-150 disabled:opacity-40"
          style={{
            background: t.accent,
            color: "#fff",
            fontFamily: "'DM Mono', monospace",
            boxShadow: `0 0 16px rgba(99,102,241,0.2)`,
          }}
          onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.opacity = "0.88"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
        >
          Load contributions
          <ArrowRight size={14} />
        </button>
      </form>
    </motion.div>
  );
}

// ── Contribution graph panel ──────────────────────────────────────────────────
function ContributionGraph({ username, onReset }: { username: string; onReset: () => void }) {
  const t = useTokens();
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Use ghchart.rshah.org which returns a pure SVG — no auth needed
  // We tint it via a CSS filter in dark mode to match our accent colour
  const graphUrl = `https://ghchart.rshah.org/${encodeURIComponent(username)}`;

  useEffect(() => {
    setLoaded(false);
    setError(false);
  }, [username]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl overflow-hidden"
      style={{ background: t.card, border: `1px solid ${t.border}` }}
    >
      {/* Panel header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: `1px solid ${t.border}` }}
      >
        <div className="flex items-center gap-2.5">
          <Activity size={14} style={{ color: t.accent }} />
          <span className="text-[13px] font-medium" style={{ color: t.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>
            Contribution Graph
          </span>
          <span
            className="text-[10px] px-2 py-0.5 rounded font-medium tracking-wide"
            style={{ background: t.accentSoft, color: t.accent, fontFamily: "'DM Mono', monospace", border: `1px solid ${t.accentBorder}` }}
          >
            @{username}
          </span>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] transition-colors"
          style={{ color: t.textMuted, background: t.mutedBtn, fontFamily: "'DM Mono', monospace" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = t.mutedBtnHov)}
          onMouseLeave={(e) => (e.currentTarget.style.background = t.mutedBtn)}
        >
          <RefreshCw size={11} />
          Change
        </button>
      </div>

      {/* Graph embed */}
      <div className="px-5 py-5 overflow-x-auto">
        {!loaded && !error && (
          <div className="flex items-center justify-center h-29">
            <div className="flex gap-1.5 items-center" style={{ color: t.textFaint }}>
              <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: t.accent, animationDelay: "0ms" }} />
              <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: t.accent, animationDelay: "120ms" }} />
              <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: t.accent, animationDelay: "240ms" }} />
            </div>
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center h-29">
            <p className="text-[12px]" style={{ color: t.danger, fontFamily: "'DM Mono', monospace" }}>
              Could not load graph for @{username}. Check the username and try again.
            </p>
          </div>
        )}
        {/* The ghchart SVG is natively ~722×112px (53 weeks × 7 days at ~13px/cell + labels).
            We pin height to 116px and let width scale naturally — same density as the
            custom contribution graph (CELL=13, GAP=3) used on the main dashboard. */}
        <img
          src={graphUrl}
          alt={`${username} GitHub contributions`}
          style={{
            display: loaded ? "block" : "none",
            height: "116px",
            width: "auto",
            maxWidth: "100%",
            minWidth: "600px",
            borderRadius: "6px",
            filter: t.isDark
              ? "invert(1) hue-rotate(200deg) saturate(0.9) brightness(0.85)"
              : "saturate(0.7) brightness(1.05)",
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.3s",
          }}
          onLoad={() => setLoaded(true)}
          onError={() => { setLoaded(false); setError(true); }}
        />
      </div>

      {/* Footer note */}
      <div className="px-5 pb-4">
        <p className="text-[11px]" style={{ color: t.textFaint, fontFamily: "'DM Sans', sans-serif" }}>
          Data sourced from GitHub's public contribution graph · Updates every 24 h
        </p>
      </div>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function DevDashboard() {
  const t = useTokens();
  const [githubUsername, setGithubUsername] = useState<string>(
    () => localStorage.getItem(GH_USERNAME_KEY) ?? ""
  );

  function handleUsernameSubmit(username: string) {
    setGithubUsername(username);
    localStorage.setItem(GH_USERNAME_KEY, username);
  }

  function handleReset() {
    setGithubUsername("");
    localStorage.removeItem(GH_USERNAME_KEY);
  }

const stagger = (i: number) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.3,
    delay: i * 0.07,
    ease: [0.16, 1, 0.3, 1] as const,
  },
});
  return (
    <div
      className="min-h-screen p-4 md:p-6 lg:p-8 transition-colors duration-300"
      style={{ background: t.page, fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <motion.div {...stagger(0)} className="mb-8 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: t.accentSoft, border: `1px solid ${t.accentBorder}` }}
            >
              <Terminal size={15} style={{ color: t.accent }} />
            </div>
            <span
              className="text-[10px] font-medium tracking-widest uppercase px-2.5 py-1 rounded"
              style={{ background: t.accentSoft, color: t.accent, fontFamily: "'DM Mono', monospace", border: `1px solid ${t.accentBorder}` }}
            >
              Developer Mode
            </span>
          </div>
          <h1
            className="text-[22px] font-semibold tracking-tight mb-1"
            style={{ color: t.textPrimary, letterSpacing: "-0.02em" }}
          >
            Dev Dashboard
          </h1>
          <p className="text-[13px]" style={{ color: t.textMuted, fontFamily: "'DM Mono', monospace" }}>
            Coding activity, GitHub stats &amp; builder tools.
          </p>
        </div>
      </motion.div>

      {/* ── Stats row ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { icon: <Flame size={15} />,     label: "Streak",       value: "14d",    sub: "Current coding streak",      accent: "#f97316" },
          { icon: <GitCommit size={15} />, label: "Commits",      value: "348",    sub: "This year",                  accent: t.accent },
          { icon: <Code2 size={15} />,     label: "Languages",    value: "7",      sub: "Active in last 30 days",     accent: t.violet },
          { icon: <Activity size={15} />,  label: "Contributions",value: "1,204",  sub: "Total on GitHub",            accent: "#4ade80" },
        ].map((stat, i) => (
          <motion.div key={stat.label} {...stagger(i + 1)}>
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* ── Contribution graph / connect form ───────────────────────────── */}
      <motion.div {...stagger(5)}>
        {githubUsername ? (
          <ContributionGraph username={githubUsername} onReset={handleReset} />
        ) : (
          <GithubConnectForm onSubmit={handleUsernameSubmit} />
        )}
      </motion.div>

      {/* ── Coming soon strip ────────────────────────────────────────────── */}
      <motion.div {...stagger(6)} className="mt-4">
        <div
          className="rounded-2xl px-5 py-4 flex items-center gap-3"
          style={{ background: t.card, border: `1px solid ${t.border}` }}
        >
          <span style={{ color: t.textFaint }}><Code2 size={14} /></span>
          <p className="text-[12px]" style={{ color: t.textFaint, fontFamily: "'DM Mono', monospace" }}>
            More builder tools — quest integrations, PR tracking, code reviews — coming soon.
          </p>
        </div>
      </motion.div>
    </div>
  );
}