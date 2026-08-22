'use client';

import React, { useState } from 'react';
import { useGameEngine } from '@/hooks/useGameEngine';
import { Header } from '@/components/Header';
import { TopActions } from '@/components/TopActions';
import { StageCanvas } from '@/components/StageCanvas';
import { ShopPanel } from '@/components/ShopPanel';
import { OfflineModal } from '@/components/modals/OfflineModal';
import { PrestigeModal } from '@/components/modals/PrestigeModal';
import { OptionsModal } from '@/components/modals/OptionsModal';
import { AchievementsModal } from '@/components/modals/AchievementsModal';
import { StatsModal } from '@/components/modals/StatsModal';
import { AchievementToast } from '@/components/AchievementToast';

export default function Home() {
  const {
    state,
    lang,
    totalRate,
    activeBuff,
    activeLuckyBuff,
    activeEvents,
    floatingTexts,
    offlineModal,
    branches,
    maxY,
    achievementToastQueue,
    dismissAchievementToast,
    setLanguage,
    toggleLanguage,
    buyModule,
    buyRootUpgrade,
    buyEcho,
    setBuyQty,
    claimEvent,
    claimOffline,
    doPrestige,
    doHardReset,
    toggleSkin,
    setSkin,
    buyStarterCulture,
    buyGoldenSeed,
    buyPassiveRate,
    buyAutoRoot,
    buyAutoRootSmart,
    buyAutoRootAll,
    setAutoRootMode,
    cycleAutoRootMode,
    buyAutoEvent,
    toggleAutoEvent,
    buyAutoReset,
    toggleAutoReset,
    toggleAutoRoot,
    buyEventBonus,
    buyEventDuration,
    buyLuckyChance,
    buyLuckyMagnitude,
    buyLuckyDuration,
    buyOfflineCapUpgrade,
    buyAuraRoots,
    buySkin,
    importSaveCode,
    exportSaveCode,
    saveSlotAction,
    loadSlotAction,
    deleteSlotAction,
  } = useGameEngine();

  const [prestigeModalOpen, setPrestigeModalOpen] = useState(false);
  const [optionsModalOpen, setOptionsModalOpen] = useState(false);
  const [achievementsModalOpen, setAchievementsModalOpen] = useState(false);
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="app" style={{ opacity: 0 }}>
        {/* Mount placeholder */}
      </div>
    );
  }

  return (
    <div className="app">
      <Header
        nutrients={state.nutrients}
        totalRate={totalRate}
        eternalSeeds={state.eternalSeeds}
        lang={lang}
      />

      <div className="canvas-column">
        <TopActions
          state={state}
          onOpenPrestige={() => setPrestigeModalOpen(true)}
          onToggleSkin={toggleSkin}
          onOpenOptions={() => setOptionsModalOpen(true)}
          onOpenAchievements={() => setAchievementsModalOpen(true)}
          onOpenStats={() => setStatsModalOpen(true)}
          onToggleLanguage={toggleLanguage}
          onToggleAutoRoot={toggleAutoRoot}
          onCycleAutoRootMode={cycleAutoRootMode}
          onToggleAutoEvent={toggleAutoEvent}
          onToggleAutoReset={toggleAutoReset}
        />

        <StageCanvas
          totalOwned={state.totalOwned}
          branches={branches}
          maxY={maxY}
          activeSkin={state.prestige.activeSkin}
          activeBuff={activeBuff}
          activeLuckyBuff={activeLuckyBuff}
          activeEvents={activeEvents}
          floatingTexts={floatingTexts}
          lang={lang}
          onClaimEvent={claimEvent}
        />
      </div>

      <div className="shop-column">
        <ShopPanel
          state={state}
          totalRate={totalRate}
          onBuyModule={buyModule}
          onBuyRootUpgrade={buyRootUpgrade}
          onBuyEcho={buyEcho}
          onSetBuyQty={setBuyQty}
        />
      </div>

      {/* Offline progress modal */}
      {offlineModal && (
        <OfflineModal
          gain={offlineModal.gain}
          dt={offlineModal.dt}
          lang={lang}
          onClaim={claimOffline}
        />
      )}

      {/* Prestige modal */}
      <PrestigeModal
        isOpen={prestigeModalOpen}
        state={state}
        onClose={() => setPrestigeModalOpen(false)}
        onConfirmPrestige={doPrestige}
        onBuyStarterCulture={buyStarterCulture}
        onBuyGoldenSeed={buyGoldenSeed}
        onBuyPassiveRate={buyPassiveRate}
        onBuyAutoRoot={buyAutoRoot}
        onToggleAutoRoot={toggleAutoRoot}
        onSetAutoRootMode={setAutoRootMode}
        onBuyAutoRootSmart={buyAutoRootSmart}
        onBuyAutoRootAll={buyAutoRootAll}
        onBuyAutoEvent={buyAutoEvent}
        onToggleAutoEvent={toggleAutoEvent}
        onBuyAutoReset={buyAutoReset}
        onToggleAutoReset={toggleAutoReset}
        onBuyEventBonus={buyEventBonus}
        onBuyEventDuration={buyEventDuration}
        onBuyLuckyChance={buyLuckyChance}
        onBuyLuckyMagnitude={buyLuckyMagnitude}
        onBuyLuckyDuration={buyLuckyDuration}
        onBuyOfflineCapUpgrade={buyOfflineCapUpgrade}
        onBuyAuraRoots={buyAuraRoots}
        onBuySkin={buySkin}
      />

      {/* Achievements modal */}
      <AchievementsModal
        isOpen={achievementsModalOpen}
        state={state}
        onClose={() => setAchievementsModalOpen(false)}
      />

      {/* Stats Dashboard modal */}
      <StatsModal
        isOpen={statsModalOpen}
        state={state}
        onClose={() => setStatsModalOpen(false)}
      />

      {/* Options & Settings modal */}
      <OptionsModal
        isOpen={optionsModalOpen}
        state={state}
        onClose={() => setOptionsModalOpen(false)}
        onSelectSkin={setSkin}
        onExport={exportSaveCode}
        onImport={importSaveCode}
        onSaveSlot={saveSlotAction}
        onLoadSlot={loadSlotAction}
        onDeleteSlot={deleteSlotAction}
        onHardReset={doHardReset}
        onSetLanguage={setLanguage}
        onToggleAutoRoot={toggleAutoRoot}
        onSetAutoRootMode={setAutoRootMode}
        onToggleAutoEvent={toggleAutoEvent}
        onToggleAutoReset={toggleAutoReset}
      />

      {/* Achievement Toast Notifications */}
      <AchievementToast
        queue={achievementToastQueue}
        lang={lang}
        onDismiss={dismissAchievementToast}
      />
    </div>
  );
}
