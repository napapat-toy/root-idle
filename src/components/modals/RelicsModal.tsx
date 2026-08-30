'use client';

import React, { useState } from 'react';
import { BiomeId, GameState, Language, RelicDef } from '@/types/game';
import {
  BIOME_DEFS,
  RELIC_DEFS,
  RELIC_RARITY_INFO,
  hasRelic,
  isMasterRelicActive,
  relicMult,
  relicsCount,
} from '@/constants/gameData';

interface RelicsModalProps {
  state: GameState;
  onClose: () => void;
  onSelectBiome: (biomeId: BiomeId) => void;
  onExcavateRelic?: (id: string) => void;
}

export const RelicsModal: React.FC<RelicsModalProps> = React.memo(({
  state,
  onClose,
  onSelectBiome,
}) => {
  const lang: Language = state.lang || 'th';
  const isEn = lang === 'en';
  const [activeTab, setActiveTab] = useState<'relics' | 'biomes'>('relics');
  const [selectedRelicId, setSelectedRelicId] = useState<string>(RELIC_DEFS[0].id);

  const ownedCount = relicsCount(state);
  const totalCount = RELIC_DEFS.length;
  const masterActive = isMasterRelicActive(state);
  const activeBiome = state.activeBiome || 'topsoil';

  const selectedRelic: RelicDef = RELIC_DEFS.find(r => r.id === selectedRelicId) || RELIC_DEFS[0];
  const isSelectedOwned = hasRelic(state, selectedRelic.id);
  const selectedRarityInfo = RELIC_RARITY_INFO[selectedRelic.rarity];
  const selectedMult = relicMult(state, selectedRelic.id);

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '540px',
          width: '94vw',
          maxHeight: '90vh',
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
            🏺 {isEn ? 'Ancient Relics' : 'ตู้โชว์โบราณวัตถุ'} ({ownedCount}/{totalCount})
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
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {activeTab === 'relics' && (
            <>
              {/* Discovery Guidance Banner */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--line-soil)',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '11.5px',
                  color: 'var(--root-cream-dim)',
                  lineHeight: '1.4',
                }}
              >
                <span style={{ fontSize: '16px' }}>⛏️</span>
                <span>
                  {isEn
                    ? 'Relics are unearthed serendipitously as roots spread deep (~40-50 min), or have a 20% chance on Lucky Jackpot!'
                    : 'โบราณวัตถุจะสุ่มพบในดินใต้พิภพขณะรากเติบโต (~40-50 นาที) หรือมีโอกาสพบ 20% เมื่อหมุนได้ Lucky Jackpot!'}
                </span>
              </div>

              {/* Master Relic Gaia Banner if active */}
              {masterActive && (
                <div
                  style={{
                    background: 'linear-gradient(135deg, rgba(250, 204, 21, 0.2), rgba(245, 158, 11, 0.1))',
                    border: '1px solid #facc15',
                    borderRadius: '10px',
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: '#facc15',
                    fontSize: '11.5px',
                    fontWeight: 600,
                  }}
                >
                  <span style={{ fontSize: '18px' }}>👑</span>
                  <div>
                    <div style={{ fontWeight: 700 }}>
                      {isEn ? 'Heart of Gaia Resonance Active!' : 'พลังจิตวิญญาณแห่งไกอาตื่นรู้!'}
                    </div>
                    <div style={{ fontSize: '10.5px', opacity: 0.9 }}>
                      {isEn
                        ? 'All relic passive bonuses are doubled (×2.00) permanently!'
                        : 'พลังของโบราณวัตถุทุกชิ้นทำงานทวีคูณเป็น 2 เท่าถาวร!'}
                    </div>
                  </div>
                </div>
              )}

              {/* Square Pedestal Showcase Grid (5 columns) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  gap: '8px',
                }}
              >
                {RELIC_DEFS.map(relic => {
                  const isOwned = hasRelic(state, relic.id);
                  const isSelected = relic.id === selectedRelicId;
                  const rarityInfo = RELIC_RARITY_INFO[relic.rarity];

                  return (
                    <button
                      key={relic.id}
                      onClick={() => setSelectedRelicId(relic.id)}
                      style={{
                        aspectRatio: '1 / 1',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        padding: '6px 4px',
                        borderRadius: '12px',
                        background: isOwned
                          ? `linear-gradient(135deg, var(--bg-panel-2) 0%, ${relic.color}22 100%)`
                          : 'var(--bg-panel-2)',
                        border: isSelected
                          ? `2px solid ${isOwned ? relic.color : rarityInfo.color}`
                          : isOwned
                          ? `1px solid ${relic.color}66`
                          : '1px solid var(--line-soil)',
                        boxShadow: isSelected
                          ? `0 0 14px ${isOwned ? relic.color : rarityInfo.color}55`
                          : isOwned
                          ? `0 0 8px ${relic.color}22`
                          : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        outline: 'none',
                      }}
                    >
                      {/* Top Rarity Pip */}
                      <span
                        style={{
                          position: 'absolute',
                          top: '4px',
                          right: '4px',
                          fontSize: '10px',
                          lineHeight: 1,
                        }}
                      >
                        {rarityInfo.icon}
                      </span>

                      {/* Main Icon */}
                      <span
                        style={{
                          fontSize: '26px',
                          filter: isOwned ? 'none' : 'grayscale(100%) opacity(35%)',
                          transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                          transition: 'transform 0.15s ease',
                        }}
                      >
                        {isOwned ? relic.icon : '❓'}
                      </span>

                      {/* Name or Mystery label */}
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 600,
                          color: isOwned ? 'var(--root-cream)' : 'var(--root-cream-dim)',
                          marginTop: '4px',
                          textAlign: 'center',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '90%',
                        }}
                      >
                        {isOwned ? relic.name : '???'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Inspection Spotlight Detail Card */}
              <div
                style={{
                  background: isSelectedOwned
                    ? `linear-gradient(135deg, var(--bg-panel-2) 0%, ${selectedRelic.color}15 100%)`
                    : 'var(--bg-panel-2)',
                  border: isSelectedOwned ? `1px solid ${selectedRelic.color}88` : '1px solid var(--line-soil)',
                  borderLeft: `5px solid ${isSelectedOwned ? selectedRelic.color : selectedRarityInfo.color}`,
                  borderRadius: '12px',
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  marginTop: '4px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        background: isSelectedOwned ? `${selectedRelic.color}25` : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${isSelectedOwned ? selectedRelic.color : 'rgba(255,255,255,0.1)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '22px',
                        boxShadow: isSelectedOwned ? `0 0 12px ${selectedRelic.color}33` : 'none',
                      }}
                    >
                      {isSelectedOwned ? selectedRelic.icon : '❓'}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: 700, fontSize: '14px', color: isSelectedOwned ? 'var(--root-cream)' : 'var(--root-cream-dim)' }}>
                          {isSelectedOwned ? selectedRelic.name : (isEn ? 'Unidentified Relic' : 'โบราณวัตถุลึกลับ')}
                        </span>
                        <span
                          style={{
                            fontSize: '10px',
                            color: selectedRarityInfo.color,
                            background: selectedRarityInfo.badgeBg,
                            border: `1px solid ${selectedRarityInfo.color}55`,
                            padding: '1px 6px',
                            borderRadius: '4px',
                            fontWeight: 700,
                          }}
                        >
                          {selectedRarityInfo.icon} {isEn ? selectedRarityInfo.enName : selectedRarityInfo.name}
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--root-cream-dim)' }}>
                        {isEn ? `Rarity Tier: ${selectedRarityInfo.enName}` : `ระดับความหายาก: ${selectedRarityInfo.name}`}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: isSelectedOwned ? `${selectedRelic.color}20` : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${isSelectedOwned ? selectedRelic.color : 'rgba(255,255,255,0.1)'}`,
                      color: isSelectedOwned ? selectedRelic.color : 'var(--root-cream-dim)',
                      fontSize: '11px',
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {isSelectedOwned ? (isEn ? '✓ FOUND' : '✓ ค้นพบแล้ว') : (isEn ? '🔒 UNDISCOVERED' : '🔒 ยังไม่ค้นพบ')}
                  </div>
                </div>

                {/* Effect Details */}
                <div
                  style={{
                    background: 'rgba(0,0,0,0.2)',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: isSelectedOwned ? 'var(--accent-glow)' : 'var(--root-cream-dim)',
                  }}
                >
                  {isSelectedOwned ? (
                    <>
                      ⚡ {selectedRelic.effectDesc} {selectedMult > 1 && <span style={{ color: '#facc15' }}>(×{selectedMult} Gaia Active!)</span>}
                    </>
                  ) : (
                    <>
                      🔍 {isEn ? 'Effect unknown until unearthed from the soil.' : 'คุณสมบัติจะปรากฏเมื่อขุดพบใต้พิภพ'}
                    </>
                  )}
                </div>

                {/* Lore or Discovery Clue */}
                <div style={{ fontSize: '11px', color: 'var(--root-cream-dim)', fontStyle: 'italic', lineHeight: '1.4' }}>
                  {isSelectedOwned ? (
                    <>&ldquo;{selectedRelic.desc}&rdquo;</>
                  ) : (
                    <>
                      {isEn
                        ? '🌱 Hint: Keep roots expanding or roll Lucky Jackpots to uncover this artifact.'
                        : '🌱 คำใบ้: ขยายรากให้ลึกและกว้าง หรือหมุน Lucky Jackpot เพื่อตามหาโบราณวัตถุชิ้นนี้'}
                    </>
                  )}
                </div>
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
