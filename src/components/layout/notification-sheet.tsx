'use client';

import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Bell, ShoppingCart, Headset } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useNotifications } from '@/context/notification-context';
import { useRouter } from '@/navigation';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { useLocale } from 'next-intl';
import * as LucideIcons from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

type IconName = keyof typeof LucideIcons;

const Icon = ({ name, className }: { name: IconName; className?: string }) => {
  const LucideIcon = LucideIcons[name] as React.ElementType;
  if (!LucideIcon) {
    return <LucideIcons.Bell className={className} />;
  }
  return <LucideIcon className={className} />;
};

export function NotificationSheetContent() {
  const t = useTranslations('Notifications');
  const { notifications, loading } = useNotifications();
  const router = useRouter();
  const locale = useLocale();

  const getIconForNotification = (title: string): IconName => {
    const lowerCaseTitle = title.toLowerCase();
    if (lowerCaseTitle.includes('pedido') || lowerCaseTitle.includes('order')) {
      return 'ShoppingCart';
    }
    if (lowerCaseTitle.includes('ticket') || lowerCaseTitle.includes('support')) {
      return 'Headset';
    }
    return 'Bell';
  };

  const handleNotificationClick = (url: string) => {
    router.push(url);
  };
  
  return (
    <>
      <SheetHeader className="p-4 border-b">
        <SheetTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          {t('title')}
        </SheetTitle>
        <SheetDescription className="hidden">
          {t('title')}
        </SheetDescription>
      </SheetHeader>
      <div className="flex-grow overflow-y-auto">
        {loading ? (
            <div className="p-4 space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
            </div>
        ) : notifications.length === 0 ? (
            <p className="text-center text-muted-foreground p-8">{t('no_notifications')}</p>
        ) : (
            notifications.map((notification) => (
            <div key={notification.id} className="flex items-start gap-4 p-4 border-b cursor-pointer hover:bg-muted" onClick={() => handleNotificationClick(notification.data.url)}>
                <div className="mt-1">
                    <Icon name={getIconForNotification(notification.title)} className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-grow">
                <p className="text-sm font-semibold">{notification.title}</p>
                <p className="text-sm text-muted-foreground">{notification.body}</p>
                <p className="text-xs text-blue-500 mt-1">
                    {formatDistanceToNow(notification.createdAt.toDate(), { addSuffix: true, locale: locale === 'es' ? es : undefined })}
                </p>
                </div>
            </div>
            ))
        )}
      </div>
    </>
  );
}
