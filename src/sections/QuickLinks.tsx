import React from 'react';
import { Link } from 'react-router-dom';
import { Pizza, Tag, CupSoda } from 'lucide-react';

const QuickLinks: React.FC = () => {
  return (
    <section className="bg-[#f0ebe1] py-8 relative w-full border-b border-[#dcd3c6]">
      {/* Light texture overlay */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/cream-paper.png')` }} 
      />
      
      <div className="container-custom relative z-10 max-w-4xl mx-auto">
        <div className="grid grid-cols-3 gap-0">
          
          {/* PIZZA */}
          <Link 
            to="/menu?cat=pizza" 
            className="flex flex-col items-center justify-center py-4 px-2 hover:bg-black/5 transition-colors border-r border-[#dcd3c6]"
          >
            <div className="mb-2 text-black flex items-center justify-center pb-2 border-b-2 border-transparent w-full">
              <Pizza className="w-12 h-12 stroke-[1.5]" />
            </div>
            <h3 className="font-bebas text-black text-[22px] md:text-[28px] leading-none mb-1 tracking-wide">
              PIZZA
            </h3>
            <p className="font-barlow text-black/70 text-[11px] md:text-[13px] font-600 uppercase tracking-wide text-center">
              Explore Our Menu
            </p>
          </Link>

          {/* DEALS */}
          <Link 
            to="/deals" 
            className="flex flex-col items-center justify-center py-4 px-2 hover:bg-black/5 transition-colors border-r border-[#dcd3c6]"
          >
            <div className="mb-2 text-red-600 flex items-center justify-center relative">
               <Tag className="w-12 h-12 stroke-[1.5]" />
               <div className="absolute top-0 right-0 transform translate-x-1 -translate-y-1 rotate-12">
                 <span className="text-red-600 font-900 text-[16px] leading-none tracking-tighter">$$</span>
               </div>
            </div>
            <h3 className="font-bebas text-black text-[22px] md:text-[28px] leading-none mb-1 tracking-wide">
              DEALS
            </h3>
            <p className="font-barlow text-black/70 text-[11px] md:text-[13px] font-600 uppercase tracking-wide text-center">
              Exclusive Offers
            </p>
          </Link>

          {/* DRINKS */}
          <Link 
            to="/menu?cat=drinks" 
            className="flex flex-col items-center justify-center py-4 px-2 hover:bg-black/5 transition-colors"
          >
            <div className="mb-2 text-black flex items-center justify-center">
              <CupSoda className="w-12 h-12 stroke-[1.5]" />
            </div>
            <h3 className="font-bebas text-black text-[22px] md:text-[28px] leading-none mb-1 tracking-wide">
              DRINKS
            </h3>
            <p className="font-barlow text-black/70 text-[11px] md:text-[13px] font-600 uppercase tracking-wide text-center">
              Shakes & Beverages
            </p>
          </Link>

        </div>
      </div>
    </section>
  );
};

export default QuickLinks;
