'use client';
import { useTranslations } from 'next-intl';
import { Phone, Mail, MapPin, Building } from 'lucide-react';
import { Button } from '../ui/button';

export function ContactInfo() {
  const t = useTranslations('LandingPageContactInfo');

  const contacts = [
    { icon: Phone, title: t('contact_info_call_title'), desc: t('contact_info_call_desc'), value: '+1 (312) 555-1234' },
    { icon: Mail, title: t('contact_info_email_title'), desc: t('contact_info_email_desc'), value: 'ventas@thefreshhub.com' },
    { icon: MapPin, title: t('contact_info_location_title'), desc: t('contact_info_location_desc'), value: t('contact_info_location_hours') },
  ];

  return (
    <section className="py-12 lg:py-24 bg-gray-800">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold font-headline">{t('contact_info_title')}</h2>
        <p className="mt-4 text-lg text-gray-300">{t('contact_info_subtitle')}</p>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {contacts.map(contact => (
            <div key={contact.title} className="bg-gray-900 p-6 rounded-lg text-center">
              <contact.icon className="h-10 w-10 text-primary mx-auto" />
              <h3 className="mt-4 text-xl font-semibold">{contact.title}</h3>
              <p className="mt-2 text-gray-400">{contact.desc}</p>
              <p className="mt-4 text-yellow-300 font-bold">{contact.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 bg-gray-900 p-8 rounded-lg flex flex-col md:flex-row items-center justify-center gap-6">
            <Building className="h-12 w-12 text-primary" />
            <div>
                <h3 className="text-xl font-bold">{t('contact_info_callback_prompt')}</h3>
                <Button className="mt-4 bg-primary hover:bg-primary/90">{t('contact_info_callback_button')}</Button>
            </div>
        </div>
      </div>
    </section>
  );
}
