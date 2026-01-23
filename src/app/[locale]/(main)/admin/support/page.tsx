import { SupportPageClient } from '@/components/admin/support/support-page-client';
import { RoleGuard } from '@/components/auth/role-guard';

export default function AdminSupportPage() {
  return (
    <RoleGuard allowedRoles={['admin', 'superadmin']}>
        <SupportPageClient />
    </RoleGuard>
  );
}
