'use client';

import { Button } from '@/components/ui/button';
import { CheckCircle, Truck, Handshake, Calculator, Gift } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';

export function Hero() {
  const t = useTranslations('LandingPageHero');

  return (
    <section className="relative h-[85vh] flex items-center justify-center text-white overflow-hidden bg-black">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute z-0 w-full h-full object-cover"
        src="https://s.groovevideo.com/public/28038/Rm4aeOlJdLqGtkhpYdea/download/download.mp4"
      >
        Tu navegador no soporta el formato de video.
      </video>

      {/* Superposición oscura para legibilidad */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>

      {/* Contenido */}
      <div className="relative z-20 mx-auto max-w-7xl px-4 text-center">
        <h1 className="mb-6 text-3xl font-bold sm:text-5xl" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
          {t.rich('hero_title_html', {
            yellow: (chunks) => <span className="text-yellow-300">{chunks}</span>
          })}
        </h1>
        
        <p className="mb-8 text-base sm:text-xl" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
          {t.rich('hero_subtitle_html', {
            br: () => <br className="hidden md:block" />,
            lightYellow: (chunks) => <span className="text-yellow-200">{chunks}</span>
          })}
        </p>
        
        <div className="mb-12 flex flex-col items-center justify-center space-y-4 md:flex-row md:space-x-6 md:space-y-0" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.6)' }}>
          <div className="flex items-center space-x-2">
            <CheckCircle className="text-yellow-300" />
            <span>{t('hero_feature1')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Truck className="text-yellow-300" />
            <span>{t('hero_feature2')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Handshake className="text-yellow-300" />
            <span>{t('hero_feature3')}</span>
          </div>
        </div>
        
        <div className="flex flex-col justify-center space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <Button asChild className="h-auto w-full bg-accent px-6 py-2.5 text-sm font-bold text-white transition hover:bg-orange-600 animate-pulse md:w-auto md:px-8 md:py-3 md:text-base">
            <a href="#cotizacion">
              <Calculator className="mr-2" />
              {t('hero_cta_quote')}
            </a>
          </Button>
          <Button asChild className="h-auto w-full bg-yellow-400 px-6 py-2.5 text-sm font-bold text-gray-900 transition hover:bg-yellow-300 md:w-auto md:px-8 md:py-3 md:text-base">
            <a href="#muestra">
              <Gift className="mr-2" />
              {t('hero_cta_sample')}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
