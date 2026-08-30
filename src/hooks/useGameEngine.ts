'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  ActiveBuff,
  AutoRootMode,
  BiomeId,
  FloatingTextItem,
  GameEventItem,
  GameState,
  Language,
  SkinId,
  UIThemeId,
} from '@/types/game';
import type { AchievementDef } from '@/types/achievements';
import { ACHIEVEMENTS } from '@/constants/achievementsData';
import {
  AUTO_EVENT_COST,
  AUTO_RESET_COST,
  AUTO_RESET_MIN_SEEDS,
  AUTO_ROOT_ALL_COST,
  AUTO_ROOT_COST,
  AUTO_ROOT_SMART_COST,
  baseTotalRate,
  bulkCostFor,
  calcBulkPrestigeUpgrade,
  calcPrestigeSeeds,
  createFreshState,
  currentOfflineCapSeconds,
  echoCost,
  echoUnlockedFor,
  eventBonusCost,
  eventBonusMult,
  eventDurationCost,
  eventDurationMaxed,
  eventDurationMult,
  goldenSeedCost,
  luckyChanceCost,
  luckyChanceMaxed,
  luckyChancePct,
  luckyDurationCost,
  luckyDurationMaxed,
  LUCKY_DURATION_MAX_LEVEL,
  luckyDurationSeconds,
  luckyMagnitudeCost,
  luckyMagnitudeExtra,
  LUCKY_MAGNITUDE_MAX_LEVEL,
  MODULE_DEFS,
  offlineCapCost,
  offlineCapMaxed,
  passiveRateCost,
  prestigeUnlocked,
  rootSynergyCost,
  rootSynergyUnlocked,
  rootUpgradeCost,
  rootUpgradeRequireOwned,
  isSkinUnlocked,
  isUIThemeUnlocked,
  SKIN_COSTS,
  SKIN_CYCLE_ORDER,
  SKIN_PRESTIGE_KEYS,
  STARTER_CULTURE_MAX_LEVEL,
  starterCultureCost,
  starterRootsCount,
  RELIC_DEFS,
  hasRelic,
  pickWeightedUnownedRelic,
  unownedRelicList,
  UI_THEME_COSTS,
  UI_THEME_ORDER,
  UI_THEME_PRESTIGE_KEYS,
  calcTranscendenceEssences,
  isTranscendenceUnlocked,
  primordialVigorCost,
  soilMemoryCost,
  soilMemoryRetainPct,
  gaiaTouchCost,
  gaiaTouchBonusMult,
  TRIAL_DEFS,
  PRIMORDIAL_VIGOR_MAX_LEVEL,
  SOIL_MEMORY_MAX_LEVEL,
  GAIA_TOUCH_MAX_LEVEL,
  AUTO_MANAGER_COST,
} from '@/constants/gameData';
import { TrialId } from '@/types/game';
import { buildBranchesFromLog, deriveLog } from '@/lib/treeGenerator';
import { evaluateAutoBuy, getActiveAutoRootMode, getAvailableAutoRootModes } from '@/lib/autoBuyer';
import {
  decodeSave,
  deleteSlot,
  encodeSave,
  getSlotMeta,
  loadFromLocalStorage,
  payloadToState,
  saveSlot,
  saveToLocalStorage,
} from '@/lib/storage';
import { fmt, fmtInt, fmtMultiplier } from '@/lib/formatters';

export function useGameEngine() {
  const [state, setState] = useState<GameState>(createFreshState);
  const [activeBuff, setActiveBuff] = useState<ActiveBuff | null>(null);
  const [activeLuckyBuff, setActiveLuckyBuff] = useState<ActiveBuff | null>(null);
  const [activeEvents, setActiveEvents] = useState<GameEventItem[]>([]);
  const [floatingTexts, setFloatingTexts] = useState<FloatingTextItem[]>([]);
  const [offlineModal, setOfflineModal] = useState<{ gain: number; dt: number } | null>(null);
  const [previewSkin, setPreviewSkin] = useState<SkinId | null>(null);
  const [previewUITheme, setPreviewUITheme] = useState<UIThemeId | null>(null);

  const stateRef = useRef<GameState>(state);
  stateRef.current = state;

  const activeBuffRef = useRef<ActiveBuff | null>(activeBuff);
  activeBuffRef.current = activeBuff;
  const activeLuckyBuffRef = useRef<ActiveBuff | null>(activeLuckyBuff);
  activeLuckyBuffRef.current = activeLuckyBuff;

  // Event timers & single-source-of-truth claim protection
  const eventTimerRef = useRef<NodeJS.Timeout | null>(null);
  const activeEventExpireRef = useRef<NodeJS.Timeout | null>(null);
  const autoEventClaimRef = useRef<NodeJS.Timeout | null>(null);
  const claimedEventIdsRef = useRef<Set<number>>(new Set());

  // Rate calculation
  const currentBuffMultiplier = useCallback(() => {
    let mult = 1;
    const now = Date.now();
    if (activeBuffRef.current && now < activeBuffRef.current.expiresAt) {
      mult += activeBuffRef.current.multiplier - 1;
    }
    if (activeLuckyBuffRef.current && now < activeLuckyBuffRef.current.expiresAt) {
      mult += activeLuckyBuffRef.current.multiplier - 1;
    }
    return mult;
  }, []);

  const totalRate = useCallback(() => {
    const base = baseTotalRate(stateRef.current);
    return base * currentBuffMultiplier();
  }, [currentBuffMultiplier]);

  // Floating text
  const showFloatingText = useCallback((x: number, y: number, text: string, color: string) => {
    const id = Date.now() + Math.random();
    setFloatingTexts(prev => [...prev, { id, x, y, text, color }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(item => item.id !== id));
    }, 1600);
  }, []);

  // Procedural tree derived branches
  const { branches, maxY } = useMemo(() => {
    const log = deriveLog(state.owned);
    return buildBranchesFromLog(log);
  }, [state.owned]);

  // Claim offline
  const claimOffline = useCallback(() => {
    if (!offlineModal) return;
    setState(prev => ({
      ...prev,
      nutrients: prev.nutrients + offlineModal.gain,
      runEarned: prev.runEarned + offlineModal.gain,
      stats: {
        ...prev.stats,
        maxOfflineTimeSeconds: Math.max(prev.stats?.maxOfflineTimeSeconds || 0, offlineModal.dt),
        totalNutrientsEarnedLifetime: (prev.stats?.totalNutrientsEarnedLifetime || 0) + offlineModal.gain,
      },
    }));
    setOfflineModal(null);
  }, [offlineModal]);

  // Buy base module
  const buyModule = useCallback((defId: string) => {
    const idx = MODULE_DEFS.findIndex(m => m.id === defId);
    if (idx === -1) return;
    const cur = stateRef.current;
    if (idx > 0 && (cur.owned[MODULE_DEFS[idx - 1].id] || 0) < 1) return;

    const def = MODULE_DEFS[idx];
    const qty = cur.buyQty;
    const cost = bulkCostFor(def, cur.owned[defId] || 0, qty);
    if (cur.nutrients < cost) return;

    setState(prev => ({
      ...prev,
      nutrients: prev.nutrients - cost,
      owned: { ...prev.owned, [defId]: (prev.owned[defId] || 0) + qty },
      totalOwned: prev.totalOwned + qty,
    }));
  }, []);

  // Buy Root Upgrade
  const buyRootUpgrade = useCallback((moduleId: string) => {
    const cur = stateRef.current;
    const def = MODULE_DEFS.find(m => m.id === moduleId);
    if (!def) return;
    const level = (cur.rootUpgrades[moduleId] || 0) + 1;
    const req = rootUpgradeRequireOwned(level);
    if ((cur.owned[moduleId] || 0) < req) return;
    const cost = rootUpgradeCost(def, level);
    if (cur.nutrients < cost) return;

    setState(prev => ({
      ...prev,
      nutrients: prev.nutrients - cost,
      rootUpgrades: { ...prev.rootUpgrades, [moduleId]: level },
    }));
  }, []);

  // Buy Echo
  const buyEcho = useCallback((moduleId: string) => {
    const cur = stateRef.current;
    const def = MODULE_DEFS.find(m => m.id === moduleId);
    if (!def || !echoUnlockedFor(cur, moduleId)) return;
    const cost = echoCost(cur, def, totalRate());
    if (cur.nutrients < cost) return;

    setState(prev => ({
      ...prev,
      nutrients: prev.nutrients - cost,
      echoes: { ...prev.echoes, [moduleId]: (prev.echoes[moduleId] || 0) + 1 },
    }));
  }, [totalRate]);

  // Buy Root Synergy
  const buyRootSynergy = useCallback((moduleId: string) => {
    const cur = stateRef.current;
    const def = MODULE_DEFS.find(m => m.id === moduleId);
    if (!def || cur.rootSynergies?.[moduleId] || !rootSynergyUnlocked(cur, moduleId)) return;
    const cost = rootSynergyCost(def, cur);
    if (cur.nutrients < cost) return;

    setState(prev => ({
      ...prev,
      nutrients: prev.nutrients - cost,
      rootSynergies: { ...prev.rootSynergies, [moduleId]: true },
    }));
  }, []);

  // Set buy quantity
  const setBuyQty = useCallback((qty: number) => {
    setState(prev => ({ ...prev, buyQty: qty }));
  }, []);

  // Prestige Reset
  const doPrestige = useCallback(() => {
    const cur = stateRef.current;
    const gained = calcPrestigeSeeds(cur);
    if (gained <= 0 && cur.eternalSeeds === 0) return 0;

    const starterBonus = Math.min(1000, starterRootsCount(cur));
    const freshOwned: Record<string, number> = {};
    MODULE_DEFS.forEach(d => { freshOwned[d.id] = 0; });
    if (starterBonus > 0) {
      freshOwned['fine'] = starterBonus;
    }

    // Soil Memory: Retain a portion of echoes upon Prestige
    const retainPct = soilMemoryRetainPct(cur);
    const retainedEchoes: Record<string, number> = {};
    if (retainPct > 0 && cur.echoes) {
      Object.entries(cur.echoes).forEach(([id, count]) => {
        const kept = Math.floor(count * retainPct);
        if (kept > 0) retainedEchoes[id] = kept;
      });
    }

    // Ensure at least 10 initial nutrients if auto-root is active so the first root is bought without delay
    const initialNutrients = cur.prestige.autoRoot ? 10 : 0;

    setState(prev => ({
      ...prev,
      eternalSeeds: prev.eternalSeeds + gained,
      nutrients: initialNutrients,
      runEarned: initialNutrients,
      runPlayTimeSeconds: 0,
      owned: freshOwned,
      totalOwned: starterBonus,
      rootUpgrades: {},
      echoes: retainedEchoes,
      rootSynergies: {},
      buyQty: 1,
      stats: {
        ...prev.stats,
        prestigeCount: (prev.stats?.prestigeCount || 0) + 1,
        totalSeedsEarnedLifetime: (prev.stats?.totalSeedsEarnedLifetime || 0) + gained,
      },
    }));

    return gained;
  }, []);

  // Transcendence Reset (Layer 2)
  const doTranscendence = useCallback(() => {
    const cur = stateRef.current;
    const gained = calcTranscendenceEssences(cur);
    if (gained <= 0 && (cur.transcendence?.gaiaEssences || 0) === 0) return 0;

    const retainPct = soilMemoryRetainPct(cur);
    const retainedEchoes: Record<string, number> = {};
    if (retainPct > 0 && cur.echoes) {
      Object.entries(cur.echoes).forEach(([id, count]) => {
        const kept = Math.floor(count * retainPct);
        if (kept > 0) retainedEchoes[id] = kept;
      });
    }

    const freshOwned: Record<string, number> = {};
    MODULE_DEFS.forEach(d => { freshOwned[d.id] = 0; });
    const initialNutrients = 10;

    setState(prev => ({
      ...prev,
      nutrients: initialNutrients,
      runEarned: initialNutrients,
      runPlayTimeSeconds: 0,
      owned: freshOwned,
      totalOwned: 0,
      rootUpgrades: {},
      echoes: retainedEchoes,
      rootSynergies: {},
      eternalSeeds: 0,
      buyQty: 1,
      transcendence: {
        ...prev.transcendence,
        count: (prev.transcendence?.count || 0) + 1,
        gaiaEssences: (prev.transcendence?.gaiaEssences || 0) + gained,
        totalGaiaEssencesLifetime: (prev.transcendence?.totalGaiaEssencesLifetime || 0) + gained,
      },
    }));

    return gained;
  }, []);

  const buyPrimordialVigor = useCallback(() => {
    const cur = stateRef.current;
    const lvl = cur.transcendence?.primordialVigorLevel || 0;
    if (lvl >= PRIMORDIAL_VIGOR_MAX_LEVEL) return;
    const cost = primordialVigorCost(lvl);
    if ((cur.transcendence?.gaiaEssences || 0) < cost) return;

    setState(prev => ({
      ...prev,
      transcendence: {
        ...prev.transcendence,
        gaiaEssences: prev.transcendence.gaiaEssences - cost,
        primordialVigorLevel: lvl + 1,
      },
    }));
  }, []);

  const buySoilMemory = useCallback(() => {
    const cur = stateRef.current;
    const lvl = cur.transcendence?.soilMemoryLevel || 0;
    if (lvl >= SOIL_MEMORY_MAX_LEVEL) return;
    const cost = soilMemoryCost(lvl);
    if ((cur.transcendence?.gaiaEssences || 0) < cost) return;

    setState(prev => ({
      ...prev,
      transcendence: {
        ...prev.transcendence,
        gaiaEssences: prev.transcendence.gaiaEssences - cost,
        soilMemoryLevel: lvl + 1,
      },
    }));
  }, []);

  const buyAutoManager = useCallback(() => {
    const cur = stateRef.current;
    if (cur.transcendence?.autoManagerUnlocked) return;
    const cost = AUTO_MANAGER_COST;
    if ((cur.transcendence?.gaiaEssences || 0) < cost) return;

    setState(prev => ({
      ...prev,
      transcendence: {
        ...prev.transcendence,
        gaiaEssences: prev.transcendence.gaiaEssences - cost,
        autoManagerUnlocked: true,
      },
    }));
  }, []);

  const buyGaiaTouch = useCallback(() => {
    const cur = stateRef.current;
    const lvl = cur.transcendence?.gaiaTouchLevel || 0;
    if (lvl >= GAIA_TOUCH_MAX_LEVEL) return;
    const cost = gaiaTouchCost(lvl);
    if ((cur.transcendence?.gaiaEssences || 0) < cost) return;

    setState(prev => ({
      ...prev,
      transcendence: {
        ...prev.transcendence,
        gaiaEssences: prev.transcendence.gaiaEssences - cost,
        gaiaTouchLevel: lvl + 1,
      },
    }));
  }, []);

  const startTrial = useCallback((trialId: TrialId) => {
    doPrestige();
    setState(prev => ({
      ...prev,
      transcendence: {
        ...prev.transcendence,
        activeTrial: trialId,
      },
    }));
  }, [doPrestige]);

  const abandonTrial = useCallback(() => {
    setState(prev => ({
      ...prev,
      transcendence: {
        ...prev.transcendence,
        activeTrial: 'none',
      },
    }));
  }, []);

  // Hard Reset
  const doHardReset = useCallback(() => {
    setActiveBuff(null);
    setActiveLuckyBuff(null);
    setState(createFreshState());
  }, []);

  // Skins
  const ownedSkinList = useCallback(() => {
    return SKIN_CYCLE_ORDER.filter(id => isSkinUnlocked(stateRef.current, id));
  }, []);

  const toggleSkin = useCallback(() => {
    const owned = ownedSkinList();
    if (owned.length <= 1) return;
    const cur = stateRef.current.prestige.activeSkin;
    const curIdx = owned.indexOf(cur);
    const nextIdx = (curIdx === -1 ? 0 : curIdx + 1) % owned.length;
    setState(prev => ({
      ...prev,
      prestige: { ...prev.prestige, activeSkin: owned[nextIdx] },
    }));
  }, [ownedSkinList]);

  const setSkin = useCallback((id: SkinId) => {
    setState(prev => ({
      ...prev,
      prestige: { ...prev.prestige, activeSkin: id },
    }));
  }, []);

  // UI Themes
  const ownedUIThemeList = useCallback(() => {
    return UI_THEME_ORDER.filter(id => isUIThemeUnlocked(stateRef.current, id));
  }, []);

  const toggleUITheme = useCallback(() => {
    const owned = ownedUIThemeList();
    if (owned.length <= 1) return;
    const cur = stateRef.current.prestige.activeUITheme || 'classic';
    const curIdx = owned.indexOf(cur);
    const nextIdx = (curIdx === -1 ? 0 : curIdx + 1) % owned.length;
    setState(prev => ({
      ...prev,
      prestige: { ...prev.prestige, activeUITheme: owned[nextIdx] },
    }));
  }, [ownedUIThemeList]);

  const setUITheme = useCallback((id: UIThemeId) => {
    setState(prev => ({
      ...prev,
      prestige: { ...prev.prestige, activeUITheme: id },
    }));
  }, []);

  // Live Cosmetics Preview
  const startPreviewSkin = useCallback((id: SkinId | null) => {
    setPreviewSkin(id);
  }, []);

  const startPreviewUITheme = useCallback((id: UIThemeId | null) => {
    setPreviewUITheme(id);
  }, []);

  const clearPreview = useCallback(() => {
    setPreviewSkin(null);
    setPreviewUITheme(null);
  }, []);

  // Event trigger & claim (Single Source of Truth)
  const claimEvent = useCallback((ev: GameEventItem) => {
    // 1. Verify event has not already been claimed (prevents race condition / double-claiming)
    if (claimedEventIdsRef.current.has(ev.id)) return;
    claimedEventIdsRef.current.add(ev.id);

    // 2. Clear auto-claim timer if manual click claimed it first
    if (autoEventClaimRef.current) {
      clearTimeout(autoEventClaimRef.current);
      autoEventClaimRef.current = null;
    }

    const cur = stateRef.current;
    const bonusMult = eventBonusMult(cur);
    const durationMult = eventDurationMult(cur);
    const rate = totalRate();
    const wasLucky = !!(activeLuckyBuffRef.current && Date.now() < activeLuckyBuffRef.current.expiresAt);

    setActiveEvents(prev => prev.filter(e => e.id !== ev.id));

    if (ev.type === 'bump') {
      const seconds = (30 + Math.random() * 60) * durationMult;
      const amount = rate * seconds * bonusMult;
      setState(prev => ({
        ...prev,
        nutrients: prev.nutrients + amount,
        runEarned: prev.runEarned + amount,
        stats: {
          ...prev.stats,
          totalEventsClaimed: (prev.stats?.totalEventsClaimed || 0) + 1,
          superJackpotClaimed: prev.stats?.superJackpotClaimed || wasLucky,
          totalNutrientsEarnedLifetime: (prev.stats?.totalNutrientsEarnedLifetime || 0) + amount,
        },
      }));
      const isEn = cur.lang === 'en';
      showFloatingText(ev.left + 26, ev.top + 20, '+' + fmt(amount), '#e0a94a');
    } else if (ev.type === 'lucky') {
      const isEn = cur.lang === 'en';
      const mult = (1 + (777 - 1) * bonusMult) * luckyMagnitudeExtra(cur) * gaiaTouchBonusMult(cur);
      const seconds = luckyDurationSeconds(cur);
      setActiveLuckyBuff({ multiplier: mult, expiresAt: Date.now() + seconds * 1000 });
      setState(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          totalEventsClaimed: (prev.stats?.totalEventsClaimed || 0) + 1,
          luckyJackpotCount: (prev.stats?.luckyJackpotCount || 0) + 1,
        },
      }));
      showFloatingText(
        ev.left + 26,
        ev.top + 20,
        `🍀 ×${fmtMultiplier(mult)}`,
        '#ffd76a'
      );

      // Rare serendipity: Lucky shockwave can unearth a hidden relic (20% chance)
      if (!cur.unclaimedRelicId && Math.random() < 0.20) {
        const unowned = unownedRelicList(cur);
        const picked = pickWeightedUnownedRelic(unowned);
        if (picked) {
          setState(prev => ({ ...prev, unclaimedRelicId: picked.id }));
        }
      }
    } else {
      const isEn = cur.lang === 'en';
      const baseMult = 2 + Math.random() * 2;
      const mult = 1 + (baseMult - 1) * bonusMult;
      const seconds = (20 + Math.random() * 40) * durationMult;
      setActiveBuff({ multiplier: mult, expiresAt: Date.now() + seconds * 1000 });
      setState(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          totalEventsClaimed: (prev.stats?.totalEventsClaimed || 0) + 1,
        },
      }));
      showFloatingText(
        ev.left + 26,
        ev.top + 20,
        isEn ? `×${mult.toFixed(1)} Surge!` : `×${mult.toFixed(1)} เรท!`,
        '#b7e08a'
      );
    }
  }, [showFloatingText, totalRate]);

  // Prestige store buy functions
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
  }, []);

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
  }, []);

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
  }, []);

  const buyAutoRoot = useCallback(() => {
    const cur = stateRef.current;
    if (cur.prestige.autoRoot || cur.eternalSeeds < AUTO_ROOT_COST) return;
    setState(prev => ({
      ...prev,
      eternalSeeds: prev.eternalSeeds - AUTO_ROOT_COST,
      prestige: { ...prev.prestige, autoRoot: true, autoRootMode: 'basic', autoRootEnabled: true },
    }));
  }, []);

  const buyAutoRootSmart = useCallback(() => {
    const cur = stateRef.current;
    if (!cur.prestige.autoRoot || cur.prestige.autoRootSmart || cur.eternalSeeds < AUTO_ROOT_SMART_COST) return;
    setState(prev => ({
      ...prev,
      eternalSeeds: prev.eternalSeeds - AUTO_ROOT_SMART_COST,
      prestige: { ...prev.prestige, autoRootSmart: true, autoRootMode: 'smart', autoRootEnabled: true },
    }));
  }, []);

  const buyAutoRootAll = useCallback(() => {
    const cur = stateRef.current;
    if (!cur.prestige.autoRootSmart || cur.prestige.autoRootAll || cur.eternalSeeds < AUTO_ROOT_ALL_COST) return;
    setState(prev => ({
      ...prev,
      eternalSeeds: prev.eternalSeeds - AUTO_ROOT_ALL_COST,
      prestige: { ...prev.prestige, autoRootAll: true, autoRootMode: 'all', autoRootEnabled: true },
    }));
  }, []);

  const setAutoRootMode = useCallback((mode: AutoRootMode) => {
    setState(prev => ({
      ...prev,
      prestige: { ...prev.prestige, autoRootMode: mode, autoRootEnabled: true },
    }));
  }, []);

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
  }, []);

  const buyAutoEvent = useCallback(() => {
    const cur = stateRef.current;
    if (cur.prestige.autoEvent || cur.eternalSeeds < AUTO_EVENT_COST) return;
    setState(prev => ({
      ...prev,
      eternalSeeds: prev.eternalSeeds - AUTO_EVENT_COST,
      prestige: { ...prev.prestige, autoEvent: true },
    }));
  }, []);

  const toggleAutoRoot = useCallback(() => {
    setState(prev => ({
      ...prev,
      prestige: { ...prev.prestige, autoRootEnabled: !prev.prestige.autoRootEnabled },
    }));
  }, []);

  const toggleAutoEvent = useCallback(() => {
    setState(prev => ({
      ...prev,
      prestige: { ...prev.prestige, autoEventEnabled: !prev.prestige.autoEventEnabled },
    }));
  }, []);

  const toggleAutoReset = useCallback(() => {
    setState(prev => ({
      ...prev,
      prestige: { ...prev.prestige, autoResetEnabled: !prev.prestige.autoResetEnabled },
    }));
  }, []);

  const setAutoResetThreshold = useCallback((threshold: number) => {
    setState(prev => ({
      ...prev,
      prestige: {
        ...prev.prestige,
        autoResetThreshold: Math.max(10, threshold),
        autoResetEnabled: true,
      },
    }));
  }, []);

  const buyAutoReset = useCallback(() => {
    const cur = stateRef.current;
    if (cur.prestige.autoReset || cur.eternalSeeds < AUTO_RESET_COST) return;
    setState(prev => ({
      ...prev,
      eternalSeeds: prev.eternalSeeds - AUTO_RESET_COST,
      prestige: { ...prev.prestige, autoReset: true, autoResetEnabled: false },
    }));
  }, []);

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
  }, []);

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
  }, []);

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
  }, []);

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
  }, []);

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
  }, []);

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
  }, []);

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
    if (autoEquip) {
      setPreviewSkin(null);
    }
  }, []);

  const buyUITheme = useCallback((id: UIThemeId, autoEquip = false) => {
    const cur = stateRef.current;
    const cost = UI_THEME_COSTS[id] || 0;
    const prestigeKey = UI_THEME_PRESTIGE_KEYS[id];
    if (!prestigeKey || cost <= 0) return;
    if (cur.prestige[prestigeKey as keyof typeof cur.prestige] || cur.eternalSeeds < cost) return;
    setState(prev => ({
      ...prev,
      eternalSeeds: prev.eternalSeeds - cost,
      prestige: {
        ...prev.prestige,
        [prestigeKey]: true,
        ...(autoEquip ? { activeUITheme: id } : {}),
      },
    }));
    if (autoEquip) {
      setPreviewUITheme(null);
    }
  }, []);

  // Save / Load actions
  const importSaveCode = useCallback((code: string) => {
    const payload = decodeSave(code);
    const newState = payloadToState(payload);
    setState(newState);
    saveToLocalStorage(newState);
  }, []);

  const exportSaveCode = useCallback(() => {
    return encodeSave(stateRef.current);
  }, []);

  const saveSlotAction = useCallback((slotNum: number) => {
    saveSlot(slotNum, stateRef.current);
  }, []);

  const loadSlotAction = useCallback((slotNum: number) => {
    const meta = getSlotMeta(slotNum);
    if (!meta) return;
    const payload = decodeSave(meta.code);
    const newState = payloadToState(payload);
    setState(newState);
    saveToLocalStorage(newState);
  }, []);

  const deleteSlotAction = useCallback((slotNum: number) => {
    deleteSlot(slotNum);
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setState(prev => {
      const next = { ...prev, lang };
      saveToLocalStorage(next);
      return next;
    });
  }, []);

  // Relics & Biomes
  const claimUnearthedRelic = useCallback((relicId?: string) => {
    const cur = stateRef.current;
    const targetId = relicId || cur.unclaimedRelicId;
    if (!targetId) return;
    const def = RELIC_DEFS.find(r => r.id === targetId);
    if (!def) return;
    const isEn = cur.lang === 'en';

    setState(prev => ({
      ...prev,
      relics: { ...prev.relics, [targetId]: true },
      unclaimedRelicId: null,
    }));

    showFloatingText(
      200,
      140,
      isEn ? `🏺 Unearthed: ${def.name}!` : `🏺 ค้นพบโบราณวัตถุ: ${def.name}!`,
      def.color || '#ffd76a'
    );
  }, [showFloatingText]);

  const excavateRelic = useCallback((relicId: string) => {
    const cur = stateRef.current;
    const def = RELIC_DEFS.find(r => r.id === relicId);
    if (!def || cur.relics?.[relicId] || cur.nutrients < def.baseCost) return;
    const isEn = cur.lang === 'en';

    setState(prev => ({
      ...prev,
      nutrients: prev.nutrients - def.baseCost,
      relics: { ...prev.relics, [relicId]: true },
    }));

    showFloatingText(
      200,
      140,
      isEn ? `⛏️ Excavated: ${def.name}!` : `⛏️ ขุดค้นสำเร็จ: ${def.name}!`,
      def.color || '#ffd76a'
    );
  }, [showFloatingText]);

  const setActiveBiome = useCallback((biomeId: BiomeId) => {
    setState(prev => ({
      ...prev,
      activeBiome: biomeId,
    }));
  }, []);

  const onWaterCanvas = useCallback((x: number, y: number) => {
    const cur = stateRef.current;
    const isMagma = hasRelic(cur, 'magmastone');
    if (isMagma) {
      const rate = totalRate();
      const burstGain = Math.max(1, rate * 0.05);
      setState(prev => ({
        ...prev,
        nutrients: prev.nutrients + burstGain,
        runEarned: prev.runEarned + burstGain,
      }));
      showFloatingText(x, y, `🔥 +${fmt(burstGain)}`, '#ef4444');
    }
  }, [showFloatingText, totalRate]);

  const toggleLanguage = useCallback(() => {
    setState(prev => {
      const nextLang: Language = prev.lang === 'en' ? 'th' : 'en';
      const next = { ...prev, lang: nextLang };
      saveToLocalStorage(next);
      return next;
    });
  }, []);

  // INITIAL LOAD & OFFLINE PROGRESS
  useEffect(() => {
    const loaded = loadFromLocalStorage();
    if (loaded) {
      const { state: loadedState, lastTs } = loaded;
      setState(loadedState);
      stateRef.current = loadedState;

      if (lastTs) {
        const dt = Math.min((Date.now() - lastTs) / 1000, currentOfflineCapSeconds(loadedState));
        const rate = baseTotalRate(loadedState);
        if (dt > 45) {
          const gain = rate * dt;
          setOfflineModal({ gain, dt });
        } else if (dt > 1) {
          const gain = rate * dt;
          setState(prev => ({
            ...prev,
            nutrients: prev.nutrients + gain,
            runEarned: prev.runEarned + gain,
          }));
        }
      }
    }
  }, []);

  // GAME LOOP (requestAnimationFrame)
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      const rate = totalRate();
      const gain = rate * dt;

      setState(prev => ({
        ...prev,
        nutrients: prev.nutrients + gain,
        runEarned: prev.runEarned + gain,
        totalPlayTimeSeconds: prev.totalPlayTimeSeconds + dt,
        runPlayTimeSeconds: prev.runPlayTimeSeconds + dt,
        stats: {
          ...prev.stats,
          totalNutrientsEarnedLifetime: (prev.stats?.totalNutrientsEarnedLifetime || 0) + gain,
        },
      }));

      // Check expired buffs
      const curTime = Date.now();
      if (activeBuffRef.current && curTime >= activeBuffRef.current.expiresAt) {
        setActiveBuff(null);
      }
      if (activeLuckyBuffRef.current && curTime >= activeLuckyBuffRef.current.expiresAt) {
        setActiveLuckyBuff(null);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [totalRate]);

  // Periodic Auto-save (every 8s)
  useEffect(() => {
    const interval = setInterval(() => {
      saveToLocalStorage(stateRef.current);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Auto-root perk (fast responsive loop every 500ms)
  useEffect(() => {
    const interval = setInterval(() => {
      evaluateAutoBuy(stateRef.current, totalRate(), setState);
    }, 500);

    return () => clearInterval(interval);
  }, [totalRate]);

  // Auto-reset perk (checks every 2.5s for snappy triggers)
  useEffect(() => {
    const interval = setInterval(() => {
      const cur = stateRef.current;
      if (!cur.prestige.autoReset || !cur.prestige.autoResetEnabled || cur.transcendence?.activeTrial === 'void_anomaly') return;
      if (!prestigeUnlocked(cur)) return;
      const targetThreshold = Math.max(10, cur.prestige.autoResetThreshold || AUTO_RESET_MIN_SEEDS);
      if (calcPrestigeSeeds(cur) < targetThreshold) return;
      const isEn = cur.lang === 'en';
      const gained = doPrestige();
      showFloatingText(
        250,
        60,
        isEn ? `🌌 Auto Re-sow +${fmtInt(gained)}` : `🌌 หว่านใหม่อัตโนมัติ +${fmtInt(gained)}`,
        '#b78cf0'
      );
      // Instant kickstart buy right after auto-reset
      setTimeout(() => {
        evaluateAutoBuy(stateRef.current, totalRate(), setState);
      }, 50);
    }, 2500);

    return () => clearInterval(interval);
  }, [doPrestige, showFloatingText, totalRate]);

  // Trial completion check (every 1s)
  useEffect(() => {
    const interval = setInterval(() => {
      const cur = stateRef.current;
      const active = cur.transcendence?.activeTrial;
      if (active && active !== 'none') {
        const def = TRIAL_DEFS.find(t => t.id === active);
        if (def && (cur.owned['yggdrasil'] || 0) >= def.targetYggdrasil) {
          const isEn = cur.lang === 'en';
          setState(prev => ({
            ...prev,
            transcendence: {
              ...prev.transcendence,
              activeTrial: 'none',
              completedTrials: {
                ...prev.transcendence?.completedTrials,
                [active]: true,
              },
            },
          }));
          showFloatingText(
            250,
            120,
            isEn ? `🏆 Trial Conquered: ${def.enName}!` : `🏆 พิชิตการทดลอง: ${def.name}!`,
            '#ffd76a'
          );
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [showFloatingText]);

  // Auto-Manager Loop (every 4s, upgrades prestige shop if affordable)
  useEffect(() => {
    const interval = setInterval(() => {
      const cur = stateRef.current;
      if (!cur.transcendence?.autoManagerUnlocked || cur.eternalSeeds < 50) return;

      // Prioritize passive rate, golden seed, starter culture
      if (cur.eternalSeeds >= passiveRateCost(cur)) {
        buyPassiveRate(1);
      } else if (cur.eternalSeeds >= goldenSeedCost(cur)) {
        buyGoldenSeed(1);
      } else if (cur.prestige.starterLevel < STARTER_CULTURE_MAX_LEVEL && cur.eternalSeeds >= starterCultureCost(cur)) {
        buyStarterCulture(1);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [buyPassiveRate, buyGoldenSeed, buyStarterCulture]);

  // Random event scheduler (105-155s interval)
  const scheduleNextEvent = useCallback(() => {
    if (eventTimerRef.current) clearTimeout(eventTimerRef.current);

    const delay = 105000 + Math.random() * 50000; // 105–155s
    eventTimerRef.current = setTimeout(() => {
      const cur = stateRef.current;
      const r = Math.random();
      const luckyPct = luckyChancePct(cur);
      const nonLuckyPct = 1 - luckyPct;
      const buffPct = nonLuckyPct * (32 / 92);
      const type: 'bump' | 'buff' | 'lucky' =
        r < luckyPct ? 'lucky' : r < luckyPct + buffPct ? 'buff' : 'bump';

      const left = 30 + Math.random() * 380;
      const top = 60 + Math.random() * 260;
      const id = Date.now();

      const newEv: GameEventItem = { id, type, left, top };
      setActiveEvents([newEv]);

      // Auto-event prestige perk: verify event is still active & unclaimed before claiming
      if (cur.prestige.autoEvent && cur.prestige.autoEventEnabled && cur.transcendence?.activeTrial !== 'void_anomaly') {
        autoEventClaimRef.current = setTimeout(() => {
          if (!claimedEventIdsRef.current.has(id)) {
            claimEvent(newEv);
          }
        }, 1200 + Math.random() * 1500);
      }

      // Expire after 12s if not clicked
      activeEventExpireRef.current = setTimeout(() => {
        setActiveEvents(prev => prev.filter(e => e.id !== id));
        claimedEventIdsRef.current.delete(id);
        scheduleNextEvent();
      }, 12000);
    }, delay);
  }, [claimEvent]);

  useEffect(() => {
    scheduleNextEvent();
    return () => {
      if (eventTimerRef.current) clearTimeout(eventTimerRef.current);
      if (activeEventExpireRef.current) clearTimeout(activeEventExpireRef.current);
      if (autoEventClaimRef.current) clearTimeout(autoEventClaimRef.current);
    };
  }, [scheduleNextEvent]);

  // Achievement Toast Queue
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
  }, [totalRate, dismissAchievementToast]);

  // Rare ambient Relic discovery loop (checks every 60s, ~2.5% chance = ~40-50m average per ambient find)
  useEffect(() => {
    const interval = setInterval(() => {
      const cur = stateRef.current;

      // 1. Auto-claim pending unearthed relic if Auto-Root is active
      if (cur.unclaimedRelicId && cur.prestige.autoRoot && cur.prestige.autoRootEnabled) {
        claimUnearthedRelic(cur.unclaimedRelicId);
        return;
      }

      // 2. Rare chance to unearth an unowned relic from the soil
      if (!cur.unclaimedRelicId) {
        const unowned = unownedRelicList(cur);
        if (unowned.length > 0 && Math.random() < 0.025) {
          const picked = pickWeightedUnownedRelic(unowned);
          if (picked) {
            setState(prev => ({
              ...prev,
              unclaimedRelicId: picked.id,
            }));
          }
        }
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [claimUnearthedRelic]);

  return {
    state,
    lang: state.lang || 'th',
    totalRate: totalRate(),
    activeBuff,
    activeLuckyBuff,
    activeEvents,
    floatingTexts,
    offlineModal,
    branches,
    maxY,
    achievementToastQueue,
    dismissAchievementToast,
    // Language methods
    setLanguage,
    toggleLanguage,
    // Methods
    buyModule,
    buyRootUpgrade,
    buyEcho,
    buyRootSynergy,
    setBuyQty,
    claimEvent,
    claimOffline,
    doPrestige,
    doHardReset,
    toggleSkin,
    setSkin,
    ownedUIThemeList,
    toggleUITheme,
    setUITheme,
    buyUITheme,
    previewSkin,
    previewUITheme,
    effectiveSkin: previewSkin || state.prestige.activeSkin,
    effectiveUITheme: previewUITheme || state.prestige.activeUITheme || 'classic',
    startPreviewSkin,
    startPreviewUITheme,
    clearPreview,
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
    // Transcendence & Trials
    isTranscendenceUnlocked: isTranscendenceUnlocked(state),
    doTranscendence,
    buyPrimordialVigor,
    buySoilMemory,
    buyAutoManager,
    buyGaiaTouch,
    startTrial,
    abandonTrial,
    // Relic & Biome methods
    claimUnearthedRelic,
    excavateRelic,
    setActiveBiome,
    onWaterCanvas,
    importSaveCode,
    exportSaveCode,
    saveSlotAction,
    loadSlotAction,
    deleteSlotAction,
  };
}
