'use client';

import React from 'react';
import { AutoRootMode, GameState, Language, SkinId } from '@/types/game';
import { calcPrestigeSeeds, prestigeUnlocked } from '@/constants/gameData';
import { getActiveAutoRootMode } from '@/lib/autoBuyer';
import { SKIN_NAMES, t } from '@/lib/i18n';

interface TopActionsProps {
  state: GameState;
  onOpenPrestige: () => void;
  onToggleSkin: () => void;
  onOpenOptions: () => void;
  onOpenAchievements?: () => void;
  onOpenStats?: () => void;
  onToggleLanguage?: () => void;
  onToggleAutoRoot?: () => void;
  onCycleAutoRootMode?: () => void;
  onToggleAutoEvent?: () => void;
  onToggleAutoReset?: () => void;
}

export const TopActions: React.FC<TopActionsProps> = React.memo(({
  state,
  onOpenPrestige,
  onToggleSkin,
  onOpenOptions,
  onOpenAchievements,
  onOpenStats,
  onToggleLanguage,
  onToggleAutoRoot,
  onCycleAutoRootMode,
  onToggleAutoEvent,
  onToggleAutoReset,
}) => {
  const lang: Language = state.lang || 'th';
  const isEn = lang === 'en';
  const tr = t(lang);

  const canPrestige = prestigeUnlocked(state) && calcPrestigeSeeds(state) > 0;
  const hasPrestigeShop = state.eternalSeeds > 0;
  const showPrestigeBtn = canPrestige || hasPrestigeShop;

  const ownedSkinsCount = [
    true,
    state.prestige.auraRoots,
    state.prestige.skinSameOrigin,
    state.prestige.skinGrayscale,
    state.prestige.skinGradient,
  ].filter(Boolean).length;

  const currentAutoMode: AutoRootMode = getActiveAutoRootMode(state);
  const autoModeLabels: Record<AutoRootMode, { label: string; icon: string }> = {
    basic: { label: tr.autoCheapest, icon: '🤖' },
    smart: { label: tr.autoSmart, icon: '🧠' },
    all: { label: tr.autoAll, icon: '♾️' },
  };

  const handleAutoRootClick = onCycleAutoRootMode || onToggleAutoRoot;
  const unlockedAchCount = state.achievements?.length || 0;
  const currentSkinName = SKIN_NAMES[state.prestige.activeSkin]?.[lang] || state.prestige.activeSkin;

  return (
    <div className="top-actions-row">
      <div className="top-actions-left">
        {showPrestigeBtn && (
          <button className="prestige-mini-btn" onClick={onOpenPrestige}>
            🌌 <span className="action-btn-text">{tr.prestigeBtn}</span>
          </button>
        )}

        {/* Quick Automation Toggles */}
        {state.prestige.autoRoot && handleAutoRootClick && (
          <button
            className={`prestige-mini-btn ${!state.prestige.autoRootEnabled ? 'toggled-off' : ''}`}
            style={{
              opacity: state.prestige.autoRootEnabled ? 1 : 0.5,
              borderColor: state.prestige.autoRootEnabled ? 'var(--accent-glow-dim)' : 'var(--line-soil)',
              color: state.prestige.autoRootEnabled ? 'var(--accent-glow)' : 'var(--root-cream-dim)',
            }}
            onClick={handleAutoRootClick}
            title={isEn ? 'Auto Root (Click to cycle tier or Toggle ON/OFF)' : 'ออโต้ซื้อราก (คลิกเพื่อเปลี่ยนระดับ หรือ เปิด/ปิด)'}
          >
            {state.prestige.autoRootEnabled ? (
              <>
                {autoModeLabels[currentAutoMode].icon}{' '}
                <span className="action-btn-text">{autoModeLabels[currentAutoMode].label}</span>
              </>
            ) : (
              <>⚪ <span className="action-btn-text">{tr.autoOff}</span></>
            )}
          </button>
        )}

        {state.prestige.autoEvent && onToggleAutoEvent && (
          <button
            className={`prestige-mini-btn ${!state.prestige.autoEventEnabled ? 'toggled-off' : ''}`}
            style={{
              opacity: state.prestige.autoEventEnabled ? 1 : 0.5,
              borderColor: state.prestige.autoEventEnabled ? '#ffd76a' : 'var(--line-soil)',
              color: state.prestige.autoEventEnabled ? '#ffd76a' : 'var(--root-cream-dim)',
            }}
            onClick={onToggleAutoEvent}
            title={isEn ? 'Auto Event Clicker (Toggle ON/OFF)' : 'ออโต้อีเวนต์ (คลิกเพื่อ เปิด/ปิด)'}
          >
            🎯 <span className="action-btn-text">{state.prestige.autoEventEnabled ? tr.autoEvent : 'OFF'}</span>
          </button>
        )}

        {state.prestige.autoReset && onToggleAutoReset && (
          <button
            className={`prestige-mini-btn ${!state.prestige.autoResetEnabled ? 'toggled-off' : ''}`}
            style={{
              opacity: state.prestige.autoResetEnabled ? 1 : 0.5,
              borderColor: state.prestige.autoResetEnabled ? 'var(--prestige-accent)' : 'var(--line-soil)',
              color: state.prestige.autoResetEnabled ? 'var(--prestige-accent)' : 'var(--root-cream-dim)',
            }}
            onClick={onToggleAutoReset}
            title={isEn ? 'Auto Re-sow (Toggle ON/OFF)' : 'ออโต้หว่านใหม่ (คลิกเพื่อ เปิด/ปิด)'}
          >
            🔁 <span className="action-btn-text">{state.prestige.autoResetEnabled ? tr.autoReset : 'OFF'}</span>
          </button>
        )}
      </div>

      <div className="utility-btn-group">
        {onToggleLanguage && (
          <button
            className="lang-toggle-btn"
            onClick={onToggleLanguage}
            title={tr.langToggleTooltip}
          >
            {isEn ? '🇬🇧 EN' : '🇹🇭 TH'}
          </button>
        )}

        {onOpenStats && (
          <button
            className="achievement-toggle-btn"
            onClick={onOpenStats}
            title={tr.statsTooltip}
          >
            📊
          </button>
        )}

        {onOpenAchievements && (
          <button
            className="achievement-toggle-btn"
            onClick={onOpenAchievements}
            title={tr.achievementsTooltip.replace('{count}', String(unlockedAchCount))}
          >
            🏆
            {unlockedAchCount > 0 && (
              <span className="achievement-badge-pill">{unlockedAchCount}</span>
            )}
          </button>
        )}

        {ownedSkinsCount > 1 && (
          <button
            className={`skin-toggle-btn ${state.prestige.activeSkin !== 'none' ? 'on' : ''}`}
            onClick={onToggleSkin}
            title={tr.skinsTooltip.replace('{name}', currentSkinName)}
          >
            🎨
          </button>
        )}

        <div className="utility-divider" />

        <button
          className="save-btn-mini"
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
