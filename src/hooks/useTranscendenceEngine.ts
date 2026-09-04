'use client';

import { useCallback, useEffect } from 'react';
import { GameState, TrialId } from '@/types/game';
import {
  AUTO_MANAGER_COST,
  GAIA_TOUCH_MAX_LEVEL,
  gaiaTouchCost,
  goldenSeedCost,
  passiveRateCost,
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
  STARTER_CULTURE_MAX_LEVEL,
  starterCultureCost,
  TRIAL_DEFS,
} from '@/constants/gameData';

interface UseTranscendenceEngineProps {
  stateRef: React.MutableRefObject<GameState>;
  setState: React.Dispatch<React.SetStateAction<GameState>>;
  doPrestige: () => number;
  showFloatingText: (x: number, y: number, text: string, color: string) => void;
  buyPassiveRate: (amount?: number) => void;
  buyGoldenSeed: (amount?: number) => void;
  buyStarterCulture: (amount?: number) => void;
}

export function useTranscendenceEngine({
  stateRef,
  setState,
  doPrestige,
  showFloatingText,
  buyPassiveRate,
  buyGoldenSeed,
  buyStarterCulture,
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

  const buyAutoManager = useCallback(() => {
    const cur = stateRef.current;
    if (cur.transcendence?.autoManagerUnlocked) return;
    const cost = AUTO_MANAGER_COST;
    if ((cur.transcendence?.gaiaEssences || 0) < cost) return;

    setState(prev => ({
      ...prev,
      transcendence: {
        ...prev.transcendence,
        gaiaEssences: prev.transcendence.gaiaEssences - cost,
        autoManagerUnlocked: true,
      },
    }));
  }, [stateRef, setState]);

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
    setState(prev => ({
      ...prev,
      transcendence: {
        ...prev.transcendence,
        activeTrial: trialId,
      },
    }));
  }, [doPrestige, setState]);

  const abandonTrial = useCallback(() => {
    setState(prev => ({
      ...prev,
      transcendence: {
        ...prev.transcendence,
        activeTrial: 'none',
      },
    }));
  }, [setState]);

  // Trial completion check (every 1s)
  useEffect(() => {
    const interval = setInterval(() => {
      const cur = stateRef.current;
      const active = cur.transcendence?.activeTrial;
      if (active && active !== 'none') {
        const def = TRIAL_DEFS.find(t => t.id === active);
        if (def && (cur.owned['yggdrasil'] || 0) >= def.targetYggdrasil) {
          const isEn = cur.lang === 'en';
          setState(prev => ({
            ...prev,
            transcendence: {
              ...prev.transcendence,
              activeTrial: 'none',
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
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [stateRef, setState, showFloatingText]);

  // Auto-Manager Loop (every 4s, upgrades prestige shop if affordable)
  useEffect(() => {
    const interval = setInterval(() => {
      const cur = stateRef.current;
      if (!cur.transcendence?.autoManagerUnlocked || cur.eternalSeeds < 50) return;

      if (cur.eternalSeeds >= passiveRateCost(cur)) {
        buyPassiveRate(1);
      } else if (cur.eternalSeeds >= goldenSeedCost(cur)) {
        buyGoldenSeed(1);
      } else if (cur.prestige.starterLevel < STARTER_CULTURE_MAX_LEVEL && cur.eternalSeeds >= starterCultureCost(cur)) {
        buyStarterCulture(1);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [stateRef, buyPassiveRate, buyGoldenSeed, buyStarterCulture]);

  return {
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
  };
}
