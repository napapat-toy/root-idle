import { GameState, SavePayload, SaveSlotMeta } from '@/types/game';
import {
  BUY_QTY_OPTIONS,
  calcPrestigeSeeds,
  EVENT_BONUS_MAX_LEVEL,
  MODULE_DEFS,
  relicsCount,
  TRANSCENDENCE_REQUIRE_PRESTIGES,
  TRANSCENDENCE_REQUIRE_YGGDRASIL,
} from '@/constants/gameData';

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
      totalNutrientsEarnedLifetime: state.runEarned || state.nutrients || 0,
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
      lang: payload.lang || 'th',
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
    activeBiome: payload.bm || 'topsoil',
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
        autoRootMode: 'all',
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
        skinTimelessAurora: false,
        skinStarlightPrism: false,
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
        themeSubterraneanBorealis: false,
        activeUITheme: 'classic',
        autoReset: false,
        autoResetEnabled: false,
        autoResetThreshold: 1000,
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
        echoResonanceLevel: 0,
        gaiaClairvoyanceLevel: 0,
        primordialSeedlingLevel: 0,
        deepMeditationLevel: 0,
        gaiaBlessingLevel: 0,
        hyperdriveUnlocked: false,
        hyperdriveEnabled: false,
        auroraBloomUnlocked: false,
        astralPetals: 0,
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

  if (
    (state.owned['yggdrasil'] || 0) >= TRANSCENDENCE_REQUIRE_YGGDRASIL &&
    (state.stats?.prestigeCount || 0) >= TRANSCENDENCE_REQUIRE_PRESTIGES
  ) {
    state.transcendence.everUnlocked = true;
  }

  if ((state.prestige.eventBonusLevel || 0) > EVENT_BONUS_MAX_LEVEL) {
    state.prestige.eventBonusLevel = EVENT_BONUS_MAX_LEVEL;
  }

  // Auto-upgrade existing automation owners to full Universal Automation
  if (state.prestige.autoRoot || state.prestige.autoRootAll) {
    state.prestige.autoRoot = true;
    state.prestige.autoRootSmart = true;
    state.prestige.autoRootAll = true;
    state.prestige.autoRootMode = 'all';
    state.prestige.autoEvent = true;
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
        const hydrated = payloadToState(payload);
        const owned = hydrated.owned || {};
        const highestOwned = MODULE_DEFS.slice().reverse().find(d => (owned[d.id] || 0) > 0);
        const runEarned = hydrated.runEarned || hydrated.nutrients || 0;
        const pendingSeeds = calcPrestigeSeeds(hydrated);

        meta.nutrients = hydrated.nutrients || 0;
        meta.pendingSeeds = pendingSeeds;
        meta.highestModuleId = highestOwned ? highestOwned.id : 'fine';
        meta.prestigeCount = hydrated.stats?.prestigeCount || 0;
        meta.transcendenceCount = hydrated.transcendence?.count || 0;
        meta.gaiaEssences = hydrated.transcendence?.gaiaEssences || 0;
        meta.activeTrial = hydrated.transcendence?.activeTrial || 'none';
        meta.relicsCount = relicsCount(hydrated);
        meta.achievementsCount = hydrated.achievements?.length || 0;
        meta.totalOwned = hydrated.totalOwned;
        meta.totalPlayTimeSeconds = hydrated.totalPlayTimeSeconds || 0;
        meta.lifetimeSeeds = hydrated.stats?.totalSeedsEarnedLifetime || hydrated.eternalSeeds || 0;
        meta.lifetimeNutrients = hydrated.stats?.totalNutrientsEarnedLifetime || runEarned;
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
