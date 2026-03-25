import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import {
  MapPin, CreditCard, Banknote, ChevronRight, ShieldCheck,
  ArrowLeft, Bike, Store, Trash2, CheckCircle2, Clock, Package
} from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

type Step = 'address' | 'payment' | 'success';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartTotalPrice, clearCart, token } = useCart();
  const [step, setStep] = useState<Step>('address');
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<'ONLINE' | 'COD'>('ONLINE');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [address, setAddress] = useState({
    name: '',
    phone: '',
    street: '',
    suburb: '',
    state: '',
    postcode: '',
    notes: '',
  });

  // Load Razorpay SDK
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  // If cart is empty, redirect to menu
  useEffect(() => {
    if (cartItems.length === 0 && step !== 'success') {
      navigate('/menu');
    }
  }, [cartItems, navigate, step]);

  const deliveryFee = orderType === 'delivery' ? 4.99 : 0;
  const subtotal = cartTotalPrice;
  const tax = subtotal * 0.1;
  const total = subtotal + tax + deliveryFee;

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    if (!token) {
      alert('Authentication error. Please refresh the page and try again.');
      setIsProcessing(false);
      return;
    }

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          totalAmount: total.toFixed(2),
          paymentMethod,
          deliveryAddress: orderType === 'delivery' ? `${address.street}, ${address.suburb} ${address.state} ${address.postcode}` : 'Pickup',
          // Pass cart items directly so backend doesn't need to fetch from DB
          cartItems: cartItems.map(item => ({
            productId: item.menuItemId || item.id, // menuItemId is the real DB product ID
            quantity: item.quantity,
            price: Number(item.price),
            size: item.size || null,
            removedToppings: item.removedToppings || [],
            addedExtras: item.addedExtras || [],
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to place order');

      setOrderId(data.order.id);

      if (paymentMethod === 'COD') {
        await clearCart();
        setStep('success');
        return;
      }

      // Online payment via Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: Math.round(total * 100),
        currency: 'INR',
        name: 'Brent Street Pizza',
        description: 'Your delicious pizza order',
        image: '/logo.png',
        order_id: data.razorpayOrderId,
        handler: async (response: any) => {
          // Verify payment
          const verifyRes = await fetch('/api/orders/verify-payment', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              order_id: data.order.id,
            }),
          });

          if (verifyRes.ok) {
            await clearCart();
            setStep('success');
          }
        },
        prefill: {
          name: address.name,
          contact: address.phone,
        },
        theme: { color: '#C8201A' },
        modal: {
          ondismiss: () => setIsProcessing(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      setIsProcessing(false);

    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Something went wrong. Please try again.');
      setIsProcessing(false);
    }
  };

  // ── SUCCESS PAGE ─────────────────────────────────────────────────────────
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-[#FDF8F2] flex items-center justify-center px-4">
        <div className="text-center max-w-md w-full">
          <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_60px_rgba(16,185,129,0.35)]">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h1 className="font-bebas text-[56px] text-[#1A1A1A] tracking-wider leading-none mb-2">Order Placed!</h1>
          <p className="font-inter text-[#555555] mb-2">Your order has been confirmed. We're firing up the oven!</p>
          <p className="font-barlow text-[12px] font-700 uppercase tracking-wider text-[#D4952A] mb-8">
            Order #{orderId.slice(0, 8).toUpperCase()}
          </p>

          <div className="bg-white border border-[#E8D8C8] rounded-2xl p-6 mb-8 text-left space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#C8201A]/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-[#C8201A]" />
              </div>
              <div>
                <p className="font-barlow text-[12px] font-700 uppercase tracking-wider text-[#555555]">Estimated Time</p>
                <p className="font-bebas text-[22px] text-[#1A1A1A] leading-none">
                  {orderType === 'delivery' ? '25–35 minutes' : '15–20 minutes'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#C8201A]/10 flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-[#C8201A]" />
              </div>
              <div>
                <p className="font-barlow text-[12px] font-700 uppercase tracking-wider text-[#555555]">Status</p>
                <p className="font-bebas text-[22px] text-[#1A1A1A] leading-none">Preparing your order</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/menu')}
            className="w-full bg-[#C8201A] hover:bg-[#9E1510] text-white font-barlow font-700 text-[14px] uppercase tracking-wider px-6 py-4 rounded-xl transition-all shadow-[0_8px_24px_rgba(200,32,26,0.4)]"
          >
            Order More Pizza
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF8F2] pb-32">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#FDF8F2]/98 backdrop-blur-xl border-b border-[#E8D8C8] px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={() => step === 'payment' ? setStep('address') : navigate('/menu')}
            className="w-9 h-9 rounded-full border border-[#E8D8C8] flex items-center justify-center hover:bg-[#1A1A1A] hover:text-white transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="font-bebas text-[28px] tracking-wider text-[#1A1A1A] leading-none">
            {step === 'address' ? 'Delivery Details' : 'Payment'}
          </h1>
          {/* Step indicator */}
          <div className="ml-auto flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-barlow font-700 ${step === 'address' || step === 'payment' ? 'bg-[#C8201A] text-white' : 'bg-[#E8D8C8] text-[#555555]'}`}>1</div>
            <div className="w-6 h-px bg-[#E8D8C8]" />
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-barlow font-700 ${step === 'payment' ? 'bg-[#C8201A] text-white' : 'bg-[#E8D8C8] text-[#555555]'}`}>2</div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-6 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">

        {/* ── LEFT PANEL ── */}
        <div className="space-y-5">

          {/* STEP 1: Address */}
          {step === 'address' && (
            <>
              {/* Order Type Toggle */}
              <div className="bg-white border border-[#E8D8C8] rounded-2xl p-5">
                <p className="font-barlow text-[11px] font-700 uppercase tracking-wider text-[#555555] mb-3">Order Type</p>
                <div className="grid grid-cols-2 gap-3">
                  {(['delivery', 'pickup'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setOrderType(type)}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${orderType === type ? 'border-[#C8201A] bg-[#C8201A]/8' : 'border-[#E8D8C8] hover:border-[#E8D8C8]/80'}`}
                    >
                      {type === 'delivery' ? <Bike className="w-5 h-5 text-[#C8201A]" /> : <Store className="w-5 h-5 text-[#C8201A]" />}
                      <div className="text-left">
                        <p className="font-barlow text-[13px] font-700 uppercase tracking-wide text-[#1A1A1A] capitalize">{type}</p>
                        <p className="font-inter text-[11px] text-[#555555]">
                          {type === 'delivery' ? '25–35 min · $4.99' : '15–20 min · Free'}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Address Form */}
              <form onSubmit={handleAddressSubmit} className="bg-white border border-[#E8D8C8] rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-[#C8201A]" />
                  <p className="font-barlow text-[11px] font-700 uppercase tracking-wider text-[#555555]">
                    {orderType === 'delivery' ? 'Delivery Address' : 'Your Details'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-barlow text-[10px] font-700 uppercase tracking-wider text-[#555555] mb-1.5">Full Name*</label>
                    <input
                      required
                      type="text"
                      value={address.name}
                      onChange={e => setAddress(a => ({ ...a, name: e.target.value }))}
                      placeholder="John Smith"
                      className="w-full border border-[#E8D8C8] rounded-xl px-4 py-3 font-inter text-[14px] text-[#1A1A1A] focus:outline-none focus:border-[#C8201A] transition-colors bg-[#FDFAF6]"
                    />
                  </div>
                  <div>
                    <label className="block font-barlow text-[10px] font-700 uppercase tracking-wider text-[#555555] mb-1.5">Phone*</label>
                    <input
                      required
                      type="tel"
                      value={address.phone}
                      onChange={e => setAddress(a => ({ ...a, phone: e.target.value }))}
                      placeholder="04xx xxx xxx"
                      className="w-full border border-[#E8D8C8] rounded-xl px-4 py-3 font-inter text-[14px] text-[#1A1A1A] focus:outline-none focus:border-[#C8201A] transition-colors bg-[#FDFAF6]"
                    />
                  </div>
                </div>

                {orderType === 'delivery' && (
                  <>
                    <div>
                      <label className="block font-barlow text-[10px] font-700 uppercase tracking-wider text-[#555555] mb-1.5">Street Address*</label>
                      <input
                        required
                        type="text"
                        value={address.street}
                        onChange={e => setAddress(a => ({ ...a, street: e.target.value }))}
                        placeholder="123 Collins Street"
                        className="w-full border border-[#E8D8C8] rounded-xl px-4 py-3 font-inter text-[14px] text-[#1A1A1A] focus:outline-none focus:border-[#C8201A] transition-colors bg-[#FDFAF6]"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-1">
                        <label className="block font-barlow text-[10px] font-700 uppercase tracking-wider text-[#555555] mb-1.5">Suburb*</label>
                        <input
                          required
                          type="text"
                          value={address.suburb}
                          onChange={e => setAddress(a => ({ ...a, suburb: e.target.value }))}
                          placeholder="Melbourne"
                          className="w-full border border-[#E8D8C8] rounded-xl px-4 py-3 font-inter text-[14px] text-[#1A1A1A] focus:outline-none focus:border-[#C8201A] transition-colors bg-[#FDFAF6]"
                        />
                      </div>
                      <div>
                        <label className="block font-barlow text-[10px] font-700 uppercase tracking-wider text-[#555555] mb-1.5">State</label>
                        <select
                          value={address.state}
                          onChange={e => setAddress(a => ({ ...a, state: e.target.value }))}
                          className="w-full border border-[#E8D8C8] rounded-xl px-3 py-3 font-inter text-[14px] text-[#1A1A1A] focus:outline-none focus:border-[#C8201A] transition-colors bg-[#FDFAF6]"
                        >
                          <option value="VIC">VIC</option>
                          <option value="NSW">NSW</option>
                          <option value="QLD">QLD</option>
                          <option value="WA">WA</option>
                          <option value="SA">SA</option>
                          <option value="TAS">TAS</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-barlow text-[10px] font-700 uppercase tracking-wider text-[#555555] mb-1.5">Postcode*</label>
                        <input
                          required
                          type="text"
                          maxLength={4}
                          value={address.postcode}
                          onChange={e => setAddress(a => ({ ...a, postcode: e.target.value }))}
                          placeholder="3000"
                          className="w-full border border-[#E8D8C8] rounded-xl px-4 py-3 font-inter text-[14px] text-[#1A1A1A] focus:outline-none focus:border-[#C8201A] transition-colors bg-[#FDFAF6]"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block font-barlow text-[10px] font-700 uppercase tracking-wider text-[#555555] mb-1.5">Delivery Notes (optional)</label>
                  <textarea
                    value={address.notes}
                    onChange={e => setAddress(a => ({ ...a, notes: e.target.value }))}
                    placeholder="Leave at door, ring doorbell, etc."
                    rows={2}
                    className="w-full border border-[#E8D8C8] rounded-xl px-4 py-3 font-inter text-[14px] text-[#1A1A1A] focus:outline-none focus:border-[#C8201A] transition-colors bg-[#FDFAF6] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-between bg-[#C8201A] hover:bg-[#9E1510] text-white font-barlow font-700 text-[14px] uppercase tracking-wider px-6 py-4 rounded-xl transition-all shadow-[0_8px_24px_rgba(200,32,26,0.35)] hover:shadow-[0_12px_32px_rgba(200,32,26,0.5)]"
                >
                  <span>Continue to Payment</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </form>
            </>
          )}

          {/* STEP 2: Payment */}
          {step === 'payment' && (
            <div className="space-y-5">
              {/* Address summary */}
              <div className="bg-white border border-[#E8D8C8] rounded-2xl p-5 flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C8201A] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-barlow text-[11px] font-700 uppercase tracking-wider text-[#555555] mb-0.5">
                    {orderType === 'delivery' ? 'Delivering to' : 'Pickup · Self Collection'}
                  </p>
                  <p className="font-inter text-[14px] text-[#1A1A1A]">
                    {address.name} · {address.phone}
                    {orderType === 'delivery' && <><br />{address.street}, {address.suburb} {address.state} {address.postcode}</>}
                  </p>
                </div>
                <button
                  onClick={() => setStep('address')}
                  className="text-[#C8201A] font-barlow text-[11px] font-700 uppercase tracking-wider hover:underline flex-shrink-0"
                >
                  Edit
                </button>
              </div>

              {/* Payment Method */}
              <div className="bg-white border border-[#E8D8C8] rounded-2xl p-5">
                <p className="font-barlow text-[11px] font-700 uppercase tracking-wider text-[#555555] mb-4">Payment Method</p>
                <div className="space-y-3">
                  <button
                    onClick={() => setPaymentMethod('ONLINE')}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${paymentMethod === 'ONLINE' ? 'border-[#C8201A] bg-[#C8201A]/8' : 'border-[#E8D8C8] hover:border-[#E8D8C8]/80'}`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === 'ONLINE' ? 'border-[#C8201A]' : 'border-[#E8D8C8]'}`}>
                      {paymentMethod === 'ONLINE' && <div className="w-2.5 h-2.5 rounded-full bg-[#C8201A]" />}
                    </div>
                    <CreditCard className="w-5 h-5 text-[#C8201A]" />
                    <div className="text-left flex-1">
                      <p className="font-barlow text-[13px] font-700 uppercase tracking-wide text-[#1A1A1A]">Pay Online</p>
                      <p className="font-inter text-[11px] text-[#555555]">Credit / Debit Card, UPI, Net Banking via Razorpay</p>
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <div className="bg-[#1A1A1A] text-white font-barlow font-700 text-[9px] px-2 py-0.5 rounded">VISA</div>
                      <div className="bg-[#EB001B]/10 text-[#EB001B] font-barlow font-700 text-[9px] px-2 py-0.5 rounded border border-[#EB001B]/20">MC</div>
                      <div className="bg-[#00589C]/10 text-[#00589C] font-barlow font-700 text-[9px] px-2 py-0.5 rounded border border-[#00589C]/20">UPI</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('COD')}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${paymentMethod === 'COD' ? 'border-[#C8201A] bg-[#C8201A]/8' : 'border-[#E8D8C8] hover:border-[#E8D8C8]/80'}`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === 'COD' ? 'border-[#C8201A]' : 'border-[#E8D8C8]'}`}>
                      {paymentMethod === 'COD' && <div className="w-2.5 h-2.5 rounded-full bg-[#C8201A]" />}
                    </div>
                    <Banknote className="w-5 h-5 text-[#C8201A]" />
                    <div className="text-left">
                      <p className="font-barlow text-[13px] font-700 uppercase tracking-wide text-[#1A1A1A]">
                        {orderType === 'delivery' ? 'Cash on Delivery' : 'Pay at Pickup'}
                      </p>
                      <p className="font-inter text-[11px] text-[#555555]">Pay when your order arrives</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-2 px-1 text-[#555555]">
                <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <p className="font-inter text-[12px]">
                  Payments secured by <span className="font-semibold text-[#1A1A1A]">Razorpay</span>. Your info is never stored.
                </p>
              </div>

              {/* Place Order button */}
              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full flex items-center justify-between bg-[#C8201A] hover:bg-[#9E1510] disabled:opacity-70 disabled:cursor-wait text-white font-barlow font-700 text-[14px] uppercase tracking-wider px-6 py-5 rounded-xl transition-all shadow-[0_8px_24px_rgba(200,32,26,0.35)]"
              >
                <span>{isProcessing ? 'Processing...' : paymentMethod === 'ONLINE' ? 'Pay Now' : 'Place Order'}</span>
                <span className="font-bebas text-[22px] leading-none">${total.toFixed(2)}</span>
              </button>
            </div>
          )}
        </div>

        {/* ── RIGHT PANEL: Order Summary ── */}
        <div className="lg:sticky lg:top-[72px] self-start">
          <div className="bg-white border border-[#E8D8C8] rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E8D8C8] flex items-center justify-between">
              <p className="font-barlow text-[12px] font-700 uppercase tracking-wider text-[#555555]">Your Order</p>
              <button onClick={() => navigate('/menu')} className="text-[#C8201A] hover:text-[#9E1510] transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="divide-y divide-[#F0E8DC]">
              {cartItems.map(item => (
                <div key={item.id} className="px-5 py-3.5 flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#C8201A] text-white font-barlow font-700 text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                    {item.quantity}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-barlow text-[13px] font-700 text-[#1A1A1A] truncate">{item.name}</p>
                    {item.size && <p className="font-inter text-[11px] text-[#555555]">{item.size}</p>}
                    {item.removedToppings && item.removedToppings.length > 0 && (
                      <p className="font-inter text-[10px] text-[#C8201A]">No {item.removedToppings.join(', ')}</p>
                    )}
                    {item.addedExtras && item.addedExtras.length > 0 && (
                      <p className="font-inter text-[10px] text-[#D4952A]">+ {item.addedExtras.map(e => e.name).join(', ')}</p>
                    )}
                  </div>
                  <span className="font-barlow font-700 text-[13px] text-[#1A1A1A] flex-shrink-0">
                    ${(Number(item.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price breakdown */}
            <div className="px-5 pt-4 pb-5 space-y-2.5 border-t border-[#E8D8C8]">
              <div className="flex justify-between font-inter text-[13px] text-[#555555]">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-inter text-[13px] text-[#555555]">
                <span>GST (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              {orderType === 'delivery' && (
                <div className="flex justify-between font-inter text-[13px] text-[#555555]">
                  <span>Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bebas text-[22px] text-[#1A1A1A] pt-2 border-t border-[#E8D8C8]">
                <span>Total</span>
                <span className="text-[#C8201A]">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
