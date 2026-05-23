import { useState } from "react";
import type { InspirationType } from "../../../api/workspace.api";
import { useWorkspaceInspirations } from "../../../hooks/workspace";
import {
  INSPIRATION_GRADIENTS,
  INSPIRATION_TYPE_COLORS,
  INSPIRATION_TYPES,
} from "./constants";
import {
  AccentButton,
  EmptyState,
  FilterChip,
  FormInput,
  FormLabel,
  FormSelect,
  LoadingState,
  Pill,
  PrimaryButton,
  SecondaryButton,
  WorkspaceCard,
} from "./ui";
import { displayUrl, normalizeUrl } from "./utils";

const TYPE_ICONS: Record<InspirationType, string> = {
  UI: "🎨",
  REPO: "⚙",
  DESIGN: "✦",
  CONCEPT: "💭",
};

export default function InspirationTab() {
  const { items, loading, saving, create, remove } = useWorkspaceInspirations();
  const [filter, setFilter] = useState<InspirationType | "All">("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    type: "UI" as InspirationType,
    title: "",
    url: "",
    tag: "",
  });

  const filtered = filter === "All" ? items : items.filter((i) => i.type === filter);

  async function handleCreate() {
    if (!form.title.trim() || !form.url.trim() || !form.tag.trim()) return;
    const created = await create({
      type: form.type,
      title: form.title.trim(),
      url: normalizeUrl(form.url),
      tag: form.tag.trim(),
    });
    if (created) {
      setForm({ type: "UI", title: "", url: "", tag: "" });
      setShowForm(false);
    }
  }

  if (loading) return <LoadingState message="Loading inspiration…" />;

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {INSPIRATION_TYPES.map((t) => (
            <FilterChip key={t} active={filter === t} onClick={() => setFilter(t)}>
              {t}
            </FilterChip>
          ))}
        </div>
        <AccentButton onClick={() => setShowForm((p) => !p)}>+ Add Inspiration</AccentButton>
      </div>

      {showForm && (
        <WorkspaceCard topGlow className="mb-5 p-5">
          <h3 className="mb-3.5 text-[13px] font-semibold text-dash-primary">New Inspiration</h3>
          <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <FormLabel>Title</FormLabel>
              <FormInput
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              />
            </div>
            <div>
              <FormLabel>Type</FormLabel>
              <FormSelect
                value={form.type}
                onChange={(e) =>
                  setForm((p) => ({ ...p, type: e.target.value as InspirationType }))
                }
              >
                {INSPIRATION_TYPES.filter((t) => t !== "All").map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </FormSelect>
            </div>
          </div>
          <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <FormLabel>URL</FormLabel>
              <FormInput
                value={form.url}
                onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
                placeholder="linear.app"
              />
            </div>
            <div>
              <FormLabel>Tag</FormLabel>
              <FormInput
                value={form.tag}
                onChange={(e) => setForm((p) => ({ ...p, tag: e.target.value }))}
                placeholder="Dark UI"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <PrimaryButton className="w-auto px-5" loading={saving} onClick={handleCreate}>
              Save
            </PrimaryButton>
            <SecondaryButton onClick={() => setShowForm(false)}>Cancel</SecondaryButton>
          </div>
        </WorkspaceCard>
      )}

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item, idx) => {
          const colorClass = INSPIRATION_TYPE_COLORS[item.type];
          return (
            <WorkspaceCard key={item.id} className="overflow-hidden p-0">
              <div
                className={`relative flex h-[130px] items-center justify-center bg-gradient-to-br ${INSPIRATION_GRADIENTS[idx % INSPIRATION_GRADIENTS.length]}`}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-dash-border bg-dash-card-alt text-2xl">
                  {TYPE_ICONS[item.type]}
                </div>
                <div className="absolute right-2 top-2">
                  <Pill
                    label={item.type}
                    className={`${colorClass} border-current/30 bg-current/10`}
                    small
                  />
                </div>
              </div>
              <div className="p-3.5">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <h3 className="text-[13px] font-semibold text-dash-primary">{item.title}</h3>
                  <button
                    type="button"
                      onClick={() => void remove(item.id)}
                    className="rounded-md border border-dash-border px-1.5 py-0.5 font-dash-mono text-[9px] text-dash-faint hover:text-dash-muted"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <Pill
                    label={item.tag}
                    className={`${colorClass} border-current/30 bg-current/10`}
                    small
                  />
                  <a
                    href={normalizeUrl(item.url)}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate font-dash-mono text-[10px] text-dash-faint hover:text-dash-violet"
                  >
                    {displayUrl(item.url)} ↗
                  </a>
                </div>
              </div>
            </WorkspaceCard>
          );
        })}

        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex h-[220px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-dash-border text-[13px] text-dash-faint transition-colors hover:border-dash-accent-border hover:text-dash-violet"
        >
          <span className="text-2xl">+</span>
          Add inspiration
        </button>
      </div>

      {filtered.length === 0 && !showForm && (
        <EmptyState message="No inspiration saved yet." />
      )}
    </div>
  );
}
