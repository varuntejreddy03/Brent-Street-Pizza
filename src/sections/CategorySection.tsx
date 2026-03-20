import React from 'react';
import { Link } from 'react-router-dom';
import { Pizza, IceCream, CakeSlice, ArrowRight } from 'lucide-react';

const categories = [
  {
    id: 'cat-pizza',
    name: 'PIZZA',
    sub: 'Hand-stretched perfection',
    icon: Pizza,
    link: '/menu?cat=cat-pizza',
    color: '#C0392B',
    gradient: 'from-[#C0392B]/20 to-transparent',
    img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=90',
  },
  {
    id: 'cat-icecream',
    name: 'ICE CREAM',
    sub: 'Premium artisan ice cream',
    icon: IceCream,
    link: '/menu?cat=cat-icecream',
    color: '#d4a017',
    gradient: 'from-[#d4a017]/20 to-transparent',
    img: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=800&q=90',
  },
  {
    id: 'cat-desserts',
    name: 'DESSERTS',
    sub: 'Sweet Italian indulgence',
    icon: CakeSlice,
    link: '/menu?cat=cat-desserts',
    color: '#C0392B',
    gradient: 'from-[#C0392B]/20 to-transparent',
    img: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=90',
  },
];

const CategorySection: React.FC = () => {
  return (
    <section className="bg-[#2b1200] py-0">
      <div className="grid grid-cols-1 md:grid-cols-3 h-auto md:h-[320px]">
        {categories.map((cat, idx) => (
          <Link
            key={cat.id}
            to={cat.link}
            className="group relative overflow-hidden flex items-end justify-start h-[220px] md:h-full cursor-pointer"
            style={{ borderRight: idx < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
          >
            {/* Background image */}
            <img
              src={cat.img}
              alt={cat.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a0a00]/90 via-[#1a0a00]/50 to-transparent" />

            {/* Color glow on hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: `radial-gradient(ellipse at bottom left, ${cat.color}30, transparent 70%)` }}
            />

            {/* Content */}
            <div className="relative z-10 p-8 flex flex-col gap-1">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{ background: `${cat.color}30`, border: `1px solid ${cat.color}50` }}
                >
                  <cat.icon className="w-5 h-5" style={{ color: cat.color }} strokeWidth={1.5} />
                </div>
              </div>
              <h3
                className="font-bebas text-[40px] md:text-[48px] leading-none text-white tracking-wider group-hover:translate-x-1 transition-transform duration-300"
              >
                {cat.name}
              </h3>
              <p className="font-barlow text-[13px] font-400 uppercase tracking-[0.15em] text-white/40 group-hover:text-white/70 transition-colors duration-300">
              </p>

              {/* Explore arrow */}
              <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400">
                <span className="font-barlow text-[12px] font-700 uppercase tracking-[0.15em]" style={{ color: cat.color }}>
                  Explore
                </span>
                <ArrowRight className="w-4 h-4" style={{ color: cat.color }} />
              </div>
            </div>

            {/* Bottom accent line */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[2px] transition-all duration-500 opacity-0 group-hover:opacity-100"
              style={{ background: `linear-gradient(90deg, ${cat.color}, transparent)` }}
            />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
