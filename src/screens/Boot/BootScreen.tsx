import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayerStore } from "../../store/playerStore";
import { PLAYER_CLASSES, type PlayerClass } from "../../lib/constants";
import { ParticleField } from "../../components/effects/ParticleField";
import { GlassCard, GlowButton } from "../../components/ui/GameUI";

export function BootScreen() {
  const { initFromGateway, startGame, playerName, visitorId } = usePlayerStore();
  const [name, setName] = useState("");
  const [selectedClass, setSelectedClass] = useState<PlayerClass | null>(null);
  const [step, setStep] = useState<"name" | "class" | "launching">("name");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { initFromGateway(); }, [initFromGateway]);
  useEffect(() => {
    if (visitorId && playerName) { setName(playerName); setStep("class"); }
  }, [visitorId, playerName]);

  const handleNameSubmit = () => {
    const t = name.trim();
    if (t.length < 3) return setError("Minimum 3 characters");
    if (t.length > 50) return setError("Maximum 50 characters");
    setError("");
    setStep("class");
  };

  const handleStart = async () => {
    if (!selectedClass) return;
    setLoading(true);
    setStep("launching");
    await startGame(name.trim(), selectedClass);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden mesh-bg grain scanlines">
      <ParticleField />

      {/* Ambient blobs */}
      <div className="absolute top-1/4 left-1/5 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)" }} />
      <div className="absolute bottom-1/4 right-1/5 w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)" }} />

      <AnimatePresence mode="wait">

        {/* ── NAME STEP ── */}
        {step === "name" && (
          <motion.div key="name"
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="relative z-10 text-center max-w-md w-full px-6"
          >
            {/* Logo mark */}
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
              className="relative inline-block mb-8"
            >
              <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-5xl mx-auto relative"
                style={{
                  background: "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2))",
                  border: "1px solid rgba(59,130,246,0.3)",
                  boxShadow: "0 0 40px rgba(59,130,246,0.2), 0 0 80px rgba(139,92,246,0.1), inset 0 1px 0 rgba(255,255,255,0.1)"
                }}>
                🎮
              </div>
              <div className="absolute inset-0 rounded-2xl float" style={{ background: "transparent" }} />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl font-black tracking-tight mb-2"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <span className="text-gradient-blue">Developer</span>
              <br />
              <span className="text-white">Adventure</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-zinc-400 text-base leading-relaxed mb-10"
            >
              Explore Joachim's skills &amp; projects.<br />
              Earn XP. Climb the global leaderboard.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <GlassCard className="p-1 mb-3" glow="#3B82F6">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleNameSubmit()}
                  placeholder="Enter your name to begin..."
                  maxLength={50}
                  autoFocus
                  className="w-full bg-transparent px-5 py-4 text-white placeholder-zinc-600 text-lg focus:outline-none text-center font-medium"
                />
              </GlassCard>

              <div className="flex justify-between text-xs mb-5 px-1">
                <span className="text-red-400">{error}</span>
                <span className="text-zinc-600">{name.length}/50</span>
              </div>

              <GlowButton
                color="#3B82F6"
                size="lg"
                onClick={handleNameSubmit}
                disabled={name.trim().length < 3}
                className="w-full"
              >
                Continue →
              </GlowButton>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-zinc-700 text-sm mt-6"
            >
              3–50 characters · shown on the global leaderboard
            </motion.p>
          </motion.div>
        )}

        {/* ── CLASS STEP ── */}
        {step === "class" && (
          <motion.div key="class"
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="relative z-10 max-w-lg w-full px-6"
          >
            <div className="text-center mb-8">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-blue-400 text-sm font-mono font-medium mb-3"
              >
                Welcome, {name} 👋
              </motion.p>
              <h2 className="text-4xl font-black text-white tracking-tight mb-2">
                Choose Your <span className="text-gradient-purple">Class</span>
              </h2>
              <p className="text-zinc-400 text-base">Your class shapes your XP bonuses</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {PLAYER_CLASSES.map((cls, i) => {
                const isSelected = selectedClass === cls.id;
                return (
                  <motion.div
                    key={cls.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07, type: "spring", stiffness: 300, damping: 24 }}
                  >
                    <GlassCard
                      hover
                      active={isSelected}
                      glow={isSelected ? "#8B5CF6" : undefined}
                      accentColor={isSelected ? "#8B5CF6" : undefined}
                      onClick={() => setSelectedClass(cls.id as PlayerClass)}
                      className={`p-5 text-left border-2 transition-all duration-200 ${
                        isSelected ? "border-purple-500/50" : "border-transparent hover:border-white/8"
                      }`}
                    >
                      <div className="text-4xl mb-3">{cls.emoji}</div>
                      <p className={`font-bold text-sm mb-1.5 ${isSelected ? "text-white" : "text-zinc-200"}`}>
                        {cls.label}
                      </p>
                      <p className="text-zinc-500 text-xs leading-relaxed">{cls.bonus}</p>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-3 right-3 w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center"
                        >
                          <span className="text-white text-xs font-bold">✓</span>
                        </motion.div>
                      )}
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>

            <div className="flex gap-3">
              {!visitorId && (
                <GlowButton color="#52525b" variant="outline" onClick={() => setStep("name")} className="px-5">
                  ← Back
                </GlowButton>
              )}
              <GlowButton
                color="#8B5CF6"
                size="lg"
                onClick={handleStart}
                disabled={!selectedClass || loading}
                className="flex-1"
              >
                {loading ? "Entering Kingdom..." : "Begin Adventure ⚔️"}
              </GlowButton>
            </div>
          </motion.div>
        )}

        {/* ── LAUNCHING ── */}
        {step === "launching" && (
          <motion.div key="launch"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              className="text-7xl mb-6"
            >
              ⚔️
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-2">Entering the Kingdom...</h2>
            <p className="text-zinc-500">Preparing your adventure</p>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
