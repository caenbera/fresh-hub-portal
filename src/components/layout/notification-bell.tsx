'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Bell, ShoppingCart, Headset } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useNotifications } from '@/context/notification-context';
import { useRouter } from '@/navigation';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { useLocale } from 'next-intl';
import * as LucideIcons from 'lucide-react';

type IconName = keyof typeof LucideIcons;

const Icon = ({ name, className }: { name: IconName; className?: string }) => {
  const LucideIcon = LucideIcons[name] as React.ElementType;
  if (!LucideIcon) {
    return <LucideIcons.Bell className={className} />;
  }
  return <LucideIcon className={className} />;
};


export function NotificationBell() {
  const t = useTranslations('Notifications');
  const { unreadCount, notifications, markAllAsRead, loading } = useNotifications();
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
    <DropdownMenu onOpenChange={(open) => {
        if (open && unreadCount > 0) {
            markAllAsRead();
        }
    }}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="overflow-visible rounded-full relative"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">
              {unreadCount}
            </span>
          )}
          <span className="sr-only">{t('sr_toggle')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="font-bold">{t('title')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {loading ? (
           <DropdownMenuItem disabled>{t('loading')}...</DropdownMenuItem>
        ) : notifications.length === 0 ? (
          <DropdownMenuItem disabled>{t('no_notifications')}</DropdownMenuItem>
        ) : (
            notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} className="flex items-start gap-3 p-2" onClick={() => handleNotificationClick(notification.data.url)}>
                <div className="mt-1">
                  <Icon name={getIconForNotification(notification.title)} className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-medium">{notification.title}</p>
                  <p className="text-xs text-muted-foreground">{notification.body}</p>
                  <p className="text-xs text-blue-500 mt-1">
                      {formatDistanceToNow(notification.createdAt.toDate(), { addSuffix: true, locale: locale === 'es' ? es : undefined })}
                  </p>
                </div>
              </DropdownMenuItem>
            ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
