'use client';

import React, { useState } from 'react';
import { AutoRootMode, GameState } from '@/types/game';
import { getActiveAutoRootMode } from '@/lib/autoBuyer';
import {
  AURA_ROOTS_COST,
  AUTO_EVENT_COST,
  AUTO_RESET_COST,
  AUTO_RESET_MIN_SEEDS,
  AUTO_ROOT_ALL_COST,
  AUTO_ROOT_COST,
  AUTO_ROOT_SMART_COST,
  calcPrestigeSeeds,
  eventBonusCost,
  eventDurationCost,
  eventDurationMaxed,
  goldenSeedCost,
  LUCKY_CHANCE_MAX,
  LUCKY_CHANCE_STEP,
  luckyChanceCost,
  luckyChanceMaxed,
  luckyChancePct,
  luckyDurationCost,
  luckyDurationExtra,
  luckyDurationMaxed,
  luckyMagnitudeCost,
  OFFLINE_CAP_HOURS,
  offlineCapCost,
  offlineCapMaxed,
  PASSIVE_RATE_COST,
  SKIN_COST,
  starterCultureCost,
} from '@/constants/gameData';
import { fmtInt } from '@/lib/formatters';
import { ConfirmModal } from './ConfirmModal';

interface PrestigeModalProps {
  isOpen: boolean;
  state: GameState;
  onClose: () => void;
  onConfirmPrestige: () => void;
  onBuyStarterCulture: () => void;
  onBuyGoldenSeed: () => void;
  onBuyPassiveRate: () => void;
  onBuyAutoRoot: () => void;
  onToggleAutoRoot: () => void;
  onSetAutoRootMode: (mode: AutoRootMode) => void;
  onBuyAutoRootSmart: () => void;
  onBuyAutoRootAll: () => void;
  onBuyAutoEvent: () => void;
  onToggleAutoEvent: () => void;
  onBuyAutoReset: () => void;
  onToggleAutoReset: () => void;
  onBuyEventBonus: () => void;
  onBuyEventDuration: () => void;
  onBuyLuckyChance: () => void;
  onBuyLuckyMagnitude: () => void;
  onBuyLuckyDuration: () => void;
  onBuyOfflineCapUpgrade: () => void;
  onBuyAuraRoots: () => void;
  onBuySkin: (skinKey: 'skinSameOrigin' | 'skinGrayscale' | 'skinGradient') => void;
}

export const PrestigeModal: React.FC<PrestigeModalProps> = ({
  isOpen,
  state,
  onClose,
  onConfirmPrestige,
  onBuyStarterCulture,
  onBuyGoldenSeed,
  onBuyPassiveRate,
  onBuyAutoRoot,
  onToggleAutoRoot,
  onSetAutoRootMode,
  onBuyAutoRootSmart,
  onBuyAutoRootAll,
  onBuyAutoEvent,
  onToggleAutoEvent,
  onBuyAutoReset,
  onToggleAutoReset,
  onBuyEventBonus,
  onBuyEventDuration,
  onBuyLuckyChance,
  onBuyLuckyMagnitude,
  onBuyLuckyDuration,
  onBuyOfflineCapUpgrade,
  onBuyAuraRoots,
  onBuySkin,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const seeds = state.eternalSeeds;
  const gained = calcPrestigeSeeds(state);

  const handlePrestigeClick = () => {
    if (gained <= 0) {
      setErrorMsg('ยังไม่มีสารอาหารสะสมพอที่จะได้เมล็ดนิรันดร์เลย เก็บต่ออีกหน่อยก่อนนะ');
      return;
    }
    setErrorMsg('');
    setShowConfirm(true);
  };

  const executePrestige = () => {
    setShowConfirm(false);
    onConfirmPrestige();
    onClose();
  };

  const renderItem = (
    title: string,
    badge: string,
    desc: string,
    costText: string,
    onClick?: () => void,
    disabled = false,
    owned = false,
    toggledOff = false,
    isActive = false
  ) => {
    return (
      <div
        onClick={!disabled && onClick ? onClick : undefined}
        className={`prestige-item ${owned ? 'owned' : ''} ${disabled ? 'disabled' : ''} ${
          toggledOff ? 'toggled-off' : ''
        } ${isActive ? 'is-active' : ''}`}
      >
        <div className="p-top">
          <span>{title}</span>
          <span>{badge}</span>
        </div>
        <div className="p-desc">{desc}</div>
        <div className="p-cost">{costText}</div>
      </div>
    );
  };

  const renderSectionHeader = (text: string) => (
    <div className="prestige-section-header">{text}</div>
  );

  return (
    <>
      <div className="offline-backdrop" onClick={onClose}>
        <div className="modal-wrapper prestige-modal-wrapper" onClick={e => e.stopPropagation()}>
          <button className="modal-close-x" onClick={onClose} aria-label="ปิด">
            &times;
          </button>

          <div className="offline-modal generic-modal prestige-modal-content">
            <div className="icon">🌌</div>
            <h2>การหว่านใหม่ (Prestige)</h2>
            <div className="away-time">
              รีเซ็ตของทุกชนิด สารอาหาร อัพเกรด และปุ๋ยทั้งหมด — แต่ Echo และของร้าน Prestige
              คงอยู่ถาวร
            </div>
            <div className="gain">+{fmtInt(gained)} เมล็ดนิรันดร์</div>
            <div style={{ fontSize: '12px', color: 'var(--root-cream-dim)', marginBottom: '14px' }}>
              ตอนนี้มี <b>{fmtInt(seeds)}</b> เมล็ดนิรันดร์
            </div>

            <div className="modal-actions">
              <button onClick={handlePrestigeClick}>ยืนยันหว่านใหม่</button>
              <button className="secondary" onClick={onClose}>
                ปิด
              </button>
            </div>

            {errorMsg && <div className="import-error">{errorMsg}</div>}

            <div className="panel-title" style={{ margin: '14px 0 8px', textAlign: 'left' }}>
              ร้าน Prestige
            </div>
            <div style={{ textAlign: 'left' }}>
              {/* ===== เศรษฐกิจ ===== */}
              {renderSectionHeader('เศรษฐกิจ')}
              {(() => {
                const sc = starterCultureCost(state);
                return renderItem(
                  '🌱 หัวเชื้อเริ่มต้น',
                  `เลเวล ${state.prestige.starterLevel}`,
                  `ได้รากฝอยฟรีทันที +10 ต้น (ใช้ได้เลยรอบนี้) และการันตี ${
                    (state.prestige.starterLevel || 0) * 10 + 10
                  } ต้นทุกครั้งที่หว่านใหม่ต่อจากนี้`,
                  `${sc} 🌌`,
                  onBuyStarterCulture,
                  seeds < sc
                );
              })()}

              {(() => {
                const gs = goldenSeedCost(state);
                return renderItem(
                  '✨ เมล็ดทองคำ',
                  `เลเวล ${state.prestige.goldenLevel}`,
                  `เพิ่มเมล็ดนิรันดร์ที่ได้รับตอน Prestige ครั้งต่อไปอีก 5% (ตอนนี้ +${
                    (state.prestige.goldenLevel || 0) * 5
                  }%)`,
                  `${gs} 🌌`,
                  onBuyGoldenSeed,
                  seeds < gs
                );
              })()}

              {(() => {
                const pr = state.prestige.passiveRateLevel || 0;
                return renderItem(
                  '🌟 พลังรากนิรันดร์',
                  `เลเวล ${pr}`,
                  `เพิ่มเรทรวมทั้งฟาร์มแบบถาวรอีก 1% ไม่จำกัดจำนวนครั้ง (ตอนนี้ +${pr}%)`,
                  `${PASSIVE_RATE_COST} 🌌`,
                  onBuyPassiveRate,
                  seeds < PASSIVE_RATE_COST
                );
              })()}

              {/* ===== ออโต้เมชัน ===== */}
              {renderSectionHeader('ออโต้เมชัน')}
              {(() => {
                const autoOwned = state.prestige.autoRoot;
                const enabled = state.prestige.autoRootEnabled;
                const activeMode = getActiveAutoRootMode(state);
                const isCurrent = activeMode === 'basic' && enabled;
                if (autoOwned) {
                  return renderItem(
                    '🤖 ออโต้ราก (พื้นฐาน: ถูกที่สุด)',
                    !enabled ? '⚪ ปิดอยู่' : isCurrent ? '✓ ใช้อยู่' : 'เปิดใช้งาน',
                    'ซื้อรากเสริมที่ราคาถูกที่สุดให้อัตโนมัติทุก 2 วินาที — คลิกเพื่อเลือกใช้ระดับนี้หรือเปิด/ปิด',
                    '—',
                    onSetAutoRootMode ? () => onSetAutoRootMode('basic') : onToggleAutoRoot,
                    false,
                    true, // owned = true (dark/muted)
                    !enabled,
                    isCurrent
                  );
                }
                return renderItem(
                  '🤖 ออโต้ราก',
                  '',
                  'เกมซื้อของให้อัตโนมัติทุก 2 วินาที ตลอดไป (โหมดเริ่มต้น: เลือกที่ถูกที่สุด)',
                  `${AUTO_ROOT_COST} 🌌`,
                  onBuyAutoRoot,
                  seeds < AUTO_ROOT_COST
                );
              })()}

              {state.prestige.autoRoot &&
                (() => {
                  const smartOwned = state.prestige.autoRootSmart;
                  const enabled = state.prestige.autoRootEnabled;
                  const activeMode = getActiveAutoRootMode(state);
                  const isCurrent = activeMode === 'smart' && enabled;
                  if (smartOwned) {
                    return renderItem(
                      '🧠 ออโต้รากอัจฉริยะ',
                      !enabled ? '⚪ ปิดอยู่' : isCurrent ? '✓ ใช้อยู่' : 'ปลดล็อกแล้ว (คลิกใช้)',
                      'คำนวณล่วงหน้า 1-2 นาที เก็บสารอาหารรอซื้อรากที่คุ้มและได้เรทสูงสุด — คลิกเพื่อเลือกใช้ระดับนี้',
                      '—',
                      () => onSetAutoRootMode('smart'),
                      false,
                      true, // owned = true (dark/muted)
                      !enabled,
                      isCurrent
                    );
                  }
                  return renderItem(
                    '🧠 ออโต้รากอัจฉริยะ',
                    '',
                    'อัพเกรดออโต้ราก: คำนวณล่วงหน้า 1-2 นาที เก็บสารอาหารรอซื้ออันที่คุ้มและได้เรทสูงสุด',
                    `${AUTO_ROOT_SMART_COST} 🌌`,
                    onBuyAutoRootSmart,
                    seeds < AUTO_ROOT_SMART_COST
                  );
                })()}

              {state.prestige.autoRootSmart &&
                (() => {
                  const allOwned = state.prestige.autoRootAll;
                  const enabled = state.prestige.autoRootEnabled;
                  const activeMode = getActiveAutoRootMode(state);
                  const isCurrent = activeMode === 'all' && enabled;
                  if (allOwned) {
                    return renderItem(
                      '♾️ ออโต้รากทุกสรรพสิ่ง',
                      !enabled ? '⚪ ปิดอยู่' : isCurrent ? '✓ ใช้อยู่' : 'ปลดล็อกแล้ว (คลิกใช้)',
                      'นอกจากซื้อรากเสริม ยังไล่ซื้ออัพเกรด และสะท้อนรากที่คุ้มที่สุดให้อัตโนมัติด้วย — คลิกเพื่อเลือกใช้ระดับนี้',
                      '—',
                      () => onSetAutoRootMode('all'),
                      false,
                      true, // owned = true (dark/muted)
                      !enabled,
                      isCurrent
                    );
                  }
                  return renderItem(
                    '♾️ ออโต้รากทุกสรรพสิ่ง',
                    '',
                    'อัพเกรดออโต้รากอีกขั้น: นอกจากซื้อรากเสริม ยังไล่ซื้ออัพเกรด และสะท้อนรากที่คุ้มที่สุดให้อัตโนมัติด้วย',
                    `${AUTO_ROOT_ALL_COST} 🌌`,
                    onBuyAutoRootAll,
                    seeds < AUTO_ROOT_ALL_COST
                  );
                })()}

              {(() => {
                const autoEventOwned = state.prestige.autoEvent;
                const enabled = state.prestige.autoEventEnabled;
                if (autoEventOwned) {
                  return renderItem(
                    '🎯 ออโต้อีเว้น',
                    enabled ? '🟢 เปิดอยู่' : '⚪ ปิดอยู่',
                    'คลิกอีเว้นที่โผล่มาให้อัตโนมัติทุกครั้ง ไม่พลาดอีเว้นอีกต่อไป — กดเพื่อเปิด/ปิดชั่วคราว',
                    '—',
                    onToggleAutoEvent,
                    false,
                    true, // owned = true (dark/muted)
                    !enabled
                  );
                }
                return renderItem(
                  '🎯 ออโต้อีเว้น',
                  '',
                  'คลิกอีเว้นที่โผล่มาให้อัตโนมัติทุกครั้ง ไม่พลาดอีเว้นอีกต่อไปแม้ไม่อยู่หน้าจอ',
                  `${AUTO_EVENT_COST} 🌌`,
                  onBuyAutoEvent,
                  seeds < AUTO_EVENT_COST
                );
              })()}

              {(() => {
                const autoResetOwned = state.prestige.autoReset;
                const enabled = state.prestige.autoResetEnabled;
                if (autoResetOwned) {
                  return renderItem(
                    '🔁 ออโต้หว่านใหม่',
                    enabled ? '🟢 เปิดอยู่' : '⚪ ปิดอยู่',
                    `หว่านใหม่อัตโนมัติทันทีที่คุ้ม (ได้อย่างน้อย ${AUTO_RESET_MIN_SEEDS} เมล็ด) — กดเพื่อเปิด/ปิดชั่วคราว`,
                    '—',
                    onToggleAutoReset,
                    false,
                    true, // owned = true (dark/muted)
                    !enabled
                  );
                }
                return renderItem(
                  '🔁 ออโต้หว่านใหม่',
                  '',
                  `ปลายทางของสายออโต้ — หว่านใหม่ให้อัตโนมัติทันทีที่คุ้ม (ได้อย่างน้อย ${AUTO_RESET_MIN_SEEDS} เมล็ด) ไม่ต้องมาคอยกดเองอีกต่อไป`,
                  `${AUTO_RESET_COST} 🌌`,
                  onBuyAutoReset,
                  seeds < AUTO_RESET_COST
                );
              })()}

              {/* ===== อีเว้น & บัฟ ===== */}
              {renderSectionHeader('อีเว้น & บัฟ')}
              {(() => {
                const ebc = eventBonusCost(state);
                return renderItem(
                  '💰 โบนัสอีเว้น',
                  `เลเวล ${state.prestige.eventBonusLevel}`,
                  `เพิ่มผลตอบแทนของกล่องสมบัติ/บัฟ/โชคดี ที่ได้จากการคลิกอีเว้นอีก 20% (ตอนนี้ +${
                    (state.prestige.eventBonusLevel || 0) * 20
                  }%)`,
                  `${ebc} 🌌`,
                  onBuyEventBonus,
                  seeds < ebc
                );
              })()}

              {(() => {
                const edc = eventDurationCost(state);
                const edMaxed = eventDurationMaxed(state);
                return renderItem(
                  '⏳ ขยายเวลาบัฟ',
                  edMaxed ? 'เต็มแล้ว ✓' : `เลเวล ${state.prestige.eventDurationLevel}`,
                  edMaxed
                    ? `เต็มแล้วที่ +${(state.prestige.eventDurationLevel || 0) * 15}% (ไม่รวมโชคดี)`
                    : `เพิ่มระยะเวลาของบัฟ/กล่องสมบัติอีก 15% (ตอนนี้ +${
                        (state.prestige.eventDurationLevel || 0) * 15
                      }%, ไม่รวมโชคดี)`,
                  edMaxed ? '—' : `${edc} 🌌`,
                  onBuyEventDuration,
                  !edMaxed && seeds < edc,
                  edMaxed
                );
              })()}

              {(() => {
                const lcc = luckyChanceCost(state);
                const lcLevel = state.prestige.luckyChanceLevel || 0;
                const lcMaxed = luckyChanceMaxed(state);
                return renderItem(
                  '🍀 โอกาสโชคดีเพิ่ม',
                  lcMaxed ? 'เต็มแล้ว ✓' : `เลเวล ${lcLevel}`,
                  lcMaxed
                    ? `เต็มแล้วที่ ${(luckyChancePct(state) * 100).toFixed(1)}% (สูงสุด)`
                    : `เพิ่มโอกาสเจอบัฟโชคดี — ตอนนี้ ${(luckyChancePct(state) * 100).toFixed(
                        1
                      )}% เลเวลต่อไปเป็น ${(
                        Math.min(LUCKY_CHANCE_MAX, luckyChancePct(state) + LUCKY_CHANCE_STEP) * 100
                      ).toFixed(1)}%`,
                  lcMaxed ? '—' : `${lcc} 🌌`,
                  onBuyLuckyChance,
                  !lcMaxed && seeds < lcc,
                  lcMaxed
                );
              })()}

              {(() => {
                const lmc = luckyMagnitudeCost(state);
                const lmLevel = state.prestige.luckyMagnitudeLevel || 0;
                return renderItem(
                  '🍀 โชคดีทวีคูณ',
                  `เลเวล ${lmLevel}`,
                  `ทบตัวคูณของบัฟโชคดี (×777) เพิ่มอีกชั้น — ตอนนี้ ×${lmLevel + 1} ต่อไปเป็น ×${
                    lmLevel + 2
                  }`,
                  `${lmc} 🌌`,
                  onBuyLuckyMagnitude,
                  seeds < lmc
                );
              })()}

              {(() => {
                const ldc = luckyDurationCost(state);
                const ldLevel = state.prestige.luckyDurationLevel || 0;
                const ldMaxed = luckyDurationMaxed(state);
                const curSecs = Math.min(60, 7 + ldLevel);
                return renderItem(
                  '⏳🍀 โชคดีอยู่นานขึ้น',
                  ldMaxed ? 'เต็มแล้ว ✓' : `เลเวล ${ldLevel}`,
                  ldMaxed
                    ? `เต็มแล้วที่ ${curSecs} วินาที (สูงสุด 60 วินาที)`
                    : `ยืดเวลาบัฟโชคดี (+1 วิ/เลเวล) — ตอนนี้ ${curSecs} วิ เลเวลต่อไปเป็น ${curSecs + 1} วิ (สูงสุด 60 วิ)`,
                  ldMaxed ? '—' : `${ldc} 🌌`,
                  onBuyLuckyDuration,
                  !ldMaxed && seeds < ldc,
                  ldMaxed
                );
              })()}

              {/* ===== อื่นๆ ===== */}
              {renderSectionHeader('อื่นๆ')}
              {(() => {
                const capMaxed = offlineCapMaxed(state);
                const cc = offlineCapCost(state);
                const curHours = OFFLINE_CAP_HOURS[state.prestige.offlineCapLevel || 0];
                const nextHours = OFFLINE_CAP_HOURS[(state.prestige.offlineCapLevel || 0) + 1];
                return renderItem(
                  '⏰ ขยายเพดาน Offline',
                  capMaxed ? 'เต็มแล้ว ✓' : '',
                  capMaxed
                    ? `เพดานปัจจุบัน ${curHours} ชม. (สูงสุดแล้ว)`
                    : `ขยายจาก ${curHours} ชม. เป็น ${nextHours} ชม.`,
                  capMaxed ? '—' : `${cc} 🌌`,
                  onBuyOfflineCapUpgrade,
                  !capMaxed && seeds < cc,
                  capMaxed
                );
              })()}

              {(() => {
                const auraOwned = state.prestige.auraRoots;
                return renderItem(
                  '🌈 สกิน: รุ้ง/ทอง',
                  auraOwned ? 'ปลดล็อกแล้ว ✓' : '',
                  'เปลี่ยนสีรากทั้งต้นเป็นโทนทอง/รุ้งพิเศษถาวร (cosmetic ล้วนๆ ไม่กระทบเกมเพลย์)',
                  auraOwned ? '—' : `${AURA_ROOTS_COST} 🌌`,
                  onBuyAuraRoots,
                  !auraOwned && seeds < AURA_ROOTS_COST,
                  auraOwned
                );
              })()}

              {(() => {
                const soOwned = state.prestige.skinSameOrigin;
                return renderItem(
                  '🌿 สกิน: รากเดียวกัน',
                  soOwned ? 'ปลดล็อกแล้ว ✓' : '',
                  'แต่ละกิ่งใหญ่ที่แยกจากลำต้นจะมีสีของตัวเอง แล้วกิ่งย่อยที่แตกออกมาทีหลังยังคงสีตระกูลเดียวกับต้นทาง',
                  soOwned ? '—' : `${SKIN_COST} 🌌`,
                  () => onBuySkin('skinSameOrigin'),
                  !soOwned && seeds < SKIN_COST,
                  soOwned
                );
              })()}

              {(() => {
                const gsOwned = state.prestige.skinGrayscale;
                return renderItem(
                  '⚫ สกิน: ขาวดำ',
                  gsOwned ? 'ปลดล็อกแล้ว ✓' : '',
                  'รากทั้งต้นเป็นโทนขาวดำ เข้มใกล้ลำต้น อ่อนลงที่ปลายราก',
                  gsOwned ? '—' : `${SKIN_COST} 🌌`,
                  () => onBuySkin('skinGrayscale'),
                  !gsOwned && seeds < SKIN_COST,
                  gsOwned
                );
              })()}

              {(() => {
                const gdOwned = state.prestige.skinGradient;
                return renderItem(
                  '🍃 สกิน: ไล่เข้ม-อ่อน',
                  gdOwned ? 'ปลดล็อกแล้ว ✓' : '',
                  'โทนสีเขียวเดียว ไล่จากเข้มที่ลำต้นไปอ่อนที่ปลายราก',
                  gdOwned ? '—' : `${SKIN_COST} 🌌`,
                  () => onBuySkin('skinGradient'),
                  !gdOwned && seeds < SKIN_COST,
                  gdOwned
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        title="ยืนยันการทำรายการ"
        message={`หว่านใหม่จะรีเซ็ตของทุกชนิด สารอาหาร อัพเกรด และปุ๋ยทั้งหมด แลกกับ +${fmtInt(
          gained
        )} เมล็ดนิรันดร์ ยืนยันไหม?`}
        onConfirm={executePrestige}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
};
