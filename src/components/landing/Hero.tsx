'use client';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import Image from 'next/image';

export function Hero() {
  const t = useTranslations('LandingPageHero');
  const features = [t('hero_feature1'), t('hero_feature2'), t('hero_feature3')];

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image 
          src="https://picsum.photos/seed/hero/1920/1080" 
          alt="Fresh produce background"
          fill
          quality={80}
          className="object-cover"
          data-ai-hint="fresh produce background"
        />
        <div className="absolute inset-0 bg-gray-900/70"></div>
      </div>
      <div className="container mx-auto px-4 relative z-10 text-center text-white">
        <h1
          className="text-4xl lg:text-6xl font-extrabold font-headline leading-tight"
          dangerouslySetInnerHTML={{ __html: t.raw('hero_title_html') }}
        />
        <p
          className="mt-6 max-w-3xl mx-auto text-lg lg:text-xl text-gray-200"
          dangerouslySetInnerHTML={{ __html: t.raw('hero_subtitle_html') }}
        />
        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button size="lg" className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
            {t('hero_cta_quote')}
          </Button>
          <Button size="lg" variant="outline" className="bg-transparent border-yellow-300 text-yellow-300 hover:bg-yellow-300 hover:text-gray-900 w-full sm:w-auto">
            {t('hero_cta_sample')}
          </Button>
        </div>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center justify-center gap-2 text-sm">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
