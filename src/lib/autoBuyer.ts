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

// Extended Lookahead Window: Up to 1 Hour (3,600 seconds)
export const AUTO_BUY_MAX_LOOKAHEAD_SECONDS = 3600;

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
 * Calculates and executes the best purchases with up to 1-Hour Long-Term Lookahead.
 * - Targets the most powerful game-changing roots, upgrades, and echoes reachable within 1 hour.
 * - Intelligently buys high-efficiency affordable upgrades along the journey to accelerate reaching long-term targets.
 * - Supports burst-buying up to 5 items in a single tick when nutrients are abundant.
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

  let currentNutrients = state.nutrients;
  let executedAny = false;
  let lastTarget: string | null = null;

  // Perform up to 5 consecutive instant purchases in one tick if nutrients allow
  for (let step = 0; step < 5; step++) {
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
            nutrients: Math.max(0, prev.nutrients - cost),
            owned: { ...prev.owned, [def.id]: (prev.owned[def.id] || 0) + 1 },
            totalOwned: prev.totalOwned + 1,
          }));
        },
      });
    });

    // 2. Root Upgrades & Echoes (Only if mode is 'all')
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
                nutrients: Math.max(0, prev.nutrients - cost),
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
                nutrients: Math.max(0, prev.nutrients - cost),
                echoes: { ...prev.echoes, [def.id]: (prev.echoes[def.id] || 0) + 1 },
              }));
            },
          });
        }
      });
    }

    if (candidates.length === 0) break;

    // Classic basic mode: buy cheapest affordable item
    if (!isSmart) {
      const affordable = candidates
        .filter(c => c.cost <= currentNutrients)
        .sort((a, b) => a.cost - b.cost);
      if (affordable.length > 0) {
        affordable[0].apply();
        currentNutrients -= affordable[0].cost;
        executedAny = true;
        continue;
      }
      break;
    }

    // SMART / ALL Mode:
    // 1. Kickstart: If 0 roots owned of the first tier, always buy immediately
    const fineOwned = state.owned['fine'] || 0;
    if (fineOwned === 0) {
      const fineCandidate = candidates.find(c => c.id === 'fine' && c.type === 'module');
      if (fineCandidate && currentNutrients >= fineCandidate.cost) {
        fineCandidate.apply();
        currentNutrients -= fineCandidate.cost;
        executedAny = true;
        continue;
      }
    }

    // 2. 1-Hour Horizon Search: Find all candidates reachable within 3,600 seconds
    const projectedBudget1Hr = currentNutrients + totalRate * AUTO_BUY_MAX_LOOKAHEAD_SECONDS;
    const reachable = candidates.filter(c => c.cost <= projectedBudget1Hr);

    if (reachable.length === 0) {
      // If nothing within 1 hr, buy highest ROI affordable candidate if any
      const affordable = candidates
        .filter(c => c.cost <= currentNutrients)
        .sort((a, b) => (b.value / Math.max(1, b.cost)) - (a.value / Math.max(1, a.cost)));
      if (affordable.length > 0) {
        affordable[0].apply();
        currentNutrients -= affordable[0].cost;
        executedAny = true;
        continue;
      }
      break;
    }

    // Sort 1-hour candidates by highest rate value (impact), then best ROI (value/cost)
    reachable.sort((a, b) => {
      const roiB = b.value / Math.max(1, b.cost);
      const roiA = a.value / Math.max(1, a.cost);
      if (b.value !== a.value) return b.value - a.value;
      return roiB - roiA;
    });

    const ultimateTarget = reachable[0];
    lastTarget = `${ultimateTarget.type}:${ultimateTarget.id}`;

    // 3. If the ultimate target is affordable RIGHT NOW, buy it!
    if (currentNutrients >= ultimateTarget.cost) {
      ultimateTarget.apply();
      currentNutrients -= ultimateTarget.cost;
      executedAny = true;
      continue;
    }

    // 4. SMART ACCELERATION: We are saving for ultimateTarget (which may take up to 1 hr).
    // Can we buy a quick affordable upgrade with fast payback to speed up reaching ultimateTarget?
    const secondsToTarget = (ultimateTarget.cost - currentNutrients) / Math.max(0.01, totalRate);
    const affordableCandidates = candidates.filter(c => c.cost <= currentNutrients);

    if (affordableCandidates.length > 0 && secondsToTarget > 5) {
      // Find quick-payback candidates: payback time (cost / value) is less than half the time to target
      // and costs less than 25% of current savings
      const quickBoosters = affordableCandidates.filter(c => {
        const paybackSec = c.cost / Math.max(0.01, c.value);
        return paybackSec < secondsToTarget * 0.5 || c.cost <= currentNutrients * 0.15;
      });

      if (quickBoosters.length > 0) {
        // Sort quick boosters by fastest ROI
        quickBoosters.sort((a, b) => (b.value / Math.max(1, b.cost)) - (a.value / Math.max(1, a.cost)));
        const booster = quickBoosters[0];
        booster.apply();
        currentNutrients -= booster.cost;
        executedAny = true;
        continue;
      }
    }

    // Otherwise, clean save for the 1-hour target
    break;
  }

  return { executed: executedAny, waitingForTarget: lastTarget };
}
