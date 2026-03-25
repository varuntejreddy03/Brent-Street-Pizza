import { useState } from 'react';
import { Check, ShoppingBag } from 'lucide-react';

// ─── Data ─────────────────────────────────────────────────────────────────────

const SCOOPS = [
  { label: '1 Scoop', price: 4 },
  { label: '2 Scoops', price: 6 },
  { label: '3 Scoops', price: 8 },
];

const FLAVOURS = [
  'Vanilla', 'Chocolate', 'Strawberry', 'Cookies & Cream',
  'Rainbow', 'Bubble Gum', 'Salted Caramel', 'Lemon Sorbet', 'Boysenberry',
];

const TOPPINGS = [
  "M&M's", 'Rainbow Sprinkles', 'Oreo Chunks', 'Waffle Stick', 'Crushed Cadbury Flake',
];

const SAUCES = ['Chocolate', 'Strawberry', 'Caramel'];

const SPECIALS = [
  {
    id: 'banana-split',
    name: 'Banana Split',
    price: '$12',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&q=80',
    includes: ['3 Scoops Ice Cream', 'Fresh Banana', 'Whipped Cream', 'Sprinkles', 'Choice of Sauce'],
  },
  {
    id: 'triple-sundae',
    name: 'Triple Sundae',
    price: '$10',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&q=80',
    includes: ['Choose 3 Flavours', 'Choose Toppings (+75c each)', 'Choose Sauce (Free)'],
  },
];

// ─── Build Your Ice Cream Builder ─────────────────────────────────────────────

function IceCreamBuilder() {
  const [selectedScoop, setSelectedScoop] = useState<number | null>(null);
  const [selectedFlavours, setSelectedFlavours] = useState<string[]>([]);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [selectedSauce, setSelectedSauce] = useState<string | null>(null);

  const maxFlavours = selectedScoop !== null ? SCOOPS[selectedScoop].label.charAt(0) === '1' ? 1 : selectedScoop === 1 ? 2 : 3 : 0;

  const toggleFlavour = (f: string) => {
    if (selectedFlavours.includes(f)) {
      setSelectedFlavours(prev => prev.filter(x => x !== f));
    } else if (selectedFlavours.length < maxFlavours) {
      setSelectedFlavours(prev => [...prev, f]);
    }
  };

  const toggleTopping = (t: string) => {
    setSelectedToppings(prev =>
      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
    );
  };

  const total = selectedScoop !== null
    ? SCOOPS[selectedScoop].price + selectedToppings.length * 0.75
    : 0;

  return (
    <div className="bg-white rounded-2xl border border-[#E8D8C8] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
      {/* Header */}
      <div className="bg-[#FDF8F2] border-b border-[#E8D8C8] px-6 py-5">
        <h2 className="font-bebas text-[28px] tracking-wider text-[#1A1A1A]">🍨 Build Your Ice Cream</h2>
        <p className="font-inter text-[13px] text-[#555555] mt-0.5">Customise your perfect scoop</p>
      </div>

      <div className="p-6 space-y-8">

        {/* Step 1 — Scoops */}
        <section>
          <p className="font-barlow text-[12px] font-700 uppercase tracking-[0.25em] text-[#C8201A] mb-3">
            Step 1 — Choose Your Scoops
          </p>
          <div className="space-y-2">
            {SCOOPS.map((s, i) => (
              <button
                key={s.label}
                onClick={() => { setSelectedScoop(i); setSelectedFlavours([]); }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all duration-200
                  ${selectedScoop === i
                    ? 'border-[#C8201A] bg-[#C8201A]/6'
                    : 'border-[#E8D8C8] bg-[#FDF8F2] hover:border-[#C8201A]/40'
                  }`}
              >
                <span className="flex items-center gap-3">
                  <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                    ${selectedScoop === i ? 'border-[#C8201A]' : 'border-[#CCCCCC]'}`}>
                    {selectedScoop === i && <span className="w-2.5 h-2.5 rounded-full bg-[#C8201A]" />}
                  </span>
                  <span className="font-inter text-[14px] font-600 text-[#1A1A1A]">{s.label}</span>
                </span>
                <span className="font-bebas text-[18px] text-[#C8201A]">${s.price}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Step 2 — Flavours */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <p className="font-barlow text-[12px] font-700 uppercase tracking-[0.25em] text-[#C8201A]">
              Step 2 — Choose Your Flavours
            </p>
            {selectedScoop !== null && (
              <span className="font-inter text-[11px] text-[#555555]">
                {selectedFlavours.length}/{maxFlavours} selected
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {FLAVOURS.map(f => {
              const active = selectedFlavours.includes(f);
              const disabled = !active && selectedFlavours.length >= maxFlavours;
              return (
                <button
                  key={f}
                  onClick={() => toggleFlavour(f)}
                  disabled={disabled && selectedScoop === null}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full border font-inter text-[13px] transition-all duration-150
                    ${active
                      ? 'bg-[#C8201A] border-[#C8201A] text-white'
                      : disabled
                        ? 'border-[#E8D8C8] text-[#CCCCCC] cursor-not-allowed bg-[#FDF8F2]'
                        : 'border-[#E8D8C8] text-[#555555] bg-[#FDF8F2] hover:border-[#C8201A]/50 hover:text-[#1A1A1A]'
                    }`}
                >
                  {active && <Check className="w-3 h-3" strokeWidth={3} />}
                  {f}
                </button>
              );
            })}
          </div>
        </section>

        {/* Step 3 — Toppings */}
        <section>
          <p className="font-barlow text-[12px] font-700 uppercase tracking-[0.25em] text-[#C8201A] mb-3">
            Step 3 — Toppings <span className="text-[#555555] normal-case font-400">(+75c each)</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {TOPPINGS.map(t => {
              const active = selectedToppings.includes(t);
              return (
                <button
                  key={t}
                  onClick={() => toggleTopping(t)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full border font-inter text-[13px] transition-all duration-150
                    ${active
                      ? 'bg-[#D4952A] border-[#D4952A] text-white'
                      : 'border-[#E8D8C8] text-[#555555] bg-[#FDF8F2] hover:border-[#D4952A]/50 hover:text-[#1A1A1A]'
                    }`}
                >
                  {active && <Check className="w-3 h-3" strokeWidth={3} />}
                  {t}
                </button>
              );
            })}
          </div>
        </section>

        {/* Step 4 — Sauce */}
        <section>
          <p className="font-barlow text-[12px] font-700 uppercase tracking-[0.25em] text-[#C8201A] mb-3">
            Step 4 — Sauce <span className="text-[#555555] normal-case font-400">(Free)</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {SAUCES.map(s => (
              <button
                key={s}
                onClick={() => setSelectedSauce(selectedSauce === s ? null : s)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full border font-inter text-[13px] transition-all duration-150
                  ${selectedSauce === s
                    ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white'
                    : 'border-[#E8D8C8] text-[#555555] bg-[#FDF8F2] hover:border-[#1A1A1A]/40 hover:text-[#1A1A1A]'
                  }`}
              >
                {selectedSauce === s && <Check className="w-3 h-3" strokeWidth={3} />}
                {s}
              </button>
            ))}
          </div>
        </section>

        {/* Add to Order */}
        <div className="border-t border-[#E8D8C8] pt-5 flex items-center justify-between gap-4">
          <div>
            {selectedScoop !== null && (
              <>
                <p className="font-inter text-[11px] text-[#555555]">
                  {SCOOPS[selectedScoop].label}
                  {selectedToppings.length > 0 && ` + ${selectedToppings.length} topping${selectedToppings.length > 1 ? 's' : ''}`}
                </p>
                <p className="font-bebas text-[28px] text-[#1A1A1A] leading-none">${total.toFixed(2)}</p>
              </>
            )}
          </div>
          <button
            disabled={selectedScoop === null || selectedFlavours.length === 0}
            className="flex items-center gap-2 bg-[#C8201A] hover:bg-[#9E1510] disabled:opacity-40 disabled:cursor-not-allowed
              text-white font-barlow font-700 text-[13px] uppercase tracking-wider px-6 py-3 rounded-xl
              transition-all shadow-[0_4px_16px_rgba(200,32,26,0.3)] hover:shadow-[0_6px_20px_rgba(200,32,26,0.45)]"
          >
            <ShoppingBag className="w-4 h-4" />
            Add to Order
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Special Card ──────────────────────────────────────────────────────────────

function SpecialCard({ item }: { item: typeof SPECIALS[0] }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E8D8C8] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.1)] transition-all duration-300">
      <div className="relative h-52 overflow-hidden">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <h3 className="font-bebas text-[26px] text-white tracking-wider leading-none">{item.name}</h3>
          <span className="font-bebas text-[22px] text-[#D4952A]">{item.price}</span>
        </div>
      </div>
      <div className="p-5">
        <ul className="space-y-1.5 mb-5">
          {item.includes.map(inc => (
            <li key={inc} className="flex items-center gap-2 font-inter text-[13px] text-[#555555]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8201A] flex-shrink-0" />
              {inc}
            </li>
          ))}
        </ul>
        <button className="w-full flex items-center justify-center gap-2 bg-[#C8201A] hover:bg-[#9E1510] text-white font-barlow font-700 text-[13px] uppercase tracking-wider py-3 rounded-xl transition-all shadow-[0_4px_16px_rgba(200,32,26,0.3)]">
          <ShoppingBag className="w-4 h-4" />
          Add to Order
        </button>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function IceCream() {
  return (
    <div className="bg-[#FDF8F2] min-h-screen pt-32 pb-24">
      <div className="container-custom">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="font-barlow text-[12px] font-700 uppercase tracking-[0.4em] text-[#D4952A] block mb-4">
            — Sweet Treats —
          </span>
          <h1 className="font-bebas text-[64px] md:text-[90px] text-[#1A1A1A] tracking-wider leading-none mb-4">
            Ice <span className="text-[#C8201A]">Cream</span>
          </h1>
          <p className="font-inter text-[#555555] text-[16px] max-w-xl mx-auto leading-relaxed">
            Build your perfect scoop or choose one of our signature specials.
          </p>
        </div>

        {/* Three-column layout: Builder + 2 Specials */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Builder takes 1 column */}
          <div className="lg:col-span-1">
            <IceCreamBuilder />
          </div>

          {/* Specials take 2 columns */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {SPECIALS.map(item => (
              <SpecialCard key={item.id} item={item} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
