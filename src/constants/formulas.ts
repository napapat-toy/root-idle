import { GameState, Language, ModuleDef } from '@/types/game';
import { ACHIEVEMENT_BONUS_MAP } from './achievementsData';
import { MODULE_DEFS, moduleMilestoneMultiplier } from './modules';
import { PRESTIGE_UNLOCK_ECHOES, prestigeBonusPct } from './prestige';

export const GAME_VERSION = '1.20.0';
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
    lockGapBackfilled: false,
    totalPlayTimeSeconds: 0,
    runPlayTimeSeconds: 0,
    runEarned: 0,
    eternalSeeds: 0,
    prestige: {
      starterLevel: 0,
      autoRoot: false,
      autoRootEnabled: true,
      autoRootSmart: false,
      autoRootAll: false,
      goldenLevel: 0,
      auraRoots: false,
      skinSakura: false,
      skinCafe: false,
      skinAutumn: false,
      skinOcean: false,
      skinFrost: false,
      skinSunset: false,
      skinSameOrigin: false,
      skinMystic: false,
      skinCyberpunk: false,
      skinGrayscale: false,
      skinGradient: false,
      skinNebula: false,
      skinImperial: false,
      activeSkin: 'none',
      themeSakura: false,
      themeCafe: false,
      themeAutumn: false,
      themeOcean: false,
      themeFrost: false,
      themeSunset: false,
      themeMystic: false,
      themeCyberpunk: false,
      themeGrayscale: false,
      themeEmerald: false,
      themeNebula: false,
      themeImperial: false,
      activeUITheme: 'classic',
      autoReset: false,
      autoResetEnabled: false,
      autoResetThreshold: 0,
      offlineCapLevel: 0,
      eventBonusLevel: 0,
      eventDurationLevel: 0,
      autoEvent: false,
      autoEventEnabled: true,
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
  return 5;
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

export function achievementRateMultiplier(state: GameState): number {
  return 1 + achievementBonusPct(state) * 0.01;
}

// Root Synergies
export function rootSynergyUnlocked(state: GameState, moduleId: string): boolean {
  return (state.owned[moduleId] || 0) >= ROOT_SYNERGY_REQUIRE_OWNED || !!state.rootSynergies?.[moduleId];
}

export function rootSynergyCost(def: ModuleDef): number {
  return bulkCostFor(def, ROOT_SYNERGY_REQUIRE_OWNED, 5);
}

export function speciesSynergyBonusPct(state: GameState, moduleId: string): number {
  if (!state.rootSynergies?.[moduleId]) return 0;
  const pctPerUnit = relicSynergyBonusPerUnit(state);
  return Number(((state.owned[moduleId] || 0) * pctPerUnit).toFixed(2));
}

export function totalSynergyBonusPct(state: GameState): number {
  let s = 0;
  MODULE_DEFS.forEach(d => {
    s += speciesSynergyBonusPct(state, d.id);
  });
  if (state.activeBiome === 'myco_abyss') {
    s *= 1.25;
  }
  return Number(s.toFixed(1));
}

export function totalSynergiesCount(state: GameState): number {
  return MODULE_DEFS.filter(d => !!state.rootSynergies?.[d.id]).length;
}

export function totalGlobalBonusPercent(state: GameState): number {
  return Number((echoBonusPct(state) + prestigeBonusPct(state) + achievementBonusPct(state) + totalSynergyBonusPct(state)).toFixed(1));
}

export function globalRateMultiplier(state: GameState): number {
  return (1 + totalGlobalBonusPercent(state) * 0.01) * relicRateBonusMultiplier(state) * biomeActiveRateMultiplier(state);
}

export function effectiveRate(state: GameState, def: ModuleDef, targetCount?: number): number {
  const count = targetCount !== undefined ? targetCount : (state.owned[def.id] || 0);
  let ruMult = rootUpgradeMultiplier(state, def.id);
  if (state.activeBiome === 'magma_mantle') {
    ruMult *= 1.20;
  }
  let biomeEarlyBoost = 1;
  if (state.activeBiome === 'topsoil' && ['fine', 'nodule', 'myco', 'core', 'vine'].includes(def.id)) {
    biomeEarlyBoost = 1.20;
  }

  return (
    def.rate *
    biomeEarlyBoost *
    moduleMilestoneMultiplier(count) *
    ruMult *
    globalRateMultiplier(state)
  );
}

export function baseTotalRate(state: GameState): number {
  let r = BASE_RATE * globalRateMultiplier(state);
  MODULE_DEFS.forEach(m => {
    r += (state.owned[m.id] || 0) * effectiveRate(state, m);
  });
  return r;
}

export function prestigeUnlocked(state: GameState): boolean {
  return totalEchoCount(state) >= PRESTIGE_UNLOCK_ECHOES || (state.owned['throne'] || 0) >= 1;
}

export interface SubterraneanDepthInfo {
  depthMeters: number;
  depthFormatted: string;
  stageName: string;
  layerTitle: string;
  bgGradient: string;
  grassColor: string;
  soilLine: string;
  ambientGlow: string;
  layerIndex: number;
}

export function subterraneanDepthMeters(totalOwned: number, maxY: number = 0): number {
  return Math.round(Math.max(10, totalOwned * 8.5 + (maxY > 0 ? (maxY - 200) * 0.8 : 0)));
}

export function getSubterraneanDepthInfo(totalOwned: number, maxY: number = 0, lang: Language = 'th'): SubterraneanDepthInfo {
  const depthMeters = subterraneanDepthMeters(totalOwned, maxY);
  const depthFormatted = depthMeters >= 1000 ? `${(depthMeters / 1000).toFixed(2)} km` : `${depthMeters} m`;
  const isEn = lang === 'en';

  if (totalOwned < 15) {
    return {
      depthMeters,
      depthFormatted,
      stageName: isEn ? 'Surface Loam' : 'ดินร่วนชั้นบน',
      layerTitle: isEn ? `🌱 Surface Loam · ${depthFormatted}` : `🌱 ดินร่วนชั้นบน · ${depthFormatted}`,
      bgGradient: 'radial-gradient(ellipse at 50% 15%, #241c14 0%, #15100c 60%, #0a0806 100%)',
      grassColor: '#8fd17a',
      soilLine: '#3a2717',
      ambientGlow: 'rgba(183, 224, 138, 0.06)',
      layerIndex: 1,
    };
  }
  if (totalOwned < 50) {
    return {
      depthMeters,
      depthFormatted,
      stageName: isEn ? 'Subterranean Bio-Forest' : 'ป่าใต้ดินชีวภาพ',
      layerTitle: isEn ? `🍄 Subterranean Bio-Forest · ${depthFormatted}` : `🍄 ป่าใต้ดินชีวภาพ · ${depthFormatted}`,
      bgGradient: 'radial-gradient(ellipse at 50% 25%, #0f2316 0%, #09170e 60%, #040a06 100%)',
      grassColor: '#4ade80',
      soilLine: '#143d23',
      ambientGlow: 'rgba(74, 222, 128, 0.10)',
      layerIndex: 2,
    };
  }
  if (totalOwned < 150) {
    return {
      depthMeters,
      depthFormatted,
      stageName: isEn ? 'Crystal Cavern' : 'ถ้ำผลึกคริสตัล',
      layerTitle: isEn ? `💎 Crystal Cavern · ${depthFormatted}` : `💎 ถ้ำผลึกคริสตัล · ${depthFormatted}`,
      bgGradient: 'radial-gradient(ellipse at 50% 25%, #0c1e2d 0%, #07131d 60%, #03080e 100%)',
      grassColor: '#38bdf8',
      soilLine: '#10354f',
      ambientGlow: 'rgba(56, 189, 248, 0.12)',
      layerIndex: 3,
    };
  }
  if (totalOwned < 400) {
    return {
      depthMeters,
      depthFormatted,
      stageName: isEn ? 'Molten Magma Mantle' : 'แก่นหินหลอมเหลวแมกมา',
      layerTitle: isEn ? `🔥 Molten Magma Mantle · ${depthFormatted}` : `🔥 แก่นหินแมกมา · ${depthFormatted}`,
      bgGradient: 'radial-gradient(ellipse at 50% 25%, #2a0f0a 0%, #1c0805 60%, #0c0302 100%)',
      grassColor: '#f97316',
      soilLine: '#4a180e',
      ambientGlow: 'rgba(249, 115, 22, 0.14)',
      layerIndex: 4,
    };
  }
  if (totalOwned < 1000) {
    return {
      depthMeters,
      depthFormatted,
      stageName: isEn ? 'Aetherial Void Rift' : 'มิติไอธาตุห้วงสุญญะ',
      layerTitle: isEn ? `🔮 Aetherial Void Rift · ${depthFormatted}` : `🔮 มิติไอธาตุห้วงสุญญะ · ${depthFormatted}`,
      bgGradient: 'radial-gradient(ellipse at 50% 25%, #1d0c2e 0%, #12061e 60%, #08020d 100%)',
      grassColor: '#c084fc',
      soilLine: '#3a1357',
      ambientGlow: 'rgba(192, 132, 252, 0.16)',
      layerIndex: 5,
    };
  }
  return {
    depthMeters,
    depthFormatted,
    stageName: isEn ? 'Eternal Yggdrasil Core' : 'แก่นพฤกษาอนันต์กาล',
    layerTitle: isEn ? `🌳 Eternal Yggdrasil Core · ${depthFormatted}` : `🌳 แก่นพฤกษาอนันต์กาล · ${depthFormatted}`,
    bgGradient: 'radial-gradient(ellipse at 50% 25%, #261e0b 0%, #181206 60%, #0a0702 100%)',
    grassColor: '#facc15',
    soilLine: '#4d3b10',
    ambientGlow: 'rgba(250, 204, 21, 0.18)',
    layerIndex: 6,
  };
}

export function stageName(totalOwned: number, lang: Language = 'th'): string {
  return getSubterraneanDepthInfo(totalOwned, 0, lang).stageName;
}
