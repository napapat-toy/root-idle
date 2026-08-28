'use client';

import React, { useMemo, useState } from 'react';
import { GameState, Language } from '@/types/game';
import {
  BUY_QTY_OPTIONS,
  MODULE_DEFS,
  MODULE_UNLOCK_REQUIRE_OWNED,
  baseTotalRate,
  echoCost,
  effectiveRate,
  globalEchoMultiplier,
  rootSynergyCost,
  rootSynergyUnlocked,
  speciesSynergyBonusPct,
  rootUpgradeCost,
  rootUpgradeIsMilestone,
  rootUpgradeLevelMult,
  rootUpgradeMultiplier,
  rootUpgradeRequireOwned,
} from '@/constants/gameData';
import { fmt, formatDuration } from '@/lib/formatters';
import { MODULE_TRANSLATIONS, t } from '@/lib/i18n';
import { ModuleCard } from '@/components/ModuleCard';

interface ShopPanelProps {
  state: GameState;
  totalRate: number;
  onBuyModule: (id: string) => void;
  onBuyRootUpgrade: (id: string) => void;
  onBuyEcho: (id: string) => void;
  onBuyRootSynergy: (id: string) => void;
  onSetBuyQty: (qty: number) => void;
}

export const ShopPanel: React.FC<ShopPanelProps> = React.memo(({
  state,
  totalRate,
  onBuyModule,
  onBuyRootUpgrade,
  onBuyEcho,
  onBuyRootSynergy,
  onSetBuyQty,
}) => {
  const lang: Language = state.lang || 'th';
  const isEn = lang === 'en';
  const tr = t(lang);

  const [viewMode, setViewMode] = useState<'modules' | 'full_upgrades'>('modules');
  const [activeCatalogTab, setActiveCatalogTab] = useState<'all' | 'ru' | 'echo' | 'syn'>('all');
  const [hoveredTile, setHoveredTile] = useState<{ type: 'ru' | 'echo' | 'syn'; id: string } | null>(null);

  // Sequential unlock logic for modules (requires MODULE_UNLOCK_REQUIRE_OWNED of prior tier)
  const { unlockedModules, firstLockedIndex } = useMemo(() => {
    let unlocked = 0;
    while (unlocked < MODULE_DEFS.length) {
      const def = MODULE_DEFS[unlocked];
      const count = state.owned[def.id] || 0;
      if (count >= MODULE_UNLOCK_REQUIRE_OWNED) {
        unlocked++;
      } else {
        unlocked++;
        break;
      }
    }
    return {
      unlockedModules: MODULE_DEFS.slice(0, unlocked),
      firstLockedIndex: unlocked < MODULE_DEFS.length ? unlocked : -1,
    };
  }, [state.owned]);

  // Unlocked Root Upgrades
  const unlockedUpgradeIds = useMemo(() => {
    return MODULE_DEFS.filter(def => {
      const level = state.rootUpgrades[def.id] || 0;
      const req = rootUpgradeRequireOwned(level + 1);
      const owned = state.owned[def.id] || 0;
      return owned >= rootUpgradeRequireOwned(1) || level > 0;
    }).map(d => d.id);
  }, [state.owned, state.rootUpgrades]);

  // Unlocked Echoes (Level >= 5 milestone unlocks Echo for that species)
  const unlockedEchoIds = useMemo(() => {
    return MODULE_DEFS.filter(def => {
      const level = state.rootUpgrades[def.id] || 0;
      const echoes = state.echoes[def.id] || 0;
      return level >= 5 || echoes > 0;
    }).map(d => d.id);
  }, [state.rootUpgrades, state.echoes]);

  // Unlocked Synergies (Owned >= 50 or already purchased)
  const unlockedSynergyIds = useMemo(() => {
    return MODULE_DEFS.filter(def => {
      return rootSynergyUnlocked(state, def.id);
    }).map(d => d.id);
  }, [state.owned, state.rootSynergies]);

  // Unpurchased Synergies
  const unpurchasedSynergyIds = useMemo(() => {
    return unlockedSynergyIds.filter(id => !state.rootSynergies[id]);
  }, [unlockedSynergyIds, state.rootSynergies]);

  // Pick top 2 species per category for the Quick Bar (Up to 6 tiles)
  const quickUpgradeIds = useMemo(() => {
    return [...unlockedUpgradeIds].slice(-2).reverse();
  }, [unlockedUpgradeIds]);

  const quickEchoIds = useMemo(() => {
    return [...unlockedEchoIds].slice(-2).reverse();
  }, [unlockedEchoIds]);

  const quickSynergyIds = useMemo(() => {
    return [...(unpurchasedSynergyIds.length > 0 ? unpurchasedSynergyIds : unlockedSynergyIds)].slice(-2).reverse();
  }, [unpurchasedSynergyIds, unlockedSynergyIds]);

  const totalAvailableUpgrades = unlockedUpgradeIds.length + unlockedEchoIds.length + unpurchasedSynergyIds.length;
  const quickTotalCount = quickUpgradeIds.length + quickEchoIds.length + quickSynergyIds.length;
  const hasRemainingMore = totalAvailableUpgrades > quickTotalCount;

  const echoMult = useMemo(() => {
    return globalEchoMultiplier(state);
  }, [state]);

  // Rates memo
  const moduleRates = useMemo(() => {
    const map: Record<string, { effRate: number; totalRate: number; shareText: string; ruMult: number }> = {};
    const baseTotal = baseTotalRate(state);
    const buffMult = baseTotal > 0 ? totalRate / baseTotal : 1;

    MODULE_DEFS.forEach(def => {
      const count = state.owned[def.id] || 0;
      const baseEff = effectiveRate(state, def);
      const eff = baseEff * buffMult;
      const tot = eff * count;
      const share = totalRate > 0 ? ((tot / totalRate) * 100).toFixed(1) : '0.0';
      const ruMult = rootUpgradeMultiplier(state, def.id);
      map[def.id] = {
        effRate: eff,
        totalRate: tot,
        shareText: `${share}%`,
        ruMult,
      };
    });
    return map;
  }, [state, totalRate]);

  const hasUpgradesOrEchoes = quickTotalCount > 0 || totalAvailableUpgrades > 0;

  // Buy All Affordable Handler
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

  // Compute hovered upgrade card details
  const previewDetails = useMemo(() => {
    if (!hoveredTile) return null;
    const def = MODULE_DEFS.find(m => m.id === hoveredTile.id);
    if (!def) return null;
    const localizedName = MODULE_TRANSLATIONS[def.id]?.[lang]?.name || def.name;

    if (hoveredTile.type === 'ru') {
      const level = state.rootUpgrades[def.id] || 0;
      const nextLevel = level + 1;
      const req = rootUpgradeRequireOwned(nextLevel);
      const owned = state.owned[def.id] || 0;
      const isMilestone = rootUpgradeIsMilestone(nextLevel);
      const multText = isMilestone
        ? isEn ? '×2.00 (Milestone!)' : '×2.00 (หลักชัย!)'
        : `+30% (×${rootUpgradeLevelMult(nextLevel).toFixed(2)})`;
      const cost = rootUpgradeCost(def, nextLevel);
      const reqMet = owned >= req;
      const affordable = state.nutrients >= cost;

      return {
        icon: isMilestone ? '⭐' : '⚡',
        title: `${localizedName} ${level > 0 ? `(Lv.${level} → Lv.${nextLevel})` : `(Lv.${nextLevel})`}`,
        desc: isEn
          ? `Boosts all ${localizedName} yield by ${multText}`
          : `เพิ่มผลผลิต ${localizedName} ทั้งหมด ${multText}`,
        reqText: !reqMet
          ? isEn
            ? `⚠️ Requires ${localizedName} ×${req} (Currently: ${owned})`
            : `⚠️ ต้องการ ${localizedName} ${req} ต้น (ตอนนี้มี ${owned})`
          : null,
        costText: fmt(cost),
        multText,
        color: def.color,
        canBuy: reqMet && affordable,
      };
    }

    if (hoveredTile.type === 'echo') {
      const echoes = state.echoes[def.id] || 0;
      const cost = echoCost(state, def, totalRate);
      const affordable = state.nutrients >= cost;

      return {
        icon: '✨',
        title: isEn ? `Echo: ${localizedName}` : `สะท้อน: ${localizedName}`,
        desc: isEn
          ? `Permanent +1% global production rate across all species even after Prestige`
          : `เพิ่มเรทการผลิตทั้งหมด +1% ถาวรแม้หว่านใหม่`,
        reqText: null,
        costText: fmt(cost),
        multText: isEn ? '+1% Global' : '+1% เรทรวม',
        color: def.color,
        canBuy: affordable,
      };
    }

    if (hoveredTile.type === 'syn') {
      const isOwned = !!state.rootSynergies?.[def.id];
      const count = state.owned[def.id] || 0;
      const bonusPct = speciesSynergyBonusPct(state, def.id);
      const cost = rootSynergyCost(def);
      const affordable = state.nutrients >= cost;

      return {
        icon: '🌐',
        title: isEn ? `Network: ${localizedName}` : `เครือข่าย: ${localizedName}`,
        desc: isEn
          ? `Each ${localizedName} grants +0.1% global production across all roots! (Current ${count} units = +${(count * 0.1).toFixed(1)}%)`
          : `ราก ${localizedName} ทุกๆ 1 ต้น มอบโบนัส +0.1% ให้กับผลผลิตทั้งฟาร์ม! (ตอนนี้มี ${count} ต้น = +${(count * 0.1).toFixed(1)}%)`,
        reqText: null,
        costText: isOwned ? (isEn ? 'ACTIVE' : 'เปิดใช้งานแล้ว') : fmt(cost),
        multText: isOwned ? `+${bonusPct}% (${isEn ? 'Active' : 'ทำงานอยู่'})` : '+0.1%/ต้น',
        color: '#38bdf8',
        canBuy: !isOwned && affordable,
      };
    }

    return null;
  }, [hoveredTile, state, lang, isEn, totalRate]);

  // If in Full Upgrades Catalog View
  if (viewMode === 'full_upgrades') {
    return (
      <div className="panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Full Catalog Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <button
            onClick={() => setViewMode('modules')}
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
            onClick={() => setActiveCatalogTab('all')}
            style={{
              flex: 1,
              padding: '6px 8px',
              borderRadius: '7px',
              border: 'none',
              fontWeight: 600,
              fontSize: '11px',
              cursor: 'pointer',
              background: activeCatalogTab === 'all' ? 'var(--accent-glow)' : 'transparent',
              color: activeCatalogTab === 'all' ? '#12190d' : 'var(--root-cream)',
            }}
          >
            {isEn ? 'All' : 'ทั้งหมด'} ({totalAvailableUpgrades})
          </button>
          <button
            onClick={() => setActiveCatalogTab('ru')}
            style={{
              flex: 1,
              padding: '6px 8px',
              borderRadius: '7px',
              border: 'none',
              fontWeight: 600,
              fontSize: '11px',
              cursor: 'pointer',
              background: activeCatalogTab === 'ru' ? 'var(--accent-glow)' : 'transparent',
              color: activeCatalogTab === 'ru' ? '#12190d' : 'var(--root-cream)',
            }}
          >
            ⚡ {isEn ? 'Upgrades' : 'อัปเกรด'} ({unlockedUpgradeIds.length})
          </button>
          <button
            onClick={() => setActiveCatalogTab('echo')}
            style={{
              flex: 1,
              padding: '6px 8px',
              borderRadius: '7px',
              border: 'none',
              fontWeight: 600,
              fontSize: '11px',
              cursor: 'pointer',
              background: activeCatalogTab === 'echo' ? 'var(--accent-glow)' : 'transparent',
              color: activeCatalogTab === 'echo' ? '#12190d' : 'var(--root-cream)',
            }}
          >
            ✨ {isEn ? 'Echoes' : 'สะท้อน'} ({unlockedEchoIds.length})
          </button>
          <button
            onClick={() => setActiveCatalogTab('syn')}
            style={{
              flex: 1,
              padding: '6px 8px',
              borderRadius: '7px',
              border: 'none',
              fontWeight: 600,
              fontSize: '11px',
              cursor: 'pointer',
              background: activeCatalogTab === 'syn' ? 'var(--accent-glow)' : 'transparent',
              color: activeCatalogTab === 'syn' ? '#12190d' : 'var(--root-cream)',
            }}
          >
            🌐 {isEn ? 'Networks' : 'เครือข่าย'} ({unlockedSynergyIds.length})
          </button>
        </div>

        {/* Scrollable Catalog List */}
        <div id="shopList" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Root Upgrades Section */}
          {(activeCatalogTab === 'all' || activeCatalogTab === 'ru') && unlockedUpgradeIds.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div className="panel-subtitle-row">
                <span>⚡ {isEn ? 'Species Upgrades' : 'อัปเกรดตามชนิดราก (+30% / ×2.00)'}</span>
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
                const multText = isMilestone ? '×2.00 (Milestone)' : `+30% (×${rootUpgradeLevelMult(nextLevel).toFixed(2)})`;

                return (
                  <div
                    key={`catalog-ru-${id}`}
                    style={{
                      background: 'var(--bg-panel)',
                      border: `1px solid ${canBuy ? 'var(--accent-glow-dim)' : 'var(--line-soil)'}`,
                      borderRadius: '10px',
                      padding: '10px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                      <span style={{ fontSize: '18px', color: def.color }}>{isMilestone ? '⭐' : '⚡'}</span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--root-cream)' }}>
                          {localizedName} <span style={{ fontSize: '11px', color: 'var(--root-cream-dim)' }}>Lv.{level} → Lv.{nextLevel}</span>
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--accent-glow)' }}>{multText}</div>
                        {!reqMet && (
                          <div style={{ fontSize: '10.5px', color: '#f59e0b' }}>
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
          {(activeCatalogTab === 'all' || activeCatalogTab === 'echo') && unlockedEchoIds.length > 0 && (
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
                      border: `1px solid ${affordable ? 'var(--accent-glow-dim)' : 'var(--line-soil)'}`,
                      borderRadius: '10px',
                      padding: '10px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                      <span style={{ fontSize: '18px', color: def.color }}>✨</span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--root-cream)' }}>
                          {isEn ? 'Echo:' : 'สะท้อน:'} {localizedName} <span style={{ fontSize: '11px', color: 'var(--root-cream-dim)' }}>×{echoes}</span>
                        </div>
                        <div style={{ fontSize: '11px', color: '#67e8f9' }}>+1% Global Production</div>
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
          {(activeCatalogTab === 'all' || activeCatalogTab === 'syn') && unlockedSynergyIds.length > 0 && (
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
                      border: `1px solid ${isOwned ? '#38bdf8' : canBuy ? 'var(--accent-glow-dim)' : 'var(--line-soil)'}`,
                      borderRadius: '10px',
                      padding: '10px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                      <span style={{ fontSize: '18px', color: isOwned ? '#38bdf8' : def.color }}>🌐</span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--root-cream)' }}>
                          {isEn ? 'Network:' : 'เครือข่าย:'} {localizedName}
                        </div>
                        <div style={{ fontSize: '11px', color: isOwned ? '#38bdf8' : 'var(--root-cream-dim)' }}>
                          {isOwned ? `+${bonusPct}% (${isEn ? 'Active' : 'ทำงานอยู่'})` : `+${(count * 0.1).toFixed(1)}% (+0.1%/unit)`}
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
  }

  // Default Modules View with Smart Quick-Bar (Top 2 per category = max 6 tiles + "+ More" button)
  return (
    <div className="panel">
      <div className="panel-title">{tr.modulesTitle}</div>

      {/* Quantity selector */}
      <div className="qty-bar">
        {BUY_QTY_OPTIONS.map(q => (
          <button
            key={q}
            onClick={() => onSetBuyQty(q)}
            className={`qty-btn ${q === state.buyQty ? 'active' : ''}`}
          >
            x{q}
          </button>
        ))}
      </div>

      {/* Smart Quick-Bar (Top 2 roots per category = max 6 tiles + "+ More") */}
      {hasUpgradesOrEchoes && (
        <div className="upgrade-store-container" style={{ padding: '8px 10px', gap: '6px' }}>
          <div className="upgrade-store-header">
            <span>⚡ {isEn ? 'Quick Upgrades' : 'อัปเกรดด่วน'}</span>
            <span
              onClick={() => setViewMode('full_upgrades')}
              style={{
                fontSize: '10px',
                color: 'var(--accent-glow)',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              {isEn ? `View All (${totalAvailableUpgrades}) →` : `ดูทั้งหมด (${totalAvailableUpgrades}) →`}
            </span>
          </div>

          <div
            className="upgrade-store-grid"
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '6px',
            }}
          >
            {/* Top 2 Root Upgrades */}
            {quickUpgradeIds.map(id => {
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
              const isHovered = hoveredTile?.type === 'ru' && hoveredTile?.id === id;

              return (
                <div
                  key={`quick-ru-${id}`}
                  onClick={canBuy ? () => onBuyRootUpgrade(id) : undefined}
                  onMouseEnter={() => setHoveredTile({ type: 'ru', id })}
                  onMouseLeave={() => setHoveredTile(null)}
                  className={`upgrade-tile rootupgrade ${isMilestone ? 'milestone' : ''} ${!canBuy ? 'disabled' : ''} ${isHovered ? 'active-hover' : ''}`}
                  style={{ borderColor: def.color }}
                  title={`${def.name} Lv.${nextLevel}`}
                >
                  <div className="upgrade-tile-icon" style={{ color: def.color }}>
                    {isMilestone ? '⭐' : '⚡'}
                  </div>
                  <div className="upgrade-tile-badge">
                    {level === 0 ? 'NEW' : `Lv.${level}`}
                  </div>
                </div>
              );
            })}

            {/* Top 2 Echoes */}
            {quickEchoIds.map(id => {
              const def = MODULE_DEFS.find(m => m.id === id)!;
              const echoes = state.echoes[id] || 0;
              const cost = echoCost(state, def, totalRate);
              const affordable = state.nutrients >= cost;
              const isHovered = hoveredTile?.type === 'echo' && hoveredTile?.id === id;

              return (
                <div
                  key={`quick-echo-${id}`}
                  onClick={affordable ? () => onBuyEcho(id) : undefined}
                  onMouseEnter={() => setHoveredTile({ type: 'echo', id })}
                  onMouseLeave={() => setHoveredTile(null)}
                  className={`upgrade-tile echo ${!affordable ? 'disabled' : ''} ${isHovered ? 'active-hover' : ''}`}
                  style={{ borderColor: def.color }}
                  title={`Echo: ${def.name}`}
                >
                  <div className="upgrade-tile-icon" style={{ color: def.color }}>
                    ✨
                  </div>
                  <div className="upgrade-tile-badge">
                    {echoes === 0 ? 'NEW' : `×${echoes}`}
                  </div>
                </div>
              );
            })}

            {/* Top 2 Synergies */}
            {quickSynergyIds.map(id => {
              const def = MODULE_DEFS.find(m => m.id === id)!;
              const isOwned = !!state.rootSynergies?.[id];
              const cost = rootSynergyCost(def);
              const affordable = state.nutrients >= cost;
              const canBuy = !isOwned && affordable;
              const isHovered = hoveredTile?.type === 'syn' && hoveredTile?.id === id;
              const bonusPct = speciesSynergyBonusPct(state, id);

              return (
                <div
                  key={`quick-syn-${id}`}
                  onClick={canBuy ? () => onBuyRootSynergy(id) : undefined}
                  onMouseEnter={() => setHoveredTile({ type: 'syn', id })}
                  onMouseLeave={() => setHoveredTile(null)}
                  className={`upgrade-tile synergy ${isOwned ? 'active-owned' : !affordable ? 'disabled' : ''} ${isHovered ? 'active-hover' : ''}`}
                  style={{ borderColor: isOwned ? '#38bdf8' : def.color }}
                  title={`Network: ${def.name}`}
                >
                  <div className="upgrade-tile-icon" style={{ color: isOwned ? '#38bdf8' : def.color }}>
                    🌐
                  </div>
                  <div className="upgrade-tile-badge" style={{ color: isOwned ? '#38bdf8' : '#eadfc7' }}>
                    {isOwned ? `+${bonusPct}%` : '50+'}
                  </div>
                </div>
              );
            })}

            {/* The "+ More" Pill Button */}
            <button
              onClick={() => setViewMode('full_upgrades')}
              style={{
                height: '42px',
                padding: '0 10px',
                borderRadius: '8px',
                background: 'var(--bg-panel-2)',
                border: '1px solid var(--line-soil)',
                color: 'var(--root-cream)',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                transition: 'all 0.15s ease',
              }}
              title={isEn ? 'Open Full Upgrades Catalog' : 'เปิดดูคลังอัปเกรดทั้งหมด'}
            >
              <span>➕</span>
              <span>{hasRemainingMore ? `+${totalAvailableUpgrades - quickTotalCount}` : isEn ? 'More' : 'ดูเพิ่ม'}</span>
            </button>
          </div>

          {/* Inline Hovercard details below the store */}
          {previewDetails && (
            <div
              className="upgrade-shelf-preview-card"
              style={{ borderLeft: `3px solid ${previewDetails.color}`, marginTop: '4px' }}
            >
              <div className="uth-header" style={{ color: previewDetails.color }}>
                {previewDetails.icon} {previewDetails.title}
              </div>
              <div className="uth-desc">{previewDetails.desc}</div>
              {previewDetails.reqText && (
                <div className="uth-req">{previewDetails.reqText}</div>
              )}
              <div className="uth-bottom">
                <span className="uth-cost">{previewDetails.costText}</span>
                <span className="uth-mult">{previewDetails.multText}</span>
              </div>
            </div>
          )}
        </div>
      )}

      <div id="shopList">
        {/* Base Module Cards Header */}
        <div className="panel-subtitle-row">
          <span>{isEn ? '🌿 Root Species' : '🌿 รากเสริม'}</span>
        </div>

        {/* Base Module Cards List */}
        {unlockedModules.map(def => {
          const r = moduleRates[def.id];
          return (
            <ModuleCard
              key={def.id}
              def={def}
              owned={state.owned[def.id] || 0}
              qty={state.buyQty}
              nutrients={state.nutrients}
              effRate={r.effRate}
              moduleTotalRate={r.totalRate}
              shareText={r.shareText}
              ruLevel={state.rootUpgrades[def.id] || 0}
              ruMult={r.ruMult}
              echoMult={echoMult}
              lang={lang}
              onBuy={onBuyModule}
            />
          );
        })}

        {/* Sequential lock hint */}
        {firstLockedIndex !== -1 && (
          <div className="upgrade-hint">
            {isEn ? (
              <>
                🔒 {MODULE_DEFS.length - firstLockedIndex} deeper root species awaiting — own at least {MODULE_UNLOCK_REQUIRE_OWNED}{' '}
                {MODULE_TRANSLATIONS[MODULE_DEFS[firstLockedIndex - 1].id]?.[lang]?.name || MODULE_DEFS[firstLockedIndex - 1].name} to unlock{' '}
                {MODULE_TRANSLATIONS[MODULE_DEFS[firstLockedIndex].id]?.[lang]?.name || MODULE_DEFS[firstLockedIndex].name}
              </>
            ) : (
              <>
                🔒 มีรากเสริมอีก {MODULE_DEFS.length - firstLockedIndex} ชนิดรออยู่ — ซื้อ{' '}
                {MODULE_DEFS[firstLockedIndex - 1].name} อย่างน้อย {MODULE_UNLOCK_REQUIRE_OWNED} ต้น เพื่อปลดล็อก{' '}
                {MODULE_DEFS[firstLockedIndex].name}
              </>
            )}
          </div>
        )}

        {/* Playtime note */}
        <div className="footer-note playtime-note">
          {isEn
            ? `Playtime: ${formatDuration(state.totalPlayTimeSeconds || 0)} · Current run: ${formatDuration(state.runPlayTimeSeconds || 0)}`
            : `เล่นทั้งหมด ${formatDuration(state.totalPlayTimeSeconds || 0)} · รอบนี้ ${formatDuration(state.runPlayTimeSeconds || 0)}`}
        </div>
      </div>
    </div>
  );
});

ShopPanel.displayName = 'ShopPanel';
