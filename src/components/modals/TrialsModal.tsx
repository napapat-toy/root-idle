'use client';

import React, { useState } from 'react';
import { GameState, Language, TrialDef, TrialId } from '@/types/game';
import {
  TRIAL_DEFS,
  isTrialCompleted,
  canTranscend,
  calcTranscendenceEssences,
  calcPrestigeSeeds,
} from '@/constants/gameData';
import { fmt } from '@/lib/formatters';
import { t } from '@/lib/i18n';
import { ConfirmModal } from './ConfirmModal';
import { TrialCard } from './transcendence/TrialCard';
import { ModalButton } from '@/components/common/ModalButton';

interface TrialsModalProps {
  isOpen: boolean;
  state: GameState;
  onClose: () => void;
  onStartTrial: (trialId: TrialId) => void;
  onAbandonTrial: () => void;
  onOpenTranscendence?: () => void;
}

export const TrialsModal: React.FC<TrialsModalProps> = React.memo(({
  isOpen,
  state,
  onClose,
  onStartTrial,
  onAbandonTrial,
  onOpenTranscendence,
}) => {
  const [pendingTrialDef, setPendingTrialDef] = useState<TrialDef | null>(null);

  if (!isOpen) return null;

  const lang: Language = state.lang || 'th';
  const isEn = lang === 'en';
  const tr = t(lang);

  const activeTrial = state.transcendence?.activeTrial || 'none';
  const conqueredTrials = Object.keys(state.transcendence?.completedTrials || {}).length;

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
          <div className="icon" style={{ fontSize: '36px', marginBottom: '4px' }}>⚔️</div>
          <h2 style={{ marginBottom: '4px', background: 'linear-gradient(135deg, var(--trials-gold), #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {tr.trialsTab}
          </h2>
          <div className="away-time" style={{ marginBottom: '14px', fontSize: '13px', display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <span>
              {tr.trialsConquered
                .replace('{count}', String(conqueredTrials))
                .replace('{total}', String(TRIAL_DEFS.length))}
            </span>
            {activeTrial !== 'none' && (
              <span style={{ color: 'var(--trials-gold)', fontWeight: 700 }}>
                {tr.trialInProgress}
              </span>
            )}
          </div>

          <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', paddingRight: '4px', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
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
