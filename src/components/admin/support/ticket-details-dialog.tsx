'use client';

import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { updateSupportTicket } from '@/lib/firestore/tickets';
import type { SupportTicket } from '@/types';

type TicketStatus = 'new' | 'in_progress' | 'resolved';

interface TicketDetailsDialogProps {
  ticket: SupportTicket | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TicketDetailsDialog({ ticket, open, onOpenChange }: TicketDetailsDialogProps) {
  const t = useTranslations('AdminSupportPage');
  const locale = useLocale();
  const { toast } = useToast();

  const handleStatusChange = (newStatus: TicketStatus) => {
    if (!ticket) return;
    updateSupportTicket(ticket.id, { status: newStatus })
      .then(() => toast({ title: t('toast_status_updated') }))
      .catch(() => toast({ variant: 'destructive', title: t('toast_update_error') }));
  };

  const statusMap: Record<TicketStatus, string> = {
    new: t('status_new'),
    in_progress: t('status_in_progress'),
    resolved: t('status_resolved'),
  };
  
  if (!ticket) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t('dialog_title')}</DialogTitle>
          <DialogDescription>ID: {ticket.id}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 py-4">
          <div><h4 className="font-semibold text-sm">{t('dialog_client')}</h4><p className="text-muted-foreground">{ticket.userName}</p></div>
          <div><h4 className="font-semibold text-sm">{t('dialog_issue_type')}</h4><p className="text-muted-foreground">{ticket.issueType}</p></div>
          {ticket.orderId && <div><h4 className="font-semibold text-sm">{t('dialog_order_id')}</h4><p className="text-muted-foreground">#{ticket.orderId}</p></div>}
          <div><h4 className="font-semibold text-sm">{t('dialog_submitted')}</h4><p className="text-muted-foreground">{format(ticket.createdAt.toDate(), 'PPP, p', { locale: locale === 'es' ? es : undefined })}</p></div>
          <div className="md:col-span-2"><h4 className="font-semibold text-sm">{t('dialog_details')}</h4><div className="bg-muted p-3 rounded-md text-sm text-muted-foreground mt-1">{ticket.details}</div></div>
          {ticket.photoUrl && (
             <div className="md:col-span-2">
                <h4 className="font-semibold text-sm mb-1">{t('dialog_photo_evidence')}</h4>
                <a href={ticket.photoUrl} target="_blank" rel="noopener noreferrer">
                  <Image src={ticket.photoUrl} alt="Evidence" width={500} height={300} className="rounded-md object-cover border" />
                </a>
             </div>
          )}
        </div>
        <DialogFooter>
          <div className="flex w-full justify-between items-center">
            <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{t('dialog_status')}:</span>
                <Select defaultValue={ticket.status} onValueChange={(value: TicketStatus) => handleStatusChange(value)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="new">{t('status_new')}</SelectItem>
                        <SelectItem value="in_progress">{t('status_in_progress')}</SelectItem>
                        <SelectItem value="resolved">{t('status_resolved')}</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Button onClick={() => onOpenChange(false)}>{t('dialog_close')}</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
