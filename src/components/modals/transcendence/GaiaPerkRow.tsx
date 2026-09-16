'use client';

import React from 'react';
import { fmtInt } from '@/lib/formatters';
import { ModalButton } from '@/components/common/ModalButton';

export interface GaiaPerkRowProps {
  icon: string;
  name: string;
  desc: string;
  effectText?: string;
  level?: number;
  maxLevel?: number;
  levelText?: string;
  cost?: number;
  costLabel?: string;
  isMaxed?: boolean;
  canAfford?: boolean;
  essences?: number;
  onBuy?: () => void;
  maxTag?: string;
  customBadge?: React.ReactNode;
  customAction?: React.ReactNode;
  isUnlocked?: boolean;
  isToggle?: boolean;
  isToggledOn?: boolean;
  onToggle?: () => void;
  toggleOnText?: string;
  toggleOffText?: string;
  activeTagText?: string;
}

export const GaiaPerkRow: React.FC<GaiaPerkRowProps> = React.memo(({
  icon,
  name,
  desc,
  effectText,
  level,
  maxLevel,
  levelText: customLevelText,
  cost,
  costLabel,
  isMaxed: customIsMaxed,
  canAfford: customCanAfford,
  essences,
  onBuy,
  maxTag = 'MAX',
  customBadge,
  customAction,
  isUnlocked,
  isToggle,
  isToggledOn,
  onToggle,
  toggleOnText = 'ON',
  toggleOffText = 'OFF',
  activeTagText = 'ACTIVE',
}) => {
  const isMaxed = customIsMaxed ?? (level !== undefined && maxLevel !== undefined ? level >= maxLevel : false);
  const canAfford = customCanAfford ?? (cost !== undefined && essences !== undefined ? essences >= cost : true);
  const levelText = customLevelText ?? (level !== undefined && maxLevel !== undefined ? `Lv. ${level}/${maxLevel}` : undefined);

  return (
    <div
      style={{
        background: 'var(--bg-panel-2)',
        border: '1px solid var(--card-border)',
        borderRadius: '10px',
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
      }}
    >
      <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '2px' }}>
          <span style={{ fontSize: '18px', flexShrink: 0 }}>{icon}</span>
          <span style={{ fontWeight: 700, fontSize: '14px' }}>{name}</span>
          {customBadge ? (
            customBadge
          ) : isToggle && isUnlocked ? (
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                background: isToggledOn ? 'var(--astral-cyan-bg)' : 'rgba(255, 255, 255, 0.1)',
                color: isToggledOn ? 'var(--astral-cyan)' : 'var(--root-cream-dim)',
                padding: '1px 7px',
                borderRadius: '999px',
              }}
            >
              {isToggledOn ? `⚡ ${toggleOnText}` : `⏸️ ${toggleOffText}`}
            </span>
          ) : levelText ? (
            <span
              style={{
                fontSize: '11px',
                color: 'var(--gaia-green)',
                background: 'var(--gaia-green-bg)',
                padding: '1px 6px',
                borderRadius: '4px',
                flexShrink: 0,
              }}
            >
              {levelText}
            </span>
          ) : null}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--root-cream-dim)' }}>{desc}</div>
        {effectText && (
          <div style={{ fontSize: '11px', color: 'var(--astral-cyan)', marginTop: '2px' }}>
            {effectText}
          </div>
        )}
      </div>

      {customAction ? (
        customAction
      ) : isToggle && isUnlocked ? (
        <ModalButton
          variant={isToggledOn ? 'cyan' : 'secondary'}
          size="sm"
          onClick={onToggle}
        >
          {isToggledOn ? `⚡ ${toggleOnText}` : `⏸️ ${toggleOffText}`}
        </ModalButton>
      ) : isUnlocked && !isToggle ? (
        <div
          style={{
            background: 'var(--cosmic-pink-bg)',
            color: 'var(--cosmic-pink)',
            border: '1px solid var(--cosmic-pink-border)',
            borderRadius: '8px',
            padding: '6px 14px',
            fontWeight: 700,
            fontSize: '12px',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          ✓ {activeTagText}
        </div>
      ) : (
        <ModalButton
          variant={isMaxed ? 'locked' : 'primary'}
          size="sm"
          disabled={isMaxed || !canAfford}
          onClick={onBuy}
        >
          {isMaxed
            ? maxTag
            : costLabel
            ? costLabel
            : cost !== undefined
            ? `${fmtInt(cost)} 🌍`
            : ''}
        </ModalButton>
      )}
    </div>
  );
});

GaiaPerkRow.displayName = 'GaiaPerkRow';
