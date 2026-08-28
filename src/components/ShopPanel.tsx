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

  const echoMult = useMemo(() => {
    return globalEchoMultiplier(state);
  }, [state]);

  // Rates memo - calculates exact canonical effective rates and shares in sync with active buffs
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

  const hasUpgradesOrEchoes = unlockedUpgradeIds.length > 0 || unlockedEchoIds.length > 0 || unlockedSynergyIds.length > 0;

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

      {/* Cookie Clicker Style Compact Upgrade Store Shelf */}
      {hasUpgradesOrEchoes && (
        <div className="upgrade-store-container">
          <div className="upgrade-store-header">
            <span>{isEn ? '⚡ Upgrades, Echoes & Networks' : '⚡ อัพเกรด, สะท้อน & เครือข่ายราก'}</span>
            <span className="upgrade-store-count">
              {unlockedUpgradeIds.length + unlockedEchoIds.length + unlockedSynergyIds.length}
            </span>
          </div>

          <div className="upgrade-store-grid">
            {/* Root Upgrades Tiles */}
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
              const isHovered = hoveredTile?.type === 'ru' && hoveredTile?.id === id;

              return (
                <div
                  key={`ru-${id}`}
                  onClick={canBuy ? () => onBuyRootUpgrade(id) : undefined}
                  onMouseEnter={() => setHoveredTile({ type: 'ru', id })}
                  onMouseLeave={() => setHoveredTile(null)}
                  className={`upgrade-tile rootupgrade ${isMilestone ? 'milestone' : ''} ${!canBuy ? 'disabled' : ''} ${isHovered ? 'active-hover' : ''}`}
                  style={{ borderColor: def.color }}
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

            {/* Echo Tiles */}
            {unlockedEchoIds.map(id => {
              const def = MODULE_DEFS.find(m => m.id === id)!;
              const echoes = state.echoes[id] || 0;
              const cost = echoCost(state, def, totalRate);
              const affordable = state.nutrients >= cost;
              const isHovered = hoveredTile?.type === 'echo' && hoveredTile?.id === id;

              return (
                <div
                  key={`echo-${id}`}
                  onClick={affordable ? () => onBuyEcho(id) : undefined}
                  onMouseEnter={() => setHoveredTile({ type: 'echo', id })}
                  onMouseLeave={() => setHoveredTile(null)}
                  className={`upgrade-tile echo ${!affordable ? 'disabled' : ''} ${isHovered ? 'active-hover' : ''}`}
                  style={{ borderColor: def.color }}
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

            {/* Root Synergy Tiles (Unlocked at 50 units) */}
            {unlockedSynergyIds.map(id => {
              const def = MODULE_DEFS.find(m => m.id === id)!;
              const isOwned = !!state.rootSynergies?.[id];
              const cost = rootSynergyCost(def);
              const affordable = state.nutrients >= cost;
              const canBuy = !isOwned && affordable;
              const isHovered = hoveredTile?.type === 'syn' && hoveredTile?.id === id;
              const bonusPct = speciesSynergyBonusPct(state, id);

              return (
                <div
                  key={`syn-${id}`}
                  onClick={canBuy ? () => onBuyRootSynergy(id) : undefined}
                  onMouseEnter={() => setHoveredTile({ type: 'syn', id })}
                  onMouseLeave={() => setHoveredTile(null)}
                  className={`upgrade-tile synergy ${isOwned ? 'active-owned' : !affordable ? 'disabled' : ''} ${isHovered ? 'active-hover' : ''}`}
                  style={{ borderColor: isOwned ? '#38bdf8' : def.color }}
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
          </div>

          {/* Dedicated Floating Full-Width Preview Card (Zero Layout Shift) */}
          {previewDetails && (
            <div
              className="upgrade-shelf-preview-card"
              style={{ borderLeft: `3px solid ${previewDetails.color}` }}
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
            ? `🌱 Total Playtime: ${formatDuration(state.totalPlayTimeSeconds, lang)} · Current Cycle: ${formatDuration(state.runPlayTimeSeconds, lang)}`
            : `🌱 เล่นทั้งหมด ${formatDuration(state.totalPlayTimeSeconds, lang)} · รอบนี้ ${formatDuration(state.runPlayTimeSeconds, lang)}`}
        </div>
        <div className="footer-note">
          {isEn
            ? 'Auto-saves continuously · Offline gains active · Scroll down to explore deeper roots'
            : 'บันทึกอัตโนมัติ · ปิดแอปได้ เปิดมาใหม่รากยังทำงานให้ · เลื่อนดูรากด้านล่างได้'}
        </div>
      </div>
    </div>
  );
});

ShopPanel.displayName = 'ShopPanel';
