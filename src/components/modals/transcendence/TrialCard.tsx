'use client';

import React from 'react';
import { TrialDef } from '@/types/game';

interface TrialCardProps {
  def: TrialDef;
  isActive: boolean;
  isCompleted: boolean;
  curYgg: number;
  isEn: boolean;
  completedBadgeText: string;
  activeBadgeText: string;
  abandonBtnText: string;
  startBtnText: string;
  onAbandonTrial: () => void;
  onSelectTrial: (def: TrialDef) => void;
}

export const TrialCard: React.FC<TrialCardProps> = React.memo(({
  def,
  isActive,
  isCompleted,
  curYgg,
  isEn,
  completedBadgeText,
  activeBadgeText,
  abandonBtnText,
  startBtnText,
  onAbandonTrial,
  onSelectTrial,
}) => {
  return (
    <div
      style={{
        background: isActive
          ? 'linear-gradient(135deg, rgba(234, 179, 8, 0.12), rgba(249, 115, 22, 0.08))'
          : 'var(--bg-panel-2)',
        border: isActive
          ? '1px solid rgba(234, 179, 8, 0.4)'
          : isCompleted
          ? '1px solid rgba(52, 211, 153, 0.3)'
          : '1px solid rgba(255,255,255,0.08)',
        borderRadius: '12px',
        padding: '14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: '24px', flexShrink: 0 }}>{def.icon}</span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: '15px' }}>{isEn ? def.enName : def.name}</div>
            <div style={{ fontSize: '11px', color: 'var(--root-cream-dim)' }}>{isEn ? def.enDesc : def.desc}</div>
          </div>
        </div>
        {isCompleted && (
          <span style={{ fontSize: '12px', color: '#34d399', fontWeight: 700, background: 'rgba(52, 211, 153, 0.15)', padding: '2px 8px', borderRadius: '6px', flexShrink: 0 }}>
            {completedBadgeText}
          </span>
        )}
        {isActive && !isCompleted && (
          <span style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 700, background: 'rgba(245, 158, 11, 0.15)', padding: '2px 8px', borderRadius: '6px', flexShrink: 0 }}>
            {activeBadgeText}
          </span>
        )}
      </div>

      {/* Restriction & Reward */}
      <div style={{ fontSize: '12px', background: 'rgba(0,0,0,0.2)', padding: '8px 10px', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ color: '#f87171' }}>
          <strong>⚠️ {isEn ? 'Restriction: ' : 'ข้อจำกัด: '}</strong>
          {isEn ? def.enRestrictionDesc : def.restrictionDesc}
          {isCompleted && (
            <span style={{ color: '#34d399', marginLeft: '6px', fontSize: '11px', fontWeight: 600 }}>
              ({isEn ? 'Inactive · Trial Cleared' : 'สิ้นสุดแล้ว · ไม่ส่งผล'})
            </span>
          )}
        </div>
        <div style={{ color: '#34d399' }}>
          <strong>🏆 {isEn ? 'Reward: ' : 'รางวัล: '}</strong>
          {isEn ? def.enRewardDesc : def.rewardDesc}
          {isCompleted && (
            <span style={{ color: '#ffd76a', fontWeight: 700, marginLeft: '6px', fontSize: '11px' }}>
              ({isEn ? 'Active & Permanent' : 'ทำงานถาวรแล้ว ✨'})
            </span>
          )}
        </div>
        <div style={{ color: isCompleted ? '#34d399' : '#38bdf8', marginTop: '2px' }}>
          <strong>🎯 {isEn ? 'Status: ' : 'สถานะ: '}</strong>
          {isCompleted
            ? (isEn ? '✅ Conquered (One-time reward permanently unlocked)' : '✅ พิชิตสำเร็จแล้ว (ปลดล็อกรางวัลถาวรเรียบร้อยแล้ว)')
            : (isEn ? `Goal: Grow 25 Yggdrasil Roots (Current: ${curYgg} / 25)` : `เป้าหมาย: ปลูกรากต้นไม้โลกครบ 25 ต้น (ปัจจุบัน: ${curYgg} / 25)`)}
        </div>
      </div>

      {/* Action Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
        {isActive ? (
          <button
            onClick={onAbandonTrial}
            style={{
              background: '#ef4444',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 14px',
              fontWeight: 700,
              fontSize: '12px',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            {abandonBtnText}
          </button>
        ) : isCompleted ? (
          <button
            onClick={() => onSelectTrial(def)}
            title={isEn
              ? 'You have already unlocked this permanent reward. Starting again is for optional challenge only.'
              : 'คุณได้รับรางวัลถาวรเรียบร้อยแล้ว การเริ่มทดสอบซ้ำเป็นการท้าทายตนเองเท่านั้น (ไม่ได้รับรางวัลซ้ำ)'}
            style={{
              background: 'rgba(52, 211, 153, 0.12)',
              color: '#34d399',
              border: '1px solid rgba(52, 211, 153, 0.35)',
              borderRadius: '8px',
              padding: '6px 14px',
              fontWeight: 700,
              fontSize: '12px',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            ✓ {isEn ? 'Conquered (Replay Challenge)' : 'พิชิตแล้ว (ท้าทายซ้ำ)'}
          </button>
        ) : (
          <button
            onClick={() => onSelectTrial(def)}
            style={{
              background: 'linear-gradient(135deg, #eab308, #ca8a04)',
              color: '#1c150b',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 14px',
              fontWeight: 700,
              fontSize: '12px',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            {startBtnText}
          </button>
        )}
      </div>
    </div>
  );
});

TrialCard.displayName = 'TrialCard';
