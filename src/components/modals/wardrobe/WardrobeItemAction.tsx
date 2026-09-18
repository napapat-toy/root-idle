'use client';

import React from 'react';
import { fmtInt } from '@/lib/formatters';

interface WardrobeItemActionProps {
  curEquipped: boolean;
  curOwned: boolean;
  isTrialTier: boolean;
  isAstralTier: boolean;
  isEssenceTier?: boolean;
  canAfford: boolean;
  currentPetalCost: number;
  currentEssenceCost?: number;
  myPetals: number;
  myEssences?: number;
  curCost: number;
  eternalSeeds: number;
  isEn: boolean;
  equippedBadgeText: string;
  onEquip: () => void;
  onBuy: () => void;
  onOpenPrestige: () => void;
  onClose: () => void;
}

export const WardrobeItemAction: React.FC<WardrobeItemActionProps> = React.memo(({
  curEquipped,
  curOwned,
  isTrialTier,
  isAstralTier,
  isEssenceTier = false,
  canAfford,
  currentPetalCost,
  currentEssenceCost = 0,
  myPetals,
  myEssences = 0,
  curCost,
  eternalSeeds,
  isEn,
  equippedBadgeText,
  onEquip,
  onBuy,
  onOpenPrestige,
  onClose,
}) => {
  return (
    <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
      {curEquipped ? (
        <div
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid var(--accent-glow-dim)',
            color: 'var(--accent-glow)',
            fontWeight: 700,
            fontSize: '13px',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <span>✓</span>
          <span>{equippedBadgeText}</span>
        </div>
      ) : curOwned ? (
        <button
          onClick={onEquip}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '12px',
            background: 'var(--accent-glow)',
            color: '#12190d',
            border: 'none',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)',
          }}
        >
          ✅ {isEn ? 'Equip This' : 'สวมใส่อันนี้'}
        </button>
      ) : isTrialTier ? (
        <div
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '12px',
            background: 'rgba(234, 179, 8, 0.12)',
            border: '1px solid rgba(234, 179, 8, 0.35)',
            color: '#facc15',
            fontWeight: 700,
            fontSize: '12px',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <span>⚔️</span>
          <span>{isEn ? 'Subterranean Trial Reward' : 'รางวัลจากการทดลองแห่งผืนพิภพ'}</span>
        </div>
      ) : isAstralTier ? (
        canAfford ? (
          <button
            onClick={onBuy}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: '0 0 16px rgba(236, 72, 153, 0.5)',
              transition: 'all 0.15s ease',
            }}
          >
            🛒 {currentPetalCost} 🌸 {isEn ? 'Buy & Equip' : 'ซื้อ & สวมใส่'}
          </button>
        ) : (
          <div
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '12px',
              background: 'rgba(244, 114, 182, 0.12)',
              border: '1px solid rgba(244, 114, 182, 0.35)',
              color: '#f472b6',
              fontWeight: 700,
              fontSize: '12px',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
            title={isEn ? `Need ${currentPetalCost - myPetals} more Astral Petals` : `ยังขาดอีก ${currentPetalCost - myPetals} เกสรดวงดาว`}
          >
            <span>🔒 {currentPetalCost} 🌸</span>
            <span>{isEn ? 'Need Astral Petals' : 'ต้องการเกสรดวงดาว'}</span>
          </div>
        )
      ) : isEssenceTier ? (
        canAfford ? (
          <button
            onClick={onBuy}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #059669, #10b981)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: '0 0 14px rgba(16, 185, 129, 0.5)',
              transition: 'all 0.15s ease',
            }}
          >
            🛒 {fmtInt(currentEssenceCost)} 🌍 {isEn ? 'Buy & Equip' : 'ซื้อ & สวมใส่'}
          </button>
        ) : (
          <div
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '12px',
              background: 'rgba(52, 211, 153, 0.12)',
              border: '1px solid rgba(52, 211, 153, 0.35)',
              color: '#34d399',
              fontWeight: 700,
              fontSize: '12px',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
            title={isEn ? `Need ${fmtInt(currentEssenceCost - myEssences)} more Gaia Essences` : `ยังขาดอีก ${fmtInt(currentEssenceCost - myEssences)} ละอองชีวิต`}
          >
            <span>🔒 {fmtInt(currentEssenceCost)} 🌍</span>
            <span>{isEn ? 'Need Gaia Essences' : 'ต้องการละอองชีวิต'}</span>
          </div>
        )
      ) : canAfford ? (
        <button
          onClick={onBuy}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: '#ffffff',
            border: 'none',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer',
            boxShadow: '0 0 14px rgba(16, 185, 129, 0.5)',
            transition: 'all 0.15s ease',
          }}
        >
          🛒 {fmtInt(curCost)} 🌌 {isEn ? 'Buy & Equip' : 'ซื้อ & สวมใส่'}
        </button>
      ) : (
        <button
          onClick={() => {
            onClose();
            onOpenPrestige();
          }}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '12px',
            background: 'rgba(192, 132, 252, 0.15)',
            border: '1px solid rgba(192, 132, 252, 0.35)',
            color: '#c084fc',
            fontWeight: 700,
            fontSize: '12px',
            cursor: 'pointer',
          }}
          title={isEn ? `Need ${fmtInt(curCost - eternalSeeds)} more seeds` : `ยังขาดอีก ${fmtInt(curCost - eternalSeeds)} เมล็ด`}
        >
          🔒 {fmtInt(curCost)} 🌌 {isEn ? 'Unlock in Prestige' : 'ปลดล็อกในร้าน Prestige'}
        </button>
      )}
    </div>
  );
});

WardrobeItemAction.displayName = 'WardrobeItemAction';
