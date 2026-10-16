import { Language } from '@/types/game';
import { thUI } from '@/locales/th/ui';
import { enUI } from '@/locales/en/ui';

export * from '@/locales/modules';
export * from '@/locales/cosmetics';
export * from '@/locales/achievements';

const UI_TEXTS = {
  th: thUI,
  en: enUI,
};

export type UITexts = typeof UI_TEXTS['th'];

export function t(lang: Language = 'th'): UITexts {
  return UI_TEXTS[lang] || UI_TEXTS.th;
}


