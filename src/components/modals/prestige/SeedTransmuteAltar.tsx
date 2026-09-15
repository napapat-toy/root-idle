'use client';

import React from 'react';
import { SEED_TRANSMUTE_COST } from '@/constants/gameData';
import { fmtInt } from '@/lib/formatters';

interface SeedTransmuteAltarProps {
  eternalSeeds: number;
  astralPetals: number;
  isEn: boolean;
  onTransmuteSeedsToPetals?: (amount: number) => void;
}

export const SeedTransmuteAltar: React.FC<SeedTransmuteAltarProps> = React.memo(({
  eternalSeeds,
  astralPetals,
  isEn,
  onTransmuteSeedsToPetals,
}) => {
  const canTransmute1 = eternalSeeds >= SEED_TRANSMUTE_COST;
  const canTransmute5 = eternalSeeds >= SEED_TRANSMUTE_COST * 5;
  const canTransmuteMax = eternalSeeds >= SEED_TRANSMUTE_COST * 2;
  const maxTransmute = Math.min(100, Math.floor(eternalSeeds / SEED_TRANSMUTE_COST));

  return (
    <div
      className="prestige-item"
      style={{
        background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.12), rgba(139, 92, 246, 0.12))',
        border: '1.5px solid rgba(244, 114, 182, 0.45)',
        borderRadius: '12px',
        padding: '12px',
        marginBottom: '10px',
      }}
    >
      <div className="p-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#f472b6', fontWeight: 700, fontSize: '13px' }}>
          {isEn ? '🌸 Transmute Seeds into Astral Petals' : '🌸 หลอมเมล็ดเป็นเกสรดวงดาว'}
        </span>
        <span className="font-mono" style={{ color: '#f472b6', fontWeight: 700, fontSize: '13px' }}>
          {fmtInt(astralPetals)} 🌸
        </span>
      </div>
      <div className="p-desc" style={{ fontSize: '11px', color: 'var(--root-cream-dim)', margin: '4px 0 8px' }}>
        {isEn
          ? `Compress 50,000,000,000 (50B) Eternal Seeds into 1 Astral Petal for mythic boutique cosmetics.`
          : `บีบอัดเมล็ดนิรันดร์ 50,000,000,000 (50B) เมล็ด เป็นเกสรดวงดาว 1 ดอก เพื่อใช้แลกสกินระดับตำนานในห้องแต่งตัว`}
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          type="button"
          disabled={!canTransmute1}
          onClick={() => onTransmuteSeedsToPetals?.(1)}
          style={{
            flex: 1,
            padding: '7px 10px',
            borderRadius: '8px',
            border: 'none',
            background: canTransmute1 ? 'linear-gradient(135deg, #ec4899, #8b5cf6)' : 'rgba(255,255,255,0.1)',
            color: '#fff',
            fontWeight: 700,
            fontSize: '12px',
            cursor: canTransmute1 ? 'pointer' : 'not-allowed',
            opacity: canTransmute1 ? 1 : 0.5,
          }}
        >
          {isEn ? `Transmute 1x (50B 🌰)` : `หลอม 1 ดอก (50B 🌰)`}
        </button>
        {canTransmute5 && (
          <button
            type="button"
            onClick={() => onTransmuteSeedsToPetals?.(5)}
            style={{
              padding: '7px 12px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #db2777, #7c3aed)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            +5
          </button>
        )}
        {canTransmuteMax && (
          <button
            type="button"
            onClick={() => {
              if (maxTransmute > 0) onTransmuteSeedsToPetals?.(maxTransmute);
            }}
            style={{
              padding: '7px 12px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #be185d, #6d28d9)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            MAX (+{maxTransmute})
          </button>
        )}
      </div>
    </div>
  );
});

SeedTransmuteAltar.displayName = 'SeedTransmuteAltar';
