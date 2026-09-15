'use client';

import { useCallback } from 'react';
import { AutoRootMode, GameState, SkinId } from '@/types/game';
import {
  AUTO_RESET_COST,
  AUTO_ROOT_COST,
  calcBulkPrestigeUpgrade,
  EVENT_BONUS_MAX_LEVEL,
  eventBonusCost,
  eventDurationCost,
  eventDurationMaxed,
  goldenSeedCost,
  GOLDEN_SEED_MAX_LEVEL,
  luckyChanceCost,
  luckyChanceMaxed,
  luckyDurationCost,
  luckyDurationMaxed,
  LUCKY_DURATION_MAX_LEVEL,
  LUCKY_MAGNITUDE_MAX_LEVEL,
  luckyMagnitudeCost,
  offlineCapCost,
  offlineCapMaxed,
  passiveRateCost,
  PASSIVE_RATE_MAX_LEVEL,
  SKIN_COSTS,
  SKIN_PETAL_COSTS,
  SKIN_PRESTIGE_KEYS,
  STARTER_CULTURE_MAX_LEVEL,
  starterCultureCost,
} from '@/constants/gameData';

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
      amount || 1,
      GOLDEN_SEED_MAX_LEVEL
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
      amount || 1,
      PASSIVE_RATE_MAX_LEVEL
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
      prestige: {
        ...prev.prestige,
        autoRoot: true,
        autoRootSmart: true,
        autoRootAll: true,
        autoRootMode: 'all',
        autoRootEnabled: true,
        autoEvent: true,
        autoEventEnabled: true,
      },
    }));
  }, [stateRef, setState]);

  const buyAutoRootSmart = useCallback(() => {
    buyAutoRoot();
  }, [buyAutoRoot]);

  const buyAutoRootAll = useCallback(() => {
    buyAutoRoot();
  }, [buyAutoRoot]);

  const setAutoRootMode = useCallback((mode: AutoRootMode) => {
    setState(prev => ({
      ...prev,
      prestige: { ...prev.prestige, autoRootMode: mode, autoRootEnabled: true },
    }));
  }, [setState]);

  const cycleAutoRootMode = useCallback(() => {
    setState(prev => ({
      ...prev,
      prestige: { ...prev.prestige, autoRootEnabled: !prev.prestige.autoRootEnabled },
    }));
  }, [setState]);

  const buyAutoEvent = useCallback(() => {
    buyAutoRoot();
  }, [buyAutoRoot]);

  const toggleAutoRoot = useCallback(() => {
    setState(prev => {
      const nextEnabled = !prev.prestige.autoRootEnabled;
      return {
        ...prev,
        prestige: {
          ...prev.prestige,
          autoRootEnabled: nextEnabled,
          autoEventEnabled: nextEnabled,
        },
      };
    });
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
    const curLevel = cur.prestige.eventBonusLevel || 0;
    if (curLevel >= EVENT_BONUS_MAX_LEVEL) return;
    const { count, totalCost } = calcBulkPrestigeUpgrade(
      curLevel,
      cur.eternalSeeds,
      eventBonusCost,
      amount || 1,
      EVENT_BONUS_MAX_LEVEL
    );
    if (count <= 0) return;
    setState(prev => ({
      ...prev,
      eternalSeeds: prev.eternalSeeds - totalCost,
      prestige: { ...prev.prestige, eventBonusLevel: Math.min(EVENT_BONUS_MAX_LEVEL, (prev.prestige.eventBonusLevel || 0) + count) },
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
    const petalCost = SKIN_PETAL_COSTS[id];
    const cost = SKIN_COSTS[id] || 0;
    const prestigeKey = SKIN_PRESTIGE_KEYS[id];
    if (!prestigeKey) return;
    if (cur.prestige[prestigeKey as keyof typeof cur.prestige]) return;

    if (petalCost && petalCost > 0) {
      const petals = cur.transcendence?.astralPetals || 0;
      if (petals < petalCost) return;
      setState(prev => ({
        ...prev,
        transcendence: {
          ...prev.transcendence,
          astralPetals: (prev.transcendence?.astralPetals || 0) - petalCost,
        },
        prestige: {
          ...prev.prestige,
          [prestigeKey]: true,
          ...(autoEquip ? { activeSkin: id } : {}),
        },
      }));
      if (autoEquip && setPreviewSkin) {
        setPreviewSkin(null);
      }
      return;
    }

    if (cost <= 0 || cur.eternalSeeds < cost) return;
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
