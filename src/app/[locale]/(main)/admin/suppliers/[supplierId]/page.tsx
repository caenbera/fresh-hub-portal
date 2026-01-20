import { getSupplier } from '@/lib/firestore/suppliers';
import { getProducts } from '@/lib/firestore/products';
import { SupplierDetailPageClient } from '@/components/admin/suppliers/supplier-detail-page-client';
import { notFound } from 'next/navigation';
import type { Product } from '@/types';

export default async function SupplierDetailPage({ params }: { params: { supplierId: string } }) {
  const { supplierId } = params;
  const supplier = await getSupplier(supplierId);
  
  if (!supplier) {
    notFound();
  }

  // Fetch all products and then filter.
  // For larger datasets, a direct query would be more efficient.
  const allProducts = await getProducts();
  const supplierProducts = allProducts.filter(p => p.supplierId === supplier.id);

  return (
     <div className="p-4 sm:p-6 lg:p-8">
        <SupplierDetailPageClient supplier={supplier} products={supplierProducts} />
    </div>
  );
}
