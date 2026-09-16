'use client';

import React, { useMemo, useState } from 'react';
import { GameState, Language } from '@/types/game';
import {
  MODULE_DEFS,
  maxEchoLevel,
  echoCost,
  echoMaxed,
  rootSynergyCost,
  speciesSynergyBonusPct,
  relicEchoBonusPerEcho,
  rootUpgradeCost,
  rootUpgradeIsMilestone,
  rootUpgradeLevelMult,
  rootUpgradeRequireOwned,
} from '@/constants/gameData';
import { fmt } from '@/lib/formatters';
import { MODULE_TRANSLATIONS, t } from '@/lib/i18n';

export interface QuickUpgradesBarProps {
  state: GameState;
  totalRate: number;
  lang: Language;
  unlockedUpgradeIds: string[];
  unlockedEchoIds: string[];
  unlockedSynergyIds: string[];
  unpurchasedSynergyIds: string[];
  onOpenCatalog: () => void;
  onBuyRootUpgrade: (id: string) => void;
  onBuyEcho: (id: string) => void;
  onBuyRootSynergy: (id: string) => void;
}

export const QuickUpgradesBar: React.FC<QuickUpgradesBarProps> = React.memo(({
  state,
  totalRate,
  lang,
  unlockedUpgradeIds,
  unlockedEchoIds,
  unlockedSynergyIds,
  unpurchasedSynergyIds,
  onOpenCatalog,
  onBuyRootUpgrade,
  onBuyEcho,
  onBuyRootSynergy,
}) => {
  const isEn = lang === 'en';
  const tr = t(lang);
  const [hoveredTile, setHoveredTile] = useState<{ type: 'ru' | 'echo' | 'syn'; id: string } | null>(null);

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
      const isMaxed = echoMaxed(state, def.id);
      const cost = echoCost(state, def, totalRate);
      const affordable = !isMaxed && state.nutrients >= cost;
      const rawEchoBonus = relicEchoBonusPerEcho(state) * 100;
      const echoBonusPct = rawEchoBonus % 1 === 0 ? rawEchoBonus : Number(rawEchoBonus.toFixed(1));

      const curMaxLevel = maxEchoLevel(state);
      return {
        icon: def.icon || '✨',
        title: isEn ? `Echo: ${localizedName}` : `สะท้อน: ${localizedName}`,
        desc: isMaxed
          ? (isEn ? `Max level reached (${echoes}/${curMaxLevel})` : `เต็มเลเวลสูงสุดแล้ว (${echoes}/${curMaxLevel})`)
          : (isEn
            ? `+${echoBonusPct}% multiplicative global rate in this run (Lv. ${echoes}/${curMaxLevel})`
            : `เพิ่มเรทผลิตรวมทั้งหมด +${echoBonusPct}% (คูณทับ) ในรอบนี้ (Lv. ${echoes}/${curMaxLevel})`),
        reqText: null,
        costText: isMaxed ? (isEn ? 'MAX' : 'เต็มแล้ว') : fmt(cost),
        multText: isEn ? `+${echoBonusPct}% Mult` : `+${echoBonusPct}% ตัวคูณ`,
        color: 'var(--astral-cyan)',
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
        color: 'var(--astral-cyan)',
        canBuy: !isOwned && affordable,
      };
    }

    return null;
  }, [hoveredTile, state, lang, isEn, totalRate]);

  if (quickTotalCount === 0 && totalAvailableUpgrades === 0) {
    return null;
  }

  return (
    <div className="upgrade-store-container" style={{ padding: '8px 10px', gap: '6px' }}>
      <div className="upgrade-store-header">
        <span>⚡ {tr.quickUpgradesTitle}</span>
        <span
          onClick={onOpenCatalog}
          style={{
            fontSize: '10px',
            color: 'var(--accent-glow)',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          {tr.viewAllWithCount.replace('{count}', String(totalAvailableUpgrades))}
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
          const isMaxed = echoMaxed(state, id);
          const cost = echoCost(state, def, totalRate);
          const affordable = !isMaxed && state.nutrients >= cost;
          const isHovered = hoveredTile?.type === 'echo' && hoveredTile?.id === id;

          return (
            <div
              key={`quick-echo-${id}`}
              onClick={affordable ? () => onBuyEcho(id) : undefined}
              onMouseEnter={() => setHoveredTile({ type: 'echo', id })}
              onMouseLeave={() => setHoveredTile(null)}
              className={`upgrade-tile echo ${!affordable ? 'disabled' : ''} ${isHovered ? 'active-hover' : ''}`}
              style={{ borderColor: 'var(--astral-cyan)', opacity: isMaxed ? 0.6 : 1 }}
              title={`Echo: ${def.name}`}
            >
              <div className="upgrade-tile-icon" style={{ fontSize: '16px' }}>
                {def.icon || '✨'}
              </div>
              <div className="upgrade-tile-badge" style={{ color: 'var(--astral-cyan)' }}>
                {isMaxed ? 'MAX' : echoes === 0 ? 'NEW' : `Lv.${echoes}`}
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
              style={{ borderColor: isOwned ? 'var(--astral-cyan)' : def.color }}
              title={`Network: ${def.name}`}
            >
              <div className="upgrade-tile-icon" style={{ fontSize: '16px' }}>
                {def.icon || '🌐'}
              </div>
              <div className="upgrade-tile-badge" style={{ color: isOwned ? 'var(--astral-cyan)' : 'var(--root-cream)' }}>
                {isOwned ? `+${totalSynBonus}%` : 'SYN'}
              </div>
            </div>
          );
        })}

        {/* The "+ More" Pill Button */}
        <button
          onClick={onOpenCatalog}
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
          title={tr.openCatalogTooltip}
        >
          <span>➕</span>
          <span>{hasRemainingMore ? `+${totalAvailableUpgrades - quickTotalCount}` : tr.viewMore}</span>
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
  );
});

QuickUpgradesBar.displayName = 'QuickUpgradesBar';
