interface QuestItem { title: string; xp: number; done: boolean; tag: string }

export const QUESTS: QuestItem[] = [
  { title: "Ship feature branch before 18:00", xp: 450, done: true,  tag: "DEV"   },
  { title: "30-min deep work session",         xp: 200, done: true,  tag: "FOCUS" },
  { title: "Solve 2 LeetCode mediums",         xp: 300, done: false, tag: "DSA"   },
  { title: "Push daily commit streak",         xp: 150, done: false, tag: "HABIT" },
];