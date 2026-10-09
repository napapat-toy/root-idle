'use client';

import React from 'react';
import { GameState, Language } from '@/types/game';
import { calcTranscendenceEssences } from '@/constants/transcendence';
import { t } from '@/lib/i18n';
import { fmt, fmtInt } from '@/lib/formatters';
import { GrandResetBanner } from './transcendence/GrandResetBanner';

export interface TranscendenceModalProps {
  state: GameState;
  onClose: () => void;
  onTranscend: () => void;
  onOpenSanctuaryShop?: () => void;
}

export const TranscendenceModal: React.FC<TranscendenceModalProps> = React.memo(({
  state,
  onClose,
  onTranscend,
  onOpenSanctuaryShop,
}) => {
  const lang: Language = state.lang || 'th';
  const isEn = lang === 'en';
  const tr = t(lang);

  const essences = state.transcendence?.gaiaEssences || 0;
  const totalLifetimeEssences = state.transcendence?.totalGaiaEssencesLifetime || 0;
  const pendingEssences = calcTranscendenceEssences(state);

  return (
    <div className="offline-backdrop" onClick={onClose} style={{ zIndex: 2100 }}>
      <div
        className="modal-wrapper transcendence-modal-wrapper"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '480px', width: '100%' }}
      >
        <button className="modal-close-x" onClick={onClose} aria-label={tr.close}>
          &times;
        </button>

        <div
          className="offline-modal generic-modal custom-scrollbar transcendence-modal-content"
          style={{ padding: '20px 22px', textAlign: 'center' }}
        >
          {/* Header */}
          <div className="icon" style={{ fontSize: '38px', marginBottom: '4px' }}>
            🌍
          </div>
          <h2
            style={{
              marginBottom: '4px',
              fontSize: '22px',
              background: 'linear-gradient(135deg, var(--gaia-green), var(--astral-cyan))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {tr.transcendenceTitle}
          </h2>

          <div
            className="away-time"
            style={{
              marginBottom: '14px',
              fontSize: '12px',
              display: 'flex',
              justifyContent: 'center',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{ cursor: 'help' }}
              title={isEn ? '🌍 Gaia Essences: Earned by Transcendence after reaching 100 Yggdrasil roots. Used to unlock Gaia Perks and cosmetics.' : '🌍 ละอองชีวิต: ได้รับจากการกด "ตื่นรู้แห่งไกอา (Transcendence)" เมื่อมีต้นอิกดราซิล 100 ต้นขึ้นไป ใช้ปลดล็อกพรไกอาและซื้อสกิน'}
            >
              {isEn ? `Current Essences: ${fmt(essences)} 🌍` : `ครอบครอง: ${fmt(essences)} 🌍`}
            </span>
            {!!state.transcendence?.auroraBloomUnlocked && (
              <span
                style={{ color: 'var(--cosmic-pink)', fontWeight: 700, cursor: 'help' }}
                title={isEn ? '🌸 Astral Petals: Transmuted from Seeds/Essences at the Altar or dropped as a 5% bonus from any event (after unlocking Aurora Bloom). Used for Astral Resonance & exclusive skins.' : '🌸 เกสรดวงดาว: ได้จากการหลอมเมล็ด/ละอองที่เตาหลอมดวงดาว หรือมีโอกาส 5% ดรอปเป็นโบนัส (+1 เกสร) เมื่อกดเก็บอีเวนต์ใดๆ (หลังปลดล็อกบุปผาแสงเหนือ) ใช้ซื้อพลังเรโซแนนซ์และสกินพิเศษ'}
              >
                {isEn
                  ? `Petals: ${fmtInt(state.transcendence?.astralPetals || 0)} 🌸`
                  : `เกสร: ${fmtInt(state.transcendence?.astralPetals || 0)} 🌸`}
              </span>
            )}
            <span style={{ color: 'var(--root-cream-dim)' }}>
              {isEn ? `Lifetime: ${fmt(totalLifetimeEssences)}` : `สะสมตลอดกาล: ${fmt(totalLifetimeEssences)}`}
            </span>
          </div>

          {/* Grand Reset Card */}
          <div style={{ marginBottom: '14px' }}>
            <GrandResetBanner
              state={state}
              lang={lang}
              pendingEssences={pendingEssences}
              onTranscend={onTranscend}
            />
          </div>

          {/* What Resets vs What Stays Card */}
          <div
            style={{
              background: 'rgba(20, 14, 10, 0.55)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              padding: '10px 14px',
              marginBottom: '16px',
              textAlign: 'left',
              fontSize: '11.5px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div>
              <span style={{ color: '#f87171', fontWeight: 700, marginRight: '4px' }}>
                ⚠️ {tr.whatResetsLabel}
              </span>
              <span style={{ color: 'var(--root-cream-dim)' }}>{tr.whatResetsTranscend}</span>
            </div>
            <div>
              <span style={{ color: '#4ade80', fontWeight: 700, marginRight: '4px' }}>
                🛡️ {tr.whatPersistsLabel}
              </span>
              <span style={{ color: 'var(--root-cream-dim)' }}>{tr.whatPersistsTranscend}</span>
            </div>
          </div>

          {/* Shortcut to Gaia Perks in Sanctuary Shop */}
          {onOpenSanctuaryShop && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSanctuaryShop();
              }}
              style={{
                width: '100%',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(52, 211, 153, 0.4)',
                color: '#34d399',
                borderRadius: '8px',
                padding: '9px 14px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {tr.goToShopGaia}
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

TranscendenceModal.displayName = 'TranscendenceModal';
