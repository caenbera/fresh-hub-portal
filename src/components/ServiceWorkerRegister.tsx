'use client';

import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export function ServiceWorkerRegister() {
  const { toast } = useToast();

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.error('SW registration failed: ', registrationError);
            toast({
              variant: 'destructive',
              title: 'Service Worker Registration Failed',
              description:
                'Offline capabilities and notifications might not work.',
            });
          });
      });
    }
  }, [toast]);

  return null;
}
