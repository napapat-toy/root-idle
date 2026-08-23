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
  const TRUNK_H = 48;
  const trunkWidth = Math.min(26, Math.max(10, 10 + Math.sqrt(log.length) * 0.5));
  const halfW = trunkWidth / 2;
  let maxY = TRUNK_H;

  // Clean, solid Trunk at top submerged into soil
  branches.push({
    x1: CX,
    y1: 0,
    x2: CX,
    y2: TRUNK_H,
    depth: 0,
    width: trunkWidth,
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
        w = b.children < 5 ? 7.0 : 0.2;
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

    let startX = parent.x2;
    let startY = parent.y2;
    let newAngle: number;

    if (parent.depth === 0) {
      // Primary root lines originate from high up inside the trunk so they fan out broadly across the bottom
      const primaryConfigs = [
        { offsetRatio: -0.65, angle: Math.PI / 2 - 0.54 }, // Left outer root
        { offsetRatio: 0.65,  angle: Math.PI / 2 + 0.54 }, // Right outer root
        { offsetRatio: -0.28, angle: Math.PI / 2 - 0.22 }, // Left inner root
        { offsetRatio: 0.28,  angle: Math.PI / 2 + 0.22 }, // Right inner root
        { offsetRatio: 0,     angle: Math.PI / 2 },        // Center taproot
      ];
      const cfg = primaryConfigs[(parent.children - 1) % primaryConfigs.length];
      startX = CX + cfg.offsetRatio * (halfW * 0.75);
      startY = 18; // Starts high inside the submerged trunk (y=18 vs bottom y=48)
      newAngle = cfg.angle + (rng() - 0.5) * 0.08;
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

      const forkAngle = 0.32 + Math.min(depth * 0.012, 0.14) + (rng() - 0.5) * 0.08;
      newAngle = baseAngle + side * forkAngle;

      // Natural downward pull towards depth
      const downwardBias = Math.min(0.28, 0.08 + depth * 0.018);
      newAngle = newAngle * (1 - downwardBias) + (Math.PI / 2) * downwardBias;

      // Soft boundary guidance when branches approach edges
      if (parent.x2 < 45 && Math.cos(newAngle) < 0) {
        newAngle = Math.PI / 2 + Math.abs(Math.cos(newAngle)) * 0.4;
      } else if (parent.x2 > 455 && Math.cos(newAngle) > 0) {
        newAngle = Math.PI / 2 - Math.abs(Math.cos(newAngle)) * 0.4;
      }
    }

    const len = Math.max(12, 48 - depth * 2.2) * (0.85 + rng() * 0.35);
    const width = Math.max(0.9, 6.2 - depth * 0.42);

    let nx = startX + Math.cos(newAngle) * len;
    let ny = startY + Math.sin(newAngle) * len;

    nx = Math.max(20, Math.min(480, nx));
    ny = Math.max(18, ny);

    branches.push({
      x1: startX,
      y1: startY,
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
    // Trunk base color
    if (skin === 'rainbow') return '#dcd4c0';
    if (skin === 'grayscale') return '#d8d8d8';
    if (skin === 'gradient') return '#ffd76a';
    if (skin === 'sameorigin') return '#e8dcc8';
    return '#523820'; // Default rich dark wood
  }

  // 1. Default (none): Rich natural wood gradient (dark wood -> warm amber -> golden wood tips)
  if (skin === 'none') {
    const light = 26 + Math.min(b.depth, 14) * 3.8;
    return `hsl(28, 44%, ${light}%)`;
  }

  // 2. rainbow (renamed to "แยกตามชนิดราก / Module Spectrum"): uses MODULE_COLOR_MAP
  if (skin === 'rainbow') {
    return (b.moduleId && MODULE_COLOR_MAP[b.moduleId]) || '#eadfc7';
  }

  // 3. grayscale: Monochrome slate
  if (skin === 'grayscale') {
    const light = 25 + Math.min(b.depth, 12) * 5;
    return `hsl(0, 0%, ${light}%)`;
  }

  // 4. gradient: Chromatic Rainbow Spectrum
  if (skin === 'gradient') {
    return `hsl(${(i * 47) % 360}, 75%, 68%)`;
  }

  // 5. sameorigin: Group by major fork at depth 2 with golden-ratio hue spacing
  if (skin === 'sameorigin') {
    const rootIdx = findLineageRoot(branches, i, 2);
    const hue = (rootIdx * 137.5 + 30) % 360;
    const light = 50 + Math.min(b.depth, 10) * 2.5;
    return `hsl(${hue}, 68%, ${light}%)`;
  }

  return '#eadfc7';
}
