"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslations } from 'next-intl';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { usePriceLists } from '@/hooks/use-pricelists';
import { addPriceList, updatePriceList, deletePriceList } from '@/lib/firestore/pricelists';
import { Pencil, Trash2, Check, X, Loader2, Plus, AlertTriangle } from 'lucide-react';
import type { PriceList } from '@/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';


const priceListSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  discount: z.coerce.number().min(0, "Discount must be positive.").max(100, "Discount cannot exceed 100."),
});
type FormValues = z.infer<typeof priceListSchema>;

interface PriceListManagerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PriceListManagerDialog({ open, onOpenChange }: PriceListManagerDialogProps) {
  const t = useTranslations('ClientsPage');
  const { toast } = useToast();
  const { priceLists, loading } = usePriceLists();
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(priceListSchema),
    defaultValues: { name: '', discount: 0 },
  });

  const { isSubmitting } = form.formState;

  const handleAddNew = async (values: FormValues) => {
    await addPriceList(values);
    toast({ title: "Success", description: "New price list added." });
    form.reset({ name: '', discount: 0 });
  };
  
  const handleStartEdit = (priceList: PriceList) => {
    setEditingId(priceList.id);
    form.reset(priceList);
  };
  
  const handleCancelEdit = () => {
    setEditingId(null);
    form.reset({ name: '', discount: 0 });
  };
  
  const handleUpdate = async (values: FormValues) => {
    if (!editingId) return;
    await updatePriceList(editingId, values);
    toast({ title: "Success", description: "Price list updated." });
    handleCancelEdit();
  };
  
  const handleDelete = async (id: string) => {
    await deletePriceList(id);
    toast({ title: "Success", description: "Price list deleted." });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('manage_pricelists_title')}</DialogTitle>
          <DialogDescription>{t('manage_pricelists_desc')}</DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-60 pr-4 -mr-4 border-y -mx-6 px-6 py-2">
            <div className="space-y-2">
                {loading && <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>}
                {priceLists.map((list) => (
                    <div key={list.id} className="flex items-center gap-2 p-2 rounded-md bg-muted">
                        <div className="flex-grow">
                            <span className="font-semibold">{list.name}</span>
                            <span className="text-sm text-primary font-bold ml-2">({list.discount}%)</span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleStartEdit(list)}><Pencil className="h-4 w-4" /></Button>
                         <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-4 w-4" /></Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>{t('delete_confirm_title')}</AlertDialogTitle>
                                    <AlertDialogDescription>{t('confirm_delete_pricelist', { priceListName: list.name })}</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>{t('cancel_button')}</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(list.id)} className="bg-destructive hover:bg-destructive/90">{t('delete_button_confirm')}</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                ))}
            </div>
        </ScrollArea>
        
        <Form {...form}>
            <form onSubmit={form.handleSubmit(editingId ? handleUpdate : handleAddNew)} className="space-y-4">
                <p className="text-sm font-semibold">{editingId ? 'Edit List' : 'Add New List'}</p>
                 <div className="grid grid-cols-[1fr,100px] gap-2 items-end">
                     <FormField control={form.control} name="name" render={({ field }) => (
                         <FormItem>
                             <FormLabel>{t('new_pricelist_name_label')}</FormLabel>
                             <FormControl><Input {...field} placeholder="e.g., VIP" /></FormControl>
                         </FormItem>
                     )}/>
                     <FormField control={form.control} name="discount" render={({ field }) => (
                         <FormItem>
                             <FormLabel>{t('new_pricelist_discount_label')}</FormLabel>
                             <FormControl><Input type="number" {...field} placeholder="15" /></FormControl>
                         </FormItem>
                     )}/>
                 </div>
                 <div className="flex gap-2">
                     <Button type="submit" disabled={isSubmitting} size="sm">
                        {editingId ? <Check className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                        {editingId ? "Save Changes" : t('add_pricelist_button')}
                    </Button>
                    {editingId && (
                         <Button type="button" variant="outline" size="sm" onClick={handleCancelEdit}><X className="mr-2 h-4 w-4" /> Cancel</Button>
                    )}
                 </div>
                 <FormMessage>{form.formState.errors.name?.message || form.formState.errors.discount?.message}</FormMessage>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
