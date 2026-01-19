import { SupportPageClient } from '@/components/portal/support/support-page-client';
import { RoleGuard } from '@/components/auth/role-guard';

export default function SupportPage() {
  return (
    <RoleGuard allowedRoles={['client', 'admin', 'superadmin']}>
        <SupportPageClient />
    </RoleGuard>
  );
}
