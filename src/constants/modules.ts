import { ModuleDef, GameState } from '@/types/game';

export const MODULE_UNLOCK_REQUIRE_OWNED = 10;

export const MODULE_DEFS: ModuleDef[] = [
  { id: 'fine',        name: 'รากฝอย',                  icon: '🌱', desc: 'รากเล็กจิ๋วที่แทรกดินหาความชื้น',             baseCost: 10,              costMult: 1.150, rate: 0.6,          color: '#eadfc7' },
  { id: 'nodule',      name: 'ปมราก',                   icon: '🪨', desc: 'กักเก็บสารอาหารไว้ใช้ต่อเนื่อง',               baseCost: 80,              costMult: 1.150, rate: 4,            color: '#e0a94a' },
  { id: 'myco',        name: 'เชื้อราไมคอร์ไรซา',       icon: '🍄', desc: 'ทำงานร่วมกับรากเพื่อดูดซึมสารอาหารเพิ่ม',     baseCost: 650,             costMult: 1.150, rate: 28,           color: '#8fd17a' },
  { id: 'core',        name: 'แก่นราก',                 icon: '🪵', desc: 'แกนรากลึกที่สูบสารอาหารมหาศาลจากใต้ดิน',       baseCost: 5800,            costMult: 1.150, rate: 220,          color: '#d1673f' },
  { id: 'vine',        name: 'เถารากยักษ์',             icon: '🌿', desc: 'เถารากที่ชอนไชไปทั่วชั้นดินลึก',             baseCost: 60000,           costMult: 1.150, rate: 1800,         color: '#5fa8d1' },
  { id: 'bionode',     name: 'ปมพลังงานชีวภาพ',         icon: '🧬', desc: 'แปลงสารอินทรีย์เป็นพลังงานเข้มข้น',           baseCost: 700000,          costMult: 1.150, rate: 16000,        color: '#c77dd1' },
  { id: 'eternal',     name: 'รากอมตะ',                 icon: '🏵️', desc: 'รากโบราณที่ไม่เคยหยุดเติบโต',                baseCost: 9000000,         costMult: 1.150, rate: 160000,       color: '#f2d24a' },
  { id: 'nexus',       name: 'แก่นโลกใต้ดิน',           icon: '🌍', desc: 'เชื่อมต่อกับแหล่งพลังงานใจกลางโลก',           baseCost: 130000000,       costMult: 1.150, rate: 1800000,      color: '#ff6b6b' },
  { id: 'crystal',     name: 'ใยรากคริสตัล',            icon: '💎', desc: 'โครงสร้างรากที่ตกผลึกดูดพลังงานสูง',           baseCost: 2200000000,      costMult: 1.150, rate: 24000000,     color: '#8ad6e0' },
  { id: 'heart',       name: 'หัวใจราก',                icon: '💖', desc: 'ศูนย์กลางที่สูบฉีดพลังงานทั่วเครือข่ายราก',   baseCost: 42000000000,     costMult: 1.150, rate: 380000000,    color: '#ff9ecf' },
  { id: 'seed',        name: 'เมล็ดพันธุ์อนันต์',       icon: '🌰', desc: 'เมล็ดที่งอกซ้ำได้ไม่รู้จบ',                  baseCost: 850000000000,    costMult: 1.150, rate: 6500000000,   color: '#c8e06a' },
  { id: 'throne',      name: 'บัลลังก์ราก',             icon: '👑', desc: 'จุดสูงสุดของเครือข่ายรากพิภพ',                baseCost: 18000000000000,  costMult: 1.150, rate: 110000000000, color: '#e0c168' },
  { id: 'magma',       name: 'รากแก่นแมกมา',            icon: '🔥', desc: 'ชอนไชชั้นหินหลอมเหลวดูดซับความร้อนใต้พิภพ',   baseCost: 380000000000000, costMult: 1.150, rate: 2000000000000, color: '#ff5722' },
  { id: 'aether',      name: 'รากไอธาตุบรรพกาล',        icon: '🔮', desc: 'สัมผัสกระแสพลังงานบรรพกาลใต้แผ่นเปลือกโลก',   baseCost: 8500000000000000, costMult: 1.150, rate: 38000000000000, color: '#a855f7' },
  { id: 'void',        name: 'รากห้วงสุญญะ',            icon: '🌌', desc: 'หยั่งลึกลงสู่รอยแยกมิติความว่างเปล่า',        baseCost: 200000000000000000, costMult: 1.150, rate: 750000000000000, color: '#6366f1' },
  { id: 'astral',      name: 'รากธารดวงดาวใต้พิภพ',     icon: '⭐', desc: 'เชื่อมโยงสนามแม่เหล็กโลกกับละอองดวงดาว',     baseCost: 5000000000000000000, costMult: 1.150, rate: 16000000000000000, color: '#38bdf8' },
  { id: 'chronos',     name: 'รากกาลเวลาบรรจบ',          icon: '⌛', desc: 'รากที่เติบโตข้ามมิติเวลาดูดซับพลังงานทุกยุค', baseCost: 130000000000000000000, costMult: 1.150, rate: 360000000000000000, color: '#facc15' },
  { id: 'singularity', name: 'รากเอกภาวะมวลเข้มข้น',    icon: '🌀', desc: 'จุดศูนย์กลางแรงดึงดูดดูดซับสารอาหารทุกอะตอม', baseCost: 3600000000000000000000, costMult: 1.150, rate: 8500000000000000000, color: '#ec4899' },
  { id: 'genesis',     name: 'รากกำเนิดปฐมกาล',          icon: '🪐', desc: 'รากต้นกำเนิดแห่งสิ่งมีชีวิตทั้งมวลใต้พิภพ',   baseCost: 110000000000000000000000, costMult: 1.150, rate: 220000000000000000000, color: '#34d399' },
  { id: 'yggdrasil',   name: 'รากต้นไม้โลก',            icon: '🌳', desc: 'เสาค้ำจุนใต้พิภพ เชื่อมต่อมิติที่ไม่มีที่สิ้นสุด...', baseCost: 3500000000000000000000000, costMult: 1.150, rate: 6000000000000000000000, color: '#fbbf24' },
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
