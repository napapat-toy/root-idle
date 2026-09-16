'use client';

import React, { useMemo, useState } from 'react';
import { GameState, Language } from '@/types/game';
import {
  BUY_QTY_OPTIONS,
  MODULE_DEFS,
  MODULE_UNLOCK_REQUIRE_OWNED,
  baseTotalRate,
  effectiveRate,
  globalEchoMultiplier,
  rootUpgradeMultiplier,
  getUnlockedUpgradeIds,
  getUnlockedEchoIds,
  getUnlockedSynergyIds,
  getUnpurchasedSynergyIds,
} from '@/constants/gameData';
import { formatDuration } from '@/lib/formatters';
import { MODULE_TRANSLATIONS, t } from '@/lib/i18n';
import { ModuleCard } from '@/components/ModuleCard';
import { UpgradesCatalog } from '@/components/UpgradesCatalog';
import { QuickUpgradesBar } from '@/components/QuickUpgradesBar';

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

  // Unlocked Upgrades discovery
  const unlockedUpgradeIds = useMemo(() => getUnlockedUpgradeIds(state), [state]);
  const unlockedEchoIds = useMemo(() => getUnlockedEchoIds(state), [state]);
  const unlockedSynergyIds = useMemo(() => getUnlockedSynergyIds(state), [state]);
  const unpurchasedSynergyIds = useMemo(() => getUnpurchasedSynergyIds(state), [state]);

  const echoMult = useMemo(() => globalEchoMultiplier(state), [state]);

  // Rates memo for modules
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

  // Default Modules View with Smart Quick-Bar
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

      {/* Smart Quick-Bar */}
      <QuickUpgradesBar
        state={state}
        totalRate={totalRate}
        lang={lang}
        unlockedUpgradeIds={unlockedUpgradeIds}
        unlockedEchoIds={unlockedEchoIds}
        unlockedSynergyIds={unlockedSynergyIds}
        unpurchasedSynergyIds={unpurchasedSynergyIds}
        onOpenCatalog={() => setViewMode('full_upgrades')}
        onBuyRootUpgrade={onBuyRootUpgrade}
        onBuyEcho={onBuyEcho}
        onBuyRootSynergy={onBuyRootSynergy}
      />

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
