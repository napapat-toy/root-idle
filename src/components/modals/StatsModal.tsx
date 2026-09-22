'use client';

import React from 'react';
import { GameState, Language } from '@/types/game';
import {
  GAME_VERSION,
  stageName,
  totalEchoCount,
  totalMilestonesCount,
  relicsCount,
  TOTAL_RELICS,
  relicCycleResonanceStack,
  isMasterRelicActive,
  hasRelic,
  totalSynergiesCount,
  BIOME_DEFS,
  TRIAL_DEFS,
  echoBonusPct,
  globalEchoMultiplier,
  prestigeBonusPct,
  achievementBonusPct,
  totalSynergyBonusPct,
  globalRateMultiplier,
  totalGlobalBonusPercent,
  trialRateMultiplier,
  biomeActiveRateMultiplier,
  relicRateBonusMultiplier,
  primordialVigorMult,
  trialCompletionBonusMultiplier,
  deepMeditationMultiplier,
} from '@/constants/gameData';
import { fmt, formatDuration } from '@/lib/formatters';
import { ACHIEVEMENTS } from '@/constants/achievementsData';
import { t } from '@/lib/i18n';
import { StatsCard, StatsMultipliersCard } from './stats';

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

  const stats = state.stats || {
    prestigeCount: 0,
    totalEventsClaimed: 0,
    luckyJackpotCount: 0,
    maxOfflineTimeSeconds: 0,
    superJackpotClaimed: false,
    totalSeedsEarnedLifetime: state.eternalSeeds || 0,
    totalNutrientsEarnedLifetime: state.runEarned || state.nutrients || 0,
  };

  const totalAchievements = ACHIEVEMENTS.length;
  const unlockedAchievements = state.achievements?.length || 0;
  const achPercent = Math.round((unlockedAchievements / totalAchievements) * 100);

  const lifetimeNutrients = stats.totalNutrientsEarnedLifetime || (state.runEarned + (stats.prestigeCount > 0 ? state.nutrients : 0));
  const lifetimeSeeds = Math.max(stats.totalSeedsEarnedLifetime || 0, state.eternalSeeds || 0);

  const milestoneCount = totalMilestonesCount(state);
  const ownedRelicsCount = relicsCount(state);
  const cycleStack = relicCycleResonanceStack(state);
  const hasMagma = hasRelic(state, 'magmastone');
  const isMasterRelic = isMasterRelicActive(state);
  const currentBiome = BIOME_DEFS.find(b => b.id === (state.activeBiome || 'topsoil'));

  const gaiaCount = state.transcendence?.count || 0;
  const curEssences = state.transcendence?.gaiaEssences || 0;
  const lifetimeEssences = state.transcendence?.totalGaiaEssencesLifetime || 0;
  const conqueredTrials = Object.keys(state.transcendence?.completedTrials || {}).length;
  const activeTrialId = state.transcendence?.activeTrial;
  const activeTrial = TRIAL_DEFS.find(t => t.id === activeTrialId && activeTrialId !== 'none');

  const synCount = totalSynergiesCount(state);
  const echoCount = totalEchoCount(state);

  const gaiaStatusText = gaiaCount > 0
    ? `${gaiaCount} ${isEn ? 'times' : 'ครั้ง'}`
    : curEssences > 0
      ? (isEn ? 'Essence Available' : 'มีละอองชีวิต')
      : (isEn ? 'Locked' : 'ยังไม่ตื่นรู้');

  // Card 7: Complex Multiplier Architecture Data
  const echoPct = echoBonusPct(state).toLocaleString(undefined, { maximumFractionDigits: 1 });
  const echoMult = globalEchoMultiplier(state);
  const prestigePct = prestigeBonusPct(state).toLocaleString(undefined, { maximumFractionDigits: 1 });
  const achPct = achievementBonusPct(state).toLocaleString(undefined, { maximumFractionDigits: 1 });
  const synPct = totalSynergyBonusPct(state).toLocaleString(undefined, { maximumFractionDigits: 1 });
  const baseBonusPct = totalGlobalBonusPercent(state);
  const baseMult = 1 + baseBonusPct * 0.01;
  const basePctFormatted = baseBonusPct.toLocaleString(undefined, { maximumFractionDigits: 1 });
  const trialRateMult = trialRateMultiplier(state);
  const globalMult = globalRateMultiplier(state);
  const specialMult = globalMult / (baseMult > 0 ? baseMult : 1);
  const trueTotalPct = (globalMult - 1) * 100;
  const trialBonusMult = trialCompletionBonusMultiplier(state);
  const meditationMult = deepMeditationMultiplier(state);

  const globalMultFormatted = globalMult >= 1e9
    ? fmt(globalMult)
    : globalMult.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const totalPctFormatted = trueTotalPct >= 1e9
    ? fmt(trueTotalPct)
    : trueTotalPct.toLocaleString(undefined, { maximumFractionDigits: 1 });

  const relicRateMult = relicRateBonusMultiplier(state);
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
            <StatsCard
              icon="⏱️"
              title={tr.cardTimeTitle}
              items={[
                { label: tr.statTotalPlayTime, value: formatDuration(state.totalPlayTimeSeconds, lang) },
                { label: tr.statRunPlayTime, value: formatDuration(state.runPlayTimeSeconds, lang) },
                { label: tr.statGrowthStage, value: stageName(state, lang), valueClass: 'highlight' },
                { label: tr.statMaxOffline, value: formatDuration(stats.maxOfflineTimeSeconds, lang) },
              ]}
            />

            {/* 2. Nutrients & Production */}
            <StatsCard
              icon="💧"
              title={tr.cardNutrientsTitle}
              items={[
                { label: tr.statCurNutrients, value: fmt(state.nutrients), valueClass: 'highlight' },
                { label: tr.statRunEarned, value: fmt(state.runEarned) },
                { label: tr.statLifetimeNutrients, value: fmt(lifetimeNutrients), valueClass: 'golden' },
                { label: isEn ? 'Milestones Cleared' : 'ไมล์สโตนที่ปลดแล้ว', value: `${milestoneCount} ${isEn ? 'steps' : 'ขั้น'}`, valueClass: 'highlight' },
              ]}
            />

            {/* 3. Prestige & Gaia Awakening */}
            <StatsCard
              icon="🌌"
              title={isEn ? 'Prestige & Gaia' : 'การหว่านใหม่ & ตื่นรู้ไกอา'}
              items={[
                { label: tr.statPrestigeCount, value: `${stats.prestigeCount} ${isEn ? 'times' : 'ครั้ง'}`, valueClass: 'purple' },
                { label: tr.statCurSeeds, value: fmt(state.eternalSeeds), valueClass: 'purple' },
                { label: tr.statLifetimeSeeds, value: fmt(lifetimeSeeds), valueClass: 'golden' },
                { label: isEn ? 'Gaia Awakenings' : 'การตื่นรู้แห่งไกอา', value: gaiaStatusText, valueStyle: { color: '#34d399' } },
                {
                  show: curEssences > 0 || lifetimeEssences > 0,
                  label: isEn ? 'Gaia Essences' : 'ละอองชีวิตดึกดำบรรพ์',
                  value: (
                    <>
                      {fmt(curEssences)} 🌍 <span style={{ opacity: 0.7, fontSize: '10.5px' }}>({isEn ? 'all-time' : 'สะสม'} {fmt(lifetimeEssences)})</span>
                    </>
                  ),
                  valueClass: 'highlight',
                  valueStyle: { color: '#38bdf8' },
                },
                {
                  label: isEn ? 'Conquered Trials' : 'พิชิตการทดลอง',
                  value: `${conqueredTrials} / ${TRIAL_DEFS.length} ${isEn ? 'trials' : 'ด่าน'}`,
                  valueStyle: { color: conqueredTrials > 0 ? '#facc15' : 'var(--root-cream-dim)' },
                },
              ]}
            />

            {/* 4. Subterranean Relics & Biomes */}
            <StatsCard
              icon="🏺"
              title={isEn ? 'Relics & Biomes' : 'โบราณวัตถุ & ชีวนิเวศ'}
              items={[
                {
                  label: isEn ? 'Master Relics Owned' : 'โบราณวัตถุที่ครอบครอง',
                  value: `${ownedRelicsCount} / ${TOTAL_RELICS} ${isEn ? '(1/1 Complete)' : 'ชิ้นสมบูรณ์'}`,
                  valueClass: 'highlight',
                  valueStyle: { color: ownedRelicsCount > 0 ? '#ffd76a' : 'var(--root-cream-dim)' },
                },
                {
                  show: hasMagma,
                  label: isEn ? 'Cycle Resonance Stack' : 'สะสมพลังการเวียนว่าย',
                  value: `+${cycleStack}%`,
                  valueClass: 'highlight',
                  valueStyle: { color: '#f97316' },
                },
                {
                  label: isEn ? 'Heart of Gaia' : 'จิตวิญญาณแห่งไกอา',
                  value: isMasterRelic ? (isEn ? 'Awakened (2×) 👑' : 'ตื่นรู้แล้ว (×2) 👑') : (isEn ? 'Dormant' : 'หลับใหลอยู่'),
                  valueStyle: { color: isMasterRelic ? '#facc15' : 'var(--root-cream-dim)' },
                },
                {
                  label: isEn ? 'Active Biome' : 'ชีวนิเวศฉากหลัง',
                  value: currentBiome ? `${currentBiome.icon} ${isEn ? currentBiome.enName : currentBiome.name}` : (isEn ? '🧭 Dynamic Subterranean Strata' : '🧭 การเดินทางใต้พิภพ (Dynamic)'),
                  valueStyle: { color: 'var(--root-cream)' },
                },
              ]}
            />

            {/* 5. Roots & Achievements */}
            <StatsCard
              icon="🌿"
              title={tr.cardRootsTitle}
              items={[
                { label: tr.statTotalRoots, value: `${state.totalOwned.toLocaleString()} ${isEn ? 'roots' : 'ต้น'}` },
                { label: tr.statAchievementsCount, value: `${unlockedAchievements} / ${totalAchievements} (${achPercent}%)`, valueClass: 'green' },
                { label: isEn ? 'Synergy Networks' : 'เครือข่ายรากผสาน', value: `${synCount} ${isEn ? 'pairs' : 'ชนิด'}`, valueStyle: { color: '#38bdf8' } },
                { label: isEn ? 'Root Echoes Stored' : 'สะท้อนรากสะสม', value: `${echoCount} ${isEn ? 'echoes' : 'อัน'}`, valueClass: 'green' },
              ]}
            />

            {/* 6. Events & Fortune */}
            <StatsCard
              icon="🍀"
              title={isEn ? 'Events & Fortune' : 'เหตุการณ์ & โชคชะตา'}
              items={[
                { label: tr.statEventsClaimed, value: `${stats.totalEventsClaimed} ${isEn ? 'times' : 'ครั้ง'}` },
                { label: tr.statLuckyCount, value: `${stats.luckyJackpotCount} ${isEn ? 'times' : 'ครั้ง'}`, valueClass: 'golden' },
                {
                  label: isEn ? 'Super Jackpot' : 'ซูเปอร์แจ็กพอต',
                  value: stats.superJackpotClaimed ? (isEn ? 'Claimed ✨' : 'ค้นพบแล้ว ✨') : (isEn ? 'Not Yet' : 'ยังไม่เคยได้'),
                  valueStyle: { color: stats.superJackpotClaimed ? '#ffd76a' : 'var(--root-cream-dim)' },
                },
                {
                  label: isEn ? 'Challenge Status' : 'สถานะการทดสอบ',
                  value: activeTrial ? (
                    <span style={{ background: 'rgba(245, 158, 11, 0.2)', border: '1px solid rgba(245, 158, 11, 0.5)', padding: '1px 5px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 600 }}>
                      ⚔️ {isEn ? activeTrial.enName : activeTrial.name}
                    </span>
                  ) : (
                    isEn ? 'Normal Growth' : 'เติบโตอิสระ'
                  ),
                  valueStyle: { color: activeTrial ? '#facc15' : 'var(--root-cream-dim)' },
                },
              ]}
            />

            {/* 7. Production Multipliers & Bonuses Architecture */}
            <StatsMultipliersCard
              lang={lang}
              prestigePct={prestigePct}
              achPct={achPct}
              synPct={synPct}
              biomeRateMult={biomeActiveRateMultiplier(state)}
              baseMult={baseMult}
              basePctFormatted={basePctFormatted}
              echoMult={echoMult}
              echoPct={echoPct}
              vigorLevel={vigorLevel}
              vigorMult={vigorMult}
              relicRateMult={relicRateMult}
              meditationMult={meditationMult}
              trialBonusMult={trialBonusMult}
              trialRateMult={trialRateMult}
              specialMult={specialMult}
              globalMultFormatted={globalMultFormatted}
              totalPctFormatted={totalPctFormatted}
              isInTrial={!!activeTrial}
            />
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
