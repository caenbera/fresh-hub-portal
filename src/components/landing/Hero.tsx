'use client';

import { Button } from '@/components/ui/button';
import { CheckCircle, Truck, Handshake, Calculator, Gift } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';

export function Hero() {
  const t = useTranslations('LandingPageHero');

  return (
    <section className="relative h-[85vh] flex items-center justify-center text-white overflow-hidden">
      {/* Video de Fondo */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute z-0 w-auto min-w-full min-h-full max-w-none"
      >
        <source src="/hero-video.webm" type="video/webm" />
        <source src="/hero-video.mp4" type="video/mp4" />
        Tu navegador no soporta el video.
      </video>

      {/* Capa Oscura Superpuesta */}
      <div className="absolute inset-0 bg-black opacity-50 z-10"></div>

      {/* Contenido del Hero */}
      <div className="relative z-20 flex flex-col items-center justify-center px-4 text-center">
        <div className="mx-auto max-w-4xl">
          <h1
            className="mb-6 text-4xl font-bold sm:text-5xl lg:text-6xl"
            style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}
          >
            {t.rich('hero_title_html', {
              yellow: (chunks) => <span className="text-yellow-400">{chunks}</span>,
            })}
          </h1>

          <p
            className="mb-8 text-lg sm:text-xl lg:text-2xl"
            style={{ textShadow: '2px 2px 6px rgba(0,0,0,0.7)' }}
          >
            {t.rich('hero_subtitle_html', {
              br: () => <br />,
              lightYellow: (chunks) => <span className="text-yellow-200">{chunks}</span>,
            })}
          </p>

          <div
            className="mb-10 flex flex-wrap items-center justify-center gap-6 text-sm sm:text-base"
            style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-yellow-400" />
              <span>{t('hero_feature1')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-yellow-400" />
              <span>{t('hero_feature2')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Handshake className="h-5 w-5 text-yellow-400" />
              <span>{t('hero_feature3')}</span>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button
              asChild
              className="bg-accent px-8 py-3 text-base font-bold text-white hover:bg-orange-600 animate-pulse"
            >
              <a href="#cotizacion">
                <Calculator className="mr-2 h-5 w-5" />
                {t('hero_cta_quote')}
              </a>
            </Button>
            <Button
              asChild
              className="bg-yellow-400 px-8 py-3 text-base font-bold text-gray-900 hover:bg-yellow-300"
            >
              <a href="#muestra">
                <Gift className="mr-2 h-5 w-5" />
                {t('hero_cta_sample')}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
