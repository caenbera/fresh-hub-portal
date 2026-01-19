"use client";

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useRouter } from '@/navigation';
import { useAuth } from '@/context/auth-context';
import type { UserRole } from '@/types';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: ReactNode;
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait until the authentication state is fully resolved
    if (loading) return;

    // If there's no role or the role is not in the allowed list, redirect to login.
    if (!role || !allowedRoles.includes(role)) {
      router.push('/login'); 
    }
  }, [role, loading, allowedRoles, router]);

  // While loading, or if the role is invalid, render nothing.
  // The MainLayout handles the main loading skeleton, and returning null here
  // prevents any content from flashing before a potential redirect.
  if (loading || !role || !allowedRoles.includes(role)) {
    return null;
  }

  // If authentication is loaded and the role is valid, render the children.
  return <>{children}</>;
}
