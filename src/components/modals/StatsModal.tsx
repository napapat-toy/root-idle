'use client';

import React from 'react';
import { GameState, Language } from '@/types/game';
import { stageName } from '@/constants/gameData';
import { fmt, formatDuration } from '@/lib/formatters';
import { ACHIEVEMENTS } from '@/constants/achievementsData';
import { t } from '@/lib/i18n';

interface StatsModalProps {
  isOpen: boolean;
  state: GameState;
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = React.memo(({
  isOpen,
  state,
  onClose,
}) => {
  if (!isOpen) return null;

  const lang: Language = state.lang || 'th';
  const isEn = lang === 'en';
  const tr = t(lang);

  const totalAchievements = ACHIEVEMENTS.length;
  const unlockedAchievements = state.achievements?.length || 0;
  const achPercent = Math.round((unlockedAchievements / totalAchievements) * 100);

  const stats = state.stats || {
    prestigeCount: 0,
    totalEventsClaimed: 0,
    luckyJackpotCount: 0,
    maxOfflineTimeSeconds: 0,
    superJackpotClaimed: false,
    totalSeedsEarnedLifetime: state.eternalSeeds || 0,
    totalNutrientsEarnedLifetime: state.runEarned || state.nutrients || 0,
  };

  const lifetimeNutrients = stats.totalNutrientsEarnedLifetime || (state.runEarned + (stats.prestigeCount > 0 ? state.nutrients : 0));
  const lifetimeSeeds = Math.max(stats.totalSeedsEarnedLifetime || 0, state.eternalSeeds || 0);

  return (
    <div className="offline-backdrop" onClick={onClose}>
      <div className="modal-wrapper stats-modal-wrapper" onClick={e => e.stopPropagation()}>
        <button className="modal-close-x" onClick={onClose} aria-label={tr.close}>
          &times;
        </button>

        <div className="offline-modal generic-modal stats-modal-content">
          <div className="icon">📊</div>
          <h2>{tr.statsTitle}</h2>
          <div className="away-time" style={{ marginBottom: '14px' }}>
            {isEn
              ? 'Complete overview of your botanical journey, yield milestones, and records'
              : 'ภาพรวมการเดินทางและความก้าวหน้าของรากไม้ของคุณ'}
          </div>

          <div className="stats-dashboard-grid">
            {/* 1. Time & Journey */}
            <div className="stats-card">
              <div className="stats-card-header">
                <span className="stats-card-icon">⏱️</span>
                <span className="stats-card-title">{tr.cardTimeTitle}</span>
              </div>
              <div className="stats-card-rows">
                <div className="stats-row">
                  <span className="stats-label">{tr.statTotalPlayTime}:</span>
                  <span className="stats-value">{formatDuration(state.totalPlayTimeSeconds, lang)}</span>
                </div>
                <div className="stats-row">
                  <span className="stats-label">{tr.statRunPlayTime}:</span>
                  <span className="stats-value">{formatDuration(state.runPlayTimeSeconds, lang)}</span>
                </div>
                <div className="stats-row">
                  <span className="stats-label">{tr.statGrowthStage}:</span>
                  <span className="stats-value highlight">{stageName(state.totalOwned, lang)}</span>
                </div>
                <div className="stats-row">
                  <span className="stats-label">{tr.statMaxOffline}:</span>
                  <span className="stats-value">{formatDuration(stats.maxOfflineTimeSeconds, lang)}</span>
                </div>
              </div>
            </div>

            {/* 2. Nutrients & Production */}
            <div className="stats-card">
              <div className="stats-card-header">
                <span className="stats-card-icon">💧</span>
                <span className="stats-card-title">{tr.cardNutrientsTitle}</span>
              </div>
              <div className="stats-card-rows">
                <div className="stats-row">
                  <span className="stats-label">{tr.statCurNutrients}:</span>
                  <span className="stats-value highlight">{fmt(state.nutrients)}</span>
                </div>
                <div className="stats-row">
                  <span className="stats-label">{tr.statRunEarned}:</span>
                  <span className="stats-value">{fmt(state.runEarned)}</span>
                </div>
                <div className="stats-row">
                  <span className="stats-label">{tr.statLifetimeNutrients}:</span>
                  <span className="stats-value golden">{fmt(lifetimeNutrients)}</span>
                </div>
              </div>
            </div>

            {/* 3. Prestige & Eternity */}
            <div className="stats-card">
              <div className="stats-card-header">
                <span className="stats-card-icon">🌌</span>
                <span className="stats-card-title">{tr.cardPrestigeTitle}</span>
              </div>
              <div className="stats-card-rows">
                <div className="stats-row">
                  <span className="stats-label">{tr.statPrestigeCount}:</span>
                  <span className="stats-value purple">{stats.prestigeCount} {isEn ? 'times' : 'ครั้ง'}</span>
                </div>
                <div className="stats-row">
                  <span className="stats-label">{tr.statCurSeeds}:</span>
                  <span className="stats-value purple">{fmt(state.eternalSeeds)}</span>
                </div>
                <div className="stats-row">
                  <span className="stats-label">{tr.statLifetimeSeeds}:</span>
                  <span className="stats-value golden">{fmt(lifetimeSeeds)}</span>
                </div>
              </div>
            </div>

            {/* 4. Roots & Achievements */}
            <div className="stats-card">
              <div className="stats-card-header">
                <span className="stats-card-icon">🌿</span>
                <span className="stats-card-title">{tr.cardRootsTitle}</span>
              </div>
              <div className="stats-card-rows">
                <div className="stats-row">
                  <span className="stats-label">{tr.statTotalRoots}:</span>
                  <span className="stats-value">{state.totalOwned} {isEn ? 'units' : 'ต้น'}</span>
                </div>
                <div className="stats-row">
                  <span className="stats-label">{tr.statAchievementsCount}:</span>
                  <span className="stats-value green">{unlockedAchievements} / {totalAchievements} ({achPercent}%)</span>
                </div>
                <div className="stats-row">
                  <span className="stats-label">{tr.statEventsClaimed}:</span>
                  <span className="stats-value">{stats.totalEventsClaimed} {isEn ? 'times' : 'ครั้ง'}</span>
                </div>
                <div className="stats-row">
                  <span className="stats-label">{tr.statLuckyCount}:</span>
                  <span className="stats-value golden">{stats.luckyJackpotCount} {isEn ? 'times' : 'ครั้ง'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

StatsModal.displayName = 'StatsModal';
