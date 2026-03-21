import React from 'react';
import { Tag, Clock, ArrowRight, Star, Flame, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const DEALS = [
  {
    id: 'double-trouble',
    title: 'Double Trouble',
    price: '39.90',
    originalPrice: '48.50',
    description: '2 Large Pizzas + Garlic Bread + 1.25L Drink. Perfect for a cozy night in.',
    tag: 'BEST SELLER',
    icon: <Flame className="w-5 h-5" />,
    color: '#C0392B',
  },
  {
    id: 'family-feast',
    title: 'Family Feast',
    price: '54.90',
    originalPrice: '68.00',
    description: '3 Large Pizzas + 2 Garlic Breads + 2 x 1.25L Drinks. Feeds the whole crew.',
    tag: 'POPULAR',
    icon: <Star className="w-5 h-5" />,
    color: '#d4a017',
  },
  {
    id: 'lunch-special',
    title: 'Lunch Special',
    price: '14.90',
    originalPrice: '19.50',
    description: 'Any Small Pizza + Can of Drink. Available daily until 4 PM. (Pick up only)',
    tag: 'VALUE',
    icon: <Clock className="w-5 h-5" />,
    color: '#4ade80',
  },
  {
    id: 'party-pack',
    title: 'Party Pack',
    price: '89.90',
    originalPrice: '115.00',
    description: '5 Large Pizzas + 3 Garlic Breads + 3 x 1.25L Drinks. The ultimate celebration deal.',
    tag: 'ULTIMATE',
    icon: <Zap className="w-5 h-5" />,
    color: '#C0392B',
  },
];

const Deals: React.FC = () => {
  return (
    <div className="bg-[#1a0a00] min-h-screen pt-32 pb-24">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="font-barlow text-[13px] font-600 uppercase tracking-[0.4em] text-[#d4a017] block mb-4">
            — Exclusive Offers —
          </span>
          <h1 className="font-bebas text-[64px] md:text-[90px] text-white tracking-wider leading-none mb-6">
            Hot <span className="text-[#C0392B]">Deals</span>
          </h1>
          <p className="font-inter text-white/40 text-[16px] md:text-[18px] max-w-2xl mx-auto leading-relaxed">
            Grab our famous combo packs and save big. Freshly made, delivered hot, and always delicious.
          </p>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {DEALS.map((deal) => (
            <div
              key={deal.id}
              className="group relative bg-[#2b1200] border border-white/5 rounded-[20px] overflow-hidden hover:border-white/15 transition-all duration-500 hover:-translate-y-2 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)]"
            >
              <div className="p-8 md:p-10 flex flex-col h-full">
                {/* Badge */}
                <div 
                  className="absolute top-6 right-6 px-4 py-1.5 rounded-full font-barlow font-800 text-[11px] tracking-widest uppercase flex items-center gap-2"
                  style={{ backgroundColor: `${deal.color}20`, color: deal.color, border: `1px solid ${deal.color}40` }}
                >
                  {deal.icon}
                  {deal.tag}
                </div>

                <h3 className="font-bebas text-[36px] md:text-[42px] text-white tracking-wider mb-2 group-hover:text-[#d4a017] transition-colors">
                  {deal.title}
                </h3>
                
                <p className="font-inter text-white/50 text-[15px] leading-relaxed mb-8 flex-grow">
                  {deal.description}
                </p>

                <div className="flex items-end justify-between mt-auto">
                  <div className="flex flex-col">
                    <span className="font-inter text-[14px] text-white/20 line-through mb-1">
                      Was ${deal.originalPrice}
                    </span>
                    <div className="flex items-start">
                      <span className="font-bebas text-[24px] text-white mt-1 mr-1">$</span>
                      <span className="font-bebas text-[56px] text-white leading-none tracking-tighter">
                        {deal.price.split('.')[0]}
                        <span className="text-[28px] opacity-60">.{deal.price.split('.')[1]}</span>
                      </span>
                    </div>
                  </div>

                  <Link
                    to="/menu"
                    className="flex items-center justify-center w-14 h-14 rounded-full bg-white/5 hover:bg-[#C0392B] text-white transition-all duration-300 group-hover:scale-110"
                  >
                    <ArrowRight className="w-6 h-6" />
                  </Link>
                </div>
              </div>

              {/* Decorative line */}
              <div 
                className="absolute bottom-0 left-0 h-1 transition-all duration-500 w-0 group-hover:w-full"
                style={{ backgroundColor: deal.color }}
              />
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-20 text-center bg-[#2b1200]/40 border border-white/5 rounded-[24px] p-12 max-w-4xl mx-auto backdrop-blur-sm">
          <Tag className="w-10 h-10 text-[#d4a017] mx-auto mb-6" />
          <h2 className="font-bebas text-[32px] md:text-[40px] text-white tracking-wider mb-4">
            Got a large group?
          </h2>
          <p className="font-inter text-white/40 text-[15px] mb-8 max-w-md mx-auto">
            We provide specialized catering for events, parties, and offices. Contact us for a custom quote.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 font-barlow font-800 text-[14px] uppercase tracking-widest text-[#d4a017] hover:text-white transition-colors"
          >
            Inquire About Catering <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Deals;
