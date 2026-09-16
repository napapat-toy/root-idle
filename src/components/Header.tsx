'use client';

import React from 'react';
import { fmt } from '@/lib/formatters';
import { Language } from '@/types/game';

interface HeaderProps {
  nutrients: number;
  totalRate: number;
  lang?: Language;
}

export const Header: React.FC<HeaderProps> = React.memo(({ nutrients, totalRate, lang = 'th' }) => {
  const isEn = lang === 'en';

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
        <div className="subtitle hidden sm:block">
          {isEn
            ? 'Water, wait, and watch roots expand endlessly — purchase root modules to accelerate growth'
            : 'รดน้ำ รอ และดูรากแผ่ขยายเองไปเรื่อยๆ — ซื้อรากเสริมเพื่อเร่งการเติบโต'}
        </div>
        <div className="subtitle block sm:hidden text-[11px] text-root-cream-dim">
          {isEn ? 'Zen Incremental Roots' : 'ปลูกรากไม้สไตล์เซน'}
        </div>
      </div>

      <div className="stats">
        <div className="amount">{fmt(nutrients)}</div>
        <div className="stats-sub">
          <span className="rate">
            +{fmt(totalRate)} {isEn ? 'nutrients/sec' : 'สารอาหาร/วิ'}
          </span>
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';
