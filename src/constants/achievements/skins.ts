import { AchievementDef } from '@/types/achievements';
import { SKIN_DEFS, isSkinUnlocked, UI_THEME_DEFS, isUIThemeUnlocked } from '../cosmetics';

export const SKINS_ACHIEVEMENTS: AchievementDef[] = [
// ===== 🎨 หมวด 5: สกิน & สไตล์ (Aesthetics & Customization) =====
  {
    id: 'skin_equip_custom',
    category: 'skins',
    title: 'นักแต่งสวน',
    desc: 'สวมใส่สกินพิเศษรูปแบบใดก็ได้',
    icon: '🎨',
    bonusPct: 2,
    check: (s) => s.prestige.activeSkin !== 'none',
  },
  {
    id: 'skins_all_unlocked',
    category: 'skins',
    title: 'ตู้เสื้อผ้ารากไม้',
    desc: 'ปลดล็อกสกินรากไม้ในห้องแต่งตัวสะสมครบ 4 รูปแบบ',
    icon: '👗',
    bonusPct: 8,
    check: (s) => SKIN_DEFS.filter(def => def.id !== 'none' && isSkinUnlocked(s, def.id)).length >= 4,
  },
  {
    id: 'theme_equip_custom',
    category: 'skins',
    title: 'จิตรกรแห่งผืนดิน',
    desc: 'สวมใส่ธีมหน้าต่าง UI พิเศษรูปแบบใดก็ได้ที่ไม่ใช่คลาสสิก',
    icon: '🖼️',
    bonusPct: 2,
    check: (s) => !!s.prestige.activeUITheme && s.prestige.activeUITheme !== 'classic',
  },
  {
    id: 'theme_void_sovereign',
    category: 'skins',
    title: 'ราชันย์แห่งมิติสุญญะ',
    desc: 'ปลดล็อกและสวมใส่ธีม UI [🌌 จอมราชันย์แห่งสุญญะ] จากการพิชิตการทดลอง',
    icon: '🌌',
    bonusPct: 5,
    check: (s) => s.prestige.activeUITheme === 'void_sovereign',
  },
  {
    id: 'skins_collector_8',
    category: 'skins',
    title: 'ผู้คลั่งไคล้แฟชั่นรากไม้',
    desc: 'ปลดล็อกสกินรากไม้ในห้องแต่งตัวสะสมครบ 8 รูปแบบ',
    icon: '👘',
    bonusPct: 4,
    check: (s) => SKIN_DEFS.filter(def => def.id !== 'none' && isSkinUnlocked(s, def.id)).length >= 8,
  },
  {
    id: 'skins_collector_12',
    category: 'skins',
    title: 'รันเวย์ใต้พิภพ',
    desc: 'ปลดล็อกสกินรากไม้ในห้องแต่งตัวสะสมครบ 12 รูปแบบ',
    icon: '👑',
    bonusPct: 6,
    check: (s) => SKIN_DEFS.filter(def => def.id !== 'none' && isSkinUnlocked(s, def.id)).length >= 12,
  },
  {
    id: 'skin_nebula_unlocked',
    category: 'skins',
    title: 'รากไม้แห่งดวงดาว',
    desc: 'ครอบครองสกินระดับสูง [🌌 มิติเนบิวลา] หรือ [🪙 มรดกทองคำ]',
    icon: '⭐',
    bonusPct: 5,
    check: (s) => !!s.prestige.skinNebula || !!s.prestige.skinImperial,
  },
  {
    id: 'skin_trial_champions',
    category: 'skins',
    title: 'อาภรณ์แห่งผู้พิชิต',
    desc: 'ปลดล็อกสกินพิเศษจากการพิชิตการทดลองใต้พิภพอย่างน้อย 1 รูปแบบ',
    icon: '⚔️',
    bonusPct: 6,
    check: (s) =>
      isSkinUnlocked(s, 'drought') ||
      isSkinUnlocked(s, 'obsidian') ||
      isSkinUnlocked(s, 'eclipse') ||
      isSkinUnlocked(s, 'permafrost') ||
      isSkinUnlocked(s, 'fulminant'),
  },
  {
    id: 'themes_collector_5',
    category: 'skins',
    title: 'สถาปนิกส่วนหน้า',
    desc: 'ปลดล็อกธีมหน้าต่าง UI ในห้องแต่งตัวสะสมครบ 5 ธีม',
    icon: '🏛️',
    bonusPct: 4,
    check: (s) => UI_THEME_DEFS.filter(t => t.id !== 'classic' && isUIThemeUnlocked(s, t.id)).length >= 5,
  },
  {
    id: 'themes_collector_10',
    category: 'skins',
    title: 'พหุภพแห่งผืนดิน',
    desc: 'ปลดล็อกธีมหน้าต่าง UI ในห้องแต่งตัวสะสมครบ 10 ธีม',
    icon: '🌈',
    bonusPct: 6,
    check: (s) => UI_THEME_DEFS.filter(t => t.id !== 'classic' && isUIThemeUnlocked(s, t.id)).length >= 10,
  },
  {
    id: 'skin_theme_match',
    category: 'skins',
    title: 'คู่สีกลมกลืนแห่งธรรมชาติ',
    desc: 'สวมใส่สกินรากไม้และธีมหน้าต่าง UI ในเซ็ตธีมเดียวกัน (เช่น ซากุระคู่ซากุระ หรือ ไซเบอร์พังก์คู่ไซเบอร์พังก์)',
    icon: '✨',
    bonusPct: 3,
    check: (s) => s.prestige.activeSkin !== 'none' && s.prestige.activeUITheme !== 'classic' && (s.prestige.activeSkin as string) === (s.prestige.activeUITheme as string),
  },
  {
    id: 'wardrobe_grand_master',
    category: 'skins',
    title: 'มหาจักรพรรดิแห่งแฟชั่นรากไม้',
    desc: 'ครอบครองสกินรากไม้ครบทุกแบบ และธีมหน้าต่างครบทุกแบบในเกม',
    icon: '💎',
    bonusPct: 10,
    check: (s) => SKIN_DEFS.filter(def => def.id !== 'none' && !isSkinUnlocked(s, def.id)).length === 0 && UI_THEME_DEFS.filter(t => t.id !== 'classic' && !isUIThemeUnlocked(s, t.id)).length === 0,
  },

// ===== 🎨 หมวด 7: สกิน & แฟชั่นใต้พิภพ (Cosmetics & Aesthetics) =====
  {
    id: 'skin_first_wardrobe',
    category: 'skins',
    title: 'อาภรณ์ชิ้นแรก',
    desc: 'ปลดล็อกสกินรากไม้หรือธีมหน้าต่างตกแต่งชิ้นแรก',
    icon: '👗',
    bonusPct: 3,
    check: (s) =>
      SKIN_DEFS.some(def => def.id !== 'none' && isSkinUnlocked(s, def.id)) ||
      UI_THEME_DEFS.some(def => def.id !== 'classic' && isUIThemeUnlocked(s, def.id)),
  },
  {
    id: 'theme_subterranean_borealis',
    category: 'skins',
    title: 'มงกุฎแสงเหนือใต้พิภพ',
    desc: 'ปลดล็อกธีมหน้าต่าง UI ระดับ Mythic [🌌 แสงเหนือใต้พิภพ (Subterranean Borealis)]',
    icon: '🌌',
    bonusPct: 6,
    check: (s) => isUIThemeUnlocked(s, 'subterranean_borealis'),
  },
  {
    id: 'skin_timeless_aurora',
    category: 'skins',
    title: 'รัตติกาลไร้กาลเวลา',
    desc: 'ปลดล็อกสกินรากไม้ระดับ Mythic [🌸 ออโรร่าไร้กาลเวลา (Timeless Aurora)]',
    icon: '🌸',
    bonusPct: 8,
    check: (s) => isSkinUnlocked(s, 'timeless_aurora'),
  },
  {
    id: 'skin_starlight_prism',
    category: 'skins',
    title: 'ปริซึมผลึกสะท้อนดวงดาว',
    desc: 'ปลดล็อกสกินรากไม้ขั้นสูงสุดระดับ Mythic [✨ ผลึกคริสตัลดวงดาว (Starlight Prism)]',
    icon: '✨',
    bonusPct: 15,
    check: (s) => isSkinUnlocked(s, 'starlight_prism'),
  },
  {
    id: 'astral_trio_collector',
    category: 'skins',
    title: 'จักรพรรดิแห่งดวงดาราและแสงเหนือ',
    desc: 'ครอบครองเครื่องประดับ Astral Mythic ครบทั้ง 3 ชิ้น (สกิน 2 แบบ + ธีม 1 แบบ)',
    icon: '👑',
    bonusPct: 20,
    check: (s) =>
      isSkinUnlocked(s, 'timeless_aurora') &&
      isSkinUnlocked(s, 'starlight_prism') &&
      isUIThemeUnlocked(s, 'subterranean_borealis'),
  },
];
