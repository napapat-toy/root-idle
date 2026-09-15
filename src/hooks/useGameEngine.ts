'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  BiomeId,
  GameState,
  Language,
} from '@/types/game';
import {
  baseTotalRate,
  bulkCostFor,
  calcPrestigeSeeds,
  calcTranscendenceEssences,
  createFreshState,
  currentOfflineCapSeconds,
  echoCost,
  echoMaxed,
  echoUnlockedFor,
  isTrialCompleted,
  MODULE_DEFS,
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
  relicBonusTwinSproutChance,
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
    state,
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
    const twinChance = relicBonusTwinSproutChance(cur);
    let bonusRoots = 0;
    if (sproutChance > 0 && Math.random() < sproutChance) {
      bonusRoots += 1;
      if (twinChance > 0 && Math.random() < twinChance) {
        bonusRoots += 1;
      }
    }
    const addedQty = qty + bonusRoots;

    setState(prev => {
      const nextYgg = (prev.owned[defId] || 0) + addedQty;
      const shouldUnlockTranscend =
        defId === 'yggdrasil' &&
        nextYgg >= 100 &&
        (prev.stats?.prestigeCount || 0) >= 5 &&
        !prev.transcendence?.everUnlocked;

      return {
        ...prev,
        nutrients: prev.nutrients - cost,
        owned: {
          ...prev.owned,
          [defId]: nextYgg,
        },
        totalOwned: prev.totalOwned + addedQty,
        transcendence: shouldUnlockTranscend
          ? { ...prev.transcendence, everUnlocked: true }
          : prev.transcendence,
      };
    });

    if (bonusRoots > 0) {
      const isEn = cur.lang === 'en';
      const rootName = isEn ? (MODULE_TRANSLATIONS[def.id]?.en?.name || def.name) : def.name;
      const text = bonusRoots > 1
        ? (isEn ? `🌱 Twin Sprout! (+${bonusRoots} Free ${rootName})` : `🌱 แตกหน่อคู่! (แถมฟรี +${bonusRoots} ${rootName})`)
        : (isEn ? `🌱 Sprout Bonus! (+1 Free ${rootName})` : `🌱 แตกหน่อโบนัส! (แถมฟรี +1 ${rootName})`);
      randomEvents.showFloatingText(
        typeof window !== 'undefined' ? window.innerWidth / 2 : 200,
        typeof window !== 'undefined' ? window.innerHeight / 2 : 200,
        text,
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
    if (gained <= 0) return 0;

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

    const starterBonus = Math.min(1000, starterRootsCount(cur));
    const freshOwned: Record<string, number> = {};
    MODULE_DEFS.forEach(d => { freshOwned[d.id] = 0; });
    if (starterBonus > 0) {
      freshOwned['fine'] = starterBonus;
    }
    const initialNutrients = cur.prestige.autoRoot ? 10 : 0;

    setState(prev => ({
      ...prev,
      nutrients: initialNutrients,
      runEarned: initialNutrients,
      runPlayTimeSeconds: 0,
      owned: freshOwned,
      totalOwned: starterBonus,
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
    if (hasRelic(cur, targetId)) return;
    const isEn = cur.lang === 'en';

    setState(prev => ({
      ...prev,
      relics: { ...prev.relics, [targetId]: 1 },
      unclaimedRelicId: null,
    }));

    randomEvents.showFloatingText(
      200,
      140,
      isEn
        ? `🏺 Unearthed: ${def.enName} (100% Complete!)`
        : `🏺 ค้นพบโบราณวัตถุ: ${def.name} (สำเร็จ 1/1 สมบูรณ์!)`,
      def.color || '#ffd76a'
    );
  }, [randomEvents]);

  const setActiveBiome = useCallback((biomeId: BiomeId) => {
    setState(prev => ({
      ...prev,
      activeBiome: biomeId,
    }));
  }, []);

  const onWaterCanvas = useCallback((_x: number, _y: number) => {
    // Water ripple / visual interaction without clicker nutrient burst
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
        const permafrostOfflineMult = isTrialCompleted(loadedState, 'permafrost') ? 1.20 : 1.0;
        if (dt > 45) {
          const gain = rate * dt * permafrostOfflineMult;
          setOfflineModal({ gain, dt });
        } else if (dt > 1) {
          const gain = rate * dt * permafrostOfflineMult;
          setState(prev => ({
            ...prev,
            nutrients: prev.nutrients + gain,
            runEarned: prev.runEarned + gain,
          }));
        }
      }
    }
  }, []);

  // GAME LOOP (requestAnimationFrame with Wall-Clock Background Catch-up)
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();
    let lastWallClock = Date.now();

    const loop = (now: number) => {
      const nowWallClock = Date.now();
      // If browser throttled rAF while tab was backgrounded, use wall-clock delta
      const wallElapsed = (nowWallClock - lastWallClock) / 1000;
      const perfElapsed = (now - lastTime) / 1000;
      const dt = Math.max(perfElapsed, wallElapsed);

      lastTime = now;
      lastWallClock = nowWallClock;

      if (dt > 0) {
        const cur = stateRef.current;
        const speedMult = (cur.transcendence?.hyperdriveUnlocked && cur.transcendence?.hyperdriveEnabled) ? 2.0 : 1.0;
        const effectiveDt = dt * speedMult;
        const rate = totalRate();
        const gain = rate * effectiveDt;

        setState(prev => ({
          ...prev,
          nutrients: prev.nutrients + gain,
          runEarned: prev.runEarned + gain,
          totalPlayTimeSeconds: prev.totalPlayTimeSeconds + effectiveDt,
          runPlayTimeSeconds: prev.runPlayTimeSeconds + effectiveDt,
          stats: {
            ...prev.stats,
            totalNutrientsEarnedLifetime: (prev.stats?.totalNutrientsEarnedLifetime || 0) + gain,
          },
        }));

        // Check expired buffs
        randomEvents.checkBuffExpirations();
      }

      animId = requestAnimationFrame(loop);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const nowWall = Date.now();
        const gapSeconds = (nowWall - lastWallClock) / 1000;
        if (gapSeconds > 0.5) {
          const cur = stateRef.current;
          const speedMult = (cur.transcendence?.hyperdriveUnlocked && cur.transcendence?.hyperdriveEnabled) ? 2.0 : 1.0;
          const effectiveGap = gapSeconds * speedMult;
          const rate = totalRate();
          const gain = rate * effectiveGap;
          setState(prev => ({
            ...prev,
            nutrients: prev.nutrients + gain,
            runEarned: prev.runEarned + gain,
            totalPlayTimeSeconds: prev.totalPlayTimeSeconds + effectiveGap,
            runPlayTimeSeconds: prev.runPlayTimeSeconds + effectiveGap,
            stats: {
              ...prev.stats,
              totalNutrientsEarnedLifetime: (prev.stats?.totalNutrientsEarnedLifetime || 0) + gain,
            },
          }));
        }
        lastTime = performance.now();
        lastWallClock = nowWall;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
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
    buyGaiaBlessing: transcendenceEngine.buyGaiaBlessing,
    buyAutoManager: transcendenceEngine.buyAutoManager,
    buyGaiaTouch: transcendenceEngine.buyGaiaTouch,
    buyEchoResonance: transcendenceEngine.buyEchoResonance,
    buyGaiaClairvoyance: transcendenceEngine.buyGaiaClairvoyance,
    buyPrimordialSeedling: transcendenceEngine.buyPrimordialSeedling,
    buyDeepMeditation: transcendenceEngine.buyDeepMeditation,
    buyHyperdrive: transcendenceEngine.buyHyperdrive,
    toggleHyperdrive: transcendenceEngine.toggleHyperdrive,
    buyAuroraBloom: transcendenceEngine.buyAuroraBloom,
    transmuteSeedsToPetals: transcendenceEngine.transmuteSeedsToPetals,
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
