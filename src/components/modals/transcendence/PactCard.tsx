'use client';

import React from 'react';
import { PactDef } from '@/types/game';
import { ModalButton } from '@/components/common/ModalButton';

interface PactCardProps {
  def: PactDef;
  isActive: boolean;
  isEn: boolean;
  disabled?: boolean;
  onToggle: () => void;
}

export const PactCard: React.FC<PactCardProps> = React.memo(({
  def,
  isActive,
  isEn,
  disabled,
  onToggle,
}) => {
  return (
    <div
      style={{
        background: isActive
          ? 'linear-gradient(135deg, rgba(234, 179, 8, 0.12), rgba(168, 85, 247, 0.08))'
          : 'var(--bg-panel-2)',
        border: isActive
          ? '1px solid var(--trials-gold-border)'
          : '1px solid var(--card-border)',
        borderRadius: '12px',
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        transition: 'all 0.2s ease',
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: '24px', flexShrink: 0 }}>{def.icon}</span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: '14.5px', color: isActive ? 'var(--trials-gold)' : '#ffffff' }}>
              {isEn ? def.enName : def.name}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--root-cream-dim)' }}>
              {isEn ? def.enDesc : def.desc}
            </div>
          </div>
        </div>

        <ModalButton
          variant={isActive ? 'gold' : 'secondary'}
          size="sm"
          onClick={onToggle}
          disabled={disabled}
          style={{ minWidth: '95px' }}
        >
          {isActive
            ? (isEn ? '✓ Active' : '✓ เปิดใช้งาน')
            : (isEn ? 'Inactive' : 'ปิด')}
        </ModalButton>
      </div>

      {/* Handicap & Reward Box */}
      <div
        style={{
          fontSize: '11.5px',
          background: 'rgba(0,0,0,0.22)',
          padding: '8px 10px',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}
      >
        <div style={{ color: '#f87171', lineHeight: '1.4' }}>
          <strong>⚠️ {isEn ? 'Handicap: ' : 'ข้อจำกัด: '}</strong>
          {isEn ? def.enHandicapDesc : def.handicapDesc}
        </div>
        <div style={{ color: 'var(--gaia-green)', lineHeight: '1.4' }}>
          <strong>🎁 {isEn ? 'Reward: ' : 'ผลตอบแทน: '}</strong>
          {isEn ? def.enRewardDesc : def.rewardDesc}
        </div>
      </div>
    </div>
  );
});

PactCard.displayName = 'PactCard';
