'use client';

import React, { useState } from 'react';
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
  previewSkin,
  previewUITheme,
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

  if (!isOpen) return null;

  const handleClose = () => {
    onClearPreview();
    onClose();
  };

  const lang: Language = state.lang || 'th';
  const isEn = lang === 'en';
  const tr = t(lang);

  const isSkinOwned = (id: SkinId) => {
    if (id === 'none') return true;
    const key = SKIN_PRESTIGE_KEYS[id];
    return key ? !!state.prestige[key as keyof typeof state.prestige] : false;
  };

  const isUIThemeOwned = (id: UIThemeId) => {
    if (id === 'classic') return true;
    const key = UI_THEME_PRESTIGE_KEYS[id];
    return key ? !!state.prestige[key as keyof typeof state.prestige] : false;
  };

  const skinDescriptions: Record<SkinId, { th: string; en: string }> = {
    none: {
      th: 'โทนไม้ธรรมชาติคลาสสิก อบอุ่น เรียบง่ายสไตล์เซน',
      en: 'Classic natural wooden roots, warm and rustic zen tone',
    },
    rainbow: {
      th: 'แยกสีรากตามชนิดโมดูลที่ซื้อ สดใสหลากสีสัน (Module Spectrum)',
      en: 'Colors branches distinctly based on root module species',
    },
    sakura: {
      th: 'บรรยากาศสวนซากุระยามค่ำคืน โทนสเลทชาร์โคลและกลีบชมพูซากุระหม่น',
      en: 'Midnight Kyoto sakura grove with dusky rose petals and soft cream tips',
    },
    cafe: {
      th: 'กลิ่นอายมัทฉะตัดกับช็อกโกแลตเข้มข้น โทนโกโก้ มัทฉะอุจิ และครีมนม',
      en: 'Cozy cafe vibes blending roasted cocoa, matcha green, and silky cream',
    },
    autumn: {
      th: 'ฤดูใบไม้ร่วงในเกียวโต โทนส้มอิฐเทอราคอตตา ทองอำพัน และแดงเมเปิ้ล',
      en: 'Kyoto autumn foliage with burnt terracotta, golden amber, and crimson leaves',
    },
    ocean: {
      th: 'โลกใต้ทะเลลึกเรืองแสง โทนเขียวอมฟ้าก้นสมุทรและเทอร์ควอยซ์พรายน้ำ',
      en: 'Deep abyss bioluminescence with glowing seafoam teal and radiant aqua',
    },
    frost: {
      th: 'รากไม้คริสตัลน้ำแข็งขั้วโลก โทนฟ้าไอซ์บลูอ่อนและขาวหิมะบริสุทธิ์',
      en: 'Glacial frost crystal roots transitioning from ice blue to pure white',
    },
    sunset: {
      th: 'แสงแดดสีทองยามเย็น โทนม่วงทไวไลท์ ส้มพีช และกุหลาบดัสก์',
      en: 'Golden hour twilight with sunset peach, dusk rose, and amber horizon',
    },
    sameorigin: {
      th: 'แตกสีกิ่งย่อยตามตระกูลรากแก้วต้นทาง คุมโทนกิ่งหลักอย่างลงตัว',
      en: 'Branches inherit the distinct color family of their respective parent root',
    },
    mystic: {
      th: 'ป่าเทพนิยายแฟนตาซี โทนลาเวนเดอร์แสงจันทร์และสปอร์เรืองแสง',
      en: 'Enchanted fairy grove with moonlight lilac and glowing magical spores',
    },
    cyberpunk: {
      th: 'นีออนล้ำยุคยามค่ำคืน โทนดำสนิทตัดกับนีออนไซยานและม่วงอิเล็กทริก',
      en: 'High-contrast midnight cyber theme with glowing neon cyan and electric purple',
    },
    grayscale: {
      th: 'โทนขาวดำคลาสสิก ไล่เฉดจากชาร์โคลสู่เงินสลัว สไตล์มินิมอล',
      en: 'Monochromatic black-and-white theme transitioning from charcoal to silver',
    },
    gradient: {
      th: 'เขียวมรกตป่าฝนเขียวขจี ไล่จากเข้มที่ลำต้นไปอ่อนที่ปลายราก',
      en: 'Lush emerald rainforest gradient smoothly transitioning to tender tips',
    },
    nebula: {
      th: 'ล่องลอยในห้วงอวกาศ โทนม่วงมิดไนท์ ละอองเนบิวลา และประกายดาว',
      en: 'Deep space cosmic nebula with starlight violet, galactic blue, and pulsar pink',
    },
    imperial: {
      th: 'วิหารทองคำจักรพรรดิ โทนหินภูเขาไฟออบซิเดียนตัดกับทองคำบริสุทธิ์',
      en: 'Imperial golden relic with obsidian stone and shimmering pure royal gold',
    },
  };

  const uiThemeDescriptions: Record<UIThemeId, { th: string; en: string }> = {
    classic: {
      th: 'หน้าต่างดินธรรมชาติคลาสสิก น้ำตาลดินอบอุ่น ครีมวานิลลา และเขียวมอสส์',
      en: 'Classic earthy soil windows with vanilla cream and gentle moss green accents',
    },
    sakura: {
      th: 'พื้นหลังหมึกดำมิดไนท์ ตัดกับขอบไวน์กุหลาบและแสงสีชมพูซากุระ',
      en: 'Midnight ink-black background with delicate sakura pink accents and wine borders',
    },
    cafe: {
      th: 'แผงการ์ดดาร์กโกโก้อบอุ่น ปุ่มเขียวมัทฉะอุจิ และไฮไลต์ครีมนม',
      en: 'Rich dark cocoa panels with cozy matcha green buttons and creamy milk highlights',
    },
    autumn: {
      th: 'ชาร์โคลอุ่น ตัดกับขอบส้มอิฐเทอราคอตตาและแสงทองอำพัน',
      en: 'Warm charcoal slate with burnt terracotta borders and golden amber glow',
    },
    ocean: {
      th: 'โทนก้นสมุทรลึก Deep Navy ขอบเทอร์ควอยซ์และปุ่มพรายน้ำเรืองแสง',
      en: 'Deep abyssal navy shell with radiant turquoise borders and glowing aqua buttons',
    },
    frost: {
      th: 'อินเทอร์เฟซน้ำแข็งขั้วโลก ขอบคริสตัลไอซ์บลู และไฮไลต์ขาวหิมะ',
      en: 'Polar ice slate interface with crystal blue borders and frost white accents',
    },
    sunset: {
      th: 'แผงทไวไลท์พลัม ขอบส้มพีชยามเย็น และแสงประกายสีทองอัสดง',
      en: 'Twilight plum panels with sunset peach borders and warm golden hour radiance',
    },
    mystic: {
      th: 'โทนไม้ดำป่าเวทมนตร์ ขอบลาเวนเดอร์แสงจันทร์ และแสงเรืองมิ้นต์ภูติ',
      en: 'Enchanted blackwood shell with moonlight lavender borders and fairy mint glow',
    },
    cyberpunk: {
      th: 'ดำออบซิเดียนสนิท ตัดกับขอบนีออนไซยานและม่วงอิเล็กทริกสุดล้ำ',
      en: 'Pure obsidian stealth dark with high-contrast electric neon cyan & purple UI',
    },
    grayscale: {
      th: 'สไตล์มินิมอลโมเดิร์น โทนชาร์โคลระดับพรีเมียมและขอบเงินซาติน',
      en: 'Ultra-clean monochromatic dark aesthetic with satin silver borders and modern slate',
    },
    emerald: {
      th: 'ดำป่าลึกมรกต ขอบเขียวมรกตเจิดจรัส และแสงใบไม้ป่าฝน',
      en: 'Deep jungle obsidian with vibrant emerald green borders and lush leaf highlights',
    },
    nebula: {
      th: 'ห้วงอวกาศมิดไนท์ การ์ดม่วงเนบิวลา ขอบแสงดาว และประกายกาแลกซี่',
      en: 'Midnight cosmic void with nebula purple cards, galactic blue lines, and pink starlight',
    },
    imperial: {
      th: 'ศิลาภูเขาไฟออบซิเดียน ขอบทองคำบรอนซ์ และแสงทองคำบริสุทธิ์',
      en: 'Imperial volcanic stone with polished royal bronze borders and pure golden glow',
    },
  };

  return (
    <div className="offline-backdrop" onClick={handleClose}>
      <div
        className="modal-wrapper"
        style={{ maxWidth: '640px', width: '92vw', maxHeight: '88vh', display: 'flex', flexDirection: 'column' }}
        onClick={e => e.stopPropagation()}
      >
        <button className="modal-close-x" onClick={handleClose} aria-label={tr.close}>
          &times;
        </button>

        <div className="generic-modal" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '20px' }}>
          {/* Header Title */}
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 4px', color: 'var(--root-cream)' }}>
              🎨 {tr.wardrobeTitle}
            </h2>
            <div style={{ fontSize: '12px', color: 'var(--root-cream-dim)' }}>
              {isEn
                ? 'Customize your root tree appearance and entire UI color theme independently.'
                : 'ปรับแต่งสกินรากไม้ และเปลี่ยนโทนสีหน้าต่าง UI ได้อย่างอิสระตามสไตล์คุณ'}
            </div>
          </div>

          {/* Tab Switcher */}
          <div
            style={{
              display: 'flex',
              background: 'var(--bg-panel-2)',
              borderRadius: '10px',
              padding: '4px',
              gap: '6px',
              marginBottom: '16px',
              border: '1px solid var(--line-soil)',
            }}
          >
            <button
              onClick={() => setActiveTab('skins')}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: activeTab === 'skins' ? 'var(--accent-glow)' : 'transparent',
                color: activeTab === 'skins' ? '#12190d' : 'var(--root-cream)',
              }}
            >
              {tr.tabRootSkins} ({SKIN_DEFS.filter(s => isSkinOwned(s.id)).length}/{SKIN_DEFS.length})
            </button>
            <button
              onClick={() => setActiveTab('themes')}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: activeTab === 'themes' ? 'var(--accent-glow)' : 'transparent',
                color: activeTab === 'themes' ? '#12190d' : 'var(--root-cream)',
              }}
            >
              {tr.tabUIThemes} ({UI_THEME_DEFS.filter(t => isUIThemeOwned(t.id)).length}/{UI_THEME_DEFS.length})
            </button>
          </div>

          {/* Tab Content List */}
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {activeTab === 'skins' && (
              <>
                {SKIN_DEFS.map(sDef => {
                  const id = sDef.id;
                  const owned = isSkinOwned(id);
                  const active = state.prestige.activeSkin === id;
                  const isPreviewing = previewSkin === id;
                  const cost = SKIN_COSTS[id] || 0;
                  const name = SKIN_NAMES[id]?.[lang] || sDef.name;
                  const desc = skinDescriptions[id]?.[lang] || '';

                  return (
                    <div
                      key={`wardrobe-skin-${id}`}
                      className={`prestige-item ${!owned ? 'disabled' : ''} ${active ? 'skin-active' : ''}`}
                      style={{
                        padding: '10px 14px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        borderColor: isPreviewing ? '#38bdf8' : active ? 'var(--accent-glow)' : undefined,
                        boxShadow: isPreviewing ? '0 0 10px rgba(56, 189, 248, 0.3)' : undefined,
                      }}
                    >
                      <div className="p-top" style={{ marginBottom: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 600, fontSize: '14px' }}>{name}</span>
                          {active && (
                            <span style={{ fontSize: '11px', color: 'var(--accent-glow)', fontWeight: 700 }}>
                              {tr.equippedBadge}
                            </span>
                          )}
                          {isPreviewing && (
                            <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 700 }}>
                              ✨ {isEn ? 'Previewing' : 'กำลังลอง'}
                            </span>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          {owned ? (
                            !active && (
                              <button
                                onClick={() => onSelectSkin(id)}
                                style={{
                                  padding: '4px 10px',
                                  fontSize: '11px',
                                  borderRadius: '6px',
                                  background: 'var(--accent-glow-dim)',
                                  color: '#12190d',
                                  fontWeight: 700,
                                  border: 'none',
                                  cursor: 'pointer',
                                }}
                              >
                                {tr.equipBtn}
                              </button>
                            )
                          ) : (
                            <>
                              <button
                                onClick={() => onStartPreviewSkin(id)}
                                style={{
                                  padding: '4px 8px',
                                  fontSize: '11px',
                                  borderRadius: '6px',
                                  background: isPreviewing ? 'rgba(56, 189, 248, 0.4)' : 'rgba(56, 189, 248, 0.2)',
                                  color: '#38bdf8',
                                  border: '1px solid rgba(56, 189, 248, 0.5)',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                }}
                              >
                                {tr.tryPreviewBtn}
                              </button>
                              {state.eternalSeeds >= cost ? (
                                <button
                                  onClick={() => onBuySkin(id, true)}
                                  style={{
                                    padding: '4px 10px',
                                    fontSize: '11px',
                                    borderRadius: '6px',
                                    background: 'linear-gradient(135deg, #10b981, #059669)',
                                    color: '#ffffff',
                                    border: 'none',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    boxShadow: '0 0 8px rgba(16, 185, 129, 0.4)',
                                  }}
                                >
                                  🛒 {fmtInt(cost)} 🌌 {isEn ? 'Buy' : 'ซื้อ'}
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    handleClose();
                                    onOpenPrestige();
                                  }}
                                  style={{
                                    padding: '4px 8px',
                                    fontSize: '11px',
                                    borderRadius: '6px',
                                    background: 'var(--bg-panel-2)',
                                    color: '#c084fc',
                                    border: '1px solid rgba(192, 132, 252, 0.3)',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                  }}
                                  title={isEn ? `Need ${fmtInt(cost - state.eternalSeeds)} more seeds` : `ยังขาดอีก ${fmtInt(cost - state.eternalSeeds)} เมล็ด`}
                                >
                                  🔒 {fmtInt(cost)} 🌌
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      {desc && (
                        <div style={{ fontSize: '11px', color: 'var(--root-cream-dim)', lineHeight: 1.4 }}>
                          {desc}
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            )}

            {activeTab === 'themes' && (
              <>
                {UI_THEME_DEFS.map(tDef => {
                  const id = tDef.id;
                  const owned = isUIThemeOwned(id);
                  const active = (state.prestige.activeUITheme || 'classic') === id;
                  const isPreviewing = previewUITheme === id;
                  const cost = UI_THEME_COSTS[id] || 0;
                  const name = UI_THEME_NAMES[id]?.[lang] || tDef.name;
                  const desc = uiThemeDescriptions[id]?.[lang] || '';

                  return (
                    <div
                      key={`wardrobe-theme-${id}`}
                      className={`prestige-item ${!owned ? 'disabled' : ''} ${active ? 'skin-active' : ''}`}
                      style={{
                        padding: '10px 14px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        borderColor: isPreviewing ? '#38bdf8' : active ? 'var(--accent-glow)' : undefined,
                        boxShadow: isPreviewing ? '0 0 10px rgba(56, 189, 248, 0.3)' : undefined,
                      }}
                    >
                      <div className="p-top" style={{ marginBottom: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 600, fontSize: '14px' }}>{name}</span>
                          {active && (
                            <span style={{ fontSize: '11px', color: 'var(--accent-glow)', fontWeight: 700 }}>
                              {tr.equippedBadge}
                            </span>
                          )}
                          {isPreviewing && (
                            <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 700 }}>
                              ✨ {isEn ? 'Previewing' : 'กำลังลอง'}
                            </span>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          {owned ? (
                            !active && (
                              <button
                                onClick={() => onSelectUITheme(id)}
                                style={{
                                  padding: '4px 10px',
                                  fontSize: '11px',
                                  borderRadius: '6px',
                                  background: 'var(--accent-glow-dim)',
                                  color: '#12190d',
                                  fontWeight: 700,
                                  border: 'none',
                                  cursor: 'pointer',
                                }}
                              >
                                {tr.equipBtn}
                              </button>
                            )
                          ) : (
                            <>
                              <button
                                onClick={() => onStartPreviewUITheme(id)}
                                style={{
                                  padding: '4px 8px',
                                  fontSize: '11px',
                                  borderRadius: '6px',
                                  background: isPreviewing ? 'rgba(56, 189, 248, 0.4)' : 'rgba(56, 189, 248, 0.2)',
                                  color: '#38bdf8',
                                  border: '1px solid rgba(56, 189, 248, 0.5)',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                }}
                              >
                                {tr.tryPreviewBtn}
                              </button>
                              {state.eternalSeeds >= cost ? (
                                <button
                                  onClick={() => onBuyUITheme(id, true)}
                                  style={{
                                    padding: '4px 10px',
                                    fontSize: '11px',
                                    borderRadius: '6px',
                                    background: 'linear-gradient(135deg, #10b981, #059669)',
                                    color: '#ffffff',
                                    border: 'none',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    boxShadow: '0 0 8px rgba(16, 185, 129, 0.4)',
                                  }}
                                >
                                  🛒 {fmtInt(cost)} 🌌 {isEn ? 'Buy' : 'ซื้อ'}
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    handleClose();
                                    onOpenPrestige();
                                  }}
                                  style={{
                                    padding: '4px 8px',
                                    fontSize: '11px',
                                    borderRadius: '6px',
                                    background: 'var(--bg-panel-2)',
                                    color: '#c084fc',
                                    border: '1px solid rgba(192, 132, 252, 0.3)',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                  }}
                                  title={isEn ? `Need ${fmtInt(cost - state.eternalSeeds)} more seeds` : `ยังขาดอีก ${fmtInt(cost - state.eternalSeeds)} เมล็ด`}
                                >
                                  🔒 {fmtInt(cost)} 🌌
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      {desc && (
                        <div style={{ fontSize: '11px', color: 'var(--root-cream-dim)', lineHeight: 1.4 }}>
                          {desc}
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            )}
          </div>

          {/* Modal Footer */}
          <div style={{ marginTop: '14px', textAlign: 'center' }}>
            <button
              onClick={handleClose}
              style={{
                padding: '8px 24px',
                borderRadius: '8px',
                background: 'var(--bg-panel-2)',
                color: 'var(--root-cream)',
                border: '1px solid var(--line-soil)',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {tr.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
