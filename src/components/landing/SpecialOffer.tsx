'use client';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Gift, Check } from 'lucide-react';

export function SpecialOffer() {
  const t = useTranslations('LandingPageSpecialOffer');

  const items = [
    t('offer_item_1'),
    t('offer_item_2'),
    t('offer_item_3'),
    t('offer_item_4'),
  ];

  return (
    <section className="py-12 lg:py-24 bg-primary/10">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold font-headline flex items-center gap-3">
              <Gift className="text-yellow-300 h-10 w-10" />
              {t('offer_title')}
            </h2>
            <p className="mt-2 text-2xl text-yellow-300 font-semibold">{t('offer_subtitle')}</p>
            <p className="mt-4 text-gray-300">{t('offer_desc')}</p>
            <ul className="mt-6 space-y-3">
              {items.map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xl font-bold">
                <span className="line-through text-gray-500">{t('offer_value')}</span>
            </p>
            <Button size="lg" className="mt-8 bg-yellow-500 text-gray-900 hover:bg-yellow-400 text-lg font-bold w-full sm:w-auto">
              {t('offer_cta')}
            </Button>
          </div>
          <div className="flex justify-center items-center">
            <Image 
              src="https://picsum.photos/seed/box/600/600" 
              alt="Sample box of fresh produce"
              width={600}
              height={600}
              className="rounded-lg shadow-2xl shadow-primary/20"
              data-ai-hint="produce box"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
