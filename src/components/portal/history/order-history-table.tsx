import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Order, OrderStatus } from '@/types';
import { format } from 'date-fns';

interface OrderHistoryTableProps {
  orders: Order[];
}

export function OrderHistoryTable({ orders }: OrderHistoryTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (timestamp: any) => {
    // Firestore timestamps can be tricky. Convert to JS Date.
    const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
    return format(date, 'MMM dd, yyyy');
  };

  const getStatusVariant = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'default';
      case 'processing': return 'secondary';
      case 'shipped': return 'secondary';
      case 'delivered': return 'default'; // Or a success variant if you add one
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.length > 0 ? (
          orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{formatDate(order.createdAt)}</TableCell>
              <TableCell>
                 <Badge variant={getStatusVariant(order.status)} className="capitalize">
                    {order.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">{formatCurrency(order.total)}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={3} className="h-24 text-center">
              You haven't placed any orders yet.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
