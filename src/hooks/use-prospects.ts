"use client";

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { Prospect } from '@/types';
import { useAuth } from '@/context/auth-context';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function useProspects() {
  const { user, role } = useAuth();
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user || !role) {
      setLoading(false);
      return;
    }

    const prospectsCollection = collection(db, 'prospects');
    let q;

    if (role === 'salesperson') {
      // Salespeople can only see their own prospects
      q = query(
        prospectsCollection,
        where('salespersonId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
    } else if (role === 'admin' || role === 'superadmin') {
      // Admins can see all prospects
      q = query(prospectsCollection, orderBy('createdAt', 'desc'));
    } else {
      // Other roles shouldn't see any prospects
      setProspects([]);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const prospectsData: Prospect[] = [];
        querySnapshot.forEach((doc) => {
          prospectsData.push({ id: doc.id, ...doc.data() } as Prospect);
        });
        setProspects(prospectsData);
        setLoading(false);
      },
      (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: prospectsCollection.path,
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(serverError);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, role]);

  return { prospects, loading, error };
}
