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
    <div className="flex min-h-full w-full flex-col">
      {/* Page header — matches dashboard header style */}
      <div className="border-b border-dash-border bg-dash-surface px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-dash-accent-border bg-dash-accent-soft text-sm">
              🧠
            </div>
            <div>
              <h1 className="text-sm font-semibold text-dash-primary font-dash-sans">Workspace</h1>
              <p className="font-dash-mono text-[10px] tracking-widest text-dash-faint uppercase">
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
        </div>

        {/* Tab nav — sits inside the header bar, flush below title */}
        <nav className="mt-4 flex items-center gap-0.5">
          {WORKSPACE_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-dash-mono text-[11px] font-semibold tracking-wide transition-all",
                activeTab === tab.id
                  ? "border border-dash-accent-border bg-dash-accent-soft text-dash-violet"
                  : "border border-transparent text-dash-muted hover:bg-dash-card-alt hover:text-dash-secondary",
              )}
            >
              <span className="text-[12px]">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content — full width, consistent padding */}
      <div className="flex-1 p-6">
        {activeTab === "battlelog" && <BattleLogTab />}
        {activeTab === "ideavault" && <IdeaVaultTab />}
        {activeTab === "projects" && <ProjectPlannerTab />}
        {activeTab === "inspiration" && <InspirationTab />}
        {activeTab === "knowledge" && <KnowledgeVaultTab />}
      </div>
    </div>
  );
}