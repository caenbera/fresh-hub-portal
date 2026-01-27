// src/components/BadgeHandler.tsx
'use client';

import { useEffect } from 'react';

export function BadgeHandler({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Limpiar badge cuando la app se abre
    if ('clearAppBadge' in navigator && typeof navigator.clearAppBadge === 'function') {
      navigator.clearAppBadge().catch(console.error);
    }

    // Registrar Service Worker si no está registrado
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        console.log('Service Worker registrado para badge:', registration);
      }).catch(console.error);
    }

    // Escuchar cuando la app vuelve a estar activa
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        if ('clearAppBadge' in navigator && typeof navigator.clearAppBadge === 'function') {
          navigator.clearAppBadge().catch(console.error);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return <>{children}</>;
}