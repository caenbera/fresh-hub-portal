
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { SupportTicket } from '@/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

type TicketInput = Omit<SupportTicket, 'id' | 'createdAt'>;

export const addSupportTicket = (ticketData: TicketInput) => {
  const ticketsCollection = collection(db, 'supportTickets');
  const dataWithTimestamp = {
    ...ticketData,
    createdAt: serverTimestamp(),
  };

  return addDoc(ticketsCollection, dataWithTimestamp).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: ticketsCollection.path,
      operation: 'create',
      requestResourceData: dataWithTimestamp,
    });
    errorEmitter.emit('permission-error', permissionError);
    throw serverError;
  });
};
