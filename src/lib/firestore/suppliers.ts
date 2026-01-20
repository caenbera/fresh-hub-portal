import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { Supplier } from '@/types';

// The form data is a subset of the Supplier type
type SupplierFormData = Omit<Supplier, 'id' | 'rating' | 'status' | 'verified' | 'finance'>;

export const addSupplier = (supplierData: SupplierFormData) => {
  const suppliersCollection = collection(db, 'suppliers');
  
  // Add default values for fields not present in the form
  const newSupplierData: Omit<Supplier, 'id'> = {
    ...supplierData,
    rating: 0,
    status: 'active',
    verified: false,
    finance: {
      pendingBalance: 0,
      ytdSpend: 0,
      fillRate: 100, // Default to 100%
      onTimeDelivery: true, // Default to true
    },
  };
  
  return addDoc(suppliersCollection, newSupplierData);
};

export const updateSupplier = (id: string, supplierData: Partial<Supplier>) => {
  const supplierDoc = doc(db, 'suppliers', id);
  return updateDoc(supplierDoc, supplierData);
};

export const updateSupplierRating = (id: string, newRating: number) => {
    const supplierDoc = doc(db, 'suppliers', id);
    return updateDoc(supplierDoc, { rating: newRating });
}

export const deleteSupplier = (id: string) => {
  const supplierDoc = doc(db, 'suppliers', id);
  return deleteDoc(supplierDoc);
};
