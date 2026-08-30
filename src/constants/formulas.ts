import { GameState, Language, ModuleDef } from '@/types/game';
import { ACHIEVEMENT_BONUS_MAP } from './achievementsData';
import { MODULE_DEFS, moduleMilestoneMultiplier } from './modules';
import { PRESTIGE_UNLOCK_ECHOES, prestigeBonusPct } from './prestige';

export const GAME_VERSION = '1.15.0';
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
  return 5 * level;
}

export function rootUpgradeIsMilestone(level: number): boolean {
  return level % 5 === 0;
}

export function rootUpgradeLevelMult(level: number): number {
  return rootUpgradeIsMilestone(level) ? ROOT_UPGRADE_MILESTONE_MULT : ROOT_UPGRADE_NORMAL_MULT;
}

export function rootUpgradeEquivUnits(_level: number): number {
  return 1;
}

export function rootUpgradeCost(def: ModuleDef, level: number): number {
  return costFor(def, rootUpgradeRequireOwned(level));
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

export function stageName(totalOwned: number, lang: Language = 'th'): string {
  const isEn = lang === 'en';
  if (totalOwned < 5) return isEn ? 'Seedling Phase' : 'ระยะเมล็ด';
  if (totalOwned < 15) return isEn ? 'First Sprouts' : 'รากงอกแรก';
  if (totalOwned < 35) return isEn ? 'Root Network' : 'เครือข่ายราก';
  if (totalOwned < 70) return isEn ? 'Expansive Roots' : 'รากแผ่กว้าง';
  if (totalOwned < 150) return isEn ? 'Underground Forest' : 'ป่าใต้ดิน';
  if (totalOwned < 400) return isEn ? 'Root Labyrinth' : 'เขาวงกตราก';
  if (totalOwned < 1000) return isEn ? 'Subterranean Realm' : 'อาณาจักรใต้พิภพ';
  if (totalOwned < 2500) return isEn ? 'Primordial Energy Plane' : 'มิติพลังงานบรรพกาล';
  if (totalOwned < 5000) return isEn ? 'Subterranean Singularity' : 'แก่นเอกภาวะใต้โลก';
  return isEn ? 'Eternal Yggdrasil Canopy' : 'รากพฤกษาอนันต์กาล';
}
