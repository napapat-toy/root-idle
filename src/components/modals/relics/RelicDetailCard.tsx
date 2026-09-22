'use client';

import React from 'react';
import { GameState, RelicDef, RelicRarity } from '@/types/game';
import { RELIC_RARITY_INFO, relicCycleResonanceStack } from '@/constants/gameData';

type RelicRarityInfo = typeof RELIC_RARITY_INFO[RelicRarity];

interface RelicDetailCardProps {
  state: GameState;
  relic: RelicDef;
  count: number;
  isMaxed: boolean;
  rarityInfo: RelicRarityInfo;
  mult: number;
  masterActive: boolean;
  isEn: boolean;
}

export const RelicDetailCard: React.FC<RelicDetailCardProps> = React.memo(({
  state,
  relic,
  count,
  isMaxed: _isMaxed,
  rarityInfo,
  mult,
  masterActive,
  isEn,
}) => {
  const isOwned = count > 0;

  return (
    <div
      style={{
        background: isOwned
          ? `linear-gradient(135deg, var(--bg-panel-2) 0%, ${relic.color}15 100%)`
          : 'var(--bg-panel-2)',
        border: isOwned ? `1px solid ${relic.color}88` : '1px solid var(--line-soil)',
        borderLeft: `5px solid ${isOwned ? relic.color : rarityInfo.color}`,
        borderRadius: '12px',
        padding: '10px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '7px',
        marginTop: '2px',
        width: '100%',
        boxSizing: 'border-box',
        minWidth: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '9px',
              background: isOwned ? `${relic.color}25` : 'rgba(255,255,255,0.04)',
              border: `1px solid ${isOwned ? relic.color : 'rgba(255,255,255,0.1)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              flexShrink: 0,
              boxShadow: isOwned ? `0 0 10px ${relic.color}33` : 'none',
            }}
          >
            {isOwned ? relic.icon : '🏺'}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: 'clamp(12px, 3.2vw, 13.5px)',
                  color: isOwned ? 'var(--root-cream)' : 'var(--root-cream-dim)',
                  wordBreak: 'break-word',
                }}
              >
                {isOwned ? (isEn ? relic.enName : relic.name) : (isEn ? 'Undiscovered Relic' : 'โบราณวัตถุลึกลับ')}
              </span>
              <span
                style={{
                  fontSize: '9.5px',
                  color: rarityInfo.color,
                  background: rarityInfo.badgeBg,
                  border: `1px solid ${rarityInfo.color}55`,
                  padding: '1px 6px',
                  borderRadius: '4px',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {rarityInfo.icon} {isEn ? rarityInfo.enName : rarityInfo.name}
              </span>
            </div>
            <div style={{ fontSize: '10.5px', color: 'var(--root-cream-dim)', marginTop: '1px' }}>
              {isEn ? `Rarity: ${rarityInfo.enName}` : `ระดับความหายาก: ${rarityInfo.name}`}
            </div>
          </div>
        </div>

        <div
          style={{
            padding: '3px 8px',
            borderRadius: '6px',
            background: isOwned ? 'rgba(250, 204, 21, 0.15)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${isOwned ? '#facc15' : 'rgba(255,255,255,0.1)'}`,
            color: isOwned ? '#facc15' : 'var(--root-cream-dim)',
            fontSize: '10.5px',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          {isOwned
            ? (isEn ? '✓ OWNED' : '✓ ครอบครองแล้ว')
            : (isEn ? '🔒 UNDISCOVERED' : '🔒 ยังไม่ค้นพบ')}
        </div>
      </div>

      {/* Cycle Resonance Section (Only for Magmastone) */}
      {isOwned && relic.id === 'magmastone' && (
        <div style={{ marginTop: '1px' }}>
          <div
            style={{
              background: 'rgba(249, 115, 22, 0.12)',
              border: '1px solid rgba(249, 115, 22, 0.35)',
              borderRadius: '8px',
              padding: '6px 10px',
              fontSize: '10.5px',
              lineHeight: '1.4',
            }}
          >
            <div style={{ color: '#f97316', fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
              <span>🔥 {isEn ? 'Cycle Resonance Stack' : 'สะสมพลังการเวียนว่าย'}:</span>
              <span>+{relicCycleResonanceStack(state)}% {masterActive ? '(Cap ×2)' : ''}</span>
            </div>
            <div style={{ color: 'var(--root-cream-dim)', fontSize: '9.5px', marginTop: '2px' }}>
              {isEn
                ? `Prestige ×${state.stats?.prestigeCount || 0} (+${state.stats?.prestigeCount || 0}%) · Transcendence ×${state.transcendence?.count || 0} (+${(state.transcendence?.count || 0) * 3}%)`
                : `หว่านใหม่ ${state.stats?.prestigeCount || 0} ครั้ง (+${state.stats?.prestigeCount || 0}%) · ตื่นรู้ ${state.transcendence?.count || 0} ครั้ง (+${(state.transcendence?.count || 0) * 3}%)`}
            </div>
          </div>
        </div>
      )}

      {/* Primary Passive Bonus Effect */}
      <div
        style={{
          background: isOwned ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0.15)',
          borderRadius: '8px',
          padding: '8px 10px',
          fontSize: 'clamp(10.5px, 2.7vw, 11.5px)',
          color: isOwned ? '#ffd76a' : 'var(--root-cream-dim)',
          fontWeight: 600,
          border: '1px solid rgba(255, 255, 255, 0.06)',
          lineHeight: '1.4',
        }}
      >
        {isOwned ? (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
            <span style={{ color: relic.color, flexShrink: 0 }}>⚡</span>
            <div>
              <span>{isEn ? relic.enEffectDesc : relic.effectDesc}</span>
              {mult > 1 && (
                <div style={{ fontSize: '10px', color: '#facc15', marginTop: '2px', fontWeight: 700 }}>
                  ✨ {isEn ? `Gaia Heart Doubled Effect (×${mult.toFixed(2)})` : `ผลคูณสองจากจิตวิญญาณแห่งไกอา (×${mult.toFixed(2)})`}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            🔍 {isEn ? 'Ancient power remains dormant underground.' : 'คุณสมบัติจะปรากฏเมื่อขุดพบใต้พิภพ'}
          </div>
        )}
      </div>

      {/* Lore or Discovery Clue */}
      <div
        style={{
          fontSize: 'clamp(9.5px, 2.5vw, 10.5px)',
          color: 'var(--root-cream-dim)',
          fontStyle: 'italic',
          lineHeight: '1.4',
          wordBreak: 'break-word',
          boxSizing: 'border-box',
          width: '100%',
        }}
      >
        {isOwned ? (
          <>&ldquo;{isEn ? relic.enDesc : relic.desc}&rdquo;</>
        ) : (
          <>
            {isEn
              ? '🌱 Hint: Keep roots expanding deep or roll Lucky Jackpots to discover.'
              : '🌱 คำใบ้: ขยายรากให้ลึกและกว้าง หรือหมุน Lucky Jackpot เพื่อตามหาโบราณวัตถุชิ้นนี้'}
          </>
        )}
      </div>
    </div>
  );
});

RelicDetailCard.displayName = 'RelicDetailCard';
