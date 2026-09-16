'use client';

import React, { useState } from 'react';
import { GameState, Language } from '@/types/game';
import { canTranscend, TRANSCENDENCE_REQUIRE_YGGDRASIL } from '@/constants/gameData';
import { fmt } from '@/lib/formatters';
import { t } from '@/lib/i18n';
import { ModalButton } from '@/components/common/ModalButton';

export interface GrandResetBannerProps {
  state: GameState;
  lang: Language;
  pendingEssences: number;
  onTranscend: () => void;
}

export const GrandResetBanner: React.FC<GrandResetBannerProps> = React.memo(({
  state,
  lang,
  pendingEssences,
  onTranscend,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const tr = t(lang);

  const yggOwned = state.owned['yggdrasil'] || 0;
  const hasReachedYgg = canTranscend(state);

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(6, 182, 212, 0.08))',
        border: '1px solid var(--gaia-green-border)',
        borderRadius: '12px',
        padding: '14px 16px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '13px', color: 'var(--root-cream-dim)', marginBottom: '6px' }}>
        {tr.transcendDescDetailed}
      </div>

      {hasReachedYgg ? (
        <>
          <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--gaia-green)', marginBottom: '2px' }}>
            {tr.transcendGainEssences.replace('{amount}', fmt(pendingEssences))}
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--accent-glow)', marginBottom: '10px' }}>
            {tr.transcendFromYgg.replace('{count}', String(yggOwned))}
          </div>
        </>
      ) : (
        <div
          style={{
            background: 'var(--trials-gold-bg)',
            border: '1px solid var(--trials-gold-border)',
            borderRadius: '8px',
            padding: '8px 12px',
            marginBottom: '10px',
            fontSize: '13px',
            color: 'var(--trials-gold)',
            fontWeight: 700,
          }}
        >
          🔒 {tr.transcendReqBanner
            .replace('{count}', String(yggOwned))
            .replace('{req}', String(TRANSCENDENCE_REQUIRE_YGGDRASIL))}
        </div>
      )}

      {!hasReachedYgg ? (
        <ModalButton variant="locked" size="lg">
          🔒 {tr.transcendReqBtn
            .replace('{count}', String(yggOwned))
            .replace('{req}', '100')}
        </ModalButton>
      ) : !showConfirm ? (
        <ModalButton variant="primary" size="lg" onClick={() => setShowConfirm(true)}>
          ✨ {tr.confirmTranscendBtn}
        </ModalButton>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
          <div style={{ fontSize: '11.5px', color: '#fca5a5', maxWidth: '380px', lineHeight: '1.4' }}>
            ⚠️ {tr.transcendConfirmDesc
              .replace('{count}', String(yggOwned))
              .replace('{amount}', fmt(pendingEssences))}
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <ModalButton
              variant="danger"
              size="md"
              onClick={() => {
                setShowConfirm(false);
                onTranscend();
              }}
            >
              {tr.transcendConfirmBtn}
            </ModalButton>
            <ModalButton
              variant="secondary"
              size="md"
              onClick={() => setShowConfirm(false)}
            >
              {tr.cancel}
            </ModalButton>
          </div>
        </div>
      )}
    </div>
  );
});

GrandResetBanner.displayName = 'GrandResetBanner';
