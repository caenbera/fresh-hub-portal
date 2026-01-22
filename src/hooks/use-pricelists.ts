"use client";

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { PriceList } from '@/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function usePriceLists() {
  const [priceLists, setPriceLists] = useState<PriceList[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const priceListsCollection = collection(db, 'pricelists');
    const q = query(priceListsCollection, orderBy('discount', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const listsData: PriceList[] = [];
        querySnapshot.forEach((doc) => {
          listsData.push({ id: doc.id, ...doc.data() } as PriceList);
        });
        setPriceLists(listsData);
        setLoading(false);
      },
      (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: priceListsCollection.path,
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { priceLists, loading };
}
