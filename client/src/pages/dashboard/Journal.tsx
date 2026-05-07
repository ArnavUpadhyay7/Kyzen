import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  Flame, Zap, Wind, Battery, AlertTriangle,
  ChevronDown, ChevronUp, CheckCircle2, Target,
  Sparkles, BookOpen, Calendar, TrendingUp, Save,
  Clock, Star, Trash2, Loader2, RefreshCw,
} from "lucide-react";
import { useTokens } from "../../state/theme/ThemeContext";
import { journalApi, type JournalEntry, type Mood, type UpsertJournalPayload } from "../../api/journal.api";
import { toast } from "../../components/ui/Toast";

// ─── Mood Config ──────────────────────────────────────────────────────────────

const MOODS: {
  value: Mood;
  label: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
}[] = [
  { value: "LOCKED_IN",  label: "Locked In",  icon: <Zap size={13} />,       color: "#8b5cf6", bg: "rgba(139,92,246,0.15)" },
  { value: "GOOD",       label: "Good",       icon: <Sparkles size={13} />,  color: "#4ade80", bg: "rgba(74,222,128,0.12)"  },
  { value: "TIRED",      label: "Tired",      icon: <Battery size={13} />,   color: "#f59e0b", bg: "rgba(245,158,11,0.12)"  },
  { value: "BURNED_OUT", label: "Burned Out", icon: <Flame size={13} />,     color: "#f87171", bg: "rgba(248,113,113,0.12)" },
  { value: "DISTRACTED", label: "Distracted", icon: <Wind size={13} />,      color: "#7dd3fc", bg: "rgba(125,211,252,0.12)" },
];

function getMoodConfig(mood: Mood) {
  return MOODS.find((m) => m.value === mood) ?? MOODS[1];
}

// ─── Date helpers ─────────────────────────────────────────────────────────────

function toLocalDateStr(isoString: string): string {
  // Use local date parts to avoid UTC-vs-local off-by-one shifts
  const d = new Date(isoString);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function todayLocalStr(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatDateLabel(isoString: string): string {
  const dateStr = toLocalDateStr(isoString);
  const today   = todayLocalStr();

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  if (dateStr === today)          return "Today";
  if (dateStr === yesterdayStr)   return "Yesterday";

  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

// ─── Blank form ───────────────────────────────────────────────────────────────

const BLANK_FORM: UpsertJournalPayload & { mood: Mood } = {
  completed:    "",
  distractedBy: "",
  biggestWin:   "",
  tomorrowFocus:"",
  mood:         "GOOD",
};

function entryToForm(e: JournalEntry): typeof BLANK_FORM {
  return {
    completed:     e.completed     ?? "",
    distractedBy:  e.distractedBy  ?? "",
    biggestWin:    e.biggestWin    ?? "",
    tomorrowFocus: e.tomorrowFocus ?? "",
    mood:          e.mood,
  };
}

// ─── Mood Pill ────────────────────────────────────────────────────────────────

function MoodPill({
  mood, active, onClick,
}: {
  mood: typeof MOODS[0]; active: boolean; onClick: () => void;
}) {
  const t = useTokens();
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-medium transition-all duration-200"
      style={{
        fontFamily: "'DM Mono', monospace",
        background: active ? mood.bg    : t.mutedBtn,
        color:      active ? mood.color : t.textMuted,
        border:     `1px solid ${active ? mood.color + "44" : t.border}`,
        boxShadow:  active ? `0 0 14px ${mood.color}28` : "none",
      }}
    >
      <span style={{ color: active ? mood.color : t.textFaint }}>{mood.icon}</span>
      {mood.label}
    </motion.button>
  );
}

// ─── Journal Field ────────────────────────────────────────────────────────────

function JournalField({
  label, icon, placeholder, value, onChange, rows = 2,
}: {
  label: string; icon: React.ReactNode; placeholder: string;
  value: string; onChange: (v: string) => void; rows?: number;
}) {
  const t = useTokens();
  const [focused, setFocused] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <span style={{ color: t.textFaint, display: "flex" }}>{icon}</span>
        <label
          className="text-[11px] uppercase tracking-[0.08em] font-medium"
          style={{ color: t.textMuted, fontFamily: "'DM Mono', monospace" }}
        >
          {label}
        </label>
      </div>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className="resize-none rounded-xl px-3.5 py-3 text-[13px] outline-none transition-all duration-200 placeholder:opacity-35"
        style={{
          background: focused ? (t.isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)") : t.mutedBtn,
          border:    `1px solid ${focused ? "rgba(139,92,246,0.45)" : t.border}`,
          color:      t.textPrimary,
          fontFamily: "'DM Sans', sans-serif",
          lineHeight: "1.65",
          boxShadow:  focused ? "0 0 0 3px rgba(139,92,246,0.08)" : "none",
        }}
      />
    </div>
  );
}

// ─── Stat Chip ────────────────────────────────────────────────────────────────

function StatChip({
  icon, label, value, color,
}: {
  icon: React.ReactNode; label: string; value: string | number; color: string;
}) {
  const t = useTokens();
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
      style={{
        background: t.card,
        border:     `1px solid ${t.border}`,
        boxShadow:  t.isDark ? "0 2px 12px rgba(0,0,0,0.3)" : "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${color}18`, border: `1px solid ${color}28` }}
      >
        <span style={{ color }}>{icon}</span>
      </div>
      <div>
        <p
          className="text-[20px] font-bold leading-none tracking-tight"
          style={{ color: t.textPrimary, fontFamily: "'DM Mono', monospace" }}
        >
          {value}
        </p>
        <p className="text-[10px] mt-0.5 uppercase tracking-wide" style={{ color: t.textMuted, fontFamily: "'DM Mono', monospace" }}>
          {label}
        </p>
      </div>
    </div>
  );
}

// ─── Entry Card ───────────────────────────────────────────────────────────────

function EntryCard({
  entry, isFirst, onDelete, deleting,
}: {
  entry: JournalEntry;
  isFirst: boolean;
  onDelete: (id: string) => void;
  deleting: boolean;
}) {
  const t = useTokens();
  const [expanded, setExpanded] = useState(isFirst);
  const mood = getMoodConfig(entry.mood);

  const fields: { icon: React.ReactNode; label: string; value: string | null; color: string }[] = [
    { icon: <CheckCircle2 size={12} />, label: "Completed",       value: entry.completed,     color: "#4ade80" },
    { icon: <Star size={12} />,         label: "Biggest Win",     value: entry.biggestWin,    color: "#8b5cf6" },
    { icon: <AlertTriangle size={12} />,label: "Distractions",    value: entry.distractedBy,  color: "#f59e0b" },
    { icon: <Target size={12} />,       label: "Tomorrow's Focus",value: entry.tomorrowFocus, color: "#7dd3fc" },
  ].filter((f) => f.value);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-2xl overflow-hidden group"
      style={{
        background:  t.card,
        border:      `1px solid ${t.border}`,
        boxShadow:   t.isDark ? "0 2px 20px rgba(0,0,0,0.35)" : "0 1px 8px rgba(0,0,0,0.06)",
        transition:  "border-color 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = t.borderMed;
        e.currentTarget.style.boxShadow = t.isDark
          ? "0 4px 28px rgba(0,0,0,0.45)"
          : "0 4px 16px rgba(0,0,0,0.09)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = t.border;
        e.currentTarget.style.boxShadow = t.isDark
          ? "0 2px 20px rgba(0,0,0,0.35)"
          : "0 1px 8px rgba(0,0,0,0.06)";
      }}
    >
      {/* Mood-coloured left edge accent */}
      <div
        className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full"
        style={{ background: mood.color + "60" }}
      />

      {/* Top shimmer */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent 10%, ${mood.color}30 50%, transparent 90%)` }}
      />

      {/* Header row */}
      <button
        className="w-full flex items-center gap-3 px-5 pl-6 py-4 text-left"
        onClick={() => setExpanded((p) => !p)}
      >
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: mood.bg, border: `1px solid ${mood.color}33` }}
        >
          <span style={{ color: mood.color }}>{mood.icon}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-[13px] font-semibold"
              style={{ color: t.textPrimary, fontFamily: "'DM Sans', sans-serif" }}
            >
              {formatDateLabel(entry.date)}
            </span>
            <span
              className="text-[10px] px-2 py-0.5 rounded-lg"
              style={{
                background: mood.bg,
                color: mood.color,
                fontFamily: "'DM Mono', monospace",
                border: `1px solid ${mood.color}22`,
              }}
            >
              {mood.label}
            </span>
          </div>
          {entry.biggestWin && (
            <p
              className="text-[12px] truncate mt-0.5"
              style={{ color: t.textMuted, fontFamily: "'DM Sans', sans-serif" }}
            >
              🏆 {entry.biggestWin}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <motion.button
            onClick={(e) => { e.stopPropagation(); onDelete(entry.id); }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={deleting}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg transition-all duration-150 disabled:opacity-30"
            style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)" }}
            title="Delete entry"
          >
            {deleting
              ? <Loader2 size={11} style={{ color: "#f87171" }} className="animate-spin" />
              : <Trash2   size={11} style={{ color: "#f87171" }} />
            }
          </motion.button>
          <span style={{ color: t.textFaint }}>
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </span>
        </div>
      </button>

      {/* Expandable body */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div
              className="px-5 pl-6 pb-5 pt-4"
              style={{ borderTop: `1px solid ${t.border}` }}
            >
              {fields.length === 0 ? (
                <p className="text-[12px] italic" style={{ color: t.textFaint, fontFamily: "'DM Sans', sans-serif" }}>
                  No details recorded.
                </p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
                  {fields.map(({ icon, label, value, color }) => (
                    <div key={label} className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <span style={{ color }}>{icon}</span>
                        <span
                          className="text-[10px] uppercase tracking-[0.07em]"
                          style={{ color: t.textFaint, fontFamily: "'DM Mono', monospace" }}
                        >
                          {label}
                        </span>
                      </div>
                      <p
                        className="text-[12.5px] leading-relaxed"
                        style={{ color: t.textSecondary, fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyTimeline() {
  const t = useTokens();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-2xl p-12 flex flex-col items-center gap-4 text-center"
      style={{
        background: t.isDark
          ? "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.06) 0%, transparent 65%), " + t.card
          : t.card,
        border: `1px dashed ${t.border}`,
      }}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{
          background: "rgba(139,92,246,0.1)",
          border: "1px solid rgba(139,92,246,0.22)",
          boxShadow: "0 0 24px rgba(139,92,246,0.12)",
        }}
      >
        <BookOpen size={22} style={{ color: "#8b5cf6" }} />
      </div>
      <div>
        <p className="text-[15px] font-semibold" style={{ color: t.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>
          Your battle log is empty
        </p>
        <p className="text-[12px] mt-1.5 max-w-xs mx-auto leading-relaxed" style={{ color: t.textMuted, fontFamily: "'DM Sans', sans-serif" }}>
          Save your first reflection above. Past entries will appear here as a timeline of your progress.
        </p>
      </div>
    </motion.div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const t = useTokens();
  return (
    <div
      className={`rounded-xl animate-pulse ${className}`}
      style={{ background: t.mutedBtn, ...style }}
    />
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Journal() {
  const t = useTokens();

  // ── Data ───────────────────────────────────────────────────────────────────
  const [entries,      setEntries]      = useState<JournalEntry[]>([]);
  const [todayEntry,   setTodayEntry]   = useState<JournalEntry | null>(null);
  const [loading,      setLoading]      = useState(true);
  const [saving,       setSaving]       = useState(false);
  const [deletingId,   setDeletingId]   = useState<string | null>(null);
  const [form,         setForm]         = useState(BLANK_FORM);

  // ── Boot: load today + history in parallel ─────────────────────────────────
  useEffect(() => {
    async function boot() {
      try {
        const [today, all] = await Promise.all([
          journalApi.getToday(),
          journalApi.getAll(),
        ]);
        setTodayEntry(today);
        setEntries(all);
        if (today) setForm(entryToForm(today));
      } catch (err) {
        if (axios.isAxiosError(err)) {
          toast(err.response?.data?.message ?? "Failed to load journal.", "error");
        } else {
          toast("Failed to load journal.", "error");
        }
      } finally {
        setLoading(false);
      }
    }
    boot();
  }, []);

  // ── Save (create or update) ────────────────────────────────────────────────
  async function handleSave() {
    const payload: UpsertJournalPayload = {
      completed:     form.completed?.trim()     || undefined,
      distractedBy:  form.distractedBy?.trim()  || undefined,
      biggestWin:    form.biggestWin?.trim()     || undefined,
      tomorrowFocus: form.tomorrowFocus?.trim()  || undefined,
      mood:          form.mood,
    };

    setSaving(true);
    try {
      if (todayEntry) {
        // Update
        const updated = await journalApi.update(todayEntry.id, payload);
        setTodayEntry(updated);
        setEntries((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
        toast("Entry updated.", "success");
      } else {
        // Create
        const created = await journalApi.create(payload);
        setTodayEntry(created);
        setEntries((prev) => [created, ...prev]);
        toast("Entry saved.", "success");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast(err.response?.data?.message ?? "Failed to save entry.", "error");
      } else {
        toast("Failed to save entry.", "error");
      }
    } finally {
      setSaving(false);
    }
  }

  // ── Delete ─────────────────────────────────────────────────────────────────
  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await journalApi.delete(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
      if (todayEntry?.id === id) {
        setTodayEntry(null);
        setForm(BLANK_FORM);
      }
      toast("Entry deleted.", "success");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast(err.response?.data?.message ?? "Failed to delete entry.", "error");
      } else {
        toast("Failed to delete entry.", "error");
      }
    } finally {
      setDeletingId(null);
    }
  }

  // ── Derived stats ──────────────────────────────────────────────────────────
  const today      = todayLocalStr();
  // Battle log shows ALL entries — today's shows with "Today" label via formatDateLabel
  const logEntries = entries;
  const thisMonth  = entries.filter((e) => toLocalDateStr(e.date).startsWith(today.slice(0, 7))).length;

  // Streak: count consecutive days from today backwards using local date parts
  const streak = (() => {
    if (!entries.length) return 0;
    const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
    let count = 0;
    const cursor = new Date();
    for (const e of sorted) {
      // Build expected date string from cursor's local parts
      const cy  = cursor.getFullYear();
      const cm  = String(cursor.getMonth() + 1).padStart(2, "0");
      const cd  = String(cursor.getDate()).padStart(2, "0");
      const exp = `${cy}-${cm}-${cd}`;
      if (toLocalDateStr(e.date) === exp) {
        count++;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }
    return count;
  })();

  const hasContent =
    form.completed?.trim() ||
    form.biggestWin?.trim() ||
    form.distractedBy?.trim() ||
    form.tomorrowFocus?.trim();

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen p-4 md:p-6 lg:p-8 pb-20 transition-colors duration-300"
      style={{ background: t.page, fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* ── Page header ──────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8 flex flex-col sm:flex-row sm:items-center gap-5 justify-between"
      >
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: "rgba(139,92,246,0.14)",
                border: "1px solid rgba(139,92,246,0.28)",
                boxShadow: "0 0 16px rgba(139,92,246,0.1)",
              }}
            >
              <BookOpen size={16} style={{ color: "#8b5cf6" }} />
            </div>
            <h1
              className="text-[22px] font-semibold tracking-tight"
              style={{ color: t.textPrimary, letterSpacing: "-0.02em" }}
            >
              Journal
            </h1>
          </div>
          <p
            className="text-[12px] pl-0.5"
            style={{ color: t.textMuted, fontFamily: "'DM Mono', monospace" }}
          >
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Stats */}
        {loading ? (
          <div className="flex gap-3">
            {[1,2,3].map((i) => <Skeleton key={i} className="w-28 h-[60px]" />)}
          </div>
        ) : (
          <div className="flex gap-3 flex-wrap">
            <StatChip icon={<Flame size={14} />}      label="Day Streak"   value={streak}       color="#f97316" />
            <StatChip icon={<Calendar size={14} />}   label="Total"        value={entries.length} color="#8b5cf6" />
            <StatChip icon={<TrendingUp size={14} />} label="This Month"   value={thisMonth}    color="#4ade80" />
          </div>
        )}
      </motion.div>

      {/* ── Two-column layout on large screens ───────────────────────────── */}
      <div className="max-w-5xl flex flex-col lg:flex-row gap-6 items-start">

        {/* LEFT — Today's form (sticky on large screens) */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full lg:w-[420px] lg:shrink-0 lg:sticky lg:top-6"
        >
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: t.card,
              border: `1px solid ${t.borderMed}`,
              boxShadow: t.isDark
                ? "0 0 48px rgba(139,92,246,0.07), 0 4px 32px rgba(0,0,0,0.45)"
                : "0 4px 32px rgba(0,0,0,0.07)",
            }}
          >
            {/* Top glow line */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: "linear-gradient(90deg, transparent 5%, rgba(139,92,246,0.55) 50%, transparent 95%)" }}
            />

            {/* Card header */}
            <div className="px-5 pt-5 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: todayEntry ? "#4ade80" : "#8b5cf6",
                    boxShadow: todayEntry ? "0 0 6px #4ade8088" : "0 0 6px #8b5cf688",
                    animation: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
                  }}
                />
                <span className="text-[13px] font-semibold" style={{ color: t.textPrimary }}>
                  Today's Reflection
                </span>
                {todayEntry && (
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-lg"
                    style={{
                      background: "rgba(74,222,128,0.12)",
                      color: "#4ade80",
                      fontFamily: "'DM Mono', monospace",
                      border: "1px solid rgba(74,222,128,0.2)",
                    }}
                  >
                    Saved
                  </span>
                )}
              </div>
              <Clock size={13} style={{ color: t.textFaint }} />
            </div>

            {/* Form body */}
            {loading ? (
              <div className="px-5 pb-5 flex flex-col gap-4">
                <Skeleton className="h-9 w-full" />
                <div className="h-px" style={{ background: t.border }} />
                {[72, 44, 72, 44].map((h, i) => <Skeleton key={i} style={{ height: h }} />)}
                <Skeleton className="h-11 w-full" />
              </div>
            ) : (
              <div className="px-5 pb-5 flex flex-col gap-4">
                {/* Mood */}
                <div className="flex flex-col gap-2">
                  <span
                    className="text-[11px] uppercase tracking-[0.08em]"
                    style={{ color: t.textMuted, fontFamily: "'DM Mono', monospace" }}
                  >
                    How's your energy?
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {MOODS.map((m) => (
                      <MoodPill
                        key={m.value}
                        mood={m}
                        active={form.mood === m.value}
                        onClick={() => setForm((f) => ({ ...f, mood: m.value }))}
                      />
                    ))}
                  </div>
                </div>

                <div className="h-px" style={{ background: t.border }} />

                <JournalField
                  label="What did you complete today?"
                  icon={<CheckCircle2 size={12} />}
                  placeholder="Tasks finished, goals hit, milestones reached…"
                  value={form.completed ?? ""}
                  onChange={(v) => setForm((f) => ({ ...f, completed: v }))}
                />
                <JournalField
                  label="Biggest win"
                  icon={<Star size={12} />}
                  placeholder="The one thing that made today worth it…"
                  value={form.biggestWin ?? ""}
                  onChange={(v) => setForm((f) => ({ ...f, biggestWin: v }))}
                  rows={1}
                />
                <JournalField
                  label="What distracted you?"
                  icon={<AlertTriangle size={12} />}
                  placeholder="Interruptions, rabbit holes, time sinks…"
                  value={form.distractedBy ?? ""}
                  onChange={(v) => setForm((f) => ({ ...f, distractedBy: v }))}
                />
                <JournalField
                  label="Tomorrow's focus"
                  icon={<Target size={12} />}
                  placeholder="The single most important thing tomorrow…"
                  value={form.tomorrowFocus ?? ""}
                  onChange={(v) => setForm((f) => ({ ...f, tomorrowFocus: v }))}
                  rows={1}
                />

                {/* Save */}
                <motion.button
                  onClick={handleSave}
                  disabled={!hasContent || saving}
                  whileHover={hasContent && !saving ? { scale: 1.015 } : {}}
                  whileTap={hasContent  && !saving ? { scale: 0.985 } : {}}
                  className="mt-1 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: hasContent
                      ? "linear-gradient(135deg,#7c3aed 0%,#9333ea 60%,#a855f7 100%)"
                      : t.mutedBtn,
                    color: hasContent ? "#fff" : t.textFaint,
                    fontFamily: "'DM Mono', monospace",
                    boxShadow: hasContent
                      ? "0 0 28px rgba(124,58,237,0.35), 0 4px 12px rgba(0,0,0,0.25)"
                      : "none",
                  }}
                >
                  {saving
                    ? <><Loader2 size={14} className="animate-spin" /> Saving…</>
                    : <><Save size={14} />{todayEntry ? "Update Entry" : "Save Entry"}</>
                  }
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>

        {/* RIGHT — Battle log */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">

          {/* Section header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span style={{ color: t.textFaint }}><Clock size={13} /></span>
              <span
                className="text-[11px] uppercase tracking-[0.08em] font-medium"
                style={{ color: t.textMuted, fontFamily: "'DM Mono', monospace" }}
              >
                Battle Log
              </span>
              {!loading && logEntries.length > 0 && (
                <span
                  className="text-[10px] px-2 py-0.5 rounded-lg"
                  style={{
                    background: "rgba(139,92,246,0.12)",
                    color: "#8b5cf6",
                    fontFamily: "'DM Mono', monospace",
                    border: "1px solid rgba(139,92,246,0.2)",
                  }}
                >
                  {logEntries.length}
                </span>
              )}
            </div>
            {!loading && entries.length > 0 && (
              <button
                onClick={async () => {
                  setLoading(true);
                  try {
                    const all = await journalApi.getAll();
                    setEntries(all);
                  } finally {
                    setLoading(false);
                  }
                }}
                className="flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-lg transition-colors duration-150"
                style={{
                  color: t.textFaint,
                  fontFamily: "'DM Mono', monospace",
                  background: t.mutedBtn,
                  border: `1px solid ${t.border}`,
                }}
              >
                <RefreshCw size={11} />
                Refresh
              </button>
            )}
          </div>

          {/* Skeleton timeline */}
          {loading ? (
            <div className="flex flex-col gap-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl p-4 flex items-center gap-3"
                  style={{ background: t.card, border: `1px solid ${t.border}` }}
                >
                  <Skeleton className="w-8 h-8 rounded-xl shrink-0" />
                  <div className="flex-1 flex flex-col gap-2">
                    <Skeleton className="h-3.5 w-28" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
              ))}
            </div>
          ) : logEntries.length === 0 ? (
            <EmptyTimeline />
          ) : (
            <AnimatePresence mode="popLayout">
              {logEntries.map((entry, i) => (
                <EntryCard
                  key={entry.id}
                  entry={entry}
                  isFirst={i === 0}
                  onDelete={handleDelete}
                  deleting={deletingId === entry.id}
                />
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}