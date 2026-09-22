import { GameState, TrialDef, TrialId } from '@/types/game';

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
