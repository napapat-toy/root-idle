import { BiomeDef, GameState, RelicDef, RelicRarity } from '@/types/game';

export const RELIC_RARITY_INFO: Record<RelicRarity, { name: string; enName: string; color: string; badgeBg: string; icon: string }> = {
  common: { name: 'ทั่วไป', enName: 'Common', color: '#4ade80', badgeBg: 'rgba(74, 222, 128, 0.15)', icon: '🟢' },
  rare: { name: 'หายาก', enName: 'Rare', color: '#38bdf8', badgeBg: 'rgba(56, 189, 248, 0.15)', icon: '🔵' },
  epic: { name: 'มหากาพย์', enName: 'Epic', color: '#c084fc', badgeBg: 'rgba(192, 132, 252, 0.15)', icon: '🟣' },
  legendary: { name: 'ตำนาน', enName: 'Legendary', color: '#fbbf24', badgeBg: 'rgba(251, 191, 36, 0.15)', icon: '🟡' },
  mythic: { name: 'สิ่งศักดิ์สิทธิ์', enName: 'Mythic', color: '#f43f5e', badgeBg: 'rgba(244, 63, 94, 0.2)', icon: '👑' },
};

export const RELIC_MAX_PIECES: Record<RelicRarity, number> = {
  common: 1,
  rare: 1,
  epic: 1,
  legendary: 1,
  mythic: 1,
};

export const RELIC_DEFS: RelicDef[] = [
  // 🟢 COMMON (Weight: 50, Max: 1)
  {
    id: 'amber',
    name: 'อำพันดึกดำบรรพ์',
    enName: 'Primeval Amber',
    icon: '琥',
    desc: 'ยางไม้โบราณที่ผนึกหยดน้ำค้างล้านปี เสริมพลังการเติบโตของเซลล์รากทุกชนิดทั่วทั้งผืนดิน',
    enDesc: 'Ancient resin sealing primordial dewdrops, permanently vitalizing all subterranean root cells.',
    rarity: 'common',
    dropWeight: 50,
    effectDesc: 'เรทการผลิตรากทุกชนิด +50% (×1.50) ถาวร',
    enEffectDesc: '+50% (×1.50) production rate for all roots permanently',
    baseCost: 50_000_000_000,
    color: '#4ade80',
    maxPieces: 1,
  },
  {
    id: 'aquifer',
    name: 'ไข่มุกตาน้ำบาดาลลึก',
    enName: 'Abyssal Aquifer Pearl',
    icon: '🌊',
    desc: 'หยดน้ำบริสุทธิ์กลั่นตัวจากความดันล้านบรรยากาศใต้โลก หล่อเลี้ยงรากชั้นลึกให้ดูดซับสารอาหารได้ทวีคูณ',
    enDesc: 'Pure condensed droplet forged under extreme pressure, supercharging deep stratum roots.',
    rarity: 'common',
    dropWeight: 50,
    effectDesc: 'รากชั้นลึก (Tier 5 เถารากยักษ์ เป็นต้นไป) เรทผลิต ×3.0 เท่า',
    enEffectDesc: 'Deep roots (Tier 5 Giant Vine and beyond) yield ×3.0 rate',
    baseCost: 200_000_000_000,
    color: '#2dd4bf',
    maxPieces: 1,
  },

  // 🔵 RARE (Weight: 20, Max: 1)
  {
    id: 'geode',
    name: 'จีโอดคริสตัลโบราณ',
    enName: 'Ancient Crystal Geode',
    icon: '💎',
    desc: 'โพรงหินผลึกเรืองแสงที่สะท้อนแสงออโรร่าใต้พิภพ เร่งความถี่และดึงดูดสารอาหารบริสุทธิ์จากปรากฏการณ์ลึกลับ',
    enDesc: 'Luminescent crystal cavity accelerating event frequency and tripling rewards from anomaly orbs.',
    rarity: 'rare',
    dropWeight: 20,
    effectDesc: 'คูลดาวน์อีเวนต์ -35% & สารอาหารจากลูกแก้วเหตุการณ์ ×3.0 เท่า',
    enEffectDesc: 'Event orb cooldown -35% & event nutrients ×3.0',
    baseCost: 5_000_000_000_000,
    color: '#38bdf8',
    maxPieces: 1,
  },
  {
    id: 'chronolith',
    name: 'ศิลาบันทึกกาลเวลา',
    enName: 'Chronolith of Aeons',
    icon: '⏳',
    desc: 'ฟอสซิลหินที่จดจำการไหลผ่านของกาลเวลาใต้แผ่นเปลือกโลก ช่วยสะสมสารอาหารออฟไลน์และเร่งเวลาเมื่อกลับสู่สวน',
    enDesc: 'Fossilized strata capturing timeless subterranean currents, granting extra offline cap and Time Warp on return.',
    rarity: 'rare',
    dropWeight: 20,
    effectDesc: 'เพดานออฟไลน์ +12 ชม. & เมื่อกลับเข้าเกมรับบัฟกาลเวลา (Time Warp) ×2.0 นาน 15 นาที',
    enEffectDesc: '+12h offline cap & 15-minute ×2.0 Time Warp buff upon return',
    baseCost: 50_000_000_000_000,
    color: '#60a5fa',
    maxPieces: 1,
  },
  {
    id: 'magmastone',
    name: 'ศิลาแก่นเพลิงพิภพ',
    enName: 'Magmatic Corestone',
    icon: '🌋',
    desc: 'ผลึกหินหลอมเหลวที่ซึมซับพลังงานจากการเวียนว่ายตายเกิด ทุกครั้งที่หว่านใหม่และตื่นรู้จะทวีพลัง 3 เสาหลักอย่างถาวร',
    enDesc: 'Geothermal stone absorbing the cyclical energy of rebirth, stacking permanent bonuses from Prestige & Transcendence.',
    rarity: 'rare',
    dropWeight: 20,
    effectDesc: 'พลังแห่งการเวียนว่าย: Prestige (+1%) / ตื่นรู้ (+3%) มอบ Stack บูสต์ Synergy, Echoes, และเมล็ดนิรันดร์ (สูงสุด +100%)',
    enEffectDesc: 'Cycle Resonance: Prestige (+1%) / Transcendence (+3%) grants stack boosting Synergy, Echoes, & Seeds (Max +100%)',
    baseCost: 500_000_000_000_000,
    color: '#f97316',
    maxPieces: 1,
  },

  // 🟣 EPIC (Weight: 8, Max: 1)
  {
    id: 'mycocore',
    name: 'ฟอสซิลไมคอร์ไรซาบรรพกาล',
    enName: 'Primordial Mycocore',
    icon: '🍄',
    desc: 'แก่นสปอร์บรรพบุรุษเชื้อราที่สร้างเครือข่ายเชื่อมโยงรากไม้ทั้งผืนโลก เปลี่ยนรากต้นเกมเป็นแบตเตอรี่ส่งพลังอันมหาศาล',
    enDesc: 'Ancestral fungal network turning early roots into colossal synergy multipliers for top-tier root engines.',
    rarity: 'epic',
    dropWeight: 8,
    effectDesc: 'เครือข่ายราก (Synergies) ให้ผลผลิตเพิ่มเป็น +0.25%/ต้น (แรงขึ้น 3 เท่า!) และปลดล็อคเครือข่ายได้ตั้งแต่ 25 ต้น',
    enEffectDesc: 'Root Synergies yield +0.25%/unit (×3 power!) and unlocks earlier at 25 owned roots',
    baseCost: 15_000_000_000_000_000,
    color: '#c084fc',
    maxPieces: 1,
  },
  {
    id: 'crown',
    name: 'มงกุฎพฤกษาปฐมกาล',
    enName: 'Crown of the First Tree',
    icon: '🏵️',
    desc: 'กิ่งก้านที่กลายเป็นหินของต้นไม้ต้นแรกของโลก เปล่งพลังสะท้อนอันไร้ขอบเขตสู่รากไม้ทุกสายพันธุ์',
    enDesc: 'Petrified crown boughs of the genesis tree, radiating powerful harmonic echo resonance across the whole garden.',
    rarity: 'epic',
    dropWeight: 8,
    effectDesc: 'ตัวคูณสะท้อนราก (Echoes) เพิ่มขึ้น +1.5% ต่อระดับ Echo',
    enEffectDesc: 'Root Echoes grant +1.5% multiplier per echo level',
    baseCost: 150_000_000_000_000_000,
    color: '#a855f7',
    maxPieces: 1,
  },
  {
    id: 'meteorite',
    name: 'อุกกาบาตฝังใต้พิภพ',
    enName: 'Subterranean Meteorite',
    icon: '🪐',
    desc: 'สะเก็ดดาวจากนอกระบบสุริยะที่อุดมด้วยแร่ธาตุต่างมิติ กระตุ้นวิญญาณแห่งโลกให้มอบละอองชีวิตมากขึ้นเมื่อตื่นรู้',
    enDesc: 'Extraterrestrial meteorite core infusing roots with rare cosmic minerals, increasing Gaia Essences gained.',
    rarity: 'epic',
    dropWeight: 8,
    effectDesc: 'ได้รับจิตวิญญาณแห่งไกอา (Gaia Essences) เพิ่มขึ้น +50% เมื่อตื่นรู้',
    enEffectDesc: '+50% Gaia Essences earned upon Transcendence',
    baseCost: 5_000_000_000_000_000_000,
    color: '#e879f9',
    maxPieces: 1,
  },

  // 🟡 LEGENDARY (Weight: 2, Max: 1)
  {
    id: 'ruintablet',
    name: 'แผ่นจารึกอารยธรรมใต้ดิน',
    enName: 'Ancient Ruin Tablet',
    icon: '🏛️',
    desc: 'ศิลาจารึกอักขระโบราณ บันทึกศาสตร์การเพาะปลูกและแตกหน่อของพฤกษาบรรพกาล เพิ่มโอกาสงอกรากฟรีเมื่อทำการเพาะปลูก',
    enDesc: 'Ancient inscribed tablet revealing esoteric agricultural wisdom and spontaneous twin sprouting.',
    rarity: 'legendary',
    dropWeight: 2,
    effectDesc: 'เมื่อซื้อราก มีโอกาส 35% แตกหน่อแถมรากฟรี (+15% ลุ้นแตกหน่อคู่)',
    enEffectDesc: 'Purchasing roots has 35% chance for +1 free sprout (+15% twin sprout)',
    baseCost: 100_000_000_000_000_000_000,
    color: '#fbbf24',
    maxPieces: 1,
  },

  // 👑 MYTHIC (Weight: 0.5, Max: 1)
  {
    id: 'gaiacore',
    name: 'หัวใจแห่งไกอา',
    enName: 'Heart of Gaia',
    icon: '👑',
    desc: 'แก่นกลางของจิตวิญญาณแห่งโลก เมื่อค้นพบจะปลุกพลังโบราณวัตถุทุกชิ้นให้ทวีคูณเป็น 2 เท่าถาวร!',
    enDesc: 'Core spirit of the living Earth. Awakens and permanently doubles (×2) all relic master powers!',
    rarity: 'mythic',
    dropWeight: 0.5,
    effectDesc: '⭐ บูสต์พลังของโบราณวัตถุทุกชิ้นขึ้นเป็น 2 เท่า (×2) ถาวร!',
    enEffectDesc: '⭐ Permanently doubles (×2) the effects of all relics!',
    baseCost: 10_000_000_000_000_000_000_000,
    color: '#f43f5e',
    maxPieces: 1,
  },
];

export const TOTAL_RELICS = RELIC_DEFS.length;

export const BIOME_DEFS: BiomeDef[] = [
  {
    id: 'topsoil',
    name: 'การเดินทางใต้พิภพตามความลึก (Dynamic)',
    enName: 'Dynamic Subterranean Strata',
    desc: 'เปลี่ยนโทนสีและบรรยากาศฉากหลังโดยอัตโนมัติตามความลึกและการเติบโตของราก',
    enDesc: 'Canvas background dynamically transitions through underground strata as roots grow deeper',
    icon: '🧭',
    bgGradient: 'radial-gradient(ellipse at 50% 20%, #201a14 0%, #15100c 60%, #0d0a08 100%)',
    particleType: 'leaves',
    particleColor: 'rgba(143, 209, 122, 0.4)',
    ambientBonusDesc: 'ฉากหลังเปลี่ยนโทนสีตามชั้นความลึก 0m - 10,000m+ อัตโนมัติ',
    enAmbientBonusDesc: 'Adapts background dynamically across strata from 0m to 10,000m+',
    relicRequiredCount: 0,
  },
  {
    id: 'myco_abyss',
    name: 'หุบเหวเห็ดราเรืองแสง',
    enName: 'Bioluminescent Myco Abyss',
    desc: 'หุบเหวลึกที่ส่องสว่างด้วยละอองสปอร์ชีวภาพของไมคอร์ไรซา',
    enDesc: 'A luminous subterranean chasm bathed in glowing mycorrhizal spores',
    icon: '🍄',
    bgGradient: 'radial-gradient(ellipse at 50% 30%, #152218 0%, #0d160f 60%, #060a07 100%)',
    particleType: 'spores',
    particleColor: 'rgba(74, 222, 128, 0.5)',
    ambientBonusDesc: '+25% โบนัสจากเครือข่ายราก (Synergies)',
    enAmbientBonusDesc: '+25% Mycorrhizal Network Synergy Bonus',
    relicRequiredCount: 2,
  },
  {
    id: 'crystal_caverns',
    name: 'ถ้ำผลึกคริสตัลใต้พิภพ',
    enName: 'Subterranean Crystal Caverns',
    desc: 'ถ้ำที่ประดับด้วยผลึกแร่สะท้อนแสงหลากสีระยิบระยับ',
    enDesc: 'Prismatic cavern walls encrusted with shimmering telluric geode crystals',
    icon: '💎',
    bgGradient: 'radial-gradient(ellipse at 50% 30%, #12202b 0%, #0b151e 60%, #050a0f 100%)',
    particleType: 'crystals',
    particleColor: 'rgba(56, 189, 248, 0.5)',
    ambientBonusDesc: '+35% โอกาสและขนาดรางวัล Lucky Event',
    enAmbientBonusDesc: '+35% Lucky Event Trigger Chance & Magnitude',
    relicRequiredCount: 4,
  },
  {
    id: 'magma_mantle',
    name: 'แก่นหินหลอมเหลวแมกมา',
    enName: 'Magmatic Molten Mantle',
    desc: 'ชั้นหินหลอมเหลวใต้แผ่นเปลือกโลก แหล่งพลังงานความร้อนบรรพกาล',
    enDesc: 'Molten basalt currents circulating beneath tectonic plates, radiating primal heat',
    icon: '🌋',
    bgGradient: 'radial-gradient(ellipse at 50% 30%, #29120e 0%, #1c0b08 60%, #0e0504 100%)',
    particleType: 'embers',
    particleColor: 'rgba(239, 68, 68, 0.55)',
    ambientBonusDesc: '+20% โบนัสจากการอัปเกรดราก (Root Upgrades)',
    enAmbientBonusDesc: '+20% Root Species Upgrade Multipliers',
    relicRequiredCount: 6,
  },
  {
    id: 'sunken_ruins',
    name: 'ซากนครใต้พิภพโบราณ',
    enName: 'Sunken Ancient Metropolis',
    desc: 'ร่องรอยอารยธรรมโบราณที่สาบสูญ เต็มไปด้วยอักขระเวทมนตร์',
    enDesc: 'Drowned monuments of an arcane civilization carved with glowing petroglyphs',
    icon: '🏛️',
    bgGradient: 'radial-gradient(ellipse at 50% 30%, #201328 0%, #150c1b 60%, #09040d 100%)',
    particleType: 'runes',
    particleColor: 'rgba(232, 121, 249, 0.5)',
    ambientBonusDesc: '+20% เมล็ดพันธุ์นิรันดร์เมื่อหว่านใหม่ (Prestige)',
    enAmbientBonusDesc: '+20% Eternal Seeds upon Re-sow (Prestige)',
    relicRequiredCount: 8,
  },
  {
    id: 'gaia_sanctum',
    name: 'วิหารแห่งไกอา',
    enName: 'Sanctum of Gaia',
    desc: 'แก่นกลางของดวงดาว สถานที่สถิตของพลังงานชีวิตนิรันดร์',
    enDesc: 'The planetary core where primordial life essences flow in eternal equilibrium',
    icon: '🌌',
    bgGradient: 'radial-gradient(ellipse at 50% 30%, #2b2410 0%, #1c1709 60%, #0c0a03 100%)',
    particleType: 'stardust',
    particleColor: 'rgba(250, 204, 21, 0.6)',
    ambientBonusDesc: '+30% เรทการผลิตสารอาหารทั้งหมดในฟาร์ม',
    enAmbientBonusDesc: '+30% Global Nutrient Production Rate',
    relicRequiredCount: 10,
  },
];

// Helper functions for Relic & Biome bonuses

export function relicCount(state: GameState, relicId: string): number {
  const val = state.relics?.[relicId];
  if (typeof val === 'number') return val > 0 ? 1 : 0;
  return val ? 1 : 0;
}

export function hasRelic(state: GameState, relicId: string): boolean {
  return relicCount(state, relicId) > 0;
}

export function relicMaxed(state: GameState, relicId: string): boolean {
  return hasRelic(state, relicId);
}

export function totalRelicFragmentsCount(state: GameState): number {
  return relicsCount(state);
}

export function relicsCount(state: GameState): number {
  if (!state.relics) return 0;
  return RELIC_DEFS.filter(r => hasRelic(state, r.id)).length;
}

export function isMasterRelicActive(state: GameState): boolean {
  return hasRelic(state, 'gaiacore');
}

export function relicMult(state: GameState, relicId: string): number {
  if (!hasRelic(state, relicId)) return 0;
  return isMasterRelicActive(state) && relicId !== 'gaiacore' ? 2 : 1;
}

/**
 * Magmatic Corestone Cycle Resonance Stack:
 * Stacks permanent bonuses to Synergy, Echoes, and Eternal Seeds based on Prestige (+1%) and Transcendence (+3%).
 * Hard Safety Cap: +100% (+200% with Heart of Gaia).
 */
export function relicCycleResonanceStack(state: GameState): number {
  if (!hasRelic(state, 'magmastone')) return 0;
  const pCount = state.stats?.prestigeCount || 0;
  const tCount = state.transcendence?.count || 0;
  const raw = pCount * 1 + tCount * 3;
  const mult = relicMult(state, 'magmastone'); // 1 or 2 with Gaia
  const baseCap = 100;
  const maxCap = isMasterRelicActive(state) ? baseCap * 2 : baseCap;
  return Math.min(maxCap, raw * mult);
}

/**
 * Amber: +50% Global Rate (×1.50). With Gaia: +100% (×2.00).
 */
export function relicRateBonusMultiplier(state: GameState): number {
  let mult = 1;
  const amberMult = relicMult(state, 'amber');
  if (amberMult > 0) {
    mult *= (1 + 0.50 * amberMult);
  }
  return mult;
}

const DEEP_ROOT_IDS = new Set([
  'vine', 'bionode', 'eternal', 'nexus', 'crystal', 'heart', 'seed', 'throne',
  'magma', 'aether', 'void', 'astral', 'chronos', 'singularity', 'genesis', 'yggdrasil'
]);

/**
 * Aquifer: Deep roots (Tier 5 Vine and beyond) rate ×3.0 (with Gaia: ×6.0).
 */
export function relicDeepRootsBonus(state: GameState, moduleId: string): number {
  if (!DEEP_ROOT_IDS.has(moduleId)) return 1;
  const aquiferMult = relicMult(state, 'aquifer');
  if (aquiferMult === 0) return 1;
  return aquiferMult === 2 ? 6.0 : 3.0;
}

/**
 * Geode: Event nutrients ×3.0 (with Gaia: ×6.0).
 */
export function relicEventNutrientBonus(state: GameState): number {
  const m = relicMult(state, 'geode');
  if (m === 0) return 1;
  return m === 2 ? 6.0 : 3.0;
}

/**
 * Geode: Event cooldown -35% (0.65x). With Gaia: -50% (0.50x).
 */
export function relicEventCooldownMultiplier(state: GameState): number {
  const m = relicMult(state, 'geode');
  if (m === 0) return 1.0;
  return m === 2 ? 0.50 : 0.65;
}

/**
 * Chronolith: +12h offline cap & Time Warp ×2.0 (with Gaia: +24h & ×3.0).
 */
export function relicOfflineBonus(state: GameState): { extraHours: number; effMultiplier: number; warpMultiplier: number } {
  const m = relicMult(state, 'chronolith');
  if (m === 0) return { extraHours: 0, effMultiplier: 1, warpMultiplier: 1 };
  return {
    extraHours: 12 * m,
    effMultiplier: 1 + 0.5 * m,
    warpMultiplier: m === 2 ? 3.0 : 2.0,
  };
}

/**
 * Mycocore: Root Synergy yields +0.25%/unit (×3 power!) scaled by Cycle Resonance.
 */
export function relicSynergyBonusPerUnit(state: GameState): number {
  const m = relicMult(state, 'mycocore');
  const baseBonus = m > 0 ? (m === 2 ? 0.50 : 0.25) : 0.08;
  const cycleStack = relicCycleResonanceStack(state);
  return Math.round(baseBonus * (1 + cycleStack * 0.01) * 1000) / 1000;
}

/**
 * Mycocore: Reduces synergy unlock requirement from 50 to 25 roots.
 */
export function relicSynergyUnlockRequiredCount(state: GameState): number {
  return hasRelic(state, 'mycocore') ? 25 : 50;
}

/**
 * Crown: Root Echoes grant +1.5% multiplier per echo level scaled by Cycle Resonance.
 */
export function relicEchoBonusPerEcho(state: GameState): number {
  const m = relicMult(state, 'crown');
  const baseEcho = m > 0 ? (m === 2 ? 0.020 : 0.015) : 0.010;
  const cycleStack = relicCycleResonanceStack(state);
  return Math.round(baseEcho * (1 + cycleStack * 0.0025) * 10000) / 10000;
}

/**
 * Meteorite: +50% Gaia Essences earned upon Transcendence (with Gaia: +100%).
 */
export function relicTranscendenceEssenceBonus(state: GameState): number {
  const m = relicMult(state, 'meteorite');
  if (m === 0) return 1.0;
  return m === 2 ? 2.0 : 1.50;
}

/**
 * Ruin Tablet: 35% chance to sprout free bonus root (+15% twin sprout).
 * With Gaia: 50% chance (+25% twin sprout).
 */
export function relicBonusSproutChance(state: GameState): number {
  const m = relicMult(state, 'ruintablet');
  if (m === 0) return 0;
  return m === 2 ? 0.50 : 0.35;
}

export function relicBonusTwinSproutChance(state: GameState): number {
  const m = relicMult(state, 'ruintablet');
  if (m === 0) return 0;
  return m === 2 ? 0.25 : 0.15;
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
