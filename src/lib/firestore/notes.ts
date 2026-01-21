'use client';

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

type NoteInput = {
  text: string;
  authorId: string;
  authorName: string;
};

export const addClientNote = (userId: string, noteData: NoteInput) => {
  if (!userId) return Promise.reject('User ID is required.');
  const notesCollection = collection(db, 'users', userId, 'notes');
  const dataWithTimestamp = {
    ...noteData,
    createdAt: serverTimestamp(),
  };

  return addDoc(notesCollection, dataWithTimestamp).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: notesCollection.path,
      operation: 'create',
      requestResourceData: dataWithTimestamp,
    });
    errorEmitter.emit('permission-error', permissionError);
    throw serverError;
  });
};

export const deleteClientNote = (userId: string, noteId: string) => {
  if (!userId || !noteId) return Promise.reject('User and Note IDs are required.');
  const noteDoc = doc(db, 'users', userId, 'notes', noteId);

  return deleteDoc(noteDoc).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: noteDoc.path,
      operation: 'delete',
    });
    errorEmitter.emit('permission-error', permissionError);
    throw serverError;
  });
};
