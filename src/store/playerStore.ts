import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "../lib/supabase";
import { getRank, getLevel, getNextXPThreshold, type PlayerClass } from "../lib/constants";

export type GameStatus = "boot" | "world_map" | "level" | "scoreboard";
export type GameCompletion = "started" | "in_progress" | "completed" | "abandoned";

interface PlayerState {
  // identity
  sessionId: string | null;
  playerName: string;
  playerClass: PlayerClass | null;
  visitorId: string | null;       // from gateway localStorage
  entrySource: "gateway" | "direct";

  // progression
  xp: number;
  level: number;
  rank: string;
  rankColor: string;
  nextThreshold: number;
  questsCompleted: string[];
  achievements: string[];
  levelsVisited: number[];
  timeSpentSeconds: number;

  // ui state
  gameStatus: GameStatus;
  currentLevel: number | null;
  completionStatus: GameCompletion;

  // actions
  initFromGateway: () => void;
  startGame: (name: string, cls: PlayerClass) => Promise<void>;
  awardXP: (amount: number, label?: string) => void;
  completeQuest: (questId: string) => void;
  unlockAchievement: (id: string) => void;
  visitLevel: (level: number) => void;
  setGameStatus: (status: GameStatus) => void;
  setCurrentLevel: (level: number | null) => void;
  markCompleted: () => void;
  syncToSupabase: () => Promise<void>;
  reset: () => void;
}

const EMPTY: Omit<PlayerState, keyof { initFromGateway: unknown; startGame: unknown; awardXP: unknown; completeQuest: unknown; unlockAchievement: unknown; visitLevel: unknown; setGameStatus: unknown; setCurrentLevel: unknown; markCompleted: unknown; syncToSupabase: unknown; reset: unknown }> = {
  sessionId: null,
  playerName: "",
  playerClass: null,
  visitorId: null,
  entrySource: "direct",
  xp: 0,
  level: 1,
  rank: "Wanderer",
  rankColor: "#6B7280",
  nextThreshold: 50,
  questsCompleted: [],
  achievements: [],
  levelsVisited: [],
  timeSpentSeconds: 0,
  gameStatus: "boot",
  currentLevel: null,
  completionStatus: "started",
};

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      ...EMPTY,

      initFromGateway: () => {
        try {
          const raw = localStorage.getItem("jm_visitor");
          if (!raw) return;
          const data = JSON.parse(raw);
          if (data.visitor_id) {
            set({
              visitorId: data.visitor_id,
              entrySource: "gateway",
              playerName: data.name || "",
            });
          }
        } catch {}
      },

      startGame: async (name, cls) => {
        const { visitorId, entrySource } = get();
        const rank = getRank(0);

        let sessionId: string | null = null;
        if (supabase) {
          const { data } = await supabase
            .from("game_sessions")
            .insert({
              player_name: name,
              player_class: cls,
              visitor_id: visitorId,
              entry_source: entrySource,
              xp: 0,
              level: 1,
              rank: rank.label,
              game_status: "started",
            })
            .select("id")
            .single();
          sessionId = data?.id ?? null;
        }

        set({
          sessionId,
          playerName: name,
          playerClass: cls,
          xp: 0,
          level: 1,
          rank: rank.label,
          rankColor: rank.color,
          nextThreshold: 50,
          gameStatus: "world_map",
          completionStatus: "in_progress",
        });
      },

      awardXP: (amount) => {
        const { xp } = get();
        const newXP = xp + amount;
        const rank = getRank(newXP);
        set({
          xp: newXP,
          level: getLevel(newXP),
          rank: rank.label,
          rankColor: rank.color,
          nextThreshold: getNextXPThreshold(newXP),
          completionStatus: "in_progress",
        });
        get().syncToSupabase();
      },

      completeQuest: (questId) => {
        const { questsCompleted } = get();
        if (questsCompleted.includes(questId)) return;
        set({ questsCompleted: [...questsCompleted, questId] });
        get().syncToSupabase();
      },

      unlockAchievement: (id) => {
        const { achievements } = get();
        if (achievements.includes(id)) return;
        set({ achievements: [...achievements, id] });
        get().syncToSupabase();
      },

      visitLevel: (level) => {
        const { levelsVisited } = get();
        if (levelsVisited.includes(level)) return;
        set({ levelsVisited: [...levelsVisited, level] });
      },

      setGameStatus: (status) => set({ gameStatus: status }),
      setCurrentLevel: (level) => set({ currentLevel: level }),

      markCompleted: () => {
        set({ completionStatus: "completed", gameStatus: "scoreboard" });
        get().syncToSupabase();
      },

      syncToSupabase: async () => {
        const { sessionId, xp, level, rank, questsCompleted, achievements, levelsVisited, timeSpentSeconds, completionStatus } = get();
        if (!supabase || !sessionId) return;
        await supabase.from("game_sessions").update({
          xp,
          level,
          rank,
          quests_completed: questsCompleted,
          achievements,
          levels_visited: levelsVisited,
          time_spent_seconds: timeSpentSeconds,
          game_status: completionStatus,
          last_active_at: new Date().toISOString(),
          completed_at: completionStatus === "completed" ? new Date().toISOString() : null,
        }).eq("id", sessionId);
      },

      reset: () => set({ ...EMPTY }),
    }),
    {
      name: "jm_game_session",
      partializer: (state) => ({
        sessionId: state.sessionId,
        playerName: state.playerName,
        playerClass: state.playerClass,
        visitorId: state.visitorId,
        entrySource: state.entrySource,
        xp: state.xp,
        level: state.level,
        rank: state.rank,
        rankColor: state.rankColor,
        nextThreshold: state.nextThreshold,
        questsCompleted: state.questsCompleted,
        achievements: state.achievements,
        levelsVisited: state.levelsVisited,
        completionStatus: state.completionStatus,
      }),
    } as Parameters<typeof persist>[1]
  )
);
