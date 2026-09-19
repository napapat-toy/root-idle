import { PrestigeState, SkinId, UIThemeId } from '@/types/game';

export const AURA_ROOTS_COST = 500; // Starter skin (500 seeds)

export const SKIN_COSTS: Record<SkinId, number> = {
  none: 0,
  // 🟢 Tier 1: เมล็ดนิรันดร์ 🌌 (Starter / Natural Tier: 500 - 50,000 Seeds)
  rainbow: 500,
  sakura: 1000,
  cafe: 2500,
  autumn: 5000,
  ocean: 15000,
  frost: 30000,
  sameorigin: 50000,
  // 🟡 Tier 2: ละอองชีวิต 🌍 (Essence Tier: Costs in SKIN_ESSENCE_COSTS)
  sunset: 0,
  mystic: 0,
  grayscale: 0,
  gradient: 0,
  cyberpunk: 0,
  // 🌸 Tier 3: เกสรดวงดาว 🌸 (Astral Petals Tier: Costs in SKIN_PETAL_COSTS)
  nebula: 0,
  imperial: 0,
  timeless_aurora: 0,
  starlight_prism: 0,
  // 🏆 Subterranean Trials Exclusive Rewards
  drought: 0,
  obsidian: 0,
  eclipse: 0,
  permafrost: 0,
  fulminant: 0,
};

export const SKIN_ESSENCE_COSTS: Partial<Record<SkinId, number>> = {
  sunset: 200,
  mystic: 400,
  grayscale: 600,
  gradient: 800,
  cyberpunk: 1000,
};

export const SKIN_PETAL_COSTS: Partial<Record<SkinId, number>> = {
  nebula: 100,
  imperial: 150,
  timeless_aurora: 250,
  starlight_prism: 500,
};

export const UI_THEME_PETAL_COSTS: Partial<Record<UIThemeId, number>> = {
  subterranean_borealis: 50,
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
  eclipse: null,
  permafrost: null,
  fulminant: null,
  timeless_aurora: 'skinTimelessAurora',
  starlight_prism: 'skinStarlightPrism',
};

export const SKIN_DEFS: Array<{ id: SkinId; name: string; tier: 'starter' | 'mid' | 'luxury' | 'trial' | 'astral' | 'essence'; always?: boolean }> = [
  { id: 'none', name: 'ปกติ (ไม่มีสกิน)', tier: 'starter', always: true },
  // 🟢 Tier 1: เมล็ดนิรันดร์ 🌌
  { id: 'rainbow', name: '🌈 รุ้ง/ทอง', tier: 'starter' },
  { id: 'sakura', name: '🌸 ซากุระราตรี', tier: 'starter' },
  { id: 'cafe', name: '☕ คาเฟ่มัทฉะ', tier: 'starter' },
  { id: 'autumn', name: '🍂 ใบไม้เปลี่ยนสี', tier: 'starter' },
  { id: 'ocean', name: '🌊 ห้วงสมุทรลึก', tier: 'starter' },
  { id: 'frost', name: '❄️ มหานทีเยือกแข็ง', tier: 'starter' },
  { id: 'sameorigin', name: '🌿 รากเดียวกัน', tier: 'starter' },
  // 🟡 Tier 2: ละอองชีวิต 🌍
  { id: 'sunset', name: '🏜️ อาทิตย์อัสดง', tier: 'essence' },
  { id: 'mystic', name: '🔮 ป่ามนตราแดนภูติ', tier: 'essence' },
  { id: 'grayscale', name: '⚫ ขาวดำ', tier: 'essence' },
  { id: 'gradient', name: '🍃 เขียวมรกต', tier: 'essence' },
  { id: 'cyberpunk', name: '⚡ ไซเบอร์พังก์', tier: 'essence' },
  // 🌸 Tier 3: เกสรดวงดาว 🌸
  { id: 'nebula', name: '🌌 มิติเนบิวลา', tier: 'astral' },
  { id: 'imperial', name: '🪙 มรดกทองคำ', tier: 'astral' },
  { id: 'timeless_aurora', name: '🌸 ออโรร่าไร้กาลเวลา', tier: 'astral' },
  { id: 'starlight_prism', name: '✨ ผลึกคริสตัลดวงดาว', tier: 'astral' },
  // 🏆 Subterranean Trials
  { id: 'drought', name: '🏜️ ซาฮาราโบราณ', tier: 'trial' },
  { id: 'obsidian', name: '🌋 ออบซิเดียนเพลิง', tier: 'trial' },
  { id: 'eclipse', name: '🌑 สุริยคราสอนธการ', tier: 'trial' },
  { id: 'permafrost', name: '❄️ ผลึกเหมันต์นิรันดร์', tier: 'trial' },
  { id: 'fulminant', name: '⚡ สายฟ้าใต้ภพ', tier: 'trial' },
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
  'eclipse',
  'permafrost',
  'fulminant',
  'timeless_aurora',
  'starlight_prism',
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
  abyssal_eclipse: 0,
  boreal_tundra: 0,
  electromagnetic: 0,
  // 🌸 Astral Bloom Mythic Tier (Astral Petals 🌸)
  subterranean_borealis: 0,
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
  abyssal_eclipse: null,
  boreal_tundra: null,
  electromagnetic: null,
  subterranean_borealis: 'themeSubterraneanBorealis',
};

export const UI_THEME_DEFS: Array<{ id: UIThemeId; name: string; tier: 'starter' | 'mid' | 'luxury' | 'trial' | 'astral'; always?: boolean }> = [
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
  { id: 'abyssal_eclipse', name: '🌑 มหานครรัตติกาล', tier: 'trial' },
  { id: 'boreal_tundra', name: '❄️ ทุนดราเยือกแข็ง', tier: 'trial' },
  { id: 'electromagnetic', name: '⚡ คลื่นแม่เหล็กไฟฟ้านีออน', tier: 'trial' },
  { id: 'subterranean_borealis', name: '🌌 แสงเหนือใต้พิภพ', tier: 'astral' },
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
  'abyssal_eclipse',
  'boreal_tundra',
  'electromagnetic',
  'subterranean_borealis',
];

export function isSkinUnlocked(state: { prestige: PrestigeState; transcendence?: { completedTrials?: Record<string, boolean> } }, id: SkinId): boolean {
  if (id === 'none') return true;
  if (id === 'drought') return !!state.transcendence?.completedTrials?.arid_drought;
  if (id === 'obsidian') return !!state.transcendence?.completedTrials?.basalt_strata;
  if (id === 'eclipse') return !!state.transcendence?.completedTrials?.null_cycle;
  if (id === 'permafrost') return !!state.transcendence?.completedTrials?.permafrost;
  if (id === 'fulminant') return !!state.transcendence?.completedTrials?.geomagnetic_storm;
  const key = SKIN_PRESTIGE_KEYS[id];
  return key ? !!state.prestige[key] : false;
}

export function isUIThemeUnlocked(state: { prestige: PrestigeState; transcendence?: { completedTrials?: Record<string, boolean> } }, id: UIThemeId): boolean {
  if (id === 'classic') return true;
  if (id === 'void_sovereign') return !!state.transcendence?.completedTrials?.void_anomaly;
  if (id === 'abyssal_eclipse') return !!state.transcendence?.completedTrials?.null_cycle;
  if (id === 'boreal_tundra') return !!state.transcendence?.completedTrials?.permafrost;
  if (id === 'electromagnetic') return !!state.transcendence?.completedTrials?.geomagnetic_storm;
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
  eclipse: { th: 'ความมืดมิดแห่งสุริยคราสตัดกับแสงโคโรนาทองคำบริสุทธิ์', en: 'Midnight eclipse obsidian infused with solar corona gold arcs' },
  permafrost: { th: 'ผลึกน้ำแข็งบริสุทธิ์ยุคน้ำแข็งโบราณที่ไม่มีวันละลาย', en: 'Perpetual glacial frost crystals refracting pure arctic white' },
  fulminant: { th: 'แก่นไม้ที่มีสายฟ้าฟาดไหลเวียนตามเส้นใยรากตลอดกาล', en: 'Basalt wood channeled with eternal violet-cyan lightning arcs' },
  timeless_aurora: { th: 'ออโรร่าไร้กาลเวลา ลำต้นหินอวกาศทมิฬแทรกด้วยคลื่นแสงเหนือมรกต ม่วง และมาเจนตาสว่างไสว', en: 'Cosmic obsidian trunk illuminated by flowing waves of emerald, electric violet, and glowing magenta aurora' },
  starlight_prism: { th: 'ผลึกคริสตัลดวงดาว การหักเหแสงปริซึมเพชรสะท้อนรุ้งนีออน ทองคำบริสุทธิ์ และชมพูดวงดารา', en: 'Chromatic starlight diamond prism dispersing neon cyan, solar gold, and radiant celestial pink' },
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
  abyssal_eclipse: { th: 'ดำสนิทตัดขอบทองคำสุริยคราส โอ่อ่า สง่างาม เหนือกาลเวลา', en: 'Pitch black abyss bordered by brilliant solar corona gold' },
  boreal_tundra: { th: 'โทนน้ำเงินน้ำแข็งขั้วโลก ขอบคริสตัลฟ้าเรืองแสงและขาวหิมะ', en: 'Glacial arctic blue shell with luminous frost cyan borders' },
  electromagnetic: { th: 'ชาร์โคลดำพายุ ตัดกับขอบนีออนสายฟ้าม่วง-ไซยานสะกดสายตา', en: 'Storm charcoal slate with electric violet-cyan lightning borders' },
  subterranean_borealis: { th: 'รัตติกาลขั้วโลกใต้พิภพ มืดสนิทตัดกับขอบแสงเหนือออโรร่าไซยาน-มรกตเรืองรองดั่งเวทมนตร์', en: 'Polar midnight abyss framed by mesmerizing boreal cyan and arctic emerald glowing ribbons' },
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
  eclipse: ['#08060c', '#1a1424', '#eab308', '#fef08a'],
  permafrost: ['#051524', '#0284c7', '#7dd3fc', '#f0f9ff'],
  fulminant: ['#0a0814', '#7c3aed', '#a855f7', '#06b6d4'],
  timeless_aurora: ['#0a0715', '#10b981', '#8b5cf6', '#ec4899'],
  starlight_prism: ['#070b14', '#06b6d4', '#facc15', '#f43f5e'],
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
  abyssal_eclipse: ['#08060a', '#120f17', '#ca8a04', '#fef08a'],
  boreal_tundra: ['#06131f', '#0c2236', '#0284c7', '#bae6fd'],
  electromagnetic: ['#090714', '#130f24', '#9333ea', '#67e8f9'],
  subterranean_borealis: ['#040914', '#08233a', '#38bdf8', '#34d399'],
};
