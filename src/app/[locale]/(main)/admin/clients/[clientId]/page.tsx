import { clients } from '@/lib/placeholder-data';
import { ClientDetailPageClient } from '@/components/admin/clients/client-detail-page-client';
import { notFound } from 'next/navigation';

export default function ClientDetailPage({ params }: { params: { clientId: string } }) {
  const client = clients.find(c => c.id === params.clientId);

  if (!client) {
    notFound();
  }

  return (
     <div className="p-4 sm:p-6 lg:p-8">
        <ClientDetailPageClient client={client} />
    </div>
  );
}
