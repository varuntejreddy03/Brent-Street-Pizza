import React, { useEffect, useRef } from 'react';

const DeliveryAreas: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.08 }
    );
    sectionRef.current?.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#f0ebe1] py-16 md:py-24 relative border-t border-[#dcd3c6]">
       {/* Light texture overlay */}
       <div 
         className="absolute inset-0 opacity-40 pointer-events-none"
         style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/cream-paper.png')` }} 
       />

      <div className="container-custom relative z-10 text-center text-[#1a0a00]">
        
        <div className="flex items-center justify-center gap-4 mb-3 reveal">
          <div className="h-[1px] w-8 bg-[#C0392B]" />
          <h2 className="font-barlow text-[20px] md:text-[24px] font-800 tracking-wider">
            Delivery Area
          </h2>
          <div className="h-[1px] w-8 bg-[#C0392B]" />
        </div>

        <p className="font-barlow text-[16px] md:text-[18px] font-800 tracking-wide mb-3 reveal">
          Delivery within 5km of Brent Street
        </p>

        <p className="font-barlow text-[14px] md:text-[16px] font-500 mb-6 text-black/70 reveal leading-relaxed max-w-lg mx-auto">
          Glenorchy • Moonah • Rosetta • Claremont • Lutana
        </p>

      </div>
    </section>
  );
};

export default DeliveryAreas;
