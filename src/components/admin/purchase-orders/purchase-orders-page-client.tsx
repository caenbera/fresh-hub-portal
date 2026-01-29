"use client";

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { usePurchaseOrders } from '@/hooks/use-purchase-orders';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { ReceptionConfirmationDialog } from '@/components/admin/purchasing/reception-confirmation-dialog';
import type { PurchaseOrder } from '@/types';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

export function PurchaseOrdersPageClient() {
  const t = useTranslations('PurchaseOrdersPage');
  const { purchaseOrders, loading: poLoading } = usePurchaseOrders();
  const [isReceptionDialogOpen, setIsReceptionDialogOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);

  const { pendingPOs, completedPOs } = useMemo(() => {
    if (poLoading) return { pendingPOs: [], completedPOs: [] };
    const pending = purchaseOrders.filter(po => po.status === 'pending');
    const completed = purchaseOrders.filter(po => po.status === 'completed');
    return { pendingPOs: pending, completedPOs: completed };
  }, [purchaseOrders, poLoading]);

  const handleOpenReceptionDialog = (po: PurchaseOrder) => {
    setSelectedPO(po);
    setIsReceptionDialogOpen(true);
  };

  return (
    <>
      <ReceptionConfirmationDialog
        open={isReceptionDialogOpen}
        onOpenChange={setIsReceptionDialogOpen}
        purchaseOrder={selectedPO}
      />
      <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <div>
          <h1 className="text-2xl font-bold font-headline">{t('title')}</h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>

        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">{t('pending_tab')} ({pendingPOs.length})</TabsTrigger>
            <TabsTrigger value="completed">{t('completed_tab')}</TabsTrigger>
          </TabsList>
          <TabsContent value="pending" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('po_id_header')}</TableHead>
                      <TableHead>{t('supplier_header')}</TableHead>
                      <TableHead>{t('date_sent_header')}</TableHead>
                      <TableHead className="text-right">{t('total_header')}</TableHead>
                      <TableHead className="text-right">{t('action_header')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {poLoading ? (
                      <TableRow><TableCell colSpan={5}><Skeleton className="h-10 w-full"/></TableCell></TableRow>
                    ) : pendingPOs.length > 0 ? (
                      pendingPOs.map(po => (
                        <TableRow key={po.id}>
                          <TableCell className="font-bold">{po.poId}</TableCell>
                          <TableCell>{po.supplierName}</TableCell>
                          <TableCell>{po.createdAt.toDate().toLocaleDateString()}</TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(po.total)}</TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" onClick={() => handleOpenReceptionDialog(po)}>{t('confirm_reception_button')}</Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow><TableCell colSpan={5} className="text-center h-24 text-muted-foreground">{t('no_pending_pos')}</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="completed" className="mt-4">
             <Card>
              <CardContent className="p-0">
                 <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('po_id_header')}</TableHead>
                      <TableHead>{t('supplier_header')}</TableHead>
                      <TableHead>{t('date_completed_header')}</TableHead>
                      <TableHead className="text-right">{t('final_total_header')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {poLoading ? (
                      <TableRow><TableCell colSpan={4}><Skeleton className="h-10 w-full"/></TableCell></TableRow>
                    ) : completedPOs.length > 0 ? (
                      completedPOs.map(po => (
                        <TableRow key={po.id}>
                          <TableCell className="font-bold">{po.poId}</TableCell>
                          <TableCell>{po.supplierName}</TableCell>
                          <TableCell>{po.completedAt ? po.completedAt.toDate().toLocaleDateString() : 'N/A'}</TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(po.total)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow><TableCell colSpan={4} className="text-center h-24 text-muted-foreground">{t('no_completed_pos')}</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
