'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Check, Navigation, Star } from 'lucide-react';
import type { Prospect, ProspectStatus } from '@/types';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface ProspectCardProps {
  prospect: Prospect;
}

const statusConfig: Record<ProspectStatus, { label: string; className: string }> = {
  pending: { label: 'Pendiente', className: 'bg-yellow-100 text-yellow-800' },
  contacted: { label: 'Contactado', className: 'bg-blue-100 text-blue-800' },
  visited: { label: 'Visitado', className: 'bg-purple-100 text-purple-800' },
  client: { label: 'Cliente', className: 'bg-green-100 text-green-800' },
  not_interested: { label: 'No Interesado', className: 'bg-gray-100 text-gray-800' },
};

export function ProspectCard({ prospect }: ProspectCardProps) {
  const t = useTranslations('AdminSalesPage');

  const statusInfo = statusConfig[prospect.status] || statusConfig.pending;

  return (
    <Card className={cn("p-4 shadow-sm", prospect.priority && "border-l-4 border-secondary")}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-base pr-2">{prospect.name}</h3>
        <Badge variant="outline" className={statusInfo.className}>{statusInfo.label}</Badge>
      </div>

      <div className="space-y-1.5 text-sm text-muted-foreground mb-3">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 shrink-0" />
          <span>{prospect.address}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 shrink-0" />
          <span>{prospect.phone || t('no_phone')}</span>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mb-4">
        <Badge variant="secondary" className="capitalize">{prospect.ethnic}</Badge>
        <Badge variant="secondary" className="capitalize">{prospect.category}</Badge>
        {prospect.zone && <Badge variant="secondary" className="capitalize">{prospect.zone}</Badge>}
      </div>

      <div className="flex gap-2 pt-3 border-t">
        <Button variant="outline" size="sm" className="flex-1">
          <Phone className="mr-2" />
          {t('action_call')}
        </Button>
        <Button variant="outline" size="sm" className="flex-1">
          <Navigation className="mr-2" />
          {t('action_route')}
        </Button>
        <Button size="sm" className="flex-1">
          <Check className="mr-2" />
          {t('action_visit')}
        </Button>
      </div>
    </Card>
  );
}
