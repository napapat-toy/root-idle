'use client';

import React, { useState, useEffect } from 'react';
import { GameState, Language } from '@/types/game';
import {
  isTranscendenceUnlocked,
  goldenSeedCost,
  GOLDEN_SEED_MAX_LEVEL,
  eventBonusCost,
  eventBonusMaxed,
  EVENT_BONUS_MAX_LEVEL,
  eventDurationCost,
  eventDurationMaxed,
  EVENT_DURATION_MAX_LEVEL,
  luckyChanceCost,
  luckyChanceMaxed,
  LUCKY_CHANCE_MAX_LEVEL,
  LUCKY_CHANCE_STEP,
  LUCKY_CHANCE_MAX,
  luckyChancePct,
  luckyDurationCost,
  LUCKY_DURATION_BASE,
  LUCKY_DURATION_MAX,
  LUCKY_DURATION_MAX_LEVEL,
  LUCKY_MAGNITUDE_MAX_LEVEL,
  luckyMagnitudeCost,
  OFFLINE_CAP_HOURS,
  offlineCapCost,
  offlineCapMaxed,
  passiveRateCost,
  PASSIVE_RATE_MAX_LEVEL,
  STARTER_CULTURE_MAX_LEVEL,
  starterCultureCost,
} from '@/constants/gameData';
import {
  calcMaxGaiaBlessing,
  GAIA_PERK_DEFS,
  GaiaPerkId,
} from '@/constants/transcendence';
import { fmt, fmtInt } from '@/lib/formatters';
import { t } from '@/lib/i18n';
import { PrestigeUpgradeRow } from './prestige/PrestigeUpgradeRow';
import { SeedTransmuteAltar } from './prestige/SeedTransmuteAltar';
import { GaiaPerkRow } from './transcendence/GaiaPerkRow';

export type SanctuaryTab = 'seeds' | 'gaia' | 'astral';

export interface SanctuaryModalProps {
  isOpen: boolean;
  initialTab?: SanctuaryTab;
  state: GameState;
  onClose: () => void;
  onOpenPrestige?: () => void;
  onOpenTranscendence?: () => void;
  // Seeds (Prestige) Upgrades
  onBuyStarterCulture: (amount?: number | 'max') => void;
  onBuyGoldenSeed: (amount?: number | 'max') => void;
  onBuyPassiveRate: (amount?: number | 'max') => void;
  onBuyAutoRoot: () => void;
  onToggleAutoRoot?: () => void;
  onBuyEventBonus: (amount?: number | 'max') => void;
  onBuyEventDuration: () => void;
  onBuyLuckyChance: () => void;
  onBuyLuckyMagnitude: (amount?: number | 'max') => void;
  onBuyLuckyDuration: (amount?: number | 'max') => void;
  onBuyOfflineCapUpgrade: () => void;
  // Gaia Perks
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
  // Astral Transmutations & Resonance
  onTransmuteSeedsToPetals?: (qty?: number) => void;
  onTransmuteEssencesToPetals?: (qty?: number) => void;
  onBuyAstralResonance?: (qty?: number | 'max') => void;
}

export const SanctuaryModal: React.FC<SanctuaryModalProps> = React.memo(({
  isOpen,
  initialTab = 'seeds',
  state,
  onClose,
  onOpenPrestige,
  onOpenTranscendence,
  onBuyStarterCulture,
  onBuyGoldenSeed,
  onBuyPassiveRate,
  onBuyAutoRoot,
  onToggleAutoRoot: _onToggleAutoRoot,
  onBuyEventBonus,
  onBuyEventDuration,
  onBuyLuckyChance,
  onBuyLuckyMagnitude,
  onBuyLuckyDuration,
  onBuyOfflineCapUpgrade,
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
  onTransmuteSeedsToPetals,
  onTransmuteEssencesToPetals,
  onBuyAstralResonance,
}) => {
  const [activeTab, setActiveTab] = useState<SanctuaryTab>(initialTab);

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const lang: Language = state.lang || 'th';
  const isEn = lang === 'en';
  const tr = t(lang);

  const seeds = state.eternalSeeds;
  const essences = state.transcendence?.gaiaEssences || 0;
  const totalLifetimeEssences = state.transcendence?.totalGaiaEssencesLifetime || 0;
  const petals = state.transcendence?.astralPetals || 0;

  const isTranscendUnlocked = isTranscendenceUnlocked(state) || essences > 0;
  const isAstralUnlocked = !!state.transcendence?.auroraBloomUnlocked || petals > 0;

  const gaiaHandlers: Record<GaiaPerkId, (() => void) | undefined> = {
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

  const renderSectionHeader = (text: string) => (
    <div className="prestige-section-header">{text}</div>
  );

  return (
    <div className="offline-backdrop" onClick={onClose} style={{ zIndex: 2050 }}>
      <div
        className="modal-wrapper"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '580px', width: '100%' }}
      >
        <button className="modal-close-x" onClick={onClose} aria-label={tr.close}>
          &times;
        </button>

        <div
          className="offline-modal generic-modal custom-scrollbar"
          style={{ maxHeight: '88vh', display: 'flex', flexDirection: 'column', padding: '16px 18px' }}
        >
          {/* Header */}
          <div className="icon">🏛️</div>
          <h2>{tr.sanctuaryTitle}</h2>
          <div className="away-time" style={{ marginBottom: '12px' }}>
            {tr.sanctuaryDesc}
          </div>

          {/* Tab Switcher (Matching Wardrobe & Relics modal standard) */}
          <div
            style={{
              display: 'flex',
              background: 'var(--bg-panel-2)',
              borderRadius: '12px',
              padding: '4px',
              gap: '4px',
              border: '1px solid var(--line-soil)',
              marginBottom: '12px',
              flexShrink: 0,
              width: '100%',
              boxSizing: 'border-box',
              overflowX: 'auto',
              scrollbarWidth: 'none',
            }}
          >
            {/* Seeds Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('seeds')}
              style={{
                flex: 1,
                minWidth: '105px',
                padding: '8px 12px',
                borderRadius: '9px',
                border: 'none',
                fontWeight: 700,
                fontSize: '12.5px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: activeTab === 'seeds' ? 'var(--accent-glow)' : 'transparent',
                color: activeTab === 'seeds' ? '#12190d' : 'var(--root-cream)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                whiteSpace: 'nowrap',
              }}
            >
              <span>🌰</span>
              <span>{tr.tabSeeds}</span>
              <span style={{ opacity: activeTab === 'seeds' ? 0.85 : 0.65, fontSize: '11px' }}>
                ({fmtInt(seeds)})
              </span>
            </button>

            {/* Gaia Tab */}
            {isTranscendUnlocked && (
              <button
                type="button"
                onClick={() => setActiveTab('gaia')}
                style={{
                  flex: 1,
                  minWidth: '105px',
                  padding: '8px 12px',
                  borderRadius: '9px',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '12.5px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: activeTab === 'gaia' ? 'var(--accent-glow)' : 'transparent',
                  color: activeTab === 'gaia' ? '#12190d' : 'var(--root-cream)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  whiteSpace: 'nowrap',
                }}
              >
                <span>🌍</span>
                <span>{tr.tabGaia}</span>
                <span style={{ opacity: activeTab === 'gaia' ? 0.85 : 0.65, fontSize: '11px' }}>
                  ({fmt(essences)})
                </span>
              </button>
            )}

            {/* Astral Tab */}
            {isAstralUnlocked && (
              <button
                type="button"
                onClick={() => setActiveTab('astral')}
                style={{
                  flex: 1,
                  minWidth: '105px',
                  padding: '8px 12px',
                  borderRadius: '9px',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '12.5px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: activeTab === 'astral' ? 'var(--accent-glow)' : 'transparent',
                  color: activeTab === 'astral' ? '#12190d' : 'var(--root-cream)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  whiteSpace: 'nowrap',
                }}
              >
                <span>🌸</span>
                <span>{tr.tabAstral}</span>
                <span style={{ opacity: activeTab === 'astral' ? 0.85 : 0.65, fontSize: '11px' }}>
                  ({fmtInt(petals)})
                </span>
              </button>
            )}
          </div>

          {/* Subheader Currency Info Bar & Quick Reset Nav */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              padding: '8px 12px',
              borderRadius: '10px',
              background: 'var(--bg-panel-2)',
              border: '1px solid var(--line-soil)',
              marginBottom: '12px',
              flexWrap: 'wrap',
            }}
          >
            {activeTab === 'seeds' && (
              <>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: 'var(--root-cream)', cursor: 'help' }}
                  title={isEn ? '🌌 Eternal Seeds: Earned by performing Prestige when having ≥10B nutrients. Used to purchase upgrades in the Sanctuary.' : '🌌 เมล็ดนิรันดร์: ได้รับจากการกด "จุติ (Prestige)" เมื่อสะสมสารอาหารเกิน 10 พันล้าน (10B) ใช้ซื้ออัปเกรดในวิหารศักดิ์สิทธิ์'}
                >
                  <span>🌰</span>
                  <span style={{ color: 'var(--root-cream-dim)' }}>{isEn ? 'Available Seeds:' : 'เมล็ดนิรันดร์คงเหลือ:'}</span>
                  <span style={{ fontWeight: 800, color: '#ffd76a' }}>{fmtInt(seeds)}</span>
                  <span style={{ opacity: 0.65, fontSize: '11px' }}>ℹ️</span>
                </div>
                {onOpenPrestige && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenPrestige();
                    }}
                    style={{
                      background: 'var(--bg-panel)',
                      border: '1px solid var(--line-soil)',
                      color: '#ffd76a',
                      borderRadius: '8px',
                      padding: '5px 10px',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {tr.goToPrestige} ➔
                  </button>
                )}
              </>
            )}

            {activeTab === 'gaia' && (
              <>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: 'var(--root-cream)', cursor: 'help' }}
                  title={isEn ? '🌍 Gaia Essences: Earned by Transcendence after reaching 100 Yggdrasil roots. Used to unlock Gaia Perks and cosmetics.' : '🌍 ละอองชีวิต: ได้รับจากการกด "ตื่นรู้แห่งไกอา (Transcendence)" เมื่อมีต้นอิกดราซิล 100 ต้นขึ้นไป ใช้ปลดล็อกพรไกอาและซื้อสกิน'}
                >
                  <span>🌍</span>
                  <span style={{ color: 'var(--root-cream-dim)' }}>{isEn ? 'Available Essences:' : 'ละอองชีวิตคงเหลือ:'}</span>
                  <span style={{ fontWeight: 800, color: '#34d399' }}>{fmt(essences)}</span>
                  <span style={{ fontSize: '11px', color: 'var(--root-cream-dim)', marginLeft: '4px' }}>
                    ({isEn ? 'Lifetime:' : 'ตลอดกาล:'} {fmt(totalLifetimeEssences)})
                  </span>
                  <span style={{ opacity: 0.65, fontSize: '11px' }}>ℹ️</span>
                </div>
                {onOpenTranscendence && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenTranscendence();
                    }}
                    style={{
                      background: 'var(--bg-panel)',
                      border: '1px solid var(--line-soil)',
                      color: '#34d399',
                      borderRadius: '8px',
                      padding: '5px 10px',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {tr.goToTranscendence} ➔
                  </button>
                )}
              </>
            )}

            {activeTab === 'astral' && (
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: 'var(--root-cream)', cursor: 'help' }}
                title={isEn ? '🌸 Astral Petals: Transmuted from Seeds/Essences at the Altar or dropped as a 5% bonus from any event (after unlocking Aurora Bloom). Used for Astral Resonance & exclusive skins.' : '🌸 เกสรดวงดาว: ได้จากการหลอมเมล็ด/ละอองที่เตาหลอมดวงดาว หรือมีโอกาส 5% ดรอปเป็นโบนัส (+1 เกสร) เมื่อกดเก็บอีเวนต์ใดๆ (หลังปลดล็อกบุปผาแสงเหนือ) ใช้ซื้อพลังเรโซแนนซ์และสกินพิเศษ'}
              >
                <span>🌸</span>
                <span style={{ color: 'var(--root-cream-dim)' }}>{isEn ? 'Available Petals:' : 'เกสรดวงดาวคงเหลือ:'}</span>
                <span style={{ fontWeight: 800, color: '#f472b6' }}>{fmtInt(petals)}</span>
                <span style={{ opacity: 0.65, fontSize: '11px' }}>ℹ️</span>
              </div>
            )}
          </div>

          {/* Tab Content Container */}
          <div
            className="custom-scrollbar"
            style={{
              flex: 1,
              overflowY: 'auto',
              paddingRight: '2px',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {/* ================= TAB 1: SEEDS ================= */}
            {activeTab === 'seeds' && (
              <div>
                {/* Economy Upgrades */}
                {renderSectionHeader(tr.prestigeSecEconomy)}
                <PrestigeUpgradeRow
                  title={isEn ? '🌱 Starter Culture' : '🌱 หัวเชื้อเริ่มต้น'}
                  badge={(state.prestige.starterLevel || 0) >= STARTER_CULTURE_MAX_LEVEL
                    ? (isEn ? 'MAXED ✓' : 'เต็มแล้ว ✓')
                    : (isEn
                        ? `Lv. ${state.prestige.starterLevel || 0} / ${STARTER_CULTURE_MAX_LEVEL}`
                        : `เลเวล ${state.prestige.starterLevel || 0} / ${STARTER_CULTURE_MAX_LEVEL}`)}
                  desc={isEn
                    ? `Immediately gain +10 Fine Roots and guarantee ${(state.prestige.starterLevel || 0) * 10 + 10} roots upon every future Prestige`
                    : `ได้รากฝอยฟรีทันที +10 ต้น (ใช้ได้เลยรอบนี้) และการันตี ${(state.prestige.starterLevel || 0) * 10 + 10} ต้นทุกครั้งที่หว่านใหม่ต่อจากนี้`}
                  costFn={starterCultureCost}
                  currentLevel={state.prestige.starterLevel || 0}
                  maxLevel={STARTER_CULTURE_MAX_LEVEL}
                  seeds={seeds}
                  onBuy={onBuyStarterCulture}
                  isEn={isEn}
                />

                <PrestigeUpgradeRow
                  title={isEn ? '🌰 Golden Seed Multiplier' : '🌰 ผลคูณเมล็ดทองคำ'}
                  badge={(state.prestige.goldenLevel || 0) >= GOLDEN_SEED_MAX_LEVEL
                    ? (isEn ? `MAXED ✓ (+${((state.prestige.goldenLevel || 0) * 0.1).toFixed(1)}%)` : `เต็มแล้ว ✓ (+${((state.prestige.goldenLevel || 0) * 0.1).toFixed(1)}%)`)
                    : (isEn
                        ? `Lv. ${fmtInt(state.prestige.goldenLevel || 0)} / ${fmtInt(GOLDEN_SEED_MAX_LEVEL)} (+${((state.prestige.goldenLevel || 0) * 0.1).toFixed(1)}%)`
                        : `เลเวล ${fmtInt(state.prestige.goldenLevel || 0)} / ${fmtInt(GOLDEN_SEED_MAX_LEVEL)} (+${((state.prestige.goldenLevel || 0) * 0.1).toFixed(1)}%)`)}
                  desc={isEn
                    ? `Increases Eternal Seeds gained upon Prestige by +0.1% per level (Currently +${((state.prestige.goldenLevel || 0) * 0.1).toFixed(1)}%)`
                    : `เพิ่มเมล็ดนิรันดร์ที่ได้รับตอน Prestige ครั้งต่อไปอีกเลเวลละ +0.1% (ตอนนี้ +${((state.prestige.goldenLevel || 0) * 0.1).toFixed(1)}%)`}
                  costFn={goldenSeedCost}
                  currentLevel={state.prestige.goldenLevel || 0}
                  maxLevel={GOLDEN_SEED_MAX_LEVEL}
                  seeds={seeds}
                  onBuy={onBuyGoldenSeed}
                  isEn={isEn}
                />

                <PrestigeUpgradeRow
                  title={isEn ? '🌟 Eternal Growth Essence' : '🌟 พลังรากนิรันดร์'}
                  badge={(state.prestige.passiveRateLevel || 0) >= PASSIVE_RATE_MAX_LEVEL
                    ? (isEn ? `MAXED ✓ (+${((state.prestige.passiveRateLevel || 0) * 0.1).toFixed(1)}%)` : `เต็มแล้ว ✓ (+${((state.prestige.passiveRateLevel || 0) * 0.1).toFixed(1)}%)`)
                    : (isEn
                        ? `Lv. ${fmtInt(state.prestige.passiveRateLevel || 0)} / ${fmtInt(PASSIVE_RATE_MAX_LEVEL)} (+${((state.prestige.passiveRateLevel || 0) * 0.1).toFixed(1)}%)`
                        : `เลเวล ${fmtInt(state.prestige.passiveRateLevel || 0)} / ${fmtInt(PASSIVE_RATE_MAX_LEVEL)} (+${((state.prestige.passiveRateLevel || 0) * 0.1).toFixed(1)}%)`)}
                  desc={isEn
                    ? `Permanent +0.1% global production rate bonus across the entire garden (Currently +${((state.prestige.passiveRateLevel || 0) * 0.1).toFixed(1)}%)`
                    : `เพิ่มเรทรวมทั้งฟาร์มแบบถาวรเลเวลละ +0.1% (ตอนนี้ +${((state.prestige.passiveRateLevel || 0) * 0.1).toFixed(1)}%)`}
                  costFn={passiveRateCost}
                  currentLevel={state.prestige.passiveRateLevel || 0}
                  maxLevel={PASSIVE_RATE_MAX_LEVEL}
                  seeds={seeds}
                  onBuy={onBuyPassiveRate}
                  isEn={isEn}
                />

                {/* Automation */}
                {renderSectionHeader(tr.prestigeSecAuto)}
                <PrestigeUpgradeRow
                  title={isEn ? '🤖 Automated Root Sower' : '🤖 หว่านรากอัตโนมัติ'}
                  badge={state.prestige.autoRoot
                    ? (isEn ? 'OWNED ✓' : 'ปลดล็อกแล้ว ✓')
                    : (isEn ? 'LOCKED' : 'ยังไม่ปลดล็อก')}
                  desc={isEn
                    ? 'Unlocks automation panel to automatically buy root tiers periodically based on your strategy'
                    : 'ปลดล็อกระบบผู้จัดการรากเพื่อซื้อรากอัตโนมัติตามกลยุทธ์ที่เลือก'}
                  costText={state.prestige.autoRoot ? '—' : '25 🌌'}
                  isMaxed={state.prestige.autoRoot}
                  isDisabled={!state.prestige.autoRoot && seeds < 25}
                  isOwned={state.prestige.autoRoot}
                  onClick={onBuyAutoRoot}
                  seeds={seeds}
                  isEn={isEn}
                />

                {/* Events & Fortune */}
                {renderSectionHeader(tr.prestigeSecEvents)}
                {(() => {
                  const isMax = eventBonusMaxed(state);
                  const curLvl = state.prestige.eventBonusLevel || 0;
                  const curPct = (curLvl * 0.1).toFixed(1);
                  const nextPct = ((curLvl + 1) * 0.1).toFixed(1);
                  const nxtCost = eventBonusCost(curLvl);
                  return (
                    <PrestigeUpgradeRow
                      title={isEn ? '⚡ Surge Multiplier Boost' : '⚡ ขยายผลบัฟ'}
                      badge={isMax
                        ? (isEn ? `MAXED ✓ (+${curPct}%)` : `เต็มแล้ว ✓ (+${curPct}%)`)
                        : (isEn
                            ? `Lv. ${curLvl} / ${EVENT_BONUS_MAX_LEVEL} (+${curPct}%)`
                            : `เลเวล ${curLvl} / ${EVENT_BONUS_MAX_LEVEL} (+${curPct}%)`)}
                      desc={isMax
                        ? (isEn ? `Maxed out at +${curPct}% bonus` : `เต็มแล้วที่ +${curPct}% (สูงสุด)`)
                        : (isEn
                            ? `Increases surge event multipliers (+${curPct}% currently, +${nextPct}% next)`
                            : `เพิ่มตัวคูณของบัฟ/กล่องสมบัติ (ตอนนี้ +${curPct}%, ขั้นต่อไป +${nextPct}%)`)}
                      costFn={eventBonusCost}
                      currentLevel={curLvl}
                      maxLevel={EVENT_BONUS_MAX_LEVEL}
                      seeds={seeds}
                      onBuy={onBuyEventBonus}
                      isEn={isEn}
                      costText={isMax ? '—' : `${nxtCost} 🌌`}
                    />
                  );
                })()}

                <PrestigeUpgradeRow
                  title={isEn ? '⏳ Extended Surge Duration' : '⏳ ขยายเวลาบัฟ'}
                  badge={eventDurationMaxed(state)
                    ? (isEn ? 'MAXED ✓' : 'เต็มแล้ว ✓')
                    : (isEn
                        ? `Lv. ${state.prestige.eventDurationLevel || 0} / ${EVENT_DURATION_MAX_LEVEL}`
                        : `เลเวล ${state.prestige.eventDurationLevel || 0} / ${EVENT_DURATION_MAX_LEVEL}`)}
                  desc={eventDurationMaxed(state)
                    ? (isEn ? `Maxed out at +${(state.prestige.eventDurationLevel || 0) * 15}%` : `เต็มแล้วที่ +${(state.prestige.eventDurationLevel || 0) * 15}% (ไม่รวมโชคดี)`)
                    : (isEn ? `Extends surge buff duration by +15% (Currently +${(state.prestige.eventDurationLevel || 0) * 15}%)` : `เพิ่มระยะเวลาของบัฟ/กล่องสมบัติอีก 15% (ตอนนี้ +${(state.prestige.eventDurationLevel || 0) * 15}%, ไม่รวมโชคดี)`)}
                  costText={eventDurationMaxed(state) ? '—' : `${eventDurationCost(state)} 🌌`}
                  isMaxed={eventDurationMaxed(state)}
                  isDisabled={!eventDurationMaxed(state) && seeds < eventDurationCost(state)}
                  isOwned={eventDurationMaxed(state)}
                  onClick={onBuyEventDuration}
                  seeds={seeds}
                  isEn={isEn}
                />

                <PrestigeUpgradeRow
                  title={isEn ? '🍀 Lucky Clover Frequency' : '🍀 โอกาสโชคดีเพิ่ม'}
                  badge={luckyChanceMaxed(state)
                    ? (isEn ? 'MAXED ✓' : 'เต็มแล้ว ✓')
                    : (isEn
                        ? `Lv. ${state.prestige.luckyChanceLevel || 0} / ${LUCKY_CHANCE_MAX_LEVEL}`
                        : `เลเวล ${state.prestige.luckyChanceLevel || 0} / ${LUCKY_CHANCE_MAX_LEVEL}`)}
                  desc={luckyChanceMaxed(state)
                    ? (isEn ? `Maxed at ${(luckyChancePct(state) * 100).toFixed(1)}%` : `เต็มแล้วที่ ${(luckyChancePct(state) * 100).toFixed(1)}% (สูงสุด)`)
                    : (isEn
                        ? `Increases chance of triggering Lucky Clover — Currently ${(luckyChancePct(state) * 100).toFixed(1)}%, next level ${(Math.min(LUCKY_CHANCE_MAX, luckyChancePct(state) + LUCKY_CHANCE_STEP) * 100).toFixed(1)}%`
                        : `เพิ่มโอกาสเจอบัฟโชคดี — ตอนนี้ ${(luckyChancePct(state) * 100).toFixed(1)}% เลเวลต่อไปเป็น ${(Math.min(LUCKY_CHANCE_MAX, luckyChancePct(state) + LUCKY_CHANCE_STEP) * 100).toFixed(1)}%`)}
                  costText={luckyChanceMaxed(state) ? '—' : `${luckyChanceCost(state)} 🌌`}
                  isMaxed={luckyChanceMaxed(state)}
                  isDisabled={!luckyChanceMaxed(state) && seeds < luckyChanceCost(state)}
                  isOwned={luckyChanceMaxed(state)}
                  onClick={onBuyLuckyChance}
                  seeds={seeds}
                  isEn={isEn}
                />

                <PrestigeUpgradeRow
                  title={isEn ? '🍀 Lucky Magnitude Multiplier' : '🍀 โชคดีทวีคูณ'}
                  badge={(state.prestige.luckyMagnitudeLevel || 0) >= LUCKY_MAGNITUDE_MAX_LEVEL
                    ? (isEn ? 'MAXED ✓ (×10)' : 'เต็มแล้ว ✓ (×10)')
                    : (isEn
                        ? `Lv. ${state.prestige.luckyMagnitudeLevel || 0} / ${LUCKY_MAGNITUDE_MAX_LEVEL} (×${(state.prestige.luckyMagnitudeLevel || 0) + 1})`
                        : `เลเวล ${state.prestige.luckyMagnitudeLevel || 0} / ${LUCKY_MAGNITUDE_MAX_LEVEL} (×${(state.prestige.luckyMagnitudeLevel || 0) + 1})`)}
                  desc={isEn
                    ? `Stacks Lucky Clover (×777) multiplier — Currently ×${(state.prestige.luckyMagnitudeLevel || 0) + 1}, next level ×${(state.prestige.luckyMagnitudeLevel || 0) + 2} (Cap: ×10)`
                    : `ทบตัวคูณของบัฟโชคดี (×777) เพิ่มอีกชั้น — ตอนนี้ ×${(state.prestige.luckyMagnitudeLevel || 0) + 1} ต่อไปเป็น ×${(state.prestige.luckyMagnitudeLevel || 0) + 2} (สูงสุด ×10)`}
                  costFn={luckyMagnitudeCost}
                  currentLevel={state.prestige.luckyMagnitudeLevel || 0}
                  maxLevel={LUCKY_MAGNITUDE_MAX_LEVEL}
                  seeds={seeds}
                  onBuy={onBuyLuckyMagnitude}
                  isEn={isEn}
                />

                <PrestigeUpgradeRow
                  title={isEn ? '⏳🍀 Extended Lucky Duration' : '⏳🍀 โชคดีอยู่นานขึ้น'}
                  badge={(state.prestige.luckyDurationLevel || 0) >= LUCKY_DURATION_MAX_LEVEL
                    ? (isEn ? `MAXED ✓ (${LUCKY_DURATION_MAX}s)` : `เต็มแล้ว ✓ (${LUCKY_DURATION_MAX}วิ)`)
                    : (isEn
                        ? `Lv. ${state.prestige.luckyDurationLevel || 0} / ${LUCKY_DURATION_MAX_LEVEL} (${Math.min(LUCKY_DURATION_MAX, LUCKY_DURATION_BASE + (state.prestige.luckyDurationLevel || 0))}s)`
                        : `เลเวล ${state.prestige.luckyDurationLevel || 0} / ${LUCKY_DURATION_MAX_LEVEL} (${Math.min(LUCKY_DURATION_MAX, LUCKY_DURATION_BASE + (state.prestige.luckyDurationLevel || 0))}วิ)`)}
                  desc={isEn
                    ? `Extends Lucky Clover duration (+1s/level) — Currently ${Math.min(LUCKY_DURATION_MAX, LUCKY_DURATION_BASE + (state.prestige.luckyDurationLevel || 0))}s (Cap: ${LUCKY_DURATION_MAX}s)`
                    : `ยืดเวลาบัฟโชคดี (+1 วิ/เลเวล) — ตอนนี้ ${Math.min(LUCKY_DURATION_MAX, LUCKY_DURATION_BASE + (state.prestige.luckyDurationLevel || 0))} วิ (สูงสุด ${LUCKY_DURATION_MAX} วิ)`}
                  costFn={luckyDurationCost}
                  currentLevel={state.prestige.luckyDurationLevel || 0}
                  maxLevel={LUCKY_DURATION_MAX_LEVEL}
                  seeds={seeds}
                  onBuy={onBuyLuckyDuration}
                  isEn={isEn}
                />

                {/* Offline Rest */}
                {renderSectionHeader(tr.prestigeSecOffline)}
                <PrestigeUpgradeRow
                  title={isEn ? '⏰ Expand Offline Rest Cap' : '⏰ ขยายเพดาน Offline'}
                  badge={offlineCapMaxed(state)
                    ? (isEn ? `MAXED ✓ (${OFFLINE_CAP_HOURS[state.prestige.offlineCapLevel || 0]}h)` : `เต็มแล้ว ✓ (${OFFLINE_CAP_HOURS[state.prestige.offlineCapLevel || 0]} ชม.)`)
                    : (isEn
                        ? `Lv. ${state.prestige.offlineCapLevel || 0} / ${OFFLINE_CAP_HOURS.length - 1} (${OFFLINE_CAP_HOURS[state.prestige.offlineCapLevel || 0]}h)`
                        : `เลเวล ${state.prestige.offlineCapLevel || 0} / ${OFFLINE_CAP_HOURS.length - 1} (${OFFLINE_CAP_HOURS[state.prestige.offlineCapLevel || 0]} ชม.)`)}
                  desc={offlineCapMaxed(state)
                    ? (isEn ? `Current cap: ${OFFLINE_CAP_HOURS[state.prestige.offlineCapLevel || 0]} hrs (Maximum)` : `เพดานปัจจุบัน ${OFFLINE_CAP_HOURS[state.prestige.offlineCapLevel || 0]} ชม. (สูงสุดแล้ว)`)
                    : (isEn ? `Expands offline storage cap from ${OFFLINE_CAP_HOURS[state.prestige.offlineCapLevel || 0]}h to ${OFFLINE_CAP_HOURS[(state.prestige.offlineCapLevel || 0) + 1]}h` : `ขยายจาก ${OFFLINE_CAP_HOURS[state.prestige.offlineCapLevel || 0]} ชม. เป็น ${OFFLINE_CAP_HOURS[(state.prestige.offlineCapLevel || 0) + 1]} ชม.`)}
                  costText={offlineCapMaxed(state) ? '—' : `${offlineCapCost(state)} 🌌`}
                  isMaxed={offlineCapMaxed(state)}
                  isDisabled={!offlineCapMaxed(state) && seeds < offlineCapCost(state)}
                  isOwned={offlineCapMaxed(state)}
                  onClick={onBuyOfflineCapUpgrade}
                  seeds={seeds}
                  isEn={isEn}
                />
              </div>
            )}

            {/* ================= TAB 2: GAIA PERKS ================= */}
            {activeTab === 'gaia' && (
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
                      onBuy={gaiaHandlers[def.id]}
                      customAction={customAction}
                    />
                  );
                })}
              </div>
            )}

            {/* ================= TAB 3: ASTRAL RESIDUALS ================= */}
            {activeTab === 'astral' && (
              <div>
                <SeedTransmuteAltar
                  eternalSeeds={state.eternalSeeds}
                  gaiaEssences={state.transcendence?.gaiaEssences || 0}
                  astralPetals={state.transcendence?.astralPetals || 0}
                  astralResonanceLevel={state.transcendence?.astralResonanceLevel || 0}
                  isEn={isEn}
                  onTransmuteSeedsToPetals={onTransmuteSeedsToPetals}
                  onTransmuteEssencesToPetals={onTransmuteEssencesToPetals}
                  onBuyAstralResonance={onBuyAstralResonance}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

SanctuaryModal.displayName = 'SanctuaryModal';
