"use client";

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import type { UserRole } from '@/types';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: ReactNode;
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { role, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }

  if (!role || !allowedRoles.includes(role)) {
    // You can redirect to a dedicated "access-denied" page
    // or back to a safe default page.
    router.push('/portal'); // Redirecting to client portal as a safe default
    return null;
  }

  return <>{children}</>;
}
