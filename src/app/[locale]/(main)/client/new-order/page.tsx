"use client";

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { addOrder } from '@/lib/firestore/orders';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import type { Product as ProductType, OrderItem } from '@/types';
import { CalendarIcon, Search, Star, MessageSquarePlus, Pencil, Minus, Plus, ShoppingBasket } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';


// Temporary product data from the prototype
const products: (Omit<ProductType, 'id'> & {id: number, isFavorite: boolean})[] = [
    { id: 1, name: "Tomate Chonto Maduro", price: 20, stock: 100, category: "verduras", isFavorite: true, photoUrl: "https://i.postimg.cc/TY6YMwmY/tomate_chonto.png", description: 'Tomate maduro de alta calidad', createdAt: new Date() as any },
    { id: 2, name: "Cebolla Cabezona Blanca", price: 29, stock: 100, category: "verduras", isFavorite: true, photoUrl: "https://i.postimg.cc/TPwHKV88/cebolla_blanca.png", description: 'Cebolla blanca fresca', createdAt: new Date() as any },
    { id: 3, name: "Papa Pastusa Lavada", price: 30.50, stock: 100, category: "verduras", isFavorite: false, photoUrl: "https://i.postimg.cc/ncJcbz7t/papa_pastusa.png", description: 'Papa pastusa lavada y lista', createdAt: new Date() as any },
    { id: 4, name: "Limón Tahití", price: 40, stock: 100, category: "frutas", isFavorite: true, photoUrl: "https://i.postimg.cc/43dFY6CX/limon.png", description: 'Limón Tahití jugoso', createdAt: new Date() as any },
    { id: 5, name: "Aguacate Hass", price: 25, stock: 100, category: "frutas", isFavorite: false, photoUrl: "https://i.postimg.cc/BZDQVDjB/aguacate_hass.png", description: 'Aguacate Hass en su punto', createdAt: new Date() as any },
    { id: 6, name: "Cilantro Fresco", price: 17, stock: 100, category: "hierbas", isFavorite: true, photoUrl: "https://i.postimg.cc/s2X0MYFs/cilantro.png", description: 'Manojo de cilantro fresco', createdAt: new Date() as any },
    { id: 7, name: "Fresas Seleccionadas", price: 40, stock: 100, category: "frutas", isFavorite: false, photoUrl: "https://i.postimg.cc/Qx3xGt7P/fresas.png", description: 'Caja de fresas seleccionadas', createdAt: new Date() as any },
    { id: 8, name: "Papa Francesa Cong.", price: 60, stock: 100, category: "congelados", isFavorite: false, photoUrl: "https://i.postimg.cc/HsgsDx5D/papa_francesa.png", description: 'Papas a la francesa pre-cortadas', createdAt: new Date() as any },
    { id: 9, name: "Aceite Vegetal 20L", price: 100, stock: 100, category: "abarrotes", isFavorite: true, photoUrl: "https://i.postimg.cc/7L6Q53vy/aceite20.png", description: 'Bidón de aceite vegetal', createdAt: new Date() as any },
    { id: 10, name: "Zanahoria", price: 17, stock: 100, category: "verduras", isFavorite: true, photoUrl: "https://i.postimg.cc/5NS9xVqJ/zanahoria.png", description: 'Zanahoria fresca', createdAt: new Date() as any },
];

const categories = [
    { id: 'habituales', name: 'Habituales', icon: Star },
    { id: 'verduras', name: 'Verduras' },
    { id: 'frutas', name: 'Frutas' },
    { id: 'hierbas', name: 'Hierbas' },
    { id: 'congelados', name: 'Congelados' },
    { id: 'abarrotes', name: 'Abarrotes' },
];

interface Cart { [productId: number]: number };
interface Notes { [productId: number]: string };

const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

// This is the content for the checkout, shared between Dialog and Sheet
const CheckoutContent = ({ orderItems, notes, total, deliveryDate, isSubmitting, handleSubmitOrder, t }: any) => (
  <>
    <SheetHeader className="p-4 text-left sm:text-center">
      <SheetTitle>{t('confirmOrder')}</SheetTitle>
    </SheetHeader>
    <div className="p-4 flex-grow overflow-y-auto">
        <div className="flex items-center gap-2 p-2 mb-4 bg-gray-100 rounded-md text-sm">
          <CalendarIcon className="h-4 w-4 text-primary" />
          <span className="text-muted-foreground">{t('delivery')}:</span> 
          <span className="font-semibold">{deliveryDate ? format(deliveryDate, 'PPP', {locale: es}) : 'N/A'}</span>
        </div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase">{t('selectedItems')}</h3>
        <div className="space-y-2">
          {orderItems.map((item: any) => (
            <div key={item.productId} className="flex gap-3 items-start p-2 border-b">
                <Image src={item.photoUrl} alt={item.productName} width={40} height={40} className="rounded-md object-cover"/>
                <div className="flex-grow">
                    <p className="font-semibold text-sm">{item.productName}</p>
                    <p className="text-xs text-muted-foreground">{item.quantity} x {formatCurrency(item.price)}</p>
                    {notes[Number(item.productId)] && <p className="text-xs text-blue-600 bg-blue-50 p-1 rounded-md mt-1"><b className="font-bold">Nota:</b> {notes[Number(item.productId)]}</p>}
                </div>
                <p className="font-semibold text-sm">{formatCurrency(item.quantity * item.price)}</p>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <label className="text-sm font-semibold text-muted-foreground uppercase">{t('observations')}</label>
          <Textarea placeholder={t('observationsPlaceholder')} className="mt-1"/>
        </div>
    </div>
    <div className="p-4 bg-gray-50 border-t sticky bottom-0">
        <div className="w-full">
          <div className="flex justify-between items-center mb-2">
              <span className="text-muted-foreground font-medium">{t('total')}</span>
              <span className="text-2xl font-bold">{formatCurrency(total)}</span>
          </div>
          <Button onClick={handleSubmitOrder} disabled={isSubmitting} size="lg" className="w-full">
            {isSubmitting ? t('sendingOrder') : t('sendOrder')}
          </Button>
        </div>
    </div>
  </>
);


export default function NewOrderPage() {
  const t = useTranslations('ClientNewOrderPage');
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>(addDays(new Date(), 1));
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('habituales');
  
  const [cart, setCart] = useState<Cart>({});
  const [notes, setNotes] = useState<Notes>({});

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [currentProductForNote, setCurrentProductForNote] = useState<ProductType | null>(null);
  const [currentNote, setCurrentNote] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = activeCategory === 'habituales' ? p.isFavorite : p.category === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm]);

  const { orderItems, total, totalItems } = useMemo(() => {
    const orderItems: (OrderItem & { photoUrl: string })[] = [];
    let total = 0;
    let totalItems = 0;

    for (const productId in cart) {
      const product = products.find(p => p.id === Number(productId));
      const quantity = cart[productId];
      if (product && quantity > 0) {
        orderItems.push({
          productId: String(product.id),
          productName: product.name,
          quantity,
          price: product.price,
          photoUrl: product.photoUrl,
        });
        total += product.price * quantity;
        totalItems += quantity;
      }
    }
    return { orderItems, total, totalItems };
  }, [cart]);


  const handleQuantityChange = (productId: number, change: number) => {
    setCart(prev => {
      const newCart = { ...prev };
      const currentQty = newCart[productId] || 0;
      const newQty = currentQty + change;
      if (newQty > 0) {
        newCart[productId] = newQty;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const handleOpenNoteModal = (product: ProductType) => {
    setCurrentProductForNote(product);
    setCurrentNote(notes[Number(product.id)] || '');
    setIsNoteModalOpen(true);
  };
  
  const handleSaveNote = () => {
    if (currentProductForNote) {
      setNotes(prev => {
        const newNotes = { ...prev };
        if (currentNote.trim()) {
          newNotes[Number(currentProductForNote.id)] = currentNote;
        } else {
          delete newNotes[Number(currentProductForNote.id)];
        }
        return newNotes;
      });
    }
    setIsNoteModalOpen(false);
    setCurrentProductForNote(null);
    setCurrentNote('');
  };
  
  const handleSubmitOrder = async () => {
    if (!user || !userProfile) {
        toast({ variant: "destructive", title: t('error'), description: t('noUserError') });
        return;
    }
    if (orderItems.length === 0) {
        toast({ variant: "destructive", title: t('error'), description: t('emptyCartError') });
        return;
    }
    if (!userProfile.address) {
      toast({ variant: "destructive", title: t('error'), description: t('noAddressError') });
      return;
    }
    if (!deliveryDate) {
      toast({ variant: "destructive", title: t('error'), description: t('noDateError') });
      return;
    }
    
    setIsSubmitting(true);
    try {
        await addOrder({
            userId: user.uid,
            businessName: userProfile.businessName,
            items: orderItems.map(({photoUrl, ...item}) => item), // remove photoUrl for firestore
            total,
            status: 'pending',
            shippingAddress: userProfile.address,
            // You might want to add deliveryDate and general observations to the order object
        });
        toast({ title: t('orderPlaced'), description: t('orderPlacedDesc') });
        setCart({});
        setNotes({});
        setIsCheckoutOpen(false);
    } catch (error: any) {
        toast({ variant: "destructive", title: t('orderFailed'), description: error.message || t('orderFailedDesc') });
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const checkoutProps = {
    orderItems,
    notes,
    total,
    deliveryDate,
    isSubmitting,
    handleSubmitOrder,
    t,
  };

  return (
    <div className="flex flex-col h-full bg-gray-50/50">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b py-2">
        <div className="flex items-center gap-2 mb-2 px-2 sm:px-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("w-[240px] justify-start text-left font-normal", !deliveryDate && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {deliveryDate ? format(deliveryDate, "PPP", {locale: es}) : <span>{t('pickDate')}</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={deliveryDate} onSelect={setDeliveryDate} initialFocus/>
            </PopoverContent>
          </Popover>
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t('searchPlaceholder')} className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>

        <div className="overflow-x-auto whitespace-nowrap pb-1 [-ms-overflow-style:none] [scrollbar-width:none] px-2 sm:px-4">
          {categories.map(cat => (
            <Button
              key={cat.id}
              variant={activeCategory === cat.id ? 'default' : 'outline'}
              size="sm"
              className="rounded-full mr-2 h-8"
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.icon && <cat.icon className={cn("mr-2 h-4 w-4", activeCategory === cat.id ? '' : 'text-yellow-500')} />}
              {t(cat.id)}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Product List */}
      <div className="flex-grow overflow-y-auto pb-32">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(p => {
            const quantity = cart[p.id] || 0;
            const hasNote = !!notes[p.id];
            return (
              <div key={p.id} className="bg-background border-b p-2 flex items-center gap-3">
                <Image src={p.photoUrl} alt={p.name} width={55} height={55} className="rounded-lg object-cover bg-gray-100" />
                <div className="flex-grow">
                  <p className="font-semibold leading-tight">{p.name}</p>
                  <div className="text-sm text-muted-foreground flex items-center">
                    <span>{formatCurrency(p.price)} / {isMobile ? 'Un' : 'Unidad'}</span>
                     <Button variant="ghost" size="sm" className={cn("h-auto px-1 py-0 ml-1 text-xs", hasNote && "text-primary hover:text-primary")} onClick={() => handleOpenNoteModal(p as any)}>
                        {hasNote ? <Pencil className="h-3 w-3 mr-1" /> : <MessageSquarePlus className="h-3 w-3 mr-1" />}
                        {t('note')}
                    </Button>
                  </div>
                  {quantity > 0 && <p className="font-bold text-primary text-sm mt-1">{formatCurrency(quantity * p.price)}</p>}
                </div>
                <div className="flex items-center gap-1 bg-gray-100 rounded-full border p-0.5">
                   <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full" onClick={() => handleQuantityChange(p.id, -1)}><Minus className="h-4 w-4" /></Button>
                   <Input readOnly value={quantity || ''} placeholder="0" className="h-7 w-10 text-center bg-transparent border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0" />
                   <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full" onClick={() => handleQuantityChange(p.id, 1)}><Plus className="h-4 w-4" /></Button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-muted-foreground mt-16">{t('noProducts')}</div>
        )}
      </div>

      {/* Note Modal */}
      <Dialog open={isNoteModalOpen} onOpenChange={setIsNoteModalOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{t('addNoteFor')} {currentProductForNote?.name}</DialogTitle>
            </DialogHeader>
            <Textarea value={currentNote} onChange={(e) => setCurrentNote(e.target.value)} placeholder={t('notePlaceholder')} />
            <DialogFooter>
                <Button onClick={handleSaveNote}>{t('saveNote')}</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Checkout: Sheet for Mobile, Dialog for Desktop */}
      {isMobile ? (
        <Sheet open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
          <SheetContent side="bottom" className="h-[90dvh] p-0 flex flex-col">
            <CheckoutContent {...checkoutProps} />
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
          <DialogContent className="max-w-md p-0 flex flex-col">
             <CheckoutContent {...checkoutProps} />
          </DialogContent>
        </Dialog>
      )}

      {/* Floating Cart Bar */}
      {totalItems > 0 && (
        <div className="fixed bottom-16 sm:bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-lg z-30">
            <div className="bg-background/80 backdrop-blur-lg rounded-xl shadow-2xl p-3 flex justify-between items-center border">
                 <div>
                    <p className="text-xs text-muted-foreground">{totalItems} {t('items')}</p>
                    <p className="font-bold text-lg">{formatCurrency(total)}</p>
                 </div>
                 <Button onClick={() => setIsCheckoutOpen(true)}>
                    <ShoppingBasket className="mr-2 h-4 w-4" />
                    {t('viewOrder')}
                 </Button>
            </div>
        </div>
      )}
    </div>
  );
}
