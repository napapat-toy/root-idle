import { BiomeDef, GameState, RelicDef, RelicRarity } from '@/types/game';

export const RELIC_RARITY_INFO: Record<RelicRarity, { name: string; enName: string; color: string; badgeBg: string; icon: string }> = {
  common: { name: 'ทั่วไป', enName: 'Common', color: '#4ade80', badgeBg: 'rgba(74, 222, 128, 0.15)', icon: '🟢' },
  rare: { name: 'หายาก', enName: 'Rare', color: '#38bdf8', badgeBg: 'rgba(56, 189, 248, 0.15)', icon: '🔵' },
  epic: { name: 'มหากาพย์', enName: 'Epic', color: '#c084fc', badgeBg: 'rgba(192, 132, 252, 0.15)', icon: '🟣' },
  legendary: { name: 'ตำนาน', enName: 'Legendary', color: '#fbbf24', badgeBg: 'rgba(251, 191, 36, 0.15)', icon: '🟡' },
  mythic: { name: 'สิ่งศักดิ์สิทธิ์', enName: 'Mythic', color: '#f43f5e', badgeBg: 'rgba(244, 63, 94, 0.2)', icon: '👑' },
};

export const RELIC_DEFS: RelicDef[] = [
  // 🟢 COMMON (Weight: 35)
  {
    id: 'amber',
    name: 'อำพันดึกดำบรรพ์',
    icon: '琥',
    desc: 'ยางไม้โบราณที่ผนึกหยดน้ำค้างล้านปี เก็บรักษาความชุ่มชื้นของผืนป่าแรกกำเนิด',
    rarity: 'common',
    dropWeight: 35,
    effectDesc: '+15% เรทการผลิตรากทุกชนิด',
    baseCost: 50_000_000_000, // 50B
    color: '#4ade80',
  },
  {
    id: 'aquifer',
    name: 'ไข่มุกตาน้ำบาดาลลึก',
    icon: '🌊',
    desc: 'หยดน้ำบริสุทธิ์กลั่นตัวจากความดันล้านบรรยากาศใต้โลก หล่อเลี้ยงรากลึก',
    rarity: 'common',
    dropWeight: 35,
    effectDesc: '+30% ผลผลิตสารอาหารจากความชุ่มชื้นผิวดินตลอดเวลา',
    baseCost: 200_000_000_000, // 200B
    color: '#2dd4bf',
  },

  // 🔵 RARE (Weight: 20)
  {
    id: 'geode',
    name: 'จีโอดคริสตัลโบราณ',
    icon: '💎',
    desc: 'โพรงหินผลึกเรืองแสงที่สะท้อนแสงออโรร่าใต้พิภพ นำพาโชคลาภแห่งผืนดิน',
    rarity: 'rare',
    dropWeight: 20,
    effectDesc: '+30% ความถี่และขนาดของ Lucky Event',
    baseCost: 5_000_000_000_000, // 5T
    color: '#38bdf8',
  },
  {
    id: 'chronolith',
    name: 'ศิลาบันทึกกาลเวลา',
    icon: '⏳',
    desc: 'ฟอสซิลหินที่จดจำการไหลผ่านของกาลเวลาใต้แผ่นเปลือกโลกนับยุคสมัย',
    rarity: 'rare',
    dropWeight: 20,
    effectDesc: '+4 ชม. เวลาออฟไลน์สูงสุด & +25% ประสิทธิภาพออฟไลน์',
    baseCost: 50_000_000_000_000, // 50T
    color: '#60a5fa',
  },
  {
    id: 'magmastone',
    name: 'ศิลาแก่นเพลิงพิภพ',
    icon: '🌋',
    desc: 'ผลึกหินภูเขาไฟที่กักเก็บความร้อนใต้พิภพ มอบพลังขับเคลื่อนมหาศาลเมื่อสัมผัสน้ำ',
    rarity: 'rare',
    dropWeight: 20,
    effectDesc: 'เมื่อคลิกรดน้ำ ปล่อยคลื่นความร้อนมอบสารอาหารระเบิดทันที +5% ของเรทรวม',
    baseCost: 500_000_000_000_000, // 500T
    color: '#f97316',
  },

  // 🟣 EPIC (Weight: 10)
  {
    id: 'mycocore',
    name: 'ฟอสซิลไมคอร์ไรซาบรรพกาล',
    icon: '🍄',
    desc: 'แก่นสปอร์บรรพบุรุษเชื้อราที่สร้างเครือข่ายเชื่อมโยงรากไม้ทั้งผืนโลก',
    rarity: 'epic',
    dropWeight: 10,
    effectDesc: 'เครือข่ายราก (Synergies) ให้ผลผลิตเพิ่มเป็น +0.12%/ต้น (เดิม +0.08%)',
    baseCost: 15_000_000_000_000_000, // 15Qa
    color: '#c084fc',
  },
  {
    id: 'crown',
    name: 'มงกุฎพฤกษาปฐมกาล',
    icon: '🏵️',
    desc: 'กิ่งก้านที่กลายเป็นหินของต้นไม้ต้นแรกของโลก เปล่งพลังสะท้อนอันไร้ขอบเขต',
    rarity: 'epic',
    dropWeight: 10,
    effectDesc: 'สะท้อนราก (Echoes) ให้ผลผลิตเพิ่มเป็น +1.5%/อัน (เดิม +1.0%)',
    baseCost: 150_000_000_000_000_000, // 150Qa
    color: '#a855f7',
  },
  {
    id: 'meteorite',
    name: 'อุกกาบาตฝังใต้พิภพ',
    icon: '🪐',
    desc: 'สะเก็ดดาวจากนอกระบบสุริยะที่ถูกรากดูดซับแร่ธาตุอวกาศเข้าสู่ลำต้น',
    rarity: 'epic',
    dropWeight: 10,
    effectDesc: '+35% สารอาหารที่ได้รับจากทุกแหล่ง',
    baseCost: 5_000_000_000_000_000_000, // 5Sx
    color: '#e879f9',
  },

  // 🟡 LEGENDARY (Weight: 4)
  {
    id: 'ruintablet',
    name: 'แผ่นจารึกอารยธรรมใต้ดิน',
    icon: '🏛️',
    desc: 'ศิลาจารึกอักขระโบราณ สอนวิธีการเร่งการเจริญเติบโตของรากในทุกวัฏจักร',
    rarity: 'legendary',
    dropWeight: 4,
    effectDesc: 'เริ่มต้นรอบหว่านใหม่ด้วยรากโบนัส +30 ต้นฟรีทันที',
    baseCost: 100_000_000_000_000_000_000, // 100Sx
    color: '#fbbf24',
  },

  // 👑 MYTHIC (Weight: 1)
  {
    id: 'gaiacore',
    name: 'หัวใจแห่งไกอา',
    icon: '👑',
    desc: 'แก่นกลางของจิตวิญญาณแห่งโลก เมื่อค้นพบจะปลุกพลังโบราณวัตถุทุกชิ้นให้ทวีคูณเป็น 2 เท่า!',
    rarity: 'mythic',
    dropWeight: 1,
    effectDesc: '⭐ บูสต์พลังของโบราณวัตถุทุกชิ้นขึ้นเป็น 2 เท่าถาวร!',
    baseCost: 10_000_000_000_000_000_000_000, // 10Sp
    color: '#f43f5e',
  },
];

export const BIOME_DEFS: BiomeDef[] = [
  {
    id: 'topsoil',
    name: 'การเดินทางใต้พิภพตามความลึก (Dynamic)',
    desc: 'เปลี่ยนโทนสีและบรรยากาศฉากหลังโดยอัตโนมัติตามความลึกและการเติบโตของราก',
    icon: '🧭',
    bgGradient: 'radial-gradient(ellipse at 50% 20%, #201a14 0%, #15100c 60%, #0d0a08 100%)',
    particleType: 'leaves',
    particleColor: 'rgba(143, 209, 122, 0.4)',
    ambientBonusDesc: 'ฉากหลังเปลี่ยนโทนสีตามชั้นความลึก 0m - 10,000m+ อัตโนมัติ',
    relicRequiredCount: 0,
  },
  {
    id: 'myco_abyss',
    name: 'หุบเหวเห็ดราเรืองแสง',
    desc: 'หุบเหวลึกที่ส่องสว่างด้วยละอองสปอร์ชีวภาพของไมคอร์ไรซา',
    icon: '🍄',
    bgGradient: 'radial-gradient(ellipse at 50% 30%, #152218 0%, #0d160f 60%, #060a07 100%)',
    particleType: 'spores',
    particleColor: 'rgba(74, 222, 128, 0.5)',
    ambientBonusDesc: '+25% โบนัสจากเครือข่ายราก (Synergies)',
    relicRequiredCount: 2,
  },
  {
    id: 'crystal_caverns',
    name: 'ถ้ำผลึกคริสตัลใต้พิภพ',
    desc: 'ถ้ำที่ประดับด้วยผลึกแร่สะท้อนแสงหลากสีระยิบระยับ',
    icon: '💎',
    bgGradient: 'radial-gradient(ellipse at 50% 30%, #12202b 0%, #0b151e 60%, #050a0f 100%)',
    particleType: 'crystals',
    particleColor: 'rgba(56, 189, 248, 0.5)',
    ambientBonusDesc: '+35% โอกาสและขนาดรางวัล Lucky Event',
    relicRequiredCount: 4,
  },
  {
    id: 'magma_mantle',
    name: 'แก่นหินหลอมเหลวแมกมา',
    desc: 'ชั้นหินหลอมเหลวใต้แผ่นเปลือกโลก แหล่งพลังงานความร้อนบรรพกาล',
    icon: '🌋',
    bgGradient: 'radial-gradient(ellipse at 50% 30%, #29120e 0%, #1c0b08 60%, #0e0504 100%)',
    particleType: 'embers',
    particleColor: 'rgba(239, 68, 68, 0.55)',
    ambientBonusDesc: '+20% โบนัสจากการอัปเกรดราก (Root Upgrades)',
    relicRequiredCount: 6,
  },
  {
    id: 'sunken_ruins',
    name: 'ซากนครใต้พิภพโบราณ',
    desc: 'ร่องรอยอารยธรรมโบราณที่สาบสูญ เต็มไปด้วยอักขระเวทมนตร์',
    icon: '🏛️',
    bgGradient: 'radial-gradient(ellipse at 50% 30%, #201328 0%, #150c1b 60%, #09040d 100%)',
    particleType: 'runes',
    particleColor: 'rgba(232, 121, 249, 0.5)',
    ambientBonusDesc: '+20% เมล็ดพันธุ์นิรันดร์เมื่อหว่านใหม่ (Prestige)',
    relicRequiredCount: 8,
  },
  {
    id: 'gaia_sanctum',
    name: 'วิหารแห่งไกอา',
    desc: 'แก่นกลางของดวงดาว สถานที่สถิตของพลังงานชีวิตนิรันดร์',
    icon: '🌌',
    bgGradient: 'radial-gradient(ellipse at 50% 30%, #2b2410 0%, #1c1709 60%, #0c0a03 100%)',
    particleType: 'stardust',
    particleColor: 'rgba(250, 204, 21, 0.6)',
    ambientBonusDesc: '+30% เรทการผลิตสารอาหารทั้งหมดในฟาร์ม',
    relicRequiredCount: 10,
  },
];

// Helper functions for Relic & Biome bonuses

export function hasRelic(state: GameState, relicId: string): boolean {
  return !!state.relics?.[relicId];
}

export function relicsCount(state: GameState): number {
  if (!state.relics) return 0;
  return Object.values(state.relics).filter(Boolean).length;
}

export function isMasterRelicActive(state: GameState): boolean {
  return hasRelic(state, 'gaiacore');
}

export function relicMult(state: GameState, relicId: string): number {
  if (!hasRelic(state, relicId)) return 0;
  return isMasterRelicActive(state) && relicId !== 'gaiacore' ? 2 : 1;
}

export function relicRateBonusMultiplier(state: GameState): number {
  let mult = 1;
  const amberMult = relicMult(state, 'amber');
  if (amberMult > 0) mult *= (1 + 0.15 * amberMult);

  const aquiferMult = relicMult(state, 'aquifer');
  if (aquiferMult > 0) mult *= (1 + 0.30 * aquiferMult);

  const meteoriteMult = relicMult(state, 'meteorite');
  if (meteoriteMult > 0) mult *= (1 + 0.35 * meteoriteMult);

  return mult;
}

export function relicLuckyMultiplier(state: GameState): number {
  const m = relicMult(state, 'geode');
  return m > 0 ? (1 + 0.30 * m) : 1;
}

export function relicOfflineBonus(state: GameState): { extraHours: number; effMultiplier: number } {
  const m = relicMult(state, 'chronolith');
  if (m === 0) return { extraHours: 0, effMultiplier: 1 };
  return {
    extraHours: 4 * m,
    effMultiplier: 1 + 0.25 * m,
  };
}

export function relicSynergyBonusPerUnit(state: GameState): number {
  const m = relicMult(state, 'mycocore');
  return m > 0 ? Math.round((0.08 + 0.04 * m) * 100) / 100 : 0.08;
}

export function relicEchoBonusPerEcho(state: GameState): number {
  const m = relicMult(state, 'crown');
  return m > 0 ? Math.round((1.0 + 0.5 * m) * 100) / 100 : 1.0;
}

export function relicStarterRootsBonus(state: GameState): number {
  const m = relicMult(state, 'ruintablet');
  return m * 30;
}

export function biomeActiveRateMultiplier(state: GameState): number {
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
