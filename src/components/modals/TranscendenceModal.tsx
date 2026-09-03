'use client';

import React, { useState } from 'react';
import { GameState, Language, TrialDef, TrialId } from '@/types/game';
import {
  calcTranscendenceEssences,
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

  const activeTrial = state.transcendence?.activeTrial || 'none';

  return (
    <div className="offline-backdrop" onClick={onClose} style={{ zIndex: 2100 }}>
      <div
        className="modal-wrapper"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '600px', width: '100%' }}
      >
        <button className="modal-close-x" onClick={onClose} aria-label={tr.close}>
          &times;
        </button>

        <div className="offline-modal generic-modal" style={{ padding: '20px 24px', maxHeight: '88vh', display: 'flex', flexDirection: 'column' }}>
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
                padding: '8px 12px',
                borderRadius: '8px',
                border: activeTab === 'tree' ? '1px solid rgba(52, 211, 153, 0.5)' : '1px solid transparent',
                background: activeTab === 'tree' ? 'linear-gradient(135deg, #10b981, #059669)' : 'transparent',
                color: activeTab === 'tree' ? '#ffffff' : 'var(--root-cream)',
                fontWeight: activeTab === 'tree' ? 700 : 600,
                fontSize: '12.5px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: activeTab === 'tree' ? '0 2px 8px rgba(16, 185, 129, 0.35)' : 'none',
                opacity: activeTab === 'tree' ? 1 : 0.75,
              }}
            >
              🌳 {tr.gaiaTreeTab}
            </button>
            <button
              onClick={() => setActiveTab('trials')}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                border: activeTab === 'trials' ? '1px solid rgba(234, 179, 8, 0.5)' : '1px solid transparent',
                background: activeTab === 'trials' ? 'linear-gradient(135deg, #eab308, #ca8a04)' : 'transparent',
                color: activeTab === 'trials' ? '#1c150b' : 'var(--root-cream)',
                fontWeight: activeTab === 'trials' ? 700 : 600,
                fontSize: '12.5px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: activeTab === 'trials' ? '0 2px 8px rgba(234, 179, 8, 0.35)' : 'none',
                opacity: activeTab === 'trials' ? 1 : 0.75,
              }}
            >
              ⚔️ {tr.trialsTab}
            </button>
          </div>

          {/* Tab 1: Gaia Spirit Tree */}
          {activeTab === 'tree' && (
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                  {tr.transcendenceDesc}
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#34d399', marginBottom: '10px' }}>
                  {isEn ? `+${fmt(pendingEssences)} Gaia Essences on Grand Reset` : `+${fmt(pendingEssences)} ละอองชีวิตดึกดำบรรพ์ (เมื่อรีเซ็ตใหญ่)`}
                </div>

                {!showConfirmTranscend ? (
                  <button
                    onClick={() => setShowConfirmTranscend(true)}
                    disabled={pendingEssences <= 0}
                    style={{
                      background: pendingEssences > 0 ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255,255,255,0.06)',
                      color: pendingEssences > 0 ? '#ffffff' : 'rgba(255,255,255,0.3)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '10px 20px',
                      fontWeight: 700,
                      fontSize: '14px',
                      cursor: pendingEssences > 0 ? 'pointer' : 'not-allowed',
                      boxShadow: pendingEssences > 0 ? '0 4px 14px rgba(16, 185, 129, 0.35)' : 'none',
                      transition: 'all 0.2s',
                    }}
                  >
                    {tr.confirmTranscendBtn}
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
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
                )}
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
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                      <span style={{ fontSize: '18px' }}>🌱</span>
                      <span style={{ fontWeight: 700, fontSize: '14px' }}>{tr.transcendPerk1Name}</span>
                      <span style={{ fontSize: '11px', color: '#34d399', background: 'rgba(52, 211, 153, 0.15)', padding: '1px 6px', borderRadius: '4px' }}>
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
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                      <span style={{ fontSize: '18px' }}>📜</span>
                      <span style={{ fontWeight: 700, fontSize: '14px' }}>{tr.transcendPerk2Name}</span>
                      <span style={{ fontSize: '11px', color: '#34d399', background: 'rgba(52, 211, 153, 0.15)', padding: '1px 6px', borderRadius: '4px' }}>
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
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                      <span style={{ fontSize: '18px' }}>⚙️</span>
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
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                      <span style={{ fontSize: '18px' }}>✨</span>
                      <span style={{ fontWeight: 700, fontSize: '14px' }}>{tr.transcendPerk4Name}</span>
                      <span style={{ fontSize: '11px', color: '#34d399', background: 'rgba(52, 211, 153, 0.15)', padding: '1px 6px', borderRadius: '4px' }}>
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
                    }}
                  >
                    {touchMaxed ? tr.maxTag : `${fmtInt(touchCost)} 🌍`}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Subterranean Trials */}
          {activeTab === 'trials' && (
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                  <span style={{ fontSize: '15px' }}>⚔️</span>
                  <span style={{ fontSize: '12.5px' }}>
                    {isEn ? 'Subterranean Trial Rules & Reset Information' : 'กติกาการทดลองแห่งผืนพิภพและการรีเซ็ต'}
                  </span>
                </div>
                <div style={{ color: 'var(--root-cream-dim)', fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <div>
                    🌱 <strong>{isEn ? 'What gets reset: ' : 'สิ่งที่จะรีเซ็ต: '}</strong>
                    {isEn
                      ? 'Triggers a standard Prestige Reset for the current garden. Current roots and nutrients reset to 0, and you collect all pending Eternal Seeds for this run.'
                      : 'จะทำการหว่านเมล็ดใหม่ (Prestige) รอบปัจจุบัน โดยรากและสารอาหารจะถูกรีเซ็ตเพื่อเริ่มปลูกใหม่ และคุณจะได้รับเมล็ดพันธุ์ที่สะสมไว้ทั้งหมดของรอบนี้'}
                  </div>
                  <div>
                    🛡️ <strong>{isEn ? 'What is kept safe: ' : 'สิ่งที่ไม่หาย (ปลอดภัย 100%): '}</strong>
                    {isEn
                      ? 'All permanent Prestige upgrades, Gaia perks, Eternal Seeds in wallet, and Relics remain completely intact!'
                      : 'อัปเกรดร้าน Prestige ทั้งหมด, บัฟไกอา, เมล็ดพันธุ์ในกระเป๋า และโบราณวัตถุ (Relics) ทั้งหมดจะยังอยู่ครบถ้วน ไม่หาย!'}
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '24px' }}>{def.icon}</span>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '15px' }}>{isEn ? def.enName : def.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--root-cream-dim)' }}>{isEn ? def.enDesc : def.desc}</div>
                        </div>
                      </div>
                      {isCompleted && (
                        <span style={{ fontSize: '12px', color: '#34d399', fontWeight: 700, background: 'rgba(52, 211, 153, 0.15)', padding: '2px 8px', borderRadius: '6px' }}>
                          {tr.trialCompletedBadge}
                        </span>
                      )}
                      {isActive && !isCompleted && (
                        <span style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 700, background: 'rgba(245, 158, 11, 0.15)', padding: '2px 8px', borderRadius: '6px' }}>
                          {tr.trialActiveBadge}
                        </span>
                      )}
                    </div>

                    {/* Restriction & Reward */}
                    <div style={{ fontSize: '12px', background: 'rgba(0,0,0,0.2)', padding: '8px 10px', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <div style={{ color: '#f87171' }}>
                        <strong>⚠️ {isEn ? 'Restriction: ' : 'ข้อจำกัด: '}</strong>
                        {isEn ? def.enRestrictionDesc : def.restrictionDesc}
                      </div>
                      <div style={{ color: '#34d399' }}>
                        <strong>🏆 {isEn ? 'Reward: ' : 'รางวัล: '}</strong>
                        {isEn ? def.enRewardDesc : def.rewardDesc}
                      </div>
                      <div style={{ color: '#38bdf8', marginTop: '2px' }}>
                        <strong>🎯 {isEn ? 'Goal: ' : 'เป้าหมาย: '}</strong>
                        {isEn ? `Grow 25 Yggdrasil Roots (Current: ${curYgg} / 25)` : `ปลูกรากต้นไม้โลกครบ 25 ต้น (ปัจจุบัน: ${curYgg} / 25)`}
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
                          }}
                        >
                          {tr.abandonTrialBtn}
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
            ? `Entering "${pendingTrialDef?.enName}" will trigger a Prestige Reset for your current garden. You will collect all pending Eternal Seeds, but roots and nutrients will be reset so you can begin the challenge.\n\nAll permanent upgrades, seed perks, relics, and essences remain 100% safe!`
            : `การเข้าสู่การทดสอบ "${pendingTrialDef?.name}" จะทำการหว่านเมล็ดใหม่ (Prestige Reset) รอบปัจจุบันทันที โดยคุณจะได้รับเมล็ดพันธุ์ที่สะสมไว้ทั้งหมด แต่รากและสารอาหารจะถูกรีเซ็ตเพื่อเริ่มความท้าทายใหม่\n\n(อัปเกรดถาวรทั้งหมด, เมล็ดพันธุ์ในกระเป๋า, โบราณวัตถุ และละอองชีวิตจะยังอยู่ครบ 100% ไม่หาย)`
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
