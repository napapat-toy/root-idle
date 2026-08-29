import { ModuleDef, GameState } from '@/types/game';

export const MODULE_UNLOCK_REQUIRE_OWNED = 10;

export const MODULE_DEFS: ModuleDef[] = [
  { id: 'fine',        name: 'รากฝอย',                  icon: '🌱', desc: 'รากเล็กจิ๋วที่แทรกดินหาความชื้น',             baseCost: 10,              costMult: 1.150, rate: 0.6,          color: '#eadfc7' },
  { id: 'nodule',      name: 'ปมราก',                   icon: '🪨', desc: 'กักเก็บสารอาหารไว้ใช้ต่อเนื่อง',               baseCost: 80,              costMult: 1.155, rate: 4,            color: '#e0a94a' },
  { id: 'myco',        name: 'เชื้อราไมคอร์ไรซา',       icon: '🍄', desc: 'ทำงานร่วมกับรากเพื่อดูดซึมสารอาหารเพิ่ม',     baseCost: 650,             costMult: 1.160, rate: 24,           color: '#8fd17a' },
  { id: 'core',        name: 'แก่นราก',                 icon: '🪵', desc: 'แกนรากลึกที่สูบสารอาหารมหาศาลจากใต้ดิน',       baseCost: 6000,            costMult: 1.165, rate: 150,          color: '#d1673f' },
  { id: 'vine',        name: 'เถารากยักษ์',             icon: '🌿', desc: 'เถารากที่ชอนไชไปทั่วชั้นดินลึก',             baseCost: 65000,           costMult: 1.170, rate: 950,          color: '#5fa8d1' },
  { id: 'bionode',     name: 'ปมพลังงานชีวภาพ',         icon: '🧬', desc: 'แปลงสารอินทรีย์เป็นพลังงานเข้มข้น',           baseCost: 750000,          costMult: 1.175, rate: 7200,         color: '#c77dd1' },
  { id: 'eternal',     name: 'รากอมตะ',                 icon: '🏵️', desc: 'รากโบราณที่ไม่เคยหยุดเติบโต',                baseCost: 9500000,         costMult: 1.180, rate: 58000,        color: '#f2d24a' },
  { id: 'nexus',       name: 'แก่นโลกใต้ดิน',           icon: '🌍', desc: 'เชื่อมต่อกับแหล่งพลังงานใจกลางโลก',           baseCost: 140000000,       costMult: 1.185, rate: 480000,       color: '#ff6b6b' },
  { id: 'crystal',     name: 'ใยรากคริสตัล',            icon: '💎', desc: 'โครงสร้างรากที่ตกผลึกดูดพลังงานสูง',           baseCost: 2400000000,      costMult: 1.190, rate: 4500000,      color: '#8ad6e0' },
  { id: 'heart',       name: 'หัวใจราก',                icon: '💖', desc: 'ศูนย์กลางที่สูบฉีดพลังงานทั่วเครือข่ายราก',   baseCost: 45000000000,     costMult: 1.195, rate: 48000000,     color: '#ff9ecf' },
  { id: 'seed',        name: 'เมล็ดพันธุ์อนันต์',       icon: '🌰', desc: 'เมล็ดที่งอกซ้ำได้ไม่รู้จบ',                  baseCost: 900000000000,    costMult: 1.200, rate: 580000000,    color: '#c8e06a' },
  { id: 'throne',      name: 'บัลลังก์ราก',             icon: '👑', desc: 'จุดสูงสุดของเครือข่ายรากพิภพ',                baseCost: 20000000000000,  costMult: 1.205, rate: 7500000000,   color: '#e0c168' },
  { id: 'magma',       name: 'รากแก่นแมกมา',            icon: '🔥', desc: 'ชอนไชชั้นหินหลอมเหลวดูดซับความร้อนใต้พิภพ',   baseCost: 500000000000000, costMult: 1.210, rate: 110000000000, color: '#ff5722' },
  { id: 'aether',      name: 'รากไอธาตุบรรพกาล',        icon: '🔮', desc: 'สัมผัสกระแสพลังงานบรรพกาลใต้แผ่นเปลือกโลก',   baseCost: 15000000000000000, costMult: 1.215, rate: 1800000000000, color: '#a855f7' },
  { id: 'void',        name: 'รากห้วงสุญญะ',            icon: '🌌', desc: 'หยั่งลึกลงสู่รอยแยกมิติความว่างเปล่า',        baseCost: 500000000000000000, costMult: 1.220, rate: 32000000000000, color: '#6366f1' },
  { id: 'astral',      name: 'รากธารดวงดาวใต้พิภพ',     icon: '⭐', desc: 'เชื่อมโยงสนามแม่เหล็กโลกกับละอองดวงดาว',     baseCost: 18000000000000000000, costMult: 1.225, rate: 650000000000000, color: '#38bdf8' },
  { id: 'chronos',     name: 'รากกาลเวลาบรรจบ',          icon: '⌛', desc: 'รากที่เติบโตข้ามมิติเวลาดูดซับพลังงานทุกยุค', baseCost: 700000000000000000000, costMult: 1.230, rate: 14000000000000000, color: '#facc15' },
  { id: 'singularity', name: 'รากเอกภาวะมวลเข้มข้น',    icon: '🌀', desc: 'จุดศูนย์กลางแรงดึงดูดดูดซับสารอาหารทุกอะตอม', baseCost: 30000000000000000000000, costMult: 1.235, rate: 350000000000000000, color: '#ec4899' },
  { id: 'genesis',     name: 'รากกำเนิดปฐมกาล',          icon: '🪐', desc: 'รากต้นกำเนิดแห่งสิ่งมีชีวิตทั้งมวลใต้พิภพ',   baseCost: 1500000000000000000000000, costMult: 1.240, rate: 9500000000000000000, color: '#34d399' },
  { id: 'yggdrasil',   name: 'รากต้นไม้โลก',            icon: '🌳', desc: 'เสาค้ำจุนใต้พิภพ เชื่อมต่อมิติที่ไม่มีที่สิ้นสุด...', baseCost: 90000000000000000000000000, costMult: 1.250, rate: 300000000000000000000, color: '#fbbf24' },
];

export const MODULE_COLOR_MAP: Record<string, string> = Object.fromEntries(
  MODULE_DEFS.map(m => [m.id, m.color])
);

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
