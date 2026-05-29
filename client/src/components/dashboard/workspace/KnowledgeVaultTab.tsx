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
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
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
      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="min-w-50 flex-1">
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

      {/* Category filters */}
      <div className="mb-5 flex flex-wrap gap-1.5">
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
            {c === "All" ? "All" : NOTE_CATEGORY_LABELS[c as NoteCategory]}
          </FilterChip>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <WorkspaceCard topGlow className="mb-6 p-5">
          <h3 className="mb-4 text-[13px] font-semibold text-dash-primary">New Note</h3>
          <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <FormLabel>Title</FormLabel>
              <FormInput
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="Note title"
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
              placeholder="Write your note here…"
            />
          </div>
          <div className="mb-4 flex items-end gap-4">
            <div className="flex-1">
              <FormLabel>Tags (comma-separated)</FormLabel>
              <FormInput
                value={form.tags}
                onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
                placeholder="array, sorting, O(n)"
              />
            </div>
            <label className="mb-0.5 flex cursor-pointer items-center gap-2 text-[12px] text-dash-muted">
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
            <PrimaryButton className="w-auto px-6" loading={saving} onClick={handleCreate}>
              Save Note
            </PrimaryButton>
            <SecondaryButton onClick={() => setShowForm(false)}>Cancel</SecondaryButton>
          </div>
        </WorkspaceCard>
      )}

      {/* Notes list */}
      {filtered.length === 0 ? (
        <EmptyState message="No notes found." />
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((note) => {
            const isOpen = expandedId === note.id;
            const colorClass = NOTE_CATEGORY_COLORS[note.category];
            // Convert text-* to bg-* for the accent bar
            const barClass = colorClass.replace("text-", "bg-");

            return (
              <WorkspaceCard
                key={note.id}
                accentBarClass={barClass}
                className="pl-4"
              >
                {/* Row header */}
                <button
                  type="button"
                  onClick={() => setExpandedId(isOpen ? null : note.id)}
                  className="flex w-full items-center gap-3 bg-transparent px-4 py-3 text-left"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[13px] font-semibold text-dash-primary">
                        {note.title}
                      </span>
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
                    <span className="text-[10px] text-dash-faint">{isOpen ? "▲" : "▼"}</span>
                  </div>
                </button>

                {/* Expanded content */}
                {isOpen && (
                  <div className="border-t border-dash-border px-5 py-4">
                    <pre
                      className={`m-0 whitespace-pre-wrap wrap-break-words text-[13px] leading-relaxed ${
                        note.isCode
                          ? "rounded-lg border border-dash-success/20 bg-dash-success/5 p-4 font-dash-mono text-dash-success"
                          : "font-dash-sans text-dash-secondary"
                      }`}
                    >
                      {note.content}
                    </pre>

                    {/* Mobile tags */}
                    {note.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5 sm:hidden">
                        {note.tags.map((t) => (
                          <Pill
                            key={t}
                            label={t}
                            className={`${colorClass} border-current/30 bg-current/10`}
                            small
                          />
                        ))}
                      </div>
                    )}

                    <div className="mt-3 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleDelete(note.id)}
                        className="rounded-md border border-dash-danger/20 bg-dash-danger/10 px-3 py-1 font-dash-mono text-[10px] text-dash-danger transition-colors hover:bg-dash-danger/20"
                      >
                        Delete note
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