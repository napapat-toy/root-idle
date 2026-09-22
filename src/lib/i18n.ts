import { Language } from '@/types/game';
import { thUI } from '@/locales/th/ui';
import { enUI } from '@/locales/en/ui';

export * from '@/locales/modules';
export * from '@/locales/stages';
export * from '@/locales/cosmetics';
export * from '@/locales/achievements';

export const UI_TEXTS = {
  th: thUI,
  en: enUI,
};

export type UITexts = typeof UI_TEXTS['th'];

export function t(lang: Language = 'th'): UITexts {
  return UI_TEXTS[lang] || UI_TEXTS.th;
}

/**
 * Safely resolves entity localized name with guaranteed fallback to prevent undefined
 */
export function getEntityName(entity: { name: string; enName?: string } | undefined | null, lang: Language): string {
  if (!entity) return '';
  return (lang === 'en' && entity.enName) ? entity.enName : entity.name;
}

/**
 * Safely resolves entity localized description with guaranteed fallback to prevent undefined
 */
export function getEntityDesc(entity: { desc: string; enDesc?: string } | undefined | null, lang: Language): string {
  if (!entity) return '';
  return (lang === 'en' && entity.enDesc) ? entity.enDesc : entity.desc;
}
