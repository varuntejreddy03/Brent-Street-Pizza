import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { type MenuItem } from '../types/menu';
import { useMenu } from '../context/MenuContext';

interface CustomizationModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItem, customizations: any) => void;
}

const CustomizationModal: React.FC<CustomizationModalProps> = ({ item, isOpen, onClose, onAddToCart }) => {
  const { extras } = useMenu();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [removedToppings, setRemovedToppings] = useState<Set<string>>(new Set());
  const [addedExtras, setAddedExtras] = useState<Map<string, { name: string; price: number }>>(new Map());

  useEffect(() => {
    if (item) {
      // Default to first size if available
      if (item.sizes && item.sizes.length > 0) {
        setSelectedSize(item.sizes[0].name);
      } else {
        setSelectedSize('');
      }
      setRemovedToppings(new Set());
      setAddedExtras(new Map());
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const currentSizeObj = item.sizes?.find(s => s.name === selectedSize);
  const basePrice = currentSizeObj ? currentSizeObj.price : item.price;

  let extrasTotal = 0;
  addedExtras.forEach(ext => extrasTotal += ext.price);
  const totalPrice = basePrice + extrasTotal;

  const handleToggleTopping = (topping: string) => {
    const next = new Set(removedToppings);
    if (next.has(topping)) {
      next.delete(topping);
    } else {
      next.add(topping);
    }
    setRemovedToppings(next);
  };

  const handleToggleExtra = (extraName: string, price: number) => {
    const next = new Map(addedExtras);
    if (next.has(extraName)) {
      next.delete(extraName);
    } else {
      next.set(extraName, { name: extraName, price });
    }
    setAddedExtras(next);
  };

  const handleSubmit = () => {
    onAddToCart(item, {
      size: selectedSize || undefined,
      price: basePrice, // Pass base price before extras, addToCart adds extras
      removedToppings: Array.from(removedToppings),
      addedExtras: Array.from(addedExtras.values())
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[300] bg-black/80 flex items-center justify-center p-4">
      <div className="bg-[#1a0a00] border border-white/10 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#2b1200]">
          <div>
            <h3 className="font-bebas text-3xl text-white tracking-wider">{item.name}</h3>
            <p className="font-barlow text-[#d4a017] uppercase tracking-widest text-sm">Customize your order</p>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 hide-scroll space-y-8">

          {/* Sizes */}
          {item.sizes && item.sizes.length > 0 && (
            <div>
              <h4 className="font-bebas text-2xl text-white tracking-wide border-b border-white/10 pb-2 mb-4">Choose Size</h4>
              <div className="flex flex-col gap-3">
                {item.sizes.map(size => (
                  <label key={size.name} className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${selectedSize === size.name ? 'border-[#C0392B] bg-[#C0392B]/10' : 'border-white/10 bg-white/5 hover:border-white/30'}`}>
                    <input type="radio" name="size" className="hidden" checked={selectedSize === size.name} onChange={() => setSelectedSize(size.name)} />
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedSize === size.name ? 'border-[#C0392B]' : 'border-white/30'}`}>
                        {selectedSize === size.name && <div className="w-2.5 h-2.5 bg-[#C0392B] rounded-full" />}
                      </div>
                      <span className="font-barlow text-lg font-bold text-white uppercase">{size.name}</span>
                    </div>
                    <span className="font-barlow text-lg font-bold text-white">${size.price.toFixed(2)}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Current Toppings */}
          {item.toppings && item.toppings.length > 0 && (
            <div>
              <h4 className="font-bebas text-2xl text-white tracking-wide border-b border-white/10 pb-2 mb-4">Current Toppings</h4>
              <p className="font-inter text-sm text-white/40 mb-3">Uncheck to remove from your pizza.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {item.toppings.map(topping => {
                  const isRemoved = removedToppings.has(topping);
                  return (
                    <label key={topping} className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${!isRemoved ? 'border-white/20 bg-white/5' : 'border-white/5 bg-transparent opacity-50'}`}>
                      <input type="checkbox" className="hidden" checked={!isRemoved} onChange={() => handleToggleTopping(topping)} />
                      <div className={`w-5 h-5 rounded border flex items-center justify-center ${!isRemoved ? 'border-[#d4a017] bg-[#d4a017]/20' : 'border-white/30'}`}>
                        {!isRemoved && <Check className="w-3 h-3 text-[#d4a017]" />}
                      </div>
                      <span className={`font-inter text-sm ${!isRemoved ? 'text-white' : 'text-white/40 line-through'}`}>{topping}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Extras */}
          {item.hasPizzaExtras && extras.map(cat => (
            <div key={cat.id}>
              <h4 className="font-bebas text-xl text-[#d4a017] tracking-wider border-b border-white/10 pb-2 mb-4 uppercase">{cat.name} Extras</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {cat.options.map(opt => {
                  const isAdded = addedExtras.has(opt.name);
                  return (
                    <label key={opt.name} className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${isAdded ? 'border-[#C0392B] bg-[#C0392B]/10' : 'border-white/10 bg-white/5 hover:border-white/30'}`}>
                      <input type="checkbox" className="hidden" checked={isAdded} onChange={() => handleToggleExtra(opt.name, opt.price)} />
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${isAdded ? 'border-[#C0392B] bg-[#C0392B]' : 'border-white/30'}`}>
                          {isAdded && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="font-inter text-sm text-white">{opt.name}</span>
                      </div>
                      <span className="font-barlow text-sm font-bold text-white/60">
                        {opt.price > 0 ? `+$${opt.price.toFixed(2)}` : 'FREE'}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-[#2b1200] flex justify-between items-center">
          <div>
            <span className="block font-barlow text-sm font-bold text-white/50 uppercase tracking-widest">Total</span>
            <span className="font-bebas text-4xl text-white leading-none">${totalPrice.toFixed(2)}</span>
          </div>
          <button onClick={handleSubmit} className="bg-[#C0392B] hover:bg-[#A93226] text-white font-barlow font-bold text-lg uppercase tracking-wider px-8 py-4 rounded transition-colors shadow-lg">
            Add to Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizationModal;
