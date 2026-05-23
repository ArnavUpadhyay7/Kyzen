import { useCallback, useEffect, useState } from "react";
import type { BattleLog, Mood } from "../../../api/workspace.api";
import { workspaceApi } from "../../../api/workspace.api";
import { toast } from "../../ui/Toast";
import {
  BATTLE_LOG_FIELDS,
  MOODS,
} from "./constants";
import {
  EmptyState,
  FormTextarea,
  LoadingState,
  Pill,
  PrimaryButton,
  SectionHeader,
  WorkspaceCard,
} from "./ui";
import { computeBattleLogXP, formatDate } from "./utils";

interface BattleLogForm {
  mood: Mood;
  completed: string;
  win: string;
  learned: string;
  bug: string;
  tomorrow: string;
}

const EMPTY_FORM: BattleLogForm = {
  mood: "GOOD",
  completed: "",
  win: "",
  learned: "",
  bug: "",
  tomorrow: "",
};

function LogField({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center gap-1.5">
        <span className="text-[11px]">{icon}</span>
        <span className="font-mono text-[9px] font-semibold uppercase tracking-widest text-white/20">
          {label}
        </span>
      </div>
      <p className="m-0 text-[12.5px] leading-relaxed text-white/75">{value}</p>
    </div>
  );
}

function LogEntry({ entry, defaultOpen }: { entry: BattleLog; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  const mood = MOODS.find((m) => m.value === entry.mood) ?? MOODS[1];

  return (
    <WorkspaceCard className="mb-2 pl-4" accentBarClass={mood.barClass}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center gap-3 border-none bg-transparent px-4 py-3.5 text-left text-white"
      >
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-[15px] ${mood.buttonClass}`}
        >
          {mood.emoji}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[13px] font-semibold">{formatDate(entry.date)}</span>
            <Pill label={`Lv ${entry.userLevel}`} className="text-violet-400 bg-violet-500/10 border-violet-500/30" small />
            <Pill label={mood.label} className={mood.pillClass} small />
          </div>
          {entry.completed && (
            <p className="mt-0.5 truncate text-xs text-white/40">⚔ {entry.completed}</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2.5">
          <span className="font-mono text-xs font-bold text-violet-400">+{entry.xpEarned} XP</span>
          <span className="text-[11px] text-white/20">{open ? "▲" : "▼"}</span>
        </div>
      </button>
      {open && (
        <div className="border-t border-indigo-500/15 px-4 py-3.5 pl-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {entry.completed && <LogField icon="⚔" label="Completed" value={entry.completed} />}
            {entry.win && <LogField icon="🏆" label="Biggest Win" value={entry.win} />}
            {entry.learned && <LogField icon="🧠" label="Learned" value={entry.learned} />}
            {entry.bug && <LogField icon="🐛" label="Bug Defeated" value={entry.bug} />}
            {entry.tomorrow && <LogField icon="🔮" label="Tomorrow" value={entry.tomorrow} />}
          </div>
        </div>
      )}
    </WorkspaceCard>
  );
}

export default function BattleLogTab() {
  const [logs, setLogs] = useState<BattleLog[]>([]);
  const [todayLog, setTodayLog] = useState<BattleLog | null>(null);
  const [form, setForm] = useState<BattleLogForm>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [all, today] = await Promise.all([
        workspaceApi.battleLogs.getAll(),
        workspaceApi.battleLogs.getToday(),
      ]);
      setLogs(all);
      setTodayLog(today);
      if (today) {
        setForm({
          mood: today.mood,
          completed: today.completed ?? "",
          win: today.win ?? "",
          learned: today.learned ?? "",
          bug: today.bug ?? "",
          tomorrow: today.tomorrow ?? "",
        });
      }
    } catch {
      toast("Failed to load battle logs", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const xp = computeBattleLogXP(form);
  const hasContent = xp > 0;

  async function handleSave() {
    if (!hasContent) return;
    setSaving(true);
    try {
      if (todayLog) {
        const { log } = await workspaceApi.battleLogs.update(todayLog.id, form);
        setTodayLog(log);
        setLogs((prev) => prev.map((e) => (e.id === log.id ? log : e)));
      } else {
        const { log } = await workspaceApi.battleLogs.create(form);
        setTodayLog(log);
        setLogs((prev) => [log, ...prev.filter((e) => e.id !== log.id)]);
        setForm({
          mood: log.mood,
          completed: log.completed ?? "",
          win: log.win ?? "",
          learned: log.learned ?? "",
          bug: log.bug ?? "",
          tomorrow: log.tomorrow ?? "",
        });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      toast(todayLog ? "Battle log updated" : "Battle logged!");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Failed to save battle log";
      toast(msg, "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <LoadingState message="Loading battle logs…" />;

  return (
    <div className="flex flex-col items-start gap-6 lg:flex-row">
      <div className="w-full shrink-0 lg:sticky lg:top-4 lg:w-[360px]">
        <WorkspaceCard topGlow className="p-0">
          <div className="flex items-center justify-between border-b border-indigo-500/15 px-4 py-3.5">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_10px_#a78bfa]" />
              <span className="text-[13px] font-semibold text-white">
                {todayLog ? "Edit Today's Battle" : "Log Today's Battle"}
              </span>
            </div>
            {xp > 0 && (
              <span className="font-mono text-xs font-bold text-violet-400">+{xp} XP</span>
            )}
          </div>
          <div className="flex max-h-[78vh] flex-col gap-3 overflow-y-auto px-4 py-3.5">
            <div>
              <p className="mb-2 font-mono text-[9px] uppercase tracking-widest text-white/20">
                Battle Status
              </p>
              <div className="flex flex-wrap gap-1.5">
                {MOODS.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, mood: m.value }))}
                    className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 font-mono text-[11px] transition-all ${
                      form.mood === m.value
                        ? m.buttonClass
                        : "border-indigo-500/15 bg-white/[0.03] text-white/20"
                    }`}
                  >
                    <span>{m.emoji}</span>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-px bg-indigo-500/15" />
            {BATTLE_LOG_FIELDS.map((field) => (
              <div key={field.key} className="group flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs">{field.icon}</span>
                  <label
                    className={`font-mono text-[9px] font-semibold uppercase tracking-widest text-white/20 transition-colors ${field.labelClass}`}
                  >
                    {field.label}
                  </label>
                </div>
                <FormTextarea
                  rows={field.rows}
                  value={form[field.key]}
                  onChange={(e) => setForm((p) => ({ ...p, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  className={field.accentClass}
                />
              </div>
            ))}
            <PrimaryButton
              onClick={handleSave}
              disabled={!hasContent}
              loading={saving}
              loadingLabel="⚡ Logging…"
            >
              {saved ? "✔ Logged!" : todayLog ? "✔ Update Battle" : "⚔ Log Battle"}
            </PrimaryButton>
          </div>
        </WorkspaceCard>
      </div>
      <div className="min-w-0 flex-1">
        <SectionHeader title="Battle History" count={logs.length} />
        {logs.length === 0 ? (
          <EmptyState message="No entries yet. Log your first battle!" />
        ) : (
          logs.map((entry, i) => (
            <LogEntry key={entry.id} entry={entry} defaultOpen={i === 0} />
          ))
        )}
      </div>
    </div>
  );
}
