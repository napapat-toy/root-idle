'use client';

import { useCallback, useEffect } from 'react';
import { GameState, TrialId } from '@/types/game';
import {
  GAIA_TOUCH_MAX_LEVEL,
  gaiaTouchCost,
  PRIMORDIAL_VIGOR_MAX_LEVEL,
  primordialVigorCost,
  SOIL_MEMORY_MAX_LEVEL,
  soilMemoryCost,
  ECHO_RESONANCE_MAX_LEVEL,
  echoResonanceCost,
  GAIA_CLAIRVOYANCE_MAX_LEVEL,
  gaiaClairvoyanceCost,
  PRIMORDIAL_SEEDLING_MAX_LEVEL,
  primordialSeedlingCost,
  DEEP_MEDITATION_MAX_LEVEL,
  deepMeditationCost,
  gaiaBlessingCost,
  GAIA_BLESSING_MAX_LEVEL,
  HYPERDRIVE_COST,
  AURORA_BLOOM_COST,
  SEED_TRANSMUTE_COST,
  ESSENCE_TRANSMUTE_COST,
  TRIAL_DEFS,
  MODULE_DEFS,
} from '@/constants/gameData';

interface UseTranscendenceEngineProps {
  stateRef: React.MutableRefObject<GameState>;
  setState: React.Dispatch<React.SetStateAction<GameState>>;
  doPrestige: () => number;
  showFloatingText: (x: number, y: number, text: string, color: string) => void;
}

export function useTranscendenceEngine({
  stateRef,
  setState,
  doPrestige,
  showFloatingText,
}: UseTranscendenceEngineProps) {
  const buyPrimordialVigor = useCallback(() => {
    const cur = stateRef.current;
    const lvl = cur.transcendence?.primordialVigorLevel || 0;
    if (lvl >= PRIMORDIAL_VIGOR_MAX_LEVEL) return;
    const cost = primordialVigorCost(lvl);
    if ((cur.transcendence?.gaiaEssences || 0) < cost) return;

    setState(prev => ({
      ...prev,
      transcendence: {
        ...prev.transcendence,
        gaiaEssences: prev.transcendence.gaiaEssences - cost,
        primordialVigorLevel: lvl + 1,
      },
    }));
  }, [stateRef, setState]);

  const buySoilMemory = useCallback(() => {
    const cur = stateRef.current;
    const lvl = cur.transcendence?.soilMemoryLevel || 0;
    if (lvl >= SOIL_MEMORY_MAX_LEVEL) return;
    const cost = soilMemoryCost(lvl);
    if ((cur.transcendence?.gaiaEssences || 0) < cost) return;

    setState(prev => ({
      ...prev,
      transcendence: {
        ...prev.transcendence,
        gaiaEssences: prev.transcendence.gaiaEssences - cost,
        soilMemoryLevel: lvl + 1,
      },
    }));
  }, [stateRef, setState]);

  const buyGaiaBlessing = useCallback(() => {
    const cur = stateRef.current;
    const lvl = cur.transcendence?.gaiaBlessingLevel || 0;
    if (lvl >= GAIA_BLESSING_MAX_LEVEL) return;
    const cost = gaiaBlessingCost(lvl);
    if ((cur.transcendence?.gaiaEssences || 0) < cost) return;

    setState(prev => ({
      ...prev,
      transcendence: {
        ...prev.transcendence,
        gaiaEssences: prev.transcendence.gaiaEssences - cost,
        gaiaBlessingLevel: lvl + 1,
      },
    }));
  }, [stateRef, setState]);

  const buyHyperdrive = useCallback(() => {
    const cur = stateRef.current;
    if (cur.transcendence?.hyperdriveUnlocked) return;
    if ((cur.transcendence?.gaiaEssences || 0) < HYPERDRIVE_COST) return;

    setState(prev => ({
      ...prev,
      transcendence: {
        ...prev.transcendence,
        gaiaEssences: prev.transcendence.gaiaEssences - HYPERDRIVE_COST,
        hyperdriveUnlocked: true,
        hyperdriveEnabled: true,
      },
    }));
  }, [stateRef, setState]);

  const toggleHyperdrive = useCallback(() => {
    const cur = stateRef.current;
    if (!cur.transcendence?.hyperdriveUnlocked) return;
    setState(prev => ({
      ...prev,
      transcendence: {
        ...prev.transcendence,
        hyperdriveEnabled: !prev.transcendence?.hyperdriveEnabled,
      },
    }));
  }, [stateRef, setState]);

  const buyAuroraBloom = useCallback(() => {
    const cur = stateRef.current;
    if (cur.transcendence?.auroraBloomUnlocked) return;
    if ((cur.transcendence?.gaiaEssences || 0) < AURORA_BLOOM_COST) return;

    setState(prev => ({
      ...prev,
      transcendence: {
        ...prev.transcendence,
        gaiaEssences: prev.transcendence.gaiaEssences - AURORA_BLOOM_COST,
        auroraBloomUnlocked: true,
      },
    }));
  }, [stateRef, setState]);

  const transmuteSeedsToPetals = useCallback((qty = 1) => {
    const cur = stateRef.current;
    if (!cur.transcendence?.auroraBloomUnlocked) return;
    const count = Math.max(1, Math.floor(qty));
    const totalCost = count * SEED_TRANSMUTE_COST;
    if (cur.eternalSeeds < totalCost) return;

    setState(prev => ({
      ...prev,
      eternalSeeds: prev.eternalSeeds - totalCost,
      transcendence: {
        ...prev.transcendence,
        astralPetals: (prev.transcendence?.astralPetals || 0) + count,
      },
    }));
    const isEn = cur.lang === 'en';
    showFloatingText(
      250,
      180,
      isEn ? `🌸 +${count} Astral Petal${count > 1 ? 's' : ''}!` : `🌸 +${count} เกสรดวงดาว!`,
      '#f472b6'
    );
  }, [stateRef, setState, showFloatingText]);

  const transmuteEssencesToPetals = useCallback((qty = 1) => {
    const cur = stateRef.current;
    if (!cur.transcendence?.auroraBloomUnlocked) return;
    const count = Math.max(1, Math.floor(qty));
    const totalCost = count * ESSENCE_TRANSMUTE_COST;
    if ((cur.transcendence?.gaiaEssences || 0) < totalCost) return;

    setState(prev => ({
      ...prev,
      transcendence: {
        ...prev.transcendence,
        gaiaEssences: (prev.transcendence?.gaiaEssences || 0) - totalCost,
        astralPetals: (prev.transcendence?.astralPetals || 0) + count,
      },
    }));
    const isEn = cur.lang === 'en';
    showFloatingText(
      250,
      180,
      isEn ? `🌸 +${count} Astral Petal${count > 1 ? 's' : ''}!` : `🌸 +${count} เกสรดวงดาว!`,
      '#f472b6'
    );
  }, [stateRef, setState, showFloatingText]);

  const buyAutoManager = useCallback(() => {
    buyGaiaBlessing();
  }, [buyGaiaBlessing]);

  const buyGaiaTouch = useCallback(() => {
    const cur = stateRef.current;
    const lvl = cur.transcendence?.gaiaTouchLevel || 0;
    if (lvl >= GAIA_TOUCH_MAX_LEVEL) return;
    const cost = gaiaTouchCost(lvl);
    if ((cur.transcendence?.gaiaEssences || 0) < cost) return;

    setState(prev => ({
      ...prev,
      transcendence: {
        ...prev.transcendence,
        gaiaEssences: prev.transcendence.gaiaEssences - cost,
        gaiaTouchLevel: lvl + 1,
      },
    }));
  }, [stateRef, setState]);

  const buyEchoResonance = useCallback(() => {
    const cur = stateRef.current;
    const lvl = cur.transcendence?.echoResonanceLevel || 0;
    if (lvl >= ECHO_RESONANCE_MAX_LEVEL) return;
    const cost = echoResonanceCost(lvl);
    if ((cur.transcendence?.gaiaEssences || 0) < cost) return;

    setState(prev => ({
      ...prev,
      transcendence: {
        ...prev.transcendence,
        gaiaEssences: prev.transcendence.gaiaEssences - cost,
        echoResonanceLevel: lvl + 1,
      },
    }));
  }, [stateRef, setState]);

  const buyGaiaClairvoyance = useCallback(() => {
    const cur = stateRef.current;
    const lvl = cur.transcendence?.gaiaClairvoyanceLevel || 0;
    if (lvl >= GAIA_CLAIRVOYANCE_MAX_LEVEL) return;
    const cost = gaiaClairvoyanceCost(lvl);
    if ((cur.transcendence?.gaiaEssences || 0) < cost) return;

    setState(prev => ({
      ...prev,
      transcendence: {
        ...prev.transcendence,
        gaiaEssences: prev.transcendence.gaiaEssences - cost,
        gaiaClairvoyanceLevel: lvl + 1,
      },
    }));
  }, [stateRef, setState]);

  const buyPrimordialSeedling = useCallback(() => {
    const cur = stateRef.current;
    const lvl = cur.transcendence?.primordialSeedlingLevel || 0;
    if (lvl >= PRIMORDIAL_SEEDLING_MAX_LEVEL) return;
    const cost = primordialSeedlingCost(lvl);
    if ((cur.transcendence?.gaiaEssences || 0) < cost) return;

    setState(prev => ({
      ...prev,
      transcendence: {
        ...prev.transcendence,
        gaiaEssences: prev.transcendence.gaiaEssences - cost,
        primordialSeedlingLevel: lvl + 1,
      },
    }));
  }, [stateRef, setState]);

  const buyDeepMeditation = useCallback(() => {
    const cur = stateRef.current;
    const lvl = cur.transcendence?.deepMeditationLevel || 0;
    if (lvl >= DEEP_MEDITATION_MAX_LEVEL) return;
    const cost = deepMeditationCost(lvl);
    if ((cur.transcendence?.gaiaEssences || 0) < cost) return;

    setState(prev => ({
      ...prev,
      transcendence: {
        ...prev.transcendence,
        gaiaEssences: prev.transcendence.gaiaEssences - cost,
        deepMeditationLevel: lvl + 1,
      },
    }));
  }, [stateRef, setState]);

  const startTrial = useCallback((trialId: TrialId) => {
    doPrestige();
    setState(prev => {
      const freshOwned: Record<string, number> = {};
      MODULE_DEFS.forEach(d => { freshOwned[d.id] = 0; });
      return {
        ...prev,
        nutrients: 0,
        runEarned: 0,
        owned: freshOwned,
        totalOwned: 0,
        rootUpgrades: {},
        echoes: {},
        rootSynergies: {},
        transcendence: {
          ...prev.transcendence,
          activeTrial: trialId,
        },
      };
    });
  }, [doPrestige, setState]);

  const abandonTrial = useCallback(() => {
    doPrestige();
    setState(prev => ({
      ...prev,
      transcendence: {
        ...prev.transcendence,
        activeTrial: 'none',
      },
    }));
  }, [doPrestige, setState]);

  // Trial completion check (every 1s)
  useEffect(() => {
    const interval = setInterval(() => {
      const cur = stateRef.current;
      const active = cur.transcendence?.activeTrial;
      if (active && active !== 'none') {
        const def = TRIAL_DEFS.find(t => t.id === active);
        if (def && (cur.owned['yggdrasil'] || 0) >= def.targetYggdrasil) {
          const isEn = cur.lang === 'en';
          const alreadyCompleted = !!cur.transcendence?.completedTrials?.[active];
          const essenceBonus = (!alreadyCompleted && def.essenceReward) ? def.essenceReward : 0;

          setState(prev => ({
            ...prev,
            transcendence: {
              ...prev.transcendence,
              activeTrial: 'none',
              gaiaEssences: (prev.transcendence?.gaiaEssences || 0) + essenceBonus,
              totalGaiaEssencesLifetime: (prev.transcendence?.totalGaiaEssencesLifetime || 0) + essenceBonus,
              completedTrials: {
                ...prev.transcendence?.completedTrials,
                [active]: true,
              },
            },
          }));
          showFloatingText(
            250,
            120,
            isEn ? `🏆 Trial Conquered: ${def.enName}!` : `🏆 พิชิตการทดลอง: ${def.name}!`,
            '#ffd76a'
          );
          if (essenceBonus > 0) {
            setTimeout(() => {
              showFloatingText(
                250,
                150,
                isEn ? `🌍 +${essenceBonus} Gaia Essences Awarded!` : `🌍 ได้รับ +${essenceBonus} ละอองชีวิตแห่งไกอา!`,
                '#34d399'
              );
            }, 350);
          }
          if (active === 'void_anomaly') {
            setTimeout(() => {
              showFloatingText(
                250,
                180,
                isEn ? '🤖 Automation Bots Reactivated!' : '🤖 ระบบบอทอัตโนมัติกลับมาทำงานแล้ว!',
                '#4ade80'
              );
            }, 700);
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [stateRef, setState, showFloatingText]);

  return {
    buyPrimordialVigor,
    buySoilMemory,
    buyGaiaBlessing,
    buyAutoManager,
    buyGaiaTouch,
    buyEchoResonance,
    buyGaiaClairvoyance,
    buyPrimordialSeedling,
    buyDeepMeditation,
    buyHyperdrive,
    toggleHyperdrive,
    buyAuroraBloom,
    transmuteSeedsToPetals,
    transmuteEssencesToPetals,
    startTrial,
    abandonTrial,
  };
}
