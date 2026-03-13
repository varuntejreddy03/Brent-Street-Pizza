import { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Phone, Star, ArrowRight, ShoppingBag, Plus } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useMenu } from '../context/MenuContext';
import { useCart } from '../context/CartContext';
import CartWidget from '../components/CartWidget';
import CustomizationModal from '../components/CustomizationModal';
import { type MenuItem } from '../types/menu';

const RATINGS: Record<string, number> = {
  'pizza-1': 4.9, 'pizza-2': 4.8, 'pizza-3': 4.9, 'pizza-4': 4.7,
  'gelato-1': 4.8, 'gelato-2': 4.9, 'gelato-3': 4.7,
  'dessert-1': 4.9, 'dessert-2': 4.8,
};

export default function Menu() {
  const { cartItems, addToCart, incrementItem, decrementItem, cartTotalItems } = useCart();
  const { categories, menuItems } = useMenu();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || '');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('cat');
    if (cat) {
      setTimeout(() => {
        document.getElementById(cat)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  // Track active category on scroll
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
  }, []);

  return (
    <div className="bg-[#1a0a00] min-h-screen text-white relative">

      {/* Cart Widget Sidebar */}
      <CartWidget
        items={cartItems}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onIncrement={incrementItem}
        onDecrement={decrementItem}
      />

      {/* Customization Modal */}
      <CustomizationModal
        item={customizingItem}
        isOpen={!!customizingItem}
        onClose={() => setCustomizingItem(null)}
        onAddToCart={(item, customizations) => {
          addToCart(item, customizations);
          setIsCartOpen(true);
        }}
      />

      {/* Menu Hero */}
      <div className="relative w-full h-[45vh] min-h-[320px] flex items-center justify-center overflow-hidden">
        <img
          src="/heropic.jpeg"
          alt="Menu"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a0a00] via-[#1a0a00]/60 to-[#1a0a00]/30" />
        <div className="relative z-10 text-center px-4">
          <span className="font-barlow text-[13px] font-600 uppercase tracking-[0.3em] text-[#d4a017] block mb-3">
            — Fresh &amp; Authentic —
          </span>
          <h1 className="font-bebas text-[80px] md:text-[120px] text-white leading-none tracking-wider drop-shadow-2xl">
            OUR MENU
          </h1>
          <div className="w-20 h-[3px] bg-gradient-to-r from-[#C0392B] via-[#d4a017] to-transparent mx-auto mt-5" />
        </div>
      </div>

      {/* Sticky Category Nav */}
      <div className="sticky top-[68px] z-30 w-full bg-[#1a0a00]/95 backdrop-blur-md border-b border-white/5 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
        <div className="container-custom flex items-center gap-2 py-4 overflow-x-auto hide-scroll">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                document.getElementById(cat.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                setActiveCategory(cat.id);
              }}
              className={`flex-shrink-0 font-barlow text-[13px] font-700 uppercase tracking-wider px-5 py-2 rounded-full border transition-all duration-300 ${activeCategory === cat.id
                ? 'bg-[#C0392B] border-[#C0392B] text-white shadow-[0_0_12px_rgba(192,57,43,0.4)]'
                : 'border-white/10 text-white/50 hover:border-white/25 hover:text-white'
                }`}
            >
              {cat.name}
            </button>
          ))}

          {/* Cart quick access */}
          <div className="ml-auto flex-shrink-0">
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 bg-[#C0392B] hover:bg-[#a93226] text-white font-barlow font-700 text-[13px] uppercase tracking-wider px-5 py-2 rounded-full transition-all hover:shadow-[0_0_15px_rgba(192,57,43,0.4)] hover:-translate-y-0.5"
            >
              <ShoppingCart className="w-4 h-4" />
              My Order
              {cartTotalItems > 0 && (
                <span className="bg-white text-[#C0392B] text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                  {cartTotalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Direct Order CTA strip */}
      <div className="bg-[#d4a017]/10 border-b border-[#d4a017]/20 py-3">
        <div className="container-custom flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-barlow text-[13px] font-600 text-[#d4a017]">
            🎁 Order direct today &amp; get <strong>FREE garlic bread</strong> on us
          </p>
          <Link
            to="/"
            className="font-barlow text-[12px] font-700 uppercase tracking-wider text-white/40 hover:text-white/70 transition-colors flex items-center gap-1"
          >
            Learn more <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="container-custom pt-16 pb-24 px-4" ref={menuRef}>
        {categories.map((category) => (
          <div key={category.id} id={category.id} className="mb-28 scroll-mt-40">

            {/* Category heading */}
            <div className="flex items-center gap-5 mb-12">
              <div>
                <span className="font-barlow text-[12px] font-600 uppercase tracking-[0.25em] text-[#d4a017] block mb-1">
                  — {category.name} —
                </span>
                <h2 className="font-bebas text-[48px] md:text-[60px] text-white tracking-wider leading-none">
                  {category.name}
                </h2>
              </div>
              <div className="flex-grow h-[1px] bg-gradient-to-r from-white/10 to-transparent hidden sm:block" />
            </div>

            {/* Items grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {menuItems.filter(item => item.categoryId === category.id).map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-[#2b1200] rounded-[14px] border border-white/5 overflow-hidden flex flex-col hover:border-[#C0392B]/30 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_-10px_rgba(192,57,43,0.25)] transition-all duration-400"
                >
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2b1200]/80 via-transparent to-transparent" />

                    {/* Price badge */}
                    <div className="absolute top-3 left-3 bg-[#C0392B] text-white font-bebas text-[18px] px-3 py-0.5 rounded shadow-lg">
                      ${item.price.toFixed(0)}
                    </div>

                    {/* Rating */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-[#1a0a00]/80 backdrop-blur-sm rounded-full px-2.5 py-1">
                      <Star className="w-3 h-3 fill-[#d4a017] text-[#d4a017]" />
                      <span className="font-barlow text-[11px] font-700 text-white">{RATINGS[item.id] ?? 4.8}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-grow gap-3">
                    <h3 className="font-bebas text-[22px] tracking-widest text-white leading-none">{item.name}</h3>
                    <p className="font-inter text-[13px] text-white/40 leading-relaxed line-clamp-2 flex-grow">{item.description}</p>

                    <button
                      onClick={() => {
                        if ((item.sizes && item.sizes.length > 0) || item.hasPizzaExtras || (item.toppings && item.toppings.length > 0)) {
                          setCustomizingItem(item);
                        } else {
                          addToCart(item);
                          setIsCartOpen(true);
                        }
                      }}
                      id={`menu-add-${item.id}`}
                      className="flex items-center justify-between bg-white/5 hover:bg-[#C0392B] border border-white/10 hover:border-[#C0392B] text-white font-barlow text-[13px] font-700 uppercase tracking-wider px-4 py-3 rounded-[8px] transition-all duration-300 group/btn mt-auto"
                    >
                      <span className="flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 opacity-60 group-hover/btn:opacity-100" />
                        Add to Order
                      </span>
                      <Plus className="w-4 h-4 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Contact section in menu */}
        <div className="relative bg-[#2b1200] rounded-[20px] border border-white/8 p-10 md:p-14 text-center overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/dark-leather.png')` }} />
          <div className="relative z-10">
            <h3 className="font-bebas text-[36px] md:text-[48px] text-white tracking-wider mb-3">
              Large Order or Special Request?
            </h3>
            <p className="font-inter text-white/40 text-[15px] mb-8 max-w-lg mx-auto">
              Call us directly — we'll take care of custom orders, dietary requirements, and catering enquiries personally.
            </p>
            <a
              href="tel:0455123678"
              className="inline-flex items-center gap-3 text-[#C0392B] hover:text-[#d4a017] transition-colors font-bebas text-[36px] md:text-[48px] tracking-wider group"
            >
              <Phone className="w-8 h-8 group-hover:scale-110 transition-transform" />
              0455 123 678
            </a>
          </div>
        </div>
      </div>

      {/* Floating cart button */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-20 right-5 sm:bottom-10 sm:right-8 w-14 h-14 bg-[#C0392B] rounded-full shadow-[0_8px_25px_rgba(192,57,43,0.5)] flex items-center justify-center z-40 hover:scale-110 hover:shadow-[0_12px_35px_rgba(192,57,43,0.7)] active:scale-95 transition-all text-white border-2 border-white/20 group"
        id="floating-cart-btn"
        aria-label="Open cart"
      >
        <ShoppingCart className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        {cartTotalItems > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-white text-[#C0392B] text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-[#C0392B]">
            {cartTotalItems}
          </span>
        )}
      </button>
    </div>
  );
}
