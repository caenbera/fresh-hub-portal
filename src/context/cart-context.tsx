'use client';

import React, { createContext, useState, useContext, ReactNode, useCallback, useMemo } from 'react';
import type { Offer } from '@/types';

interface CartItem {
  quantity: number;
  offerId?: string; // Track if the item was added as an offer
}

interface CartContextType {
  cart: Record<string, CartItem>;
  notes: Record<string, string>;
  addToCart: (productId: string, delta: number, offer?: Offer) => void;
  updateNote: (productId: string, note: string) => void;
  clearCart: () => void;
  getCartItem: (productId: string) => CartItem | undefined;
  getNote: (productId: string) => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  const addToCart = useCallback((productId: string, delta: number, offer?: Offer) => {
    setCart(prevCart => {
      const newCart = { ...prevCart };
      const currentItem = newCart[productId] || { quantity: 0 };
      const newQty = currentItem.quantity + delta;

      if (newQty > 0) {
        newCart[productId] = {
          quantity: newQty,
          // If an offer is provided, associate it. If not, keep existing offerId if any.
          offerId: offer?.id || currentItem.offerId,
        };
        // If an offer is being added, also remove any notes for that product,
        // as the context of the note might be tied to the non-offer item.
        if (offer) {
          setNotes(prevNotes => {
            const newNotes = {...prevNotes};
            delete newNotes[productId];
            return newNotes;
          });
        }
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  }, []);

  const updateNote = useCallback((productId: string, note: string) => {
    setNotes(prevNotes => {
      const newNotes = { ...prevNotes };
      if (note.trim()) {
        newNotes[productId] = note;
      } else {
        delete newNotes[productId];
      }
      return newNotes;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart({});
    setNotes({});
  }, []);

  const getCartItem = useCallback((productId: string) => cart[productId], [cart]);
  const getNote = useCallback((productId: string) => notes[productId] || '', [notes]);

  const value = useMemo(() => ({
    cart,
    notes,
    addToCart,
    updateNote,
    clearCart,
    getCartItem,
    getNote,
  }), [cart, notes, addToCart, updateNote, clearCart, getCartItem, getNote]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
