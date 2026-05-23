import { useState } from "react";
import { cn } from "../../lib/utils";
import BattleLogTab from "../../components/dashboard/workspace/BattleLogTab";
import IdeaVaultTab from "../../components/dashboard/workspace/IdeaVaultTab";
import InspirationTab from "../../components/dashboard/workspace/InspirationTab";
import KnowledgeVaultTab from "../../components/dashboard/workspace/KnowledgeVaultTab";
import ProjectPlannerTab from "../../components/dashboard/workspace/ProjectPlannerTab";
import {
  WORKSPACE_TABS,
  type WorkspaceTabId,
} from "../../components/dashboard/workspace/constants";

export default function KyzenWorkspace() {
  const [activeTab, setActiveTab] = useState<WorkspaceTabId>("battlelog");

  return (
    <div className="min-h-full w-full p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-dash-accent-border bg-dash-accent-soft text-base">
              🧠
            </div>
            <div>
              <h1 className="bg-gradient-to-br from-dash-primary to-dash-violet bg-clip-text text-base font-bold text-transparent font-dash-sans">
                Workspace
              </h1>
              <p className="font-dash-mono text-[11px] tracking-wide text-dash-faint">
                Think · Plan · Remember
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-dash-success shadow-[0_0_8px_var(--dash-success)]" />
            <span className="font-dash-mono text-[11px] text-dash-faint">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </header>

        <nav className="mb-7 inline-flex flex-wrap gap-0.5 rounded-xl border border-dash-border bg-dash-card-alt p-1">
          {WORKSPACE_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 font-dash-mono text-xs font-semibold tracking-wide transition-all",
                activeTab === tab.id
                  ? "border border-dash-accent-border bg-dash-accent-soft text-dash-violet shadow-md shadow-dash-accent/10"
                  : "border border-transparent text-dash-muted hover:text-dash-secondary",
              )}
            >
              <span className="text-[13px]">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        {activeTab === "battlelog" && <BattleLogTab />}
        {activeTab === "ideavault" && <IdeaVaultTab />}
        {activeTab === "projects" && <ProjectPlannerTab />}
        {activeTab === "inspiration" && <InspirationTab />}
        {activeTab === "knowledge" && <KnowledgeVaultTab />}
      </div>
    </div>
  );
}
