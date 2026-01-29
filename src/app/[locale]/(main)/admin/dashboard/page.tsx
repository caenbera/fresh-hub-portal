"use client";

import { useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  DollarSign,
  ShoppingBasket,
  UserPlus,
  ArrowUp,
  Eye,
  AlertTriangle,
  PiggyBank,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { useAllOrders } from '@/hooks/use-all-orders';
import { useUsers } from '@/hooks/use-users';
import { useProducts } from '@/hooks/use-products';
import { usePurchaseOrders } from '@/hooks/use-purchase-orders';

import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear } from 'date-fns';
import { es } from 'date-fns/locale';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from '@/navigation';
import { Product } from '@/types';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const getSemesterDetails = (date: Date) => {
  const month = date.getMonth();
  const year = date.getFullYear();
  if (month < 6) { // First semester (Jan - Jun)
    return { start: new Date(year, 0, 1), end: new Date(year, 5, 30, 23, 59, 59, 999) };
  } else { // Second semester (Jul - Dec)
    return { start: new Date(year, 6, 1), end: new Date(year, 11, 31, 23, 59, 59, 999) };
  }
};


export default function DashboardPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('Dashboard');

  const [period, setPeriod] = useState('month');

  const { orders, loading: ordersLoading } = useAllOrders();
  const { users, loading: usersLoading } = useUsers();
  const { products, loading: productsLoading } = useProducts();
  const { purchaseOrders, loading: poLoading } = usePurchaseOrders();

  const loading = ordersLoading || usersLoading || productsLoading || poLoading;
  
  const now = new Date();
  const currentDate = now.toLocaleDateString(locale, { day: 'numeric', month: 'short' });

  // Memoized calculations
  const kpiData = useMemo(() => {
    if (loading) return null;

    let startDate, endDate;
    const now = new Date();

    switch (period) {
        case 'week':
            startDate = startOfWeek(now);
            endDate = endOfWeek(now);
            break;
        case 'quarter':
            startDate = startOfQuarter(now);
            endDate = endOfQuarter(now);
            break;
        case 'semester':
            const sem = getSemesterDetails(now);
            startDate = sem.start;
            endDate = sem.end;
            break;
        case 'year':
            startDate = startOfYear(now);
            endDate = endOfYear(now);
            break;
        case 'month':
        default:
            startDate = startOfMonth(now);
            endDate = endOfMonth(now);
            break;
    }
    
    const filteredOrders = orders.filter(o => o.createdAt.toDate() >= startDate && o.createdAt.toDate() <= endDate);
    const filteredUsers = users.filter(u => u.createdAt?.toDate() >= startDate && u.createdAt?.toDate() <= endDate);
    const filteredPOs = purchaseOrders.filter(po => po.status === 'completed' && po.completedAt && po.completedAt.toDate() >= startDate && po.completedAt.toDate() <= endDate);

    const totalSales = filteredOrders.reduce((acc, order) => acc + order.total, 0);
    const totalOrders = filteredOrders.length;
    const newClientsThisPeriod = filteredUsers.length;
    const totalSavings = filteredPOs.reduce((acc, po) => acc + (po.discountInfo?.appliedDiscount?.amount || 0), 0);
    
    const newOrdersCount = filteredOrders.filter(o => o.status === 'pending').length;

    return {
      sales: { val: formatCurrency(totalSales), trend: t('sales_trend'), trendType: "up" },
      orders: { val: totalOrders, trend: t('orders_trend', { count: newOrdersCount }), trendType: "up" },
      clients: { val: newClientsThisPeriod, trend: t('clients_trend', { count: `+${newClientsThisPeriod}` }), trendType: "up" },
      savings: { val: formatCurrency(totalSavings), trend: t('savings_trend'), trendType: "up" },
    };
  }, [loading, orders, users, purchaseOrders, period, t]);

  const salesChartData = useMemo(() => {
      if (loading) return [];
      const last7Days = Array.from({ length: 7 }, (_, i) => subDays(now, i)).reverse();
      
      const salesByDay = last7Days.map(day => {
          const formattedDay = format(day, 'yyyy-MM-dd');
          const daySales = orders
              .filter(order => order.createdAt && format(order.createdAt.toDate(), 'yyyy-MM-dd') === formattedDay)
              .reduce((sum, order) => sum + order.total, 0);
          
          return {
              name: format(day, 'E', { locale: locale === 'es' ? es : undefined }),
              sales: daySales
          };
      });
      return salesByDay;
  }, [loading, orders, locale]);


  const categoryChartData = useMemo(() => {
    if (loading || products.length === 0) return [];
    
    const salesByCategory: { [category: string]: number } = {};

    orders.forEach(order => {
      order.items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          const categoryName = product.category[locale as 'es' | 'en'];
          salesByCategory[categoryName] = (salesByCategory[categoryName] || 0) + (item.price * item.quantity);
        }
      });
    });

    const totalSales = Object.values(salesByCategory).reduce((sum, val) => sum + val, 0);
    if (totalSales === 0) return [];

    return Object.entries(salesByCategory).map(([name, value]) => ({
      name,
      value: parseFloat(((value / totalSales) * 100).toFixed(1))
    })).sort((a, b) => b.value - a.value);

  }, [loading, orders, products, locale]);

  const recentOrdersData = useMemo(() => {
    if (loading) return [];
    return orders.slice(0, 3);
  }, [loading, orders]);

  const lowStockProducts = useMemo(() => {
    if (loading) return [];
    const unifiedProducts = Array.from(
      products.reduce((map, product) => {
        const existing = map.get(product.sku);
        if (existing) {
          existing.stock += product.stock;
        } else {
          map.set(product.sku, { ...product });
        }
        return map;
      }, new Map<string, Product>()).values()
    );
    return unifiedProducts.filter(p => p.stock <= p.minStock).sort((a,b) => a.stock - b.stock);
  }, [loading, products]);

  const COLORS = ['#27ae60', '#f39c12', '#2980b9', '#8e44ad', '#e74c3c'];

   const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending': return <Badge className="bg-[#e3f2fd] text-[#2196f3] hover:bg-[#e3f2fd]/80">Nuevo</Badge>;
      case 'processing': return <Badge className="bg-orange-100 text-orange-600">En Proceso</Badge>;
      case 'shipped': return <Badge className="bg-[#fff3e0] text-[#ff9800] hover:bg-[#fff3e0]/80">En Ruta</Badge>;
      case 'delivered': return <Badge className="bg-[#e8f5e9] text-[#2ecc71] hover:bg-[#e8f5e9]/80">Entregado</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const periodLabels: Record<string, string> = {
      week: t('period_week'),
      month: t('period_month'),
      quarter: t('period_quarter'),
      semester: t('period_semester'),
      year: t('period_year'),
  }

  const kpiCardsConfig = [
    { metric: 'sales', label: t('kpi_sales_label'), icon: <DollarSign />, iconBg: 'bg-green-100 text-green-600' },
    { metric: 'orders', label: t('kpi_orders_label'), icon: <ShoppingBasket />, iconBg: 'bg-blue-100 text-blue-600' },
    { metric: 'clients', label: t('kpi_clients_label'), icon: <UserPlus />, iconBg: 'bg-purple-100 text-purple-600' },
    { metric: 'savings', label: t('kpi_savings_label'), icon: <PiggyBank />, iconBg: 'bg-indigo-100 text-indigo-600' },
  ];

  return (
    <div className="flex flex-col gap-8 bg-gray-50/50 p-4 sm:p-6 lg:p-8 rounded-xl">
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Hola, Administrador 👋</h1>
          <p className="text-muted-foreground">Resumen de actividad, <span id="currentDate">{currentDate}</span></p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder={t('select_period_placeholder')} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="week">{t('period_week')}</SelectItem>
                <SelectItem value="month">{t('period_month')}</SelectItem>
                <SelectItem value="quarter">{t('period_quarter')}</SelectItem>
                <SelectItem value="semester">{t('period_semester')}</SelectItem>
                <SelectItem value="year">{t('period_year')}</SelectItem>
            </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? Array.from({length: 4}).map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-2xl" />) :
          kpiCardsConfig.map(({ metric, label, icon, iconBg }) => (
          <Card key={metric} className="shadow-sm hover:shadow-md transition-shadow duration-200 rounded-2xl">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <span className="text-sm font-semibold text-gray-500 uppercase">{label} ({periodLabels[period]})</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-3xl font-extrabold text-gray-800">{kpiData?.[metric as keyof typeof kpiData]?.val || '...'}</div>
                   <div className={`text-xs font-semibold mt-1 inline-flex items-center gap-1 py-1 px-2 rounded-full bg-green-100 text-green-600`}>
                      <ArrowUp className="h-3 w-3" />
                      <span>{kpiData?.[metric as keyof typeof kpiData]?.trend || '...'}</span>
                    </div>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}>
                  {icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm rounded-2xl p-6">
          <h3 className="font-bold text-lg text-gray-800 mb-4">Rendimiento de Ventas (Últ. 7 días)</h3>
          <div className="h-80">
            {loading ? <Skeleton className="h-full w-full" /> : 
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <defs><linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#27ae60" stopOpacity={0.2}/><stop offset="95%" stopColor="#27ae60" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} dy={10} />
                <YAxis tickLine={false} axisLine={false} dx={-10} tickFormatter={(value) => formatCurrency(value)}/>
                <Tooltip contentStyle={{ borderRadius: '0.75rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }} itemStyle={{ fontWeight: '600' }} labelStyle={{ fontWeight: 'normal', color: '#64748b' }} formatter={(value: number) => [formatCurrency(value), 'Ventas']} />
                <Area type="monotone" dataKey="sales" stroke="#27ae60" strokeWidth={3} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>}
          </div>
        </Card>

        <Card className="shadow-sm rounded-2xl p-6">
          <h3 className="font-bold text-lg text-gray-800 mb-4">Top Categorías</h3>
          <div className="h-80 flex items-center justify-center">
             {loading ? <Skeleton className="h-64 w-64 rounded-full" /> : 
             (categoryChartData && categoryChartData.length > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={categoryChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} fill="#8884d8" paddingAngle={5} dataKey="value" nameKey="name">
                    {categoryChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Legend iconType="circle" iconSize={10} />
                    <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                </PieChart>
                </ResponsiveContainer>
              ) : <p className="text-sm text-muted-foreground">No hay datos de ventas para mostrar</p>
            }
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="shadow-sm rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-gray-800">Pedidos Recientes</h3>
            <Button variant="link" size="sm" onClick={() => router.push('/admin/orders')}>Ver Todos</Button>
          </div>
          {loading ? <Skeleton className="h-48 w-full" /> :
          <Table>
            <TableHeader><TableRow><TableHead>Pedido ID</TableHead><TableHead>Cliente</TableHead><TableHead>Monto</TableHead><TableHead>Estado</TableHead><TableHead>Acción</TableHead></TableRow></TableHeader>
            <TableBody>
              {recentOrdersData.length > 0 ? recentOrdersData.map(order => (
                <TableRow key={order.id}>
                  <TableCell className="font-bold">#{order.id.substring(0,7).toUpperCase()}</TableCell>
                  <TableCell>{order.businessName}</TableCell>
                  <TableCell className="font-bold">{formatCurrency(order.total)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell><Button variant="outline" size="icon" className="h-8 w-8" onClick={() => router.push('/admin/orders')}><Eye className="h-4 w-4" /></Button></TableCell>
                </TableRow>
              )) : <TableRow><TableCell colSpan={5} className="text-center h-24">No hay pedidos recientes.</TableCell></TableRow>}
            </TableBody>
          </Table>}
        </Card>

         <Card className="shadow-sm rounded-2xl p-6">
            <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2"><AlertTriangle className="text-yellow-500" /> Alertas de Stock Bajo</h3>
            {loading ? <Skeleton className="h-48 w-full" /> :
            <div className="space-y-4">
              {lowStockProducts.length > 0 ? lowStockProducts.slice(0,3).map((product) => (
                <div key={product.id} className="flex items-center gap-4 pb-4 border-b last:border-b-0">
                    <Image src={product.photoUrl || 'https://via.placeholder.com/40'} alt={product.name[locale as 'es'|'en']} width={40} height={40} className="rounded-md" data-ai-hint="product image" />
                    <div className="flex-grow">
                        <div className="font-bold text-gray-800">{product.name[locale as 'es'|'en']}</div>
                        <small className="text-gray-500">SKU: {product.sku}</small>
                    </div>
                    <div className="text-right">
                        <div className="font-bold text-red-600">{product.stock} restantes</div>
                        <small className="font-bold text-yellow-600">Min: {product.minStock}</small>
                    </div>
                </div>
              )) : <p className="text-sm text-muted-foreground text-center py-8">¡Todo el inventario está en orden!</p>}
              {lowStockProducts.length > 0 && <Button className="w-full mt-2" variant="secondary" onClick={() => router.push('/admin/purchasing')}>Ir a Compras</Button>}
            </div>}
         </Card>
      </div>
    </div>
  );
}
