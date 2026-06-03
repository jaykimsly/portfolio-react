import { motion } from "framer-motion";
import { usePlayerStore } from "../../store/playerStore";
import { WORLD_THEMES } from "../../lib/constants";
import { GlassCard, GlowButton, ProgressBar, StatusBadge, ZoneBadge, StatPill } from "../../components/ui/GameUI";

const LEVELS = [
  { id: 1, title: "Origin Story",         desc: "Career timeline — from university to production",  icon: "📜", maxXP: 250  },
  { id: 2, title: "Skill Forest",          desc: "Unlock the full RPG skill tree",                   icon: "🌲", maxXP: 440  },
  { id: 3, title: "Project Dungeon",       desc: "Defeat boss projects by exploring them",           icon: "🐉", maxXP: 760  },
  { id: 4, title: "Bug Hunt",              desc: "Find every bug hiding on screen",                  icon: "🐛", maxXP: 625  },
  { id: 5, title: "DevOps Arena",          desc: "Build the CI/CD pipeline in the right order",      icon: "⚙️", maxXP: 250  },
  { id: 6, title: "Architecture Citadel",  desc: "Solve real senior-level system design challenges", icon: "🏰", maxXP: 700  },
];

const TOTAL_MAX_XP = LEVELS.reduce((a, l) => a + l.maxXP, 0);

interface Props { onEnterLevel: (l: number) => void; onViewScoreboard: () => void; }

export function WorldMap({ onEnterLevel, onViewScoreboard }: Props) {
  const { levelsVisited, questsCompleted, xp, rank, playerName, playerClass } = usePlayerStore();
  const completedCount = LEVELS.filter((l) => questsCompleted.includes(`level_${l.id}_complete`)).length;
  const xpPct = Math.min((xp / TOTAL_MAX_XP) * 100, 100);

  const classLabel: Record<string, string> = {
    frontend_ranger: "🏹 Frontend Ranger",
    backend_warrior: "⚔️ Backend Warrior",
    devops_mage:     "🔮 DevOps Mage",
    architect_sage:  "📐 Architect Sage",
  };

  return (
    <div className="min-h-screen mesh-bg" style={{ paddingTop: "96px" }}>
      <div className="max-w-5xl mx-auto px-5 pb-20">

        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <p className="text-blue-400 font-mono text-xs font-medium mb-2 tracking-widest uppercase">
            The Kingdom of Legacy Systems
          </p>
          <h1 className="text-5xl font-black text-white tracking-tight mb-6">
            World <span className="text-gradient-blue">Map</span>
          </h1>

          {/* Player stats bar */}
          <GlassCard className="p-4 mb-6" glow="#3B82F6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
              <div>
                <p className="text-white font-bold text-lg">{playerName}</p>
                <p className="text-zinc-500 text-sm">{playerClass ? classLabel[playerClass] : ""}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <StatPill label="Total XP" value={xp} color="#3B82F6" />
                <StatPill label="Rank" value={rank} color="#8B5CF6" />
                <StatPill label="Zones" value={`${completedCount}/6`} color="#10B981" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-mono text-zinc-500 mb-1.5">
                <span>Overall progress</span>
                <span>{Math.round(xpPct)}% of max XP</span>
              </div>
              <ProgressBar value={xpPct} color="#3B82F6" height={6} animated />
            </div>
          </GlassCard>
        </motion.div>

        {/* ── Level grid ── */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {LEVELS.map((lvl, i) => {
            const theme = WORLD_THEMES[lvl.id];
            const visited = levelsVisited.includes(lvl.id);
            const completed = questsCompleted.includes(`level_${lvl.id}_complete`);
            const status = completed ? "complete" : visited ? "in-progress" : "unexplored";

            return (
              <motion.div
                key={lvl.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, type: "spring", stiffness: 260, damping: 24 }}
              >
                <GlassCard
                  hover
                  glow={completed || visited ? theme.primary : undefined}
                  accentColor={completed || visited ? theme.primary : undefined}
                  onClick={() => onEnterLevel(lvl.id)}
                  className="p-5 border cursor-pointer h-full"
                  style={{
                    borderColor: completed ? theme.primary + "50" : visited ? theme.primary + "25" : "rgba(255,255,255,0.06)",
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-4xl">{lvl.icon}</span>
                    <StatusBadge status={status} />
                  </div>

                  <ZoneBadge zone={lvl.id} color={theme.primary} />

                  <h3 className="text-white font-bold text-xl mt-2 mb-1.5 tracking-tight">
                    {lvl.title}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-4">{lvl.desc}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono" style={{ color: theme.primary + "99" }}>
                      Up to {lvl.maxXP.toLocaleString()} XP
                    </span>
                    <motion.span
                      className="text-xs font-semibold"
                      style={{ color: theme.primary }}
                      whileHover={{ x: 3 }}
                    >
                      Enter →
                    </motion.span>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        {/* ── Leaderboard CTA ── */}
        <div className="text-center">
          <GlowButton color="#F59E0B" size="lg" onClick={onViewScoreboard}>
            🏆 &nbsp;Global Leaderboard
          </GlowButton>
          <p className="text-zinc-600 text-sm mt-3">See where you rank against other adventurers</p>
        </div>
      </div>
    </div>
  );
}
