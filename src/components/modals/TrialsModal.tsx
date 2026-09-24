'use client';

import React, { useState } from 'react';
import { GameState, Language, PactDef, TrialDef, TrialId } from '@/types/game';
import {
  TRIAL_DEFS,
  PACT_DEFS,
  isTrialCompleted,
  canTranscend,
  calcTranscendenceEssences,
  calcPrestigeSeeds,
  isInTrial,
} from '@/constants/gameData';
import { fmt } from '@/lib/formatters';
import { t } from '@/lib/i18n';
import { ConfirmModal } from './ConfirmModal';
import { TrialCard } from './transcendence/TrialCard';
import { PactCard } from './transcendence/PactCard';
import { ModalButton } from '@/components/common/ModalButton';

interface TrialsModalProps {
  isOpen: boolean;
  state: GameState;
  onClose: () => void;
  onStartTrial: (trialId: TrialId) => void;
  onAbandonTrial: () => void;
  onOpenTranscendence?: () => void;
  onTogglePact?: (pactId: string) => void;
}

export const TrialsModal: React.FC<TrialsModalProps> = React.memo(({
  isOpen,
  state,
  onClose,
  onStartTrial,
  onAbandonTrial,
  onOpenTranscendence,
  onTogglePact,
}) => {
  const [activeTab, setActiveTab] = useState<'trials' | 'pacts'>('trials');
  const [pendingTrialDef, setPendingTrialDef] = useState<TrialDef | null>(null);

  if (!isOpen) return null;

  const lang: Language = state.lang || 'th';
  const isEn = lang === 'en';
  const tr = t(lang);

  const inTrial = isInTrial(state);
  const activeTrial = state.transcendence?.activeTrial || 'none';
  const conqueredTrials = Object.keys(state.transcendence?.completedTrials || {}).length;

  const activePactsCount = PACT_DEFS.filter(p => !!state.pacts?.[p.id]).length;
  const totalPactSeedBonus = PACT_DEFS.reduce(
    (sum, p) => sum + (state.pacts?.[p.id] ? p.seedsBonusPct : 0),
    0
  );
  const totalPactEssenceBonus = PACT_DEFS.reduce(
    (sum, p) => sum + (state.pacts?.[p.id] ? (p.essencesBonusPct || 0) : 0),
    0
  );

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
          <div className="icon" style={{ fontSize: '36px', marginBottom: '4px' }}>
            {activeTab === 'trials' ? '⚔️' : '📜'}
          </div>
          <h2 style={{ marginBottom: '6px', background: 'linear-gradient(135deg, var(--trials-gold), #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {activeTab === 'trials' ? tr.trialsTab : (isEn ? 'Pacts of Gaia' : 'พันธสัญญาแห่งไกอา')}
          </h2>

          {/* Sub Navigation Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', justifyContent: 'center' }}>
            <button
              onClick={() => setActiveTab('trials')}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: activeTab === 'trials' ? '1px solid var(--trials-gold)' : '1px solid var(--card-border)',
                background: activeTab === 'trials' ? 'var(--trials-gold-bg)' : 'rgba(255,255,255,0.05)',
                color: activeTab === 'trials' ? 'var(--trials-gold)' : 'var(--root-cream-dim)',
                fontWeight: 700,
                fontSize: '12.5px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              ⚔️ {isEn ? 'Trials' : 'บททดสอบ'}
              <span style={{ fontSize: '11px', marginLeft: '6px', opacity: 0.8 }}>
                ({conqueredTrials}/{TRIAL_DEFS.length})
              </span>
            </button>
            <button
              onClick={() => setActiveTab('pacts')}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: activeTab === 'pacts' ? '1px solid var(--trials-gold)' : '1px solid var(--card-border)',
                background: activeTab === 'pacts' ? 'var(--trials-gold-bg)' : 'rgba(255,255,255,0.05)',
                color: activeTab === 'pacts' ? 'var(--trials-gold)' : 'var(--root-cream-dim)',
                fontWeight: 700,
                fontSize: '12.5px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              📜 {isEn ? 'Pacts' : 'พันธสัญญา'}
              {activePactsCount > 0 && (
                <span style={{ background: 'var(--trials-gold)', color: '#000', fontSize: '10px', padding: '1px 6px', borderRadius: '10px', fontWeight: 800 }}>
                  {activePactsCount}
                </span>
              )}
            </button>
          </div>

          <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', paddingRight: '4px', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
            {activeTab === 'trials' ? (
              <>
                {/* Smart Guide Banner if current garden has reached 100 Yggdrasil roots */}
                {canTranscend(state) && (
                  <div
                    style={{
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.1))',
                      border: '1px solid var(--gaia-green-border)',
                      borderRadius: '12px',
                      padding: '10px 14px',
                      fontSize: '12px',
                      color: 'var(--accent-glow)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      lineHeight: '1.45',
                    }}
                  >
                    <span style={{ fontSize: '20px', flexShrink: 0 }}>💡</span>
                    <div style={{ flex: 1 }}>
                      <strong style={{ color: '#ffffff' }}>
                        {tr.trialGuideTitle}
                      </strong>
                      {tr.trialGuideDesc
                        .replace('{count}', String(state.owned['yggdrasil'] || 0))
                        .replace('{amount}', fmt(calcTranscendenceEssences(state)))}
                    </div>
                    {onOpenTranscendence && (
                      <ModalButton
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          onClose();
                          onOpenTranscendence();
                        }}
                      >
                        {tr.goToGaiaBtn}
                      </ModalButton>
                    )}
                  </div>
                )}

                {/* Trial Overview & Reset Notice Banner */}
                <div
                  style={{
                    background: 'var(--trials-gold-bg)',
                    border: '1px solid var(--trials-gold-border)',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    fontSize: '11.5px',
                    color: 'var(--root-cream)',
                    lineHeight: '1.45',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: 'var(--trials-gold)', marginBottom: '4px' }}>
                    <span style={{ fontSize: '15px', flexShrink: 0 }}>⚔️</span>
                    <span style={{ fontSize: '12.5px' }}>
                      {tr.trialRulesTitle}
                    </span>
                  </div>
                  <div style={{ color: 'var(--root-cream-dim)', fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <div>
                      🌱 <strong>{tr.trialResetLabel}</strong>
                      {tr.trialResetDesc.replace('{amount}', fmt(calcPrestigeSeeds(state)))}
                    </div>
                    <div>
                      🛡️ <strong>{tr.trialKeepLabel}</strong>
                      {tr.trialKeepDesc}
                    </div>
                    <div>
                      🎯 <strong>{tr.trialGoalLabel}</strong>
                      {tr.trialGoalDesc}
                    </div>
                  </div>
                </div>

                {/* Trial Cards List */}
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
              </>
            ) : (
              <>
                {/* Pacts Summary Banner */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.12), rgba(168, 85, 247, 0.1))',
                    border: '1px solid var(--trials-gold-border)',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--trials-gold)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>📜</span>
                      <span>{isEn ? 'Pacts of Gaia (Risk & Reward)' : 'พันธสัญญาแห่งไกอา (ท้าทายตนเอง)'}</span>
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--root-cream-dim)' }}>
                      {isEn ? 'Active Pacts: ' : 'พันธสัญญาที่เปิด: '}
                      <strong style={{ color: activePactsCount > 0 ? '#4ade80' : 'var(--root-cream)' }}>
                        {activePactsCount} / {PACT_DEFS.length}
                      </strong>
                    </span>
                  </div>

                  <div style={{ fontSize: '11px', color: 'var(--root-cream-dim)', lineHeight: '1.4' }}>
                    {isEn
                      ? 'Embrace voluntary handicaps in your regular garden to reap boosted Eternal Seeds and Gaia Essences. Modifiers take effect immediately!'
                      : 'เปิดรับข้อจำกัดท้าทายในสวนปกติเพื่อรับเมล็ดพันธุ์และละอองชีวิตเพิ่มขึ้น! สามารถเปิด/ปิดได้ตลอดเวลา และมีผลทันที'}
                  </div>

                  {/* Stat Boosts Badge Row */}
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '4px' }}>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '4px 10px', borderRadius: '6px', fontSize: '11.5px', color: '#ffd76a' }}>
                      🌰 {isEn ? 'Prestige Seeds: ' : 'เมล็ดนิรันดร์: '}
                      <strong>+{totalPactSeedBonus}%</strong>
                    </div>
                    {totalPactEssenceBonus > 0 && (
                      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '4px 10px', borderRadius: '6px', fontSize: '11.5px', color: '#34d399' }}>
                        🌍 {isEn ? 'Transcendence Essences: ' : 'ละอองชีวิต: '}
                        <strong>+{totalPactEssenceBonus}%</strong>
                      </div>
                    )}
                  </div>

                  {inTrial && (
                    <div style={{ color: '#f59e0b', fontSize: '11px', marginTop: '4px', fontWeight: 600 }}>
                      ⚠️ {isEn ? 'Notice: Pacts are temporarily dormant during active Trials.' : 'หมายเหตุ: พันธสัญญาจะถูกระงับชั่วคราวขณะอยู่ในการทดสอบ'}
                    </div>
                  )}
                </div>

                {/* Pact Cards List */}
                {PACT_DEFS.map((def: PactDef) => (
                  <PactCard
                    key={def.id}
                    def={def}
                    isActive={!!state.pacts?.[def.id]}
                    isEn={isEn}
                    disabled={inTrial}
                    onToggle={() => onTogglePact?.(def.id)}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Confirm Trial Modal */}
      <ConfirmModal
        isOpen={!!pendingTrialDef}
        title={tr.confirmBeginTrialTitle}
        message={tr.confirmBeginTrialMsg
          .replace('{name}', pendingTrialDef ? (isEn && pendingTrialDef.enName ? pendingTrialDef.enName : pendingTrialDef.name) : '')
          .replace('{seeds}', fmt(calcPrestigeSeeds(state)))
          .replace('{walletSeeds}', fmt(state.eternalSeeds))
          .replace('{essences}', fmt(state.transcendence?.gaiaEssences || 0))
        }
        confirmText={tr.confirmBeginTrialBtn}
        cancelText={tr.cancel}
        onConfirm={() => {
          if (pendingTrialDef) {
            onStartTrial(pendingTrialDef.id);
            setPendingTrialDef(null);
            onClose();
          }
        }}
        onCancel={() => setPendingTrialDef(null)}
      />
    </div>
  );
});

TrialsModal.displayName = 'TrialsModal';
