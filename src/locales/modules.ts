import { Language } from '@/types/game';

export interface LocalizedModule {
  name: string;
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
