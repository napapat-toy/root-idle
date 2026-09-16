'use client';

import React from 'react';
import { GameState, Language } from '@/types/game';
import {
  calcTranscendenceEssences,
  GAIA_PERK_DEFS,
  GaiaPerkId,
} from '@/constants/transcendence';
import { t } from '@/lib/i18n';
import { fmt, fmtInt } from '@/lib/formatters';
import { GaiaPerkRow } from './transcendence/GaiaPerkRow';
import { GrandResetBanner } from './transcendence/GrandResetBanner';

interface TranscendenceModalProps {
  state: GameState;
  onClose: () => void;
  onTranscend: () => void;
  onBuyPrimordialVigor: () => void;
  onBuySoilMemory: () => void;
  onBuyAutoManager?: () => void;
  onBuyGaiaBlessing?: () => void;
  onBuyGaiaTouch: () => void;
  onBuyEchoResonance: () => void;
  onBuyGaiaClairvoyance: () => void;
  onBuyPrimordialSeedling: () => void;
  onBuyDeepMeditation: () => void;
  onBuyHyperdrive?: () => void;
  onToggleHyperdrive?: () => void;
  onBuyAuroraBloom?: () => void;
}

export const TranscendenceModal: React.FC<TranscendenceModalProps> = React.memo(({
  state,
  onClose,
  onTranscend,
  onBuyPrimordialVigor,
  onBuySoilMemory,
  onBuyAutoManager,
  onBuyGaiaBlessing,
  onBuyGaiaTouch,
  onBuyEchoResonance,
  onBuyGaiaClairvoyance,
  onBuyPrimordialSeedling,
  onBuyDeepMeditation,
  onBuyHyperdrive,
  onToggleHyperdrive,
  onBuyAuroraBloom,
}) => {
  const lang: Language = state.lang || 'th';
  const isEn = lang === 'en';
  const tr = t(lang);

  const essences = state.transcendence?.gaiaEssences || 0;
  const totalLifetimeEssences = state.transcendence?.totalGaiaEssencesLifetime || 0;
  const pendingEssences = calcTranscendenceEssences(state);

  const handlers: Record<GaiaPerkId, (() => void) | undefined> = {
    vigor: onBuyPrimordialVigor,
    soil: onBuySoilMemory,
    blessing: onBuyGaiaBlessing || onBuyAutoManager,
    touch: onBuyGaiaTouch,
    echo_res: onBuyEchoResonance,
    clairvoyance: onBuyGaiaClairvoyance,
    seedling: onBuyPrimordialSeedling,
    meditation: onBuyDeepMeditation,
    hyperdrive: onBuyHyperdrive,
    aurora: onBuyAuroraBloom,
  };

  return (
    <div className="offline-backdrop" onClick={onClose} style={{ zIndex: 2100 }}>
      <div
        className="modal-wrapper transcendence-modal-wrapper"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '600px', width: '100%' }}
      >
        <button className="modal-close-x" onClick={onClose} aria-label={tr.close}>
          &times;
        </button>

        <div
          className="offline-modal generic-modal custom-scrollbar transcendence-modal-content"
          style={{ maxHeight: '88vh', display: 'flex', flexDirection: 'column' }}
        >
          {/* Header */}
          <div className="icon" style={{ fontSize: '36px', marginBottom: '4px' }}>
            🌍
          </div>
          <h2
            style={{
              marginBottom: '4px',
              background: 'linear-gradient(135deg, var(--gaia-green), var(--astral-cyan))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {tr.transcendenceTitle}
          </h2>

          <div
            className="away-time"
            style={{
              marginBottom: '14px',
              fontSize: '13px',
              display: 'flex',
              justifyContent: 'center',
              gap: '14px',
              flexWrap: 'wrap',
            }}
          >
            <span>
              {isEn ? `Current Essences: ${fmt(essences)} 🌍` : `ครอบครอง: ${fmt(essences)} 🌍`}
            </span>
            {!!state.transcendence?.auroraBloomUnlocked && (
              <span style={{ color: 'var(--cosmic-pink)', fontWeight: 700 }}>
                {isEn
                  ? `Astral Petals: ${fmtInt(state.transcendence?.astralPetals || 0)} 🌸`
                  : `เกสรดวงดาว: ${fmtInt(state.transcendence?.astralPetals || 0)} 🌸`}
              </span>
            )}
            <span style={{ color: 'var(--root-cream-dim)' }}>
              {isEn
                ? `Total Lifetime: ${fmt(totalLifetimeEssences)}`
                : `สะสมตลอดกาล: ${fmt(totalLifetimeEssences)}`}
            </span>
          </div>

          <div
            className="custom-scrollbar"
            style={{
              flex: 1,
              overflowY: 'auto',
              paddingRight: '4px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              textAlign: 'left',
            }}
          >
            {/* Grand Reset Card */}
            <GrandResetBanner
              state={state}
              lang={lang}
              pendingEssences={pendingEssences}
              onTranscend={onTranscend}
            />

            {/* Gaia Perks List (Iterating over GAIA_PERK_DEFS schema) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {GAIA_PERK_DEFS.map(def => {
                const lvl = def.getLevel ? def.getLevel(state) : undefined;
                const cost = typeof def.cost === 'function' ? def.cost(lvl || 0) : def.cost;
                const effectText = def.getEffectText ? def.getEffectText(state, isEn) : undefined;
                const isUnlocked = def.isUnlocked ? def.isUnlocked(state) : undefined;
                const isToggledOn = def.isToggledOn ? def.isToggledOn(state) : undefined;
                const name = (tr as Record<string, string>)[def.nameKey] || def.nameKey;
                const desc = (tr as Record<string, string>)[def.descKey] || def.descKey;

                return (
                  <GaiaPerkRow
                    key={def.id}
                    icon={def.icon}
                    name={name}
                    desc={desc}
                    level={lvl}
                    maxLevel={def.maxLevel}
                    cost={cost}
                    effectText={effectText}
                    essences={essences}
                    maxTag={tr.maxTag}
                    isUnlocked={isUnlocked}
                    isToggle={def.type === 'toggle'}
                    isToggledOn={isToggledOn}
                    onToggle={def.id === 'hyperdrive' ? onToggleHyperdrive : undefined}
                    onBuy={handlers[def.id]}
                    toggleOnText={isEn ? '2x ACTIVE' : 'กำลังเร่ง 2x'}
                    toggleOffText={isEn ? '1x PAUSED' : 'พัก 1x'}
                    activeTagText={isEn ? 'ACTIVE' : 'ทำงานอยู่'}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

TranscendenceModal.displayName = 'TranscendenceModal';
