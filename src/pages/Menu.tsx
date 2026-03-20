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
  'pizza-super-supreme': { label: 'POPULAR', color: 'from-[#C0392B] to-[#8B0000]' },
  'pizza-meat-lovers':   { label: 'POPULAR', color: 'from-[#C0392B] to-[#8B0000]' },
  'pizza-tandoori-chicken': { label: "CHEF'S PICK", color: 'from-[#c9922a] to-[#8B5E00]' },
  'pizza-margherita':    { label: 'CLASSIC', color: 'from-[#c9922a] to-[#8B5E00]' },
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
    <div className="bg-[#0f0600] min-h-screen text-white relative">

      {/* ── Scroll progress bar ─────────────────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-[999] h-[3px] bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-[#C0392B] via-[#e8382a] to-[#c9922a] transition-all duration-100"
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
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0600] via-[#0f0600]/70 to-[#0f0600]/20" />
        <div className="relative z-10 text-center px-4">
          <span className="font-barlow text-[12px] font-700 uppercase tracking-[0.35em] text-[#c9922a] block mb-3">
            — Fresh · Authentic · Made to Order —
          </span>
          <h1 className="font-bebas text-[72px] md:text-[110px] text-white leading-none tracking-wider drop-shadow-2xl">
            OUR MENU
          </h1>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#C0392B]" />
            <span className="font-barlow text-[11px] font-700 uppercase tracking-[0.3em] text-white/30">Brent Street Pizza</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#C0392B]" />
          </div>
        </div>
      </div>

      {/* ── Sticky category nav ─────────────────────────────────────────── */}
      <div className="sticky top-[3px] z-30 w-full bg-[#0f0600]/98 backdrop-blur-xl border-b border-white/6">
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
                  ? 'bg-[#C0392B] border-[#C0392B] text-white shadow-[0_0_16px_rgba(192,57,43,0.45)]'
                  : 'border-white/8 text-white/45 hover:border-white/20 hover:text-white/80 hover:bg-white/4'
              }`}
            >
              {cat.name}
            </button>
          ))}
          <div className="ml-auto flex-shrink-0">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-[#C0392B] hover:bg-[#a93226] text-white font-barlow font-700 text-[12px] uppercase tracking-wider px-4 py-2 rounded-full transition-all hover:shadow-[0_0_18px_rgba(192,57,43,0.5)] hover:-translate-y-0.5"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              My Order
              {cartTotalItems > 0 && (
                <>
                  <span className="bg-white text-[#C0392B] text-[10px] font-black w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center">
                    {cartTotalItems}
                  </span>
                  {/* Pulsing dot */}
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#c9922a] animate-pulse" />
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
                <span className="font-barlow text-[11px] font-700 uppercase tracking-[0.3em] text-[#c9922a] block mb-1.5">
                  — {category.name} —
                </span>
                <h2 className="font-bebas text-[52px] md:text-[68px] text-white tracking-wider leading-none">
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
                    className="group relative bg-[#1c0c00] rounded-2xl border border-white/6 overflow-hidden flex flex-col cursor-pointer
                      hover:border-[#C0392B]/35 hover:-translate-y-2 hover:shadow-[0_24px_60px_-8px_rgba(192,57,43,0.28)]
                      transition-all duration-350"
                  >
                    {/* ── Image (60% of card) ── */}
                    <div className="relative overflow-hidden" style={{ paddingBottom: '62%' }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                      />
                      {/* Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1c0c00] via-[#1c0c00]/20 to-transparent" />

                      {/* Hover overlay: CUSTOMIZE → */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-black/55 backdrop-blur-sm rounded-full px-5 py-2.5 flex items-center gap-2 border border-white/20 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          <span className="font-barlow text-[13px] font-700 uppercase tracking-widest text-white">Customize</span>
                          <ArrowRight className="w-3.5 h-3.5 text-white" />
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
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1 border border-white/10">
                        <Star className="w-3 h-3 fill-[#c9922a] text-[#c9922a]" />
                        <span className="font-barlow text-[11px] font-700 text-white">{rating}</span>
                      </div>

                      {/* Tags */}
                      <div className="absolute bottom-3 right-3 flex gap-1.5">
                        {item.tags?.isSpicy && (
                          <span className="bg-[#C0392B]/85 backdrop-blur-sm text-white font-barlow text-[9px] font-700 uppercase tracking-wider px-2 py-0.5 rounded-full">🌶 Hot</span>
                        )}
                        {item.tags?.isVegan && (
                          <span className="bg-emerald-700/85 backdrop-blur-sm text-white font-barlow text-[9px] font-700 uppercase tracking-wider px-2 py-0.5 rounded-full">🌿 Vegan</span>
                        )}
                      </div>
                    </div>

                    {/* ── Card body ── */}
                    <div className="p-4 flex flex-col flex-grow gap-2.5">
                      {/* Name + price */}
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bebas text-[24px] tracking-widest text-white leading-none flex-1">
                          {item.name}
                        </h3>
                        <span className="font-bebas text-[22px] text-[#c9922a] leading-none flex-shrink-0">
                          ${item.sizes?.[0]?.price ?? item.price}
                        </span>
                      </div>

                      <p className="font-inter text-[12px] text-white/38 leading-relaxed line-clamp-2 flex-grow">
                        {item.description}
                      </p>

                      {/* Size pills */}
                      {item.sizes && item.sizes.length > 0 && (
                        <div className="flex gap-1.5 mt-0.5">
                          {item.sizes.map(size => (
                            <button
                              key={size.name}
                              onClick={(e) => { e.stopPropagation(); openModal(item, size.name); }}
                              className="flex-1 flex flex-col items-center py-1.5 rounded-lg border border-white/10 bg-white/4
                                hover:border-[#C0392B]/60 hover:bg-[#C0392B]/10 hover:text-white
                                font-barlow text-white/50 transition-all duration-200 group/size"
                            >
                              <span className="text-[9px] font-700 uppercase tracking-wider">
                                {size.name[0]}
                              </span>
                              <span className="text-[11px] font-700 group-hover/size:text-[#c9922a] transition-colors">
                                ${size.price}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Add button */}
                      <button
                        onClick={(e) => handleQuickAdd(item, e)}
                        className={`mt-1 flex items-center justify-center gap-2 font-barlow font-700 text-[13px] uppercase tracking-wider
                          px-4 py-2.5 rounded-full transition-all duration-300
                          ${isJustAdded
                            ? 'bg-emerald-600 border-emerald-600 text-white scale-95'
                            : 'bg-transparent border border-white/12 text-white/60 hover:bg-[#C0392B] hover:border-[#C0392B] hover:text-white hover:shadow-[0_0_16px_rgba(192,57,43,0.4)] hover:scale-[1.02]'
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
        <div className="relative bg-[#1c0c00] rounded-2xl border border-white/6 p-10 md:p-14 text-center overflow-hidden">
          <div className="absolute inset-0 opacity-4" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/dark-leather.png')` }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-[#C0392B]/50 to-transparent" />
          <div className="relative z-10">
            <h3 className="font-bebas text-[38px] md:text-[52px] text-white tracking-wider mb-3">
              Large Order or Special Request?
            </h3>
            <p className="font-inter text-white/35 text-[14px] mb-8 max-w-lg mx-auto leading-relaxed">
              Call us directly — we'll handle custom orders, dietary requirements, and catering personally.
            </p>
            <a href="tel:0455123678" className="inline-flex items-center gap-3 text-[#C0392B] hover:text-[#c9922a] transition-colors font-bebas text-[38px] md:text-[50px] tracking-wider group">
              <Phone className="w-8 h-8 group-hover:scale-110 transition-transform" />
              0455 123 678
            </a>
          </div>
        </div>
      </div>

      {/* ── Mobile sticky bottom bar ────────────────────────────────────── */}
      {cartTotalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-[#0f0600]/98 backdrop-blur-xl border-t border-white/8 px-4 py-3 safe-area-bottom">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full flex items-center justify-between bg-[#C0392B] hover:bg-[#a93226] text-white font-barlow font-700 text-[14px] uppercase tracking-wider px-5 py-3.5 rounded-xl transition-all shadow-[0_8px_24px_rgba(192,57,43,0.45)]"
          >
            <span className="flex items-center gap-2.5">
              <span className="bg-white text-[#C0392B] text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center">
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
        className="fixed bottom-10 right-8 w-14 h-14 bg-[#C0392B] rounded-full shadow-[0_8px_28px_rgba(192,57,43,0.55)] flex items-center justify-center z-40
          hover:scale-110 hover:shadow-[0_12px_36px_rgba(192,57,43,0.7)] active:scale-95 transition-all text-white border-2 border-white/15 group
          hidden sm:flex"
        aria-label="Open cart"
      >
        <ShoppingCart className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        {cartTotalItems > 0 && (
          <>
            <span className="absolute -top-1.5 -right-1.5 bg-white text-[#C0392B] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-[#C0392B]">
              {cartTotalItems}
            </span>
            <span className="absolute inset-0 rounded-full animate-ping bg-[#C0392B]/30 pointer-events-none" />
          </>
        )}
      </button>
    </div>
  );
}
