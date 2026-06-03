import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayerStore } from "../../store/playerStore";
import { useXP } from "../../hooks/useXP";
import { ARCH_QUESTIONS } from "../../lib/gameData";
import { LevelLayout } from "../../components/ui/LevelLayout";

interface Props { onBack: () => void; }

export function Level6({ onBack }: Props) {
  const { questsCompleted } = usePlayerStore();
  const { award } = useXP();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === ARCH_QUESTIONS.length;
  const correctCount = ARCH_QUESTIONS.filter((q) =>
    q.options.find((o) => o.id === answers[q.id])?.correct
  ).length;

  const handleAnswer = (qId: string, optId: string, correct: boolean, xp: number) => {
    if (answers[qId]) return;
    setAnswers((p) => ({ ...p, [qId]: optId }));
    setTimeout(() => {
      setRevealed((p) => ({ ...p, [qId]: true }));
      const qid = `l6_${qId}`;
      if (!questsCompleted.includes(qid)) award(correct ? xp : Math.round(xp * 0.4), qid);
    }, 400);
  };

  return (
    <LevelLayout
      level={6} title="Architecture Citadel" onBack={onBack}
      subtitle="Real system design decisions. Pick your approach — then see how JM thinks about it."
      progress={`${answeredCount}/${ARCH_QUESTIONS.length} answered · ${correctCount} correct`}
    >
      <div className="space-y-12 mb-10">
        {ARCH_QUESTIONS.map((q, qi) => {
          const chosen = answers[q.id];
          const isRevealed = revealed[q.id];

          return (
            <motion.div key={q.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: qi * 0.1 }}>

              {/* Scenario card */}
              <div className="p-5 rounded-2xl border-2 border-zinc-800 bg-zinc-900/60 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-400">
                    SCENARIO {qi + 1}
                  </span>
                  {isRevealed && (
                    <span className={`font-mono text-xs font-bold px-2.5 py-1 rounded-lg border ${
                      q.options.find((o) => o.id === chosen)?.correct
                        ? "bg-green-500/15 border-green-500/30 text-green-400"
                        : "bg-red-500/15 border-red-500/30 text-red-400"
                    }`}>
                      {q.options.find((o) => o.id === chosen)?.correct ? `+${q.xp} XP` : `+${Math.round(q.xp * 0.4)} XP`}
                    </span>
                  )}
                </div>
                <p className="text-zinc-300 text-base leading-relaxed mb-4">{q.scenario}</p>
                <p className="text-white font-bold text-lg">{q.question}</p>
              </div>

              {/* Options */}
              <div className="space-y-2.5 mb-4">
                {q.options.map((opt) => {
                  const isChosen = chosen === opt.id;
                  const showResult = isRevealed && isChosen;
                  const showCorrect = isRevealed && opt.correct && !isChosen;

                  let border = "border-zinc-800";
                  let bg = "bg-zinc-900/40";
                  let text = "text-zinc-300";
                  let cursor = chosen ? "cursor-default" : "cursor-pointer hover:border-purple-500/40 hover:bg-purple-500/5";

                  if (isChosen && !isRevealed) { border = "border-purple-500/70"; bg = "bg-purple-500/12"; text = "text-white"; }
                  if (showResult && opt.correct)  { border = "border-green-500/60"; bg = "bg-green-500/10"; text = "text-green-300"; }
                  if (showResult && !opt.correct) { border = "border-red-500/50";   bg = "bg-red-500/8";    text = "text-red-300"; }
                  if (showCorrect)                { border = "border-green-500/35"; bg = "bg-green-500/5";  text = "text-green-400"; }

                  return (
                    <motion.button key={opt.id}
                      whileHover={chosen ? {} : { scale: 1.005 }}
                      whileTap={chosen ? {} : { scale: 0.995 }}
                      onClick={() => handleAnswer(q.id, opt.id, opt.correct, q.xp)}
                      disabled={!!chosen}
                      className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all ${border} ${bg} ${cursor}`}
                    >
                      <div className="flex items-start gap-4">
                        <span className={`font-mono text-sm font-bold flex-shrink-0 w-6 mt-0.5 ${text}`}>
                          {opt.id.toUpperCase()}
                        </span>
                        <div className="flex-1">
                          <p className={`text-sm font-medium leading-relaxed ${text}`}>{opt.label}</p>
                          <AnimatePresence>
                            {showResult && (
                              <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                                className="overflow-hidden text-xs mt-2 leading-relaxed opacity-80" style={{ color: "inherit" }}>
                                {opt.feedback}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                        {isRevealed && opt.correct && <span className="text-green-400 text-lg flex-shrink-0">✓</span>}
                        {showResult && !opt.correct && <span className="text-red-400 text-lg flex-shrink-0">✗</span>}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* JM's reasoning */}
              <AnimatePresence>
                {isRevealed && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl border-2 border-purple-500/30 bg-purple-500/6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">⚡</span>
                      <p className="text-purple-300 font-bold text-sm">JM's Reasoning</p>
                    </div>
                    <p className="text-zinc-300 text-sm leading-relaxed">{q.jmAnswer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <motion.button
        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
        onClick={() => { if (!questsCompleted.includes("level_6_complete")) award(100, "level_6_complete"); }}
        disabled={!allAnswered}
        className="w-full py-4 rounded-xl font-bold text-base transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-purple-600 hover:bg-purple-500 text-white"
      >
        {allAnswered
          ? `Citadel Conquered — ${correctCount}/${ARCH_QUESTIONS.length} correct · +100 XP →`
          : `Answer all questions (${answeredCount}/${ARCH_QUESTIONS.length})`
        }
      </motion.button>
    </LevelLayout>
  );
}
