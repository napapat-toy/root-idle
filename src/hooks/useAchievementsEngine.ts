'use client';

import { useState, useCallback, useEffect } from 'react';
import { GameState } from '@/types/game';
import type { AchievementDef } from '@/types/achievements';
import { ACHIEVEMENTS } from '@/constants/achievementsData';
import { saveToLocalStorage } from '@/lib/storage';

interface UseAchievementsEngineProps {
  stateRef: React.MutableRefObject<GameState>;
  setState: React.Dispatch<React.SetStateAction<GameState>>;
  totalRate: () => number;
}

export function useAchievementsEngine({ stateRef, setState, totalRate }: UseAchievementsEngineProps) {
  const [achievementToastQueue, setAchievementToastQueue] = useState<AchievementDef[]>([]);

  const dismissAchievementToast = useCallback((id: string) => {
    setAchievementToastQueue(prev => prev.filter(a => a.id !== id));
  }, []);

  // Achievement Check Loop (every 1s)
  useEffect(() => {
    const interval = setInterval(() => {
      const cur = stateRef.current;
      const rate = totalRate();
      const currentAch = new Set(cur.achievements || []);
      const newUnlocked: string[] = [];

      ACHIEVEMENTS.forEach((ach: AchievementDef) => {
        if (!currentAch.has(ach.id) && ach.check(cur, rate)) {
          newUnlocked.push(ach.id);
        }
      });

      if (newUnlocked.length > 0) {
        setState(prev => {
          const updatedAch = [...(prev.achievements || []), ...newUnlocked];
          const nextState = { ...prev, achievements: updatedAch };
          saveToLocalStorage(nextState);
          return nextState;
        });

        // Trigger toast notifications for newly unlocked achievements
        newUnlocked.forEach(id => {
          const def = ACHIEVEMENTS.find(a => a.id === id);
          if (def) {
            setAchievementToastQueue(prev => [...prev, def]);
          }
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [stateRef, setState, totalRate]);

  return {
    achievementToastQueue,
    dismissAchievementToast,
  };
}
