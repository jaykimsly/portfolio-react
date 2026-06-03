export const RANKS = [
  { min: 0,     label: "Wanderer",       color: "#6B7280" },
  { min: 250,   label: "Explorer",       color: "#3B82F6" },
  { min: 500,   label: "Developer",      color: "#8B5CF6" },
  { min: 1000,  label: "Engineer",       color: "#10B981" },
  { min: 2500,  label: "Senior Dev",     color: "#F59E0B" },
  { min: 5000,  label: "Tech Lead",      color: "#EF4444" },
  { min: 10000, label: "Architect",      color: "#EC4899" },
  { min: 25000, label: "CTO",            color: "#F97316" },
] as const;

export const PLAYER_CLASSES = [
  { id: "frontend_ranger",  label: "Frontend Ranger",  emoji: "🏹", bonus: "UI Quest XP +20%" },
  { id: "backend_warrior",  label: "Backend Warrior",  emoji: "⚔️", bonus: "API Quest XP +20%" },
  { id: "devops_mage",      label: "DevOps Mage",      emoji: "🔮", bonus: "Pipeline Quest XP +20%" },
  { id: "architect_sage",   label: "Architect Sage",   emoji: "📐", bonus: "System Design XP +20%" },
] as const;

export type PlayerClass = typeof PLAYER_CLASSES[number]["id"];

export const WORLD_THEMES: Record<number, { name: string; color: string; bg: string }> = {
  1: { name: "Origin Story",         color: "#3B82F6", bg: "#0B1020" },
  2: { name: "Skill Forest",         color: "#10B981", bg: "#071410" },
  3: { name: "Project Dungeon",      color: "#EF4444", bg: "#130808" },
  4: { name: "Bug Hunt",             color: "#F59E0B", bg: "#131007" },
  5: { name: "DevOps Arena",         color: "#06B6D4", bg: "#050F13" },
  6: { name: "Architecture Citadel", color: "#8B5CF6", bg: "#0A0713" },
};

export const XP_VALUES = {
  LEVEL_ENTER: 25,
  TIMELINE_READ: 50,
  SKILL_UNLOCK: 30,
  PROJECT_VIEW: 100,
  BUG_FOUND: 75,
  PIPELINE_CORRECT: 250,
  ARCH_CORRECT: 200,
  CONTACT_COMPLETE: 300,
  EASTER_EGG: 500,
} as const;

export function getRank(xp: number) {
  return [...RANKS].reverse().find((r) => xp >= r.min) ?? RANKS[0];
}

export function getLevel(xp: number): number {
  if (xp >= 25000) return 10;
  if (xp >= 10000) return 9;
  if (xp >= 5000)  return 8;
  if (xp >= 2500)  return 7;
  if (xp >= 1000)  return 6;
  if (xp >= 500)   return 5;
  if (xp >= 250)   return 4;
  if (xp >= 100)   return 3;
  if (xp >= 50)    return 2;
  return 1;
}

export function getNextXPThreshold(xp: number): number {
  const thresholds = [50, 100, 250, 500, 1000, 2500, 5000, 10000, 25000, 99999];
  return thresholds.find((t) => t > xp) ?? 99999;
}
