// src/components/admin/support/SortableTicketItem.tsx
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SupportTicket } from '@/types';
import { GripVertical, Paperclip } from 'lucide-react';
import { STATUS_CONFIG } from './ticket-board';
import { useTranslations } from 'next-intl';

interface SortableTicketItemProps {
  ticket: SupportTicket;
  onClick: () => void;
}

export function SortableTicketItem({ ticket, onClick }: SortableTicketItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: ticket.id,
    data: { status: ticket.status },
  });

  const t = useTranslations('SupportPage');

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  
  const issueTypeMap: Record<string, string> = {
    bad_product: t('issue_option_bad_product'),
    missing_product: t('issue_option_missing_product'),
    late_order: t('issue_option_late_order'),
    invoice_problem: t('issue_option_invoice_problem'),
  };

  const translatedIssueType = issueTypeMap[ticket.issueType] || ticket.issueType;


  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="mb-3 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
      onClick={onClick}
      {...attributes}
      {...listeners}
    >
      <CardHeader className="pb-2" onMouseDown={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start">
          <CardTitle className="text-sm font-medium line-clamp-1">{translatedIssueType}</CardTitle>
          <div className="flex items-center gap-2">
            {ticket.photoUrl && <Paperclip className="h-4 w-4 text-muted-foreground" />}
            <Badge className={`border ${STATUS_CONFIG[ticket.status].color}`}>
              {STATUS_CONFIG[ticket.status].icon}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0" onMouseDown={(e) => e.stopPropagation()}>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {ticket.details || 'Sin detalles'}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {ticket.userName}
        </p>
      </CardContent>
    </Card>
  );
}
