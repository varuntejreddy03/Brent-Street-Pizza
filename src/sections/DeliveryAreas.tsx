import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bike, ArrowRight, Clock } from 'lucide-react';

const SUBURBS = ['Glenorchy', 'Moonah', 'West Moonah', 'Derwent Park', 'Montrose', 'Rosetta'];

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
    <section ref={sectionRef} className="bg-[#FDF8F2] py-24 md:py-32 relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#C8201A]/6 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C8201A]/30 to-transparent" />

      <div className="container-custom relative z-10">

        {/* Header */}
        <div className="text-center mb-16 reveal">
          <h2 className="font-bebas text-[56px] md:text-[80px] text-[#1A1A1A] tracking-wider leading-none mb-4">
            Delivery Areas
          </h2>
          <p className="font-inter text-[#555555] text-[15px] max-w-md mx-auto leading-relaxed">
            Hot, fresh pizza delivered within 5km of Brent Street Pizza, Glenorchy.
          </p>
        </div>

        {/* Main card */}
        <div className="max-w-4xl mx-auto">

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mb-8 reveal">
            {[
              { icon: <Bike className="w-5 h-5" />, value: '5km', label: 'Delivery Radius' },
              { icon: <span className="font-bebas text-[18px] leading-none">$5</span>, value: 'Flat Fee', label: 'No hidden costs' },
              { icon: <Clock className="w-5 h-5" />, value: 'Min $25', label: 'Minimum order' },
            ].map(stat => (
              <div key={stat.label} className="flex flex-col items-center justify-center bg-[#FFFCF7] border border-[#E8D8C8] rounded-2xl py-6 px-4 gap-2 hover:border-[#C8201A]/30 transition-colors">
                <div className="w-10 h-10 rounded-full bg-[#C8201A]/15 border border-[#C8201A]/25 flex items-center justify-center text-[#C8201A]">
                  {stat.icon}
                </div>
                <p className="font-bebas text-[28px] text-[#2B2B2B] leading-none tracking-wider">{stat.value}</p>
                <p className="font-barlow text-[11px] font-700 uppercase tracking-wider text-[#555555]">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Suburbs grid */}
          <div className="bg-[#FFFCF7] border border-[#E8D8C8] rounded-2xl p-8 mb-6 reveal">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-4 h-4 text-[#C8201A] flex-shrink-0" />
              <span className="font-barlow text-[11px] font-700 uppercase tracking-[0.25em] text-[#D4952A]">
                Delivery Suburbs
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-[#D4952A]/20 to-transparent" />
            </div>
            <div className="flex flex-wrap gap-3">
              {SUBURBS.map(suburb => (
                <span
                  key={suburb}
                  className="flex items-center gap-2 bg-[#C8201A]/10 border border-[#C8201A]/25 text-[#C8201A] font-barlow font-700 text-[13px] uppercase tracking-wider px-4 py-2 rounded-full"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C8201A] flex-shrink-0" />
                  {suburb}
                </span>
              ))}
            </div>
            <p className="font-inter text-[12px] text-[#555555] mt-5">
              Not sure if we deliver to you? Call us on{' '}
              <a href="tel:0362724004" className="text-[#D4952A] hover:text-[#2B2B2B] transition-colors">03 6272 4004</a>
            </p>
          </div>

          {/* CTA */}
          <div className="reveal">
            <Link
              to="/menu?tab=delivery"
              className="flex items-center justify-between bg-[#C8201A] hover:bg-[#9E1510] text-white font-barlow font-700 text-[14px] uppercase tracking-wider px-6 py-4 rounded-2xl transition-all duration-200 shadow-[0_8px_28px_rgba(200, 32, 26,0.4)] hover:shadow-[0_12px_36px_rgba(200, 32, 26,0.6)] group w-full"
            >
              <span className="flex items-center gap-2">
                <Bike className="w-4 h-4" />
                Order Delivery Now
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};

export default DeliveryAreas;
