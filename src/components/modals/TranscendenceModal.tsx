'use client';

import React, { useState } from 'react';
import { GameState, Language, TrialDef, TrialId } from '@/types/game';
import {
  calcTranscendenceEssences,
  calcPrestigeSeeds,
  canTranscend,
  TRANSCENDENCE_REQUIRE_YGGDRASIL,
  primordialVigorCost,
  primordialVigorMult,
  soilMemoryCost,
  soilMemoryRetainPct,
  gaiaTouchCost,
  gaiaTouchBonusMult,
  AUTO_MANAGER_COST,
  PRIMORDIAL_VIGOR_MAX_LEVEL,
  SOIL_MEMORY_MAX_LEVEL,
  GAIA_TOUCH_MAX_LEVEL,
  ECHO_RESONANCE_MAX_LEVEL,
  echoResonanceCost,
  GAIA_CLAIRVOYANCE_MAX_LEVEL,
  gaiaClairvoyanceCost,
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

interface TranscendenceModalProps {
  state: GameState;
  onClose: () => void;
  onTranscend: () => void;
  onBuyPrimordialVigor: () => void;
  onBuySoilMemory: () => void;
  onBuyAutoManager: () => void;
  onBuyGaiaTouch: () => void;
  onBuyEchoResonance: () => void;
  onBuyGaiaClairvoyance: () => void;
  onBuyPrimordialSeedling: () => void;
  onBuyDeepMeditation: () => void;
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
  onBuyGaiaTouch,
  onBuyEchoResonance,
  onBuyGaiaClairvoyance,
  onBuyPrimordialSeedling,
  onBuyDeepMeditation,
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

  const autoManagerOwned = !!state.transcendence?.autoManagerUnlocked;

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
          <div className="away-time" style={{ marginBottom: '12px', fontSize: '13px' }}>
            {isEn ? `Current Essences: ${fmt(essences)} 🌍 · Total Lifetime: ${fmt(totalLifetimeEssences)}` : `ครอบครอง: ${fmt(essences)} 🌍 · สะสมตลอดกาล: ${fmt(totalLifetimeEssences)}`}
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
                <div
                  style={{
                    background: 'var(--bg-panel-2)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '2px' }}>
                      <span style={{ fontSize: '18px', flexShrink: 0 }}>🌱</span>
                      <span style={{ fontWeight: 700, fontSize: '14px' }}>{tr.transcendPerk1Name}</span>
                      <span style={{ fontSize: '11px', color: '#34d399', background: 'rgba(52, 211, 153, 0.15)', padding: '1px 6px', borderRadius: '4px', flexShrink: 0 }}>
                        Lv. {vigorLvl}/{PRIMORDIAL_VIGOR_MAX_LEVEL}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--root-cream-dim)' }}>{tr.transcendPerk1Desc}</div>
                    <div style={{ fontSize: '11px', color: '#38bdf8', marginTop: '2px' }}>
                      {isEn ? `Current Effect: +${(vigorLvl * 25).toFixed(0)}% Base Rate` : `ผลปัจจุบัน: เรทพื้นฐาน +${(vigorLvl * 25).toFixed(0)}%`}
                    </div>
                  </div>
                  <button
                    onClick={onBuyPrimordialVigor}
                    disabled={vigorMaxed || essences < vigorCost}
                    style={{
                      background: vigorMaxed ? 'rgba(255,255,255,0.06)' : essences >= vigorCost ? '#34d399' : 'rgba(52, 211, 153, 0.2)',
                      color: vigorMaxed ? 'rgba(255,255,255,0.3)' : essences >= vigorCost ? '#064e3b' : 'rgba(255,255,255,0.4)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontWeight: 700,
                      fontSize: '12px',
                      cursor: !vigorMaxed && essences >= vigorCost ? 'pointer' : 'not-allowed',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    {vigorMaxed ? tr.maxTag : `${fmtInt(vigorCost)} 🌍`}
                  </button>
                </div>

                {/* Perk 2: Soil Memory */}
                <div
                  style={{
                    background: 'var(--bg-panel-2)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '2px' }}>
                      <span style={{ fontSize: '18px', flexShrink: 0 }}>📜</span>
                      <span style={{ fontWeight: 700, fontSize: '14px' }}>{tr.transcendPerk2Name}</span>
                      <span style={{ fontSize: '11px', color: '#34d399', background: 'rgba(52, 211, 153, 0.15)', padding: '1px 6px', borderRadius: '4px', flexShrink: 0 }}>
                        Lv. {soilLvl}/{SOIL_MEMORY_MAX_LEVEL}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--root-cream-dim)' }}>{tr.transcendPerk2Desc}</div>
                    <div style={{ fontSize: '11px', color: '#38bdf8', marginTop: '2px' }}>
                      {isEn ? `Current Effect: Retain ${(soilMemoryRetainPct(state) * 100).toFixed(0)}% Echoes` : `ผลปัจจุบัน: คงสะท้อนราก ${(soilMemoryRetainPct(state) * 100).toFixed(0)}%`}
                    </div>
                  </div>
                  <button
                    onClick={onBuySoilMemory}
                    disabled={soilMaxed || essences < soilCost}
                    style={{
                      background: soilMaxed ? 'rgba(255,255,255,0.06)' : essences >= soilCost ? '#34d399' : 'rgba(52, 211, 153, 0.2)',
                      color: soilMaxed ? 'rgba(255,255,255,0.3)' : essences >= soilCost ? '#064e3b' : 'rgba(255,255,255,0.4)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontWeight: 700,
                      fontSize: '12px',
                      cursor: !soilMaxed && essences >= soilCost ? 'pointer' : 'not-allowed',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    {soilMaxed ? tr.maxTag : `${fmtInt(soilCost)} 🌍`}
                  </button>
                </div>

                {/* Perk 3: Auto Manager */}
                <div
                  style={{
                    background: 'var(--bg-panel-2)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '2px' }}>
                      <span style={{ fontSize: '18px', flexShrink: 0 }}>⚙️</span>
                      <span style={{ fontWeight: 700, fontSize: '14px' }}>{tr.transcendPerk3Name}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--root-cream-dim)' }}>{tr.transcendPerk3Desc}</div>
                  </div>
                  <button
                    onClick={onBuyAutoManager}
                    disabled={autoManagerOwned || essences < AUTO_MANAGER_COST}
                    style={{
                      background: autoManagerOwned ? 'rgba(255,255,255,0.06)' : essences >= AUTO_MANAGER_COST ? '#34d399' : 'rgba(52, 211, 153, 0.2)',
                      color: autoManagerOwned ? 'rgba(255,255,255,0.3)' : essences >= AUTO_MANAGER_COST ? '#064e3b' : 'rgba(255,255,255,0.4)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontWeight: 700,
                      fontSize: '12px',
                      cursor: !autoManagerOwned && essences >= AUTO_MANAGER_COST ? 'pointer' : 'not-allowed',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    {autoManagerOwned ? tr.ownedTag : `${fmtInt(AUTO_MANAGER_COST)} 🌍`}
                  </button>
                </div>

                {/* Perk 4: Gaia's Touch */}
                <div
                  style={{
                    background: 'var(--bg-panel-2)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '2px' }}>
                      <span style={{ fontSize: '18px', flexShrink: 0 }}>✨</span>
                      <span style={{ fontWeight: 700, fontSize: '14px' }}>{tr.transcendPerk4Name}</span>
                      <span style={{ fontSize: '11px', color: '#34d399', background: 'rgba(52, 211, 153, 0.15)', padding: '1px 6px', borderRadius: '4px', flexShrink: 0 }}>
                        Lv. {touchLvl}/{GAIA_TOUCH_MAX_LEVEL}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--root-cream-dim)' }}>{tr.transcendPerk4Desc}</div>
                    <div style={{ fontSize: '11px', color: '#38bdf8', marginTop: '2px' }}>
                      {isEn ? `Current Effect: ×${gaiaTouchBonusMult(state).toFixed(2)} Lucky Magnitude` : `ผลปัจจุบัน: แจ็กพอตโชคดี ×${gaiaTouchBonusMult(state).toFixed(2)} เท่า`}
                    </div>
                  </div>
                  <button
                    onClick={onBuyGaiaTouch}
                    disabled={touchMaxed || essences < touchCost}
                    style={{
                      background: touchMaxed ? 'rgba(255,255,255,0.06)' : essences >= touchCost ? '#34d399' : 'rgba(52, 211, 153, 0.2)',
                      color: touchMaxed ? 'rgba(255,255,255,0.3)' : essences >= touchCost ? '#064e3b' : 'rgba(255,255,255,0.4)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontWeight: 700,
                      fontSize: '12px',
                      cursor: !touchMaxed && essences >= touchCost ? 'pointer' : 'not-allowed',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    {touchMaxed ? tr.maxTag : `${fmtInt(touchCost)} 🌍`}
                  </button>
                </div>

                {/* Perk 5: Echo Resonance */}
                <div
                  style={{
                    background: 'var(--bg-panel-2)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '2px' }}>
                      <span style={{ fontSize: '18px', flexShrink: 0 }}>🔮</span>
                      <span style={{ fontWeight: 700, fontSize: '14px' }}>{tr.transcendPerk5Name}</span>
                      <span style={{ fontSize: '11px', color: '#34d399', background: 'rgba(52, 211, 153, 0.15)', padding: '1px 6px', borderRadius: '4px', flexShrink: 0 }}>
                        Lv. {echoResLvl}/{ECHO_RESONANCE_MAX_LEVEL}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--root-cream-dim)' }}>{tr.transcendPerk5Desc}</div>
                    <div style={{ fontSize: '11px', color: '#38bdf8', marginTop: '2px' }}>
                      {isEn ? `Current Effect: Max Echo Cap Lv.${5 + echoResLvl}` : `ผลปัจจุบัน: เพดานสะท้อนรากสูงสุด Lv.${5 + echoResLvl}`}
                    </div>
                  </div>
                  <button
                    onClick={onBuyEchoResonance}
                    disabled={echoResMaxed || essences < echoResCost}
                    style={{
                      background: echoResMaxed ? 'rgba(255,255,255,0.06)' : essences >= echoResCost ? '#34d399' : 'rgba(52, 211, 153, 0.2)',
                      color: echoResMaxed ? 'rgba(255,255,255,0.3)' : essences >= echoResCost ? '#064e3b' : 'rgba(255,255,255,0.4)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontWeight: 700,
                      fontSize: '12px',
                      cursor: !echoResMaxed && essences >= echoResCost ? 'pointer' : 'not-allowed',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    {echoResMaxed ? tr.maxTag : `${fmtInt(echoResCost)} 🌍`}
                  </button>
                </div>

                {/* Perk 6: Gaia's Clairvoyance */}
                <div
                  style={{
                    background: 'var(--bg-panel-2)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '2px' }}>
                      <span style={{ fontSize: '18px', flexShrink: 0 }}>👁️</span>
                      <span style={{ fontWeight: 700, fontSize: '14px' }}>{tr.transcendPerk6Name}</span>
                      <span style={{ fontSize: '11px', color: '#34d399', background: 'rgba(52, 211, 153, 0.15)', padding: '1px 6px', borderRadius: '4px', flexShrink: 0 }}>
                        Lv. {clairvoyanceLvl}/{GAIA_CLAIRVOYANCE_MAX_LEVEL}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--root-cream-dim)' }}>{tr.transcendPerk6Desc}</div>
                    <div style={{ fontSize: '11px', color: '#38bdf8', marginTop: '2px' }}>
                      {isEn ? `Current Effect: +${(clairvoyanceLvl * 0.1).toFixed(1)}% Lucky Chance (Cap: ${(luckyChancePct(state) * 100).toFixed(1)}%)` : `ผลปัจจุบัน: +${(clairvoyanceLvl * 0.1).toFixed(1)}% โอกาสโชคดี (เพดานรวม: ${(luckyChancePct(state) * 100).toFixed(1)}%)`}
                    </div>
                  </div>
                  <button
                    onClick={onBuyGaiaClairvoyance}
                    disabled={clairvoyanceMaxed || essences < clairvoyanceCost}
                    style={{
                      background: clairvoyanceMaxed ? 'rgba(255,255,255,0.06)' : essences >= clairvoyanceCost ? '#34d399' : 'rgba(52, 211, 153, 0.2)',
                      color: clairvoyanceMaxed ? 'rgba(255,255,255,0.3)' : essences >= clairvoyanceCost ? '#064e3b' : 'rgba(255,255,255,0.4)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontWeight: 700,
                      fontSize: '12px',
                      cursor: !clairvoyanceMaxed && essences >= clairvoyanceCost ? 'pointer' : 'not-allowed',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    {clairvoyanceMaxed ? tr.maxTag : `${fmtInt(clairvoyanceCost)} 🌍`}
                  </button>
                </div>

                {/* Perk 7: Primordial Seedling */}
                <div
                  style={{
                    background: 'var(--bg-panel-2)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '2px' }}>
                      <span style={{ fontSize: '18px', flexShrink: 0 }}>🌱</span>
                      <span style={{ fontWeight: 700, fontSize: '14px' }}>{tr.transcendPerk7Name}</span>
                      <span style={{ fontSize: '11px', color: '#34d399', background: 'rgba(52, 211, 153, 0.15)', padding: '1px 6px', borderRadius: '4px', flexShrink: 0 }}>
                        Lv. {seedlingLvl}/{PRIMORDIAL_SEEDLING_MAX_LEVEL}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--root-cream-dim)' }}>{tr.transcendPerk7Desc}</div>
                    <div style={{ fontSize: '11px', color: '#38bdf8', marginTop: '2px' }}>
                      {isEn ? `Current Effect: Fine Root Base Rate +${fineRootBaseRate(state).toFixed(2)}/s` : `ผลปัจจุบัน: เรทตั้งต้นรากฝอย +${fineRootBaseRate(state).toFixed(2)}/วิ`}
                    </div>
                  </div>
                  <button
                    onClick={onBuyPrimordialSeedling}
                    disabled={seedlingMaxed || essences < seedlingCost}
                    style={{
                      background: seedlingMaxed ? 'rgba(255,255,255,0.06)' : essences >= seedlingCost ? '#34d399' : 'rgba(52, 211, 153, 0.2)',
                      color: seedlingMaxed ? 'rgba(255,255,255,0.3)' : essences >= seedlingCost ? '#064e3b' : 'rgba(255,255,255,0.4)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontWeight: 700,
                      fontSize: '12px',
                      cursor: !seedlingMaxed && essences >= seedlingCost ? 'pointer' : 'not-allowed',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    {seedlingMaxed ? tr.maxTag : `${fmtInt(seedlingCost)} 🌍`}
                  </button>
                </div>

                {/* Perk 8: Deep Meditation */}
                <div
                  style={{
                    background: 'var(--bg-panel-2)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '2px' }}>
                      <span style={{ fontSize: '18px', flexShrink: 0 }}>🧘</span>
                      <span style={{ fontWeight: 700, fontSize: '14px' }}>{tr.transcendPerk8Name}</span>
                      <span style={{ fontSize: '11px', color: '#34d399', background: 'rgba(52, 211, 153, 0.15)', padding: '1px 6px', borderRadius: '4px', flexShrink: 0 }}>
                        Lv. {meditationLvl}/{DEEP_MEDITATION_MAX_LEVEL}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--root-cream-dim)' }}>{tr.transcendPerk8Desc}</div>
                    <div style={{ fontSize: '11px', color: '#38bdf8', marginTop: '2px' }}>
                      {isEn
                        ? `Current Effect: +${((deepMeditationMultiplier(state) - 1) * 100).toFixed(1)}% Rate (Max: +${(meditationLvl * 50).toFixed(0)}%)`
                        : `ผลปัจจุบัน: +${((deepMeditationMultiplier(state) - 1) * 100).toFixed(1)}% เรทผลิต (สูงสุด: +${(meditationLvl * 50).toFixed(0)}%)`}
                    </div>
                  </div>
                  <button
                    onClick={onBuyDeepMeditation}
                    disabled={meditationMaxed || essences < meditationCost}
                    style={{
                      background: meditationMaxed ? 'rgba(255,255,255,0.06)' : essences >= meditationCost ? '#34d399' : 'rgba(52, 211, 153, 0.2)',
                      color: meditationMaxed ? 'rgba(255,255,255,0.3)' : essences >= meditationCost ? '#064e3b' : 'rgba(255,255,255,0.4)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontWeight: 700,
                      fontSize: '12px',
                      cursor: !meditationMaxed && essences >= meditationCost ? 'pointer' : 'not-allowed',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    {meditationMaxed ? tr.maxTag : `${fmtInt(meditationCost)} 🌍`}
                  </button>
                </div>
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

              {TRIAL_DEFS.map((def: TrialDef) => {
                const isCompleted = isTrialCompleted(state, def.id);
                const isActive = activeTrial === def.id;
                const curYgg = state.owned['yggdrasil'] || 0;

                return (
                  <div
                    key={def.id}
                    style={{
                      background: isActive ? 'linear-gradient(135deg, rgba(234, 179, 8, 0.12), rgba(249, 115, 22, 0.08))' : 'var(--bg-panel-2)',
                      border: isActive ? '1px solid rgba(234, 179, 8, 0.4)' : isCompleted ? '1px solid rgba(52, 211, 153, 0.3)' : '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '12px',
                      padding: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                        <span style={{ fontSize: '24px', flexShrink: 0 }}>{def.icon}</span>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: '15px' }}>{isEn ? def.enName : def.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--root-cream-dim)' }}>{isEn ? def.enDesc : def.desc}</div>
                        </div>
                      </div>
                      {isCompleted && (
                        <span style={{ fontSize: '12px', color: '#34d399', fontWeight: 700, background: 'rgba(52, 211, 153, 0.15)', padding: '2px 8px', borderRadius: '6px', flexShrink: 0 }}>
                          {tr.trialCompletedBadge}
                        </span>
                      )}
                      {isActive && !isCompleted && (
                        <span style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 700, background: 'rgba(245, 158, 11, 0.15)', padding: '2px 8px', borderRadius: '6px', flexShrink: 0 }}>
                          {tr.trialActiveBadge}
                        </span>
                      )}
                    </div>

                    {/* Restriction & Reward */}
                    <div style={{ fontSize: '12px', background: 'rgba(0,0,0,0.2)', padding: '8px 10px', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ color: isCompleted ? 'var(--root-cream-dim)' : '#f87171' }}>
                        <strong>⚠️ {isEn ? 'Restriction: ' : 'ข้อจำกัด: '}</strong>
                        {isEn ? def.enRestrictionDesc : def.restrictionDesc}
                        {isCompleted && (
                          <span style={{ color: '#34d399', marginLeft: '6px', fontSize: '11px', fontWeight: 600 }}>
                            ({isEn ? 'Inactive · Trial Cleared' : 'สิ้นสุดแล้ว · ไม่ส่งผล'})
                          </span>
                        )}
                      </div>
                      <div style={{ color: '#34d399' }}>
                        <strong>🏆 {isEn ? 'Reward: ' : 'รางวัล: '}</strong>
                        {isEn ? def.enRewardDesc : def.rewardDesc}
                        {isCompleted && (
                          <span style={{ color: '#ffd76a', fontWeight: 700, marginLeft: '6px', fontSize: '11px' }}>
                            ({isEn ? 'Active & Permanent' : 'ทำงานถาวรแล้ว ✨'})
                          </span>
                        )}
                      </div>
                      <div style={{ color: isCompleted ? '#34d399' : '#38bdf8', marginTop: '2px' }}>
                        <strong>🎯 {isEn ? 'Status: ' : 'สถานะ: '}</strong>
                        {isCompleted
                          ? (isEn ? '✅ Conquered (One-time reward permanently unlocked)' : '✅ พิชิตสำเร็จแล้ว (ปลดล็อกรางวัลถาวรเรียบร้อยแล้ว)')
                          : (isEn ? `Goal: Grow 25 Yggdrasil Roots (Current: ${curYgg} / 25)` : `เป้าหมาย: ปลูกรากต้นไม้โลกครบ 25 ต้น (ปัจจุบัน: ${curYgg} / 25)`)}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                      {isActive ? (
                        <button
                          onClick={onAbandonTrial}
                          style={{
                            background: '#ef4444',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '6px 14px',
                            fontWeight: 700,
                            fontSize: '12px',
                            cursor: 'pointer',
                            flexShrink: 0,
                          }}
                        >
                          {tr.abandonTrialBtn}
                        </button>
                      ) : isCompleted ? (
                        <button
                          onClick={() => setPendingTrialDef(def)}
                          title={isEn
                            ? 'You have already unlocked this permanent reward. Starting again is for optional challenge only.'
                            : 'คุณได้รับรางวัลถาวรเรียบร้อยแล้ว การเริ่มทดสอบซ้ำเป็นการท้าทายตนเองเท่านั้น (ไม่ได้รับรางวัลซ้ำ)'}
                          style={{
                            background: 'rgba(52, 211, 153, 0.12)',
                            color: '#34d399',
                            border: '1px solid rgba(52, 211, 153, 0.35)',
                            borderRadius: '8px',
                            padding: '6px 14px',
                            fontWeight: 700,
                            fontSize: '12px',
                            cursor: 'pointer',
                            flexShrink: 0,
                          }}
                        >
                          ✓ {isEn ? 'Conquered (Replay Challenge)' : 'พิชิตแล้ว (ท้าทายซ้ำ)'}
                        </button>
                      ) : (
                        <button
                          onClick={() => setPendingTrialDef(def)}
                          style={{
                            background: 'linear-gradient(135deg, #eab308, #ca8a04)',
                            color: '#1c150b',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '6px 14px',
                            fontWeight: 700,
                            fontSize: '12px',
                            cursor: 'pointer',
                            flexShrink: 0,
                          }}
                        >
                          {tr.startTrialBtn}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
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
