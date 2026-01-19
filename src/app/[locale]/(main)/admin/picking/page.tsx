import { PickingPageClient } from '@/components/admin/picking/picking-page-client';
import { RoleGuard } from '@/components/auth/role-guard';

export default function PickingPage() {
  return (
    <RoleGuard allowedRoles={['picker', 'superadmin']}>
      <div className="bg-slate-50 dark:bg-slate-900 md:py-8">
        <div className="max-w-md mx-auto bg-background md:rounded-2xl md:shadow-lg overflow-hidden">
          <PickingPageClient />
        </div>
      </div>
    </RoleGuard>
  );
}
