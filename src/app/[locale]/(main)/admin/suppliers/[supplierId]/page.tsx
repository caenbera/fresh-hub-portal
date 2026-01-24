
'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useProducts } from '@/hooks/use-products';
import { SupplierDetailPageClient } from '@/components/admin/suppliers/supplier-detail-page-client';
import type { Product, Supplier } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

function SupplierDetailSkeleton() {
    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <Skeleton className="h-8 w-1/4" />
            <div className="flex items-center gap-4">
                <Skeleton className="h-20 w-20 rounded-2xl" />
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-5 w-64" />
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <Skeleton className="h-48 w-full rounded-lg" />
                    <Skeleton className="h-48 w-full rounded-lg" />
                </div>
                <div className="lg:col-span-2">
                    <Skeleton className="h-96 w-full rounded-lg" />
                </div>
            </div>
        </div>
    )
}


export default function SupplierDetailPage() {
  const params = useParams();
  const { supplierId } = params as { supplierId: string };

  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [supplierProducts, setSupplierProducts] = useState<Product[]>([]);
  const { products, loading: productsLoading } = useProducts();
  const [supplierLoading, setSupplierLoading] = useState(true);

  // Listener for the supplier
  useEffect(() => {
    if (!supplierId) {
      setSupplierLoading(false);
      return;
    }
    setSupplierLoading(true);
    const supplierDocRef = doc(db, 'suppliers', supplierId);
    const unsubscribe = onSnapshot(supplierDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setSupplier({ id: docSnap.id, ...docSnap.data() } as Supplier);
      } else {
        setSupplier(null);
        notFound();
      }
      setSupplierLoading(false);
    }, (error) => {
      console.error("Error fetching supplier details:", error);
      setSupplier(null);
      setSupplierLoading(false);
    });

    return () => unsubscribe();
  }, [supplierId]);

  // Effect to filter products whenever the full product list or supplier changes
  useEffect(() => {
    if (!productsLoading && supplier) {
      const filtered = products.filter(p => 
        p.suppliers && p.suppliers.some(s => s.supplierId === supplier.id)
      );
      setSupplierProducts(filtered);
    }
  }, [products, productsLoading, supplier]);
  
  const loading = supplierLoading || productsLoading;


  if (loading) {
    return <SupplierDetailSkeleton />;
  }
  
  if (!supplier) {
    return <div className="p-8 font-semibold text-center">Supplier could not be loaded. This might be a permission issue or the supplier does not exist.</div>;
  }

  return (
     <div className="p-4 sm:p-6 lg:p-8">
        <SupplierDetailPageClient supplier={supplier} products={supplierProducts} />
    </div>
  );
}

