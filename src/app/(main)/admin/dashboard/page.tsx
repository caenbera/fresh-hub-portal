"use client";

import { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DollarSign, Package, PackageX } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { useTranslation } from '@/lib/i18n';
import { useAllOrders } from '@/hooks/use-all-orders';
import { useProducts } from '@/hooks/use-products';
import { isToday, isThisMonth } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { locale } = useLanguage();
  const t = useTranslation(locale);
  const { orders, loading: ordersLoading } = useAllOrders();
  const { products, loading: productsLoading } = useProducts();

  const dashboardData = useMemo(() => {
    if (ordersLoading || productsLoading) {
      return null;
    }

    const todayOrders = orders.filter(order => order.createdAt && isToday(order.createdAt.toDate())).length;
    
    const monthSales = orders
      .filter(order => order.createdAt && isThisMonth(order.createdAt.toDate()))
      .reduce((sum, order) => sum + order.total, 0);

    const lowStockProducts = products.filter(product => product.stock < 10).length;

    return {
      todayOrders,
      monthSales,
      lowStockProducts,
    };
  }, [orders, products, ordersLoading, productsLoading]);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };


  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-headline font-bold">{t('dashboard_title')}</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard_card_new_orders')}
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {ordersLoading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{dashboardData?.todayOrders}</div>}
            <p className="text-xs text-muted-foreground">{t('dashboard_card_new_orders_desc')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard_card_sales_month')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {ordersLoading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{formatCurrency(dashboardData?.monthSales || 0)}</div>}
            <p className="text-xs text-muted-foreground">{t('dashboard_card_sales_month_desc')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard_card_low_stock')}</CardTitle>
            <PackageX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {productsLoading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{dashboardData?.lowStockProducts}</div>}
            <p className="text-xs text-muted-foreground">{t('dashboard_card_low_stock_desc')}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
