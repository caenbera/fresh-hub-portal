"use client";

import type { ReactNode } from 'react';
import { RoleGuard } from '@/components/auth/role-guard';

export default function PortalLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard allowedRoles={['client', 'admin', 'superadmin']}>
      {children}
    </RoleGuard>
  );
}
