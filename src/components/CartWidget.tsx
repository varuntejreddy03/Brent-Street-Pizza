import { useEffect, useRef, useState } from 'react';
import { X, Plus, Minus, ShoppingBag, ArrowRight, Trash2, MapPin, Bike, Store, ChevronLeft, User, Phone as PhoneIcon, AlertCircle, Check } from 'lucide-react';
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

interface DeliveryForm {
  name: string;
  phone: string;
  address: string;
  suburb: string;
  instructions: string;
}

const EMPTY_FORM: DeliveryForm = { name: '', phone: '', address: '', suburb: '', instructions: '' };

// Simple field validation
function validate(form: DeliveryForm, orderType: 'pickup' | 'delivery') {
  const errs: Partial<DeliveryForm> = {};
  if (!form.name.trim()) errs.name = 'Name is required';
  if (!form.phone.trim()) errs.phone = 'Phone is required';
  else if (!/^[\d\s+()-]{8,}$/.test(form.phone)) errs.phone = 'Enter a valid phone number';
  if (orderType === 'delivery') {
    if (!form.address.trim()) errs.address = 'Street address is required';
    if (!form.suburb.trim()) errs.suburb = 'Suburb is required';
  }
  return errs;
}

export default function CartWidget({
  items, isOpen, orderType, onOrderTypeChange, onClose, onIncrement, onDecrement,
}: CartWidgetProps) {
  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
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

  // Checkout step: 'cart' | 'checkout' | 'confirmed'
  const [step, setStep] = useState<'cart' | 'checkout' | 'confirmed'>('cart');
  const [form, setForm] = useState<DeliveryForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<DeliveryForm>>({});
  const [submitting, setSubmitting] = useState(false);

  // Reset to cart view when sidebar closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => { setStep('cart'); setErrors({}); }, 500);
    }
  }, [isOpen]);

  const handleField = (k: keyof DeliveryForm, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: undefined }));
  };

  const handleCheckout = () => {
    const errs = validate(form, orderType);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    // Simulate API call
    setTimeout(() => { setSubmitting(false); setStep('confirmed'); }, 1200);
  };

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
        className={`fixed top-0 right-0 h-full w-full max-w-[400px] bg-[#0f0600] border-l border-white/7
          shadow-[-24px_0_80px_rgba(0,0,0,0.6)] z-[100] flex flex-col
          transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/7 flex-shrink-0">
          <div className="flex items-center gap-3">
            {step === 'checkout' && (
              <button
                onClick={() => setStep('cart')}
                className="w-8 h-8 rounded-full border border-white/10 hover:border-white/25 flex items-center justify-center text-white/40 hover:text-white transition-all mr-1"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            <div className="w-9 h-9 rounded-xl bg-[#C0392B]/18 border border-[#C0392B]/35 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-[#C0392B]" />
            </div>
            <div>
              <h3 className="font-bebas text-[24px] tracking-widest text-white leading-none">
                {step === 'cart' ? 'Your Order' : step === 'checkout' ? 'Checkout' : 'Order Placed!'}
              </h3>
              {!isEmpty && step === 'cart' && (
                <p className="font-barlow text-[10px] font-700 text-white/28 uppercase tracking-wider">
                  {items.reduce((a, i) => a + i.quantity, 0)} item{items.reduce((a, i) => a + i.quantity, 0) !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full border border-white/10 hover:border-white/25 hover:bg-white/5 flex items-center justify-center text-white/35 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Pickup / Delivery toggle ─────────────────────────────────────── */}
        {step !== 'confirmed' && (
          <div className="px-5 pt-4 pb-3 flex-shrink-0">
            <div className="flex bg-[#1c0c00] border border-white/8 rounded-xl p-1 gap-1">
              {(['pickup', 'delivery'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => onOrderTypeChange(t)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-barlow text-[12px] font-700 uppercase tracking-wider transition-all duration-200
                    ${orderType === t
                      ? 'bg-[#C0392B] text-white shadow-[0_2px_12px_rgba(192,57,43,0.4)]'
                      : 'text-white/40 hover:text-white/70'
                    }`}
                >
                  {t === 'pickup' ? <Store className="w-3.5 h-3.5" /> : <Bike className="w-3.5 h-3.5" />}
                  {t === 'pickup' ? 'Pickup' : 'Delivery'}
                </button>
              ))}
            </div>
            {orderType === 'delivery' && (
              <p className="font-inter text-[11px] text-[#c9922a]/70 mt-2 flex items-center gap-1.5">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                Delivery fee $4.99 · 30–45 min est.
              </p>
            )}
            {orderType === 'pickup' && (
              <p className="font-inter text-[11px] text-white/30 mt-2 flex items-center gap-1.5">
                <Store className="w-3 h-3 flex-shrink-0" />
                2 Brent Street, Glenorchy · Ready in 15–20 min
              </p>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            STEP: CART
        ════════════════════════════════════════════════════════════════════ */}
        {step === 'cart' && (
          <div className="flex-grow overflow-y-auto px-5 py-4 space-y-3" style={{ scrollbarWidth: 'thin', scrollbarColor: '#C0392B #0f0600' }}>
            {isEmpty ? (
              <div className="h-full flex flex-col items-center justify-center gap-4 py-20">
                <div className="w-20 h-20 rounded-full bg-white/4 border border-white/8 flex items-center justify-center">
                  <ShoppingBag className="w-9 h-9 stroke-1 text-white/25" />
                </div>
                <div className="text-center">
                  <p className="font-bebas text-[22px] tracking-widest text-white/25">Your cart is empty</p>
                  <p className="font-inter text-[13px] text-white/18 mt-1">Add something delicious!</p>
                </div>
              </div>
            ) : (
              items.map(item => (
                <div
                  key={item.id}
                  className={`group flex gap-3.5 items-start bg-[#1c0c00] rounded-xl border border-white/5 p-3.5
                    hover:border-white/10 transition-all duration-300
                    ${newItemId === item.id ? 'animate-[slideInRight_0.4s_ease_forwards]' : ''}`}
                >
                  <div className="w-[58px] h-[58px] rounded-lg overflow-hidden flex-shrink-0 border border-white/6">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-0.5">
                      <span className="font-bebas text-[17px] tracking-widest text-white leading-tight line-clamp-1">{item.name}</span>
                      <span className="font-bebas text-[18px] text-[#C0392B] leading-none flex-shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <div className="mb-2.5 space-y-0.5">
                      {item.size && <p className="font-barlow text-[10px] font-700 uppercase tracking-widest text-[#c9922a]">{item.size}</p>}
                      {item.addedExtras && item.addedExtras.length > 0 && (
                        <p className="font-inter text-[11px] text-white/35 leading-snug">+ {item.addedExtras.map(e => e.name).join(', ')}</p>
                      )}
                      {item.removedToppings && item.removedToppings.length > 0 && (
                        <p className="font-inter text-[11px] text-[#C0392B]/55 leading-snug">No {item.removedToppings.join(', ')}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-0.5 bg-[#0f0600] rounded-full w-fit border border-white/8 px-1.5 py-1">
                      <button onClick={() => onDecrement(item.id)} className="w-6 h-6 flex items-center justify-center text-white/35 hover:text-[#C0392B] transition-colors active:scale-90">
                        {item.quantity === 1 ? <Trash2 className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                      </button>
                      <span className="font-bebas text-[17px] text-white w-6 text-center leading-none">{item.quantity}</span>
                      <button onClick={() => onIncrement(item.id)} className="w-6 h-6 flex items-center justify-center text-white/35 hover:text-[#c9922a] transition-colors active:scale-90">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            STEP: CHECKOUT (address form)
        ════════════════════════════════════════════════════════════════════ */}
        {step === 'checkout' && (
          <div className="flex-grow overflow-y-auto px-5 py-4 space-y-4" style={{ scrollbarWidth: 'thin', scrollbarColor: '#C0392B #0f0600' }}>

            {/* Order type label */}
            <div className="flex items-center gap-2 bg-[#1c0c00] border border-white/8 rounded-xl px-4 py-3">
              {orderType === 'delivery'
                ? <Bike className="w-4 h-4 text-[#C0392B] flex-shrink-0" />
                : <Store className="w-4 h-4 text-[#c9922a] flex-shrink-0" />
              }
              <div>
                <p className="font-barlow text-[12px] font-700 uppercase tracking-wider text-white">
                  {orderType === 'delivery' ? 'Delivery Order' : 'Pickup Order'}
                </p>
                <p className="font-inter text-[11px] text-white/35">
                  {orderType === 'delivery' ? 'Enter your delivery address below' : '2 Brent Street, Glenorchy TAS 7010'}
                </p>
              </div>
            </div>

            {/* ── Contact details (always shown) ── */}
            <div>
              <p className="font-barlow text-[10px] font-700 uppercase tracking-[0.25em] text-[#c9922a] mb-3">
                Contact Details
              </p>
              <div className="space-y-3">
                <FormField
                  icon={<User className="w-3.5 h-3.5" />}
                  placeholder="Full name"
                  value={form.name}
                  error={errors.name}
                  onChange={v => handleField('name', v)}
                />
                <FormField
                  icon={<PhoneIcon className="w-3.5 h-3.5" />}
                  placeholder="Phone number"
                  type="tel"
                  value={form.phone}
                  error={errors.phone}
                  onChange={v => handleField('phone', v)}
                />
              </div>
            </div>

            {/* ── Delivery address (only when delivery) ── */}
            {orderType === 'delivery' && (
              <div>
                <p className="font-barlow text-[10px] font-700 uppercase tracking-[0.25em] text-[#c9922a] mb-3">
                  Delivery Address
                </p>
                <div className="space-y-3">
                  <FormField
                    icon={<MapPin className="w-3.5 h-3.5" />}
                    placeholder="Street address"
                    value={form.address}
                    error={errors.address}
                    onChange={v => handleField('address', v)}
                  />
                  <FormField
                    placeholder="Suburb"
                    value={form.suburb}
                    error={errors.suburb}
                    onChange={v => handleField('suburb', v)}
                  />
                  <textarea
                    placeholder="Delivery instructions (optional)"
                    value={form.instructions}
                    onChange={e => handleField('instructions', e.target.value)}
                    rows={2}
                    className="w-full bg-[#1c0c00] border border-white/10 rounded-xl px-4 py-3
                      font-inter text-[13px] text-white placeholder-white/25
                      focus:outline-none focus:border-[#C0392B]/60 focus:bg-[#220e00]
                      transition-colors resize-none"
                  />
                </div>
              </div>
            )}

            {/* Order summary */}
            <div className="bg-[#1c0c00] border border-white/7 rounded-xl p-4 space-y-2">
              <p className="font-barlow text-[10px] font-700 uppercase tracking-[0.25em] text-[#c9922a] mb-3">Order Summary</p>
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-start gap-2">
                  <span className="font-inter text-[12px] text-white/60 leading-snug">
                    {item.quantity}× {item.name}{item.size ? ` (${item.size})` : ''}
                  </span>
                  <span className="font-barlow text-[12px] font-700 text-white/70 flex-shrink-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="pt-2 border-t border-white/7 space-y-1.5">
                <div className="flex justify-between text-[12px]">
                  <span className="font-barlow font-700 text-white/35 uppercase tracking-wider">Subtotal</span>
                  <span className="font-barlow font-700 text-white/55">${subtotal.toFixed(2)}</span>
                </div>
                {orderType === 'delivery' && (
                  <div className="flex justify-between text-[12px]">
                    <span className="font-barlow font-700 text-white/35 uppercase tracking-wider">Delivery Fee</span>
                    <span className="font-barlow font-700 text-white/55">$4.99</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            STEP: CONFIRMED
        ════════════════════════════════════════════════════════════════════ */}
        {step === 'confirmed' && (
          <div className="flex-grow flex flex-col items-center justify-center px-6 py-10 text-center gap-5">
            <div className="w-20 h-20 rounded-full bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center">
              <Check className="w-9 h-9 text-emerald-400" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-bebas text-[32px] tracking-widest text-white leading-none mb-2">Order Confirmed!</h3>
              <p className="font-inter text-[13px] text-white/45 leading-relaxed">
                {orderType === 'delivery'
                  ? `We're preparing your order and will deliver to ${form.address}, ${form.suburb}.`
                  : 'Your order is being prepared. Come pick it up at 2 Brent Street, Glenorchy.'}
              </p>
            </div>
            <div className="bg-[#1c0c00] border border-white/8 rounded-xl px-5 py-4 w-full">
              <p className="font-barlow text-[10px] font-700 uppercase tracking-widest text-[#c9922a] mb-1">
                {orderType === 'delivery' ? 'Estimated Delivery' : 'Ready In'}
              </p>
              <p className="font-bebas text-[28px] text-white tracking-wider">
                {orderType === 'delivery' ? '30 – 45 min' : '15 – 20 min'}
              </p>
            </div>
            <p className="font-inter text-[12px] text-white/30">
              Questions? Call us on{' '}
              <a href="tel:0455123678" className="text-[#c9922a] hover:text-white transition-colors">0455 123 678</a>
            </p>
          </div>
        )}

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <div className="border-t border-white/7 px-6 py-5 flex flex-col gap-3 bg-[#0c0400] flex-shrink-0">

          {/* Totals — cart step */}
          {step === 'cart' && !isEmpty && (
            <>
              <div className="space-y-1.5">
                <div className="flex justify-between text-[12px]">
                  <span className="font-barlow font-700 text-white/35 uppercase tracking-wider">Subtotal</span>
                  <span className="font-barlow font-700 text-white/55">${subtotal.toFixed(2)}</span>
                </div>
                {orderType === 'delivery' && (
                  <div className="flex justify-between text-[12px]">
                    <span className="font-barlow font-700 text-white/35 uppercase tracking-wider">Delivery Fee</span>
                    <span className="font-barlow font-700 text-white/55">$4.99</span>
                  </div>
                )}
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-[#c9922a]/25 to-transparent" />
              <div className="flex justify-between items-end">
                <span className="font-barlow font-700 text-[13px] uppercase tracking-wider text-white/40">Total</span>
                <span className="font-bebas text-[40px] text-white leading-none">${total.toFixed(2)}</span>
              </div>
            </>
          )}

          {/* Totals — checkout step */}
          {step === 'checkout' && (
            <div className="flex justify-between items-end mb-1">
              <span className="font-barlow font-700 text-[13px] uppercase tracking-wider text-white/40">Total</span>
              <span className="font-bebas text-[36px] text-white leading-none">${total.toFixed(2)}</span>
            </div>
          )}

          {/* CTA button */}
          {step === 'cart' && (
            <button
              onClick={() => !isEmpty && setStep('checkout')}
              className={`w-full flex items-center justify-center gap-2 font-barlow font-700 text-[14px] uppercase tracking-wider py-4 rounded-xl transition-all duration-300
                ${isEmpty
                  ? 'bg-white/5 text-white/18 cursor-not-allowed border border-white/5'
                  : 'bg-[#C0392B] text-white hover:bg-[#a93226] hover:shadow-[0_0_28px_rgba(192,57,43,0.55)] hover:-translate-y-0.5 active:translate-y-0 shadow-[0_8px_24px_-8px_rgba(192,57,43,0.5)] animate-[checkoutPulse_3s_ease-in-out_infinite]'
                }`}
              disabled={isEmpty}
            >
              {orderType === 'delivery' ? 'Continue to Delivery' : 'Continue to Checkout'}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {step === 'checkout' && (
            <button
              onClick={handleCheckout}
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 font-barlow font-700 text-[14px] uppercase tracking-wider py-4 rounded-xl
                bg-[#C0392B] text-white hover:bg-[#a93226] disabled:opacity-60 disabled:cursor-not-allowed
                shadow-[0_8px_24px_-8px_rgba(192,57,43,0.5)] hover:shadow-[0_0_28px_rgba(192,57,43,0.55)]
                transition-all duration-300"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Placing Order…
                </span>
              ) : (
                <>Place Order · ${total.toFixed(2)} <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          )}

          {step === 'confirmed' && (
            <button
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 font-barlow font-700 text-[14px] uppercase tracking-wider py-4 rounded-xl
                bg-white/8 border border-white/12 text-white hover:bg-white/12 transition-all duration-200"
            >
              Close
            </button>
          )}

          {step === 'cart' && (
            <p className="font-inter text-[10px] text-white/18 text-center">
              {orderType === 'pickup' ? 'Pickup orders ready in 15–20 mins' : 'Delivery est. 30–45 mins'}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

// ── Reusable form field ───────────────────────────────────────────────────────
function FormField({
  icon, placeholder, value, error, onChange, type = 'text',
}: {
  icon?: React.ReactNode;
  placeholder: string;
  value: string;
  error?: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <div className={`flex items-center gap-3 bg-[#1c0c00] border rounded-xl px-4 py-3 transition-colors
        ${error ? 'border-[#C0392B]/60 bg-[#C0392B]/5' : 'border-white/10 focus-within:border-[#C0392B]/50 focus-within:bg-[#220e00]'}`}>
        {icon && <span className="text-white/30 flex-shrink-0">{icon}</span>}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="flex-1 bg-transparent font-inter text-[13px] text-white placeholder-white/25 focus:outline-none"
        />
        {error && <AlertCircle className="w-4 h-4 text-[#C0392B] flex-shrink-0" />}
      </div>
      {error && (
        <p className="font-inter text-[11px] text-[#C0392B]/80 mt-1 ml-1">{error}</p>
      )}
    </div>
  );
}
