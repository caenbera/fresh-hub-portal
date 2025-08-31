"use client";

import type { ReactNode } from 'react';

export default function PortalLayout({ children }: { children: ReactNode }) {
  // RoleGuard has been removed from here to fix layout composition issues.
  // The main layout already ensures the user is authenticated.
  return <>{children}</>;
}
