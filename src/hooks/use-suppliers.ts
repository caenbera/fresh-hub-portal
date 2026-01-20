"use client";

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { Supplier } from '@/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const suppliersCollection = collection(db, 'suppliers');
    const q = query(suppliersCollection, orderBy('name', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const suppliersData: Supplier[] = [];
        querySnapshot.forEach((doc) => {
          suppliersData.push({ id: doc.id, ...doc.data() } as Supplier);
        });
        setSuppliers(suppliersData);
        setLoading(false);
      },
      (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: suppliersCollection.path,
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(serverError);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { suppliers, loading, error };
}
