'use client';

import React from 'react';
import { RelicDef, RelicRarity } from '@/types/game';
import { RELIC_RARITY_INFO } from '@/constants/gameData';

type RelicRarityInfo = typeof RELIC_RARITY_INFO[RelicRarity];

interface RelicPedestalProps {
  relic: RelicDef;
  idx: number;
  count: number;
  isSelected: boolean;
  rarityInfo: RelicRarityInfo;
  isEn: boolean;
  onSelect: (id: string) => void;
}

export const RelicPedestal: React.FC<RelicPedestalProps> = React.memo(({
  relic,
  idx,
  count,
  isSelected,
  rarityInfo,
  isEn,
  onSelect,
}) => {
  const isOwned = count > 0;

  return (
    <button
      key={relic.id}
      onClick={() => onSelect(relic.id)}
      style={{
        aspectRatio: '1 / 1',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: '4px 2px',
        borderRadius: '10px',
        background: isOwned
          ? `linear-gradient(135deg, var(--bg-panel-2) 0%, ${relic.color}25 100%)`
          : 'rgba(255, 255, 255, 0.02)',
        border: isSelected
          ? `2px solid ${isOwned ? relic.color : rarityInfo.color}`
          : isOwned
          ? `1px solid ${relic.color}66`
          : '1px solid var(--line-soil)',
        boxShadow: isSelected
          ? `0 0 12px ${isOwned ? relic.color : rarityInfo.color}55`
          : isOwned
          ? `0 0 6px ${relic.color}22`
          : 'none',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        outline: 'none',
        minWidth: 0,
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* Pedestal Tag & Fragment Count */}
      <div
        style={{
          position: 'absolute',
          top: '3px',
          left: '3px',
          right: '3px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 'clamp(7.5px, 1.8vw, 8.5px)',
          color: 'var(--root-cream-dim)',
          fontWeight: 600,
          lineHeight: 1,
        }}
      >
        <span>#{String(idx + 1).padStart(2, '0')}</span>
        <span style={{ color: isOwned ? '#facc15' : 'inherit', fontWeight: 700 }}>
          {isOwned ? '✓ 1/1' : rarityInfo.icon}
        </span>
      </div>

      {/* Artifact Icon */}
      <span
        style={{
          fontSize: 'clamp(19px, 4.5vw, 24px)',
          marginTop: '4px',
          filter: isOwned ? 'none' : 'grayscale(100%) opacity(25%)',
          transform: isSelected ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 0.15s ease',
          lineHeight: 1,
        }}
      >
        {isOwned ? relic.icon : '🏺'}
      </span>

      {/* Rarity or Name label */}
      <span
        style={{
          fontSize: 'clamp(8px, 2vw, 9.5px)',
          fontWeight: 600,
          color: isOwned ? relic.color : rarityInfo.color,
          marginTop: '3px',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '96%',
          opacity: isOwned ? 1 : 0.75,
          lineHeight: 1.1,
        }}
      >
        {isOwned ? (isEn ? relic.enName : relic.name) : (isEn ? rarityInfo.enName : rarityInfo.name)}
      </span>
    </button>
  );
});

RelicPedestal.displayName = 'RelicPedestal';
