import { useCallback, useEffect, useState } from "react";
import type { WorkspaceProject } from "../../../api/workspace.api";
import { workspaceApi } from "../../../api/workspace.api";
import { toast } from "../../ui/Toast";
import { PROJECT_STATUS_COLORS, PROJECT_STATUS_LABELS } from "./constants";
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
  ProgressBar,
  SectionHeader,
  SecondaryButton,
  WorkspaceCard,
} from "./ui";

const PROJECT_COLORS = ["text-violet-400", "text-emerald-400", "text-amber-400", "text-blue-400"];

function StatusBadge({ status }: { status: WorkspaceProject["status"] }) {
  return (
    <Pill label={PROJECT_STATUS_LABELS[status]} className={PROJECT_STATUS_COLORS[status]} small />
  );
}

export default function ProjectPlannerTab() {
  const [projects, setProjects] = useState<WorkspaceProject[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    mvp: "",
    stretch: "",
    tech: "",
    status: "PLANNING" as WorkspaceProject["status"],
    progress: 0,
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await workspaceApi.projects.getAll();
      setProjects(data);
      setSelectedId((prev) => prev ?? data[0]?.id ?? null);
    } catch {
      toast("Failed to load projects", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const selected = projects.find((p) => p.id === selectedId) ?? null;

  async function handleCreate() {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const created = await workspaceApi.projects.create({
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        mvp: form.mvp.split(",").map((s) => s.trim()).filter(Boolean),
        stretch: form.stretch.split(",").map((s) => s.trim()).filter(Boolean),
        tech: form.tech.split(",").map((s) => s.trim()).filter(Boolean),
        status: form.status,
        progress: form.progress,
      });
      setProjects((prev) => [created, ...prev]);
      setSelectedId(created.id);
      setShowForm(false);
      setForm({ name: "", description: "", mvp: "", stretch: "", tech: "", status: "PLANNING", progress: 0 });
      toast("Project created");
    } catch {
      toast("Failed to create project", "error");
    } finally {
      setSaving(false);
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
          <h3 className="mb-3.5 text-[13px] font-semibold text-white">New Project</h3>
          <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <FormLabel>Name</FormLabel>
              <FormInput value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
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
                  <option key={value} value={value}>{label}</option>
                ))}
              </FormSelect>
            </div>
          </div>
          <div className="mb-3">
            <FormLabel>Description</FormLabel>
            <FormTextarea rows={2} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
          </div>
          <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <FormLabel>MVP (comma-separated)</FormLabel>
              <FormInput value={form.mvp} onChange={(e) => setForm((p) => ({ ...p, mvp: e.target.value }))} />
            </div>
            <div>
              <FormLabel>Stretch goals</FormLabel>
              <FormInput value={form.stretch} onChange={(e) => setForm((p) => ({ ...p, stretch: e.target.value }))} />
            </div>
            <div>
              <FormLabel>Tech stack</FormLabel>
              <FormInput value={form.tech} onChange={(e) => setForm((p) => ({ ...p, tech: e.target.value }))} />
            </div>
          </div>
          <div className="flex gap-2">
            <PrimaryButton className="w-auto px-5" loading={saving} onClick={handleCreate}>Create</PrimaryButton>
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
                const color = PROJECT_COLORS[idx % PROJECT_COLORS.length];
                const barColor = color.replace("text-", "bg-");
                const isSelected = selectedId === project.id;
                return (
                  <WorkspaceCard
                    key={project.id}
                    onClick={() => setSelectedId(project.id)}
                    accentBarClass={isSelected ? barColor : undefined}
                    className={`p-3.5 pl-4 ${isSelected ? "border-violet-500/30 shadow-lg shadow-violet-500/10" : ""}`}
                  >
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className={`text-[13px] font-semibold ${isSelected ? color : "text-white"}`}>{project.name}</span>
                      <StatusBadge status={project.status} />
                    </div>
                    {project.description && (
                      <p className="mb-2.5 text-xs leading-relaxed text-white/40">{project.description}</p>
                    )}
                    <ProgressBar value={project.progress} barClassName={barColor} />
                    <p className="mt-1 font-mono text-[10px] text-white/20">{project.progress}% complete</p>
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
                      <h2 className="text-xl font-bold text-violet-400">{selected.name}</h2>
                      <StatusBadge status={selected.status} />
                    </div>
                    {selected.description && (
                      <p className="text-[13px] leading-relaxed text-white/40">{selected.description}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-3xl font-extrabold leading-none text-violet-400">{selected.progress}%</div>
                    <p className="mt-0.5 font-mono text-[9px] tracking-widest text-white/20">PROGRESS</p>
                  </div>
                </div>
                <ProgressBar value={selected.progress} className="h-1.5" />
                <div className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  {selected.why && (
                    <div className="rounded-xl border border-indigo-500/15 bg-white/[0.02] p-3.5">
                      <p className="mb-2 font-mono text-[9px] font-semibold uppercase tracking-widest text-violet-400/80">❓ Why Build This?</p>
                      <p className="text-[13px] leading-relaxed text-white/75">{selected.why}</p>
                    </div>
                  )}
                  {selected.tech.length > 0 && (
                    <div className="rounded-xl border border-indigo-500/15 bg-white/[0.02] p-3.5">
                      <p className="mb-2 font-mono text-[9px] font-semibold uppercase tracking-widest text-violet-400/80">🛠 Tech Stack</p>
                      <div className="flex flex-wrap gap-1.5">
                        {selected.tech.map((t) => (
                          <Pill key={t} label={t} className="text-violet-400 bg-violet-500/10 border-violet-500/30" small />
                        ))}
                      </div>
                    </div>
                  )}
                  {selected.mvp.length > 0 && (
                    <div className="rounded-xl border border-indigo-500/15 bg-white/[0.02] p-3.5">
                      <p className="mb-2 font-mono text-[9px] font-semibold uppercase tracking-widest text-emerald-400/80">🎯 MVP Features</p>
                      <ul className="m-0 list-disc pl-4">
                        {selected.mvp.map((item) => (
                          <li key={item} className="text-[13px] leading-relaxed text-white/75">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {selected.stretch.length > 0 && (
                    <div className="rounded-xl border border-indigo-500/15 bg-white/[0.02] p-3.5">
                      <p className="mb-2 font-mono text-[9px] font-semibold uppercase tracking-widest text-amber-400/80">✨ Stretch Goals</p>
                      <ul className="m-0 list-disc pl-4">
                        {selected.stretch.map((item) => (
                          <li key={item} className="text-[13px] leading-relaxed text-white/75">{item}</li>
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
