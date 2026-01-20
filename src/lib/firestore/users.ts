
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export const updateUserRole = (uid: string, newRole: 'admin' | 'client') => {
  const userDoc = doc(db, 'users', uid);
  updateDoc(userDoc, {
    role: newRole,
  }).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: userDoc.path,
      operation: 'update',
      requestResourceData: { role: newRole },
    });
    errorEmitter.emit('permission-error', permissionError);
  });
};

// This function is no longer needed with the simplified role management.
// We keep it here in case we want to re-introduce a pre-approval flow later,
// but it is not used by any component.
export const addAdminInvite = (email: string) => {
  const inviteDocRef = doc(db, 'adminInvites', email.toLowerCase());
  const inviteData = {
    email: email.toLowerCase(),
    status: 'pending',
  };
  setDoc(inviteDocRef, inviteData).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: inviteDocRef.path,
      operation: 'create',
      requestResourceData: inviteData,
    });
    errorEmitter.emit('permission-error', permissionError);
  });
};
