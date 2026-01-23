// src/components/admin/support/support-page-client.tsx
"use client";

import { useSupportTickets } from '@/hooks/use-support-tickets';
import { TicketBoard } from '@/components/admin/support/ticket-board';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export function SupportPageClient() {
  const { tickets, loading, error } = useSupportTickets();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle>Error al cargar tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  return <TicketBoard tickets={tickets} />;
}
