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
      >
        <source src="/hero-video.webm" type="video/webm" />
        Tu navegador no soporta el formato de video.
      </video>
      {/* Contenido original eliminado temporalmente para depuración */}
    </section>
  );
}
