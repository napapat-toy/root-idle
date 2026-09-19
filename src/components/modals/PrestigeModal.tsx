'use client';

import React, { useState } from 'react';
import { GameState, Language } from '@/types/game';
import {
  AUTO_ROOT_COST,
  calcPrestigeSeeds,
  EVENT_BONUS_MAX_LEVEL,
  eventBonusCost,
  EVENT_DURATION_MAX_LEVEL,
  eventDurationCost,
  eventDurationMaxed,
  goldenSeedCost,
  GOLDEN_SEED_MAX_LEVEL,
  LUCKY_CHANCE_MAX,
  LUCKY_CHANCE_MAX_LEVEL,
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
  STARTER_CULTURE_MAX_LEVEL,
  starterCultureCost,
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
  onTransmuteSeedsToPetals?: (qty?: number) => void;
  onTransmuteEssencesToPetals?: (qty?: number) => void;
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
  onToggleAutoRoot: _onToggleAutoRoot,
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

            <div className="modal-actions" style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '2px 0 8px' }}>
              <button
                type="button"
                className="btn-prestige-confirm"
                onClick={handlePrestigeClick}
              >
                <span>🌌</span>
                <span>{tr.confirmPrestigeBtn}</span>
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
                badge={(state.prestige.starterLevel || 0) >= STARTER_CULTURE_MAX_LEVEL
                  ? (isEn ? 'MAXED ✓' : 'เต็มแล้ว ✓')
                  : (isEn
                      ? `Lv. ${state.prestige.starterLevel || 0} / ${STARTER_CULTURE_MAX_LEVEL}`
                      : `เลเวล ${state.prestige.starterLevel || 0} / ${STARTER_CULTURE_MAX_LEVEL}`)}
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
                badge={(state.prestige.goldenLevel || 0) >= GOLDEN_SEED_MAX_LEVEL
                  ? (isEn ? `MAXED ✓ (+${((state.prestige.goldenLevel || 0) * 0.1).toFixed(1)}%)` : `เต็มแล้ว ✓ (+${((state.prestige.goldenLevel || 0) * 0.1).toFixed(1)}%)`)
                  : (isEn
                      ? `Lv. ${fmtInt(state.prestige.goldenLevel || 0)} / ${fmtInt(GOLDEN_SEED_MAX_LEVEL)} (+${((state.prestige.goldenLevel || 0) * 0.1).toFixed(1)}%)`
                      : `เลเวล ${fmtInt(state.prestige.goldenLevel || 0)} / ${fmtInt(GOLDEN_SEED_MAX_LEVEL)} (+${((state.prestige.goldenLevel || 0) * 0.1).toFixed(1)}%)`)}
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
                badge={(state.prestige.passiveRateLevel || 0) >= PASSIVE_RATE_MAX_LEVEL
                  ? (isEn ? `MAXED ✓ (+${((state.prestige.passiveRateLevel || 0) * 0.1).toFixed(1)}%)` : `เต็มแล้ว ✓ (+${((state.prestige.passiveRateLevel || 0) * 0.1).toFixed(1)}%)`)
                  : (isEn
                      ? `Lv. ${fmtInt(state.prestige.passiveRateLevel || 0)} / ${fmtInt(PASSIVE_RATE_MAX_LEVEL)} (+${((state.prestige.passiveRateLevel || 0) * 0.1).toFixed(1)}%)`
                      : `เลเวล ${fmtInt(state.prestige.passiveRateLevel || 0)} / ${fmtInt(PASSIVE_RATE_MAX_LEVEL)} (+${((state.prestige.passiveRateLevel || 0) * 0.1).toFixed(1)}%)`)}
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
                  ? (isEn ? '✓ Unlocked' : '✓ ปลดล็อกแล้ว')
                  : (isEn ? '✨ One-Time Unlock' : '✨ ซื้อครั้งเดียวจบ')}
                desc={state.prestige.autoRoot
                  ? (isEn
                      ? 'Autonomous Engine: Analyzes ROI, bulk buys roots (10-25 packs), upgrades, echoes, species networks & floating events (controlled on main screen).'
                      : 'ปัญญาประดิษฐ์อัตโนมัติครบวงจร: วิเคราะห์ ROI ซื้อรากไม้แบบเหมา (10-25 ต้น), ซื้ออัปเกรด, ปลุกเสียงสะท้อน, สร้างเครือข่ายรากไม้ และเก็บอีเวนต์ลอยให้อัตโนมัติ (ควบคุมเปิด/ปิดได้ที่หน้าจอหลัก)')
                  : (isEn
                      ? 'All-in-One Automation: Purchases optimal roots (smart bulk buy), milestone upgrades, permanent echoes, root synergy networks, and floating events forever!'
                      : 'ระบบออโต้ครบจบในตัวเดียว: ซื้อรากที่คุ้มที่สุด (คำนวณ ROI ล่วงหน้าและเหมาซื้อ 10-25 ต้น), ซื้ออัปเกรด, สะท้อนราก, เครือข่ายรากไม้ และเก็บอีเวนต์ลอยให้อัตโนมัติทั้งหมดตลอดไป')}
                costText={state.prestige.autoRoot ? '—' : `${fmtInt(AUTO_ROOT_COST)} 🌌`}
                isOwned={state.prestige.autoRoot}
                isMaxed={state.prestige.autoRoot}
                isDisabled={!state.prestige.autoRoot && seeds < AUTO_ROOT_COST}
                onClick={state.prestige.autoRoot ? undefined : onBuyAutoRoot}
                seeds={seeds}
                isEn={isEn}
              />

              {/* ===== Events & Buffs ===== */}
              {renderSectionHeader(tr.prestigeSecEvents)}
              {(() => {
                const curLvl = Math.min(EVENT_BONUS_MAX_LEVEL, state.prestige.eventBonusLevel || 0);
                const isMaxed = curLvl >= EVENT_BONUS_MAX_LEVEL;
                const bonusPct = Number((curLvl * 0.1).toFixed(1)).toLocaleString();
                return (
                  <PrestigeUpgradeRow
                    title={isEn ? '💰 Event Value Booster' : '💰 โบนัสอีเว้น'}
                    badge={isMaxed
                      ? (isEn ? `MAXED ✓ (+${bonusPct}%)` : `เต็มแล้ว ✓ (+${bonusPct}%)`)
                      : (isEn
                          ? `Lv. ${fmtInt(curLvl)} / ${fmtInt(EVENT_BONUS_MAX_LEVEL)} (+${bonusPct}%)`
                          : `เลเวล ${fmtInt(curLvl)} / ${fmtInt(EVENT_BONUS_MAX_LEVEL)} (+${bonusPct}%)`)}
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
                badge={eventDurationMaxed(state)
                  ? (isEn ? 'MAXED ✓' : 'เต็มแล้ว ✓')
                  : (isEn
                      ? `Lv. ${state.prestige.eventDurationLevel || 0} / ${EVENT_DURATION_MAX_LEVEL}`
                      : `เลเวล ${state.prestige.eventDurationLevel || 0} / ${EVENT_DURATION_MAX_LEVEL}`)}
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
                badge={luckyChanceMaxed(state)
                  ? (isEn ? 'MAXED ✓' : 'เต็มแล้ว ✓')
                  : (isEn
                      ? `Lv. ${state.prestige.luckyChanceLevel || 0} / ${LUCKY_CHANCE_MAX_LEVEL}`
                      : `เลเวล ${state.prestige.luckyChanceLevel || 0} / ${LUCKY_CHANCE_MAX_LEVEL}`)}
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
                badge={(state.prestige.luckyMagnitudeLevel || 0) >= LUCKY_MAGNITUDE_MAX_LEVEL
                  ? (isEn ? 'MAXED ✓ (×10)' : 'เต็มแล้ว ✓ (×10)')
                  : (isEn
                      ? `Lv. ${state.prestige.luckyMagnitudeLevel || 0} / ${LUCKY_MAGNITUDE_MAX_LEVEL} (×${(state.prestige.luckyMagnitudeLevel || 0) + 1})`
                      : `เลเวล ${state.prestige.luckyMagnitudeLevel || 0} / ${LUCKY_MAGNITUDE_MAX_LEVEL} (×${(state.prestige.luckyMagnitudeLevel || 0) + 1})`)}
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
                badge={(state.prestige.luckyDurationLevel || 0) >= LUCKY_DURATION_MAX_LEVEL
                  ? (isEn ? `MAXED ✓ (${LUCKY_DURATION_MAX}s)` : `เต็มแล้ว ✓ (${LUCKY_DURATION_MAX}วิ)`)
                  : (isEn
                      ? `Lv. ${state.prestige.luckyDurationLevel || 0} / ${LUCKY_DURATION_MAX_LEVEL} (${Math.min(LUCKY_DURATION_MAX, LUCKY_DURATION_BASE + (state.prestige.luckyDurationLevel || 0))}s)`
                      : `เลเวล ${state.prestige.luckyDurationLevel || 0} / ${LUCKY_DURATION_MAX_LEVEL} (${Math.min(LUCKY_DURATION_MAX, LUCKY_DURATION_BASE + (state.prestige.luckyDurationLevel || 0))}วิ)`)}
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

              {/* ===== Offline Rest ===== */}
              {renderSectionHeader(tr.prestigeSecOffline)}
              <PrestigeUpgradeRow
                title={isEn ? '⏰ Expand Offline Rest Cap' : '⏰ ขยายเพดาน Offline'}
                badge={offlineCapMaxed(state)
                  ? (isEn ? `MAXED ✓ (${OFFLINE_CAP_HOURS[state.prestige.offlineCapLevel || 0]}h)` : `เต็มแล้ว ✓ (${OFFLINE_CAP_HOURS[state.prestige.offlineCapLevel || 0]} ชม.)`)
                  : (isEn
                      ? `Lv. ${state.prestige.offlineCapLevel || 0} / ${OFFLINE_CAP_HOURS.length - 1} (${OFFLINE_CAP_HOURS[state.prestige.offlineCapLevel || 0]}h)`
                      : `เลเวล ${state.prestige.offlineCapLevel || 0} / ${OFFLINE_CAP_HOURS.length - 1} (${OFFLINE_CAP_HOURS[state.prestige.offlineCapLevel || 0]} ชม.)`)}
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
