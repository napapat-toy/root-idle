'use client';

import React from 'react';
import { AchievementDef } from '@/types/achievements';

interface AchievementToastProps {
  queue: AchievementDef[];
  onDismiss: (id: string) => void;
}

export const AchievementToast: React.FC<AchievementToastProps> = React.memo(({ queue, onDismiss }) => {
  if (queue.length === 0) return null;

  return (
    <div className="achievement-toast-container">
      {queue.map(item => (
        <div
          key={item.id}
          className="achievement-toast-item"
          onClick={() => onDismiss(item.id)}
          title="คลิกเพื่อปิด"
        >
          <div className="achievement-toast-icon">{item.icon}</div>
          <div className="achievement-toast-content">
            <div className="achievement-toast-header">🏆 ปลดล็อกความสำเร็จ! (+1% เรต)</div>
            <div className="achievement-toast-title">{item.title}</div>
            <div className="achievement-toast-desc">{item.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
});

AchievementToast.displayName = 'AchievementToast';
