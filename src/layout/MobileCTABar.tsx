import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingBag } from 'lucide-react';

const MobileCTABar: React.FC = () => {
  const { cartTotalItems, cartTotalPrice, setIsCartOpen } = useCart();
  const location = useLocation();
  const isCheckout = location.pathname.includes('/checkout');

  if (isCheckout) return null;

  if (cartTotalItems > 0) {
    return (
      <div className="fixed bottom-0 left-0 right-0 h-[52px] bg-[#C8201A] z-[100] sm:hidden flex border-t border-[#E8D8C8]">
        <button
          onClick={() => setIsCartOpen(true)}
          className="w-full h-full flex items-center justify-between px-5 text-white hover:bg-[#9E1510] active:bg-[#8a2820] transition-colors"
        >
          <span className="flex items-center gap-2 font-barlow font-700 text-[14px] uppercase tracking-wider">
            <span className="bg-white text-[#C8201A] text-[12px] font-black w-6 h-6 rounded-full flex items-center justify-center">
              {cartTotalItems}
            </span>
            View Order
          </span>
          <span className="font-bebas text-[24px] leading-none">${cartTotalPrice.toFixed(2)}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[52px] bg-[#C8201A] z-[100] sm:hidden flex border-t border-[#E8D8C8]">
      <Link
        to="/menu"
        className="w-1/2 h-full flex items-center justify-center text-white font-barlow font-700 text-[11px] sm:text-[13px] uppercase tracking-wider whitespace-nowrap border-r border-[#E8D8C8] hover:bg-[#9E1510] active:bg-[#8a2820] transition-colors"
      >
        ORDER PICKUP
      </Link>
      <Link
        to="/menu?tab=delivery"
        className="w-1/2 h-full flex items-center justify-center text-white font-barlow font-700 text-[11px] sm:text-[13px] uppercase tracking-wider whitespace-nowrap bg-[#C8201A] border-l border-[#E8D8C8] hover:bg-[#9E1510] active:bg-[#8a2820] transition-colors"
      >
        ORDER DELIVERY
      </Link>
    </div>
  );
};

export default MobileCTABar;
