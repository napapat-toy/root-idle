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
import { AutoResetConfigModal } from '@/components/modals/AutoResetConfigModal';
import { AchievementToast } from '@/components/AchievementToast';

import { WardrobeModal } from '@/components/modals/WardrobeModal';
import { RelicsModal } from '@/components/modals/RelicsModal';
import { AutomationModal } from '@/components/modals/AutomationModal';
import { TranscendenceModal } from '@/components/modals/TranscendenceModal';
import { SKIN_COSTS, UI_THEME_COSTS } from '@/constants/gameData';
import { fmtInt } from '@/lib/formatters';
import { SKIN_NAMES, UI_THEME_NAMES } from '@/lib/i18n';

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
    buyRootSynergy,
    setBuyQty,
    claimEvent,
    claimOffline,
    doPrestige,
    doHardReset,
    toggleSkin,
    setSkin,
    ownedUIThemeList,
    toggleUITheme,
    setUITheme,
    buyUITheme,
    previewSkin,
    previewUITheme,
    effectiveSkin,
    effectiveUITheme,
    startPreviewSkin,
    startPreviewUITheme,
    clearPreview,
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
    setAutoResetThreshold,
    toggleAutoRoot,
    buyEventBonus,
    buyEventDuration,
    buyLuckyChance,
    buyLuckyMagnitude,
    buyLuckyDuration,
    buyOfflineCapUpgrade,
    buySkin,
    doTranscendence,
    buyPrimordialVigor,
    buySoilMemory,
    buyAutoManager,
    buyGaiaTouch,
    buyEchoResonance,
    buyGaiaClairvoyance,
    buyPrimordialSeedling,
    buyDeepMeditation,
    startTrial,
    abandonTrial,
    claimUnearthedRelic,
    setActiveBiome,
    onWaterCanvas,
    importSaveCode,
    exportSaveCode,
    saveSlotAction,
    loadSlotAction,
    deleteSlotAction,
  } = useGameEngine();

  const [prestigeModalOpen, setPrestigeModalOpen] = useState(false);
  const [transcendenceModalOpen, setTranscendenceModalOpen] = useState(false);
  const [optionsModalOpen, setOptionsModalOpen] = useState(false);
  const [achievementsModalOpen, setAchievementsModalOpen] = useState(false);
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [wardrobeModalOpen, setWardrobeModalOpen] = useState(false);
  const [relicsModalOpen, setRelicsModalOpen] = useState(false);
  const [automationModalOpen, setAutomationModalOpen] = useState(false);
  const [autoResetModalOpen, setAutoResetModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-ui-theme', effectiveUITheme);
    }
  }, [effectiveUITheme]);

  if (!mounted) {
    return (
      <div className="app" style={{ opacity: 0 }}>
        {/* Mount placeholder */}
      </div>
    );
  }

  const isEn = lang === 'en';

  return (
    <div className="app" data-ui-theme={effectiveUITheme}>
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
          onOpenTranscendence={() => setTranscendenceModalOpen(true)}
          onOpenWardrobe={() => setWardrobeModalOpen(true)}
          onOpenRelics={() => setRelicsModalOpen(true)}
          onOpenAutomation={() => setAutomationModalOpen(true)}
          onOpenOptions={() => setOptionsModalOpen(true)}
          onOpenAchievements={() => setAchievementsModalOpen(true)}
          onOpenStats={() => setStatsModalOpen(true)}
        />

        <StageCanvas
          totalOwned={state.totalOwned}
          owned={state.owned}
          branches={branches}
          maxY={maxY}
          activeSkin={effectiveSkin}
          activeBuff={activeBuff}
          activeLuckyBuff={activeLuckyBuff}
          activeEvents={activeEvents}
          floatingTexts={floatingTexts}
          unclaimedRelicId={state.unclaimedRelicId}
          activeBiome={state.activeBiome}
          lang={lang}
          onClaimEvent={claimEvent}
          onClaimUnearthedRelic={claimUnearthedRelic}
          onWaterCanvas={onWaterCanvas}
        />
      </div>

      <div className="shop-column">
        <ShopPanel
          state={state}
          totalRate={totalRate}
          onBuyModule={buyModule}
          onBuyRootUpgrade={buyRootUpgrade}
          onBuyEcho={buyEcho}
          onBuyRootSynergy={buyRootSynergy}
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

      {/* Wardrobe Modal */}
      <WardrobeModal
        isOpen={wardrobeModalOpen}
        state={state}
        previewSkin={previewSkin}
        previewUITheme={previewUITheme}
        onClose={() => setWardrobeModalOpen(false)}
        onSelectSkin={setSkin}
        onSelectUITheme={setUITheme}
        onBuySkin={buySkin}
        onBuyUITheme={buyUITheme}
        onStartPreviewSkin={startPreviewSkin}
        onStartPreviewUITheme={startPreviewUITheme}
        onClearPreview={clearPreview}
        onOpenPrestige={() => setPrestigeModalOpen(true)}
      />

      {/* Relics & Biomes Museum Modal */}
      {relicsModalOpen && (
        <RelicsModal
          state={state}
          onClose={() => setRelicsModalOpen(false)}
          onSelectBiome={setActiveBiome}
        />
      )}

      {/* Prestige modal */}
      <PrestigeModal
        isOpen={prestigeModalOpen}
        state={state}
        onClose={() => setPrestigeModalOpen(false)}
        onOpenWardrobe={() => setWardrobeModalOpen(true)}
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
        onOpenAutoResetConfig={() => setAutoResetModalOpen(true)}
        onBuyEventBonus={buyEventBonus}
        onBuyEventDuration={buyEventDuration}
        onBuyLuckyChance={buyLuckyChance}
        onBuyLuckyMagnitude={buyLuckyMagnitude}
        onBuyLuckyDuration={buyLuckyDuration}
        onBuyOfflineCapUpgrade={buyOfflineCapUpgrade}
        onBuySkin={buySkin}
        onBuyUITheme={buyUITheme}
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
        onExport={exportSaveCode}
        onImport={importSaveCode}
        onSaveSlot={saveSlotAction}
        onLoadSlot={loadSlotAction}
        onDeleteSlot={deleteSlotAction}
        onHardReset={doHardReset}
        onSetLanguage={setLanguage}
      />

      {/* Automation Control Modal */}
      <AutomationModal
        isOpen={automationModalOpen}
        state={state}
        onClose={() => setAutomationModalOpen(false)}
        onToggleAutoRoot={toggleAutoRoot}
        onSetAutoRootMode={setAutoRootMode}
        onToggleAutoEvent={toggleAutoEvent}
        onToggleAutoReset={toggleAutoReset}
        onOpenAutoResetConfig={() => setAutoResetModalOpen(true)}
      />

      {/* Gaia Transcendence Modal */}
      {transcendenceModalOpen && (
        <TranscendenceModal
          state={state}
          onClose={() => setTranscendenceModalOpen(false)}
          onTranscend={doTranscendence}
          onBuyPrimordialVigor={buyPrimordialVigor}
          onBuySoilMemory={buySoilMemory}
          onBuyAutoManager={buyAutoManager}
          onBuyGaiaTouch={buyGaiaTouch}
          onBuyEchoResonance={buyEchoResonance}
          onBuyGaiaClairvoyance={buyGaiaClairvoyance}
          onBuyPrimordialSeedling={buyPrimordialSeedling}
          onBuyDeepMeditation={buyDeepMeditation}
          onStartTrial={startTrial}
          onAbandonTrial={abandonTrial}
        />
      )}

      {/* Auto Reset Config Modal */}
      {autoResetModalOpen && (
        <AutoResetConfigModal
          currentThreshold={state.prestige.autoResetThreshold || 0}
          lang={lang}
          onConfirm={(val) => {
            setAutoResetThreshold(val);
            setAutoResetModalOpen(false);
          }}
          onClose={() => setAutoResetModalOpen(false)}
        />
      )}

      {/* Achievement Toast Notifications */}
      <AchievementToast
        queue={achievementToastQueue}
        lang={lang}
        onDismiss={dismissAchievementToast}
      />

      {/* Floating Live Preview Banner */}
      {!wardrobeModalOpen && (previewSkin || previewUITheme) && (() => {
        const previewCost = previewSkin
          ? (SKIN_COSTS[previewSkin] || 0)
          : previewUITheme
          ? (UI_THEME_COSTS[previewUITheme] || 0)
          : 0;
        const canAfford = state.eternalSeeds >= previewCost;

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
                  ? (isEn ? `Previewing Root Skin: ${SKIN_NAMES[previewSkin]?.[lang]}` : `กำลังทดลองสกินราก: ${SKIN_NAMES[previewSkin]?.[lang]}`)
                  : (isEn ? `Previewing UI Theme: ${UI_THEME_NAMES[previewUITheme!]?.[lang]}` : `กำลังทดลองธีมหน้าต่าง: ${UI_THEME_NAMES[previewUITheme!]?.[lang]}`)}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={clearPreview}
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
                {isEn ? '✕ Exit' : '✕ ยกเลิก'}
              </button>

              {canAfford ? (
                <button
                  onClick={() => {
                    if (previewSkin) {
                      buySkin(previewSkin, true);
                    } else if (previewUITheme) {
                      buyUITheme(previewUITheme, true);
                    }
                  }}
                  style={{
                    padding: '5px 14px',
                    borderRadius: '999px',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: '#ffffff',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 700,
                    boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)',
                  }}
                >
                  🛒 {fmtInt(previewCost)} 🌌 {isEn ? 'Buy & Keep' : 'ซื้อเลย & สวมใส่'}
                </button>
              ) : (
                <button
                  onClick={() => {
                    clearPreview();
                    setPrestigeModalOpen(true);
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
                  title={isEn ? `Need ${fmtInt(previewCost - state.eternalSeeds)} more seeds` : `ยังขาดอีก ${fmtInt(previewCost - state.eternalSeeds)} เมล็ด`}
                >
                  🔒 {fmtInt(previewCost)} 🌌 {isEn ? 'Prestige Shop' : 'ร้าน Prestige'}
                </button>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
