import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayerStore } from "../../store/playerStore";
import { useXP } from "../../hooks/useXP";
import { BUGS } from "../../lib/gameData";
import { LevelLayout } from "../../components/ui/LevelLayout";
import { GlassCard, GlowButton, XPBadge } from "../../components/ui/GameUI";
import { burstConfetti } from "../../lib/confetti";

interface Props { onBack: () => void; }

const POSITIONS = [
  { top: "15%", left: "6%"  },
  { top: "30%", left: "78%" },
  { top: "52%", left: "12%" },
  { top: "20%", left: "60%" },
  { top: "68%", left: "52%" },
  { top: "78%", left: "22%" },
  { top: "42%", left: "42%" },
];

export function Level4({ onBack }: Props) {
  const { questsCompleted } = usePlayerStore();
  const { award } = useXP();
  const [caught, setCaught] = useState<string | null>(null);

  const foundCount = BUGS.filter((b) => questsCompleted.includes(`l4_${b.id}`)).length;
  const allFound = foundCount === BUGS.length;

  const handleCatch = (bug: typeof BUGS[0]) => {
    const qid = `l4_${bug.id}`;
    if (!questsCompleted.includes(qid)) award(bug.xp, qid);
    setCaught(bug.id);
  };

  const handleComplete = () => {
    if (!questsCompleted.includes("level_4_complete")) {
      award(75, "level_4_complete");
      burstConfetti("#F59E0B");
    }
  };

  return (
    <div>
      <LevelLayout
        level={4} title="Bug Hunt" onBack={onBack}
        subtitle="Every bug is hiding somewhere on screen. Click them all to catch them and earn XP."
        progress={`${foundCount}/${BUGS.length} caught`}
      >
        {/* Checklist */}
        <div className="grid sm:grid-cols-2 gap-2 mb-6">
          {BUGS.map((bug) => {
            const found = questsCompleted.includes(`l4_${bug.id}`);
            return (
              <GlassCard key={bug.id}
                glow={found ? "#F59E0B" : undefined}
                accentColor={found ? "#F59E0B" : undefined}
                className="flex items-center gap-3 px-4 py-3 border"
                style={{ borderColor: found ? "#F59E0B30" : "rgba(255,255,255,0.05)" }}
              >
                <span className="text-xl">{bug.emoji}</span>
                <span className={`text-sm font-medium flex-1 ${
                  found ? "text-yellow-300" : "text-zinc-500"
                }`}>
                  {bug.name}
                </span>
                {found && <XPBadge xp={bug.xp} color="#F59E0B" />}
              </GlassCard>
            );
          })}
        </div>

        <p className="text-zinc-500 text-sm text-center mb-4">
          The bugs are floating around the screen — hunt them down 👇
        </p>

        <GlowButton color="#F59E0B" size="lg" onClick={handleComplete} disabled={!allFound} className="w-full">
          {allFound ? "All Bugs Caught — +75 XP →" : `Find all bugs (${foundCount}/${BUGS.length})`}
        </GlowButton>
      </LevelLayout>

      {/* Floating bugs — fixed position on viewport */}
      {BUGS.map((bug, i) => {
        const found = questsCompleted.includes(`l4_${bug.id}`);
        return (
          <motion.button
            key={bug.id}
            style={{ position: "fixed", top: POSITIONS[i].top, left: POSITIONS[i].left, zIndex: 40 }}
            animate={found
              ? { scale: 0, opacity: 0 }
              : { y: [0, -10, 0], rotate: [0, 8, -8, 0] }
            }
            transition={found
              ? { duration: 0.25 }
              : { duration: 2.2 + i * 0.4, repeat: Infinity, ease: "easeInOut" }
            }
            onClick={() => handleCatch(bug)}
            title={bug.hint}
            className="text-3xl hover:scale-125 transition-transform select-none cursor-pointer"
          >
            {bug.emoji}
          </motion.button>
        );
      })}

      {/* Catch popup */}
      <AnimatePresence>
        {caught && (() => {
          const bug = BUGS.find((b) => b.id === caught)!;
          return (
            <motion.div key={caught}
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: -20 }}
              className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[100] bg-zinc-950 border-2 border-yellow-500/50 rounded-2xl px-7 py-5 text-center shadow-2xl min-w-[260px]"
              style={{ boxShadow: "0 8px 40px #f59e0b18" }}
            >
              <p className="text-5xl mb-3">{bug.emoji}</p>
              <p className="text-white font-extrabold text-lg mb-1">{bug.name}</p>
              <p className="text-zinc-400 text-sm leading-relaxed mb-3">{bug.desc}</p>
              <p className="text-yellow-400 font-mono font-bold text-base">+{bug.xp} XP</p>
              <button onClick={() => setCaught(null)} className="mt-4 text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
                dismiss ×
              </button>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
