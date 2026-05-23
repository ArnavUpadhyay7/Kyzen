import { useEffect, useState } from "react";
import type { WorkspaceProject } from "../../../api/workspace.api";
import { useWorkspaceProjects } from "../../../hooks/workspace";
import { PROJECT_STATUS_COLORS, PROJECT_STATUS_LABELS } from "./constants";
import {
  AccentButton,
  DashboardProgress,
  EmptyState,
  FormInput,
  FormLabel,
  FormSelect,
  FormTextarea,
  LoadingState,
  Pill,
  PrimaryButton,
  SectionHeader,
  SecondaryButton,
  WorkspaceCard,
} from "./ui";

const PROJECT_ACCENT = [
  { text: "text-dash-violet", bar: "bg-dash-violet" },
  { text: "text-dash-success", bar: "bg-dash-success" },
  { text: "text-dash-warning", bar: "bg-dash-warning" },
  { text: "text-blue-400", bar: "bg-blue-400" },
] as const;

function StatusBadge({ status }: { status: WorkspaceProject["status"] }) {
  return (
    <Pill label={PROJECT_STATUS_LABELS[status]} className={PROJECT_STATUS_COLORS[status]} small />
  );
}

export default function ProjectPlannerTab() {
  const { items: projects, loading, saving, create } = useWorkspaceProjects();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    mvp: "",
    stretch: "",
    tech: "",
    status: "PLANNING" as WorkspaceProject["status"],
    progress: 0,
  });

  useEffect(() => {
    if (!selectedId && projects.length > 0) {
      setSelectedId(projects[0].id);
    }
  }, [projects, selectedId]);

  const selected = projects.find((p) => p.id === selectedId) ?? null;

  async function handleCreate() {
    if (!form.name.trim()) return;
    const created = await create({
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      mvp: form.mvp.split(",").map((s) => s.trim()).filter(Boolean),
      stretch: form.stretch.split(",").map((s) => s.trim()).filter(Boolean),
      tech: form.tech.split(",").map((s) => s.trim()).filter(Boolean),
      status: form.status,
      progress: form.progress,
    });
    if (created) {
      setSelectedId(created.id);
      setShowForm(false);
      setForm({
        name: "",
        description: "",
        mvp: "",
        stretch: "",
        tech: "",
        status: "PLANNING",
        progress: 0,
      });
    }
  }

  if (loading) return <LoadingState message="Loading projects…" />;

  return (
    <div>
      <div className="mb-5 flex justify-end">
        <AccentButton onClick={() => setShowForm((p) => !p)}>+ New Project</AccentButton>
      </div>

      {showForm && (
        <WorkspaceCard topGlow className="mb-5 p-5">
          <h3 className="mb-3.5 text-[13px] font-semibold text-dash-primary">New Project</h3>
          <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <FormLabel>Name</FormLabel>
              <FormInput
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div>
              <FormLabel>Status</FormLabel>
              <FormSelect
                value={form.status}
                onChange={(e) =>
                  setForm((p) => ({ ...p, status: e.target.value as WorkspaceProject["status"] }))
                }
              >
                {Object.entries(PROJECT_STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </FormSelect>
            </div>
          </div>
          <div className="mb-3">
            <FormLabel>Description</FormLabel>
            <FormTextarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            />
          </div>
          <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <FormLabel>MVP (comma-separated)</FormLabel>
              <FormInput
                value={form.mvp}
                onChange={(e) => setForm((p) => ({ ...p, mvp: e.target.value }))}
              />
            </div>
            <div>
              <FormLabel>Stretch goals</FormLabel>
              <FormInput
                value={form.stretch}
                onChange={(e) => setForm((p) => ({ ...p, stretch: e.target.value }))}
              />
            </div>
            <div>
              <FormLabel>Tech stack</FormLabel>
              <FormInput
                value={form.tech}
                onChange={(e) => setForm((p) => ({ ...p, tech: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <PrimaryButton className="w-auto px-5" loading={saving} onClick={handleCreate}>
              Create
            </PrimaryButton>
            <SecondaryButton onClick={() => setShowForm(false)}>Cancel</SecondaryButton>
          </div>
        </WorkspaceCard>
      )}

      {projects.length === 0 ? (
        <EmptyState message="No projects yet. Create your first one!" />
      ) : (
        <div className="flex flex-col items-start gap-6 lg:flex-row">
          <div className="w-full shrink-0 lg:w-[280px]">
            <SectionHeader title="Projects" count={projects.length} />
            <div className="flex flex-col gap-2">
              {projects.map((project, idx) => {
                const accent = PROJECT_ACCENT[idx % PROJECT_ACCENT.length];
                const isSelected = selectedId === project.id;
                return (
                  <WorkspaceCard
                    key={project.id}
                    onClick={() => setSelectedId(project.id)}
                    accentBarClass={isSelected ? accent.bar : undefined}
                    className={`p-3.5 pl-4 ${
                      isSelected ? "border-dash-accent-border shadow-lg shadow-dash-accent/10" : ""
                    }`}
                  >
                    <div className="mb-1.5 flex items-center justify-between">
                      <span
                        className={`text-[13px] font-semibold ${
                          isSelected ? accent.text : "text-dash-primary"
                        }`}
                      >
                        {project.name}
                      </span>
                      <StatusBadge status={project.status} />
                    </div>
                    {project.description && (
                      <p className="mb-2.5 text-xs leading-relaxed text-dash-muted">
                        {project.description}
                      </p>
                    )}
                    <DashboardProgress value={project.progress} className="h-1" />
                    <p className="mt-1 font-dash-mono text-[10px] text-dash-faint">
                      {project.progress}% complete
                    </p>
                  </WorkspaceCard>
                );
              })}
            </div>
          </div>

          {selected && (
            <div className="min-w-0 flex-1">
              <WorkspaceCard topGlow className="p-5 sm:p-6">
                <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div>
                    <div className="mb-1 flex flex-wrap items-center gap-2.5">
                      <h2 className="text-xl font-bold text-dash-violet">{selected.name}</h2>
                      <StatusBadge status={selected.status} />
                    </div>
                    {selected.description && (
                      <p className="text-[13px] leading-relaxed text-dash-muted">
                        {selected.description}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-dash-mono text-3xl font-extrabold leading-none text-dash-violet">
                      {selected.progress}%
                    </div>
                    <p className="mt-0.5 font-dash-mono text-[9px] tracking-widest text-dash-faint">
                      PROGRESS
                    </p>
                  </div>
                </div>
                <DashboardProgress value={selected.progress} className="h-1.5" />
                <div className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  {selected.why && (
                    <div className="rounded-xl border border-dash-border bg-dash-card-alt p-3.5">
                      <p className="mb-2 font-dash-mono text-[9px] font-semibold uppercase tracking-widest text-dash-violet/80">
                        ❓ Why Build This?
                      </p>
                      <p className="text-[13px] leading-relaxed text-dash-secondary">{selected.why}</p>
                    </div>
                  )}
                  {selected.tech.length > 0 && (
                    <div className="rounded-xl border border-dash-border bg-dash-card-alt p-3.5">
                      <p className="mb-2 font-dash-mono text-[9px] font-semibold uppercase tracking-widest text-dash-violet/80">
                        🛠 Tech Stack
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {selected.tech.map((t) => (
                          <Pill
                            key={t}
                            label={t}
                            className="border-dash-accent-border bg-dash-accent-soft text-dash-violet"
                            small
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {selected.mvp.length > 0 && (
                    <div className="rounded-xl border border-dash-border bg-dash-card-alt p-3.5">
                      <p className="mb-2 font-dash-mono text-[9px] font-semibold uppercase tracking-widest text-dash-success/80">
                        🎯 MVP Features
                      </p>
                      <ul className="m-0 list-disc pl-4">
                        {selected.mvp.map((item) => (
                          <li key={item} className="text-[13px] leading-relaxed text-dash-secondary">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {selected.stretch.length > 0 && (
                    <div className="rounded-xl border border-dash-border bg-dash-card-alt p-3.5">
                      <p className="mb-2 font-dash-mono text-[9px] font-semibold uppercase tracking-widest text-dash-warning/80">
                        ✨ Stretch Goals
                      </p>
                      <ul className="m-0 list-disc pl-4">
                        {selected.stretch.map((item) => (
                          <li key={item} className="text-[13px] leading-relaxed text-dash-secondary">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </WorkspaceCard>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
