import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  type WithFieldValue,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { Offer } from '@/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

// Input type excludes only the id field (createdAt will be added with serverTimestamp)
type OfferInput = Omit<Offer, 'id'>;

const offersCollection = collection(db, 'offers');

export const addOffer = (offerData: Omit<Offer, 'id' | 'createdAt'>) => {
  // Cast to WithFieldValue<Offer> to allow serverTimestamp() for createdAt
  const dataWithTimestamp = {
    ...offerData,
    createdAt: serverTimestamp(),
  } as WithFieldValue<Offer>;

  return addDoc(offersCollection, dataWithTimestamp).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: offersCollection.path,
      operation: 'create',
      requestResourceData: dataWithTimestamp,
    });
    errorEmitter.emit('permission-error', permissionError);
    throw serverError;
  });
};

export const deleteOffer = (id: string) => {
  const offerDoc = doc(db, 'offers', id);
  return deleteDoc(offerDoc).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: offerDoc.path,
      operation: 'delete',
    });
    errorEmitter.emit('permission-error', permissionError);
    throw serverError;
  });
};