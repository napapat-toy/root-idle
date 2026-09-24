import { GameState, TrialDef, TrialId } from '@/types/game';

export function isInTrial(state: GameState): boolean {
  return !!state.transcendence?.activeTrial && state.transcendence.activeTrial !== 'none';
}

export const TRIAL_DEFS: TrialDef[] = [
  {
    id: 'void_anomaly',
    name: 'รอยแยกสุญญะ',
    enName: 'Void Anomaly',
    desc: 'สนามพลังมิติสุญญะรบกวน ระบบบอทอัตโนมัติ (Auto-Root/Auto-Reset) ถูกปิดกั้นทั้งหมด ต้องอาศัยการสั่งการด้วยมือล้วน',
    enDesc: 'Zero-point dimensional disturbance completely disabling all Automation modules (Pure manual play)',
    icon: '🌌',
    restrictionDesc: 'ระบบบอทออโต้ทั้งหมดถูกระงับ (ต้องกดมือล้วน) และโบนัสภายนอกทั้งหมดถูกระงับ',
    enRestrictionDesc: 'All Automation bots suppressed (pure manual play) and all external meta-bonuses suppressed',
    rewardDesc: 'ปลดล็อกธีม UI [🌌 จอมราชันย์แห่งสุญญะ] & โบนัสสะท้อนราก +50% พร้อมรับ +200 🌍',
    enRewardDesc: 'Unlocks [🌌 Void Sovereign] UI Theme, +50% Echo Multiplier & +200 🌍 Gaia Essences',
    targetYggdrasil: 25,
    themeReward: 'void_sovereign',
    essenceReward: 200,
  },
  {
    id: 'permafrost',
    name: 'เหมันต์เยือกแข็ง',
    enName: 'Permafrost',
    desc: 'ความหนาวเย็นยะเยือกใต้พิภพ แรนด้อมอีเวนต์เกิดช้าลง 60% และระยะเวลาบัฟนำโชคสั้นลงครึ่งหนึ่ง',
    enDesc: 'Subterranean freezing cold increasing random event cooldowns by 60% and halving lucky buff durations',
    icon: '❄️',
    restrictionDesc: 'คูลดาวน์อีเวนต์นานขึ้น 60% ระยะเวลาบัฟลดลง 50% และโบนัสภายนอกทั้งหมดถูกระงับ',
    enRestrictionDesc: 'Random event cooldown +60%, buff duration -50% and all external meta-bonuses suppressed',
    rewardDesc: 'ปลดล็อกสกิน [❄️ เหมันต์นิรันดร์] & ธีม [❄️ ทุ่งทุนดราเยือกแข็ง] ผลผลิตออฟไลน์ +50% & โอกาสโชคดี +0.2% และ +250 🌍',
    enRewardDesc: 'Unlocks [❄️ Permafrost] Skin & UI Theme, +50% Offline Efficiency, +0.2% Lucky Chance & +250 🌍',
    targetYggdrasil: 25,
    skinReward: 'permafrost',
    themeReward: 'boreal_tundra',
    essenceReward: 250,
  },
  {
    id: 'geomagnetic_storm',
    name: 'พายุสนามแม่เหล็ก',
    enName: 'Geomagnetic Storm',
    desc: 'พายุแม่เหล็กไฟฟ้ารบกวนสนามพลัง ห้องก้องกังวาน (Echo Chamber) ไม่มอบโบนัสสะท้อนผลผลิต',
    enDesc: 'Electromagnetic storm disturbing resonant frequencies, suppressing Echo Chamber passive bonus',
    icon: '⚡',
    restrictionDesc: 'ผลการสะท้อนของ Echo Chamber ไม่ทำงาน (โบนัส 0%) และโบนัสภายนอกทั้งหมดถูกระงับ',
    enRestrictionDesc: 'Echo Chamber passive resonance provides 0% production bonus and all external meta-bonuses suppressed',
    rewardDesc: 'ปลดล็อกสกิน [⚡ พายุสายฟ้าฟาด] & ธีม [⚡ สนามแม่เหล็กไฟฟ้า] รากลึกระดับ Tier 5+ ผลิตแรงขึ้น ×1.50 (+50%) และ +300 🌍',
    enRewardDesc: 'Unlocks [⚡ Fulminant Tempest] Skin & UI Theme, Tier 5+ Deep Roots rate ×1.50 (+50%) & +300 🌍',
    targetYggdrasil: 25,
    skinReward: 'fulminant',
    themeReward: 'electromagnetic',
    essenceReward: 300,
  },
  {
    id: 'null_cycle',
    name: 'วงจรศูนย์',
    enName: 'Null Cycle',
    desc: 'วัฏจักรแห่งความว่างเปล่า เครือข่ายรากประสาน (Root Synergies) ถูกตัดขาด ไม่มอบโบนัสผลผลิตใดๆ ทั้งสิ้น',
    enDesc: 'Cycle of the Void severing all Mycorrhizal Network Synergies (0% bonus)',
    icon: '🌑',
    restrictionDesc: 'เครือข่ายรากประสาน (Root Synergies) กลายเป็น 0% และโบนัสภายนอกทั้งหมดถูกระงับ',
    enRestrictionDesc: 'Mycorrhizal Network Synergies completely suppressed (0% bonus) and all external meta-bonuses suppressed',
    rewardDesc: 'ปลดล็อกสกิน [🌑 คราสทมิฬ] & ธีม [🌑 สุริยุปราคาใต้พิภพ] เมล็ด Prestige +50% & Gaia Essence +50% และ +350 🌍',
    enRewardDesc: 'Unlocks [🌑 Abyssal Eclipse] Skin & UI Theme, +50% Prestige Seeds, +50% Gaia Essence & +350 🌍',
    targetYggdrasil: 25,
    skinReward: 'eclipse',
    themeReward: 'abyssal_eclipse',
    essenceReward: 350,
  },
  {
    id: 'arid_drought',
    name: 'ดินแล้งกันดาร',
    enName: 'Arid Drought',
    desc: 'สภาพอากาศแห้งแล้งรุนแรง สารอาหารและเรตผิวดินลดลง 75%',
    enDesc: 'Severe arid climate reducing ambient surface moisture and baseline rate by 75%',
    icon: '🏜️',
    restrictionDesc: 'เรทการผลิตสารอาหารพื้นฐานลดลง 75% และโบนัสภายนอกทั้งหมดถูกระงับ',
    enRestrictionDesc: 'Base nutrient production rate reduced by 75% and all external meta-bonuses suppressed',
    rewardDesc: 'ปลดล็อกสกิน [🏜️ ซาฮาราโบราณ] & เรทผลผลิตถาวร +35% พร้อมรับ +450 🌍',
    enRewardDesc: 'Unlocks [🏜️ Ancient Drought] Skin, +35% Global Production & +450 🌍 Gaia Essences',
    targetYggdrasil: 25,
    skinReward: 'drought',
    essenceReward: 450,
  },
  {
    id: 'basalt_strata',
    name: 'ชั้นหินอัคนีทึบ',
    enName: 'Basalt Strata',
    desc: 'ชั้นหินภูเขาไฟแข็งแกร่ง รากทุกชนิดและอัปเกรดมีราคาแพงขึ้น 2.5 เท่า',
    enDesc: 'Dense volcanic basalt increasing costs of all roots and upgrades by 2.5x',
    icon: '🌋',
    restrictionDesc: 'ราคารากและอัปเกรดทุกชนิดแพงขึ้น 2.5 เท่า และโบนัสภายนอกทั้งหมดถูกระงับ',
    enRestrictionDesc: 'Cost of all roots and upgrades increased by 2.5x and all external meta-bonuses suppressed',
    rewardDesc: 'ปลดล็อกสกิน [🌋 ออบซิเดียนเพลิง] & โบนัส Synergy +50% พร้อมรับ +600 🌍',
    enRewardDesc: 'Unlocks [🌋 Obsidian Magma] Skin, +50% Synergy Bonus & +600 🌍 Gaia Essences',
    targetYggdrasil: 25,
    skinReward: 'obsidian',
    essenceReward: 600,
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
