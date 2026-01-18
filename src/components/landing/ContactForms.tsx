'use client';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';

export function ContactForms() {
  const t = useTranslations('LandingPageContactForms');
  const { toast } = useToast();
  const { register: registerQuote, handleSubmit: handleSubmitQuote } = useForm();
  const { register: registerSample, handleSubmit: handleSubmitSample } = useForm();

  const onQuoteSubmit = (data: any) => {
    console.log('Quote Request:', data);
    toast({ title: t('form_submit_alert') });
  };

  const onSampleSubmit = (data: any) => {
    console.log('Sample Request:', data);
    toast({ title: t('form_submit_alert') });
  };

  return (
    <section id="contact" className="py-12 lg:py-24 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl lg:text-4xl font-bold font-headline text-yellow-300">{t('contact_forms_title')}</h2>
          <p className="mt-4 text-lg text-gray-300">{t('contact_forms_subtitle')}</p>
        </div>
        <div className="mt-12 grid lg:grid-cols-2 gap-12 items-start">
          {/* Quote Form */}
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle className="text-2xl text-yellow-300">{t('quote_form_title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitQuote(onQuoteSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="q-name">{t('form_name_label')}</Label>
                  <Input id="q-name" {...registerQuote('name')} placeholder={t('form_name_placeholder_es')} className="bg-gray-900 border-gray-600" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="q-business">{t('form_business_name_label')}</Label>
                  <Input id="q-business" {...registerQuote('business')} placeholder={t('form_business_name_placeholder')} className="bg-gray-900 border-gray-600" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="q-phone">{t('form_phone_label')}</Label>
                  <Input id="q-phone" {...registerQuote('phone')} placeholder={t('form_phone_placeholder')} className="bg-gray-900 border-gray-600" />
                </div>
                <div className="space-y-3">
                  <Label>{t('form_products_interest_label')}</Label>
                  <RadioGroup defaultValue="all" className="space-y-2">
                    {[
                      { value: 'veg', label: t('form_product_option_1') },
                      { value: 'spice', label: t('form_product_option_2') },
                      { value: 'fruit', label: t('form_product_option_3') },
                      { value: 'all', label: t('form_product_option_4') }
                    ].map(opt => (
                       <div key={opt.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={opt.value} id={`q-${opt.value}`} />
                          <Label htmlFor={`q-${opt.value}`}>{opt.label}</Label>
                        </div>
                    ))}
                  </RadioGroup>
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">{t('quote_form_button')}</Button>
              </form>
            </CardContent>
          </Card>

          {/* Sample Form */}
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle className="text-2xl text-yellow-300">{t('sample_form_title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitSample(onSampleSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="s-business">{t('form_business_name_label')}</Label>
                  <Input id="s-business" {...registerSample('business')} placeholder={t('form_business_name_placeholder_sample')} className="bg-gray-900 border-gray-600" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="s-phone">{t('form_phone_label')}</Label>
                  <Input id="s-phone" {...registerSample('phone')} placeholder={t('form_phone_placeholder')} className="bg-gray-900 border-gray-600" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="s-address">{t('form_address_label')}</Label>
                  <Input id="s-address" {...registerSample('address')} placeholder={t('form_address_placeholder')} className="bg-gray-900 border-gray-600" />
                </div>
                <Button type="submit" className="w-full bg-yellow-500 text-gray-900 hover:bg-yellow-400">{t('sample_form_button')}</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
