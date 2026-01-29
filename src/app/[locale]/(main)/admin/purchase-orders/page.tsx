import { PurchaseOrdersPageClient } from '@/components/admin/purchase-orders/purchase-orders-page-client';
import { RoleGuard } from '@/components/auth/role-guard';

export default function PurchaseOrdersPage() {
  return (
    <RoleGuard allowedRoles={['admin', 'superadmin', 'purchaser']}>
      <PurchaseOrdersPageClient />
    </RoleGuard>
  );
}
