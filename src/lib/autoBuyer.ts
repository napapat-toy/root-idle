import { AutoRootMode, GameState } from '@/types/game';
import {
  baseTotalRate,
  costFor,
  echoCost,
  echoUnlockedFor,
  effectiveRate,
  MODULE_DEFS,
  MODULE_UNLOCK_REQUIRE_OWNED,
  rootSynergyCost,
  rootSynergyUnlocked,
  rootUpgradeCost,
  rootUpgradeLevelMult,
  rootUpgradeRequireOwned,
} from '@/constants/gameData';

export interface AutoBuyCandidate {
  type: 'module' | 'upgrade' | 'echo' | 'synergy';
  id: string;
  cost: number;
  value: number; // rate gain per second
  shareOfTotal: number; // proportion of total income (0.0 to 1.0)
  marginalGain: number; // fraction added to totalRate
  isNewUnlock: boolean; // whether this unlocks a new tier
  isGatekeeper?: boolean; // whether this is needed (< 10) to unlock the next tier
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
 * Calculates and executes the best purchases focusing on High-Share (> 1%) root species.
 * - Filters out obsolete low-tier species that contribute < 1% to total yield.
 * - Targets the most powerful game-changing roots, upgrades, and echoes reachable within 1 hour.
 * - Intelligently prioritizes high-share / high-ROI upgrades to maximize rate growth.
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
    const currentBaseRate = baseTotalRate(state);
    const effectiveTotalRate = Math.max(1, totalRate);

    // 1. Base root modules
    MODULE_DEFS.forEach((def, i) => {
      if (i > 0 && (state.owned[MODULE_DEFS[i - 1].id] || 0) < MODULE_UNLOCK_REQUIRE_OWNED) return;
      const count = state.owned[def.id] || 0;
      const cost = costFor(def, count);
      const eff = effectiveRate(state, def);
      const isNewUnlock = count === 0;
      const isGatekeeper = i < MODULE_DEFS.length - 1 && count < MODULE_UNLOCK_REQUIRE_OWNED;
      const projectedModuleTotal = eff * (count + 1);
      const projectedTotalRate = currentBaseRate + eff;
      const shareOfTotal = projectedTotalRate > 0 ? projectedModuleTotal / projectedTotalRate : 0;
      const marginalGain = eff / effectiveTotalRate;

      candidates.push({
        type: 'module',
        id: def.id,
        cost,
        value: eff,
        shareOfTotal,
        marginalGain,
        isNewUnlock,
        isGatekeeper,
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
        const count = state.owned[def.id] || 0;
        const level = (state.rootUpgrades[def.id] || 0) + 1;
        const req = rootUpgradeRequireOwned(level);
        if (count >= req) {
          const cost = rootUpgradeCost(def, level);
          const eff = effectiveRate(state, def);
          const gain = count * eff * (rootUpgradeLevelMult(level) - 1);
          const projectedTotalRate = currentBaseRate + gain;
          const projectedModuleTotal = eff * count * rootUpgradeLevelMult(level);
          const shareOfTotal = projectedTotalRate > 0 ? projectedModuleTotal / projectedTotalRate : 0;
          const marginalGain = gain / effectiveTotalRate;

          candidates.push({
            type: 'upgrade',
            id: def.id,
            cost,
            value: gain,
            shareOfTotal,
            marginalGain,
            isNewUnlock: false,
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
            shareOfTotal: 1.0, // Echo buffs all roots globally
            marginalGain: 0.01,
            isNewUnlock: (state.echoes[def.id] || 0) === 0,
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

      MODULE_DEFS.forEach(def => {
        if (rootSynergyUnlocked(state, def.id) && !state.rootSynergies?.[def.id]) {
          const cost = rootSynergyCost(def);
          const count = state.owned[def.id] || 0;
          const gain = totalRate * (count * 0.001); // +0.1% per unit
          candidates.push({
            type: 'synergy',
            id: def.id,
            cost,
            value: gain,
            shareOfTotal: 1.0, // Synergy buffs entire farm globally
            marginalGain: count * 0.001,
            isNewUnlock: true,
            apply: () => {
              setState(prev => ({
                ...prev,
                nutrients: Math.max(0, prev.nutrients - cost),
                rootSynergies: { ...prev.rootSynergies, [def.id]: true },
              }));
            },
          });
        }
      });
    }

    if (candidates.length === 0) break;

    // Filter out obsolete < 1% candidates when total rate is developed (> 50)
    // Always keep candidates that unlock new tiers, gatekeepers to next tiers, or produce >= 1% of total income
    const highImpactCandidates = candidates.filter(c => {
      if (c.isNewUnlock || c.isGatekeeper) return true;
      if (totalRate <= 50) return true;
      return c.shareOfTotal >= 0.01 || c.marginalGain >= 0.01;
    });

    const activePool = highImpactCandidates.length > 0 ? highImpactCandidates : candidates;

    // Classic basic mode: buy highest-yield affordable high-impact candidate (Top-Down)
    if (!isSmart) {
      const affordable = activePool
        .filter(c => c.cost <= currentNutrients)
        .sort((a, b) => {
          // Gatekeepers take absolute priority to unblock the tree
          if (a.isGatekeeper !== b.isGatekeeper) return a.isGatekeeper ? -1 : 1;
          // Prioritize higher share, then higher value (Top-Down)
          if (Math.abs(b.shareOfTotal - a.shareOfTotal) > 0.03) return b.shareOfTotal - a.shareOfTotal;
          return b.value - a.value;
        });
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

    // 2. Classify candidates by wait time & impact:
    // - Major Targets (Gatekeeper, New unlock or >= 20% share / +20% marginal boost): wait up to 20 mins (1,200s)
    // - Secondary Stepping Stones (5% - 20% share / gain): wait up to 5 mins (300s)
    const evaluatedPool = activePool.map(c => {
      const needed = Math.max(0, c.cost - currentNutrients);
      const waitSec = needed / Math.max(0.01, totalRate);
      const isMajor = c.isNewUnlock || c.isGatekeeper || c.shareOfTotal >= 0.20 || c.marginalGain >= 0.20;
      return {
        ...c,
        waitSec,
        isMajor,
      };
    });

    const reachable = evaluatedPool.filter(c => {
      if (c.waitSec === 0) return true; // Affordable right now
      if (c.isMajor) return c.waitSec <= 1200; // Major target (>= 20%): wait up to 20 mins
      return c.waitSec <= 300; // Secondary stepping stone: wait up to 5 mins
    });

    if (reachable.length === 0) {
      // If nothing within standard window, buy highest value affordable candidate if any (Top-Down)
      const affordable = evaluatedPool
        .filter(c => c.waitSec === 0)
        .sort((a, b) => {
          if (a.isGatekeeper !== b.isGatekeeper) return a.isGatekeeper ? -1 : 1;
          if (Math.abs(b.shareOfTotal - a.shareOfTotal) > 0.03) return b.shareOfTotal - a.shareOfTotal;
          return b.value - a.value;
        });
      if (affordable.length > 0) {
        affordable[0].apply();
        currentNutrients -= affordable[0].cost;
        executedAny = true;
        continue;
      }
      break;
    }

    // Sort candidates:
    // 1. Gatekeeper to next tier / Major target takes highest priority
    // 2. If both are major targets: gatekeeper -> new tier unlock -> higher marginal gain -> wait time
    // 3. For secondary tiers: if both affordable now, buy highest yield / value (Top-Down)
    // 4. Higher share of total production
    // 5. Faster wait time / best ROI
    reachable.sort((a, b) => {
      // 1. If one is a Major Target (>= 20% / new unlock / gatekeeper) and the other is not, Major Target always wins
      if (a.isMajor !== b.isMajor) {
        return a.isMajor ? -1 : 1;
      }

      // 2. If both are Major Targets
      if (a.isMajor && b.isMajor) {
        if (a.isGatekeeper !== b.isGatekeeper) return a.isGatekeeper ? -1 : 1;
        if (a.isNewUnlock !== b.isNewUnlock) return a.isNewUnlock ? -1 : 1;
        if (Math.abs(b.marginalGain - a.marginalGain) > 0.08) return b.marginalGain - a.marginalGain;
        return a.waitSec - b.waitSec;
      }

      // 3. For non-major tiers: if both are affordable now, buy higher share and higher value (Top-Down)
      if (a.waitSec === 0 && b.waitSec === 0) {
        if (Math.abs(b.shareOfTotal - a.shareOfTotal) > 0.03) {
          return b.shareOfTotal - a.shareOfTotal;
        }
        return b.value - a.value;
      }

      // 4. For non-major tiers: affordable secondary stepping stone (>= 5%) takes precedence
      if (a.waitSec === 0 && b.waitSec > 0 && a.shareOfTotal >= 0.05) return -1;
      if (b.waitSec === 0 && a.waitSec > 0 && b.shareOfTotal >= 0.05) return 1;

      // 5. Higher share of total production takes priority
      if (Math.abs(b.shareOfTotal - a.shareOfTotal) > 0.08) {
        return b.shareOfTotal - a.shareOfTotal;
      }

      // 6. Shorter wait time for secondary stepping stones
      if (Math.abs(a.waitSec - b.waitSec) > 30) {
        return a.waitSec - b.waitSec;
      }

      // 7. Best ROI
      const roiB = b.value / Math.max(1, b.cost);
      const roiA = a.value / Math.max(1, a.cost);
      return roiB - roiA;
    });

    const ultimateTarget = reachable[0];
    lastTarget = `${ultimateTarget.type}:${ultimateTarget.id}`;

    // 3. If the target is affordable RIGHT NOW, buy it!
    if (ultimateTarget.waitSec === 0) {
      ultimateTarget.apply();
      currentNutrients -= ultimateTarget.cost;
      executedAny = true;
      continue;
    }

    // 4. SMART ACCELERATION:
    // If waiting for a monster target (>= 50%) or a 5-minute stepping stone:
    // Check if there is an affordable booster with fast payback (< 35% of wait time) to speed up reaching the target
    const affordableCandidates = evaluatedPool.filter(c => c.waitSec === 0);

    if (affordableCandidates.length > 0 && ultimateTarget.waitSec > 15) {
      const quickBoosters = affordableCandidates.filter(c => {
        const paybackSec = c.cost / Math.max(0.01, c.value);
        return paybackSec < ultimateTarget.waitSec * 0.35 && (c.shareOfTotal >= 0.03 || c.marginalGain >= 0.03);
      });

      if (quickBoosters.length > 0) {
        quickBoosters.sort((a, b) => {
          if (b.shareOfTotal !== a.shareOfTotal) return b.shareOfTotal - a.shareOfTotal;
          return (b.value / Math.max(1, b.cost)) - (a.value / Math.max(1, a.cost));
        });
        const booster = quickBoosters[0];
        booster.apply();
        currentNutrients -= booster.cost;
        executedAny = true;
        continue;
      }
    }

    // Otherwise, clean save for the target
    break;
  }

  return { executed: executedAny, waitingForTarget: lastTarget };
}
