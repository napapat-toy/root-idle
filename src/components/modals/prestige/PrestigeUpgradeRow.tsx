'use client';

import React from 'react';
import { fmtInt } from '@/lib/formatters';
import { calcBulkPrestigeUpgrade } from '@/constants/gameData';

interface PrestigeUpgradeRowProps {
  title: string;
  badge?: React.ReactNode;
  desc: string;
  costFn?: (lvl: number) => number;
  currentLevel?: number;
  maxLevel?: number;
  seeds: number;
  onBuy?: (amount?: number | 'max') => void;
  // Fallback for simple single-buy or toggleable item (like Auto Root or Offline Cap)
  costText?: string;
  isMaxed?: boolean;
  isDisabled?: boolean;
  isOwned?: boolean;
  isToggledOff?: boolean;
  isActive?: boolean;
  onClick?: () => void;
  isEn: boolean;
}

function renderPillBadge(badge?: React.ReactNode) {
  if (!badge) return null;
  if (typeof badge !== 'string') return badge;

  const text = badge.trim();
  if (!text) return null;

  let badgeStyle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: '999px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    whiteSpace: 'nowrap',
    letterSpacing: '0.02em',
    lineHeight: '1.25',
  };

  if (text.includes('ซื้อครั้งเดียว') || text.includes('One-Time') || text.includes('ปลดล็อกถาวร')) {
    badgeStyle = {
      ...badgeStyle,
      color: '#fbbf24',
      background: 'rgba(251, 191, 36, 0.16)',
      border: '1px solid rgba(251, 191, 36, 0.45)',
      boxShadow: '0 0 8px rgba(251, 191, 36, 0.25)',
    };
  } else if (text.includes('MAXED') || text.includes('เต็มแล้ว') || text.includes('ปลดล็อกแล้ว') || text.includes('Unlocked')) {
    badgeStyle = {
      ...badgeStyle,
      color: '#4ade80',
      background: 'rgba(74, 222, 128, 0.16)',
      border: '1px solid rgba(74, 222, 128, 0.4)',
    };
  } else if (text.includes('🟢') || text.includes('Active') || text.includes('เปิดอยู่')) {
    badgeStyle = {
      ...badgeStyle,
      color: '#34d399',
      background: 'rgba(52, 211, 153, 0.16)',
      border: '1px solid rgba(52, 211, 153, 0.4)',
    };
  } else if (text.includes('⚪') || text.includes('Disabled') || text.includes('ปิดอยู่')) {
    badgeStyle = {
      ...badgeStyle,
      color: 'var(--root-cream-dim)',
      background: 'rgba(255, 255, 255, 0.08)',
      border: '1px solid rgba(255, 255, 255, 0.18)',
    };
  } else if (text.includes('🚫') || text.includes('Suppressed') || text.includes('ระงับ')) {
    badgeStyle = {
      ...badgeStyle,
      color: '#f87171',
      background: 'rgba(239, 68, 68, 0.16)',
      border: '1px solid rgba(239, 68, 68, 0.4)',
    };
  } else {
    // Leveled upgrade pill
    badgeStyle = {
      ...badgeStyle,
      color: '#d8b4fe',
      background: 'rgba(168, 85, 247, 0.14)',
      border: '1px solid rgba(168, 85, 247, 0.35)',
    };
  }

  return <span style={badgeStyle}>{text}</span>;
}

export const PrestigeUpgradeRow: React.FC<PrestigeUpgradeRowProps> = React.memo(({
  title,
  badge,
  desc,
  costFn,
  currentLevel = 0,
  maxLevel = Infinity,
  seeds,
  onBuy,
  costText,
  isMaxed = false,
  isDisabled = false,
  isOwned = false,
  isToggledOff = false,
  isActive = false,
  onClick,
  isEn,
}) => {
  // If costFn and onBuy are provided, render as bulk upgrade item
  if (costFn && onBuy) {
    const maxed = currentLevel >= maxLevel || isMaxed;
    if (maxed) {
      return (
        <div className="prestige-item owned disabled">
          <div className="p-top">
            <span>{title}</span>
            {renderPillBadge(isEn ? 'MAXED ✓' : 'เต็มแล้ว ✓')}
          </div>
          <div className="p-desc">{desc}</div>
          <div className="p-cost">—</div>
        </div>
      );
    }

    const cost1 = costFn(currentLevel);
    const { count: maxBuyable } = calcBulkPrestigeUpgrade(currentLevel, seeds, costFn, 'max', maxLevel);
    const disabled = seeds < cost1 || isDisabled;

    return (
      <div
        className={`prestige-item ${disabled ? 'disabled' : ''}`}
        onClick={() => { if (!disabled) onBuy(1); }}
      >
        <div className="p-top">
          <span>{title}</span>
          {renderPillBadge(badge)}
        </div>
        <div className="p-desc">{desc}</div>
        <div className="p-cost" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', flexWrap: 'wrap', gap: '6px' }}>
          <span style={{ fontSize: '11.5px', color: 'var(--prestige-accent)' }}>
            {fmtInt(cost1)} 🌌
          </span>
          <div className="passive-bulk-row" onClick={e => e.stopPropagation()}>
            <button
              type="button"
              className="btn-passive-bulk"
              disabled={disabled}
              onClick={() => onBuy(1)}
              title={isEn ? 'Buy 1 Level' : 'ซื้อ 1 เลเวล'}
            >
              +1
            </button>
            {maxBuyable >= 5 && (
              <button
                type="button"
                className="btn-passive-bulk"
                onClick={() => onBuy(5)}
                title={isEn ? 'Buy 5 Levels' : 'ซื้อ 5 เลเวล'}
              >
                +5
              </button>
            )}
            {maxBuyable >= 20 && (
              <button
                type="button"
                className="btn-passive-bulk"
                onClick={() => onBuy(10)}
                title={isEn ? 'Buy 10 Levels' : 'ซื้อ 10 เลเวล'}
              >
                +10
              </button>
            )}
            {maxBuyable > 1 && (
              <button
                type="button"
                className="btn-passive-bulk btn-passive-max"
                onClick={() => onBuy('max')}
                title={isEn ? `Buy Max Possible (+${maxBuyable} Levels)` : `ซื้อสูงสุดเท่าที่ทำได้ (+${maxBuyable} เลเวล)`}
              >
                MAX (+{maxBuyable})
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Fallback simple / toggle item
  return (
    <div
      onClick={!isDisabled && onClick ? onClick : undefined}
      className={`prestige-item ${isOwned ? 'owned' : ''} ${isDisabled ? 'disabled' : ''} ${
        isToggledOff ? 'toggled-off' : ''
      } ${isActive ? 'is-active' : ''}`}
    >
      <div className="p-top">
        <span>{title}</span>
        {renderPillBadge(badge)}
      </div>
      <div className="p-desc">{desc}</div>
      <div className="p-cost">{costText || '—'}</div>
    </div>
  );
});

PrestigeUpgradeRow.displayName = 'PrestigeUpgradeRow';
