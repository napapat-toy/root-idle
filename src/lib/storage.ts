import { GameState, SavePayload, SaveSlotMeta } from '@/types/game';
import { BUY_QTY_OPTIONS, calcPrestigeSeeds, MODULE_DEFS, relicsCount } from '@/constants/gameData';

export const STORAGE_KEY = 'root-idle-state-v1';

export function encodeSave(state: GameState): string {
  const payload: SavePayload = {
    v: 5,
    n: state.nutrients,
    o: state.owned,
    t: state.totalOwned,
    ru: state.rootUpgrades,
    e: state.echoes,
    syn: state.rootSynergies || {},
    rel: state.relics || {},
    bm: state.activeBiome || 'topsoil',
    q: state.buyQty,
    re: state.runEarned,
    es: state.eternalSeeds,
    p: state.prestige,
    ts: state.transcendence,
    pt: state.totalPlayTimeSeconds,
    rpt: state.runPlayTimeSeconds,
    ach: state.achievements || [],
    lang: state.lang || 'th',
    st: state.stats || {
      prestigeCount: 0,
      totalEventsClaimed: 0,
      luckyJackpotCount: 0,
      maxOfflineTimeSeconds: 0,
      superJackpotClaimed: false,
      totalSeedsEarnedLifetime: 0,
    },
  };
  try {
    return btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
  } catch {
    return btoa(JSON.stringify(payload));
  }
}

export function decodeSave(rawCode: string): SavePayload {
  let code = rawCode.trim();
  if ((code.startsWith('"') && code.endsWith('"')) || (code.startsWith("'") && code.endsWith("'"))) {
    code = code.slice(1, -1).trim();
  }

  let jsonString = '';

  // 1. Direct JSON string support
  if (code.startsWith('{') && code.endsWith('}')) {
    jsonString = code;
  } else {
    // 2. Base64 decoded string
    try {
      jsonString = decodeURIComponent(escape(atob(code)));
    } catch {
      try {
        jsonString = atob(code);
      } catch {
        throw new Error('invalid save encoding');
      }
    }
  }

  const payload = JSON.parse(jsonString);
  if (!payload || typeof payload !== 'object') throw new Error('invalid save code');

  // Support direct GameState raw export format
  if ('nutrients' in payload && !('n' in payload)) {
    return {
      v: 5,
      n: payload.nutrients,
      o: payload.owned || {},
      t: payload.totalOwned || 0,
      ru: payload.rootUpgrades || {},
      e: payload.echoes || {},
      syn: payload.rootSynergies || {},
      rel: payload.relics || {},
      bm: payload.activeBiome || 'topsoil',
      q: payload.buyQty || 1,
      re: payload.runEarned || payload.nutrients || 0,
      es: payload.eternalSeeds || 0,
      p: payload.prestige || {},
      ts: payload.transcendence || {},
      pt: payload.totalPlayTimeSeconds || 0,
      rpt: payload.runPlayTimeSeconds || 0,
      ach: payload.achievements || [],
      st: payload.stats || {},
    };
  }

  // backward compatibility with legacy v1 format
  if (!payload.o && Array.isArray(payload.rle)) {
    const owned: Record<string, number> = {};
    payload.rle.forEach(([idx, count]: [number, number]) => {
      const id = MODULE_DEFS[idx]?.id;
      if (id) owned[id] = (owned[id] || 0) + count;
    });
    payload.o = owned;
  }
  if (!payload.o && payload.n === undefined) throw new Error('invalid save code');
  return payload;
}

export function backfillUnlockGaps(state: GameState): number {
  if (state.lockGapBackfilled) return 0;
  let maxOwnedIndex = -1;
  MODULE_DEFS.forEach((d, i) => {
    if ((state.owned[d.id] || 0) > 0) maxOwnedIndex = i;
  });
  let granted = 0;
  for (let i = 0; i < maxOwnedIndex; i++) {
    const id = MODULE_DEFS[i].id;
    if (!(state.owned[id] > 0)) {
      state.owned[id] = 1;
      state.totalOwned += 1;
      granted++;
    }
  }
  state.lockGapBackfilled = true;
  return granted;
}

export function payloadToState(payload: SavePayload): GameState {
  const owned = payload.o || {};
  MODULE_DEFS.forEach(d => {
    if (!(d.id in owned)) owned[d.id] = 0;
  });

  const state: GameState = {
    nutrients: payload.n || 0,
    owned,
    totalOwned: payload.t || 0,
    rootUpgrades: payload.ru || {},
    echoes: payload.e || {},
    rootSynergies: payload.syn || {},
    relics: payload.rel || {},
    unclaimedRelicId: null,
    activeBiome: (payload.bm as any) || 'topsoil',
    buyQty: BUY_QTY_OPTIONS.includes(payload.q || 1) ? (payload.q as number) : 1,
    lockGapBackfilled: false,
    totalPlayTimeSeconds: payload.pt || 0,
    runPlayTimeSeconds: payload.rpt || 0,
    runEarned: payload.re || 0,
    eternalSeeds: payload.es || 0,
    prestige: Object.assign(
      {
        starterLevel: 0,
        autoRoot: false,
        autoRootEnabled: true,
        autoRootSmart: false,
        autoRootAll: false,
        goldenLevel: 0,
        auraRoots: false,
        skinSakura: false,
        skinCafe: false,
        skinAutumn: false,
        skinOcean: false,
        skinFrost: false,
        skinSunset: false,
        skinSameOrigin: false,
        skinMystic: false,
        skinCyberpunk: false,
        skinGrayscale: false,
        skinGradient: false,
        skinNebula: false,
        skinImperial: false,
        activeSkin: 'none',
        themeSakura: false,
        themeCafe: false,
        themeAutumn: false,
        themeOcean: false,
        themeFrost: false,
        themeSunset: false,
        themeMystic: false,
        themeCyberpunk: false,
        themeGrayscale: false,
        themeEmerald: false,
        themeNebula: false,
        themeImperial: false,
        activeUITheme: 'classic',
        autoReset: false,
        autoResetEnabled: false,
        autoResetThreshold: 0,
        offlineCapLevel: 0,
        eventBonusLevel: 0,
        eventDurationLevel: 0,
        autoEvent: false,
        autoEventEnabled: true,
        luckyMagnitudeLevel: 0,
        luckyDurationLevel: 0,
        luckyChanceLevel: 0,
        passiveRateLevel: 0,
      },
      payload.p || {}
    ),
    transcendence: Object.assign(
      {
        count: 0,
        gaiaEssences: 0,
        totalGaiaEssencesLifetime: 0,
        primordialVigorLevel: 0,
        soilMemoryLevel: 0,
        autoManagerUnlocked: false,
        gaiaTouchLevel: 0,
        activeTrial: 'none' as const,
        completedTrials: {},
        everUnlocked: false,
      },
      payload.ts || {}
    ),
    achievements: Array.isArray(payload.ach) ? payload.ach : [],
    stats: Object.assign(
      {
        prestigeCount: 0,
        totalEventsClaimed: 0,
        luckyJackpotCount: 0,
        maxOfflineTimeSeconds: 0,
        superJackpotClaimed: false,
        totalSeedsEarnedLifetime: 0,
        totalNutrientsEarnedLifetime: payload.st?.totalNutrientsEarnedLifetime ?? (payload.re || 0),
      },
      payload.st || {}
    ),
    lang: payload.lang === 'en' ? 'en' : 'th',
  };

  const prestigeRecord = state.prestige as unknown as Record<string, unknown>;
  if (state.prestige.activeSkin === 'none' && state.prestige.auraRoots && Boolean(prestigeRecord.auraRootsEnabled)) {
    state.prestige.activeSkin = 'rainbow';
  }

  if ((state.owned['yggdrasil'] || 0) >= 100 && (state.stats?.prestigeCount || 0) >= 5) {
    state.transcendence.everUnlocked = true;
  }

  // Graceful restoration for relics lost due to legacy storage bug
  const relicTotal = Object.values(state.relics || {}).reduce<number>(
    (acc, v) => acc + (typeof v === 'number' ? v : (v ? 1 : 0)),
    0
  );
  if (
    relicTotal === 0 &&
    ((state.stats?.prestigeCount || 0) >= 5 ||
      (state.stats?.luckyJackpotCount || 0) >= 2 ||
      (state.transcendence?.count || 0) > 0 ||
      (state.transcendence?.gaiaEssences || 0) > 0)
  ) {
    state.relics = {
      ...state.relics,
      amber_resin: 1,
      aquifer_pearl: 1,
    };
  }

  // Graceful restoration for Transcendence progress lost due to v1.27.0/v1.27.1 storage bug
  const tState = state.transcendence;
  const isTranscendenceEmpty =
    (tState?.count || 0) === 0 &&
    (tState?.gaiaEssences || 0) === 0 &&
    (tState?.totalGaiaEssencesLifetime || 0) === 0 &&
    (tState?.primordialVigorLevel || 0) === 0 &&
    !tState?.autoManagerUnlocked &&
    (tState?.gaiaTouchLevel || 0) === 0 &&
    Object.keys(tState?.completedTrials || {}).length === 0;

  if (
    isTranscendenceEmpty &&
    ((state.stats?.prestigeCount || 0) >= 5 || (state.owned['yggdrasil'] || 0) >= 25)
  ) {
    state.transcendence = {
      count: 0,
      gaiaEssences: 2,
      totalGaiaEssencesLifetime: 40,
      primordialVigorLevel: 1,
      soilMemoryLevel: 0,
      autoManagerUnlocked: true,
      gaiaTouchLevel: 1,
      activeTrial: 'none',
      completedTrials: { arid_drought: true },
      everUnlocked: true,
    };
  }

  backfillUnlockGaps(state);
  return state;
}

export function saveToLocalStorage(state: GameState): void {
  if (typeof window === 'undefined') return;
  try {
    const data = {
      nutrients: state.nutrients,
      owned: state.owned,
      totalOwned: state.totalOwned,
      rootUpgrades: state.rootUpgrades,
      echoes: state.echoes,
      rootSynergies: state.rootSynergies,
      relics: state.relics || {},
      activeBiome: state.activeBiome || 'topsoil',
      runEarned: state.runEarned,
      eternalSeeds: state.eternalSeeds,
      prestige: state.prestige,
      transcendence: state.transcendence,
      lockGapBackfilled: state.lockGapBackfilled,
      totalPlayTimeSeconds: state.totalPlayTimeSeconds,
      runPlayTimeSeconds: state.runPlayTimeSeconds,
      buyQty: state.buyQty,
      achievements: state.achievements || [],
      stats: state.stats,
      lang: state.lang || 'th',
      lastTs: Date.now(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save to localStorage', e);
  }
}

export function loadFromLocalStorage(): { state: GameState; lastTs?: number } | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    const state = payloadToState({
      v: 5,
      n: data.nutrients,
      o: data.owned,
      t: data.totalOwned,
      ru: data.rootUpgrades,
      e: data.echoes,
      syn: data.rootSynergies,
      rel: data.relics || {},
      bm: data.activeBiome || 'topsoil',
      q: data.buyQty,
      re: data.runEarned,
      es: data.eternalSeeds,
      p: data.prestige,
      ts: data.transcendence,
      pt: data.totalPlayTimeSeconds,
      rpt: data.runPlayTimeSeconds,
      ach: data.achievements,
      st: data.stats,
      lang: data.lang,
    });
    state.lockGapBackfilled = data.lockGapBackfilled || false;
    return { state, lastTs: data.lastTs };
  } catch (e) {
    console.warn('Failed to load from localStorage', e);
    return null;
  }
}

export function getSlotMeta(slotNum: number): SaveSlotMeta | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(`save-slot-${slotNum}`);
    if (!raw) return null;
    const meta = JSON.parse(raw) as SaveSlotMeta;

    // Auto-backfill rich metadata for older saves by parsing meta.code
    if (meta && meta.code && (meta.nutrients === undefined || meta.pendingSeeds === undefined || meta.totalPlayTimeSeconds === undefined || meta.relicsCount === undefined || meta.gaiaEssences === undefined)) {
      try {
        const payload = decodeSave(meta.code);
        const owned = payload.o || {};
        const highestOwned = MODULE_DEFS.slice().reverse().find(d => (owned[d.id] || 0) > 0);
        const runEarned = payload.re || payload.n || 0;
        const goldenLevel = payload.p?.goldenLevel || 0;
        const baseSeeds = Math.floor(Math.cbrt(runEarned / 1000000));
        const pendingSeeds = Math.max(0, Math.floor(baseSeeds * (1 + goldenLevel * 0.05)));

        meta.nutrients = payload.n || 0;
        meta.pendingSeeds = pendingSeeds;
        meta.highestModuleId = highestOwned ? highestOwned.id : 'fine';
        meta.prestigeCount = payload.st?.prestigeCount || 0;
        meta.transcendenceCount = payload.ts?.count || 0;
        meta.gaiaEssences = payload.ts?.gaiaEssences || 0;
        meta.activeTrial = payload.ts?.activeTrial || 'none';
        meta.relicsCount = payload.rel ? Object.values(payload.rel).filter(v => (typeof v === 'number' && v > 0) || v === true).length : 0;
        meta.achievementsCount = payload.ach?.length || 0;
        meta.totalOwned = payload.t || Object.values(owned).reduce((a, b) => a + b, 0);
        meta.totalPlayTimeSeconds = payload.pt || 0;
        meta.lifetimeSeeds = payload.st?.totalSeedsEarnedLifetime || payload.es || 0;
        meta.lifetimeNutrients = payload.st?.totalNutrientsEarnedLifetime || runEarned;
      } catch {
        // graceful fallback
      }
    }

    return meta;
  } catch {
    return null;
  }
}

export function saveSlot(slotNum: number, state: GameState): void {
  if (typeof window === 'undefined') return;
  try {
    const highestOwned = MODULE_DEFS.slice().reverse().find(d => (state.owned[d.id] || 0) > 0);
    const meta: SaveSlotMeta = {
      code: encodeSave(state),
      savedAt: Date.now(),
      totalOwned: state.totalOwned,
      seeds: Math.floor(state.eternalSeeds),
      pendingSeeds: calcPrestigeSeeds(state),
      nutrients: state.nutrients,
      highestModuleId: highestOwned ? highestOwned.id : 'fine',
      prestigeCount: state.stats?.prestigeCount || 0,
      transcendenceCount: state.transcendence?.count || 0,
      gaiaEssences: state.transcendence?.gaiaEssences || 0,
      activeTrial: state.transcendence?.activeTrial || 'none',
      relicsCount: relicsCount(state),
      achievementsCount: state.achievements?.length || 0,
      totalPlayTimeSeconds: state.totalPlayTimeSeconds || 0,
      lifetimeSeeds: Math.max(state.stats?.totalSeedsEarnedLifetime || 0, state.eternalSeeds || 0),
      lifetimeNutrients: state.stats?.totalNutrientsEarnedLifetime || state.runEarned || state.nutrients || 0,
    };
    window.localStorage.setItem(`save-slot-${slotNum}`, JSON.stringify(meta));
  } catch (e) {
    console.warn('Failed to save slot', e);
  }
}

export function deleteSlot(slotNum: number): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(`save-slot-${slotNum}`);
  } catch (e) {
    console.warn('Failed to delete slot', e);
  }
}
