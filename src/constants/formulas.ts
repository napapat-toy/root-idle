import { GameState, Language, ModuleDef } from '@/types/game';
import { ACHIEVEMENT_BONUS_MAP } from './achievementsData';
import { MODULE_DEFS, moduleMilestoneMultiplier } from './modules';
import { PRESTIGE_UNLOCK_ECHOES, prestigeBonusPct } from './prestige';

export const GAME_VERSION = '1.24.2';
export const BASE_RATE = 0.15;
export const BUY_QTY_OPTIONS = [1, 5, 25];
export const SAVE_SLOT_COUNT = 5;

export const ROOT_UPGRADE_MILESTONE_MULT = 3.0;
export const ROOT_UPGRADE_NORMAL_MULT = 2.0;
export const ROOT_UPGRADE_DISCOUNT = 0.40;

export const ECHO_REQUIRE_OWNED = 20;
export const ECHO_BASE_SECONDS = 200;
export const ECHO_COST_MULT = 4;
export const ECHO_REQUIRE_UPGRADE_LEVEL = 3;

export const ROOT_SYNERGY_REQUIRE_OWNED = 50;
export const ROOT_SYNERGY_PCT_PER_UNIT = 0.1; // +0.1% per owned unit

export function createFreshState(): GameState {
  const s: GameState = {
    nutrients: 0,
    owned: {},
    totalOwned: 0,
    rootUpgrades: {},
    echoes: {},
    rootSynergies: {},
    relics: {},
    unclaimedRelicId: null,
    activeBiome: 'topsoil',
    buyQty: 1,
    lockGapBackfilled: true,
    totalPlayTimeSeconds: 0,
    runPlayTimeSeconds: 0,
    runEarned: 0,
    eternalSeeds: 0,
    prestige: {
      starterLevel: 0,
      autoRoot: false,
      autoRootEnabled: false,
      autoRootMode: 'all',
      autoRootSmart: false,
      autoRootAll: false,
      goldenLevel: 0,
      auraRoots: false,
      auraRootsEnabled: false,
      skinSameOrigin: false,
      skinGrayscale: false,
      skinGradient: false,
      activeSkin: 'none',
      activeUITheme: 'classic',
      autoReset: false,
      autoResetEnabled: false,
      autoResetThreshold: 1000,
      offlineCapLevel: 0,
      eventBonusLevel: 0,
      eventDurationLevel: 0,
      autoEvent: false,
      autoEventEnabled: false,
      luckyMagnitudeLevel: 0,
      luckyDurationLevel: 0,
      luckyChanceLevel: 0,
      passiveRateLevel: 0,
    },
    achievements: [],
    stats: {
      prestigeCount: 0,
      totalEventsClaimed: 0,
      luckyJackpotCount: 0,
      maxOfflineTimeSeconds: 0,
      superJackpotClaimed: false,
      totalSeedsEarnedLifetime: 0,
      totalNutrientsEarnedLifetime: 0,
    },
    lang: 'th',
  };
  MODULE_DEFS.forEach(m => { s.owned[m.id] = 0; });
  return s;
}

// Cost calculations
export function costFor(def: ModuleDef, ownedCount: number): number {
  return Math.ceil(def.baseCost * Math.pow(def.costMult, ownedCount));
}

export function bulkCostFor(def: ModuleDef, ownedCount: number, qty: number): number {
  const m = def.costMult;
  const first = def.baseCost * Math.pow(m, ownedCount);
  const total = Math.abs(m - 1) < 1e-9 ? first * qty : first * (Math.pow(m, qty) - 1) / (m - 1);
  return Math.ceil(total);
}

// Root Upgrades
export function rootUpgradeRequireOwned(level: number): number {
  return 10 * level; // Unlocks every 10 roots (10, 20, 30, 40, 50, ...)
}

export function rootUpgradeIsMilestone(level: number): boolean {
  return level % 5 === 0; // Every 5 levels = every 50 roots milestone
}

export function rootUpgradeLevelMult(level: number): number {
  return rootUpgradeIsMilestone(level) ? ROOT_UPGRADE_MILESTONE_MULT : ROOT_UPGRADE_NORMAL_MULT;
}

export function rootUpgradeEquivUnits(_level: number): number {
  return 2;
}

export function rootUpgradeCost(def: ModuleDef, level: number): number {
  const reqOwned = rootUpgradeRequireOwned(level);
  // Upgrade cost is ~1.6x of single root cost, making it cheaper than the next tier root
  return Math.ceil(costFor(def, reqOwned) * 1.6);
}

export function rootUpgradeMultiplier(state: GameState, moduleId: string): number {
  const level = state.rootUpgrades[moduleId] || 0;
  let mult = 1;
  for (let i = 1; i <= level; i++) mult *= rootUpgradeLevelMult(i);
  return mult;
}

// Echoes
import {
  relicRateBonusMultiplier,
  relicSynergyBonusPerUnit,
  relicEchoBonusPerEcho,
  biomeActiveRateMultiplier,
} from './relics';

export function totalEchoCount(state: GameState): number {
  let s = 0;
  MODULE_DEFS.forEach(d => { s += (state.echoes[d.id] || 0); });
  return s;
}

export function echoBonusPct(state: GameState): number {
  return totalEchoCount(state) * relicEchoBonusPerEcho(state);
}

export function globalEchoMultiplier(state: GameState): number {
  return 1 + echoBonusPct(state) * 0.01;
}

export function echoUnlockedFor(state: GameState, moduleId: string): boolean {
  return (state.owned[moduleId] || 0) >= ECHO_REQUIRE_OWNED
    && (state.rootUpgrades[moduleId] || 0) >= ECHO_REQUIRE_UPGRADE_LEVEL;
}

export function echoCost(state: GameState, def: ModuleDef, currentTotalRate: number): number {
  const n = state.echoes[def.id] || 0;
  const cost = ECHO_BASE_SECONDS * currentTotalRate * Math.pow(ECHO_COST_MULT, n);
  return Math.ceil(Math.max(cost, 1));
}

// Achievements
export function achievementBonusPct(state: GameState): number {
  if (!state.achievements || state.achievements.length === 0) return 0;
  return state.achievements.reduce((sum, id) => sum + (ACHIEVEMENT_BONUS_MAP[id] || 1), 0);
}

export function achievementMultiplier(state: GameState): number {
  return 1 + achievementBonusPct(state) * 0.01;
}

// Synergies
export function rootSynergyUnlocked(state: GameState, moduleId: string): boolean {
  return (state.owned[moduleId] || 0) >= ROOT_SYNERGY_REQUIRE_OWNED;
}

export function rootSynergyCost(def: ModuleDef): number {
  return Math.ceil(def.baseCost * Math.pow(def.costMult, ROOT_SYNERGY_REQUIRE_OWNED) * 10);
}

export function speciesSynergyBonusPct(state: GameState, _moduleId?: string): number {
  return relicSynergyBonusPerUnit(state);
}

export function totalSynergyMultiplier(state: GameState): number {
  if (!state.rootSynergies) return 1;
  const activeCount = Object.values(state.rootSynergies).filter(Boolean).length;
  if (activeCount === 0) return 1;

  const totalRoots = state.totalOwned || 0;
  const bonusPerUnit = relicSynergyBonusPerUnit(state);
  return 1 + (activeCount * totalRoots * bonusPerUnit * 0.01);
}

export function baseTotalRate(state: GameState): number {
  return calculateTotalRate(state);
}

export function totalSynergiesCount(state: GameState): number {
  if (!state.rootSynergies) return 0;
  return Object.values(state.rootSynergies).filter(Boolean).length;
}

export function totalSynergyBonusPct(state: GameState): number {
  return (totalSynergyMultiplier(state) - 1) * 100;
}

export function globalRateMultiplier(state: GameState): number {
  const echoMult = globalEchoMultiplier(state);
  const achMult = achievementMultiplier(state);
  const synMult = totalSynergyMultiplier(state);
  const prestigeMult = 1 + prestigeBonusPct(state) * 0.01;
  const relicRateMult = relicRateBonusMultiplier(state);
  const biomeMult = biomeActiveRateMultiplier(state);
  return echoMult * achMult * synMult * prestigeMult * relicRateMult * biomeMult;
}

export function totalGlobalBonusPercent(state: GameState): number {
  return (globalRateMultiplier(state) - 1) * 100;
}

// Effective Rates
export function effectiveRate(state: GameState, def: ModuleDef): number {
  const count = state.owned[def.id] || 0;
  const milestoneMult = moduleMilestoneMultiplier(count);
  const upgMult = rootUpgradeMultiplier(state, def.id);
  const echoMult = globalEchoMultiplier(state);
  const achMult = achievementMultiplier(state);
  const synMult = totalSynergyMultiplier(state);
  const prestigeMult = 1 + prestigeBonusPct(state) * 0.01;
  const relicRateMult = relicRateBonusMultiplier(state);
  const biomeMult = biomeActiveRateMultiplier(state);

  return def.rate
    * milestoneMult
    * upgMult
    * echoMult
    * achMult
    * synMult
    * prestigeMult
    * relicRateMult
    * biomeMult;
}

export function calculateTotalRate(state: GameState): number {
  let r = BASE_RATE;
  MODULE_DEFS.forEach(m => {
    r += (state.owned[m.id] || 0) * effectiveRate(state, m);
  });
  return r;
}

export function prestigeUnlocked(state: GameState): boolean {
  return totalEchoCount(state) >= PRESTIGE_UNLOCK_ECHOES || (state.owned['throne'] || 0) >= 1;
}

// Subterranean Geological Depth Layers
export interface SubterraneanDepthInfo {
  depthMeters: number;
  depthFormatted: string;
  stageName: string;
  layerTitle: string;
  bgGradient: string;
  surfaceTheme: 'grass' | 'moss' | 'crystal' | 'magma' | 'void' | 'yggdrasil';
  surfaceColor: string;
  surfaceSubColor: string;
  layerIndex: number;
}

export function getHighestOwnedRootIndex(stateOrOwned: GameState | Record<string, number>): number {
  const owned: Record<string, number> = 'owned' in stateOrOwned ? (stateOrOwned as GameState).owned : stateOrOwned;
  for (let i = MODULE_DEFS.length - 1; i >= 0; i--) {
    if ((owned[MODULE_DEFS[i].id] || 0) > 0) {
      return i;
    }
  }
  return 0;
}

export function subterraneanDepthMeters(totalOwned: number, highestIndex: number = 0): number {
  const TIER_DEPTH_BASE = [
    15,     // 0: fine (15m)
    40,     // 1: nodule (40m)
    80,     // 2: myco (80m)
    160,    // 3: core (160m)
    350,    // 4: vine (350m)
    800,    // 5: bionode (800m)
    1800,   // 6: eternal (1.8km)
    3500,   // 7: nexus (3.5km)
    7500,   // 8: crystal (7.5km)
    15000,  // 9: heart (15km)
    35000,  // 10: seed (35km)
    75000,  // 11: throne (75km)
    150000, // 12: magma (150km)
    350000, // 13: aether (350km)
    750000, // 14: void (750km)
    1500000,// 15: astral (1,500km)
    3500000,// 16: chronos (3,500km)
    7500000,// 17: singularity (7,500km)
    15000000,// 18: genesis (15,000km)
    35000000,// 19: yggdrasil (35,000km)
  ];

  const baseMeters = TIER_DEPTH_BASE[Math.min(highestIndex, TIER_DEPTH_BASE.length - 1)] || 15;
  return baseMeters + Math.round(totalOwned * 5);
}

export function getSubterraneanDepthInfo(
  totalOwned: number,
  highestIndexOrMaxY: number = 0,
  lang: Language = 'th'
): SubterraneanDepthInfo {
  // If highestIndex is large (e.g. from maxY > 100), clamp to max tier index
  const highestIndex = highestIndexOrMaxY > 25 ? Math.min(19, Math.floor(highestIndexOrMaxY / 50)) : highestIndexOrMaxY;
  const depthMeters = subterraneanDepthMeters(totalOwned, highestIndex);
  const depthFormatted = depthMeters >= 1000 ? `${(depthMeters / 1000).toLocaleString(undefined, { maximumFractionDigits: 2 })} km` : `${depthMeters} m`;
  const isEn = lang === 'en';

  // Layer 1: Surface Loam (T1-T4: fine, nodule, myco, core)
  if (highestIndex < 4) {
    return {
      depthMeters,
      depthFormatted,
      stageName: isEn ? 'Surface Loam' : 'ดินร่วนชั้นบน',
      layerTitle: isEn ? `🌱 Surface Loam · ${depthFormatted}` : `🌱 ดินร่วนชั้นบน · ${depthFormatted}`,
      bgGradient: 'radial-gradient(ellipse at 50% 15%, #241c14 0%, #15100c 60%, #0a0806 100%)',
      surfaceTheme: 'grass',
      surfaceColor: '#8fd17a',
      surfaceSubColor: '#3a2717',
      layerIndex: 1,
    };
  }

  // Layer 2: Subterranean Bio-Forest (T5-T8: vine, bionode, eternal, nexus)
  if (highestIndex < 8) {
    return {
      depthMeters,
      depthFormatted,
      stageName: isEn ? 'Subterranean Bio-Forest' : 'ป่าใต้ดินชีวภาพ',
      layerTitle: isEn ? `🍄 Subterranean Bio-Forest · ${depthFormatted}` : `🍄 ป่าใต้ดินชีวภาพ · ${depthFormatted}`,
      bgGradient: 'radial-gradient(ellipse at 50% 25%, #0f2316 0%, #09170e 60%, #040a06 100%)',
      surfaceTheme: 'moss',
      surfaceColor: '#4ade80',
      surfaceSubColor: '#143d23',
      layerIndex: 2,
    };
  }

  // Layer 3: Crystal Cavern (T9-T12: crystal, heart, seed, throne)
  if (highestIndex < 12) {
    return {
      depthMeters,
      depthFormatted,
      stageName: isEn ? 'Crystal Cavern' : 'ถ้ำผลึกคริสตัล',
      layerTitle: isEn ? `💎 Crystal Cavern · ${depthFormatted}` : `💎 ถ้ำผลึกคริสตัล · ${depthFormatted}`,
      bgGradient: 'radial-gradient(ellipse at 50% 25%, #0c1e2d 0%, #07131d 60%, #03080e 100%)',
      surfaceTheme: 'crystal',
      surfaceColor: '#38bdf8',
      surfaceSubColor: '#10354f',
      layerIndex: 3,
    };
  }

  // Layer 4: Molten Magma Mantle (T13-T15: magma, aether, void)
  if (highestIndex < 15) {
    return {
      depthMeters,
      depthFormatted,
      stageName: isEn ? 'Molten Magma Mantle' : 'แก่นหินหลอมเหลวแมกมา',
      layerTitle: isEn ? `🔥 Molten Magma Mantle · ${depthFormatted}` : `🔥 แก่นหินแมกมา · ${depthFormatted}`,
      bgGradient: 'radial-gradient(ellipse at 50% 25%, #2a0f0a 0%, #1c0805 60%, #0c0302 100%)',
      surfaceTheme: 'magma',
      surfaceColor: '#f97316',
      surfaceSubColor: '#4a180e',
      layerIndex: 4,
    };
  }

  // Layer 5: Astral Void Rift (T16-T18: astral, chronos, singularity)
  if (highestIndex < 18) {
    return {
      depthMeters,
      depthFormatted,
      stageName: isEn ? 'Astral Void Rift' : 'มิติธารดวงดาวห้วงสุญญะ',
      layerTitle: isEn ? `🔮 Astral Void Rift · ${depthFormatted}` : `🔮 มิติธารดวงดาว · ${depthFormatted}`,
      bgGradient: 'radial-gradient(ellipse at 50% 25%, #1d0c2e 0%, #11061c 60%, #07020d 100%)',
      surfaceTheme: 'void',
      surfaceColor: '#c084fc',
      surfaceSubColor: '#3a1357',
      layerIndex: 5,
    };
  }

  // Layer 6: Eternal Yggdrasil Core (T19-T20: genesis, yggdrasil)
  return {
    depthMeters,
    depthFormatted,
    stageName: isEn ? 'Eternal Yggdrasil Core' : 'แก่นพฤกษาอนันต์กาล',
    layerTitle: isEn ? `🌳 Eternal Yggdrasil Core · ${depthFormatted}` : `🌳 แก่นพฤกษาอนันต์กาล · ${depthFormatted}`,
    bgGradient: 'radial-gradient(ellipse at 50% 25%, #261e0b 0%, #181206 60%, #0a0702 100%)',
    surfaceTheme: 'yggdrasil',
    surfaceColor: '#facc15',
    surfaceSubColor: '#4d3b10',
    layerIndex: 6,
  };
}

export function stageName(stateOrTotalOwned: GameState | number, lang: Language = 'th'): string {
  if (typeof stateOrTotalOwned === 'object') {
    const highest = getHighestOwnedRootIndex(stateOrTotalOwned);
    return getSubterraneanDepthInfo(stateOrTotalOwned.totalOwned, highest, lang).stageName;
  }
  return getSubterraneanDepthInfo(stateOrTotalOwned, 0, lang).stageName;
}
