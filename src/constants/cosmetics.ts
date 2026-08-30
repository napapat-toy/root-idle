import { PrestigeState, SkinId, UIThemeId } from '@/types/game';

export const AURA_ROOTS_COST = 100; // Starter skin (100 seeds)

export const SKIN_COSTS: Record<SkinId, number> = {
  none: 0,
  // 🟢 Starter Tier (100 - 500 Seeds)
  rainbow: 100,
  sakura: 250,
  cafe: 500,
  // 🟡 Mid-Tier (5,000 - 50,000 Seeds)
  autumn: 5000,
  ocean: 15000,
  frost: 30000,
  sunset: 50000,
  sameorigin: 50000,
  // 🟣 Luxury / Endgame Tier (250,000 - 1,000,000 Seeds)
  mystic: 250000,
  cyberpunk: 500000,
  grayscale: 500000,
  gradient: 750000,
  nebula: 1000000,
  imperial: 1000000,
  // 🏆 Subterranean Trials Exclusive Rewards
  drought: 0,
  obsidian: 0,
};

export const SKIN_PRESTIGE_KEYS: Record<SkinId, keyof PrestigeState | null> = {
  none: null,
  rainbow: 'auraRoots',
  sakura: 'skinSakura',
  cafe: 'skinCafe',
  autumn: 'skinAutumn',
  ocean: 'skinOcean',
  frost: 'skinFrost',
  sunset: 'skinSunset',
  sameorigin: 'skinSameOrigin',
  mystic: 'skinMystic',
  cyberpunk: 'skinCyberpunk',
  grayscale: 'skinGrayscale',
  gradient: 'skinGradient',
  nebula: 'skinNebula',
  imperial: 'skinImperial',
  drought: null,
  obsidian: null,
};

export const SKIN_DEFS: Array<{ id: SkinId; name: string; tier: 'starter' | 'mid' | 'luxury' | 'trial'; always?: boolean }> = [
  { id: 'none', name: 'ปกติ (ไม่มีสกิน)', tier: 'starter', always: true },
  { id: 'rainbow', name: '🌈 รุ้ง/ทอง', tier: 'starter' },
  { id: 'sakura', name: '🌸 ซากุระราตรี', tier: 'starter' },
  { id: 'cafe', name: '☕ คาเฟ่มัทฉะ', tier: 'starter' },
  { id: 'autumn', name: '🍂 ใบไม้เปลี่ยนสี', tier: 'mid' },
  { id: 'ocean', name: '🌊 ห้วงสมุทรลึก', tier: 'mid' },
  { id: 'frost', name: '❄️ มหานทีเยือกแข็ง', tier: 'mid' },
  { id: 'sunset', name: '🏜️ อาทิตย์อัสดง', tier: 'mid' },
  { id: 'sameorigin', name: '🌿 รากเดียวกัน', tier: 'mid' },
  { id: 'mystic', name: '🔮 ป่ามนตราแดนภูติ', tier: 'luxury' },
  { id: 'cyberpunk', name: '⚡ ไซเบอร์พังก์', tier: 'luxury' },
  { id: 'grayscale', name: '⚫ ขาวดำ', tier: 'luxury' },
  { id: 'gradient', name: '🍃 เขียวมรกต', tier: 'luxury' },
  { id: 'nebula', name: '🌌 มิติเนบิวลา', tier: 'luxury' },
  { id: 'imperial', name: '🪙 มรดกทองคำ', tier: 'luxury' },
  { id: 'drought', name: '🏜️ ซาฮาราโบราณ', tier: 'trial' },
  { id: 'obsidian', name: '🌋 ออบซิเดียนเพลิง', tier: 'trial' },
];

export const SKIN_CYCLE_ORDER: SkinId[] = [
  'none',
  'rainbow',
  'sakura',
  'cafe',
  'autumn',
  'ocean',
  'frost',
  'sunset',
  'sameorigin',
  'mystic',
  'cyberpunk',
  'grayscale',
  'gradient',
  'nebula',
  'imperial',
  'drought',
  'obsidian',
];

export const UI_THEME_COSTS: Record<UIThemeId, number> = {
  classic: 0,
  // 🟢 Tier 1: บรรยากาศธรรมชาติ & คาเฟ่ (5,000 – 25,000 🌌)
  sakura: 5000,
  cafe: 10000,
  autumn: 25000,
  // 🟡 Tier 2: ธาตุล้ำลึก & มหัศจรรย์ (100,000 – 500,000 🌌)
  ocean: 100000,
  frost: 200000,
  sunset: 350000,
  mystic: 500000,
  // 🟣 Tier 3: มหาจักรวาล & ราชันย์ (1,000,000 – 10,000,000 🌌)
  cyberpunk: 1000000,
  grayscale: 2500000,
  emerald: 5000000,
  nebula: 10000000,
  imperial: 10000000,
  // 🏆 Subterranean Trials Exclusive Reward
  void_sovereign: 0,
};

export const UI_THEME_PRESTIGE_KEYS: Record<UIThemeId, keyof PrestigeState | null> = {
  classic: null,
  sakura: 'themeSakura',
  cafe: 'themeCafe',
  autumn: 'themeAutumn',
  ocean: 'themeOcean',
  frost: 'themeFrost',
  sunset: 'themeSunset',
  mystic: 'themeMystic',
  cyberpunk: 'themeCyberpunk',
  grayscale: 'themeGrayscale',
  emerald: 'themeEmerald',
  nebula: 'themeNebula',
  imperial: 'themeImperial',
  void_sovereign: null,
};

export const UI_THEME_DEFS: Array<{ id: UIThemeId; name: string; tier: 'starter' | 'mid' | 'luxury' | 'trial'; always?: boolean }> = [
  { id: 'classic', name: '🪵 ดินธรรมชาติคลาสสิก', tier: 'starter', always: true },
  { id: 'sakura', name: '🌸 ซากุระราตรี', tier: 'starter' },
  { id: 'cafe', name: '☕ คาเฟ่มัทฉะ & โกโก้', tier: 'starter' },
  { id: 'autumn', name: '🍂 ใบไม้เปลี่ยนสีเกียวโต', tier: 'starter' },
  { id: 'ocean', name: '🌊 ห้วงสมุทรลึกเรืองแสง', tier: 'mid' },
  { id: 'frost', name: '❄️ มหานทีเยือกแข็ง', tier: 'mid' },
  { id: 'sunset', name: '🏜️ อาทิตย์อัสดงโกลเด้นอาวร์', tier: 'mid' },
  { id: 'mystic', name: '🔮 ป่ามนตราแดนภูติ', tier: 'mid' },
  { id: 'cyberpunk', name: '⚡ ไซเบอร์พังก์นีออนราตรี', tier: 'luxury' },
  { id: 'grayscale', name: '⚫ ขาวดำมินิมอลโมเดิร์น', tier: 'luxury' },
  { id: 'emerald', name: '🍃 เขียวมรกตป่าฝน', tier: 'luxury' },
  { id: 'nebula', name: '🌌 มิติเนบิวลาอวกาศ', tier: 'luxury' },
  { id: 'imperial', name: '🪙 ศิลาทองคำราชันย์', tier: 'luxury' },
  { id: 'void_sovereign', name: '🌌 จอมราชันย์แห่งสุญญะ', tier: 'trial' },
];

export const UI_THEME_ORDER: UIThemeId[] = [
  'classic',
  'sakura',
  'cafe',
  'autumn',
  'ocean',
  'frost',
  'sunset',
  'mystic',
  'cyberpunk',
  'grayscale',
  'emerald',
  'nebula',
  'imperial',
  'void_sovereign',
];

export function isSkinUnlocked(state: { prestige: PrestigeState; transcendence?: { completedTrials?: Record<string, boolean> } }, id: SkinId): boolean {
  if (id === 'none') return true;
  if (id === 'drought') return !!state.transcendence?.completedTrials?.arid_drought;
  if (id === 'obsidian') return !!state.transcendence?.completedTrials?.basalt_strata;
  const key = SKIN_PRESTIGE_KEYS[id];
  return key ? !!state.prestige[key] : false;
}

export function isUIThemeUnlocked(state: { prestige: PrestigeState; transcendence?: { completedTrials?: Record<string, boolean> } }, id: UIThemeId): boolean {
  if (id === 'classic') return true;
  if (id === 'void_sovereign') return !!state.transcendence?.completedTrials?.void_anomaly;
  const key = UI_THEME_PRESTIGE_KEYS[id];
  return key ? !!state.prestige[key] : false;
}
