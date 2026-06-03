import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayerStore } from "../../store/playerStore";
import { useXP } from "../../hooks/useXP";
import { BOSS_PROJECTS } from "../../lib/gameData";
import { LevelLayout } from "../../components/ui/LevelLayout";
import { GlassCard, GlowButton, ProgressBar, XPBadge, GlowDivider } from "../../components/ui/GameUI";
import { bossDefeatExplosion, burstConfetti } from "../../lib/confetti";

interface Props { onBack: () => void; }

const DIFF_STYLES: Record<string, { color: string; bg: string; border: string }> = {
  LEGENDARY: { color: "#fbbf24", bg: "#78350f20", border: "#f59e0b40" },
  BOSS:      { color: "#f87171", bg: "#7f1d1d20", border: "#ef444440" },
  ELITE:     { color: "#fb923c", bg: "#7c2d1220", border: "#f9731640" },
};

export function Level3({ onBack }: Props) {
  const { questsCompleted } = usePlayerStore();
  const { award } = useXP();
  const [activeBoss, setActiveBoss] = useState<string | null>(null);
  const [shaking, setShaking] = useState<string | null>(null);

  const defeatedCount = BOSS_PROJECTS.filter((b) => questsCompleted.includes(`l3_${b.id}_defeated`)).length;

  const getBossHP = (boss: typeof BOSS_PROJECTS[0]) =>
    Math.max(0, boss.hp - boss.attacks.reduce((sum, a) =>
      questsCompleted.includes(`l3_${boss.id}_${a.id}`) ? sum + a.damage : sum, 0));

  const handleAttack = (bossId: string, atkId: string, damage: number, xp: number) => {
    const qid = `l3_${bossId}_${atkId}`;
    if (questsCompleted.includes(qid)) return;
    award(xp, qid);
    setShaking(bossId);
    setTimeout(() => setShaking(null), 500);
    const boss = BOSS_PROJECTS.find((b) => b.id === bossId)!;
    const remaining = getBossHP(boss) - damage;
    if (remaining <= 0 && !questsCompleted.includes(`l3_${bossId}_defeated`)) {
      setTimeout(() => {
        award(100, `l3_${bossId}_defeated`);
        bossDefeatExplosion("#EF4444");
      }, 350);
    }
  };

  const handleComplete = () => {
    if (!questsCompleted.includes("level_3_complete")) {
      award(100, "level_3_complete");
      burstConfetti("#EF4444");
    }
  };

  return (
    <LevelLayout
      level={3} title="Project Dungeon" onBack={onBack}
      subtitle="Each project is a boss. Attack by exploring it — drain the HP bar to defeat it and earn XP."
      progress={`${defeatedCount}/${BOSS_PROJECTS.length} defeated`}
    >
      <div className="space-y-4 mb-8">
        {BOSS_PROJECTS.map((boss, i) => {
          const hp = getBossHP(boss);
          const hpPct = (hp / boss.hp) * 100;
          const defeated = hp <= 0;
          const isOpen = activeBoss === boss.id;
          const diff = DIFF_STYLES[boss.difficulty] ?? DIFF_STYLES.ELITE;

          return (
            <motion.div
              key={boss.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{
                opacity: 1, y: 0,
                x: shaking === boss.id ? [-8, 8, -5, 5, 0] : 0,
              }}
              transition={{ delay: i * 0.08, x: { duration: 0.35 } }}
            >
              <GlassCard
                glow={defeated ? "#10B981" : isOpen ? "#EF4444" : undefined}
                accentColor={defeated ? "#10B981" : isOpen ? "#EF4444" : undefined}
                className="overflow-hidden border"
                style={{
                  borderColor: defeated ? "#10B98140" : isOpen ? "#EF444430" : "rgba(255,255,255,0.06)",
                }}
              >
                {/* Boss header */}
                <button
                  onClick={() => !defeated && setActiveBoss(isOpen ? null : boss.id)}
                  className="w-full text-left p-5"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <span
                        className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-mono font-bold mb-2 border"
                        style={{ color: diff.color, background: diff.bg, borderColor: diff.border }}
                      >
                        {boss.difficulty}
                      </span>
                      <p className="text-white font-black text-xl leading-tight">
                        {boss.emoji} {boss.name}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-2xl">
                      {defeated ? "💀" : isOpen ? "🔓" : "🔒"}
                    </div>
                  </div>

                  {/* HP bar using Radix */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs font-mono mb-1.5">
                      <span className="text-zinc-500">HP</span>
                      <span style={{ color: defeated ? "#10b981" : hpPct < 30 ? "#fb923c" : "#f87171" }}>
                        {hp.toLocaleString()} / {boss.hp.toLocaleString()}
                      </span>
                    </div>
                    <ProgressBar
                      value={hpPct}
                      color={hpPct > 60 ? "#ef4444" : hpPct > 30 ? "#f59e0b" : "#10b981"}
                      height={10}
                      animated
                    />
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {boss.stack.map((s) => (
                      <span key={s} className="text-xs px-2 py-0.5 rounded-md font-mono"
                        style={{ background: "rgba(255,255,255,0.05)", color: "#9ca3af", border: "1px solid rgba(255,255,255,0.07)" }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </button>

                {/* Attack panel */}
                <AnimatePresence>
                  {isOpen && !defeated && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <GlowDivider color="#EF4444" />
                      <div className="px-5 pb-5 space-y-3">
                        <p className="text-zinc-400 text-sm leading-relaxed">{boss.description}</p>

                        <div className="space-y-2">
                          {boss.attacks.map((atk) => {
                            const done = questsCompleted.includes(`l3_${boss.id}_${atk.id}`);
                            return (
                              <motion.button
                                key={atk.id}
                                whileHover={done ? {} : { scale: 1.01, x: 2 }}
                                whileTap={done ? {} : { scale: 0.99 }}
                                onClick={() => !done && handleAttack(boss.id, atk.id, atk.damage, atk.xp)}
                                disabled={done}
                                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all"
                                style={done ? {
                                  background: "rgba(16,185,129,0.08)",
                                  border: "1px solid rgba(16,185,129,0.25)",
                                  color: "#6ee7b7",
                                  cursor: "default",
                                } : {
                                  background: "rgba(239,68,68,0.08)",
                                  border: "1px solid rgba(239,68,68,0.25)",
                                  color: "#fca5a5",
                                  cursor: "pointer",
                                }}
                              >
                                <span>{done ? "✓ " : "⚔️ "}{atk.label}</span>
                                <XPBadge xp={atk.xp} color={done ? "#10B981" : "#EF4444"} />
                              </motion.button>
                            );
                          })}
                        </div>

                        {(boss.url || boss.github) && (
                          <div className="flex gap-2 pt-1">
                            {boss.url && (
                              <a href={boss.url} target="_blank" rel="noopener noreferrer"
                                className="flex-1 text-center py-2.5 rounded-xl text-sm font-medium transition-all"
                                style={{ border: "1px solid rgba(255,255,255,0.08)", color: "#9ca3af" }}
                                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)")}
                                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                              >
                                🔗 Live Site
                              </a>
                            )}
                            {boss.github && (
                              <a href={boss.github} target="_blank" rel="noopener noreferrer"
                                className="flex-1 text-center py-2.5 rounded-xl text-sm font-medium transition-all"
                                style={{ border: "1px solid rgba(255,255,255,0.08)", color: "#9ca3af" }}
                                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)")}
                                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                              >
                                GitHub →
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      <GlowButton
        color="#EF4444" size="lg"
        onClick={handleComplete}
        disabled={defeatedCount < BOSS_PROJECTS.length}
        className="w-full"
      >
        {defeatedCount >= BOSS_PROJECTS.length
          ? "Dungeon Cleared — +100 XP →"
          : `Defeat all bosses (${defeatedCount}/${BOSS_PROJECTS.length})`}
      </GlowButton>
    </LevelLayout>
  );
}
