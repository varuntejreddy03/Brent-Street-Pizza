import React, { createContext, useContext, useState, useEffect } from 'react';
import { type MenuItem, type CartItem } from '../types/menu';

interface CartContextType {
  cartItems: CartItem[];
  token: string | null;
  addToCart: (item: MenuItem, customizations?: { size?: string, price?: number, removedToppings?: string[], addedExtras?: { name: string; price: number }[], quantity?: number }) => void;
  incrementItem: (id: string) => void;
  decrementItem: (id: string) => void;
  clearCart: () => void;
  cartTotalItems: number;
  cartTotalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const createGuestUser = async (): Promise<string | null> => {
  try {
    const rand = Math.floor(Math.random() * 10000000);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `guest${rand}@brentstreet.guest`,
        password: 'guestpassword123',
        name: `Guest ${rand}`
      })
    });
    const data = await res.json();
    return data.token || null;
  } catch {
    return null;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [token, setToken] = useState<string | null>(null);

  // 1. On mount: validate existing token, or create guest
  useEffect(() => {
    const initAuth = async () => {
      const stored = localStorage.getItem('pizza_token');

      if (stored) {
        // Validate the token by hitting a protected endpoint
        const res = await fetch('/api/cart', {
          headers: { 'Authorization': `Bearer ${stored}` }
        });
        if (res.ok) {
          // Token is valid — use it
          const data = await res.json();
          setToken(stored);
          if (data.cartItems?.length) setCartItems(data.cartItems);
          return;
        } else {
          // Token invalid/expired — clear it
          localStorage.removeItem('pizza_token');
        }
      }

      // No valid token — create a new guest
      const newToken = await createGuestUser();
      if (newToken) {
        localStorage.setItem('pizza_token', newToken);
        setToken(newToken);
      }
    };

    initAuth();
  }, []);

  const authHeaders = (t?: string | null) => ({
    'Authorization': `Bearer ${t ?? token}`,
    'Content-Type': 'application/json'
  });

  // 3. addToCart — always updates local state immediately, syncs to DB in background
  const addToCart = async (item: MenuItem, customizations?: { size?: string, price?: number, removedToppings?: string[], addedExtras?: { name: string; price: number }[], quantity?: number }) => {
    const effectivePrice = customizations?.price ?? Number(item.price);
    const effectiveSize = customizations?.size ?? (item.sizes?.length ? item.sizes[0].name : undefined);

    const localItem: CartItem = {
      id: `local_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      menuItemId: item.id,   // ← real DB product ID (e.g. 'pizza-margherita')
      name: item.name,
      price: effectivePrice,
      quantity: customizations?.quantity || 1,
      image: item.image,
      size: effectiveSize,
      removedToppings: customizations?.removedToppings || [],
      addedExtras: customizations?.addedExtras || [],
    };

    // ✅ Always update local state immediately
    setCartItems(prev => [...prev, localItem]);

    // Background DB sync — best effort
    if (token) {
      try {
        const res = await fetch('/api/cart', {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({
            menuItemId: item.id,
            quantity: localItem.quantity,
            size: localItem.size || 'Large',
            removedToppings: localItem.removedToppings || [],
            addedExtras: localItem.addedExtras || []
          })
        });

        if (res.ok) {
          const cartRes = await fetch('/api/cart', { headers: authHeaders() });
          const data = await cartRes.json();
          if (data.cartItems) setCartItems(data.cartItems);
        }
      } catch (err) {
        console.error('Cart sync failed (item still in local state):', err);
      }
    }
  };

  const incrementItem = async (id: string) => {
    const item = cartItems.find(i => i.id === id);
    if (!item) return;
    setCartItems(prev => prev.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i));
    if (token && !id.startsWith('local_')) {
      fetch(`/api/cart/${id}`, {
        method: 'PUT', headers: authHeaders(),
        body: JSON.stringify({ quantity: item.quantity + 1 })
      }).catch(console.error);
    }
  };

  const decrementItem = async (id: string) => {
    const item = cartItems.find(i => i.id === id);
    if (!item) return;
    if (item.quantity === 1) {
      setCartItems(prev => prev.filter(i => i.id !== id));
      if (token && !id.startsWith('local_')) {
        fetch(`/api/cart/${id}`, { method: 'DELETE', headers: authHeaders() }).catch(console.error);
      }
    } else {
      setCartItems(prev => prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i));
      if (token && !id.startsWith('local_')) {
        fetch(`/api/cart/${id}`, {
          method: 'PUT', headers: authHeaders(),
          body: JSON.stringify({ quantity: item.quantity - 1 })
        }).catch(console.error);
      }
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    if (token) {
      fetch('/api/cart', { method: 'DELETE', headers: authHeaders() }).catch(console.error);
    }
  };

  const cartTotalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotalPrice = cartItems.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      token,
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
