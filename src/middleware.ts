import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale, localePrefix } from '@/i18n-config';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix,
});

export const config = {
  // Match all paths except for internal Next.js assets and static files.
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico).*)'],
};
