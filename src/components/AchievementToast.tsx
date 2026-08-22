'use client';

import React from 'react';
import { AchievementDef } from '@/types/achievements';
import { Language } from '@/types/game';
import { ACHIEVEMENT_TRANSLATIONS } from '@/lib/i18n';

interface AchievementToastProps {
  queue: AchievementDef[];
  lang?: Language;
  onDismiss: (id: string) => void;
}

export const AchievementToast: React.FC<AchievementToastProps> = React.memo(({ queue, lang = 'th', onDismiss }) => {
  if (queue.length === 0) return null;
  const isEn = lang === 'en';

  return (
    <div className="achievement-toast-container">
      {queue.map(item => {
        const localized = ACHIEVEMENT_TRANSLATIONS[item.id]?.[lang] || {
          title: item.title,
          desc: item.desc,
        };

        return (
          <div
            key={item.id}
            className="achievement-toast-item"
            onClick={() => onDismiss(item.id)}
            title={isEn ? 'Click to dismiss' : 'คลิกเพื่อปิด'}
          >
            <div className="achievement-toast-icon">{item.icon}</div>
            <div className="achievement-toast-content">
              <div className="achievement-toast-header">
                🏆 {isEn ? 'Achievement Unlocked! (+1% Global Rate)' : 'ปลดล็อกความสำเร็จ! (+1% เรต)'}
              </div>
              <div className="achievement-toast-title">{localized.title}</div>
              <div className="achievement-toast-desc">{localized.desc}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
});

AchievementToast.displayName = 'AchievementToast';
