'use client';

import React, { useState } from 'react';
import { BiomeId, GameState, Language, RelicDef } from '@/types/game';
import {
  BIOME_DEFS,
  RELIC_DEFS,
  RELIC_RARITY_INFO,
  hasRelic,
  isMasterRelicActive,
  relicCount,
  relicMaxed,
  relicMult,
  relicsCount,
  totalRelicFragmentsCount,
} from '@/constants/gameData';
import { t } from '@/lib/i18n';

interface RelicsModalProps {
  state: GameState;
  onClose: () => void;
  onSelectBiome: (biomeId: BiomeId) => void;
}

export const RelicsModal: React.FC<RelicsModalProps> = React.memo(({
  state,
  onClose,
  onSelectBiome,
}) => {
  const lang: Language = state.lang || 'th';
  const isEn = lang === 'en';
  const tr = t(lang);
  const [activeTab, setActiveTab] = useState<'relics' | 'biomes'>('relics');
  const [selectedRelicId, setSelectedRelicId] = useState<string>(RELIC_DEFS[0].id);

  const ownedCount = relicsCount(state);
  const totalFragments = totalRelicFragmentsCount(state);
  const totalCount = RELIC_DEFS.length;
  const masterActive = isMasterRelicActive(state);
  const activeBiome = state.activeBiome || 'topsoil';

  const selectedRelic: RelicDef = RELIC_DEFS.find(r => r.id === selectedRelicId) || RELIC_DEFS[0];
  const selectedCount = relicCount(state, selectedRelic.id);
  const isSelectedOwned = selectedCount > 0;
  const isSelectedMaxed = relicMaxed(state, selectedRelic.id);
  const selectedRarityInfo = RELIC_RARITY_INFO[selectedRelic.rarity];
  const selectedMult = relicMult(state, selectedRelic.id);

  return (
    <div className="offline-backdrop" onClick={onClose} style={{ zIndex: 2100 }}>
      <div
        className="modal-wrapper"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '560px', width: '100%' }}
      >
        <button className="modal-close-x" onClick={onClose} aria-label={tr.close}>
          &times;
        </button>

        <div className="offline-modal generic-modal" style={{ padding: '20px 24px', maxHeight: '88vh', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div className="icon" style={{ fontSize: '32px', marginBottom: '6px' }}>🏺</div>
          <h2 style={{ marginBottom: '4px' }}>
            {isEn ? 'Subterranean Museum' : 'พิพิธภัณฑ์โบราณคดีใต้พิภพ'}
          </h2>
          <div className="away-time" style={{ marginBottom: '14px', fontSize: '12px' }}>
            {isEn
              ? `Discovered: ${ownedCount} / ${totalCount} Types (${totalFragments} Fragments Collected)`
              : `ค้นพบแล้ว: ${ownedCount} / ${totalCount} ชนิด (${totalFragments} ชิ้นส่วนสะสม)`}
          </div>

          {/* Tab Switcher */}
          <div
            style={{
              display: 'flex',
              background: 'var(--bg-panel-2)',
              borderRadius: '10px',
              padding: '3px',
              gap: '4px',
              border: '1px solid var(--line-soil)',
              marginBottom: '14px',
              flexShrink: 0,
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
                transition: 'all 0.15s ease',
              }}
            >
              🏺 {isEn ? 'Relic Showcase' : 'ตู้โชว์โบราณวัตถุ'} ({ownedCount}/{totalCount})
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
                transition: 'all 0.15s ease',
              }}
            >
              🖼️ {isEn ? 'Canvas Biomes' : 'ชีวนิเวศฉากหลัง'}
            </button>
          </div>

          {/* Scrollable Body */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '2px' }}>
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
                    fontSize: '11px',
                    color: 'var(--root-cream-dim)',
                    lineHeight: '1.4',
                  }}
                >
                  <span style={{ fontSize: '16px' }}>⛏️</span>
                  <span>
                    {isEn
                      ? 'Relics are unearthed serendipitously as roots grow (~40-50 min), or have a 20% drop chance on Lucky Jackpot!'
                      : 'โบราณวัตถุจะสุ่มพบใต้ดินขณะรากเติบโต (~40-50 นาที) หรือมีโอกาสพบ 20% เมื่อหมุนได้ Lucky Jackpot!'}
                  </span>
                </div>

                {/* Master Relic Gaia Banner */}
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
                    <span style={{ fontSize: '20px' }}>👑</span>
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

                {/* Square Pedestal Showcase Grid (5 columns x 2 rows) */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: '8px',
                  }}
                >
                  {RELIC_DEFS.map((relic, idx) => {
                    const count = relicCount(state, relic.id);
                    const isOwned = count > 0;
                    const isMaxed = relicMaxed(state, relic.id);
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
                            ? `linear-gradient(135deg, var(--bg-panel-2) 0%, ${relic.color}25 100%)`
                            : 'rgba(255, 255, 255, 0.02)',
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
                        {/* Pedestal Tag & Fragment Count */}
                        <div
                          style={{
                            position: 'absolute',
                            top: '4px',
                            left: '5px',
                            right: '5px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '9px',
                            color: 'var(--root-cream-dim)',
                            fontWeight: 600,
                          }}
                        >
                          <span>#{String(idx + 1).padStart(2, '0')}</span>
                          <span style={{ fontSize: '8.5px', color: isMaxed ? '#facc15' : isOwned ? relic.color : 'inherit', fontWeight: 700 }}>
                            {isMaxed ? 'MAX' : isOwned ? `${count}/${relic.maxPieces}` : rarityInfo.icon}
                          </span>
                        </div>

                        {/* Artifact Icon */}
                        <span
                          style={{
                            fontSize: '26px',
                            marginTop: '6px',
                            filter: isOwned ? 'none' : 'grayscale(100%) opacity(25%)',
                            transform: isSelected ? 'scale(1.12)' : 'scale(1)',
                            transition: 'transform 0.15s ease',
                          }}
                        >
                          {isOwned ? relic.icon : '🏺'}
                        </span>

                        {/* Rarity or Name label */}
                        <span
                          style={{
                            fontSize: '9.5px',
                            fontWeight: 600,
                            color: isOwned ? relic.color : rarityInfo.color,
                            marginTop: '4px',
                            textAlign: 'center',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '90%',
                            opacity: isOwned ? 1 : 0.75,
                          }}
                        >
                          {isOwned ? relic.name : (isEn ? rarityInfo.enName : rarityInfo.name)}
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
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    marginTop: '2px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
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
                        {isSelectedOwned ? selectedRelic.icon : '🏺'}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontWeight: 700, fontSize: '13.5px', color: isSelectedOwned ? 'var(--root-cream)' : 'var(--root-cream-dim)' }}>
                            {isSelectedOwned ? selectedRelic.name : (isEn ? 'Undiscovered Relic' : 'โบราณวัตถุลึกลับ')}
                          </span>
                          <span
                            style={{
                              fontSize: '9.5px',
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
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: isSelectedMaxed ? 'rgba(250, 204, 21, 0.15)' : isSelectedOwned ? `${selectedRelic.color}20` : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${isSelectedMaxed ? '#facc15' : isSelectedOwned ? selectedRelic.color : 'rgba(255,255,255,0.1)'}`,
                        color: isSelectedMaxed ? '#facc15' : isSelectedOwned ? selectedRelic.color : 'var(--root-cream-dim)',
                        fontSize: '10.5px',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {isSelectedMaxed
                        ? (isEn ? '✓ MAXED' : '✓ เต็มแล้ว')
                        : isSelectedOwned
                        ? `${selectedCount} / ${selectedRelic.maxPieces}`
                        : (isEn ? '🔒 UNDISCOVERED' : '🔒 ยังไม่ค้นพบ')}
                    </div>
                  </div>

                  {/* Fragment Progress Bar */}
                  <div style={{ marginTop: '2px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--root-cream-dim)' }}>
                        {isEn ? 'Fragment Progress' : 'ความคืบหน้าชิ้นส่วน'}:
                      </span>
                      <span style={{ fontWeight: 700, color: isSelectedMaxed ? '#facc15' : selectedRelic.color }}>
                        {selectedCount} / {selectedRelic.maxPieces} {isSelectedMaxed ? (isEn ? '(MAXED)' : '(เต็มแล้ว)') : ''}
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'rgba(0,0,0,0.3)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${Math.min(100, (selectedCount / selectedRelic.maxPieces) * 100)}%`,
                          height: '100%',
                          background: isSelectedMaxed ? 'linear-gradient(90deg, #facc15, #4ade80)' : selectedRelic.color,
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                  </div>

                  {/* Effect Details */}
                  <div
                    style={{
                      background: 'rgba(0,0,0,0.25)',
                      padding: '7px 10px',
                      borderRadius: '8px',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      color: isSelectedOwned ? 'var(--accent-glow)' : 'var(--root-cream-dim)',
                    }}
                  >
                    {isSelectedOwned ? (
                      <>
                        ⚡ {selectedRelic.effectDesc} {selectedMult > selectedCount && <span style={{ color: '#facc15' }}>(×2 Gaia Active!)</span>}
                      </>
                    ) : (
                      <>
                        🔍 {isEn ? 'Ancient power remains dormant underground.' : 'คุณสมบัติจะปรากฏเมื่อขุดพบใต้พิภพ'}
                      </>
                    )}
                  </div>

                  {/* Lore or Discovery Clue */}
                  <div style={{ fontSize: '10.5px', color: 'var(--root-cream-dim)', fontStyle: 'italic', lineHeight: '1.4' }}>
                    {isSelectedOwned ? (
                      <>&ldquo;{selectedRelic.desc}&rdquo;</>
                    ) : (
                      <>
                        {isEn
                          ? '🌱 Hint: Keep roots expanding deep or roll Lucky Jackpots to discover this artifact.'
                          : '🌱 คำใบ้: ขยายรากให้ลึกและกว้าง หรือหมุน Lucky Jackpot เพื่อตามหาโบราณวัตถุชิ้นนี้'}
                      </>
                    )}
                  </div>

                  {/* Discovery & Completion Status */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: '4px',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: isSelectedMaxed
                        ? 'rgba(250, 204, 21, 0.1)'
                        : isSelectedOwned
                        ? 'rgba(255,255,255,0.03)'
                        : 'rgba(255,255,255,0.02)',
                      border: isSelectedMaxed ? '1px solid #facc1555' : '1px solid var(--line-soil)',
                      fontSize: '11.5px',
                    }}
                  >
                    <span style={{ color: 'var(--root-cream-dim)' }}>
                      {isSelectedMaxed
                        ? (isEn ? '👑 Status: Artifact Fully Restored!' : '👑 สถานะ: รวบรวมชิ้นส่วนครบสมบูรณ์แล้ว!')
                        : isSelectedOwned
                        ? (isEn ? `⛏️ Status: Gathering (${selectedCount}/${selectedRelic.maxPieces} Fragments)` : `⛏️ สถานะ: กำลังสะสม (${selectedCount}/${selectedRelic.maxPieces} ชิ้นส่วน)`)
                        : (isEn ? '🔒 Status: Dormant Underground' : '🔒 สถานะ: หลับใหลอยู่ใต้พิภพ')}
                    </span>
                    <span style={{ fontWeight: 700, color: selectedRelic.color, fontSize: '11px' }}>
                      {isSelectedMaxed
                        ? (isEn ? '100% COMPLETE' : 'สมบูรณ์ 100%')
                        : isSelectedOwned
                        ? `${Math.round((selectedCount / selectedRelic.maxPieces) * 100)}%`
                        : (isEn ? 'CHANCE TO UNEARTH' : 'รอการขุดพบ')}
                    </span>
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
                            {biome.name} {isSelected && <span style={{ color: 'var(--accent-glow)', fontSize: '10.5px' }}>● {isEn ? 'ACTIVE' : 'ใช้งานอยู่'}</span>}
                          </div>
                          <div style={{ fontSize: '10.5px', color: 'var(--root-cream-dim)', marginTop: '2px' }}>
                            {biome.desc}
                          </div>
                          <div style={{ fontSize: '10.5px', color: '#ffd76a', marginTop: '2px', fontWeight: 600 }}>
                            ⚡ {biome.ambientBonusDesc}
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
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

RelicsModal.displayName = 'RelicsModal';
