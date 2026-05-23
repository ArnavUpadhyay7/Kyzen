import { useState } from "react";
import type { BattleLog } from "../../../api/workspace.api";
import { useBattleLogs } from "../../../hooks/workspace";
import { BATTLE_LOG_FIELDS, MOODS } from "./constants";
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

function LogField({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5">
        <span className="text-[11px]">{icon}</span>
        <span className="font-dash-mono text-[9px] font-semibold uppercase tracking-widest text-dash-faint">
          {label}
        </span>
      </div>
      <p className="m-0 text-[13px] leading-relaxed text-dash-secondary">{value}</p>
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
        className="flex w-full items-center gap-3 bg-transparent px-4 py-3.5 text-left"
      >
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-base ${mood.buttonClass}`}
        >
          {mood.emoji}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[13px] font-semibold text-dash-primary">
              {formatDate(entry.date)}
            </span>
            <Pill
              label={`Lv ${entry.userLevel}`}
              className="border-dash-accent-border bg-dash-accent-soft text-dash-violet"
              small
            />
            <Pill label={mood.label} className={mood.pillClass} small />
          </div>
          {entry.completed && (
            <p className="mt-1 truncate text-[12px] text-dash-muted">⚔ {entry.completed}</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="font-dash-mono text-xs font-bold text-dash-violet">
            +{entry.xpEarned} XP
          </span>
          <span className="text-[10px] text-dash-faint">{open ? "▲" : "▼"}</span>
        </div>
      </button>

      {open && (
        <div className="border-t border-dash-border px-5 py-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {entry.completed && (
              <LogField icon="⚔" label="Completed" value={entry.completed} />
            )}
            {entry.win && <LogField icon="🏆" label="Biggest Win" value={entry.win} />}
            {entry.learned && <LogField icon="🧠" label="Learned" value={entry.learned} />}
            {entry.bug && <LogField icon="🐛" label="Bug Defeated" value={entry.bug} />}
            {entry.tomorrow && (
              <LogField icon="🔮" label="Tomorrow" value={entry.tomorrow} />
            )}
          </div>
        </div>
      )}
    </WorkspaceCard>
  );
}

export default function BattleLogTab() {
  const { logs, todayLog, form, setForm, loading, saving, saved, save } = useBattleLogs();

  const xp = computeBattleLogXP({ ...form });
  const hasContent = xp > 0;

  if (loading) return <LoadingState message="Loading battle logs…" />;

  return (
    <div className="flex flex-col items-start gap-6 lg:flex-row">
      {/* ── Left: Log form ── */}
      <div className="w-full shrink-0 lg:sticky lg:top-4 lg:w-[340px]">
        <WorkspaceCard topGlow className="p-0">
          {/* Card header */}
          <div className="flex items-center justify-between border-b border-dash-border px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-dash-violet shadow-[0_0_8px_var(--dash-violet)]" />
              <span className="text-[13px] font-semibold text-dash-primary">
                {todayLog ? "Edit Today's Battle" : "Log Today's Battle"}
              </span>
            </div>
            {xp > 0 && (
              <span className="font-dash-mono text-[11px] font-bold text-dash-violet">
                +{xp} XP
              </span>
            )}
          </div>

          {/* Card body */}
          <div className="flex max-h-[78vh] flex-col gap-4 overflow-y-auto px-4 py-4">
            {/* Mood selector */}
            <div>
              <p className="mb-2 font-dash-mono text-[9px] font-semibold uppercase tracking-widest text-dash-faint">
                Battle Status
              </p>
              <div className="flex flex-wrap gap-1.5">
                {MOODS.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, mood: m.value }))}
                    className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 font-dash-mono text-[11px] font-semibold transition-all ${
                      form.mood === m.value
                        ? m.buttonClass
                        : "border-dash-border bg-dash-card-alt text-dash-faint hover:text-dash-muted"
                    }`}
                  >
                    <span>{m.emoji}</span>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-dash-border" />

            {/* Fields */}
            {BATTLE_LOG_FIELDS.map((field) => (
              <div key={field.key} className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs">{field.icon}</span>
                  <label
                    className={`font-dash-mono text-[9px] font-semibold uppercase tracking-widest text-dash-faint ${field.labelClass}`}
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
              onClick={() => void save(form, hasContent)}
              disabled={!hasContent}
              loading={saving}
              loadingLabel="⚡ Logging…"
            >
              {saved ? "✔ Logged!" : todayLog ? "✔ Update Battle" : "⚔ Log Battle"}
            </PrimaryButton>
          </div>
        </WorkspaceCard>
      </div>

      {/* ── Right: History ── */}
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