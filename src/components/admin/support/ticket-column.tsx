'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useTranslations } from 'next-intl';
import type { SupportTicket } from '@/types';

type TicketStatus = 'new' | 'in_progress' | 'resolved';

interface TicketColumnProps {
  id: TicketStatus;
  tickets: SupportTicket[];
  children: React.ReactNode;
}

export function TicketColumn({ id, tickets, children }: TicketColumnProps) {
  const { setNodeRef, transform, transition } = useSortable({ id, data: { type: 'column' } });
  const t = useTranslations('AdminSupportPage');
  
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  
  const columnTitles: Record<TicketStatus, string> = {
    new: t('new_column'),
    in_progress: t('in_progress_column'),
    resolved: t('resolved_column'),
  };
  
  const columnColors: Record<TicketStatus, string> = {
    new: 'border-blue-500',
    in_progress: 'border-orange-500',
    resolved: 'border-green-500',
  };

  return (
    <div ref={setNodeRef} style={style} className="flex flex-col bg-muted/50 rounded-xl">
        <h2 className={`p-4 font-bold text-sm uppercase tracking-wider border-b-4 ${columnColors[id]}`}>{columnTitles[id]} ({tickets.length})</h2>
        <SortableContext items={tickets.map(t => t.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-3 p-3 min-h-[10rem]">
                {children}
                 {tickets.length === 0 && <p className="text-sm text-center text-muted-foreground py-10">{t('empty_column')}</p>}
            </div>
        </SortableContext>
    </div>
  );
}
