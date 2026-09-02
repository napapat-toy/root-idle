import { BiomeDef, GameState, RelicDef, RelicRarity } from '@/types/game';

export const RELIC_RARITY_INFO: Record<RelicRarity, { name: string; enName: string; color: string; badgeBg: string; icon: string }> = {
  common: { name: 'ทั่วไป', enName: 'Common', color: '#4ade80', badgeBg: 'rgba(74, 222, 128, 0.15)', icon: '🟢' },
  rare: { name: 'หายาก', enName: 'Rare', color: '#38bdf8', badgeBg: 'rgba(56, 189, 248, 0.15)', icon: '🔵' },
  epic: { name: 'มหากาพย์', enName: 'Epic', color: '#c084fc', badgeBg: 'rgba(192, 132, 252, 0.15)', icon: '🟣' },
  legendary: { name: 'ตำนาน', enName: 'Legendary', color: '#fbbf24', badgeBg: 'rgba(251, 191, 36, 0.15)', icon: '🟡' },
  mythic: { name: 'สิ่งศักดิ์สิทธิ์', enName: 'Mythic', color: '#f43f5e', badgeBg: 'rgba(244, 63, 94, 0.2)', icon: '👑' },
};

export const RELIC_MAX_PIECES: Record<RelicRarity, number> = {
  common: 20,
  rare: 10,
  epic: 5,
  legendary: 3,
  mythic: 1,
};

export const RELIC_DEFS: RelicDef[] = [
  // 🟢 COMMON (Weight: 50, Max: 20)
  {
    id: 'amber',
    name: 'อำพันดึกดำบรรพ์',
    enName: 'Primeval Amber',
    icon: '琥',
    desc: 'ยางไม้โบราณที่ผนึกหยดน้ำค้างล้านปี เสริมความมีชีวิตชีวาของเซลล์รากไม้',
    enDesc: 'Ancient resin sealing primordial dewdrops, vitalizing subterranean root cells.',
    rarity: 'common',
    dropWeight: 50,
    effectDesc: '+0.5% เรทการผลิตรากทุกชนิดต่อชิ้น (สูงสุด +10%)',
    enEffectDesc: '+0.5% all roots rate per piece (Max +10%)',
    baseCost: 50_000_000_000, // 50B
    color: '#4ade80',
    maxPieces: 20,
  },
  {
    id: 'aquifer',
    name: 'ไข่มุกตาน้ำบาดาลลึก',
    enName: 'Abyssal Aquifer Pearl',
    icon: '🌊',
    desc: 'หยดน้ำบริสุทธิ์กลั่นตัวจากความดันล้านบรรยากาศใต้โลก หล่อเลี้ยงรากชั้นลึก',
    enDesc: 'Pure condensed droplet forged under extreme pressure, nourishing deep stratum roots.',
    rarity: 'common',
    dropWeight: 50,
    effectDesc: '+1.0% ผลผลิตเฉพาะรากชั้นลึกต่อชิ้น (สูงสุด +20%)',
    enEffectDesc: '+1.0% deep roots rate per piece (Max +20%)',
    baseCost: 200_000_000_000, // 200B
    color: '#2dd4bf',
    maxPieces: 20,
  },

  // 🔵 RARE (Weight: 20, Max: 10)
  {
    id: 'geode',
    name: 'จีโอดคริสตัลโบราณ',
    enName: 'Ancient Crystal Geode',
    icon: '💎',
    desc: 'โพรงหินผลึกเรืองแสงที่สะท้อนแสงออโรร่าใต้พิภพ ดึงดูดสารอาหารบริสุทธิ์',
    enDesc: 'Luminescent crystal cavity channeling auroral refraction to gather rich nutrients.',
    rarity: 'rare',
    dropWeight: 20,
    effectDesc: '+2.0% สารอาหารที่ได้รับจากลูกแก้วเหตุการณ์ต่อชิ้น (สูงสุด +20%)',
    enEffectDesc: '+2.0% event orb nutrients per piece (Max +20%)',
    baseCost: 5_000_000_000_000, // 5T
    color: '#38bdf8',
    maxPieces: 10,
  },
  {
    id: 'chronolith',
    name: 'ศิลาบันทึกกาลเวลา',
    enName: 'Chronolith of Aeons',
    icon: '⏳',
    desc: 'ฟอสซิลหินที่จดจำการไหลผ่านของกาลเวลาใต้แผ่นเปลือกโลกนับยุคสมัย',
    enDesc: 'Fossilized strata recording the slow passage of time beneath tectonic plates.',
    rarity: 'rare',
    dropWeight: 20,
    effectDesc: '+15 นาทีเวลาออฟไลน์ & +1.0% ประสิทธิภาพต่อชิ้น (สูงสุด +2.5 ชม. & +10%)',
    enEffectDesc: '+15m offline cap & +1.0% offline efficiency per piece (Max +2.5h & +10%)',
    baseCost: 50_000_000_000_000, // 50T
    color: '#60a5fa',
    maxPieces: 10,
  },
  {
    id: 'magmastone',
    name: 'ศิลาแก่นเพลิงพิภพ',
    enName: 'Magmatic Corestone',
    icon: '🌋',
    desc: 'ผลึกหินภูเขาไฟที่กักเก็บความร้อนใต้พิภพ ปลดปล่อยพลังงานเมื่อถูกกระตุ้น',
    enDesc: 'Volcanic crystal storing geothermal energy, releasing instant burst upon stimulation.',
    rarity: 'rare',
    dropWeight: 20,
    effectDesc: 'คลิกหน้าจอรากมอบสารอาหารทันที 0.05% ของเรทต่อวินาที (สูงสุด 0.5%)',
    enEffectDesc: 'Root clicks grant 0.05% of rate/sec instantly per piece (Max 0.5%)',
    baseCost: 500_000_000_000_000, // 500T
    color: '#f97316',
    maxPieces: 10,
  },

  // 🟣 EPIC (Weight: 8, Max: 5)
  {
    id: 'mycocore',
    name: 'ฟอสซิลไมคอร์ไรซาบรรพกาล',
    enName: 'Primordial Mycocore',
    icon: '🍄',
    desc: 'แก่นสปอร์บรรพบุรุษเชื้อราที่สร้างเครือข่ายเชื่อมโยงรากไม้ทั้งผืนโลก',
    enDesc: 'Ancestral fungal spore mass weaving expansive planetary root communication.',
    rarity: 'epic',
    dropWeight: 8,
    effectDesc: 'เครือข่ายราก (Synergies) ให้ผลผลิตเพิ่มขึ้น +0.005%/ต้น ต่อชิ้น (สูงสุด +0.025%)',
    enEffectDesc: 'Root Synergies yield +0.005%/unit per piece (Max +0.025%)',
    baseCost: 15_000_000_000_000_000, // 15Qa
    color: '#c084fc',
    maxPieces: 5,
  },
  {
    id: 'crown',
    name: 'มงกุฎพฤกษาปฐมกาล',
    enName: 'Crown of the First Tree',
    icon: '🏵️',
    desc: 'กิ่งก้านที่กลายเป็นหินของต้นไม้ต้นแรกของโลก เปล่งพลังสะท้อนอันไร้ขอบเขต',
    enDesc: 'Petrified crown boughs of the genesis tree, radiating timeless harmonic resonance.',
    rarity: 'epic',
    dropWeight: 8,
    effectDesc: 'สะท้อนราก (Echoes) ให้ตัวคูณเพิ่มขึ้น +0.2%/อัน ต่อชิ้น (สูงสุด +1.0%)',
    enEffectDesc: 'Root Echoes grant +0.2% multiplier per level per piece (Max +1.0%)',
    baseCost: 150_000_000_000_000_000, // 150Qa
    color: '#a855f7',
    maxPieces: 5,
  },
  {
    id: 'meteorite',
    name: 'อุกกาบาตฝังใต้พิภพ',
    enName: 'Subterranean Meteorite',
    icon: '🪐',
    desc: 'สะเก็ดดาวจากนอกระบบสุริยะที่ถูกรากดูดซับแร่ธาตุอวกาศเข้าสู่ลำต้น',
    enDesc: 'Extraterrestrial meteorite core infusing roots with rare cosmic minerals.',
    rarity: 'epic',
    dropWeight: 8,
    effectDesc: '+1.0% ตัวคูณสารอาหารทั้งหมดต่อชิ้น (สูงสุด +5.0% Multiplier)',
    enEffectDesc: '+1.0% global nutrient multiplier per piece (Max +5.0% Multiplier)',
    baseCost: 5_000_000_000_000_000_000, // 5Sx
    color: '#e879f9',
    maxPieces: 5,
  },

  // 🟡 LEGENDARY (Weight: 2, Max: 3)
  {
    id: 'ruintablet',
    name: 'แผ่นจารึกอารยธรรมใต้ดิน',
    enName: 'Ancient Ruin Tablet',
    icon: '🏛️',
    desc: 'ศิลาจารึกอักขระโบราณ บันทึกศาสตร์การเพาะปลูกและแตกหน่อของพฤกษาบรรพกาล',
    enDesc: 'Ancient inscribed tablet revealing esoteric agricultural wisdom and twin sprouting.',
    rarity: 'legendary',
    dropWeight: 2,
    effectDesc: 'เมื่อซื้อราก มีโอกาส +5% ต่อชิ้นที่จะแตกหน่อแถมรากฟรี +1 ต้น (สูงสุด 15%)',
    enEffectDesc: 'Purchasing roots has +5% chance/piece to sprout +1 free bonus root (Max 15%)',
    baseCost: 100_000_000_000_000_000_000, // 100Sx
    color: '#fbbf24',
    maxPieces: 3,
  },

  // 👑 MYTHIC (Weight: 0.5, Max: 1)
  {
    id: 'gaiacore',
    name: 'หัวใจแห่งไกอา',
    enName: 'Heart of Gaia',
    icon: '👑',
    desc: 'แก่นกลางของจิตวิญญาณแห่งโลก เมื่อค้นพบจะปลุกพลังโบราณวัตถุทุกชิ้นให้ทวีคูณเป็น 2 เท่า!',
    enDesc: 'Core spirit of the living Earth. Awakens and doubles (×2) all relic piece bonuses!',
    rarity: 'mythic',
    dropWeight: 0.5,
    effectDesc: '⭐ บูสต์พลังของชิ้นส่วนโบราณวัตถุทุกชิ้นขึ้นเป็น 2 เท่าถาวร!',
    enEffectDesc: '⭐ Permanently doubles (×2) the effects of all relic pieces!',
    baseCost: 10_000_000_000_000_000_000_000, // 10Sp
    color: '#f43f5e',
    maxPieces: 1,
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

export function relicCount(state: GameState, relicId: string): number {
  const val = state.relics?.[relicId];
  if (typeof val === 'number') return Math.max(0, val);
  return val ? 1 : 0;
}

export function hasRelic(state: GameState, relicId: string): boolean {
  return relicCount(state, relicId) > 0;
}

export function relicMaxed(state: GameState, relicId: string): boolean {
  const def = RELIC_DEFS.find(r => r.id === relicId);
  if (!def) return false;
  return relicCount(state, relicId) >= def.maxPieces;
}

export function totalRelicFragmentsCount(state: GameState): number {
  if (!state.relics) return 0;
  return RELIC_DEFS.reduce((sum, r) => sum + relicCount(state, r.id), 0);
}

export function relicsCount(state: GameState): number {
  if (!state.relics) return 0;
  return RELIC_DEFS.filter(r => hasRelic(state, r.id)).length;
}

export function isMasterRelicActive(state: GameState): boolean {
  return hasRelic(state, 'gaiacore');
}

export function relicMult(state: GameState, relicId: string): number {
  const count = relicCount(state, relicId);
  if (count <= 0) return 0;
  return isMasterRelicActive(state) && relicId !== 'gaiacore' ? count * 2 : count;
}

export function relicRateBonusMultiplier(state: GameState): number {
  let mult = 1;
  const amberMult = relicMult(state, 'amber');
  if (amberMult > 0) mult *= (1 + 0.005 * amberMult);

  const meteoriteMult = relicMult(state, 'meteorite');
  if (meteoriteMult > 0) mult *= (1 + 0.01 * meteoriteMult);

  return mult;
}

const DEEP_ROOT_IDS = new Set([
  'eternal', 'nexus', 'crystal', 'heart', 'seed', 'throne',
  'magma', 'aether', 'void', 'astral', 'chronos', 'singularity', 'genesis', 'yggdrasil'
]);

export function relicDeepRootsBonus(state: GameState, moduleId: string): number {
  if (!DEEP_ROOT_IDS.has(moduleId)) return 1;
  const aquiferMult = relicMult(state, 'aquifer');
  return aquiferMult > 0 ? 1 + 0.01 * aquiferMult : 1;
}

export function relicEventNutrientBonus(state: GameState): number {
  const m = relicMult(state, 'geode');
  return m > 0 ? 1 + 0.02 * m : 1;
}

export function relicOfflineBonus(state: GameState): { extraHours: number; effMultiplier: number } {
  const m = relicMult(state, 'chronolith');
  if (m === 0) return { extraHours: 0, effMultiplier: 1 };
  return {
    extraHours: 0.25 * m,
    effMultiplier: 1 + 0.01 * m,
  };
}

export function relicSynergyBonusPerUnit(state: GameState): number {
  const m = relicMult(state, 'mycocore');
  return m > 0 ? Math.round((0.08 + 0.005 * m) * 1000) / 1000 : 0.08;
}

export function relicEchoBonusPerEcho(state: GameState): number {
  const m = relicMult(state, 'crown');
  return m > 0 ? Math.round((0.05 + 0.002 * m) * 1000) / 1000 : 0.05;
}

export function relicBonusSproutChance(state: GameState): number {
  const m = relicMult(state, 'ruintablet');
  return m > 0 ? Math.min(0.50, m * 0.05) : 0;
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
  return RELIC_DEFS.filter(r => !relicMaxed(state, r.id));
}
