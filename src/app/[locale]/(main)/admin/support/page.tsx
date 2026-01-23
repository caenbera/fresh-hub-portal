// src/app/[locale]/(main)/admin/support/page.tsx
import { RoleGuard } from '@/components/auth/role-guard';
import { SupportPageClient } from '@/components/admin/support/support-page-client';
import { SupportTicketForm } from '@/components/admin/support/SupportTicketForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminSupportPage() {
  return (
    <RoleGuard allowedRoles={['admin', 'superadmin']}>
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Nuevo ticket de soporte</CardTitle>
          </CardHeader>
          <CardContent>
            <SupportTicketForm />
          </CardContent>
        </Card>

        <SupportPageClient />
      </div>
    </RoleGuard>
  );
}