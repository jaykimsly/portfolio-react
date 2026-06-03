import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayerStore } from "../../store/playerStore";
import { useXP } from "../../hooks/useXP";
import { PIPELINE_STAGES } from "../../lib/gameData";
import { LevelLayout } from "../../components/ui/LevelLayout";
import { GlassCard, GlowButton } from "../../components/ui/GameUI";
import { burstConfetti } from "../../lib/confetti";

interface Props { onBack: () => void; }

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

export function Level5({ onBack }: Props) {
  const { questsCompleted } = usePlayerStore();
  const { award } = useXP();
  const [items, setItems] = useState(() => shuffle(PIPELINE_STAGES));
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [result, setResult] = useState<"idle" | "correct" | "wrong">("idle");
  const [attempts, setAttempts] = useState(0);
  const alreadyDone = questsCompleted.includes("level_5_complete");

  const handleDrop = (targetId: string) => {
    if (!dragging || dragging === targetId) { setDragging(null); setDragOver(null); return; }
    const arr = [...items];
    const from = arr.findIndex((i) => i.id === dragging);
    const to = arr.findIndex((i) => i.id === targetId);
    const [moved] = arr.splice(from, 1);
    arr.splice(to, 0, moved);
    setItems(arr);
    setDragging(null);
    setDragOver(null);
  };

  const check = () => {
    const ok = items.every((it, i) => it.id === PIPELINE_STAGES[i].id);
    setAttempts((a) => a + 1);
    if (ok) {
      setResult("correct");
      const xp = attempts === 0 ? 250 : attempts === 1 ? 175 : 100;
      award(xp, "level_5_complete");
      setTimeout(() => burstConfetti("#06B6D4"), 200);
    } else {
      setResult("wrong");
      setTimeout(() => setResult("idle"), 2000);
    }
  };

  const tiers = [
    { label: "1st try", xp: 250, active: attempts === 0 },
    { label: "2nd try", xp: 175, active: attempts === 1 },
    { label: "3rd+",    xp: 100, active: attempts >= 2  },
  ];

  return (
    <LevelLayout
      level={5} title="DevOps Arena" onBack={onBack}
      subtitle="Drag the pipeline stages into the correct CI/CD order. First-try bonus applies."
      progress={alreadyDone ? "✓ Completed" : `Attempts: ${attempts}`}
    >
      {/* XP tiers */}
      {!alreadyDone && (
        <div className="flex gap-3 mb-6">
          {tiers.map((t, i) => (
            <GlassCard
              key={i}
              glow={t.active ? "#06B6D4" : undefined}
              className="flex-1 text-center py-3 border"
              style={{ borderColor: t.active ? "#06B6D440" : "rgba(255,255,255,0.05)" }}
            >
              <p className="font-mono font-bold text-base" style={{ color: t.active ? "#06B6D4" : "#52525b" }}>
                {t.xp} XP
              </p>
              <p className="text-xs text-zinc-600">{t.label}</p>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Draggable stages */}
      <div className="space-y-2 mb-6">
        {items.map((stage, i) => {
          const isDragging = dragging === stage.id;
          const isOver = dragOver === stage.id;
          return (
            <div
              key={stage.id}
              draggable
              onDragStart={() => setDragging(stage.id)}
              onDragOver={(e) => { e.preventDefault(); setDragOver(stage.id); }}
              onDrop={() => handleDrop(stage.id)}
              onDragEnd={() => { setDragging(null); setDragOver(null); }}
            >
              <GlassCard
                className="flex items-center gap-4 px-5 py-4 border-2 cursor-grab active:cursor-grabbing select-none transition-all"
                style={{
                  borderColor: result === "correct"
                    ? "rgba(16,185,129,0.4)"
                    : isDragging ? "rgba(6,182,212,0.5)"
                    : isOver    ? "rgba(6,182,212,0.7)"
                    : "rgba(255,255,255,0.06)",
                  opacity: isDragging ? 0.4 : 1,
                  transform: isOver ? "scale(1.02)" : "none",
                }}
              >
                <span className="text-zinc-600 font-mono text-sm w-6 text-right flex-shrink-0">{i + 1}</span>
                <span className="text-2xl flex-shrink-0">{stage.icon}</span>
                <div className="flex-1">
                  <p className="text-white font-bold text-sm">{stage.label}</p>
                  <p className="text-zinc-400 text-xs mt-0.5">{stage.desc}</p>
                </div>
                <span className="text-zinc-700 text-xl flex-shrink-0 select-none">⠿</span>
              </GlassCard>
            </div>
          );
        })}
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {result === "wrong" && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mb-4 py-3 px-4 rounded-xl text-sm font-medium text-center"
            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5" }}>
            ✗ Wrong order — keep trying
          </motion.div>
        )}
        {result === "correct" && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="mb-4 py-4 px-5 rounded-2xl text-center"
            style={{ background: "rgba(16,185,129,0.08)", border: "2px solid rgba(16,185,129,0.35)" }}>
            <p className="text-green-400 font-black text-lg">✓ Correct Pipeline!</p>
            <p className="text-zinc-400 text-sm mt-1">
              {attempts === 1 ? "First try! +250 XP 🎉" : attempts === 2 ? "Second try! +175 XP" : "+100 XP"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-3">
        {!alreadyDone && result !== "correct" && (
          <GlowButton color="#52525b" variant="outline"
            onClick={() => { setItems(shuffle(PIPELINE_STAGES)); setResult("idle"); }}>
            Shuffle
          </GlowButton>
        )}
        {!alreadyDone && result !== "correct" && (
          <GlowButton color="#06B6D4" size="lg" onClick={check} className="flex-1">
            Check Order ⚡
          </GlowButton>
        )}
        {(result === "correct" || alreadyDone) && (
          <GlowButton color="#10B981" size="lg" onClick={onBack} className="flex-1">
            Back to World Map →
          </GlowButton>
        )}
      </div>
    </LevelLayout>
  );
}
