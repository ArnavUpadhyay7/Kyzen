interface RankItem  { name: string; tier: string; color: string; glow: string; desc: string }

export const RANKS: RankItem[] = [
  { name: "INITIATE",  tier: "I",   color: "#64748b", glow: "rgba(100,116,139,0.3)", desc: "The starting point. Your code is sparse but the hunger is real." },
  { name: "CODER",     tier: "II",  color: "#6366f1", glow: "rgba(99,102,241,0.4)",  desc: "Patterns emerge. PRs get merged. The grind solidifies." },
  { name: "ARCHITECT", tier: "III", color: "#8b5cf6", glow: "rgba(139,92,246,0.5)",  desc: "Systems thinking. You design before you build." },
  { name: "SENTINEL",  tier: "IV",  color: "#a855f7", glow: "rgba(168,85,247,0.6)",  desc: "Legendary consistency. Your streak is unbroken." },
  { name: "KYZEN",     tier: "V",   color: "#e879f9", glow: "rgba(232,121,249,0.7)", desc: "The apex. You don't just build software — you shape craft." },
];