import type {
  IdeaCategory,
  InspirationType,
  Mood,
  NoteCategory,
  ProjectStatus,
} from "../../../api/workspace.api";

export const WORKSPACE_TABS = [
  { id: "battlelog", icon: "📖", label: "Battle Log" },
  { id: "ideavault", icon: "💡", label: "Idea Vault" },
  { id: "projects", icon: "🗺", label: "Project Planner" },
  { id: "knowledge", icon: "🧠", label: "Knowledge Vault" },
] as const;

export type WorkspaceTabId = (typeof WORKSPACE_TABS)[number]["id"];

export const MOODS: {
  value: Mood;
  label: string;
  emoji: string;
  pillClass: string;
  buttonClass: string;
  barClass: string;
}[] = [
  {
    value: "LOCKED_IN",
    label: "Locked In",
    emoji: "⚡",
    pillClass: "text-dash-violet bg-dash-accent-soft border-dash-accent-border",
    buttonClass: "bg-dash-accent-soft text-dash-violet border-dash-accent-border",
    barClass: "bg-dash-violet/60",
  },
  {
    value: "GOOD",
    label: "Good",
    emoji: "✦",
    pillClass: "text-dash-success bg-dash-success/10 border-dash-success/30",
    buttonClass: "bg-dash-success/10 text-dash-success border-dash-success/40",
    barClass: "bg-dash-success/60",
  },
  {
    value: "TIRED",
    label: "Tired",
    emoji: "◉",
    pillClass: "text-dash-warning bg-dash-warning/10 border-dash-warning/30",
    buttonClass: "bg-dash-warning/10 text-dash-warning border-dash-warning/40",
    barClass: "bg-dash-warning/60",
  },
  {
    value: "BURNED_OUT",
    label: "Burned Out",
    emoji: "◈",
    pillClass: "text-dash-danger bg-dash-danger/10 border-dash-danger/30",
    buttonClass: "bg-dash-danger/10 text-dash-danger border-dash-danger/40",
    barClass: "bg-dash-danger/60",
  },
  {
    value: "DISTRACTED",
    label: "Distracted",
    emoji: "〜",
    pillClass: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    buttonClass: "bg-blue-500/10 text-blue-400 border-blue-500/40",
    barClass: "bg-blue-400/60",
  },
];

export const IDEA_CATEGORIES: IdeaCategory[] = ["PROJECT", "STARTUP", "TOOL", "EXPERIMENT"];

export const IDEA_CATEGORY_LABELS: Record<IdeaCategory, string> = {
  PROJECT: "Project",
  STARTUP: "Startup",
  TOOL: "Tool",
  EXPERIMENT: "Experiment",
};

export const IDEA_CATEGORY_COLORS: Record<IdeaCategory, string> = {
  PROJECT: "text-dash-violet",
  STARTUP: "text-dash-success",
  TOOL: "text-blue-400",
  EXPERIMENT: "text-pink-400",
};

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  PLANNING: "Planning",
  BUILDING: "Building",
  SHIPPING: "Shipping",
  PAUSED: "Paused",
};

export const PROJECT_STATUS_COLORS: Record<ProjectStatus, string> = {
  PLANNING: "text-dash-warning bg-dash-warning/10 border-dash-warning/30",
  BUILDING: "text-dash-violet bg-dash-accent-soft border-dash-accent-border",
  SHIPPING: "text-dash-success bg-dash-success/10 border-dash-success/30",
  PAUSED: "text-dash-faint bg-dash-muted-btn border-dash-border",
};

export const INSPIRATION_TYPES: (InspirationType | "All")[] = [
  "All",
  "UI",
  "REPO",
  "DESIGN",
  "CONCEPT",
];

export const INSPIRATION_TYPE_COLORS: Record<InspirationType, string> = {
  UI: "text-dash-violet",
  REPO: "text-blue-400",
  DESIGN: "text-dash-success",
  CONCEPT: "text-pink-400",
};

export const INSPIRATION_GRADIENTS = [
  "from-dash-card via-indigo-950 to-dash-page",
  "from-dash-sidebar via-slate-900 to-dash-page",
  "from-slate-900 via-slate-800 to-dash-page",
  "from-violet-950 via-purple-950 to-dash-page",
  "from-amber-950/40 via-dash-card to-dash-page",
  "from-red-950/40 via-dash-card to-dash-page",
];

export const NOTE_CATEGORIES: (NoteCategory | "All")[] = [
  "All",
  "DSA",
  "COMMAND",
  "INTERVIEW",
  "LEARNING",
];

export const NOTE_CATEGORY_LABELS: Record<NoteCategory, string> = {
  DSA: "DSA",
  COMMAND: "Command",
  INTERVIEW: "Interview",
  LEARNING: "Learning",
};

export const NOTE_CATEGORY_COLORS: Record<NoteCategory, string> = {
  DSA: "text-dash-violet",
  COMMAND: "text-blue-400",
  INTERVIEW: "text-dash-success",
  LEARNING: "text-dash-warning",
};

export const BATTLE_LOG_FIELDS = [
  {
    key: "completed" as const,
    icon: "⚔",
    label: "Main thing completed today",
    placeholder: "Built auth flow · Solved 5 LC · Applied to 10 jobs…",
    rows: 2,
    accentClass: "focus:border-dash-orange/50 focus:ring-dash-orange/10",
    labelClass: "group-focus-within:text-dash-orange",
  },
  {
    key: "win" as const,
    icon: "🏆",
    label: "Biggest win",
    placeholder: "First recruiter reply · Solved a Hard…",
    rows: 1,
    accentClass: "focus:border-dash-warning/50 focus:ring-dash-warning/10",
    labelClass: "group-focus-within:text-dash-warning",
  },
  {
    key: "learned" as const,
    icon: "🧠",
    label: "What did you learn?",
    placeholder: "New concept, pattern, debugging trick…",
    rows: 2,
    accentClass: "focus:border-dash-accent-border focus:ring-dash-accent-soft",
    labelClass: "group-focus-within:text-dash-violet",
  },
  {
    key: "bug" as const,
    icon: "🐛",
    label: "Bug defeated",
    placeholder: "Problem → Cause → Fix",
    rows: 2,
    accentClass: "focus:border-dash-danger/50 focus:ring-dash-danger/10",
    labelClass: "group-focus-within:text-dash-danger",
  },
  {
    key: "tomorrow" as const,
    icon: "🔮",
    label: "Tomorrow's focus",
    placeholder: "The single most important thing to do tomorrow…",
    rows: 1,
    accentClass: "focus:border-dash-violet/50 focus:ring-dash-accent-soft",
    labelClass: "group-focus-within:text-dash-violet",
  },
];

export const XP_PER_FIELD = 25;
