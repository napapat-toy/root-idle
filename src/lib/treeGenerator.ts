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

// 32-bit PRNG (Mulberry32) for high-quality deterministic pseudo-random numbers
function mulberry32(seed: number = 1337) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface InternalBranch extends Branch {
  childSides?: number[];
}

export function buildBranchesFromLog(log: string[]): { branches: Branch[]; maxY: number } {
  const rng = mulberry32(1337);
  const branches: InternalBranch[] = [];
  const CX = 250;
  const CY = 14;
  let maxY = CY + 38;

  // Trunk (depth 0)
  branches.push({
    x1: CX,
    y1: CY,
    x2: CX,
    y2: CY + 38,
    depth: 0,
    width: 7.2,
    children: 0,
    moduleId: 'trunk',
    parentIndex: null,
    childSides: [],
  });

  for (let bIndex = 0; bIndex < log.length; bIndex++) {
    const moduleId = log[bIndex];

    const leftCount = branches.filter(b => b.x2 < CX - 4).length;
    const rightCount = branches.filter(b => b.x2 > CX + 4).length;
    const leftBoost = (rightCount + 4) / (leftCount + 4);
    const rightBoost = (leftCount + 4) / (rightCount + 4);

    // Binary fractal tree preference: prioritize tips that haven't forked yet (0 or 1 child)
    const weights = branches.map(b => {
      let w = 1.0;
      if (b.depth === 0) {
        w = b.children < 4 ? 6.0 : 0.2;
      } else if (b.children === 0) {
        w = 4.5;
      } else if (b.children === 1) {
        w = 3.0;
      } else {
        w = 0.2 / (1 + b.children * 2);
      }

      if (b.x2 < CX - 4) w *= Math.min(Math.max(leftBoost, 0.5), 2.0);
      else if (b.x2 > CX + 4) w *= Math.min(Math.max(rightBoost, 0.5), 2.0);
      return w;
    });

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

    let newAngle: number;
    if (parent.depth === 0) {
      // Primary root lines fan out across the 4 main cardinal sectors
      const primaryAngles = [
        Math.PI / 2 - 0.52, // Left main root
        Math.PI / 2 + 0.52, // Right main root
        Math.PI / 2 - 0.20, // Center-left root
        Math.PI / 2 + 0.20, // Center-right root
      ];
      newAngle = primaryAngles[(parent.children - 1) % primaryAngles.length] + (rng() - 0.5) * 0.1;
    } else {
      // Binary bifurcation (forking outward left & right)
      if (!parent.childSides) parent.childSides = [];
      let side: number;
      if (parent.childSides.length === 0) {
        side = parent.x2 < CX ? (rng() < 0.65 ? -1 : 1) : (rng() < 0.65 ? 1 : -1);
      } else {
        side = -parent.childSides[0];
      }
      parent.childSides.push(side);

      const forkAngle = 0.35 + Math.min(depth * 0.015, 0.18) + (rng() - 0.5) * 0.1;
      newAngle = baseAngle + side * forkAngle;

      // Soft boundary guidance when branches approach edges
      if (parent.x2 < 45 && Math.cos(newAngle) < 0) {
        newAngle = Math.PI / 2 + Math.abs(Math.cos(newAngle)) * 0.4;
      } else if (parent.x2 > 455 && Math.cos(newAngle) > 0) {
        newAngle = Math.PI / 2 - Math.abs(Math.cos(newAngle)) * 0.4;
      }
    }

    const len = Math.max(9, 44 - depth * 2.6) * (0.8 + rng() * 0.4);
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
      childSides: [],
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
