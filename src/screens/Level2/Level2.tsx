import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayerStore } from "../../store/playerStore";
import { useXP } from "../../hooks/useXP";
import { SKILL_TREE, CATEGORY_COLORS, type SkillCategory } from "../../lib/gameData";
import { LevelLayout } from "../../components/ui/LevelLayout";
import { GlassCard, GlowButton, ProgressBar, XPBadge } from "../../components/ui/GameUI";
import { burstConfetti } from "../../lib/confetti";

interface Props { onBack: () => void; }

const CATS: { id: SkillCategory | "all"; label: string; emoji: string }[] = [
  { id: "all",      label: "All",      emoji: "🌐" },
  { id: "backend",  label: "Backend",  emoji: "⚔️" },
  { id: "frontend", label: "Frontend", emoji: "🎨" },
  { id: "devops",   label: "DevOps",   emoji: "⚙️" },
  { id: "database", label: "Database", emoji: "🗄️" },
  { id: "mobile",   label: "Mobile",   emoji: "📱" },
];

export function Level2({ onBack }: Props) {
  const { questsCompleted } = usePlayerStore();
  const { award } = useXP();
  const [active, setActive] = useState<string | null>(null);
  const [cat, setCat] = useState<SkillCategory | "all">("all");

  const unlocked = (id: string) => questsCompleted.includes(`l2_${id}`);
  const unlockedCount = SKILL_TREE.filter((s) => unlocked(s.id)).length;
  const allUnlocked = unlockedCount === SKILL_TREE.length;
  const filtered = cat === "all" ? SKILL_TREE : SKILL_TREE.filter((s) => s.category === cat);

  const handleUnlock = (id: string) => {
    setActive(active === id ? null : id);
    if (!unlocked(id)) award(30, `l2_${id}`);
  };

  const handleComplete = () => {
    if (!questsCompleted.includes("level_2_complete")) {
      award(50, "level_2_complete");
      burstConfetti("#10B981");
    }
  };

  return (
    <LevelLayout
      level={2} title="Skill Forest" onBack={onBack}
      subtitle="Click each skill to unlock it. View proficiency, years of experience, and what it powers."
      progress={`${unlockedCount}/${SKILL_TREE.length} unlocked`}
    >
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATS.map((c) => (
          <button key={c.id} onClick={() => setCat(c.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              cat === c.id
                ? "text-emerald-300"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
            style={cat === c.id ? {
              background: "rgba(16,185,129,0.12)",
              border: "1px solid rgba(16,185,129,0.35)",
            } : {
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <span>{c.emoji}</span> {c.label}
          </button>
        ))}
      </div>

      {/* Skills grid */}
      <div className="grid sm:grid-cols-2 gap-3 mb-8">
        {filtered.map((skill, i) => {
          const isUnlocked = unlocked(skill.id);
          const isActive = active === skill.id;
          const color = CATEGORY_COLORS[skill.category as SkillCategory];

          return (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <GlassCard
                hover
                active={isActive}
                glow={isActive ? color : isUnlocked ? color : undefined}
                accentColor={isUnlocked || isActive ? color : undefined}
                onClick={() => handleUnlock(skill.id)}
                className="p-4 cursor-pointer border"
                style={{
                  borderColor: isUnlocked || isActive ? color + "40" : "rgba(255,255,255,0.05)",
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <img src={skill.icon} alt={skill.label} className="w-8 h-8 object-contain flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold text-sm ${isUnlocked ? "text-white" : "text-zinc-400"}`}>
                      {skill.label}
                    </p>
                    <p className="text-zinc-600 text-xs font-mono">{skill.years} experience</p>
                  </div>
                  {isUnlocked
                    ? <span className="font-mono font-bold text-sm flex-shrink-0" style={{ color }}>{skill.proficiency}%</span>
                    : <XPBadge xp={30} color="#52525b" />
                  }
                </div>

                <ProgressBar
                  value={isUnlocked ? skill.proficiency : 0}
                  color={color}
                  height={6}
                  animated={isUnlocked}
                />
              </GlassCard>

              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="mx-1 p-4 rounded-b-xl text-sm leading-relaxed border-x border-b"
                      style={{ borderColor: color + "25", background: color + "06", color: "#d1d5db" }}
                    >
                      {skill.detail}
                      {skill.unlocks.length > 0 && (
                        <p className="mt-2 text-xs font-mono" style={{ color }}>
                          Powers: {skill.unlocks.join(" · ")}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <GlowButton
        color="#10B981" size="lg"
        onClick={handleComplete}
        disabled={!allUnlocked}
        className="w-full"
      >
        {allUnlocked ? "Forest Cleared — +50 XP →" : `Unlock all skills (${unlockedCount}/${SKILL_TREE.length})`}
      </GlowButton>
    </LevelLayout>
  );
}
