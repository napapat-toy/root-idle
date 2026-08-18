'use client';

import React from 'react';
import { fmt, fmtInt } from '@/lib/formatters';

interface HeaderProps {
  nutrients: number;
  totalRate: number;
  eternalSeeds: number;
}

export const Header: React.FC<HeaderProps> = React.memo(({ nutrients, totalRate, eternalSeeds }) => {
  return (
    <header>
      <div className="header-title-box">
        <h1>
          ราก<span>มหัศจรรย์</span>
        </h1>
        <div className="subtitle">
          รดน้ำ รอ และดูรากแผ่ขยายเองไปเรื่อยๆ — ซื้อรากเสริมเพื่อเร่งการเติบโต
        </div>
      </div>

      <div className="stats">
        <div className="amount">{fmt(nutrients)}</div>
        <div className="stats-sub">
          <span className="rate">+{fmt(totalRate)} สารอาหาร/วิ</span>
          {eternalSeeds > 0 && (
            <span className="rate seeds">🌌 เมล็ดนิรันดร์: {fmtInt(eternalSeeds)}</span>
          )}
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';
