'use client';

import React from 'react';
import { GameState, Language, SkinId, UIThemeId } from '@/types/game';
import {
  canAffordCosmetic,
  getSkinCostInfo,
  getUIThemeCostInfo,
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

  const costInfo = previewSkin
    ? getSkinCostInfo(previewSkin)
    : previewUITheme
    ? getUIThemeCostInfo(previewUITheme)
    : null;

  const isPetalItem = costInfo?.currency === 'petals';
  const isEssenceItem = costInfo?.currency === 'essence';
  const isTrialItem = costInfo?.isTrial;
  const previewCost = costInfo?.amount || 0;
  const canAfford = costInfo ? canAffordCosmetic(state, costInfo) : false;

  return (
    <div className="live-preview-banner">
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

        {isTrialItem ? (
          <div
            style={{
              padding: '5px 14px',
              borderRadius: '999px',
              background: 'rgba(234, 179, 8, 0.15)',
              color: '#facc15',
              border: '1px solid rgba(234, 179, 8, 0.35)',
              fontSize: '12px',
              fontWeight: 700,
            }}
          >
            ⚔️ {lang === 'en' ? 'Trial Reward' : 'รางวัลบททดสอบ'}
          </div>
        ) : canAfford ? (
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
                : isEssenceItem
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 700,
              boxShadow: isPetalItem
                ? '0 0 12px rgba(236, 72, 153, 0.5)'
                : isEssenceItem
                ? '0 0 10px rgba(16, 185, 129, 0.5)'
                : '0 0 10px rgba(59, 130, 246, 0.5)',
            }}
          >
            🛒 {isPetalItem ? `${previewCost} 🌸` : isEssenceItem ? `${previewCost} 🌍` : `${fmtInt(previewCost)} 🌌`}{' '}
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
            🔒 {previewCost} 🌸 {tr.previewNeedPetals}
          </div>
        ) : isEssenceItem ? (
          <div
            style={{
              padding: '5px 14px',
              borderRadius: '999px',
              background: 'rgba(52, 211, 153, 0.15)',
              color: '#34d399',
              border: '1px solid rgba(52, 211, 153, 0.35)',
              fontSize: '12px',
              fontWeight: 700,
            }}
          >
            🔒 {previewCost} 🌍 {lang === 'en' ? 'Need Gaia Essences' : 'ต้องการละอองชีวิต'}
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
