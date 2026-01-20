"use client";

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/context/auth-context';
import type { Branch } from '@/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function useBranches() {
  const { user } = useAuth();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const branchesCollection = collection(db, 'users', user.uid, 'branches');
    const q = query(branchesCollection);

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const branchesData: Branch[] = [];
        querySnapshot.forEach((doc) => {
          branchesData.push({ id: doc.id, ...doc.data() } as Branch);
        });
        setBranches(branchesData);
        setLoading(false);
      },
      (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: branchesCollection.path,
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(serverError);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return { branches, loading, error };
}
