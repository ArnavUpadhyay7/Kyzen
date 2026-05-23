import { useCallback, useEffect, useMemo, useState } from "react";
import type { NoteCategory, WorkspaceNote } from "../../../api/workspace.api";
import { workspaceApi } from "../../../api/workspace.api";
import { toast } from "../../ui/Toast";
import {
  NOTE_CATEGORIES,
  NOTE_CATEGORY_COLORS,
  NOTE_CATEGORY_LABELS,
} from "./constants";
import {
  AccentButton,
  EmptyState,
  FormInput,
  FormLabel,
  FormSelect,
  FormTextarea,
  FilterChip,
  LoadingState,
  Pill,
  PrimaryButton,
  SearchBar,
  SecondaryButton,
  WorkspaceCard,
} from "./ui";

export default function KnowledgeVaultTab() {
  const [notes, setNotes] = useState<WorkspaceNote[]>([]);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<NoteCategory | "All">("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    category: "DSA" as NoteCategory,
    title: "",
    content: "",
    tags: "",
    isCode: false,
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await workspaceApi.notes.getAll();
      setNotes(data);
      setExpandedId((prev) => prev ?? data[0]?.id ?? null);
    } catch {
      toast("Failed to load notes", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

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
    setSaving(true);
    try {
      const created = await workspaceApi.notes.create({
        category: form.category,
        title: form.title.trim(),
        content: form.content.trim(),
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        isCode: form.isCode,
      });
      setNotes((prev) => [created, ...prev]);
      setExpandedId(created.id);
      setForm({ category: "DSA", title: "", content: "", tags: "", isCode: false });
      setShowForm(false);
      toast("Note saved");
    } catch {
      toast("Failed to save note", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await workspaceApi.notes.delete(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
      if (expandedId === id) setExpandedId(null);
      toast("Note deleted");
    } catch {
      toast("Failed to delete note", "error");
    }
  }

  if (loading) return <LoadingState message="Loading notes…" />;

  return (
    <div>
      <div className="mb-3.5 flex flex-wrap gap-2.5">
        <div className="min-w-[200px] flex-1">
          <SearchBar value={search} onChange={setSearch} placeholder="Search notes, commands, patterns…" />
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
                ? `${NOTE_CATEGORY_COLORS[c as NoteCategory]} bg-current/10 border-current/30`
                : undefined
            }
          >
            {c === "All" ? c : NOTE_CATEGORY_LABELS[c as NoteCategory]}
          </FilterChip>
        ))}
      </div>

      {showForm && (
        <WorkspaceCard topGlow className="mb-5 p-5">
          <h3 className="mb-3.5 text-[13px] font-semibold text-white">New Note</h3>
          <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <FormLabel>Title</FormLabel>
              <FormInput value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
            </div>
            <div>
              <FormLabel>Category</FormLabel>
              <FormSelect
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value as NoteCategory }))}
              >
                {NOTE_CATEGORIES.filter((c) => c !== "All").map((c) => (
                  <option key={c} value={c}>{NOTE_CATEGORY_LABELS[c as NoteCategory]}</option>
                ))}
              </FormSelect>
            </div>
          </div>
          <div className="mb-3">
            <FormLabel>Content</FormLabel>
            <FormTextarea rows={6} value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} />
          </div>
          <div className="mb-3 flex items-center gap-4">
            <div className="flex-1">
              <FormLabel>Tags (comma-separated)</FormLabel>
              <FormInput value={form.tags} onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))} />
            </div>
            <label className="flex cursor-pointer items-center gap-2 pt-5 text-xs text-white/40">
              <input
                type="checkbox"
                checked={form.isCode}
                onChange={(e) => setForm((p) => ({ ...p, isCode: e.target.checked }))}
                className="accent-violet-500"
              />
              Code block
            </label>
          </div>
          <div className="flex gap-2">
            <PrimaryButton className="w-auto px-5" loading={saving} onClick={handleCreate}>Save Note</PrimaryButton>
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
              <WorkspaceCard key={note.id} accentBarClass={colorClass.replace("text-", "bg-")} className="pl-4">
                <button
                  type="button"
                  onClick={() => setExpandedId(isOpen ? null : note.id)}
                  className="flex w-full items-center gap-2.5 border-none bg-transparent px-4 py-3 text-left text-white"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[13px] font-semibold">{note.title}</span>
                      <Pill label={NOTE_CATEGORY_LABELS[note.category]} className={`${colorClass} bg-current/10 border-current/30`} small />
                      {note.isCode && (
                        <Pill label="Code" className="text-blue-400 bg-blue-500/10 border-blue-500/30" small />
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <div className="hidden flex-wrap gap-1 sm:flex">
                      {note.tags.map((t) => (
                        <Pill key={t} label={t} className={`${colorClass} bg-current/10 border-current/30`} small />
                      ))}
                    </div>
                    <span className="text-[11px] text-white/20">{isOpen ? "▲" : "▼"}</span>
                  </div>
                </button>
                {isOpen && (
                  <div className="border-t border-indigo-500/15 px-4 py-3 pl-5">
                    <pre
                      className={`m-0 whitespace-pre-wrap break-words text-[12.5px] leading-relaxed ${
                        note.isCode
                          ? "rounded-lg border border-emerald-500/20 bg-emerald-500/[0.04] p-3 font-mono text-emerald-400"
                          : "text-white/75"
                      }`}
                    >
                      {note.content}
                    </pre>
                    <div className="mt-2.5 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleDelete(note.id)}
                        className="rounded-md border border-red-500/20 bg-red-500/10 px-3 py-1 font-mono text-[10px] text-red-400"
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
