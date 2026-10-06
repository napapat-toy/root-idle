'use client';

import React from 'react';
import { GameState, Language } from '@/types/game';
import {
  calcTranscendenceEssences,
  calcMaxGaiaBlessing,
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
  onBuyGaiaBlessing?: (qty?: number | 'max') => void;
  onBuyGaiaTouch: () => void;
  onBuyEchoResonance: () => void;
  onBuyGaiaClairvoyance: () => void;
  onBuyPrimordialSeedling: () => void;
  onBuyDeepMeditation: () => void;
  onBuyHyperdrive?: () => void;
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
                const name = (tr as Record<string, string>)[def.nameKey] || def.nameKey;
                const desc = (tr as Record<string, string>)[def.descKey] || def.descKey;

                const isMaxed = lvl !== undefined && def.maxLevel !== undefined ? lvl >= def.maxLevel : false;

                let customAction: React.ReactNode = undefined;
                if (def.id === 'blessing' && !isMaxed) {
                  const maxInfo = calcMaxGaiaBlessing(lvl || 0, essences);
                  const canAffordOne = cost !== undefined && essences >= cost;
                  customAction = (
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
                      <button
                        type="button"
                        className="btn-passive-bulk"
                        disabled={!canAffordOne}
                        onClick={() => onBuyGaiaBlessing?.(1)}
                        title={isEn ? `Buy 1 Level (${fmtInt(cost || 0)} 🌍)` : `ซื้อ 1 เลเวล (${fmtInt(cost || 0)} 🌍)`}
                        style={{
                          padding: '6px 10px',
                          fontSize: '12px',
                          borderRadius: '8px',
                          background: canAffordOne ? 'var(--gaia-green-bg)' : undefined,
                          color: canAffordOne ? '#4ade80' : undefined,
                          borderColor: canAffordOne ? 'rgba(74, 222, 128, 0.35)' : undefined,
                        }}
                      >
                        {isEn ? `+1 (${fmtInt(cost || 0)} 🌍)` : `ซื้อ 1 (${fmtInt(cost || 0)} 🌍)`}
                      </button>
                      <button
                        type="button"
                        className="btn-passive-bulk btn-passive-max"
                        disabled={maxInfo.count <= 0}
                        onClick={() => onBuyGaiaBlessing?.('max')}
                        title={
                          isEn
                            ? `Buy all affordable levels (+${fmtInt(maxInfo.count)} for ${fmt(maxInfo.totalCost)} 🌍)`
                            : `ซื้อทั้งหมดเท่าที่ทำได้ (+${fmtInt(maxInfo.count)} ใช้ ${fmt(maxInfo.totalCost)} 🌍)`
                        }
                        style={{
                          padding: '6px 12px',
                          fontSize: '12px',
                          borderRadius: '8px',
                        }}
                      >
                        {isEn
                          ? (maxInfo.count > 0 ? `Buy All (+${maxInfo.count})` : 'Buy All')
                          : (maxInfo.count > 0 ? `ซื้อทั้งหมด (+${maxInfo.count})` : 'ซื้อทั้งหมด')}
                      </button>
                    </div>
                  );
                }

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
                    maxTag={isEn ? 'MAXED ✓' : 'เต็มแล้ว ✓'}
                    isUnlocked={isUnlocked}
                    onBuy={handlers[def.id]}
                    customAction={customAction}
                    activeTagText={isEn ? 'UNLOCKED' : 'ปลดล็อกแล้ว'}
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
