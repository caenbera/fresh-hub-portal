"use client";

import type { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  // RoleGuard has been removed from here to fix layout composition issues.
  // Protection is handled at the page level or in the main layout if needed.
  return <>{children}</>;
}
