import React from 'react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {

  return (
    <section className="relative w-full min-h-screen overflow-hidden flex items-center justify-center bg-[#1a0a00]">
      {/* Image background */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{ backgroundImage: 'url(/heropic.jpeg)' }}
      />
      {/* Subtle overlay for text readability */}
      <div className="absolute inset-0 bg-black/40" />


      {/* Content */}
      <div className="relative z-10 container-custom flex flex-col justify-center pt-28 pb-20 min-h-screen">


        <div className="max-w-[1200px] w-full">
          {/* Headline */}
          <div className="flex flex-col items-center md:items-start pl-0 md:pl-[300px] lg:pl-[360px] text-center md:text-left mt-24">
            <h3
              className="font-poppins text-white text-[24px] md:text-[36px] font-700 uppercase tracking-wide mb-2 animate-fade-up drop-shadow-md"
              style={{ animationDelay: '0.1s', opacity: 0, animationFillMode: 'forwards' }}
            >
              HOT &amp; FRESH
            </h3>
            <h1
              className="font-poppins text-[70px] md:text-[110px] lg:text-[130px] font-900 leading-[0.95] mb-4 text-white drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)] uppercase animate-fade-up tracking-[-0.02em]"
              style={{ animationDelay: '0.15s', opacity: 0, animationFillMode: 'forwards' }}
            >
              PIZZA
            </h1>
            <p
              className="font-poppins text-white text-[20px] md:text-[28px] font-700 tracking-normal mb-10 animate-fade-up drop-shadow-md"
              style={{ animationDelay: '0.3s', opacity: 0, animationFillMode: 'forwards' }}
            >
              Made Daily in Store
            </p>

            {/* CTA Buttons */}
            <div
              className="flex justify-center md:justify-start items-center gap-3 sm:gap-4 md:gap-6 animate-fade-up w-full px-4 md:px-0"
              style={{ animationDelay: '0.4s', opacity: 0, animationFillMode: 'forwards' }}
            >
              <Link
                to="/menu"
                id="hero-order-pickup"
                className="bg-gradient-to-b from-[#dc2626] to-[#991b1b] hover:from-[#ef4444] hover:to-[#b91c1c] text-white font-barlow font-800 text-[15px] sm:text-[16px] md:text-[18px] tracking-widest px-4 sm:px-6 md:px-8 py-3.5 sm:py-4 md:py-4 rounded shadow-[0_4px_0_#7f1d1d,0_8px_15px_rgba(0,0,0,0.5)] flex items-center justify-center gap-2 transition-all duration-300 w-full sm:w-auto active:translate-y-1 active:shadow-[0_0px_0_#7f1d1d,0_0px_0_rgba(0,0,0,0.5)] uppercase border border-[#f87171]/20"
              >
                ORDER PICKUP <span className="text-xl">›</span>
              </Link>
              <Link
                to="/menu?tab=delivery"
                id="hero-order-delivery"
                className="bg-gradient-to-b from-[#dc2626] to-[#991b1b] hover:from-[#ef4444] hover:to-[#b91c1c] text-white font-barlow font-800 text-[15px] sm:text-[16px] md:text-[18px] tracking-widest px-4 sm:px-6 md:px-8 py-3.5 sm:py-4 md:py-4 rounded shadow-[0_4px_0_#7f1d1d,0_8px_15px_rgba(0,0,0,0.5)] flex items-center justify-center gap-2 transition-all duration-300 w-full sm:w-auto active:translate-y-1 active:shadow-[0_0px_0_#7f1d1d,0_0px_0_rgba(0,0,0,0.5)] uppercase border border-[#f87171]/20"
              >
                ORDER DELIVERY <span className="text-xl">›</span>
              </Link>
            </div>
          </div>
        </div>


      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-35 animate-float">
        <span className="font-barlow text-[10px] uppercase tracking-[0.25em] text-white">Scroll</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-white to-transparent" />
      </div>
    </section>
  );
};

export default Hero;
