import { GameState, Language } from '@/types/game';
import { MODULE_DEFS } from './modules';

// Subterranean Geological Depth Layers
export interface SubterraneanDepthInfo {
  depthMeters: number;
  depthFormatted: string;
  stageName: string;
  layerTitle: string;
  bgGradient: string;
  surfaceTheme: 'grass' | 'moss' | 'crystal' | 'magma' | 'void' | 'yggdrasil';
  surfaceColor: string;
  surfaceSubColor: string;
  layerIndex: number;
}

export function getHighestOwnedRootIndex(stateOrOwned: GameState | Record<string, number>): number {
  const owned: Record<string, number> = 'owned' in stateOrOwned ? (stateOrOwned as GameState).owned : stateOrOwned;
  for (let i = MODULE_DEFS.length - 1; i >= 0; i--) {
    if ((owned[MODULE_DEFS[i].id] || 0) > 0) {
      return i;
    }
  }
  return 0;
}

export function subterraneanDepthMeters(totalOwned: number, highestIndex: number = 0): number {
  const TIER_DEPTH_BASE = [
    15,     // 0: fine (15m)
    40,     // 1: nodule (40m)
    80,     // 2: myco (80m)
    160,    // 3: core (160m)
    350,    // 4: vine (350m)
    800,    // 5: bionode (800m)
    1800,   // 6: eternal (1.8km)
    3500,   // 7: nexus (3.5km)
    7500,   // 8: crystal (7.5km)
    15000,  // 9: heart (15km)
    35000,  // 10: seed (35km)
    75000,  // 11: throne (75km)
    150000, // 12: magma (150km)
    350000, // 13: aether (350km)
    750000, // 14: void (750km)
    1500000,// 15: astral (1,500km)
    3500000,// 16: chronos (3,500km)
    7500000,// 17: singularity (7,500km)
    15000000,// 18: genesis (15,000km)
    35000000,// 19: yggdrasil (35,000km)
  ];

  const baseMeters = TIER_DEPTH_BASE[Math.min(highestIndex, TIER_DEPTH_BASE.length - 1)] || 15;
  return baseMeters + Math.round(totalOwned * 5);
}

export function getSubterraneanDepthInfo(
  totalOwned: number,
  highestIndexOrMaxY: number = 0,
  lang: Language = 'th'
): SubterraneanDepthInfo {
  // If highestIndex is large (e.g. from maxY > 100), clamp to max tier index
  const highestIndex = highestIndexOrMaxY > 25 ? Math.min(19, Math.floor(highestIndexOrMaxY / 50)) : highestIndexOrMaxY;
  const depthMeters = subterraneanDepthMeters(totalOwned, highestIndex);
  const depthFormatted = depthMeters >= 1000 ? `${(depthMeters / 1000).toLocaleString(undefined, { maximumFractionDigits: 2 })} km` : `${depthMeters} m`;
  const isEn = lang === 'en';

  // Layer 1: Surface Loam (T1-T4: fine, nodule, myco, core)
  if (highestIndex < 4) {
    return {
      depthMeters,
      depthFormatted,
      stageName: isEn ? 'Surface Loam' : 'ดินร่วนชั้นบน',
      layerTitle: isEn ? `🌱 Surface Loam · ${depthFormatted}` : `🌱 ดินร่วนชั้นบน · ${depthFormatted}`,
      bgGradient: 'radial-gradient(ellipse at 50% 15%, #241c14 0%, #15100c 60%, #0a0806 100%)',
      surfaceTheme: 'grass',
      surfaceColor: '#8fd17a',
      surfaceSubColor: '#3a2717',
      layerIndex: 1,
    };
  }

  // Layer 2: Subterranean Bio-Forest (T5-T8: vine, bionode, eternal, nexus)
  if (highestIndex < 8) {
    return {
      depthMeters,
      depthFormatted,
      stageName: isEn ? 'Subterranean Bio-Forest' : 'ป่าใต้ดินชีวภาพ',
      layerTitle: isEn ? `🍄 Subterranean Bio-Forest · ${depthFormatted}` : `🍄 ป่าใต้ดินชีวภาพ · ${depthFormatted}`,
      bgGradient: 'radial-gradient(ellipse at 50% 25%, #0f2316 0%, #09170e 60%, #040a06 100%)',
      surfaceTheme: 'moss',
      surfaceColor: '#4ade80',
      surfaceSubColor: '#143d23',
      layerIndex: 2,
    };
  }

  // Layer 3: Crystal Cavern (T9-T12: crystal, heart, seed, throne)
  if (highestIndex < 12) {
    return {
      depthMeters,
      depthFormatted,
      stageName: isEn ? 'Crystal Cavern' : 'ถ้ำผลึกคริสตัล',
      layerTitle: isEn ? `💎 Crystal Cavern · ${depthFormatted}` : `💎 ถ้ำผลึกคริสตัล · ${depthFormatted}`,
      bgGradient: 'radial-gradient(ellipse at 50% 25%, #0c1e2d 0%, #07131d 60%, #03080e 100%)',
      surfaceTheme: 'crystal',
      surfaceColor: '#38bdf8',
      surfaceSubColor: '#10354f',
      layerIndex: 3,
    };
  }

  // Layer 4: Molten Magma Mantle (T13-T15: magma, aether, void)
  if (highestIndex < 15) {
    return {
      depthMeters,
      depthFormatted,
      stageName: isEn ? 'Molten Magma Mantle' : 'แก่นหินหลอมเหลวแมกมา',
      layerTitle: isEn ? `🔥 Molten Magma Mantle · ${depthFormatted}` : `🔥 แก่นหินแมกมา · ${depthFormatted}`,
      bgGradient: 'radial-gradient(ellipse at 50% 25%, #2a0f0a 0%, #1c0805 60%, #0c0302 100%)',
      surfaceTheme: 'magma',
      surfaceColor: '#f97316',
      surfaceSubColor: '#4a180e',
      layerIndex: 4,
    };
  }

  // Layer 5: Astral Void Rift (T16-T18: astral, chronos, singularity)
  if (highestIndex < 18) {
    return {
      depthMeters,
      depthFormatted,
      stageName: isEn ? 'Astral Void Rift' : 'มิติธารดวงดาวห้วงสุญญะ',
      layerTitle: isEn ? `🔮 Astral Void Rift · ${depthFormatted}` : `🔮 มิติธารดวงดาว · ${depthFormatted}`,
      bgGradient: 'radial-gradient(ellipse at 50% 25%, #1d0c2e 0%, #11061c 60%, #07020d 100%)',
      surfaceTheme: 'void',
      surfaceColor: '#c084fc',
      surfaceSubColor: '#3a1357',
      layerIndex: 5,
    };
  }

  // Layer 6: Eternal Yggdrasil Core (T19-T20: genesis, yggdrasil)
  return {
    depthMeters,
    depthFormatted,
    stageName: isEn ? 'Eternal Yggdrasil Core' : 'แก่นพฤกษาอนันต์กาล',
    layerTitle: isEn ? `🌳 Eternal Yggdrasil Core · ${depthFormatted}` : `🌳 แก่นพฤกษาอนันต์กาล · ${depthFormatted}`,
    bgGradient: 'radial-gradient(ellipse at 50% 25%, #261e0b 0%, #181206 60%, #0a0702 100%)',
    surfaceTheme: 'yggdrasil',
    surfaceColor: '#facc15',
    surfaceSubColor: '#4d3b10',
    layerIndex: 6,
  };
}

export function stageName(stateOrTotalOwned: GameState | number, lang: Language = 'th'): string {
  if (typeof stateOrTotalOwned === 'object') {
    const highest = getHighestOwnedRootIndex(stateOrTotalOwned);
    return getSubterraneanDepthInfo(stateOrTotalOwned.totalOwned, highest, lang).stageName;
  }
  return getSubterraneanDepthInfo(stateOrTotalOwned, 0, lang).stageName;
}
