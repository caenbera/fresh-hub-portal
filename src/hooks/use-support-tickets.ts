// src/hooks/useSupportTickets.ts
"use client";

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { SupportTicket } from '@/types';
import { useAuth } from '@/context/auth-context';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const VALID_STATUSES = ['new', 'in_progress', 'resolved'] as const;

export function useSupportTickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const ticketsCollection = collection(db, 'supportTickets');
    const q = query(ticketsCollection, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const ticketsData: SupportTicket[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();

          let status = data.status;
          if (!VALID_STATUSES.includes(status)) {
            status = 'new';
          }

          ticketsData.push({
            id: doc.id,
            userId: data.userId || '',
            userName: data.userName || 'Usuario desconocido',
            issueType: data.issueType || 'Sin tipo',
            orderId: data.orderId,
            details: data.details || '',
            photoUrl: data.photoUrl,
            status,
            createdAt: data.createdAt,
          } as SupportTicket);
        });
        setTickets(ticketsData);
        setLoading(false);
      },
      (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: ticketsCollection.path,
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(serverError);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return { tickets, loading, error };
}