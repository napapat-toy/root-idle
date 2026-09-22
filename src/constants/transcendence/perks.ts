import { GameState } from '@/types/game';
import { isInTrial } from './trials';

export const PRIMORDIAL_VIGOR_MAX_LEVEL = 20;
export const SOIL_MEMORY_MAX_LEVEL = 10;
export const GAIA_TOUCH_MAX_LEVEL = 10;
export const AUTO_MANAGER_COST = 25;

export const ECHO_RESONANCE_MAX_LEVEL = 5;
export const GAIA_CLAIRVOYANCE_MAX_LEVEL = 10;
export const PRIMORDIAL_SEEDLING_MAX_LEVEL = 5;
export const DEEP_MEDITATION_MAX_LEVEL = 5;
export const GAIA_BLESSING_MAX_LEVEL = 500;
export const HYPERDRIVE_COST = 100000;
export const AURORA_BLOOM_COST = 100000;

export function gaiaBlessingCost(level: number): number {
  return Math.min(10000, Math.floor(8 * Math.pow(level + 1, 1.15)));
}

export function gaiaBlessingEssenceMultiplier(state: GameState): number {
  const lvl = state.transcendence?.gaiaBlessingLevel || 0;
  return 1 + Math.min(GAIA_BLESSING_MAX_LEVEL, lvl) * 0.05; // +5% per level, max +2,500%
}

export function gaiaBlessingMaxed(state: GameState): boolean {
  return (state.transcendence?.gaiaBlessingLevel || 0) >= GAIA_BLESSING_MAX_LEVEL;
}

export function primordialVigorCost(level: number): number {
  return 5 * (level + 1);
}

export function primordialVigorMult(state: GameState): number {
  if (isInTrial(state)) return 1.0;
  const lvl = state.transcendence?.primordialVigorLevel || 0;
  return 1 + lvl * 0.25; // +25% base rate per level
}

export function soilMemoryCost(level: number): number {
  return 10 * (level + 1);
}

export function soilMemoryRetainPct(state: GameState): number {
  if (isInTrial(state)) return 0;
  const lvl = state.transcendence?.soilMemoryLevel || 0;
  return Math.min(1.0, lvl * 0.10); // 10% per level (up to 100%)
}

export function gaiaTouchCost(level: number): number {
  return 8 * (level + 1);
}

export function gaiaTouchBonusMult(state: GameState): number {
  if (isInTrial(state)) return 1.0;
  const lvl = state.transcendence?.gaiaTouchLevel || 0;
  return 1 + lvl * 0.30; // +30% lucky magnitude per level
}

export function echoResonanceCost(level: number): number {
  return 12 * (level + 1);
}

export function gaiaClairvoyanceCost(level: number): number {
  return 15 * (level + 1);
}

export function gaiaClairvoyanceBonus(state: GameState): number {
  if (isInTrial(state)) return 0;
  const lvl = state.transcendence?.gaiaClairvoyanceLevel || 0;
  return lvl * 0.001; // +0.1% per level (up to +1.0%)
}

export function primordialSeedlingCost(level: number): number {
  return 10 * (level + 1);
}

export function fineRootBaseRate(state: GameState): number {
  if (isInTrial(state)) return 0.60;
  const lvl = state.transcendence?.primordialSeedlingLevel || 0;
  return 0.60 + lvl * 0.28; // 0.60 -> 2.00/s at Lv.5 (+233%!)
}

export function deepMeditationCost(level: number): number {
  return 15 * (level + 1);
}

export function deepMeditationIntervalSeconds(level: number): number {
  // Lv.1: 600s (10m), Lv.2: 525s (8.75m), Lv.3: 450s (7.5m), Lv.4: 375s (6.25m), Lv.5: 300s (5m)
  const clamped = Math.max(1, Math.min(DEEP_MEDITATION_MAX_LEVEL, level));
  return 600 - (clamped - 1) * 75;
}

export function deepMeditationMultiplier(state: GameState): number {
  if (isInTrial(state)) return 1.0;
  const lvl = state.transcendence?.deepMeditationLevel || 0;
  if (lvl <= 0) return 1.0;
  const maxMult = 1.0 + lvl * 0.40; // Lv.1 = 1.4x, Lv.2 = 1.8x, Lv.3 = 2.2x, Lv.4 = 2.6x, Lv.5 = 3.0x max!
  const interval = deepMeditationIntervalSeconds(lvl);
  const runSeconds = state.runPlayTimeSeconds || 0;
  // Multiplicative ramp: smoothly ramps +0.25x per interval up to maxMult
  const rawMult = 1.0 + (runSeconds / interval) * 0.25;
  return Math.min(maxMult, Math.round(rawMult * 100) / 100);
}

export type GaiaPerkId =
  | 'vigor'
  | 'soil'
  | 'blessing'
  | 'touch'
  | 'echo_res'
  | 'clairvoyance'
  | 'seedling'
  | 'meditation'
  | 'hyperdrive'
  | 'aurora';

export interface GaiaPerkDef {
  id: GaiaPerkId;
  icon: string;
  nameKey: string;
  descKey: string;
  type: 'level' | 'toggle' | 'unlock';
  maxLevel?: number;
  cost: number | ((level: number) => number);
  getLevel?: (state: GameState) => number;
  getEffectText?: (state: GameState, isEn: boolean) => string;
  isUnlocked?: (state: GameState) => boolean;
  isToggledOn?: (state: GameState) => boolean;
}

export const GAIA_PERK_DEFS: GaiaPerkDef[] = [
  {
    id: 'vigor',
    icon: '🌱',
    nameKey: 'transcendPerk1Name',
    descKey: 'transcendPerk1Desc',
    type: 'level',
    maxLevel: PRIMORDIAL_VIGOR_MAX_LEVEL,
    cost: primordialVigorCost,
    getLevel: s => s.transcendence?.primordialVigorLevel || 0,
    getEffectText: (s, isEn) => {
      const lvl = s.transcendence?.primordialVigorLevel || 0;
      return isEn ? `Current Effect: +${(lvl * 25).toFixed(0)}% Base Rate` : `ผลปัจจุบัน: เรทพื้นฐาน +${(lvl * 25).toFixed(0)}%`;
    },
  },
  {
    id: 'soil',
    icon: '📜',
    nameKey: 'transcendPerk2Name',
    descKey: 'transcendPerk2Desc',
    type: 'level',
    maxLevel: SOIL_MEMORY_MAX_LEVEL,
    cost: soilMemoryCost,
    getLevel: s => s.transcendence?.soilMemoryLevel || 0,
    getEffectText: (s, isEn) => {
      const retain = (soilMemoryRetainPct(s) * 100).toFixed(0);
      return isEn ? `Current Effect: Retain ${retain}% Echoes` : `ผลปัจจุบัน: คงสะท้อนราก ${retain}%`;
    },
  },
  {
    id: 'blessing',
    icon: '🌍',
    nameKey: 'transcendPerk3Name',
    descKey: 'transcendPerk3Desc',
    type: 'level',
    maxLevel: GAIA_BLESSING_MAX_LEVEL,
    cost: gaiaBlessingCost,
    getLevel: s => s.transcendence?.gaiaBlessingLevel || 0,
    getEffectText: (s, isEn) => {
      const lvl = s.transcendence?.gaiaBlessingLevel || 0;
      const bonusPct = lvl * 5;
      return isEn ? `+${bonusPct}% Gaia Essences earned` : `+${bonusPct}% ละอองชีวิตที่ได้รับ`;
    },
  },
  {
    id: 'touch',
    icon: '✨',
    nameKey: 'transcendPerk4Name',
    descKey: 'transcendPerk4Desc',
    type: 'level',
    maxLevel: GAIA_TOUCH_MAX_LEVEL,
    cost: gaiaTouchCost,
    getLevel: s => s.transcendence?.gaiaTouchLevel || 0,
    getEffectText: (s, isEn) => {
      const mult = gaiaTouchBonusMult(s).toFixed(2);
      return isEn ? `Current Effect: ×${mult} Lucky Magnitude` : `ผลปัจจุบัน: แจ็กพอตโชคดี ×${mult} เท่า`;
    },
  },
  {
    id: 'echo_res',
    icon: '🌀',
    nameKey: 'transcendPerk5Name',
    descKey: 'transcendPerk5Desc',
    type: 'level',
    maxLevel: ECHO_RESONANCE_MAX_LEVEL,
    cost: echoResonanceCost,
    getLevel: s => s.transcendence?.echoResonanceLevel || 0,
    getEffectText: (s, isEn) => {
      const cap = 5 + (s.transcendence?.echoResonanceLevel || 0);
      return isEn ? `Current Effect: Max Echo Cap Lv.${cap}` : `ผลปัจจุบัน: เพดานสะท้อนรากสูงสุด Lv.${cap}`;
    },
  },
  {
    id: 'clairvoyance',
    icon: '👁️',
    nameKey: 'transcendPerk6Name',
    descKey: 'transcendPerk6Desc',
    type: 'level',
    maxLevel: GAIA_CLAIRVOYANCE_MAX_LEVEL,
    cost: gaiaClairvoyanceCost,
    getLevel: s => s.transcendence?.gaiaClairvoyanceLevel || 0,
    getEffectText: (s, isEn) => {
      const bonus = ((s.transcendence?.gaiaClairvoyanceLevel || 0) * 0.1).toFixed(1);
      return isEn ? `Current Effect: +${bonus}% Lucky Chance` : `ผลปัจจุบัน: +${bonus}% โอกาสโชคดี`;
    },
  },
  {
    id: 'seedling',
    icon: '🌱',
    nameKey: 'transcendPerk7Name',
    descKey: 'transcendPerk7Desc',
    type: 'level',
    maxLevel: PRIMORDIAL_SEEDLING_MAX_LEVEL,
    cost: primordialSeedlingCost,
    getLevel: s => s.transcendence?.primordialSeedlingLevel || 0,
    getEffectText: (s, isEn) => {
      const rate = (0.60 + (s.transcendence?.primordialSeedlingLevel || 0) * 0.28).toFixed(2);
      return isEn ? `Current Effect: Initial Base Rate ${rate}/s` : `ผลปัจจุบัน: เรทตั้งต้น ${rate}/วิ`;
    },
  },
  {
    id: 'meditation',
    icon: '🧘',
    nameKey: 'transcendPerk8Name',
    descKey: 'transcendPerk8Desc',
    type: 'level',
    maxLevel: DEEP_MEDITATION_MAX_LEVEL,
    cost: deepMeditationCost,
    getLevel: s => s.transcendence?.deepMeditationLevel || 0,
    getEffectText: (s, isEn) => {
      const cap = (1.0 + (s.transcendence?.deepMeditationLevel || 0) * 0.40).toFixed(1);
      return isEn ? `Current Max Cap: ×${cap}` : `ผลปัจจุบัน: เพดานสูงสุด ×${cap}`;
    },
  },
  {
    id: 'hyperdrive',
    icon: '⚡',
    nameKey: 'transcendPerk9Name',
    descKey: 'transcendPerk9Desc',
    type: 'unlock',
    cost: HYPERDRIVE_COST,
    isUnlocked: s => !!s.transcendence?.hyperdriveUnlocked,
  },
  {
    id: 'aurora',
    icon: '🌸',
    nameKey: 'transcendPerk10Name',
    descKey: 'transcendPerk10Desc',
    type: 'unlock',
    cost: AURORA_BLOOM_COST,
    isUnlocked: s => !!s.transcendence?.auroraBloomUnlocked,
  },
];
