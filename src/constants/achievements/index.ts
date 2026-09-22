import { AchievementDef } from '@/types/achievements';
import { ROOTS_ACHIEVEMENTS } from './roots';
import { ECONOMY_ACHIEVEMENTS } from './economy';
import { PRESTIGE_ACHIEVEMENTS } from './prestige';
import { LUCK_ACHIEVEMENTS } from './luck';
import { SKINS_ACHIEVEMENTS } from './skins';
import { TIME_ACHIEVEMENTS } from './time';
import { RELICS_ACHIEVEMENTS } from './relics';
import { GAIA_ACHIEVEMENTS } from './gaia';

export * from './categories';
export * from './roots';
export * from './economy';
export * from './prestige';
export * from './luck';
export * from './skins';
export * from './time';
export * from './relics';
export * from './gaia';

export const ACHIEVEMENTS: AchievementDef[] = [
  ...ROOTS_ACHIEVEMENTS,
  ...ECONOMY_ACHIEVEMENTS,
  ...PRESTIGE_ACHIEVEMENTS,
  ...LUCK_ACHIEVEMENTS,
  ...SKINS_ACHIEVEMENTS,
  ...TIME_ACHIEVEMENTS,
  ...RELICS_ACHIEVEMENTS,
  ...GAIA_ACHIEVEMENTS,
];

export const ACHIEVEMENT_BONUS_MAP: Record<string, number> = Object.fromEntries(
  ACHIEVEMENTS.map(a => [a.id, a.bonusPct])
);

export const TOTAL_ACHIEVEMENTS = ACHIEVEMENTS.length;
