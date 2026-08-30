'use client';

import React from 'react';
import { GameState, Language } from '@/types/game';
import { calcPrestigeSeeds, prestigeUnlocked } from '@/constants/gameData';
import { fmtInt } from '@/lib/formatters';
import { t } from '@/lib/i18n';

interface TopActionsProps {
  state: GameState;
  onOpenPrestige: () => void;
  onOpenOptions: () => void;
  onOpenAchievements?: () => void;
  onOpenStats?: () => void;
  onOpenWardrobe?: () => void;
  onOpenRelics?: () => void;
  onOpenAutomation?: () => void;
  onOpenTranscendence?: () => void;
}

export const TopActions: React.FC<TopActionsProps> = React.memo(({
  state,
  onOpenPrestige,
  onOpenOptions,
  onOpenAchievements,
  onOpenStats,
  onOpenWardrobe,
  onOpenRelics,
  onOpenAutomation,
  onOpenTranscendence,
}) => {
  const lang: Language = state.lang || 'th';
  const tr = t(lang);

  const pendingSeeds = calcPrestigeSeeds(state);
  const canPrestige = prestigeUnlocked(state) && pendingSeeds > 0;
  const hasPrestigeShop = state.eternalSeeds > 0;
  const showPrestigeBtn = canPrestige || hasPrestigeShop;

  const unlockedAchCount = state.achievements?.length || 0;
  const hasAnyAuto = state.prestige.autoRoot || state.prestige.autoEvent || state.prestige.autoReset;

  const yggOwned = state.owned['yggdrasil'] || 0;
  const showTranscendenceBtn = (state.transcendence?.count || 0) > 0 || (state.transcendence?.gaiaEssences || 0) > 0 || yggOwned >= 100;
  const pendingEssences = (state.runEarned >= 1e28) ? Math.max(1, Math.floor(Math.pow(state.runEarned / 1e28, 0.15) * 5)) : 0;

  return (
    <div className="top-actions-row">
      <div className="top-actions-left" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {showPrestigeBtn && (
          <button
            className={`prestige-mini-btn ${pendingSeeds >= 10 ? 'ready-pulse' : ''}`}
            onClick={onOpenPrestige}
            style={pendingSeeds >= 10 ? { borderColor: 'rgba(251, 191, 36, 0.6)', background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.25), rgba(245, 158, 11, 0.2))' } : undefined}
          >
            🌌 <span className="action-btn-text">{tr.prestigeBtn}</span>
            {pendingSeeds > 0 && (
              <span style={{ color: '#ffd76a', fontWeight: 700, marginLeft: '5px', fontSize: '11px' }}>
                (+{fmtInt(pendingSeeds)} 🌰)
              </span>
            )}
          </button>
        )}

        {showTranscendenceBtn && onOpenTranscendence && (
          <button
            className={`prestige-mini-btn ${pendingEssences > 0 ? 'ready-pulse' : ''}`}
            onClick={onOpenTranscendence}
            style={{
              borderColor: 'rgba(52, 211, 153, 0.6)',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(6, 182, 212, 0.2))',
            }}
          >
            🌍 <span className="action-btn-text">{tr.transcendenceBtn}</span>
            {pendingEssences > 0 && (
              <span style={{ color: '#34d399', fontWeight: 700, marginLeft: '5px', fontSize: '11px' }}>
                (+{fmtInt(pendingEssences)} 🌍)
              </span>
            )}
          </button>
        )}
      </div>

      <div className="utility-btn-group">
        {hasAnyAuto && onOpenAutomation && (
          <button
            className="utility-icon-btn"
            onClick={onOpenAutomation}
            title={lang === 'en' ? 'Automation Control Hub' : 'ศูนย์ควบคุมระบบอัตโนมัติ'}
            style={{ position: 'relative' }}
          >
            🤖
            {(state.prestige.autoRootEnabled || state.prestige.autoEventEnabled || state.prestige.autoResetEnabled) && (
              <span
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--accent-glow)',
                  boxShadow: '0 0 6px var(--accent-glow)',
                }}
              />
            )}
          </button>
        )}
        {onOpenRelics && (
          <button
            className="utility-icon-btn"
            onClick={onOpenRelics}
            title={lang === 'en' ? 'Subterranean Museum & Biomes' : 'พิพิธภัณฑ์โบราณวัตถุ & ชีวนิเวศ'}
            style={{ position: 'relative' }}
          >
            🏺
            {state.unclaimedRelicId && (
              <span
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#f59e0b',
                  boxShadow: '0 0 6px #f59e0b',
                }}
              />
            )}
          </button>
        )}

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
