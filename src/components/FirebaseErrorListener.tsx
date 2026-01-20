'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { unstable_getDynamicDevError } from 'next/dist/client/components/react-dev-overlay/internal/helpers/get-dynamic-error';

export function FirebaseErrorListener() {
  useEffect(() => {
    const handleError = (error: Error) => {
      // Use Next.js's development overlay to show the error
      throw unstable_getDynamicDevError(error);
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, []);

  return null;
}
