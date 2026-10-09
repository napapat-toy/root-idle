'use client';

import React, { useState } from 'react';
import { Language } from '@/types/game';
import { t } from '@/lib/i18n';

export interface InfoModalProps {
  isOpen: boolean;
  lang?: Language;
  onClose: () => void;
}

type InfoTab = 'currencies' | 'resets' | 'events' | 'save';

export const InfoModal: React.FC<InfoModalProps> = React.memo(({
  isOpen,
  lang = 'th',
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<InfoTab>('currencies');
  const isEn = lang === 'en';
  const tr = t(lang);

  if (!isOpen) return null;

  return (
    <div className="offline-backdrop" onClick={onClose} style={{ zIndex: 2060 }}>
      <div
        className="modal-wrapper"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '620px', width: '100%' }}
      >
        <button className="modal-close-x" onClick={onClose} aria-label={tr.close}>
          &times;
        </button>

        <div
          className="offline-modal generic-modal custom-scrollbar"
          style={{ maxHeight: '88vh', display: 'flex', flexDirection: 'column', padding: '18px 20px', textAlign: 'left' }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '14px' }}>
            <div className="icon" style={{ fontSize: '32px', marginBottom: '4px' }}>📖</div>
            <h2 style={{ margin: '0 0 4px', fontSize: '18px' }}>
              {isEn ? 'Game Compendium & Guide' : 'คู่มือข้อมูลเกม & ระบบค่าเงิน'}
            </h2>
            <div className="away-time" style={{ fontSize: '12px' }}>
              {isEn
                ? 'Comprehensive guide to Root Idle currencies, mechanics, and resets'
                : 'รายละเอียดแหล่งที่มาของค่าเงิน กฎการรีเซต และระบบอีเวนต์ทั้งหมดในเกม'}
            </div>
          </div>

          {/* Segmented Control Tabs */}
          <div
            style={{
              display: 'flex',
              background: 'var(--bg-panel-2)',
              borderRadius: '12px',
              padding: '3px',
              border: '1px solid var(--line-soil)',
              marginBottom: '14px',
              gap: '4px',
            }}
          >
            {[
              { id: 'currencies' as InfoTab, icon: '🪙', label: isEn ? 'Currencies' : 'หน่วยเงิน' },
              { id: 'resets' as InfoTab, icon: '🔄', label: isEn ? 'Resets' : 'การรีเซต' },
              { id: 'events' as InfoTab, icon: '🎁', label: isEn ? 'Events' : 'อีเวนต์' },
              { id: 'save' as InfoTab, icon: '💾', label: isEn ? 'Save System' : 'ระบบเซฟ' },
            ].map(tab => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: 1,
                    padding: '7px 8px',
                    borderRadius: '9px',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    background: active ? 'var(--accent-glow)' : 'transparent',
                    color: active ? '#12190d' : 'var(--root-cream)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div
            className="custom-scrollbar"
            style={{
              flex: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              paddingRight: '4px',
            }}
          >
            {/* TAB 1: CURRENCIES */}
            {activeTab === 'currencies' && (
              <>
                {/* Nutrients */}
                <div className="prestige-item" style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '20px' }}>🌱</span>
                    <div>
                      <b style={{ color: 'var(--accent-amber)', fontSize: '14px' }}>
                        {isEn ? 'Nutrients (Main Currency)' : 'สารอาหาร (ค่าเงินหลัก)'}
                      </b>
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--root-cream-dim)', lineHeight: 1.6 }}>
                    <div>
                      📍 <b>{isEn ? 'How to get:' : 'วิธีได้รับ:'}</b> {isEn
                        ? 'Generated continuously by your roots based on Total Nutrients/sec rate, water droplets, and event bonuses.'
                        : 'ผลิตขึ้นอัตโนมัติตลอดเวลาจากรากไม้ของคุณ ตามอัตราสารอาหาร/วินาที และจากการคลิกรดน้ำหรือเก็บกล่องอีเวนต์'}
                    </div>
                    <div>
                      🎯 <b>{isEn ? 'Usage:' : 'วิธีใช้งาน:'}</b> {isEn
                        ? 'Buy and expand root modules (from Fine Roots to Yggdrasil), purchase synergies, and invest in echoes.'
                        : 'ใช้ซื้อขยายรากไม้ทุกระดับ (ตั้งแต่รากฝอยจนถึงอิกดราซิล), ซื้อเครือข่ายรากผสาน และสะสมคลื่นสะท้อน'}
                    </div>
                  </div>
                </div>

                {/* Eternal Seeds */}
                <div className="prestige-item" style={{ padding: '12px 14px', borderColor: 'rgba(168, 85, 247, 0.4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '20px' }}>🌌</span>
                    <div>
                      <b style={{ color: '#ffd76a', fontSize: '14px' }}>
                        {isEn ? 'Eternal Seeds (Prestige Currency)' : 'เมล็ดนิรันดร์ (ค่าเงินจุติ Prestige)'}
                      </b>
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--root-cream-dim)', lineHeight: 1.6 }}>
                    <div>
                      📍 <b>{isEn ? 'How to get:' : 'วิธีได้รับ:'}</b> {isEn
                        ? 'Earned through Prestige (Re-sow) reset once you have accumulated at least 10 Billion (10B) nutrients in a run.'
                        : 'ได้รับจากการกด "จุติ (Prestige)" เมื่อสะสมสารอาหารในรอบการเล่นนั้นได้ตั้งแต่ 10 พันล้าน (10B) ขึ้นไป'}
                    </div>
                    <div>
                      🎯 <b>{isEn ? 'Usage:' : 'วิธีใช้งาน:'}</b> {isEn
                        ? 'Invest in Sanctuary upgrades (Economy, Automation, Events, and Lucky Frequency/Magnitude), or transmute into Astral Petals.'
                        : 'ใช้อัปเกรดวิหารศักดิ์สิทธิ์ (ระบบอัตโนมัติ, อัตราเร่งการผลิต, โอกาสโชคดี) และใช้หลอมเป็นเกสรดวงดาว'}
                    </div>
                  </div>
                </div>

                {/* Gaia Essences */}
                <div className="prestige-item" style={{ padding: '12px 14px', borderColor: 'rgba(52, 211, 153, 0.4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '20px' }}>🌍</span>
                    <div>
                      <b style={{ color: '#34d399', fontSize: '14px' }}>
                        {isEn ? 'Gaia Essences (Transcendence Currency)' : 'ละอองชีวิตดึกดำบรรพ์ (ค่าเงินตื่นรู้แห่งไกอา)'}
                      </b>
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--root-cream-dim)', lineHeight: 1.6 }}>
                    <div>
                      📍 <b>{isEn ? 'How to get:' : 'วิธีได้รับ:'}</b> {isEn
                        ? 'Earned by Transcendence (Grand Reset) after owning 100 Yggdrasil World Tree roots. Formula: based on your total lifetime seeds.'
                        : 'ได้รับจากการกด "ตื่นรู้แห่งไกอา (Transcendence)" เมื่อครอบครองรากไม้อิกดราซิลครบ 100 ต้นขึ้นไป'}
                    </div>
                    <div>
                      🎯 <b>{isEn ? 'Usage:' : 'วิธีใช้งาน:'}</b> {isEn
                        ? 'Unlock 10 cosmic Gaia Perks (Hyperdrive, Automation Manager, Aurora Bloom), unlock root skins in Wardrobe, or transmute into Astral Petals.'
                        : 'ใช้ปลดล็อกพรไกอาทั้ง 10 ข้อ (ไฮเปอร์ดรฟ์, บุปผาแสงเหนือ), ซื้อสกินรากไม้ และใช้หลอมเป็นเกสรดวงดาว'}
                    </div>
                  </div>
                </div>

                {/* Astral Petals */}
                <div className="prestige-item" style={{ padding: '12px 14px', borderColor: 'rgba(244, 114, 182, 0.45)', background: 'linear-gradient(135deg, rgba(244, 114, 182, 0.08), rgba(168, 85, 247, 0.08))' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '20px' }}>🌸</span>
                    <div>
                      <b style={{ color: '#f472b6', fontSize: '14px' }}>
                        {isEn ? 'Astral Petals (Endgame Altar Currency)' : 'เกสรดวงดาว (ค่าเงินเตาหลอมชั้นสูง)'}
                      </b>
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--root-cream-dim)', lineHeight: 1.6 }}>
                    <div>
                      📍 <b>{isEn ? 'How to get:' : 'วิธีได้รับ (มี 2 วิธีเท่านั้น):'}</b>
                      <ul style={{ margin: '4px 0 6px 18px', padding: 0 }}>
                        <li>
                          {isEn
                            ? '🔮 Transmute at the Altar (Sanctuary ➔ Astral tab): 50B Seeds ➔ 1 Petal or 100,000 Essences ➔ 1 Petal.'
                            : '🔮 หลอมที่เตาหลอมดวงดาว (วิหารศักดิ์สิทธิ์ ➔ แท็บเกสร): ใช้ 50 พันล้านเมล็ด หรือ 100,000 ละอองชีวิต ➔ 1 เกสร'}
                        </li>
                        <li>
                          {isEn
                            ? '🌸 Bonus Event Drop: Once Aurora Bloom (Gaia Perk 10) is unlocked, claiming ANY event has a flat 5% chance to drop +1 Astral Petal!'
                            : '🌸 ดรอปโบนัสจากอีเวนต์: เมื่อปลดล็อกบุปผาแสงเหนือ (พรไกอาข้อ 10) แล้ว ทุกครั้งที่กดเก็บกล่องอีเวนต์ใดๆ จะมีโอกาส 5% ได้รับ +1 เกสรดวงดาวพ่วงมาด้วย!'}
                        </li>
                      </ul>
                    </div>
                    <div>
                      🎯 <b>{isEn ? 'Usage:' : 'วิธีใช้งาน:'}</b> {isEn
                        ? 'Invest in Astral Resonance (up to +1,000% global production bonus multiplier) and unlock exclusive Mythic root skins in the Wardrobe.'
                        : 'ใช้อัปเกรดเรโซแนนซ์ดวงดาว (เพิ่มตัวคูณการผลิตสูงสุด +1,000%) และปลดล็อกสกินรากไม้ระดับพิเศษในตู้เสื้อผ้า'}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* TAB 2: RESETS */}
            {activeTab === 'resets' && (
              <>
                {/* Prestige */}
                <div className="prestige-item" style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '20px' }}>🌌</span>
                    <b style={{ color: '#ffd76a', fontSize: '14px' }}>
                      {isEn ? 'Tier 1: Prestige (Re-sow)' : 'ขั้นที่ 1: การจุติ (Prestige)'}
                    </b>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--root-cream-dim)', lineHeight: 1.6 }}>
                    <div>
                      🔓 <b>{isEn ? 'Unlock condition:' : 'เงื่อนไขปลดล็อก:'}</b> {isEn ? 'Earn 10B nutrients in a single run.' : 'สะสมสารอาหารครบ 10 พันล้านในรอบปัจจุบัน'}
                    </div>
                    <div>
                      🔄 <b>{isEn ? 'What is reset:' : 'สิ่งที่ถูกรีเซต:'}</b> {isEn ? 'Nutrients and root modules owned.' : 'สารอาหาร และรากไม้ที่ซื้อไว้ทั้งหมด'}
                    </div>
                    <div>
                      🛡️ <b>{isEn ? 'What is preserved:' : 'สิ่งที่คงอยู่:'}</b> {isEn ? 'Eternal Seeds, Sanctuary upgrades, Echoes, and Achievements.' : 'เมล็ดนิรันดร์, อัปเกรดในวิหาร, คลื่นสะท้อน และความสำเร็จ'}
                    </div>
                  </div>
                </div>

                {/* Transcendence */}
                <div className="prestige-item" style={{ padding: '12px 14px', borderColor: 'rgba(52, 211, 153, 0.4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '20px' }}>🌍</span>
                    <b style={{ color: '#34d399', fontSize: '14px' }}>
                      {isEn ? 'Tier 2: Transcendence (Gaia Awakening)' : 'ขั้นที่ 2: การตื่นรู้แห่งไกอา (Transcendence)'}
                    </b>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--root-cream-dim)', lineHeight: 1.6 }}>
                    <div>
                      🔓 <b>{isEn ? 'Unlock condition:' : 'เงื่อนไขปลดล็อก:'}</b> {isEn ? 'Purchase 100 Yggdrasil World Tree roots.' : 'ซื้อรากไม้อิกดราซิลครบ 100 ต้น'}
                    </div>
                    <div>
                      🔄 <b>{isEn ? 'What is reset:' : 'สิ่งที่ถูกรีเซต:'}</b> {isEn ? 'Roots, nutrients, and unspent seeds.' : 'รากไม้, สารอาหาร และเมล็ดนิรันดร์ที่ยังไม่ได้ใช้'}
                    </div>
                    <div>
                      🛡️ <b>{isEn ? 'What is preserved:' : 'สิ่งที่คงอยู่:'}</b> {isEn ? 'Gaia Essences, Gaia Perks, Relics, Wardrobe cosmetics, Trials progress, and Astral Petals.' : 'ละอองชีวิต, พรไกอา, โบราณวัตถุ, สกินรากไม้, การผ่านการทดสอบ และเกสรดวงดาว'}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* TAB 3: EVENTS */}
            {activeTab === 'events' && (
              <>
                <div className="prestige-item" style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '20px' }}>🎁</span>
                    <b style={{ color: 'var(--accent-amber)', fontSize: '14px' }}>
                      {isEn ? 'Nutrient Bump (Golden Gift Box)' : '🎁 กล่องสารอาหาร (Nutrient Bump)'}
                    </b>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--root-cream-dim)', lineHeight: 1.5 }}>
                    {isEn
                      ? 'Instantly grants a huge bundle of nutrients proportional to your current production rate (e.g. 30–60s worth of nutrients).'
                      : 'มอบสารอาหารก้อนโตให้ทันทีตามอัตราการผลิตต่อวินาทีในขณะนั้น (เทียบเท่าผลผลิต 30–60 วินาที)'}
                  </div>
                </div>

                <div className="prestige-item" style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '20px' }}>⚡</span>
                    <b style={{ color: '#b7e08a', fontSize: '14px' }}>
                      {isEn ? 'Surge Buff (Lightning Energy)' : '⚡ พลังพุ่งทะยาน (Surge Buff)'}
                    </b>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--root-cream-dim)', lineHeight: 1.5 }}>
                    {isEn
                      ? 'Temporarily multiplies your production rate (e.g. ×2 to ×10) for 20–60 seconds. Collecting another buff extends duration or upgrades the multiplier.'
                      : 'เพิ่มตัวคูณอัตราการผลิตชั่วคราว (เช่น ×2 ถึง ×10) เป็นเวลา 20–60 วินาที หากเก็บซ้ำจะต่อเวลาหรืออัปเกรดตัวคูณให้สูงขึ้น'}
                  </div>
                </div>

                <div className="prestige-item" style={{ padding: '12px 14px', borderColor: 'rgba(251, 191, 36, 0.5)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '20px' }}>🍀</span>
                    <b style={{ color: '#ffd76a', fontSize: '14px' }}>
                      {isEn ? 'Lucky Jackpot (Clover ×777)' : '🍀 แจ็กพอตโชคดี (Lucky Clover)'}
                    </b>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--root-cream-dim)', lineHeight: 1.5 }}>
                    {isEn
                      ? 'Rare jackpot with baseline 0.2%–1.0% chance. Activates a massive ×777 (up to ×77,000) multiplier for a short duration and has chances to unearth relic fragments or super jackpots.'
                      : 'แจ็กพอตหายากที่มีโอกาสเกิดเริ่มต้น 0.2% – 1.0% (อัปเกรดได้ในวิหาร) มอบตัวคูณมหาศาลเริ่มต้น ×777 (สูงสุด ×77,000) และมีโอกาสขุดพบเศษโบราณวัตถุ'}
                  </div>
                </div>

                <div className="prestige-item" style={{ padding: '12px 14px', borderColor: 'rgba(244, 114, 182, 0.45)', background: 'rgba(244, 114, 182, 0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '20px' }}>🌸</span>
                    <b style={{ color: '#f472b6', fontSize: '14px' }}>
                      {isEn ? 'Astral Petals Bonus Drop (5% on Any Event)' : '🌸 โบนัสเกสรดวงดาว (5% จากทุกอีเวนต์)'}
                    </b>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--root-cream-dim)', lineHeight: 1.5 }}>
                    {isEn
                      ? 'Once Aurora Bloom is unlocked, whenever you claim ANY event (🎁, ⚡, 🍀), you have a flat 5% chance to receive +1 Astral Petal alongside your reward!'
                      : 'เมื่อปลดล็อกบุปผาแสงเหนือแล้ว ทุกครั้งที่กดรับอีเวนต์ใดๆ (🎁, ⚡, 🍀) จะมีโอกาส 5% ได้รับ +1 เกสรดวงดาวพ่วงมาด้วยทันที!'}
                  </div>
                </div>
              </>
            )}

            {/* TAB 4: SAVE SYSTEM */}
            {activeTab === 'save' && (
              <>
                <div className="prestige-item" style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '20px' }}>🟢</span>
                    <b style={{ color: '#34d399', fontSize: '14px' }}>
                      {isEn ? 'Automatic Browser Save' : 'ระบบ Auto-Save อัตโนมัติ'}
                    </b>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--root-cream-dim)', lineHeight: 1.5 }}>
                    {isEn
                      ? 'The game continuously saves your progress to your browser LocalStorage every second. You will never lose progress on normal play.'
                      : 'ตัวเกมบันทึกความคืบหน้าลงใน LocalStorage ของเบราว์เซอร์อัตโนมัติอย่างต่อเนื่องตลอดเวลา'}
                  </div>
                </div>

                <div className="prestige-item" style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '20px' }}>💾</span>
                    <b style={{ color: '#ffd76a', fontSize: '14px' }}>
                      {isEn ? 'Manual Save Slots (1 – 3)' : 'สล็อตบันทึกสำรอง (ช่องที่ 1 – 3)'}
                    </b>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--root-cream-dim)', lineHeight: 1.5 }}>
                    {isEn
                      ? 'Located in Options ➔ Save Slots. Allows saving up to 3 separate backup checkpoints (recording playtime, nutrients, seeds, essences, petals, and relics).'
                      : 'อยู่ในหน้า ตั้งค่า ➔ สล็อตบันทึก สามารถใช้สำรองจุดเซฟย้อนหลังได้ 3 ช่อง (แสดงเวลาเล่น, สารอาหาร, เมล็ด, ละอองชีวิต, เกสรดวงดาว และโบราณวัตถุครบถ้วน)'}
                  </div>
                </div>

                <div className="prestige-item" style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '20px' }}>📤</span>
                    <b style={{ color: '#38bdf8', fontSize: '14px' }}>
                      {isEn ? 'Export / Import Save Codes' : 'ระบบ Export / Import โค้ดเซฟ'}
                    </b>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--root-cream-dim)', lineHeight: 1.5 }}>
                    {isEn
                      ? 'Export your save code into text to transfer progress between browsers or devices, or paste an exported code to restore progress anytime.'
                      : 'สามารถคัดลอกโค้ดเซฟเป็นข้อความเพื่อย้ายเครื่องหรือเปลี่ยนเบราว์เซอร์ และนำโค้ดมาวางเพื่อโหลดเกมกลับมาได้ตลอดเวลา'}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Action */}
          <div style={{ marginTop: '14px', textAlign: 'center' }}>
            <button
              className="modal-button primary"
              type="button"
              onClick={onClose}
              style={{ minWidth: '130px', padding: '9px 24px', fontWeight: 700 }}
            >
              {tr.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

InfoModal.displayName = 'InfoModal';
