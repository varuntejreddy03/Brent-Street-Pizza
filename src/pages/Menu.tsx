import { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Phone, Star, ArrowRight, Plus, Check } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useMenu } from '../context/MenuContext';
import { useCart } from '../context/CartContext';
import CartWidget from '../components/CartWidget';
import CustomizationModal from '../components/CustomizationModal';
import { type MenuItem } from '../types/menu';

// Badge config — keyed by item id
const BADGES: Record<string, { label: string; color: string }> = {
  'pizza-super-supreme': { label: 'POPULAR', color: 'from-[#C8201A] to-[#9E1510]' },
  'pizza-meat-lovers':   { label: 'POPULAR', color: 'from-[#C8201A] to-[#9E1510]' },
  'pizza-tandoori-chicken': { label: "CHEF'S PICK", color: 'from-[#D4952A] to-[#D4952A]' },
  'pizza-margherita':    { label: 'CLASSIC', color: 'from-[#D4952A] to-[#D4952A]' },
};

const RATINGS: Record<string, number> = {
  'pizza-super-supreme': 4.9, 'pizza-meat-lovers': 4.9, 'pizza-margherita': 4.8,
  'pizza-tandoori-chicken': 4.9, 'pizza-pepperoni': 4.8, 'pizza-bbq-chicken-classic': 4.7,
};

export default function Menu() {
  const { cartItems, addToCart, incrementItem, decrementItem, cartTotalItems, cartTotalPrice } = useCart();
  const { categories, menuItems } = useMenu();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [preselectedSize, setPreselectedSize] = useState<string>('');
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>('pickup');
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || '');

  // Scroll progress bar
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const progress = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
      setScrollProgress(Math.min(100, progress));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('cat');
    const tab = params.get('tab');
    if (tab === 'delivery') {
      setOrderType('delivery');
      setIsCartOpen(true);
    }
    if (cat) {
      setTimeout(() => document.getElementById(cat)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  // Active category tracker
  useEffect(() => {
    const onScroll = () => {
      for (const cat of [...categories].reverse()) {
        const el = document.getElementById(cat.id);
        if (el && el.getBoundingClientRect().top <= 160) {
          setActiveCategory(cat.id);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [categories]);

  const openModal = (item: MenuItem, size?: string) => {
    setPreselectedSize(size || item.sizes?.[0]?.name || '');
    setCustomizingItem(item);
  };

  const handleQuickAdd = (item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.sizes?.length || item.hasPizzaExtras || item.toppings?.length) {
      openModal(item);
    } else {
      addToCart(item);
      setJustAdded(item.id);
      setTimeout(() => setJustAdded(null), 1800);
    }
  };

  return (
    <div className="bg-[#FDF8F2] min-h-screen text-[#2B2B2B] relative">

      {/* ── Scroll progress bar ─────────────────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-[999] h-[3px] bg-[#1A1A1A]/5">
        <div
          className="h-full bg-gradient-to-r from-[#C8201A] via-[#C8201A] to-[#D4952A] transition-all duration-100"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <CartWidget
        items={cartItems}
        isOpen={isCartOpen}
        orderType={orderType}
        onOrderTypeChange={setOrderType}
        onClose={() => setIsCartOpen(false)}
        onIncrement={incrementItem}
        onDecrement={decrementItem}
      />

      <CustomizationModal
        item={customizingItem}
        isOpen={!!customizingItem}
        preselectedSize={preselectedSize}
        onClose={() => setCustomizingItem(null)}
        onAddToCart={(item, customizations) => {
          addToCart(item, customizations);
          setIsCartOpen(true);
        }}
      />

      {/* ── Menu Hero ───────────────────────────────────────────────────── */}
      <div className="relative w-full h-[42vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <img src="/heropic.jpeg" alt="Menu" className="absolute inset-0 w-full h-full object-cover opacity-25 scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FDF8F2] via-[#FDF8F2]/70 to-[#FDF8F2]/20" />
        <div className="relative z-10 text-center px-4">
          <span className="font-barlow text-[12px] font-700 uppercase tracking-[0.35em] text-[#D4952A] block mb-3">
            — Fresh · Authentic · Made to Order —
          </span>
          <h1 className="font-bebas text-[72px] md:text-[110px] text-[#1A1A1A] leading-none tracking-wider drop-shadow-2xl">
            OUR MENU
          </h1>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#C8201A]" />
            <span className="font-barlow text-[11px] font-700 uppercase tracking-[0.3em] text-[#555555]">Brent Street Pizza</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#C8201A]" />
          </div>
        </div>
      </div>

      {/* ── Sticky category nav ─────────────────────────────────────────── */}
      <div className="sticky top-[3px] z-30 w-full bg-[#FDF8F2]/98 backdrop-blur-xl border-b border-[#E8D8C8]">
        <div className="container-custom flex items-center gap-1.5 py-3 overflow-x-auto hide-scroll">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                document.getElementById(cat.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                setActiveCategory(cat.id);
              }}
              className={`flex-shrink-0 font-barlow text-[12px] font-700 uppercase tracking-wider px-4 py-2 rounded-full border transition-all duration-250 ${
                activeCategory === cat.id
                  ? 'bg-[#C8201A] border-[#C8201A] text-white shadow-[0_0_16px_rgba(200, 32, 26,0.45)]'
                  : 'border-[#E8D8C8] text-[#555555] hover:border-[#E8D8C8] hover:text-[#555555] hover:bg-[#1A1A1A]/5'
              }`}
            >
              {cat.name}
            </button>
          ))}
          <div className="ml-auto flex-shrink-0">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-[#C8201A] hover:bg-[#9E1510] text-[#FFFCF7] font-barlow font-700 text-[12px] uppercase tracking-wider px-4 py-2 rounded-full transition-all hover:shadow-[0_0_18px_rgba(200, 32, 26,0.5)] hover:-translate-y-0.5"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              My Order
              {cartTotalItems > 0 && (
                <>
                  <span className="bg-white text-[#C8201A] text-[10px] font-black w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center">
                    {cartTotalItems}
                  </span>
                  {/* Pulsing dot */}
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#D4952A] animate-pulse" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Menu sections ───────────────────────────────────────────────── */}
      <div className="container-custom pt-14 pb-32 px-4" ref={menuRef}>
        {categories.map((category) => (
          <div key={category.id} id={category.id} className="mb-24 scroll-mt-36">

            {/* Category heading */}
            <div className="flex items-end gap-5 mb-10">
              <div>
                <span className="font-barlow text-[11px] font-700 uppercase tracking-[0.3em] text-[#D4952A] block mb-1.5">
                  — {category.name} —
                </span>
                <h2 className="font-bebas text-[52px] md:text-[68px] text-[#1A1A1A] tracking-wider leading-none">
                  {category.name}
                </h2>
              </div>
              <div className="flex-grow h-px bg-gradient-to-r from-white/8 to-transparent mb-3 hidden sm:block" />
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {menuItems.filter(item => item.categoryId === category.id).map((item) => {
                const badge = BADGES[item.id];
                const rating = RATINGS[item.id] ?? 4.8;
                const isJustAdded = justAdded === item.id;

                return (
                  <div
                    key={item.id}
                    onClick={() => openModal(item)}
                    className="group relative bg-white rounded-2xl border border-transparent shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col cursor-pointer
                      hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] hover:border-[#1A1A1A]/10 hover:-translate-y-1.5
                      transition-all duration-300"
                  >
                    {/* ── Image (60% of card) ── */}
                    <div className="relative overflow-hidden" style={{ paddingBottom: '62%' }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                      />
                      {/* Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#FFFCF7] via-[#FFFCF7]/20 to-transparent" />

                      {/* Hover overlay: CUSTOMIZE → */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-[#C8201A] text-white rounded-full px-6 py-2.5 flex items-center gap-2 shadow-xl translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                          <span className="font-barlow text-[14px] font-800 uppercase tracking-widest">Customize</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Badge ribbon */}
                      {badge && (
                        <div className="absolute top-0 left-0 overflow-hidden w-[90px] h-[90px] pointer-events-none">
                          <div className={`absolute bg-gradient-to-r ${badge.color} text-white font-barlow font-700 text-[10px] uppercase tracking-wider
                            -left-[22px] top-[18px] w-[110px] text-center py-1 shadow-lg rotate-[-45deg]`}>
                            {badge.label}
                          </div>
                        </div>
                      )}

                      {/* Rating */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1 border border-[#E8D8C8]">
                        <Star className="w-3 h-3 fill-[#D4952A] text-[#D4952A]" />
                        <span className="font-barlow text-[11px] font-700 text-[#2B2B2B]">{rating}</span>
                      </div>

                      {/* Tags */}
                      <div className="absolute bottom-3 right-3 flex gap-1.5">
                        {item.tags?.isSpicy && (
                          <span className="bg-[#C8201A]/85 backdrop-blur-sm text-[#FFFCF7] font-barlow text-[9px] font-700 uppercase tracking-wider px-2 py-0.5 rounded-full">🌶 Hot</span>
                        )}
                        {item.tags?.isVegan && (
                          <span className="bg-emerald-700/85 backdrop-blur-sm text-[#2B2B2B] font-barlow text-[9px] font-700 uppercase tracking-wider px-2 py-0.5 rounded-full">🌿 Vegan</span>
                        )}
                      </div>
                    </div>

                    {/* ── Card body ── */}
                    <div className="p-4 flex flex-col flex-grow gap-2.5">
                      {/* Name + price */}
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bebas text-[26px] tracking-wide text-[#1A1A1A] leading-none flex-1">
                          {item.name}
                        </h3>
                        <span className="font-bebas text-[24px] text-[#C8201A] leading-none flex-shrink-0 bg-[#C8201A]/10 px-3 py-1 rounded-lg">
                          ${item.sizes?.[0]?.price ?? item.price}
                        </span>
                      </div>

                      <p className="font-inter text-[12px] text-[#555555] leading-relaxed line-clamp-2 flex-grow">
                        {item.description}
                      </p>

                      {/* Size pills */}
                      {item.sizes && item.sizes.length > 0 && (
                        <div className="flex gap-1.5 mt-0.5">
                          {item.sizes.map(size => (
                            <button
                              key={size.name}
                              onClick={(e) => { e.stopPropagation(); openModal(item, size.name); }}
                              className="flex-1 flex flex-col items-center py-1.5 rounded-lg bg-[#F5F5F5]
                                hover:bg-[#1A1A1A] hover:text-white
                                font-barlow text-[#555555] transition-all duration-200 group/size"
                            >
                              <span className="text-[10px] font-800 uppercase tracking-widest">
                                {size.name[0]}
                              </span>
                              <span className="text-[11px] font-700 group-hover/size:text-white transition-colors">
                                ${size.price}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Add button */}
                      <button
                        onClick={(e) => handleQuickAdd(item, e)}
                        className={`mt-2 flex items-center justify-center gap-2 font-barlow font-800 text-[14px] uppercase tracking-widest
                          px-4 py-3 rounded-xl transition-all duration-300
                          ${isJustAdded
                            ? 'bg-emerald-600 text-white scale-95'
                            : 'bg-[#1A1A1A] text-white hover:bg-[#C8201A] hover:shadow-[0_8px_20px_rgba(200,32,26,0.4)] hover:-translate-y-0.5'
                          }`}
                      >
                        {isJustAdded ? (
                          <><Check className="w-4 h-4" /> Added!</>
                        ) : (
                          <><Plus className="w-4 h-4" /> Add to Order</>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* ── Contact CTA ─────────────────────────────────────────────── */}
        <div className="relative bg-[#FFFCF7] rounded-2xl border border-[#E8D8C8] p-10 md:p-14 text-center overflow-hidden">
          <div className="absolute inset-0 opacity-4" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/dark-leather.png')` }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-[#C8201A]/50 to-transparent" />
          <div className="relative z-10">
            <h3 className="font-bebas text-[38px] md:text-[52px] text-[#1A1A1A] tracking-wider mb-3">
              Large Order or Special Request?
            </h3>
            <p className="font-inter text-[#555555] text-[14px] mb-8 max-w-lg mx-auto leading-relaxed">
              Call us directly — we'll handle custom orders, dietary requirements, and catering personally.
            </p>
            <a href="tel:0362724004" className="inline-flex items-center gap-3 text-[#C8201A] hover:text-[#D4952A] transition-colors font-bebas text-[38px] md:text-[50px] tracking-wider group">
              <Phone className="w-8 h-8 group-hover:scale-110 transition-transform" />
              03 6272 4004
            </a>
          </div>
        </div>
      </div>

      {/* ── Mobile sticky bottom bar ────────────────────────────────────── */}
      {cartTotalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-[#FDF8F2]/98 backdrop-blur-xl border-t border-[#E8D8C8] px-4 py-3 safe-area-bottom">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full flex items-center justify-between bg-[#C8201A] hover:bg-[#9E1510] text-[#FFFCF7] font-barlow font-700 text-[14px] uppercase tracking-wider px-5 py-3.5 rounded-xl transition-all shadow-[0_8px_24px_rgba(200, 32, 26,0.45)]"
          >
            <span className="flex items-center gap-2.5">
              <span className="bg-white text-[#C8201A] text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                {cartTotalItems}
              </span>
              View Order
            </span>
            <span className="flex items-center gap-1.5">
              <span className="font-bebas text-[20px] leading-none">${cartTotalPrice.toFixed(2)}</span>
              <ArrowRight className="w-4 h-4" />
            </span>
          </button>
        </div>
      )}

      {/* ── Floating cart (desktop) ──────────────────────────────────────── */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-10 right-8 w-14 h-14 bg-[#C8201A] rounded-full shadow-[0_8px_28px_rgba(200, 32, 26,0.55)] flex items-center justify-center z-40
          hover:scale-110 hover:shadow-[0_12px_36px_rgba(200, 32, 26,0.7)] active:scale-95 transition-all text-[#FFFCF7] border-2 border-[#E8D8C8] group
          hidden sm:flex"
        aria-label="Open cart"
      >
        <ShoppingCart className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        {cartTotalItems > 0 && (
          <>
            <span className="absolute -top-1.5 -right-1.5 bg-white text-[#C8201A] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-[#C8201A]">
              {cartTotalItems}
            </span>
            <span className="absolute inset-0 rounded-full animate-ping bg-[#C8201A]/30 pointer-events-none" />
          </>
        )}
      </button>
    </div>
  );
}
