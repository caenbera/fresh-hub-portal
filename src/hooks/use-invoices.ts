
"use client";

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/context/auth-context';
import type { Invoice } from '@/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function useInvoices() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const invoicesCollection = collection(db, 'invoices');
    // The orderBy clause on a different field than the where clause requires a composite index.
    // Removing it to fix the permission error, as the index is likely missing.
    const q = query(
      invoicesCollection,
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const invoicesData: Invoice[] = [];
        querySnapshot.forEach((doc) => {
          invoicesData.push({ id: doc.id, ...doc.data() } as Invoice);
        });
        // Sort manually on the client-side
        invoicesData.sort((a, b) => b.invoiceDate.toMillis() - a.invoiceDate.toMillis());
        setInvoices(invoicesData);
        setLoading(false);
      },
      (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: invoicesCollection.path,
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(serverError);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return { invoices, loading, error };
}
