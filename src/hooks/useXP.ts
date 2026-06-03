import { useCallback, useState } from "react";
import { usePlayerStore } from "../store/playerStore";

interface XPEvent {
  id: number;
  amount: number;
  x: number;
  y: number;
}

let _id = 0;

export function useXP() {
  const awardXP = usePlayerStore((s) => s.awardXP);
  const completeQuest = usePlayerStore((s) => s.completeQuest);
  const [events, setEvents] = useState<XPEvent[]>([]);

  const award = useCallback(
    (amount: number, questId?: string, originEl?: HTMLElement) => {
      awardXP(amount);
      if (questId) completeQuest(questId);

      const rect = originEl?.getBoundingClientRect();
      const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
      const y = rect ? rect.top : window.innerHeight / 2;

      const ev: XPEvent = { id: _id++, amount, x, y };
      setEvents((prev) => [...prev, ev]);
      setTimeout(() => setEvents((prev) => prev.filter((e) => e.id !== ev.id)), 1200);
    },
    [awardXP, completeQuest]
  );

  return { award, events };
}
