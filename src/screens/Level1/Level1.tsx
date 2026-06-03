import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayerStore } from "../../store/playerStore";
import { useXP } from "../../hooks/useXP";
import { TIMELINE } from "../../lib/gameData";
import { LevelLayout } from "../../components/ui/LevelLayout";
import { GlassCard, GlowButton, XPBadge } from "../../components/ui/GameUI";
import { burstConfetti } from "../../lib/confetti";

interface Props { onBack: () => void; }

export function Level1({ onBack }: Props) {
  const { questsCompleted } = usePlayerStore();
  const { award } = useXP();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const readCount = TIMELINE.filter((t) => questsCompleted.includes(`l1_${t.id}`)).length;
  const allRead = readCount === TIMELINE.length;

  const handleExpand = (id: string, xp: number) => {
    const questId = `l1_${id}`;
    setExpanded(expanded === id ? null : id);
    if (!questsCompleted.includes(questId)) award(xp, questId);
  };

  const handleComplete = () => {
    if (!questsCompleted.includes("level_1_complete")) {
      award(50, "level_1_complete");
      burstConfetti("#3B82F6");
    }
    setDone(true);
  };

  return (
    <LevelLayout
      level={1} title="Origin Story" onBack={onBack}
      subtitle="Read through each chapter of the journey — from university to production systems."
      progress={`${readCount}/${TIMELINE.length} chapters read`}
    >
      {/* Timeline */}
      <div className="relative mb-8">
        {/* Vertical spine */}
        <div className="absolute left-5 top-6 bottom-6 w-0.5 bg-gradient-to-b from-blue-500/40 via-zinc-700 to-transparent" />

        <div className="space-y-4">
          {TIMELINE.map((item, i) => {
            const isRead = questsCompleted.includes(`l1_${item.id}`);
            const isOpen = expanded === item.id;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <button onClick={() => handleExpand(item.id, item.xp)} className="w-full text-left relative pl-14">
                  {/* Node */}
                  <div className={`absolute left-0 w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all ${
                    isRead
                      ? "border-blue-500 bg-blue-500/20 text-blue-300"
                      : "border-zinc-700 bg-zinc-900 text-zinc-400"
                  }`}>
                    {isRead ? "✓" : item.icon}
                  </div>

                  {/* Card */}
                  <GlassCard className={`p-4 border-2 transition-all ${
                    isOpen ? "border-blue-500/50" : isRead ? "border-zinc-700/50" : "border-white/5"
                  }`}
                  glow={isOpen ? "#3B82F6" : undefined}
                  accentColor={isOpen ? "#3B82F6" : undefined}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-blue-400 font-mono text-xs font-medium mb-1">{item.year}</p>
                        <p className="text-white font-bold text-base leading-tight">{item.title}</p>
                        <p className="text-zinc-400 text-sm mt-0.5">{item.role}</p>
                      </div>
                      <XPBadge xp={item.xp} color={isRead ? "#10B981" : "#3f3f46"} />
                    </div>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <p className="text-zinc-300 text-sm mt-4 pt-4 border-t border-zinc-700/50 leading-relaxed">
                            {item.detail}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </GlassCard>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      {!done ? (
        <GlowButton color="#3B82F6" size="lg" onClick={handleComplete} disabled={!allRead} className="w-full">
          {allRead ? "Complete Zone — +50 XP →" : `Read all chapters first (${readCount}/${TIMELINE.length})`}
        </GlowButton>
      ) : (
        <GlassCard className="py-4 text-center" glow="#10B981" accentColor="#10B981">
          <p className="text-green-400 font-bold text-base">✓ Zone Complete — head back to the World Map</p>
        </GlassCard>
      )}
    </LevelLayout>
  );
}
