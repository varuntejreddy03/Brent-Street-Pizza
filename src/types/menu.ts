export interface MenuSize {
  name: string;
  price: number;
}

export interface ExtraCategory {
  id: string;
  name: string;
  options: { name: string; price: number }[];
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  tags: {
    isVegan?: boolean;
    isGlutenFree?: boolean;
    isSpicy?: boolean;
    isFavorite?: boolean;
  };
  sizes?: MenuSize[];
  toppings?: string[];
  isFavorite?: boolean;
  hasPizzaExtras?: boolean;
  isActive?: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  iconName: string; // We'll map this to Lucide icons in the component
  isActive?: boolean;
}

export interface CartItem {
  id: string;
  menuItemId?: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  removedToppings?: string[];
  addedExtras?: { name: string; price: number }[];
}
