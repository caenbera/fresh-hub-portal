"use client";

import { useTranslations } from 'next-intl';
import { TicketBoard } from './ticket-board';

export function SupportPageClient() {
  const t = useTranslations('AdminSupportPage');

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-bold font-headline">{t('title')}</h1>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </div>
      <TicketBoard />
    </div>
  );
}
