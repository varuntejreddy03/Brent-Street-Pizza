import React from 'react';
import { useCart } from '../context/CartContext';
import CartWidget from './CartWidget';
import { ShoppingCart } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function GlobalCartWidget() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    orderType,
    setOrderType,
    incrementItem,
    decrementItem,
    cartTotalItems
  } = useCart();
  
  const location = useLocation();
  const isCheckout = location.pathname.includes('/checkout');

  if (isCheckout) return null;

  return (
    <>
      {/* ── Floating cart trigger (Desktop/Tablet) ── */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-10 right-8 w-14 h-14 bg-[#1A1A1A] rounded-full shadow-2xl flex items-center justify-center z-[90]
          hover:scale-110 hover:bg-[#C8201A] transition-all text-white border-2 border-white/20 group hidden sm:flex"
      >
        <ShoppingCart className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        {cartTotalItems > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-[#C8201A] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
            {cartTotalItems}
          </span>
        )}
      </button>

      <CartWidget
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        orderType={orderType}
        onOrderTypeChange={setOrderType}
        onIncrement={incrementItem}
        onDecrement={decrementItem}
      />
    </>
  );
}
