'use client';

import React, { useState } from 'react';
import { Language, ModuleDef } from '@/types/game';
import { bulkCostFor, moduleMilestoneMultiplier, moduleMilestonesCountFor } from '@/constants/gameData';
import { fmt } from '@/lib/formatters';
import { MODULE_TRANSLATIONS } from '@/lib/i18n';

interface ModuleCardProps {
  def: ModuleDef;
  owned: number;
  qty: number;
  nutrients: number;
  effRate: number;
  moduleTotalRate: number;
  shareText: string;
  ruLevel: number;
  ruMult: number;
  echoMult: number;
  lang?: Language;
  state?: GameState;
  onBuy: (id: string) => void;
}

export const ModuleCard: React.FC<ModuleCardProps> = React.memo(({
  def,
  owned,
  qty,
  nutrients,
  effRate,
  moduleTotalRate,
  shareText,
  ruLevel,
  ruMult,
  echoMult,
  lang = 'th',
  state,
  onBuy,
}) => {
  const [hoverAbove, setHoverAbove] = useState(false);
  const cost = bulkCostFor(def, owned, qty, state);
  const affordable = nutrients >= cost;
  const isEn = lang === 'en';
  const milestoneCount = moduleMilestonesCountFor(owned);

  const localized = MODULE_TRANSLATIONS[def.id]?.[lang] || {
    name: def.name,
    desc: def.desc,
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const container = document.getElementById('shopList');
    if (container) {
      const containerRect = container.getBoundingClientRect();
      const spaceBelow = containerRect.bottom - rect.bottom;
      setHoverAbove(spaceBelow < 175);
    } else {
      const spaceBelow = window.innerHeight - rect.bottom;
      setHoverAbove(spaceBelow < 220);
    }
  };

  return (
    <div
      onClick={() => onBuy(def.id)}
      onMouseEnter={handleMouseEnter}
      style={{ borderLeft: `3px solid ${def.color}` }}
      className={`module has-hovercard ${!affordable ? 'disabled' : ''}`}
    >
      <div className="module-body">
        <div className="module-top">
          <span className="module-name">
            {def.icon && <span style={{ marginRight: '6px' }}>{def.icon}</span>}
            {localized.name}
          </span>
          <span className="module-owned">×{owned}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '3px', gap: '8px' }}>
          <div className="module-desc" style={{ marginTop: 0 }}>{localized.desc}</div>
          <span style={{ fontSize: '11px', color: 'var(--accent-glow-dim)', whiteSpace: 'nowrap', fontFamily: 'monospace', flexShrink: 0, opacity: 0.9 }}>
            +{fmt(effRate * qty)}{isEn ? '/s' : '/วิ'}{owned > 0 ? (isEn ? ' next' : ' ต่อรอบ') : ''}
          </span>
        </div>

        <div className="module-bottom">
          <span className="module-cost">
            {fmt(cost)}
            {qty > 1 ? ` (x${qty})` : ''}
          </span>
          <span className={`module-rate ${ruLevel > 0 || echoMult > 1 || owned === 0 ? 'boosted' : ''}`}>
            +{fmt(owned === 0 ? effRate * qty : moduleTotalRate)}{isEn ? '/s' : '/วิ'}
          </span>
        </div>
      </div>

      <div className={`module-hovercard ${hoverAbove ? 'above' : ''}`}>
        <div className="mh-row">
          <span>{isEn ? 'Base Rate' : 'เรทเริ่มต้น'}</span>
          <b className="mh-base">+{fmt(def.rate)}{isEn ? '/s' : '/วิ'}</b>
        </div>
        {owned >= 10 && (
          <div className="mh-row">
            <span>{isEn ? `Milestone (×${milestoneCount})` : `โบนัสไมล์สโตน (×${milestoneCount})`}</span>
            <b className="mh-ru" style={{ color: '#ffd76a' }}>
              ×{moduleMilestoneMultiplier(owned).toFixed(1)}
            </b>
          </div>
        )}
        <div className="mh-row">
          <span>{isEn ? 'Root Upgrade' : 'อัพเกรดราก'}</span>
          <b className="mh-ru">
            Lv.{ruLevel} ×{ruMult.toFixed(2)}
          </b>
        </div>
        <div className="mh-row">
          <span>{isEn ? 'Root Echo Bonus' : 'โบนัสสะท้อนราก'}</span>
          <b className="mh-echo">×{echoMult.toFixed(3)}</b>
        </div>
        <div className="mh-divider" />
        <div className="mh-row mh-highlight">
          <span>{isEn ? 'Effective Rate / Unit' : 'เรทต่อชิ้นจริง'}</span>
          <b className="mh-eff">+{fmt(effRate)}{isEn ? '/s' : '/วิ'}</b>
        </div>
        <div className="mh-row">
          <span>{isEn ? 'Share of Total Yield' : 'สัดส่วนจากทั้งหมด'}</span>
          <b className="mh-share">{shareText}</b>
        </div>
      </div>
    </div>
  );
});

ModuleCard.displayName = 'ModuleCard';
