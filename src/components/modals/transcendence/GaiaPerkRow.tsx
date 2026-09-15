'use client';

import React from 'react';
import { fmtInt } from '@/lib/formatters';

interface GaiaPerkRowProps {
  icon: string;
  name: string;
  desc: string;
  effectText?: string;
  levelText?: string;
  cost?: number;
  costLabel?: string;
  isMaxed?: boolean;
  canAfford?: boolean;
  onBuy?: () => void;
  maxTag?: string;
  customBadge?: React.ReactNode;
  customAction?: React.ReactNode;
}

export const GaiaPerkRow: React.FC<GaiaPerkRowProps> = React.memo(({
  icon,
  name,
  desc,
  effectText,
  levelText,
  cost,
  costLabel,
  isMaxed = false,
  canAfford = false,
  onBuy,
  maxTag = 'MAX',
  customBadge,
  customAction,
}) => {
  return (
    <div
      style={{
        background: 'var(--bg-panel-2)',
        border: '1px solid rgba(255,255,255,0.08)',
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
                color: '#34d399',
                background: 'rgba(52, 211, 153, 0.15)',
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
          <div style={{ fontSize: '11px', color: '#38bdf8', marginTop: '2px' }}>
            {effectText}
          </div>
        )}
      </div>

      {customAction ? (
        customAction
      ) : (
        <button
          onClick={onBuy}
          disabled={isMaxed || !canAfford}
          style={{
            background: isMaxed
              ? 'rgba(255,255,255,0.06)'
              : canAfford
              ? '#34d399'
              : 'rgba(52, 211, 153, 0.2)',
            color: isMaxed
              ? 'rgba(255,255,255,0.3)'
              : canAfford
              ? '#064e3b'
              : 'rgba(255,255,255,0.4)',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 12px',
            fontWeight: 700,
            fontSize: '12px',
            cursor: !isMaxed && canAfford ? 'pointer' : 'not-allowed',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          {isMaxed
            ? maxTag
            : costLabel
            ? costLabel
            : cost !== undefined
            ? `${fmtInt(cost)} 🌍`
            : ''}
        </button>
      )}
    </div>
  );
});

GaiaPerkRow.displayName = 'GaiaPerkRow';
