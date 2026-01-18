import { Pathnames } from 'next-intl/navigation';

export const locales = ['en', 'es'] as const;
export const defaultLocale = 'es';
export const localePrefix = 'always';

export const pathnames = {
  '/': '/',
  '/login': '/login',
  '/signup': '/signup',
  '/admin/dashboard': '/admin/dashboard',
  '/admin/orders': '/admin/orders',
  '/admin/products': '/admin/products',
  '/admin/users': '/admin/users',
  '/client/dashboard': '/client/dashboard',
  '/client/history': '/client/history',
  '/client/new-order': '/client/new-order',
} satisfies Pathnames<typeof locales>;
