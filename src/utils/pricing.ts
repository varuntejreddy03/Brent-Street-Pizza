import { type MenuItem } from '../types/menu';

export interface PriceCustomizations {
  size?: string;
  addedExtras?: { name: string; price: number }[];
  quantity?: number;
  scoops?: number;
  toppingsCount?: number;
  basePriceOverride?: number; // ← Used for items with dynamic base prices (e.g. Ice Cream scoops)
}

/**
 * Calculates the final price of an item based on its base price, selected size, and extras.
 */
export const calculateItemPrice = (item: MenuItem, customizations: PriceCustomizations = {}): number => {
  let total = (customizations.basePriceOverride !== undefined && customizations.basePriceOverride !== null)
    ? Number(customizations.basePriceOverride) 
    : Number(item.price || 0);

  // 1. Size Adjustment (Skip if basePrice is overridden)
  if (!customizations.basePriceOverride && customizations.size && item.sizes) {
    const sizeObj = item.sizes.find(s => s.name === customizations.size);
    if (sizeObj) {
      total = Number(sizeObj.price || 0);
    }
  }

  // 2. Added Extras (Pizzas, etc.)
  if (customizations.addedExtras && Array.isArray(customizations.addedExtras)) {
    const extrasTotal = customizations.addedExtras.reduce((acc, extra) => {
      const extraPrice = Number(extra.price || 0);
      return acc + extraPrice;
    }, 0);
    total += extrasTotal;
  }

  // 3. Ice Cream Specifics
  if (customizations.toppingsCount) {
    total += Number(customizations.toppingsCount) * 0.75; // Standard topping price
  }

  return total;
};

/**
 * Formats a number as currency ($X.XX)
 */
export const formatPrice = (price: number): string => {
  return `$${Number(price).toFixed(2)}`;
};
