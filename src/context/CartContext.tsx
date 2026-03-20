import React, { createContext, useContext, useState, useEffect } from 'react';
import { type MenuItem, type CartItem } from '../types/menu';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: MenuItem, customizations?: { size?: string, price?: number, removedToppings?: string[], addedExtras?: { name: string; price: number }[], quantity?: number }) => void;
  incrementItem: (id: string) => void;
  decrementItem: (id: string) => void;
  clearCart: () => void;
  cartTotalItems: number;
  cartTotalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Pull from localStorage if available (good for persistence before backend)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('pizza_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('pizza_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: MenuItem, customizations?: { size?: string, price?: number, removedToppings?: string[], addedExtras?: { name: string; price: number }[], quantity?: number }) => {
    setCartItems(prev => {
      // Create a unique key for the item based on its stringified properties so we can stack identical customized pizzas
      const customizationKey = JSON.stringify({
        s: customizations?.size,
        r: customizations?.removedToppings?.sort(),
        e: customizations?.addedExtras?.map(e => e.name).sort()
      });

      const qty = customizations?.quantity ?? 1;
      const existing = prev.find(i => i.menuItemId === item.id && (i as any)._customizationKey === customizationKey);
      if (existing) {
        return prev.map(i => i.id === existing.id ? { ...i, quantity: i.quantity + qty } : i);
      }

      let finalPrice = customizations?.price ?? item.price;
      if (customizations?.addedExtras) {
        finalPrice += customizations.addedExtras.reduce((acc, e) => acc + e.price, 0);
      }

      const cartItem: CartItem & { _customizationKey: string } = {
        id: Date.now().toString(),
        menuItemId: item.id,
        name: item.name,
        price: finalPrice,
        quantity: customizations?.quantity ?? 1,
        image: item.image,
        size: customizations?.size,
        removedToppings: customizations?.removedToppings,
        addedExtras: customizations?.addedExtras,
        _customizationKey: customizationKey
      };

      return [...prev, cartItem];
    });
  };

  const incrementItem = (id: string) => {
    setCartItems(prev => prev.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i));
  };

  const decrementItem = (id: string) => {
    setCartItems(prev => {
      const target = prev.find(i => i.id === id);
      if (target?.quantity === 1) {
        return prev.filter(i => i.id !== id);
      }
      return prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i);
    });
  };

  const clearCart = () => setCartItems([]);

  const cartTotalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      incrementItem,
      decrementItem,
      clearCart,
      cartTotalItems,
      cartTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
