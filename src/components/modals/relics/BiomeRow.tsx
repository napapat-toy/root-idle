'use client';

import React from 'react';
import { BiomeDef } from '@/types/game';

interface BiomeRowProps {
  biome: BiomeDef;
  isUnlocked: boolean;
  isSelected: boolean;
  ownedCount: number;
  isEn: boolean;
  onSelectBiome: (biomeId: BiomeDef['id']) => void;
}

export const BiomeRow: React.FC<BiomeRowProps> = React.memo(({
  biome,
  isUnlocked,
  isSelected,
  ownedCount,
  isEn,
  onSelectBiome,
}) => {
  return (
    <div
      style={{
        background: biome.bgGradient,
        border: isSelected ? '2px solid var(--accent-glow)' : '1px solid var(--line-soil)',
        borderRadius: '12px',
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        boxShadow: isSelected ? '0 0 16px rgba(183, 224, 138, 0.25)' : 'none',
        opacity: isUnlocked ? 1 : 0.6,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '26px' }}>{biome.icon}</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--root-cream)' }}>
            {isEn ? biome.enName : biome.name} {isSelected && <span style={{ color: 'var(--accent-glow)', fontSize: '10.5px' }}>● {isEn ? 'ACTIVE' : 'ใช้งานอยู่'}</span>}
          </div>
          <div style={{ fontSize: '10.5px', color: 'var(--root-cream-dim)', marginTop: '2px' }}>
            {isEn ? biome.enDesc : biome.desc}
          </div>
          <div style={{ fontSize: '10.5px', color: '#ffd76a', marginTop: '2px', fontWeight: 600 }}>
            ⚡ {isEn ? biome.enAmbientBonusDesc : biome.ambientBonusDesc}
          </div>
          {!isUnlocked && (
            <div style={{ fontSize: '10px', color: '#f59e0b', marginTop: '2px', fontWeight: 600 }}>
              🔒 {isEn ? `Requires ${biome.relicRequiredCount} Relics (Currently: ${ownedCount}/${biome.relicRequiredCount})` : `ต้องการโบราณวัตถุ ${biome.relicRequiredCount} ชิ้น (ตอนนี้มี ${ownedCount}/${biome.relicRequiredCount})`}
            </div>
          )}
        </div>
      </div>

      <button
        disabled={!isUnlocked || isSelected}
        onClick={() => onSelectBiome(biome.id)}
        style={{
          padding: '6px 12px',
          borderRadius: '8px',
          background: isSelected ? 'rgba(183, 224, 138, 0.2)' : isUnlocked ? 'var(--accent-glow)' : 'rgba(255,255,255,0.05)',
          color: isSelected ? 'var(--accent-glow)' : isUnlocked ? '#12190d' : 'var(--root-cream-dim)',
          border: isSelected ? '1px solid var(--accent-glow)' : 'none',
          fontSize: '11px',
          fontWeight: 700,
          cursor: isUnlocked && !isSelected ? 'pointer' : 'default',
          whiteSpace: 'nowrap',
        }}
      >
        {isSelected ? (isEn ? 'ACTIVE ✓' : 'ใช้งานอยู่ ✓') : isUnlocked ? (isEn ? 'Select' : 'เลือกใช้') : (isEn ? 'Locked' : 'ล็อกอยู่')}
      </button>
    </div>
  );
});

BiomeRow.displayName = 'BiomeRow';
