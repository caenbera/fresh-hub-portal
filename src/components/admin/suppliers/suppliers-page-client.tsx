"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { FileText, Handshake, PlusCircle, Truck } from 'lucide-react';
import { suppliers } from '@/lib/placeholder-data';
import { SupplierCard } from './supplier-card';
import { AddSupplierDialog } from './add-supplier-dialog';
import type { Supplier } from '@/types';
import { Card, CardContent } from "@/components/ui/card";

const KpiCard = ({ title, value, icon: Icon, iconBg, iconColor }: any) => (
  <Card className="shadow-sm">
    <CardContent className="p-5 flex items-center justify-between">
      <div>
        <h5 className="text-xs uppercase text-muted-foreground font-semibold">{title}</h5>
        <h2 className="text-2xl font-bold text-gray-800 mt-1">{value}</h2>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}>
        <Icon className={`h-6 w-6 ${iconColor}`} />
      </div>
    </CardContent>
  </Card>
);

export function SuppliersPageClient() {
  const t = useTranslations('SuppliersPage');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const totalPayable = suppliers.reduce((acc, s) => acc + s.finance.pendingBalance, 0);

  const filters = [
    { id: 'all', label: t('all') },
    { id: 'Frutas y Verduras', label: t('fruits_vegetables') },
    { id: 'Empaques y Desechables', label: t('packaging') },
    { id: 'Secos y Abarrotes', label: t('groceries') },
    { id: 'Logística', label: t('logistics') },
  ];

  const handleAddSupplier = () => {
    setSelectedSupplier(null);
    setIsDialogOpen(true);
  };
  
  const handleDeleteSupplier = (supplierId: string) => {
      console.log("Deleting supplier...", supplierId);
      // In a real app, you would call a Firestore function here
      alert(`Supplier ${supplierId} deleted!`);
  };

  const filteredSuppliers = suppliers.filter(s => activeFilter === 'all' || s.category === activeFilter);

  return (
    <>
      <AddSupplierDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} supplier={selectedSupplier} />
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-headline">{t('title')}</h1>
            <p className="text-muted-foreground">{t('subtitle')}</p>
          </div>
          <Button onClick={handleAddSupplier}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {t('add_supplier_button')}
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KpiCard 
            title={t('accounts_payable')}
            value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalPayable)}
            icon={FileText}
            iconBg="bg-red-100"
            iconColor="text-red-600"
          />
          <KpiCard 
            title={t('deliveries_today')}
            value="3"
            icon={Truck}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
          />
          <KpiCard 
            title={t('active_suppliers')}
            value={suppliers.filter(s => s.status === 'active').length}
            icon={Handshake}
            iconBg="bg-green-100"
            iconColor="text-green-600"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {filters.map(filter => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? 'default' : 'outline'}
              size="sm"
              className="rounded-full whitespace-nowrap"
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Suppliers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSuppliers.map(supplier => (
            <SupplierCard key={supplier.id} supplier={supplier} onDelete={handleDeleteSupplier} />
          ))}
        </div>
      </div>
    </>
  );
}
