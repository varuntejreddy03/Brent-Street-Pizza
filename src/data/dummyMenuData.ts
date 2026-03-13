import { type MenuCategory, type MenuItem, type ExtraCategory } from '../types/menu';

export const PIZZA_EXTRAS: ExtraCategory[] = [
  {
    id: 'sauce',
    name: 'Sauce',
    options: [
      { name: 'BBQ Sauce', price: 1 },
      { name: 'Garlic Aioli', price: 1 },
      { name: 'Garlic Mayo', price: 1.50 },
      { name: 'Peri-Peri Mayo', price: 1.50 },
      { name: 'Peri-Peri Sauce', price: 1 },
      { name: 'Pesto Mayo', price: 1 },
      { name: 'Sour Cream', price: 1.50 },
      { name: 'Spicy Mayo', price: 1.50 },
      { name: 'Sweet Chilli Sauce', price: 1.50 },
      { name: 'Tandoori Sauce', price: 1.50 },
      { name: 'Tomato Sauce', price: 1.50 },
      { name: 'Chilli Paste', price: 0 }
    ]
  },
  {
    id: 'cheese',
    name: 'Cheese',
    options: [
      { name: 'Bocconcini', price: 1.50 },
      { name: 'Cheese', price: 1.50 },
      { name: 'Feta', price: 2.50 },
      { name: 'Mozzarella', price: 2.50 },
      { name: 'Tandoori Paneer', price: 1.50 },
      { name: 'Vegan Cheese', price: 0 }
    ]
  },
  {
    id: 'veggies',
    name: 'Veggies',
    options: [
      { name: 'Capsicum', price: 1.50 },
      { name: 'Chilli', price: 1.50 },
      { name: 'Garlic', price: 1.50 },
      { name: 'Grilled Eggplant', price: 1.50 },
      { name: 'Jalapenos', price: 1.50 },
      { name: 'Kalamata Olives', price: 1.50 },
      { name: 'Mushrooms', price: 1.50 },
      { name: 'Olives', price: 1.50 },
      { name: 'Onion', price: 1.50 },
      { name: 'Pineapple', price: 1.50 },
      { name: 'Spanish Onion', price: 1.50 },
      { name: 'Spinach', price: 1.50 },
      { name: 'Sundried Tomatoes', price: 1.50 },
      { name: 'Sweet Corn', price: 1.50 },
      { name: 'Tomato', price: 0 }
    ]
  },
  {
    id: 'meat',
    name: 'Meat',
    options: [
      { name: 'Bacon', price: 3 },
      { name: 'Beef', price: 3 },
      { name: 'Braised Lamb', price: 5 },
      { name: 'Chicken', price: 4 },
      { name: 'Egg', price: 1.50 },
      { name: 'Eye Bacon', price: 3 },
      { name: 'Ground Beef', price: 1.50 },
      { name: 'Ham', price: 3 },
      { name: 'Hot Salami', price: 4 },
      { name: 'Pepperoni', price: 1.50 },
      { name: 'Salami', price: 1.50 },
      { name: 'Virginia Leg Ham', price: 0 }
    ]
  },
  {
    id: 'seafood',
    name: 'Seafood',
    options: [
      { name: 'Anchovies', price: 1.50 },
      { name: 'Garlic Prawns', price: 1.50 },
      { name: 'Mussel', price: 1.50 },
      { name: 'Prawns', price: 4 },
      { name: 'Smoked Salmon', price: 0 }
    ]
  },
  {
    id: 'garnish',
    name: 'Garnish',
    options: [
      { name: 'Herbs', price: 0.25 },
      { name: 'Lemon', price: 1.50 },
      { name: 'Oregano', price: 0.25 },
      { name: 'Parsley', price: 0.25 },
      { name: 'Chili Flakes', price: 0.50 }
    ]
  }
];

export const CATEGORIES: MenuCategory[] = [
  { id: 'cat-meal-deals', name: 'Meal Deals', iconName: 'Tag' },
  { id: 'cat-classic-pizza', name: 'Classic Pizza', iconName: 'Pizza' },
  { id: 'cat-meat-pizza', name: 'Meat Pizza', iconName: 'Beef' },
  { id: 'cat-seafood-pizza', name: 'Seafood Pizza', iconName: 'Fish' },
  { id: 'cat-chicken-pizza', name: 'Chicken Pizza', iconName: 'Drumstick' },
  { id: 'cat-vegetarian-pizza', name: 'Vegetarian Pizza', iconName: 'Leaf' },
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'pizza-margherita',
    categoryId: 'cat-classic-pizza',
    name: 'Margherita',
    description: 'Tomato Sauce, Cheese and Oregano',
    price: 12.00,
    sizes: [
      { name: 'Small', price: 12 },
      { name: 'Large', price: 15 },
      { name: 'Family', price: 20 }
    ],
    toppings: ['Tomato Sauce', 'Cheese', 'Oregano'],
    hasPizzaExtras: true,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80',
    tags: { isFavorite: true }
  }
];

export const ADD_ONS: MenuItem[] = [];
