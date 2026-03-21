import React, { useEffect, useRef } from 'react';
import { Flame, Clock, Users, Heart } from 'lucide-react';

const About: React.FC = () => {
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
    <div className="bg-[#1a0a00] min-h-screen pt-32 pb-24 overflow-hidden relative">
      <div ref={sectionRef} className="container-custom relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20 reveal">
          <span className="font-barlow text-[13px] font-600 uppercase tracking-[0.4em] text-[#d4a017] block mb-4">
            — Our Story —
          </span>
          <h1 className="font-bebas text-[64px] md:text-[90px] text-white tracking-wider leading-none mb-6">
            Crafted <span className="text-[#C0392B]">With Passion</span>
          </h1>
          <p className="font-inter text-white/40 text-[16px] md:text-[18px] max-w-2xl mx-auto leading-relaxed">
            Welcome to Brent Street Pizza. Where every slice tells a story of tradition, quality, and local love.
          </p>
        </div>

        {/* Two-column layout: Story text + Parallax image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">

          {/* Left: Text */}
          <div className="reveal-left">
            <h2 className="font-bebas text-[42px] md:text-[52px] text-white tracking-wider leading-tight mb-8">
              A Glenorchy <br />
              <span className="text-gradient-gold">Local Favourite</span>
            </h2>
            <div className="space-y-6">
              <p className="font-inter text-white/60 text-[16px] md:text-[17px] leading-[1.8]">
                Brent Street Pizza was created with one simple goal — to serve great pizza that brings people together. We believe that good food doesn't have to be complicated, just made with the right ingredients and a lot of heart.
              </p>
              <p className="font-inter text-white/60 text-[16px] md:text-[17px] leading-[1.8]">
                Located in the heart of Glenorchy, we make fresh, classic pizzas daily. From the traditional Margherita and Hawaiian to our signature "The Lot" and "Meat Lovers," each pizza is hand-stretched and topped with the freshest local produce.
              </p>
              <p className="font-inter text-white/70 text-[16px] leading-[1.8] pl-6 border-l-2 border-[#d4a017]/40 italic bg-white/5 p-6 rounded-r-xl">
                "Simple, delicious, and made fresh — that’s our promise. Proudly independent and locally owned, we look forward to serving you."
              </p>
            </div>

            <div className="flex items-center gap-6 mt-12 bg-[#2b1200] border border-white/5 p-8 rounded-2xl">
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
            <div className="relative aspect-[4/5] rounded-[24px] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=900&q=90"
                alt="Artisan Pizza making"
                className="w-full h-full object-cover"
                style={{ transform: 'scale(1.1)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a0a00] via-transparent to-transparent opacity-80" />

              {/* Floating badge */}
              <div className="absolute bottom-8 left-8 right-8 bg-[#2b1200]/90 backdrop-blur-xl border border-white/10 rounded-[16px] p-6 flex items-center gap-5 shadow-2xl">
                <div className="w-12 h-12 rounded-full bg-[#C0392B]/20 border border-[#C0392B]/40 flex items-center justify-center flex-shrink-0">
                  <Flame className="w-6 h-6 text-[#C0392B]" />
                </div>
                <div>
                  <p className="font-bebas text-[22px] tracking-wider text-white">Freshly Baked</p>
                  <p className="font-inter text-[13px] text-white/40">Since our first day in 2026</p>
                </div>
              </div>
            </div>

            {/* Decorative element */}
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full border border-[#d4a017]/10 animate-spin-slow hidden md:block" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full border border-[#C0392B]/10 animate-pulse hidden md:block" />
          </div>
        </div>

        {/* Pillars Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {[
            { icon: <Heart className="w-8 h-8" />, title: 'Quality First', desc: 'We never compromise on our ingredients, from the dough to the last basil leaf.' },
            { icon: <Users className="w-8 h-8" />, title: 'Local Community', desc: 'As a Glenorchy local, we value our neighbours and aim to give back every day.' },
            { icon: <Clock className="w-8 h-8" />, title: 'Always Fresh', desc: 'No frozen dough. No pre-cut veggies. Everything is prepared fresh in our kitchen.' },
          ].map((pillar, i) => (
            <div key={i} className="reveal bg-[#2b1200]/50 border border-white/5 p-10 rounded-[20px] hover:border-[#d4a017]/30 transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-[#d4a017] mb-6">
                {pillar.icon}
              </div>
              <h3 className="font-bebas text-[28px] text-white tracking-wider mb-3">{pillar.title}</h3>
              <p className="font-inter text-white/40 text-[15px] leading-relaxed">{pillar.desc}</p>
            </div>
          ))}
        </div>

      </div>

      {/* Background glow effects */}
      <div className="absolute top-1/4 -left-64 w-[600px] h-[600px] bg-[#d4a017]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-64 w-[600px] h-[600px] bg-[#C0392B]/5 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
};

export default About;
