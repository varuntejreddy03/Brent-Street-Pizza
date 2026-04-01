import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import {
  MapPin, CreditCard, Banknote, ChevronRight, ShieldCheck,
  ArrowLeft, Bike, Store, Trash2, CheckCircle2, Clock, Package,
  FileText, MessageSquare, Download
} from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripePaymentForm from '../components/StripePaymentForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

type Step = 'address' | 'payment' | 'success';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartTotalPrice, clearCart, token } = useCart();
  const [step, setStep] = useState<Step>('address');
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<'ONLINE' | 'COD'>('ONLINE');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [finalOrderItems, setFinalOrderItems] = useState<any[]>([]);
  const [finalTotal, setFinalTotal] = useState(0);
  const [address, setAddress] = useState({
    name: '',
    phone: '',
    street: '',
    suburb: '',
    state: '',
    postcode: '',
    notes: '',
  });

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
        setFinalOrderItems([...cartItems]);
        setFinalTotal(total);
        await clearCart();
        setStep('success');
        return;
      }

      if (paymentMethod === 'ONLINE') {
        setClientSecret(data.clientSecret);
        setIsProcessing(false);
        return;
      }

    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Something went wrong. Please try again.');
      setIsProcessing(false);
    }
  };

  const generateWhatsAppMessage = () => {
    const itemsList = cartItems.map((item: any) => {
      let details = `*${item.quantity}x ${item.name}*`;
      if (item.size) details += ` (${item.size})`;
      if (item.removedToppings?.length) details += `\n   - No: ${item.removedToppings.join(', ')}`;
      if (item.addedExtras?.length) details += `\n   - Extras: ${item.addedExtras.map((e: any) => e.name).join(', ')}`;
      details += ` - $${(Number(item.price) * item.quantity).toFixed(2)}`;
      return details;
    }).join('\n');

    const message = `*🍕 NEW ORDER RECEIVED!* \n` +
      `--------------------------\n` +
      `*Order ID:* #${orderId.slice(0, 8).toUpperCase()}\n` +
      `*Customer:* ${address.name}\n` +
      `*Phone:* ${address.phone}\n` +
      `*Type:* ${orderType.toUpperCase()}\n` +
      `*Address:* ${orderType === 'delivery' ? `${address.street}, ${address.suburb}` : 'Pickup'}\n` +
      `--------------------------\n` +
      `*ITEMS:*\n${itemsList}\n` +
      `--------------------------\n` +
      `*Subtotal:* $${subtotal.toFixed(2)}\n` +
      `*Tax (10%):* $${tax.toFixed(2)}\n` +
      `*Delivery Fee:* $${deliveryFee.toFixed(2)}\n` +
      `*TOTAL:* $${total.toFixed(2)}\n` +
      `--------------------------\n` +
      `*Payment:* ${paymentMethod === 'ONLINE' ? '✅ PAID ONLINE' : '💵 CASH ON DELIVERY'}\n` +
      `*Notes:* ${address.notes || 'None'}`;

    return encodeURIComponent(message);
  };

  const handleWhatsAppNotify = () => {
    const ownerNumber = '61362724004'; // Australian Business Number from footer
    window.open(`https://wa.me/${ownerNumber}?text=${generateWhatsAppMessage()}`, '_blank');
  };

  // ── SUCCESS PAGE ─────────────────────────────────────────────────────────
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-[#FDF8F2] flex flex-col items-center justify-start pt-12 px-4 pb-20">
        <div className="max-w-2xl w-full">
          {/* Success Hero */}
          <div className="text-center mb-10">
            <div className="relative inline-block mb-6">
              <div className="w-28 h-28 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(16,185,129,0.4)] animate-bounce-subtle">
                <CheckCircle2 className="w-14 h-14 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 bg-[#D4952A] text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <Package className="w-5 h-5" />
              </div>
            </div>
            <h1 className="font-bebas text-[64px] md:text-[84px] text-[#1A1A1A] tracking-wider leading-none mb-2">
              Order Confirmed!
            </h1>
            <p className="font-inter text-[#555555] text-[15px] max-w-sm mx-auto">
              Hang tight! We're preparing your delicious meal and {orderType === 'delivery' ? 'a rider will be assigned shortly' : 'it will be ready for pickup soon'}.
            </p>
          </div>

          {/* Live Tracker (Visual Only) */}
          <div className="bg-white border border-[#E8D8C8] rounded-3xl p-8 mb-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full font-barlow text-[10px] font-800 uppercase tracking-widest animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Live Tracking
              </span>
            </div>
            
            <div className="space-y-8 relative">
              {/* Progress Line */}
              <div className="absolute left-[19px] top-[10px] bottom-[10px] w-0.5 bg-[#F0E8DC]">
                <div className="absolute top-0 left-0 w-full h-[33%] bg-[#C8201A] shadow-[0_0_8px_rgba(200,32,26,0.3)]" />
              </div>

              {[
                { icon: CheckCircle2, label: 'Order Confirmed', time: 'Just now', color: 'text-[#C8201A]', bg: 'bg-[#C8201A]' },
                { icon: Clock, label: 'Food is being prepared', time: 'Expected in 5 mins', color: 'text-[#C8201A]', bg: 'bg-[#C8201A]' },
                { icon: Bike, label: 'Rider is on the way', time: 'Stay tuned!', color: 'text-[#BBBBBB]', bg: 'bg-[#F0E8DC]' },
                { icon: MapPin, label: 'Delivered', time: '', color: 'text-[#BBBBBB]', bg: 'bg-[#F0E8DC]' },
              ].map((s, i) => (
                <div key={i} className="flex gap-5 items-start">
                  <div className={`w-10 h-10 rounded-full ${s.bg} flex items-center justify-center z-10 shadow-sm transition-colors duration-500`}>
                    <s.icon className={`w-5 h-5 ${i < 2 ? 'text-white' : 'text-[#888888]'}`} />
                  </div>
                  <div>
                    <h4 className={`font-bebas text-[20px] tracking-wide leading-none mb-1 ${i < 2 ? 'text-[#1A1A1A]' : 'text-[#BBBBBB]'}`}>
                      {s.label}
                    </h4>
                    <p className="font-inter text-[12px] text-[#888888]">{s.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Info & Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-[#1A1A1A] text-white rounded-3xl p-6 shadow-xl">
              <p className="font-barlow text-[11px] font-700 uppercase tracking-[0.2em] text-[#D4952A] mb-4">Order Summary</p>
              <div className="space-y-3 mb-6 opacity-90 text-[13px] font-inter">
                <div className="flex justify-between">
                  <span>Order ID</span>
                  <span className="font-mono text-[#D4952A]">#{orderId.slice(0, 8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment</span>
                  <span>{paymentMethod === 'ONLINE' ? 'Paid Online' : 'Cash on Delivery'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Items</span>
                  <span>{finalOrderItems.length} Products</span>
                </div>
              </div>
              <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                <span className="font-barlow text-[13px] font-700 uppercase tracking-widest">Total Amount</span>
                <span className="font-bebas text-[32px] text-[#D4952A] leading-none">${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-white border border-[#E8D8C8] rounded-3xl p-6 flex flex-col justify-between">
              <div>
                <p className="font-barlow text-[11px] font-700 uppercase tracking-[0.2em] text-[#C8201A] mb-4">Delivery To</p>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#C8201A] mt-0.5" />
                  <div>
                    <p className="font-bebas text-[22px] text-[#1A1A1A] leading-none mb-1">{address.name}</p>
                    <p className="font-inter text-[13px] text-[#555555] line-clamp-2">
                       {orderType === 'delivery' ? `${address.street}, ${address.suburb}` : 'Brent Street Pizza (Pickup)'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-[#F0E8DC] space-y-3">
                <button 
                  onClick={handleWhatsAppNotify}
                  className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#128C7E] text-white font-barlow text-[13px] font-800 uppercase tracking-widest py-3.5 rounded-2xl transition-all shadow-[0_8px_20px_rgba(37,211,102,0.25)]"
                >
                  <MessageSquare className="w-4 h-4 fill-current" /> Notify Owner via WhatsApp
                </button>
                <button 
                   onClick={() => window.print()}
                   className="w-full flex items-center justify-center gap-2 text-[#555555] hover:text-[#1A1A1A] font-barlow text-[12px] font-700 uppercase tracking-widest transition-colors"
                >
                  <Download className="w-4 h-4" /> Download/Print Receipt
                </button>
              </div>
            </div>
          </div>

          {/* Detailed Receipt Section */}
          <div className="bg-white border border-[#E8D8C8] rounded-3xl overflow-hidden mb-10 shadow-sm print:shadow-none print:border-none">
            <div className="bg-[#F9F9F9] border-b border-[#E8D8C8] p-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#C8201A]" />
                <h3 className="font-bebas text-[24px] tracking-wide text-[#1A1A1A]">Official Receipt</h3>
              </div>
              <span className="font-barlow text-[11px] font-700 text-[#888888] uppercase tracking-[0.1em]">
                {new Date().toLocaleDateString()} · {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            
            <div className="p-8">
              {/* Receipt Items */}
              <div className="divide-y divide-[#F0E8DC] mb-8">
                {finalOrderItems.map((item: any, idx: number) => (
                  <div key={idx} className="py-4 flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-[#1A1A1A] text-white w-5 h-5 rounded-full flex items-center justify-center font-barlow text-[10px] font-700">
                          {item.quantity}
                        </span>
                        <h4 className="font-barlow text-[15px] font-700 text-[#1A1A1A] uppercase tracking-wide">
                          {item.name}
                        </h4>
                      </div>
                      
                      {item.size && (
                        <p className="font-inter text-[12px] text-[#666] ml-7">Size: {item.size}</p>
                      )}
                      
                      {item.removedToppings && item.removedToppings.length > 0 && (
                        <p className="font-inter text-[11px] text-[#C8201A] ml-7 italic">
                          No {item.removedToppings.join(', ')}
                        </p>
                      )}
                      
                      {item.addedExtras && item.addedExtras.length > 0 && (
                        <p className="font-inter text-[11px] text-[#D4952A] ml-7 font-medium">
                          + {item.addedExtras.map((e: any) => e.name).join(', ')}
                        </p>
                      )}
                    </div>
                    <span className="font-barlow text-[15px] font-700 text-[#1A1A1A]">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Receipt Footer */}
              <div className="space-y-3 pt-6 border-t-2 border-dashed border-[#F0E8DC]">
                <div className="flex justify-between font-inter text-[14px] text-[#555]">
                  <span>Subtotal</span>
                  <span>${(finalTotal / 1.15).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-inter text-[14px] text-[#555]">
                  <span>GST (10%)</span>
                  <span>${(finalTotal * 0.1).toFixed(2)}</span>
                </div>
                {orderType === 'delivery' && (
                  <div className="flex justify-between font-inter text-[14px] text-[#555]">
                    <span>Delivery Fee</span>
                    <span>$4.99</span>
                  </div>
                )}
                <div className="flex justify-between pt-4">
                  <span className="font-bebas text-[28px] text-[#1A1A1A] tracking-wider">Total amount</span>
                  <div className="text-right">
                    <span className="font-bebas text-[36px] text-[#C8201A] leading-none">${finalTotal.toFixed(2)}</span>
                    <p className="font-barlow text-[10px] font-700 text-[#25D366] uppercase tracking-widest mt-1">
                      {paymentMethod === 'ONLINE' ? 'Payment Successful' : 'Payable on Delivery'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Branding bit */}
              <div className="mt-10 pt-6 border-t border-[#F0E8DC] text-center">
                <p className="font-bebas text-[20px] tracking-widest text-[#CCCCCC] leading-none mb-1 opacity-50">BRENT STREET PIZZA</p>
                <p className="font-inter text-[10px] text-[#AAAAAA] uppercase tracking-widest">Thank you for ordering with us!</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/menu')}
            className="w-full group bg-white border-2 border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A] font-barlow font-800 text-[15px] uppercase tracking-[0.2em] px-8 py-5 rounded-3xl transition-all duration-300 shadow-[0_10px_40px_rgba(0,0,0,0.05)] flex items-center justify-center gap-3"
          >
            Go Back to Menu <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
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
                      <p className="font-inter text-[11px] text-[#555555]">Secure Credit / Debit Card payment via Stripe</p>
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <div className="bg-[#1A1A1A] text-white font-barlow font-700 text-[9px] px-2 py-0.5 rounded uppercase">Visa</div>
                      <div className="bg-[#EB001B]/10 text-[#EB001B] font-barlow font-700 text-[9px] px-2 py-0.5 rounded border border-[#EB001B]/20 uppercase">MC</div>
                      <div className="bg-[#0070BA]/10 text-[#0070BA] font-barlow font-700 text-[9px] px-2 py-0.5 rounded border border-[#0070BA]/20 uppercase">Amex</div>
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
                  Payments secured by <span className="font-semibold text-[#1A1A1A]">Stripe</span>. Your info is never stored.
                </p>
              </div>

              {/* Online Payment Form or Place Order button */}
              {paymentMethod === 'ONLINE' && clientSecret ? (
                <div className="bg-white border border-[#E8D8C8] rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <p className="font-barlow text-[13px] font-800 uppercase tracking-widest text-[#1A1A1A] mb-6 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#C8201A]" />
                    Complete Your Secure Payment
                  </p>
                  <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                    <StripePaymentForm 
                      clientSecret={clientSecret} 
                      total={total}
                      onSuccess={async () => {
                        setFinalOrderItems([...cartItems]);
                        setFinalTotal(total);
                        await clearCart();
                        setStep('success');
                      }}
                      onCancel={() => setClientSecret('')}
                    />
                  </Elements>
                </div>
              ) : (
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="w-full flex items-center justify-between bg-[#C8201A] hover:bg-[#9E1510] disabled:opacity-70 disabled:cursor-wait text-white font-barlow font-700 text-[14px] uppercase tracking-wider px-6 py-5 rounded-xl transition-all shadow-[0_8px_24px_rgba(200,32,26,0.35)]"
                >
                  <span>{isProcessing ? 'Processing...' : paymentMethod === 'ONLINE' ? 'Initialize Payment' : 'Place Order'}</span>
                  <span className="font-bebas text-[22px] leading-none">${total.toFixed(2)}</span>
                </button>
              )}
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
              {cartItems.map((item: any) => (
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
                      <p className="font-inter text-[10px] text-[#D4952A]">+ {item.addedExtras.map((e: any) => e.name).join(', ')}</p>
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
