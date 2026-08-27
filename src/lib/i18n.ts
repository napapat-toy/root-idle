import { Language, SkinId, UIThemeId } from '@/types/game';
import { AchievementCategory } from '@/types/achievements';

export interface LocalizedModule {
  name: string;
  desc: string;
}

export interface LocalizedAchievement {
  title: string;
  desc: string;
}

export const MODULE_TRANSLATIONS: Record<string, Record<Language, LocalizedModule>> = {
  fine: {
    th: { name: 'รากฝอย', desc: 'รากเล็กจิ๋วที่แทรกดินหาความชื้น' },
    en: { name: 'Fine Root', desc: 'Tiny root hairs seeking subterranean moisture' },
  },
  nodule: {
    th: { name: 'ปมราก', desc: 'กักเก็บสารอาหารไว้ใช้ต่อเนื่อง' },
    en: { name: 'Root Nodule', desc: 'Stores nutrients for continuous nourishment' },
  },
  myco: {
    th: { name: 'เชื้อราไมคอร์ไรซา', desc: 'ทำงานร่วมกับรากเพื่อดูดซึมสารอาหารเพิ่ม' },
    en: { name: 'Mycorrhizae', desc: 'Symbiotic fungi boosting nutrient absorption' },
  },
  core: {
    th: { name: 'แก่นราก', desc: 'แกนรากลึกที่สูบสารอาหารมหาศาลจากใต้ดิน' },
    en: { name: 'Root Core', desc: 'Deep taproot pumping rich underground minerals' },
  },
  vine: {
    th: { name: 'เถารากยักษ์', desc: 'เถารากที่ชอนไชไปทั่วชั้นดินลึก' },
    en: { name: 'Giant Vine', desc: 'Expansive creeping vines burrowing through dense strata' },
  },
  bionode: {
    th: { name: 'ปมพลังงานชีวภาพ', desc: 'แปลงสารอินทรีย์เป็นพลังงานเข้มข้น' },
    en: { name: 'Bionode', desc: 'Transmutes organic matter into potent vital energy' },
  },
  eternal: {
    th: { name: 'รากอมตะ', desc: 'รากโบราณที่ไม่เคยหยุดเติบโต' },
    en: { name: 'Eternal Root', desc: 'Ancient perennial root that never ceases to grow' },
  },
  nexus: {
    th: { name: 'แก่นโลกใต้ดิน', desc: 'เชื่อมต่อกับแหล่งพลังงานใจกลางโลก' },
    en: { name: 'Subterranean Nexus', desc: 'Connects directly to the planetary molten energy core' },
  },
  crystal: {
    th: { name: 'ใยรากคริสตัล', desc: 'โครงสร้างรากที่ตกผลึกดูดพลังงานสูง' },
    en: { name: 'Crystal Tendril', desc: 'Crystallized lattices channeling concentrated resonance' },
  },
  heart: {
    th: { name: 'หัวใจราก', desc: 'ศูนย์กลางที่สูบฉีดพลังงานทั่วเครือข่ายราก' },
    en: { name: 'Root Heart', desc: 'Pulsing epicenter driving energy across the entire network' },
  },
  seed: {
    th: { name: 'เมล็ดพันธุ์อนันต์', desc: 'เมล็ดที่งอกซ้ำได้ไม่รู้จบ' },
    en: { name: 'Infinite Seed', desc: 'Sprouts endlessly in an unbroken loop of life' },
  },
  throne: {
    th: { name: 'บัลลังก์ราก', desc: 'จุดสูงสุดของเครือข่ายรากพิภพ' },
    en: { name: 'Root Throne', desc: 'The sovereign zenith of terrestrial root kingdoms' },
  },
  magma: {
    th: { name: 'รากแก่นแมกมา', desc: 'ชอนไชชั้นหินหลอมเหลวดูดซับความร้อนใต้พิภพ' },
    en: { name: 'Magma Taproot', desc: 'Bores through molten basalt to harness planetary heat' },
  },
  aether: {
    th: { name: 'รากไอธาตุบรรพกาล', desc: 'สัมผัสกระแสพลังงานบรรพกาลใต้แผ่นเปลือกโลก' },
    en: { name: 'Primordial Aether Root', desc: 'Channels ethereal currents swirling beneath tectonic plates' },
  },
  void: {
    th: { name: 'รากห้วงสุญญะ', desc: 'หยั่งลึกลงสู่รอยแยกมิติความว่างเปล่า' },
    en: { name: 'Void Abyss Root', desc: 'Delves into dimensional rifts to consume zero-point energy' },
  },
  astral: {
    th: { name: 'รากธารดวงดาวใต้พิภพ', desc: 'เชื่อมโยงสนามแม่เหล็กโลกกับละอองดวงดาว' },
    en: { name: 'Astral Rift Root', desc: 'Binds telluric geomagnetism with subterranean stardust' },
  },
  chronos: {
    th: { name: 'รากกาลเวลาบรรจบ', desc: 'รากที่เติบโตข้ามมิติเวลาดูดซับพลังงานทุกยุค' },
    en: { name: 'Chrono Taproot', desc: 'Transcends the timeline, drawing nourishment across eons' },
  },
  singularity: {
    th: { name: 'รากเอกภาวะมวลเข้มข้น', desc: 'จุดศูนย์กลางแรงดึงดูดดูดซับสารอาหารทุกอะตอม' },
    en: { name: 'Singularity Core Root', desc: 'Gravitational center vacuuming every nutrient particle' },
  },
  genesis: {
    th: { name: 'รากกำเนิดปฐมกาล', desc: 'รากต้นกำเนิดแห่งสิ่งมีชีวิตทั้งมวลใต้พิภพ' },
    en: { name: 'Genesis Root', desc: 'The primordial cradle of all subterranean living organisms' },
  },
  yggdrasil: {
    th: { name: 'รากต้นไม้โลก', desc: 'เสาค้ำจุนใต้พิภพ เชื่อมต่อมิติที่ไม่มีที่สิ้นสุด...' },
    en: { name: 'Yggdrasil World Root', desc: 'The cosmic pillar supporting boundless dimensions...' },
  },
};

export const STAGE_NAMES: Record<Language, string[]> = {
  th: [
    'ระยะเมล็ด',
    'รากงอกแรก',
    'เครือข่ายราก',
    'รากแผ่กว้าง',
    'ป่าใต้ดิน',
    'เขาวงกตราก',
    'อาณาจักรใต้พิภพ',
    'มิติพลังงานบรรพกาล',
    'แก่นเอกภาวะใต้โลก',
    'รากพฤกษาอนันต์กาล',
  ],
  en: [
    'Seedling Phase',
    'First Sprouts',
    'Root Network',
    'Expansive Roots',
    'Underground Forest',
    'Root Labyrinth',
    'Subterranean Realm',
    'Primordial Energy Plane',
    'Subterranean Singularity',
    'Eternal Yggdrasil Canopy',
  ],
};

export const CATEGORY_NAMES: Record<AchievementCategory, Record<Language, string>> = {
  roots: { th: 'การแผ่ขยายราก', en: 'Roots & Canopy' },
  economy: { th: 'เศรษฐกิจ & ผลผลิต', en: 'Economy & Yield' },
  prestige: { th: 'การหว่านใหม่', en: 'Prestige & Eternity' },
  luck: { th: 'โชคชะตา & อีเวนต์', en: 'Luck & Events' },
  skins: { th: 'สกิน & แฟชั่น', en: 'Skins & Aesthetics' },
  time: { th: 'เวลา & ความผูกพัน', en: 'Time & Dedication' },
};

export const SKIN_NAMES: Record<SkinId, Record<Language, string>> = {
  none: { th: '🪵 ไม้ธรรมชาติ (คลาสสิก)', en: '🪵 Natural Wood (Classic)' },
  rainbow: { th: '🌱 แยกตามชนิดราก (Module Spectrum)', en: '🌱 Root Species (Module Spectrum)' },
  sakura: { th: '🌸 ซากุระราตรี (Midnight Sakura)', en: '🌸 Midnight Sakura' },
  cafe: { th: '☕ คาเฟ่มัทฉะ (Matcha Cafe)', en: '☕ Matcha Cafe' },
  autumn: { th: '🍂 ใบไม้เปลี่ยนสี (Autumn Kyoto)', en: '🍂 Autumn Kyoto' },
  ocean: { th: '🌊 ห้วงสมุทรลึก (Abyssal Ocean)', en: '🌊 Abyssal Ocean' },
  frost: { th: '❄️ มหานทีเยือกแข็ง (Glacial Frost)', en: '❄️ Glacial Frost' },
  sunset: { th: '🏜️ อาทิตย์อัสดง (Sunset Dunes)', en: '🏜️ Sunset Dunes' },
  sameorigin: { th: '🌿 แยกตามแขนงต้นกำเนิด', en: '🌿 Lineage Ancestry' },
  mystic: { th: '🔮 ป่ามนตราแดนภูติ (Mystic Grove)', en: '🔮 Mystic Grove' },
  cyberpunk: { th: '⚡ ไซเบอร์พังก์ดาร์ก (Cyberpunk)', en: '⚡ Cyberpunk' },
  grayscale: { th: '⚫ ขาวดำโมโนโครม (Monochrome)', en: '⚫ Monochrome Slate' },
  gradient: { th: '🍃 เขียวมรกตป่าฝน (Emerald Lush)', en: '🍃 Emerald Rainforest' },
  nebula: { th: '🌌 มิติเนบิวลาอวกาศ (Cosmic Nebula)', en: '🌌 Cosmic Nebula' },
  imperial: { th: '🪙 มรดกทองคำราชันย์ (Imperial Gold)', en: '🪙 Imperial Gold' },
};

export const UI_THEME_NAMES: Record<UIThemeId, Record<Language, string>> = {
  classic: { th: '🪵 ดินธรรมชาติคลาสสิก (Classic Soil)', en: '🪵 Classic Earth Soil' },
  sakura: { th: '🌸 ซากุระราตรี (Midnight Sakura)', en: '🌸 Midnight Sakura' },
  cafe: { th: '☕ คาเฟ่มัทฉะ & โกโก้ (Matcha Cafe)', en: '☕ Cozy Matcha Cafe' },
  autumn: { th: '🍂 ใบไม้เปลี่ยนสีเกียวโต (Autumn Kyoto)', en: '🍂 Autumn Kyoto' },
  ocean: { th: '🌊 ห้วงสมุทรลึกเรืองแสง (Abyssal Ocean)', en: '🌊 Abyssal Bioluminescence' },
  frost: { th: '❄️ มหานทีเยือกแข็ง (Glacial Frost)', en: '❄️ Glacial Frost' },
  sunset: { th: '🏜️ อาทิตย์อัสดงโกลเด้นอาวร์ (Sunset Dunes)', en: '🏜️ Sunset Dunes' },
  mystic: { th: '🔮 ป่ามนตราแดนภูติ (Mystic Grove)', en: '🔮 Mystic Fairy Grove' },
  cyberpunk: { th: '⚡ ไซเบอร์พังก์นีออนราตรี (Cyberpunk)', en: '⚡ Cyberpunk Midnight' },
  grayscale: { th: '⚫ ขาวดำมินิมอลโมเดิร์น (Monochrome)', en: '⚫ Monochrome Slate' },
  emerald: { th: '🍃 เขียวมรกตป่าฝน (Emerald Rainforest)', en: '🍃 Emerald Rainforest' },
  nebula: { th: '🌌 มิติเนบิวลาอวกาศ (Cosmic Nebula)', en: '🌌 Cosmic Nebula' },
  imperial: { th: '🪙 ศิลาทองคำราชันย์ (Imperial Gold)', en: '🪙 Imperial Gold & Obsidian' },
};

export const ACHIEVEMENT_TRANSLATIONS: Record<string, Record<Language, LocalizedAchievement>> = {
  root_1: {
    th: { title: 'ก้าวแรกสู่ดิน', desc: 'ซื้อรากเสริมรวม 1 ต้น' },
    en: { title: 'First Rootlet', desc: 'Purchase 1 total root module' },
  },
  root_50: {
    th: { title: 'รากแตกแขนง', desc: 'มีรากเสริมรวมสะสม 50 ต้น' },
    en: { title: 'Branching Out', desc: 'Amass 50 total root modules' },
  },
  root_250: {
    th: { title: 'รากไม้พันปี', desc: 'มีรากเสริมรวมสะสม 250 ต้น' },
    en: { title: 'Centennial Roots', desc: 'Amass 250 total root modules' },
  },
  root_1000: {
    th: { title: 'พฤกษานิรันดร์', desc: 'มีรากเสริมรวมสะสม 1,000 ต้น' },
    en: { title: 'Evergreen Canopy', desc: 'Amass 1,000 total root modules' },
  },
  root_2500: {
    th: { title: 'อาณาจักรราก', desc: 'มีรากเสริมรวมสะสม 2,500 ต้น' },
    en: { title: 'Subterranean Empire', desc: 'Amass 2,500 total root modules' },
  },
  root_5000: {
    th: { title: 'เครือข่ายรากไร้ขอบเขต', desc: 'มีรากเสริมรวมสะสม 5,000 ต้น' },
    en: { title: 'Boundless Network', desc: 'Amass 5,000 total root modules' },
  },
  root_10000: {
    th: { title: 'ผืนป่าครอบพิภพ', desc: 'มีรากเสริมรวมสะสม 10,000 ต้น' },
    en: { title: 'Planet of Roots', desc: 'Amass 10,000 total root modules' },
  },
  root_25000: {
    th: { title: 'ผืนพิภพแห่งรากไม้', desc: 'มีรากเสริมรวมสะสม 25,000 ต้น' },
    en: { title: 'World of Deep Roots', desc: 'Amass 25,000 total root modules' },
  },
  root_50000: {
    th: { title: 'รากไม้โอบล้อมจักรวาล', desc: 'มีรากเสริมรวมสะสม 50,000 ต้น' },
    en: { title: 'Cosmic Canopy', desc: 'Amass 50,000 total root modules' },
  },
  fine_root_100: {
    th: { title: 'ทุ่งรากฝอย', desc: 'มีรากฝอย (Fine Roots) สะสม 100 ต้น' },
    en: { title: 'Meadow of Rootlets', desc: 'Amass 100 Fine Roots' },
  },
  fine_root_500: {
    th: { title: 'พรมรากฝอยใต้ดิน', desc: 'มีรากฝอย (Fine Roots) สะสม 500 ต้น' },
    en: { title: 'Subterranean Tapestry', desc: 'Amass 500 Fine Roots' },
  },
  fine_root_1000: {
    th: { title: 'มหาสมุทรรากฝอย', desc: 'มีรากฝอย (Fine Roots) สะสม 1,000 ต้น' },
    en: { title: 'Ocean of Rootlets', desc: 'Amass 1,000 Fine Roots' },
  },
  all_modules_unlocked: {
    th: { title: 'นักสะสมสายพันธุ์', desc: 'ปลดล็อกรากเสริมครบทุกชนิดในร้านค้า (21 สายพันธุ์)' },
    en: { title: 'Botanical Collector', desc: 'Unlock all 21 root species in the nursery' },
  },
  apex_root_1: {
    th: { title: 'กำเนิดรากต้นไม้โลก', desc: 'มีรากต้นไม้โลก (Yggdrasil) รากขั้นสูงสุดอย่างน้อย 1 ต้น' },
    en: { title: 'World Tree Sprout', desc: 'Possess at least 1 Yggdrasil Root' },
  },
  apex_root_10: {
    th: { title: 'เสาค้ำจุนใต้พิภพ', desc: 'มีรากต้นไม้โลก (Yggdrasil) อย่างน้อย 10 ต้น' },
    en: { title: 'Pillar of the Deep', desc: 'Possess at least 10 Yggdrasil Roots' },
  },
  apex_root_50: {
    th: { title: 'จักรพรรดิแห่งพฤกษาอนันต์', desc: 'มีรากต้นไม้โลก (Yggdrasil) อย่างน้อย 50 ต้น' },
    en: { title: 'Emperor of Yggdrasil', desc: 'Possess at least 50 Yggdrasil Roots' },
  },
  upgrade_1: {
    th: { title: 'อัพเกรดรากขั้นแรก', desc: 'อัพเกรดรากเสริมชนิดใดก็ได้แตะเลเวล 1' },
    en: { title: 'First Evolution', desc: 'Upgrade any root module to Level 1' },
  },
  upgrade_5: {
    th: { title: 'ก้าวกระโดด ×2', desc: 'อัพเกรดรากเสริมแตะเลเวล 5 (รับโบนัส ×2 Milestone)' },
    en: { title: 'Milestone Leap ×2', desc: 'Upgrade any root to Level 5 (Claim ×2 Milestone)' },
  },
  upgrade_10: {
    th: { title: 'พลังแห่งวิวัฒนาการ', desc: 'อัพเกรดรากเสริมชนิดใดก็ได้แตะเลเวล 10' },
    en: { title: 'Apex Mutation', desc: 'Upgrade any root module to Level 10' },
  },
  echo_1: {
    th: { title: 'สะท้อนรากแรก', desc: 'ซื้อสะท้อนราก (Echo) ครั้งแรก' },
    en: { title: 'First Resonance', desc: 'Purchase your first Root Echo' },
  },
  echo_10: {
    th: { title: 'สะท้อนประสานเสียง', desc: 'ซื้อสะท้อนรากสะสมรวม 10 ครั้ง' },
    en: { title: 'Harmonic Chorus', desc: 'Purchase 10 total Root Echoes' },
  },
  echo_all: {
    th: { title: 'เสียงก้องกังวานทั้งผืนดิน', desc: 'ปลดล็อกสะท้อนราก (Echo) ครบทั้ง 21 สายพันธุ์' },
    en: { title: 'Telluric Symphony', desc: 'Unlock Root Echo for all 21 species' },
  },
  synergy_1: {
    th: { title: 'สายสัมพันธ์แรก', desc: 'เปิดใช้งานเครือข่ายราก (Synergy) ชนิดใดก็ได้ 1 ชนิด' },
    en: { title: 'First Synergy', desc: 'Activate Root Synergy for any 1 species' },
  },
  synergy_10: {
    th: { title: 'โครงข่ายรากพิภพ', desc: 'เปิดใช้งานเครือข่ายราก (Synergy) สะสมครบ 10 ชนิด' },
    en: { title: 'Mycorrhizal Web', desc: 'Activate Root Synergy for 10 species' },
  },
  synergy_all: {
    th: { title: 'เอกภาพแห่งผืนดิน', desc: 'เปิดใช้งานเครือข่ายราก (Synergy) ครบทั้ง 21 สายพันธุ์' },
    en: { title: 'Unified Biosphere', desc: 'Activate Root Synergy for all 21 species' },
  },

  nutrients_1k: {
    th: { title: 'หยดน้ำสร้างป่า', desc: 'สะสมสารอาหารครบ 1,000 (1K)' },
    en: { title: 'Dewdrop Gathering', desc: 'Accumulate 1,000 (1K) nutrients' },
  },
  nutrients_1m: {
    th: { title: 'มหาเศรษฐีผืนดิน', desc: 'สะสมสารอาหารครบ 1,000,000 (1M)' },
    en: { title: 'Soil Millionaire', desc: 'Accumulate 1,000,000 (1M) nutrients' },
  },
  nutrients_1b: {
    th: { title: 'ขุมทรัพย์ใต้พิภพ', desc: 'สะสมสารอาหารครบ 1,000,000,000 (1B)' },
    en: { title: 'Subterranean Vault', desc: 'Accumulate 1,000,000,000 (1B) nutrients' },
  },
  nutrients_100b: {
    th: { title: 'ขุมพลังมหาศาล', desc: 'สะสมสารอาหารครบ 100,000,000,000 (100B)' },
    en: { title: 'Planetary Reservoir', desc: 'Accumulate 100 Billion (100B) nutrients' },
  },
  nutrients_1t: {
    th: { title: 'ความอุดมสมบูรณ์ไร้ขีดจำกัด', desc: 'สะสมสารอาหารครบ 1T (Trillion)' },
    en: { title: 'Infinite Bounty', desc: 'Accumulate 1 Trillion (1T) nutrients' },
  },
  nutrients_100t: {
    th: { title: 'ทะเลสาบสารอาหาร', desc: 'สะสมสารอาหารครบ 100T (100 Trillion)' },
    en: { title: 'Lake of Vitality', desc: 'Accumulate 100 Trillion (100T) nutrients' },
  },
  nutrients_1qa: {
    th: { title: 'พลังแห่งจักรวาล', desc: 'สะสมสารอาหารครบ 1Qa (Quadrillion)' },
    en: { title: 'Cosmic Sustenance', desc: 'Accumulate 1 Quadrillion (1Qa) nutrients' },
  },
  nutrients_100qa: {
    th: { title: 'มหาสมุทรแห่งชีวิต', desc: 'สะสมสารอาหารครบ 100Qa (100 Quadrillion)' },
    en: { title: 'Ocean of Genesis', desc: 'Accumulate 100 Quadrillion (100Qa) nutrients' },
  },
  nutrients_1qi: {
    th: { title: 'แก่นแท้แห่งสรรพสิ่ง', desc: 'สะสมสารอาหารครบ 1Qi (Quintillion)' },
    en: { title: 'Quintessence of Life', desc: 'Accumulate 1 Quintillion (1Qi) nutrients' },
  },
  nutrients_1sx: {
    th: { title: 'กำเนิดจักรวาลใหม่', desc: 'สะสมสารอาหารครบ 1Sx (Sextillion)' },
    en: { title: 'Genesis of Worlds', desc: 'Accumulate 1 Sextillion (1Sx) nutrients' },
  },
  nutrients_1sp: {
    th: { title: 'มหันตภัยสารอาหาร', desc: 'สะสมสารอาหารครบ 1Sp (Septillion)' },
    en: { title: 'Septillion Torrent', desc: 'Accumulate 1 Septillion (1Sp) nutrients' },
  },
  nutrients_1oc: {
    th: { title: 'ขุมพลังไร้ที่สิ้นสุด', desc: 'สะสมสารอาหารครบ 1Oc (Octillion)' },
    en: { title: 'Octillion Horizon', desc: 'Accumulate 1 Octillion (1Oc) nutrients' },
  },
  rate_10k: {
    th: { title: 'เร่งฝีเท้า', desc: 'ผลิตสารอาหารเกิน 10,000 / วินาที' },
    en: { title: 'Picking Up Speed', desc: 'Produce over 10,000 nutrients / sec' },
  },
  rate_10m: {
    th: { title: 'น้ำตกสารอาหาร', desc: 'ผลิตสารอาหารเกิน 10,000,000 / วินาที' },
    en: { title: 'Nutrient Torrent', desc: 'Produce over 10,000,000 nutrients / sec' },
  },
  rate_100b: {
    th: { title: 'พลังไหลบ่า', desc: 'ผลิตสารอาหารเกิน 100B / วินาที' },
    en: { title: 'Raging Surge', desc: 'Produce over 100 Billion nutrients / sec' },
  },
  rate_1t: {
    th: { title: 'มหาวาตภัยสารอาหาร', desc: 'ผลิตสารอาหารเกิน 1T / วินาที' },
    en: { title: 'Nutrient Tempest', desc: 'Produce over 1 Trillion nutrients / sec' },
  },
  rate_1qa: {
    th: { title: 'ดัชนีการเติบโตระดับดวงดาว', desc: 'ผลิตสารอาหารเกิน 1Qa / วินาที' },
    en: { title: 'Galactic Metabolism', desc: 'Produce over 1 Quadrillion nutrients / sec' },
  },
  rate_1qi: {
    th: { title: 'พลังขับเคลื่อนแห่งอนันต์', desc: 'ผลิตสารอาหารเกิน 1Qi / วินาที' },
    en: { title: 'Perpetual Singularity', desc: 'Produce over 1 Quintillion nutrients / sec' },
  },
  rate_1sx: {
    th: { title: 'คลื่นพลังเซกทิลเลียน', desc: 'ผลิตสารอาหารเกิน 1Sx / วินาที' },
    en: { title: 'Sextillion Surge', desc: 'Produce over 1 Sextillion nutrients / sec' },
  },
  rate_1sp: {
    th: { title: 'อัตราการเติบโตระดับดาราจักร', desc: 'ผลิตสารอาหารเกิน 1Sp / วินาที' },
    en: { title: 'Septillion Hyperdrive', desc: 'Produce over 1 Septillion nutrients / sec' },
  },

  prestige_1: {
    th: { title: 'วัฏจักรใหม่', desc: 'ทำการ Prestige (หว่านใหม่) ครั้งแรก' },
    en: { title: 'New Cycle', desc: 'Perform your first Prestige (Re-sow)' },
  },
  prestige_5: {
    th: { title: 'การเดินทางที่ไม่สิ้นสุด', desc: 'Prestige หว่านใหม่สะสมครบ 5 ครั้ง' },
    en: { title: 'Unending Pilgrimage', desc: 'Perform 5 total Prestiges' },
  },
  prestige_20: {
    th: { title: 'ผู้ตรัสรู้ใต้ดิน', desc: 'Prestige หว่านใหม่สะสมครบ 20 ครั้ง' },
    en: { title: 'Subterranean Enlightenment', desc: 'Perform 20 total Prestiges' },
  },
  prestige_50: {
    th: { title: 'วัฏสงสารนิรันดร์', desc: 'Prestige หว่านใหม่สะสมครบ 50 ครั้ง' },
    en: { title: 'Samsara of Roots', desc: 'Perform 50 total Prestiges' },
  },
  seeds_10: {
    th: { title: 'เก็บเกี่ยวเมล็ดพันธุ์', desc: 'มีเมล็ดนิรันดร์สะสมอย่างน้อย 10 เมล็ด' },
    en: { title: 'Seed Harvester', desc: 'Hold at least 10 Eternal Seeds' },
  },
  seeds_1k: {
    th: { title: 'คลังเมล็ดดวงดาว', desc: 'มีเมล็ดนิรันดร์สะสมอย่างน้อย 1,000 เมล็ด' },
    en: { title: 'Astral Silo', desc: 'Hold at least 1,000 Eternal Seeds' },
  },
  seeds_100k: {
    th: { title: 'มหาเศรษฐีเมล็ดนิรันดร์', desc: 'มีเมล็ดนิรันดร์สะสมอย่างน้อย 100,000 เมล็ด' },
    en: { title: 'Seed Tycoon', desc: 'Hold at least 100,000 Eternal Seeds' },
  },
  seeds_1m: {
    th: { title: 'สวนแห่งเทพนิรันดร์', desc: 'มีเมล็ดนิรันดร์สะสมอย่างน้อย 1,000,000 เมล็ด' },
    en: { title: 'Garden of Eden', desc: 'Hold at least 1,000,000 Eternal Seeds' },
  },
  seeds_10m: {
    th: { title: 'ดาราจักรเมล็ดพันธุ์', desc: 'มีเมล็ดนิรันดร์สะสมอย่างน้อย 10,000,000 เมล็ด' },
    en: { title: 'Cosmic Germination', desc: 'Hold at least 10,000,000 Eternal Seeds' },
  },
  seeds_50m: {
    th: { title: 'จอมราชันย์แห่งเมล็ดพันธุ์', desc: 'มีเมล็ดนิรันดร์สะสมอย่างน้อย 50,000,000 เมล็ด' },
    en: { title: 'Sovereign of Seeds', desc: 'Hold at least 50,000,000 Eternal Seeds' },
  },
  full_auto_unlocked: {
    th: { title: 'สายออโต้เต็มรูปแบบ', desc: 'ปลดล็อก ออโต้ราก + ออโต้อีเวนต์ + ออโต้หว่านใหม่ ครบทั้ง 3 สาย' },
    en: { title: 'Full Automation', desc: 'Unlock Auto-Root, Auto-Event, and Auto-Reset' },
  },
  golden_seed_max: {
    th: { title: 'เมล็ดทองคำเบ่งบาน', desc: 'อัพเกรดเมล็ดพันธุ์ทองคำ (Golden Seeds) แตะเลเวล 5' },
    en: { title: 'Gilded Blooms', desc: 'Max out Golden Seeds upgrade (Level 5)' },
  },
  lucky_duration_max: {
    th: { title: 'โชคชะตายืนยาว', desc: 'อัพเกรดระยะเวลาบัฟโชคดีครบ 20 วินาทีเต็ม (สูงสุด)' },
    en: { title: 'Enduring Fortune', desc: 'Extend Lucky Buff duration to 20 full seconds (Max)' },
  },

  event_1: {
    th: { title: 'ตาไวคว้าทัน', desc: 'คลิกเก็บอีเวนต์บนจอครั้งแรก' },
    en: { title: 'Swift Reflexes', desc: 'Claim your first floating event' },
  },
  event_25: {
    th: { title: 'นักล่าสมบัติ', desc: 'เก็บอีเวนต์สะสมครบ 25 ครั้ง' },
    en: { title: 'Bounty Hunter', desc: 'Claim 25 total floating events' },
  },
  event_100: {
    th: { title: 'ผู้ไม่เคยพลาด', desc: 'เก็บอีเวนต์สะสมครบ 100 ครั้ง' },
    en: { title: 'Vigilant Harvester', desc: 'Claim 100 total floating events' },
  },
  event_500: {
    th: { title: 'มือเก็บเกี่ยวแห่งตำนาน', desc: 'เก็บอีเวนต์สะสมครบ 500 ครั้ง' },
    en: { title: 'Legendary Collector', desc: 'Claim 500 total floating events' },
  },
  lucky_1: {
    th: { title: 'แจ็กพอตแห่งโชคชะตา', desc: 'ได้รับบัฟโชคดี 🍀 (×777) ครั้งแรก' },
    en: { title: 'Stroke of Luck', desc: 'Trigger the Lucky Clover 🍀 (×777) buff' },
  },
  lucky_10: {
    th: { title: 'เทพแห่งโชคลาภ', desc: 'ได้รับบัฟโชคดี 🍀 (×777) สะสมครบ 10 ครั้ง' },
    en: { title: 'Favored by Fortune', desc: 'Trigger the Lucky Clover 🍀 buff 10 times' },
  },
  super_jackpot: {
    th: { title: 'แจ็กพอตซ้อนแจ็กพอต', desc: 'เก็บกล่อง 🎁 ได้รับสารอาหารก้อนโตขณะมีบัฟโชคดีทำงานอยู่' },
    en: { title: 'Jackpot Resonance', desc: 'Open a gift 🎁 while Lucky Clover buff is active' },
  },

  skin_equip_custom: {
    th: { title: 'นักแต่งสวน', desc: 'สวมใส่สกินพิเศษรูปแบบใดก็ได้' },
    en: { title: 'Garden Stylist', desc: 'Equip any custom root skin' },
  },
  skins_all_unlocked: {
    th: { title: 'ตู้เสื้อผ้ารากไม้', desc: 'ปลดล็อกสกินในร้าน Prestige ครบทั้ง 4 รูปแบบ' },
    en: { title: 'Botanical Wardrobe', desc: 'Unlock all 4 prestige root skins' },
  },

  playtime_10m: {
    th: { title: 'รดน้ำอย่างใจเย็น', desc: 'เวลาเล่นสะสมรวมครบ 10 นาที' },
    en: { title: 'Patient Gardener', desc: 'Play for a total of 10 minutes' },
  },
  playtime_1h: {
    th: { title: 'ผู้เฝ้ามองราก', desc: 'เวลาเล่นสะสมรวมครบ 1 ชั่วโมง' },
    en: { title: 'Root Watcher', desc: 'Play for a total of 1 hour' },
  },
  playtime_12h: {
    th: { title: 'ป่าไม้ตลอดกาล', desc: 'เวลาเล่นสะสมรวมครบ 12 ชั่วโมง' },
    en: { title: 'Perennial Forest', desc: 'Play for a total of 12 hours' },
  },
  playtime_24h: {
    th: { title: 'ผู้พิทักษ์ผืนป่า', desc: 'เวลาเล่นสะสมรวมครบ 24 ชั่วโมง (1 วันเต็ม)' },
    en: { title: 'Keeper of the Deep', desc: 'Play for a total of 24 hours' },
  },
  offline_1h: {
    th: { title: 'กลับมาดูแล', desc: 'เก็บผลผลิตออฟไลน์ (Offline Gain) ที่หายไปเกิน 1 ชั่วโมง' },
    en: { title: 'Welcome Return', desc: 'Claim offline gains after 1+ hour away' },
  },
  offline_24h: {
    th: { title: 'การหลับใหลอันยาวนาน', desc: 'เก็บผลผลิตออฟไลน์ (Offline Gain) ที่หายไปเกิน 24 ชั่วโมง' },
    en: { title: 'Deep Slumber', desc: 'Claim offline gains after 24+ hours away' },
  },
};

export const UI_TEXTS = {
  th: {
    // Header & Currency
    nutrientsLabel: 'สารอาหาร',
    perSecond: '/วิ',
    eternalSeeds: 'เมล็ดนิรันดร์',
    rateBonus: 'โบนัสเรต',
    
    // Top Actions
    prestigeBtn: 'Prestige',
    wardrobeBtn: 'ตกแต่ง',
    statsTooltip: 'สถิติ & บันทึกการเติบโตของฉัน',
    achievementsTooltip: 'เหรียญความสำเร็จ: ปลดล็อกแล้ว {count} อัน (+{count}% เรต)',
    skinsTooltip: 'สกินปัจจุบัน: {name} (กดเพื่อเปลี่ยน)',
    wardrobeTooltip: 'ห้องแต่งตัว: เลือกสกินรากไม้ & ธีมหน้าต่าง UI',
    optionsTooltip: 'ตัวเลือก & การตั้งค่า & บันทึก',
    langToggleTooltip: 'เปลี่ยนภาษา / Switch Language (TH / EN)',
    autoOff: 'Auto ปิด',
    autoCheapest: 'ถูกสุด',
    autoSmart: 'ฉลาด',
    autoAll: 'ทั้งหมด',
    autoEvent: 'Event',
    autoReset: 'Reset',
    
    // Wardrobe & Cosmetics Modal
    wardrobeTitle: 'ห้องแต่งตัว & การตกแต่ง (Wardrobe)',
    tabRootSkins: '🌳 สกินรากไม้',
    tabUIThemes: '🖼️ ธีมหน้าต่าง UI',
    equipBtn: 'สวมใส่',
    equippedBadge: '✓ ใช้อยู่',
    tryPreviewBtn: '👁️ ลองใส่ดู',
    previewingBanner: '✨ กำลังทดลอง: {name}',
    exitPreviewBtn: '✕ ยกเลิกพรีวิว',
    buyInShopBtn: '🛒 ไปซื้อที่ร้าน Prestige',
    lockedInShop: '🔒 ปลดล็อกในร้าน Prestige ({cost} 🌌)',
    
    // Shop Panel
    modulesTitle: 'รากเสริม',
    level: 'Lv.',
    owned: 'มีอยู่',
    rate: 'เรต',
    milestoneTag: 'หลักชัย!',
    requires: 'ต้องการ {name} {req} ต้น (ตอนนี้มี {cur})',
    boostAll: 'เพิ่มผลผลิต {name} ทั้งหมด ×{mult}',
    echoTitle: 'สะท้อนราก: {name}',
    echoDesc: 'หล่อเลี้ยงและสะท้อนพลัง เพื่อรับโบนัสเรตรวมของทุกราก +1% ถาวร',
    echoActive: 'สะท้อนราก ×{count} (โบนัสรวม +{pct}%)',
    echoUnlockHint: 'ต้องมี {name} 100 ต้น & เลเวล 5 ขึ้นไปเพื่อปลดล็อก',
    
    // Modals - General
    close: 'ปิด',
    confirm: 'ยืนยัน',
    cancel: 'ยกเลิก',
    save: 'บันทึก',
    load: 'โหลด',
    delete: 'ลบ',
    copy: 'คัดลอก',
    copied: 'คัดลอกแล้ว ✓',
    importBtn: 'นำเข้า',
    exportBtn: 'ส่งออก',

    // Auto Reset Config Modal
    autoResetModalTitle: 'ตั้งค่าเป้าหมายหว่านใหม่อัตโนมัติ',
    autoResetModalDesc: 'กรุณากรอกจำนวน "เมล็ดนิรันดร์" ที่ต้องการให้ระบบหว่านใหม่อัตโนมัติ (เช่น พิมพ์ 1000 หรือ 10000)',
    autoResetInputPlaceholder: 'เช่น 1000',
    autoResetMinHint: '⚠️ ต้องกำหนดอย่างน้อย 10 เมล็ดขึ้นไป',
    autoResetLivePreview: '✨ ระบบจะหว่านใหม่อัตโนมัติเมื่อสะสมได้ครบ:',
    autoResetLivePreviewUnit: 'เมล็ด',
    autoResetConfirmBtn: 'ยืนยันและเปิดใช้งาน',
    autoResetSaveBtn: 'บันทึกการตั้งค่า',
    autoResetCurrentTarget: 'เป้าหมายปัจจุบัน: {target} เมล็ด',
    
    // Offline Modal
    welcomeBack: 'ยินดีต้อนรับกลับ',
    awayFor: 'คุณหายไป {duration}',
    claimGains: 'เก็บผลผลิต',
    gainedNutrients: '+{amount} สารอาหาร',
    
    // Prestige Modal
    prestigeTitle: 'การหว่านใหม่ (Prestige)',
    prestigeDesc: 'รีเซ็ตของทุกชนิด สารอาหาร อัพเกรด และปุ๋ยทั้งหมด — แต่ Echo และของร้าน Prestige คงอยู่ถาวร',
    gainedSeeds: '+{amount} เมล็ดนิรันดร์',
    currentSeeds: 'ตอนนี้มี {amount} เมล็ดนิรันดร์',
    confirmPrestigeBtn: 'ยืนยันหว่านใหม่',
    notEnoughSeeds: 'ยังไม่มีสารอาหารสะสมพอที่จะได้เมล็ดนิรันดร์เลย เก็บต่ออีกหน่อยก่อนนะ',
    prestigeShopTitle: 'ร้าน Prestige',
    prestigeSecEconomy: 'เศรษฐกิจ',
    prestigeSecAuto: 'ระบบอัตโนมัติ',
    prestigeSecSkins: 'สกินรากไม้',
    prestigeSecEvents: 'อีเวนต์ & โชคลาภ',
    prestigeSecOffline: 'การพักผ่อน (ออฟไลน์)',
    prestigeSecPassive: 'สารอาหารแฝง',
    ownedTag: 'ซื้อแล้ว',
    maxTag: 'MAX',
    
    // Achievements Modal
    achievementsTitle: 'เหรียญความสำเร็จ (Achievements)',
    allCategories: 'ทั้งหมด',
    unlockedProgress: 'ปลดล็อกแล้ว {unlocked} / {total} อัน (โบนัสเรตรวม +{pct}%)',
    achUnlocked: 'สำเร็จ',
    achLocked: 'ยังไม่สำเร็จ',
    
    // Stats Modal
    statsTitle: 'สถิติ & บันทึกการเติบโต',
    cardTimeTitle: 'เวลา & การเดินทาง',
    cardNutrientsTitle: 'ผลผลิต & สารอาหาร',
    cardPrestigeTitle: 'การหว่านใหม่ (Prestige)',
    cardRootsTitle: 'ราก & ความสำเร็จ',
    statTotalPlayTime: 'เวลาเล่นสะสมทั้งหมด',
    statRunPlayTime: 'เวลาในรอบปัจจุบัน',
    statGrowthStage: 'ระยะการเติบโต',
    statMaxOffline: 'เวลาพักออฟไลน์สูงสุด',
    statCurNutrients: 'สารอาหารปัจจุบัน',
    statRunEarned: 'ผลิตได้ในรอบนี้',
    statLifetimeNutrients: 'สารอาหารสะสมตลอดกาล',
    statPrestigeCount: 'จำนวนครั้งที่หว่านใหม่',
    statCurSeeds: 'เมล็ดนิรันดร์ปัจจุบัน',
    statLifetimeSeeds: 'เมล็ดนิรันดร์สะสมตลอดกาล',
    statTotalRoots: 'รากเสริมในรอบนี้',
    statAchievementsCount: 'เหรียญความสำเร็จ',
    statEventsClaimed: 'อีเวนต์ที่เก็บได้ทั้งหมด',
    statLuckyCount: 'แจ็กพอตโชคดี (🍀 ×777)',
    
    // Options Modal
    optionsTitle: 'ตัวเลือก & การตั้งค่า',
    langSelectorTitle: 'ภาษา / Language',
    automationTogglesTitle: 'สวิตช์ระบบออโต้ (เปิด/ปิด)',
    skinPickerTitle: 'สกินรากไม้ (Skins)',
    exportImportTitle: 'ส่งออก / นำเข้าเซฟ (Export / Import)',
    saveSlotsTitle: 'สล็อตบันทึกในเครื่องนี้ (Save Slots)',
    dangerZoneTitle: 'โซนอันตราย',
    hardResetBtn: '🗑️ ล้างข้อมูล / เริ่มใหม่จาก 0 ทั้งหมด',
    exportTitle: 'โค้ดเซฟของคุณ',
    exportDesc: 'คัดลอกเก็บไว้ แล้วนำไปวางตอน Import บนเครื่องอื่น — ข้อมูลครบทุกอย่าง ไม่มีอะไรหาย',
    importTitle: 'นำเข้าโค้ดเซฟ',
    importDesc: 'วางโค้ดที่คัดลอกมาจากเครื่องเดิม การนำเข้าจะเขียนทับ progress ปัจจุบัน',
    importPlaceholder: 'วางโค้ดตรงนี้',
    emptySlot: 'ว่าง',
    savedAtText: 'บันทึกเมื่อ {date} · {count} ต้น · {seeds} เมล็ด',
  },
  en: {
    // Header & Currency
    nutrientsLabel: 'Nutrients',
    perSecond: '/sec',
    eternalSeeds: 'Eternal Seeds',
    rateBonus: 'Rate Bonus',
    
    // Top Actions
    prestigeBtn: 'Prestige',
    wardrobeBtn: 'Wardrobe',
    statsTooltip: 'My Statistics & Growth Journey',
    achievementsTooltip: 'Achievements: Unlocked {count} (+{count}% Global Rate)',
    skinsTooltip: 'Current Skin: {name} (Click to toggle)',
    wardrobeTooltip: 'Wardrobe: Customize Root Skins & UI Themes',
    optionsTooltip: 'Options, Settings & Save Slots',
    langToggleTooltip: 'Switch Language / เปลี่ยนภาษา (EN / TH)',
    autoOff: 'Auto OFF',
    autoCheapest: 'Cheapest',
    autoSmart: 'Smart',
    autoAll: 'All',
    autoEvent: 'Event',
    autoReset: 'Reset',
    
    // Wardrobe & Cosmetics Modal
    wardrobeTitle: 'Wardrobe & Cosmetics',
    tabRootSkins: '🌳 Root Skins',
    tabUIThemes: '🖼️ UI Themes',
    equipBtn: 'Equip',
    equippedBadge: '✓ Equipped',
    tryPreviewBtn: '👁️ Try Preview',
    previewingBanner: '✨ Previewing: {name}',
    exitPreviewBtn: '✕ Exit Preview',
    buyInShopBtn: '🛒 Buy in Prestige Shop',
    lockedInShop: '🔒 Unlock in Prestige Shop ({cost} 🌌)',
    
    // Shop Panel
    modulesTitle: 'Root Modules',
    level: 'Lv.',
    owned: 'Owned',
    rate: 'Rate',
    milestoneTag: 'Milestone!',
    requires: 'Requires {name} ×{req} (Currently: {cur})',
    boostAll: 'Boosts all {name} production by ×{mult}',
    echoTitle: 'Root Echo: {name}',
    echoDesc: 'Resonate with this species for a permanent +1% global production rate bonus across all roots.',
    echoActive: 'Echo ×{count} (Global Bonus +{pct}%)',
    echoUnlockHint: 'Requires {name} ×100 & Level 5+ to unlock',
    
    // Modals - General
    close: 'Close',
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save',
    load: 'Load',
    delete: 'Delete',
    copy: 'Copy',
    copied: 'Copied ✓',
    importBtn: 'Import',
    exportBtn: 'Export',

    // Auto Reset Config Modal
    autoResetModalTitle: 'Configure Auto-Reset Target',
    autoResetModalDesc: 'Enter the number of "Eternal Seeds" required before triggering automatic re-sow (e.g. type 1000 or 10000)',
    autoResetInputPlaceholder: 'e.g. 1000',
    autoResetMinHint: '⚠️ Must be set to at least 10 seeds',
    autoResetLivePreview: '✨ Auto-reset will trigger upon reaching:',
    autoResetLivePreviewUnit: 'seeds',
    autoResetConfirmBtn: 'Confirm & Enable',
    autoResetSaveBtn: 'Save Settings',
    autoResetCurrentTarget: 'Current Target: {target} seeds',
    
    // Offline Modal
    welcomeBack: 'Welcome Back',
    awayFor: 'You were away for {duration}',
    claimGains: 'Harvest Produce',
    gainedNutrients: '+{amount} Nutrients',
    
    // Prestige Modal
    prestigeTitle: 'Prestige (Re-sow)',
    prestigeDesc: 'Reset all nutrients, root modules, and upgrades in exchange for Eternal Seeds — Echoes and Prestige upgrades remain forever.',
    gainedSeeds: '+{amount} Eternal Seeds',
    currentSeeds: 'Currently holding {amount} Eternal Seeds',
    confirmPrestigeBtn: 'Confirm Re-sow',
    notEnoughSeeds: 'Not enough accumulated nutrients to yield seeds yet. Grow a bit more first.',
    prestigeShopTitle: 'Prestige Shop',
    prestigeSecEconomy: 'Economy',
    prestigeSecAuto: 'Automation',
    prestigeSecSkins: 'Aesthetic Skins',
    prestigeSecEvents: 'Events & Fortune',
    prestigeSecOffline: 'Offline Rest',
    prestigeSecPassive: 'Passive Growth',
    ownedTag: 'OWNED',
    maxTag: 'MAX',
    
    // Achievements Modal
    achievementsTitle: 'Achievements',
    allCategories: 'All Categories',
    unlockedProgress: 'Unlocked {unlocked} / {total} (+{pct}% Global Rate Bonus)',
    achUnlocked: 'Completed',
    achLocked: 'Locked',
    
    // Stats Modal
    statsTitle: 'Growth & Journey Statistics',
    cardTimeTitle: 'Time & Journey',
    cardNutrientsTitle: 'Yield & Nutrients',
    cardPrestigeTitle: 'Prestige & Eternity',
    cardRootsTitle: 'Canopy & Achievements',
    statTotalPlayTime: 'Total Lifetime Playtime',
    statRunPlayTime: 'Current Cycle Time',
    statGrowthStage: 'Growth Stage',
    statMaxOffline: 'Max Offline Duration',
    statCurNutrients: 'Current Nutrients',
    statRunEarned: 'Harvested this Cycle',
    statLifetimeNutrients: 'Lifetime Nutrients',
    statPrestigeCount: 'Prestiges Performed',
    statCurSeeds: 'Current Eternal Seeds',
    statLifetimeSeeds: 'Lifetime Seeds Harvested',
    statTotalRoots: 'Active Roots this Cycle',
    statAchievementsCount: 'Achievements Unlocked',
    statEventsClaimed: 'Total Events Claimed',
    statLuckyCount: 'Lucky Jackpots (🍀 ×777)',
    
    // Options Modal
    optionsTitle: 'Options & Settings',
    langSelectorTitle: 'Language / ภาษา',
    automationTogglesTitle: 'Automation Switches (ON / OFF)',
    skinPickerTitle: 'Root Skins',
    exportImportTitle: 'Export / Import Save Code',
    saveSlotsTitle: 'Local Save Slots',
    dangerZoneTitle: 'Danger Zone',
    hardResetBtn: '🗑️ Wipe Data / Hard Reset from Scratch',
    exportTitle: 'Your Save Code',
    exportDesc: 'Copy this code to transfer your full game progress across devices anytime.',
    importTitle: 'Import Save Code',
    importDesc: 'Paste your save code below. Importing will overwrite your current progress.',
    importPlaceholder: 'Paste save code here',
    emptySlot: 'Empty',
    savedAtText: 'Saved on {date} · {count} roots · {seeds} seeds',
  },
};

export function t(lang: Language = 'th') {
  return UI_TEXTS[lang] || UI_TEXTS.th;
}
