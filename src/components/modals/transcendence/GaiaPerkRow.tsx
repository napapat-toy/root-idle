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
  activeTagText?: string;
  oneTimeText?: string;
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
  activeTagText = 'ACTIVE',
  oneTimeText,
}) => {
  const isMaxed = customIsMaxed ?? (level !== undefined && maxLevel !== undefined ? level >= maxLevel : false);
  const canAfford = customCanAfford ?? (cost !== undefined && essences !== undefined ? essences >= cost : true);
  const levelText = customLevelText ?? (
    level !== undefined && maxLevel !== undefined
      ? isMaxed
        ? maxTag
        : `Lv. ${level}/${maxLevel}`
      : undefined
  );

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
          ) : levelText ? (
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: isMaxed ? '#4ade80' : 'var(--gaia-green)',
                background: isMaxed ? 'rgba(74, 222, 128, 0.16)' : 'var(--gaia-green-bg)',
                border: isMaxed ? '1px solid rgba(74, 222, 128, 0.4)' : '1px solid rgba(74, 222, 128, 0.2)',
                padding: '2px 8px',
                borderRadius: '999px',
                flexShrink: 0,
              }}
            >
              {levelText}
            </span>
          ) : !isUnlocked ? (
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#fbbf24',
                background: 'rgba(251, 191, 36, 0.16)',
                border: '1px solid rgba(251, 191, 36, 0.45)',
                boxShadow: '0 0 8px rgba(251, 191, 36, 0.25)',
                padding: '2px 8px',
                borderRadius: '999px',
                flexShrink: 0,
              }}
            >
              {oneTimeText || '✨ ซื้อครั้งเดียวจบ'}
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
      ) : isUnlocked ? (
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
