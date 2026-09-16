'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { useGameEngine } from '@/hooks/useGameEngine';
import { Header } from '@/components/Header';
import { TopActions } from '@/components/TopActions';
import { StageCanvas } from '@/components/StageCanvas';
import { ShopPanel } from '@/components/ShopPanel';
import { AchievementToast } from '@/components/AchievementToast';
import { LivePreviewBanner } from '@/components/LivePreviewBanner';
import { GameModals, ModalType } from '@/components/modals';

export default function Home() {
  const game = useGameEngine();
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const { effectiveUITheme } = game.cosmetics;

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-ui-theme', effectiveUITheme);
    }
  }, [effectiveUITheme]);

  if (!mounted) {
    return <div className="app" style={{ opacity: 0 }} />;
  }

  const { state, lang, totalRate, branches, maxY, events, cosmetics, transcendence, achievements } = game;

  return (
    <div className="app" data-ui-theme={effectiveUITheme}>
      <Header
        nutrients={state.nutrients}
        totalRate={totalRate}
        lang={lang}
      />

      <div className="canvas-column">
        <TopActions
          state={state}
          onOpenPrestige={() => setActiveModal('prestige')}
          onOpenTranscendence={() => setActiveModal('transcendence')}
          onOpenTrials={() => setActiveModal('trials')}
          onOpenWardrobe={() => setActiveModal('wardrobe')}
          onOpenRelics={() => setActiveModal('relics')}
          onOpenAutomation={() => setActiveModal('automation')}
          onOpenOptions={() => setActiveModal('options')}
          onOpenAchievements={() => setActiveModal('achievements')}
          onOpenStats={() => setActiveModal('stats')}
          onToggleHyperdrive={transcendence.toggleHyperdrive}
        />

        <StageCanvas
          totalOwned={state.totalOwned}
          owned={state.owned}
          branches={branches}
          maxY={maxY}
          activeSkin={cosmetics.effectiveSkin}
          activeBuff={events.activeBuff}
          activeLuckyBuff={events.activeLuckyBuff}
          activeEvents={events.activeEvents}
          floatingTexts={events.floatingTexts}
          unclaimedRelicId={state.unclaimedRelicId}
          activeBiome={state.activeBiome}
          lang={lang}
          onClaimEvent={events.claimEvent}
          onClaimUnearthedRelic={game.claimUnearthedRelic}
          onWaterCanvas={game.onWaterCanvas}
        />
      </div>

      <div className="shop-column">
        <ShopPanel
          state={state}
          totalRate={totalRate}
          onBuyModule={game.buyModule}
          onBuyRootUpgrade={game.buyRootUpgrade}
          onBuyEcho={game.buyEcho}
          onBuyRootSynergy={game.buyRootSynergy}
          onSetBuyQty={game.setBuyQty}
        />
      </div>

      {/* Modals & Overlays */}
      <GameModals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        onOpenModal={setActiveModal}
        game={game}
      />

      {/* Achievement Toast Notifications */}
      <AchievementToast
        queue={achievements.achievementToastQueue}
        lang={lang}
        onDismiss={achievements.dismissAchievementToast}
      />

      {/* Floating Live Preview Banner */}
      <LivePreviewBanner
        state={state}
        lang={lang}
        previewSkin={cosmetics.previewSkin}
        previewUITheme={cosmetics.previewUITheme}
        wardrobeModalOpen={activeModal === 'wardrobe'}
        onClearPreview={cosmetics.clearPreview}
        onBuySkin={cosmetics.buySkin}
        onBuyUITheme={cosmetics.buyUITheme}
        onOpenPrestige={() => setActiveModal('prestige')}
      />
    </div>
  );
}
