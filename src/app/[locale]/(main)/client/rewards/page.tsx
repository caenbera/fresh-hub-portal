import { RewardsPageClient } from '@/components/portal/rewards/rewards-page-client';
import { RoleGuard } from '@/components/auth/role-guard';

export default function RewardsPage() {
  return (
    <RoleGuard allowedRoles={['client', 'admin', 'superadmin']}>
      <RewardsPageClient />
    </RoleGuard>
  );
}
