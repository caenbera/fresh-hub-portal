"use client";

import type { ReactNode } from 'react';
import { RoleGuard } from '@/components/auth/role-guard';
import { CartProvider } from '@/context/cart-context';

export default function ClientLayout({ children }: { children: ReactNode }) {
  // Allow clients and any admin role to view the client portal
  return (
    <RoleGuard allowedRoles={['client', 'admin', 'superadmin']}>
      <CartProvider>
        {children}
      </CartProvider>
    </RoleGuard>
  );
}
