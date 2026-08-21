import { GameState } from './game';

export type AchievementCategory = 'roots' | 'economy' | 'prestige' | 'luck' | 'skins' | 'time';

export interface AchievementDef {
  id: string;
  category: AchievementCategory;
  title: string;
  desc: string;
  icon: string;
  check: (state: GameState, totalRate: number) => boolean;
}

export interface AchievementCategoryInfo {
  id: AchievementCategory;
  name: string;
  icon: string;
}
