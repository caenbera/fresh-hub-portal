'use client';
import { Button } from '@/components/ui/button';
import { Gift, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function SpecialOffer() {
  const t = useTranslations('LandingPageSpecialOffer');
  const items = [
    t('offer_item_1'),
    t('offer_item_2'),
    t('offer_item_3'),
    t('offer_item_4'),
  ];

  return (
    <section id="muestra" className="py-16 bg-accent text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 flex items-center justify-center gap-3"><Gift size={32} /> {t('offer_title')}</h2>
            <div className="bg-white bg-opacity-20 p-6 md:p-8 rounded-xl mb-8">
                <h3 className="text-xl sm:text-2xl font-bold mb-4">{t('offer_subtitle')}</h3>
                <p className="text-base sm:text-lg mb-6">{t('offer_desc')}</p>
                <ul className="text-base space-y-2 mb-6 text-left inline-block">
                    {items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2"><Check /> {item}</li>
                    ))}
                </ul>
                <p className="text-lg sm:text-xl font-bold mb-4">{t('offer_value')}</p>
            </div>
            <Button asChild className="w-full md:w-auto bg-white text-orange-600 px-8 py-2.5 text-base font-bold hover:bg-gray-100 transition animate-pulse h-auto">
              <a href="#formulario-muestra">
                  <Gift className="mr-2" />{t('offer_cta')}
              </a>
            </Button>
        </div>
    </section>
  );
}
