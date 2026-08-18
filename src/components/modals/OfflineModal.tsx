'use client';

import React from 'react';
import { fmt, formatDuration } from '@/lib/formatters';

interface OfflineModalProps {
  gain: number;
  dt: number;
  onClaim: () => void;
}

export const OfflineModal: React.FC<OfflineModalProps> = ({ gain, dt, onClaim }) => {
  return (
    <div className="offline-backdrop">
      <div className="offline-modal">
        <div className="icon">🌿</div>
        <h2>ยินดีต้อนรับกลับ</h2>
        <div className="away-time">คุณหายไป {formatDuration(dt)}</div>
        <div className="gain">+{fmt(gain)} สารอาหาร</div>
        <button onClick={onClaim}>เก็บผลผลิต</button>
      </div>
    </div>
  );
};
