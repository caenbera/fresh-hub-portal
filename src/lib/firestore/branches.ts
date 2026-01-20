import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { Branch } from '@/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

type BranchInput = Omit<Branch, 'id'>;

export const addBranch = (userId: string, branchData: BranchInput) => {
  const branchesCollection = collection(db, 'users', userId, 'branches');
  addDoc(branchesCollection, branchData).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: branchesCollection.path,
      operation: 'create',
      requestResourceData: branchData,
    });
    errorEmitter.emit('permission-error', permissionError);
  });
};

export const updateBranch = (userId: string, branchId: string, branchData: Partial<BranchInput>) => {
  const branchDoc = doc(db, 'users', userId, 'branches', branchId);
  updateDoc(branchDoc, branchData).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: branchDoc.path,
      operation: 'update',
      requestResourceData: branchData,
    });
    errorEmitter.emit('permission-error', permissionError);
  });
};

export const deleteBranch = (userId: string, branchId: string) => {
  const branchDoc = doc(db, 'users', userId, 'branches', branchId);
  deleteDoc(branchDoc).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: branchDoc.path,
      operation: 'delete',
    });
    errorEmitter.emit('permission-error', permissionError);
  });
};
