import { GameState, RelicDef } from '@/types/game';
import { RELIC_DEFS } from './defs';

export function relicCount(state: GameState, relicId: string): number {
  const val = state.relics?.[relicId];
  if (typeof val === 'number') return val > 0 ? 1 : 0;
  return val ? 1 : 0;
}

export function hasRelic(state: GameState, relicId: string): boolean {
  return relicCount(state, relicId) > 0;
}

export function relicMaxed(state: GameState, relicId: string): boolean {
  return hasRelic(state, relicId);
}

export function totalRelicFragmentsCount(state: GameState): number {
  return relicsCount(state);
}

export function relicsCount(state: GameState): number {
  if (!state.relics) return 0;
  return RELIC_DEFS.filter(r => hasRelic(state, r.id)).length;
}

export function isMasterRelicActive(state: GameState): boolean {
  return hasRelic(state, 'gaiacore');
}

export function relicMult(state: GameState, relicId: string): number {
  if (!hasRelic(state, relicId)) return 0;
  return isMasterRelicActive(state) && relicId !== 'gaiacore' ? 2 : 1;
}

function isStateInTrial(state: GameState): boolean {
  return !!state.transcendence?.activeTrial && state.transcendence.activeTrial !== 'none';
}

/**
 * Magmatic Corestone Cycle Resonance Stack:
 * Stacks permanent bonuses to Synergy, Echoes, and Eternal Seeds based on Prestige (+1%) and Transcendence (+3%).
 * Hard Safety Cap: +100% (+200% with Heart of Gaia).
 */
export function relicCycleResonanceStack(state: GameState): number {
  if (isStateInTrial(state)) return 0;
  if (!hasRelic(state, 'magmastone')) return 0;
  const pCount = state.stats?.prestigeCount || 0;
  const tCount = state.transcendence?.count || 0;
  const raw = pCount * 1 + tCount * 3;
  const mult = relicMult(state, 'magmastone'); // 1 or 2 with Gaia
  const baseCap = 100;
  const maxCap = isMasterRelicActive(state) ? baseCap * 2 : baseCap;
  return Math.min(maxCap, raw * mult);
}

/**
 * Amber: +50% Global Rate (×1.50). With Gaia: +100% (×2.00).
 */
export function relicRateBonusMultiplier(state: GameState): number {
  if (isStateInTrial(state)) return 1.0;
  let mult = 1;
  const amberMult = relicMult(state, 'amber');
  if (amberMult > 0) {
    mult *= (1 + 0.50 * amberMult);
  }
  return mult;
}

const DEEP_ROOT_IDS = new Set([
  'vine', 'bionode', 'eternal', 'nexus', 'crystal', 'heart', 'seed', 'throne',
  'magma', 'aether', 'void', 'astral', 'chronos', 'singularity', 'genesis', 'yggdrasil'
]);

/**
 * Aquifer: Deep roots (Tier 5 Vine and beyond) rate ×3.0 (with Gaia: ×6.0).
 */
export function relicDeepRootsBonus(state: GameState, moduleId: string): number {
  if (isStateInTrial(state) || !DEEP_ROOT_IDS.has(moduleId)) return 1;
  const aquiferMult = relicMult(state, 'aquifer');
  if (aquiferMult === 0) return 1;
  return aquiferMult === 2 ? 6.0 : 3.0;
}

/**
 * Geode: Event nutrients ×3.0 (with Gaia: ×6.0).
 */
export function relicEventNutrientBonus(state: GameState): number {
  if (isStateInTrial(state)) return 1;
  const m = relicMult(state, 'geode');
  if (m === 0) return 1;
  return m === 2 ? 6.0 : 3.0;
}

/**
 * Geode: Event cooldown -35% (0.65x). With Gaia: -50% (0.50x).
 */
export function relicEventCooldownMultiplier(state: GameState): number {
  if (isStateInTrial(state)) return 1.0;
  const m = relicMult(state, 'geode');
  if (m === 0) return 1.0;
  return m === 2 ? 0.50 : 0.65;
}

/**
 * Chronolith: +12h offline cap & Time Warp ×2.0 (with Gaia: +24h & ×3.0).
 */
export function relicOfflineBonus(state: GameState): { extraHours: number; effMultiplier: number; warpMultiplier: number } {
  if (isStateInTrial(state)) return { extraHours: 0, effMultiplier: 1, warpMultiplier: 1 };
  const m = relicMult(state, 'chronolith');
  if (m === 0) return { extraHours: 0, effMultiplier: 1, warpMultiplier: 1 };
  return {
    extraHours: 12 * m,
    effMultiplier: 1 + 0.5 * m,
    warpMultiplier: m === 2 ? 3.0 : 2.0,
  };
}

/**
 * Mycocore: Root Synergy yields +0.25%/unit (×3 power!) scaled by Cycle Resonance.
 */
export function relicSynergyBonusPerUnit(state: GameState): number {
  if (isStateInTrial(state)) return 0.08;
  const m = relicMult(state, 'mycocore');
  const baseBonus = m > 0 ? (m === 2 ? 0.50 : 0.25) : 0.08;
  const cycleStack = relicCycleResonanceStack(state);
  return Math.round(baseBonus * (1 + cycleStack * 0.01) * 1000) / 1000;
}

/**
 * Mycocore: Reduces synergy unlock requirement from 50 to 25 roots.
 */
export function relicSynergyUnlockRequiredCount(state: GameState): number {
  if (isStateInTrial(state)) return 50;
  return hasRelic(state, 'mycocore') ? 25 : 50;
}

/**
 * Crown: Root Echoes grant +1.5% multiplier per echo level scaled by Cycle Resonance.
 */
export function relicEchoBonusPerEcho(state: GameState): number {
  if (isStateInTrial(state)) return 0.010;
  const m = relicMult(state, 'crown');
  const baseEcho = m > 0 ? (m === 2 ? 0.020 : 0.015) : 0.010;
  const cycleStack = relicCycleResonanceStack(state);
  return Math.round(baseEcho * (1 + cycleStack * 0.0025) * 10000) / 10000;
}

/**
 * Meteorite: +50% Gaia Essences earned upon Transcendence (with Gaia: +100%).
 */
export function relicTranscendenceEssenceBonus(state: GameState): number {
  if (isStateInTrial(state)) return 1.0;
  const m = relicMult(state, 'meteorite');
  if (m === 0) return 1.0;
  return m === 2 ? 2.0 : 1.50;
}

/**
 * Ruin Tablet: 35% chance to sprout free bonus root (+15% twin sprout).
 * With Gaia: 50% chance (+25% twin sprout).
 */
export function relicBonusSproutChance(state: GameState): number {
  if (isStateInTrial(state)) return 0;
  const m = relicMult(state, 'ruintablet');
  if (m === 0) return 0;
  return m === 2 ? 0.50 : 0.35;
}

export function relicBonusTwinSproutChance(state: GameState): number {
  if (isStateInTrial(state)) return 0;
  const m = relicMult(state, 'ruintablet');
  if (m === 0) return 0;
  return m === 2 ? 0.25 : 0.15;
}

export function biomeActiveRateMultiplier(state: GameState): number {
  if (isStateInTrial(state)) return 1.0;
  const biome = state.activeBiome || 'topsoil';
  if (biome === 'gaia_sanctum') return 1.30;
  return 1.0;
}

export function pickWeightedUnownedRelic(unownedRelics: RelicDef[]): RelicDef | null {
  if (unownedRelics.length === 0) return null;
  const totalWeight = unownedRelics.reduce((sum, r) => sum + r.dropWeight, 0);
  let random = Math.random() * totalWeight;

  for (const relic of unownedRelics) {
    if (random < relic.dropWeight) {
      return relic;
    }
    random -= relic.dropWeight;
  }
  return unownedRelics[0];
}

export function unownedRelicList(state: GameState): RelicDef[] {
  return RELIC_DEFS.filter(r => !hasRelic(state, r.id));
}
