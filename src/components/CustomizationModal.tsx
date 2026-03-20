import React, { useState, useEffect, useRef } from 'react';
import {
  X, ChevronDown, Check, ShoppingBag, ArrowRight,
  Minus, Plus, Flame, Leaf, Star,
} from 'lucide-react';
import { type MenuItem } from '../types/menu';
import { useMenu } from '../context/MenuContext';

interface Props {
  item: MenuItem | null;
  isOpen: boolean;
  preselectedSize?: string;
  onClose: () => void;
  onAddToCart: (item: MenuItem, customizations: any) => void;
}

const CAT_ICONS: Record<string, string> = {
  sauce: '🫙', cheese: '🧀', veggies: '🥦', meat: '🥩', seafood: '🦐', garnish: '🌿',
};

const RATINGS: Record<string, number> = {
  'pizza-super-supreme': 4.9, 'pizza-meat-lovers': 4.9, 'pizza-margherita': 4.8,
  'pizza-tandoori-chicken': 4.9, 'pizza-pepperoni': 4.8,
};

// ─── Label component ─────────────────────────────────────────────────────────
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="font-barlow text-[10px] font-700 uppercase tracking-[0.28em] text-[#c9922a] whitespace-nowrap">
        {children}
      </span>
      <div className="flex-1 h-px bg-gradient-to-r from-[#c9922a]/20 to-transparent" />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
const CustomizationModal: React.FC<Props> = ({
  item, isOpen, preselectedSize, onClose, onAddToCart,
}) => {
  const { extras } = useMenu();
  const [selectedSize, setSelectedSize] = useState('');
  const [removedToppings, setRemovedToppings] = useState<Set<string>>(new Set());
  const [addedExtras, setAddedExtras] = useState<Map<string, { name: string; price: number }>>(new Map());
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [visible, setVisible] = useState(false);
  const rightPanelRef = useRef<HTMLDivElement>(null);

  // Reset on open
  useEffect(() => {
    if (item && isOpen) {
      setSelectedSize(preselectedSize || item.sizes?.[0]?.name || '');
      setRemovedToppings(new Set());
      setAddedExtras(new Map());
      setOpenAccordion(null);
      setQuantity(1);
      rightPanelRef.current?.scrollTo({ top: 0 });
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    } else {
      setVisible(false);
    }
  }, [item, isOpen, preselectedSize]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen || !item) return null;

  // ── Derived values ──────────────────────────────────────────────────────────
  const sizeObj = item.sizes?.find(s => s.name === selectedSize);
  const basePrice = sizeObj?.price ?? item.price;
  let extrasTotal = 0;
  addedExtras.forEach(e => { extrasTotal += e.price; });
  const orderTotal = (basePrice + extrasTotal) * quantity;
  const rating = RATINGS[item.id] ?? 4.8;
  const pizzaExtras = item.hasPizzaExtras ? extras : [];

  // ── Handlers ────────────────────────────────────────────────────────────────
  const toggleTopping = (t: string) => {
    const n = new Set(removedToppings);
    n.has(t) ? n.delete(t) : n.add(t);
    setRemovedToppings(n);
  };

  const toggleExtra = (name: string, price: number) => {
    const n = new Map(addedExtras);
    n.has(name) ? n.delete(name) : n.set(name, { name, price });
    setAddedExtras(n);
  };

  const handleAdd = () => {
    onAddToCart(item, {
      size: selectedSize || undefined,
      price: basePrice,
      removedToppings: Array.from(removedToppings),
      addedExtras: Array.from(addedExtras.values()),
      quantity,
    });
    onClose();
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4">

      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/82 backdrop-blur-sm transition-opacity duration-300
          ${visible ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/*
        ── Modal shell ──────────────────────────────────────────────────────────
        Mobile  : single column, full-width sheet from bottom
        Desktop : two-column card, max-w-[900px], fixed height
      */}
      <div
        className={`relative w-full flex flex-col
          sm:max-w-[900px] sm:rounded-2xl sm:overflow-hidden
          bg-[#110700] border border-white/8
          shadow-[0_40px_120px_rgba(0,0,0,0.9)]
          transition-all duration-400 ease-[cubic-bezier(0.32,0.72,0,1)]
          /* mobile: sheet slides up */
          max-h-[96dvh] rounded-t-2xl overflow-hidden
          /* desktop: fixed height so both columns are equal */
          sm:h-[620px] sm:max-h-[90vh]
          ${visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 sm:translate-y-4 scale-[0.97]'}`}
      >

        {/*
          ── Two-column body (desktop) / stacked (mobile) ─────────────────────
          On desktop: flex-row, left panel 40%, right panel 60%
          On mobile:  flex-col, image hero on top, scroll below
        */}
        <div className="flex flex-col sm:flex-row flex-1 min-h-0">

          {/* ════════════════════════════════════════════════════════════════
              LEFT PANEL — fixed image, always visible on desktop
              On mobile this becomes a compact hero at the top
          ════════════════════════════════════════════════════════════════ */}
          <div className="relative sm:w-[40%] flex-shrink-0 sm:flex-shrink-0
            /* mobile: fixed height hero */
            h-[200px]
            /* desktop: full panel height */
            sm:h-auto sm:self-stretch overflow-hidden">

            {/* Pizza image — fills entire panel */}
            <img
              src={item.image}
              alt={item.name}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Dark gradient — bottom-heavy so text is readable */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />
            {/* Right-edge fade into modal body on desktop */}
            <div className="absolute inset-0 hidden sm:block bg-gradient-to-r from-transparent via-transparent to-[#110700]/60" />

            {/* Close button — top-right of left panel */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full
                bg-black/55 backdrop-blur-md border border-white/15
                flex items-center justify-center
                text-white/60 hover:text-white hover:bg-black/80 hover:border-white/30
                transition-all duration-200"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Dietary badges — top-left */}
            <div className="absolute top-4 left-4 flex gap-1.5 z-10">
              {item.tags?.isSpicy && (
                <span className="flex items-center gap-1 bg-[#C0392B]/90 backdrop-blur-sm
                  text-white font-barlow text-[10px] font-700 uppercase tracking-wider
                  px-2.5 py-1 rounded-full">
                  <Flame className="w-3 h-3" /> Spicy
                </span>
              )}
              {item.tags?.isVegan && (
                <span className="flex items-center gap-1 bg-emerald-600/90 backdrop-blur-sm
                  text-white font-barlow text-[10px] font-700 uppercase tracking-wider
                  px-2.5 py-1 rounded-full">
                  <Leaf className="w-3 h-3" /> Vegan
                </span>
              )}
            </div>

            {/* Name + meta — pinned to bottom of image panel */}
            <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 z-10">
              {/* "Customize your order" eyebrow */}
              <p className="font-barlow text-[10px] font-700 uppercase tracking-[0.3em] text-[#c9922a] mb-1">
                Customize Your Order
              </p>

              {/* Pizza name */}
              <h2 className="font-bebas text-[36px] sm:text-[42px] text-white tracking-widest leading-none mb-2">
                {item.name}
              </h2>

              {/* Rating row */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2.5 py-1 border border-white/10">
                  <Star className="w-3 h-3 fill-[#c9922a] text-[#c9922a]" />
                  <span className="font-barlow text-[11px] font-700 text-white">{rating}</span>
                </div>
                {item.sizes && item.sizes.length > 0 && (
                  <span className="font-barlow text-[11px] font-700 text-white/40 uppercase tracking-wider">
                    from ${item.sizes[0].price}
                  </span>
                )}
              </div>

              {/* Short description — desktop only */}
              <p className="hidden sm:block font-inter text-[12px] text-white/45 leading-relaxed line-clamp-3">
                {item.description}
              </p>
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════════
              RIGHT PANEL — scrollable customization area
          ════════════════════════════════════════════════════════════════ */}
          <div
            ref={rightPanelRef}
            className="flex-1 overflow-y-auto overscroll-contain
              bg-[#110700] sm:bg-[#0f0600]
              /* subtle left border on desktop */
              sm:border-l sm:border-white/6"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#C0392B #0f0600' }}
          >
            <div className="px-5 sm:px-6 pt-5 pb-4 space-y-7">

              {/* ── Size selector ─────────────────────────────────────────── */}
              {item.sizes && item.sizes.length > 0 && (
                <section>
                  <FieldLabel>Choose Size</FieldLabel>
                  <div className="grid grid-cols-3 gap-2.5">
                    {item.sizes.map(size => {
                      const active = selectedSize === size.name;
                      return (
                        <button
                          key={size.name}
                          onClick={() => setSelectedSize(size.name)}
                          className={`relative flex flex-col items-center justify-center
                            py-4 px-2 rounded-xl border-2 transition-all duration-200 overflow-hidden
                            ${active
                              ? 'border-[#C0392B] bg-[#C0392B]/12 shadow-[0_0_20px_rgba(192,57,43,0.2),inset_0_1px_0_rgba(255,255,255,0.05)]'
                              : 'border-white/8 bg-white/3 hover:border-white/16 hover:bg-white/5'
                            }`}
                        >
                          {/* Scaled pizza emoji */}
                          <span className={`mb-2 block transition-transform duration-200 leading-none
                            ${size.name === 'Small' ? 'text-[16px]' : size.name === 'Large' ? 'text-[20px]' : 'text-[24px]'}
                            ${active ? 'scale-110' : ''}`}>
                            🍕
                          </span>
                          <span className={`font-barlow text-[11px] font-700 uppercase tracking-wider mb-1 transition-colors
                            ${active ? 'text-white' : 'text-white/45'}`}>
                            {size.name}
                          </span>
                          <span className={`font-bebas text-[22px] leading-none transition-colors
                            ${active ? 'text-[#C0392B]' : 'text-white/40'}`}>
                            ${size.price}
                          </span>
                          {active && (
                            <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#C0392B]
                              flex items-center justify-center shadow-[0_0_8px_rgba(192,57,43,0.7)]">
                              <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* ── Current toppings ──────────────────────────────────────── */}
              {item.toppings && item.toppings.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-3">
                    <FieldLabel>Current Toppings</FieldLabel>
                    <span className="font-inter text-[10px] text-white/25 ml-2 flex-shrink-0">tap × to remove</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {item.toppings.map(t => {
                      const removed = removedToppings.has(t);
                      return (
                        <button
                          key={t}
                          onClick={() => toggleTopping(t)}
                          className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-full border
                            font-inter text-[12px] transition-all duration-200
                            ${removed
                              ? 'border-white/6 bg-transparent text-white/20 line-through'
                              : 'border-[#c9922a]/28 bg-[#2a1800] text-white/78 hover:border-[#C0392B]/50 hover:bg-[#C0392B]/8'
                            }`}
                        >
                          {t}
                          <span className={`text-[14px] leading-none transition-colors
                            ${removed ? 'text-white/15' : 'text-white/25 group-hover:text-[#C0392B]'}`}>
                            ×
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {removedToppings.size > 0 && (
                    <button
                      onClick={() => setRemovedToppings(new Set())}
                      className="mt-2.5 font-barlow text-[10px] font-700 uppercase tracking-wider
                        text-[#c9922a]/50 hover:text-[#c9922a] transition-colors"
                    >
                      ↺ Restore all
                    </button>
                  )}
                </section>
              )}

              {/* ── Extras accordion ──────────────────────────────────────── */}
              {pizzaExtras.length > 0 && (
                <section>
                  <FieldLabel>Add Extras</FieldLabel>
                  <div className="space-y-1.5">
                    {pizzaExtras.map(cat => {
                      const open = openAccordion === cat.id;
                      const count = cat.options.filter(o => addedExtras.has(o.name)).length;
                      return (
                        <div
                          key={cat.id}
                          className={`rounded-xl border overflow-hidden transition-colors duration-200
                            ${open ? 'border-white/12' : 'border-white/6'}`}
                        >
                          {/* Header */}
                          <button
                            onClick={() => setOpenAccordion(open ? null : cat.id)}
                            className={`w-full flex items-center justify-between px-4 py-3 transition-colors duration-200
                              ${open ? 'bg-[#1e0e00]' : 'bg-[#160900] hover:bg-[#1a0c00]'}`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-[14px]">{CAT_ICONS[cat.id] ?? '➕'}</span>
                              <span className="font-barlow text-[12px] font-700 uppercase tracking-wider text-white">
                                {cat.name}
                              </span>
                              {count > 0 && (
                                <span className="bg-[#C0392B] text-white font-barlow text-[10px] font-700
                                  px-1.5 py-0.5 rounded-full leading-none min-w-[18px] text-center">
                                  {count}
                                </span>
                              )}
                            </div>
                            <ChevronDown className={`w-4 h-4 text-white/30 transition-transform duration-300
                              ${open ? 'rotate-180 text-white/55' : ''}`} />
                          </button>

                          {/* Body */}
                          <div className={`overflow-hidden transition-all duration-300 ease-in-out
                            ${open ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="px-4 py-3.5 bg-[#0e0600] flex flex-wrap gap-1.5">
                              {cat.options.map(opt => {
                                const added = addedExtras.has(opt.name);
                                return (
                                  <button
                                    key={opt.name}
                                    onClick={() => toggleExtra(opt.name, opt.price)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border
                                      font-inter text-[11px] transition-all duration-150
                                      ${added
                                        ? 'bg-[#C0392B] border-[#C0392B] text-white shadow-[0_0_10px_rgba(192,57,43,0.3)]'
                                        : 'bg-white/4 border-white/10 text-white/55 hover:border-white/20 hover:text-white hover:bg-white/7'
                                      }`}
                                  >
                                    {added && <Check className="w-2.5 h-2.5 flex-shrink-0" strokeWidth={3} />}
                                    <span>{opt.name}</span>
                                    <span className={`font-barlow font-700 text-[10px]
                                      ${added ? 'text-white/70' : 'text-white/30'}`}>
                                      +${opt.price.toFixed(2)}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* ── Added extras summary ──────────────────────────────────── */}
              {addedExtras.size > 0 && (
                <section>
                  <FieldLabel>Your Extras</FieldLabel>
                  <div className="bg-[#160900] border border-white/7 rounded-xl p-3.5">
                    <div className="flex flex-wrap gap-1.5">
                      {Array.from(addedExtras.values()).map(e => (
                        <span
                          key={e.name}
                          className="flex items-center gap-1.5 bg-[#C0392B]/10 border border-[#C0392B]/25
                            text-white/75 font-inter text-[11px] px-2.5 py-1.5 rounded-full"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C0392B] flex-shrink-0" />
                          {e.name}
                          <span className="text-[#c9922a] font-barlow font-700 text-[10px]">
                            +${e.price.toFixed(2)}
                          </span>
                          <button
                            onClick={() => toggleExtra(e.name, e.price)}
                            className="text-white/25 hover:text-[#C0392B] transition-colors ml-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-white/7 flex justify-between items-center">
                      <span className="font-barlow text-[10px] font-700 uppercase tracking-wider text-white/30">
                        Extras Total
                      </span>
                      <span className="font-barlow text-[13px] font-700 text-[#c9922a]">
                        +${extrasTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </section>
              )}

              {/* Bottom breathing room */}
              <div className="h-1" />
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            BOTTOM ACTION BAR — full width, spans both columns
        ════════════════════════════════════════════════════════════════════ */}
        <div className="flex-shrink-0 border-t border-white/8 bg-[#0a0400]/98 backdrop-blur-xl px-5 sm:px-6 py-4">

          {/* Price breakdown — shown above controls on mobile, inline on desktop */}
          <div className="flex items-center justify-between sm:hidden mb-3">
            <span className="font-barlow text-[11px] font-700 uppercase tracking-wider text-white/30">
              {selectedSize && `${selectedSize} · `}${basePrice.toFixed(2)}
              {extrasTotal > 0 && <span className="text-[#c9922a]/60"> + ${extrasTotal.toFixed(2)} extras</span>}
            </span>
            <span className="font-bebas text-[28px] text-white leading-none">${orderTotal.toFixed(2)}</span>
          </div>

          <div className="flex items-center gap-3">

            {/* ── Quantity stepper ── */}
            <div className="flex items-center bg-[#1c0e00] border border-white/10 rounded-full overflow-hidden flex-shrink-0">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-11 h-11 flex items-center justify-center
                  text-white/40 hover:text-white hover:bg-white/6
                  transition-all active:scale-90"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-bebas text-[22px] text-white w-9 text-center leading-none select-none">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="w-11 h-11 flex items-center justify-center
                  text-white/40 hover:text-[#c9922a] hover:bg-white/6
                  transition-all active:scale-90"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* ── Price summary (desktop only, inline) ── */}
            <div className="hidden sm:flex flex-col leading-tight flex-shrink-0">
              <span className="font-barlow text-[10px] font-700 uppercase tracking-widest text-white/25">
                {selectedSize && `${selectedSize} · `}
                {extrasTotal > 0 ? `$${basePrice.toFixed(2)} + $${extrasTotal.toFixed(2)}` : `$${basePrice.toFixed(2)}`}
                {quantity > 1 && ` × ${quantity}`}
              </span>
              <span className="font-bebas text-[32px] text-white leading-none tabular-nums">
                ${orderTotal.toFixed(2)}
              </span>
            </div>

            {/* ── Add to Order button ── */}
            <button
              onClick={handleAdd}
              className="flex-1 relative flex items-center justify-between overflow-hidden
                bg-[#C0392B] hover:bg-[#a93226] active:scale-[0.98]
                text-white font-barlow font-700 text-[14px] uppercase tracking-wider
                px-5 sm:px-6 py-3.5 rounded-full
                shadow-[0_8px_28px_-4px_rgba(192,57,43,0.55)]
                hover:shadow-[0_12px_36px_-4px_rgba(192,57,43,0.72)]
                transition-all duration-200 group"
            >
              {/* Shimmer sweep on hover */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full
                transition-transform duration-700
                bg-gradient-to-r from-transparent via-white/12 to-transparent
                pointer-events-none" />

              <span className="flex items-center gap-2 relative z-10">
                <ShoppingBag className="w-4 h-4" />
                Add to Order
              </span>
              <span className="flex items-center gap-1.5 relative z-10 font-bebas text-[20px] leading-none">
                ${orderTotal.toFixed(2)}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </button>
          </div>

          {/* Removed toppings notice */}
          {removedToppings.size > 0 && (
            <p className="mt-2.5 font-inter text-[11px] text-[#C0392B]/50 text-center">
              No {Array.from(removedToppings).join(', ')}
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default CustomizationModal;
