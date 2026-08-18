'use client';

import React, { useState } from 'react';
import { ModuleDef } from '@/types/game';
import { bulkCostFor } from '@/constants/gameData';
import { fmt } from '@/lib/formatters';

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
  onBuy,
}) => {
  const [hoverAbove, setHoverAbove] = useState(false);
  const cost = bulkCostFor(def, owned, qty);
  const affordable = nutrients >= cost;

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    setHoverAbove(spaceBelow < 170);
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
          <span className="module-name">{def.name}</span>
          <span className="module-owned">×{owned}</span>
        </div>

        <div className="module-desc">{def.desc}</div>

        <div className="module-bottom">
          <span className="module-cost">
            {fmt(cost)}
            {qty > 1 ? ` (x${qty})` : ''}
          </span>
          <span className={`module-rate ${ruLevel > 0 || echoMult > 1 ? 'boosted' : ''}`}>
            +{fmt(moduleTotalRate)}/วิ
          </span>
        </div>
      </div>

      <div className={`module-hovercard ${hoverAbove ? 'above' : ''}`}>
        <div className="mh-row">
          <span>เรทเริ่มต้น</span>
          <b className="mh-base">+{fmt(def.rate)}/วิ</b>
        </div>
        <div className="mh-row">
          <span>อัพเกรดราก</span>
          <b className="mh-ru">
            Lv.{ruLevel} ×{ruMult.toFixed(2)}
          </b>
        </div>
        <div className="mh-row">
          <span>โบนัสสะท้อนราก</span>
          <b className="mh-echo">×{echoMult.toFixed(3)}</b>
        </div>
        <div className="mh-divider" />
        <div className="mh-row mh-highlight">
          <span>เรทต่อชิ้นจริง</span>
          <b className="mh-eff">+{fmt(effRate)}/วิ</b>
        </div>
        <div className="mh-row">
          <span>สัดส่วนจากทั้งหมด</span>
          <b className="mh-share">{shareText}</b>
        </div>
      </div>
    </div>
  );
});

ModuleCard.displayName = 'ModuleCard';
