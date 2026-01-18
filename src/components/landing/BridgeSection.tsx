'use client';
import { useTranslations } from 'next-intl';
import { CheckCircle, XCircle } from 'lucide-react';

export function BridgeSection() {
  const t = useTranslations('LandingPageBridgeSection');

  const befores = [
    t('bridge_before_1'),
    t('bridge_before_2'),
    t('bridge_before_3'),
    t('bridge_before_4'),
    t('bridge_before_5'),
  ];

  const afters = [
    t('bridge_after_1'),
    t('bridge_after_2'),
    t('bridge_after_3'),
    t('bridge_after_4'),
    t('bridge_after_5'),
  ];

  return (
    <section className="py-12 lg:py-24">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold font-headline">{t('bridge_title')}</h2>
        <p className="mt-4 text-lg text-gray-300">{t('bridge_subtitle')}</p>
        <div className="mt-12 grid md:grid-cols-2 gap-12">
          {/* BEFORE */}
          <div className="bg-gray-800 p-8 rounded-lg border border-red-500/50">
            <h3 className="text-2xl font-bold text-red-400">{t('bridge_before_title')}</h3>
            <ul className="mt-6 space-y-4 text-left">
              {befores.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <XCircle className="h-6 w-6 text-red-500 mt-1 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* AFTER */}
          <div className="bg-gray-800 p-8 rounded-lg border border-green-500/50">
            <h3 className="text-2xl font-bold text-primary">{t('bridge_after_title')}</h3>
            <ul className="mt-6 space-y-4 text-left">
              {afters.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-16 text-2xl font-bold font-headline bg-yellow-300 text-gray-900 inline-block px-6 py-3 rounded-lg">
            <p>{t('bridge_the_bridge_title')}</p>
            <p className="text-base font-normal mt-1">{t('bridge_the_bridge_desc')}</p>
        </div>
      </div>
    </section>
  );
}
