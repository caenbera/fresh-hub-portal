"use client";

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Supplier } from '@/types';
import { Eye, History, Trash2, Phone, Plus, Star, Truck, User, Pencil } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface SupplierCardProps {
  supplier: Supplier;
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplierId: string) => void;
}

const Rating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ))}
  </div>
);

export function SupplierCard({ supplier, onEdit, onDelete }: SupplierCardProps) {
  const t = useTranslations('SuppliersPage');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };
  
  const primaryContact = supplier.contacts[0];

  return (
    <Card className="flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow duration-200 rounded-2xl relative group">
       <div className="absolute top-3 right-3 z-10 flex gap-1">
         <AlertDialog>
              <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                  </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('delete_supplier_confirm_title')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('delete_supplier_confirm_desc', { supplierName: supplier.name })}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(supplier.id)} className="bg-destructive hover:bg-destructive/90">{t('delete')}</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
         </AlertDialog>
        
          <Button variant="ghost" size="icon" onClick={() => onEdit(supplier)} className="h-8 w-8 bg-background/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted">
            <Pencil className="h-4 w-4" />
          </Button>

         <Link href={`/admin/suppliers/${supplier.id}`}>
           <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/50 backdrop-blur-sm hover:bg-primary/10 hover:text-primary">
              <Eye className="h-4 w-4" />
           </Button>
         </Link>
       </div>

      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <Avatar className="h-12 w-12 text-lg font-bold">
            <AvatarFallback>{supplier.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-bold text-base text-gray-800">{supplier.name}</h3>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">{supplier.category}</p>
          <Rating rating={supplier.rating} />
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-3 text-sm">
        {primaryContact && (
            <>
                <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{primaryContact.name} ({primaryContact.department})</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{primaryContact.phone}</span>
                </div>
            </>
        )}
        <div className="flex items-center gap-2 text-muted-foreground">
          <Truck className="h-4 w-4" />
          <span>{t('delivery_days')}: {supplier.deliveryDays}</span>
        </div>

        <div className="bg-muted p-2.5 rounded-lg flex justify-between items-center mt-2">
            <span className="text-xs font-semibold text-muted-foreground">{t('pending_balance')}</span>
            <span className={`font-bold ${supplier.finance.pendingBalance > 3000 ? 'text-destructive' : 'text-foreground'}`}>
                {supplier.finance.pendingBalance > 0 ? formatCurrency(supplier.finance.pendingBalance) : <span className="text-green-600">{t('up_to_date')}</span>}
            </span>
        </div>

      </CardContent>
      <CardFooter className="p-2 border-t bg-gray-50/50 rounded-b-2xl">
        <div className="flex w-full gap-2">
            <Button variant="outline" size="sm" className="flex-1">
                <History className="mr-2 h-4 w-4" /> {t('orders')}
            </Button>
            <Button size="sm" className="flex-1">
                <Plus className="mr-2 h-4 w-4" /> {t('stock_up')}
            </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
