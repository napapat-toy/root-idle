import { Language } from '@/types/game';
import { AchievementCategory } from '@/types/achievements';

export interface LocalizedAchievement {
  title: string;
  desc: string;
}

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
  passive_rate_50: {
    th: { title: 'กระแสรากต่อเนื่อง', desc: 'อัพเกรดเรทสารอาหารพื้นฐานถาวร (Passive Rate) ในร้านหว่านใหม่แตะเลเวล 50' },
    en: { title: 'Enduring Earthcurrent', desc: 'Upgrade Permanent Passive Rate to Level 50 in Prestige Shop' },
  },
  starter_culture_10: {
    th: { title: 'กลิ่นอายหัวเชื้อ', desc: 'อัพเกรดหัวเชื้อเริ่มต้น (Starter Culture) แตะเลเวล 10' },
    en: { title: 'Culture Essence', desc: 'Upgrade Starter Culture to Level 10' },
  },
  starter_culture_25: {
    th: { title: 'รากฝอยพร้อมสรรพ', desc: 'อัพเกรดหัวเชื้อเริ่มต้น (Starter Culture) แตะเลเวล 25' },
    en: { title: 'Sprouting Culture', desc: 'Upgrade Starter Culture to Level 25' },
  },
  golden_seed_25: {
    th: { title: 'ประกายทองคำเบ่งบาน', desc: 'อัพเกรดเมล็ดพันธุ์ทองคำ (Golden Seeds) แตะเลเวล 25' },
    en: { title: 'Golden Abundance', desc: 'Upgrade Golden Seeds to Level 25' },
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
  event_bonus_25: {
    th: { title: 'ผลตอบแทนงอกเงย', desc: 'อัพเกรดโบนัสอีเวนต์ (Event Value Booster) ในร้านหว่านใหม่แตะเลเวล 25' },
    en: { title: 'Flourishing Bounty', desc: 'Upgrade Event Value Booster to Level 25' },
  },
  event_duration_max: {
    th: { title: 'เวลาแห่งบัฟ', desc: 'อัพเกรดขยายระยะเวลาบัฟอีเวนต์แตะเลเวล 4 (สูงสุด)' },
    en: { title: 'Enduring Surge', desc: 'Max out Extended Surge Duration (Level 4)' },
  },
  lucky_chance_max: {
    th: { title: 'ทุ่งโคลเวอร์เบ่งบาน', desc: 'อัพเกรดโอกาสพบเจอโชคดีแตะเลเวล 8 (สูงสุด 1.0%)' },
    en: { title: 'Blooming Clovers', desc: 'Max out Lucky Clover Frequency (Level 8)' },
  },
  lucky_magnitude_max: {
    th: { title: 'โชคดีสิบเท่าทวีคูณ', desc: 'อัพเกรดโชคดีทวีคูณแตะเลเวล 9 (สูงสุด ทบตัวคูณโชคดี ×10)' },
    en: { title: 'Decuple Fortune', desc: 'Max out Lucky Magnitude Multiplier to Level 9 (×10 multiplier)' },
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
    th: { title: 'ขุดพบโบราณคดีชิ้นแรก', desc: 'ค้นพบโบราณวัตถุใต้พิภพชิ้นแรก (ครอบครอง Master Relic 1 ชิ้น)' },
    en: { title: 'First Unearthed Relic', desc: 'Discover your first subterranean Master Relic' },
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
  gaia_clairvoyance_5: {
    th: { title: 'เนตรแห่งไกอา', desc: 'อัพเกรดสายตาแห่งไกอา (Gaia Clairvoyance) แตะเลเวล 5' },
    en: { title: 'Eye of Gaia', desc: 'Upgrade Gaia Clairvoyance to Level 5' },
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
