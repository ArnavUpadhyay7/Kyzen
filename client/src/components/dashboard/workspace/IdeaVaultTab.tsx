import { useCallback, useEffect, useMemo, useState } from "react";
import type { IdeaCategory, WorkspaceIdea } from "../../../api/workspace.api";
import { workspaceApi } from "../../../api/workspace.api";
import { toast } from "../../ui/Toast";
import {
  IDEA_CATEGORIES,
  IDEA_CATEGORY_COLORS,
  IDEA_CATEGORY_LABELS,
} from "./constants";
import {
  AccentButton,
  EmptyState,
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
import { formatRelativeTime } from "./utils";

interface IdeaForm {
  title: string;
  category: IdeaCategory;
  problem: string;
  tags: string;
}

const EMPTY_FORM: IdeaForm = {
  title: "",
  category: "PROJECT",
  problem: "",
  tags: "",
};

export default function IdeaVaultTab() {
  const [ideas, setIdeas] = useState<WorkspaceIdea[]>([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<IdeaForm>(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setIdeas(await workspaceApi.ideas.getAll());
    } catch {
      toast("Failed to load ideas", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return ideas.filter(
      (idea) =>
        idea.title.toLowerCase().includes(q) ||
        idea.tags.some((t) => t.toLowerCase().includes(q)) ||
        idea.category.toLowerCase().includes(q)
    );
  }, [ideas, search]);

  function startEdit(idea: WorkspaceIdea) {
    setEditingId(idea.id);
    setForm({
      title: idea.title,
      category: idea.category,
      problem: idea.problem ?? "",
      tags: idea.tags.join(", "),
    });
    setShowForm(true);
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(false);
  }

  async function handleSave() {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
      const payload = {
        title: form.title.trim(),
        category: form.category,
        problem: form.problem.trim() || undefined,
        tags,
      };
      if (editingId) {
        const updated = await workspaceApi.ideas.update(editingId, payload);
        setIdeas((prev) => prev.map((i) => (i.id === editingId ? updated : i)));
        toast("Idea updated");
      } else {
        const created = await workspaceApi.ideas.create(payload);
        setIdeas((prev) => [created, ...prev]);
        toast("Idea saved");
      }
      resetForm();
    } catch {
      toast("Failed to save idea", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await workspaceApi.ideas.delete(id);
      setIdeas((prev) => prev.filter((i) => i.id !== id));
      if (editingId === id) resetForm();
      toast("Idea deleted");
    } catch {
      toast("Failed to delete idea", "error");
    }
  }

  if (loading) return <LoadingState message="Loading ideas…" />;

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-start gap-3">
        <div className="min-w-[200px] flex-1">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search ideas, tags, categories…"
          />
        </div>
        <AccentButton onClick={() => { resetForm(); setShowForm(true); }}>
          + New Idea
        </AccentButton>
      </div>

      {showForm && (
        <WorkspaceCard topGlow className="mb-5 p-5">
          <h3 className="mb-3.5 text-[13px] font-semibold text-white">
            {editingId ? "Edit Idea" : "New Idea"}
          </h3>
          <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <FormLabel>Title</FormLabel>
              <FormInput
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="Your brilliant idea"
              />
            </div>
            <div>
              <FormLabel>Category</FormLabel>
              <FormSelect
                value={form.category}
                onChange={(e) =>
                  setForm((p) => ({ ...p, category: e.target.value as IdeaCategory }))
                }
              >
                {IDEA_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {IDEA_CATEGORY_LABELS[c]}
                  </option>
                ))}
              </FormSelect>
            </div>
          </div>
          <div className="mb-3">
            <FormLabel>Problem it solves</FormLabel>
            <FormTextarea
              rows={2}
              value={form.problem}
              onChange={(e) => setForm((p) => ({ ...p, problem: e.target.value }))}
              placeholder="What problem does this solve?"
            />
          </div>
          <div className="mb-3.5">
            <FormLabel>Tags (comma-separated)</FormLabel>
            <FormInput
              value={form.tags}
              onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
              placeholder="AI, Startup, CLI"
            />
          </div>
          <div className="flex gap-2">
            <PrimaryButton className="w-auto px-5" loading={saving} onClick={handleSave}>
              Save Idea
            </PrimaryButton>
            <SecondaryButton onClick={resetForm}>Cancel</SecondaryButton>
          </div>
        </WorkspaceCard>
      )}

      {filtered.length === 0 ? (
        <EmptyState message="No ideas found." />
      ) : (
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((idea) => {
            const colorClass = IDEA_CATEGORY_COLORS[idea.category];
            return (
              <WorkspaceCard key={idea.id} topGlow className="p-4 pl-5">
                <div className="mb-2.5 flex items-start justify-between gap-2">
                  <Pill
                    label={IDEA_CATEGORY_LABELS[idea.category]}
                    className={`${colorClass} bg-current/10 border-current/30`}
                    small
                  />
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => startEdit(idea)}
                      className="rounded-md border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 font-mono text-[10px] text-violet-400"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(idea.id)}
                      className="rounded-md border border-red-500/20 bg-red-500/10 px-2 py-0.5 font-mono text-[10px] text-red-400"
                    >
                      Del
                    </button>
                  </div>
                </div>
                <h3 className={`mb-1.5 text-sm font-semibold ${colorClass}`}>{idea.title}</h3>
                {idea.problem && (
                  <p className="mb-2.5 text-[12.5px] leading-relaxed text-white/40">{idea.problem}</p>
                )}
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {idea.tags.map((tag) => (
                    <Pill key={tag} label={tag} className={`${colorClass} bg-current/10 border-current/30`} small />
                  ))}
                </div>
                <p className="font-mono text-[10px] text-white/20">
                  🕐 {formatRelativeTime(idea.createdAt)}
                </p>
              </WorkspaceCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
