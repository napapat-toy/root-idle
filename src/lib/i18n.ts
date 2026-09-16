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
  relics: { th: 'โบราณวัตถุ & ชีวนิเวศ', en: 'Relics & Biomes' },
  gaia: { th: 'การตื่นรู้ & การทดลอง', en: 'Transcendence & Trials' },
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
  drought: { th: '🏜️ ซาฮาราโบราณ (Ancient Drought)', en: '🏜️ Ancient Drought' },
  obsidian: { th: '🌋 ออบซิเดียนเพลิง (Obsidian Magma)', en: '🌋 Obsidian Magma' },
  eclipse: { th: '🌑 คราสทมิฬ (Abyssal Eclipse)', en: '🌑 Abyssal Eclipse' },
  permafrost: { th: '❄️ เหมันต์นิรันดร์ (Permafrost)', en: '❄️ Permafrost Frostbite' },
  fulminant: { th: '⚡ พายุสายฟ้าฟาด (Fulminant Tempest)', en: '⚡ Fulminant Tempest' },
  timeless_aurora: { th: '🌸 ออโรร่าไร้กาลเวลา (Timeless Aurora)', en: '🌸 Timeless Aurora' },
  starlight_prism: { th: '✨ ผลึกคริสตัลดวงดาว (Starlight Prism)', en: '✨ Starlight Prism' },
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
  void_sovereign: { th: '🌌 จอมราชันย์แห่งสุญญะ (Void Sovereign)', en: '🌌 Void Sovereign' },
  abyssal_eclipse: { th: '🌑 สุริยุปราคาใต้พิภพ (Abyssal Eclipse)', en: '🌑 Abyssal Eclipse' },
  boreal_tundra: { th: '❄️ ทุ่งทุนดราเยือกแข็ง (Boreal Tundra)', en: '❄️ Boreal Tundra' },
  electromagnetic: { th: '⚡ สนามแม่เหล็กไฟฟ้า (Electromagnetic)', en: '⚡ Electromagnetic Storm' },
  subterranean_borealis: { th: '🌌 แสงเหนือใต้พิภพ (Subterranean Borealis)', en: '🌌 Subterranean Borealis' },
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
  apex_root_100: {
    th: { title: 'อิกดราซิลค้ำจุนทุกมิติ', desc: 'มีรากต้นไม้โลก (Yggdrasil) อย่างน้อย 100 ต้น' },
    en: { title: 'Cosmic Yggdrasil Domain', desc: 'Possess at least 100 Yggdrasil Roots' },
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
  nutrients_1no: {
    th: { title: 'มหาพิภพไร้ขอบเขต', desc: 'สะสมสารอาหารครบ 1No (Nonillion)' },
    en: { title: 'Nonillion Realm', desc: 'Accumulate 1 Nonillion (1No) nutrients' },
  },
  nutrients_1dc: {
    th: { title: 'แก่นสารอาหารจักรวาล', desc: 'สะสมสารอาหารครบ 1Dc (Decillion)' },
    en: { title: 'Decillion Cosmic Core', desc: 'Accumulate 1 Decillion (1Dc) nutrients' },
  },
  nutrients_1udc: {
    th: { title: 'มหาสมุทรพลังงานอนันต์', desc: 'สะสมสารอาหารครบ 1UDc (Undecillion)' },
    en: { title: 'Undecillion Energy Sea', desc: 'Accumulate 1 Undecillion (1UDc) nutrients' },
  },
  nutrients_1qadc: {
    th: { title: 'พฤกษากลืนมิติเวลา', desc: 'สะสมสารอาหารครบ 1QaDc (Quattuordecillion)' },
    en: { title: 'Spacetime Devourer', desc: 'Accumulate 1 Quattuordecillion (1QaDc) nutrients' },
  },
  nutrients_1vg: {
    th: { title: 'ผู้สร้างจักรวาลปฐมกาล', desc: 'สะสมสารอาหารครบ 1Vg (Vigintillion)' },
    en: { title: 'Primordial Demiurge', desc: 'Accumulate 1 Vigintillion (1Vg) nutrients' },
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
  rate_1oc: {
    th: { title: 'การระเบิดแห่งบิ๊กแบง', desc: 'ผลิตสารอาหารเกิน 1Oc / วินาที' },
    en: { title: 'Big Bang Burst', desc: 'Produce over 1 Octillion nutrients / sec' },
  },
  rate_1no: {
    th: { title: 'อัตราเร่งแห่งเอกภพ', desc: 'ผลิตสารอาหารเกิน 1No / วินาที' },
    en: { title: 'Universal Acceleration', desc: 'Produce over 1 Nonillion nutrients / sec' },
  },
  rate_1dc: {
    th: { title: 'มหาพฤกษาเหนือจักรวาล', desc: 'ผลิตสารอาหารเกิน 1Dc / วินาที' },
    en: { title: 'Trans-Cosmic Canopy', desc: 'Produce over 1 Decillion nutrients / sec' },
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
  passive_rate_10: {
    th: { title: 'การดูดซึมไม่หยุดนิ่ง', desc: 'อัพเกรดเรทสารอาหารพื้นฐานถาวร (Passive Rate) ในร้านหว่านใหม่แตะเลเวล 10' },
    en: { title: 'Continuous Absorption', desc: 'Upgrade Permanent Passive Rate to Level 10 in Prestige Shop' },
  },
  passive_rate_25: {
    th: { title: 'ชีพจรแห่งผืนดิน', desc: 'อัพเกรดเรทสารอาหารพื้นฐานถาวร (Passive Rate) ในร้านหว่านใหม่แตะเลเวล 25' },
    en: { title: 'Pulse of the Earth', desc: 'Upgrade Permanent Passive Rate to Level 25 in Prestige Shop' },
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
    th: { title: 'ตู้เสื้อผ้ารากไม้', desc: 'ปลดล็อกสกินรากไม้ในห้องแต่งตัวสะสมครบ 4 รูปแบบ' },
    en: { title: 'Botanical Wardrobe', desc: 'Unlock any 4 root skins in the Wardrobe' },
  },
  theme_equip_custom: {
    th: { title: 'จิตรกรแห่งผืนดิน', desc: 'สวมใส่ธีมหน้าต่าง UI พิเศษรูปแบบใดก็ได้ที่ไม่ใช่คลาสสิก' },
    en: { title: 'Subterranean Palette', desc: 'Equip any custom UI theme other than classic' },
  },
  theme_void_sovereign: {
    th: { title: 'ราชันย์แห่งมิติสุญญะ', desc: 'ปลดล็อกและสวมใส่ธีม UI [🌌 จอมราชันย์แห่งสุญญะ] จากการพิชิตการทดลอง' },
    en: { title: 'Void Sovereign Domain', desc: 'Unlock and equip the [🌌 Void Sovereign] UI Theme from trials' },
  },
  skins_collector_8: {
    th: { title: 'ผู้คลั่งไคล้แฟชั่นรากไม้', desc: 'ปลดล็อกสกินรากไม้ในห้องแต่งตัวสะสมครบ 8 รูปแบบ' },
    en: { title: 'Fashion Enthusiast', desc: 'Unlock 8 root skins in the Wardrobe' },
  },
  skins_collector_12: {
    th: { title: 'รันเวย์ใต้พิภพ', desc: 'ปลดล็อกสกินรากไม้ในห้องแต่งตัวสะสมครบ 12 รูปแบบ' },
    en: { title: 'Subterranean Runway', desc: 'Unlock 12 root skins in the Wardrobe' },
  },
  skin_nebula_unlocked: {
    th: { title: 'รากไม้แห่งดวงดาว', desc: 'ครอบครองสกินระดับสูง [🌌 มิติเนบิวลา] หรือ [🪙 มรดกทองคำ]' },
    en: { title: 'Astral Arborist', desc: 'Own luxury skin [🌌 Nebula] or [🪙 Golden Legacy]' },
  },
  skin_trial_champions: {
    th: { title: 'อาภรณ์แห่งผู้พิชิต', desc: 'ปลดล็อกสกินพิเศษจากการพิชิตการทดลองใต้พิภพอย่างน้อย 1 รูปแบบ' },
    en: { title: 'Conqueror\'s Regalia', desc: 'Unlock at least 1 subterranean trial skin' },
  },
  themes_collector_5: {
    th: { title: 'สถาปนิกส่วนหน้า', desc: 'ปลดล็อกธีมหน้าต่าง UI ในห้องแต่งตัวสะสมครบ 5 ธีม' },
    en: { title: 'Visual Architect', desc: 'Unlock 5 UI color themes in the Wardrobe' },
  },
  themes_collector_10: {
    th: { title: 'พหุภพแห่งผืนดิน', desc: 'ปลดล็อกธีมหน้าต่าง UI ในห้องแต่งตัวสะสมครบ 10 ธีม' },
    en: { title: 'Multiverse of Soils', desc: 'Unlock 10 UI color themes in the Wardrobe' },
  },
  skin_theme_match: {
    th: { title: 'คู่สีกลมกลืนแห่งธรรมชาติ', desc: 'สวมใส่สกินรากไม้และธีมหน้าต่าง UI ในเซ็ตธีมเดียวกัน (เช่น ซากุระคู่ซากุระ)' },
    en: { title: 'Harmonic Ensemble', desc: 'Equip a matching root skin and UI theme pair' },
  },
  wardrobe_grand_master: {
    th: { title: 'มหาจักรพรรดิแห่งแฟชั่นรากไม้', desc: 'ครอบครองสกินรากไม้ครบทุกแบบ และธีมหน้าต่างครบทุกแบบในเกม' },
    en: { title: 'Grand Haute Couture', desc: 'Own every single root skin and UI theme in the game' },
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

  // Relics & Biomes
  relic_1: {
    th: { title: 'ขุดพบโบราณคดีชิ้นแรก', desc: 'ค้นพบโบราณวัตถุใต้พิภพชิ้นแรก (ครอบครอง 1/1 Master Relic 1 ชิ้น)' },
    en: { title: 'First Unearthed Relic', desc: 'Discover your first subterranean 1/1 Master Relic' },
  },
  relic_5: {
    th: { title: 'นักสำรวจอารยธรรมโบราณ', desc: 'ครอบครองโบราณวัตถุระดับ Master สะสมครบ 5 ชิ้น' },
    en: { title: 'Subterranean Explorer', desc: 'Amass 5 Master Relics in your museum' },
  },
  relic_10: {
    th: { title: 'ผู้ครอบครองวัตถุบรรพกาล', desc: 'ครอบครองโบราณวัตถุใต้พิภพครบทั้ง 10 ชิ้นสมบูรณ์' },
    en: { title: 'Grand Master Archaeologist', desc: 'Possess all 10 subterranean Master Relics' },
  },
  relic_gaiacore: {
    th: { title: 'หัวใจแห่งไกอาตื่นรู้', desc: 'ค้นพบ [👑 หัวใจแห่งไกอา] โบราณวัตถุระดับ Mythic (ปลุกพลัง ×2 ทุกชิ้น)' },
    en: { title: 'Heart of Gaia Awakened', desc: 'Unearth the Mythic [👑 Heart of Gaia] relic (doubles all relic powers)' },
  },
  cycle_resonance_50: {
    th: { title: 'พลังการเวียนว่ายครึ่งทาง', desc: 'สะสมพลังการเวียนว่าย (Cycle Resonance Stack) จากศิลาแก่นเพลิงพิภพแตะ +50%' },
    en: { title: 'Harmonic Cycle Resonance', desc: 'Stack Cycle Resonance to +50% from Magmatic Corestone' },
  },
  cycle_resonance_100: {
    th: { title: 'เสียงสะท้อนแห่งวัฏสงสารสูงสุด', desc: 'สะสมพลังการเวียนว่าย (Cycle Resonance Stack) แตะขีดจำกัดสูงสุด (≥100%)' },
    en: { title: 'Apex Cycle Resonance', desc: 'Stack Cycle Resonance to the maximum safety cap (≥100%)' },
  },
  biome_switch: {
    th: { title: 'ก้าวสู่ถิ่นฐานใหม่', desc: 'สลับไปใช้ชีวนิเวศใต้พิภพอื่นที่ไม่ใช่ผิวดินชั้นบนเป็นครั้งแรก' },
    en: { title: 'New Subterranean Horizon', desc: 'Switch your active canvas biome away from standard topsoil' },
  },
  biome_sanctum: {
    th: { title: 'สู่วิหารแห่งไกอา', desc: 'ปลดล็อกและเปิดใช้งานชีวนิเวศระดับสูงสุด [🌌 วิหารแห่งไกอา]' },
    en: { title: 'Sanctum of the World Soul', desc: 'Unlock and activate the pinnacle [🌌 Sanctum of Gaia] biome' },
  },

  // Transcendence & Trials
  transcend_1: {
    th: { title: 'การตื่นรู้ของพฤกษา', desc: 'ทำการตื่นรู้แห่งไกอา (Grand Reset) สำเร็จครั้งแรก' },
    en: { title: 'Awakening of the Flora', desc: 'Perform your first Gaia Transcendence (Grand Reset)' },
  },
  transcend_5: {
    th: { title: 'จิตวิญญาณแห่งผืนพิภพ', desc: 'ทำการตื่นรู้แห่งไกอาสะสมครบ 5 ครั้ง' },
    en: { title: 'Avatar of the Living Earth', desc: 'Perform 5 total Gaia Transcendences' },
  },
  gaia_essences_50: {
    th: { title: 'ประกายชีวิตดึกดำบรรพ์', desc: 'ครอบครองละอองชีวิตดึกดำบรรพ์ (Gaia Essences) อย่างน้อย 50 ละออง' },
    en: { title: 'Primordial Spark', desc: 'Possess at least 50 Gaia Essences (🌍)' },
  },
  gaia_essences_500: {
    th: { title: 'คลังพลังงานแห่งไกอา', desc: 'ครอบครองละอองชีวิตดึกดำบรรพ์ (Gaia Essences) สะสมอย่างน้อย 500 ละออง' },
    en: { title: 'Vast Gaia Reservoir', desc: 'Accumulate at least 500 Gaia Essences (🌍)' },
  },
  gaia_essences_2500: {
    th: { title: 'มหาสมุทรวิญญาณแห่งโลก', desc: 'ครอบครองละอองชีวิตดึกดำบรรพ์ (Gaia Essences) สะสมอย่างน้อย 2,500 ละออง' },
    en: { title: 'Ocean of the World Soul', desc: 'Accumulate at least 2,500 Gaia Essences (🌍)' },
  },
  transcend_vigor_max: {
    th: { title: 'กายาปฐมกาลไร้เทียมทาน', desc: 'อัพเกรดแกนพลังปฐมกาล (Primordial Vigor) แตะเลเวล 20 (สูงสุด)' },
    en: { title: 'Apex Primordial Vigor', desc: 'Upgrade Primordial Vigor to max Level 20' },
  },
  transcend_soil_memory_max: {
    th: { title: 'ความทรงจำผืนดิน 100%', desc: 'อัพเกรดความทรงจำของผืนดิน (Soil Memory) แตะเลเวล 10 (คง Echoes ไว้ 100%)' },
    en: { title: 'Total Soil Memory', desc: 'Upgrade Soil Memory to max Level 10 (retains 100% Echoes)' },
  },
  trial_first_clear: {
    th: { title: 'ผู้ก้าวข้ามการทดสอบ', desc: 'พิชิตการทดลองแห่งผืนพิภพสำเร็จเป็นครั้งแรก (ปลูกต้นไม้โลกครบ 25 ต้นภายใต้ข้อจำกัด)' },
    en: { title: 'Trial Breakthrough', desc: 'Conquer any subterranean trial (25 Yggdrasils under restriction)' },
  },
  trial_arid_drought: {
    th: { title: 'ผู้พิชิตแดนกันดาร', desc: 'พิชิตการทดลอง [🏜️ ดินแล้งกันดาร] สำเร็จ (ปลูกรากต้นไม้โลกครบ 25 ต้น)' },
    en: { title: 'Drought Breaker', desc: 'Conquer the [🏜️ Arid Drought] trial (Grow 25 World Trees)' },
  },
  trial_basalt_strata: {
    th: { title: 'ผู้ทะลวงหินอัคนี', desc: 'พิชิตการทดลอง [🌋 ชั้นหินอัคนีทึบ] สำเร็จ (ปลูกรากต้นไม้โลกครบ 25 ต้น)' },
    en: { title: 'Basalt Shatterer', desc: 'Conquer the [🌋 Basalt Strata] trial (Grow 25 World Trees)' },
  },
  trial_void_anomaly: {
    th: { title: 'ผู้พิชิตมิติสูญญะ', desc: 'พิชิตการทดลอง [🌌 รอยแยกสูญญะ] สำเร็จ โดยไม่พึ่งพาระบบบอทอัตโนมัติ' },
    en: { title: 'Void Defier', desc: 'Conquer the [🌌 Void Anomaly] trial with all automation suppressed' },
  },
  trial_null_cycle: {
    th: { title: 'ผู้พิชิตวงจรศูนย์', desc: 'พิชิตการทดลอง [🌑 วงจรศูนย์] สำเร็จ โดยปราศจากโบนัสเรทจาก Prestige' },
    en: { title: 'Null Cycle Conqueror', desc: 'Conquer the [🌑 Null Cycle] trial with 0% Prestige rate bonus' },
  },
  trial_permafrost: {
    th: { title: 'ผู้ฝ่าพายุเหมันต์', desc: 'พิชิตการทดลอง [❄️ เหมันต์เยือกแข็ง] สำเร็จ ท่ามกลางสภาพอากาศหนาวเหน็บ' },
    en: { title: 'Permafrost Survivor', desc: 'Conquer the [❄️ Permafrost] trial under severe freezing delays' },
  },
  trial_geomagnetic_storm: {
    th: { title: 'ผู้ต้านพายุแม่เหล็ก', desc: 'พิชิตการทดลอง [⚡ พายุสนามแม่เหล็ก] สำเร็จ โดยปราศจากพลังสะท้อนของ Echo' },
    en: { title: 'Geomagnetic Tamer', desc: 'Conquer the [⚡ Geomagnetic Storm] trial with Echo bonus suppressed' },
  },
  trial_all_conquered: {
    th: { title: 'ราชันย์ผู้พิชิตใต้พิภพ', desc: 'พิชิตบททดสอบแห่งผืนพิภพครบทั้ง 6 ด่านสมบูรณ์แบบ' },
    en: { title: 'Conqueror of the Depths', desc: 'Conquer all 6 Subterranean Trials' },
  },
  gaia_touch_max: {
    th: { title: 'หัตถ์แห่งเทพพิภพ', desc: 'อัพเกรดสัมผัสแห่งไกอา (Gaia Touch) แตะเลเวล 10 (สูงสุด)' },
    en: { title: 'Touch of the Earth Goddess', desc: 'Upgrade Gaia Touch to max Level 10' },
  },
  echo_resonance_max: {
    th: { title: 'กังวานคลื่นไร้ขีดจำกัด', desc: 'อัพเกรดความกังวานแห่งเสียงสะท้อน (Echo Resonance) แตะเลเวล 5 (สูงสุด)' },
    en: { title: 'Limitless Resonance', desc: 'Upgrade Echo Resonance to max Level 5' },
  },
  primordial_seedling_max: {
    th: { title: 'พงไพรจากเศษดิน', desc: 'อัพเกรดต้นกล้าปฐมกาล (Primordial Seedling) แตะเลเวล 5 (สูงสุด)' },
    en: { title: 'Primeval Sprout Master', desc: 'Upgrade Primordial Seedling to max Level 5' },
  },
  gaia_meditation_max: {
    th: { title: 'สมาธิลึกใต้พิภพ', desc: 'อัพเกรดสมาธิลึก (Deep Meditation) แตะเลเวล 5 (สูงสุด)' },
    en: { title: 'Subterranean Nirvana', desc: 'Upgrade Deep Meditation to max Level 5' },
  },
  gaia_blessing_1: {
    th: { title: 'ก้าวข้ามขีดจำกัดแห่งไกอา', desc: 'อัพเกรดพรแห่งไกอา (Gaia\'s Blessing) แตะเลเวล 1' },
    en: { title: 'First Blessing', desc: 'Upgrade Gaia\'s Blessing to Level 1' },
  },
  gaia_blessing_10: {
    th: { title: 'พรอันเป็นนิรันดร์', desc: 'อัพเกรดพรแห่งไกอาสะสมครบเลเวล 10 (+50% ละอองไกอา)' },
    en: { title: 'Eternal Blessing', desc: 'Upgrade Gaia\'s Blessing to Level 10 (+50% Essences)' },
  },
  hyperdrive_unlock: {
    th: { title: 'เร่งความเร็วมิติกาลเวลา', desc: 'ปลดล็อกตัวเร่งเวลา 2x Hyperdrive Overclock ในผังจิตวิญญาณไกอา' },
    en: { title: 'Dimensional Overclock', desc: 'Unlock the 2x Hyperdrive Overclock in the Gaia Tree' },
  },
  aurora_bloom_unlock: {
    th: { title: 'ปรากฏการณ์แสงเหนือใต้พิภพ', desc: 'ปลดล็อกออโรร่าบลูม (Aurora Bloom) เพื่อเรียกสปอร์ออโรร่าและเตาหลอมกลีบดวงดาว' },
    en: { title: 'Aurora Bloom Awakening', desc: 'Unlock Aurora Bloom to manifest Aurora Spores and the Petal Altar' },
  },
  astral_petal_1: {
    th: { title: 'ละอองกลีบดวงดาราแรก', desc: 'เก็บหรือหลอมกลีบดอกไม้ดวงดาว (Astral Petals) ชิ้นแรกสำเร็จ' },
    en: { title: 'First Starlight Petal', desc: 'Collect or transmute your first Astral Petal' },
  },
  astral_petal_10: {
    th: { title: 'มาลัยดอกไม้แห่งฟากฟ้า', desc: 'ครอบครองกลีบดอกไม้ดวงดาวสะสมอย่างน้อย 10 กลีบ' },
    en: { title: 'Garland of the Cosmos', desc: 'Accumulate at least 10 Astral Petals' },
  },
  astral_petal_50: {
    th: { title: 'สวนบุปผาดวงดารานิรันดร์', desc: 'ครอบครองกลีบดอกไม้ดวงดาวสะสมครบ 50 กลีบ (พร้อมแลกธีมหน้าต่างแสงเหนือ)' },
    en: { title: 'Eternal Astral Garden', desc: 'Accumulate 50 Astral Petals (ready for Borealis Theme)' },
  },
  astral_petal_500: {
    th: { title: 'มหาดวงดาราคอสมิกแห่งไกอา', desc: 'ครอบครองกลีบดอกไม้ดวงดาวสะสมครบ 500 กลีบ (พร้อมแลกสกินระดับสูงสุด)' },
    en: { title: 'Cosmic Star of Gaia', desc: 'Accumulate 500 Astral Petals (ready for the ultimate skin)' },
  },
  skin_first_wardrobe: {
    th: { title: 'อาภรณ์ชิ้นแรก', desc: 'ปลดล็อกสกินรากไม้หรือธีมหน้าต่างตกแต่งชิ้นแรก' },
    en: { title: 'First Vestment', desc: 'Unlock your first root skin or UI window theme' },
  },
  theme_subterranean_borealis: {
    th: { title: 'มงกุฎแสงเหนือใต้พิภพ', desc: 'ปลดล็อกธีมหน้าต่าง UI ระดับ Mythic [🌌 แสงเหนือใต้พิภพ (Subterranean Borealis)]' },
    en: { title: 'Subterranean Borealis Canopy', desc: 'Unlock the Mythic [🌌 Subterranean Borealis] UI Theme' },
  },
  skin_timeless_aurora: {
    th: { title: 'รัตติกาลไร้กาลเวลา', desc: 'ปลดล็อกสกินรากไม้ระดับ Mythic [🌸 ออโรร่าไร้กาลเวลา (Timeless Aurora)]' },
    en: { title: 'Timeless Aurora Bloom', desc: 'Unlock the Mythic [🌸 Timeless Aurora] Root Skin' },
  },
  skin_starlight_prism: {
    th: { title: 'ปริซึมผลึกสะท้อนดวงดาว', desc: 'ปลดล็อกสกินรากไม้ขั้นสูงสุดระดับ Mythic [✨ ผลึกคริสตัลดวงดาว (Starlight Prism)]' },
    en: { title: 'Starlight Prism Radiance', desc: 'Unlock the pinnacle Mythic [✨ Starlight Prism] Root Skin' },
  },
  astral_trio_collector: {
    th: { title: 'จักรพรรดิแห่งดวงดาราและแสงเหนือ', desc: 'ครอบครองเครื่องประดับ Astral Mythic ครบทั้ง 3 ชิ้น (สกิน 2 แบบ + ธีม 1 แบบ)' },
    en: { title: 'Sovereign of the Starlight Aurora', desc: 'Unlock all 3 Astral Mythic cosmetics (both skins & theme)' },
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
    relicsTooltip: 'พิพิธภัณฑ์โบราณวัตถุ & ชีวนิเวศใต้พิภพ',
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
    echoUnlockHint: 'ต้องมี {name} 20 ต้น & เลเวล 3 ขึ้นไปเพื่อปลดล็อก',
    
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

    // Transcendence Modal (ตื่นรู้แห่งไกอา)
    transcendenceBtn: 'ตื่นรู้แห่งไกอา',
    transcendenceTitle: 'การตื่นรู้แห่งไกอา (Gaia Transcendence)',
    transcendenceDesc: 'หลอมรวมพลังรากพิภพทั้งหมดเพื่อปลุกพลังจิตวิญญาณแห่งโลก รีเซ็ตรอบใหญ่เพื่อรับ "ละอองชีวิตดึกดำบรรพ์ (Gaia Essences 🌍)"',
    gainedEssences: '+{amount} ละอองชีวิตดึกดำบรรพ์',
    currentEssences: 'ครอบครองอยู่ {amount} ละอองชีวิต',
    confirmTranscendBtn: 'ตื่นรู้แห่งไกอา (รีเซ็ตใหญ่)',
    gaiaTreeTab: '🌳 ผังจิตวิญญาณไกอา',
    trialsTab: '⚔️ การทดลองแห่งผืนพิภพ',
    transcendPerk1Name: 'แกนพลังปฐมกาล (Primordial Vigor)',
    transcendPerk1Desc: 'เพิ่มเรทผลิตพื้นฐานของรากทุกชนิด +25%/Lv ถาวรข้ามทุกรอบรีเซ็ต',
    transcendPerk2Name: 'ความทรงจำของผืนดิน (Soil Memory)',
    transcendPerk2Desc: 'คงพลังสะท้อนราก (Echoes) ไว้ 10%/Lv ทันทีเมื่อหว่านใหม่ (สูงสุด 100%)',
    transcendPerk3Name: 'พรแห่งไกอา (Gaia\'s Blessing)',
    transcendPerk3Desc: 'เพิ่มละอองชีวิต (🌍 Gaia Essences) ที่ได้รับจากการตื่นรู้ +5%/Lv (อัปเกรดได้ไม่จำกัด)',
    transcendPerk4Name: 'สัมผัสแห่งไกอา (Gaia\'s Touch)',
    transcendPerk4Desc: 'เพิ่มขนาดและผลคูณของแจ็กพอตโชคดี +30%/Lv',
    transcendPerk5Name: 'ทะลุขีดจำกัดเสียงสะท้อน (Echo Resonance)',
    transcendPerk5Desc: 'ขยายเพดานเลเวลของพลังสะท้อนรากทุกชนิด +1 Lv./ขั้น (สูงสุด Lv.10)',
    transcendPerk6Name: 'สายตาแห่งไกอา (Gaia\'s Clairvoyance)',
    transcendPerk6Desc: 'ขยายเพดานโอกาสเกิดอีเวนต์โชคดี +0.1%/Lv (เพิ่มเพดานรวมได้สูงสุด 2.0%)',
    transcendPerk7Name: 'รากปฐมกำเนิด (Primordial Seedling)',
    transcendPerk7Desc: 'เพิ่มเรทผลิตตั้งต้นของรากฝอย +0.28/วิ ต่อเลเวล (จาก 0.60 เป็นสูงสุด 2.00/วิ)',
    transcendPerk8Name: 'ภวังค์แห่งการหยั่งราก (Deep Meditation)',
    transcendPerk8Desc: 'ยิ่งหยั่งรากในรอบนี้นาน ยิ่งได้รับตัวคูณเรทผลิตรวมทวีคูณ (ค่อยๆ ไต่ขึ้นตามเวลา สูงสุดตันที่ ×3.0 เท่า ที่ Lv.5)',
    transcendPerk9Name: 'ความเร็วเร่งมิติ (Hyperdrive 2x)',
    transcendPerk9Desc: 'ปลดล็อกสวิตช์เร่งความเร็วเกม 2 เท่าถาวร เร่งเวลาผลผลิตและคูลดาวน์ทั้งหมดโดยไม่กินแรงเครื่อง',
    transcendPerk10Name: 'บุปผาแสงเหนือแห่งเอกภพ (Aurora Bloom)',
    transcendPerk10Desc: 'ปลุกบุปผาสวรรค์บนต้นไม้แห่งชีวิต ปลดล็อกแท่นหลอมเกสรดวงดาว (Astral Petals) ในหน้าหว่านเมล็ด และปลดล็อกสกินพิเศษ',
    trialActiveBadge: 'กำลังทดสอบ',
    startTrialBtn: 'เริ่มการทดสอบ',
    abandonTrialBtn: 'ยกเลิกการทดสอบ',
    trialCompletedBadge: '✓ พิชิตสำเร็จ',
    targetGoalText: 'เป้าหมาย: ปลูกรากต้นไม้โลก (Yggdrasil) ครบ {count} ต้น',

    // Grand Reset Banner
    transcendDescDetailed: 'หลอมรวมพลังรากต้นไม้โลกเพื่อปลุกจิตวิญญาณแห่งโลก รีเซ็ตรอบใหญ่ต้องมีรากต้นไม้โลกครบอย่างน้อย 100 ต้นในรอบปัจจุบัน',
    transcendGainEssences: '+{amount} ละอองชีวิตดึกดำบรรพ์ (เมื่อรีเซ็ตใหญ่)',
    transcendFromYgg: '(คำนวณจากต้นไม้โลก {count} ต้นในรอบนี้โดยตรง)',
    transcendReqBanner: 'ต้องการรากต้นไม้โลกครบ 100 ต้น ในรอบปัจจุบัน ({count}/{req} 🌳)',
    transcendReqBtn: 'ต้องการ 100 ต้นไม้โลก ({count}/{req})',
    transcendConfirmDesc: 'ยืนยันการรีเซ็ตใหญ่: หลอมรวมต้นไม้โลก {count} ต้น รับ +{amount} 🌍 (เมล็ดในกระเป๋าจะรีเซ็ตเป็น 0 เพื่อเริ่มยุคใหม่ แต่อัปเกรดร้านค้าจะอยู่ครบถ้วน)',
    transcendConfirmBtn: '⚠️ ยืนยันการรีเซ็ตใหญ่',

    // Trials Modal
    trialsConquered: 'พิชิตแล้ว: {count} / {total} การทดสอบ',
    trialInProgress: '⚔️ กำลังทดสอบอยู่',
    trialGuideTitle: 'คำแนะนำจังหวะการเล่น: ',
    trialGuideDesc: 'ตอนนี้คุณมีต้นไม้โลก {count} ต้น (พร้อมตื่นรู้รับ +{amount} 🌍)! แนะนำให้กด "ตื่นรู้แห่งไกอา" เพื่อนำละอองชีวิตไปอัปเกรดพรเทพเจ้าก่อนเริ่มการทดสอบรอบใหม่ จะคุ้มค่าที่สุดและผ่านได้ง่ายขึ้น',
    goToGaiaBtn: '🌍 ไปหน้าไกอา',
    trialRulesTitle: 'กติกาการทดลองแห่งผืนพิภพและการรีเซ็ต',
    trialResetLabel: 'สิ่งที่จะรีเซ็ต: ',
    trialResetDesc: 'จะทำการหว่านเมล็ดใหม่ (Prestige) รอบปัจจุบัน: รากไม้จะเริ่มใหม่เพื่อเข้าสู่การทดสอบ และสารอาหารทั้งหมดจะถูกแปลงเป็น +{amount} เมล็ดพันธุ์นิรันดร์ 🌰 เข้ากระเป๋าให้ทันที',
    trialKeepLabel: 'สิ่งที่ไม่หาย (ปลอดภัย 100%): ',
    trialKeepDesc: 'อัปเกรดร้าน Prestige ทั้งหมด, บัฟไกอา, เมล็ดพันธุ์ในกระเป๋า, ละอองชีวิต (🌍) และโบราณวัตถุ (Relics) ทั้งหมดจะอยู่ครบถ้วน ไม่หาย!',
    trialGoalLabel: 'เป้าหมายและยกเลิก: ',
    trialGoalDesc: 'ปลูกรากต้นไม้โลกครบ 25 ต้นภายใต้ข้อจำกัดเพื่อปลดล็อกรางวัลถาวร และสามารถกดยกเลิกการทดสอบได้ตลอดเวลาโดยไม่มีบทลงโทษ',
    confirmBeginTrialTitle: 'ยืนยันการเริ่มการทดสอบ',
    confirmBeginTrialBtn: 'เริ่มการทดสอบ',
    confirmBeginTrialMsg: 'การเข้าสู่การทดสอบ "{name}" จะทำการรีเซ็ตแบบหว่านเมล็ดใหม่ (Prestige Reset) รอบปัจจุบันทันที\n\n✨ สารอาหารสะสมในรอบนี้จะถูกแปลงเป็น +{seeds} เมล็ดพันธุ์นิรันดร์ 🌰 เข้ากระเป๋าให้ทันที!\n🛡️ เมล็ดพันธุ์เดิมในกระเป๋า ({walletSeeds} 🌰), ละอองชีวิต ({essences} 🌍) และโบราณวัตถุจะอยู่ครบ 100% ไม่สูญหาย!\n🌱 มีเพียงรากไม้ในสวนที่จะเริ่มใหม่เพื่อเข้าสู่เงื่อนไขการทดสอบ',

    // Live Preview Banner
    previewSkinLabel: 'กำลังทดลองสกินราก: {name}',
    previewThemeLabel: 'กำลังทดลองธีมหน้าต่าง: {name}',
    previewExitBtn: '✕ ยกเลิก',
    previewBuyKeep: 'ซื้อเลย & สวมใส่',
    previewNeedPetals: 'เกสรไม่พอ',
    previewUnlockInPrestige: 'ไปปลดล็อกในร้าน Prestige',
    needMoreSeeds: 'ยังขาดอีก {count} เมล็ด',

    // Upgrades Catalog & Quick Bar
    backToRoots: 'กลับหน้ารากไม้',
    buyAllAvailable: 'ซื้อทั้งหมดที่ซื้อได้',
    tabAll: 'ทั้งหมด',
    tabUpgrades: 'อัปเกรด',
    tabEchoes: 'สะท้อน',
    tabNetworks: 'เครือข่าย',
    speciesUpgradesHeader: 'อัปเกรดตามชนิดราก (+100% / ×3.00)',
    milestoneLabel: 'หลักชัย',
    needUnits: 'ต้องการ {req} ต้น',
    echoesHeader: 'สะท้อนแห่งการเติบโต (ตัวคูณรอบนี้: ×{mult})',
    echoLabel: 'สะท้อน:',
    echoBonusDesc: 'เรทผลผลิตรวมคูณทับ (ในรอบนี้)',
    networksHeader: 'เครือข่ายไมคอร์ไรซา (+{bonus}%/ต้น)',
    networkLabel: 'เครือข่าย:',
    statusMaxed: 'เต็มแล้ว ✓',
    statusActive: 'เปิดแล้ว ✓',

    // Top Actions & Utility
    trialsBtn: 'การทดสอบ',
    hyperdriveActiveTooltip: '⚡ กำลังเร่งความเร็ว 2 เท่า (คลิกเพื่อสลับเป็น 1x)',
    hyperdriveInactiveTooltip: '⏸️ ความเร็วปกติ 1x (คลิกเพื่อเร่งความเร็ว 2x)',
    autoHubSuppressedTooltip: '🤖 ศูนย์ควบคุมบอท (ถูกปิดกั้นชั่วคราวโดยรอยแยกสูญญะ)',
    autoHubTooltip: 'ศูนย์ควบคุมระบบอัตโนมัติ',
    quickUpgradesTitle: 'อัปเกรดด่วน',
    viewAllWithCount: 'ดูทั้งหมด ({count}) →',
    openCatalogTooltip: 'เปิดดูคลังอัปเกรดทั้งหมด',
    viewMore: 'ดูเพิ่ม',
    networkActive: 'เปิดใช้งานแล้ว',
    statusActiveShort: 'ทำงานอยู่',
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
    relicsTooltip: 'Subterranean Museum & Biomes',
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
    echoUnlockHint: 'Requires {name} ×20 & Level 3+ to unlock',
    
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

    // Transcendence Modal (Gaia Awakening)
    transcendenceBtn: 'Gaia Awakening',
    transcendenceTitle: 'Gaia Transcendence',
    transcendenceDesc: 'Channel the collective telluric energy of all root networks to awaken the planetary spirit. Perform a grand reset to earn "Gaia Essences (🌍)".',
    gainedEssences: '+{amount} Gaia Essences',
    currentEssences: 'Currently holding {amount} Gaia Essences',
    confirmTranscendBtn: 'Awaken Gaia (Grand Reset)',
    gaiaTreeTab: '🌳 Gaia Spirit Tree',
    trialsTab: '⚔️ Subterranean Trials',
    transcendPerk1Name: 'Primordial Vigor',
    transcendPerk1Desc: 'Permanently increases baseline rate of all root species by +25%/Lv across all cycles',
    transcendPerk2Name: 'Soil Memory',
    transcendPerk2Desc: 'Retains 10%/Lv of your Root Echoes immediately upon Re-sow (max 100%)',
    transcendPerk3Name: 'Gaia\'s Blessing',
    transcendPerk3Desc: 'Increases Gaia Essences (🌍) gained from Transcendence by +5%/Lv (Infinite repeat sink)',
    transcendPerk4Name: 'Gaia\'s Touch',
    transcendPerk4Desc: 'Increases magnitude and yield of Lucky Events by +30%/Lv',
    transcendPerk5Name: 'Echo Resonance',
    transcendPerk5Desc: 'Expands the max level cap of all Root Echoes by +1 Lv./rank (up to Lv.10)',
    transcendPerk6Name: 'Gaia\'s Clairvoyance',
    transcendPerk6Desc: 'Expands the Lucky Event trigger chance cap by +0.1%/Lv (up to 2.0% total)',
    transcendPerk7Name: 'Primordial Seedling',
    transcendPerk7Desc: 'Increases initial base production of Fine Roots by +0.28/s per level (from 0.60 up to 2.00/s)',
    transcendPerk8Name: 'Deep Meditation',
    transcendPerk8Desc: 'The longer you stay rooted in this run, the higher your global multiplier grows (gradually ramps up to a maximum of ×3.0 at Lv.5)',
    transcendPerk9Name: 'Hyperdrive Overclock (2x Speed)',
    transcendPerk9Desc: 'Permanently unlocks a 2x game speed toggle. Accelerates garden time, production, and timers with zero extra CPU overhead.',
    transcendPerk10Name: 'Cosmic Aurora Bloom (Altar)',
    transcendPerk10Desc: 'Awakens the celestial bloom on the Tree of Life. Permanently unlocks the Astral Petal transmute altar and unlocks special cosmic skins.',
    trialActiveBadge: 'In Progress',
    startTrialBtn: 'Begin Trial',
    abandonTrialBtn: 'Abandon Trial',
    trialCompletedBadge: '✓ Conquered',
    targetGoalText: 'Goal: Grow {count} Yggdrasil Roots',

    // Grand Reset Banner
    transcendDescDetailed: 'Channel the ancient vitality of the World Tree to awaken the planet’s soul. Requires at least 100 Yggdrasil roots in the current run.',
    transcendGainEssences: '+{amount} Gaia Essences on Grand Reset',
    transcendFromYgg: '(Calculated directly from {count} World Trees in this run)',
    transcendReqBanner: 'Requires 100 Yggdrasil World Trees in current run ({count}/{req} 🌳)',
    transcendReqBtn: 'Requires 100 Yggdrasil ({count}/{req})',
    transcendConfirmDesc: 'Confirm Grand Reset: Convert {count} World Trees into +{amount} 🌍. Wallet seeds reset to 0 to begin the new era, while all permanent shop upgrades are preserved.',
    transcendConfirmBtn: '⚠️ Confirm Grand Reset',

    // Trials Modal
    trialsConquered: 'Conquered: {count} / {total} Trials',
    trialInProgress: '⚔️ Trial in Progress',
    trialGuideTitle: 'Recommended Next Step: ',
    trialGuideDesc: 'You currently have {count} World Trees (+{amount} 🌍 ready)! It is strongly recommended to "Awaken Gaia" first to claim essences and upgrade perks before starting a trial.',
    goToGaiaBtn: '🌍 Go to Gaia',
    trialRulesTitle: 'Subterranean Trial Rules & Reset Information',
    trialResetLabel: 'What gets reset: ',
    trialResetDesc: 'Triggers a Prestige Reset for current garden: roots reset to 0 to begin the challenge, and current nutrients are converted into +{amount} Eternal Seeds 🌰 immediately.',
    trialKeepLabel: 'What is kept safe: ',
    trialKeepDesc: 'All permanent Prestige upgrades, Gaia perks, Eternal Seeds in wallet, Gaia Essences (🌍), and Relics remain completely intact!',
    trialGoalLabel: 'Goal & Abandon: ',
    trialGoalDesc: 'Grow 25 Yggdrasil Roots under trial restrictions to claim permanent rewards. You can abandon the trial anytime without penalty.',
    confirmBeginTrialTitle: 'Confirm Begin Trial',
    confirmBeginTrialBtn: 'Begin Trial',
    confirmBeginTrialMsg: 'Entering "{name}" will trigger a Prestige Reset for your current garden.\n\n✨ Current nutrients will be converted into +{seeds} Eternal Seeds 🌰 immediately!\n🛡️ Your wallet seeds ({walletSeeds} 🌰), Gaia Essences ({essences} 🌍), and relics remain 100% safe!\n🌱 Only garden roots and nutrients will reset to start the trial.',

    // Live Preview Banner
    previewSkinLabel: 'Previewing Root Skin: {name}',
    previewThemeLabel: 'Previewing UI Theme: {name}',
    previewExitBtn: '✕ Exit',
    previewBuyKeep: 'Buy & Keep',
    previewNeedPetals: 'Need Petals',
    previewUnlockInPrestige: 'Unlock in Prestige',
    needMoreSeeds: 'Need {count} more seeds',

    // Upgrades Catalog & Quick Bar
    backToRoots: 'Back to Roots',
    buyAllAvailable: 'Buy All Available',
    tabAll: 'All',
    tabUpgrades: 'Upgrades',
    tabEchoes: 'Echoes',
    tabNetworks: 'Networks',
    speciesUpgradesHeader: 'Species Upgrades (+100% / ×3.00)',
    milestoneLabel: 'Milestone',
    needUnits: 'Need {req} units',
    echoesHeader: 'Echoes of Growth (×{mult} Multiplier this run)',
    echoLabel: 'Echo:',
    echoBonusDesc: 'Multiplicative Global Rate (this run)',
    networksHeader: 'Mycorrhizal Networks (+{bonus}%/Unit Global)',
    networkLabel: 'Network:',
    statusMaxed: 'MAX',
    statusActive: 'ACTIVE ✓',

    // Top Actions & Utility
    trialsBtn: 'Trials',
    hyperdriveActiveTooltip: '⚡ 2x Speed Active (Click to toggle 1x)',
    hyperdriveInactiveTooltip: '⏸️ 1x Normal Speed (Click to toggle 2x Hyperdrive)',
    autoHubSuppressedTooltip: '🤖 Automation Hub (Suppressed by Void Anomaly)',
    autoHubTooltip: 'Automation Control Hub',
    quickUpgradesTitle: 'Quick Upgrades',
    viewAllWithCount: 'View All ({count}) →',
    openCatalogTooltip: 'Open Full Upgrades Catalog',
    viewMore: 'More',
    networkActive: 'ACTIVE',
    statusActiveShort: 'Active',
  },
};

export type UITexts = typeof UI_TEXTS['th'];

export function t(lang: Language = 'th'): UITexts {
  return UI_TEXTS[lang] || UI_TEXTS.th;
}

/**
 * Safely resolves entity localized name with guaranteed fallback to prevent undefined
 */
export function getEntityName(entity: { name: string; enName?: string } | undefined | null, lang: Language): string {
  if (!entity) return '';
  return (lang === 'en' && entity.enName) ? entity.enName : entity.name;
}

/**
 * Safely resolves entity localized description with guaranteed fallback to prevent undefined
 */
export function getEntityDesc(entity: { desc: string; enDesc?: string } | undefined | null, lang: Language): string {
  if (!entity) return '';
  return (lang === 'en' && entity.enDesc) ? entity.enDesc : entity.desc;
}

