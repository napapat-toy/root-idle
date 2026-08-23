'use client';

import React, { useState, useEffect, useId } from 'react';
import { Language } from '@/types/game';
import { t } from '@/lib/i18n';
import { fmt, fmtInt } from '@/lib/formatters';

interface AutoResetConfigModalProps {
  currentThreshold: number;
  lang: Language;
  onConfirm: (threshold: number) => void;
  onClose: () => void;
}

export const AutoResetConfigModal: React.FC<AutoResetConfigModalProps> = ({
  currentThreshold,
  lang,
  onConfirm,
  onClose,
}) => {
  const tr = t(lang);
  const isEn = lang === 'en';
  const inputId = useId();

  const [inputValue, setInputValue] = useState<string>(
    currentThreshold > 0 ? String(currentThreshold) : '1000'
  );

  const parsedValue = parseInt(inputValue.replace(/,/g, ''), 10);
  const isValid = !isNaN(parsedValue) && parsedValue >= 10;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Enter' && isValid) {
        onConfirm(parsedValue);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onConfirm, isValid, parsedValue]);

  const handleQuickSelect = (val: number) => {
    setInputValue(String(val));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onConfirm(parsedValue);
    }
  };

  return (
    <div className="offline-backdrop" onClick={onClose}>
      <div
        className="modal-wrapper options-modal-wrapper"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="offline-modal auto-reset-config-modal">
          <button
            className="modal-close-x"
            onClick={onClose}
            aria-label={tr.close}
          >
            ✕
          </button>

          <div className="modal-icon-badge" style={{ color: 'var(--prestige-accent)' }}>
            🔁
          </div>

          <h2 className="modal-title">{tr.autoResetModalTitle}</h2>

          <p className="modal-desc" style={{ marginTop: '6px', lineHeight: '1.5' }}>
            {tr.autoResetModalDesc}
          </p>

          {/* Quick presets */}
          <div className="auto-reset-presets">
            {[100, 500, 1000, 5000, 10000, 50000].map((preset) => (
              <button
                key={preset}
                type="button"
                className={`preset-chip ${parsedValue === preset ? 'active' : ''}`}
                onClick={() => handleQuickSelect(preset)}
              >
                {fmtInt(preset)}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="auto-reset-form">
            <div className="auto-reset-input-box">
              <label htmlFor={inputId} className="input-label">
                {isEn ? 'Target Eternal Seeds:' : 'จำนวนเมล็ดเป้าหมาย:'}
              </label>
              <input
                id={inputId}
                type="number"
                min={10}
                step={1}
                autoFocus
                className="auto-reset-input"
                placeholder={tr.autoResetInputPlaceholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>

            {/* Real-time live formatted preview */}
            {isValid ? (
              <div className="auto-reset-preview-box">
                <span className="preview-label">{tr.autoResetLivePreview}</span>
                <span className="preview-value">
                  🌱 <b>{fmtInt(parsedValue)}</b> ({fmt(parsedValue)}) {tr.autoResetLivePreviewUnit}
                </span>
              </div>
            ) : (
              <div className="auto-reset-error-hint">
                {tr.autoResetMinHint}
              </div>
            )}

            <div className="modal-actions" style={{ marginTop: '16px' }}>
              <button
                type="submit"
                disabled={!isValid}
                className={`offline-btn ${!isValid ? 'disabled' : ''}`}
                style={{
                  background: isValid
                    ? 'linear-gradient(135deg, #8a68b8, #b78cf0)'
                    : undefined,
                  color: isValid ? '#1c1526' : undefined,
                  fontWeight: 700,
                }}
              >
                {currentThreshold > 0 ? tr.autoResetSaveBtn : tr.autoResetConfirmBtn}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="secondary"
                style={{
                  background: '#2a1c12',
                  border: '1px solid #3a2a1c',
                  color: '#eadfc7',
                }}
              >
                {tr.cancel}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
