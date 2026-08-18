import { AutoRootMode, GameState } from '@/types/game';
import {
  costFor,
  echoCost,
  echoUnlockedFor,
  effectiveRate,
  MODULE_DEFS,
  rootUpgradeCost,
  rootUpgradeLevelMult,
  rootUpgradeRequireOwned,
} from '@/constants/gameData';

export interface AutoBuyCandidate {
  type: 'module' | 'upgrade' | 'echo';
  id: string;
  cost: number;
  value: number; // rate gain per second
  apply: () => void;
}

export const AUTO_BUY_LOOKAHEAD_SECONDS = 90; // 1.5 minutes lookahead window (1-2 minutes)

/**
 * Returns the list of auto root modes unlocked by the player in Prestige.
 */
export function getAvailableAutoRootModes(state: GameState): AutoRootMode[] {
  if (!state.prestige.autoRoot) return [];
  const modes: AutoRootMode[] = ['basic'];
  if (state.prestige.autoRootSmart) modes.push('smart');
  if (state.prestige.autoRootAll) modes.push('all');
  return modes;
}

/**
 * Returns the current active mode for Auto Root.
 */
export function getActiveAutoRootMode(state: GameState): AutoRootMode {
  const available = getAvailableAutoRootModes(state);
  if (available.length === 0) return 'basic';

  const preferred = state.prestige.autoRootMode;
  if (preferred && available.includes(preferred)) {
    return preferred;
  }
  // Default to highest unlocked tier
  return available[available.length - 1];
}

/**
 * Calculates the best purchase to make based on selected Auto Root Tier / Mode.
 * - 'basic': buys cheapest available base root.
 * - 'smart': buys base roots with 1-2 min lookahead, prioritizing highest rate and saving up.
 * - 'all': buys base roots + root upgrades + echoes with 1-2 min lookahead.
 */
export function evaluateAutoBuy(
  state: GameState,
  totalRate: number,
  setState: React.Dispatch<React.SetStateAction<GameState>>
): { executed: boolean; waitingForTarget: string | null } {
  if (!state.prestige.autoRoot || !state.prestige.autoRootEnabled) {
    return { executed: false, waitingForTarget: null };
  }

  const mode = getActiveAutoRootMode(state);
  const isSmart = mode === 'smart' || mode === 'all';
  const isAll = mode === 'all';
  const currentNutrients = state.nutrients;
  const projectedBudget = currentNutrients + totalRate * AUTO_BUY_LOOKAHEAD_SECONDS;

  const candidates: AutoBuyCandidate[] = [];

  // 1. Base root modules
  MODULE_DEFS.forEach((def, i) => {
    if (i > 0 && (state.owned[MODULE_DEFS[i - 1].id] || 0) < 1) return;
    const cost = costFor(def, state.owned[def.id] || 0);
    const value = effectiveRate(state, def);
    candidates.push({
      type: 'module',
      id: def.id,
      cost,
      value,
      apply: () => {
        setState(prev => ({
          ...prev,
          nutrients: prev.nutrients - cost,
          owned: { ...prev.owned, [def.id]: (prev.owned[def.id] || 0) + 1 },
          totalOwned: prev.totalOwned + 1,
        }));
      },
    });
  });

  // 2. Root Upgrades & Echoes (Only if active mode is 'all')
  if (isAll) {
    MODULE_DEFS.forEach(def => {
      const level = (state.rootUpgrades[def.id] || 0) + 1;
      const req = rootUpgradeRequireOwned(level);
      if ((state.owned[def.id] || 0) >= req) {
        const cost = rootUpgradeCost(def, level);
        const gain = (state.owned[def.id] || 0) * effectiveRate(state, def) * (rootUpgradeLevelMult(level) - 1);
        candidates.push({
          type: 'upgrade',
          id: def.id,
          cost,
          value: gain,
          apply: () => {
            setState(prev => ({
              ...prev,
              nutrients: prev.nutrients - cost,
              rootUpgrades: { ...prev.rootUpgrades, [def.id]: level },
            }));
          },
        });
      }
    });

    MODULE_DEFS.forEach(def => {
      if (echoUnlockedFor(state, def.id)) {
        const cost = echoCost(state, def, totalRate);
        const gain = totalRate * 0.01;
        candidates.push({
          type: 'echo',
          id: def.id,
          cost,
          value: gain,
          apply: () => {
            setState(prev => ({
              ...prev,
              nutrients: prev.nutrients - cost,
              echoes: { ...prev.echoes, [def.id]: (prev.echoes[def.id] || 0) + 1 },
            }));
          },
        });
      }
    });
  }

  // If classic basic mode: buy cheapest affordable item
  if (!isSmart) {
    const affordable = candidates
      .filter(c => c.cost <= currentNutrients)
      .sort((a, b) => a.cost - b.cost);
    if (affordable.length > 0) {
      affordable[0].apply();
      return { executed: true, waitingForTarget: null };
    }
    return { executed: false, waitingForTarget: null };
  }

  // SMART / ALL MODE with 1-2 min lookahead:
  // Find candidates reachable within projectedBudget
  const reachableCandidates = candidates.filter(c => c.cost <= projectedBudget);

  if (reachableCandidates.length === 0) {
    // Nothing reachable even within lookahead budget, fallback to best affordable if any
    const affordable = candidates
      .filter(c => c.cost <= currentNutrients)
      .sort((a, b) => b.value - a.value);
    if (affordable.length > 0) {
      affordable[0].apply();
      return { executed: true, waitingForTarget: null };
    }
    return { executed: false, waitingForTarget: null };
  }

  // Sort reachable candidates by value descending (highest rate gain first),
  // tie-broken by lower cost (better value/cost ratio)
  reachableCandidates.sort((a, b) => {
    if (b.value !== a.value) return b.value - a.value;
    return a.cost - b.cost;
  });

  const bestTarget = reachableCandidates[0];

  // If best target is affordable right now, buy it!
  if (currentNutrients >= bestTarget.cost) {
    bestTarget.apply();
    return { executed: true, waitingForTarget: null };
  }

  // Otherwise: WAIT AND SAVE UP! Do not waste nutrients on lesser items
  return { executed: false, waitingForTarget: `${bestTarget.type}:${bestTarget.id}` };
}
