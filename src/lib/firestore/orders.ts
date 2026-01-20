
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { Order } from '@/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


type OrderInput = Omit<Order, 'id' | 'createdAt'>;
type OrderUpdateInput = Partial<Omit<Order, 'id' | 'createdAt' | 'userId'>>;

const ordersCollection = collection(db, 'orders');

export const addOrder = (orderData: OrderInput) => {
  const dataWithTimestamp = {
    ...orderData,
    createdAt: serverTimestamp(),
  };
  addDoc(ordersCollection, dataWithTimestamp).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: ordersCollection.path,
      operation: 'create',
      requestResourceData: dataWithTimestamp,
    });
    errorEmitter.emit('permission-error', permissionError);
  });
};

export const updateOrder = (id: string, orderData: OrderUpdateInput) => {
  const orderDoc = doc(db, 'orders', id);
  updateDoc(orderDoc, orderData).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: orderDoc.path,
      operation: 'update',
      requestResourceData: orderData,
    });
    errorEmitter.emit('permission-error', permissionError);
  });
};

export const deleteOrder = (id: string) => {
  const orderDoc = doc(db, 'orders', id);
  deleteDoc(orderDoc).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: orderDoc.path,
      operation: 'delete',
    });
    errorEmitter.emit('permission-error', permissionError);
  });
};
