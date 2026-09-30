'use client';

import React from 'react';
import { PactDef } from '@/types/game';

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
      role="button"
      tabIndex={disabled ? -1 : 0}
      className={`pact-card ${isActive ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={!disabled ? onToggle : undefined}
      onKeyDown={(e) => {
        if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onToggle();
        }
      }}
      title={disabled ? (isEn ? 'Cannot toggle pacts during Trials' : 'ไม่สามารถปรับพันธสัญญาได้ระหว่างการทดสอบ') : (isEn ? (isActive ? 'Click to deselect for next run' : 'Click to select for next run') : (isActive ? 'คลิกเพื่อยกเลิกสำหรับรอบถัดไป' : 'คลิกเพื่อเลือกสำหรับรอบถัดไป'))}
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
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: '24px', flexShrink: 0 }}>{def.icon}</span>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 700, fontSize: '14.5px', color: isActive ? 'var(--trials-gold)' : '#ffffff' }}>
                {isEn ? def.enName : def.name}
              </span>
              {isActive && (
                <span
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 600,
                    padding: '1px 6px',
                    borderRadius: '4px',
                    background: 'rgba(74, 222, 128, 0.15)',
                    color: '#4ade80',
                    border: '1px solid rgba(74, 222, 128, 0.3)',
                    letterSpacing: '0.02em',
                  }}
                >
                  {isEn ? 'Takes effect after reset' : 'มีผลหลังรีเซต'}
                </span>
              )}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--root-cream-dim)' }}>
              {isEn ? def.enDesc : def.desc}
            </div>
          </div>
        </div>

        {/* Status Indicator: Green Checkmark when Active, Muted Gray Dot when Inactive */}
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'all 0.2s ease',
            background: isActive ? 'rgba(74, 222, 128, 0.16)' : 'rgba(255, 255, 255, 0.04)',
            border: isActive ? '1.5px solid #4ade80' : '1.5px solid rgba(255, 255, 255, 0.18)',
            boxShadow: isActive ? '0 0 10px rgba(74, 222, 128, 0.35)' : 'none',
          }}
        >
          {isActive ? (
            <span style={{ fontSize: '16px', fontWeight: 900, color: '#4ade80', lineHeight: 1 }}>✓</span>
          ) : (
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.28)',
                display: 'inline-block',
              }}
            />
          )}
        </div>
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
