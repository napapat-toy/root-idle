'use client';

import React, { useState } from 'react';
import { GameState, Language } from '@/types/game';
import {
  MODULE_DEFS,
  echoCost,
  rootSynergyCost,
  speciesSynergyBonusPct,
  rootUpgradeCost,
  rootUpgradeIsMilestone,
  rootUpgradeLevelMult,
  rootUpgradeRequireOwned,
} from '@/constants/gameData';
import { fmt } from '@/lib/formatters';
import { MODULE_TRANSLATIONS } from '@/lib/i18n';

interface UpgradesCatalogProps {
  state: GameState;
  totalRate: number;
  unlockedUpgradeIds: string[];
  unlockedEchoIds: string[];
  unlockedSynergyIds: string[];
  unpurchasedSynergyIds: string[];
  onBack: () => void;
  onBuyRootUpgrade: (id: string) => void;
  onBuyEcho: (id: string) => void;
  onBuyRootSynergy: (id: string) => void;
}

export const UpgradesCatalog: React.FC<UpgradesCatalogProps> = React.memo(({
  state,
  totalRate,
  unlockedUpgradeIds,
  unlockedEchoIds,
  unlockedSynergyIds,
  unpurchasedSynergyIds,
  onBack,
  onBuyRootUpgrade,
  onBuyEcho,
  onBuyRootSynergy,
}) => {
  const lang: Language = state.lang || 'th';
  const isEn = lang === 'en';
  const [activeTab, setActiveTab] = useState<'all' | 'ru' | 'echo' | 'syn'>('all');

  const totalAvailableUpgrades = unlockedUpgradeIds.length + unlockedEchoIds.length + unpurchasedSynergyIds.length;

  const handleBuyAllAffordable = () => {
    let currentNutrients = state.nutrients;

    // 1. Buy affordable root upgrades
    unlockedUpgradeIds.forEach(id => {
      const def = MODULE_DEFS.find(m => m.id === id);
      if (!def) return;
      const level = state.rootUpgrades[id] || 0;
      const nextLevel = level + 1;
      const req = rootUpgradeRequireOwned(nextLevel);
      const owned = state.owned[id] || 0;
      const cost = rootUpgradeCost(def, nextLevel);
      if (owned >= req && currentNutrients >= cost) {
        onBuyRootUpgrade(id);
        currentNutrients -= cost;
      }
    });

    // 2. Buy affordable echoes
    unlockedEchoIds.forEach(id => {
      const def = MODULE_DEFS.find(m => m.id === id);
      if (!def) return;
      const echoes = state.echoes[id] || 0;
      const cost = echoCost(state, def, totalRate);
      if (currentNutrients >= cost) {
        onBuyEcho(id);
        currentNutrients -= cost;
      }
    });

    // 3. Buy affordable synergies
    unpurchasedSynergyIds.forEach(id => {
      const def = MODULE_DEFS.find(m => m.id === id);
      if (!def) return;
      const cost = rootSynergyCost(def);
      if (currentNutrients >= cost) {
        onBuyRootSynergy(id);
        currentNutrients -= cost;
      }
    });
  };

  return (
    <div className="panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Full Catalog Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <button
          onClick={onBack}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--bg-panel-2)',
            border: '1px solid var(--line-soil)',
            color: 'var(--root-cream)',
            borderRadius: '8px',
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          ← {isEn ? 'Back to Roots' : 'กลับหน้ารากไม้'}
        </button>

        <button
          onClick={handleBuyAllAffordable}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            background: 'var(--accent-glow)',
            color: '#12190d',
            border: 'none',
            borderRadius: '8px',
            padding: '6px 12px',
            fontSize: '11.5px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          }}
        >
          ⚡ {isEn ? 'Buy All Available' : 'ซื้อทั้งหมดที่ซื้อได้'}
        </button>
      </div>

      {/* Tab Filters */}
      <div
        style={{
          display: 'flex',
          background: 'var(--bg-panel-2)',
          borderRadius: '10px',
          padding: '3px',
          gap: '4px',
          border: '1px solid var(--line-soil)',
          marginBottom: '8px',
        }}
      >
        <button
          onClick={() => setActiveTab('all')}
          style={{
            flex: 1,
            padding: '6px 8px',
            borderRadius: '7px',
            border: 'none',
            fontWeight: 600,
            fontSize: '11px',
            cursor: 'pointer',
            background: activeTab === 'all' ? 'var(--accent-glow)' : 'transparent',
            color: activeTab === 'all' ? '#12190d' : 'var(--root-cream)',
          }}
        >
          {isEn ? 'All' : 'ทั้งหมด'} ({totalAvailableUpgrades})
        </button>
        <button
          onClick={() => setActiveTab('ru')}
          style={{
            flex: 1,
            padding: '6px 8px',
            borderRadius: '7px',
            border: 'none',
            fontWeight: 600,
            fontSize: '11px',
            cursor: 'pointer',
            background: activeTab === 'ru' ? 'var(--accent-glow)' : 'transparent',
            color: activeTab === 'ru' ? '#12190d' : 'var(--root-cream)',
          }}
        >
          ⚡ {isEn ? 'Upgrades' : 'อัปเกรด'} ({unlockedUpgradeIds.length})
        </button>
        <button
          onClick={() => setActiveTab('echo')}
          style={{
            flex: 1,
            padding: '6px 8px',
            borderRadius: '7px',
            border: 'none',
            fontWeight: 600,
            fontSize: '11px',
            cursor: 'pointer',
            background: activeTab === 'echo' ? 'var(--accent-glow)' : 'transparent',
            color: activeTab === 'echo' ? '#12190d' : 'var(--root-cream)',
          }}
        >
          ✨ {isEn ? 'Echoes' : 'สะท้อน'} ({unlockedEchoIds.length})
        </button>
        <button
          onClick={() => setActiveTab('syn')}
          style={{
            flex: 1,
            padding: '6px 8px',
            borderRadius: '7px',
            border: 'none',
            fontWeight: 600,
            fontSize: '11px',
            cursor: 'pointer',
            background: activeTab === 'syn' ? 'var(--accent-glow)' : 'transparent',
            color: activeTab === 'syn' ? '#12190d' : 'var(--root-cream)',
          }}
        >
          🌐 {isEn ? 'Networks' : 'เครือข่าย'} ({unlockedSynergyIds.length})
        </button>
      </div>

      {/* Scrollable Catalog List */}
      <div id="shopList" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* Root Upgrades Section */}
        {(activeTab === 'all' || activeTab === 'ru') && unlockedUpgradeIds.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div className="panel-subtitle-row">
              <span>⚡ {isEn ? 'Species Upgrades (+100% / ×3.00)' : 'อัปเกรดตามชนิดราก (+100% / ×3.00)'}</span>
            </div>
            {unlockedUpgradeIds.map(id => {
              const def = MODULE_DEFS.find(m => m.id === id)!;
              const level = state.rootUpgrades[id] || 0;
              const nextLevel = level + 1;
              const req = rootUpgradeRequireOwned(nextLevel);
              const owned = state.owned[id] || 0;
              const isMilestone = rootUpgradeIsMilestone(nextLevel);
              const cost = rootUpgradeCost(def, nextLevel);
              const reqMet = owned >= req;
              const affordable = state.nutrients >= cost;
              const canBuy = reqMet && affordable;
              const localizedName = MODULE_TRANSLATIONS[def.id]?.[lang]?.name || def.name;
              const multText = isMilestone ? '×3.00 (Milestone)' : `+100% (×${rootUpgradeLevelMult(nextLevel).toFixed(2)})`;

              return (
                <div
                  key={`catalog-ru-${id}`}
                  style={{
                    background: 'var(--bg-panel)',
                    border: '1px solid var(--line-soil)',
                    borderLeft: `4px solid ${def.color}`,
                    borderRadius: '10px',
                    padding: '10px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        background: `${def.color}18`,
                        border: `1px solid ${def.color}55`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        flexShrink: 0,
                      }}
                    >
                      {def.icon || (isMilestone ? '⭐' : '⚡')}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--root-cream)' }}>
                        <span style={{ color: def.color, marginRight: '4px' }}>⚡</span>
                        {localizedName}{' '}
                        <span style={{ fontSize: '11px', color: 'var(--root-cream-dim)', fontWeight: 500 }}>
                          Lv.{level} → Lv.{nextLevel}
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: isMilestone ? '#ffd76a' : 'var(--accent-glow)', fontWeight: isMilestone ? 700 : 500 }}>
                        {multText}
                      </div>
                      {!reqMet && (
                        <div style={{ fontSize: '10.5px', color: '#f59e0b', fontWeight: 600 }}>
                          ⚠️ {isEn ? `Need ${req} units` : `ต้องการ ${req} ต้น`} ({owned}/{req})
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    disabled={!canBuy}
                    onClick={() => onBuyRootUpgrade(id)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      background: canBuy ? 'var(--accent-glow)' : 'rgba(255,255,255,0.05)',
                      color: canBuy ? '#12190d' : 'var(--root-cream-dim)',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '12px',
                      cursor: canBuy ? 'pointer' : 'not-allowed',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {fmt(cost)}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Echoes Section */}
        {(activeTab === 'all' || activeTab === 'echo') && unlockedEchoIds.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div className="panel-subtitle-row">
              <span>✨ {isEn ? 'Echoes of Growth (+1% Permanent Global)' : 'สะท้อนแห่งการเติบโต (+1% ถาวร)'}</span>
            </div>
            {unlockedEchoIds.map(id => {
              const def = MODULE_DEFS.find(m => m.id === id)!;
              const echoes = state.echoes[id] || 0;
              const cost = echoCost(state, def, totalRate);
              const affordable = state.nutrients >= cost;
              const localizedName = MODULE_TRANSLATIONS[def.id]?.[lang]?.name || def.name;

              return (
                <div
                  key={`catalog-echo-${id}`}
                  style={{
                    background: 'var(--bg-panel)',
                    border: '1px solid var(--line-soil)',
                    borderLeft: `4px solid #67e8f9`,
                    borderRadius: '10px',
                    padding: '10px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        background: 'rgba(103, 232, 249, 0.12)',
                        border: '1px solid rgba(103, 232, 249, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        flexShrink: 0,
                      }}
                    >
                      {def.icon || '✨'}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--root-cream)' }}>
                        <span style={{ color: '#67e8f9', marginRight: '4px' }}>✨</span>
                        {isEn ? 'Echo:' : 'สะท้อน:'} {localizedName}{' '}
                        <span style={{ fontSize: '11px', color: 'var(--root-cream-dim)', fontWeight: 500 }}>
                          ×{echoes}
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#67e8f9', fontWeight: 600 }}>
                        +1% {isEn ? 'Global Production' : 'เรทผลผลิตรวมถาวร'}
                      </div>
                    </div>
                  </div>

                  <button
                    disabled={!affordable}
                    onClick={() => onBuyEcho(id)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      background: affordable ? 'var(--accent-glow)' : 'rgba(255,255,255,0.05)',
                      color: affordable ? '#12190d' : 'var(--root-cream-dim)',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '12px',
                      cursor: affordable ? 'pointer' : 'not-allowed',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {fmt(cost)}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Synergies Section */}
        {(activeTab === 'all' || activeTab === 'syn') && unlockedSynergyIds.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div className="panel-subtitle-row">
              <span>🌐 {isEn ? 'Mycorrhizal Networks (+0.1%/Unit Global)' : 'เครือข่ายไมคอร์ไรซา (+0.1%/ต้น)'}</span>
            </div>
            {unlockedSynergyIds.map(id => {
              const def = MODULE_DEFS.find(m => m.id === id)!;
              const isOwned = !!state.rootSynergies?.[id];
              const cost = rootSynergyCost(def);
              const affordable = state.nutrients >= cost;
              const canBuy = !isOwned && affordable;
              const count = state.owned[id] || 0;
              const bonusPct = speciesSynergyBonusPct(state, id);
              const localizedName = MODULE_TRANSLATIONS[def.id]?.[lang]?.name || def.name;

              return (
                <div
                  key={`catalog-syn-${id}`}
                  style={{
                    background: 'var(--bg-panel)',
                    border: `1px solid ${isOwned ? '#38bdf8' : 'var(--line-soil)'}`,
                    borderLeft: `4px solid ${isOwned ? '#38bdf8' : def.color}`,
                    borderRadius: '10px',
                    padding: '10px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        background: isOwned ? 'rgba(56, 189, 248, 0.18)' : `${def.color}18`,
                        border: `1px solid ${isOwned ? '#38bdf8' : `${def.color}55`}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        flexShrink: 0,
                      }}
                    >
                      {def.icon || '🌐'}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--root-cream)' }}>
                        <span style={{ color: '#38bdf8', marginRight: '4px' }}>🌐</span>
                        {isEn ? 'Network:' : 'เครือข่าย:'} {localizedName}
                      </div>
                      <div style={{ fontSize: '11px', color: isOwned ? '#38bdf8' : 'var(--root-cream-dim)' }}>
                        {isOwned ? `+${bonusPct}% (${isEn ? 'Active' : 'ทำงานอยู่'})` : `+${(count * 0.1).toFixed(1)}% (+0.1%/ต้น)`}
                      </div>
                    </div>
                  </div>

                  <button
                    disabled={isOwned || !canBuy}
                    onClick={() => onBuyRootSynergy(id)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      background: isOwned ? 'rgba(56, 189, 248, 0.15)' : canBuy ? 'var(--accent-glow)' : 'rgba(255,255,255,0.05)',
                      color: isOwned ? '#38bdf8' : canBuy ? '#12190d' : 'var(--root-cream-dim)',
                      border: isOwned ? '1px solid #38bdf8' : 'none',
                      fontWeight: 700,
                      fontSize: '12px',
                      cursor: canBuy ? 'pointer' : 'default',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {isOwned ? (isEn ? 'ACTIVE ✓' : 'เปิดแล้ว ✓') : fmt(cost)}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
});

UpgradesCatalog.displayName = 'UpgradesCatalog';
