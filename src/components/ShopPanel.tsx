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
  relicEchoBonusPerEcho,
  rootUpgradeCost,
  rootUpgradeIsMilestone,
  rootUpgradeLevelMult,
  rootUpgradeMultiplier,
  rootUpgradeRequireOwned,
} from '@/constants/gameData';
import { fmt, formatDuration } from '@/lib/formatters';
import { MODULE_TRANSLATIONS, t } from '@/lib/i18n';
import { ModuleCard } from '@/components/ModuleCard';
import { UpgradesCatalog } from '@/components/UpgradesCatalog';

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
  const [hoveredTile, setHoveredTile] = useState<{ type: 'ru' | 'echo' | 'syn'; id: string } | null>(null);

  // Sequential unlock logic for modules
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
      const owned = state.owned[def.id] || 0;
      return owned >= rootUpgradeRequireOwned(1) || level > 0;
    }).map(d => d.id);
  }, [state.owned, state.rootUpgrades]);

  // Unlocked Echoes
  const unlockedEchoIds = useMemo(() => {
    return MODULE_DEFS.filter(def => {
      return echoUnlockedFor(state, def.id) || (state.echoes[def.id] || 0) > 0;
    }).map(d => d.id);
  }, [state.rootUpgrades, state.echoes, state.owned]);

  // Unlocked Synergies
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
      const mult = rootUpgradeLevelMult(nextLevel);
      const multText = isMilestone
        ? isEn ? `×${mult.toFixed(2)} (Milestone!)` : `×${mult.toFixed(2)} (หลักชัย!)`
        : `+${Math.round((mult - 1) * 100)}% (×${mult.toFixed(2)})`;
      const cost = rootUpgradeCost(def, nextLevel);
      const reqMet = owned >= req;
      const affordable = state.nutrients >= cost;

      return {
        icon: def.icon || (isMilestone ? '⭐' : '⚡'),
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
      const echoBonus = relicEchoBonusPerEcho(state);
      const echoBonusStr = Number(echoBonus.toFixed(2)).toString();

      return {
        icon: def.icon || '✨',
        title: isEn ? `Echo: ${localizedName}` : `สะท้อน: ${localizedName}`,
        desc: isEn
          ? `Permanent +${echoBonusStr}% global production rate across all species even after Prestige`
          : `เพิ่มเรทการผลิตทั้งหมด +${echoBonusStr}% ถาวรแม้หว่านใหม่`,
        reqText: null,
        costText: fmt(cost),
        multText: isEn ? `+${echoBonusStr}% Global` : `+${echoBonusStr}% เรทรวม`,
        color: '#67e8f9',
        canBuy: affordable,
      };
    }

    if (hoveredTile.type === 'syn') {
      const isOwned = !!state.rootSynergies?.[def.id];
      const count = state.owned[def.id] || 0;
      const bonusPct = speciesSynergyBonusPct(state, def.id);
      const bonusPctStr = Number(bonusPct.toFixed(2)).toString();
      const totalSynBonus = (count * bonusPct).toFixed(1);
      const cost = rootSynergyCost(def, state);
      const affordable = state.nutrients >= cost;

      return {
        icon: def.icon || '🌐',
        title: isEn ? `Network: ${localizedName}` : `เครือข่าย: ${localizedName}`,
        desc: isEn
          ? `Each ${localizedName} grants +${bonusPctStr}% global yield across all roots! (Current ${count} units = +${totalSynBonus}% to entire farm)`
          : `ราก ${localizedName} ทุกๆ 1 ต้น มอบโบนัส +${bonusPctStr}% ให้กับผลผลิตทั้งฟาร์ม! (ตอนนี้มี ${count} ต้น = +${totalSynBonus}% ทั้งฟาร์ม)`,
        reqText: null,
        costText: isOwned ? (isEn ? 'ACTIVE' : 'เปิดใช้งานแล้ว') : fmt(cost),
        multText: isOwned ? `+${totalSynBonus}% (${isEn ? 'Active' : 'ทำงานอยู่'})` : `+${totalSynBonus}% (+${bonusPctStr}%/ต้น)`,
        color: '#38bdf8',
        canBuy: !isOwned && affordable,
      };
    }

    return null;
  }, [hoveredTile, state, lang, isEn, totalRate]);

  // If in Full Upgrades Catalog View, delegate to UpgradesCatalog
  if (viewMode === 'full_upgrades') {
    return (
      <UpgradesCatalog
        state={state}
        totalRate={totalRate}
        unlockedUpgradeIds={unlockedUpgradeIds}
        unlockedEchoIds={unlockedEchoIds}
        unlockedSynergyIds={unlockedSynergyIds}
        unpurchasedSynergyIds={unpurchasedSynergyIds}
        onBack={() => setViewMode('modules')}
        onBuyRootUpgrade={onBuyRootUpgrade}
        onBuyEcho={onBuyEcho}
        onBuyRootSynergy={onBuyRootSynergy}
      />
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
                  <div className="upgrade-tile-icon" style={{ fontSize: '16px' }}>
                    {def.icon || (isMilestone ? '⭐' : '⚡')}
                  </div>
                  <div className="upgrade-tile-badge" style={{ color: def.color }}>
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
                  style={{ borderColor: '#67e8f9' }}
                  title={`Echo: ${def.name}`}
                >
                  <div className="upgrade-tile-icon" style={{ fontSize: '16px' }}>
                    {def.icon || '✨'}
                  </div>
                  <div className="upgrade-tile-badge" style={{ color: '#67e8f9' }}>
                    {echoes === 0 ? 'NEW' : `×${echoes}`}
                  </div>
                </div>
              );
            })}

            {/* Top 2 Synergies */}
            {quickSynergyIds.map(id => {
              const def = MODULE_DEFS.find(m => m.id === id)!;
              const isOwned = !!state.rootSynergies?.[id];
              const cost = rootSynergyCost(def, state);
              const affordable = state.nutrients >= cost;
              const canBuy = !isOwned && affordable;
              const isHovered = hoveredTile?.type === 'syn' && hoveredTile?.id === id;
              const bonusPct = speciesSynergyBonusPct(state, id);

              const count = state.owned[id] || 0;
              const totalSynBonus = (count * bonusPct).toFixed(1);

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
                  <div className="upgrade-tile-icon" style={{ fontSize: '16px' }}>
                    {def.icon || '🌐'}
                  </div>
                  <div className="upgrade-tile-badge" style={{ color: isOwned ? '#38bdf8' : '#eadfc7' }}>
                    {isOwned ? `+${totalSynBonus}%` : 'SYN'}
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
              state={state}
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
