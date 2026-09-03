'use client';

import React from 'react';
import { GameState, Language } from '@/types/game';
import {
  GAME_VERSION,
  stageName,
  echoBonusPct,
  totalEchoCount,
  prestigeBonusPct,
  achievementBonusPct,
  totalSynergyBonusPct,
  totalSynergiesCount,
  totalGlobalBonusPercent,
  globalRateMultiplier,
  totalMilestonesCount,
  relicsCount,
  totalRelicFragmentsCount,
  isMasterRelicActive,
  relicMaxed,
  relicRateBonusMultiplier,
  RELIC_DEFS,
  BIOME_DEFS,
  TRIAL_DEFS,
  primordialVigorMult,
} from '@/constants/gameData';
import { fmt, formatDuration } from '@/lib/formatters';
import { ACHIEVEMENTS } from '@/constants/achievementsData';
import { t } from '@/lib/i18n';

interface StatsModalProps {
  isOpen: boolean;
  state: GameState;
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = React.memo(({
  isOpen,
  state,
  onClose,
}) => {
  if (!isOpen) return null;

  const lang: Language = state.lang || 'th';
  const isEn = lang === 'en';
  const tr = t(lang);

  const totalAchievements = ACHIEVEMENTS.length;
  const unlockedAchievements = state.achievements?.length || 0;
  const achPercent = Math.round((unlockedAchievements / totalAchievements) * 100);

  const stats = state.stats || {
    prestigeCount: 0,
    totalEventsClaimed: 0,
    luckyJackpotCount: 0,
    maxOfflineTimeSeconds: 0,
    superJackpotClaimed: false,
    totalSeedsEarnedLifetime: state.eternalSeeds || 0,
    totalNutrientsEarnedLifetime: state.runEarned || state.nutrients || 0,
  };

  const lifetimeNutrients = stats.totalNutrientsEarnedLifetime || (state.runEarned + (stats.prestigeCount > 0 ? state.nutrients : 0));
  const lifetimeSeeds = Math.max(stats.totalSeedsEarnedLifetime || 0, state.eternalSeeds || 0);

  const echoPct = echoBonusPct(state).toLocaleString(undefined, { maximumFractionDigits: 1 });
  const prestigePct = prestigeBonusPct(state).toLocaleString(undefined, { maximumFractionDigits: 1 });
  const achPct = achievementBonusPct(state).toLocaleString(undefined, { maximumFractionDigits: 1 });
  const synPct = totalSynergyBonusPct(state).toLocaleString(undefined, { maximumFractionDigits: 1 });
  const synCount = totalSynergiesCount(state);
  const totalPct = totalGlobalBonusPercent(state).toLocaleString(undefined, { maximumFractionDigits: 1 });
  const globalMult = globalRateMultiplier(state);
  const milestoneCount = totalMilestonesCount(state);

  // Relics & Biomes Data
  const ownedRelicsCount = relicsCount(state);
  const totalFragments = totalRelicFragmentsCount(state);
  const completedRelics = RELIC_DEFS.filter(r => relicMaxed(state, r.id)).length;
  const isMasterRelic = isMasterRelicActive(state);
  const currentBiome = BIOME_DEFS.find(b => b.id === (state.activeBiome || 'topsoil'));
  const relicRateMult = relicRateBonusMultiplier(state);

  // Gaia Transcendence & Trials Data
  const gaiaCount = state.transcendence?.count || 0;
  const curEssences = state.transcendence?.gaiaEssences || 0;
  const lifetimeEssences = state.transcendence?.totalGaiaEssencesLifetime || 0;
  const conqueredTrials = Object.keys(state.transcendence?.completedTrials || {}).length;
  const activeTrialId = state.transcendence?.activeTrial;
  const activeTrial = TRIAL_DEFS.find(t => t.id === activeTrialId && activeTrialId !== 'none');
  const vigorLevel = state.transcendence?.primordialVigorLevel || 0;
  const vigorMult = primordialVigorMult(state);

  return (
    <div className="offline-backdrop" onClick={onClose}>
      <div className="modal-wrapper stats-modal-wrapper" onClick={e => e.stopPropagation()}>
        <button className="modal-close-x" onClick={onClose} aria-label={tr.close}>
          &times;
        </button>

        <div className="offline-modal generic-modal stats-modal-content custom-scrollbar">
          <div className="icon">📊</div>
          <h2>{tr.statsTitle}</h2>
          <div className="away-time" style={{ marginBottom: '14px' }}>
            {isEn
              ? 'Complete overview of your botanical journey, yield milestones, and records'
              : 'ภาพรวมการเดินทางและความก้าวหน้าของรากไม้ของคุณ'}
          </div>

          <div className="stats-dashboard-grid">
            {/* 1. Time & Growth */}
            <div className="stats-card">
              <div className="stats-card-header">
                <span className="stats-card-icon">⏱️</span>
                <span className="stats-card-title">{tr.cardTimeTitle}</span>
              </div>
              <div className="stats-card-rows">
                <div className="stats-row">
                  <span className="stats-label">{tr.statTotalPlayTime}:</span>
                  <span className="stats-value">{formatDuration(state.totalPlayTimeSeconds, lang)}</span>
                </div>
                <div className="stats-row">
                  <span className="stats-label">{tr.statRunPlayTime}:</span>
                  <span className="stats-value">{formatDuration(state.runPlayTimeSeconds, lang)}</span>
                </div>
                <div className="stats-row">
                  <span className="stats-label">{tr.statGrowthStage}:</span>
                  <span className="stats-value highlight">{stageName(state, lang)}</span>
                </div>
                <div className="stats-row">
                  <span className="stats-label">{tr.statMaxOffline}:</span>
                  <span className="stats-value">{formatDuration(stats.maxOfflineTimeSeconds, lang)}</span>
                </div>
              </div>
            </div>

            {/* 2. Nutrients & Production */}
            <div className="stats-card">
              <div className="stats-card-header">
                <span className="stats-card-icon">💧</span>
                <span className="stats-card-title">{tr.cardNutrientsTitle}</span>
              </div>
              <div className="stats-card-rows">
                <div className="stats-row">
                  <span className="stats-label">{tr.statCurNutrients}:</span>
                  <span className="stats-value highlight">{fmt(state.nutrients)}</span>
                </div>
                <div className="stats-row">
                  <span className="stats-label">{tr.statRunEarned}:</span>
                  <span className="stats-value">{fmt(state.runEarned)}</span>
                </div>
                <div className="stats-row">
                  <span className="stats-label">{tr.statLifetimeNutrients}:</span>
                  <span className="stats-value golden">{fmt(lifetimeNutrients)}</span>
                </div>
                <div className="stats-row">
                  <span className="stats-label">{isEn ? 'Milestones Cleared:' : 'ไมล์สโตนที่ปลดแล้ว:'}</span>
                  <span className="stats-value highlight">{milestoneCount} {isEn ? 'steps' : 'ขั้น'}</span>
                </div>
              </div>
            </div>

            {/* 3. Prestige & Gaia Awakening */}
            <div className="stats-card">
              <div className="stats-card-header">
                <span className="stats-card-icon">🌌</span>
                <span className="stats-card-title">{isEn ? 'Prestige & Gaia' : 'การหว่านใหม่ & ตื่นรู้ไกอา'}</span>
              </div>
              <div className="stats-card-rows">
                <div className="stats-row">
                  <span className="stats-label">{tr.statPrestigeCount}:</span>
                  <span className="stats-value purple">{stats.prestigeCount} {isEn ? 'times' : 'ครั้ง'}</span>
                </div>
                <div className="stats-row">
                  <span className="stats-label">{tr.statCurSeeds}:</span>
                  <span className="stats-value purple">{fmt(state.eternalSeeds)}</span>
                </div>
                <div className="stats-row">
                  <span className="stats-label">{tr.statLifetimeSeeds}:</span>
                  <span className="stats-value golden">{fmt(lifetimeSeeds)}</span>
                </div>
                <div className="stats-row">
                  <span className="stats-label">{isEn ? 'Gaia Awakenings:' : 'การตื่นรู้แห่งไกอา:'}</span>
                  <span className="stats-value" style={{ color: '#34d399' }}>
                    {gaiaCount > 0 ? `${gaiaCount} ${isEn ? 'times' : 'ครั้ง'}` : (curEssences > 0 ? (isEn ? 'Essence Available' : 'มีละอองชีวิต') : (isEn ? 'Locked' : 'ยังไม่ตื่นรู้'))}
                  </span>
                </div>
                {(curEssences > 0 || lifetimeEssences > 0) && (
                  <div className="stats-row">
                    <span className="stats-label">{isEn ? 'Gaia Essences:' : 'ละอองชีวิตดึกดำบรรพ์:'}</span>
                    <span className="stats-value highlight" style={{ color: '#38bdf8' }}>
                      {fmt(curEssences)} 🌍 <span style={{ opacity: 0.7, fontSize: '10.5px' }}>({isEn ? 'all-time' : 'สะสม'} {fmt(lifetimeEssences)})</span>
                    </span>
                  </div>
                )}
                <div className="stats-row">
                  <span className="stats-label">{isEn ? 'Conquered Trials:' : 'พิชิตการทดลอง:'}</span>
                  <span className="stats-value" style={{ color: conqueredTrials > 0 ? '#facc15' : 'var(--root-cream-dim)' }}>
                    {conqueredTrials} / {TRIAL_DEFS.length} {isEn ? 'trials' : 'ด่าน'}
                  </span>
                </div>
              </div>
            </div>

            {/* 4. Subterranean Relics & Biomes */}
            <div className="stats-card">
              <div className="stats-card-header">
                <span className="stats-card-icon">🏺</span>
                <span className="stats-card-title">{isEn ? 'Relics & Biomes' : 'โบราณวัตถุ & ชีวนิเวศ'}</span>
              </div>
              <div className="stats-card-rows">
                <div className="stats-row">
                  <span className="stats-label">{isEn ? 'Relics Unearthed:' : 'โบราณวัตถุที่ค้นพบ:'}</span>
                  <span className="stats-value highlight" style={{ color: ownedRelicsCount > 0 ? 'var(--accent-glow)' : 'var(--root-cream-dim)' }}>
                    {ownedRelicsCount} / 10 {isEn ? 'types' : 'ชนิด'}
                  </span>
                </div>
                <div className="stats-row">
                  <span className="stats-label">{isEn ? 'Collected Fragments:' : 'ชิ้นส่วนสะสมทั้งหมด:'}</span>
                  <span className="stats-value">{totalFragments} {isEn ? 'pieces' : 'ชิ้น'}</span>
                </div>
                <div className="stats-row">
                  <span className="stats-label">{isEn ? 'Completed Artifacts:' : 'รวบรวมครบสมบูรณ์:'}</span>
                  <span className="stats-value" style={{ color: completedRelics > 0 ? '#ffd76a' : 'var(--root-cream-dim)' }}>
                    {completedRelics} / 10 {isEn ? 'relics' : 'ชิ้น'}
                  </span>
                </div>
                <div className="stats-row">
                  <span className="stats-label">{isEn ? 'Heart of Gaia:' : 'จิตวิญญาณแห่งไกอา:'}</span>
                  <span className="stats-value" style={{ color: isMasterRelic ? '#facc15' : 'var(--root-cream-dim)' }}>
                    {isMasterRelic ? (isEn ? 'Awakened (2×) 👑' : 'ตื่นรู้แล้ว (×2) 👑') : (isEn ? 'Dormant' : 'หลับใหลอยู่')}
                  </span>
                </div>
                <div className="stats-row">
                  <span className="stats-label">{isEn ? 'Active Biome:' : 'ชีวนิเวศฉากหลัง:'}</span>
                  <span className="stats-value" style={{ color: 'var(--root-cream)' }}>
                    {currentBiome ? `${currentBiome.icon} ${currentBiome.name}` : '🧭 Topsoil'}
                  </span>
                </div>
              </div>
            </div>

            {/* 5. Roots & Achievements */}
            <div className="stats-card">
              <div className="stats-card-header">
                <span className="stats-card-icon">🌿</span>
                <span className="stats-card-title">{tr.cardRootsTitle}</span>
              </div>
              <div className="stats-card-rows">
                <div className="stats-row">
                  <span className="stats-label">{tr.statTotalRoots}:</span>
                  <span className="stats-value">{state.totalOwned.toLocaleString()} {isEn ? 'roots' : 'ต้น'}</span>
                </div>
                <div className="stats-row">
                  <span className="stats-label">{tr.statAchievementsCount}:</span>
                  <span className="stats-value green">{unlockedAchievements} / {totalAchievements} ({achPercent}%)</span>
                </div>
                <div className="stats-row">
                  <span className="stats-label">{isEn ? 'Synergy Networks:' : 'เครือข่ายรากผสาน:'}</span>
                  <span className="stats-value" style={{ color: '#38bdf8' }}>{synCount} {isEn ? 'pairs' : 'ชนิด'}</span>
                </div>
                <div className="stats-row">
                  <span className="stats-label">{isEn ? 'Root Echoes Stored:' : 'สะท้อนรากสะสม:'}</span>
                  <span className="stats-value green">{totalEchoCount(state)} {isEn ? 'echoes' : 'อัน'}</span>
                </div>
              </div>
            </div>

            {/* 6. Events & Encounters */}
            <div className="stats-card">
              <div className="stats-card-header">
                <span className="stats-card-icon">🍀</span>
                <span className="stats-card-title">{isEn ? 'Events & Fortune' : 'เหตุการณ์ & โชคชะตา'}</span>
              </div>
              <div className="stats-card-rows">
                <div className="stats-row">
                  <span className="stats-label">{tr.statEventsClaimed}:</span>
                  <span className="stats-value">{stats.totalEventsClaimed} {isEn ? 'times' : 'ครั้ง'}</span>
                </div>
                <div className="stats-row">
                  <span className="stats-label">{tr.statLuckyCount}:</span>
                  <span className="stats-value golden">{stats.luckyJackpotCount} {isEn ? 'times' : 'ครั้ง'}</span>
                </div>
                <div className="stats-row">
                  <span className="stats-label">{isEn ? 'Super Jackpot:' : 'ซูเปอร์แจ็กพอต:'}</span>
                  <span className="stats-value" style={{ color: stats.superJackpotClaimed ? '#ffd76a' : 'var(--root-cream-dim)' }}>
                    {stats.superJackpotClaimed ? (isEn ? 'Claimed ✨' : 'ค้นพบแล้ว ✨') : (isEn ? 'Not Yet' : 'ยังไม่เคยได้')}
                  </span>
                </div>
                <div className="stats-row">
                  <span className="stats-label">{isEn ? 'Challenge Status:' : 'สถานะการทดสอบ:'}</span>
                  <span className="stats-value" style={{ color: activeTrial ? '#facc15' : 'var(--root-cream-dim)' }}>
                    {activeTrial ? (
                      <span style={{ background: 'rgba(245, 158, 11, 0.2)', border: '1px solid rgba(245, 158, 11, 0.5)', padding: '1px 5px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 600 }}>
                        ⚔️ {isEn ? activeTrial.enName : activeTrial.name}
                      </span>
                    ) : (
                      isEn ? 'Normal Growth' : 'เติบโตอิสระ'
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* 7. Production Multipliers & Bonuses (Wide Banner) */}
            <div className="stats-card" style={{ gridColumn: 'span 2' }}>
              <div className="stats-card-header">
                <span className="stats-card-icon">⚡</span>
                <span className="stats-card-title">{isEn ? 'Production Bonuses & Multiplier' : 'โบนัสและตัวคูณการผลิตรวม'}</span>
              </div>
              <div style={{ background: 'rgba(255, 215, 106, 0.08)', border: '1px solid rgba(255, 215, 106, 0.25)', borderRadius: '8px', padding: '10px 14px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--root-cream)' }}>
                  ✨ {isEn ? 'Total Global Bonus (All Farm)' : 'โบนัสพลังผลิตรวมทั้งฟาร์ม (Global Bonus)'}:
                </span>
                <span style={{ fontSize: '15px', fontWeight: 700, fontFamily: 'monospace', color: '#ffd76a' }}>
                  +{totalPct}% <span style={{ fontSize: '12px', opacity: 0.85, fontWeight: 500 }}>(×{globalMult.toFixed(2)})</span>
                </span>
              </div>
              <div className="stats-card-rows" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '8px 16px' }}>
                <div className="stats-row">
                  <span className="stats-label">{isEn ? 'Root Echo Bonus' : 'โบนัสสะท้อนราก'}:</span>
                  <span className="stats-value green">+{echoPct}%</span>
                </div>
                <div className="stats-row">
                  <span className="stats-label">{isEn ? 'Prestige Passive Bonus' : 'โบนัสพลังรากนิรันดร์'}:</span>
                  <span className="stats-value purple">+{prestigePct}%</span>
                </div>
                <div className="stats-row">
                  <span className="stats-label">{isEn ? 'Achievement Bonus' : 'โบนัสเหรียญความสำเร็จ'}:</span>
                  <span className="stats-value golden">+{achPct}%</span>
                </div>
                <div className="stats-row">
                  <span className="stats-label">{isEn ? 'Root Networks Bonus' : 'โบนัสเครือข่ายราก'}:</span>
                  <span className="stats-value" style={{ color: '#38bdf8' }}>+{synPct}%</span>
                </div>
                {vigorLevel > 0 && (
                  <div className="stats-row">
                    <span className="stats-label">{isEn ? 'Gaia Primordial Vigor' : 'แกนพลังปฐมกาล (ไกอา)'}:</span>
                    <span className="stats-value" style={{ color: '#34d399' }}>
                      +{((vigorMult - 1) * 100).toFixed(0)}% <span style={{ opacity: 0.65, fontSize: '10px' }}>(Lv. {vigorLevel})</span>
                    </span>
                  </div>
                )}
                {relicRateMult > 1 && (
                  <div className="stats-row">
                    <span className="stats-label">{isEn ? 'Relics Multiplier' : 'ตัวคูณจากโบราณวัตถุ'}:</span>
                    <span className="stats-value highlight" style={{ color: 'var(--accent-glow)' }}>
                      ×{relicRateMult.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '18px', textAlign: 'center', fontSize: '11px', color: 'var(--root-cream-dim)', opacity: 0.5, letterSpacing: '0.06em' }}>
            Root Idle · v{GAME_VERSION}
          </div>
        </div>
      </div>
    </div>
  );
});

StatsModal.displayName = 'StatsModal';

