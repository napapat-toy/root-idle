'use client';

import { useState, useCallback, useMemo } from 'react';
import { GameState, SkinId, UIThemeId } from '@/types/game';
import {
  isSkinUnlocked,
  isUIThemeUnlocked,
  SKIN_COSTS,
  SKIN_CYCLE_ORDER,
  SKIN_ESSENCE_COSTS,
  SKIN_PETAL_COSTS,
  SKIN_PRESTIGE_KEYS,
  UI_THEME_COSTS,
  UI_THEME_ORDER,
  UI_THEME_PETAL_COSTS,
  UI_THEME_PRESTIGE_KEYS,
} from '@/constants/gameData';

interface UseCosmeticsEngineProps {
  state: GameState;
  stateRef: React.MutableRefObject<GameState>;
  setState: React.Dispatch<React.SetStateAction<GameState>>;
}

export function useCosmeticsEngine({ state, stateRef, setState }: UseCosmeticsEngineProps) {
  const [previewSkin, setPreviewSkin] = useState<SkinId | null>(null);
  const [previewUITheme, setPreviewUITheme] = useState<UIThemeId | null>(null);

  // Live effective cosmetics (prioritizing preview when open)
  const effectiveSkin = useMemo<SkinId>(() => {
    return previewSkin || state.prestige.activeSkin || 'none';
  }, [previewSkin, state.prestige.activeSkin]);

  const effectiveUITheme = useMemo<UIThemeId>(() => {
    return previewUITheme || state.prestige.activeUITheme || 'classic';
  }, [previewUITheme, state.prestige.activeUITheme]);

  // Skin actions
  const ownedSkinList = useCallback(() => {
    return SKIN_CYCLE_ORDER.filter(id => isSkinUnlocked(stateRef.current, id));
  }, [stateRef]);

  const toggleSkin = useCallback(() => {
    const owned = ownedSkinList();
    if (owned.length <= 1) return;
    const cur = stateRef.current.prestige.activeSkin;
    const curIdx = owned.indexOf(cur);
    const nextIdx = (curIdx === -1 ? 0 : curIdx + 1) % owned.length;
    setState(prev => ({
      ...prev,
      prestige: { ...prev.prestige, activeSkin: owned[nextIdx] },
    }));
  }, [ownedSkinList, stateRef, setState]);

  const setSkin = useCallback((id: SkinId) => {
    setState(prev => ({
      ...prev,
      prestige: { ...prev.prestige, activeSkin: id },
    }));
  }, [setState]);

  const buySkin = useCallback((id: SkinId, autoEquip = false) => {
    const cur = stateRef.current;
    const petalCost = SKIN_PETAL_COSTS[id];
    const essenceCost = SKIN_ESSENCE_COSTS[id];
    const cost = SKIN_COSTS[id] || 0;
    const prestigeKey = SKIN_PRESTIGE_KEYS[id];
    if (!prestigeKey) return;
    if (cur.prestige[prestigeKey as keyof typeof cur.prestige]) return;

    if (petalCost && petalCost > 0) {
      const petals = cur.transcendence?.astralPetals || 0;
      if (petals < petalCost) return;
      setState(prev => ({
        ...prev,
        transcendence: {
          ...prev.transcendence,
          astralPetals: (prev.transcendence?.astralPetals || 0) - petalCost,
        },
        prestige: {
          ...prev.prestige,
          [prestigeKey]: true,
          ...(autoEquip ? { activeSkin: id } : {}),
        },
      }));
      if (autoEquip) {
        setPreviewSkin(null);
      }
      return;
    }

    if (essenceCost && essenceCost > 0) {
      const essences = cur.transcendence?.gaiaEssences || 0;
      if (essences < essenceCost) return;
      setState(prev => ({
        ...prev,
        transcendence: {
          ...prev.transcendence,
          gaiaEssences: (prev.transcendence?.gaiaEssences || 0) - essenceCost,
        },
        prestige: {
          ...prev.prestige,
          [prestigeKey]: true,
          ...(autoEquip ? { activeSkin: id } : {}),
        },
      }));
      if (autoEquip) {
        setPreviewSkin(null);
      }
      return;
    }

    if (cost <= 0 || cur.eternalSeeds < cost) return;
    setState(prev => ({
      ...prev,
      eternalSeeds: prev.eternalSeeds - cost,
      prestige: {
        ...prev.prestige,
        [prestigeKey]: true,
        ...(autoEquip ? { activeSkin: id } : {}),
      },
    }));
    if (autoEquip) {
      setPreviewSkin(null);
    }
  }, [stateRef, setState]);

  // UI Theme actions
  const ownedUIThemeList = useCallback(() => {
    return UI_THEME_ORDER.filter(id => isUIThemeUnlocked(stateRef.current, id));
  }, [stateRef]);

  const toggleUITheme = useCallback(() => {
    const owned = ownedUIThemeList();
    if (owned.length <= 1) return;
    const cur = stateRef.current.prestige.activeUITheme || 'classic';
    const curIdx = owned.indexOf(cur);
    const nextIdx = (curIdx === -1 ? 0 : curIdx + 1) % owned.length;
    setState(prev => ({
      ...prev,
      prestige: { ...prev.prestige, activeUITheme: owned[nextIdx] },
    }));
  }, [ownedUIThemeList, stateRef, setState]);

  const setUITheme = useCallback((id: UIThemeId) => {
    setState(prev => ({
      ...prev,
      prestige: { ...prev.prestige, activeUITheme: id },
    }));
  }, [setState]);

  const buyUITheme = useCallback((id: UIThemeId, autoEquip = false) => {
    const cur = stateRef.current;
    const petalCost = UI_THEME_PETAL_COSTS[id];
    const cost = UI_THEME_COSTS[id] || 0;
    const prestigeKey = UI_THEME_PRESTIGE_KEYS[id];
    if (!prestigeKey) return;
    if (cur.prestige[prestigeKey as keyof typeof cur.prestige]) return;

    if (petalCost && petalCost > 0) {
      const petals = cur.transcendence?.astralPetals || 0;
      if (petals < petalCost) return;
      setState(prev => ({
        ...prev,
        transcendence: {
          ...prev.transcendence,
          astralPetals: (prev.transcendence?.astralPetals || 0) - petalCost,
        },
        prestige: {
          ...prev.prestige,
          [prestigeKey]: true,
          ...(autoEquip ? { activeUITheme: id } : {}),
        },
      }));
      if (autoEquip) {
        setPreviewUITheme(null);
      }
      return;
    }

    if (cost <= 0 || cur.eternalSeeds < cost) return;
    setState(prev => ({
      ...prev,
      eternalSeeds: prev.eternalSeeds - cost,
      prestige: {
        ...prev.prestige,
        [prestigeKey]: true,
        ...(autoEquip ? { activeUITheme: id } : {}),
      },
    }));
    if (autoEquip) {
      setPreviewUITheme(null);
    }
  }, [stateRef, setState]);

  // Preview handlers
  const startPreviewSkin = useCallback((id: SkinId | null) => {
    setPreviewSkin(id);
  }, []);

  const startPreviewUITheme = useCallback((id: UIThemeId | null) => {
    setPreviewUITheme(id);
  }, []);

  const clearPreview = useCallback(() => {
    setPreviewSkin(null);
    setPreviewUITheme(null);
  }, []);

  return {
    previewSkin,
    setPreviewSkin,
    previewUITheme,
    setPreviewUITheme,
    effectiveSkin,
    effectiveUITheme,
    startPreviewSkin,
    startPreviewUITheme,
    clearPreview,
    ownedSkinList,
    toggleSkin,
    setSkin,
    buySkin,
    ownedUIThemeList,
    toggleUITheme,
    setUITheme,
    buyUITheme,
  };
}
