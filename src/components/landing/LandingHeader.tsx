'use client';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { Sprout, Phone } from 'lucide-react';
import { LanguageSwitcher } from './language-switcher';

export function LandingPageHeader() {
  const t = useTranslations('LandingPageHeader');

  return (
    <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-white">
          <Sprout className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold font-headline">Fresh Hub</span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <div className="text-center">
            <p className="font-semibold">{t('header_speaks_spanish')}</p>
            <p className="text-sm text-gray-300">{t('header_subtitle')}</p>
          </div>
          <a href="tel:+15551234567" className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
            <Phone size={16} />
            <span>{t('header_call_now')}</span>
          </a>
        </div>
        <div className="flex items-center gap-2">
           <LanguageSwitcher />
          <Link href="/login" className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors hidden sm:block">
            {t('nav_login')}
          </Link>
           <Link href="/signup" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors hidden sm:block">
            {t('nav_signup')}
          </Link>
        </div>
      </div>
    </header>
  );
}
