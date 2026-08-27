'use client';

import React from 'react';
import { GameState, Language } from '@/types/game';
import { calcPrestigeSeeds, prestigeUnlocked } from '@/constants/gameData';
import { t } from '@/lib/i18n';

interface TopActionsProps {
  state: GameState;
  onOpenPrestige: () => void;
  onOpenOptions: () => void;
  onOpenAchievements?: () => void;
  onOpenStats?: () => void;
  onOpenWardrobe?: () => void;
}

export const TopActions: React.FC<TopActionsProps> = React.memo(({
  state,
  onOpenPrestige,
  onOpenOptions,
  onOpenAchievements,
  onOpenStats,
  onOpenWardrobe,
}) => {
  const lang: Language = state.lang || 'th';
  const tr = t(lang);

  const canPrestige = prestigeUnlocked(state) && calcPrestigeSeeds(state) > 0;
  const hasPrestigeShop = state.eternalSeeds > 0;
  const showPrestigeBtn = canPrestige || hasPrestigeShop;

  const unlockedAchCount = state.achievements?.length || 0;

  return (
    <div className="top-actions-row">
      <div className="top-actions-left">
        {showPrestigeBtn && (
          <button className="prestige-mini-btn" onClick={onOpenPrestige}>
            🌌 <span className="action-btn-text">{tr.prestigeBtn}</span>
          </button>
        )}
      </div>

      <div className="utility-btn-group">
        {onOpenWardrobe && (
          <button
            className="utility-icon-btn"
            onClick={onOpenWardrobe}
            title={tr.wardrobeTooltip}
          >
            🎨
          </button>
        )}

        {onOpenStats && (
          <button
            className="utility-icon-btn"
            onClick={onOpenStats}
            title={tr.statsTooltip}
          >
            📊
          </button>
        )}

        {onOpenAchievements && (
          <button
            className="utility-icon-btn"
            onClick={onOpenAchievements}
            title={tr.achievementsTooltip.replace('{count}', String(unlockedAchCount))}
          >
            🏆
          </button>
        )}

        <button
          className="utility-icon-btn"
          onClick={onOpenOptions}
          title={tr.optionsTooltip}
        >
          ⚙️
        </button>
      </div>
    </div>
  );
});

TopActions.displayName = 'TopActions';
