'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, Language, SkinId, UIThemeId } from '@/types/game';
import {
  SKIN_COSTS,
  SKIN_DEFS,
  SKIN_PRESTIGE_KEYS,
  UI_THEME_COSTS,
  UI_THEME_DEFS,
  UI_THEME_PRESTIGE_KEYS,
} from '@/constants/gameData';
import { fmtInt } from '@/lib/formatters';
import { SKIN_NAMES, UI_THEME_NAMES, t } from '@/lib/i18n';

interface WardrobeModalProps {
  isOpen: boolean;
  state: GameState;
  previewSkin: SkinId | null;
  previewUITheme: UIThemeId | null;
  onClose: () => void;
  onSelectSkin: (id: SkinId) => void;
  onSelectUITheme: (id: UIThemeId) => void;
  onBuySkin: (id: SkinId, autoEquip?: boolean) => void;
  onBuyUITheme: (id: UIThemeId, autoEquip?: boolean) => void;
  onStartPreviewSkin: (id: SkinId) => void;
  onStartPreviewUITheme: (id: UIThemeId) => void;
  onClearPreview: () => void;
  onOpenPrestige: () => void;
}

export const WardrobeModal: React.FC<WardrobeModalProps> = ({
  isOpen,
  state,
  onClose,
  onSelectSkin,
  onSelectUITheme,
  onBuySkin,
  onBuyUITheme,
  onStartPreviewSkin,
  onStartPreviewUITheme,
  onClearPreview,
  onOpenPrestige,
}) => {
  const [activeTab, setActiveTab] = useState<'skins' | 'themes'>('skins');
  const [skinIndex, setSkinIndex] = useState(0);
  const [themeIndex, setThemeIndex] = useState(0);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const lang: Language = state.lang || 'th';
  const isEn = lang === 'en';
  const tr = t(lang);

  // Initialize index to currently equipped items when modal opens
  useEffect(() => {
    if (isOpen) {
      const curSkin = state.prestige.activeSkin;
      const sIdx = SKIN_DEFS.findIndex(s => s.id === curSkin);
      const initSIdx = sIdx !== -1 ? sIdx : 0;
      setSkinIndex(initSIdx);

      const curTheme = state.prestige.activeUITheme || 'classic';
      const tIdx = UI_THEME_DEFS.findIndex(t => t.id === curTheme);
      const initTIdx = tIdx !== -1 ? tIdx : 0;
      setThemeIndex(initTIdx);
    }
  }, [isOpen, state.prestige.activeSkin, state.prestige.activeUITheme]);

  const isSkinOwned = useCallback((id: SkinId) => {
    if (id === 'none') return true;
    const key = SKIN_PRESTIGE_KEYS[id];
    return key ? !!state.prestige[key as keyof typeof state.prestige] : false;
  }, [state.prestige]);

  const isUIThemeOwned = useCallback((id: UIThemeId) => {
    if (id === 'classic') return true;
    const key = UI_THEME_PRESTIGE_KEYS[id];
    return key ? !!state.prestige[key as keyof typeof state.prestige] : false;
  }, [state.prestige]);

  // Live preview current item as index shifts
  useEffect(() => {
    if (!isOpen) return;
    if (activeTab === 'skins') {
      const targetSkin = SKIN_DEFS[skinIndex]?.id;
      if (targetSkin) onStartPreviewSkin(targetSkin);
    } else {
      const targetTheme = UI_THEME_DEFS[themeIndex]?.id;
      if (targetTheme) onStartPreviewUITheme(targetTheme);
    }
  }, [activeTab, skinIndex, themeIndex, isOpen, onStartPreviewSkin, onStartPreviewUITheme]);

  const handleClose = () => {
    onClearPreview();
    onClose();
  };

  const handlePrev = useCallback(() => {
    if (activeTab === 'skins') {
      setSkinIndex(prev => (prev === 0 ? SKIN_DEFS.length - 1 : prev - 1));
    } else {
      setThemeIndex(prev => (prev === 0 ? UI_THEME_DEFS.length - 1 : prev - 1));
    }
  }, [activeTab]);

  const handleNext = useCallback(() => {
    if (activeTab === 'skins') {
      setSkinIndex(prev => (prev === SKIN_DEFS.length - 1 ? 0 : prev + 1));
    } else {
      setThemeIndex(prev => (prev === UI_THEME_DEFS.length - 1 ? 0 : prev + 1));
    }
  }, [activeTab]);

  // Keyboard navigation Left / Right
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        handlePrev();
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        handleNext();
      } else if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handlePrev, handleNext]);

  // Touch Swipe Handlers for mobile gestures
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 45) {
      handleNext(); // swipe left -> next
    } else if (diff < -45) {
      handlePrev(); // swipe right -> prev
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!isOpen) return null;

  const skinDescriptions: Record<SkinId, { th: string; en: string }> = {
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
  };

  const uiThemeDescriptions: Record<UIThemeId, { th: string; en: string }> = {
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
  };

  const skinSwatches: Record<SkinId, string[]> = {
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
  };

  const themeSwatches: Record<UIThemeId, string[]> = {
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
  };

  // Current active item data
  const currentSkinDef = SKIN_DEFS[skinIndex] || SKIN_DEFS[0];
  const currentSkinId = currentSkinDef.id;
  const isCurSkinOwned = isSkinOwned(currentSkinId);
  const isCurSkinEquipped = state.prestige.activeSkin === currentSkinId;
  const currentSkinCost = SKIN_COSTS[currentSkinId] || 0;
  const currentSkinName = SKIN_NAMES[currentSkinId]?.[lang] || currentSkinDef.name;
  const currentSkinDesc = skinDescriptions[currentSkinId]?.[lang] || '';
  const currentSkinColors = skinSwatches[currentSkinId] || [];

  const currentThemeDef = UI_THEME_DEFS[themeIndex] || UI_THEME_DEFS[0];
  const currentThemeId = currentThemeDef.id;
  const isCurThemeOwned = isUIThemeOwned(currentThemeId);
  const isCurThemeEquipped = (state.prestige.activeUITheme || 'classic') === currentThemeId;
  const currentThemeCost = UI_THEME_COSTS[currentThemeId] || 0;
  const currentThemeName = UI_THEME_NAMES[currentThemeId]?.[lang] || currentThemeDef.name;
  const currentThemeDesc = uiThemeDescriptions[currentThemeId]?.[lang] || '';
  const currentThemeColors = themeSwatches[currentThemeId] || [];

  const isCurrentTabSkins = activeTab === 'skins';
  const curName = isCurrentTabSkins ? currentSkinName : currentThemeName;
  const curDesc = isCurrentTabSkins ? currentSkinDesc : currentThemeDesc;
  const curColors = isCurrentTabSkins ? currentSkinColors : currentThemeColors;
  const curOwned = isCurrentTabSkins ? isCurSkinOwned : isCurThemeOwned;
  const curEquipped = isCurrentTabSkins ? isCurSkinEquipped : isCurThemeEquipped;
  const curCost = isCurrentTabSkins ? currentSkinCost : currentThemeCost;
  const curIndex = isCurrentTabSkins ? skinIndex : themeIndex;
  const totalCount = isCurrentTabSkins ? SKIN_DEFS.length : UI_THEME_DEFS.length;
  const canAfford = state.eternalSeeds >= curCost;

  return (
    <div
      className="offline-backdrop"
      onClick={handleClose}
      style={{
        background: 'rgba(0, 0, 0, 0.15)',
        backdropFilter: 'none',
        WebkitBackdropFilter: 'none',
        alignItems: 'flex-end',
        paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
      }}
    >
      <div
        className="modal-wrapper"
        onClick={e => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          width: 'min(94vw, 440px)',
          background: 'var(--bg-panel)',
          border: '1.5px solid var(--accent-glow-dim)',
          borderRadius: '22px',
          boxShadow: '0 25px 65px rgba(0, 0, 0, 0.85), 0 0 1px 1px rgba(255, 255, 255, 0.12), 0 0 24px rgba(0, 0, 0, 0.5)',
          padding: '18px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          animation: 'modalPopIn 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Top Bar: Title & Close Button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '18px' }}>🎨</span>
            <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--root-cream)' }}>
              {tr.wardrobeTitle}
            </span>
          </div>

          <button
            onClick={handleClose}
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              background: 'var(--bg-panel-2)',
              border: '1px solid var(--line-soil)',
              color: 'var(--root-cream)',
              fontSize: '18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
            }}
            title={tr.close}
          >
            &times;
          </button>
        </div>

        {/* Tab Switcher Pills */}
        <div
          style={{
            display: 'flex',
            background: 'var(--bg-panel-2)',
            borderRadius: '12px',
            padding: '4px',
            gap: '4px',
            border: '1px solid var(--line-soil)',
          }}
        >
          <button
            onClick={() => setActiveTab('skins')}
            style={{
              flex: 1,
              padding: '7px 10px',
              borderRadius: '9px',
              border: 'none',
              fontWeight: 700,
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              background: isCurrentTabSkins ? 'var(--accent-glow)' : 'transparent',
              color: isCurrentTabSkins ? '#12190d' : 'var(--root-cream)',
            }}
          >
            {tr.tabRootSkins} ({SKIN_DEFS.filter(s => isSkinOwned(s.id)).length}/{SKIN_DEFS.length})
          </button>
          <button
            onClick={() => setActiveTab('themes')}
            style={{
              flex: 1,
              padding: '7px 10px',
              borderRadius: '9px',
              border: 'none',
              fontWeight: 700,
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              background: !isCurrentTabSkins ? 'var(--accent-glow)' : 'transparent',
              color: !isCurrentTabSkins ? '#12190d' : 'var(--root-cream)',
            }}
          >
            {tr.tabUIThemes} ({UI_THEME_DEFS.filter(t => isUIThemeOwned(t.id)).length}/{UI_THEME_DEFS.length})
          </button>
        </div>

        {/* Carousel Stepper Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-panel-2)',
            border: '1px solid var(--line-soil)',
            borderRadius: '16px',
            padding: '10px 12px',
            gap: '10px',
            boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.3)',
          }}
        >
          <button
            onClick={handlePrev}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'var(--bg-panel)',
              border: '1px solid var(--line-soil)',
              color: 'var(--root-cream)',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
              userSelect: 'none',
            }}
            aria-label="Previous Item"
          >
            ◀
          </button>

          <div style={{ flex: 1, textAlign: 'center', minWidth: 0 }}>
            <div style={{ fontSize: '11px', color: 'var(--root-cream-dim)', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
              {curIndex + 1} / {totalCount}
            </div>
            <div
              style={{
                fontSize: '16px',
                fontWeight: 700,
                color: 'var(--root-cream)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {curName}
            </div>
          </div>

          <button
            onClick={handleNext}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'var(--bg-panel)',
              border: '1px solid var(--line-soil)',
              color: 'var(--root-cream)',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
              userSelect: 'none',
            }}
            aria-label="Next Item"
          >
            ▶
          </button>
        </div>

        {/* Color Palette Dots & Description */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', textAlign: 'center' }}>
          {/* Swatches */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {curColors.map((col, idx) => (
              <div
                key={idx}
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: col,
                  border: '2px solid rgba(255, 255, 255, 0.4)',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                }}
              />
            ))}
          </div>

          <div style={{ fontSize: '12px', color: 'var(--root-cream-dim)', lineHeight: 1.4, minHeight: '34px' }}>
            {curDesc}
          </div>
        </div>

        {/* Action Button Strip */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
          {curEquipped ? (
            <div
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--accent-glow-dim)',
                color: 'var(--accent-glow)',
                fontWeight: 700,
                fontSize: '13px',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <span>✓</span>
              <span>{tr.equippedBadge}</span>
            </div>
          ) : curOwned ? (
            <button
              onClick={() => {
                if (isCurrentTabSkins) {
                  onSelectSkin(currentSkinId);
                } else {
                  onSelectUITheme(currentThemeId);
                }
                onClearPreview();
                onClose();
              }}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '12px',
                background: 'var(--accent-glow)',
                color: '#12190d',
                border: 'none',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)',
              }}
            >
              ✅ {isEn ? 'Equip This' : 'สวมใส่อันนี้'}
            </button>
          ) : canAfford ? (
            <button
              onClick={() => {
                if (isCurrentTabSkins) {
                  onBuySkin(currentSkinId, true);
                } else {
                  onBuyUITheme(currentThemeId, true);
                }
                onClearPreview();
                onClose();
              }}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: '0 0 14px rgba(16, 185, 129, 0.5)',
                transition: 'all 0.15s ease',
              }}
            >
              🛒 {fmtInt(curCost)} 🌌 {isEn ? 'Buy & Equip' : 'ซื้อ & สวมใส่'}
            </button>
          ) : (
            <button
              onClick={() => {
                handleClose();
                onOpenPrestige();
              }}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '12px',
                background: 'rgba(192, 132, 252, 0.15)',
                border: '1px solid rgba(192, 132, 252, 0.35)',
                color: '#c084fc',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer',
              }}
              title={isEn ? `Need ${fmtInt(curCost - state.eternalSeeds)} more seeds` : `ยังขาดอีก ${fmtInt(curCost - state.eternalSeeds)} เมล็ด`}
            >
              🔒 {fmtInt(curCost)} 🌌 {isEn ? 'Unlock in Prestige' : 'ปลดล็อกในร้าน Prestige'}
            </button>
          )}

          <button
            onClick={handleClose}
            style={{
              padding: '10px 16px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.08)',
              color: 'var(--root-cream-dim)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            {isEn ? '✕ Close' : '✕ ปิด'}
          </button>
        </div>

        {/* Mobile Swipe Hint */}
        <div style={{ textAlign: 'center', fontSize: '10px', color: 'rgba(255, 255, 255, 0.35)' }}>
          {isEn ? '👈 Swipe or use Arrow keys to preview 👉' : '👈 ปัดหน้าจอ หรือกดปุ่มลูกศรเพื่อลองชุด 👉'}
        </div>
      </div>
    </div>
  );
};
