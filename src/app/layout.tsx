import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/src/i18n/routing';
import { locales } from '@/src/i18n-config';
import { ThemeProvider } from '@/src/components/ThemeProvider';
import { Toaster } from '@/src/components/ui/sonner';
import { cn } from '@/src/lib/utils';
import { headers } from 'next/headers';
import { Inter as FontSans } from 'next/font/google';
import { RegisterServiceWorker } from '@/src/components/RegisterServiceWorker';

import '@/src/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });
const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

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
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
            <RegisterServiceWorker />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
