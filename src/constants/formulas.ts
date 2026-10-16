import { GameState, ModuleDef } from '@/types/game';
import { ACHIEVEMENT_BONUS_MAP } from './achievementsData';
import { MODULE_DEFS, moduleMilestoneMultiplier } from './modules';
import { PRESTIGE_UNLOCK_ECHOES, prestigeBonusPct } from './prestige';
import {
  relicRateBonusMultiplier,
  relicDeepRootsBonus,
  relicSynergyBonusPerUnit,
  relicSynergyUnlockRequiredCount,
  relicEchoBonusPerEcho,
  biomeActiveRateMultiplier,
} from './relics';
import {
  isInTrial,
  primordialVigorMult,
  trialCompletionBonusMultiplier,
  trialCostMultiplier,
  trialEchoBonusMultiplier,
  trialRateMultiplier,
  trialSynergyBonusMultiplier,
  deepMeditationMultiplier,
  fineRootBaseRate,
  trialDeepRootsBonusMultiplier,
  pactRateMultiplier,
  pactCostMultiplier,
  pactResonanceMultiplier,
  astralResonanceMultiplierBonus,
} from './transcendence';

export * from './initialState';
export * from './depthLayers';

export const GAME_VERSION = '1.36.0';
const BASE_RATE = 0.15;
export const BUY_QTY_OPTIONS = [1, 5, 25];
export const SAVE_SLOT_COUNT = 5;

const ROOT_UPGRADE_MILESTONE_MULT = 2.5;
const ROOT_UPGRADE_NORMAL_MULT = 1.75;

const ECHO_REQUIRE_OWNED = 20;
const ECHO_REQUIRE_UPGRADE_LEVEL = 3;
const ECHO_MAX_LEVEL = 5;

const ROOT_SYNERGY_REQUIRE_OWNED = 50;

// Cost calculations
export function costFor(def: ModuleDef, ownedCount: number, state?: GameState): number {
  const trialMult = state ? trialCostMultiplier(state) * pactCostMultiplier(state) : 1.0;
  return Math.ceil(def.baseCost * Math.pow(def.costMult, ownedCount) * trialMult);
}

export function bulkCostFor(def: ModuleDef, ownedCount: number, qty: number, state?: GameState): number {
  const m = def.costMult;
  const trialMult = state ? trialCostMultiplier(state) * pactCostMultiplier(state) : 1.0;
  const first = def.baseCost * Math.pow(m, ownedCount) * trialMult;
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

export function rootUpgradeCost(def: ModuleDef, level: number): number {
  const reqOwned = rootUpgradeRequireOwned(level);
  // Upgrade cost is ~1.6x of single root cost, making it cheaper than the next tier root
  return Math.ceil(costFor(def, reqOwned) * 1.6);
}

export function rootUpgradeMultiplier(state: GameState, moduleId: string): number {
  const level = state.rootUpgrades[moduleId] || 0;
  if (level <= 0) return 1;
  const milestones = Math.floor(level / 5);
  const normals = level - milestones;
  let mult = Math.pow(ROOT_UPGRADE_MILESTONE_MULT, milestones) * Math.pow(ROOT_UPGRADE_NORMAL_MULT, normals);
  if (!isInTrial(state) && state.activeBiome === 'magma_mantle') {
    mult *= 1.20;
  }
  return mult;
}

// Echoes
export function totalEchoCount(state: GameState): number {
  let s = 0;
  for (let i = 0; i < MODULE_DEFS.length; i++) {
    s += (state.echoes[MODULE_DEFS[i].id] || 0);
  }
  return s;
}

export function echoBonusPct(state: GameState): number {
  return Math.round((globalEchoMultiplier(state) - 1) * 100);
}

export function globalEchoMultiplier(state: GameState): number {
  if (state.transcendence?.activeTrial === 'geomagnetic_storm') return 1.0;
  const bonusPerEcho = relicEchoBonusPerEcho(state);
  const trialMult = trialEchoBonusMultiplier(state);
  const pactRes = pactResonanceMultiplier(state);
  return (1 + totalEchoCount(state) * bonusPerEcho * pactRes) * trialMult;
}

export function echoUnlockedFor(state: GameState, moduleId: string): boolean {
  return (state.owned[moduleId] || 0) >= ECHO_REQUIRE_OWNED
    && (state.rootUpgrades[moduleId] || 0) >= ECHO_REQUIRE_UPGRADE_LEVEL;
}

export function maxEchoLevel(state: GameState): number {
  return ECHO_MAX_LEVEL + (state.transcendence?.echoResonanceLevel || 0);
}

export function echoMaxed(state: GameState, moduleId: string): boolean {
  return (state.echoes[moduleId] || 0) >= maxEchoLevel(state);
}

export function echoCost(state: GameState, def: ModuleDef): number {
  if (echoMaxed(state, def.id)) return Infinity;
  const n = state.echoes[def.id] || 0;
  // Fixed cost: Starts at cost equivalent to root #25, scaling +5 roots per level
  // Fully scales with Transcendence uncaps (Lv.6 to Lv.10+)
  const targetRoots = 25 + n * 5;
  return costFor(def, targetRoots, state);
}

export function achievementBonusPct(state: GameState): number {
  if (isInTrial(state)) return 0;
  const achs = state.achievements;
  if (!achs || achs.length === 0) return 0;
  let sum = 0;
  for (let i = 0; i < achs.length; i++) {
    sum += ACHIEVEMENT_BONUS_MAP[achs[i]] || 1;
  }
  return sum;
}

// Synergies
export function rootSynergyUnlocked(state: GameState, moduleId: string): boolean {
  const req = relicSynergyUnlockRequiredCount(state);
  return (state.owned[moduleId] || 0) >= req;
}

export function rootSynergyCost(def: ModuleDef, state?: GameState): number {
  const trialMult = state ? trialCostMultiplier(state) * pactCostMultiplier(state) : 1.0;
  const req = state ? relicSynergyUnlockRequiredCount(state) : ROOT_SYNERGY_REQUIRE_OWNED;
  return Math.ceil(def.baseCost * Math.pow(def.costMult, req) * 10 * trialMult);
}

export function speciesSynergyBonusPct(state: GameState, _moduleId?: string): number {
  return relicSynergyBonusPerUnit(state);
}

export function totalSynergyBonusPct(state: GameState): number {
  if (!state.rootSynergies || state.transcendence?.activeTrial === 'null_cycle') return 0;
  let totalPct = 0;
  const bonusPerUnit = relicSynergyBonusPerUnit(state);
  for (const id in state.rootSynergies) {
    if (state.rootSynergies[id]) {
      totalPct += (state.owned[id] || 0) * bonusPerUnit;
    }
  }
  const trialMult = trialSynergyBonusMultiplier(state);
  const pactRes = pactResonanceMultiplier(state);
  const biomeMult = (!isInTrial(state) && state.activeBiome === 'myco_abyss') ? 1.25 : 1.0;
  return totalPct * trialMult * pactRes * biomeMult;
}

export function totalSynergiesCount(state: GameState): number {
  if (!state.rootSynergies) return 0;
  return Object.values(state.rootSynergies).filter(Boolean).length;
}

export function totalGlobalBonusPercent(state: GameState): number {
  const achPct = achievementBonusPct(state);
  const synPct = totalSynergyBonusPct(state);
  const prestigePct = prestigeBonusPct(state);
  return achPct + synPct + prestigePct;
}

function specialMultiplierBonus(state: GameState): number {
  const echoBonus = Math.max(0, globalEchoMultiplier(state) - 1);
  const vigorBonus = Math.max(0, primordialVigorMult(state) - 1);
  const relicBonus = Math.max(0, relicRateBonusMultiplier(state) - 1);
  const meditationBonus = Math.max(0, deepMeditationMultiplier(state) - 1);
  const trialCompletionBonus = Math.max(0, trialCompletionBonusMultiplier(state) - 1);
  const astralBonus = astralResonanceMultiplierBonus(state);
  return echoBonus + vigorBonus + relicBonus + meditationBonus + trialCompletionBonus + astralBonus;
}

export function specialRateMultiplier(state: GameState): number {
  return 1 + specialMultiplierBonus(state);
}

export function globalRateMultiplier(state: GameState): number {
  const baseMult = 1 + totalGlobalBonusPercent(state) * 0.01;
  const specialMult = specialRateMultiplier(state);
  const trialRate = trialRateMultiplier(state);
  const pactRate = pactRateMultiplier(state);
  const biomeMult = biomeActiveRateMultiplier(state);
  return baseMult * specialMult * trialRate * pactRate * biomeMult;
}

// Effective Rates
export function effectiveRate(state: GameState, def: ModuleDef, cachedGlobalMult?: number): number {
  const count = state.owned[def.id] || 0;
  const milestoneMult = moduleMilestoneMultiplier(count);
  const upgMult = rootUpgradeMultiplier(state, def.id);
  const deepMult = relicDeepRootsBonus(state, def.id);
  const trialDeepMult = trialDeepRootsBonusMultiplier(state, def.id);
  const globalMult = cachedGlobalMult ?? globalRateMultiplier(state);

  const baseRate = (def.id === 'fine') ? fineRootBaseRate(state) : def.rate;
  return baseRate * milestoneMult * upgMult * deepMult * trialDeepMult * globalMult;
}

export function baseTotalRate(state: GameState): number {
  const globalMult = globalRateMultiplier(state);
  let r = BASE_RATE;
  for (let i = 0; i < MODULE_DEFS.length; i++) {
    const m = MODULE_DEFS[i];
    const count = state.owned[m.id] || 0;
    if (count > 0) {
      r += count * effectiveRate(state, m, globalMult);
    }
  }
  return r;
}

export function prestigeUnlocked(state: GameState): boolean {
  return (
    totalEchoCount(state) >= PRESTIGE_UNLOCK_ECHOES ||
    (state.owned['throne'] || 0) >= 1 ||
    (state.stats?.prestigeCount || 0) > 0 ||
    (state.transcendence?.count || 0) > 0
  );
}

// Unlocked Upgrades Discovery
export function getUnlockedUpgradeIds(state: GameState): string[] {
  return MODULE_DEFS.filter(def => {
    const level = state.rootUpgrades[def.id] || 0;
    const owned = state.owned[def.id] || 0;
    return owned >= rootUpgradeRequireOwned(1) || level > 0;
  }).map(d => d.id);
}

export function getUnlockedEchoIds(state: GameState): string[] {
  return MODULE_DEFS.filter(def => {
    return echoUnlockedFor(state, def.id) || (state.echoes[def.id] || 0) > 0;
  }).map(d => d.id);
}

export function getUnlockedSynergyIds(state: GameState): string[] {
  return MODULE_DEFS.filter(def => {
    return rootSynergyUnlocked(state, def.id);
  }).map(d => d.id);
}

export function getUnpurchasedSynergyIds(state: GameState): string[] {
  return getUnlockedSynergyIds(state).filter(id => !state.rootSynergies[id]);
}
