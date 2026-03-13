import React from 'react';
import { Link } from 'react-router-dom';

const MobileCTABar: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-[52px] bg-[#C0392B] z-[100] sm:hidden flex border-t border-white/10">
      <Link
        to="/menu"
        className="w-1/2 h-full flex items-center justify-center text-white font-barlow font-700 text-[13px] uppercase tracking-widest border-r border-white/20 hover:bg-[#a93226] active:bg-[#8a2820] transition-colors"
      >
        ORDER PICKUP
      </Link>
      <Link
        to="/menu?tab=delivery"
        className="w-1/2 h-full flex items-center justify-center text-white font-barlow font-700 text-[13px] uppercase tracking-widest bg-[#C0392B] border-l border-white/20 hover:bg-[#A93226] active:bg-[#8a2820] transition-colors"
      >
        ORDER DELIVERY
      </Link>
    </div>
  );
};

export default MobileCTABar;
