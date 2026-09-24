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
} from './transcendence';

export * from './initialState';
export * from './depthLayers';

export const GAME_VERSION = '1.34.17';
export const BASE_RATE = 0.15;
export const BUY_QTY_OPTIONS = [1, 5, 25];
export const SAVE_SLOT_COUNT = 5;

export const ROOT_UPGRADE_MILESTONE_MULT = 2.5;
export const ROOT_UPGRADE_NORMAL_MULT = 1.75;
export const ROOT_UPGRADE_DISCOUNT = 0.40;

export const ECHO_REQUIRE_OWNED = 20;
export const ECHO_BASE_SECONDS = 45;
export const ECHO_COST_MULT = 2.0;
export const ECHO_REQUIRE_UPGRADE_LEVEL = 3;
export const ECHO_MAX_LEVEL = 5;
export const ECHO_BONUS_PER_LEVEL = 0.05;

export const ROOT_SYNERGY_REQUIRE_OWNED = 50;
export const ROOT_SYNERGY_PCT_PER_UNIT = 0.08; // +0.08% per owned unit

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
  if (level > 0 && !isInTrial(state) && state.activeBiome === 'magma_mantle') {
    mult *= 1.20;
  }
  return mult;
}

// Echoes
export function totalEchoCount(state: GameState): number {
  let s = 0;
  MODULE_DEFS.forEach(d => { s += (state.echoes[d.id] || 0); });
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

export function echoCost(state: GameState, def: ModuleDef, _currentTotalRate?: number): number {
  if (echoMaxed(state, def.id)) return Infinity;
  const n = state.echoes[def.id] || 0;
  // Fixed cost: Starts at cost equivalent to root #25, scaling +5 roots per level
  // Fully scales with Transcendence uncaps (Lv.6 to Lv.10+)
  const targetRoots = 25 + n * 5;
  return costFor(def, targetRoots, state);
}

export function achievementBonusPct(state: GameState): number {
  if (isInTrial(state)) return 0;
  if (!state.achievements || state.achievements.length === 0) return 0;
  return state.achievements.reduce((sum, id) => sum + (ACHIEVEMENT_BONUS_MAP[id] || 1), 0);
}

export function achievementMultiplier(state: GameState): number {
  return 1 + achievementBonusPct(state) * 0.01;
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
  for (const [id, active] of Object.entries(state.rootSynergies)) {
    if (active) {
      const count = state.owned[id] || 0;
      totalPct += count * bonusPerUnit;
    }
  }
  const trialMult = trialSynergyBonusMultiplier(state);
  const pactRes = pactResonanceMultiplier(state);
  const biomeMult = (!isInTrial(state) && state.activeBiome === 'myco_abyss') ? 1.25 : 1.0;
  return totalPct * trialMult * pactRes * biomeMult;
}

export function totalSynergyMultiplier(state: GameState): number {
  return 1 + totalSynergyBonusPct(state) * 0.01;
}

export function baseTotalRate(state: GameState): number {
  return calculateTotalRate(state);
}

export function totalSynergiesCount(state: GameState): number {
  if (!state.rootSynergies) return 0;
  return Object.values(state.rootSynergies).filter(Boolean).length;
}

export function totalGlobalBonusPercent(state: GameState): number {
  const achPct = achievementBonusPct(state);
  const synPct = totalSynergyBonusPct(state);
  const prestigePct = prestigeBonusPct(state);
  const biomePct = (biomeActiveRateMultiplier(state) - 1) * 100;
  return achPct + synPct + prestigePct + biomePct;
}

export function specialMultiplierBonus(state: GameState): number {
  const echoBonus = Math.max(0, globalEchoMultiplier(state) - 1);
  const vigorBonus = Math.max(0, primordialVigorMult(state) - 1);
  const relicBonus = Math.max(0, relicRateBonusMultiplier(state) - 1);
  const meditationBonus = Math.max(0, deepMeditationMultiplier(state) - 1);
  const trialCompletionBonus = Math.max(0, trialCompletionBonusMultiplier(state) - 1);
  return echoBonus + vigorBonus + relicBonus + meditationBonus + trialCompletionBonus;
}

export function specialRateMultiplier(state: GameState): number {
  return 1 + specialMultiplierBonus(state);
}

export function globalRateMultiplier(state: GameState): number {
  const baseMult = 1 + totalGlobalBonusPercent(state) * 0.01;
  const specialMult = specialRateMultiplier(state);
  const trialRate = trialRateMultiplier(state);
  const pactRate = pactRateMultiplier(state);
  return baseMult * specialMult * trialRate * pactRate;
}

// Effective Rates
export function effectiveRate(state: GameState, def: ModuleDef): number {
  const count = state.owned[def.id] || 0;
  const milestoneMult = moduleMilestoneMultiplier(count);
  const upgMult = rootUpgradeMultiplier(state, def.id);
  const deepMult = relicDeepRootsBonus(state, def.id);
  const trialDeepMult = trialDeepRootsBonusMultiplier(state, def.id);
  const globalMult = globalRateMultiplier(state);

  const baseRate = (def.id === 'fine') ? fineRootBaseRate(state) : def.rate;
  return baseRate * milestoneMult * upgMult * deepMult * trialDeepMult * globalMult;
}

export function calculateTotalRate(state: GameState): number {
  let r = BASE_RATE;
  MODULE_DEFS.forEach(m => {
    r += (state.owned[m.id] || 0) * effectiveRate(state, m);
  });
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
