'use client';

import React, { useEffect } from 'react';
import { AchievementDef } from '@/types/achievements';
import { Language } from '@/types/game';
import { ACHIEVEMENT_TRANSLATIONS } from '@/lib/i18n';

interface AchievementToastProps {
  queue: AchievementDef[];
  lang?: Language;
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<{
  item: AchievementDef;
  lang: Language;
  onDismiss: (id: string) => void;
}> = ({ item, lang, onDismiss }) => {
  const isEn = lang === 'en';
  const localized = ACHIEVEMENT_TRANSLATIONS[item.id]?.[lang] || {
    title: item.title,
    desc: item.desc,
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(item.id);
    }, 4500); // Auto dismiss after 4.5 seconds
    return () => clearTimeout(timer);
  }, [item.id, onDismiss]);

  return (
    <div
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
};

export const AchievementToast: React.FC<AchievementToastProps> = React.memo(({ queue, lang = 'th', onDismiss }) => {
  if (queue.length === 0) return null;

  return (
    <div className="achievement-toast-container">
      {queue.map(item => (
        <ToastItem key={item.id} item={item} lang={lang} onDismiss={onDismiss} />
      ))}
    </div>
  );
});

AchievementToast.displayName = 'AchievementToast';
