import { Branch, SkinId } from '@/types/game';
import { MODULE_COLOR_MAP } from '@/constants/gameData';

export function deriveLog(owned: Record<string, number>): string[] {
  const ids = Object.keys(MODULE_COLOR_MAP);
  const counts = ids.map(id => owned[id] || 0);
  const total = counts.reduce((a, b) => a + b, 0);
  if (total === 0) return [];
  const acc = counts.map(() => 0);
  const log: string[] = [];

  for (let step = 0; step < total; step++) {
    for (let i = 0; i < counts.length; i++) acc[i] += counts[i];
    let best = 0;
    for (let i = 1; i < counts.length; i++) if (acc[i] > acc[best]) best = i;
    acc[best] -= total;
    log.push(ids[best]);
  }
  return log;
}

export function angleOf(b: Branch): number {
  return Math.atan2(b.y2 - b.y1, b.x2 - b.x1);
}

// Pseudo-random number generator for deterministic tree generation
function createPrng(seed: number = 1337) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function buildBranchesFromLog(log: string[]): { branches: Branch[]; maxY: number } {
  const rng = createPrng(42);
  const branches: Branch[] = [];
  let maxY = 38;

  // Trunk (depth 0)
  branches.push({
    x1: 250,
    y1: 0,
    x2: 250,
    y2: 38,
    depth: 0,
    width: 7.2,
    children: 0,
    moduleId: 'trunk',
    parentIndex: null,
  });

  for (let bIndex = 0; bIndex < log.length; bIndex++) {
    const moduleId = log[bIndex];

    const weights = branches.map(b => 1 / (1 + b.children * 1.6));
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let r = rng() * totalWeight;
    let idx = 0;

    for (let i = 0; i < branches.length; i++) {
      r -= weights[i];
      if (r <= 0) {
        idx = i;
        break;
      }
      idx = i;
    }

    const parent = branches[idx];
    parent.children++;

    const depth = parent.depth + 1;
    const baseAngle = angleOf(parent);
    const spread = 0.55 + Math.min(depth * 0.05, 0.5);
    const newAngle = baseAngle + (rng() - 0.5) * spread;
    const len = Math.max(9, 46 - depth * 3.1) * (0.75 + rng() * 0.5);
    const width = Math.max(0.9, 6.2 - depth * 0.45);

    let nx = parent.x2 + Math.cos(newAngle) * len;
    let ny = parent.y2 + Math.sin(newAngle) * len;

    nx = Math.max(20, Math.min(480, nx));
    ny = Math.max(18, ny);

    branches.push({
      x1: parent.x2,
      y1: parent.y2,
      x2: nx,
      y2: ny,
      depth,
      width,
      children: 0,
      moduleId,
      parentIndex: idx,
    });
    if (ny > maxY) maxY = ny;
  }

  return { branches, maxY };
}

/**
 * Traces the lineage of a branch back to its major fork (depth 2)
 * so that each distinct sub-root system receives its own unique color family.
 */
export function findLineageRoot(branches: Branch[], i: number, targetDepth: number = 2): number {
  let idx = i;
  while (branches[idx] && branches[idx].depth > targetDepth && branches[idx].parentIndex != null) {
    idx = branches[idx].parentIndex!;
  }
  return idx;
}

export function getBranchColor(branches: Branch[], b: Branch, i: number, skin: SkinId): string {
  if (i === 0) {
    // trunk
    if (skin === 'rainbow') return '#f2d24a';
    if (skin === 'grayscale') return '#d8d8d8';
    if (skin === 'gradient') return '#e8dcc8';
    if (skin === 'sameorigin') return '#e8dcc8';
    return '#c9b48a';
  }
  if (skin === 'rainbow') {
    return `hsl(${(i * 47) % 360}, 75%, 68%)`;
  }
  if (skin === 'grayscale') {
    const light = 22 + Math.min(b.depth, 12) * 5;
    return `hsl(0, 0%, ${light}%)`;
  }
  if (skin === 'gradient') {
    const light = 20 + Math.min(b.depth, 14) * 4.5;
    return `hsl(95, 32%, ${light}%)`;
  }
  if (skin === 'sameorigin') {
    // Group by major fork at depth 2 with golden-ratio hue spacing
    const rootIdx = findLineageRoot(branches, i, 2);
    const hue = (rootIdx * 137.5 + 30) % 360;
    const light = 50 + Math.min(b.depth, 10) * 2.5;
    return `hsl(${hue}, 68%, ${light}%)`;
  }
  return (b.moduleId && MODULE_COLOR_MAP[b.moduleId]) || '#eadfc7';
}
