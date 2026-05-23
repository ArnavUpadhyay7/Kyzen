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
  { id: "inspiration", icon: "🎨", label: "Inspiration" },
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
    pillClass: "text-violet-400 bg-violet-500/10 border-violet-500/30",
    buttonClass: "bg-violet-500/10 text-violet-400 border-violet-500/40",
    barClass: "bg-violet-400/60",
  },
  {
    value: "GOOD",
    label: "Good",
    emoji: "✦",
    pillClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    buttonClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/40",
    barClass: "bg-emerald-400/60",
  },
  {
    value: "TIRED",
    label: "Tired",
    emoji: "◉",
    pillClass: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    buttonClass: "bg-amber-500/10 text-amber-400 border-amber-500/40",
    barClass: "bg-amber-400/60",
  },
  {
    value: "BURNED_OUT",
    label: "Burned Out",
    emoji: "◈",
    pillClass: "text-red-400 bg-red-500/10 border-red-500/30",
    buttonClass: "bg-red-500/10 text-red-400 border-red-500/40",
    barClass: "bg-red-400/60",
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
  PROJECT: "text-violet-400",
  STARTUP: "text-emerald-400",
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
  PLANNING: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  BUILDING: "text-violet-400 bg-violet-500/10 border-violet-500/30",
  SHIPPING: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  PAUSED: "text-white/40 bg-white/5 border-white/10",
};

export const INSPIRATION_TYPES: (InspirationType | "All")[] = [
  "All",
  "UI",
  "REPO",
  "DESIGN",
  "CONCEPT",
];

export const INSPIRATION_TYPE_COLORS: Record<InspirationType, string> = {
  UI: "text-violet-400",
  REPO: "text-blue-400",
  DESIGN: "text-emerald-400",
  CONCEPT: "text-pink-400",
};

export const INSPIRATION_GRADIENTS = [
  "from-[#12052e] via-[#2d1b69] to-[#0f2a1a]",
  "from-[#06122a] via-[#1a3a5f] to-[#0a1f2e]",
  "from-[#0a1520] via-[#1a3a4a] to-[#061a10]",
  "from-[#180924] via-[#3d1d5c] to-[#120824]",
  "from-[#16160a] via-[#3a3205] to-[#16160a]",
  "from-[#180808] via-[#3a0d0d] to-[#180808]",
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
  DSA: "text-violet-400",
  COMMAND: "text-blue-400",
  INTERVIEW: "text-emerald-400",
  LEARNING: "text-amber-400",
};

export const BATTLE_LOG_FIELDS = [
  {
    key: "completed" as const,
    icon: "⚔",
    label: "Main thing completed today",
    placeholder: "Built auth flow · Solved 5 LC · Applied to 10 jobs…",
    rows: 2,
    accentClass: "focus:border-orange-500/50 focus:ring-orange-500/10",
    labelClass: "group-focus-within:text-orange-400",
  },
  {
    key: "win" as const,
    icon: "🏆",
    label: "Biggest win",
    placeholder: "First recruiter reply · Solved a Hard…",
    rows: 1,
    accentClass: "focus:border-amber-500/50 focus:ring-amber-500/10",
    labelClass: "group-focus-within:text-amber-400",
  },
  {
    key: "learned" as const,
    icon: "🧠",
    label: "What did you learn?",
    placeholder: "New concept, pattern, debugging trick…",
    rows: 2,
    accentClass: "focus:border-violet-500/50 focus:ring-violet-500/10",
    labelClass: "group-focus-within:text-violet-400",
  },
  {
    key: "bug" as const,
    icon: "🐛",
    label: "Bug defeated",
    placeholder: "Problem → Cause → Fix",
    rows: 2,
    accentClass: "focus:border-red-500/50 focus:ring-red-500/10",
    labelClass: "group-focus-within:text-red-400",
  },
  {
    key: "tomorrow" as const,
    icon: "🔮",
    label: "Tomorrow's focus",
    placeholder: "The single most important thing to do tomorrow…",
    rows: 1,
    accentClass: "focus:border-violet-300/50 focus:ring-violet-300/10",
    labelClass: "group-focus-within:text-violet-300",
  },
];

export const XP_PER_FIELD = 25;
