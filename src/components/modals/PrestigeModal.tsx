'use client';

import React, { useState } from 'react';
import { AutoRootMode, GameState, Language } from '@/types/game';
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
import { t } from '@/lib/i18n';

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

  const lang: Language = state.lang || 'th';
  const isEn = lang === 'en';
  const tr = t(lang);

  const seeds = state.eternalSeeds;
  const gained = calcPrestigeSeeds(state);

  const handlePrestigeClick = () => {
    if (gained <= 0) {
      setErrorMsg(tr.notEnoughSeeds);
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
          <button className="modal-close-x" onClick={onClose} aria-label={tr.close}>
            &times;
          </button>

          <div className="offline-modal generic-modal prestige-modal-content">
            <div className="icon">🌌</div>
            <h2>{tr.prestigeTitle}</h2>
            <div className="away-time">{tr.prestigeDesc}</div>
            <div className="gain">{tr.gainedSeeds.replace('{amount}', fmtInt(gained))}</div>
            <div style={{ fontSize: '12px', color: 'var(--root-cream-dim)', marginBottom: '14px' }}>
              {tr.currentSeeds.replace('{amount}', fmtInt(seeds))}
            </div>

            <div className="modal-actions">
              <button onClick={handlePrestigeClick}>{tr.confirmPrestigeBtn}</button>
              <button className="secondary" onClick={onClose}>
                {tr.close}
              </button>
            </div>

            {errorMsg && <div className="import-error">{errorMsg}</div>}

            <div className="panel-title" style={{ margin: '14px 0 8px', textAlign: 'left' }}>
              {tr.prestigeShopTitle}
            </div>
            <div style={{ textAlign: 'left' }}>
              {/* ===== Economy ===== */}
              {renderSectionHeader(tr.prestigeSecEconomy)}
              {(() => {
                const sc = starterCultureCost(state);
                return renderItem(
                  isEn ? '🌱 Starter Culture' : '🌱 หัวเชื้อเริ่มต้น',
                  isEn ? `Level ${state.prestige.starterLevel}` : `เลเวล ${state.prestige.starterLevel}`,
                  isEn
                    ? `Immediately gain +10 Fine Roots and guarantee ${(state.prestige.starterLevel || 0) * 10 + 10} roots upon every future Prestige`
                    : `ได้รากฝอยฟรีทันที +10 ต้น (ใช้ได้เลยรอบนี้) และการันตี ${
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
                  isEn ? '✨ Golden Seeds' : '✨ เมล็ดทองคำ',
                  isEn ? `Level ${state.prestige.goldenLevel}` : `เลเวล ${state.prestige.goldenLevel}`,
                  isEn
                    ? `Increases Eternal Seeds gained upon Prestige by +5% (Currently +${(state.prestige.goldenLevel || 0) * 5}%)`
                    : `เพิ่มเมล็ดนิรันดร์ที่ได้รับตอน Prestige ครั้งต่อไปอีก 5% (ตอนนี้ +${
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
                  isEn ? '🌟 Eternal Growth Essence' : '🌟 พลังรากนิรันดร์',
                  isEn ? `Level ${pr}` : `เลเวล ${pr}`,
                  isEn
                    ? `Permanent +1% global production rate bonus across the entire garden (Currently +${pr}%)`
                    : `เพิ่มเรทรวมทั้งฟาร์มแบบถาวรอีก 1% ไม่จำกัดจำนวนครั้ง (ตอนนี้ +${pr}%)`,
                  `${PASSIVE_RATE_COST} 🌌`,
                  onBuyPassiveRate,
                  seeds < PASSIVE_RATE_COST
                );
              })()}

              {/* ===== Automation ===== */}
              {renderSectionHeader(tr.prestigeSecAuto)}
              {(() => {
                const autoOwned = state.prestige.autoRoot;
                const enabled = state.prestige.autoRootEnabled;
                const activeMode = getActiveAutoRootMode(state);
                const isCurrent = activeMode === 'basic' && enabled;
                if (autoOwned) {
                  return renderItem(
                    isEn ? '🤖 Auto Root (Basic: Cheapest)' : '🤖 ออโต้ราก (พื้นฐาน: ถูกที่สุด)',
                    !enabled ? (isEn ? '⚪ Disabled' : '⚪ ปิดอยู่') : isCurrent ? (isEn ? '✓ Active' : '✓ ใช้อยู่') : (isEn ? 'Unlocked' : 'เปิดใช้งาน'),
                    isEn
                      ? 'Automatically buys the cheapest affordable root every 2 seconds — Click to toggle/select'
                      : 'ซื้อรากเสริมที่ราคาถูกที่สุดให้อัตโนมัติทุก 2 วินาที — คลิกเพื่อเลือกใช้ระดับนี้หรือเปิด/ปิด',
                    '—',
                    onSetAutoRootMode ? () => onSetAutoRootMode('basic') : onToggleAutoRoot,
                    false,
                    true,
                    !enabled,
                    isCurrent
                  );
                }
                return renderItem(
                  isEn ? '🤖 Auto Root' : '🤖 ออโต้ราก',
                  '',
                  isEn
                    ? 'Automatically purchases root modules every 2 seconds forever (Default: Cheapest item)'
                    : 'เกมซื้อของให้อัตโนมัติทุก 2 วินาที ตลอดไป (โหมดเริ่มต้น: เลือกที่ถูกที่สุด)',
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
                      isEn ? '🧠 Smart Auto Root' : '🧠 ออโต้รากอัจฉริยะ',
                      !enabled ? (isEn ? '⚪ Disabled' : '⚪ ปิดอยู่') : isCurrent ? (isEn ? '✓ Active' : '✓ ใช้อยู่') : (isEn ? 'Unlocked' : 'ปลดล็อกแล้ว (คลิกใช้)'),
                      isEn
                        ? '1-2 min lookahead ROI optimization: saves up nutrients to buy the most valuable roots'
                        : 'คำนวณล่วงหน้า 1-2 นาที เก็บสารอาหารรอซื้อรากที่คุ้มและได้เรทสูงสุด — คลิกเพื่อเลือกใช้ระดับนี้',
                      '—',
                      () => onSetAutoRootMode('smart'),
                      false,
                      true,
                      !enabled,
                      isCurrent
                    );
                  }
                  return renderItem(
                    isEn ? '🧠 Smart Auto Root' : '🧠 ออโต้รากอัจฉริยะ',
                    '',
                    isEn
                      ? 'Upgrade Auto Root: Evaluates rate efficiency and saves nutrients for optimal root purchases'
                      : 'อัพเกรดออโต้ราก: คำนวณล่วงหน้า 1-2 นาที เก็บสารอาหารรอซื้ออันที่คุ้มและได้เรทสูงสุด',
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
                      isEn ? '♾️ Universal Auto Root' : '♾️ ออโต้รากทุกสรรพสิ่ง',
                      !enabled ? (isEn ? '⚪ Disabled' : '⚪ ปิดอยู่') : isCurrent ? (isEn ? '✓ Active' : '✓ ใช้อยู่') : (isEn ? 'Unlocked' : 'ปลดล็อกแล้ว (คลิกใช้)'),
                      isEn
                        ? 'Autonomous Master: Automatically purchases roots, milestone upgrades, and echoes!'
                        : 'นอกจากซื้อรากเสริม ยังไล่ซื้ออัพเกรด และสะท้อนรากที่คุ้มที่สุดให้อัตโนมัติด้วย — คลิกเพื่อเลือกใช้ระดับนี้',
                      '—',
                      () => onSetAutoRootMode('all'),
                      false,
                      true,
                      !enabled,
                      isCurrent
                    );
                  }
                  return renderItem(
                    isEn ? '♾️ Universal Auto Root' : '♾️ ออโต้รากทุกสรรพสิ่ง',
                    '',
                    isEn
                      ? 'Ultimate Auto Upgrade: Automatically buys root modules, upgrades, and permanent Echoes'
                      : 'อัพเกรดออโต้รากอีกขั้น: นอกจากซื้อรากเสริม ยังไล่ซื้ออัพเกรด และสะท้อนรากที่คุ้มที่สุดให้อัตโนมัติด้วย',
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
                    isEn ? '🎯 Auto Event Clicker' : '🎯 ออโต้อีเว้น',
                    enabled ? (isEn ? '🟢 Enabled' : '🟢 เปิดอยู่') : (isEn ? '⚪ Disabled' : '⚪ ปิดอยู่'),
                    isEn
                      ? 'Automatically collects floating events as they spawn — Click to toggle ON/OFF'
                      : 'คลิกอีเว้นที่โผล่มาให้อัตโนมัติทุกครั้ง ไม่พลาดอีเว้นอีกต่อไป — กดเพื่อเปิด/ปิดชั่วคราว',
                    '—',
                    onToggleAutoEvent,
                    false,
                    true,
                    !enabled
                  );
                }
                return renderItem(
                  isEn ? '🎯 Auto Event Clicker' : '🎯 ออโต้อีเว้น',
                  '',
                  isEn
                    ? 'Automatically collects floating events as soon as they appear'
                    : 'คลิกอีเว้นที่โผล่มาให้อัตโนมัติทุกครั้ง ไม่พลาดอีเว้นอีกต่อไปแม้ไม่อยู่หน้าจอ',
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
                    isEn ? '🔁 Auto Re-sow (Prestige)' : '🔁 ออโต้หว่านใหม่',
                    enabled ? (isEn ? '🟢 Enabled' : '🟢 เปิดอยู่') : (isEn ? '⚪ Disabled' : '⚪ ปิดอยู่'),
                    isEn
                      ? `Automatically prestiges as soon as yields reach ≥${AUTO_RESET_MIN_SEEDS} seeds — Click to toggle ON/OFF`
                      : `หว่านใหม่อัตโนมัติทันทีที่คุ้ม (ได้อย่างน้อย ${AUTO_RESET_MIN_SEEDS} เมล็ด) — กดเพื่อเปิด/ปิดชั่วคราว`,
                    '—',
                    onToggleAutoReset,
                    false,
                    true,
                    !enabled
                  );
                }
                return renderItem(
                  isEn ? '🔁 Auto Re-sow (Prestige)' : '🔁 ออโต้หว่านใหม่',
                  '',
                  isEn
                    ? `Prestige automation: Automatically re-sows whenever yields reach ≥${AUTO_RESET_MIN_SEEDS} Eternal Seeds`
                    : `ปลายทางของสายออโต้ — หว่านใหม่ให้อัตโนมัติทันทีที่คุ้ม (ได้อย่างน้อย ${AUTO_RESET_MIN_SEEDS} เมล็ด) ไม่ต้องมาคอยกดเองอีกต่อไป`,
                  `${AUTO_RESET_COST} 🌌`,
                  onBuyAutoReset,
                  seeds < AUTO_RESET_COST
                );
              })()}

              {/* ===== Events & Buffs ===== */}
              {renderSectionHeader(tr.prestigeSecEvents)}
              {(() => {
                const ebc = eventBonusCost(state);
                return renderItem(
                  isEn ? '💰 Event Value Booster' : '💰 โบนัสอีเว้น',
                  isEn ? `Level ${state.prestige.eventBonusLevel}` : `เลเวล ${state.prestige.eventBonusLevel}`,
                  isEn
                    ? `Increases reward gains from floating events by +20% (Currently +${(state.prestige.eventBonusLevel || 0) * 20}%)`
                    : `เพิ่มผลตอบแทนของกล่องสมบัติ/บัฟ/โชคดี ที่ได้จากการคลิกอีเว้นอีก 20% (ตอนนี้ +${
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
                  isEn ? '⏳ Extended Surge Duration' : '⏳ ขยายเวลาบัฟ',
                  edMaxed ? (isEn ? 'MAXED ✓' : 'เต็มแล้ว ✓') : (isEn ? `Level ${state.prestige.eventDurationLevel}` : `เลเวล ${state.prestige.eventDurationLevel}`),
                  edMaxed
                    ? (isEn ? `Maxed out at +${(state.prestige.eventDurationLevel || 0) * 15}%` : `เต็มแล้วที่ +${(state.prestige.eventDurationLevel || 0) * 15}% (ไม่รวมโชคดี)`)
                    : (isEn ? `Extends surge buff duration by +15% (Currently +${(state.prestige.eventDurationLevel || 0) * 15}%)` : `เพิ่มระยะเวลาของบัฟ/กล่องสมบัติอีก 15% (ตอนนี้ +${(state.prestige.eventDurationLevel || 0) * 15}%, ไม่รวมโชคดี)`),
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
                  isEn ? '🍀 Lucky Clover Frequency' : '🍀 โอกาสโชคดีเพิ่ม',
                  lcMaxed ? (isEn ? 'MAXED ✓' : 'เต็มแล้ว ✓') : (isEn ? `Level ${lcLevel}` : `เลเวล ${lcLevel}`),
                  lcMaxed
                    ? (isEn ? `Maxed at ${(luckyChancePct(state) * 100).toFixed(1)}%` : `เต็มแล้วที่ ${(luckyChancePct(state) * 100).toFixed(1)}% (สูงสุด)`)
                    : (isEn
                        ? `Increases chance of triggering Lucky Clover — Currently ${(luckyChancePct(state) * 100).toFixed(1)}%, next level ${(Math.min(LUCKY_CHANCE_MAX, luckyChancePct(state) + LUCKY_CHANCE_STEP) * 100).toFixed(1)}%`
                        : `เพิ่มโอกาสเจอบัฟโชคดี — ตอนนี้ ${(luckyChancePct(state) * 100).toFixed(1)}% เลเวลต่อไปเป็น ${(Math.min(LUCKY_CHANCE_MAX, luckyChancePct(state) + LUCKY_CHANCE_STEP) * 100).toFixed(1)}%`),
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
                  isEn ? '🍀 Lucky Magnitude Multiplier' : '🍀 โชคดีทวีคูณ',
                  isEn ? `Level ${lmLevel}` : `เลเวล ${lmLevel}`,
                  isEn
                    ? `Stacks Lucky Clover (×777) multiplier — Currently ×${lmLevel + 1}, next level ×${lmLevel + 2}`
                    : `ทบตัวคูณของบัฟโชคดี (×777) เพิ่มอีกชั้น — ตอนนี้ ×${lmLevel + 1} ต่อไปเป็น ×${lmLevel + 2}`,
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
                  isEn ? '⏳🍀 Extended Lucky Duration' : '⏳🍀 โชคดีอยู่นานขึ้น',
                  ldMaxed ? (isEn ? 'MAXED ✓' : 'เต็มแล้ว ✓') : (isEn ? `Level ${ldLevel}` : `เลเวล ${ldLevel}`),
                  ldMaxed
                    ? (isEn ? `Maxed out at ${curSecs} seconds (Cap: 60s)` : `เต็มแล้วที่ ${curSecs} วินาที (สูงสุด 60 วินาที)`)
                    : (isEn ? `Extends Lucky Clover duration (+1s/level) — Currently ${curSecs}s, next ${curSecs + 1}s (Cap: 60s)` : `ยืดเวลาบัฟโชคดี (+1 วิ/เลเวล) — ตอนนี้ ${curSecs} วิ เลเวลต่อไปเป็น ${curSecs + 1} วิ (สูงสุด 60 วิ)`),
                  ldMaxed ? '—' : `${ldc} 🌌`,
                  onBuyLuckyDuration,
                  !ldMaxed && seeds < ldc,
                  ldMaxed
                );
              })()}

              {/* ===== Other & Aesthetic Skins ===== */}
              {renderSectionHeader(tr.prestigeSecSkins)}
              {(() => {
                const capMaxed = offlineCapMaxed(state);
                const cc = offlineCapCost(state);
                const curHours = OFFLINE_CAP_HOURS[state.prestige.offlineCapLevel || 0];
                const nextHours = OFFLINE_CAP_HOURS[(state.prestige.offlineCapLevel || 0) + 1];
                return renderItem(
                  isEn ? '⏰ Expand Offline Rest Cap' : '⏰ ขยายเพดาน Offline',
                  capMaxed ? (isEn ? 'MAXED ✓' : 'เต็มแล้ว ✓') : '',
                  capMaxed
                    ? (isEn ? `Current cap: ${curHours} hrs (Maximum)` : `เพดานปัจจุบัน ${curHours} ชม. (สูงสุดแล้ว)`)
                    : (isEn ? `Expands offline storage cap from ${curHours}h to ${nextHours}h` : `ขยายจาก ${curHours} ชม. เป็น ${nextHours} ชม.`),
                  capMaxed ? '—' : `${cc} 🌌`,
                  onBuyOfflineCapUpgrade,
                  !capMaxed && seeds < cc,
                  capMaxed
                );
              })()}

              {(() => {
                const auraOwned = state.prestige.auraRoots;
                return renderItem(
                  isEn ? '🌈 Skin: Rainbow & Gold' : '🌈 สกิน: รุ้ง/ทอง',
                  auraOwned ? (isEn ? 'Unlocked ✓' : 'ปลดล็อกแล้ว ✓') : '',
                  isEn
                    ? 'Infuses root tips and trunks with luminous prismatic rainbow & golden gradients'
                    : 'เปลี่ยนสีรากทั้งต้นเป็นโทนทอง/รุ้งพิเศษถาวร (cosmetic ล้วนๆ ไม่กระทบเกมเพลย์)',
                  auraOwned ? '—' : `${AURA_ROOTS_COST} 🌌`,
                  onBuyAuraRoots,
                  !auraOwned && seeds < AURA_ROOTS_COST,
                  auraOwned
                );
              })()}

              {(() => {
                const soOwned = state.prestige.skinSameOrigin;
                return renderItem(
                  isEn ? '🌿 Skin: Same Origin' : '🌿 สกิน: รากเดียวกัน',
                  soOwned ? (isEn ? 'Unlocked ✓' : 'ปลดล็อกแล้ว ✓') : '',
                  isEn
                    ? 'Branches inherit the distinct color family of their respective primary trunk taproot'
                    : 'แต่ละกิ่งใหญ่ที่แยกจากลำต้นจะมีสีของตัวเอง แล้วกิ่งย่อยที่แตกออกมาทีหลังยังคงสีตระกูลเดียวกับต้นทาง',
                  soOwned ? '—' : `${SKIN_COST} 🌌`,
                  () => onBuySkin('skinSameOrigin'),
                  !soOwned && seeds < SKIN_COST,
                  soOwned
                );
              })()}

              {(() => {
                const gsOwned = state.prestige.skinGrayscale;
                return renderItem(
                  isEn ? '⚫ Skin: Monochromatic Dark' : '⚫ สกิน: ขาวดำ',
                  gsOwned ? (isEn ? 'Unlocked ✓' : 'ปลดล็อกแล้ว ✓') : '',
                  isEn
                    ? 'Monochromatic black-and-white theme, transitioning from deep charcoal to pale silver'
                    : 'รากทั้งต้นเป็นโทนขาวดำ เข้มใกล้ลำต้น อ่อนลงที่ปลายราก',
                  gsOwned ? '—' : `${SKIN_COST} 🌌`,
                  () => onBuySkin('skinGrayscale'),
                  !gsOwned && seeds < SKIN_COST,
                  gsOwned
                );
              })()}

              {(() => {
                const gdOwned = state.prestige.skinGradient;
                return renderItem(
                  isEn ? '🍃 Skin: Forest Emerald Gradient' : '🍃 สกิน: ไล่เข้ม-อ่อน',
                  gdOwned ? (isEn ? 'Unlocked ✓' : 'ปลดล็อกแล้ว ✓') : '',
                  isEn
                    ? 'Uniform lush green palette transitioning smoothly from dense bark down to delicate tender tips'
                    : 'โทนสีเขียวเดียว ไล่จากเข้มที่ลำต้นไปอ่อนที่ปลายราก',
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
        title={isEn ? 'Confirm Re-sow (Prestige)' : 'ยืนยันการทำรายการ'}
        message={
          isEn
            ? `Re-sowing will reset all nutrients, root modules, and normal upgrades in exchange for +${fmtInt(
                gained
              )} Eternal Seeds. Proceed?`
            : `หว่านใหม่จะรีเซ็ตของทุกชนิด สารอาหาร อัพเกรด และปุ๋ยทั้งหมด แลกกับ +${fmtInt(
                gained
              )} เมล็ดนิรันดร์ ยืนยันไหม?`
        }
        confirmText={tr.confirm}
        cancelText={tr.cancel}
        onConfirm={executePrestige}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
};
