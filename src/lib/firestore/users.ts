import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { UserRole } from '@/types';

export const updateUserRole = (uid: string, newRole: 'admin' | 'client') => {
  const userDoc = doc(db, 'users', uid);
  return updateDoc(userDoc, {
    role: newRole,
  });
};
