'use client';

import React, { useMemo } from 'react';
import { GameState } from '@/types/game';
import {
  BUY_QTY_OPTIONS,
  echoCost,
  echoUnlockedFor,
  effectiveRate,
  globalEchoMultiplier,
  MODULE_DEFS,
  rootUpgradeCost,
  rootUpgradeIsMilestone,
  rootUpgradeLevelMult,
  rootUpgradeMultiplier,
  rootUpgradeRequireOwned,
} from '@/constants/gameData';
import { ModuleCard } from './ModuleCard';
import { fmt, formatDuration } from '@/lib/formatters';

interface ShopPanelProps {
  state: GameState;
  totalRate: number;
  onBuyModule: (id: string) => void;
  onBuyRootUpgrade: (id: string) => void;
  onBuyEcho: (id: string) => void;
  onSetBuyQty: (qty: number) => void;
}

export const ShopPanel: React.FC<ShopPanelProps> = React.memo(({
  state,
  totalRate,
  onBuyModule,
  onBuyRootUpgrade,
  onBuyEcho,
  onSetBuyQty,
}) => {
  const { unlockedModules, firstLockedIndex } = useMemo(() => {
    let firstLocked = -1;
    const unlocked = MODULE_DEFS.filter((def, i) => {
      const isUnlocked = i === 0 || (state.owned[MODULE_DEFS[i - 1].id] || 0) >= 1;
      if (!isUnlocked && firstLocked === -1) firstLocked = i;
      return isUnlocked;
    });
    return { unlockedModules: unlocked, firstLockedIndex: firstLocked };
  }, [state.owned]);

  const unlockedUpgradeIds = useMemo(() => {
    return MODULE_DEFS.filter(
      d => (state.owned[d.id] || 0) >= rootUpgradeRequireOwned(1)
    ).map(d => d.id);
  }, [state.owned]);

  const unlockedEchoIds = useMemo(() => {
    return MODULE_DEFS.filter(d => echoUnlockedFor(state, d.id)).map(d => d.id);
  }, [state.owned, state.rootUpgrades]);

  const echoMult = useMemo(() => globalEchoMultiplier(state), [state.echoes]);

  // Precompute rates per module to avoid repeated work
  const moduleRates = useMemo(() => {
    const map: Record<string, { effRate: number; totalRate: number; ruMult: number; shareText: string }> = {};
    MODULE_DEFS.forEach(def => {
      const owned = state.owned[def.id] || 0;
      const effRate = effectiveRate(state, def);
      const mTotalRate = owned * effRate;
      const ruMult = rootUpgradeMultiplier(state, def.id);
      const share = totalRate > 0 ? (mTotalRate / totalRate) * 100 : 0;
      const shareText =
        share < 0.1 ? '<0.1%' : share < 10 ? share.toFixed(1) + '%' : Math.round(share) + '%';

      map[def.id] = { effRate, totalRate: mTotalRate, ruMult, shareText };
    });
    return map;
  }, [state.owned, state.rootUpgrades, state.echoes, state.prestige.passiveRateLevel, totalRate]);

  return (
    <div className="panel">
      <div className="panel-title">รากเสริม</div>

      <div id="shopList">
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

        {/* Base Module Cards */}
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
              onBuy={onBuyModule}
            />
          );
        })}

        {/* Sequential lock hint */}
        {firstLockedIndex !== -1 && (
          <div className="upgrade-hint">
            🔒 มีรากเสริมอีก {MODULE_DEFS.length - firstLockedIndex} ชนิดรออยู่ — ซื้อ{' '}
            {MODULE_DEFS[firstLockedIndex - 1].name} อย่างน้อย 1 ต้น เพื่อปลดล็อก{' '}
            {MODULE_DEFS[firstLockedIndex].name}
          </div>
        )}

        {/* Root Upgrades Section */}
        {unlockedUpgradeIds.length === 0 ? (
          <div className="upgrade-hint">
            ซื้อรากเสริมให้ถึง {rootUpgradeRequireOwned(1)} ต้น เพื่อปลดล็อกอัพเกรดราก —
            ระดับปกติ +30%, ทุกระดับที่ 5 เป็น ×2
          </div>
        ) : (
          <>
            <div className="panel-title" style={{ marginTop: '10px' }}>
              อัพเกรดราก
            </div>
            <div>
              {unlockedUpgradeIds.map(id => {
                const def = MODULE_DEFS.find(m => m.id === id)!;
                const level = state.rootUpgrades[id] || 0;
                const nextLevel = level + 1;
                const req = rootUpgradeRequireOwned(nextLevel);
                const owned = state.owned[id] || 0;
                const isMilestone = rootUpgradeIsMilestone(nextLevel);
                const multText = isMilestone ? '×2.00 (หลักชัย!)' : `+30% (×${rootUpgradeLevelMult(nextLevel).toFixed(2)})`;
                const cost = rootUpgradeCost(def, nextLevel);
                const reqMet = owned >= req;
                const affordable = state.nutrients >= cost;
                const canBuy = reqMet && affordable;

                return (
                  <div
                    key={id}
                    onClick={canBuy ? () => onBuyRootUpgrade(id) : undefined}
                    style={{ borderLeft: `3px ${isMilestone ? 'solid' : 'dashed'} ${def.color}` }}
                    className={`module rootupgrade ${isMilestone ? 'milestone' : ''} ${
                      !canBuy ? 'disabled' : ''
                    }`}
                  >
                    <div className="module-top">
                      <span className="module-name">
                        {isMilestone ? '⭐ ' : ''}
                        {def.name}
                      </span>
                      <span className="module-owned">
                        {level === 0 ? 'ยังไม่อัพเกรด' : `Lv.${level}`}
                      </span>
                    </div>
                    <div className="module-desc">
                      เพิ่มผลผลิต {def.name} ทั้งหมด {multText}
                      {!reqMet && (
                        <span style={{ color: '#e08a8a', display: 'block', marginTop: '2px' }}>
                          ต้องการ {def.name} {req} ต้น (ตอนนี้มี {owned})
                        </span>
                      )}
                    </div>
                    <div className="module-bottom">
                      <span className="module-cost">{fmt(cost)}</span>
                      <span className="module-rate">{multText}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Root Echoes Section */}
        {unlockedEchoIds.length > 0 && (
          <>
            <div className="panel-title" style={{ marginTop: '10px' }}>
              สะท้อนราก
            </div>
            <div>
              {unlockedEchoIds.map(id => {
                const def = MODULE_DEFS.find(m => m.id === id)!;
                const echoes = state.echoes[id] || 0;
                const cost = echoCost(state, def, totalRate);
                const affordable = state.nutrients >= cost;

                return (
                  <div
                    key={id}
                    onClick={affordable ? () => onBuyEcho(id) : undefined}
                    style={{ borderLeft: `3px solid ${def.color}` }}
                    className={`module echo ${!affordable ? 'disabled' : ''}`}
                  >
                    <div className="module-top">
                      <span className="module-name">✨ สะท้อน: {def.name}</span>
                      <span className="module-owned">
                        {echoes === 0 ? 'ยังไม่สะท้อน' : `×${echoes}`}
                      </span>
                    </div>
                    <div className="module-desc">
                      ฝากจิตวิญญาณของ {def.name} ไว้ในผืนดิน — เพิ่มเรทการผลิตทั้งหมด +1%
                      ถาวรแม้หว่านใหม่
                    </div>
                    <div className="module-bottom">
                      <span className="module-cost">{fmt(cost)}</span>
                      <span className="module-rate">+1% เรทรวม</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Playtime note */}
        <div className="footer-note playtime-note">
          🌱 เล่นทั้งหมด {formatDuration(state.totalPlayTimeSeconds)} · รอบนี้{' '}
          {formatDuration(state.runPlayTimeSeconds)}
        </div>
        <div className="footer-note">
          บันทึกอัตโนมัติ · ปิดแอปได้ เปิดมาใหม่รากยังทำงานให้ · เลื่อนดูรากด้านล่างได้
        </div>
      </div>
    </div>
  );
});

ShopPanel.displayName = 'ShopPanel';
