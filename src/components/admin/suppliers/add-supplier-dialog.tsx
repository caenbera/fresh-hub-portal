"use client";

import { useState, useEffect, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslations } from 'next-intl';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Phone } from 'lucide-react';
import { BotMessageSquare } from 'lucide-react';
import type { Supplier } from '@/types';

// In a real app, this would come from the DB
const initialCategories = ["Frutas y Verduras", "Empaques y Desechables", "Lácteos y Huevos", "Secos y Abarrotes", "Logística"];

const contactSchema = z.object({
  department: z.string().min(1, 'Required'),
  name: z.string().min(2, 'Required'),
  phone: z.string().min(7, 'Required'),
  isWhatsapp: z.boolean(),
});

const supplierSchema = z.object({
  name: z.string().min(2, "Company name is required"),
  category: z.string().min(1, "Category is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(5, "Address is required"),
  deliveryDays: z.string().min(2, "Delivery days are required"),
  paymentTerms: z.string().min(1, "Payment terms are required"),
  notes: z.string().optional(),
  contacts: z.array(contactSchema).min(1, "At least one contact is required"),
});

type FormValues = z.infer<typeof supplierSchema>;

interface AddSupplierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplier?: Supplier | null;
}

export function AddSupplierDialog({ open, onOpenChange, supplier }: AddSupplierDialogProps) {
  const t = useTranslations('SuppliersPage');
  
  const [categories] = useState(initialCategories);

  const form = useForm<FormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
        name: '',
        category: '',
        email: '',
        address: '',
        deliveryDays: '',
        paymentTerms: 'Net 15',
        notes: '',
        contacts: [{ department: 'Ventas', name: '', phone: '', isWhatsapp: true }]
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "contacts",
  });

  useEffect(() => {
    if (open && supplier) {
      form.reset({
        name: supplier.name,
        category: supplier.category,
        email: supplier.email,
        address: supplier.address,
        deliveryDays: supplier.deliveryDays,
        paymentTerms: supplier.paymentTerms,
        notes: supplier.notes || '',
        contacts: supplier.contacts.map(c => ({...c, id: c.id || Math.random().toString()})) as any,
      });
    } else if (open) {
      form.reset({
        name: '',
        category: '',
        email: '',
        address: '',
        deliveryDays: '',
        paymentTerms: 'Net 15',
        notes: '',
        contacts: [{ department: 'Ventas', name: '', phone: '', isWhatsapp: true }]
      });
    }
  }, [open, supplier, form]);

  const onSubmit = (values: FormValues) => {
    console.log("Saving supplier:", values);
    // TODO: Add Firestore logic here
    alert("Supplier saved! (Check console for data)");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{supplier ? t('edit_supplier_modal_title') : t('add_supplier_modal_title')}</DialogTitle>
          <DialogDescription>{t('add_supplier_modal_desc')}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-1 pr-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>{t('company_name')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>{t('email_label')}</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                  <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem><FormLabel>{t('address_label')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                </div>
                
                <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('category')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder={t('category_placeholder')} /></SelectTrigger></FormControl>
                      <SelectContent>
                        {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}/>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <FormField control={form.control} name="deliveryDays" render={({ field }) => (
                    <FormItem><FormLabel>{t('delivery_days')}</FormLabel><FormControl><Input placeholder={t('delivery_days_placeholder')} {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                   <FormField control={form.control} name="paymentTerms" render={({ field }) => (
                    <FormItem><FormLabel>{t('payment_terms')}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="Net 7">Net 7</SelectItem>
                          <SelectItem value="Net 15">Net 15</SelectItem>
                          <SelectItem value="Net 30">Net 30</SelectItem>
                          <SelectItem value="COD">COD (Cash on Delivery)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}/>
                </div>
                
                <hr className="my-4"/>
                <Label className="font-bold">{t('contacts_section_title')}</Label>
                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-[1fr,1fr,1fr,auto,auto] gap-2 items-end p-2 border rounded-lg bg-muted/30">
                        <FormField control={form.control} name={`contacts.${index}.department`} render={({ field }) => (
                            <FormItem><FormLabel className="text-xs">{t('contact_department')}</FormLabel><FormControl><Input {...field} placeholder={t('contact_department_placeholder')} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name={`contacts.${index}.name`} render={({ field }) => (
                            <FormItem><FormLabel className="text-xs">{t('contact_name')}</FormLabel><FormControl><Input {...field} placeholder={t('contact_name_placeholder')} /></FormControl><FormMessage /></FormItem>
                        )}/>
                         <FormField control={form.control} name={`contacts.${index}.phone`} render={({ field }) => (
                            <FormItem><FormLabel className="text-xs">{t('phone_label')}</FormLabel><FormControl><Input {...field} type="tel" /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name={`contacts.${index}.isWhatsapp`} render={({ field }) => (
                            <FormItem className="flex flex-col items-center">
                               <FormLabel className="text-xs">WhatsApp</FormLabel>
                               <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                               </FormControl>
                            </FormItem>
                        )}/>
                        <Button type="button" variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => remove(index)}><Trash2 className="h-4 w-4"/></Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => append({ department: 'Ventas', name: '', phone: '', isWhatsapp: false })}>
                    <Plus className="mr-2 h-4 w-4" /> {t('add_contact_button')}
                  </Button>
                </div>
                 <FormField control={form.control} name="notes" render={({ field }) => (
                    <FormItem><FormLabel>{t('internal_note')}</FormLabel><FormControl><Textarea placeholder={t('internal_note_placeholder')} {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <DialogFooter className="pt-4">
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{t('cancel')}</Button>
                  <Button type="submit">{t('save')}</Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
