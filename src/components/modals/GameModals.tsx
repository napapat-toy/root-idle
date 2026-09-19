'use client';

import React from 'react';
import { GameEngine } from '@/hooks/useGameEngine';
import {
  OfflineModal,
  PrestigeModal,
  OptionsModal,
  AchievementsModal,
  StatsModal,
  WardrobeModal,
  RelicsModal,
  AutomationModal,
  TranscendenceModal,
  TrialsModal,
} from './index';

export type ModalType =
  | 'prestige'
  | 'transcendence'
  | 'trials'
  | 'wardrobe'
  | 'relics'
  | 'automation'
  | 'options'
  | 'achievements'
  | 'stats';

export interface GameModalsProps {
  activeModal: ModalType | null;
  onClose: () => void;
  onOpenModal: (modal: ModalType) => void;
  game: GameEngine;
}

export const GameModals: React.FC<GameModalsProps> = React.memo(({
  activeModal,
  onClose,
  onOpenModal,
  game,
}) => {
  const { state, lang, prestige, transcendence, cosmetics, storage } = game;

  return (
    <>
      {/* Offline progress modal */}
      {game.offlineModal && (
        <OfflineModal
          gain={game.offlineModal.gain}
          dt={game.offlineModal.dt}
          lang={lang}
          onClaim={game.claimOffline}
        />
      )}

      {/* Wardrobe Modal */}
      <WardrobeModal
        isOpen={activeModal === 'wardrobe'}
        state={state}
        previewSkin={cosmetics.previewSkin}
        previewUITheme={cosmetics.previewUITheme}
        onClose={onClose}
        onSelectSkin={cosmetics.setSkin}
        onSelectUITheme={cosmetics.setUITheme}
        onBuySkin={cosmetics.buySkin}
        onBuyUITheme={cosmetics.buyUITheme}
        onStartPreviewSkin={cosmetics.startPreviewSkin}
        onStartPreviewUITheme={cosmetics.startPreviewUITheme}
        onClearPreview={cosmetics.clearPreview}
        onOpenPrestige={() => onOpenModal('prestige')}
      />

      {/* Relics & Biomes Museum Modal */}
      {activeModal === 'relics' && (
        <RelicsModal
          state={state}
          onClose={onClose}
          onSelectBiome={game.setActiveBiome}
        />
      )}

      {/* Prestige modal */}
      <PrestigeModal
        isOpen={activeModal === 'prestige'}
        state={state}
        onClose={onClose}
        onConfirmPrestige={prestige.doPrestige}
        onBuyStarterCulture={prestige.buyStarterCulture}
        onBuyGoldenSeed={prestige.buyGoldenSeed}
        onBuyPassiveRate={prestige.buyPassiveRate}
        onBuyAutoRoot={prestige.buyAutoRoot}
        onToggleAutoRoot={prestige.toggleAutoRoot}
        onBuyEventBonus={prestige.buyEventBonus}
        onBuyEventDuration={prestige.buyEventDuration}
        onBuyLuckyChance={prestige.buyLuckyChance}
        onBuyLuckyMagnitude={prestige.buyLuckyMagnitude}
        onBuyLuckyDuration={prestige.buyLuckyDuration}
        onBuyOfflineCapUpgrade={prestige.buyOfflineCapUpgrade}
        onTransmuteSeedsToPetals={transcendence.transmuteSeedsToPetals}
        onTransmuteEssencesToPetals={transcendence.transmuteEssencesToPetals}
      />

      {/* Achievements modal */}
      <AchievementsModal
        isOpen={activeModal === 'achievements'}
        state={state}
        onClose={onClose}
      />

      {/* Stats Dashboard modal */}
      <StatsModal
        isOpen={activeModal === 'stats'}
        state={state}
        onClose={onClose}
      />

      {/* Options & Settings modal */}
      <OptionsModal
        isOpen={activeModal === 'options'}
        state={state}
        onClose={onClose}
        onExport={storage.exportSaveCode}
        onImport={storage.importSaveCode}
        onSaveSlot={storage.saveSlotAction}
        onLoadSlot={storage.loadSlotAction}
        onDeleteSlot={storage.deleteSlotAction}
        onHardReset={storage.doHardReset}
        onSetLanguage={game.setLanguage}
      />

      {/* Automation Control Modal */}
      <AutomationModal
        isOpen={activeModal === 'automation'}
        state={state}
        onClose={onClose}
        onToggleAutoRoot={prestige.toggleAutoRoot}
      />

      {/* Gaia Transcendence Modal */}
      {activeModal === 'transcendence' && (
        <TranscendenceModal
          state={state}
          onClose={onClose}
          onTranscend={transcendence.doTranscendence}
          onBuyPrimordialVigor={transcendence.buyPrimordialVigor}
          onBuySoilMemory={transcendence.buySoilMemory}
          onBuyGaiaBlessing={transcendence.buyGaiaBlessing}
          onBuyAutoManager={transcendence.buyAutoManager}
          onBuyGaiaTouch={transcendence.buyGaiaTouch}
          onBuyEchoResonance={transcendence.buyEchoResonance}
          onBuyGaiaClairvoyance={transcendence.buyGaiaClairvoyance}
          onBuyPrimordialSeedling={transcendence.buyPrimordialSeedling}
          onBuyDeepMeditation={transcendence.buyDeepMeditation}
          onBuyHyperdrive={transcendence.buyHyperdrive}
          onBuyAuroraBloom={transcendence.buyAuroraBloom}
        />
      )}

      {/* Subterranean Trials Modal */}
      <TrialsModal
        isOpen={activeModal === 'trials'}
        state={state}
        onClose={onClose}
        onStartTrial={transcendence.startTrial}
        onAbandonTrial={transcendence.abandonTrial}
        onOpenTranscendence={() => onOpenModal('transcendence')}
      />
    </>
  );
});

GameModals.displayName = 'GameModals';
