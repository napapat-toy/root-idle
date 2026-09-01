'use client';

import { useCallback } from 'react';
import { AutoRootMode, GameState, SkinId } from '@/types/game';
import {
  AUTO_EVENT_COST,
  AUTO_RESET_COST,
  AUTO_ROOT_ALL_COST,
  AUTO_ROOT_COST,
  AUTO_ROOT_SMART_COST,
  calcBulkPrestigeUpgrade,
  eventBonusCost,
  eventDurationCost,
  eventDurationMaxed,
  goldenSeedCost,
  luckyChanceCost,
  luckyChanceMaxed,
  luckyDurationCost,
  luckyDurationMaxed,
  LUCKY_DURATION_MAX_LEVEL,
  luckyMagnitudeCost,
  LUCKY_MAGNITUDE_MAX_LEVEL,
  offlineCapCost,
  offlineCapMaxed,
  passiveRateCost,
  SKIN_COSTS,
  SKIN_PRESTIGE_KEYS,
  STARTER_CULTURE_MAX_LEVEL,
  starterCultureCost,
} from '@/constants/gameData';
import { getActiveAutoRootMode, getAvailableAutoRootModes } from '@/lib/autoBuyer';

interface UsePrestigeShopProps {
  stateRef: React.MutableRefObject<GameState>;
  setState: React.Dispatch<React.SetStateAction<GameState>>;
  setPreviewSkin?: (id: SkinId | null) => void;
}

export function usePrestigeShop({ stateRef, setState, setPreviewSkin }: UsePrestigeShopProps) {
  const buyStarterCulture = useCallback((amount?: number | 'max') => {
    const cur = stateRef.current;
    const { count, totalCost } = calcBulkPrestigeUpgrade(
      cur.prestige.starterLevel || 0,
      cur.eternalSeeds,
      starterCultureCost,
      amount || 1,
      STARTER_CULTURE_MAX_LEVEL
    );
    if (count <= 0) return;
    setState(prev => ({
      ...prev,
      eternalSeeds: prev.eternalSeeds - totalCost,
      prestige: { ...prev.prestige, starterLevel: (prev.prestige.starterLevel || 0) + count },
      owned: { ...prev.owned, fine: (prev.owned['fine'] || 0) + 10 * count },
      totalOwned: prev.totalOwned + 10 * count,
    }));
  }, [stateRef, setState]);

  const buyGoldenSeed = useCallback((amount?: number | 'max') => {
    const cur = stateRef.current;
    const { count, totalCost } = calcBulkPrestigeUpgrade(
      cur.prestige.goldenLevel || 0,
      cur.eternalSeeds,
      goldenSeedCost,
      amount || 1
    );
    if (count <= 0) return;
    setState(prev => ({
      ...prev,
      eternalSeeds: prev.eternalSeeds - totalCost,
      prestige: { ...prev.prestige, goldenLevel: (prev.prestige.goldenLevel || 0) + count },
    }));
  }, [stateRef, setState]);

  const buyPassiveRate = useCallback((amount?: number | 'max') => {
    const cur = stateRef.current;
    const { count, totalCost } = calcBulkPrestigeUpgrade(
      cur.prestige.passiveRateLevel || 0,
      cur.eternalSeeds,
      passiveRateCost,
      amount || 1
    );
    if (count <= 0) return;
    setState(prev => ({
      ...prev,
      eternalSeeds: prev.eternalSeeds - totalCost,
      prestige: {
        ...prev.prestige,
        passiveRateLevel: (prev.prestige.passiveRateLevel || 0) + count,
      },
    }));
  }, [stateRef, setState]);

  const buyAutoRoot = useCallback(() => {
    const cur = stateRef.current;
    if (cur.prestige.autoRoot || cur.eternalSeeds < AUTO_ROOT_COST) return;
    setState(prev => ({
      ...prev,
      eternalSeeds: prev.eternalSeeds - AUTO_ROOT_COST,
      prestige: { ...prev.prestige, autoRoot: true, autoRootMode: 'basic', autoRootEnabled: true },
    }));
  }, [stateRef, setState]);

  const buyAutoRootSmart = useCallback(() => {
    const cur = stateRef.current;
    if (!cur.prestige.autoRoot || cur.prestige.autoRootSmart || cur.eternalSeeds < AUTO_ROOT_SMART_COST) return;
    setState(prev => ({
      ...prev,
      eternalSeeds: prev.eternalSeeds - AUTO_ROOT_SMART_COST,
      prestige: { ...prev.prestige, autoRootSmart: true, autoRootMode: 'smart', autoRootEnabled: true },
    }));
  }, [stateRef, setState]);

  const buyAutoRootAll = useCallback(() => {
    const cur = stateRef.current;
    if (!cur.prestige.autoRootSmart || cur.prestige.autoRootAll || cur.eternalSeeds < AUTO_ROOT_ALL_COST) return;
    setState(prev => ({
      ...prev,
      eternalSeeds: prev.eternalSeeds - AUTO_ROOT_ALL_COST,
      prestige: { ...prev.prestige, autoRootAll: true, autoRootMode: 'all', autoRootEnabled: true },
    }));
  }, [stateRef, setState]);

  const setAutoRootMode = useCallback((mode: AutoRootMode) => {
    setState(prev => ({
      ...prev,
      prestige: { ...prev.prestige, autoRootMode: mode, autoRootEnabled: true },
    }));
  }, [setState]);

  const cycleAutoRootMode = useCallback(() => {
    setState(prev => {
      const available = getAvailableAutoRootModes(prev);
      if (available.length === 0) return prev;
      if (!prev.prestige.autoRootEnabled) {
        return {
          ...prev,
          prestige: { ...prev.prestige, autoRootEnabled: true },
        };
      }
      const current = getActiveAutoRootMode(prev);
      const idx = available.indexOf(current);
      if (idx < available.length - 1) {
        return {
          ...prev,
          prestige: { ...prev.prestige, autoRootMode: available[idx + 1] },
        };
      } else {
        return {
          ...prev,
          prestige: { ...prev.prestige, autoRootEnabled: false, autoRootMode: available[0] },
        };
      }
    });
  }, [setState]);

  const buyAutoEvent = useCallback(() => {
    const cur = stateRef.current;
    if (cur.prestige.autoEvent || cur.eternalSeeds < AUTO_EVENT_COST) return;
    setState(prev => ({
      ...prev,
      eternalSeeds: prev.eternalSeeds - AUTO_EVENT_COST,
      prestige: { ...prev.prestige, autoEvent: true },
    }));
  }, [stateRef, setState]);

  const toggleAutoRoot = useCallback(() => {
    setState(prev => ({
      ...prev,
      prestige: { ...prev.prestige, autoRootEnabled: !prev.prestige.autoRootEnabled },
    }));
  }, [setState]);

  const toggleAutoEvent = useCallback(() => {
    setState(prev => ({
      ...prev,
      prestige: { ...prev.prestige, autoEventEnabled: !prev.prestige.autoEventEnabled },
    }));
  }, [setState]);

  const toggleAutoReset = useCallback(() => {
    setState(prev => ({
      ...prev,
      prestige: { ...prev.prestige, autoResetEnabled: !prev.prestige.autoResetEnabled },
    }));
  }, [setState]);

  const setAutoResetThreshold = useCallback((threshold: number) => {
    setState(prev => ({
      ...prev,
      prestige: {
        ...prev.prestige,
        autoResetThreshold: Math.max(10, threshold),
        autoResetEnabled: true,
      },
    }));
  }, [setState]);

  const buyAutoReset = useCallback(() => {
    const cur = stateRef.current;
    if (cur.prestige.autoReset || cur.eternalSeeds < AUTO_RESET_COST) return;
    setState(prev => ({
      ...prev,
      eternalSeeds: prev.eternalSeeds - AUTO_RESET_COST,
      prestige: { ...prev.prestige, autoReset: true, autoResetEnabled: false },
    }));
  }, [stateRef, setState]);

  const buyEventBonus = useCallback((amount?: number | 'max') => {
    const cur = stateRef.current;
    const { count, totalCost } = calcBulkPrestigeUpgrade(
      cur.prestige.eventBonusLevel || 0,
      cur.eternalSeeds,
      eventBonusCost,
      amount || 1
    );
    if (count <= 0) return;
    setState(prev => ({
      ...prev,
      eternalSeeds: prev.eternalSeeds - totalCost,
      prestige: { ...prev.prestige, eventBonusLevel: (prev.prestige.eventBonusLevel || 0) + count },
    }));
  }, [stateRef, setState]);

  const buyEventDuration = useCallback(() => {
    const cur = stateRef.current;
    if (eventDurationMaxed(cur)) return;
    const cost = eventDurationCost(cur);
    if (cur.eternalSeeds < cost) return;
    setState(prev => ({
      ...prev,
      eternalSeeds: prev.eternalSeeds - cost,
      prestige: { ...prev.prestige, eventDurationLevel: prev.prestige.eventDurationLevel + 1 },
    }));
  }, [stateRef, setState]);

  const buyLuckyChance = useCallback(() => {
    const cur = stateRef.current;
    if (luckyChanceMaxed(cur)) return;
    const cost = luckyChanceCost(cur);
    if (cur.eternalSeeds < cost) return;
    setState(prev => ({
      ...prev,
      eternalSeeds: prev.eternalSeeds - cost,
      prestige: { ...prev.prestige, luckyChanceLevel: prev.prestige.luckyChanceLevel + 1 },
    }));
  }, [stateRef, setState]);

  const buyLuckyMagnitude = useCallback((amount?: number | 'max') => {
    const cur = stateRef.current;
    const { count, totalCost } = calcBulkPrestigeUpgrade(
      cur.prestige.luckyMagnitudeLevel || 0,
      cur.eternalSeeds,
      luckyMagnitudeCost,
      amount || 1,
      LUCKY_MAGNITUDE_MAX_LEVEL
    );
    if (count <= 0) return;
    setState(prev => ({
      ...prev,
      eternalSeeds: prev.eternalSeeds - totalCost,
      prestige: { ...prev.prestige, luckyMagnitudeLevel: (prev.prestige.luckyMagnitudeLevel || 0) + count },
    }));
  }, [stateRef, setState]);

  const buyLuckyDuration = useCallback((amount?: number | 'max') => {
    const cur = stateRef.current;
    if (luckyDurationMaxed(cur)) return;
    const { count, totalCost } = calcBulkPrestigeUpgrade(
      cur.prestige.luckyDurationLevel || 0,
      cur.eternalSeeds,
      luckyDurationCost,
      amount || 1,
      LUCKY_DURATION_MAX_LEVEL
    );
    if (count <= 0) return;
    setState(prev => ({
      ...prev,
      eternalSeeds: prev.eternalSeeds - totalCost,
      prestige: { ...prev.prestige, luckyDurationLevel: (prev.prestige.luckyDurationLevel || 0) + count },
    }));
  }, [stateRef, setState]);

  const buyOfflineCapUpgrade = useCallback(() => {
    const cur = stateRef.current;
    if (offlineCapMaxed(cur)) return;
    const cost = offlineCapCost(cur);
    if (cur.eternalSeeds < cost) return;
    setState(prev => ({
      ...prev,
      eternalSeeds: prev.eternalSeeds - cost,
      prestige: { ...prev.prestige, offlineCapLevel: prev.prestige.offlineCapLevel + 1 },
    }));
  }, [stateRef, setState]);

  const buySkin = useCallback((id: SkinId, autoEquip = false) => {
    const cur = stateRef.current;
    const cost = SKIN_COSTS[id] || 0;
    const prestigeKey = SKIN_PRESTIGE_KEYS[id];
    if (!prestigeKey || cost <= 0) return;
    if (cur.prestige[prestigeKey as keyof typeof cur.prestige] || cur.eternalSeeds < cost) return;
    setState(prev => ({
      ...prev,
      eternalSeeds: prev.eternalSeeds - cost,
      prestige: {
        ...prev.prestige,
        [prestigeKey]: true,
        ...(autoEquip ? { activeSkin: id } : {}),
      },
    }));
    if (autoEquip && setPreviewSkin) {
      setPreviewSkin(null);
    }
  }, [stateRef, setState, setPreviewSkin]);

  return {
    buyStarterCulture,
    buyGoldenSeed,
    buyPassiveRate,
    buyAutoRoot,
    buyAutoRootSmart,
    buyAutoRootAll,
    setAutoRootMode,
    cycleAutoRootMode,
    buyAutoEvent,
    toggleAutoEvent,
    buyAutoReset,
    toggleAutoReset,
    setAutoResetThreshold,
    toggleAutoRoot,
    buyEventBonus,
    buyEventDuration,
    buyLuckyChance,
    buyLuckyMagnitude,
    buyLuckyDuration,
    buyOfflineCapUpgrade,
    buySkin,
  };
}
