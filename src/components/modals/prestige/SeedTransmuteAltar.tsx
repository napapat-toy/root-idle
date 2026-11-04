'use client';

import React from 'react';
import {
  ESSENCE_TRANSMUTE_COST,
  SEED_TRANSMUTE_COST,
  ASTRAL_RESONANCE_COST,
  ASTRAL_RESONANCE_MAX_LEVEL,
  ASTRAL_RESONANCE_MULT_PER_LEVEL,
  calcMaxAstralResonance,
  ASTRAL_SEED_COST,
  ASTRAL_SEED_MAX_LEVEL,
  ASTRAL_SEED_MULT_PER_LEVEL,
  calcMaxAstralSeed,
} from '@/constants/gameData';
import { fmtInt } from '@/lib/formatters';

interface SeedTransmuteAltarProps {
  eternalSeeds: number;
  gaiaEssences?: number;
  astralPetals: number;
  astralResonanceLevel?: number;
  astralSeedLevel?: number;
  isEn: boolean;
  onTransmuteSeedsToPetals?: (amount: number) => void;
  onTransmuteEssencesToPetals?: (amount: number) => void;
  onBuyAstralResonance?: (qty?: number | 'max') => void;
  onBuyAstralSeed?: (qty?: number | 'max') => void;
}

export const SeedTransmuteAltar: React.FC<SeedTransmuteAltarProps> = React.memo(({
  eternalSeeds,
  gaiaEssences = 0,
  astralPetals,
  astralResonanceLevel = 0,
  astralSeedLevel = 0,
  isEn,
  onTransmuteSeedsToPetals,
  onTransmuteEssencesToPetals,
  onBuyAstralResonance,
  onBuyAstralSeed,
}) => {
  // Astral Resonance calculations
  const isResonanceMaxed = astralResonanceLevel >= ASTRAL_RESONANCE_MAX_LEVEL;
  const maxResonanceInfo = calcMaxAstralResonance(astralResonanceLevel, astralPetals);
  const canBuyResonance1 = astralPetals >= ASTRAL_RESONANCE_COST && !isResonanceMaxed;

  // Astral Seed calculations
  const isSeedMaxed = astralSeedLevel >= ASTRAL_SEED_MAX_LEVEL;
  const maxSeedInfo = calcMaxAstralSeed(astralSeedLevel, astralPetals);
  const canBuySeed1 = astralPetals >= ASTRAL_SEED_COST && !isSeedMaxed;

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
          ? `Condense Gaia Essences (10k 🌍) or Seeds (50B 🌰) into Astral Petals, and channel Petals into permanent Special Multiplier power.`
          : `หลอมรวมละอองชีวิต (10k 🌍) หรือเมล็ด (50B 🌰) เป็นเกสรดวงดาว และหลอมเกสรเข้าสู่ตัวคูณพิเศษสะสมของฟาร์มถาวร`}
      </div>

      {/* Astral Resonance Upgrade Section */}
      <div
        style={{
          marginBottom: '12px',
          background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(168, 85, 247, 0.1))',
          borderRadius: '10px',
          padding: '10px 12px',
          border: '1px solid rgba(244, 114, 182, 0.35)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '15px' }}>🌸</span>
            <span style={{ fontWeight: 700, fontSize: '12.5px', color: '#f472b6' }}>
              {isEn ? 'Astral Resonance (Special Multiplier)' : 'เรโซแนนซ์เกสรดวงดาว (ตัวคูณพิเศษ)'}
            </span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: isResonanceMaxed ? '#4ade80' : '#f472b6',
                background: isResonanceMaxed ? 'rgba(74, 222, 128, 0.16)' : 'rgba(244, 114, 182, 0.16)',
                border: isResonanceMaxed ? '1px solid rgba(74, 222, 128, 0.4)' : '1px solid rgba(244, 114, 182, 0.4)',
                padding: '1px 7px',
                borderRadius: '999px',
              }}
            >
              {isResonanceMaxed ? (isEn ? 'MAXED ✓' : 'เต็มแล้ว ✓') : `Lv. ${astralResonanceLevel}/${ASTRAL_RESONANCE_MAX_LEVEL}`}
            </span>
          </div>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#ffd76a', fontFamily: 'monospace' }}>
            +{ (astralResonanceLevel * ASTRAL_RESONANCE_MULT_PER_LEVEL).toFixed(2) }×
          </span>
        </div>

        <div style={{ fontSize: '11px', color: 'var(--root-cream-dim)', marginBottom: '8px' }}>
          {isEn
            ? `Permanent +0.25x Special Multiplier per level across all resets. Flat cost: ${ASTRAL_RESONANCE_COST} 🌸/Lv.`
            : `เพิ่มตัวคูณพิเศษสะสม (ก้อนที่ 2) +0.25× ต่อเลเวล ถาวรข้ามทุกรอบรีเซ็ต ราคาคงที่ ${ASTRAL_RESONANCE_COST} 🌸/เวล`}
        </div>

        {!isResonanceMaxed && (
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              type="button"
              disabled={!canBuyResonance1}
              onClick={() => onBuyAstralResonance?.(1)}
              style={{
                flex: 1,
                padding: '6px 10px',
                borderRadius: '6px',
                border: 'none',
                background: canBuyResonance1 ? 'linear-gradient(135deg, #db2777, #9333ea)' : 'rgba(255,255,255,0.08)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '11.5px',
                cursor: canBuyResonance1 ? 'pointer' : 'not-allowed',
                opacity: canBuyResonance1 ? 1 : 0.5,
              }}
            >
              {isEn ? `Buy 1 (${ASTRAL_RESONANCE_COST} 🌸)` : `ซื้อ 1 (${ASTRAL_RESONANCE_COST} 🌸)`}
            </button>
            <button
              type="button"
              disabled={maxResonanceInfo.count <= 0}
              onClick={() => onBuyAstralResonance?.('max')}
              title={
                isEn
                  ? `Buy all affordable levels (+${maxResonanceInfo.count} for ${maxResonanceInfo.totalCost} 🌸)`
                  : `ซื้อทั้งหมดเท่าที่ทำได้ (+${maxResonanceInfo.count} ใช้ ${maxResonanceInfo.totalCost} 🌸)`
              }
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid rgba(255, 215, 106, 0.4)',
                background: maxResonanceInfo.count > 0 ? 'rgba(255, 215, 106, 0.18)' : 'rgba(255,255,255,0.05)',
                color: maxResonanceInfo.count > 0 ? '#ffd76a' : 'var(--root-cream-dim)',
                fontWeight: 700,
                fontSize: '11.5px',
                cursor: maxResonanceInfo.count > 0 ? 'pointer' : 'not-allowed',
                opacity: maxResonanceInfo.count > 0 ? 1 : 0.4,
              }}
            >
              {isEn
                ? (maxResonanceInfo.count > 0 ? `Buy All (+${maxResonanceInfo.count})` : 'Buy All')
                : (maxResonanceInfo.count > 0 ? `ซื้อทั้งหมด (+${maxResonanceInfo.count})` : 'ซื้อทั้งหมด')}
            </button>
          </div>
        )}
      </div>

      {/* Astral Seed Infusion Upgrade Section */}
      <div
        style={{
          marginBottom: '12px',
          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(99, 102, 241, 0.1))',
          borderRadius: '10px',
          padding: '10px 12px',
          border: '1px solid rgba(168, 85, 247, 0.35)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '15px' }}>🌌</span>
            <span style={{ fontWeight: 700, fontSize: '12.5px', color: '#c084fc' }}>
              {isEn ? 'Astral Seed Infusion (Special Multiplier)' : 'พรเมล็ดดวงดาว (ตัวคูณพิเศษ)'}
            </span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: isSeedMaxed ? '#4ade80' : '#c084fc',
                background: isSeedMaxed ? 'rgba(74, 222, 128, 0.16)' : 'rgba(168, 85, 247, 0.16)',
                border: isSeedMaxed ? '1px solid rgba(74, 222, 128, 0.4)' : '1px solid rgba(168, 85, 247, 0.4)',
                padding: '1px 7px',
                borderRadius: '999px',
              }}
            >
              {isSeedMaxed ? (isEn ? 'MAXED ✓' : 'เต็มแล้ว ✓') : `Lv. ${astralSeedLevel}/${ASTRAL_SEED_MAX_LEVEL}`}
            </span>
          </div>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#ffd76a', fontFamily: 'monospace' }}>
            +{astralSeedLevel}% (×{(1 + astralSeedLevel * ASTRAL_SEED_MULT_PER_LEVEL).toFixed(2)})
          </span>
        </div>

        <div style={{ fontSize: '11px', color: 'var(--root-cream-dim)', marginBottom: '8px' }}>
          {isEn
            ? `Permanent +1% (+0.01x) Eternal Seeds Special Multiplier per level across all resets (max +100% / x2.00). Flat cost: ${ASTRAL_SEED_COST} 🌸/Lv.`
            : `เพิ่มตัวคูณพิเศษเมล็ดนิรันดร์ที่ได้รับ +1% (+0.01×) ต่อเลเวล (สูงสุด +100% หรือ ×2.00 เท่า) ถาวรข้ามทุกรอบรีเซ็ต ราคาคงที่ ${ASTRAL_SEED_COST} 🌸/เวล`}
        </div>

        {!isSeedMaxed && (
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              type="button"
              disabled={!canBuySeed1}
              onClick={() => onBuyAstralSeed?.(1)}
              style={{
                flex: 1,
                padding: '6px 10px',
                borderRadius: '6px',
                border: 'none',
                background: canBuySeed1 ? 'linear-gradient(135deg, #9333ea, #6366f1)' : 'rgba(255,255,255,0.08)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '11.5px',
                cursor: canBuySeed1 ? 'pointer' : 'not-allowed',
                opacity: canBuySeed1 ? 1 : 0.5,
              }}
            >
              {isEn ? `Buy 1 (${ASTRAL_SEED_COST} 🌸)` : `ซื้อ 1 (${ASTRAL_SEED_COST} 🌸)`}
            </button>
            <button
              type="button"
              disabled={maxSeedInfo.count <= 0}
              onClick={() => onBuyAstralSeed?.('max')}
              title={
                isEn
                  ? `Buy all affordable levels (+${maxSeedInfo.count} for ${maxSeedInfo.totalCost} 🌸)`
                  : `ซื้อทั้งหมดเท่าที่ทำได้ (+${maxSeedInfo.count} ใช้ ${maxSeedInfo.totalCost} 🌸)`
              }
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid rgba(255, 215, 106, 0.4)',
                background: maxSeedInfo.count > 0 ? 'rgba(255, 215, 106, 0.18)' : 'rgba(255,255,255,0.05)',
                color: maxSeedInfo.count > 0 ? '#ffd76a' : 'var(--root-cream-dim)',
                fontWeight: 700,
                fontSize: '11.5px',
                cursor: maxSeedInfo.count > 0 ? 'pointer' : 'not-allowed',
                opacity: maxSeedInfo.count > 0 ? 1 : 0.4,
              }}
            >
              {isEn
                ? (maxSeedInfo.count > 0 ? `Buy All (+${maxSeedInfo.count})` : 'Buy All')
                : (maxSeedInfo.count > 0 ? `ซื้อทั้งหมด (+${maxSeedInfo.count})` : 'ซื้อทั้งหมด')}
            </button>
          </div>
        )}
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
