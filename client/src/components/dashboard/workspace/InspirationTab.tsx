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
      {/* Toolbar */}
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

      {/* Form */}
      {showForm && (
        <WorkspaceCard topGlow className="mb-6 p-5">
          <h3 className="mb-4 text-[13px] font-semibold text-dash-primary">New Inspiration</h3>
          <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <FormLabel>Title</FormLabel>
              <FormInput
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="Linear App"
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
            <PrimaryButton className="w-auto px-6" loading={saving} onClick={handleCreate}>
              Save
            </PrimaryButton>
            <SecondaryButton onClick={() => setShowForm(false)}>Cancel</SecondaryButton>
          </div>
        </WorkspaceCard>
      )}

      {/* Grid */}
      {filtered.length === 0 && !showForm ? (
        <EmptyState message="No inspiration saved yet." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item, idx) => {
            const colorClass = INSPIRATION_TYPE_COLORS[item.type];
            return (
              <WorkspaceCard key={item.id} className="overflow-hidden p-0">
                {/* Thumbnail */}
                <div
                  className={`relative flex h-[120px] items-center justify-center bg-gradient-to-br ${INSPIRATION_GRADIENTS[idx % INSPIRATION_GRADIENTS.length]}`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-black/20 text-xl backdrop-blur-sm">
                    {TYPE_ICONS[item.type]}
                  </div>
                  <div className="absolute right-2.5 top-2.5">
                    <Pill
                      label={item.type}
                      className={`${colorClass} border-current/30 bg-black/30 backdrop-blur-sm`}
                      small
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => void remove(item.id)}
                    className="absolute left-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-md border border-white/10 bg-black/30 font-dash-mono text-[10px] text-white/50 backdrop-blur-sm transition-colors hover:text-white/90"
                  >
                    ✕
                  </button>
                </div>

                {/* Body */}
                <div className="flex flex-col gap-2 p-3.5">
                  <h3 className="text-[13px] font-semibold leading-snug text-dash-primary">
                    {item.title}
                  </h3>
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
                      className="truncate font-dash-mono text-[10px] text-dash-faint transition-colors hover:text-dash-violet"
                    >
                      {displayUrl(item.url)} ↗
                    </a>
                  </div>
                </div>
              </WorkspaceCard>
            );
          })}

          {/* Add card */}
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="flex h-[200px] flex-col items-center justify-center gap-2.5 rounded-xl border border-dashed border-dash-border text-dash-faint transition-all hover:border-dash-accent-border hover:text-dash-violet"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-dashed border-current text-xl">
              +
            </span>
            <span className="font-dash-mono text-[11px] font-semibold tracking-wide">
              Add inspiration
            </span>
          </button>
        </div>
      )}
    </div>
  );
}