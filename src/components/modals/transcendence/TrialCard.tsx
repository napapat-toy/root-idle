'use client';

import React from 'react';
import { TrialDef } from '@/types/game';
import { ModalButton } from '@/components/common/ModalButton';

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
          ? '1px solid var(--trials-gold-border)'
          : isCompleted
          ? '1px solid var(--gaia-green-border)'
          : '1px solid var(--card-border)',
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
          <span style={{ fontSize: '12px', color: 'var(--gaia-green)', fontWeight: 700, background: 'var(--gaia-green-bg)', padding: '2px 8px', borderRadius: '6px', flexShrink: 0 }}>
            {completedBadgeText}
          </span>
        )}
        {isActive && !isCompleted && (
          <span style={{ fontSize: '12px', color: 'var(--trials-gold)', fontWeight: 700, background: 'var(--trials-gold-bg)', padding: '2px 8px', borderRadius: '6px', flexShrink: 0 }}>
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
            <span style={{ color: 'var(--gaia-green)', marginLeft: '6px', fontSize: '11px', fontWeight: 600 }}>
              ({isEn ? 'Inactive · Trial Cleared' : 'สิ้นสุดแล้ว · ไม่ส่งผล'})
            </span>
          )}
        </div>
        <div style={{ color: 'var(--gaia-green)' }}>
          <strong>🏆 {isEn ? 'Reward: ' : 'รางวัล: '}</strong>
          {isEn ? def.enRewardDesc : def.rewardDesc}
          {isCompleted && (
            <span style={{ color: 'var(--trials-gold)', fontWeight: 700, marginLeft: '6px', fontSize: '11px' }}>
              ({isEn ? 'Active & Permanent' : 'ทำงานถาวรแล้ว ✨'})
            </span>
          )}
        </div>
        <div style={{ color: isActive ? '#facc15' : isCompleted ? 'var(--gaia-green)' : 'var(--astral-cyan)', marginTop: '2px' }}>
          <strong>🎯 {isEn ? 'Status: ' : 'สถานะ: '}</strong>
          {isActive
            ? (isEn ? `⚔️ In Progress: Grow ${def.targetYggdrasil} Yggdrasil Roots (${curYgg} / ${def.targetYggdrasil} 🌳)` : `⚔️ กำลังทดสอบ: ปลูกรากต้นไม้โลกครบ ${def.targetYggdrasil} ต้น (${curYgg} / ${def.targetYggdrasil} 🌳)`)
            : isCompleted
            ? (isEn ? `✅ Conquered · Repeat clear yields +${def.essenceReward} 🌍 Gaia Essences` : `✅ พิชิตแล้ว · ฟาร์มซ้ำได้รับ +${def.essenceReward} 🌍 ละอองชีวิตทุกครั้ง`)
            : (isEn ? `Goal: Grow ${def.targetYggdrasil} Yggdrasil Roots (Current: ${curYgg} / ${def.targetYggdrasil})` : `เป้าหมาย: ปลูกรากต้นไม้โลกครบ ${def.targetYggdrasil} ต้น (ปัจจุบัน: ${curYgg} / ${def.targetYggdrasil})`)}
        </div>
      </div>

      {/* Action Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
        {isActive ? (
          <ModalButton variant="danger" size="sm" onClick={onAbandonTrial}>
            {abandonBtnText}
          </ModalButton>
        ) : isCompleted ? (
          <ModalButton variant="secondary" size="sm" onClick={() => onSelectTrial(def)}>
            {isEn ? `Re-challenge (+${def.essenceReward} 🌍)` : `ท้าทายซ้ำ (+${def.essenceReward} 🌍)`}
          </ModalButton>
        ) : (
          <ModalButton variant="gold" size="sm" onClick={() => onSelectTrial(def)}>
            {startBtnText}
          </ModalButton>
        )}
      </div>
    </div>
  );
});

TrialCard.displayName = 'TrialCard';
