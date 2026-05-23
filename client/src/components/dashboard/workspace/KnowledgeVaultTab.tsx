import { useEffect, useMemo, useState } from "react";
import type { NoteCategory } from "../../../api/workspace.api";
import { useWorkspaceNotes } from "../../../hooks/workspace";
import {
  NOTE_CATEGORIES,
  NOTE_CATEGORY_COLORS,
  NOTE_CATEGORY_LABELS,
} from "./constants";
import {
  AccentButton,
  EmptyState,
  FilterChip,
  FormInput,
  FormLabel,
  FormSelect,
  FormTextarea,
  LoadingState,
  Pill,
  PrimaryButton,
  SearchBar,
  SecondaryButton,
  WorkspaceCard,
} from "./ui";

export default function KnowledgeVaultTab() {
  const { items: notes, loading, saving, create, remove } = useWorkspaceNotes();
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<NoteCategory | "All">("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    category: "DSA" as NoteCategory,
    title: "",
    content: "",
    tags: "",
    isCode: false,
  });

  useEffect(() => {
    if (!expandedId && notes.length > 0) {
      setExpandedId(notes[0].id);
    }
  }, [notes, expandedId]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return notes.filter((note) => {
      const matchCat = catFilter === "All" || note.category === catFilter;
      const matchQ =
        !q ||
        note.title.toLowerCase().includes(q) ||
        note.content.toLowerCase().includes(q) ||
        note.tags.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchQ;
    });
  }, [notes, search, catFilter]);

  async function handleCreate() {
    if (!form.title.trim() || !form.content.trim()) return;
    const created = await create({
      category: form.category,
      title: form.title.trim(),
      content: form.content.trim(),
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      isCode: form.isCode,
    });
    if (created) {
      setExpandedId(created.id);
      setForm({ category: "DSA", title: "", content: "", tags: "", isCode: false });
      setShowForm(false);
    }
  }

  async function handleDelete(id: string) {
    const ok = await remove(id);
    if (ok && expandedId === id) setExpandedId(null);
  }

  if (loading) return <LoadingState message="Loading notes…" />;

  return (
    <div>
      <div className="mb-3.5 flex flex-wrap gap-2.5">
        <div className="min-w-[200px] flex-1">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search notes, commands, patterns…"
          />
        </div>
        <AccentButton onClick={() => setShowForm((p) => !p)} className="self-start">
          + Add Note
        </AccentButton>
      </div>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {NOTE_CATEGORIES.map((c) => (
          <FilterChip
            key={c}
            active={catFilter === c}
            onClick={() => setCatFilter(c)}
            activeClassName={
              c !== "All"
                ? `${NOTE_CATEGORY_COLORS[c as NoteCategory]} border-current/30 bg-current/10`
                : undefined
            }
          >
            {c === "All" ? c : NOTE_CATEGORY_LABELS[c as NoteCategory]}
          </FilterChip>
        ))}
      </div>

      {showForm && (
        <WorkspaceCard topGlow className="mb-5 p-5">
          <h3 className="mb-3.5 text-[13px] font-semibold text-dash-primary">New Note</h3>
          <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <FormLabel>Title</FormLabel>
              <FormInput
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              />
            </div>
            <div>
              <FormLabel>Category</FormLabel>
              <FormSelect
                value={form.category}
                onChange={(e) =>
                  setForm((p) => ({ ...p, category: e.target.value as NoteCategory }))
                }
              >
                {NOTE_CATEGORIES.filter((c) => c !== "All").map((c) => (
                  <option key={c} value={c}>
                    {NOTE_CATEGORY_LABELS[c as NoteCategory]}
                  </option>
                ))}
              </FormSelect>
            </div>
          </div>
          <div className="mb-3">
            <FormLabel>Content</FormLabel>
            <FormTextarea
              rows={6}
              value={form.content}
              onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
            />
          </div>
          <div className="mb-3 flex items-center gap-4">
            <div className="flex-1">
              <FormLabel>Tags (comma-separated)</FormLabel>
              <FormInput
                value={form.tags}
                onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
              />
            </div>
            <label className="flex cursor-pointer items-center gap-2 pt-5 text-xs text-dash-muted">
              <input
                type="checkbox"
                checked={form.isCode}
                onChange={(e) => setForm((p) => ({ ...p, isCode: e.target.checked }))}
                className="accent-dash-accent"
              />
              Code block
            </label>
          </div>
          <div className="flex gap-2">
            <PrimaryButton className="w-auto px-5" loading={saving} onClick={handleCreate}>
              Save Note
            </PrimaryButton>
            <SecondaryButton onClick={() => setShowForm(false)}>Cancel</SecondaryButton>
          </div>
        </WorkspaceCard>
      )}

      {filtered.length === 0 ? (
        <EmptyState message="No notes found." />
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((note) => {
            const isOpen = expandedId === note.id;
            const colorClass = NOTE_CATEGORY_COLORS[note.category];
            return (
              <WorkspaceCard
                key={note.id}
                accentBarClass={colorClass.replace("text-", "bg-")}
                className="pl-4"
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(isOpen ? null : note.id)}
                  className="flex w-full items-center gap-2.5 border-none bg-transparent px-4 py-3 text-left text-dash-primary"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[13px] font-semibold">{note.title}</span>
                      <Pill
                        label={NOTE_CATEGORY_LABELS[note.category]}
                        className={`${colorClass} border-current/30 bg-current/10`}
                        small
                      />
                      {note.isCode && (
                        <Pill
                          label="Code"
                          className="border-blue-500/30 bg-blue-500/10 text-blue-400"
                          small
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <div className="hidden flex-wrap gap-1 sm:flex">
                      {note.tags.map((t) => (
                        <Pill
                          key={t}
                          label={t}
                          className={`${colorClass} border-current/30 bg-current/10`}
                          small
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-dash-faint">{isOpen ? "▲" : "▼"}</span>
                  </div>
                </button>
                {isOpen && (
                  <div className="border-t border-dash-border px-4 py-3 pl-5">
                    <pre
                      className={`m-0 whitespace-pre-wrap break-words text-[12.5px] leading-relaxed ${
                        note.isCode
                          ? "rounded-lg border border-dash-success/20 bg-dash-success/5 p-3 font-dash-mono text-dash-success"
                          : "text-dash-secondary"
                      }`}
                    >
                      {note.content}
                    </pre>
                    <div className="mt-2.5 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleDelete(note.id)}
                        className="rounded-md border border-dash-danger/20 bg-dash-danger/10 px-3 py-1 font-dash-mono text-[10px] text-dash-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </WorkspaceCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
