'use client';

import React from 'react';
import { fmt, fmtInt } from '@/lib/formatters';
import { Language } from '@/types/game';
import { t } from '@/lib/i18n';

interface HeaderProps {
  nutrients: number;
  totalRate: number;
  eternalSeeds: number;
  lang?: Language;
}

export const Header: React.FC<HeaderProps> = React.memo(({ nutrients, totalRate, eternalSeeds, lang = 'th' }) => {
  const isEn = lang === 'en';
  const tr = t(lang);

  return (
    <header>
      <div className="header-title-box">
        <h1>
          {isEn ? (
            <>Root <span>Idle</span></>
          ) : (
            <>ราก<span>มหัศจรรย์</span></>
          )}
        </h1>
        <div className="subtitle">
          {isEn
            ? 'Water, wait, and watch roots expand endlessly — purchase root modules to accelerate growth'
            : 'รดน้ำ รอ และดูรากแผ่ขยายเองไปเรื่อยๆ — ซื้อรากเสริมเพื่อเร่งการเติบโต'}
        </div>
      </div>

      <div className="stats">
        <div className="amount">{fmt(nutrients)}</div>
        <div className="stats-sub">
          <span className="rate">
            +{fmt(totalRate)} {isEn ? 'nutrients/sec' : 'สารอาหาร/วิ'}
          </span>
          {eternalSeeds > 0 && (
            <span className="rate seeds">
              🌌 {tr.eternalSeeds}: {fmtInt(eternalSeeds)}
            </span>
          )}
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';
