'use client';

import React, { useState } from 'react';
import { AutoRootMode, GameState, Language, SkinId, UIThemeId } from '@/types/game';
import { getActiveAutoRootMode } from '@/lib/autoBuyer';
import {
  AUTO_EVENT_COST,
  AUTO_RESET_COST,
  AUTO_ROOT_ALL_COST,
  AUTO_ROOT_COST,
  AUTO_ROOT_SMART_COST,
  calcBulkPrestigeUpgrade,
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
  LUCKY_DURATION_BASE,
  LUCKY_DURATION_MAX,
  LUCKY_DURATION_MAX_LEVEL,
  LUCKY_MAGNITUDE_MAX_LEVEL,
  luckyMagnitudeCost,
  OFFLINE_CAP_HOURS,
  offlineCapCost,
  offlineCapMaxed,
  passiveRateCost,
  isSkinUnlocked,
  isUIThemeUnlocked,
  SKIN_DEFS,
  SKIN_PRESTIGE_KEYS,
  STARTER_CULTURE_MAX_LEVEL,
  starterCultureCost,
  UI_THEME_DEFS,
  UI_THEME_PRESTIGE_KEYS,
} from '@/constants/gameData';
import { fmtInt } from '@/lib/formatters';
import { ConfirmModal } from './ConfirmModal';
import { t } from '@/lib/i18n';

interface PrestigeModalProps {
  isOpen: boolean;
  state: GameState;
  onClose: () => void;
  onConfirmPrestige: () => void;
  onBuyStarterCulture: (amount?: number | 'max') => void;
  onBuyGoldenSeed: (amount?: number | 'max') => void;
  onBuyPassiveRate: (amount?: number | 'max') => void;
  onBuyAutoRoot: () => void;
  onToggleAutoRoot: () => void;
  onSetAutoRootMode: (mode: AutoRootMode) => void;
  onBuyAutoRootSmart: () => void;
  onBuyAutoRootAll: () => void;
  onBuyAutoEvent: () => void;
  onToggleAutoEvent: () => void;
  onBuyAutoReset: () => void;
  onToggleAutoReset: () => void;
  onOpenAutoResetConfig?: () => void;
  onBuyEventBonus: (amount?: number | 'max') => void;
  onBuyEventDuration: () => void;
  onBuyLuckyChance: () => void;
  onBuyLuckyMagnitude: (amount?: number | 'max') => void;
  onBuyLuckyDuration: (amount?: number | 'max') => void;
  onBuyOfflineCapUpgrade: () => void;
  onBuySkin: (skinId: SkinId) => void;
  onBuyUITheme: (themeId: UIThemeId) => void;
  onOpenWardrobe?: () => void;
}

export const PrestigeModal: React.FC<PrestigeModalProps> = ({
  isOpen,
  state,
  onClose,
  onConfirmPrestige,
  onOpenWardrobe,
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
  onOpenAutoResetConfig,
  onBuyEventBonus,
  onBuyEventDuration,
  onBuyLuckyChance,
  onBuyLuckyMagnitude,
  onBuyLuckyDuration,
  onBuyOfflineCapUpgrade,
  onBuySkin,
  onBuyUITheme,
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

  const renderBulkItem = (
    title: string,
    badge: string,
    desc: string,
    costFn: (lvl: number) => number,
    currentLevel: number,
    onBuy: (amount?: number | 'max') => void,
    maxLevel: number = Infinity
  ) => {
    const isMaxed = currentLevel >= maxLevel;
    if (isMaxed) {
      return renderItem(title, isEn ? 'MAXED ✓' : 'เต็มแล้ว ✓', desc, '—', undefined, true, true);
    }
    const cost1 = costFn(currentLevel);
    const { count: maxBuyable } = calcBulkPrestigeUpgrade(currentLevel, seeds, costFn, 'max', maxLevel);
    const disabled = seeds < cost1;

    return (
      <div
        className={`prestige-item ${disabled ? 'disabled' : ''}`}
        onClick={() => { if (!disabled) onBuy(1); }}
      >
        <div className="p-top">
          <span>{title}</span>
          <span className="font-mono">{badge}</span>
        </div>
        <div className="p-desc">{desc}</div>
        <div className="p-cost" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', flexWrap: 'wrap', gap: '6px' }}>
          <span style={{ fontSize: '11.5px', color: 'var(--prestige-accent)' }}>
            {fmtInt(cost1)} 🌌
          </span>
          <div className="passive-bulk-row" onClick={e => e.stopPropagation()}>
            <button
              type="button"
              className="btn-passive-bulk"
              disabled={disabled}
              onClick={() => onBuy(1)}
              title={isEn ? 'Buy 1 Level' : 'ซื้อ 1 เลเวล'}
            >
              +1
            </button>
            {maxBuyable >= 5 && (
              <button
                type="button"
                className="btn-passive-bulk"
                onClick={() => onBuy(5)}
                title={isEn ? 'Buy 5 Levels' : 'ซื้อ 5 เลเวล'}
              >
                +5
              </button>
            )}
            {maxBuyable >= 20 && (
              <button
                type="button"
                className="btn-passive-bulk"
                onClick={() => onBuy(10)}
                title={isEn ? 'Buy 10 Levels' : 'ซื้อ 10 เลเวล'}
              >
                +10
              </button>
            )}
            {maxBuyable > 1 && (
              <button
                type="button"
                className="btn-passive-bulk btn-passive-max"
                onClick={() => onBuy('max')}
                title={isEn ? `Buy Max Possible (+${maxBuyable} Levels)` : `ซื้อสูงสุดเท่าที่ทำได้ (+${maxBuyable} เลเวล)`}
              >
                MAX (+{maxBuyable})
              </button>
            )}
          </div>
        </div>
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
                const sLvl = state.prestige.starterLevel || 0;
                return renderBulkItem(
                  isEn ? '🌱 Starter Culture' : '🌱 หัวเชื้อเริ่มต้น',
                  isEn ? `Lv.${sLvl}` : `เลเวล ${sLvl}`,
                  isEn
                    ? `Immediately gain +10 Fine Roots and guarantee ${sLvl * 10 + 10} roots upon every future Prestige`
                    : `ได้รากฝอยฟรีทันที +10 ต้น (ใช้ได้เลยรอบนี้) และการันตี ${sLvl * 10 + 10} ต้นทุกครั้งที่หว่านใหม่ต่อจากนี้`,
                  starterCultureCost,
                  sLvl,
                  onBuyStarterCulture,
                  STARTER_CULTURE_MAX_LEVEL
                );
              })()}

              {(() => {
                const gLvl = state.prestige.goldenLevel || 0;
                return renderBulkItem(
                  isEn ? '✨ Golden Seeds' : '✨ เมล็ดทองคำ',
                  isEn ? `Lv.${gLvl} (+${gLvl * 5}%)` : `เลเวล ${gLvl} (+${gLvl * 5}%)`,
                  isEn
                    ? `Increases Eternal Seeds gained upon Prestige by +5% (Currently +${gLvl * 5}%)`
                    : `เพิ่มเมล็ดนิรันดร์ที่ได้รับตอน Prestige ครั้งต่อไปอีก 5% (ตอนนี้ +${gLvl * 5}%)`,
                  goldenSeedCost,
                  gLvl,
                  onBuyGoldenSeed
                );
              })()}

              {(() => {
                const pr = state.prestige.passiveRateLevel || 0;
                return renderBulkItem(
                  isEn ? '🌟 Eternal Growth Essence' : '🌟 พลังรากนิรันดร์',
                  isEn ? `Lv.${pr} (+${pr}%)` : `เลเวล ${pr} (+${pr}%)`,
                  isEn
                    ? `Permanent +1% global production rate bonus across the entire garden (Currently +${pr}%)`
                    : `เพิ่มเรทรวมทั้งฟาร์มแบบถาวรอีก 1% ไม่จำกัดจำนวนครั้ง (ตอนนี้ +${pr}%)`,
                  passiveRateCost,
                  pr,
                  onBuyPassiveRate
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
                const target = state.prestige.autoResetThreshold || 1000;
                if (autoResetOwned) {
                  return (
                    <div className={`prestige-item owned ${!enabled ? 'toggled-off' : ''}`}>
                      <div className="p-top">
                        <span>🔁 {isEn ? 'Auto Re-sow (Prestige)' : 'ออโต้หว่านใหม่'}</span>
                        <span style={{ color: enabled ? 'var(--prestige-accent)' : 'var(--root-cream-dim)' }}>
                          {enabled ? (isEn ? '🟢 Enabled' : '🟢 เปิดอยู่') : (isEn ? '⚪ Disabled' : '⚪ ปิดอยู่')}
                        </span>
                      </div>
                      <div className="p-desc">
                        {isEn
                          ? `Automatically re-sows whenever yields reach ≥${fmtInt(target)} Eternal Seeds.`
                          : `หว่านใหม่อัตโนมัติทันทีที่สะสมได้ครบตามเป้าหมาย (≥${fmtInt(target)} เมล็ด)`}
                      </div>
                      <div className="auto-cfg-actions">
                        <button
                          type="button"
                          className="auto-cfg-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onOpenAutoResetConfig) onOpenAutoResetConfig();
                          }}
                        >
                          ⚙️ {isEn ? `Edit Target (≥${fmtInt(target)})` : `ตั้งค่าเป้าหมาย (≥${fmtInt(target)} เมล็ด)`}
                        </button>
                        <button
                          type="button"
                          className={`auto-cfg-btn ${enabled ? 'toggle-on' : 'toggle-off'}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleAutoReset();
                          }}
                        >
                          {enabled ? (isEn ? 'Turn OFF' : 'ปิดการทำงาน') : (isEn ? 'Turn ON' : 'เปิดการทำงาน')}
                        </button>
                      </div>
                    </div>
                  );
                }
                return renderItem(
                  isEn ? '🔁 Auto Re-sow (Prestige)' : '🔁 ออโต้หว่านใหม่',
                  '',
                  isEn
                    ? `Prestige automation: Automatically re-sows whenever yields reach your custom seed target`
                    : `ปลายทางของสายออโต้ — หว่านใหม่ให้อัตโนมัติทันทีที่สะสมครบตามเป้าหมายที่คุณกำหนด ไม่ต้องมาคอยกดเองอีกต่อไป`,
                  `${AUTO_RESET_COST} 🌌`,
                  () => {
                    onBuyAutoReset();
                    if (onOpenAutoResetConfig) onOpenAutoResetConfig();
                  },
                  seeds < AUTO_RESET_COST
                );
              })()}

              {/* ===== Events & Buffs ===== */}
              {renderSectionHeader(tr.prestigeSecEvents)}
              {(() => {
                const ebLevel = state.prestige.eventBonusLevel || 0;
                return renderBulkItem(
                  isEn ? '💰 Event Value Booster' : '💰 โบนัสอีเว้น',
                  isEn ? `Lv.${ebLevel} (+${ebLevel * 20}%)` : `เลเวล ${ebLevel} (+${ebLevel * 20}%)`,
                  isEn
                    ? `Increases reward gains from floating events by +20% (Currently +${ebLevel * 20}%)`
                    : `เพิ่มผลตอบแทนของกล่องสมบัติ/บัฟ/โชคดี ที่ได้จากการคลิกอีเว้นอีก 20% (ตอนนี้ +${ebLevel * 20}%)`,
                  eventBonusCost,
                  ebLevel,
                  onBuyEventBonus
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
                const lmLevel = state.prestige.luckyMagnitudeLevel || 0;
                return renderBulkItem(
                  isEn ? '🍀 Lucky Magnitude Multiplier' : '🍀 โชคดีทวีคูณ',
                  isEn ? `Lv.${lmLevel} (×${lmLevel + 1})` : `เลเวล ${lmLevel} (×${lmLevel + 1})`,
                  isEn
                    ? `Stacks Lucky Clover (×777) multiplier — Currently ×${lmLevel + 1}, next level ×${lmLevel + 2} (Cap: ×10)`
                    : `ทบตัวคูณของบัฟโชคดี (×777) เพิ่มอีกชั้น — ตอนนี้ ×${lmLevel + 1} ต่อไปเป็น ×${lmLevel + 2} (สูงสุด ×10)`,
                  luckyMagnitudeCost,
                  lmLevel,
                  onBuyLuckyMagnitude,
                  LUCKY_MAGNITUDE_MAX_LEVEL
                );
              })()}

              {(() => {
                const ldLevel = state.prestige.luckyDurationLevel || 0;
                const curSecs = Math.min(LUCKY_DURATION_MAX, LUCKY_DURATION_BASE + ldLevel);
                return renderBulkItem(
                  isEn ? '⏳🍀 Extended Lucky Duration' : '⏳🍀 โชคดีอยู่นานขึ้น',
                  isEn ? `Lv.${ldLevel} (${curSecs}s)` : `เลเวล ${ldLevel} (${curSecs}วิ)`,
                  isEn
                    ? `Extends Lucky Clover duration (+1s/level) — Currently ${curSecs}s (Cap: ${LUCKY_DURATION_MAX}s)`
                    : `ยืดเวลาบัฟโชคดี (+1 วิ/เลเวล) — ตอนนี้ ${curSecs} วิ (สูงสุด ${LUCKY_DURATION_MAX} วิ)`,
                  luckyDurationCost,
                  ldLevel,
                  onBuyLuckyDuration,
                  LUCKY_DURATION_MAX_LEVEL
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

              {/* ===== Wardrobe & Aesthetics ===== */}
              {renderSectionHeader(isEn ? '🎨 Cosmetics & UI Themes' : '🎨 ห้องแต่งตัว & สกินตกแต่ง')}
              <div
                style={{
                  background: 'var(--bg-panel-2)',
                  border: '1px solid var(--line-soil)',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  textAlign: 'left',
                  margin: '6px 0 12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                  <span style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--root-cream)' }}>
                    🎨 {isEn ? 'Wardrobe & Visual Themes' : 'ห้องแต่งตัว & ธีมหน้าต่าง UI'}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--accent-glow)', fontWeight: 700 }}>
                    {SKIN_DEFS.filter(s => isSkinUnlocked(state, s.id)).length}/{SKIN_DEFS.length} 🌳 · {UI_THEME_DEFS.filter(t => isUIThemeUnlocked(state, t.id)).length}/{UI_THEME_DEFS.length} 🖼️
                  </span>
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--root-cream-dim)', lineHeight: 1.45 }}>
                  {isEn
                    ? `Preview all ${SKIN_DEFS.length} root skins & ${UI_THEME_DEFS.length} UI color themes in real-time, customize appearance, and buy directly from the Wardrobe!`
                    : `ทดลองใส่สกินรากไม้ ${SKIN_DEFS.length} แบบ และธีมหน้าต่าง UI ${UI_THEME_DEFS.length} แบบได้แบบ Real-time พร้อมเลือกซื้อและสวมใส่ได้ทันทีที่ห้องแต่งตัว`}
                </div>
                {onOpenWardrobe && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenWardrobe();
                    }}
                    style={{
                      marginTop: '4px',
                      padding: '9px 14px',
                      background: 'var(--accent-glow)',
                      color: '#12190d',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '12.5px',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                      transition: 'all 0.15s ease',
                      textAlign: 'center',
                    }}
                  >
                    🎨 {isEn ? 'Open Wardrobe (Try & Buy)' : 'เปิดห้องแต่งตัว (ลองใส่ & เลือกซื้อ)'}
                  </button>
                )}
              </div>
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
