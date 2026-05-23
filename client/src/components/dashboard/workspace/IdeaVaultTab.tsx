import { useMemo, useState } from "react";
import type { IdeaCategory, WorkspaceIdea } from "../../../api/workspace.api";
import { useWorkspaceIdeas } from "../../../hooks/workspace";
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

function IdeaCard({
  idea,
  onEdit,
  onDelete,
}: {
  idea: WorkspaceIdea;
  onEdit: (idea: WorkspaceIdea) => void;
  onDelete: (id: string) => void;
}) {
  const colorClass = IDEA_CATEGORY_COLORS[idea.category];

  return (
    <WorkspaceCard className="flex flex-col gap-3 p-4">
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <Pill
          label={IDEA_CATEGORY_LABELS[idea.category]}
          className={`${colorClass} border-current/30 bg-current/10`}
          small
        />
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onEdit(idea)}
            className="rounded-md border border-dash-border bg-dash-card-alt px-2 py-0.5 font-dash-mono text-[10px] text-dash-muted transition-colors hover:border-dash-accent-border hover:text-dash-violet"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(idea.id)}
            className="rounded-md border border-dash-danger/20 bg-dash-danger/10 px-2 py-0.5 font-dash-mono text-[10px] text-dash-danger transition-colors hover:bg-dash-danger/20"
          >
            Del
          </button>
        </div>
      </div>

      {/* Title */}
      <h3 className={`text-[13px] font-semibold leading-snug ${colorClass}`}>{idea.title}</h3>

      {/* Problem */}
      {idea.problem && (
        <p className="text-[12.5px] leading-relaxed text-dash-muted">{idea.problem}</p>
      )}

      {/* Tags */}
      {idea.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {idea.tags.map((tag) => (
            <Pill
              key={tag}
              label={tag}
              className={`${colorClass} border-current/30 bg-current/10`}
              small
            />
          ))}
        </div>
      )}

      {/* Footer */}
      <p className="mt-auto font-dash-mono text-[10px] text-dash-faint">
        🕐 {formatRelativeTime(idea.createdAt)}
      </p>
    </WorkspaceCard>
  );
}

export default function IdeaVaultTab() {
  const { items: ideas, loading, saving, create, update, remove } = useWorkspaceIdeas();
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<IdeaForm>(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return ideas.filter(
      (idea) =>
        idea.title.toLowerCase().includes(q) ||
        idea.tags.some((t) => t.toLowerCase().includes(q)) ||
        idea.category.toLowerCase().includes(q),
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
    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const payload = {
      title: form.title.trim(),
      category: form.category,
      problem: form.problem.trim() || undefined,
      tags,
    };
    const result = editingId ? await update(editingId, payload) : await create(payload);
    if (result) resetForm();
  }

  async function handleDelete(id: string) {
    const ok = await remove(id);
    if (ok && editingId === id) resetForm();
  }

  if (loading) return <LoadingState message="Loading ideas…" />;

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="min-w-[200px] flex-1">
          <SearchBar value={search} onChange={setSearch} placeholder="Search ideas, tags, categories…" />
        </div>
        <AccentButton
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          + New Idea
        </AccentButton>
      </div>

      {/* Form */}
      {showForm && (
        <WorkspaceCard topGlow className="mb-6 p-5">
          <h3 className="mb-4 text-[13px] font-semibold text-dash-primary">
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
          <div className="mb-4">
            <FormLabel>Tags (comma-separated)</FormLabel>
            <FormInput
              value={form.tags}
              onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
              placeholder="AI, Startup, CLI"
            />
          </div>
          <div className="flex gap-2">
            <PrimaryButton className="w-auto px-6" loading={saving} onClick={handleSave}>
              {editingId ? "Update Idea" : "Save Idea"}
            </PrimaryButton>
            <SecondaryButton onClick={resetForm}>Cancel</SecondaryButton>
          </div>
        </WorkspaceCard>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState message="No ideas found. Add your first one!" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} onEdit={startEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}