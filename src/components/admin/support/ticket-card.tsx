'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { SupportTicket } from '@/types';
import { useTranslations } from 'next-intl';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { useLocale } from 'next-intl';
import { Paperclip, Eye } from 'lucide-react';

interface TicketCardProps {
  ticket: SupportTicket;
  onSelect: (ticket: SupportTicket) => void;
}

export function TicketCard({ ticket, onSelect }: TicketCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: ticket.id,
    data: {
      type: 'ticket',
      ticket,
    },
  });
  const t = useTranslations('AdminSupportPage');
  const locale = useLocale();

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  
  const issueTypes: Record<string, string> = {
    bad_product: 'Damaged Product',
    missing_product: 'Missing Product',
    late_order: 'Late Order',
    invoice_problem: 'Invoice Issue'
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className="shadow-sm cursor-grab active:cursor-grabbing">
        <CardHeader className="p-3 pb-2">
            <CardDescription className="text-xs">{t('ticket_from', { clientName: ticket.userName })}</CardDescription>
            <CardTitle className="text-sm">{issueTypes[ticket.issueType] || ticket.issueType}</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
             {ticket.orderId && <Badge variant="secondary">{t('ticket_order')} #{ticket.orderId.substring(0, 6)}</Badge>}
             <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                <span>{formatDistanceToNow(ticket.createdAt.toDate(), { addSuffix: true, locale: locale === 'es' ? es : undefined })}</span>
                {ticket.photoUrl && <Paperclip className="h-4 w-4" />}
             </div>
        </CardContent>
        <CardFooter className="p-3 border-t">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => onSelect(ticket)}
              onMouseDown={(e) => e.stopPropagation()}
            >
                <Eye className="mr-2 h-4 w-4" />
                {t('view_details')}
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
