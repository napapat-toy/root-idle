'use client';

import React from 'react';
import { Language } from '@/types/game';

export interface StatsMultipliersCardProps {
  lang: Language;
  prestigePct: string;
  achPct: string;
  synPct: string;
  biomeRateMult: number;
  baseMult: number;
  basePctFormatted: string;
  echoMult: number;
  echoPct: string;
  vigorLevel: number;
  vigorMult: number;
  relicRateMult: number;
  meditationMult: number;
  trialBonusMult: number;
  trialRateMult: number;
  specialMult: number;
  globalMultFormatted: string;
  totalPctFormatted: string;
  isInTrial?: boolean;
}

export const StatsMultipliersCard: React.FC<StatsMultipliersCardProps> = React.memo(({
  lang,
  prestigePct,
  achPct,
  synPct,
  biomeRateMult,
  baseMult,
  basePctFormatted,
  echoMult,
  echoPct,
  vigorLevel,
  vigorMult,
  relicRateMult,
  meditationMult,
  trialBonusMult,
  trialRateMult,
  specialMult,
  globalMultFormatted,
  totalPctFormatted,
  isInTrial,
}) => {
  const isEn = lang === 'en';

  return (
    <div className="stats-card stats-multipliers-card">
      <div className="stats-card-header">
        <span className="stats-card-icon">⚡</span>
        <span className="stats-card-title">
          {isEn ? 'Production Bonuses & Multiplier Architecture' : 'โครงสร้างโบนัสและตัวคูณการผลิตรวม'}
        </span>
      </div>

      {isInTrial && (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(245, 158, 11, 0.08))',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '11.5px',
            color: '#fca5a5',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            lineHeight: '1.4',
          }}
        >
          <span style={{ fontSize: '16px', flexShrink: 0 }}>⚔️</span>
          <div>
            <strong style={{ color: '#ffffff' }}>
              {isEn ? 'Trial Mode Active: ' : 'กำลังอยู่ระหว่างบททดสอบ: '}
            </strong>
            {isEn
              ? 'External meta-bonuses (Prestige passive, Achievements, Gaia perks, Relics & Biomes) are completely suppressed.'
              : 'โบนัสภายนอกทั้งหมด (พลังรากนิรันดร์, เหรียญความสำเร็จ, พรไกอา, โบราณวัตถุ และไบโอม) ถูกระงับชั่วคราว'}
          </div>
        </div>
      )}

      {/* Two Column Layout: Base Additive vs Special Multipliers */}
      <div className="stats-multipliers-subgrid">
        {/* Box 1: Base Additive Bonuses (กลุ่มบวก %) */}
        <div style={{ background: 'rgba(34, 197, 94, 0.04)', border: '1px solid rgba(34, 197, 94, 0.2)', borderRadius: '8px', padding: '12px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#4ade80', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span>🌿</span> {isEn ? '1. Base Bonuses (Additive %)' : 'ก้อนที่ 1: โบนัสพื้นฐาน (บวกสะสม %)'}
          </div>
          <div className="stats-card-rows" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div className="stats-row">
              <span className="stats-label">{isEn ? 'Prestige Passive Bonus' : 'โบนัสพลังรากนิรันดร์'}:</span>
              <span className="stats-value purple">
                +{prestigePct}% {isInTrial && <span style={{ color: '#f87171', fontSize: '10px' }}>({isEn ? 'Suppressed' : 'ถูกระงับ'})</span>}
              </span>
            </div>
            <div className="stats-row">
              <span className="stats-label">{isEn ? 'Achievement Bonus' : 'โบนัสเหรียญความสำเร็จ'}:</span>
              <span className="stats-value golden">
                +{achPct}% {isInTrial && <span style={{ color: '#f87171', fontSize: '10px' }}>({isEn ? 'Suppressed' : 'ถูกระงับ'})</span>}
              </span>
            </div>
            <div className="stats-row">
              <span className="stats-label">{isEn ? 'Root Networks Bonus' : 'โบนัสเครือข่ายราก'}:</span>
              <span className="stats-value" style={{ color: '#38bdf8' }}>+{synPct}%</span>
            </div>
            {biomeRateMult !== 1 && (
              <div className="stats-row">
                <span className="stats-label">{isEn ? 'Biome Environment Bonus' : 'โบนัสไบโอม'}:</span>
                <span className="stats-value" style={{ color: '#f59e0b' }}>
                  {biomeRateMult > 1 ? '+' : ''}{((biomeRateMult - 1) * 100).toFixed(1)}%
                </span>
              </div>
            )}
          </div>
          {/* Summary of Box 1 */}
          <div style={{ borderTop: '1px dashed rgba(34, 197, 94, 0.25)', marginTop: '8px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--root-cream-dim)' }}>
              {isEn ? 'Base Multiplier Pool:' : 'รวมพลังโบนัสพื้นฐาน:'}
            </span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#4ade80', fontFamily: 'monospace' }}>
              ×{baseMult.toFixed(2)} <span style={{ fontSize: '10.5px', opacity: 0.8, fontWeight: 500 }}>(+{basePctFormatted}%)</span>
            </span>
          </div>
        </div>

        {/* Box 2: Special Multipliers (กลุ่มคูณ x) */}
        <div style={{ background: 'rgba(245, 158, 11, 0.04)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '8px', padding: '12px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#fbbf24', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span>⚡</span> {isEn ? '2. Special Multipliers (Independent x)' : 'ก้อนที่ 2: ตัวคูณพิเศษ (คูณทบ ×)'}
          </div>
          <div className="stats-card-rows" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div className="stats-row">
              <span className="stats-label">{isEn ? 'Root Echo Bonus' : 'โบนัสสะท้อนราก'}:</span>
              <span className="stats-value green" style={{ fontWeight: 700 }}>
                ×{echoMult.toFixed(2)} <span style={{ opacity: 0.7, fontSize: '10.5px', fontWeight: 500 }}>(+{echoPct}%)</span>
              </span>
            </div>
            {vigorLevel > 0 && (
              <div className="stats-row">
                <span className="stats-label">{isEn ? 'Gaia Primordial Vigor' : 'แกนพลังปฐมกาล (ไกอา)'}:</span>
                <span className="stats-value" style={{ color: '#34d399', fontWeight: 700 }}>
                  ×{vigorMult.toFixed(2)} <span style={{ opacity: 0.7, fontSize: '10.5px', fontWeight: 500 }}>(Lv. {vigorLevel})</span>
                </span>
              </div>
            )}
            {relicRateMult > 1 && (
              <div className="stats-row">
                <span className="stats-label">{isEn ? 'Relics Multiplier' : 'ตัวคูณจากโบราณวัตถุ'}:</span>
                <span className="stats-value highlight" style={{ color: 'var(--accent-glow)', fontWeight: 700 }}>
                  ×{relicRateMult.toFixed(2)}
                </span>
              </div>
            )}
            {meditationMult > 1 && (
              <div className="stats-row">
                <span className="stats-label">{isEn ? 'Deep Meditation' : 'สมาธิลึกแห่งไกอา'}:</span>
                <span className="stats-value" style={{ color: '#a78bfa', fontWeight: 700 }}>
                  ×{meditationMult.toFixed(2)}
                </span>
              </div>
            )}
            {trialBonusMult > 1 && (
              <div className="stats-row">
                <span className="stats-label">{isEn ? 'Trials Master Bonus' : 'โบนัสพิชิตบททดสอบ'}:</span>
                <span className="stats-value" style={{ color: '#facc15', fontWeight: 700 }}>
                  ×{trialBonusMult.toFixed(2)}
                </span>
              </div>
            )}
            {trialRateMult !== 1 && (
              <div className="stats-row">
                <span className="stats-label">{isEn ? 'Active Trial Effect' : 'ผลจากบททดสอบที่ทำอยู่'}:</span>
                <span className="stats-value" style={{ color: trialRateMult < 1 ? '#f87171' : '#4ade80', fontWeight: 700 }}>
                  ×{trialRateMult.toFixed(2)}
                </span>
              </div>
            )}
          </div>
          {/* Summary of Box 2 */}
          <div style={{ borderTop: '1px dashed rgba(245, 158, 11, 0.25)', marginTop: '8px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--root-cream-dim)' }}>
              {isEn ? 'Special Product Multiplier:' : 'รวมตัวคูณพิเศษทบ:'}
            </span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#fbbf24', fontFamily: 'monospace' }}>
              ×{specialMult.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Grand Summary Banner (ก้อนสรุปรวมทั้งหมดไว้ล่างสุด) */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(255, 215, 106, 0.08) 0%, rgba(245, 158, 11, 0.12) 100%)',
        border: '1px solid rgba(255, 215, 106, 0.35)',
        borderRadius: '8px',
        padding: '12px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--root-cream)' }}>
            ✨ {isEn ? 'Total Global Multiplier (All Farm)' : 'ตัวคูณพลังผลิตรวมทั้งฟาร์ม (Global Multiplier)'}:
          </span>
          <span style={{ fontSize: '17px', fontWeight: 800, fontFamily: 'monospace', color: '#ffd76a', textShadow: '0 0 10px rgba(255, 215, 106, 0.3)' }}>
            ×{globalMultFormatted} <span style={{ fontSize: '12px', opacity: 0.85, fontWeight: 500 }}>(+{totalPctFormatted}%)</span>
          </span>
        </div>
        
        {/* Visual calculation chain */}
        <div style={{
          fontSize: '11.5px',
          color: 'var(--root-cream-dim)',
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '6px',
          padding: '6px 10px',
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '6px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }}>
          <span style={{ opacity: 0.8 }}>{isEn ? 'Calculation:' : 'สูตรคำนวณ:'}</span>
          <span style={{ color: '#4ade80', fontWeight: 600, background: 'rgba(34, 197, 94, 0.15)', padding: '1px 6px', borderRadius: '4px' }}>
            {isEn ? 'Base' : 'โบนัสพื้นฐาน'} ×{baseMult.toFixed(2)}
          </span>
          <span style={{ fontWeight: 700, color: '#ffd76a' }}>×</span>
          <span style={{ color: '#fbbf24', fontWeight: 600, background: 'rgba(245, 158, 11, 0.15)', padding: '1px 6px', borderRadius: '4px' }}>
            {isEn ? 'Special' : 'ตัวคูณพิเศษ'} ×{specialMult.toFixed(2)}
          </span>
          <span style={{ fontWeight: 700, color: '#ffd76a' }}>=</span>
          <span style={{ color: '#ffd76a', fontWeight: 700, background: 'rgba(255, 215, 106, 0.2)', padding: '1px 6px', borderRadius: '4px' }}>
            ×{globalMultFormatted}
          </span>
        </div>
      </div>
    </div>
  );
});

StatsMultipliersCard.displayName = 'StatsMultipliersCard';
