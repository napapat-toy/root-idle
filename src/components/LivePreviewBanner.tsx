'use client';

import React from 'react';
import { GameState, Language, SkinId, UIThemeId } from '@/types/game';
import {
  SKIN_COSTS,
  SKIN_PETAL_COSTS,
  UI_THEME_COSTS,
  UI_THEME_PETAL_COSTS,
} from '@/constants/gameData';
import { fmtInt } from '@/lib/formatters';
import { SKIN_NAMES, UI_THEME_NAMES, t } from '@/lib/i18n';

export interface LivePreviewBannerProps {
  state: GameState;
  lang: Language;
  previewSkin: SkinId | null;
  previewUITheme: UIThemeId | null;
  wardrobeModalOpen: boolean;
  onClearPreview: () => void;
  onBuySkin: (skinId: SkinId, keep: boolean) => void;
  onBuyUITheme: (themeId: UIThemeId, keep: boolean) => void;
  onOpenPrestige: () => void;
}

export const LivePreviewBanner: React.FC<LivePreviewBannerProps> = React.memo(({
  state,
  lang,
  previewSkin,
  previewUITheme,
  wardrobeModalOpen,
  onClearPreview,
  onBuySkin,
  onBuyUITheme,
  onOpenPrestige,
}) => {
  if (wardrobeModalOpen || (!previewSkin && !previewUITheme)) {
    return null;
  }

  const tr = t(lang);

  const previewPetalCost = previewSkin
    ? SKIN_PETAL_COSTS[previewSkin] || 0
    : previewUITheme
    ? UI_THEME_PETAL_COSTS[previewUITheme] || 0
    : 0;
  const isPetalItem = previewPetalCost > 0;
  const previewCost = previewSkin
    ? SKIN_COSTS[previewSkin] || 0
    : previewUITheme
    ? UI_THEME_COSTS[previewUITheme] || 0
    : 0;
  const canAfford = isPetalItem
    ? (state.transcendence?.astralPetals || 0) >= previewPetalCost
    : state.eternalSeeds >= previewCost;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        background: 'rgba(15, 23, 42, 0.94)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(56, 189, 248, 0.5)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 16px rgba(56, 189, 248, 0.25)',
        borderRadius: '999px',
        padding: '8px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        color: '#f8fafc',
        fontSize: '13px',
        fontWeight: 600,
        maxWidth: '92vw',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ color: '#38bdf8' }}>✨</span>
        <span>
          {previewSkin
            ? tr.previewSkinLabel.replace('{name}', SKIN_NAMES[previewSkin]?.[lang] || '')
            : tr.previewThemeLabel.replace('{name}', (previewUITheme && UI_THEME_NAMES[previewUITheme]?.[lang]) || '')}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button
          onClick={onClearPreview}
          style={{
            padding: '5px 12px',
            borderRadius: '999px',
            background: 'rgba(255, 255, 255, 0.15)',
            color: '#f8fafc',
            border: 'none',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600,
          }}
        >
          {tr.previewExitBtn}
        </button>

        {canAfford ? (
          <button
            onClick={() => {
              if (previewSkin) {
                onBuySkin(previewSkin, true);
              } else if (previewUITheme) {
                onBuyUITheme(previewUITheme, true);
              }
              onClearPreview();
            }}
            style={{
              padding: '5px 14px',
              borderRadius: '999px',
              background: isPetalItem
                ? 'linear-gradient(135deg, #ec4899, #8b5cf6)'
                : 'linear-gradient(135deg, #10b981, #059669)',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 700,
              boxShadow: isPetalItem
                ? '0 0 12px rgba(236, 72, 153, 0.5)'
                : '0 0 10px rgba(16, 185, 129, 0.5)',
            }}
          >
            🛒 {isPetalItem ? `${previewPetalCost} 🌸` : `${fmtInt(previewCost)} 🌌`}{' '}
            {tr.previewBuyKeep}
          </button>
        ) : isPetalItem ? (
          <div
            style={{
              padding: '5px 14px',
              borderRadius: '999px',
              background: 'rgba(244, 114, 182, 0.15)',
              color: '#f472b6',
              border: '1px solid rgba(244, 114, 182, 0.35)',
              fontSize: '12px',
              fontWeight: 700,
            }}
          >
            🔒 {previewPetalCost} 🌸 {tr.previewNeedPetals}
          </div>
        ) : (
          <button
            onClick={() => {
              onClearPreview();
              onOpenPrestige();
            }}
            style={{
              padding: '5px 14px',
              borderRadius: '999px',
              background: 'var(--bg-panel-2)',
              color: '#c084fc',
              border: '1px solid rgba(192, 132, 252, 0.3)',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 700,
            }}
            title={tr.needMoreSeeds.replace('{count}', fmtInt(previewCost - state.eternalSeeds))}
          >
            🔒 {fmtInt(previewCost)} 🌌 {tr.previewUnlockInPrestige}
          </button>
        )}
      </div>
    </div>
  );
});

LivePreviewBanner.displayName = 'LivePreviewBanner';
