import React from 'react';
import { Link } from 'react-router-dom';

const MobileCTABar: React.FC = () => {
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
