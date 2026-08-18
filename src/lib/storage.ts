import { GameState, SavePayload, SaveSlotMeta } from '@/types/game';
import { BUY_QTY_OPTIONS, MODULE_DEFS } from '@/constants/gameData';

export const STORAGE_KEY = 'root-idle-state-v1';

export function encodeSave(state: GameState): string {
  const payload: SavePayload = {
    v: 5,
    n: state.nutrients,
    o: state.owned,
    t: state.totalOwned,
    ru: state.rootUpgrades,
    e: state.echoes,
    q: state.buyQty,
    re: state.runEarned,
    es: state.eternalSeeds,
    p: state.prestige,
    pt: state.totalPlayTimeSeconds,
    rpt: state.runPlayTimeSeconds,
  };
  try {
    return btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
  } catch {
    return btoa(JSON.stringify(payload));
  }
}

export function decodeSave(code: string): SavePayload {
  let jsonString = '';
  try {
    jsonString = decodeURIComponent(escape(atob(code.trim())));
  } catch {
    jsonString = atob(code.trim());
  }
  const payload = JSON.parse(jsonString);
  if (!payload || typeof payload !== 'object') throw new Error('invalid save code');

  // backward compatibility with legacy v1 format
  if (!payload.o && Array.isArray(payload.rle)) {
    const owned: Record<string, number> = {};
    payload.rle.forEach(([idx, count]: [number, number]) => {
      const id = MODULE_DEFS[idx]?.id;
      if (id) owned[id] = (owned[id] || 0) + count;
    });
    payload.o = owned;
  }
  if (!payload.o) throw new Error('invalid save code');
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
        skinSameOrigin: false,
        skinGrayscale: false,
        skinGradient: false,
        activeSkin: 'none',
        autoReset: false,
        autoResetEnabled: true,
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
  };

  if (state.prestige.activeSkin === 'none' && state.prestige.auraRoots && (state.prestige as any).auraRootsEnabled) {
    state.prestige.activeSkin = 'rainbow';
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
      runEarned: state.runEarned,
      eternalSeeds: state.eternalSeeds,
      prestige: state.prestige,
      lockGapBackfilled: state.lockGapBackfilled,
      totalPlayTimeSeconds: state.totalPlayTimeSeconds,
      runPlayTimeSeconds: state.runPlayTimeSeconds,
      buyQty: state.buyQty,
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
      q: data.buyQty,
      re: data.runEarned,
      es: data.eternalSeeds,
      p: data.prestige,
      pt: data.totalPlayTimeSeconds,
      rpt: data.runPlayTimeSeconds,
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
    return JSON.parse(raw) as SaveSlotMeta;
  } catch {
    return null;
  }
}

export function saveSlot(slotNum: number, state: GameState): void {
  if (typeof window === 'undefined') return;
  try {
    const meta: SaveSlotMeta = {
      code: encodeSave(state),
      savedAt: Date.now(),
      totalOwned: state.totalOwned,
      seeds: Math.floor(state.eternalSeeds),
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
