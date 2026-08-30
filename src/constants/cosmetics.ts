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

export const SKIN_DESCRIPTIONS: Record<SkinId, { th: string; en: string }> = {
  none: { th: 'โทนไม้ธรรมชาติคลาสสิก อบอุ่น เรียบง่ายสไตล์เซน', en: 'Classic natural wooden roots, warm and rustic zen tone' },
  rainbow: { th: 'แยกสีรากตามชนิดโมดูลที่ซื้อ สดใสหลากสีสัน (Spectrum)', en: 'Colors branches distinctly based on root module species' },
  sakura: { th: 'บรรยากาศสวนซากุระยามค่ำคืน โทนกลีบชมพูซากุระหม่น', en: 'Midnight Kyoto sakura grove with dusky rose petals' },
  cafe: { th: 'กลิ่นอายมัทฉะตัดกับช็อกโกแลตเข้มข้น โทนโกโก้ & มัทฉะอุจิ', en: 'Cozy cafe vibes blending roasted cocoa and matcha green' },
  autumn: { th: 'ฤดูใบไม้ร่วงในเกียวโต โทนส้มอิฐเทอราคอตตาและทองอำพัน', en: 'Kyoto autumn foliage with burnt terracotta and golden amber' },
  ocean: { th: 'โลกใต้ทะเลลึกเรืองแสง โทนเขียวอมฟ้าและเทอร์ควอยซ์พรายน้ำ', en: 'Deep abyss bioluminescence with glowing seafoam teal' },
  frost: { th: 'รากไม้คริสตัลน้ำแข็งขั้วโลก โทนฟ้าไอซ์บลูและขาวหิมะบริสุทธิ์', en: 'Glacial frost crystal roots transitioning to pure white' },
  sunset: { th: 'แสงแดดสีทองยามเย็น โทนม่วงทไวไลท์ ส้มพีช และทองอัสดง', en: 'Golden hour twilight with sunset peach and amber horizon' },
  sameorigin: { th: 'แตกสีกิ่งย่อยตามตระกูลรากแก้วต้นทาง คุมโทนกิ่งหลัก', en: 'Branches inherit the distinct color family of parent root' },
  mystic: { th: 'ป่าเทพนิยายแฟนตาซี โทนลาเวนเดอร์แสงจันทร์และสปอร์เรืองแสง', en: 'Enchanted fairy grove with moonlight lilac and glowing spores' },
  cyberpunk: { th: 'นีออนล้ำยุคยามค่ำคืน โทนดำสนิทตัดกับนีออนไซยานและม่วง', en: 'High-contrast midnight cyber theme with neon cyan & purple' },
  grayscale: { th: 'โทนขาวดำคลาสสิก ไล่เฉดจากชาร์โคลสู่เงินสลัว สไตล์มินิมอล', en: 'Monochromatic dark theme from charcoal to satin silver' },
  gradient: { th: 'เขียวมรกตป่าฝนเขียวขจี ไล่จากเข้มที่ลำต้นไปอ่อนที่ปลายราก', en: 'Lush emerald rainforest gradient smoothly transitioning' },
  nebula: { th: 'ล่องลอยในห้วงอวกาศ โทนม่วงมิดไนท์ ละอองเนบิวลา และแสงดาว', en: 'Deep space cosmic nebula with starlight violet & galactic blue' },
  imperial: { th: 'วิหารทองคำจักรพรรดิ โทนหินภูเขาไฟตัดกับทองคำบริสุทธิ์', en: 'Imperial golden relic with obsidian stone and royal gold' },
  drought: { th: 'เนินทรายทะเลทรายโบราณ โทนดินเผาอบอุ่นและสีทรายผุกร่อน', en: 'Ancient desert dunes with warm terracotta and weathered sand' },
  obsidian: { th: 'หินแก้วออบซิเดียนภูเขาไฟแทรกด้วยรอยแยกธารลาวาเพลิง', en: 'Volcanic obsidian glass with glowing crimson magma fissures' },
};

export const UI_THEME_DESCRIPTIONS: Record<UIThemeId, { th: string; en: string }> = {
  classic: { th: 'หน้าต่างดินธรรมชาติ น้ำตาลดินอบอุ่น ครีม และเขียวมอสส์', en: 'Classic earthy soil windows with vanilla cream accents' },
  sakura: { th: 'พื้นหลังหมึกดำมิดไนท์ ตัดกับขอบไวน์กุหลาบและแสงชมพูซากุระ', en: 'Midnight ink-black shell with delicate sakura pink accents' },
  cafe: { th: 'แผงการ์ดดาร์กโกโก้อบอุ่น ปุ่มเขียวมัทฉะอุจิ และไฮไลต์ครีมนม', en: 'Rich dark cocoa panels with cozy matcha green buttons' },
  autumn: { th: 'ชาร์โคลอุ่น ตัดกับขอบส้มอิฐเทอราคอตตาและแสงทองอำพัน', en: 'Warm charcoal slate with burnt terracotta borders and amber glow' },
  ocean: { th: 'โทนก้นสมุทรลึก Deep Navy ขอบเทอร์ควอยซ์และปุ่มเรืองแสง', en: 'Deep abyssal navy shell with radiant turquoise borders' },
  frost: { th: 'อินเทอร์เฟซน้ำแข็งขั้วโลก ขอบคริสตัลไอซ์บลู และขาวหิมะ', en: 'Polar ice slate interface with crystal blue borders' },
  sunset: { th: 'แผงทไวไลท์พลัม ขอบส้มพีชยามเย็น และแสงทองอัสดง', en: 'Twilight plum panels with sunset peach borders & golden radiance' },
  mystic: { th: 'โทนไม้ดำป่าเวทมนตร์ ขอบลาเวนเดอร์ และแสงเรืองมิ้นต์ภูติ', en: 'Enchanted blackwood shell with moonlight lavender borders' },
  cyberpunk: { th: 'ดำออบซิเดียนสนิท ตัดกับขอบนีออนไซยานและม่วงอิเล็กทริก', en: 'Pure obsidian dark with high-contrast electric cyan & purple' },
  grayscale: { th: 'สไตล์มินิมอลโมเดิร์น โทนชาร์โคลพรีเมียมและขอบเงินซาติน', en: 'Ultra-clean monochromatic aesthetic with satin silver borders' },
  emerald: { th: 'ดำป่าลึกมรกต ขอบเขียวมรกตเจิดจรัส และแสงใบไม้ป่าฝน', en: 'Deep jungle obsidian with vibrant emerald green borders' },
  nebula: { th: 'ห้วงอวกาศมิดไนท์ การ์ดม่วงเนบิวลา ขอบแสงดาว และประกายกาแลกซี่', en: 'Midnight cosmic void with nebula purple cards and starlight' },
  imperial: { th: 'ศิลาภูเขาไฟออบซิเดียน ขอบทองคำบรอนซ์ และแสงทองคำบริสุทธิ์', en: 'Imperial volcanic stone with polished royal bronze borders' },
  void_sovereign: { th: 'มิติสุญญะมืดสนิท ตัดกับขอบนีออนคอสมิกอินดิโกและม่วงดวงดาว', en: 'Deep void dimension with radiant cosmic indigo borders' },
};

export const SKIN_SWATCHES: Record<SkinId, string[]> = {
  none: ['#8B5A2B', '#A0522D', '#CD853F', '#DEB887'],
  rainbow: ['#e08a8a', '#e0bb8a', '#8ae09b', '#8ab8e0', '#b78cf0'],
  sakura: ['#2a2228', '#b35d7f', '#f4a6bf', '#fff0f5'],
  cafe: ['#2b1e16', '#4a6741', '#8ca36f', '#f5ebd9'],
  autumn: ['#3b1e08', '#a44200', '#d4731f', '#f5b041'],
  ocean: ['#071e2c', '#0d5c75', '#14b8a6', '#67e8f9'],
  frost: ['#0c2538', '#2563eb', '#60a5fa', '#e0f2fe'],
  sunset: ['#241228', '#9333ea', '#f43f5e', '#fbbf24'],
  sameorigin: ['#4b5563', '#10b981', '#06b6d4', '#f59e0b'],
  mystic: ['#181028', '#7c3aed', '#a855f7', '#a7f3d0'],
  cyberpunk: ['#080811', '#06b6d4', '#ec4899', '#38bdf8'],
  grayscale: ['#18181b', '#52525b', '#a1a1aa', '#f4f4f5'],
  gradient: ['#062c19', '#059669', '#34d399', '#a7f3d0'],
  nebula: ['#0b0819', '#6366f1', '#ec4899', '#e0e7ff'],
  imperial: ['#181408', '#b45309', '#f59e0b', '#fef08a'],
  drought: ['#26190e', '#8c4a27', '#d97736', '#fcd34d'],
  obsidian: ['#0a0808', '#261414', '#dc2626', '#fb923c'],
};

export const THEME_SWATCHES: Record<UIThemeId, string[]> = {
  classic: ['#140e0a', '#1e1510', '#8b5a2b', '#f5ebd9'],
  sakura: ['#10121a', '#1e1422', '#db2777', '#fbcfe8'],
  cafe: ['#140f0c', '#201814', '#15803d', '#fef3c7'],
  autumn: ['#150e09', '#241710', '#c2410c', '#fef3c7'],
  ocean: ['#051017', '#0a1d29', '#0891b2', '#cffafe'],
  frost: ['#070f1a', '#0f1f33', '#0284c7', '#e0f2fe'],
  sunset: ['#130a17', '#221128', '#c026d3', '#fef08a'],
  mystic: ['#0d091a', '#18122c', '#9333ea', '#ccfbf1'],
  cyberpunk: ['#07070b', '#10101a', '#06b6d4', '#f472b6'],
  grayscale: ['#09090b', '#18181b', '#71717a', '#f4f4f5'],
  emerald: ['#04120a', '#082114', '#059669', '#a7f3d0'],
  nebula: ['#080714', '#120f26', '#4f46e5', '#f472b6'],
  imperial: ['#100f0c', '#1b1812', '#b45309', '#fef3c7'],
  void_sovereign: ['#080612', '#100d20', '#4f46e5', '#ddd6fe'],
};
