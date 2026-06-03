import { motion, AnimatePresence } from "framer-motion";
import * as RadixProgress from "@radix-ui/react-progress";
import { usePlayerStore } from "../../store/playerStore";
import { WORLD_THEMES } from "../../lib/constants";

export function HUD() {
  const { playerName, xp, level, rank, rankColor, nextThreshold, playerClass, currentLevel, gameStatus } = usePlayerStore();

  if (gameStatus === "boot") return null;

  const prevThreshold = (() => {
    const steps = [0, 50, 100, 250, 500, 1000, 2500, 5000, 10000, 25000];
    return [...steps].reverse().find((t) => t < xp) ?? 0;
  })();
  const pct = Math.min(((xp - prevThreshold) / (nextThreshold - prevThreshold)) * 100, 100);
  const theme = currentLevel ? WORLD_THEMES[currentLevel] : null;

  const classEmoji: Record<string, string> = {
    frontend_ranger: "🏹", backend_warrior: "⚔️", devops_mage: "🔮", architect_sage: "📐",
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div className="flex items-start justify-between px-5 pt-4 gap-3">

        {/* ── Player card ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="glass-strong rounded-2xl px-4 py-3 min-w-[200px]"
          style={{ boxShadow: `0 4px 24px ${rankColor}18, inset 0 1px 0 rgba(255,255,255,0.07)` }}
        >
          {/* Rank badge */}
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg"
              style={{ background: rankColor + "20", border: `1px solid ${rankColor}35`, color: rankColor }}
            >
              {rank}
            </span>
            <span className="text-zinc-500 text-xs font-mono">Lv. {level}</span>
          </div>
          <p className="text-white font-bold text-base truncate max-w-[160px] leading-tight">
            {playerName}
          </p>
          {playerClass && (
            <p className="text-zinc-500 text-xs mt-1">
              {classEmoji[playerClass]} {playerClass.replace(/_/g, " ")}
            </p>
          )}
        </motion.div>

        {/* ── World badge ── */}
        <AnimatePresence>
          {theme && (
            <motion.div
              key={theme.name}
              initial={{ opacity: 0, y: -16, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="hidden md:flex items-center gap-2.5 glass-strong rounded-2xl px-4 py-2.5"
              style={{
                border: `1px solid ${theme.color}35`,
                boxShadow: `0 0 20px ${theme.color}15`,
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: theme.color, boxShadow: `0 0 6px ${theme.color}`, animation: "pulse-glow 2s ease-in-out infinite" }}
              />
              <span className="font-semibold text-sm" style={{ color: theme.color }}>
                {theme.name}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── XP card ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="glass-strong rounded-2xl px-4 py-3 min-w-[190px]"
          style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-zinc-500 text-xs font-mono">XP</span>
            <div className="flex items-baseline gap-1">
              <span className="text-white font-black text-lg font-mono leading-none">
                {xp.toLocaleString()}
              </span>
              <span className="text-zinc-600 text-xs font-mono">/ {nextThreshold.toLocaleString()}</span>
            </div>
          </div>

          {/* Radix Progress */}
          <RadixProgress.Root
            value={pct}
            className="relative h-2 overflow-hidden rounded-full"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <RadixProgress.Indicator
              className="h-full rounded-full"
              style={{
                width: `${pct}%`,
                background: `linear-gradient(90deg, ${rankColor}80, ${rankColor})`,
                boxShadow: `0 0 8px ${rankColor}60`,
                transition: "width 600ms cubic-bezier(0.65,0,0.35,1)",
              }}
            />
          </RadixProgress.Root>

          <p className="text-zinc-600 text-xs font-mono mt-1 text-right">
            {Math.round(pct)}% to next rank
          </p>
        </motion.div>

      </div>
    </div>
  );
}

export function XPFloater({ events }: { events: Array<{ id: number; amount: number; x: number; y: number }> }) {
  return (
    <AnimatePresence>
      {events.map((ev) => (
        <motion.div
          key={ev.id}
          initial={{ opacity: 1, y: 0, scale: 1 }}
          animate={{ opacity: 0, y: -80, scale: 1.6 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed z-[200] pointer-events-none font-black text-xl font-mono select-none"
          style={{
            left: ev.x - 36,
            top: ev.y - 10,
            color: "#10B981",
            textShadow: "0 0 20px #10B981aa, 0 0 40px #10B98155",
            letterSpacing: "-0.02em",
          }}
        >
          +{ev.amount} XP
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
