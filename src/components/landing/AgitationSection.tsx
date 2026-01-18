'use client';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Frown, Clock } from 'lucide-react';

export function AgitationSection() {
  const t = useTranslations('LandingPageAgitationSection');
  return (
    <section className="py-12 lg:py-24 bg-gray-800">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold font-headline text-yellow-300">{t('agitation_title')}</h2>
        <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">{t('agitation_subtitle')}</p>
        <div className="grid md:grid-cols-3 gap-8 mt-12 text-left">
          <Card className="bg-gray-900 border-yellow-300/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <DollarSign className="text-red-400" />
                {t('agitation_point1_title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">{t('agitation_point1_desc')}</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-yellow-300/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Frown className="text-red-400" />
                {t('agitation_point2_title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">{t('agitation_point2_desc')}</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-yellow-300/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Clock className="text-red-400" />
                {t('agitation_point3_title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">{t('agitation_point3_desc')}</p>
            </CardContent>
          </Card>
        </div>
        <div className="mt-12 max-w-2xl mx-auto bg-red-900/50 border border-red-400 rounded-lg p-6">
            <h3 className="font-bold text-xl text-white">{t('agitation_box_title')}</h3>
            <p className="text-red-200 mt-2">{t('agitation_box_desc')}</p>
        </div>
      </div>
    </section>
  );
}
