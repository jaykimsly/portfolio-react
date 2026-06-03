import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../../lib/supabase";
import { usePlayerStore } from "../../store/playerStore";

interface Row {
  id: string;
  player_name: string;
  player_class: string;
  xp: number;
  level: number;
  rank: string;
  game_status: string;
  entry_source: string;
  time_spent_seconds: number;
  quests_completed: string[];
  started_at: string;
}

const MEDALS = ["🥇", "🥈", "🥉"];

const CLASS_EMOJI: Record<string, string> = {
  frontend_ranger: "🏹",
  backend_warrior: "⚔️",
  devops_mage: "🔮",
  architect_sage: "📐",
};

function fmt(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

interface ScoreboardProps {
  onBack: () => void;
}

export function Scoreboard({ onBack }: ScoreboardProps) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const { sessionId } = usePlayerStore();

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }

    supabase
      .from("game_sessions")
      .select("id, player_name, player_class, xp, level, rank, game_status, entry_source, time_spent_seconds, quests_completed, started_at")
      .order("xp", { ascending: false })
      .limit(50)
      .then(({ data }) => { setRows(data ?? []); setLoading(false); });

    // Realtime updates
    const channel = supabase
      .channel("leaderboard")
      .on("postgres_changes", { event: "*", schema: "public", table: "game_sessions" }, () => {
        supabase!
          .from("game_sessions")
          .select("id, player_name, player_class, xp, level, rank, game_status, entry_source, time_spent_seconds, quests_completed, started_at")
          .order("xp", { ascending: false })
          .limit(50)
          .then(({ data }) => setRows(data ?? []));
      })
      .subscribe();

    return () => { supabase!.removeChannel(channel); };
  }, []);

  return (
    <div className="min-h-screen bg-[#0B1020] px-4 py-20">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="text-5xl mb-3">🏆</div>
          <h1 className="text-4xl font-bold text-white mb-2">Global Leaderboard</h1>
          <p className="text-zinc-500 text-sm">Live · Updates in real time</p>
        </motion.div>

        {loading ? (
          <p className="text-zinc-500 text-center">Loading scores...</p>
        ) : rows.length === 0 ? (
          <p className="text-zinc-600 text-center">No adventurers yet. Be the first!</p>
        ) : (
          <div className="space-y-2">
            {rows.map((row, i) => {
              const isMe = row.id === sessionId;
              return (
                <motion.div
                  key={row.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`flex items-center gap-4 px-5 py-4 rounded-xl border transition-all ${
                    isMe
                      ? "border-blue-500/60 bg-blue-500/10"
                      : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
                  }`}
                >
                  {/* Rank */}
                  <div className="w-8 text-center text-lg flex-shrink-0">
                    {i < 3 ? MEDALS[i] : <span className="text-zinc-600 text-sm font-mono">#{i + 1}</span>}
                  </div>

                  {/* Class emoji */}
                  <span className="text-xl flex-shrink-0">{CLASS_EMOJI[row.player_class] ?? "🎮"}</span>

                  {/* Name + rank */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-white font-semibold truncate">
                        {row.player_name}
                        {isMe && <span className="text-blue-400 text-xs ml-1">(you)</span>}
                      </p>
                    </div>
                    <p className="text-zinc-500 text-xs">{row.rank} · Lv.{row.level}</p>
                  </div>

                  {/* Status badge */}
                  <div className="hidden sm:block flex-shrink-0">
                    <StatusBadge status={row.game_status} />
                  </div>

                  {/* Source */}
                  <div className="hidden md:block text-xs text-zinc-600 flex-shrink-0 w-16 text-center">
                    {row.entry_source === "gateway" ? "🔗 Portal" : "🎯 Direct"}
                  </div>

                  {/* Time */}
                  <div className="text-xs text-zinc-600 flex-shrink-0 w-14 text-right font-mono">
                    {fmt(row.time_spent_seconds)}
                  </div>

                  {/* XP */}
                  <div className="flex-shrink-0 text-right w-20">
                    <p className="text-green-400 font-bold font-mono">{row.xp.toLocaleString()}</p>
                    <p className="text-zinc-600 text-[10px]">XP</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="text-center mt-10">
          <button
            onClick={onBack}
            className="px-6 py-3 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-600 rounded-full transition-colors text-sm"
          >
            ← Back to World Map
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { color: string; label: string }> = {
    completed:   { color: "text-green-400 bg-green-500/15 border-green-500/30",  label: "✓ Completed" },
    in_progress: { color: "text-yellow-400 bg-yellow-500/15 border-yellow-500/30", label: "⚡ Playing" },
    started:     { color: "text-blue-400 bg-blue-500/15 border-blue-500/30",     label: "👣 Started" },
    abandoned:   { color: "text-zinc-500 bg-zinc-800 border-zinc-700",           label: "↩ Left" },
  };
  const c = config[status] ?? config.started;
  return (
    <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${c.color}`}>
      {c.label}
    </span>
  );
}
