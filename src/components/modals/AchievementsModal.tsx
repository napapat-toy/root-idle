'use client';

import React, { useState, useMemo } from 'react';
import { GameState, Language } from '@/types/game';
import { ACHIEVEMENT_CATEGORIES, ACHIEVEMENTS } from '@/constants/achievementsData';
import { achievementBonusPct } from '@/constants/gameData';
import { AchievementCategory } from '@/types/achievements';
import { ACHIEVEMENT_TRANSLATIONS, CATEGORY_NAMES, t } from '@/lib/i18n';

interface AchievementsModalProps {
  isOpen: boolean;
  state: GameState;
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = React.memo(({
  isOpen,
  state,
  onClose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all');

  const lang: Language = state.lang || 'th';
  const isEn = lang === 'en';
  const tr = t(lang);

  const unlockedSet = useMemo(() => {
    return new Set(state.achievements || []);
  }, [state.achievements]);

  const totalCount = ACHIEVEMENTS.length;
  const unlockedCount = unlockedSet.size;
  const progressPct = Math.round((unlockedCount / totalCount) * 100);
  const totalBonus = achievementBonusPct(state);

  const filteredAchievements = useMemo(() => {
    if (selectedCategory === 'all') return ACHIEVEMENTS;
    return ACHIEVEMENTS.filter(a => a.category === selectedCategory);
  }, [selectedCategory]);

  if (!isOpen) return null;

  return (
    <div className="offline-backdrop" onClick={onClose}>
      <div className="modal-wrapper achievements-modal-wrapper" onClick={e => e.stopPropagation()}>
        <button className="modal-close-x" onClick={onClose} aria-label={tr.close}>
          &times;
        </button>

        <div className="offline-modal generic-modal achievements-modal-content">
          <div className="icon">🏆</div>
          <h2>{tr.achievementsTitle}</h2>
          <div className="away-time" style={{ marginBottom: '8px' }}>
            {isEn
              ? 'Unlock milestones to earn permanent global production rate bonuses (+1% to +10% per achievement)'
              : 'ปลดล็อกเป้าหมายเพื่อรับโบนัสอัตราผลิตสารอาหารรวมถาวร (+1% ถึง +10% ต่อความสำเร็จ)'}
          </div>

          {/* Progress Overview */}
          <div className="achievement-progress-card">
            <div className="achievement-progress-stats">
              <span>
                {isEn ? 'Progress' : 'ความคืบหน้า'}: <b>{unlockedCount} / {totalCount}</b> ({progressPct}%)
              </span>
              <span className="achievement-bonus-tag">
                {isEn ? `Current Bonus: +${totalBonus}% Global Rate` : `โบนัสปัจจุบัน: +${totalBonus}% เรตถาวร`}
              </span>
            </div>
            <div className="achievement-progress-bar-bg">
              <div
                className="achievement-progress-bar-fill"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="achievement-cat-tabs">
            <button
              className={`achievement-tab-btn ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              {tr.allCategories} ({unlockedCount}/{totalCount})
            </button>
            {ACHIEVEMENT_CATEGORIES.map(cat => {
              const inCat = ACHIEVEMENTS.filter(a => a.category === cat.id);
              const unlockedInCat = inCat.filter(a => unlockedSet.has(a.id)).length;
              const catName = CATEGORY_NAMES[cat.id]?.[lang] || cat.name;
              return (
                <button
                  key={cat.id}
                  className={`achievement-tab-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.icon} {catName} ({unlockedInCat}/{inCat.length})
                </button>
              );
            })}
          </div>

          {/* Achievements List */}
          <div className="achievement-list-scroll">
            {filteredAchievements.map(ach => {
              const isUnlocked = unlockedSet.has(ach.id);
              const localized = ACHIEVEMENT_TRANSLATIONS[ach.id]?.[lang] || {
                title: ach.title,
                desc: ach.desc,
              };

              return (
                <div
                  key={ach.id}
                  className={`achievement-item-card ${isUnlocked ? 'unlocked' : 'locked'}`}
                >
                  <div className="achievement-item-icon">{ach.icon}</div>
                  <div className="achievement-item-info">
                    <div className="achievement-item-header">
                      <span className="achievement-item-title">{localized.title}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="achievement-bonus-pill">+{ach.bonusPct}%</span>
                        <span className={`achievement-item-badge ${isUnlocked ? 'unlocked' : 'locked'}`}>
                          {isUnlocked ? `✓ ${tr.achUnlocked}` : `🔒 ${tr.achLocked}`}
                        </span>
                      </div>
                    </div>
                    <div className="achievement-item-desc">{localized.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
});

AchievementsModal.displayName = 'AchievementsModal';
