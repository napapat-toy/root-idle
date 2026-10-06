'use client';

import React, { useState } from 'react';
import { GameState, Language } from '@/types/game';
import { calcPrestigeSeeds } from '@/constants/gameData';
import { fmt, fmtInt } from '@/lib/formatters';
import { ConfirmModal } from './ConfirmModal';
import { t } from '@/lib/i18n';

export interface PrestigeModalProps {
  isOpen: boolean;
  state: GameState;
  onClose: () => void;
  onConfirmPrestige: () => void;
  onOpenSanctuaryShop?: () => void;
}

export const PrestigeModal: React.FC<PrestigeModalProps> = ({
  isOpen,
  state,
  onClose,
  onConfirmPrestige,
  onOpenSanctuaryShop,
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

  return (
    <>
      <div className="offline-backdrop" onClick={onClose} style={{ zIndex: 2000 }}>
        <div
          className="modal-wrapper prestige-modal-wrapper"
          onClick={e => e.stopPropagation()}
          style={{ maxWidth: '440px', width: '100%' }}
        >
          <button className="modal-close-x" onClick={onClose} aria-label={tr.close}>
            &times;
          </button>

          <div
            className="offline-modal generic-modal prestige-modal-content"
            style={{ padding: '20px 22px', textAlign: 'center' }}
          >
            {/* Header Icon & Title */}
            <div className="icon" style={{ fontSize: '38px', marginBottom: '4px' }}>
              🌌
            </div>
            <h2
              style={{
                marginBottom: '4px',
                fontSize: '22px',
                background: 'linear-gradient(135deg, #ffd76a, #c084fc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {tr.prestigeTitle}
            </h2>
            <div className="away-time" style={{ fontSize: '12px', marginBottom: '14px', color: 'var(--root-cream-dim)' }}>
              {tr.prestigeDesc}
            </div>

            {/* Run Summary Card */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.14), rgba(245, 158, 11, 0.1))',
                border: '1px solid rgba(192, 132, 252, 0.35)',
                borderRadius: '12px',
                padding: '14px 16px',
                marginBottom: '14px',
              }}
            >
              <div style={{ fontSize: '11.5px', color: 'var(--root-cream-dim)', marginBottom: '4px' }}>
                {isEn ? 'Nutrients Earned This Run' : 'สารอาหารที่ผลิตได้ในรอบนี้'}:
                <strong style={{ color: 'var(--root-cream)', marginLeft: '6px' }}>{fmt(state.runEarned)}</strong>
              </div>

              <div
                style={{
                  fontSize: '20px',
                  fontWeight: 800,
                  color: gained > 0 ? '#ffd76a' : 'var(--root-cream-dim)',
                  margin: '4px 0',
                  textShadow: gained > 0 ? '0 0 12px rgba(255, 215, 106, 0.4)' : undefined,
                }}
              >
                {tr.gainedSeeds.replace('{amount}', fmtInt(gained))} 🌰
              </div>

              <div style={{ fontSize: '11.5px', color: 'var(--root-cream-dim)' }}>
                {tr.currentSeeds.replace('{amount}', fmtInt(seeds))}
                {gained > 0 && (
                  <span style={{ color: '#4ade80', marginLeft: '6px', fontWeight: 600 }}>
                    ➔ {fmtInt(seeds + gained)} 🌰
                  </span>
                )}
              </div>
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
                <span style={{ color: 'var(--root-cream-dim)' }}>{tr.whatResetsPrestige}</span>
              </div>
              <div>
                <span style={{ color: '#4ade80', fontWeight: 700, marginRight: '4px' }}>
                  🛡️ {tr.whatPersistsLabel}
                </span>
                <span style={{ color: 'var(--root-cream-dim)' }}>{tr.whatPersistsPrestige}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
              <button
                type="button"
                className="btn-prestige-confirm"
                onClick={handlePrestigeClick}
                disabled={gained <= 0}
                style={{
                  width: '100%',
                  opacity: gained <= 0 ? 0.6 : 1,
                  cursor: gained <= 0 ? 'not-allowed' : 'pointer',
                  padding: '12px 18px',
                  fontSize: '15px',
                }}
              >
                <span>🌌</span>
                <span>{tr.confirmPrestigeBtn}</span>
                {gained > 0 && <span style={{ marginLeft: '4px' }}>(+{fmtInt(gained)} 🌰)</span>}
              </button>

              {onOpenSanctuaryShop && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenSanctuaryShop();
                  }}
                  style={{
                    background: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.35)',
                    color: '#ffd76a',
                    borderRadius: '8px',
                    padding: '8px 14px',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {tr.goToShopSeeds}
                </button>
              )}
            </div>

            {errorMsg && (
              <div className="import-error" style={{ marginTop: '10px' }}>
                {errorMsg}
              </div>
            )}
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
            : `หว่านใหม่จะรีเซ็ตสารอาหาร และรากไม้ทั้งหมด แลกกับ +${fmtInt(
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
