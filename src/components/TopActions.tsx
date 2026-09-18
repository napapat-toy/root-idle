'use client';

import React from 'react';
import { GameState, Language } from '@/types/game';
import {
  calcPrestigeSeeds,
  prestigeUnlocked,
  isTranscendenceUnlocked,
  calcTranscendenceEssences,
  TRANSCENDENCE_REQUIRE_YGGDRASIL,
} from '@/constants/gameData';
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
  onOpenTrials?: () => void;
  onToggleHyperdrive?: () => void;
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
  onOpenTrials,
  onToggleHyperdrive,
}) => {
  const lang: Language = state.lang || 'th';
  const tr = t(lang);

  const pendingSeeds = calcPrestigeSeeds(state);
  const isPrestigeEverUnlocked =
    prestigeUnlocked(state) ||
    state.eternalSeeds > 0 ||
    (state.stats?.prestigeCount || 0) > 0 ||
    (state.transcendence?.count || 0) > 0;
  const showPrestigeBtn = isPrestigeEverUnlocked;

  const unlockedAchCount = state.achievements?.length || 0;
  const hasAnyAuto = !!state.prestige.autoRoot;

  const isTrialActive = !!state.transcendence?.activeTrial && state.transcendence.activeTrial !== 'none';
  const isVoidTrial = state.transcendence?.activeTrial === 'void_anomaly';
  const showTranscendenceBtn = isTranscendenceUnlocked(state);
  const pendingEssences = calcTranscendenceEssences(state);
  const yggOwned = state.owned['yggdrasil'] || 0;
  const showTranscendenceProgress = !showTranscendenceBtn && (state.stats?.prestigeCount || 0) >= 3 && yggOwned > 0;

  return (
    <div className="top-actions-row">
      <div className="top-actions-left">
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
            🌍{' '}
            <span className="action-btn-text">
              {tr.transcendenceBtn}
            </span>
            {pendingEssences > 0 && (
              <span style={{ color: '#34d399', fontWeight: 700, marginLeft: '5px', fontSize: '11px' }}>
                (+{fmtInt(pendingEssences)} 🌍)
              </span>
            )}
          </button>
        )}

        {(showTranscendenceBtn || isTrialActive) && onOpenTrials && (
          <button
            className={`prestige-mini-btn ${isTrialActive ? 'ready-pulse' : ''}`}
            onClick={onOpenTrials}
            style={{
              borderColor: isTrialActive ? 'rgba(234, 179, 8, 0.85)' : 'rgba(234, 179, 8, 0.45)',
              background: isTrialActive
                ? 'linear-gradient(135deg, rgba(234, 179, 8, 0.35), rgba(249, 115, 22, 0.25))'
                : 'linear-gradient(135deg, rgba(234, 179, 8, 0.15), rgba(245, 158, 11, 0.1))',
            }}
          >
            ⚔️ <span className="action-btn-text">{tr.trialsBtn}</span>
            {isTrialActive && (
              <span style={{ color: '#facc15', fontWeight: 700, marginLeft: '5px', fontSize: '10.5px' }}>
                ({tr.trialActiveBadge})
              </span>
            )}
          </button>
        )}

        {showTranscendenceProgress && onOpenTranscendence && (
          <button
            className="prestige-mini-btn"
            onClick={onOpenTranscendence}
            title={tr.transcendReqBanner
              .replace('{count}', String(yggOwned))
              .replace('{req}', '100')
            }
            style={{
              borderColor: 'rgba(52, 211, 153, 0.35)',
              background: 'rgba(16, 185, 129, 0.08)',
              color: 'var(--root-cream-dim)',
              opacity: 0.9,
            }}
          >
            🔒 🌍{' '}
            <span className="action-btn-text">
              {tr.transcendenceBtn}
            </span>
            <span style={{ color: '#34d399', fontWeight: 600, marginLeft: '5px', fontSize: '10.5px' }}>
              ({yggOwned}/{TRANSCENDENCE_REQUIRE_YGGDRASIL} 🌳)
            </span>
          </button>
        )}
      </div>

      <div className="utility-btn-group">
        {state.transcendence?.hyperdriveUnlocked && onToggleHyperdrive && (
          <button
            className="utility-icon-btn"
            onClick={onToggleHyperdrive}
            title={
              state.transcendence?.hyperdriveEnabled
                ? tr.hyperdriveActiveTooltip
                : tr.hyperdriveInactiveTooltip
            }
            style={{
              background: state.transcendence?.hyperdriveEnabled
                ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.45), rgba(6, 182, 212, 0.45))'
                : undefined,
              borderColor: state.transcendence?.hyperdriveEnabled ? '#38bdf8' : undefined,
              color: state.transcendence?.hyperdriveEnabled ? '#38bdf8' : undefined,
              boxShadow: state.transcendence?.hyperdriveEnabled ? '0 0 10px rgba(56, 189, 248, 0.5)' : undefined,
              fontWeight: 800,
              fontSize: '11px',
              padding: '0 6px',
              minWidth: '38px',
            }}
          >
            {state.transcendence?.hyperdriveEnabled ? '⚡2x' : '⚡1x'}
          </button>
        )}
        {hasAnyAuto && onOpenAutomation && (
          <button
            className="utility-icon-btn"
            onClick={onOpenAutomation}
            title={
              isVoidTrial
                ? tr.autoHubSuppressedTooltip
                : tr.autoHubTooltip
            }
            style={{ position: 'relative' }}
          >
            <span style={{ position: 'relative', display: 'inline-block' }}>
              🤖
              {isVoidTrial && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    left: '-5px',
                    fontSize: '10px',
                    lineHeight: 1,
                    filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.8))',
                  }}
                >
                  🚫
                </span>
              )}
            </span>
            {(state.prestige.autoRoot && state.prestige.autoRootEnabled) && (
              <span
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: isVoidTrial ? '#c084fc' : 'var(--accent-glow)',
                  boxShadow: isVoidTrial ? '0 0 8px #c084fc' : '0 0 6px var(--accent-glow)',
                }}
              />
            )}
          </button>
        )}
        {onOpenRelics && (
          <button
            className="utility-icon-btn"
            onClick={onOpenRelics}
            title={tr.relicsTooltip}
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
