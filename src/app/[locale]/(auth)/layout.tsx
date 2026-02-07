'use client';

import { useEffect, type ReactNode } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from '@/navigation';
import { Sprout } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AuthLayout({ children }: { children: ReactNode }) {
  const { user, loading, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      // If user is logged in, redirect them away from auth pages
      const redirectPath = (role === 'admin' || role === 'superadmin')
        ? '/admin/dashboard'
        : '/client/dashboard';
      router.replace(redirectPath);
    }
  }, [user, loading, role, router]);

  // While checking auth state or if a user is found (and thus will be redirected), show a loader.
  if (loading || user) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center gap-3 text-2xl font-semibold font-headline text-primary">
            <Sprout className="h-8 w-8 animate-spin" />
            <span>Redirecting...</span>
        </div>
        <div className="space-y-2 w-full max-w-sm">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[80%]" />
        </div>
      </div>
    );
  }

  // If not loading and no user, it's safe to show the login/signup form.
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      {children}
    </div>
  );
}
