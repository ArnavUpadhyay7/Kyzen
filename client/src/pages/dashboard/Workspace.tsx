import { useState, useMemo } from "react";

// ─── Design tokens (match Kyzen dark aesthetic) ───────────────────────────────
const C = {
  bg: "#080c1a",
  surface: "rgba(10,14,30,0.9)",
  surfaceHover: "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.08)",
  borderHover: "rgba(255,255,255,0.15)",
  text: "#fff",
  muted: "rgba(255,255,255,0.45)",
  faint: "rgba(255,255,255,0.25)",
  accent: "#a78bfa",
  accentDim: "rgba(167,139,250,0.15)",
  accentBorder: "rgba(167,139,250,0.3)",
  green: "#34d399",
  greenDim: "rgba(52,211,153,0.12)",
  amber: "#fbbf24",
  amberDim: "rgba(251,191,36,0.12)",
  red: "#f87171",
  redDim: "rgba(248,113,113,0.12)",
  blue: "#7dd3fc",
  blueDim: "rgba(125,211,252,0.12)",
  pink: "#f472b6",
  pinkDim: "rgba(244,114,182,0.12)",
};

// ─── Moods ────────────────────────────────────────────────────────────────────
const MOODS = [
  { value: "LOCKED_IN",  label: "Locked In",  emoji: "⚡", color: C.accent,  bg: C.accentDim },
  { value: "GOOD",       label: "Good",       emoji: "✦",  color: C.green,   bg: C.greenDim },
  { value: "TIRED",      label: "Tired",      emoji: "⚠",  color: C.amber,   bg: C.amberDim },
  { value: "BURNED_OUT", label: "Burned Out", emoji: "🔥", color: C.red,     bg: C.redDim },
  { value: "DISTRACTED", label: "Distracted", emoji: "〜", color: C.blue,    bg: C.blueDim },
];

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_LOGS = [
  {
    id: "1",
    date: new Date(Date.now() - 86400000 * 0).toISOString(),
    mood: "LOCKED_IN",
    completed: "Finished auth flow + JWT refresh endpoint",
    win: "First recruiter response from Google",
    learned: "JWT sliding expiry, httpOnly cookie pattern",
    bug: "CORS on /refresh → wrong origin whitelist → fixed env var",
    tomorrow: "Build dashboard skeleton + connect API",
    xp: 180,
    level: 5,
  },
  {
    id: "2",
    date: new Date(Date.now() - 86400000 * 1).toISOString(),
    mood: "GOOD",
    completed: "Solved 5 LeetCode + applied to 8 jobs",
    win: "Solved Hard LC problem in 18 mins",
    learned: "Monotonic stack trick for next greater element",
    bug: "",
    tomorrow: "Finish auth flow",
    xp: 140,
    level: 5,
  },
  {
    id: "3",
    date: new Date(Date.now() - 86400000 * 3).toISOString(),
    mood: "TIRED",
    completed: "Set up project structure, wrote README",
    win: "Got Vercel deployment working",
    learned: "Vercel env vars + monorepo config",
    bug: "Build failing on CI → missing NODE_ENV → added to .env.example",
    tomorrow: "Start backend auth",
    xp: 100,
    level: 4,
  },
];

const MOCK_IDEAS = [
  {
    id: "1", title: "AI Resume Reviewer", category: "Startup",
    problem: "Students get rejected without feedback on their resumes",
    tags: ["AI", "Startup", "Portfolio"], color: C.accent,
    createdAt: "2 days ago",
  },
  {
    id: "2", title: "DSA Visualizer 3D", category: "Project",
    problem: "Existing visualizers are 2D and boring — no spatial intuition",
    tags: ["WebGL", "Education", "OSS"], color: C.green,
    createdAt: "5 days ago",
  },
  {
    id: "3", title: "Dev Buddy — Pair Programming Discord Bot", category: "Tool",
    problem: "Hard to find accountability partners for coding sessions",
    tags: ["Discord", "Community", "Bot"], color: C.blue,
    createdAt: "1 week ago",
  },
  {
    id: "4", title: "Leetcode Habit Tracker CLI", category: "Tool",
    problem: "No clean terminal tool for tracking DSA grind progress",
    tags: ["CLI", "Go", "OSS"], color: C.amber,
    createdAt: "2 weeks ago",
  },
];

const MOCK_PROJECTS = [
  {
    id: "1", name: "Elevate", description: "Full-stack developer portfolio with AI case study generator",
    why: "Stand out in job applications with a dynamic portfolio", mvp: ["Homepage", "Projects page", "AI case study gen", "Resume download"],
    stretch: ["Blog section", "Analytics dashboard"], tech: ["Next.js", "TailwindCSS", "OpenAI API", "Supabase"],
    status: "Building", progress: 60, color: C.accent,
  },
  {
    id: "2", name: "AuthKit", description: "Plug-and-play authentication library for Express apps",
    why: "Tired of rewriting auth boilerplate for every project", mvp: ["JWT auth", "Refresh tokens", "OAuth2 Google", "NPM package"],
    stretch: ["Passkeys", "Admin dashboard"], tech: ["Node.js", "TypeScript", "Prisma", "Redis"],
    status: "Planning", progress: 20, color: C.green,
  },
  {
    id: "3", name: "Kyzen", description: "RPG productivity app for developers tracking their coding journey",
    why: "Make the job hunt and learning grind feel like a game", mvp: ["XP system", "Quest board", "Battle log", "Streak tracking"],
    stretch: ["Multiplayer", "Leaderboards", "Discord bot"], tech: ["React", "Vite", "Supabase", "TailwindCSS"],
    status: "Shipping", progress: 85, color: C.amber,
  },
];

const MOCK_INSPO = [
  { id: "1", type: "UI", title: "Linear's command palette", url: "linear.app", preview: "bg1", tag: "Dark UI", color: C.accent },
  { id: "2", type: "Repo", title: "shadcn/ui", url: "github.com/shadcn-ui/ui", preview: "bg2", tag: "Components", color: C.blue },
  { id: "3", type: "Design", title: "Vercel Dashboard redesign", url: "vercel.com", preview: "bg3", tag: "SaaS UI", color: C.green },
  { id: "4", type: "Concept", title: "Arc browser sidebar UX", url: "arc.net", preview: "bg4", tag: "Navigation", color: C.pink },
  { id: "5", type: "Repo", title: "tRPC type-safe APIs", url: "github.com/trpc/trpc", preview: "bg5", tag: "DX", color: C.amber },
  { id: "6", type: "UI", title: "Raycast extension UI", url: "raycast.com", preview: "bg6", tag: "Dark UI", color: C.red },
];

const MOCK_NOTES = [
  {
    id: "1", category: "DSA", title: "Sliding Window Template",
    content: `function slidingWindow(arr, k) {\n  let left = 0, sum = 0, max = 0;\n  for (let right = 0; right < arr.length; right++) {\n    sum += arr[right];\n    if (right - left + 1 > k) sum -= arr[left++];\n    max = Math.max(max, sum);\n  }\n  return max;\n}`,
    tags: ["Arrays", "Template"], color: C.accent, isCode: true,
  },
  {
    id: "2", category: "Command", title: "Git stash workflow",
    content: `git stash push -m "wip: feature"\ngit stash list\ngit stash pop stash@{0}\ngit stash drop stash@{0}`,
    tags: ["Git", "CLI"], color: C.blue, isCode: true,
  },
  {
    id: "3", category: "Interview", title: "System Design: URL Shortener",
    content: "1. Clarify scale (reads vs writes)\n2. Hash function: base62 encoding, 7 chars = 62^7 combos\n3. DB: NoSQL (DynamoDB) for fast reads\n4. Cache: Redis with LRU for top 20% URLs\n5. Load balancer → App servers → Cache → DB",
    tags: ["System Design", "Interview"], color: C.green, isCode: false,
  },
  {
    id: "4", category: "Learning", title: "JWT Refresh Token Pattern",
    content: "Access token: 15min expiry, stored in memory\nRefresh token: 7d expiry, httpOnly cookie\nOn 401: auto-call /refresh, get new access token\nRotate refresh tokens on each use (prevents reuse)\nStore token hash in DB to allow revocation",
    tags: ["Auth", "Backend"], color: C.amber, isCode: false,
  },
  {
    id: "5", category: "DSA", title: "Two Pointer — Opposite Ends",
    content: `// Use when: sorted array, looking for pair/triplet\nfunction twoSum(arr, target) {\n  let left = 0, right = arr.length - 1;\n  while (left < right) {\n    const sum = arr[left] + arr[right];\n    if (sum === target) return [left, right];\n    else if (sum < target) left++;\n    else right--;\n  }\n  return [];\n}`,
    tags: ["Arrays", "Template"], color: C.pink, isCode: true,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(iso) {
  const d = new Date(iso);
  const today = new Date();
  const diff = Math.floor((today - d) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ─── Shared primitives ────────────────────────────────────────────────────────
function Pill({ label, color, small }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: small ? "1px 7px" : "2px 9px",
      borderRadius: 99,
      background: color + "18",
      color,
      border: `1px solid ${color}33`,
      fontSize: small ? 9 : 10,
      fontFamily: "'DM Mono',monospace",
      fontWeight: 600,
      letterSpacing: "0.06em",
      whiteSpace: "nowrap",
    }}>
      {label}
    </span>
  );
}

function GlassCard({ children, style, glow, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.surface,
        border: `1px solid ${hovered ? C.borderHover : C.border}`,
        borderRadius: 16,
        overflow: "hidden",
        position: "relative",
        transition: "all 0.2s",
        boxShadow: hovered && glow ? `0 0 20px ${glow}` : "none",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function ProgressBar({ value, color, height = 5 }) {
  return (
    <div style={{ height, borderRadius: 99, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
      <div style={{
        height: "100%", width: `${value}%`,
        background: color,
        borderRadius: 99,
        transition: "width 0.6s cubic-bezier(0.22,1,0.36,1)",
        opacity: 0.85,
      }} />
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    "Shipping": { color: C.green, label: "Shipping" },
    "Building": { color: C.accent, label: "Building" },
    "Planning": { color: C.amber, label: "Planning" },
    "Paused":   { color: C.muted, label: "Paused" },
  };
  const s = map[status] || map["Planning"];
  return <Pill label={s.label} color={s.color} />;
}

function SectionHeader({ title, count, action, onAction }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, margin: 0, fontFamily: "'DM Sans',sans-serif" }}>{title}</h2>
        {count != null && (
          <span style={{
            fontSize: 11, fontFamily: "'DM Mono',monospace",
            background: C.accentDim, color: C.accent,
            border: `1px solid ${C.accentBorder}`,
            padding: "1px 8px", borderRadius: 99,
          }}>{count}</span>
        )}
      </div>
      {action && (
        <button onClick={onAction} style={{
          display: "flex", alignItems: "center", gap: 5,
          padding: "5px 12px", borderRadius: 8,
          background: C.accentDim, color: C.accent,
          border: `1px solid ${C.accentBorder}`,
          fontSize: 11, fontFamily: "'DM Mono',monospace", fontWeight: 600,
          cursor: "pointer", letterSpacing: "0.04em",
        }}>
          + {action}
        </button>
      )}
    </div>
  );
}

function SearchBar({ value, onChange, placeholder }) {
  return (
    <div style={{ position: "relative", marginBottom: 16 }}>
      <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.faint, fontSize: 13 }}>⌕</span>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || "Search…"}
        style={{
          width: "100%", padding: "9px 12px 9px 34px",
          background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`,
          borderRadius: 10, color: C.text, fontSize: 13,
          fontFamily: "'DM Sans',sans-serif", outline: "none",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

// ─── Tab 1: Battle Log ────────────────────────────────────────────────────────
function LogEntry({ entry, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  const mood = MOODS.find(m => m.value === entry.mood) ?? MOODS[1];

  return (
    <GlassCard glow={mood.color + "30"} style={{ marginBottom: 10 }}>
      <div style={{ position: "absolute", left: 0, top: 12, bottom: 12, width: 2, borderRadius: 99, background: `linear-gradient(180deg, ${mood.color}80, ${mood.color}10)` }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${mood.color}35,transparent)` }} />

      <button onClick={() => setOpen(p => !p)} style={{
        width: "100%", display: "flex", alignItems: "center", gap: 12,
        padding: "13px 16px 13px 20px", background: "none", border: "none",
        color: C.text, cursor: "pointer", textAlign: "left",
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: mood.bg, border: `1px solid ${mood.color}33`, fontSize: 15,
        }}>
          {mood.emoji}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>
              {formatDate(entry.date)}
            </span>
            {/* change */}
            <Pill label={`Lv.${entry.level}`} color={C.accent} small={0} />
            <Pill label={mood.label} color={mood.color} small={0} />
          </div>
          {entry.completed && (
            <p style={{ fontSize: 11.5, color: C.muted, margin: "3px 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: "'DM Sans',sans-serif" }}>
              ⚔ {entry.completed}
            </p>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: C.accent, fontFamily: "'DM Mono',monospace" }}>+{entry.xp} XP</span>
          <span style={{ color: C.faint, fontSize: 11 }}>{open ? "▲" : "▼"}</span>
        </div>
      </button>

      {open && (
        <div style={{ borderTop: `1px solid ${C.border}`, padding: "14px 16px 16px 20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 20px" }}>
            {entry.completed && <LogField icon="⚔" label="Completed" value={entry.completed} color="#f97316" />}
            {entry.win && <LogField icon="🏆" label="Biggest Win" value={entry.win} color={C.amber} />}
            {entry.learned && <LogField icon="🧠" label="Learned" value={entry.learned} color={C.accent} />}
            {entry.bug && <LogField icon="🐛" label="Bug Defeated" value={entry.bug} color={C.red} />}
            {entry.tomorrow && <LogField icon="🔮" label="Tomorrow's Focus" value={entry.tomorrow} color="#c4b5fd" />}
          </div>
          <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
            <div style={{ background: C.accentDim, border: `1px solid ${C.accentBorder}`, borderRadius: 99, padding: "3px 12px", fontSize: 12, fontWeight: 700, fontFamily: "'DM Mono',monospace", color: C.accent }}>
              +{entry.xp} XP
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  );
}

function LogField({ icon, label, value, color }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
        <span style={{ fontSize: 10 }}>{icon}</span>
        <span style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.08em", color: C.faint, fontFamily: "'DM Mono',monospace" }}>{label}</span>
      </div>
      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, margin: 0, fontFamily: "'DM Sans',sans-serif" }}>{value}</p>
    </div>
  );
}

function BattleLogTab() {
  const [logs, setLogs] = useState(MOCK_LOGS);
  const [form, setForm] = useState({ mood: "GOOD", completed: "", win: "", learned: "", bug: "", tomorrow: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const FIELDS = [
    { key: "completed", icon: "⚔", label: "Main thing completed today", placeholder: "Built auth flow · Solved 5 LC · Applied to 10 jobs…", rows: 2, accent: "#f97316" },
    { key: "win",       icon: "🏆", label: "Biggest win", placeholder: "First recruiter reply · Solved a Hard · Deployed feature…", rows: 1, accent: C.amber },
    { key: "learned",   icon: "🧠", label: "What did you learn?", placeholder: "New concept, pattern, debugging trick…", rows: 2, accent: C.accent },
    { key: "bug",       icon: "🐛", label: "Bug / enemy defeated", placeholder: "Problem → Cause → Fix", rows: 2, accent: C.red },
    { key: "tomorrow",  icon: "🔮", label: "Tomorrow's focus", placeholder: "The single most important thing to do tomorrow…", rows: 1, accent: "#c4b5fd" },
  ];

  const hasContent = FIELDS.some(f => String(form[f.key] || "").trim());
  const xp = [form.completed, form.win, form.learned, form.bug, form.tomorrow].reduce((s, v) => s + (v?.trim() ? 25 : 0), 0);

  function handleSave() {
    if (!hasContent) return;
    setSaving(true);
    setTimeout(() => {
      setLogs(prev => [{
        id: String(Date.now()), date: new Date().toISOString(), level: 5, xp, ...form,
      }, ...prev]);
      setForm({ mood: "GOOD", completed: "", win: "", learned: "", bug: "", tomorrow: "" });
      setSaving(false); setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }, 700);
  }

  return (
    <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
      {/* Form */}
      <div style={{ flex: "0 0 360px", minWidth: 0, position: "sticky", top: 0 }}>
        <GlassCard style={{ overflow: "visible" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,rgba(124,58,237,0.6),transparent)` }} />
          <div style={{ padding: "14px 18px 12px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 7, height: 7, borderRadius: 99, background: C.accent, boxShadow: `0 0 8px ${C.accent}` }} />
              <span style={{ fontSize: 13, fontWeight: 700 }}>Log Today's Battle</span>
            </div>
            {xp > 0 && <span style={{ fontSize: 12, fontWeight: 700, color: C.accent, fontFamily: "'DM Mono',monospace" }}>+{xp} XP</span>}
          </div>
          <div style={{ padding: "14px 18px 18px", display: "flex", flexDirection: "column", gap: 12, maxHeight: "75vh", overflowY: "auto" }}>
            {/* Mood */}
            <div>
              <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.09em", color: C.faint, fontFamily: "'DM Mono',monospace", margin: "0 0 8px" }}>⚔ Battle Status</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {MOODS.map(m => (
                  <button key={m.value} onClick={() => setForm(p => ({ ...p, mood: m.value }))} style={{
                    display: "flex", alignItems: "center", gap: 5, padding: "6px 11px", borderRadius: 8,
                    background: form.mood === m.value ? m.bg : "rgba(255,255,255,0.03)",
                    color: form.mood === m.value ? m.color : C.faint,
                    border: `1px solid ${form.mood === m.value ? m.color + "44" : C.border}`,
                    fontSize: 11, fontFamily: "'DM Mono',monospace", fontWeight: 500, cursor: "pointer",
                    transform: form.mood === m.value ? "scale(1.03)" : "scale(1)", transition: "all 0.15s",
                  }}>
                    <span>{m.emoji}</span>{m.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ height: 1, background: C.border }} />
            {FIELDS.map(f => <LogFormField key={f.key} {...f} value={form[f.key] || ""} onChange={v => setForm(p => ({ ...p, [f.key]: v }))} />)}
            <button onClick={handleSave} disabled={!hasContent || saving} style={{
              width: "100%", padding: "12px", borderRadius: 12, fontSize: 13, fontWeight: 700,
              fontFamily: "'DM Mono',monospace", cursor: hasContent ? "pointer" : "not-allowed",
              opacity: hasContent ? 1 : 0.4,
              background: hasContent ? "linear-gradient(135deg,#7c3aed,#9333ea,#a855f7)" : "rgba(255,255,255,0.05)",
              color: hasContent ? "#fff" : C.muted, border: "none",
              boxShadow: hasContent ? "0 0 28px rgba(124,58,237,0.35)" : "none",
              letterSpacing: "0.04em", transition: "all 0.2s",
            }}>
              {saving ? "⚡ Logging…" : saved ? "✔ Logged!" : "⚔ Log Battle"}
            </button>
          </div>
        </GlassCard>
      </div>

      {/* Log history */}
      <div style={{ flex: 1, minWidth: 280 }}>
        <SectionHeader title="Battle History" count={logs.length} />
        {logs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: C.muted, fontSize: 13 }}>No entries yet. Log your first battle!</div>
        ) : (
          logs.map((e, i) => <LogEntry key={e.id} entry={e} defaultOpen={i === 0} />)
        )}
      </div>
    </div>
  );
}

function LogFormField({ icon, label, placeholder, value, onChange, rows, accent }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 12 }}>{icon}</span>
        <label style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.09em", color: focused ? accent : C.faint, fontFamily: "'DM Mono',monospace", fontWeight: 600, transition: "color 0.2s" }}>{label}</label>
      </div>
      <textarea rows={rows} value={value} onChange={e => onChange(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} placeholder={placeholder}
        style={{
          resize: "none", borderRadius: 10, padding: "9px 12px", fontSize: 12.5, outline: "none", lineHeight: 1.65,
          background: focused ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.03)",
          border: `1px solid ${focused ? accent + "55" : C.border}`,
          color: C.text, fontFamily: "'DM Sans',sans-serif",
          boxShadow: focused ? `0 0 0 3px ${accent}14` : "none", transition: "all 0.2s",
        }}
      />
    </div>
  );
}

// ─── Tab 2: Idea Vault ────────────────────────────────────────────────────────
function IdeaVaultTab() {
  const [ideas, setIdeas] = useState(MOCK_IDEAS);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: "", category: "Project", problem: "", tags: "" });
  const [showForm, setShowForm] = useState(false);

  const CATS = ["Project", "Startup", "Tool", "Experiment"];
  const CAT_COLORS = { Project: C.accent, Startup: C.green, Tool: C.blue, Experiment: C.pink };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return ideas.filter(i => i.title.toLowerCase().includes(q) || i.tags.some(t => t.toLowerCase().includes(q)) || i.category.toLowerCase().includes(q));
  }, [ideas, search]);

  function handleSave() {
    if (!form.title.trim()) return;
    const tags = form.tags.split(",").map(t => t.trim()).filter(Boolean);
    if (editing) {
      setIdeas(prev => prev.map(i => i.id === editing ? { ...i, ...form, tags } : i));
      setEditing(null);
    } else {
      setIdeas(prev => [{ id: String(Date.now()), ...form, tags, color: CAT_COLORS[form.category] || C.accent, createdAt: "just now" }, ...prev]);
    }
    setForm({ title: "", category: "Project", problem: "", tags: "" }); setShowForm(false);
  }

  function startEdit(idea) {
    setEditing(idea.id); setForm({ title: idea.title, category: idea.category, problem: idea.problem, tags: idea.tags.join(", ") });
    setShowForm(true);
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search ideas, tags, categories…" />
        </div>
        <button onClick={() => { setEditing(null); setForm({ title: "", category: "Project", problem: "", tags: "" }); setShowForm(p => !p); }} style={{
          display: "flex", alignItems: "center", gap: 5, padding: "9px 14px", borderRadius: 10,
          background: C.accentDim, color: C.accent, border: `1px solid ${C.accentBorder}`,
          fontSize: 12, fontFamily: "'DM Mono',monospace", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
        }}>
          + New Idea
        </button>
      </div>

      {showForm && (
        <GlassCard style={{ marginBottom: 18, padding: "16px 18px" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${C.accent}55,transparent)` }} />
          <h3 style={{ fontSize: 13, fontWeight: 700, margin: "0 0 12px", fontFamily: "'DM Sans',sans-serif" }}>{editing ? "Edit Idea" : "New Idea"}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <IdeaInput label="Title" value={form.title} onChange={v => setForm(p => ({ ...p, title: v }))} placeholder="Your brilliant idea" />
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <label style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: C.faint, fontFamily: "'DM Mono',monospace" }}>Category</label>
              <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} style={{ padding: "8px 10px", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: `1px solid ${C.border}`, color: C.text, fontSize: 12, fontFamily: "'DM Sans',sans-serif", outline: "none" }}>
                {CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginTop: 10 }}>
            <IdeaTextarea label="Problem it solves" value={form.problem} onChange={v => setForm(p => ({ ...p, problem: v }))} placeholder="What problem does this solve?" />
          </div>
          <div style={{ marginTop: 10 }}>
            <IdeaInput label="Tags (comma-separated)" value={form.tags} onChange={v => setForm(p => ({ ...p, tags: v }))} placeholder="AI, Startup, CLI" />
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button onClick={handleSave} style={{ padding: "8px 18px", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#a855f7)", color: "#fff", border: "none", fontSize: 12, fontFamily: "'DM Mono',monospace", fontWeight: 600, cursor: "pointer" }}>Save Idea</button>
            <button onClick={() => { setShowForm(false); setEditing(null); }} style={{ padding: "8px 14px", borderRadius: 8, background: "transparent", color: C.muted, border: `1px solid ${C.border}`, fontSize: 12, fontFamily: "'DM Mono',monospace", cursor: "pointer" }}>Cancel</button>
          </div>
        </GlassCard>
      )}

      {filtered.length === 0 && <div style={{ textAlign: "center", padding: "40px 20px", color: C.muted, fontSize: 13 }}>No ideas found.</div>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
        {filtered.map(idea => (
          <GlassCard key={idea.id} glow={idea.color + "25"} style={{ padding: "16px 18px" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${idea.color}40,transparent)` }} />
            <div style={{ position: "absolute", left: 0, top: 14, bottom: 14, width: 2, borderRadius: 99, background: `${idea.color}60` }} />
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
              <div>
                <Pill label={idea.category} color={idea.color} small />
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => startEdit(idea)} style={{ padding: "3px 8px", borderRadius: 6, background: C.accentDim, border: `1px solid ${C.accentBorder}`, color: C.accent, fontSize: 10, fontFamily: "'DM Mono',monospace", cursor: "pointer" }}>Edit</button>
                <button onClick={() => setIdeas(p => p.filter(i => i.id !== idea.id))} style={{ padding: "3px 8px", borderRadius: 6, background: C.redDim, border: "1px solid rgba(248,113,113,0.2)", color: C.red, fontSize: 10, fontFamily: "'DM Mono',monospace", cursor: "pointer" }}>Del</button>
              </div>
            </div>
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 6px", fontFamily: "'DM Sans',sans-serif", color: idea.color }}>{idea.title}</h3>
            {idea.problem && <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.6, margin: "0 0 10px", fontFamily: "'DM Sans',sans-serif" }}>{idea.problem}</p>}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 8 }}>
              {idea.tags.map(t => <Pill key={t} label={t} color={idea.color} small />)}
            </div>
            <p style={{ fontSize: 10, color: C.faint, fontFamily: "'DM Mono',monospace", margin: 0 }}>🕐 {idea.createdAt}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

function IdeaInput({ label, value, onChange, placeholder }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: C.faint, fontFamily: "'DM Mono',monospace" }}>{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ padding: "8px 10px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`, color: C.text, fontSize: 12, fontFamily: "'DM Sans',sans-serif", outline: "none" }} />
    </div>
  );
}

function IdeaTextarea({ label, value, onChange, placeholder }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: C.faint, fontFamily: "'DM Mono',monospace" }}>{label}</label>
      <textarea rows={2} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ resize: "none", padding: "8px 10px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`, color: C.text, fontSize: 12, fontFamily: "'DM Sans',sans-serif", outline: "none", lineHeight: 1.6 }} />
    </div>
  );
}

// ─── Tab 3: Project Planner ───────────────────────────────────────────────────
function ProjectPlannerTab() {
  const [projects, setProjects] = useState(MOCK_PROJECTS);
  const [selected, setSelected] = useState(MOCK_PROJECTS[0]);

  const STATUS_COLORS = { Shipping: C.green, Building: C.accent, Planning: C.amber, Paused: C.muted };

  return (
    <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
      {/* Project list */}
      <div style={{ flex: "0 0 280px", minWidth: 0 }}>
        <SectionHeader title="Projects" count={projects.length} />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {projects.map(p => (
            <GlassCard key={p.id} onClick={() => setSelected(p)} glow={p.color + "25"} style={{
              padding: "14px 16px", cursor: "pointer",
              borderColor: selected?.id === p.id ? p.color + "55" : C.border,
              boxShadow: selected?.id === p.id ? `0 0 16px ${p.color}20` : "none",
            }}>
              <div style={{ position: "absolute", left: 0, top: 10, bottom: 10, width: 2, borderRadius: 99, background: selected?.id === p.id ? p.color : "transparent", transition: "background 0.2s" }} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans',sans-serif", color: selected?.id === p.id ? p.color : C.text }}>{p.name}</span>
                <StatusBadge status={p.status} />
              </div>
              <p style={{ fontSize: 11.5, color: C.muted, margin: "0 0 8px", lineHeight: 1.5, fontFamily: "'DM Sans',sans-serif" }}>{p.description}</p>
              <ProgressBar value={p.progress} color={p.color} />
              <p style={{ fontSize: 10, color: C.faint, margin: "5px 0 0", fontFamily: "'DM Mono',monospace" }}>{p.progress}% complete</p>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Project detail */}
      {selected && (
        <div style={{ flex: 1, minWidth: 280 }}>
          <GlassCard style={{ padding: "20px 22px" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${selected.color}50,transparent)` }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: selected.color, fontFamily: "'DM Sans',sans-serif" }}>{selected.name}</h2>
                  <StatusBadge status={selected.status} />
                </div>
                <p style={{ fontSize: 13, color: C.muted, margin: 0, fontFamily: "'DM Sans',sans-serif" }}>{selected.description}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: selected.color, fontFamily: "'DM Mono',monospace", lineHeight: 1 }}>{selected.progress}%</div>
                <div style={{ fontSize: 10, color: C.faint, fontFamily: "'DM Mono',monospace", marginTop: 2 }}>PROGRESS</div>
              </div>
            </div>
            <ProgressBar value={selected.progress} color={selected.color} height={7} />

            <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <ProjectSection icon="❓" label="Why Build This?" color={selected.color}>
                <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.7)", lineHeight: 1.65, margin: 0, fontFamily: "'DM Sans',sans-serif" }}>{selected.why}</p>
              </ProjectSection>
              <ProjectSection icon="🛠" label="Tech Stack" color={selected.color}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {selected.tech.map(t => <Pill key={t} label={t} color={selected.color} small />)}
                </div>
              </ProjectSection>
              <ProjectSection icon="🎯" label="MVP Features" color={C.green}>
                <ul style={{ margin: 0, paddingLeft: 14 }}>
                  {selected.mvp.map((f, i) => (
                    <li key={i} style={{ fontSize: 12.5, color: "rgba(255,255,255,0.7)", lineHeight: 1.8, fontFamily: "'DM Sans',sans-serif" }}>{f}</li>
                  ))}
                </ul>
              </ProjectSection>
              <ProjectSection icon="✨" label="Stretch Goals" color={C.amber}>
                <ul style={{ margin: 0, paddingLeft: 14 }}>
                  {selected.stretch.map((f, i) => (
                    <li key={i} style={{ fontSize: 12.5, color: "rgba(255,255,255,0.7)", lineHeight: 1.8, fontFamily: "'DM Sans',sans-serif" }}>{f}</li>
                  ))}
                </ul>
              </ProjectSection>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}

function ProjectSection({ icon, label, color, children }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 14px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <span style={{ fontSize: 12 }}>{icon}</span>
        <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: color + "bb", fontFamily: "'DM Mono',monospace", fontWeight: 600 }}>{label}</span>
      </div>
      {children}
    </div>
  );
}

// ─── Tab 4: Inspiration Board ─────────────────────────────────────────────────
const INSPO_GRADIENTS = [
  "linear-gradient(135deg,#1a0533 0%,#2d1b69 50%,#1a3a2a 100%)",
  "linear-gradient(135deg,#0a1628 0%,#1e3a5f 50%,#0d2137 100%)",
  "linear-gradient(135deg,#0f1923 0%,#1a3a4a 50%,#0a2a1a 100%)",
  "linear-gradient(135deg,#1a0a28 0%,#3d1d5c 50%,#1a0f28 100%)",
  "linear-gradient(135deg,#1a1a0a 0%,#3a3205 50%,#1a1a0a 100%)",
  "linear-gradient(135deg,#1a0a0a 0%,#3a0d0d 50%,#1a0808 100%)",
];

function InspirationTab() {
  const [inspo, setInspo] = useState(MOCK_INSPO);
  const [filter, setFilter] = useState("All");
  const TYPES = ["All", "UI", "Repo", "Design", "Concept"];

  const filtered = filter === "All" ? inspo : inspo.filter(i => i.type === filter);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {TYPES.map(t => (
            <button key={t} onClick={() => setFilter(t)} style={{
              padding: "5px 12px", borderRadius: 8, fontSize: 11, fontFamily: "'DM Mono',monospace", fontWeight: 600, cursor: "pointer",
              background: filter === t ? C.accentDim : "rgba(255,255,255,0.03)",
              color: filter === t ? C.accent : C.muted,
              border: `1px solid ${filter === t ? C.accentBorder : C.border}`,
              transition: "all 0.15s",
            }}>{t}</button>
          ))}
        </div>
        <button style={{
          padding: "7px 14px", borderRadius: 8, background: C.accentDim, color: C.accent,
          border: `1px solid ${C.accentBorder}`, fontSize: 11, fontFamily: "'DM Mono',monospace", fontWeight: 600, cursor: "pointer",
        }}>+ Add Inspiration</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
        {filtered.map((item, idx) => (
          <GlassCard key={item.id} glow={item.color + "30"} style={{ overflow: "hidden" }}>
            {/* Preview area */}
            <div style={{
              height: 130, background: INSPO_GRADIENTS[idx % INSPO_GRADIENTS.length],
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 40% 50%, ${item.color}20 0%, transparent 70%)` }} />
              {/* Decorative abstract shapes */}
              <div style={{ width: 60, height: 60, borderRadius: 12, background: item.color + "25", border: `1px solid ${item.color}40`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                <span style={{ fontSize: 22 }}>
                  {item.type === "UI" ? "🎨" : item.type === "Repo" ? "⚙" : item.type === "Design" ? "✦" : "💭"}
                </span>
              </div>
              <div style={{ position: "absolute", top: 8, right: 8 }}>
                <Pill label={item.type} color={item.color} small />
              </div>
            </div>

            <div style={{ padding: "12px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, margin: 0, fontFamily: "'DM Sans',sans-serif" }}>{item.title}</h3>
                <button onClick={() => setInspo(p => p.filter(i => i.id !== item.id))} style={{ padding: "2px 7px", borderRadius: 6, background: "transparent", border: `1px solid ${C.border}`, color: C.faint, fontSize: 9, fontFamily: "'DM Mono',monospace", cursor: "pointer" }}>✕</button>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Pill label={item.tag} color={item.color} small />
                <a href={`https://${item.url}`} target="_blank" rel="noreferrer" style={{ fontSize: 10, color: C.faint, fontFamily: "'DM Mono',monospace", textDecoration: "none" }}>
                  {item.url} ↗
                </a>
              </div>
            </div>
          </GlassCard>
        ))}

        {/* Add card placeholder */}
        <div style={{
          height: 220, borderRadius: 16,
          border: `1px dashed ${C.border}`,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8,
          cursor: "pointer", color: C.faint, fontSize: 12, fontFamily: "'DM Sans',sans-serif",
          transition: "all 0.2s",
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = C.accentBorder; e.currentTarget.style.color = C.accent; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.faint; }}
        >
          <span style={{ fontSize: 24 }}>+</span>
          Add inspiration
        </div>
      </div>
    </div>
  );
}

// ─── Tab 5: Knowledge Vault ───────────────────────────────────────────────────
function KnowledgeVaultTab() {
  const [notes, setNotes] = useState(MOCK_NOTES);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [expanded, setExpanded] = useState("1");

  const CATS = ["All", "DSA", "Command", "Interview", "Learning"];

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return notes.filter(n => {
      const matchCat = categoryFilter === "All" || n.category === categoryFilter;
      const matchQ = !q || n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q) || n.tags.some(t => t.toLowerCase().includes(q));
      return matchCat && matchQ;
    });
  }, [notes, search, categoryFilter]);

  const CAT_COLORS = { DSA: C.accent, Command: C.blue, Interview: C.green, Learning: C.amber };

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search notes, commands, patterns…" />
        </div>
        <button style={{
          padding: "9px 14px", borderRadius: 10, background: C.accentDim, color: C.accent,
          border: `1px solid ${C.accentBorder}`, fontSize: 11, fontFamily: "'DM Mono',monospace", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
          alignSelf: "flex-start",
        }}>+ Add Note</button>
      </div>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
        {CATS.map(c => (
          <button key={c} onClick={() => setCategoryFilter(c)} style={{
            padding: "5px 12px", borderRadius: 8, fontSize: 11, fontFamily: "'DM Mono',monospace", fontWeight: 600, cursor: "pointer",
            background: categoryFilter === c ? (CAT_COLORS[c] || C.accent) + "20" : "rgba(255,255,255,0.03)",
            color: categoryFilter === c ? (CAT_COLORS[c] || C.accent) : C.muted,
            border: `1px solid ${categoryFilter === c ? (CAT_COLORS[c] || C.accent) + "44" : C.border}`,
            transition: "all 0.15s",
          }}>{c}</button>
        ))}
      </div>

      {filtered.length === 0 && <div style={{ textAlign: "center", padding: "40px 20px", color: C.muted, fontSize: 13 }}>No notes found.</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map(note => {
          const isOpen = expanded === note.id;
          const color = CAT_COLORS[note.category] || C.accent;
          return (
            <GlassCard key={note.id} glow={color + "20"}>
              <div style={{ position: "absolute", left: 0, top: 10, bottom: 10, width: 2, borderRadius: 99, background: color + "70" }} />
              <button onClick={() => setExpanded(isOpen ? null : note.id)} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "12px 16px 12px 18px", background: "none", border: "none", color: C.text, cursor: "pointer", textAlign: "left",
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>{note.title}</span>
                    <Pill label={note.category} color={color} small />
                    {note.isCode && <Pill label="Code" color={C.blue} small />}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    {note.tags.map(t => <Pill key={t} label={t} color={color} small />)}
                  </div>
                  <span style={{ color: C.faint, fontSize: 11 }}>{isOpen ? "▲" : "▼"}</span>
                </div>
              </button>
              {isOpen && (
                <div style={{ borderTop: `1px solid ${C.border}`, padding: "12px 16px 14px 18px" }}>
                  <pre style={{
                    fontSize: 12, lineHeight: 1.7, margin: 0,
                    color: note.isCode ? C.green : "rgba(255,255,255,0.75)",
                    fontFamily: note.isCode ? "'DM Mono',monospace" : "'DM Sans',sans-serif",
                    whiteSpace: "pre-wrap", wordBreak: "break-word",
                    background: note.isCode ? "rgba(52,211,153,0.04)" : "transparent",
                    borderRadius: note.isCode ? 8 : 0,
                    padding: note.isCode ? "10px 12px" : 0,
                    border: note.isCode ? `1px solid ${C.green}20` : "none",
                  }}>
                    {note.content}
                  </pre>
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
                    <button onClick={() => setNotes(p => p.filter(n => n.id !== note.id))} style={{ padding: "3px 10px", borderRadius: 6, background: C.redDim, border: "1px solid rgba(248,113,113,0.2)", color: C.red, fontSize: 10, fontFamily: "'DM Mono',monospace", cursor: "pointer" }}>Delete</button>
                  </div>
                </div>
              )}
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Workspace ───────────────────────────────────────────────────────────
const TABS = [
  { id: "battlelog",   icon: "📖", label: "Battle Log" },
  { id: "ideavault",   icon: "💡", label: "Idea Vault" },
  { id: "projects",    icon: "🗺", label: "Project Planner" },
  { id: "inspiration", icon: "🎨", label: "Inspiration" },
  { id: "knowledge",   icon: "🧠", label: "Knowledge Vault" },
];

export default function KyzenWorkspace() {
  const [activeTab, setActiveTab] = useState("battlelog");

  const tab = TABS.find(t => t.id === activeTab);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'DM Sans',sans-serif", color: C.text, padding: "24px 20px 60px" }}>
      {/* Ambient bg */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, background: "radial-gradient(ellipse 50% 35% at 15% 10%, rgba(124,58,237,0.06) 0%, transparent 60%), radial-gradient(ellipse 35% 25% at 85% 85%, rgba(52,211,153,0.04) 0%, transparent 60%)" }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto" }}>
        {/* Page header */}
        <div style={{ marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🧠</div>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, letterSpacing: "-0.02em", background: "linear-gradient(135deg,#fff 40%,rgba(167,139,250,0.8))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Workspace</h1>
              <p style={{ fontSize: 11, color: C.faint, margin: 0, fontFamily: "'DM Mono',monospace", letterSpacing: "0.04em" }}>Think · Plan · Remember</p>
            </div>
          </div>
          <p style={{ fontSize: 11, color: C.faint, fontFamily: "'DM Mono',monospace", margin: 0 }}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Tab nav */}
        <div style={{ marginBottom: 24, display: "flex", gap: 4, flexWrap: "wrap", background: "rgba(10,14,30,0.6)", border: `1px solid ${C.border}`, borderRadius: 14, padding: "5px 6px" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10,
              background: activeTab === t.id ? "rgba(167,139,250,0.15)" : "transparent",
              color: activeTab === t.id ? C.accent : C.faint,
              border: `1px solid ${activeTab === t.id ? C.accentBorder : "transparent"}`,
              fontSize: 12, fontFamily: "'DM Mono',monospace", fontWeight: 600,
              cursor: "pointer", transition: "all 0.15s",
              boxShadow: activeTab === t.id ? `0 0 10px rgba(167,139,250,0.12)` : "none",
            }}>
              <span>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div>
          {activeTab === "battlelog"   && <BattleLogTab />}
          {activeTab === "ideavault"   && <IdeaVaultTab />}
          {activeTab === "projects"    && <ProjectPlannerTab />}
          {activeTab === "inspiration" && <InspirationTab />}
          {activeTab === "knowledge"   && <KnowledgeVaultTab />}
        </div>
      </div>
    </div>
  );
}