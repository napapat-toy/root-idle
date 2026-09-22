import { GameState, TrialDef, TrialId } from '@/types/game';
import { relicTranscendenceEssenceBonus } from './relics';

export const TRANSCENDENCE_REQUIRE_YGGDRASIL = 100;
export const TRANSCENDENCE_REQUIRE_PRESTIGES = 3;
export const ESSENCE_DIVIDER = 1e28; // 10 Octillion (1e28)

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
export const SEED_TRANSMUTE_COST = 50000000000; // 50 Billion seeds per 1 Astral Petal
export const ESSENCE_TRANSMUTE_COST = 10000; // 10,000 Gaia Essences per 1 Astral Petal

export function isInTrial(state: GameState): boolean {
  return !!state.transcendence?.activeTrial && state.transcendence.activeTrial !== 'none';
}

export const TRIAL_DEFS: TrialDef[] = [
  {
    id: 'arid_drought',
    name: 'ดินแล้งกันดาร',
    enName: 'Arid Drought',
    desc: 'สภาพอากาศแห้งแล้งรุนแรง สารอาหารและเรตผิวดินลดลง 75%',
    enDesc: 'Severe arid climate reducing ambient surface moisture and baseline rate by 75%',
    icon: '🏜️',
    restrictionDesc: 'เรทการผลิตสารอาหารพื้นฐานลดลง 75% (โบนัสภายนอกทั้งหมดถูกระงับ)',
    enRestrictionDesc: 'Base nutrient production rate reduced by 75% (All external meta-bonuses suppressed)',
    rewardDesc: 'ปลดล็อกสกิน [🏜️ ซาฮาราโบราณ] & เรทผลผลิตถาวร +35% พร้อมรับทันที +150 🌍',
    enRewardDesc: 'Unlocks [🏜️ Ancient Drought] Skin, +35% Global Production & +150 🌍 Gaia Essences',
    targetYggdrasil: 10,
    skinReward: 'drought',
    essenceReward: 150,
  },
  {
    id: 'basalt_strata',
    name: 'ชั้นหินอัคนีทึบ',
    enName: 'Basalt Strata',
    desc: 'ชั้นหินภูเขาไฟแข็งแกร่ง รากทุกชนิดและอัปเกรดมีราคาแพงขึ้น 2.5 เท่า',
    enDesc: 'Dense volcanic basalt increasing costs of all roots and upgrades by 2.5x',
    icon: '🌋',
    restrictionDesc: 'ราคารากและอัปเกรดทุกชนิดแพงขึ้น 2.5 เท่า (โบนัสภายนอกทั้งหมดถูกระงับ)',
    enRestrictionDesc: 'Cost of all roots and upgrades increased by 2.5x (All external meta-bonuses suppressed)',
    rewardDesc: 'ปลดล็อกสกิน [🌋 ออบซิเดียนเพลิง] & โบนัส Synergy +50% พร้อมรับทันที +150 🌍',
    enRewardDesc: 'Unlocks [🌋 Obsidian Magma] Skin, +50% Synergy Bonus & +150 🌍 Gaia Essences',
    targetYggdrasil: 10,
    skinReward: 'obsidian',
    essenceReward: 150,
  },
  {
    id: 'void_anomaly',
    name: 'รอยแยกสุญญะ',
    enName: 'Void Anomaly',
    desc: 'สนามพลังมิติสุญญะรบกวน ระบบบอทอัตโนมัติ (Auto-Root/Auto-Reset) ถูกปิดกั้นทั้งหมด',
    enDesc: 'Zero-point dimensional disturbance completely disabling all Automation modules',
    icon: '🌌',
    restrictionDesc: 'ระบบบอททั้งหมดถูกระงับ (ต้องกดมือล้วน) และโบนัสภายนอกถูกระงับ',
    enRestrictionDesc: 'All Automation bots suppressed (pure manual play) and external meta-bonuses suppressed',
    rewardDesc: 'ปลดล็อกธีม UI [🌌 จอมราชันย์แห่งสุญญะ] & โบนัสสะท้อนราก +50% พร้อมรับทันที +200 🌍',
    enRewardDesc: 'Unlocks [🌌 Void Sovereign] UI Theme, +50% Echo Multiplier & +200 🌍 Gaia Essences',
    targetYggdrasil: 25,
    themeReward: 'void_sovereign',
    essenceReward: 200,
  },
  {
    id: 'null_cycle',
    name: 'วงจรศูนย์',
    enName: 'Null Cycle',
    desc: 'วัฏจักรแห่งความว่างเปล่า โบนัสอัตราการผลิตจากคะแนนรีเซ็ต (Prestige Rate Bonus) ไม่ทำงานโดยสิ้นเชิง',
    enDesc: 'Cycle of the Void nullifying all production rate bonuses gained from Prestige',
    icon: '🌑',
    restrictionDesc: 'โบนัสเรทจาก Prestige กลายเป็น 0% (ไม่มีตัวช่วยใดๆ ทั้งสิ้น)',
    enRestrictionDesc: 'Prestige rate bonus is completely nullified (0% and no external helpers)',
    rewardDesc: 'ปลดล็อกสกิน [🌑 คราสทมิฬ] & ธีม [🌑 สุริยุปราคาใต้พิภพ] พร้อมรับเมล็ด Prestige +50% และ Gaia Essence +50% และ +300 🌍',
    enRewardDesc: 'Unlocks [🌑 Abyssal Eclipse] Skin & UI Theme, +50% Prestige Seeds, +50% Gaia Essence & +300 🌍',
    targetYggdrasil: 5,
    skinReward: 'eclipse',
    themeReward: 'abyssal_eclipse',
    essenceReward: 300,
  },
  {
    id: 'permafrost',
    name: 'เหมันต์เยือกแข็ง',
    enName: 'Permafrost',
    desc: 'ความหนาวเย็นยะเยือกใต้พิภพ แรนด้อมอีเวนต์เกิดช้าลง 60% และระยะเวลาบัฟนำโชคสั้นลงครึ่งหนึ่ง',
    enDesc: 'Subterranean freezing cold increasing random event cooldowns by 60% and halving lucky buff durations',
    icon: '❄️',
    restrictionDesc: 'คูลดาวน์อีเวนต์นานขึ้น 60% ระยะเวลาบัฟลดลง 50% และโบนัสภายนอกถูกระงับ',
    enRestrictionDesc: 'Random event cooldown +60%, buff duration -50% and external meta-bonuses suppressed',
    rewardDesc: 'ปลดล็อกสกิน [❄️ เหมันต์นิรันดร์] & ธีม [❄️ ทุ่งทุนดราเยือกแข็ง] ผลผลิตออฟไลน์ +50% & โอกาสโชคดี +0.2% และ +200 🌍',
    enRewardDesc: 'Unlocks [❄️ Permafrost] Skin & UI Theme, +50% Offline Efficiency, +0.2% Lucky Chance & +200 🌍',
    targetYggdrasil: 20,
    skinReward: 'permafrost',
    themeReward: 'boreal_tundra',
    essenceReward: 200,
  },
  {
    id: 'geomagnetic_storm',
    name: 'พายุสนามแม่เหล็ก',
    enName: 'Geomagnetic Storm',
    desc: 'พายุแม่เหล็กไฟฟ้ารบกวนสนามพลัง ห้องก้องกังวาน (Echo Chamber) ไม่มอบโบนัสสะท้อนผลผลิต',
    enDesc: 'Electromagnetic storm disturbing resonant frequencies, suppressing Echo Chamber passive bonus',
    icon: '⚡',
    restrictionDesc: 'ผลการสะท้อนของ Echo Chamber ไม่ทำงาน (โบนัส 0%) และโบนัสภายนอกถูกระงับ',
    enRestrictionDesc: 'Echo Chamber passive resonance provides 0% production bonus and external meta-bonuses suppressed',
    rewardDesc: 'ปลดล็อกสกิน [⚡ พายุสายฟ้าฟาด] & ธีม [⚡ สนามแม่เหล็กไฟฟ้า] รากลึกระดับ Tier 5+ ผลิตแรงขึ้น ×1.50 (+50%) และ +250 🌍',
    enRewardDesc: 'Unlocks [⚡ Fulminant Tempest] Skin & UI Theme, Tier 5+ Deep Roots rate ×1.50 (+50%) & +250 🌍',
    targetYggdrasil: 15,
    skinReward: 'fulminant',
    themeReward: 'electromagnetic',
    essenceReward: 250,
  },
];

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
  const essences = Math.floor((50 + Math.pow(bonusRoots, 1.12) * 0.8) * meteoriteMult * blessingMult * trialBonus);
  return Math.max(1, essences);
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
  if (isInTrial(state)) return 1.0;
  let mult = 1.0;
  if (isTrialCompleted(state, 'arid_drought')) mult *= 1.35;
  return mult;
}

export function trialSynergyBonusMultiplier(state: GameState): number {
  if (isInTrial(state)) return 1.0;
  let mult = 1.0;
  if (isTrialCompleted(state, 'basalt_strata')) mult *= 1.50;
  return mult;
}

export function trialEchoBonusMultiplier(state: GameState): number {
  if (isInTrial(state)) return 1.0;
  let mult = 1.0;
  if (isTrialCompleted(state, 'void_anomaly')) mult *= 1.50;
  return mult;
}

const DEEP_ROOT_IDS = new Set([
  'vine', 'bionode', 'eternal', 'nexus', 'crystal', 'heart', 'seed', 'throne',
  'magma', 'aether', 'void', 'astral', 'chronos', 'singularity', 'genesis', 'yggdrasil'
]);

export function trialDeepRootsBonusMultiplier(state: GameState, moduleId: string): number {
  if (!DEEP_ROOT_IDS.has(moduleId) || isInTrial(state)) return 1.0;
  return isTrialCompleted(state, 'geomagnetic_storm') ? 1.50 : 1.0;
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
