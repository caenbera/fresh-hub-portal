// src/app/[locale]/layout.tsx
'use client';

import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import '../globals.css';
import { AuthProvider } from '@/context/auth-context';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { NotificationProvider } from '@/context/notification-context';
import { routing } from '@/i18n/routing';
import { useEffect } from 'react';

// 👇 Badge Handler Component - Maneja el badge de notificaciones
function BadgeHandler({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Limpiar badge cuando la app se abre
    if ('clearAppBadge' in navigator && typeof navigator.clearAppBadge === 'function') {
      navigator.clearAppBadge().catch(console.error);
    }

    // Registrar Service Worker si no está registrado
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        console.log('Service Worker registrado para badge:', registration);
      }).catch(console.error);
    }

    // Escuchar cuando la app vuelve a estar activa
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        if ('clearAppBadge' in navigator && typeof navigator.clearAppBadge === 'function') {
          navigator.clearAppBadge().catch(console.error);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return <>{children}</>;
}

// 👇 AGREGA ESTA FUNCIÓN
export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();
  const iconUrl = "https://i.postimg.cc/sxBVGnMp/icon.png?v=2  ";

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <title>Fresh Hub Portal</title>
        <meta
          name="description"
          content="Wholesale fresh produce for Chicago's latin businesses."
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href={iconUrl} type="image/png" />
        <link rel="apple-touch-icon" href={iconUrl}></link>
        <meta name="theme-color" content="#27ae60" />
        <link rel="preconnect" href="https://fonts.googleapis.com  " />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com  "
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter  :wght@300;400;600;700&family=Poppins:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>
            <NotificationProvider>
              <BadgeHandler>
                <FirebaseErrorListener />
                {children}
                <Toaster />
              </BadgeHandler>
            </NotificationProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}