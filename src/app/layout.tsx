import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { locales } from '@/i18n-config';
import { notFound } from 'next/navigation';
import { RegisterServiceWorker } from '@/components/RegisterServiceWorker';

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Fresh Hub Portal',
    description: 'Wholesale fresh produce for Chicago\'s latin businesses.',
    icons: {
      icon: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
    manifest: '/manifest.json',
    themeColor: '#27ae60',
  };
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  // Providing all messages to the client
  // side components
  // This makes the messages immediately available
  // without additional requests
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#27ae60" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
          <RegisterServiceWorker />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
