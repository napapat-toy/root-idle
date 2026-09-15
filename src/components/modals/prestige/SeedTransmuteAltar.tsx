'use client';

import React from 'react';
import { ESSENCE_TRANSMUTE_COST, SEED_TRANSMUTE_COST } from '@/constants/gameData';
import { fmtInt } from '@/lib/formatters';

interface SeedTransmuteAltarProps {
  eternalSeeds: number;
  gaiaEssences?: number;
  astralPetals: number;
  isEn: boolean;
  onTransmuteSeedsToPetals?: (amount: number) => void;
  onTransmuteEssencesToPetals?: (amount: number) => void;
}

export const SeedTransmuteAltar: React.FC<SeedTransmuteAltarProps> = React.memo(({
  eternalSeeds,
  gaiaEssences = 0,
  astralPetals,
  isEn,
  onTransmuteSeedsToPetals,
  onTransmuteEssencesToPetals,
}) => {
  // Seeds transmute calculations
  const canTransmuteSeed1 = eternalSeeds >= SEED_TRANSMUTE_COST;
  const canTransmuteSeed5 = eternalSeeds >= SEED_TRANSMUTE_COST * 5;
  const canTransmuteSeedMax = eternalSeeds >= SEED_TRANSMUTE_COST * 2;
  const maxSeedTransmute = Math.min(100, Math.floor(eternalSeeds / SEED_TRANSMUTE_COST));

  // Essences transmute calculations
  const canTransmuteEssence1 = gaiaEssences >= ESSENCE_TRANSMUTE_COST;
  const canTransmuteEssence5 = gaiaEssences >= ESSENCE_TRANSMUTE_COST * 5;
  const canTransmuteEssenceMax = gaiaEssences >= ESSENCE_TRANSMUTE_COST * 2;
  const maxEssenceTransmute = Math.min(100, Math.floor(gaiaEssences / ESSENCE_TRANSMUTE_COST));

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
          {isEn ? '🌸 Astral Transmutation Altar' : '🌸 แท่นหลอมมิติเกสรดวงดาว'}
        </span>
        <span className="font-mono" style={{ color: '#f472b6', fontWeight: 700, fontSize: '13px' }}>
          {fmtInt(astralPetals)} 🌸
        </span>
      </div>
      <div className="p-desc" style={{ fontSize: '11px', color: 'var(--root-cream-dim)', margin: '4px 0 10px' }}>
        {isEn
          ? `Condense 10,000 Gaia Essences (10k 🌍) or 50 Billion Seeds (50B 🌰) into rare Astral Petals for boutique skins.`
          : `หลอมรวม 10,000 ละอองชีวิต (10k 🌍) หรือ 50,000,000,000 เมล็ด (50B 🌰) เป็นเกสรดวงดาว 1 ดอก เพื่อแลกสกินชั้นเลิศในห้องแต่งตัว`}
      </div>

      {/* Option 1: Transmute with Gaia Essences (10,000 🌍) */}
      <div style={{ marginBottom: '10px', background: 'rgba(52, 211, 153, 0.08)', borderRadius: '8px', padding: '8px 10px', border: '1px solid rgba(52, 211, 153, 0.25)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '6px' }}>
          <span style={{ color: '#34d399', fontWeight: 600 }}>
            🌍 {isEn ? 'From Gaia Essences (10,000 🌍 ➔ 1 🌸)' : 'หลอมจากละอองชีวิต (10,000 🌍 ➔ 1 🌸)'}
          </span>
          <span className="font-mono" style={{ color: '#34d399', fontSize: '11px' }}>
            {fmtInt(gaiaEssences)} 🌍
          </span>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            type="button"
            disabled={!canTransmuteEssence1}
            onClick={() => onTransmuteEssencesToPetals?.(1)}
            style={{
              flex: 1,
              padding: '6px 8px',
              borderRadius: '6px',
              border: 'none',
              background: canTransmuteEssence1 ? 'linear-gradient(135deg, #059669, #10b981)' : 'rgba(255,255,255,0.08)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '11.5px',
              cursor: canTransmuteEssence1 ? 'pointer' : 'not-allowed',
              opacity: canTransmuteEssence1 ? 1 : 0.5,
            }}
          >
            {isEn ? 'Transmute 1x (10k 🌍)' : 'หลอม 1 ดอก (10k 🌍)'}
          </button>
          {canTransmuteEssence5 && (
            <button
              type="button"
              onClick={() => onTransmuteEssencesToPetals?.(5)}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: 'none',
                background: 'linear-gradient(135deg, #047857, #059669)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '11.5px',
                cursor: 'pointer',
              }}
            >
              +5
            </button>
          )}
          {canTransmuteEssenceMax && (
            <button
              type="button"
              onClick={() => {
                if (maxEssenceTransmute > 0) onTransmuteEssencesToPetals?.(maxEssenceTransmute);
              }}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: 'none',
                background: 'linear-gradient(135deg, #065f46, #047857)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '11.5px',
                cursor: 'pointer',
              }}
            >
              MAX (+{maxEssenceTransmute})
            </button>
          )}
        </div>
      </div>

      {/* Option 2: Transmute with Eternal Seeds (50B 🌰) */}
      <div style={{ background: 'rgba(236, 72, 153, 0.08)', borderRadius: '8px', padding: '8px 10px', border: '1px solid rgba(244, 114, 182, 0.25)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '6px' }}>
          <span style={{ color: '#f472b6', fontWeight: 600 }}>
            🌰 {isEn ? 'From Eternal Seeds (50B 🌰 ➔ 1 🌸)' : 'หลอมจากเมล็ดนิรันดร์ (50B 🌰 ➔ 1 🌸)'}
          </span>
          <span className="font-mono" style={{ color: '#f472b6', fontSize: '11px' }}>
            {fmtInt(eternalSeeds)} 🌰
          </span>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            type="button"
            disabled={!canTransmuteSeed1}
            onClick={() => onTransmuteSeedsToPetals?.(1)}
            style={{
              flex: 1,
              padding: '6px 8px',
              borderRadius: '6px',
              border: 'none',
              background: canTransmuteSeed1 ? 'linear-gradient(135deg, #ec4899, #8b5cf6)' : 'rgba(255,255,255,0.08)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '11.5px',
              cursor: canTransmuteSeed1 ? 'pointer' : 'not-allowed',
              opacity: canTransmuteSeed1 ? 1 : 0.5,
            }}
          >
            {isEn ? 'Transmute 1x (50B 🌰)' : 'หลอม 1 ดอก (50B 🌰)'}
          </button>
          {canTransmuteSeed5 && (
            <button
              type="button"
              onClick={() => onTransmuteSeedsToPetals?.(5)}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: 'none',
                background: 'linear-gradient(135deg, #db2777, #7c3aed)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '11.5px',
                cursor: 'pointer',
              }}
            >
              +5
            </button>
          )}
          {canTransmuteSeedMax && (
            <button
              type="button"
              onClick={() => {
                if (maxSeedTransmute > 0) onTransmuteSeedsToPetals?.(maxSeedTransmute);
              }}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: 'none',
                background: 'linear-gradient(135deg, #be185d, #6d28d9)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '11.5px',
                cursor: 'pointer',
              }}
            >
              MAX (+{maxSeedTransmute})
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

SeedTransmuteAltar.displayName = 'SeedTransmuteAltar';
