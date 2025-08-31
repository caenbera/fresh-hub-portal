"use client";

import { useState } from 'react';
import type { Locale } from '@/lib/i18n';
import { LanguageProvider } from '@/context/language-context';
import { LandingHeader } from '@/components/landing/landing-header';
import { Hero } from '@/components/landing/hero';
import { Features } from '@/components/landing/features';
import { Footer } from '@/components/landing/footer';

export default function LandingPage() {
  const [locale, setLocale] = useState<Locale>('en');

  return (
    <LanguageProvider value={{ locale, setLocale }}>
      <div className="flex min-h-screen flex-col">
        <LandingHeader />
        <main className="flex-1">
          <Hero />
          <Features />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}
