'use client';

import React, { useState } from 'react';
import { GameState, Language } from '@/types/game';
import {
  AUTO_ROOT_COST,
  calcPrestigeSeeds,
  EVENT_BONUS_MAX_LEVEL,
  eventBonusCost,
  eventDurationCost,
  eventDurationMaxed,
  goldenSeedCost,
  GOLDEN_SEED_MAX_LEVEL,
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
  PASSIVE_RATE_MAX_LEVEL,
  isSkinUnlocked,
  isUIThemeUnlocked,
  SKIN_DEFS,
  STARTER_CULTURE_MAX_LEVEL,
  starterCultureCost,
  UI_THEME_DEFS,
} from '@/constants/gameData';
import { fmtInt } from '@/lib/formatters';
import { ConfirmModal } from './ConfirmModal';
import { SeedTransmuteAltar } from './prestige/SeedTransmuteAltar';
import { PrestigeUpgradeRow } from './prestige/PrestigeUpgradeRow';
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
  onBuyEventBonus: (amount?: number | 'max') => void;
  onBuyEventDuration: () => void;
  onBuyLuckyChance: () => void;
  onBuyLuckyMagnitude: (amount?: number | 'max') => void;
  onBuyLuckyDuration: (amount?: number | 'max') => void;
  onBuyOfflineCapUpgrade: () => void;
  onOpenWardrobe?: () => void;
  onTransmuteSeedsToPetals?: (qty?: number) => void;
  onTransmuteEssencesToPetals?: (qty?: number) => void;
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
  onBuyEventBonus,
  onBuyEventDuration,
  onBuyLuckyChance,
  onBuyLuckyMagnitude,
  onBuyLuckyDuration,
  onBuyOfflineCapUpgrade,
  onTransmuteSeedsToPetals,
  onTransmuteEssencesToPetals,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const lang: Language = state.lang || 'th';
  const isEn = lang === 'en';
  const tr = t(lang);

  const seeds = state.eternalSeeds;
  const gained = calcPrestigeSeeds(state);
  const isVoidTrial = state.transcendence?.activeTrial === 'void_anomaly';

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
              <PrestigeUpgradeRow
                title={isEn ? '🌱 Starter Culture' : '🌱 หัวเชื้อเริ่มต้น'}
                badge={isEn ? `Lv.${state.prestige.starterLevel || 0}` : `เลเวล ${state.prestige.starterLevel || 0}`}
                desc={isEn
                  ? `Immediately gain +10 Fine Roots and guarantee ${(state.prestige.starterLevel || 0) * 10 + 10} roots upon every future Prestige`
                  : `ได้รากฝอยฟรีทันที +10 ต้น (ใช้ได้เลยรอบนี้) และการันตี ${(state.prestige.starterLevel || 0) * 10 + 10} ต้นทุกครั้งที่หว่านใหม่ต่อจากนี้`}
                costFn={starterCultureCost}
                currentLevel={state.prestige.starterLevel || 0}
                maxLevel={STARTER_CULTURE_MAX_LEVEL}
                seeds={seeds}
                onBuy={onBuyStarterCulture}
                isEn={isEn}
              />

              <PrestigeUpgradeRow
                title={isEn ? '✨ Golden Seeds' : '✨ เมล็ดทองคำ'}
                badge={isEn ? `Lv.${fmtInt(state.prestige.goldenLevel || 0)} / ${fmtInt(GOLDEN_SEED_MAX_LEVEL)} (+${((state.prestige.goldenLevel || 0) * 0.1).toFixed(1)}%)` : `เลเวล ${fmtInt(state.prestige.goldenLevel || 0)} / ${fmtInt(GOLDEN_SEED_MAX_LEVEL)} (+${((state.prestige.goldenLevel || 0) * 0.1).toFixed(1)}%)`}
                desc={isEn
                  ? `Increases Eternal Seeds gained upon Prestige by +0.1% per level (Currently +${((state.prestige.goldenLevel || 0) * 0.1).toFixed(1)}%)`
                  : `เพิ่มเมล็ดนิรันดร์ที่ได้รับตอน Prestige ครั้งต่อไปอีกเลเวลละ +0.1% (ตอนนี้ +${((state.prestige.goldenLevel || 0) * 0.1).toFixed(1)}%)`}
                costFn={goldenSeedCost}
                currentLevel={state.prestige.goldenLevel || 0}
                maxLevel={GOLDEN_SEED_MAX_LEVEL}
                seeds={seeds}
                onBuy={onBuyGoldenSeed}
                isEn={isEn}
              />

              <PrestigeUpgradeRow
                title={isEn ? '🌟 Eternal Growth Essence' : '🌟 พลังรากนิรันดร์'}
                badge={isEn ? `Lv.${fmtInt(state.prestige.passiveRateLevel || 0)} / ${fmtInt(PASSIVE_RATE_MAX_LEVEL)} (+${((state.prestige.passiveRateLevel || 0) * 0.1).toFixed(1)}%)` : `เลเวล ${fmtInt(state.prestige.passiveRateLevel || 0)} / ${fmtInt(PASSIVE_RATE_MAX_LEVEL)} (+${((state.prestige.passiveRateLevel || 0) * 0.1).toFixed(1)}%)`}
                desc={isEn
                  ? `Permanent +0.1% global production rate bonus across the entire garden (Currently +${((state.prestige.passiveRateLevel || 0) * 0.1).toFixed(1)}%)`
                  : `เพิ่มเรทรวมทั้งฟาร์มแบบถาวรเลเวลละ +0.1% (ตอนนี้ +${((state.prestige.passiveRateLevel || 0) * 0.1).toFixed(1)}%)`}
                costFn={passiveRateCost}
                currentLevel={state.prestige.passiveRateLevel || 0}
                maxLevel={PASSIVE_RATE_MAX_LEVEL}
                seeds={seeds}
                onBuy={onBuyPassiveRate}
                isEn={isEn}
              />

              {/* ===== Astral Transmutation ===== */}
              {state.transcendence?.auroraBloomUnlocked && (
                <>
                  {renderSectionHeader(isEn ? '🌸 Astral Transmutation (Essence & Seed Sink)' : '🌸 หลอมมิติเกสรดวงดาว (ระบายละออง & เมล็ด)')}
                  <SeedTransmuteAltar
                    eternalSeeds={state.eternalSeeds}
                    gaiaEssences={state.transcendence?.gaiaEssences || 0}
                    astralPetals={state.transcendence?.astralPetals || 0}
                    isEn={isEn}
                    onTransmuteSeedsToPetals={onTransmuteSeedsToPetals}
                    onTransmuteEssencesToPetals={onTransmuteEssencesToPetals}
                  />
                </>
              )}

              {/* ===== Automation ===== */}
              {renderSectionHeader(tr.prestigeSecAuto)}

              {/* Void Anomaly Warning Banner */}
              {isVoidTrial && (
                <div
                  style={{
                    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.18), rgba(99, 102, 241, 0.12))',
                    border: '1px solid rgba(192, 132, 252, 0.45)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    fontSize: '12px',
                    color: '#e9d5ff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '10px',
                    lineHeight: '1.45',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: '20px', flexShrink: 0 }}>🌌</span>
                  <div>
                    <strong style={{ color: '#ffffff' }}>
                      {isEn ? 'Void Anomaly Active: ' : 'กำลังอยู่ในการทดลอง "รอยแยกสูญญะ": '}
                    </strong>
                    {isEn
                      ? 'All automation bots are temporarily suppressed by dimensional disturbance until you grow 25 World Trees.'
                      : 'ระบบบอททั้งหมดถูกระงับชั่วคราวจากสนามพลังมิติสุญญะ (ไม่ทำงาน) จนกว่าจะปลูกรากต้นไม้โลกครบ 25 ต้น'}
                  </div>
                </div>
              )}

              <PrestigeUpgradeRow
                title={isEn ? '♾️ Universal Automation' : '♾️ ออโต้สรรพสิ่ง'}
                badge={state.prestige.autoRoot
                  ? isVoidTrial
                    ? (isEn ? '🚫 Suppressed' : '🚫 ถูกระงับชั่วคราว')
                    : state.prestige.autoRootEnabled
                    ? (isEn ? '🟢 Active (All Systems)' : '🟢 เปิดอยู่ (ครอบคลุมทุกระบบ)')
                    : (isEn ? '⚪ Disabled' : '⚪ ปิดอยู่')
                  : ''}
                desc={state.prestige.autoRoot
                  ? isVoidTrial
                    ? (isEn ? '⚠️ Automation is temporarily suppressed during the Void Anomaly trial.' : '⚠️ บอทถูกระงับชั่วคราวจากสนามพลังมิติสุญญะ จะกลับมาทำงานเมื่อพิชิตด่านสำเร็จ')
                    : (isEn ? 'Autonomous Engine: Smart ROI bulk root buying (10-25 packs), upgrades, echoes, species networks & floating events — Click to toggle ON/OFF' : 'ปัญญาประดิษฐ์อัตโนมัติครบวงจร: วิเคราะห์ ROI ซื้อรากไม้แบบเหมา (10-25 ต้น), ซื้ออัปเกรด, ปลุกเสียงสะท้อน, สร้างเครือข่ายรากไม้ และเก็บอีเวนต์ลอยให้อัตโนมัติ — คลิกเพื่อเปิด/ปิด')
                  : (isEn ? 'All-in-One Automation: Purchases optimal roots (smart bulk buy), milestone upgrades, permanent echoes, root synergy networks, and floating events forever!' : 'ระบบออโต้ครบจบในตัวเดียว: ซื้อรากที่คุ้มที่สุด (คำนวณ ROI ล่วงหน้าและเหมาซื้อ 10-25 ต้น), ซื้ออัปเกรด, สะท้อนราก, เครือข่ายรากไม้ และเก็บอีเวนต์ลอยให้อัตโนมัติทั้งหมดตลอดไป')}
                costText={state.prestige.autoRoot ? '—' : `${fmtInt(AUTO_ROOT_COST)} 🌌`}
                isOwned={state.prestige.autoRoot}
                isDisabled={!state.prestige.autoRoot && seeds < AUTO_ROOT_COST}
                isToggledOff={state.prestige.autoRoot && (!state.prestige.autoRootEnabled || isVoidTrial)}
                isActive={state.prestige.autoRoot && (state.prestige.autoRootEnabled && !isVoidTrial)}
                onClick={state.prestige.autoRoot ? onToggleAutoRoot : onBuyAutoRoot}
                seeds={seeds}
                isEn={isEn}
              />

              {/* ===== Events & Buffs ===== */}
              {renderSectionHeader(tr.prestigeSecEvents)}
              {(() => {
                const curLvl = Math.min(EVENT_BONUS_MAX_LEVEL, state.prestige.eventBonusLevel || 0);
                const bonusPct = Number((curLvl * 0.1).toFixed(1)).toLocaleString();
                return (
                  <PrestigeUpgradeRow
                    title={isEn ? '💰 Event Value Booster' : '💰 โบนัสอีเว้น'}
                    badge={isEn ? `Lv.${curLvl.toLocaleString()} (+${bonusPct}%)` : `เลเวล ${curLvl.toLocaleString()} (+${bonusPct}%)`}
                    desc={isEn
                      ? `Increases reward gains from floating events by +0.1% (Currently +${bonusPct}%)`
                      : `เพิ่มผลตอบแทนของกล่องสมบัติ/บัฟ/โชคดี ที่ได้จากการคลิกอีเว้นอีก 0.1% (ตอนนี้ +${bonusPct}%)`}
                    costFn={eventBonusCost}
                    currentLevel={curLvl}
                    maxLevel={EVENT_BONUS_MAX_LEVEL}
                    seeds={seeds}
                    onBuy={onBuyEventBonus}
                    isEn={isEn}
                  />
                );
              })()}

              <PrestigeUpgradeRow
                title={isEn ? '⏳ Extended Surge Duration' : '⏳ ขยายเวลาบัฟ'}
                badge={eventDurationMaxed(state) ? (isEn ? 'MAXED ✓' : 'เต็มแล้ว ✓') : (isEn ? `Level ${state.prestige.eventDurationLevel}` : `เลเวล ${state.prestige.eventDurationLevel}`)}
                desc={eventDurationMaxed(state)
                  ? (isEn ? `Maxed out at +${(state.prestige.eventDurationLevel || 0) * 15}%` : `เต็มแล้วที่ +${(state.prestige.eventDurationLevel || 0) * 15}% (ไม่รวมโชคดี)`)
                  : (isEn ? `Extends surge buff duration by +15% (Currently +${(state.prestige.eventDurationLevel || 0) * 15}%)` : `เพิ่มระยะเวลาของบัฟ/กล่องสมบัติอีก 15% (ตอนนี้ +${(state.prestige.eventDurationLevel || 0) * 15}%, ไม่รวมโชคดี)`)}
                costText={eventDurationMaxed(state) ? '—' : `${eventDurationCost(state)} 🌌`}
                isMaxed={eventDurationMaxed(state)}
                isDisabled={!eventDurationMaxed(state) && seeds < eventDurationCost(state)}
                isOwned={eventDurationMaxed(state)}
                onClick={onBuyEventDuration}
                seeds={seeds}
                isEn={isEn}
              />

              <PrestigeUpgradeRow
                title={isEn ? '🍀 Lucky Clover Frequency' : '🍀 โอกาสโชคดีเพิ่ม'}
                badge={luckyChanceMaxed(state) ? (isEn ? 'MAXED ✓' : 'เต็มแล้ว ✓') : (isEn ? `Level ${state.prestige.luckyChanceLevel || 0}` : `เลเวล ${state.prestige.luckyChanceLevel || 0}`)}
                desc={luckyChanceMaxed(state)
                  ? (isEn ? `Maxed at ${(luckyChancePct(state) * 100).toFixed(1)}%` : `เต็มแล้วที่ ${(luckyChancePct(state) * 100).toFixed(1)}% (สูงสุด)`)
                  : (isEn
                      ? `Increases chance of triggering Lucky Clover — Currently ${(luckyChancePct(state) * 100).toFixed(1)}%, next level ${(Math.min(LUCKY_CHANCE_MAX, luckyChancePct(state) + LUCKY_CHANCE_STEP) * 100).toFixed(1)}%`
                      : `เพิ่มโอกาสเจอบัฟโชคดี — ตอนนี้ ${(luckyChancePct(state) * 100).toFixed(1)}% เลเวลต่อไปเป็น ${(Math.min(LUCKY_CHANCE_MAX, luckyChancePct(state) + LUCKY_CHANCE_STEP) * 100).toFixed(1)}%`)}
                costText={luckyChanceMaxed(state) ? '—' : `${luckyChanceCost(state)} 🌌`}
                isMaxed={luckyChanceMaxed(state)}
                isDisabled={!luckyChanceMaxed(state) && seeds < luckyChanceCost(state)}
                isOwned={luckyChanceMaxed(state)}
                onClick={onBuyLuckyChance}
                seeds={seeds}
                isEn={isEn}
              />

              <PrestigeUpgradeRow
                title={isEn ? '🍀 Lucky Magnitude Multiplier' : '🍀 โชคดีทวีคูณ'}
                badge={isEn ? `Lv.${state.prestige.luckyMagnitudeLevel || 0} (×${(state.prestige.luckyMagnitudeLevel || 0) + 1})` : `เลเวล ${state.prestige.luckyMagnitudeLevel || 0} (×${(state.prestige.luckyMagnitudeLevel || 0) + 1})`}
                desc={isEn
                  ? `Stacks Lucky Clover (×777) multiplier — Currently ×${(state.prestige.luckyMagnitudeLevel || 0) + 1}, next level ×${(state.prestige.luckyMagnitudeLevel || 0) + 2} (Cap: ×10)`
                  : `ทบตัวคูณของบัฟโชคดี (×777) เพิ่มอีกชั้น — ตอนนี้ ×${(state.prestige.luckyMagnitudeLevel || 0) + 1} ต่อไปเป็น ×${(state.prestige.luckyMagnitudeLevel || 0) + 2} (สูงสุด ×10)`}
                costFn={luckyMagnitudeCost}
                currentLevel={state.prestige.luckyMagnitudeLevel || 0}
                maxLevel={LUCKY_MAGNITUDE_MAX_LEVEL}
                seeds={seeds}
                onBuy={onBuyLuckyMagnitude}
                isEn={isEn}
              />

              <PrestigeUpgradeRow
                title={isEn ? '⏳🍀 Extended Lucky Duration' : '⏳🍀 โชคดีอยู่นานขึ้น'}
                badge={isEn ? `Lv.${state.prestige.luckyDurationLevel || 0} (${Math.min(LUCKY_DURATION_MAX, LUCKY_DURATION_BASE + (state.prestige.luckyDurationLevel || 0))}s)` : `เลเวล ${state.prestige.luckyDurationLevel || 0} (${Math.min(LUCKY_DURATION_MAX, LUCKY_DURATION_BASE + (state.prestige.luckyDurationLevel || 0))}วิ)`}
                desc={isEn
                  ? `Extends Lucky Clover duration (+1s/level) — Currently ${Math.min(LUCKY_DURATION_MAX, LUCKY_DURATION_BASE + (state.prestige.luckyDurationLevel || 0))}s (Cap: ${LUCKY_DURATION_MAX}s)`
                  : `ยืดเวลาบัฟโชคดี (+1 วิ/เลเวล) — ตอนนี้ ${Math.min(LUCKY_DURATION_MAX, LUCKY_DURATION_BASE + (state.prestige.luckyDurationLevel || 0))} วิ (สูงสุด ${LUCKY_DURATION_MAX} วิ)`}
                costFn={luckyDurationCost}
                currentLevel={state.prestige.luckyDurationLevel || 0}
                maxLevel={LUCKY_DURATION_MAX_LEVEL}
                seeds={seeds}
                onBuy={onBuyLuckyDuration}
                isEn={isEn}
              />

              {/* ===== Other & Aesthetic Skins ===== */}
              {renderSectionHeader(tr.prestigeSecSkins)}
              <PrestigeUpgradeRow
                title={isEn ? '⏰ Expand Offline Rest Cap' : '⏰ ขยายเพดาน Offline'}
                badge={offlineCapMaxed(state) ? (isEn ? 'MAXED ✓' : 'เต็มแล้ว ✓') : ''}
                desc={offlineCapMaxed(state)
                  ? (isEn ? `Current cap: ${OFFLINE_CAP_HOURS[state.prestige.offlineCapLevel || 0]} hrs (Maximum)` : `เพดานปัจจุบัน ${OFFLINE_CAP_HOURS[state.prestige.offlineCapLevel || 0]} ชม. (สูงสุดแล้ว)`)
                  : (isEn ? `Expands offline storage cap from ${OFFLINE_CAP_HOURS[state.prestige.offlineCapLevel || 0]}h to ${OFFLINE_CAP_HOURS[(state.prestige.offlineCapLevel || 0) + 1]}h` : `ขยายจาก ${OFFLINE_CAP_HOURS[state.prestige.offlineCapLevel || 0]} ชม. เป็น ${OFFLINE_CAP_HOURS[(state.prestige.offlineCapLevel || 0) + 1]} ชม.`)}
                costText={offlineCapMaxed(state) ? '—' : `${offlineCapCost(state)} 🌌`}
                isMaxed={offlineCapMaxed(state)}
                isDisabled={!offlineCapMaxed(state) && seeds < offlineCapCost(state)}
                isOwned={offlineCapMaxed(state)}
                onClick={onBuyOfflineCapUpgrade}
                seeds={seeds}
                isEn={isEn}
              />

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
