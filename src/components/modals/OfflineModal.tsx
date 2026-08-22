'use client';

import React from 'react';
import { fmt, formatDuration } from '@/lib/formatters';
import { Language } from '@/types/game';
import { t } from '@/lib/i18n';

interface OfflineModalProps {
  gain: number;
  dt: number;
  lang?: Language;
  onClaim: () => void;
}

export const OfflineModal: React.FC<OfflineModalProps> = ({ gain, dt, lang = 'th', onClaim }) => {
  const tr = t(lang);

  return (
    <div className="offline-backdrop">
      <div className="modal-wrapper offline-modal-wrapper">
        <div className="offline-modal">
          <div className="icon">🌿</div>
          <h2>{tr.welcomeBack}</h2>
          <div className="away-time">{tr.awayFor.replace('{duration}', formatDuration(dt, lang))}</div>
          <div className="gain">{tr.gainedNutrients.replace('{amount}', fmt(gain))}</div>
          <button onClick={onClaim}>{tr.claimGains}</button>
        </div>
      </div>
    </div>
  );
};
