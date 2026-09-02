'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  BiomeId,
  GameState,
  Language,
} from '@/types/game';
import {
  AUTO_RESET_MIN_SEEDS,
  baseTotalRate,
  bulkCostFor,
  calcPrestigeSeeds,
  calcTranscendenceEssences,
  createFreshState,
  currentOfflineCapSeconds,
  echoCost,
  echoMaxed,
  echoUnlockedFor,
  MODULE_DEFS,
  prestigeUnlocked,
  rootSynergyCost,
  rootSynergyUnlocked,
  rootUpgradeCost,
  rootUpgradeRequireOwned,
  soilMemoryRetainPct,
  starterRootsCount,
  RELIC_DEFS,
  hasRelic,
  pickWeightedUnownedRelic,
  relicBonusSproutChance,
  relicCount,
  relicMaxed,
  relicMult,
  unownedRelicList,
} from '@/constants/gameData';
import { buildBranchesFromLog, deriveLog } from '@/lib/treeGenerator';
import { evaluateAutoBuy } from '@/lib/autoBuyer';
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
import { fmt, fmtInt } from '@/lib/formatters';
import { MODULE_TRANSLATIONS } from '@/lib/i18n';

// Sub-hooks
import { useRandomEvents } from './useRandomEvents';
import { usePrestigeShop } from './usePrestigeShop';
import { useTranscendenceEngine } from './useTranscendenceEngine';
import { useAchievementsEngine } from './useAchievementsEngine';
import { useCosmeticsEngine } from './useCosmeticsEngine';

export function useGameEngine() {
  const [state, setState] = useState<GameState>(createFreshState);
  const [offlineModal, setOfflineModal] = useState<{ gain: number; dt: number } | null>(null);

  const stateRef = useRef<GameState>(state);
  stateRef.current = state;
  const relicPityMinutesRef = useRef(0);

  // Rate calculation
  const totalRate = useCallback(() => {
    const base = baseTotalRate(stateRef.current);
    return base * randomEvents.currentBuffMultiplier();
  }, []);

  // 1. Random events & temporary buffs sub-hook
  const randomEvents = useRandomEvents({
    stateRef,
    setState,
    totalRate,
  });

  // 2. Cosmetics sub-hook
  const cosmetics = useCosmeticsEngine({
    stateRef,
    setState,
  });

  // 3. Prestige store & automation toggles sub-hook
  const prestigeShop = usePrestigeShop({
    stateRef,
    setState,
    setPreviewSkin: cosmetics.setPreviewSkin,
  });

  // Procedural tree derived branches
  const { branches, maxY } = useMemo(() => {
    const log = deriveLog(state.owned);
    return buildBranchesFromLog(log);
  }, [state.owned]);

  // Claim offline progress
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
    const qty = cur.buyQty || 1;
    const cost = bulkCostFor(def, cur.owned[defId] || 0, qty, cur);
    if (cur.nutrients < cost) return;

    const sproutChance = relicBonusSproutChance(cur);
    const gotBonus = sproutChance > 0 && Math.random() < sproutChance;
    const addedQty = qty + (gotBonus ? 1 : 0);

    setState(prev => ({
      ...prev,
      nutrients: prev.nutrients - cost,
      owned: {
        ...prev.owned,
        [defId]: (prev.owned[defId] || 0) + addedQty,
      },
      totalOwned: prev.totalOwned + addedQty,
    }));

    if (gotBonus) {
      const isEn = cur.lang === 'en';
      const rootName = isEn ? (MODULE_TRANSLATIONS[def.id]?.en?.name || def.name) : def.name;
      randomEvents.showFloatingText(
        typeof window !== 'undefined' ? window.innerWidth / 2 : 200,
        typeof window !== 'undefined' ? window.innerHeight / 2 : 200,
        isEn ? `🌱 Twin Sprout! (+1 Free ${rootName})` : `🌱 แตกหน่อคู่! (แถมฟรี +1 ${rootName})`,
        '#fbbf24'
      );
    }
  }, [randomEvents]);

  // Buy Root Upgrade
  const buyRootUpgrade = useCallback((moduleId: string) => {
    const cur = stateRef.current;
    const def = MODULE_DEFS.find(m => m.id === moduleId);
    if (!def) return;
    const level = (cur.rootUpgrades[moduleId] || 0) + 1;
    if ((cur.owned[moduleId] || 0) < rootUpgradeRequireOwned(level)) return;
    const cost = rootUpgradeCost(def, level);
    if (cur.nutrients < cost) return;

    setState(prev => ({
      ...prev,
      nutrients: prev.nutrients - cost,
      rootUpgrades: { ...prev.rootUpgrades, [moduleId]: level },
    }));
  }, []);

  // Buy Root Echo
  const buyEcho = useCallback((moduleId: string) => {
    const cur = stateRef.current;
    const def = MODULE_DEFS.find(m => m.id === moduleId);
    if (!def || !echoUnlockedFor(cur, moduleId) || echoMaxed(cur, moduleId)) return;
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

    // Clear any active temporary buffs and on-screen events upon Prestige
    randomEvents.clearEventsAndBuffs();

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
  }, [randomEvents]);

  // Transcendence Reset (Layer 2)
  const doTranscendence = useCallback(() => {
    const cur = stateRef.current;
    const gained = calcTranscendenceEssences(cur);
    if (gained <= 0 && (cur.transcendence?.gaiaEssences || 0) === 0) return 0;

    // Clear any active temporary buffs and on-screen events upon Transcendence
    randomEvents.clearEventsAndBuffs();

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
  }, [randomEvents]);

  // 4. Transcendence & Subterranean Trials sub-hook
  const transcendenceEngine = useTranscendenceEngine({
    stateRef,
    setState,
    doPrestige,
    showFloatingText: randomEvents.showFloatingText,
    buyPassiveRate: prestigeShop.buyPassiveRate,
    buyGoldenSeed: prestigeShop.buyGoldenSeed,
    buyStarterCulture: prestigeShop.buyStarterCulture,
  });

  // 5. Achievements sub-hook
  const achievementsEngine = useAchievementsEngine({
    stateRef,
    setState,
    totalRate,
  });

  // Hard Reset
  const doHardReset = useCallback(() => {
    randomEvents.clearEventsAndBuffs();
    setState(createFreshState());
  }, [randomEvents]);

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

  const toggleLanguage = useCallback(() => {
    setState(prev => {
      const nextLang: Language = prev.lang === 'en' ? 'th' : 'en';
      const next = { ...prev, lang: nextLang };
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
    const currentCount = relicCount(cur, targetId);
    if (currentCount >= def.maxPieces) return;
    const nextCount = currentCount + 1;
    const isEn = cur.lang === 'en';

    setState(prev => ({
      ...prev,
      relics: { ...prev.relics, [targetId]: nextCount },
      unclaimedRelicId: null,
    }));

    randomEvents.showFloatingText(
      200,
      140,
      isEn
        ? `🏺 Fragment: ${def.enName} (${nextCount}/${def.maxPieces})!`
        : `🏺 ชิ้นส่วน: ${def.name} (${nextCount}/${def.maxPieces})!`,
      def.color || '#ffd76a'
    );
  }, [randomEvents]);

  const setActiveBiome = useCallback((biomeId: BiomeId) => {
    setState(prev => ({
      ...prev,
      activeBiome: biomeId,
    }));
  }, []);

  const onWaterCanvas = useCallback((x: number, y: number) => {
    const cur = stateRef.current;
    const magmaMult = relicMult(cur, 'magmastone');
    if (magmaMult > 0) {
      const rate = totalRate();
      const burstGain = Math.max(1, rate * 0.0005 * magmaMult);
      setState(prev => ({
        ...prev,
        nutrients: prev.nutrients + burstGain,
        runEarned: prev.runEarned + burstGain,
      }));
      randomEvents.showFloatingText(x, y, `🔥 +${fmt(burstGain)}`, '#ef4444');
    }
  }, [randomEvents, totalRate]);

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
      randomEvents.checkBuffExpirations();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [totalRate, randomEvents]);

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
      randomEvents.showFloatingText(
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
  }, [doPrestige, randomEvents, totalRate]);

  // Ambient Relic discovery loop with 50-minute Pity Protection (checks every 60s)
  useEffect(() => {
    const interval = setInterval(() => {
      const cur = stateRef.current;

      if (cur.unclaimedRelicId && cur.prestige.autoRoot && cur.prestige.autoRootEnabled) {
        claimUnearthedRelic(cur.unclaimedRelicId);
        return;
      }

      if (!cur.unclaimedRelicId) {
        const unowned = unownedRelicList(cur);
        if (unowned.length > 0) {
          relicPityMinutesRef.current += 1;
          // 2.0% chance per minute, or 100% guaranteed when pity timer reaches 50 minutes!
          if (Math.random() < 0.020 || relicPityMinutesRef.current >= 50) {
            relicPityMinutesRef.current = 0;
            const picked = pickWeightedUnownedRelic(unowned);
            if (picked) {
              setState(prev => ({ ...prev, unclaimedRelicId: picked.id }));
              const isEn = cur.lang === 'en';
              randomEvents.showFloatingText(
                250,
                160,
                isEn ? `✨ A relic emerged from the soil!` : `✨ โบราณวัตถุปรากฏขึ้นจากผิวดิน!`,
                picked.color || '#ffd76a'
              );
            }
          }
        }
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [claimUnearthedRelic, randomEvents]);

  return {
    state,
    lang: state.lang || 'th',
    totalRate: totalRate(),
    activeBuff: randomEvents.activeBuff,
    activeLuckyBuff: randomEvents.activeLuckyBuff,
    activeEvents: randomEvents.activeEvents,
    floatingTexts: randomEvents.floatingTexts,
    offlineModal,
    branches,
    maxY,
    achievementToastQueue: achievementsEngine.achievementToastQueue,
    dismissAchievementToast: achievementsEngine.dismissAchievementToast,
    setLanguage,
    toggleLanguage,
    buyModule,
    buyRootUpgrade,
    buyEcho,
    buyRootSynergy,
    setBuyQty,
    claimEvent: randomEvents.claimEvent,
    claimOffline,
    doPrestige,
    doHardReset,
    toggleSkin: cosmetics.toggleSkin,
    setSkin: cosmetics.setSkin,
    ownedUIThemeList: cosmetics.ownedUIThemeList,
    toggleUITheme: cosmetics.toggleUITheme,
    setUITheme: cosmetics.setUITheme,
    buyUITheme: cosmetics.buyUITheme,
    previewSkin: cosmetics.previewSkin,
    previewUITheme: cosmetics.previewUITheme,
    effectiveSkin: cosmetics.effectiveSkin,
    effectiveUITheme: cosmetics.effectiveUITheme,
    startPreviewSkin: cosmetics.startPreviewSkin,
    startPreviewUITheme: cosmetics.startPreviewUITheme,
    clearPreview: cosmetics.clearPreview,
    buyStarterCulture: prestigeShop.buyStarterCulture,
    buyGoldenSeed: prestigeShop.buyGoldenSeed,
    buyPassiveRate: prestigeShop.buyPassiveRate,
    buyAutoRoot: prestigeShop.buyAutoRoot,
    buyAutoRootSmart: prestigeShop.buyAutoRootSmart,
    buyAutoRootAll: prestigeShop.buyAutoRootAll,
    setAutoRootMode: prestigeShop.setAutoRootMode,
    cycleAutoRootMode: prestigeShop.cycleAutoRootMode,
    buyAutoEvent: prestigeShop.buyAutoEvent,
    toggleAutoEvent: prestigeShop.toggleAutoEvent,
    buyAutoReset: prestigeShop.buyAutoReset,
    toggleAutoReset: prestigeShop.toggleAutoReset,
    setAutoResetThreshold: prestigeShop.setAutoResetThreshold,
    toggleAutoRoot: prestigeShop.toggleAutoRoot,
    buyEventBonus: prestigeShop.buyEventBonus,
    buyEventDuration: prestigeShop.buyEventDuration,
    buyLuckyChance: prestigeShop.buyLuckyChance,
    buyLuckyMagnitude: prestigeShop.buyLuckyMagnitude,
    buyLuckyDuration: prestigeShop.buyLuckyDuration,
    buyOfflineCapUpgrade: prestigeShop.buyOfflineCapUpgrade,
    buySkin: prestigeShop.buySkin,
    doTranscendence,
    buyPrimordialVigor: transcendenceEngine.buyPrimordialVigor,
    buySoilMemory: transcendenceEngine.buySoilMemory,
    buyAutoManager: transcendenceEngine.buyAutoManager,
    buyGaiaTouch: transcendenceEngine.buyGaiaTouch,
    startTrial: transcendenceEngine.startTrial,
    abandonTrial: transcendenceEngine.abandonTrial,
    claimUnearthedRelic,
    setActiveBiome,
    onWaterCanvas,
    importSaveCode,
    exportSaveCode,
    saveSlotAction,
    loadSlotAction,
    deleteSlotAction,
  };
}
