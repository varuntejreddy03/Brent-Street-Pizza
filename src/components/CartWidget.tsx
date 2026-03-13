import { X, Plus, Minus, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { type CartItem } from '../types/menu';

interface CartWidgetProps {
  items: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
}

export default function CartWidget({ items, isOpen, onClose, onIncrement, onDecrement }: CartWidgetProps) {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const isEmpty = items.length === 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] transition-opacity duration-400 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[420px] bg-[#1a0a00] border-l border-white/8 shadow-[−20px_0_60px_rgba(0,0,0,0.5)] z-[100] flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[8px] bg-[#C0392B]/20 border border-[#C0392B]/40 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-[#C0392B]" />
            </div>
            <div>
              <h3 className="font-bebas text-[24px] tracking-widest text-white leading-none">Your Order</h3>
              {!isEmpty && (
                <p className="font-barlow text-[11px] font-600 text-white/30 uppercase tracking-wider">
                  {items.reduce((a, i) => a + i.quantity, 0)} item{items.reduce((a, i) => a + i.quantity, 0) !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full border border-white/10 hover:border-white/30 hover:bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Direct order strip */}
        <div className="bg-[#d4a017]/10 border-b border-[#d4a017]/20 px-6 py-2.5">
          <p className="font-barlow text-[12px] font-700 text-[#d4a017]">
            🎁 Free garlic bread on every direct order today!
          </p>
        </div>

        {/* Items list */}
        <div className="flex-grow overflow-y-auto px-6 py-5 space-y-4">
          {isEmpty ? (
            <div className="h-full flex flex-col items-center justify-center gap-4 opacity-40 py-16">
              <ShoppingBag className="w-16 h-16 stroke-1 text-white" />
              <p className="font-inter text-[14px] text-white/60 text-center italic">Your cart is empty.<br />Add something delicious!</p>
            </div>
          ) : (
            items.map(item => (
              <div
                key={item.id}
                className="group flex gap-4 items-center bg-[#2b1200] rounded-[12px] border border-white/5 p-3 hover:border-white/10 transition-all"
              >
                {/* Image */}
                <div className="w-16 h-16 rounded-[8px] overflow-hidden flex-shrink-0 border border-white/5">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Info */}
                <div className="flex-grow min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-bebas text-[17px] tracking-widest text-white leading-tight line-clamp-1">{item.name}</span>
                    <span className="font-bebas text-[18px] text-[#C0392B] leading-none flex-shrink-0">
                      ${(item.price * item.quantity).toFixed(0)}
                    </span>
                  </div>

                  {/* Customizations */}
                  <div className="mb-2 space-y-0.5">
                    {item.size && <p className="font-barlow text-[11px] font-700 uppercase tracking-widest text-[#d4a017]">Size: {item.size}</p>}
                    {item.removedToppings && item.removedToppings.length > 0 && (
                      <p className="font-inter text-[11px] text-[#C0392B]">- No {item.removedToppings.join(', ')}</p>
                    )}
                    {item.addedExtras && item.addedExtras.length > 0 && (
                      <p className="font-inter text-[11px] text-emerald-500">+ {item.addedExtras.map(e => e.name).join(', ')}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 bg-[#1a0a00] rounded-full w-fit border border-white/8 px-2 py-1">
                    <button
                      onClick={() => onDecrement(item.id)}
                      className="w-6 h-6 flex items-center justify-center text-white/40 hover:text-[#C0392B] transition-colors active:scale-90"
                    >
                      {item.quantity === 1 ? <Trash2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                    </button>
                    <span className="font-bebas text-[18px] text-white w-6 text-center leading-none">{item.quantity}</span>
                    <button
                      onClick={() => onIncrement(item.id)}
                      className="w-6 h-6 flex items-center justify-center text-white/40 hover:text-[#d4a017] transition-colors active:scale-90"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/8 px-6 py-5 flex flex-col gap-4 bg-[#1a0a00]">
          {!isEmpty && (
            <>
              <div className="space-y-2">
                <div className="flex justify-between text-[13px]">
                  <span className="font-barlow font-600 text-white/40 uppercase tracking-wider">Subtotal</span>
                  <span className="font-barlow font-700 text-white/70">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="font-barlow font-600 text-[#d4a017]/70 uppercase tracking-wider">🎁 Free Garlic Bread</span>
                  <span className="font-barlow font-700 text-[#d4a017]">$0.00</span>
                </div>
              </div>

              <div className="divider-gold" />

              <div className="flex justify-between items-end">
                <span className="font-barlow font-700 text-[14px] uppercase tracking-wider text-white/50">Total</span>
                <span className="font-bebas text-[40px] text-white leading-none">${subtotal.toFixed(2)}</span>
              </div>
            </>
          )}

          <button
            className={`w-full flex items-center justify-center gap-2 font-barlow font-700 text-[15px] uppercase tracking-wider py-4 rounded-[10px] transition-all duration-300 ${isEmpty
              ? 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
              : 'bg-[#C0392B] text-white hover:bg-[#a93226] hover:shadow-[0_0_25px_rgba(192,57,43,0.5)] hover:-translate-y-0.5 active:translate-y-0 shadow-[0_8px_24px_-8px_rgba(192,57,43,0.5)]'
              }`}
            disabled={isEmpty}
          >
            Checkout Now <ArrowRight className="w-4 h-4" />
          </button>

          <p className="font-inter text-[11px] text-white/20 text-center">
            Pickup orders ready in 15–20 mins
          </p>
        </div>
      </div>
    </>
  );
}
