import React, { useEffect, useRef } from 'react';
import { Flame } from 'lucide-react';

const InfoSection: React.FC = () => {
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
    <section ref={sectionRef} className="bg-[#2b1200] py-24 md:py-32 overflow-hidden relative">
      {/* Gold glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 rounded-full bg-[#d4a017]/6 blur-[80px] pointer-events-none" />

      <div className="container-custom relative z-10">

        {/* Two-column layout: Story text + Parallax image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">

          {/* Left: Text */}
          <div className="reveal-left">
            <span className="font-barlow text-[13px] font-600 uppercase tracking-[0.3em] text-[#d4a017] block mb-4">
              — our story —
            </span>
            <h2 className="font-bebas text-[52px] md:text-[72px] lg:text-[80px] text-white tracking-[0.02em] leading-[0.9] uppercase mb-8">
              Crafted<br />
              <span className="text-gradient-gold">With Passion</span>
            </h2>
            <div className="space-y-5">
              <p className="font-inter text-white/50 text-[16px] md:text-[17px] leading-[1.8]">
                Brent Street Pizza was created with one simple goal — to serve great pizza that brings people together.
              </p>
              <p className="font-inter text-white/50 text-[16px] md:text-[17px] leading-[1.8]">
                Located in the heart of Glenorchy, we make fresh, classic pizzas using quality ingredients, from Margherita and Hawaiian to favourites like The Lot and Meat Lovers.
              </p>
              <p className="font-inter text-white/50 text-[16px] leading-[1.8] pl-5 border-l-2 border-[#d4a017]/40 italic">
                Simple, delicious, and made fresh — that’s Brent Street Pizza. Proudly local, we look forward to serving the Glenorchy community. See you soon at Brent Street Pizza. 🍕
              </p>
            </div>

            <div className="flex items-center gap-6 mt-10">
              <div className="text-center">
                <p className="font-bebas text-[40px] text-white leading-none">2026</p>
                <p className="font-barlow text-[11px] uppercase tracking-wider text-white/30">Founded</p>
              </div>
              <div className="w-[1px] h-12 bg-white/10" />
              <div className="text-center">
                <p className="font-bebas text-[40px] text-white leading-none">100%</p>
                <p className="font-barlow text-[11px] uppercase tracking-wider text-white/30">Fresh Daily</p>
              </div>
              <div className="w-[1px] h-12 bg-white/10" />
              <div className="text-center">
                <p className="font-bebas text-[40px] text-white leading-none">232°C</p>
                <p className="font-barlow text-[11px] uppercase tracking-wider text-white/30">Oven Temp</p>
              </div>
            </div>
          </div>

          {/* Right: Parallax image stack */}
          <div className="reveal-right relative">
            <div className="relative aspect-[4/5] rounded-[16px] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)]">
              <img
                src="https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=900&q=90"
                alt="Artisan Pizza making"
                className="w-full h-full object-cover"
                style={{ transform: 'scale(1.1)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2b1200]/60 to-transparent" />

              {/* Floating badge */}
              <div className="absolute bottom-6 left-6 right-6 bg-[#1a0a00]/80 backdrop-blur-md border border-white/10 rounded-[10px] p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#C0392B]/20 border border-[#C0392B]/40 flex items-center justify-center flex-shrink-0">
                  <Flame className="w-5 h-5 text-[#C0392B]" />
                </div>
                <div>
                  <p className="font-barlow font-700 text-[14px] uppercase tracking-wider text-white">Fresh Pizza. Fast Delivery.</p>
                  <p className="font-inter text-[12px] text-white/40">Always Delicious since 2026</p>
                </div>
              </div>
            </div>

            {/* Decorative element */}
            <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full border border-[#d4a017]/20 animate-spin-slow hidden md:block" />
          </div>
        </div>

        {/* Divider */}
        <div className="divider-gold" />

      </div>
    </section>
  );
};

export default InfoSection;
