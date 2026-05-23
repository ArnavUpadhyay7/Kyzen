import api from "../lib/axios";
import type { RawDashboard } from "./dashboard.api";

export type Mood =
  | "LOCKED_IN"
  | "GOOD"
  | "TIRED"
  | "BURNED_OUT"
  | "DISTRACTED";

export type IdeaCategory = "PROJECT" | "STARTUP" | "TOOL" | "EXPERIMENT";
export type ProjectStatus = "PLANNING" | "BUILDING" | "SHIPPING" | "PAUSED";
export type InspirationType = "UI" | "REPO" | "DESIGN" | "CONCEPT";
export type NoteCategory = "DSA" | "COMMAND" | "INTERVIEW" | "LEARNING";

export interface BattleLog {
  id: string;
  date: string;
  mood: Mood;
  completed: string | null;
  win: string | null;
  learned: string | null;
  bug: string | null;
  tomorrow: string | null;
  xpEarned: number;
  userLevel: number;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceIdea {
  id: string;
  title: string;
  category: IdeaCategory;
  problem: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceProject {
  id: string;
  name: string;
  description: string | null;
  why: string | null;
  mvp: string[];
  stretch: string[];
  tech: string[];
  status: ProjectStatus;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceInspiration {
  id: string;
  type: InspirationType;
  title: string;
  url: string;
  tag: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceNote {
  id: string;
  category: NoteCategory;
  title: string;
  content: string;
  tags: string[];
  isCode: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BattleLogPayload {
  completed?: string;
  win?: string;
  learned?: string;
  bug?: string;
  tomorrow?: string;
  mood?: Mood;
}

export interface IdeaPayload {
  title: string;
  category?: IdeaCategory;
  problem?: string;
  tags?: string[];
}

export interface ProjectPayload {
  name: string;
  description?: string;
  why?: string;
  mvp?: string[];
  stretch?: string[];
  tech?: string[];
  status?: ProjectStatus;
  progress?: number;
}

export interface InspirationPayload {
  type: InspirationType;
  title: string;
  url: string;
  tag: string;
}

export interface NotePayload {
  category: NoteCategory;
  title: string;
  content: string;
  tags?: string[];
  isCode?: boolean;
}

export interface WorkspaceCreateResponse<T> {
  item: T;
  xpGained: number;
  dashboard?: RawDashboard;
}

interface BattleLogCreateResponse {
  log: BattleLog;
  xpGained: number;
  dashboard?: RawDashboard;
}

interface BattleLogUpdateResponse {
  log: BattleLog;
  xpGained: number;
  dashboard?: RawDashboard;
}

export const workspaceApi = {
  battleLogs: {
    getAll: async (): Promise<BattleLog[]> => {
      const res = await api.get<{ logs: BattleLog[] }>("/workspace/battle-logs");
      return res.data.logs;
    },
    getToday: async (): Promise<BattleLog | null> => {
      const res = await api.get<{ log: BattleLog | null }>("/workspace/battle-logs/today");
      return res.data.log;
    },
    create: async (payload: BattleLogPayload): Promise<BattleLogCreateResponse> => {
      const res = await api.post<BattleLogCreateResponse>("/workspace/battle-logs", payload);
      return res.data;
    },
    update: async (
      id: string,
      payload: BattleLogPayload,
    ): Promise<BattleLogUpdateResponse> => {
      const res = await api.patch<BattleLogUpdateResponse>(
        `/workspace/battle-logs/${id}`,
        payload,
      );
      return res.data;
    },
    delete: async (id: string) => {
      await api.delete(`/workspace/battle-logs/${id}`);
    },
  },

  ideas: {
    getAll: async (): Promise<WorkspaceIdea[]> => {
      const res = await api.get<{ ideas: WorkspaceIdea[] }>("/workspace/ideas");
      return res.data.ideas;
    },
    create: async (payload: IdeaPayload): Promise<WorkspaceCreateResponse<WorkspaceIdea>> => {
      const res = await api.post<{
        idea: WorkspaceIdea;
        xpGained: number;
        dashboard?: RawDashboard;
      }>("/workspace/ideas", payload);
      return {
        item: res.data.idea,
        xpGained: res.data.xpGained,
        dashboard: res.data.dashboard,
      };
    },
    update: async (id: string, payload: Partial<IdeaPayload>) => {
      const res = await api.patch<{ idea: WorkspaceIdea }>(`/workspace/ideas/${id}`, payload);
      return res.data.idea;
    },
    delete: async (id: string) => {
      await api.delete(`/workspace/ideas/${id}`);
    },
  },

  projects: {
    getAll: async (): Promise<WorkspaceProject[]> => {
      const res = await api.get<{ projects: WorkspaceProject[] }>("/workspace/projects");
      return res.data.projects;
    },
    create: async (
      payload: ProjectPayload,
    ): Promise<WorkspaceCreateResponse<WorkspaceProject>> => {
      const res = await api.post<{
        project: WorkspaceProject;
        xpGained: number;
        dashboard?: RawDashboard;
      }>("/workspace/projects", payload);
      return {
        item: res.data.project,
        xpGained: res.data.xpGained,
        dashboard: res.data.dashboard,
      };
    },
    update: async (id: string, payload: Partial<ProjectPayload>) => {
      const res = await api.patch<{ project: WorkspaceProject }>(
        `/workspace/projects/${id}`,
        payload,
      );
      return res.data.project;
    },
    delete: async (id: string) => {
      await api.delete(`/workspace/projects/${id}`);
    },
  },

  inspirations: {
    getAll: async (): Promise<WorkspaceInspiration[]> => {
      const res = await api.get<{ inspirations: WorkspaceInspiration[] }>(
        "/workspace/inspirations",
      );
      return res.data.inspirations;
    },
    create: async (
      payload: InspirationPayload,
    ): Promise<WorkspaceCreateResponse<WorkspaceInspiration>> => {
      const res = await api.post<{
        inspiration: WorkspaceInspiration;
        xpGained: number;
        dashboard?: RawDashboard;
      }>("/workspace/inspirations", payload);
      return {
        item: res.data.inspiration,
        xpGained: res.data.xpGained,
        dashboard: res.data.dashboard,
      };
    },
    update: async (id: string, payload: Partial<InspirationPayload>) => {
      const res = await api.patch<{ inspiration: WorkspaceInspiration }>(
        `/workspace/inspirations/${id}`,
        payload,
      );
      return res.data.inspiration;
    },
    delete: async (id: string) => {
      await api.delete(`/workspace/inspirations/${id}`);
    },
  },

  notes: {
    getAll: async (): Promise<WorkspaceNote[]> => {
      const res = await api.get<{ notes: WorkspaceNote[] }>("/workspace/notes");
      return res.data.notes;
    },
    create: async (payload: NotePayload): Promise<WorkspaceCreateResponse<WorkspaceNote>> => {
      const res = await api.post<{
        note: WorkspaceNote;
        xpGained: number;
        dashboard?: RawDashboard;
      }>("/workspace/notes", payload);
      return {
        item: res.data.note,
        xpGained: res.data.xpGained,
        dashboard: res.data.dashboard,
      };
    },
    update: async (id: string, payload: Partial<NotePayload>) => {
      const res = await api.patch<{ note: WorkspaceNote }>(`/workspace/notes/${id}`, payload);
      return res.data.note;
    },
    delete: async (id: string) => {
      await api.delete(`/workspace/notes/${id}`);
    },
  },
};
