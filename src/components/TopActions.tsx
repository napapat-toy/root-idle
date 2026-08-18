'use client';

import React from 'react';
import { AutoRootMode, GameState, SkinId } from '@/types/game';
import { calcPrestigeSeeds, prestigeUnlocked } from '@/constants/gameData';
import { getActiveAutoRootMode } from '@/lib/autoBuyer';

interface TopActionsProps {
  state: GameState;
  onOpenPrestige: () => void;
  onToggleSkin: () => void;
  onOpenOptions: () => void;
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
  onToggleAutoRoot,
  onCycleAutoRootMode,
  onToggleAutoEvent,
  onToggleAutoReset,
}) => {
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

  const skinLabels: Record<SkinId, string> = {
    none: 'ปกติ',
    rainbow: 'รุ้ง/ทอง',
    sameorigin: 'รากเดียวกัน',
    grayscale: 'ขาวดำ',
    gradient: 'ไล่เข้ม-อ่อน',
  };

  const currentAutoMode: AutoRootMode = getActiveAutoRootMode(state);
  const autoModeLabels: Record<AutoRootMode, { label: string; icon: string }> = {
    basic: { label: 'ถูกสุด', icon: '🤖' },
    smart: { label: 'ฉลาด', icon: '🧠' },
    all: { label: 'ทั้งหมด', icon: '♾️' },
  };

  const handleAutoRootClick = onCycleAutoRootMode || onToggleAutoRoot;

  return (
    <div className="top-actions-row">
      <div className="top-actions-left">
        {showPrestigeBtn && (
          <button className="prestige-mini-btn" onClick={onOpenPrestige}>
            🌌 <span className="action-btn-text">Prestige</span>
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
            title="ออโต้ซื้อราก (คลิกเพื่อเปลี่ยนระดับ หรือ เปิด/ปิด)"
          >
            {state.prestige.autoRootEnabled ? (
              <>
                {autoModeLabels[currentAutoMode].icon}{' '}
                <span className="action-btn-text">{autoModeLabels[currentAutoMode].label}</span>
              </>
            ) : (
              <>⚪ <span className="action-btn-text">Auto OFF</span></>
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
            title="ออโต้อีเว้น (คลิกเพื่อ เปิด/ปิด)"
          >
            🎯 <span className="action-btn-text">{state.prestige.autoEventEnabled ? 'Event' : 'OFF'}</span>
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
            title="ออโต้หว่านใหม่ (คลิกเพื่อ เปิด/ปิด)"
          >
            🔁 <span className="action-btn-text">{state.prestige.autoResetEnabled ? 'Reset' : 'OFF'}</span>
          </button>
        )}
      </div>

      <div className="utility-btn-group">
        {ownedSkinsCount > 1 && (
          <button
            className={`skin-toggle-btn ${state.prestige.activeSkin !== 'none' ? 'on' : ''}`}
            onClick={onToggleSkin}
            title={`สกินปัจจุบัน: ${skinLabels[state.prestige.activeSkin]} (กดเพื่อเปลี่ยน)`}
          >
            🎨
          </button>
        )}

        <div className="utility-divider" />

        <button
          className="save-btn-mini"
          onClick={onOpenOptions}
          title="ตัวเลือก & สกิน & บันทึก"
        >
          ⚙️
        </button>
      </div>
    </div>
  );
});

TopActions.displayName = 'TopActions';
