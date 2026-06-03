import { useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePlayerStore } from "./store/playerStore";
import { HUD, XPFloater } from "./components/hud/HUD";
import { BootScreen } from "./screens/Boot/BootScreen";
import { WorldMap } from "./screens/WorldMap/WorldMap";
import { Scoreboard } from "./screens/Scoreboard/Scoreboard";
import { Level1 } from "./screens/Level1/Level1";
import { Level2 } from "./screens/Level2/Level2";
import { Level3 } from "./screens/Level3/Level3";
import { Level4 } from "./screens/Level4/Level4";
import { Level5 } from "./screens/Level5/Level5";
import { Level6 } from "./screens/Level6/Level6";
import { WORLD_THEMES } from "./lib/constants";
import { useXP } from "./hooks/useXP";
import "./index.css";

// Konami code: ↑↑↓↓←→←→BA
const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];

export default function App() {
  const { gameStatus, currentLevel, setGameStatus, setCurrentLevel, visitLevel, unlockAchievement } = usePlayerStore();
  const { award, events } = useXP();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const konamiRef = useRef<string[]>([]);

  // Time tracking
  useEffect(() => {
    if (gameStatus === "boot") return;
    timerRef.current = setInterval(() => {
      usePlayerStore.setState((s) => ({ timeSpentSeconds: s.timeSpentSeconds + 1 }));
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [gameStatus]);

  // Konami code easter egg
  const handleKey = useCallback((e: KeyboardEvent) => {
    konamiRef.current = [...konamiRef.current, e.key].slice(-KONAMI.length);
    if (konamiRef.current.join(",") === KONAMI.join(",")) {
      unlockAchievement("konami_master");
      award(500, undefined);
      alert("🎮 DEVELOPER MODE UNLOCKED\n+500 XP\nYou found the secret!");
    }
  }, [unlockAchievement, award]);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  // Background color changes with world theme
  const bgColor = currentLevel ? WORLD_THEMES[currentLevel]?.bg : "#0B1020";

  const enterLevel = (level: number) => {
    visitLevel(level);
    setCurrentLevel(level);
    setGameStatus("level");
    award(25); // XP for entering any level
  };

  const backToMap = () => {
    setCurrentLevel(null);
    setGameStatus("world_map");
  };

  return (
    <div style={{ background: bgColor, minHeight: "100vh", transition: "background 0.8s ease" }}>
      <HUD />
      <XPFloater events={events} />

      <AnimatePresence mode="wait">
        {gameStatus === "boot" && (
          <motion.div key="boot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <BootScreen />
          </motion.div>
        )}

        {gameStatus === "world_map" && (
          <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <WorldMap
              onEnterLevel={enterLevel}
              onViewScoreboard={() => setGameStatus("scoreboard")}
            />
          </motion.div>
        )}

        {gameStatus === "level" && currentLevel !== null && (
          <motion.div key={`level-${currentLevel}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <LevelRouter level={currentLevel} onBack={backToMap} onAwardXP={award} />
          </motion.div>
        )}

        {gameStatus === "scoreboard" && (
          <motion.div key="scoreboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Scoreboard onBack={() => setGameStatus("world_map")} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LevelRouter({ level, onBack }: { level: number; onBack: () => void; onAwardXP: (xp: number, questId?: string) => void }) {
  if (level === 1) return <Level1 onBack={onBack} />;
  if (level === 2) return <Level2 onBack={onBack} />;
  if (level === 3) return <Level3 onBack={onBack} />;
  if (level === 4) return <Level4 onBack={onBack} />;
  if (level === 5) return <Level5 onBack={onBack} />;
  if (level === 6) return <Level6 onBack={onBack} />;
  return null;
}
