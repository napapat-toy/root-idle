import { GameState, Language, ModuleDef, SkinId } from '@/types/game';
import { ACHIEVEMENT_BONUS_MAP } from './achievementsData';

export const GAME_VERSION = '1.8.3';

export const BASE_RATE = 0.15;
export const SEED = 918273;
export const PRESTIGE_UNLOCK_ECHOES = 5;
export const SEED_DIVIDER = 1000000;
export const OFFLINE_CAP_HOURS = [24, 48, 72];
export const BUY_QTY_OPTIONS = [1, 5, 25];

export const MODULE_UNLOCK_REQUIRE_OWNED = 10;
export const ROOT_UPGRADE_MILESTONE_MULT = 2.0;
export const ROOT_UPGRADE_NORMAL_MULT = 1.3;
export const ROOT_UPGRADE_DISCOUNT = 0.55;

export const ECHO_REQUIRE_OWNED = 20;
export const ECHO_BASE_SECONDS = 200;
export const ECHO_COST_MULT = 4;
export const ECHO_REQUIRE_UPGRADE_LEVEL = 3;

export const EVENT_DURATION_MAX_LEVEL = 4;
export const LUCKY_DURATION_BASE = 5;
export const LUCKY_DURATION_MAX = 20;
export const LUCKY_DURATION_MAX_LEVEL = LUCKY_DURATION_MAX - LUCKY_DURATION_BASE; // 15 levels
export const LUCKY_CHANCE_BASE = 0.002;
export const LUCKY_CHANCE_STEP = 0.001;
export const LUCKY_CHANCE_MAX_LEVEL = 8;
export const LUCKY_CHANCE_MAX = 0.010;

export const PASSIVE_RATE_COST = 100;
export const AUTO_ROOT_COST = 50;
export const AUTO_ROOT_SMART_COST = 180;
export const AUTO_ROOT_ALL_COST = 500;
export const AURA_ROOTS_COST = 100;
export const SKIN_COST = 100;
export const AUTO_RESET_COST = 10000;
export const AUTO_RESET_MIN_SEEDS = 3;
export const AUTO_EVENT_COST = 1000;
export const SAVE_SLOT_COUNT = 5;

export const MODULE_DEFS: ModuleDef[] = [
  { id: 'fine',        name: 'รากฝอย',                  desc: 'รากเล็กจิ๋วที่แทรกดินหาความชื้น',             baseCost: 10,              costMult: 1.150, rate: 0.6,          color: '#eadfc7' },
  { id: 'nodule',      name: 'ปมราก',                   desc: 'กักเก็บสารอาหารไว้ใช้ต่อเนื่อง',               baseCost: 80,              costMult: 1.155, rate: 4,            color: '#e0a94a' },
  { id: 'myco',        name: 'เชื้อราไมคอร์ไรซา',       desc: 'ทำงานร่วมกับรากเพื่อดูดซึมสารอาหารเพิ่ม',     baseCost: 650,             costMult: 1.160, rate: 24,           color: '#8fd17a' },
  { id: 'core',        name: 'แก่นราก',                 desc: 'แกนรากลึกที่สูบสารอาหารมหาศาลจากใต้ดิน',       baseCost: 6000,            costMult: 1.165, rate: 150,          color: '#d1673f' },
  { id: 'vine',        name: 'เถารากยักษ์',             desc: 'เถารากที่ชอนไชไปทั่วชั้นดินลึก',             baseCost: 65000,           costMult: 1.170, rate: 950,          color: '#5fa8d1' },
  { id: 'bionode',     name: 'ปมพลังงานชีวภาพ',         desc: 'แปลงสารอินทรีย์เป็นพลังงานเข้มข้น',           baseCost: 750000,          costMult: 1.175, rate: 7200,         color: '#c77dd1' },
  { id: 'eternal',     name: 'รากอมตะ',                 desc: 'รากโบราณที่ไม่เคยหยุดเติบโต',                baseCost: 9500000,         costMult: 1.180, rate: 58000,        color: '#f2d24a' },
  { id: 'nexus',       name: 'แก่นโลกใต้ดิน',           desc: 'เชื่อมต่อกับแหล่งพลังงานใจกลางโลก',           baseCost: 140000000,       costMult: 1.185, rate: 480000,       color: '#ff6b6b' },
  { id: 'crystal',     name: 'ใยรากคริสตัล',            desc: 'โครงสร้างรากที่ตกผลึกดูดพลังงานสูง',           baseCost: 2400000000,      costMult: 1.190, rate: 4500000,      color: '#8ad6e0' },
  { id: 'heart',       name: 'หัวใจราก',                desc: 'ศูนย์กลางที่สูบฉีดพลังงานทั่วเครือข่ายราก',   baseCost: 45000000000,     costMult: 1.195, rate: 48000000,     color: '#ff9ecf' },
  { id: 'seed',        name: 'เมล็ดพันธุ์อนันต์',       desc: 'เมล็ดที่งอกซ้ำได้ไม่รู้จบ',                  baseCost: 900000000000,    costMult: 1.200, rate: 580000000,    color: '#c8e06a' },
  { id: 'throne',      name: 'บัลลังก์ราก',             desc: 'จุดสูงสุดของเครือข่ายรากพิภพ',                baseCost: 20000000000000,  costMult: 1.205, rate: 7500000000,   color: '#e0c168' },
  { id: 'magma',       name: 'รากแก่นแมกมา',            desc: 'ชอนไชชั้นหินหลอมเหลวดูดซับความร้อนใต้พิภพ',   baseCost: 500000000000000, costMult: 1.210, rate: 110000000000, color: '#ff5722' },
  { id: 'aether',      name: 'รากไอธาตุบรรพกาล',        desc: 'สัมผัสกระแสพลังงานบรรพกาลใต้แผ่นเปลือกโลก',   baseCost: 15000000000000000, costMult: 1.215, rate: 1800000000000, color: '#a855f7' },
  { id: 'void',        name: 'รากห้วงสุญญะ',            desc: 'หยั่งลึกลงสู่รอยแยกมิติความว่างเปล่า',        baseCost: 500000000000000000, costMult: 1.220, rate: 32000000000000, color: '#6366f1' },
  { id: 'astral',      name: 'รากธารดวงดาวใต้พิภพ',     desc: 'เชื่อมโยงสนามแม่เหล็กโลกกับละอองดวงดาว',     baseCost: 18000000000000000000, costMult: 1.225, rate: 650000000000000, color: '#38bdf8' },
  { id: 'chronos',     name: 'รากกาลเวลาบรรจบ',          desc: 'รากที่เติบโตข้ามมิติเวลาดูดซับพลังงานทุกยุค', baseCost: 700000000000000000000, costMult: 1.230, rate: 14000000000000000, color: '#facc15' },
  { id: 'singularity', name: 'รากเอกภาวะมวลเข้มข้น',    desc: 'จุดศูนย์กลางแรงดึงดูดดูดซับสารอาหารทุกอะตอม', baseCost: 30000000000000000000000, costMult: 1.235, rate: 350000000000000000, color: '#ec4899' },
  { id: 'genesis',     name: 'รากกำเนิดปฐมกาล',          desc: 'รากต้นกำเนิดแห่งสิ่งมีชีวิตทั้งมวลใต้พิภพ',   baseCost: 1500000000000000000000000, costMult: 1.240, rate: 9500000000000000000, color: '#34d399' },
  { id: 'yggdrasil',   name: 'รากต้นไม้โลก',            desc: 'เสาค้ำจุนใต้พิภพ เชื่อมต่อมิติที่ไม่มีที่สิ้นสุด...', baseCost: 90000000000000000000000000, costMult: 1.250, rate: 300000000000000000000, color: '#fbbf24' },
];

export const MODULE_COLOR_MAP: Record<string, string> = Object.fromEntries(
  MODULE_DEFS.map(m => [m.id, m.color])
);

export const SKIN_DEFS: Array<{ id: SkinId; name: string; always?: boolean }> = [
  { id: 'none', name: 'ปกติ (ไม่มีสกิน)', always: true },
  { id: 'rainbow', name: '🌈 รุ้ง/ทอง' },
  { id: 'sameorigin', name: '🌿 รากเดียวกัน' },
  { id: 'grayscale', name: '⚫ ขาวดำ' },
  { id: 'gradient', name: '🍃 ไล่เข้ม-อ่อน' }
];

export const SKIN_CYCLE_ORDER: SkinId[] = ['none', 'rainbow', 'sameorigin', 'grayscale', 'gradient'];

export function createFreshState(): GameState {
  const s: GameState = {
    nutrients: 0,
    owned: {},
    totalOwned: 0,
    rootUpgrades: {},
    echoes: {},
    rootSynergies: {},
    buyQty: 1,
    lockGapBackfilled: false,
    totalPlayTimeSeconds: 0,
    runPlayTimeSeconds: 0,
    runEarned: 0,
    eternalSeeds: 0,
    prestige: {
      starterLevel: 0,
      autoRoot: false,
      autoRootEnabled: true,
      autoRootSmart: false,
      autoRootAll: false,
      goldenLevel: 0,
      auraRoots: false,
      skinSameOrigin: false,
      skinGrayscale: false,
      skinGradient: false,
      activeSkin: 'none',
      autoReset: false,
      autoResetEnabled: false,
      autoResetThreshold: 0,
      offlineCapLevel: 0,
      eventBonusLevel: 0,
      eventDurationLevel: 0,
      autoEvent: false,
      autoEventEnabled: true,
      luckyMagnitudeLevel: 0,
      luckyDurationLevel: 0,
      luckyChanceLevel: 0,
      passiveRateLevel: 0
    },
    achievements: [],
    stats: {
      prestigeCount: 0,
      totalEventsClaimed: 0,
      luckyJackpotCount: 0,
      maxOfflineTimeSeconds: 0,
      superJackpotClaimed: false,
      totalSeedsEarnedLifetime: 0,
      totalNutrientsEarnedLifetime: 0,
    },
    lang: 'th',
  };
  MODULE_DEFS.forEach(m => { s.owned[m.id] = 0; });
  return s;
}

// Cost calculations
export function costFor(def: ModuleDef, ownedCount: number): number {
  return Math.ceil(def.baseCost * Math.pow(def.costMult, ownedCount));
}

export function bulkCostFor(def: ModuleDef, ownedCount: number, qty: number): number {
  const m = def.costMult;
  const first = def.baseCost * Math.pow(m, ownedCount);
  const total = Math.abs(m - 1) < 1e-9 ? first * qty : first * (Math.pow(m, qty) - 1) / (m - 1);
  return Math.ceil(total);
}

// Root Upgrades (Lv.1 = 5 owned, Lv.2 = 10 owned, Lv.3 = 15 owned, Lv.4 = 20 owned, Lv.5 = 25 owned)
export function rootUpgradeRequireOwned(level: number): number {
  return 5 * level;
}

export function rootUpgradeIsMilestone(level: number): boolean {
  return level % 5 === 0;
}

export function rootUpgradeLevelMult(level: number): number {
  return rootUpgradeIsMilestone(level) ? ROOT_UPGRADE_MILESTONE_MULT : ROOT_UPGRADE_NORMAL_MULT;
}

export function rootUpgradeEquivUnits(level: number): number {
  const req = rootUpgradeRequireOwned(level);
  const benefitFraction = rootUpgradeLevelMult(level) - 1;
  return Math.max(1, Math.round(req * benefitFraction * ROOT_UPGRADE_DISCOUNT));
}

export function rootUpgradeCost(def: ModuleDef, level: number): number {
  return bulkCostFor(def, rootUpgradeRequireOwned(level), rootUpgradeEquivUnits(level));
}

export function rootUpgradeMultiplier(state: GameState, moduleId: string): number {
  const level = state.rootUpgrades[moduleId] || 0;
  let mult = 1;
  for (let i = 1; i <= level; i++) mult *= rootUpgradeLevelMult(i);
  return mult;
}

// Echoes
export function totalEchoCount(state: GameState): number {
  let s = 0;
  MODULE_DEFS.forEach(d => { s += (state.echoes[d.id] || 0); });
  return s;
}

export function echoBonusPct(state: GameState): number {
  return totalEchoCount(state);
}

export function globalEchoMultiplier(state: GameState): number {
  return 1 + echoBonusPct(state) * 0.01;
}

export function echoUnlockedFor(state: GameState, moduleId: string): boolean {
  return (state.owned[moduleId] || 0) >= ECHO_REQUIRE_OWNED
    && (state.rootUpgrades[moduleId] || 0) >= ECHO_REQUIRE_UPGRADE_LEVEL;
}

export function prestigeBonusPct(state: GameState): number {
  return state.prestige.passiveRateLevel || 0;
}

export function prestigeRateMultiplier(state: GameState): number {
  return 1 + prestigeBonusPct(state) * 0.01;
}

export function achievementBonusPct(state: GameState): number {
  if (!state.achievements || state.achievements.length === 0) return 0;
  return state.achievements.reduce((sum, id) => sum + (ACHIEVEMENT_BONUS_MAP[id] || 1), 0);
}

export function achievementRateMultiplier(state: GameState): number {
  return 1 + achievementBonusPct(state) * 0.01;
}

export const ROOT_SYNERGY_REQUIRE_OWNED = 50;
export const ROOT_SYNERGY_PCT_PER_UNIT = 0.1; // +0.1% per owned unit

export function rootSynergyUnlocked(state: GameState, moduleId: string): boolean {
  return (state.owned[moduleId] || 0) >= ROOT_SYNERGY_REQUIRE_OWNED || !!state.rootSynergies?.[moduleId];
}

export function rootSynergyCost(def: ModuleDef): number {
  return bulkCostFor(def, ROOT_SYNERGY_REQUIRE_OWNED, 5);
}

export function speciesSynergyBonusPct(state: GameState, moduleId: string): number {
  if (!state.rootSynergies?.[moduleId]) return 0;
  return Number(((state.owned[moduleId] || 0) * ROOT_SYNERGY_PCT_PER_UNIT).toFixed(1));
}

export function totalSynergyBonusPct(state: GameState): number {
  let s = 0;
  MODULE_DEFS.forEach(d => {
    s += speciesSynergyBonusPct(state, d.id);
  });
  return Number(s.toFixed(1));
}

export function totalSynergiesCount(state: GameState): number {
  return MODULE_DEFS.filter(d => !!state.rootSynergies?.[d.id]).length;
}

export function totalGlobalBonusPercent(state: GameState): number {
  return Number((echoBonusPct(state) + prestigeBonusPct(state) + achievementBonusPct(state) + totalSynergyBonusPct(state)).toFixed(1));
}

export function globalRateMultiplier(state: GameState): number {
  return 1 + totalGlobalBonusPercent(state) * 0.01;
}

export const MILESTONE_THRESHOLDS = [
  10, 25, 50, 100, 150, 200, 250, 300, 400, 500, 600, 700, 800, 900, 1000,
];

export function moduleMilestonesCountFor(count: number): number {
  let milestones = 0;
  for (let i = 0; i < MILESTONE_THRESHOLDS.length; i++) {
    if (count >= MILESTONE_THRESHOLDS[i]) {
      milestones++;
    } else {
      break;
    }
  }
  return milestones;
}

export function moduleMilestoneMultiplier(count: number): number {
  const steps = moduleMilestonesCountFor(count);
  if (steps === 0) return 1;
  let mult = Math.pow(2, steps);
  if (count >= 1000) {
    mult *= 2;
  }
  return mult;
}

export function totalMilestonesCount(state: GameState): number {
  let count = 0;
  MODULE_DEFS.forEach(m => {
    count += moduleMilestonesCountFor(state.owned[m.id] || 0);
  });
  return count;
}

export function effectiveRate(state: GameState, def: ModuleDef, targetCount?: number): number {
  const count = targetCount !== undefined ? targetCount : (state.owned[def.id] || 0);
  return (
    def.rate *
    moduleMilestoneMultiplier(count) *
    rootUpgradeMultiplier(state, def.id) *
    globalRateMultiplier(state)
  );
}

export function baseTotalRate(state: GameState): number {
  let r = BASE_RATE * globalRateMultiplier(state);
  MODULE_DEFS.forEach(m => {
    r += (state.owned[m.id] || 0) * effectiveRate(state, m);
  });
  return r;
}

export function echoCost(state: GameState, def: ModuleDef, currentTotalRate: number): number {
  const n = state.echoes[def.id] || 0;
  const cost = ECHO_BASE_SECONDS * currentTotalRate * Math.pow(ECHO_COST_MULT, n);
  return Math.ceil(Math.max(cost, 1));
}

// Prestige helpers
export function prestigeUnlocked(state: GameState): boolean {
  return totalEchoCount(state) >= PRESTIGE_UNLOCK_ECHOES || (state.owned['throne'] || 0) >= 1;
}

export function calcPrestigeSeeds(state: GameState): number {
  const base = Math.floor(Math.cbrt(state.runEarned / SEED_DIVIDER));
  const bonus = 1 + (state.prestige.goldenLevel || 0) * 0.05;
  return Math.max(0, Math.floor(base * bonus));
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

export function currentOfflineCapSeconds(state: GameState): number {
  return OFFLINE_CAP_HOURS[state.prestige.offlineCapLevel || 0] * 3600;
}

export function stageName(totalOwned: number, lang: Language = 'th'): string {
  const isEn = lang === 'en';
  if (totalOwned < 5) return isEn ? 'Seedling Phase' : 'ระยะเมล็ด';
  if (totalOwned < 15) return isEn ? 'First Sprouts' : 'รากงอกแรก';
  if (totalOwned < 35) return isEn ? 'Root Network' : 'เครือข่ายราก';
  if (totalOwned < 70) return isEn ? 'Expansive Roots' : 'รากแผ่กว้าง';
  if (totalOwned < 150) return isEn ? 'Underground Forest' : 'ป่าใต้ดิน';
  if (totalOwned < 400) return isEn ? 'Root Labyrinth' : 'เขาวงกตราก';
  if (totalOwned < 1000) return isEn ? 'Subterranean Realm' : 'อาณาจักรใต้พิภพ';
  if (totalOwned < 2500) return isEn ? 'Primordial Energy Plane' : 'มิติพลังงานบรรพกาล';
  if (totalOwned < 5000) return isEn ? 'Subterranean Singularity' : 'แก่นเอกภาวะใต้โลก';
  return isEn ? 'Eternal Yggdrasil Canopy' : 'รากพฤกษาอนันต์กาล';
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
  const targetCount = qty === 'max' ? Infinity : qty;

  while (count < targetCount && lvl < maxLevel) {
    const nextCost = costFn(lvl);
    if (totalCost + nextCost > seeds) break;
    totalCost += nextCost;
    count++;
    lvl++;
  }

  return { count, totalCost };
}
