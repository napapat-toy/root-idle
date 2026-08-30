import { GameState } from '@/types/game';

export const PRESTIGE_UNLOCK_ECHOES = 5;
export const SEED_DIVIDER = 100000000000; // 100 Billion (1e11)
export const SEED = 918273;
export const OFFLINE_CAP_HOURS = [24, 48, 72];

export const EVENT_DURATION_MAX_LEVEL = 4;
export const LUCKY_DURATION_BASE = 5;
export const LUCKY_DURATION_MAX = 20;
export const LUCKY_DURATION_MAX_LEVEL = LUCKY_DURATION_MAX - LUCKY_DURATION_BASE; // 15 levels
export const LUCKY_CHANCE_BASE = 0.002;
export const LUCKY_CHANCE_STEP = 0.001;
export const LUCKY_CHANCE_MAX_LEVEL = 8;
export const LUCKY_CHANCE_MAX = 0.010;
export const LUCKY_MAGNITUDE_MAX_LEVEL = 9; // Lv.9 = x10 max lucky multiplier cap

export const PASSIVE_RATE_COST = 100;
export const AUTO_ROOT_COST = 50;
export const AUTO_ROOT_SMART_COST = 180;
export const AUTO_ROOT_ALL_COST = 500;
export const AUTO_RESET_COST = 10000;
export const AUTO_RESET_MIN_SEEDS = 3;
export const AUTO_EVENT_COST = 1000;

export const STARTER_CULTURE_MAX_LEVEL = 50; // Max 500 starter roots upon Prestige

export function prestigeBonusPct(state: GameState): number {
  return state.prestige.passiveRateLevel || 0;
}

export function prestigeRateMultiplier(state: GameState): number {
  return 1 + prestigeBonusPct(state) * 0.01;
}

export function starterCultureCost(stateOrLevel: GameState | number): number {
  const lvl = typeof stateOrLevel === 'number' ? stateOrLevel : (stateOrLevel.prestige.starterLevel || 0);
  return Math.min(1000, 25 * (lvl + 1));
}

export function goldenSeedCost(stateOrLevel: GameState | number): number {
  const lvl = typeof stateOrLevel === 'number' ? stateOrLevel : (stateOrLevel.prestige.goldenLevel || 0);
  return 500 * (lvl + 1);
}

export function passiveRateCost(stateOrLevel: GameState | number): number {
  const lvl = typeof stateOrLevel === 'number' ? stateOrLevel : (stateOrLevel.prestige.passiveRateLevel || 0);
  return 100 * (lvl + 1);
}

export function offlineCapMaxed(state: GameState): boolean {
  return (state.prestige.offlineCapLevel || 0) >= OFFLINE_CAP_HOURS.length - 1;
}

export function offlineCapCost(state: GameState): number {
  return state.prestige.offlineCapLevel === 0 ? 80 : 220;
}

export function currentOfflineCapSeconds(state: GameState): number {
  return OFFLINE_CAP_HOURS[state.prestige.offlineCapLevel || 0] * 3600;
}

export function eventBonusCost(stateOrLevel: GameState | number): number {
  const lvl = typeof stateOrLevel === 'number' ? stateOrLevel : (stateOrLevel.prestige.eventBonusLevel || 0);
  return 250 * (lvl + 1);
}

export function eventDurationCost(stateOrLevel: GameState | number): number {
  const lvl = typeof stateOrLevel === 'number' ? stateOrLevel : (stateOrLevel.prestige.eventDurationLevel || 0);
  return 200 * (lvl + 1);
}

export function eventBonusMult(state: GameState): number {
  return 1 + (state.prestige.eventBonusLevel || 0) * 0.2;
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
  return Math.min(LUCKY_CHANCE_MAX, LUCKY_CHANCE_BASE + (state.prestige.luckyChanceLevel || 0) * LUCKY_CHANCE_STEP);
}

export function luckyChanceCost(stateOrLevel: GameState | number): number {
  const lvl = typeof stateOrLevel === 'number' ? stateOrLevel : (stateOrLevel.prestige.luckyChanceLevel || 0);
  return 1000 * (lvl + 1);
}

import { relicStarterRootsBonus } from './relics';

export function starterRootsCount(state: GameState): number {
  return (state.prestige.starterLevel || 0) * 10 + relicStarterRootsBonus(state);
}

export function calcPrestigeSeeds(state: GameState): number {
  if (!Number.isFinite(state.runEarned) || state.runEarned <= 0) return 0;
  const base = Math.floor(Math.cbrt(state.runEarned / SEED_DIVIDER));
  const bonus = 1 + (state.prestige.goldenLevel || 0) * 0.05;
  const biomeBonus = state.activeBiome === 'sunken_ruins' ? 1.20 : 1.0;
  const result = Math.floor(base * bonus * biomeBonus);
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
