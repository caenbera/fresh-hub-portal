'use client';
import { useTranslations } from 'next-intl';
import { Sprout } from 'lucide-react';
import { Link } from '@/navigation';

export function Footer() {
  const t = useTranslations('LandingPageFooter');
  return (
    <footer className="py-8 bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-4 text-center text-gray-400">
        <div className="flex justify-center items-center gap-2 text-white">
            <Sprout className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold font-headline">Fresh Hub</span>
        </div>
        <p className="mt-2 text-sm">{t('footer_subtitle')}</p>
        <div className="mt-4 flex justify-center gap-4">
            <Link href="/login" className="hover:text-white transition-colors">{t('nav_login')}</Link>
            <span>|</span>
            <Link href="/signup" className="hover:text-white transition-colors">{t('nav_signup')}</Link>
        </div>
        <p className="mt-6 text-xs text-gray-500">{t('footer_copyright')}</p>
        <p className="text-xs text-gray-500">{t('footer_community')}</p>
      </div>
    </footer>
  );
}
