import React, { useState, useEffect } from 'react';
import { Check, ShoppingBag } from 'lucide-react';
import { calculateItemPrice } from '../utils/pricing';

interface Props {
  scoops: any[];
  flavours: string[];
  toppings: string[];
  sauces: string[];
  onAddToCart?: (customizations: any) => void;
  onChange?: (customizations: any) => void;
  compact?: boolean;
}

const IceCreamBuilder: React.FC<Props> = ({ 
  scoops = [], 
  flavours = [], 
  toppings = [], 
  sauces = [], 
  onAddToCart,
  onChange,
  compact = false
}) => {
  const [selectedScoop, setSelectedScoop] = useState<number | null>(null);
  const [selectedFlavours, setSelectedFlavours] = useState<string[]>([]);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [selectedSauce, setSelectedSauce] = useState<string | null>(null);
  const [isAdded, setIsAdded] = useState(false);

  const maxFlavours = selectedScoop !== null && scoops[selectedScoop] 
    ? (scoops[selectedScoop].label.charAt(0) === '1' ? 1 : selectedScoop === 1 ? 2 : 3) 
    : 0;

  const total = selectedScoop !== null && scoops[selectedScoop]
    ? calculateItemPrice({ id: 'ice-cream-custom', price: scoops[selectedScoop].price } as any, { 
        toppingsCount: selectedToppings.length 
      })
    : 0;

  useEffect(() => {
    if (onChange && selectedScoop !== null) {
      onChange({
        scoops: scoops[selectedScoop].label,
        flavours: selectedFlavours,
        toppings: selectedToppings,
        sauce: selectedSauce,
        price: total,
        isValid: selectedFlavours.length > 0
      });
    }
  }, [selectedScoop, selectedFlavours, selectedToppings, selectedSauce, total]);

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

  const handleAdd = () => {
    if (onAddToCart && selectedScoop !== null) {
      onAddToCart({
        scoops: scoops[selectedScoop].label,
        flavours: selectedFlavours,
        toppings: selectedToppings,
        sauce: selectedSauce,
        price: total
      });
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  return (
    <div className={`bg-white rounded-2xl border border-[#E8D8C8] overflow-hidden ${compact ? '' : 'shadow-[0_8px_30px_rgba(0,0,0,0.06)]'}`}>
      {/* Header */}
      {!compact && (
        <div className="bg-[#FDF8F2] border-b border-[#E8D8C8] px-6 py-5">
          <h2 className="font-bebas text-[28px] tracking-wider text-[#1A1A1A]">🍨 Build Your Ice Cream</h2>
          <p className="font-inter text-[13px] text-[#555555] mt-0.5">Customise your perfect scoop</p>
        </div>
      )}

      <div className={`${compact ? 'p-2' : 'p-6'} space-y-6`}>

        {/* Step 1 — Scoops */}
        <section>
          <p className="font-barlow text-[11px] font-700 uppercase tracking-[0.25em] text-[#C8201A] mb-3">
            Step 1 — Choose Your Scoops
          </p>
          <div className="space-y-1.5">
            {scoops.map((s, i) => (
              <button
                key={s.label}
                onClick={() => { setSelectedScoop(i); setSelectedFlavours([]); }}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border-2 transition-all duration-200
                  ${selectedScoop === i
                    ? 'border-[#C8201A] bg-[#C8201A]/6'
                    : 'border-[#E8D8C8] bg-[#FDF8F2] hover:border-[#C8201A]/40'
                  }`}
              >
                <span className="flex items-center gap-3">
                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0
                    ${selectedScoop === i ? 'border-[#C8201A]' : 'border-[#CCCCCC]'}`}>
                    {selectedScoop === i && <span className="w-2 h-2 rounded-full bg-[#C8201A]" />}
                  </span>
                  <span className="font-inter text-[13px] font-600 text-[#1A1A1A]">{s.label}</span>
                </span>
                <span className="font-bebas text-[16px] text-[#C8201A]">${s.price}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Step 2 — Flavours */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <p className="font-barlow text-[11px] font-700 uppercase tracking-[0.25em] text-[#C8201A]">
              Step 2 — Flavours
            </p>
            {selectedScoop !== null && (
              <span className="font-inter text-[10px] text-[#555555]">
                {selectedFlavours.length}/{maxFlavours}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {flavours.map(f => {
              const active = selectedFlavours.includes(f);
              const disabled = !active && selectedFlavours.length >= maxFlavours;
              return (
                <button
                  key={f}
                  onClick={() => toggleFlavour(f)}
                  disabled={selectedScoop === null || (disabled)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-inter text-[12px] transition-all duration-150
                    ${active
                      ? 'bg-[#C8201A] border-[#C8201A] text-white'
                      : (disabled || selectedScoop === null)
                        ? 'border-[#E8D8C8] text-[#CCCCCC] cursor-not-allowed bg-[#FDF8F2]'
                        : 'border-[#E8D8C8] text-[#555555] bg-[#FDF8F2] hover:border-[#C8201A]/50 hover:text-[#1A1A1A]'
                    }`}
                >
                  {active && <Check className="w-2.5 h-2.5" strokeWidth={3} />}
                  {f}
                </button>
              );
            })}
          </div>
        </section>

        {/* Step 3 — Toppings */}
        <section>
          <p className="font-barlow text-[11px] font-700 uppercase tracking-[0.25em] text-[#C8201A] mb-3">
            Step 3 — Toppings (+75c)
          </p>
          <div className="flex flex-wrap gap-1.5">
            {toppings.map(t => {
              const active = selectedToppings.includes(t);
              return (
                <button
                  key={t}
                  onClick={() => toggleTopping(t)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-inter text-[12px] transition-all duration-150
                    ${active
                      ? 'bg-[#D4952A] border-[#D4952A] text-white'
                      : 'border-[#E8D8C8] text-[#555555] bg-[#FDF8F2] hover:border-[#D4952A]/50 hover:text-[#1A1A1A]'
                    }`}
                >
                  {active && <Check className="w-2.5 h-2.5" strokeWidth={3} />}
                  {t}
                </button>
              );
            })}
          </div>
        </section>

        {/* Step 4 — Sauce */}
        <section>
          <p className="font-barlow text-[11px] font-700 uppercase tracking-[0.25em] text-[#C8201A] mb-3">
            Step 4 — Sauce (Free)
          </p>
          <div className="flex flex-wrap gap-1.5">
            {sauces.map(s => (
              <button
                key={s}
                onClick={() => setSelectedSauce(selectedSauce === s ? null : s)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-inter text-[12px] transition-all duration-150
                  ${selectedSauce === s
                    ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white'
                    : 'border-[#E8D8C8] text-[#555555] bg-[#FDF8F2] hover:border-[#1A1A1A]/40 hover:text-[#1A1A1A]'
                  }`}
              >
                {selectedSauce === s && <Check className="w-2.5 h-2.5" strokeWidth={3} />}
                {s}
              </button>
            ))}
          </div>
        </section>

        {/* Add Button for mobile/standalone */}
        {!compact && (
          <div className="border-t border-[#E8D8C8] pt-5 flex items-center justify-between gap-4">
            <div>
              {selectedScoop !== null && (
                <p className="font-bebas text-[28px] text-[#1A1A1A] leading-none">${total.toFixed(2)}</p>
              )}
            </div>
            <button
              onClick={handleAdd}
              disabled={selectedScoop === null || selectedFlavours.length === 0}
              className={`flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed
                text-white font-barlow font-700 text-[13px] uppercase tracking-wider px-6 py-3 rounded-xl
                transition-all shadow-[0_4px_16px_rgba(200,32,26,0.3)] hover:shadow-[0_6px_20px_rgba(200,32,26,0.45)]
                ${isAdded ? 'bg-emerald-600 scale-95' : 'bg-[#C8201A] hover:bg-[#9E1510]'}`}
            >
              {isAdded ? (
                <><Check className="w-4 h-4" /> Added</>
              ) : (
                <><ShoppingBag className="w-4 h-4" /> Add to Order</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IceCreamBuilder;
