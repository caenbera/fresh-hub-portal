import en from '@/locales/en.json';
import es from '@/locales/es.json';

export const translations = {
  en,
  es,
};

export type Locale = keyof typeof translations;

export function useTranslation(locale: Locale) {
  return function t(key: keyof (typeof translations)[typeof locale]) {
    return translations[locale][key] || key;
  };
}
