import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, ShoppingBag, ArrowRight, Trash2, MapPin, Bike, Store } from 'lucide-react';
import { type CartItem } from '../types/menu';

interface CartWidgetProps {
  items: CartItem[];
  isOpen: boolean;
  orderType: 'pickup' | 'delivery';
  onOrderTypeChange: (t: 'pickup' | 'delivery') => void;
  onClose: () => void;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
}

export default function CartWidget({
  items, isOpen, orderType, onOrderTypeChange, onClose, onIncrement, onDecrement,
}: CartWidgetProps) {
  const navigate = useNavigate();
  const subtotal = items.reduce((acc, i) => acc + Number(i.price) * i.quantity, 0);
  const isEmpty = items.length === 0;

  // Slide-in animation for new items
  const prevCountRef = useRef(items.length);
  const [newItemId, setNewItemId] = useState<string | null>(null);
  useEffect(() => {
    if (items.length > prevCountRef.current && items.length > 0) {
      setNewItemId(items[items.length - 1].id);
      setTimeout(() => setNewItemId(null), 600);
    }
    prevCountRef.current = items.length;
  }, [items]);

  const deliveryFee = orderType === 'delivery' ? 4.99 : 0;
  const total = subtotal + deliveryFee;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/65 backdrop-blur-sm z-[90] transition-opacity duration-350
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[400px] bg-[#FDF8F2] border-l border-[#E8D8C8]
          shadow-[-24px_0_80px_rgba(0,0,0,0.6)] z-[100] flex flex-col
          transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8D8C8] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#C8201A]/18 border border-[#C8201A]/35 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-[#C8201A]" />
            </div>
            <div>
              <h3 className="font-bebas text-[24px] tracking-widest text-[#1A1A1A] leading-none">Your Order</h3>
              {!isEmpty && (
                <p className="font-barlow text-[10px] font-700 text-[#555555] uppercase tracking-wider">
                  {items.reduce((a, i) => a + i.quantity, 0)} item{items.reduce((a, i) => a + i.quantity, 0) !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full border border-[#E8D8C8] hover:bg-[#1A1A1A]/5 flex items-center justify-center text-[#555555] hover:text-[#1A1A1A] transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Pickup / Delivery toggle ─────────────────────────────────────── */}
        <div className="px-5 pt-4 pb-3 flex-shrink-0">
          <div className="flex bg-[#FFFCF7] border border-[#E8D8C8] rounded-xl p-1 gap-1">
            {(['pickup', 'delivery'] as const).map(t => (
              <button
                key={t}
                onClick={() => onOrderTypeChange(t)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-barlow text-[12px] font-700 uppercase tracking-wider transition-all duration-200
                  ${orderType === t
                    ? 'bg-[#C8201A] text-white shadow-[0_2px_12px_rgba(200, 32, 26,0.4)]'
                    : 'text-[#555555] hover:text-[#1A1A1A]'
                  }`}
              >
                {t === 'pickup' ? <Store className="w-3.5 h-3.5" /> : <Bike className="w-3.5 h-3.5" />}
                {t === 'pickup' ? 'Pickup' : 'Delivery'}
              </button>
            ))}
          </div>
          {orderType === 'delivery' && (
            <p className="font-inter text-[11px] text-[#D4952A]/70 mt-2 flex items-center gap-1.5">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              Delivery fee $4.99 · 25–35 min est.
            </p>
          )}
          {orderType === 'pickup' && (
            <p className="font-inter text-[11px] text-[#555555] mt-2 flex items-center gap-1.5">
              <Store className="w-3 h-3 flex-shrink-0" />
              2 Brent Street, Glenorchy · Ready in 15–20 min
            </p>
          )}
        </div>

        {/* ── Cart Items ─────────────────────────────────────────────────── */}
        <div className="flex-grow overflow-y-auto px-5 py-4 space-y-3" style={{ scrollbarWidth: 'thin', scrollbarColor: '#C8201A #FDF8F2' }}>
          {isEmpty ? (
            <div className="h-full flex flex-col items-center justify-center gap-4 py-20">
              <div className="w-20 h-20 rounded-full bg-[#1A1A1A]/5 border border-[#E8D8C8] flex items-center justify-center">
                <ShoppingBag className="w-9 h-9 stroke-1 text-[#555555]" />
              </div>
              <div className="text-center">
                <p className="font-bebas text-[22px] tracking-widest text-[#555555]">Your cart is empty</p>
                <p className="font-inter text-[13px] text-[#555555] mt-1">Add something delicious!</p>
              </div>
            </div>
          ) : (
            items.map(item => (
              <div
                key={item.id}
                className={`group flex gap-3.5 items-start bg-[#FFFCF7] rounded-xl border border-[#E8D8C8] p-3.5
                  hover:border-[#E8D8C8] transition-all duration-300
                  ${newItemId === item.id ? 'animate-[slideInRight_0.4s_ease_forwards]' : ''}`}
              >
                <div className="w-[58px] h-[58px] rounded-lg overflow-hidden flex-shrink-0 border border-[#E8D8C8]">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-0.5">
                    <span className="font-bebas text-[17px] tracking-widest text-[#2B2B2B] leading-tight line-clamp-1">{item.name}</span>
                    <span className="font-bebas text-[18px] text-[#C8201A] leading-none flex-shrink-0">${(Number(item.price) * item.quantity).toFixed(2)}</span>
                  </div>
                  <div className="mb-2.5 space-y-0.5">
                    {item.size && <p className="font-barlow text-[10px] font-700 uppercase tracking-widest text-[#D4952A]">{item.size}</p>}
                    {item.addedExtras && item.addedExtras.length > 0 && (
                      <p className="font-inter text-[11px] text-[#555555] leading-snug">+ {item.addedExtras.map(e => e.name).join(', ')}</p>
                    )}
                    {item.removedToppings && item.removedToppings.length > 0 && (
                      <p className="font-inter text-[11px] text-[#C8201A]/55 leading-snug">No {item.removedToppings.join(', ')}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-0.5 bg-[#FDF8F2] rounded-full w-fit border border-[#E8D8C8] px-1.5 py-1">
                    <button onClick={() => onDecrement(item.id)} className="w-6 h-6 flex items-center justify-center text-[#555555] hover:text-[#C8201A] transition-colors active:scale-90">
                      {item.quantity === 1 ? <Trash2 className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                    </button>
                    <span className="font-bebas text-[17px] text-[#2B2B2B] w-6 text-center leading-none">{item.quantity}</span>
                    <button onClick={() => onIncrement(item.id)} className="w-6 h-6 flex items-center justify-center text-[#555555] hover:text-[#D4952A] transition-colors active:scale-90">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <div className="border-t border-[#E8D8C8] px-6 py-5 flex flex-col gap-3 bg-[#0c0400] flex-shrink-0">
          {!isEmpty && (
            <>
              <div className="space-y-1.5">
                <div className="flex justify-between text-[12px]">
                  <span className="font-barlow font-700 text-[#555555] uppercase tracking-wider">Subtotal</span>
                  <span className="font-barlow font-700 text-[#555555]">${subtotal.toFixed(2)}</span>
                </div>
                {orderType === 'delivery' && (
                  <div className="flex justify-between text-[12px]">
                    <span className="font-barlow font-700 text-[#555555] uppercase tracking-wider">Delivery Fee</span>
                    <span className="font-barlow font-700 text-[#555555]">$4.99</span>
                  </div>
                )}
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-[#D4952A]/25 to-transparent" />
              <div className="flex justify-between items-end">
                <span className="font-barlow font-700 text-[13px] uppercase tracking-wider text-[#555555]">Total</span>
                <span className="font-bebas text-[40px] text-[#2B2B2B] leading-none">${total.toFixed(2)}</span>
              </div>
            </>
          )}

          <button
            onClick={() => {
              if (!isEmpty) {
                onClose();
                navigate('/checkout');
              }
            }}
            className={`w-full flex items-center justify-center gap-2 font-barlow font-700 text-[14px] uppercase tracking-wider py-4 rounded-xl transition-all duration-300
              ${isEmpty
                ? 'bg-[#1A1A1A]/5 text-[#555555] cursor-not-allowed border border-[#E8D8C8]'
                : 'bg-[#C8201A] text-white hover:bg-[#9E1510] hover:shadow-[0_0_28px_rgba(200,32,26,0.55)] hover:-translate-y-0.5 active:translate-y-0 shadow-[0_8px_24px_-8px_rgba(200,32,26,0.5)]'
              }`}
            disabled={isEmpty}
          >
            Proceed to Checkout
            <ArrowRight className="w-4 h-4" />
          </button>

          {!isEmpty && (
            <p className="font-inter text-[10px] text-[#555555] text-center">
              {orderType === 'pickup' ? 'Pickup orders ready in 15–20 mins' : 'Delivery est. 25–35 mins'}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
