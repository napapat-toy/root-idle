'use client';

import React, { useState, useMemo } from 'react';
import { GameState } from '@/types/game';
import { ACHIEVEMENT_CATEGORIES, ACHIEVEMENTS } from '@/constants/achievementsData';
import { AchievementCategory } from '@/types/achievements';

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

  const unlockedSet = useMemo(() => {
    return new Set(state.achievements || []);
  }, [state.achievements]);

  const totalCount = ACHIEVEMENTS.length;
  const unlockedCount = unlockedSet.size;
  const progressPct = Math.round((unlockedCount / totalCount) * 100);

  const filteredAchievements = useMemo(() => {
    if (selectedCategory === 'all') return ACHIEVEMENTS;
    return ACHIEVEMENTS.filter(a => a.category === selectedCategory);
  }, [selectedCategory]);

  if (!isOpen) return null;

  return (
    <div className="offline-backdrop" onClick={onClose}>
      <div className="modal-wrapper achievements-modal-wrapper" onClick={e => e.stopPropagation()}>
        <button className="modal-close-x" onClick={onClose} aria-label="ปิด">
          &times;
        </button>

        <div className="offline-modal generic-modal achievements-modal-content">
          <div className="icon">🏆</div>
          <h2>เหรียญความสำเร็จ (Achievements)</h2>
          <div className="away-time" style={{ marginBottom: '8px' }}>
            ปลดล็อกเป้าหมายเพื่อรับ <b>+1% โบนัสอัตราผลิตสารอาหารรวมถาวร</b> ต่อทุกความสำเร็จ
          </div>

          {/* Progress Overview */}
          <div className="achievement-progress-card">
            <div className="achievement-progress-stats">
              <span>ความคืบหน้า: <b>{unlockedCount} / {totalCount}</b> ({progressPct}%)</span>
              <span className="achievement-bonus-tag">โบนัสปัจจุบัน: +{unlockedCount}% เรตถาวร</span>
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
              ทั้งหมด ({unlockedCount}/{totalCount})
            </button>
            {ACHIEVEMENT_CATEGORIES.map(cat => {
              const inCat = ACHIEVEMENTS.filter(a => a.category === cat.id);
              const unlockedInCat = inCat.filter(a => unlockedSet.has(a.id)).length;
              return (
                <button
                  key={cat.id}
                  className={`achievement-tab-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.icon} {cat.name} ({unlockedInCat}/{inCat.length})
                </button>
              );
            })}
          </div>

          {/* Achievements List */}
          <div className="achievement-list-scroll">
            {filteredAchievements.map(ach => {
              const isUnlocked = unlockedSet.has(ach.id);
              return (
                <div
                  key={ach.id}
                  className={`achievement-item-card ${isUnlocked ? 'unlocked' : 'locked'}`}
                >
                  <div className="achievement-item-icon">{ach.icon}</div>
                  <div className="achievement-item-info">
                    <div className="achievement-item-header">
                      <span className="achievement-item-title">{ach.title}</span>
                      <span className={`achievement-item-badge ${isUnlocked ? 'unlocked' : 'locked'}`}>
                        {isUnlocked ? '✓ สำเร็จ (+1%)' : '🔒 ยังไม่ปลด'}
                      </span>
                    </div>
                    <div className="achievement-item-desc">{ach.desc}</div>
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
