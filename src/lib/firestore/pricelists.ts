import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { PriceList } from '@/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

type PriceListInput = Omit<PriceList, 'id'>;

export const addPriceList = (data: PriceListInput) => {
  const priceListsCollection = collection(db, 'pricelists');
  return addDoc(priceListsCollection, data).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: priceListsCollection.path,
      operation: 'create',
      requestResourceData: data,
    });
    errorEmitter.emit('permission-error', permissionError);
    throw serverError;
  });
};

export const updatePriceList = (id: string, data: Partial<PriceListInput>) => {
  const priceListDoc = doc(db, 'pricelists', id);
  return updateDoc(priceListDoc, data).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: priceListDoc.path,
      operation: 'update',
      requestResourceData: data,
    });
    errorEmitter.emit('permission-error', permissionError);
    throw serverError;
  });
};

export const deletePriceList = (id: string) => {
  const priceListDoc = doc(db, 'pricelists', id);
  return deleteDoc(priceListDoc).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: priceListDoc.path,
      operation: 'delete',
    });
    errorEmitter.emit('permission-error', permissionError);
    throw serverError;
  });
};
