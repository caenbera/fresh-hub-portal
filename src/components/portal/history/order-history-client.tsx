"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from 'next-intl';
import { useOrders } from "@/hooks/use-orders";
import { OrderHistoryAccordion } from "./order-history-accordion";

export function OrderHistoryClient() {
  const t = useTranslations('ClientHistoryPage');
  const { orders, loading } = useOrders();

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-6 lg:p-8">
      <div className="bg-card shadow-sm sm:shadow-none sm:bg-transparent -mx-4 -mt-4 sm:m-0 p-4 sm:p-0 sticky top-0 z-10 sm:static">
        <h1 className="text-xl sm:text-2xl font-headline font-bold text-center sm:text-left">{t('title')}</h1>
      </div>
      
      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : (
        <OrderHistoryAccordion orders={orders} />
      )}
    </div>
  );
}
