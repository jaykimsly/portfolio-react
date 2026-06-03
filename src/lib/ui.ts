import { clsx, type ClassValue } from "clsx";

// ── cn utility ────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// ── Design tokens ─────────────────────────────────────────────
export const ZONE_COLORS = {
  1: { primary: "#3B82F6", glow: "#3B82F620", border: "#3B82F640", bg: "from-blue-950/40 to-zinc-950" },
  2: { primary: "#10B981", glow: "#10B98120", border: "#10B98140", bg: "from-emerald-950/40 to-zinc-950" },
  3: { primary: "#EF4444", glow: "#EF444420", border: "#EF444440", bg: "from-red-950/40 to-zinc-950" },
  4: { primary: "#F59E0B", glow: "#F59E0B20", border: "#F59E0B40", bg: "from-yellow-950/40 to-zinc-950" },
  5: { primary: "#06B6D4", glow: "#06B6D420", border: "#06B6D440", bg: "from-cyan-950/40 to-zinc-950" },
  6: { primary: "#8B5CF6", glow: "#8B5CF620", border: "#8B5CF640", bg: "from-purple-950/40 to-zinc-950" },
} as const;
