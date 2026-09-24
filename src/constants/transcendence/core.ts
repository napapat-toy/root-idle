import { GameState } from '@/types/game';
import { relicTranscendenceEssenceBonus } from '../relics';
import { gaiaBlessingEssenceMultiplier } from './perks';
import { isTrialCompleted } from './trials';
import { pactEssenceBonusMultiplier } from './pacts';

export const TRANSCENDENCE_REQUIRE_YGGDRASIL = 100;
export const TRANSCENDENCE_REQUIRE_PRESTIGES = 3;
export const ESSENCE_DIVIDER = 1e28; // 10 Octillion (1e28)

export const SEED_TRANSMUTE_COST = 50000000000; // 50 Billion seeds per 1 Astral Petal
export const ESSENCE_TRANSMUTE_COST = 10000; // 10,000 Gaia Essences per 1 Astral Petal

export function isTranscendenceUnlocked(state: GameState): boolean {
  const yggOwned = state.owned['yggdrasil'] || 0;
  const prestiges = state.stats?.prestigeCount || 0;
  const hasEverUnlocked = !!state.transcendence?.everUnlocked;
  const hasTranscended = (state.transcendence?.count || 0) > 0;
  const hasEssences =
    (state.transcendence?.totalGaiaEssencesLifetime || 0) > 0 ||
    (state.transcendence?.gaiaEssences || 0) > 0;
  const hasPerks =
    (state.transcendence?.primordialVigorLevel || 0) > 0 ||
    (state.transcendence?.soilMemoryLevel || 0) > 0 ||
    (state.transcendence?.gaiaTouchLevel || 0) > 0 ||
    (state.transcendence?.gaiaBlessingLevel || 0) > 0 ||
    !!state.transcendence?.autoManagerUnlocked;
  const inTrial = !!state.transcendence?.activeTrial && state.transcendence.activeTrial !== 'none';
  const hasCompletedTrials = Object.keys(state.transcendence?.completedTrials || {}).length > 0;

  return (
    hasEverUnlocked ||
    hasTranscended ||
    hasEssences ||
    hasPerks ||
    inTrial ||
    hasCompletedTrials ||
    (yggOwned >= TRANSCENDENCE_REQUIRE_YGGDRASIL && prestiges >= TRANSCENDENCE_REQUIRE_PRESTIGES)
  );
}

export function canTranscend(state: GameState): boolean {
  const yggOwned = state.owned['yggdrasil'] || 0;
  return yggOwned >= TRANSCENDENCE_REQUIRE_YGGDRASIL;
}

export function hyperdriveUnlocked(state: GameState): boolean {
  return !!state.transcendence?.hyperdriveUnlocked;
}

export function auroraBloomUnlocked(state: GameState): boolean {
  return !!state.transcendence?.auroraBloomUnlocked;
}

export function calcTranscendenceEssences(state: GameState): number {
  const yggOwned = state.owned['yggdrasil'] || 0;
  if (yggOwned < TRANSCENDENCE_REQUIRE_YGGDRASIL) return 0;
  
  // Base 50 essences for reaching 100 Yggdrasil roots
  // Plus rewarding progressive scaling for deeper runs (reaches 300-600+ Essences at 300-400 roots)
  const bonusRoots = yggOwned - TRANSCENDENCE_REQUIRE_YGGDRASIL;
  const meteoriteMult = relicTranscendenceEssenceBonus(state);
  const blessingMult = gaiaBlessingEssenceMultiplier(state);
  const trialBonus = isTrialCompleted(state, 'null_cycle') ? 1.50 : 1.0;
  const pactBonus = pactEssenceBonusMultiplier(state);
  const essences = Math.floor((50 + Math.pow(bonusRoots, 1.12) * 0.8) * meteoriteMult * blessingMult * trialBonus * pactBonus);
  return Math.max(1, essences);
}
