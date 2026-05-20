import { useState, useMemo, useCallback } from "react";

const C = {
  bg: "#07091a",
  bgSecondary: "#0b0e24",
  surface: "rgba(255,255,255,0.035)",
  surfaceHover: "rgba(255,255,255,0.055)",
  surfaceActive: "rgba(255,255,255,0.07)",
  border: "rgba(255,255,255,0.07)",
  borderHover: "rgba(255,255,255,0.14)",
  borderAccent: "rgba(139,92,246,0.35)",
  text: "#e8e8f0",
  muted: "rgba(232,232,240,0.45)",
  faint: "rgba(232,232,240,0.22)",
  accent: "#8b5cf6",
  accentBright: "#a78bfa",
  accentDim: "rgba(139,92,246,0.12)",
  accentGlow: "rgba(139,92,246,0.2)",
  green: "#34d399",
  greenDim: "rgba(52,211,153,0.1)",
  amber: "#f59e0b",
  amberBright: "#fbbf24",
  amberDim: "rgba(245,158,11,0.1)",
  red: "#f87171",
  redDim: "rgba(248,113,113,0.1)",
  blue: "#60a5fa",
  blueDim: "rgba(96,165,250,0.1)",
  pink: "#f472b6",
  pinkDim: "rgba(244,114,182,0.1)",
  cyan: "#22d3ee",
  cyanDim: "rgba(34,211,238,0.1)",
};

const MOODS = [
  { value: "LOCKED_IN", label: "Locked In", emoji: "⚡", color: C.accentBright, bg: C.accentDim },
  { value: "GOOD", label: "Good", emoji: "✦", color: C.green, bg: C.greenDim },
  { value: "TIRED", label: "Tired", emoji: "◉", color: C.amber, bg: C.amberDim },
  { value: "BURNED_OUT", label: "Burned Out", emoji: "◈", color: C.red, bg: C.redDim },
  { value: "DISTRACTED", label: "Distracted", emoji: "〜", color: C.blue, bg: C.blueDim },
];

const MOCK_LOGS = [
  {
    id: "1",
    date: new Date(Date.now()).toISOString(),
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
    date: new Date(Date.now() - 86400000).toISOString(),
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
    tags: ["AI", "Startup", "Portfolio"], color: C.accentBright, createdAt: "2 days ago",
  },
  {
    id: "2", title: "DSA Visualizer 3D", category: "Project",
    problem: "Existing visualizers are 2D and boring — no spatial intuition",
    tags: ["WebGL", "Education", "OSS"], color: C.green, createdAt: "5 days ago",
  },
  {
    id: "3", title: "Dev Buddy — Pair Programming Discord Bot", category: "Tool",
    problem: "Hard to find accountability partners for coding sessions",
    tags: ["Discord", "Community", "Bot"], color: C.blue, createdAt: "1 week ago",
  },
  {
    id: "4", title: "Leetcode Habit Tracker CLI", category: "Tool",
    problem: "No clean terminal tool for tracking DSA grind progress",
    tags: ["CLI", "Go", "OSS"], color: C.amber, createdAt: "2 weeks ago",
  },
];

const MOCK_PROJECTS = [
  {
    id: "1", name: "Elevate", description: "Full-stack developer portfolio with AI case study generator",
    why: "Stand out in job applications with a dynamic portfolio",
    mvp: ["Homepage", "Projects page", "AI case study gen", "Resume download"],
    stretch: ["Blog section", "Analytics dashboard"],
    tech: ["Next.js", "TailwindCSS", "OpenAI API", "Supabase"],
    status: "Building", progress: 60, color: C.accentBright,
  },
  {
    id: "2", name: "AuthKit", description: "Plug-and-play authentication library for Express apps",
    why: "Tired of rewriting auth boilerplate for every project",
    mvp: ["JWT auth", "Refresh tokens", "OAuth2 Google", "NPM package"],
    stretch: ["Passkeys", "Admin dashboard"],
    tech: ["Node.js", "TypeScript", "Prisma", "Redis"],
    status: "Planning", progress: 20, color: C.green,
  },
  {
    id: "3", name: "Kyzen", description: "RPG productivity app for developers tracking their coding journey",
    why: "Make the job hunt and learning grind feel like a game",
    mvp: ["XP system", "Quest board", "Battle log", "Streak tracking"],
    stretch: ["Multiplayer", "Leaderboards", "Discord bot"],
    tech: ["React", "Vite", "Supabase", "TailwindCSS"],
    status: "Shipping", progress: 85, color: C.amber,
  },
];

const MOCK_INSPO = [
  { id: "1", type: "UI", title: "Linear's command palette", url: "linear.app", tag: "Dark UI", color: C.accentBright },
  { id: "2", type: "Repo", title: "shadcn/ui", url: "github.com/shadcn-ui/ui", tag: "Components", color: C.blue },
  { id: "3", type: "Design", title: "Vercel Dashboard redesign", url: "vercel.com", tag: "SaaS UI", color: C.green },
  { id: "4", type: "Concept", title: "Arc browser sidebar UX", url: "arc.net", tag: "Navigation", color: C.pink },
  { id: "5", type: "Repo", title: "tRPC type-safe APIs", url: "github.com/trpc/trpc", tag: "DX", color: C.amber },
  { id: "6", type: "UI", title: "Raycast extension UI", url: "raycast.com", tag: "Dark UI", color: C.red },
];

const MOCK_NOTES = [
  {
    id: "1", category: "DSA", title: "Sliding Window Template",
    content: `function slidingWindow(arr, k) {\n  let left = 0, sum = 0, max = 0;\n  for (let right = 0; right < arr.length; right++) {\n    sum += arr[right];\n    if (right - left + 1 > k) sum -= arr[left++];\n    max = Math.max(max, sum);\n  }\n  return max;\n}`,
    tags: ["Arrays", "Template"], color: C.accentBright, isCode: true,
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
    content: `function twoSum(arr, target) {\n  let left = 0, right = arr.length - 1;\n  while (left < right) {\n    const sum = arr[left] + arr[right];\n    if (sum === target) return [left, right];\n    else if (sum < target) left++;\n    else right--;\n  }\n  return [];\n}`,
    tags: ["Arrays", "Template"], color: C.pink, isCode: true,
  },
];

function formatDate(iso) {
  const d = new Date(iso);
  const today = new Date();
  const diff = Math.floor((today.getTime() - d.getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ─── Shared Primitives ────────────────────────────────────────────────────────

function Pill({ label, color, small }: { label: string; color: string; small?: boolean }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: small ? "2px 8px" : "3px 10px",
      borderRadius: 99,
      background: color + "18",
      color,
      border: `1px solid ${color}30`,
      fontSize: small ? 10 : 11,
      fontFamily: "monospace",
      fontWeight: 600,
      letterSpacing: "0.04em",
      whiteSpace: "nowrap",
    }}>
      {label}
    </span>
  );
}

function Card({ children, style = {}, glow, onClick }: { children: React.ReactNode; style?: React.CSSProperties; glow?: string; onClick?: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov && onClick ? C.surfaceHover : C.surface,
        border: `1px solid ${hov ? C.borderHover : C.border}`,
        borderRadius: 14,
        position: "relative",
        overflow: "hidden",
        transition: "all 0.18s ease",
        boxShadow: hov && glow ? `0 4px 32px ${glow}` : "none",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function ProgressBar({ value, color, height = 4 }: { value: number; color: string; height?: number }) {
  return (
    <div style={{ height, borderRadius: 99, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
      <div style={{
        height: "100%", width: `${value}%`, background: color,
        borderRadius: 99, transition: "width 0.6s cubic-bezier(0.22,1,0.36,1)", opacity: 0.9,
      }} />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { color: string; label: string }> = {
    Shipping: { color: C.green, label: "Shipping" },
    Building: { color: C.accentBright, label: "Building" },
    Planning: { color: C.amber, label: "Planning" },
    Paused: { color: C.muted, label: "Paused" },
  };
  const s = map[status] || map.Planning;
  return <Pill label={s.label} color={s.color} small />;
}

function SectionHeader({ title, count, action, onAction }: { title: string; count?: number; action?: string; onAction?: () => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <h2 style={{ fontSize: 14, fontWeight: 600, margin: 0, color: C.text, letterSpacing: "0.01em" }}>{title}</h2>
        {count != null && (
          <span style={{
            fontSize: 11, fontFamily: "monospace",
            background: C.accentDim, color: C.accentBright,
            border: `1px solid ${C.borderAccent}`,
            padding: "1px 9px", borderRadius: 99,
          }}>{count}</span>
        )}
      </div>
      {action && (
        <button onClick={onAction} style={{
          display: "flex", alignItems: "center", gap: 5,
          padding: "5px 12px", borderRadius: 8,
          background: C.accentDim, color: C.accentBright,
          border: `1px solid ${C.borderAccent}`,
          fontSize: 11, fontFamily: "monospace", fontWeight: 600,
          cursor: "pointer", letterSpacing: "0.04em",
        }}>
          + {action}
        </button>
      )}
    </div>
  );
}

function SearchBar({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative", marginBottom: 16 }}>
      <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.faint, fontSize: 14, pointerEvents: "none" }}>⌕</span>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder || "Search…"}
        style={{
          width: "100%", padding: "9px 12px 9px 34px",
          background: focused ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.03)",
          border: `1px solid ${focused ? C.borderHover : C.border}`,
          borderRadius: 10, color: C.text, fontSize: 13,
          outline: "none", boxSizing: "border-box",
          boxShadow: focused ? `0 0 0 3px ${C.accentGlow}` : "none",
          transition: "all 0.18s",
        }}
      />
    </div>
  );
}

// ─── Battle Log Tab ───────────────────────────────────────────────────────────

function LogField({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
        <span style={{ fontSize: 11 }}>{icon}</span>
        <span style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: C.faint, fontFamily: "monospace", fontWeight: 600 }}>{label}</span>
      </div>
      <p style={{ fontSize: 12.5, color: "rgba(232,232,240,0.75)", lineHeight: 1.65, margin: 0 }}>{value}</p>
    </div>
  );
}

function LogEntry({ entry, defaultOpen }: { entry: typeof MOCK_LOGS[0]; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  const mood = MOODS.find(m => m.value === entry.mood) ?? MOODS[1];

  return (
    <Card glow={mood.color + "22"} style={{ marginBottom: 8 }}>
      <div style={{ position: "absolute", left: 0, top: 10, bottom: 10, width: 2, borderRadius: 99, background: `linear-gradient(180deg, ${mood.color}90, ${mood.color}20)` }} />

      <button onClick={() => setOpen(p => !p)} style={{
        width: "100%", display: "flex", alignItems: "center", gap: 12,
        padding: "13px 16px 13px 18px", background: "none", border: "none",
        color: C.text, cursor: "pointer", textAlign: "left",
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: mood.bg, border: `1px solid ${mood.color}30`, fontSize: 15,
        }}>{mood.emoji}</div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{formatDate(entry.date)}</span>
            <Pill label={`Lv ${entry.level}`} color={C.accentBright} small />
            <Pill label={mood.label} color={mood.color} small />
          </div>
          {entry.completed && (
            <p style={{ fontSize: 12, color: C.muted, margin: "3px 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              ⚔ {entry.completed}
            </p>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: C.accentBright, fontFamily: "monospace" }}>+{entry.xp} XP</span>
          <span style={{ color: C.faint, fontSize: 11 }}>{open ? "▲" : "▼"}</span>
        </div>
      </button>

      {open && (
        <div style={{ borderTop: `1px solid ${C.border}`, padding: "14px 16px 16px 18px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 20px" }}>
            {entry.completed && <LogField icon="⚔" label="Completed" value={entry.completed} color="#f97316" />}
            {entry.win && <LogField icon="🏆" label="Biggest Win" value={entry.win} color={C.amber} />}
            {entry.learned && <LogField icon="🧠" label="Learned" value={entry.learned} color={C.accentBright} />}
            {entry.bug && <LogField icon="🐛" label="Bug Defeated" value={entry.bug} color={C.red} />}
            {entry.tomorrow && <LogField icon="🔮" label="Tomorrow" value={entry.tomorrow} color="#c4b5fd" />}
          </div>
          <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
            <div style={{ background: C.accentDim, border: `1px solid ${C.borderAccent}`, borderRadius: 99, padding: "3px 12px", fontSize: 12, fontWeight: 700, fontFamily: "monospace", color: C.accentBright }}>
              +{entry.xp} XP
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

function LogFormField({ icon, label, placeholder, value, onChange, rows, accent }: {
  icon: string; label: string; placeholder: string; value: string;
  onChange: (v: string) => void; rows: number; accent: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 12 }}>{icon}</span>
        <label style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: focused ? accent : C.faint, fontFamily: "monospace", fontWeight: 600, transition: "color 0.2s" }}>{label}</label>
      </div>
      <textarea
        rows={rows}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        style={{
          resize: "none", borderRadius: 10, padding: "9px 12px", fontSize: 12.5, outline: "none", lineHeight: 1.65,
          background: focused ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.03)",
          border: `1px solid ${focused ? accent + "55" : C.border}`,
          color: C.text,
          boxShadow: focused ? `0 0 0 3px ${accent}14` : "none",
          transition: "all 0.18s",
        }}
      />
    </div>
  );
}

function BattleLogTab() {
  const [logs, setLogs] = useState(MOCK_LOGS);
  const [form, setForm] = useState({ mood: "GOOD", completed: "", win: "", learned: "", bug: "", tomorrow: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const FIELDS: Array<{ key: keyof typeof form; icon: string; label: string; placeholder: string; rows: number; accent: string }> = [
    { key: "completed", icon: "⚔", label: "Main thing completed today", placeholder: "Built auth flow · Solved 5 LC · Applied to 10 jobs…", rows: 2, accent: "#f97316" },
    { key: "win", icon: "🏆", label: "Biggest win", placeholder: "First recruiter reply · Solved a Hard…", rows: 1, accent: C.amber },
    { key: "learned", icon: "🧠", label: "What did you learn?", placeholder: "New concept, pattern, debugging trick…", rows: 2, accent: C.accentBright },
    { key: "bug", icon: "🐛", label: "Bug defeated", placeholder: "Problem → Cause → Fix", rows: 2, accent: C.red },
    { key: "tomorrow", icon: "🔮", label: "Tomorrow's focus", placeholder: "The single most important thing to do tomorrow…", rows: 1, accent: "#c4b5fd" },
  ];

  const hasContent = FIELDS.some(f => String(form[f.key] || "").trim());
  const xp = [form.completed, form.win, form.learned, form.bug, form.tomorrow]
    .reduce((s, v) => s + (v?.trim() ? 25 : 0), 0);

  function handleSave() {
    if (!hasContent) return;
    setSaving(true);
    setTimeout(() => {
      const newEntry = { id: String(Date.now()), date: new Date().toISOString(), level: 5, xp, ...form };
      setLogs(prev => [newEntry, ...prev]);
      setForm({ mood: "GOOD", completed: "", win: "", learned: "", bug: "", tomorrow: "" });
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }, 700);
  }

  return (
    <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
      {/* Form */}
      <div style={{ width: 360, flexShrink: 0, position: "sticky", top: 0 }}>
        <Card>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${C.accent}80,transparent)` }} />
          <div style={{ padding: "14px 18px 12px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 7, height: 7, borderRadius: 99, background: C.accentBright, boxShadow: `0 0 10px ${C.accentBright}` }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Log Today's Battle</span>
            </div>
            {xp > 0 && <span style={{ fontSize: 12, fontWeight: 700, color: C.accentBright, fontFamily: "monospace" }}>+{xp} XP</span>}
          </div>

          <div style={{ padding: "14px 18px 18px", display: "flex", flexDirection: "column", gap: 12, maxHeight: "78vh", overflowY: "auto" }}>
            <div>
              <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: C.faint, fontFamily: "monospace", margin: "0 0 8px" }}>Battle Status</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {MOODS.map(m => (
                  <button key={m.value} onClick={() => setForm(p => ({ ...p, mood: m.value }))} style={{
                    display: "flex", alignItems: "center", gap: 5, padding: "6px 11px", borderRadius: 8,
                    background: form.mood === m.value ? m.bg : "rgba(255,255,255,0.03)",
                    color: form.mood === m.value ? m.color : C.faint,
                    border: `1px solid ${form.mood === m.value ? m.color + "44" : C.border}`,
                    fontSize: 11, fontFamily: "monospace", fontWeight: 500, cursor: "pointer",
                    transform: form.mood === m.value ? "scale(1.03)" : "scale(1)", transition: "all 0.15s",
                  }}>
                    <span>{m.emoji}</span>{m.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ height: 1, background: C.border }} />

            {FIELDS.map(f => (
              <LogFormField
                key={f.key}
                icon={f.icon}
                label={f.label}
                placeholder={f.placeholder}
                value={String(form[f.key] || "")}
                onChange={v => setForm(p => ({ ...p, [f.key]: v }))}
                rows={f.rows}
                accent={f.accent}
              />
            ))}

            <button
              onClick={handleSave}
              disabled={!hasContent || saving}
              style={{
                width: "100%", padding: "11px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                fontFamily: "monospace", cursor: hasContent ? "pointer" : "not-allowed",
                opacity: hasContent ? 1 : 0.4,
                background: hasContent ? `linear-gradient(135deg, ${C.accent}, #7c3aed)` : "rgba(255,255,255,0.05)",
                color: hasContent ? "#fff" : C.muted, border: "none",
                boxShadow: hasContent ? `0 0 24px ${C.accentGlow}` : "none",
                letterSpacing: "0.04em", transition: "all 0.2s",
              }}
            >
              {saving ? "⚡ Logging…" : saved ? "✔ Logged!" : "⚔ Log Battle"}
            </button>
          </div>
        </Card>
      </div>

      {/* History */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <SectionHeader title="Battle History" count={logs.length} />
        {logs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 20px", color: C.muted, fontSize: 13 }}>No entries yet. Log your first battle!</div>
        ) : (
          logs.map((e, i) => <LogEntry key={e.id} entry={e} defaultOpen={i === 0} />)
        )}
      </div>
    </div>
  );
}

// ─── Idea Vault Tab ───────────────────────────────────────────────────────────

function IdeaVaultTab() {
  const [ideas, setIdeas] = useState(MOCK_IDEAS);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", category: "Project", problem: "", tags: "" });
  const [showForm, setShowForm] = useState(false);

  const CATS = ["Project", "Startup", "Tool", "Experiment"];
  const CAT_COLORS: Record<string, string> = { Project: C.accentBright, Startup: C.green, Tool: C.blue, Experiment: C.pink };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return ideas.filter(i =>
      i.title.toLowerCase().includes(q) ||
      i.tags.some(t => t.toLowerCase().includes(q)) ||
      i.category.toLowerCase().includes(q)
    );
  }, [ideas, search]);

  function handleSave() {
    if (!form.title.trim()) return;
    const tags = form.tags.split(",").map(t => t.trim()).filter(Boolean);
    if (editing) {
      setIdeas(prev => prev.map(i => i.id === editing ? { ...i, ...form, tags } : i));
      setEditing(null);
    } else {
      setIdeas(prev => [{
        id: String(Date.now()),
        title: form.title,
        category: form.category,
        problem: form.problem,
        tags,
        color: CAT_COLORS[form.category] || C.accentBright,
        createdAt: "just now",
      }, ...prev]);
    }
    setForm({ title: "", category: "Project", problem: "", tags: "" });
    setShowForm(false);
  }

  function startEdit(idea: typeof MOCK_IDEAS[0]) {
    setEditing(idea.id);
    setForm({ title: idea.title, category: idea.category, problem: idea.problem, tags: idea.tags.join(", ") });
    setShowForm(true);
  }

  const inputStyle: React.CSSProperties = {
    padding: "8px 10px", borderRadius: 8,
    background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`,
    color: C.text, fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em",
    color: C.faint, fontFamily: "monospace", marginBottom: 4, display: "block",
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search ideas, tags, categories…" />
        </div>
        <button onClick={() => { setEditing(null); setForm({ title: "", category: "Project", problem: "", tags: "" }); setShowForm(p => !p); }} style={{
          padding: "9px 16px", borderRadius: 10,
          background: C.accentDim, color: C.accentBright, border: `1px solid ${C.borderAccent}`,
          fontSize: 12, fontFamily: "monospace", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
        }}>
          + New Idea
        </button>
      </div>

      {showForm && (
        <Card style={{ marginBottom: 20, padding: "18px 20px" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${C.accent}55,transparent)` }} />
          <h3 style={{ fontSize: 13, fontWeight: 600, margin: "0 0 14px", color: C.text }}>{editing ? "Edit Idea" : "New Idea"}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div>
              <label style={labelStyle}>Title</label>
              <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Your brilliant idea" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} style={{ ...inputStyle }}>
                {CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Problem it solves</label>
            <textarea rows={2} value={form.problem} onChange={e => setForm(p => ({ ...p, problem: e.target.value }))} placeholder="What problem does this solve?" style={{ ...inputStyle, resize: "none", lineHeight: 1.6 }} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Tags (comma-separated)</label>
            <input value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} placeholder="AI, Startup, CLI" style={inputStyle} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleSave} style={{ padding: "8px 18px", borderRadius: 8, background: `linear-gradient(135deg, ${C.accent}, #7c3aed)`, color: "#fff", border: "none", fontSize: 12, fontFamily: "monospace", fontWeight: 600, cursor: "pointer" }}>Save Idea</button>
            <button onClick={() => { setShowForm(false); setEditing(null); }} style={{ padding: "8px 14px", borderRadius: 8, background: "transparent", color: C.muted, border: `1px solid ${C.border}`, fontSize: 12, fontFamily: "monospace", cursor: "pointer" }}>Cancel</button>
          </div>
        </Card>
      )}

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 20px", color: C.muted, fontSize: 13 }}>No ideas found.</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
          {filtered.map(idea => (
            <Card key={idea.id} glow={idea.color + "20"} style={{ padding: "16px 18px" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${idea.color}40,transparent)` }} />
              <div style={{ position: "absolute", left: 0, top: 14, bottom: 14, width: 2, borderRadius: 99, background: `${idea.color}50` }} />
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 10 }}>
                <Pill label={idea.category} color={idea.color} small />
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => startEdit(idea)} style={{ padding: "3px 8px", borderRadius: 6, background: C.accentDim, border: `1px solid ${C.borderAccent}`, color: C.accentBright, fontSize: 10, fontFamily: "monospace", cursor: "pointer" }}>Edit</button>
                  <button onClick={() => setIdeas(p => p.filter(i => i.id !== idea.id))} style={{ padding: "3px 8px", borderRadius: 6, background: C.redDim, border: "1px solid rgba(248,113,113,0.2)", color: C.red, fontSize: 10, fontFamily: "monospace", cursor: "pointer" }}>Del</button>
                </div>
              </div>
              <h3 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 7px", color: idea.color }}>{idea.title}</h3>
              {idea.problem && <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.6, margin: "0 0 10px" }}>{idea.problem}</p>}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 8 }}>
                {idea.tags.map(t => <Pill key={t} label={t} color={idea.color} small />)}
              </div>
              <p style={{ fontSize: 10, color: C.faint, fontFamily: "monospace", margin: 0 }}>🕐 {idea.createdAt}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Project Planner Tab ──────────────────────────────────────────────────────

function ProjectPlannerTab() {
  const [projects] = useState(MOCK_PROJECTS);
  const [selected, setSelected] = useState<typeof MOCK_PROJECTS[0]>(MOCK_PROJECTS[0]);

  return (
    <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
      <div style={{ width: 280, flexShrink: 0 }}>
        <SectionHeader title="Projects" count={projects.length} />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {projects.map(p => (
            <Card key={p.id} onClick={() => setSelected(p)} glow={p.color + "20"} style={{
              padding: "14px 16px",
              borderColor: selected?.id === p.id ? p.color + "50" : C.border,
              boxShadow: selected?.id === p.id ? `0 0 20px ${p.color}18` : "none",
            }}>
              <div style={{ position: "absolute", left: 0, top: 10, bottom: 10, width: 2, borderRadius: 99, background: selected?.id === p.id ? p.color : "transparent", transition: "background 0.2s" }} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: selected?.id === p.id ? p.color : C.text }}>{p.name}</span>
                <StatusBadge status={p.status} />
              </div>
              <p style={{ fontSize: 12, color: C.muted, margin: "0 0 10px", lineHeight: 1.5 }}>{p.description}</p>
              <ProgressBar value={p.progress} color={p.color} />
              <p style={{ fontSize: 10, color: C.faint, margin: "5px 0 0", fontFamily: "monospace" }}>{p.progress}% complete</p>
            </Card>
          ))}
        </div>
      </div>

      {selected && (
        <div style={{ flex: 1, minWidth: 0 }}>
          <Card style={{ padding: "22px 24px" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${selected.color}60,transparent)` }} />
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: selected.color }}>{selected.name}</h2>
                  <StatusBadge status={selected.status} />
                </div>
                <p style={{ fontSize: 13, color: C.muted, margin: 0, lineHeight: 1.6 }}>{selected.description}</p>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: selected.color, fontFamily: "monospace", lineHeight: 1 }}>{selected.progress}%</div>
                <div style={{ fontSize: 9, color: C.faint, fontFamily: "monospace", marginTop: 2, letterSpacing: "0.1em" }}>PROGRESS</div>
              </div>
            </div>
            <ProgressBar value={selected.progress} color={selected.color} height={6} />

            <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[
                { icon: "❓", label: "Why Build This?", color: selected.color, content: <p style={{ fontSize: 13, color: "rgba(232,232,240,0.75)", lineHeight: 1.65, margin: 0 }}>{selected.why}</p> },
                { icon: "🛠", label: "Tech Stack", color: selected.color, content: <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>{selected.tech.map(t => <Pill key={t} label={t} color={selected.color} small />)}</div> },
                { icon: "🎯", label: "MVP Features", color: C.green, content: <ul style={{ margin: 0, paddingLeft: 16 }}>{selected.mvp.map((f, i) => <li key={i} style={{ fontSize: 13, color: "rgba(232,232,240,0.75)", lineHeight: 1.8 }}>{f}</li>)}</ul> },
                { icon: "✨", label: "Stretch Goals", color: C.amber, content: <ul style={{ margin: 0, paddingLeft: 16 }}>{selected.stretch.map((f, i) => <li key={i} style={{ fontSize: 13, color: "rgba(232,232,240,0.75)", lineHeight: 1.8 }}>{f}</li>)}</ul> },
              ].map(s => (
                <div key={s.label} style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}`, borderRadius: 12, padding: "13px 15px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                    <span style={{ fontSize: 12 }}>{s.icon}</span>
                    <span style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: s.color + "cc", fontFamily: "monospace", fontWeight: 600 }}>{s.label}</span>
                  </div>
                  {s.content}
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// ─── Inspiration Tab ──────────────────────────────────────────────────────────

const INSPO_GRADS = [
  "linear-gradient(135deg,#12052e 0%,#2d1b69 60%,#0f2a1a 100%)",
  "linear-gradient(135deg,#06122a 0%,#1a3a5f 60%,#0a1f2e 100%)",
  "linear-gradient(135deg,#0a1520 0%,#1a3a4a 60%,#061a10 100%)",
  "linear-gradient(135deg,#180924 0%,#3d1d5c 60%,#120824 100%)",
  "linear-gradient(135deg,#16160a 0%,#3a3205 60%,#16160a 100%)",
  "linear-gradient(135deg,#180808 0%,#3a0d0d 60%,#180808 100%)",
];

function InspirationTab() {
  const [inspo, setInspo] = useState(MOCK_INSPO);
  const [filter, setFilter] = useState("All");
  const TYPES = ["All", "UI", "Repo", "Design", "Concept"];
  const filtered = filter === "All" ? inspo : inspo.filter(i => i.type === filter);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {TYPES.map(t => (
            <button key={t} onClick={() => setFilter(t)} style={{
              padding: "5px 13px", borderRadius: 8, fontSize: 11, fontFamily: "monospace", fontWeight: 600, cursor: "pointer",
              background: filter === t ? C.accentDim : "rgba(255,255,255,0.03)",
              color: filter === t ? C.accentBright : C.muted,
              border: `1px solid ${filter === t ? C.borderAccent : C.border}`,
              transition: "all 0.15s",
            }}>{t}</button>
          ))}
        </div>
        <button style={{
          padding: "7px 14px", borderRadius: 8, background: C.accentDim, color: C.accentBright,
          border: `1px solid ${C.borderAccent}`, fontSize: 11, fontFamily: "monospace", fontWeight: 600, cursor: "pointer",
        }}>+ Add Inspiration</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
        {filtered.map((item, idx) => (
          <Card key={item.id} glow={item.color + "28"} style={{ overflow: "hidden" }}>
            <div style={{
              height: 130, background: INSPO_GRADS[idx % INSPO_GRADS.length],
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 40% 50%, ${item.color}18 0%, transparent 70%)` }} />
              <div style={{ width: 56, height: 56, borderRadius: 12, background: item.color + "20", border: `1px solid ${item.color}35`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", fontSize: 22 }}>
                {item.type === "UI" ? "🎨" : item.type === "Repo" ? "⚙" : item.type === "Design" ? "✦" : "💭"}
              </div>
              <div style={{ position: "absolute", top: 8, right: 8 }}>
                <Pill label={item.type} color={item.color} small />
              </div>
            </div>
            <div style={{ padding: "12px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                <h3 style={{ fontSize: 13, fontWeight: 600, margin: 0, color: C.text }}>{item.title}</h3>
                <button onClick={() => setInspo(p => p.filter(i => i.id !== item.id))} style={{ padding: "2px 7px", borderRadius: 6, background: "transparent", border: `1px solid ${C.border}`, color: C.faint, fontSize: 9, fontFamily: "monospace", cursor: "pointer" }}>✕</button>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Pill label={item.tag} color={item.color} small />
                <a href={`https://${item.url}`} target="_blank" rel="noreferrer" style={{ fontSize: 10, color: C.faint, fontFamily: "monospace", textDecoration: "none" }}>{item.url} ↗</a>
              </div>
            </div>
          </Card>
        ))}

        <div
          style={{
            height: 220, borderRadius: 14, border: `1px dashed ${C.border}`,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8,
            cursor: "pointer", color: C.faint, fontSize: 13, transition: "all 0.2s",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = C.borderAccent; (e.currentTarget as HTMLDivElement).style.color = C.accentBright; }}
          onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = C.border; (e.currentTarget as HTMLDivElement).style.color = C.faint; }}
        >
          <span style={{ fontSize: 26 }}>+</span>
          Add inspiration
        </div>
      </div>
    </div>
  );
}

// ─── Knowledge Vault Tab ──────────────────────────────────────────────────────

function KnowledgeVaultTab() {
  const [notes, setNotes] = useState(MOCK_NOTES);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [expanded, setExpanded] = useState<string | null>("1");

  const CATS = ["All", "DSA", "Command", "Interview", "Learning"];
  const CAT_COLORS: Record<string, string> = { DSA: C.accentBright, Command: C.blue, Interview: C.green, Learning: C.amber };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return notes.filter(n => {
      const matchCat = catFilter === "All" || n.category === catFilter;
      const matchQ = !q || n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q) || n.tags.some(t => t.toLowerCase().includes(q));
      return matchCat && matchQ;
    });
  }, [notes, search, catFilter]);

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search notes, commands, patterns…" />
        </div>
        <button style={{
          padding: "9px 14px", borderRadius: 10, background: C.accentDim, color: C.accentBright,
          border: `1px solid ${C.borderAccent}`, fontSize: 11, fontFamily: "monospace", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", alignSelf: "flex-start",
        }}>+ Add Note</button>
      </div>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
        {CATS.map(c => (
          <button key={c} onClick={() => setCatFilter(c)} style={{
            padding: "5px 13px", borderRadius: 8, fontSize: 11, fontFamily: "monospace", fontWeight: 600, cursor: "pointer",
            background: catFilter === c ? (CAT_COLORS[c] || C.accent) + "20" : "rgba(255,255,255,0.03)",
            color: catFilter === c ? (CAT_COLORS[c] || C.accent) : C.muted,
            border: `1px solid ${catFilter === c ? (CAT_COLORS[c] || C.accent) + "44" : C.border}`,
            transition: "all 0.15s",
          }}>{c}</button>
        ))}
      </div>

      {filtered.length === 0 && <div style={{ textAlign: "center", padding: "48px 20px", color: C.muted, fontSize: 13 }}>No notes found.</div>}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map(note => {
          const isOpen = expanded === note.id;
          const color = CAT_COLORS[note.category] || C.accentBright;
          return (
            <Card key={note.id} glow={color + "18"}>
              <div style={{ position: "absolute", left: 0, top: 10, bottom: 10, width: 2, borderRadius: 99, background: color + "60" }} />
              <button onClick={() => setExpanded(isOpen ? null : note.id)} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "12px 16px 12px 18px", background: "none", border: "none", color: C.text, cursor: "pointer", textAlign: "left",
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{note.title}</span>
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
                    fontSize: 12.5, lineHeight: 1.75, margin: 0,
                    color: note.isCode ? C.green : "rgba(232,232,240,0.75)",
                    fontFamily: note.isCode ? "monospace" : "inherit",
                    whiteSpace: "pre-wrap", wordBreak: "break-word",
                    background: note.isCode ? "rgba(52,211,153,0.04)" : "transparent",
                    borderRadius: note.isCode ? 8 : 0,
                    padding: note.isCode ? "10px 12px" : 0,
                    border: note.isCode ? `1px solid ${C.green}20` : "none",
                  }}>
                    {note.content}
                  </pre>
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
                    <button onClick={() => setNotes(p => p.filter(n => n.id !== note.id))} style={{ padding: "4px 12px", borderRadius: 6, background: C.redDim, border: "1px solid rgba(248,113,113,0.2)", color: C.red, fontSize: 10, fontFamily: "monospace", cursor: "pointer" }}>Delete</button>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Workspace ───────────────────────────────────────────────────────────

const TABS = [
  { id: "battlelog", icon: "📖", label: "Battle Log" },
  { id: "ideavault", icon: "💡", label: "Idea Vault" },
  { id: "projects", icon: "🗺", label: "Project Planner" },
  { id: "inspiration", icon: "🎨", label: "Inspiration" },
  { id: "knowledge", icon: "🧠", label: "Knowledge Vault" },
];

export default function KyzenWorkspace() {
  const [activeTab, setActiveTab] = useState("battlelog");

  return (
    <div style={{
      minHeight: "100vh",
      background: C.bg,
      color: C.text,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif",
    }}>
      {/* Ambient background */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: `
          radial-gradient(ellipse 55% 35% at 10% 0%, rgba(124,58,237,0.07) 0%, transparent 60%),
          radial-gradient(ellipse 35% 30% at 90% 90%, rgba(52,211,153,0.04) 0%, transparent 60%),
          radial-gradient(ellipse 40% 40% at 50% 50%, rgba(139,92,246,0.025) 0%, transparent 60%)
        `,
      }} />

      {/* Top header bar */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(7,9,26,0.85)", backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${C.border}`,
        padding: "0 28px",
        display: "flex", alignItems: "center", justifyContent: "space-between", height: 56,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: "rgba(139,92,246,0.15)", border: `1px solid rgba(139,92,246,0.3)`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
          }}>🧠</div>
          <div>
            <span style={{ fontSize: 14, fontWeight: 700, background: `linear-gradient(135deg, #fff 40%, ${C.accentBright})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Workspace
            </span>
            <span style={{ fontSize: 11, color: C.faint, fontFamily: "monospace", marginLeft: 10, letterSpacing: "0.03em" }}>Think · Plan · Remember</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 7, height: 7, borderRadius: 99, background: C.green, boxShadow: `0 0 8px ${C.green}` }} />
          <span style={{ fontSize: 11, color: C.faint, fontFamily: "monospace" }}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
          </span>
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto", padding: "28px 28px 60px" }}>
        {/* Tab navigation */}
        <div style={{
          display: "flex", gap: 2, flexWrap: "wrap",
          background: "rgba(255,255,255,0.025)",
          border: `1px solid ${C.border}`,
          borderRadius: 12, padding: "4px 5px",
          marginBottom: 28,
          width: "fit-content",
        }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              display: "flex", alignItems: "center", gap: 7, padding: "7px 15px", borderRadius: 9,
              background: activeTab === t.id ? C.accentDim : "transparent",
              color: activeTab === t.id ? C.accentBright : C.muted,
              border: `1px solid ${activeTab === t.id ? C.borderAccent : "transparent"}`,
              fontSize: 12, fontFamily: "monospace", fontWeight: 600,
              cursor: "pointer", transition: "all 0.15s",
              boxShadow: activeTab === t.id ? `0 0 12px ${C.accentGlow}` : "none",
              letterSpacing: "0.02em",
            }}>
              <span style={{ fontSize: 13 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "battlelog" && <BattleLogTab />}
        {activeTab === "ideavault" && <IdeaVaultTab />}
        {activeTab === "projects" && <ProjectPlannerTab />}
        {activeTab === "inspiration" && <InspirationTab />}
        {activeTab === "knowledge" && <KnowledgeVaultTab />}
      </div>
    </div>
  );
}