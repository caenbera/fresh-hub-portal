"use client";

import type { ReactNode } from 'react';
import { RoleGuard } from '@/components/auth/role-guard';

export default function SalesLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard allowedRoles={['salesperson', 'admin', 'superadmin']}>
      <div className="bg-slate-50/30 min-h-full">
        {children}
      </div>
    </RoleGuard>
  );
}
