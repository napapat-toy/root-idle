export type SkinId = 'none' | 'rainbow' | 'sameorigin' | 'grayscale' | 'gradient';

export interface ModuleDef {
  id: string;
  name: string;
  desc: string;
  baseCost: number;
  costMult: number;
  rate: number;
  color: string;
}

export type AutoRootMode = 'basic' | 'smart' | 'all';

export interface PrestigeState {
  starterLevel: number;
  autoRoot: boolean;
  autoRootEnabled: boolean;
  autoRootMode?: AutoRootMode;
  autoRootSmart: boolean;
  autoRootAll: boolean;
  goldenLevel: number;
  auraRoots: boolean;
  auraRootsEnabled?: boolean;
  skinSameOrigin: boolean;
  skinGrayscale: boolean;
  skinGradient: boolean;
  activeSkin: SkinId;
  autoReset: boolean;
  autoResetEnabled: boolean;
  autoResetThreshold: number;
  offlineCapLevel: number;
  eventBonusLevel: number;
  eventDurationLevel: number;
  autoEvent: boolean;
  autoEventEnabled: boolean;
  luckyMagnitudeLevel: number;
  luckyDurationLevel: number;
  luckyChanceLevel: number;
  passiveRateLevel: number;
}

export interface GameStats {
  prestigeCount: number;
  totalEventsClaimed: number;
  luckyJackpotCount: number;
  maxOfflineTimeSeconds: number;
  superJackpotClaimed: boolean;
  totalSeedsEarnedLifetime: number;
  totalNutrientsEarnedLifetime?: number;
}

export type Language = 'th' | 'en';

export interface GameState {
  nutrients: number;
  owned: Record<string, number>;
  totalOwned: number;
  rootUpgrades: Record<string, number>; // moduleId -> level
  echoes: Record<string, number>;      // moduleId -> level
  buyQty: number;
  lockGapBackfilled: boolean;
  totalPlayTimeSeconds: number;
  runPlayTimeSeconds: number;
  runEarned: number;
  eternalSeeds: number;
  prestige: PrestigeState;
  achievements: string[];
  stats: GameStats;
  lang?: Language;
}

export interface Branch {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  depth: number;
  width: number;
  children: number;
  moduleId: string | null;
  parentIndex: number | null;
}

export interface ActiveBuff {
  multiplier: number;
  expiresAt: number;
}

export interface GameEventItem {
  id: number;
  type: 'bump' | 'buff' | 'lucky';
  left: number;
  top: number;
}

export interface FloatingTextItem {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
}

export interface SaveSlotMeta {
  code: string;
  savedAt: number;
  totalOwned: number;
  seeds: number;
  pendingSeeds?: number;
  nutrients?: number;
  highestModuleId?: string;
  prestigeCount?: number;
  achievementsCount?: number;
}

export interface SavePayload {
  v: number;
  n: number;
  o: Record<string, number>;
  t: number;
  ru?: Record<string, number>;
  e?: Record<string, number>;
  q?: number;
  re?: number;
  es?: number;
  p?: Partial<PrestigeState>;
  pt?: number;
  rpt?: number;
  rle?: Array<[number, number]>;
  ach?: string[];
  st?: Partial<GameStats>;
  lang?: Language;
}
