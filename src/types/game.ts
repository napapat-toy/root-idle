export type SkinId =
  | 'none'
  | 'rainbow'
  | 'sakura'
  | 'cafe'
  | 'autumn'
  | 'ocean'
  | 'frost'
  | 'sunset'
  | 'sameorigin'
  | 'mystic'
  | 'cyberpunk'
  | 'grayscale'
  | 'gradient'
  | 'nebula'
  | 'imperial'
  | 'drought'
  | 'obsidian';

export type UIThemeId =
  | 'classic'
  | 'sakura'
  | 'cafe'
  | 'autumn'
  | 'ocean'
  | 'frost'
  | 'sunset'
  | 'mystic'
  | 'cyberpunk'
  | 'grayscale'
  | 'emerald'
  | 'nebula'
  | 'imperial'
  | 'void_sovereign';

export interface ModuleDef {
  id: string;
  name: string;
  desc: string;
  baseCost: number;
  costMult: number;
  rate: number;
  color: string;
  icon?: string;
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
  skinSakura?: boolean;
  skinCafe?: boolean;
  skinAutumn?: boolean;
  skinOcean?: boolean;
  skinFrost?: boolean;
  skinSunset?: boolean;
  skinSameOrigin: boolean;
  skinMystic?: boolean;
  skinCyberpunk?: boolean;
  skinGrayscale: boolean;
  skinGradient: boolean;
  skinNebula?: boolean;
  skinImperial?: boolean;
  activeSkin: SkinId;
  themeSakura?: boolean;
  themeCafe?: boolean;
  themeAutumn?: boolean;
  themeOcean?: boolean;
  themeFrost?: boolean;
  themeSunset?: boolean;
  themeMystic?: boolean;
  themeCyberpunk?: boolean;
  themeGrayscale?: boolean;
  themeEmerald?: boolean;
  themeNebula?: boolean;
  themeImperial?: boolean;
  activeUITheme: UIThemeId;
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

export type BiomeId =
  | 'topsoil'
  | 'myco_abyss'
  | 'crystal_caverns'
  | 'magma_mantle'
  | 'sunken_ruins'
  | 'gaia_sanctum';

export interface BiomeDef {
  id: BiomeId;
  name: string;
  desc: string;
  icon: string;
  bgGradient: string;
  particleType: 'spores' | 'crystals' | 'embers' | 'runes' | 'stardust' | 'leaves';
  particleColor: string;
  ambientBonusDesc: string;
  relicRequiredCount: number;
}

export type RelicRarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';

export interface RelicDef {
  id: string;
  name: string;
  enName: string;
  icon: string;
  desc: string;
  enDesc: string;
  rarity: RelicRarity;
  dropWeight: number;
  effectDesc: string;
  enEffectDesc: string;
  baseCost: number;
  color: string;
  maxPieces: number;
}

export type TrialId = 'none' | 'arid_drought' | 'basalt_strata' | 'void_anomaly';

export interface TrialDef {
  id: TrialId;
  name: string;
  enName: string;
  desc: string;
  enDesc: string;
  icon: string;
  restrictionDesc: string;
  enRestrictionDesc: string;
  rewardDesc: string;
  enRewardDesc: string;
  targetYggdrasil: number;
  skinReward?: SkinId;
  themeReward?: UIThemeId;
}

export interface TranscendenceState {
  count: number;
  gaiaEssences: number;
  totalGaiaEssencesLifetime: number;
  primordialVigorLevel: number; // +25% base rate per level
  soilMemoryLevel: number;      // retain 10% echoes per level (max 5 = 50%)
  autoManagerUnlocked: boolean; // Auto-upgrades Prestige perks
  gaiaTouchLevel: number;       // +10% lucky/event magnitude & frequency
  activeTrial: TrialId;
  completedTrials: Record<string, boolean>;
  everUnlocked?: boolean;
  echoResonanceLevel?: number;       // +1 max Echo cap per level (e.g. 5 -> 10)
  gaiaClairvoyanceLevel?: number;    // +0.1% lucky chance cap per level (up to 2.0% total)
  primordialSeedlingLevel?: number;  // Base rate of Fine Roots: 0.60 -> 2.00 (5 levels)
  deepMeditationLevel?: number;      // Up to +50% global rate per level over 60m playtime (max +250%)
}

export type Language = 'th' | 'en';

export interface GameState {
  nutrients: number;
  owned: Record<string, number>;
  totalOwned: number;
  rootUpgrades: Record<string, number>; // moduleId -> level
  echoes: Record<string, number>;      // moduleId -> level
  rootSynergies: Record<string, boolean>; // moduleId -> owned
  relics: Record<string, number | boolean>;     // relicId -> count or owned
  unclaimedRelicId: string | null;     // spawned relic waiting to be collected on screen
  activeBiome: BiomeId;
  buyQty: number;
  lockGapBackfilled: boolean;
  totalPlayTimeSeconds: number;
  runPlayTimeSeconds: number;
  runEarned: number;
  eternalSeeds: number;
  prestige: PrestigeState;
  transcendence: TranscendenceState;
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
  transcendenceCount?: number;
  gaiaEssences?: number;
  activeTrial?: TrialId;
  relicsCount?: number;
  achievementsCount?: number;
  totalPlayTimeSeconds?: number;
  lifetimeNutrients?: number;
  lifetimeSeeds?: number;
}

export interface SavePayload {
  v: number;
  n: number;
  o: Record<string, number>;
  t: number;
  ru?: Record<string, number>;
  e?: Record<string, number>;
  syn?: Record<string, boolean>;
  q?: number;
  re?: number;
  es?: number;
  p?: Partial<PrestigeState>;
  ts?: Partial<TranscendenceState>;
  rel?: Record<string, number | boolean>;
  bm?: BiomeId;
  pt?: number;
  rpt?: number;
  rle?: Array<[number, number]>;
  ach?: string[];
  st?: Partial<GameStats>;
  lang?: Language;
}
