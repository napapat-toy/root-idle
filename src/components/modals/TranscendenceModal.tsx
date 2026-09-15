'use client';

import React, { useState } from 'react';
import { GameState, Language, TrialDef, TrialId } from '@/types/game';
import {
  calcTranscendenceEssences,
  calcPrestigeSeeds,
  canTranscend,
  TRANSCENDENCE_REQUIRE_YGGDRASIL,
  primordialVigorCost,
  soilMemoryCost,
  soilMemoryRetainPct,
  gaiaTouchCost,
  gaiaTouchBonusMult,
  PRIMORDIAL_VIGOR_MAX_LEVEL,
  SOIL_MEMORY_MAX_LEVEL,
  GAIA_TOUCH_MAX_LEVEL,
  ECHO_RESONANCE_MAX_LEVEL,
  echoResonanceCost,
  GAIA_CLAIRVOYANCE_MAX_LEVEL,
  gaiaClairvoyanceCost,
  gaiaBlessingCost,
  GAIA_BLESSING_MAX_LEVEL,
  HYPERDRIVE_COST,
  AURORA_BLOOM_COST,
  PRIMORDIAL_SEEDLING_MAX_LEVEL,
  primordialSeedlingCost,
  fineRootBaseRate,
  DEEP_MEDITATION_MAX_LEVEL,
  deepMeditationCost,
  deepMeditationMultiplier,
  luckyChancePct,
  TRIAL_DEFS,
  isTrialCompleted,
} from '@/constants/gameData';
import { t } from '@/lib/i18n';
import { fmt, fmtInt } from '@/lib/formatters';
import { ConfirmModal } from './ConfirmModal';
import { TrialCard } from './transcendence/TrialCard';
import { GaiaPerkRow } from './transcendence/GaiaPerkRow';

interface TranscendenceModalProps {
  state: GameState;
  onClose: () => void;
  onTranscend: () => void;
  onBuyPrimordialVigor: () => void;
  onBuySoilMemory: () => void;
  onBuyAutoManager: () => void;
  onBuyGaiaBlessing?: () => void;
  onBuyGaiaTouch: () => void;
  onBuyEchoResonance: () => void;
  onBuyGaiaClairvoyance: () => void;
  onBuyPrimordialSeedling: () => void;
  onBuyDeepMeditation: () => void;
  onBuyHyperdrive?: () => void;
  onToggleHyperdrive?: () => void;
  onBuyAuroraBloom?: () => void;
  onStartTrial: (trialId: TrialId) => void;
  onAbandonTrial: () => void;
}

export const TranscendenceModal: React.FC<TranscendenceModalProps> = React.memo(({
  state,
  onClose,
  onTranscend,
  onBuyPrimordialVigor,
  onBuySoilMemory,
  onBuyAutoManager,
  onBuyGaiaBlessing,
  onBuyGaiaTouch,
  onBuyEchoResonance,
  onBuyGaiaClairvoyance,
  onBuyPrimordialSeedling,
  onBuyDeepMeditation,
  onBuyHyperdrive,
  onToggleHyperdrive,
  onBuyAuroraBloom,
  onStartTrial,
  onAbandonTrial,
}) => {
  const lang: Language = state.lang || 'th';
  const isEn = lang === 'en';
  const tr = t(lang);

  const [activeTab, setActiveTab] = useState<'tree' | 'trials'>('tree');
  const [showConfirmTranscend, setShowConfirmTranscend] = useState<boolean>(false);
  const [pendingTrialDef, setPendingTrialDef] = useState<TrialDef | null>(null);

  const essences = state.transcendence?.gaiaEssences || 0;
  const totalLifetimeEssences = state.transcendence?.totalGaiaEssencesLifetime || 0;
  const pendingEssences = calcTranscendenceEssences(state);

  const vigorLvl = state.transcendence?.primordialVigorLevel || 0;
  const vigorCost = primordialVigorCost(vigorLvl);
  const vigorMaxed = vigorLvl >= PRIMORDIAL_VIGOR_MAX_LEVEL;

  const soilLvl = state.transcendence?.soilMemoryLevel || 0;
  const soilCost = soilMemoryCost(soilLvl);
  const soilMaxed = soilLvl >= SOIL_MEMORY_MAX_LEVEL;

  const blessingLvl = state.transcendence?.gaiaBlessingLevel || 0;
  const blessingCost = gaiaBlessingCost(blessingLvl);
  const blessingMaxed = blessingLvl >= GAIA_BLESSING_MAX_LEVEL;

  const touchLvl = state.transcendence?.gaiaTouchLevel || 0;
  const touchCost = gaiaTouchCost(touchLvl);
  const touchMaxed = touchLvl >= GAIA_TOUCH_MAX_LEVEL;

  const echoResLvl = state.transcendence?.echoResonanceLevel || 0;
  const echoResCost = echoResonanceCost(echoResLvl);
  const echoResMaxed = echoResLvl >= ECHO_RESONANCE_MAX_LEVEL;

  const clairvoyanceLvl = state.transcendence?.gaiaClairvoyanceLevel || 0;
  const clairvoyanceCost = gaiaClairvoyanceCost(clairvoyanceLvl);
  const clairvoyanceMaxed = clairvoyanceLvl >= GAIA_CLAIRVOYANCE_MAX_LEVEL;

  const seedlingLvl = state.transcendence?.primordialSeedlingLevel || 0;
  const seedlingCost = primordialSeedlingCost(seedlingLvl);
  const seedlingMaxed = seedlingLvl >= PRIMORDIAL_SEEDLING_MAX_LEVEL;

  const meditationLvl = state.transcendence?.deepMeditationLevel || 0;
  const meditationCost = deepMeditationCost(meditationLvl);
  const meditationMaxed = meditationLvl >= DEEP_MEDITATION_MAX_LEVEL;

  const activeTrial = state.transcendence?.activeTrial || 'none';

  return (
    <div className="offline-backdrop" onClick={onClose} style={{ zIndex: 2100 }}>
      <div
        className="modal-wrapper transcendence-modal-wrapper"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '600px', width: '100%' }}
      >
        <button className="modal-close-x" onClick={onClose} aria-label={tr.close}>
          &times;
        </button>

        <div className="offline-modal generic-modal custom-scrollbar transcendence-modal-content" style={{ maxHeight: '88vh', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div className="icon" style={{ fontSize: '36px', marginBottom: '4px' }}>🌍</div>
          <h2 style={{ marginBottom: '4px', background: 'linear-gradient(135deg, #34d399, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {tr.transcendenceTitle}
          </h2>
          <div className="away-time" style={{ marginBottom: '12px', fontSize: '13px', display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <span>{isEn ? `Current Essences: ${fmt(essences)} 🌍` : `ครอบครอง: ${fmt(essences)} 🌍`}</span>
            {!!state.transcendence?.auroraBloomUnlocked && (
              <span style={{ color: '#f472b6', fontWeight: 700 }}>
                {isEn ? `Astral Petals: ${fmtInt(state.transcendence?.astralPetals || 0)} 🌸` : `เกสรดวงดาว: ${fmtInt(state.transcendence?.astralPetals || 0)} 🌸`}
              </span>
            )}
            <span style={{ color: 'var(--root-cream-dim)' }}>
              {isEn ? `Total Lifetime: ${fmt(totalLifetimeEssences)}` : `สะสมตลอดกาล: ${fmt(totalLifetimeEssences)}`}
            </span>
          </div>

          {/* Tab Switcher */}
          <div
            style={{
              display: 'flex',
              background: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '10px',
              padding: '3px',
              marginBottom: '14px',
              gap: '4px',
              border: '1px solid var(--line-soil)',
            }}
          >
            <button
              onClick={() => setActiveTab('tree')}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                background: activeTab === 'tree' ? 'linear-gradient(135deg, #10b981, #059669)' : 'transparent',
                color: activeTab === 'tree' ? '#ffffff' : 'var(--root-cream-dim)',
                transition: 'all 0.15s ease',
              }}
            >
              🌳 {tr.gaiaTreeTab}
            </button>
            <button
              onClick={() => setActiveTab('trials')}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                background: activeTab === 'trials' ? 'linear-gradient(135deg, #eab308, #ca8a04)' : 'transparent',
                color: activeTab === 'trials' ? '#ffffff' : 'var(--root-cream-dim)',
                transition: 'all 0.15s ease',
              }}
            >
              ⚔️ {tr.trialsTab}
            </button>
          </div>

          {/* Tab 1: Gaia Spirit Tree */}
          {activeTab === 'tree' && (
            <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', paddingRight: '4px', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
              {/* Grand Reset Card */}
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(6, 182, 212, 0.08))',
                  border: '1px solid rgba(52, 211, 153, 0.3)',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '13px', color: 'var(--root-cream-dim)', marginBottom: '6px' }}>
                  {isEn
                    ? 'Channel the ancient vitality of the World Tree to awaken the planet’s soul. Requires at least 100 Yggdrasil roots in the current run.'
                    : 'หลอมรวมพลังรากต้นไม้โลกเพื่อปลุกจิตวิญญาณแห่งโลก รีเซ็ตรอบใหญ่ต้องมีรากต้นไม้โลกครบอย่างน้อย 100 ต้นในรอบปัจจุบัน'}
                </div>

                {(() => {
                  const yggOwned = state.owned['yggdrasil'] || 0;
                  const hasReachedYgg = canTranscend(state);

                  if (hasReachedYgg) {
                    return (
                      <>
                        <div style={{ fontSize: '18px', fontWeight: 800, color: '#34d399', marginBottom: '2px' }}>
                          {isEn ? `+${fmt(pendingEssences)} Gaia Essences on Grand Reset` : `+${fmt(pendingEssences)} ละอองชีวิตดึกดำบรรพ์ (เมื่อรีเซ็ตใหญ่)`}
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#6ee7b7', marginBottom: '10px' }}>
                          {isEn ? `(Calculated directly from ${yggOwned} World Trees in this run)` : `(คำนวณจากต้นไม้โลก ${yggOwned} ต้นในรอบนี้โดยตรง)`}
                        </div>
                      </>
                    );
                  }

                  return (
                    <div
                      style={{
                        background: 'rgba(245, 158, 11, 0.12)',
                        border: '1px solid rgba(245, 158, 11, 0.4)',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        marginBottom: '10px',
                        fontSize: '13px',
                        color: '#facc15',
                        fontWeight: 700,
                      }}
                    >
                      🔒 {isEn
                        ? `Requires 100 Yggdrasil World Trees in current run (${yggOwned}/${TRANSCENDENCE_REQUIRE_YGGDRASIL} 🌳)`
                        : `ต้องการรากต้นไม้โลกครบ 100 ต้น ในรอบปัจจุบัน (${yggOwned}/${TRANSCENDENCE_REQUIRE_YGGDRASIL} 🌳)`}
                    </div>
                  );
                })()}

                {(() => {
                  const yggOwned = state.owned['yggdrasil'] || 0;
                  const hasReachedYgg = canTranscend(state);

                  if (!hasReachedYgg) {
                    return (
                      <button
                        disabled
                        style={{
                          background: 'rgba(255,255,255,0.06)',
                          color: 'rgba(255,255,255,0.3)',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '10px 20px',
                          fontWeight: 700,
                          fontSize: '13px',
                          cursor: 'not-allowed',
                        }}
                      >
                        🔒 {isEn ? `Requires 100 Yggdrasil (${yggOwned}/100)` : `ต้องการ 100 ต้นไม้โลก (${yggOwned}/100)`}
                      </button>
                    );
                  }

                  if (!showConfirmTranscend) {
                    return (
                      <button
                        onClick={() => setShowConfirmTranscend(true)}
                        style={{
                          background: 'linear-gradient(135deg, #10b981, #059669)',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '10px 20px',
                          fontWeight: 700,
                          fontSize: '14px',
                          cursor: 'pointer',
                          boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                          transition: 'all 0.2s',
                        }}
                      >
                        ✨ {tr.confirmTranscendBtn}
                      </button>
                    );
                  }

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                      <div style={{ fontSize: '11.5px', color: '#fca5a5', maxWidth: '380px', lineHeight: '1.4' }}>
                        ⚠️ {isEn
                          ? `Confirm Grand Reset: Convert ${yggOwned} World Trees into +${fmt(pendingEssences)} 🌍. Wallet seeds reset to 0 to begin the new era, while all permanent shop upgrades are preserved.`
                          : `ยืนยันการรีเซ็ตใหญ่: หลอมรวมต้นไม้โลก ${yggOwned} ต้น รับ +${fmt(pendingEssences)} 🌍 (เมล็ดในกระเป๋าจะรีเซ็ตเป็น 0 เพื่อเริ่มยุคใหม่ แต่อัปเกรดร้านค้าจะอยู่ครบถ้วน)`}
                      </div>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => {
                            setShowConfirmTranscend(false);
                            onTranscend();
                          }}
                          style={{
                            background: '#ef4444',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '8px 16px',
                            fontWeight: 700,
                            fontSize: '13px',
                            cursor: 'pointer',
                          }}
                        >
                          {isEn ? '⚠️ Confirm Grand Reset' : '⚠️ ยืนยันการรีเซ็ตใหญ่'}
                        </button>
                        <button
                          onClick={() => setShowConfirmTranscend(false)}
                          style={{
                            background: 'var(--bg-panel-2)',
                            color: 'var(--root-cream-dim)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            padding: '8px 16px',
                            fontSize: '13px',
                            cursor: 'pointer',
                          }}
                        >
                          {tr.cancel}
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Gaia Perks List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Perk 1: Primordial Vigor */}
                <GaiaPerkRow
                  icon="🌱"
                  name={tr.transcendPerk1Name}
                  desc={tr.transcendPerk1Desc}
                  levelText={`Lv. ${vigorLvl}/${PRIMORDIAL_VIGOR_MAX_LEVEL}`}
                  effectText={isEn ? `Current Effect: +${(vigorLvl * 25).toFixed(0)}% Base Rate` : `ผลปัจจุบัน: เรทพื้นฐาน +${(vigorLvl * 25).toFixed(0)}%`}
                  cost={vigorCost}
                  isMaxed={vigorMaxed}
                  canAfford={essences >= vigorCost}
                  onBuy={onBuyPrimordialVigor}
                  maxTag={tr.maxTag}
                />

                {/* Perk 2: Soil Memory */}
                <GaiaPerkRow
                  icon="📜"
                  name={tr.transcendPerk2Name}
                  desc={tr.transcendPerk2Desc}
                  levelText={`Lv. ${soilLvl}/${SOIL_MEMORY_MAX_LEVEL}`}
                  effectText={isEn ? `Current Effect: Retain ${(soilMemoryRetainPct(state) * 100).toFixed(0)}% Echoes` : `ผลปัจจุบัน: คงสะท้อนราก ${(soilMemoryRetainPct(state) * 100).toFixed(0)}%`}
                  cost={soilCost}
                  isMaxed={soilMaxed}
                  canAfford={essences >= soilCost}
                  onBuy={onBuySoilMemory}
                  maxTag={tr.maxTag}
                />

                {/* Perk 3: Gaia's Blessing */}
                <GaiaPerkRow
                  icon="🌍"
                  name={tr.transcendPerk3Name}
                  desc={isEn
                    ? `Increases Gaia Essences earned upon Grand Reset by +1% per level (Currently +${blessingLvl * 1}%, max +500%)`
                    : `เพิ่มละอองชีวิตที่ได้รับเมื่อรีเซ็ตใหญ่เลเวลละ +1% (ตอนนี้ +${blessingLvl * 1}%, สูงสุด +500%)`}
                  customBadge={
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        background: 'rgba(52, 211, 153, 0.15)',
                        color: '#34d399',
                        padding: '1px 7px',
                        borderRadius: '999px',
                      }}
                    >
                      Lv. {blessingLvl}/{GAIA_BLESSING_MAX_LEVEL} (+{blessingLvl * 1}%)
                    </span>
                  }
                  cost={blessingCost}
                  isMaxed={blessingMaxed}
                  canAfford={essences >= blessingCost}
                  onBuy={onBuyGaiaBlessing || onBuyAutoManager}
                  maxTag={tr.maxTag}
                />

                {/* Perk 4: Gaia's Touch */}
                <GaiaPerkRow
                  icon="✨"
                  name={tr.transcendPerk4Name}
                  desc={tr.transcendPerk4Desc}
                  levelText={`Lv. ${touchLvl}/${GAIA_TOUCH_MAX_LEVEL}`}
                  effectText={isEn ? `Current Effect: ×${gaiaTouchBonusMult(state).toFixed(2)} Lucky Magnitude` : `ผลปัจจุบัน: แจ็กพอตโชคดี ×${gaiaTouchBonusMult(state).toFixed(2)} เท่า`}
                  cost={touchCost}
                  isMaxed={touchMaxed}
                  canAfford={essences >= touchCost}
                  onBuy={onBuyGaiaTouch}
                  maxTag={tr.maxTag}
                />

                {/* Perk 5: Echo Resonance */}
                <GaiaPerkRow
                  icon="🌀"
                  name={tr.transcendPerk5Name}
                  desc={tr.transcendPerk5Desc}
                  levelText={`Lv. ${echoResLvl}/${ECHO_RESONANCE_MAX_LEVEL}`}
                  effectText={isEn ? `Current Effect: Max Echo Cap Lv.${5 + echoResLvl}` : `ผลปัจจุบัน: เพดานสะท้อนรากสูงสุด Lv.${5 + echoResLvl}`}
                  cost={echoResCost}
                  isMaxed={echoResMaxed}
                  canAfford={essences >= echoResCost}
                  onBuy={onBuyEchoResonance}
                  maxTag={tr.maxTag}
                />

                {/* Perk 6: Gaia's Clairvoyance */}
                <GaiaPerkRow
                  icon="👁️"
                  name={tr.transcendPerk6Name}
                  desc={tr.transcendPerk6Desc}
                  levelText={`Lv. ${clairvoyanceLvl}/${GAIA_CLAIRVOYANCE_MAX_LEVEL}`}
                  effectText={isEn ? `Current Effect: +${(clairvoyanceLvl * 0.1).toFixed(1)}% Lucky Chance (Cap: ${(luckyChancePct(state) * 100).toFixed(1)}%)` : `ผลปัจจุบัน: +${(clairvoyanceLvl * 0.1).toFixed(1)}% โอกาสโชคดี (เพดานรวม: ${(luckyChancePct(state) * 100).toFixed(1)}%)`}
                  cost={clairvoyanceCost}
                  isMaxed={clairvoyanceMaxed}
                  canAfford={essences >= clairvoyanceCost}
                  onBuy={onBuyGaiaClairvoyance}
                  maxTag={tr.maxTag}
                />

                {/* Perk 7: Primordial Seedling */}
                <GaiaPerkRow
                  icon="🌱"
                  name={tr.transcendPerk7Name}
                  desc={tr.transcendPerk7Desc}
                  levelText={`Lv. ${seedlingLvl}/${PRIMORDIAL_SEEDLING_MAX_LEVEL}`}
                  effectText={isEn ? `Current Effect: Fine Root Base Rate +${fineRootBaseRate(state).toFixed(2)}/s` : `ผลปัจจุบัน: เรทตั้งต้นรากฝอย +${fineRootBaseRate(state).toFixed(2)}/วิ`}
                  cost={seedlingCost}
                  isMaxed={seedlingMaxed}
                  canAfford={essences >= seedlingCost}
                  onBuy={onBuyPrimordialSeedling}
                  maxTag={tr.maxTag}
                />

                {/* Perk 8: Deep Meditation */}
                <GaiaPerkRow
                  icon="🧘"
                  name={tr.transcendPerk8Name}
                  desc={tr.transcendPerk8Desc}
                  levelText={`Lv. ${meditationLvl}/${DEEP_MEDITATION_MAX_LEVEL}`}
                  effectText={isEn
                    ? `Current Multiplier: ×${deepMeditationMultiplier(state).toFixed(2)} (+${((deepMeditationMultiplier(state) - 1) * 100).toFixed(0)}% Global Rate)`
                    : `ตัวคูณปัจจุบัน: ×${deepMeditationMultiplier(state).toFixed(2)} (+${((deepMeditationMultiplier(state) - 1) * 100).toFixed(0)}% เรทผลิตรวม)`}
                  cost={meditationCost}
                  isMaxed={meditationMaxed}
                  canAfford={essences >= meditationCost}
                  onBuy={onBuyDeepMeditation}
                  maxTag={tr.maxTag}
                />

                {/* Perk 9: Hyperdrive Overclock (2x Speed Toggle) */}
                <GaiaPerkRow
                  icon="⚡"
                  name={isEn ? 'Hyperdrive Overclock (2x Speed)' : 'ความเร็วเร่งมิติ (Hyperdrive 2x)'}
                  desc={isEn
                    ? 'Permanently unlocks a 2x game speed toggle. Accelerates garden time, production, and timers with zero extra CPU overhead.'
                    : 'ปลดล็อกสวิตช์เร่งความเร็วเกม 2 เท่าถาวร เร่งเวลาผลผลิตและคูลดาวน์ทั้งหมดโดยไม่กินแรงเครื่อง'}
                  customBadge={
                    state.transcendence?.hyperdriveUnlocked ? (
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          background: state.transcendence?.hyperdriveEnabled ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                          color: state.transcendence?.hyperdriveEnabled ? '#38bdf8' : 'var(--root-cream-dim)',
                          padding: '1px 7px',
                          borderRadius: '999px',
                        }}
                      >
                        {state.transcendence?.hyperdriveEnabled ? (isEn ? '⚡ 2x ACTIVE' : '⚡ กำลังเร่ง 2x') : (isEn ? '⏸️ 1x PAUSED' : '⏸️ พัก 1x')}
                      </span>
                    ) : (
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          background: 'rgba(245, 158, 11, 0.15)',
                          color: '#facc15',
                          padding: '1px 7px',
                          borderRadius: '999px',
                        }}
                      >
                        🔒 {isEn ? 'LOCKED' : 'ยังไม่ปลดล็อก'}
                      </span>
                    )
                  }
                  customAction={
                    state.transcendence?.hyperdriveUnlocked ? (
                      <button
                        onClick={onToggleHyperdrive}
                        style={{
                          background: state.transcendence?.hyperdriveEnabled ? 'linear-gradient(135deg, #0284c7, #06b6d4)' : 'rgba(255, 255, 255, 0.1)',
                          color: state.transcendence?.hyperdriveEnabled ? '#ffffff' : 'var(--root-cream)',
                          border: '1px solid rgba(56, 189, 248, 0.4)',
                          borderRadius: '8px',
                          padding: '8px 14px',
                          fontWeight: 700,
                          fontSize: '12px',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          flexShrink: 0,
                          boxShadow: state.transcendence?.hyperdriveEnabled ? '0 0 12px rgba(6, 182, 212, 0.4)' : 'none',
                        }}
                      >
                        {state.transcendence?.hyperdriveEnabled ? (isEn ? '⚡ 2x ON' : '⚡ 2x เปิดอยู่') : (isEn ? '⏸️ 1x OFF' : '⏸️ 1x ปิดอยู่')}
                      </button>
                    ) : (
                      <button
                        onClick={onBuyHyperdrive}
                        disabled={essences < HYPERDRIVE_COST}
                        style={{
                          background: essences >= HYPERDRIVE_COST ? '#34d399' : 'rgba(52, 211, 153, 0.2)',
                          color: essences >= HYPERDRIVE_COST ? '#064e3b' : 'rgba(255,255,255,0.4)',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          fontWeight: 700,
                          fontSize: '12px',
                          cursor: essences >= HYPERDRIVE_COST ? 'pointer' : 'not-allowed',
                          whiteSpace: 'nowrap',
                          flexShrink: 0,
                        }}
                      >
                        {`${fmtInt(HYPERDRIVE_COST)} 🌍`}
                      </button>
                    )
                  }
                />

                {/* Perk 10: Aurora Bloom */}
                <GaiaPerkRow
                  icon="✨"
                  name={isEn ? 'Aurora Bloom (Subterranean Phenomenon)' : 'ปรากฏการณ์ออโรร่าใต้พิภพ (Aurora Bloom)'}
                  desc={isEn
                    ? 'Summons rare Aurora Spores that float into the garden awarding Astral Petals (🌸 +1 to +3). Also unlocks the 50B Seed Transmutation sink in Prestige.'
                    : 'เรียกสปอร์ออโรร่าลอยลงมามอบเกสรดวงดาว (🌸 +1 ถึง +3 ดอก) พร้อมปลดล็อกหลุมหลอมเมล็ด 50,000,000,000 เมล็ดเป็นเกสรดวงดาวในร้าน Prestige'}
                  customBadge={
                    state.transcendence?.auroraBloomUnlocked ? (
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          background: 'rgba(244, 114, 182, 0.2)',
                          color: '#f472b6',
                          padding: '1px 7px',
                          borderRadius: '999px',
                        }}
                      >
                        🌸 {isEn ? 'UNLOCKED' : 'ปลดล็อกแล้ว'}
                      </span>
                    ) : (
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          background: 'rgba(245, 158, 11, 0.15)',
                          color: '#facc15',
                          padding: '1px 7px',
                          borderRadius: '999px',
                        }}
                      >
                        🔒 {isEn ? 'LOCKED' : 'ยังไม่ปลดล็อก'}
                      </span>
                    )
                  }
                  customAction={
                    state.transcendence?.auroraBloomUnlocked ? (
                      <div
                        style={{
                          background: 'rgba(244, 114, 182, 0.15)',
                          color: '#f472b6',
                          border: '1px solid rgba(244, 114, 182, 0.35)',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          fontWeight: 700,
                          fontSize: '12px',
                          whiteSpace: 'nowrap',
                          flexShrink: 0,
                        }}
                      >
                        ✓ {isEn ? 'ACTIVE' : 'ทำงานอยู่'}
                      </div>
                    ) : (
                      <button
                        onClick={onBuyAuroraBloom}
                        disabled={essences < AURORA_BLOOM_COST}
                        style={{
                          background: essences >= AURORA_BLOOM_COST ? 'linear-gradient(135deg, #ec4899, #8b5cf6)' : 'rgba(236, 72, 153, 0.2)',
                          color: essences >= AURORA_BLOOM_COST ? '#ffffff' : 'rgba(255,255,255,0.4)',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          fontWeight: 700,
                          fontSize: '12px',
                          cursor: essences >= AURORA_BLOOM_COST ? 'pointer' : 'not-allowed',
                          whiteSpace: 'nowrap',
                          flexShrink: 0,
                          boxShadow: essences >= AURORA_BLOOM_COST ? '0 0 12px rgba(236, 72, 153, 0.4)' : 'none',
                        }}
                      >
                        {`${fmtInt(AURORA_BLOOM_COST)} 🌍`}
                      </button>
                    )
                  }
                />
              </div>
            </div>
          )}

          {/* Tab 2: Subterranean Trials */}
          {activeTab === 'trials' && (
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
              {/* Smart Guide Banner if current garden has reached 100 Yggdrasil roots */}
              {canTranscend(state) && (
                <div
                  style={{
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.1))',
                    border: '1px solid rgba(52, 211, 153, 0.45)',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    fontSize: '12px',
                    color: '#6ee7b7',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    lineHeight: '1.45',
                  }}
                >
                  <span style={{ fontSize: '20px', flexShrink: 0 }}>💡</span>
                  <div>
                    <strong style={{ color: '#ffffff' }}>
                      {isEn ? 'Recommended Next Step: ' : 'คำแนะนำจังหวะการเล่น: '}
                    </strong>
                    {isEn
                      ? `You currently have ${state.owned['yggdrasil'] || 0} World Trees (+${fmt(calcTranscendenceEssences(state))} 🌍 ready)! It is strongly recommended to switch to Tab 1 and press "Awaken Gaia" first to claim essences and upgrade perks before starting a trial.`
                      : `ตอนนี้คุณมีต้นไม้โลก ${state.owned['yggdrasil'] || 0} ต้น (พร้อมตื่นรู้รับ +${fmt(calcTranscendenceEssences(state))} 🌍)! แนะนำให้กด "ตื่นรู้แห่งไกอา" ในแท็บแรก เพื่อนำละอองชีวิตไปอัปพลังเทพเจ้าก่อนเริ่มการทดสอบรอบใหม่ จะคุ้มค่าที่สุดและผ่านได้ง่ายขึ้น`}
                  </div>
                </div>
              )}

              {/* Trial Overview & Reset Notice Banner */}
              <div
                style={{
                  background: 'rgba(234, 179, 8, 0.08)',
                  border: '1px solid rgba(234, 179, 8, 0.3)',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  fontSize: '11.5px',
                  color: 'var(--root-cream)',
                  lineHeight: '1.45',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#facc15', marginBottom: '4px' }}>
                  <span style={{ fontSize: '15px', flexShrink: 0 }}>⚔️</span>
                  <span style={{ fontSize: '12.5px' }}>
                    {isEn ? 'Subterranean Trial Rules & Reset Information' : 'กติกาการทดลองแห่งผืนพิภพและการรีเซ็ต'}
                  </span>
                </div>
                <div style={{ color: 'var(--root-cream-dim)', fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <div>
                    🌱 <strong>{isEn ? 'What gets reset: ' : 'สิ่งที่จะรีเซ็ต: '}</strong>
                    {isEn
                      ? `Triggers a Prestige Reset for current garden: roots reset to 0 to begin the challenge, and current nutrients are converted into +${fmt(calcPrestigeSeeds(state))} Eternal Seeds 🌰 immediately.`
                      : `จะทำการหว่านเมล็ดใหม่ (Prestige) รอบปัจจุบัน: รากไม้จะเริ่มใหม่เพื่อเข้าสู่การทดสอบ และสารอาหารทั้งหมดจะถูกแปลงเป็น +${fmt(calcPrestigeSeeds(state))} เมล็ดพันธุ์นิรันดร์ 🌰 เข้ากระเป๋าให้ทันที`}
                  </div>
                  <div>
                    🛡️ <strong>{isEn ? 'What is kept safe: ' : 'สิ่งที่ไม่หาย (ปลอดภัย 100%): '}</strong>
                    {isEn
                      ? 'All permanent Prestige upgrades, Gaia perks, Eternal Seeds in wallet, Gaia Essences (🌍), and Relics remain completely intact!'
                      : 'อัปเกรดร้าน Prestige ทั้งหมด, บัฟไกอา, เมล็ดพันธุ์ในกระเป๋า, ละอองชีวิต (🌍) และโบราณวัตถุ (Relics) ทั้งหมดจะอยู่ครบถ้วน ไม่หาย!'}
                  </div>
                  <div>
                    🎯 <strong>{isEn ? 'Goal & Abandon: ' : 'เป้าหมายและยกเลิก: '}</strong>
                    {isEn
                      ? 'Grow 25 Yggdrasil Roots under trial restrictions to claim permanent rewards. You can abandon the trial anytime without penalty.'
                      : 'ปลูกรากต้นไม้โลกครบ 25 ต้นภายใต้ข้อจำกัดเพื่อปลดล็อกรางวัลถาวร และสามารถกดยกเลิกการทดสอบได้ตลอดเวลาโดยไม่มีบทลงโทษ'}
                  </div>
                </div>
              </div>

              {TRIAL_DEFS.map((def: TrialDef) => (
                <TrialCard
                  key={def.id}
                  def={def}
                  isActive={activeTrial === def.id}
                  isCompleted={isTrialCompleted(state, def.id)}
                  curYgg={state.owned['yggdrasil'] || 0}
                  isEn={isEn}
                  completedBadgeText={tr.trialCompletedBadge}
                  activeBadgeText={tr.trialActiveBadge}
                  abandonBtnText={tr.abandonTrialBtn}
                  startBtnText={tr.startTrialBtn}
                  onAbandonTrial={onAbandonTrial}
                  onSelectTrial={setPendingTrialDef}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Confirm Trial Modal */}
      <ConfirmModal
        isOpen={!!pendingTrialDef}
        title={isEn ? 'Confirm Begin Trial' : 'ยืนยันการเริ่มการทดสอบ'}
        message={
          isEn
            ? `Entering "${pendingTrialDef?.enName}" will trigger a Prestige Reset for your current garden.\n\n✨ Current nutrients will be converted into +${fmt(calcPrestigeSeeds(state))} Eternal Seeds 🌰 immediately!\n🛡️ Your wallet seeds (${fmt(state.eternalSeeds)} 🌰), Gaia Essences (${fmt(state.transcendence?.gaiaEssences || 0)} 🌍), and relics remain 100% safe!\n🌱 Only garden roots and nutrients will reset to start the trial.`
            : `การเข้าสู่การทดสอบ "${pendingTrialDef?.name}" จะทำการรีเซ็ตแบบหว่านเมล็ดใหม่ (Prestige Reset) รอบปัจจุบันทันที\n\n✨ สารอาหารสะสมในรอบนี้จะถูกแปลงเป็น +${fmt(calcPrestigeSeeds(state))} เมล็ดพันธุ์นิรันดร์ 🌰 เข้ากระเป๋าให้ทันที!\n🛡️ เมล็ดพันธุ์เดิมในกระเป๋า (${fmt(state.eternalSeeds)} 🌰), ละอองชีวิต (${fmt(state.transcendence?.gaiaEssences || 0)} 🌍) และโบราณวัตถุจะอยู่ครบ 100% ไม่สูญหาย!\n🌱 มีเพียงรากไม้ในสวนที่จะเริ่มใหม่เพื่อเข้าสู่เงื่อนไขการทดสอบ`
        }
        confirmText={isEn ? 'Begin Trial' : 'เริ่มการทดสอบ'}
        cancelText={isEn ? 'Cancel' : 'ยกเลิก'}
        onConfirm={() => {
          if (pendingTrialDef) {
            onStartTrial(pendingTrialDef.id);
            setPendingTrialDef(null);
          }
        }}
        onCancel={() => setPendingTrialDef(null)}
      />
    </div>
  );
});

TranscendenceModal.displayName = 'TranscendenceModal';
