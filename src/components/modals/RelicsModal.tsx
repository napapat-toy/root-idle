'use client';

import React, { useState } from 'react';
import { BiomeId, GameState, Language } from '@/types/game';
import {
  BIOME_DEFS,
  RELIC_DEFS,
  hasRelic,
  isMasterRelicActive,
  relicMult,
  relicsCount,
} from '@/constants/gameData';
import { fmt } from '@/lib/formatters';

interface RelicsModalProps {
  state: GameState;
  onClose: () => void;
  onExcavateRelic: (id: string) => void;
  onSelectBiome: (biomeId: BiomeId) => void;
}

export const RelicsModal: React.FC<RelicsModalProps> = React.memo(({
  state,
  onClose,
  onExcavateRelic,
  onSelectBiome,
}) => {
  const lang: Language = state.lang || 'th';
  const isEn = lang === 'en';
  const [activeTab, setActiveTab] = useState<'relics' | 'biomes'>('relics');

  const ownedCount = relicsCount(state);
  const totalCount = RELIC_DEFS.length;
  const masterActive = isMasterRelicActive(state);
  const activeBiome = state.activeBiome || 'topsoil';

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '560px',
          width: '94vw',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg-panel)',
          border: '1px solid var(--line-soil)',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>🏺</span>
            <div>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--root-cream)' }}>
                {isEn ? 'Subterranean Museum' : 'พิพิธภัณฑ์โบราณคดีใต้พิภพ'}
              </h2>
              <div style={{ fontSize: '12px', color: 'var(--root-cream-dim)' }}>
                {isEn ? `Discovered: ${ownedCount} / ${totalCount} Relics` : `ค้นพบแล้ว: ${ownedCount} / ${totalCount} ชิ้น`}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '20px',
              color: 'var(--root-cream-dim)',
              cursor: 'pointer',
              padding: '4px 8px',
            }}
          >
            ✕
          </button>
        </div>

        {/* Tab Buttons */}
        <div
          style={{
            display: 'flex',
            background: 'var(--bg-panel-2)',
            borderRadius: '10px',
            padding: '3px',
            gap: '4px',
            border: '1px solid var(--line-soil)',
            marginBottom: '14px',
          }}
        >
          <button
            onClick={() => setActiveTab('relics')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '7px',
              border: 'none',
              fontWeight: 600,
              fontSize: '12px',
              cursor: 'pointer',
              background: activeTab === 'relics' ? 'var(--accent-glow)' : 'transparent',
              color: activeTab === 'relics' ? '#12190d' : 'var(--root-cream)',
            }}
          >
            🏺 {isEn ? 'Ancient Relics' : 'โบราณวัตถุ'} ({ownedCount}/{totalCount})
          </button>
          <button
            onClick={() => setActiveTab('biomes')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '7px',
              border: 'none',
              fontWeight: 600,
              fontSize: '12px',
              cursor: 'pointer',
              background: activeTab === 'biomes' ? 'var(--accent-glow)' : 'transparent',
              color: activeTab === 'biomes' ? '#12190d' : 'var(--root-cream)',
            }}
          >
            🖼️ {isEn ? 'Canvas Biomes' : 'ชีวนิเวศฉากหลัง'}
          </button>
        </div>

        {/* Scrollable Container */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {activeTab === 'relics' && (
            <>
              {/* Master Relic Banner */}
              {masterActive && (
                <div
                  style={{
                    background: 'linear-gradient(135deg, rgba(250, 204, 21, 0.2), rgba(245, 158, 11, 0.1))',
                    border: '1px solid #facc15',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: '#facc15',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                >
                  <span style={{ fontSize: '20px' }}>👑</span>
                  <div>
                    <div style={{ fontWeight: 700 }}>
                      {isEn ? 'Heart of Gaia Resonance Active!' : 'พลังจิตวิญญาณแห่งไกอาตื่นรู้!'}
                    </div>
                    <div style={{ fontSize: '11px', opacity: 0.9 }}>
                      {isEn
                        ? 'All other relic passive bonuses are doubled (×2.00) permanently!'
                        : 'พลังของโบราณวัตถุทุกชิ้นทำงานทวีคูณเป็น 2 เท่าถาวร!'}
                    </div>
                  </div>
                </div>
              )}

              {/* Relics Pedestals Grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {RELIC_DEFS.map(relic => {
                  const isOwned = hasRelic(state, relic.id);
                  const canAfford = state.nutrients >= relic.baseCost;
                  const mult = relicMult(state, relic.id);

                  return (
                    <div
                      key={relic.id}
                      style={{
                        background: isOwned
                          ? `linear-gradient(135deg, var(--bg-panel-2) 0%, ${relic.color}15 100%)`
                          : 'var(--bg-panel-2)',
                        border: isOwned ? `1px solid ${relic.color}88` : '1px solid var(--line-soil)',
                        borderLeft: `4px solid ${isOwned ? relic.color : 'var(--line-soil)'}`,
                        borderRadius: '12px',
                        padding: '12px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {/* Left: Icon Pedestal */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                        <div
                          style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: '12px',
                            background: isOwned ? `${relic.color}25` : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${isOwned ? relic.color : 'rgba(255,255,255,0.1)'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '22px',
                            flexShrink: 0,
                            boxShadow: isOwned ? `0 0 12px ${relic.color}33` : 'none',
                          }}
                        >
                          {isOwned ? relic.icon : '❓'}
                        </div>

                        <div style={{ minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontWeight: 700, fontSize: '13.5px', color: isOwned ? 'var(--root-cream)' : 'var(--root-cream-dim)' }}>
                              {isOwned ? relic.name : `${relic.stratum}`}
                            </span>
                            {isOwned && (
                              <span style={{ fontSize: '10.5px', color: relic.color, background: `${relic.color}20`, padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>
                                {relic.depthMeters}m
                              </span>
                            )}
                          </div>

                          <div style={{ fontSize: '11px', color: isOwned ? 'var(--accent-glow)' : 'var(--root-cream-dim)', marginTop: '2px', fontWeight: 500 }}>
                            {isOwned
                              ? `${relic.effectDesc} ${mult > 1 ? `(×${mult} Gaia)` : ''}`
                              : isEn ? `Deeper subterranean stratum (${relic.depthMeters}m)` : `ชั้นดินลึก ${relic.depthMeters} เมตร`}
                          </div>

                          {isOwned && (
                            <div style={{ fontSize: '10.5px', color: 'var(--root-cream-dim)', marginTop: '2px', fontStyle: 'italic' }}>
                              &ldquo;{relic.desc}&rdquo;
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Action or Claimed */}
                      <div>
                        {isOwned ? (
                          <div
                            style={{
                              padding: '5px 10px',
                              borderRadius: '6px',
                              background: `${relic.color}20`,
                              border: `1px solid ${relic.color}66`,
                              color: relic.color,
                              fontSize: '11px',
                              fontWeight: 700,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            ✓ {isEn ? 'OWNED' : 'ครอบครอง'}
                          </div>
                        ) : (
                          <button
                            disabled={!canAfford}
                            onClick={() => onExcavateRelic(relic.id)}
                            style={{
                              padding: '8px 12px',
                              borderRadius: '8px',
                              background: canAfford ? 'var(--accent-glow)' : 'rgba(255,255,255,0.05)',
                              color: canAfford ? '#12190d' : 'var(--root-cream-dim)',
                              border: 'none',
                              fontSize: '11.5px',
                              fontWeight: 700,
                              cursor: canAfford ? 'pointer' : 'not-allowed',
                              whiteSpace: 'nowrap',
                              boxShadow: canAfford ? '0 2px 8px rgba(0,0,0,0.3)' : 'none',
                            }}
                          >
                            ⛏️ {fmt(relic.baseCost)}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {activeTab === 'biomes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '11.5px', color: 'var(--root-cream-dim)', marginBottom: '4px' }}>
                {isEn
                  ? 'Switch active underground biome to customize your Canvas background and receive environmental resonance buffs:'
                  : 'เลือกสลับชั้นชีวนิเวศใต้พิภพเพื่อปรับแต่งฉากหลัง Canvas และรับบัฟสภาพแวดล้อมเฉพาะตัว:'}
              </div>

              {BIOME_DEFS.map(biome => {
                const isUnlocked = ownedCount >= biome.relicRequiredCount;
                const isSelected = activeBiome === biome.id;

                return (
                  <div
                    key={biome.id}
                    style={{
                      background: biome.bgGradient,
                      border: isSelected ? '2px solid var(--accent-glow)' : '1px solid var(--line-soil)',
                      borderRadius: '12px',
                      padding: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      boxShadow: isSelected ? '0 0 16px rgba(183, 224, 138, 0.25)' : 'none',
                      opacity: isUnlocked ? 1 : 0.6,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '28px' }}>{biome.icon}</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--root-cream)' }}>
                          {biome.name} {isSelected && <span style={{ color: 'var(--accent-glow)', fontSize: '11px' }}>● {isEn ? 'ACTIVE' : 'ใช้งานอยู่'}</span>}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--root-cream-dim)', marginTop: '2px' }}>
                          {biome.desc}
                        </div>
                        <div style={{ fontSize: '11px', color: '#ffd76a', marginTop: '2px', fontWeight: 600 }}>
                          ⚡ {biome.ambientBonusDesc}
                        </div>
                        {!isUnlocked && (
                          <div style={{ fontSize: '10.5px', color: '#f59e0b', marginTop: '2px', fontWeight: 600 }}>
                            🔒 {isEn ? `Requires ${biome.relicRequiredCount} Relics (Currently: ${ownedCount}/${biome.relicRequiredCount})` : `ต้องการโบราณวัตถุ ${biome.relicRequiredCount} ชิ้น (ตอนนี้มี ${ownedCount}/${biome.relicRequiredCount})`}
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      disabled={!isUnlocked || isSelected}
                      onClick={() => onSelectBiome(biome.id)}
                      style={{
                        padding: '7px 14px',
                        borderRadius: '8px',
                        background: isSelected ? 'rgba(183, 224, 138, 0.2)' : isUnlocked ? 'var(--accent-glow)' : 'rgba(255,255,255,0.05)',
                        color: isSelected ? 'var(--accent-glow)' : isUnlocked ? '#12190d' : 'var(--root-cream-dim)',
                        border: isSelected ? '1px solid var(--accent-glow)' : 'none',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        cursor: isUnlocked && !isSelected ? 'pointer' : 'default',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {isSelected ? (isEn ? 'ACTIVE ✓' : 'ใช้งานอยู่ ✓') : isUnlocked ? (isEn ? 'Select' : 'เลือกใช้') : (isEn ? 'Locked' : 'ล็อกอยู่')}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

RelicsModal.displayName = 'RelicsModal';
