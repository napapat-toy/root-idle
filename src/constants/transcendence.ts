import { GameState, TrialDef, TrialId } from '@/types/game';

export const TRANSCENDENCE_REQUIRE_YGGDRASIL = 100;
export const TRANSCENDENCE_REQUIRE_PRESTIGES = 5;
export const ESSENCE_DIVIDER = 1e28; // 10 Octillion (1e28)

export const PRIMORDIAL_VIGOR_MAX_LEVEL = 20;
export const SOIL_MEMORY_MAX_LEVEL = 5;
export const GAIA_TOUCH_MAX_LEVEL = 10;
export const AUTO_MANAGER_COST = 25;

export const TRIAL_DEFS: TrialDef[] = [
  {
    id: 'arid_drought',
    name: 'ดินแล้งกันดาร',
    enName: 'Arid Drought',
    desc: 'สภาพอากาศแห้งแล้งรุนแรง สารอาหารและเรตผิวดินลดลง 75%',
    enDesc: 'Severe arid climate reducing ambient surface moisture and baseline rate by 75%',
    icon: '🏜️',
    restrictionDesc: 'เรทการผลิตสารอาหารพื้นฐานลดลง 75%',
    enRestrictionDesc: 'Base nutrient production rate reduced by 75%',
    rewardDesc: 'ปลดล็อกสกิน [🏜️ ซาฮาราโบราณ] & เรทผลผลิตถาวร +15%',
    enRewardDesc: 'Unlocks [🏜️ Ancient Drought] Skin & +15% Global Production',
    targetYggdrasil: 25,
    skinReward: 'drought',
  },
  {
    id: 'basalt_strata',
    name: 'ชั้นหินอัคนีทึบ',
    enName: 'Basalt Strata',
    desc: 'ชั้นหินภูเขาไฟแข็งแกร่ง รากทุกชนิดและอัปเกรดมีราคาแพงขึ้น 2.5 เท่า',
    enDesc: 'Dense volcanic basalt increasing costs of all roots and upgrades by 2.5x',
    icon: '🌋',
    restrictionDesc: 'ราคารากและอัปเกรดทุกชนิดแพงขึ้น 2.5 เท่า',
    enRestrictionDesc: 'Cost of all roots and upgrades increased by 2.5x',
    rewardDesc: 'ปลดล็อกสกิน [🌋 ออบซิเดียนเพลิง] & โบนัส Synergy +20%',
    enRewardDesc: 'Unlocks [🌋 Obsidian Magma] Skin & +20% Synergy Bonus',
    targetYggdrasil: 25,
    skinReward: 'obsidian',
  },
  {
    id: 'void_anomaly',
    name: 'รอยแยกสุญญะ',
    enName: 'Void Anomaly',
    desc: 'สนามพลังมิติสุญญะรบกวน ระบบบอทอัตโนมัติ (Auto-Root/Auto-Reset) ถูกปิดกั้นทั้งหมด',
    enDesc: 'Zero-point dimensional disturbance completely disabling all Automation modules',
    icon: '🌌',
    restrictionDesc: 'ระบบ Auto-Root, Auto-Event, Auto-Reset ใช้งานไม่ได้',
    enRestrictionDesc: 'Auto-Root, Auto-Event, and Auto-Reset are completely disabled',
    rewardDesc: 'ปลดล็อกธีม UI [🌌 จอมราชันย์แห่งสุญญะ] & โบนัสสะท้อนราก +25%',
    enRewardDesc: 'Unlocks [🌌 Void Sovereign] UI Theme & +25% Echo Multiplier',
    targetYggdrasil: 25,
    themeReward: 'void_sovereign',
  },
];

export function isTranscendenceUnlocked(state: GameState): boolean {
  const yggOwned = state.owned['yggdrasil'] || 0;
  const prestiges = state.stats?.prestigeCount || 0;
  const hasTranscended = (state.transcendence?.count || 0) > 0;
  return hasTranscended || (yggOwned >= TRANSCENDENCE_REQUIRE_YGGDRASIL && prestiges >= TRANSCENDENCE_REQUIRE_PRESTIGES);
}

export function calcTranscendenceEssences(state: GameState): number {
  if (!Number.isFinite(state.runEarned) || state.runEarned < ESSENCE_DIVIDER) return 0;
  const ratio = state.runEarned / ESSENCE_DIVIDER;
  const base = Math.floor(Math.pow(ratio, 0.15) * 5);
  return Number.isFinite(base) ? Math.max(1, base) : 1000;
}

export function primordialVigorCost(level: number): number {
  return 5 * (level + 1);
}

export function primordialVigorMult(state: GameState): number {
  const lvl = state.transcendence?.primordialVigorLevel || 0;
  return 1 + lvl * 0.25; // +25% base rate per level
}

export function soilMemoryCost(level: number): number {
  return 10 * (level + 1);
}

export function soilMemoryRetainPct(state: GameState): number {
  const lvl = state.transcendence?.soilMemoryLevel || 0;
  return Math.min(0.50, lvl * 0.10); // 10% per level (up to 50%)
}

export function gaiaTouchCost(level: number): number {
  return 8 * (level + 1);
}

export function gaiaTouchBonusMult(state: GameState): number {
  const lvl = state.transcendence?.gaiaTouchLevel || 0;
  return 1 + lvl * 0.30; // +30% lucky magnitude per level
}

export function trialRateMultiplier(state: GameState): number {
  const active = state.transcendence?.activeTrial;
  if (active === 'arid_drought') return 0.25; // 75% reduction
  return 1.0;
}

export function trialCostMultiplier(state: GameState): number {
  const active = state.transcendence?.activeTrial;
  if (active === 'basalt_strata') return 2.5; // 2.5x cost
  return 1.0;
}

export function isTrialCompleted(state: GameState, trialId: TrialId): boolean {
  return !!state.transcendence?.completedTrials?.[trialId];
}

export function trialCompletionBonusMultiplier(state: GameState): number {
  let mult = 1.0;
  if (isTrialCompleted(state, 'arid_drought')) mult *= 1.15;
  return mult;
}

export function trialSynergyBonusMultiplier(state: GameState): number {
  let mult = 1.0;
  if (isTrialCompleted(state, 'basalt_strata')) mult *= 1.20;
  return mult;
}

export function trialEchoBonusMultiplier(state: GameState): number {
  let mult = 1.0;
  if (isTrialCompleted(state, 'void_anomaly')) mult *= 1.25;
  return mult;
}
