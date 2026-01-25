// src/i18n/routing.ts
import { defineRouting } from 'next-intl/routing';
import { locales, defaultLocale, localePrefix } from '../i18n-config'; // 👈 Ruta correcta

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix,
});