import { useState } from 'react';
import { ChevronDown, ShoppingBag, X } from 'lucide-react';

// ─── Data ────────────────────────────────────────────────────────────────────

const PIZZA = {
  name: 'Super Supreme',
  image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
  sizes: [
    { name: 'Small',  price: 14 },
    { name: 'Large',  price: 18 },
    { name: 'Family', price: 22 },
  ],
  baseToppings: [
    'Tomato Sauce', 'Virginia Leg Ham', 'Cheese', 'Mushroom',
    'Pepperoni', 'Fresh Capsicum', 'Kalamata Olive', 'Spanish Onion', 'Pineapple',
  ],
  extras: [
    {
      id: 'sauce', name: 'Sauce',
      options: [
        { name: 'BBQ Sauce', price: 1 }, { name: 'Garlic Aioli', price: 1 },
        { name: 'Peri-Peri Sauce', price: 1 }, { name: 'Sweet Chilli', price: 1.50 },
        { name: 'Sour Cream', price: 1.50 }, { name: 'Spicy Mayo', price: 1.50 },
      ],
    },
    {
      id: 'cheese', name: 'Cheese',
      options: [
        { name: 'Bocconcini', price: 1.50 }, { name: 'Extra Cheese', price: 1.50 },
        { name: 'Feta', price: 2.50 }, { name: 'Mozzarella', price: 2.50 },
        { name: 'Vegan Cheese', price: 0 },
      ],
    },
    {
      id: 'veggies', name: 'Veggies',
      options: [
        { name: 'Jalapeños', price: 1.50 }, { name: 'Chilli', price: 1.50 },
        { name: 'Spinach', price: 1.50 }, { name: 'Sundried Tomatoes', price: 1.50 },
        { name: 'Sweet Corn', price: 1.50 }, { name: 'Grilled Eggplant', price: 1.50 },
      ],
    },
    {
      id: 'meat', name: 'Meat',
      options: [
        { name: 'Bacon', price: 3 }, { name: 'Hot Salami', price: 4 },
        { name: 'Chicken', price: 4 }, { name: 'Eye Bacon', price: 3 },
        { name: 'Braised Lamb', price: 5 }, { name: 'Ground Beef', price: 1.50 },
      ],
    },
    {
      id: 'seafood', name: 'Seafood',
      options: [
        { name: 'Anchovies', price: 1.50 }, { name: 'Garlic Prawns', price: 1.50 },
        { name: 'Prawns', price: 4 }, { name: 'Mussel', price: 1.50 },
      ],
    },
    {
      id: 'garnish', name: 'Garnish',
      options: [
        { name: 'Herbs', price: 0.25 }, { name: 'Oregano', price: 0.25 },
        { name: 'Parsley', price: 0.25 }, { name: 'Chili Flakes', price: 0.50 },
        { name: 'Lemon', price: 1.50 },
      ],
    },
  ],
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function SuperSupremeCard() {
  const [selectedSize, setSelectedSize] = useState(PIZZA.sizes[1]); // default Large
  const [toppings, setToppings] = useState<string[]>(PIZZA.baseToppings);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [extras, setExtras] = useState<{ name: string; price: number }[]>([]);

  const extrasTotal = extras.reduce((sum, e) => sum + e.price, 0);
  const orderTotal = selectedSize.price + extrasTotal;

  const removeTopping = (t: string) => setToppings(prev => prev.filter(x => x !== t));

  const toggleExtra = (opt: { name: string; price: number }) => {
    setExtras(prev =>
      prev.find(e => e.name === opt.name)
        ? prev.filter(e => e.name !== opt.name)
        : [...prev, opt]
    );
  };

  return (
    <div className="relative bg-[#1a0a00] rounded-2xl border border-white/10 overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.6)] max-w-md w-full mx-auto flex flex-col">

      {/* Hero image */}
      <div className="relative h-52 overflow-hidden">
        <img src={PIZZA.image} alt={PIZZA.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a0a00] via-[#1a0a00]/40 to-transparent" />
        <div className="absolute bottom-4 left-5">
          <h2 className="font-bebas text-[36px] text-white tracking-widest leading-none drop-shadow-lg">
            {PIZZA.name}
          </h2>
          <p className="font-inter text-[12px] text-white/50 mt-0.5 leading-snug max-w-[260px]">
            {PIZZA.baseToppings.join(', ')}
          </p>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto hide-scroll px-5 pt-5 pb-28 space-y-6">

        {/* Size selector */}
        <div>
          <p className="font-barlow text-[11px] font-700 uppercase tracking-[0.2em] text-[#d4a017] mb-3">Choose Size</p>
          <div className="grid grid-cols-3 gap-2">
            {PIZZA.sizes.map(size => (
              <button
                key={size.name}
                onClick={() => setSelectedSize(size)}
                className={`flex flex-col items-center py-3 rounded-xl border font-barlow transition-all duration-200 ${
                  selectedSize.name === size.name
                    ? 'bg-[#C0392B] border-[#C0392B] text-white shadow-[0_0_14px_rgba(192,57,43,0.45)]'
                    : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30 hover:text-white'
                }`}
              >
                <span className="text-[13px] font-700 uppercase tracking-wider">{size.name}</span>
                <span className="text-[15px] font-800 mt-0.5">${size.price}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Current toppings */}
        <div>
          <p className="font-barlow text-[11px] font-700 uppercase tracking-[0.2em] text-[#d4a017] mb-3">
            Current Toppings <span className="text-white/30 normal-case font-400">— tap × to remove</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {toppings.map(t => (
              <span
                key={t}
                className="flex items-center gap-1.5 bg-[#2b1200] border border-white/15 text-white/80 font-inter text-[12px] px-3 py-1.5 rounded-full"
              >
                {t}
                <button
                  onClick={() => removeTopping(t)}
                  className="text-white/40 hover:text-[#C0392B] transition-colors leading-none"
                  aria-label={`Remove ${t}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {toppings.length === 0 && (
              <span className="font-inter text-[12px] text-white/30 italic">No toppings selected</span>
            )}
          </div>
        </div>

        {/* Extras accordion */}
        <div>
          <p className="font-barlow text-[11px] font-700 uppercase tracking-[0.2em] text-[#d4a017] mb-3">Extras</p>
          <div className="space-y-2">
            {PIZZA.extras.map(cat => (
              <div key={cat.id} className="border border-white/10 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenAccordion(openAccordion === cat.id ? null : cat.id)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-[#2b1200] hover:bg-[#3a1800] transition-colors"
                >
                  <span className="font-barlow text-[13px] font-700 uppercase tracking-wider text-white">{cat.name}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-white/40 transition-transform duration-200 ${openAccordion === cat.id ? 'rotate-180' : ''}`}
                  />
                </button>
                {openAccordion === cat.id && (
                  <div className="px-4 py-3 bg-[#1a0a00] flex flex-wrap gap-2">
                    {cat.options.map(opt => {
                      const isAdded = extras.some(e => e.name === opt.name);
                      return (
                        <button
                          key={opt.name}
                          onClick={() => toggleExtra(opt)}
                          className={`font-inter text-[12px] px-3 py-1.5 rounded-full border transition-all duration-150 ${
                            isAdded
                              ? 'bg-[#C0392B] border-[#C0392B] text-white'
                              : 'bg-white/5 border-white/15 text-white/70 hover:border-white/40 hover:text-white'
                          }`}
                        >
                          {opt.name}
                          {opt.price > 0 ? ` +$${opt.price.toFixed(2)}` : ' FREE'}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Added extras summary */}
        {extras.length > 0 && (
          <div>
            <p className="font-barlow text-[11px] font-700 uppercase tracking-[0.2em] text-[#d4a017] mb-2">Added Extras</p>
            <div className="flex flex-wrap gap-2">
              {extras.map(e => (
                <span
                  key={e.name}
                  className="flex items-center gap-1.5 bg-[#C0392B]/15 border border-[#C0392B]/40 text-white/80 font-inter text-[12px] px-3 py-1.5 rounded-full"
                >
                  {e.name} {e.price > 0 && <span className="text-[#d4a017]">+${e.price.toFixed(2)}</span>}
                  <button onClick={() => toggleExtra(e)} className="text-white/40 hover:text-white transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#1a0a00]/95 backdrop-blur-md border-t border-white/10 px-5 py-4 flex items-center justify-between gap-4">
        <div className="leading-tight">
          <div className="font-inter text-[11px] text-white/40 flex gap-1 items-center">
            <span>${selectedSize.price.toFixed(2)}</span>
            {extrasTotal > 0 && <><span>+</span><span className="text-[#d4a017]">${extrasTotal.toFixed(2)}</span></>}
          </div>
          <div className="font-bebas text-[28px] text-white leading-none tracking-wider">
            ${orderTotal.toFixed(2)}
          </div>
        </div>
        <button className="flex items-center gap-2 bg-[#C0392B] hover:bg-[#a93226] active:scale-95 text-white font-barlow font-700 text-[14px] uppercase tracking-wider px-6 py-3 rounded-xl transition-all duration-200 shadow-[0_4px_20px_rgba(192,57,43,0.4)] hover:shadow-[0_6px_28px_rgba(192,57,43,0.6)]">
          <ShoppingBag className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
