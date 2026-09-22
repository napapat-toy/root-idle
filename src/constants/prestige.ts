import { GameState } from '@/types/game';
import { relicCycleResonanceStack } from './relics';

export const PRESTIGE_UNLOCK_ECHOES = 5;
export const SEED_DIVIDER = 10000000000; // 10 Billion (1e10)
export const SEED = 918273;
export const OFFLINE_CAP_HOURS = [24, 48, 72];

export const EVENT_DURATION_MAX_LEVEL = 4;
export const EVENT_BONUS_MAX_LEVEL = 10000; // Cap at Lv. 10,000 (+1,000%)
export const LUCKY_DURATION_BASE = 5;
export const LUCKY_DURATION_MAX = 20;
export const LUCKY_DURATION_MAX_LEVEL = LUCKY_DURATION_MAX - LUCKY_DURATION_BASE; // 15 levels
export const LUCKY_CHANCE_BASE = 0.002;
export const LUCKY_CHANCE_STEP = 0.001;
export const LUCKY_CHANCE_MAX_LEVEL = 8;
export const LUCKY_CHANCE_MAX = 0.010;
export const LUCKY_MAGNITUDE_MAX_LEVEL = 9; // Lv.9 = x10 max lucky multiplier cap

export const PASSIVE_RATE_COST = 100;
export const UNIVERSAL_AUTO_COST = 10000;
export const AUTO_ROOT_COST = 10000;
export const AUTO_ROOT_SMART_COST = 10000;
export const AUTO_ROOT_ALL_COST = 10000;
export const AUTO_RESET_COST = 10000;
export const AUTO_RESET_MIN_SEEDS = 3;
export const AUTO_EVENT_COST = 10000;

export const STARTER_CULTURE_MAX_LEVEL = 50; // Max 500 starter roots upon Prestige
export const GOLDEN_SEED_MAX_LEVEL = 100000; // Max 100,000 levels (+10,000% seeds)
export const PASSIVE_RATE_MAX_LEVEL = 1000000; // Max 1,000,000 levels (+100,000% rate)

export function prestigeBonusPct(state: GameState): number {
  if (state.transcendence?.activeTrial && state.transcendence.activeTrial !== 'none') return 0;
  const clamped = Math.min(PASSIVE_RATE_MAX_LEVEL, state.prestige.passiveRateLevel || 0);
  const base = clamped * 0.1; // +0.1% per level
  const cycleBonus = relicCycleResonanceStack(state);
  return Math.round(base * (1 + cycleBonus * 0.01) * 100) / 100;
}

export function prestigeRateMultiplier(state: GameState): number {
  return 1 + prestigeBonusPct(state) * 0.01;
}

export function starterCultureCost(stateOrLevel: GameState | number): number {
  const lvl = typeof stateOrLevel === 'number' ? stateOrLevel : (stateOrLevel.prestige.starterLevel || 0);
  return Math.min(3000, 50 * (lvl + 1));
}

export function goldenSeedCost(stateOrLevel: GameState | number): number {
  const lvl = typeof stateOrLevel === 'number' ? stateOrLevel : (stateOrLevel.prestige.goldenLevel || 0);
  return Math.floor(250 * Math.pow(lvl + 1, 1.40));
}

export function goldenSeedMaxed(state: GameState): boolean {
  return (state.prestige.goldenLevel || 0) >= GOLDEN_SEED_MAX_LEVEL;
}

export function passiveRateCost(stateOrLevel: GameState | number): number {
  const lvl = typeof stateOrLevel === 'number' ? stateOrLevel : (stateOrLevel.prestige.passiveRateLevel || 0);
  return Math.floor(50 * Math.pow(lvl + 1, 1.22));
}

export function passiveRateMaxed(state: GameState): boolean {
  return (state.prestige.passiveRateLevel || 0) >= PASSIVE_RATE_MAX_LEVEL;
}

export function offlineCapMaxed(state: GameState): boolean {
  return (state.prestige.offlineCapLevel || 0) >= OFFLINE_CAP_HOURS.length - 1;
}

export function offlineCapCost(state: GameState): number {
  return state.prestige.offlineCapLevel === 0 ? 1000 : 4000;
}

export function currentOfflineCapSeconds(state: GameState): number {
  return OFFLINE_CAP_HOURS[state.prestige.offlineCapLevel || 0] * 3600;
}

export function eventBonusCost(stateOrLevel: GameState | number): number {
  const lvl = typeof stateOrLevel === 'number' ? stateOrLevel : (stateOrLevel.prestige.eventBonusLevel || 0);
  return Math.floor(150 * Math.pow(lvl + 1, 1.35));
}

export function eventBonusMaxed(state: GameState): boolean {
  return (state.prestige.eventBonusLevel || 0) >= EVENT_BONUS_MAX_LEVEL;
}

export function eventDurationCost(stateOrLevel: GameState | number): number {
  const lvl = typeof stateOrLevel === 'number' ? stateOrLevel : (stateOrLevel.prestige.eventDurationLevel || 0);
  return 1500 * (lvl + 1);
}

export function eventBonusMult(state: GameState): number {
  const lvl = Math.min(EVENT_BONUS_MAX_LEVEL, state.prestige.eventBonusLevel || 0);
  return 1 + lvl * 0.001; // +0.1% per level
}

export function eventDurationMaxed(state: GameState): boolean {
  return (state.prestige.eventDurationLevel || 0) >= EVENT_DURATION_MAX_LEVEL;
}

export function eventDurationMult(state: GameState): number {
  return 1 + (state.prestige.eventDurationLevel || 0) * 0.15;
}

export function luckyMagnitudeCost(stateOrLevel: GameState | number): number {
  const lvl = typeof stateOrLevel === 'number' ? stateOrLevel : (stateOrLevel.prestige.luckyMagnitudeLevel || 0);
  return 50000 * (lvl + 1);
}

export function luckyDurationCost(stateOrLevel: GameState | number): number {
  const lvl = typeof stateOrLevel === 'number' ? stateOrLevel : (stateOrLevel.prestige.luckyDurationLevel || 0);
  return 1000 * (lvl + 1);
}

export function luckyMagnitudeExtra(state: GameState): number {
  return 1 + (state.prestige.luckyMagnitudeLevel || 0);
}

export function luckyDurationMaxed(state: GameState): boolean {
  return (state.prestige.luckyDurationLevel || 0) >= LUCKY_DURATION_MAX_LEVEL;
}

export function luckyDurationSeconds(state: GameState): number {
  return Math.min(LUCKY_DURATION_MAX, LUCKY_DURATION_BASE + (state.prestige.luckyDurationLevel || 0));
}

export function luckyDurationExtra(state: GameState): number {
  return luckyDurationSeconds(state);
}

export function luckyChanceMaxed(state: GameState): boolean {
  return (state.prestige.luckyChanceLevel || 0) >= LUCKY_CHANCE_MAX_LEVEL;
}

export function luckyChancePct(state: GameState): number {
  const inTrial = !!state.transcendence?.activeTrial && state.transcendence.activeTrial !== 'none';
  const prestigeBonus = Math.min(LUCKY_CHANCE_MAX, LUCKY_CHANCE_BASE + (state.prestige.luckyChanceLevel || 0) * LUCKY_CHANCE_STEP);
  if (inTrial) return prestigeBonus;
  const gaiaBonus = (state.transcendence?.gaiaClairvoyanceLevel || 0) * 0.001;
  const permafrostBonus = state.transcendence?.completedTrials?.['permafrost'] ? 0.002 : 0;
  const biomeMult = state.activeBiome === 'crystal_caverns' ? 1.35 : 1.0;
  return (prestigeBonus + gaiaBonus + permafrostBonus) * biomeMult;
}

export function luckyChanceCost(stateOrLevel: GameState | number): number {
  const lvl = typeof stateOrLevel === 'number' ? stateOrLevel : (stateOrLevel.prestige.luckyChanceLevel || 0);
  return 1000 * (lvl + 1);
}

export function starterRootsCount(state: GameState): number {
  if (state.transcendence?.activeTrial && state.transcendence.activeTrial !== 'none') return 0;
  return (state.prestige.starterLevel || 0) * 10;
}

export function calcPrestigeSeeds(state: GameState): number {
  if (!Number.isFinite(state.runEarned) || state.runEarned <= 0) return 0;
  if (state.runEarned < SEED_DIVIDER) return 0;
  const ratio = state.runEarned / SEED_DIVIDER;
  const base = Math.floor(Math.pow(ratio, 0.20) * 10);
  const goldenLvl = Math.min(GOLDEN_SEED_MAX_LEVEL, state.prestige.goldenLevel || 0);
  const bonus = 1 + goldenLvl * 0.001;
  const biomeBonus = (!state.transcendence?.activeTrial || state.transcendence.activeTrial === 'none') && state.activeBiome === 'sunken_ruins' ? 1.20 : 1.0;
  const trialBonus = state.transcendence?.completedTrials?.['null_cycle'] ? 1.50 : 1.0;
  const result = Math.floor(base * bonus * biomeBonus * trialBonus);
  return Number.isFinite(result) ? Math.max(0, result) : 1e12;
}

export function calcBulkPrestigeUpgrade(
  currentLevel: number,
  seeds: number,
  costFn: (lvl: number) => number,
  qty: number | 'max',
  maxLevel: number = Infinity
): { count: number; totalCost: number } {
  let count = 0;
  let totalCost = 0;
  let lvl = currentLevel;
  const targetCount = qty === 'max' ? 1000 : Math.min(1000, qty);
  const effectiveSeeds = Number.isFinite(seeds) ? seeds : 1e12;

  while (count < targetCount && lvl < maxLevel) {
    const nextCost = costFn(lvl);
    if (totalCost + nextCost > effectiveSeeds) break;
    totalCost += nextCost;
    count++;
    lvl++;
  }

  return { count, totalCost };
}
