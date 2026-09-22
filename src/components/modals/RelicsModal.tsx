'use client';

import React, { useState } from 'react';
import { BiomeId, GameState, Language, RelicDef } from '@/types/game';
import {
  BIOME_DEFS,
  RELIC_DEFS,
  RELIC_RARITY_INFO,
  isMasterRelicActive,
  relicCount,
  relicMaxed,
  relicMult,
  relicsCount,
} from '@/constants/gameData';
import { t } from '@/lib/i18n';
import { RelicPedestal } from './relics/RelicPedestal';
import { RelicDetailCard } from './relics/RelicDetailCard';
import { BiomeRow } from './relics/BiomeRow';

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
  const totalCount = RELIC_DEFS.length;
  const masterActive = isMasterRelicActive(state);
  const activeBiome = state.activeBiome || 'topsoil';

  const selectedRelic: RelicDef = RELIC_DEFS.find(r => r.id === selectedRelicId) || RELIC_DEFS[0];
  const selectedCount = relicCount(state, selectedRelic.id);
  const isSelectedMaxed = relicMaxed(state, selectedRelic.id);
  const selectedRarityInfo = RELIC_RARITY_INFO[selectedRelic.rarity];
  const selectedMult = relicMult(state, selectedRelic.id);

  return (
    <div className="offline-backdrop" onClick={onClose} style={{ zIndex: 2100 }}>
      <div
        className="modal-wrapper relics-modal-wrapper"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '500px', width: '95%', boxSizing: 'border-box', margin: '0 auto' }}
      >
        <button className="modal-close-x" onClick={onClose} aria-label={tr.close}>
          &times;
        </button>

        <div
          className="offline-modal generic-modal"
          style={{
            padding: 'clamp(14px, 3.5vw, 20px)',
            maxHeight: '88vh',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            boxSizing: 'border-box',
            overflowX: 'hidden',
          }}
        >
          {/* Header */}
          <div className="icon" style={{ fontSize: '28px', marginBottom: '4px' }}>🏺</div>
          <h2 style={{ marginBottom: '3px', fontSize: 'clamp(16px, 4vw, 18px)' }}>
            {isEn ? 'Subterranean Museum' : 'พิพิธภัณฑ์โบราณคดีใต้พิภพ'}
          </h2>
          <div className="away-time" style={{ marginBottom: '12px', fontSize: 'clamp(10.5px, 2.6vw, 11.5px)' }}>
            {isEn
              ? `Discovered: ${ownedCount} / ${totalCount} Master Relics`
              : `ค้นพบแล้ว: ${ownedCount} / ${totalCount} ชิ้น`}
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
              marginBottom: '12px',
              flexShrink: 0,
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            <button
              onClick={() => setActiveTab('relics')}
              style={{
                flex: 1,
                padding: '7px 4px',
                borderRadius: '7px',
                border: 'none',
                fontWeight: 600,
                fontSize: 'clamp(10.5px, 2.8vw, 11.5px)',
                cursor: 'pointer',
                background: activeTab === 'relics' ? 'var(--accent-glow)' : 'transparent',
                color: activeTab === 'relics' ? '#12190d' : 'var(--root-cream)',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              🏺 {isEn ? 'Relic Showcase' : 'ตู้โชว์โบราณวัตถุ'} ({ownedCount}/{totalCount})
            </button>
            <button
              onClick={() => setActiveTab('biomes')}
              style={{
                flex: 1,
                padding: '7px 4px',
                borderRadius: '7px',
                border: 'none',
                fontWeight: 600,
                fontSize: 'clamp(10.5px, 2.8vw, 11.5px)',
                cursor: 'pointer',
                background: activeTab === 'biomes' ? 'var(--accent-glow)' : 'transparent',
                color: activeTab === 'biomes' ? '#12190d' : 'var(--root-cream)',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              🖼️ {isEn ? 'Canvas Biomes' : 'ชีวนิเวศฉากหลัง'}
            </button>
          </div>

          {/* Scrollable Body */}
          <div
            className="custom-scrollbar"
            style={{
              flex: 1,
              overflowY: 'auto',
              overflowX: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              paddingRight: '2px',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            {activeTab === 'relics' && (
              <>
                {/* Discovery Guidance Banner */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--line-soil)',
                    borderRadius: '10px',
                    padding: '8px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: 'clamp(10px, 2.5vw, 11px)',
                    color: 'var(--root-cream-dim)',
                    lineHeight: '1.4',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                >
                  <span style={{ fontSize: '15px', flexShrink: 0 }}>⛏️</span>
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
                      padding: '8px 10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#facc15',
                      fontSize: 'clamp(10.5px, 2.7vw, 11.5px)',
                      fontWeight: 600,
                      width: '100%',
                      boxSizing: 'border-box',
                    }}
                  >
                    <span style={{ fontSize: '18px', flexShrink: 0 }}>👑</span>
                    <div>
                      <div style={{ fontWeight: 700 }}>
                        {isEn ? 'Heart of Gaia Resonance Active!' : 'พลังจิตวิญญาณแห่งไกอาตื่นรู้!'}
                      </div>
                      <div style={{ fontSize: '10px', opacity: 0.9 }}>
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
                    gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
                    gap: 'clamp(4px, 1.5vw, 6px)',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                >
                  {RELIC_DEFS.map((relic, idx) => (
                    <RelicPedestal
                      key={relic.id}
                      relic={relic}
                      idx={idx}
                      count={relicCount(state, relic.id)}
                      isSelected={relic.id === selectedRelicId}
                      rarityInfo={RELIC_RARITY_INFO[relic.rarity]}
                      isEn={isEn}
                      onSelect={setSelectedRelicId}
                    />
                  ))}
                </div>

                {/* Inspection Spotlight Detail Card */}
                <RelicDetailCard
                  state={state}
                  relic={selectedRelic}
                  count={selectedCount}
                  isMaxed={isSelectedMaxed}
                  rarityInfo={selectedRarityInfo}
                  mult={selectedMult}
                  masterActive={masterActive}
                  isEn={isEn}
                />
              </>
            )}

            {activeTab === 'biomes' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ fontSize: '11.5px', color: 'var(--root-cream-dim)', marginBottom: '4px' }}>
                  {isEn
                    ? 'Switch active underground biome to customize your Canvas background and receive environmental resonance buffs:'
                    : 'เลือกสลับชั้นชีวนิเวศใต้พิภพเพื่อปรับแต่งฉากหลัง Canvas และรับบัฟสภาพแวดล้อมเฉพาะตัว:'}
                </div>

                {BIOME_DEFS.map(biome => (
                  <BiomeRow
                    key={biome.id}
                    biome={biome}
                    isUnlocked={ownedCount >= biome.relicRequiredCount}
                    isSelected={activeBiome === biome.id}
                    ownedCount={ownedCount}
                    isEn={isEn}
                    onSelectBiome={onSelectBiome}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

RelicsModal.displayName = 'RelicsModal';
