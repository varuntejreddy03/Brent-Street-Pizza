import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PIZZA_EXTRAS = [
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
      { name: 'Chilli Paste', price: 1.50 },
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
      { name: 'Vegan Cheese', price: 5 },
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
      { name: 'Tomato', price: 1.50 },
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
      { name: 'Virginia Leg Ham', price: 3 },
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
      { name: 'Smoked Salmon', price: 1.50 },
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
      { name: 'Chili Flakes', price: 0.50 },
    ]
  }
];

const CATEGORIES = [
  { id: 'cat-classic-pizza', name: 'Classic Pizza', iconName: 'Pizza' },
  { id: 'cat-meat-pizza', name: 'Meat Pizza', iconName: 'Beef' },
  { id: 'cat-seafood-pizza', name: 'Seafood Pizza', iconName: 'Fish' },
  { id: 'cat-chicken-pizza', name: 'Chicken Pizza', iconName: 'Drumstick' },
  { id: 'cat-vegetarian-pizza', name: 'Vegetarian Pizza', iconName: 'Leaf' },
  { id: 'cat-desserts', name: 'Desserts', iconName: 'CakeSlice' },
  { id: 'cat-ice-cream', name: 'Ice Cream', iconName: 'IceCream' },
];

const PIZZA_SIZES = [
  { name: 'Small', price: 14 },
  { name: 'Large', price: 18 },
  { name: 'Family', price: 22 },
];

const MENU_ITEMS = [
  // ── Classic Pizza ──────────────────────────────────────────────────────────
  {
    id: 'pizza-margherita',
    categoryId: 'cat-classic-pizza',
    name: 'Margherita',
    description: 'Tomato Sauce, Cheese, Oregano',
    price: 14,
    sizes: PIZZA_SIZES,
    toppings: ['Tomato Sauce', 'Cheese', 'Oregano'],
    hasPizzaExtras: true,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80',
    tags: { isVegan: false, isFavorite: true },
  },
  {
    id: 'pizza-super-supreme',
    categoryId: 'cat-classic-pizza',
    name: 'Super Supreme',
    description: 'Tomato Sauce, Virginia Leg Ham, Cheese, Mushroom, Pepperoni, Fresh Capsicum, Kalamata Olive, Spanish Onion, Pineapple',
    price: 14,
    sizes: PIZZA_SIZES,
    toppings: ['Tomato Sauce', 'Virginia Leg Ham', 'Cheese', 'Mushroom', 'Pepperoni', 'Fresh Capsicum', 'Kalamata Olive', 'Spanish Onion', 'Pineapple'],
    hasPizzaExtras: true,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80',
    tags: { isFavorite: true },
  },
  {
    id: 'pizza-hawaiian',
    categoryId: 'cat-classic-pizza',
    name: 'Hawaiian',
    description: 'Tomato Sauce, Ham, Cheese, Pineapple',
    price: 14,
    sizes: PIZZA_SIZES,
    toppings: ['Tomato Sauce', 'Ham', 'Cheese', 'Pineapple'],
    hasPizzaExtras: true,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80',
    tags: {},
  },
  {
    id: 'pizza-bbq-chicken-classic',
    categoryId: 'cat-classic-pizza',
    name: 'BBQ Chicken',
    description: 'BBQ Sauce, Chicken, Cheese, Onion, Capsicum',
    price: 14,
    sizes: PIZZA_SIZES,
    toppings: ['BBQ Sauce', 'Chicken', 'Cheese', 'Onion', 'Capsicum'],
    hasPizzaExtras: true,
    image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=600&q=80',
    tags: {},
  },

  // ── Meat Pizza ─────────────────────────────────────────────────────────────
  {
    id: 'pizza-meat-lovers',
    categoryId: 'cat-meat-pizza',
    name: 'Meat Lovers',
    description: 'Tomato Sauce, Pepperoni, Salami, Bacon, Ham, Beef, Cheese',
    price: 14,
    sizes: PIZZA_SIZES,
    toppings: ['Tomato Sauce', 'Pepperoni', 'Salami', 'Bacon', 'Ham', 'Beef', 'Cheese'],
    hasPizzaExtras: true,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&q=80',
    tags: { isFavorite: true },
  },
  {
    id: 'pizza-pepperoni',
    categoryId: 'cat-meat-pizza',
    name: 'Pepperoni',
    description: 'Tomato Sauce, Double Pepperoni, Cheese',
    price: 14,
    sizes: PIZZA_SIZES,
    toppings: ['Tomato Sauce', 'Double Pepperoni', 'Cheese'],
    hasPizzaExtras: true,
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=600&q=80',
    tags: {},
  },
  {
    id: 'pizza-bbq-beef',
    categoryId: 'cat-meat-pizza',
    name: 'BBQ Beef',
    description: 'BBQ Sauce, Ground Beef, Cheese, Onion, Jalapeños',
    price: 14,
    sizes: PIZZA_SIZES,
    toppings: ['BBQ Sauce', 'Ground Beef', 'Cheese', 'Onion', 'Jalapeños'],
    hasPizzaExtras: true,
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=600&q=80',
    tags: { isSpicy: true },
  },
  {
    id: 'pizza-hot-salami',
    categoryId: 'cat-meat-pizza',
    name: 'Hot Salami',
    description: 'Tomato Sauce, Hot Salami, Cheese, Chilli, Capsicum',
    price: 14,
    sizes: PIZZA_SIZES,
    toppings: ['Tomato Sauce', 'Hot Salami', 'Cheese', 'Chilli', 'Capsicum'],
    hasPizzaExtras: true,
    image: 'https://images.unsplash.com/photo-1548369937-47519962c11a?w=600&q=80',
    tags: { isSpicy: true },
  },

  // ── Seafood Pizza ──────────────────────────────────────────────────────────
  {
    id: 'pizza-prawn-garlic',
    categoryId: 'cat-seafood-pizza',
    name: 'Prawn & Garlic',
    description: 'Garlic Aioli, Prawns, Cheese, Spinach, Sundried Tomatoes',
    price: 14,
    sizes: PIZZA_SIZES,
    toppings: ['Garlic Aioli', 'Prawns', 'Cheese', 'Spinach', 'Sundried Tomatoes'],
    hasPizzaExtras: true,
    image: 'https://images.unsplash.com/photo-1555072956-7758afb20e8f?w=600&q=80',
    tags: {},
  },
  {
    id: 'pizza-smoked-salmon',
    categoryId: 'cat-seafood-pizza',
    name: 'Smoked Salmon',
    description: 'Sour Cream, Smoked Salmon, Cheese, Capers, Spanish Onion',
    price: 14,
    sizes: PIZZA_SIZES,
    toppings: ['Sour Cream', 'Smoked Salmon', 'Cheese', 'Capers', 'Spanish Onion'],
    hasPizzaExtras: true,
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80',
    tags: {},
  },
  {
    id: 'pizza-anchovy',
    categoryId: 'cat-seafood-pizza',
    name: 'Anchovy & Olive',
    description: 'Tomato Sauce, Anchovies, Kalamata Olives, Cheese, Garlic',
    price: 14,
    sizes: PIZZA_SIZES,
    toppings: ['Tomato Sauce', 'Anchovies', 'Kalamata Olives', 'Cheese', 'Garlic'],
    hasPizzaExtras: true,
    image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=600&q=80',
    tags: {},
  },

  // ── Chicken Pizza ──────────────────────────────────────────────────────────
  {
    id: 'pizza-tandoori-chicken',
    categoryId: 'cat-chicken-pizza',
    name: 'Tandoori Chicken',
    description: 'Tandoori Sauce, Chicken, Tandoori Paneer, Onion, Capsicum',
    price: 14,
    sizes: PIZZA_SIZES,
    toppings: ['Tandoori Sauce', 'Chicken', 'Tandoori Paneer', 'Onion', 'Capsicum'],
    hasPizzaExtras: true,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&q=80',
    tags: { isFavorite: true },
  },
  {
    id: 'pizza-peri-peri-chicken',
    categoryId: 'cat-chicken-pizza',
    name: 'Peri Peri Chicken',
    description: 'Peri-Peri Sauce, Chicken, Cheese, Onion, Jalapeños',
    price: 14,
    sizes: PIZZA_SIZES,
    toppings: ['Peri-Peri Sauce', 'Chicken', 'Cheese', 'Onion', 'Jalapeños'],
    hasPizzaExtras: true,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80',
    tags: { isSpicy: true },
  },
  {
    id: 'pizza-chicken-bacon',
    categoryId: 'cat-chicken-pizza',
    name: 'Chicken & Bacon',
    description: 'BBQ Sauce, Chicken, Bacon, Cheese, Mushroom',
    price: 14,
    sizes: PIZZA_SIZES,
    toppings: ['BBQ Sauce', 'Chicken', 'Bacon', 'Cheese', 'Mushroom'],
    hasPizzaExtras: true,
    image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=600&q=80',
    tags: {},
  },

  // ── Vegetarian Pizza ───────────────────────────────────────────────────────
  {
    id: 'pizza-garden-veg',
    categoryId: 'cat-vegetarian-pizza',
    name: 'Garden Veggie',
    description: 'Tomato Sauce, Cheese, Capsicum, Mushroom, Onion, Olives, Spinach',
    price: 14,
    sizes: PIZZA_SIZES,
    toppings: ['Tomato Sauce', 'Cheese', 'Capsicum', 'Mushroom', 'Onion', 'Olives', 'Spinach'],
    hasPizzaExtras: true,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80',
    tags: { isVegan: true },
  },
  {
    id: 'pizza-feta-spinach',
    categoryId: 'cat-vegetarian-pizza',
    name: 'Feta & Spinach',
    description: 'Pesto Mayo, Feta, Spinach, Sundried Tomatoes, Bocconcini',
    price: 14,
    sizes: PIZZA_SIZES,
    toppings: ['Pesto Mayo', 'Feta', 'Spinach', 'Sundried Tomatoes', 'Bocconcini'],
    hasPizzaExtras: true,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80',
    tags: { isVegan: false, isGlutenFree: false },
  },
  {
    id: 'pizza-roast-pumpkin',
    categoryId: 'cat-vegetarian-pizza',
    name: 'Roast Pumpkin',
    description: 'Garlic Aioli, Grilled Eggplant, Sweet Corn, Cheese, Spinach, Tomato',
    price: 14,
    sizes: PIZZA_SIZES,
    toppings: ['Garlic Aioli', 'Grilled Eggplant', 'Sweet Corn', 'Cheese', 'Spinach', 'Tomato'],
    hasPizzaExtras: true,
    image: 'https://images.unsplash.com/photo-1548369937-47519962c11a?w=600&q=80',
    tags: { isVegan: true },
  },

  // ── Desserts ──────────────────────────────────────────────────────────────
  {
    id: 'dessert-tiramisu',
    categoryId: 'cat-desserts',
    name: 'Classic Tiramisu',
    description: 'Traditional Italian dessert with coffee-soaked ladyfingers and mascarpone.',
    price: 8.5,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=80',
    tags: { isFavorite: true },
  },
  {
    id: 'dessert-brownie',
    categoryId: 'cat-desserts',
    name: 'Choco Fudge Brownie',
    description: 'Warm, gooey chocolate brownie served with a drizzle of chocolate sauce.',
    price: 6.5,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=80',
    tags: {},
  },

  // ── Ice Cream ──────────────────────────────────────────────────────────────
  {
    id: 'ice-cream-custom',
    categoryId: 'cat-ice-cream',
    name: 'Custom Ice Cream',
    description: 'Build your own artisan ice cream with your choice of scoops, flavours, and toppings.',
    price: 4,
    image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&q=80',
    tags: {},
    rating: 4.7,
    isFavorite: false,
  },
  {
    id: 'ice-cream-banana-split',
    categoryId: 'cat-ice-cream',
    name: 'Banana Split',
    description: 'Fresh banana, 3 scoops of ice cream, whipped cream, and sprinkles.',
    price: 12,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&q=80',
    tags: {},
    rating: 4.8,
    isFavorite: false,
  },
  {
    id: 'ice-cream-triple-sundae',
    categoryId: 'cat-ice-cream',
    name: 'Triple Sundae',
    description: '3 scoops of your favourite flavours with 3 toppings and sauce.',
    price: 10,
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&q=80',
    tags: {},
    rating: 4.9,
    isFavorite: false,
  },
];

const UI_CONTENT = [
  // Hero Section
  { section: 'hero', key: 'image', value: '/heropic.jpeg', type: 'image' },
  { section: 'hero', key: 'subtitle', value: 'Hot & Fresh', type: 'text' },
  { section: 'hero', key: 'title', value: 'Pizza', type: 'text' },
  { section: 'hero', key: 'description', value: 'Made to order.', type: 'text' },
  { section: 'hero', key: 'cta_pickup_text', value: 'ORDER PICKUP', type: 'text' },
  { section: 'hero', key: 'cta_pickup_link', value: '/menu', type: 'link' },
  { section: 'hero', key: 'cta_delivery_text', value: 'ORDER DELIVERY', type: 'text' },
  { section: 'hero', key: 'cta_delivery_link', value: '/menu?tab=delivery', type: 'link' },

  // Catering Section
  { section: 'catering', key: 'subtitle', value: '— For Groups —', type: 'text' },
  { section: 'catering', key: 'title', value: 'Feeding a Crowd?', type: 'text' },
  { section: 'catering', key: 'description', value: "Whether it's 20 or 200 — we've got you covered. Our catering team works with your schedule, your budget, and your crowd to deliver a pizza experience everyone will remember.", type: 'text' },
  { 
    section: 'catering', 
    key: 'event_types', 
    value: JSON.stringify([
      { emoji: '🎂', label: 'Birthdays' },
      { emoji: '💼', label: 'Corporate Events' },
      { emoji: '🏈', label: 'Footy Nights' },
      { emoji: '🎉', label: 'Private Parties' },
      { emoji: '🎓', label: 'Graduations' },
      { emoji: '🎪', label: 'Community Events' },
    ]), 
    type: 'json' 
  },
  { 
    section: 'catering', 
    key: 'details', 
    value: JSON.stringify([
      'Minimum 20 pizzas for catering',
      'Fresh, made-to-order on the day',
      'Delivery or pickup available',
      'Custom menu options available',
      'Early booking discounts for 50+ orders',
    ]), 
    type: 'json' 
  },
  { section: 'catering', key: 'phone', value: '0362724004', type: 'text' },
  { section: 'catering', key: 'phone_display', value: '03 6272 4004', type: 'text' },

  // Favourites Section
  { section: 'favourites', key: 'subtitle', value: '— Community Picks —', type: 'text' },
  { section: 'favourites', key: 'title', value: 'Customer Favourites', type: 'text' },
  { section: 'favourites', key: 'description', value: 'The most-loved pizzas from our menu, ordered again and again.', type: 'text' },

  // Delivery Areas Section
  { section: 'delivery', key: 'title', value: 'Delivery Areas', type: 'text' },
  { section: 'delivery', key: 'description', value: 'Hot, fresh pizza delivered within 5km of Brent Street Pizza, Glenorchy.', type: 'text' },
  { 
    section: 'delivery', 
    key: 'stats', 
    value: JSON.stringify([
      { icon: 'Bike', value: '5km', label: 'Delivery Radius' },
      { icon: 'DollarSign', value: 'Flat Fee', label: 'No hidden costs' },
      { icon: 'Clock', value: 'Min $25', label: 'Minimum order' },
    ]), 
    type: 'json' 
  },
  { 
    section: 'delivery', 
    key: 'suburbs', 
    value: JSON.stringify(['Glenorchy', 'Moonah', 'West Moonah', 'Derwent Park', 'Montrose', 'Rosetta']), 
    type: 'json' 
  },

  // Info Section
  { section: 'info', key: 'subtitle', value: '— our story —', type: 'text' },
  { section: 'info', key: 'title_1', value: 'Crafted', type: 'text' },
  { section: 'info', key: 'title_2', value: 'With Passion', type: 'text' },
  { section: 'info', key: 'description_1', value: 'Brent Street Pizza was created with one simple goal — to serve great pizza that brings people together.', type: 'text' },
  { section: 'info', key: 'description_2', value: 'Located in the heart of Glenorchy, we make fresh, classic pizzas using quality ingredients, from Margherita and Hawaiian to favourites like The Lot and Meat Lovers.', type: 'text' },
  { section: 'info', key: 'quote', value: 'Simple, delicious, and made fresh — that’s Brent Street Pizza. Proudly local, we look forward to serving the Glenorchy community. See you soon at Brent Street Pizza. 🍕', type: 'text' },
  { 
    section: 'info', 
    key: 'stats', 
    value: JSON.stringify([
      { value: '2026', label: 'Founded' },
      { value: '100%', label: 'Fresh Daily' },
      { value: '232°C', label: 'Oven Temp' },
    ]), 
    type: 'json' 
  },
  { section: 'info', key: 'image', value: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=900&q=90', type: 'image' },

  // Marquee Banner
  { 
    section: 'marquee', 
    key: 'items', 
    value: JSON.stringify(['FRESH PIZZA', '•', 'MADE TO ORDER', '•', 'QUALITY INGREDIENTS', '•', '$5 FLAT DELIVERY', '•', 'ORDER ONLINE OR CALL NOW']), 
    type: 'json' 
  },

  // Footer Section
  {
    section: 'footer',
    key: 'cta_title',
    value: 'Ready to Order Direct?',
    type: 'string'
  },
  {
    section: 'footer',
    key: 'brand_title_1',
    value: 'BRENT STREET',
    type: 'string'
  },
  {
    section: 'footer',
    key: 'brand_title_2',
    value: 'PIZZA',
    type: 'string'
  },
  {
    section: 'footer',
    key: 'brand_description',
    value: 'Brent Street Pizza is your local go-to for hot, fresh pizza made to order. Premium ingredients. Big flavour.',
    type: 'string'
  },
  {
    section: 'footer',
    key: 'trading_hours',
    value: JSON.stringify([
      { label: 'In-Store Pickup', value: 'Daily 11am – 8pm' },
      { label: 'Delivery & Uber Eats', value: ['Sun – Thu: 11am – 9:30pm', 'Fri – Sat: 11am – 11pm'] }
    ]),
    type: 'json'
  },

  // Home Section
  {
    section: 'home',
    key: 'quick_links',
    value: JSON.stringify([
      { title: 'PIZZA', subtitle: 'Explore Our Menu', path: '/menu?cat=cat-classic-pizza', icon: 'Pizza', color: 'black' },
      { title: 'DEALS', subtitle: 'Exclusive Offers', path: '/deals', icon: 'Tag', color: '#C8201A' },
      { title: 'DESSERTS', subtitle: 'Sweet Indulgence', path: '/menu?cat=cat-desserts', icon: 'CakeSlice', color: 'black' }
    ]),
    type: 'json'
  },
  {
    section: 'home',
    key: 'category_cards',
    value: JSON.stringify([
      {
        id: 'cat-pizza',
        name: 'PIZZA',
        sub: 'Hand-stretched perfection',
        icon: 'Pizza',
        link: '/menu?cat=cat-classic-pizza',
        color: '#C8201A',
        img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=90',
      },
      {
        id: 'cat-icecream',
        name: 'ICE CREAM',
        sub: 'Premium artisan ice cream',
        icon: 'IceCream',
        link: '/menu?cat=cat-ice-cream',
        color: '#D4952A',
        img: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=800&q=90',
      },
      {
        id: 'cat-desserts',
        name: 'DESSERTS',
        sub: 'Sweet Italian indulgence',
        icon: 'CakeSlice',
        link: '/menu?cat=cat-desserts',
        color: '#C8201A',
        img: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=90',
      }
    ]),
    type: 'json'
  },

  // Global Section
  { section: 'global', key: 'phone', value: '0362724004', type: 'string' },
  { section: 'global', key: 'phone_display', value: '03 6272 4004', type: 'string' },
  { section: 'global', key: 'address_line_1', value: '2 Brent Street,', type: 'string' },
  { section: 'global', key: 'address_line_2', value: 'Glenorchy TAS 7010', type: 'string' },
  { section: 'global', key: 'email', value: 'brentstreetgroup@gmail.com', type: 'string' },
  { section: 'global', key: 'location_url', value: 'https://maps.google.com/?q=2+Brent+St+Glenorchy', type: 'string' },

  // About Page
  { section: 'about', key: 'title_1', value: 'Crafted', type: 'string' },
  { section: 'about', key: 'title_2', value: 'With Passion', type: 'string' },
  { section: 'about', key: 'subtitle', value: '— Our Story —', type: 'string' },
  { section: 'about', key: 'description_1', value: 'Brent Street Pizza was created with one simple goal — to serve great pizza that brings people together. We believe that good food doesn\'t have to be complicated, just made with the right ingredients and a lot of heart.', type: 'string' },
  { section: 'about', key: 'description_2', value: 'Located in the heart of Glenorchy, we make fresh, classic pizzas daily. From the traditional Margherita and Hawaiian to our signature "The Lot" and "Meat Lovers," each pizza is hand-stretched and topped with the freshest local produce.', type: 'string' },
  { section: 'about', key: 'quote', value: '"Simple, delicious, and made fresh — that’s our promise. Proudly independent and locally owned, we look forward to serving you."', type: 'string' },
  { section: 'about', key: 'image', value: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=900&q=90', type: 'string' },
  { section: 'about', key: 'stats', value: JSON.stringify([{ label: 'Founded', value: '2026' }, { label: 'Fresh Daily', value: '100%' }, { label: 'Oven Temp', value: '232°C' }]), type: 'json' },
  { section: 'about', key: 'pillars', value: JSON.stringify([{ title: 'Quality First', desc: 'We never compromise on our ingredients, from the dough to the last basil leaf.', icon: 'Heart' }, { title: 'Local Community', desc: 'As a Glenorchy local, we value our neighbours and aim to give back every day.', icon: 'Users' }, { title: 'Always Fresh', desc: 'No frozen dough. No pre-cut veggies. Everything is prepared fresh in our kitchen.', icon: 'Clock' }]), type: 'json' },

  // Contact Page
  { section: 'contact', key: 'hero_image', value: '/heropic.jpeg', type: 'string' },
  { section: 'contact', key: 'title', value: 'CONTACT US', type: 'string' },
  { section: 'contact', key: 'subtitle', value: '— Get In Touch —', type: 'string' },
  { section: 'contact', key: 'description', value: 'For catering, large orders, or general enquiries — we reply within 4 hours.', type: 'string' },
  { section: 'contact', key: 'cards', value: JSON.stringify([{ label: 'Call Us Directly', value: '03 6272 4004', href: 'tel:0362724004', icon: 'Phone', color: '#C8201A' }, { label: 'Email Support', value: 'brentstreetgroup@gmail.com', href: 'mailto:brentstreetgroup@gmail.com', icon: 'Mail', color: '#D4952A' }, { label: 'Our Location', value: '2 Brent St, Glenorchy 7010', href: 'https://maps.google.com/?q=2+Brent+St+Glenorchy', icon: 'MapPin', color: '#C8201A' }]), type: 'json' },

  // Deals Page
  { section: 'deals', key: 'title', value: 'Exclusive Deals', type: 'string' },
  { section: 'deals', key: 'subtitle', value: '— Big Flavour, Better Value —', type: 'string' },
  { section: 'deals', key: 'description', value: 'Grab your favorites at unbeatable prices. From family feasts to solo treats, we\'ve got the perfect deal for you.', type: 'string' },
  {
    section: 'deals',
    key: 'deals_list',
    value: JSON.stringify([
      { id: 'quick-deal', title: 'Quick Deal', description: '1 Large Pizza + Garlic Bread + 375ml Drink.', tag: 'DEAL 1', icon: 'Flame', color: '#C8201A' },
      { id: 'double-deal', title: 'Double Deal', description: '2 Large Pizzas + Garlic Bread + 1.25L Drink.', tag: 'DEAL 2', icon: 'Star', color: '#C8201A' },
      { id: 'family-deal', title: 'Family Deal', description: '3 Large Pizzas + 2 Garlic Breads + 2 x 1.25L Drinks.', tag: 'DEAL 3', icon: 'Star', color: '#D4952A' },
      { id: 'party-deal', title: 'Party Deal', description: '5 Large Pizzas + 2 Sides + 2 x 1.25L Drinks.', tag: 'DEAL 4', icon: 'Zap', color: '#C8201A' },
      { id: 'lunch-special', title: 'Lunch Special', description: 'Any Small Pizza + Can of Drink. Available daily until 4 PM. (Pick up only)', tag: 'DEAL 5', icon: 'Clock', color: '#C8201A' }
    ]),
    type: 'json'
  },

  // Ice Cream Page
  { section: 'icecream', key: 'title', value: 'Sweet Treats', type: 'string' },
  { section: 'icecream', key: 'subtitle', value: '— The Perfect Finish —', type: 'string' },
  { section: 'icecream', key: 'description', value: 'Indulge in our premium selection of ice creams and desserts. Hand-picked for quality and taste.', type: 'string' },
  { section: 'icecream', key: 'banner_image', value: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=1200&q=80', type: 'string' },
  {
    section: 'icecream',
    key: 'scoops',
    value: JSON.stringify([
      { label: '1 Scoop', price: 4 },
      { label: '2 Scoops', price: 6 },
      { label: '3 Scoops', price: 8 }
    ]),
    type: 'json'
  },
  {
    section: 'icecream',
    key: 'flavours',
    value: JSON.stringify([
      'Vanilla', 'Chocolate', 'Strawberry', 'Cookies & Cream',
      'Rainbow', 'Bubble Gum', 'Salted Caramel', 'Lemon Sorbet', 'Boysenberry'
    ]),
    type: 'json'
  },
  {
    section: 'icecream',
    key: 'toppings',
    value: JSON.stringify([
      "M&M's", 'Rainbow Sprinkles', 'Oreo Chunks', 'Waffle Stick', 'Crushed Cadbury Flake'
    ]),
    type: 'json'
  },
  {
    section: 'icecream',
    key: 'sauces',
    value: JSON.stringify(['Chocolate', 'Strawberry', 'Caramel']),
    type: 'json'
  },
  {
    section: 'icecream',
    key: 'specials',
    value: JSON.stringify([
      {
        id: 'triple-sundae',
        name: 'Triple Sundae',
        price: 10,
        image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&q=80',
        includes: ['Choose 3 Flavours', 'Choose Toppings (+75c each)', 'Choose Sauce (Free)']
      },
      {
        id: 'banana-split',
        name: 'Banana Split',
        price: 12,
        image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&q=80',
        includes: ['3 Scoops Ice Cream', 'Fresh Banana', 'Whipped Cream', 'Sprinkles', 'Choice of Sauce']
      },
      {
        id: 'custom',
        name: 'Custom Ice Cream',
        price: 4,
        image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&q=80',
        includes: ['Choose 1-3 Scoops', 'Choose Flavours', 'Choose Toppings (+75c each)', 'Choose Sauce (Free)']
      }
    ]),
    type: 'json'
  },


  // Menu Page
  { section: 'menu', key: 'title', value: 'OUR MENU', type: 'string' },
  { section: 'menu', key: 'subtitle', value: '— Fresh · Authentic · Made to Order —', type: 'string' },
  {
    section: 'menu',
    key: 'badges',
    value: JSON.stringify({
      'pizza-super-supreme': { label: 'POPULAR', color: 'from-[#C8201A] to-[#9E1510]' },
      'pizza-meat-lovers': { label: 'POPULAR', color: 'from-[#C8201A] to-[#9E1510]' },
      'pizza-tandoori-chicken': { label: "CHEF'S PICK", color: 'from-[#D4952A] to-[#D4952A]' },
      'pizza-margherita': { label: 'CLASSIC', color: 'from-[#D4952A] to-[#D4952A]' }
    }),
    type: 'json'
  }
];

async function main() {
  console.log('Cleaning up old data...');
  // Remove drinks category and products totally
  await prisma.cartItem.deleteMany({ where: { product: { categoryId: 'cat-drinks' } } });
  await prisma.orderItem.deleteMany({ where: { product: { categoryId: 'cat-drinks' } } });
  await prisma.product.deleteMany({ where: { categoryId: 'cat-drinks' } });
  await prisma.category.deleteMany({ where: { id: 'cat-drinks' } });
  await prisma.uIContent.deleteMany({});

  console.log('Seeding Database...');

  // 1. Seed Categories
  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: {
        name: cat.name,
        iconName: cat.iconName
      },
      create: {
        id: cat.id,
        name: cat.name,
        iconName: cat.iconName
      }
    });
  }
  console.log('✅ Categories seeded');

  // 2. Seed Pizza Extras
  for (const extra of PIZZA_EXTRAS) {
    await prisma.pizzaExtra.upsert({
      where: { id: extra.id },
      update: {
        name: extra.name,
        options: extra.options
      },
      create: {
        id: extra.id,
        name: extra.name,
        options: extra.options // mapped to Json natively
      }
    });
  }
  console.log('✅ Pizza Extras seeded');

  // 3. Seed Products
  for (const item of MENU_ITEMS) {
    await prisma.product.upsert({
      where: { id: item.id },
      update: {
        categoryId: item.categoryId,
        name: item.name,
        description: item.description,
        price: item.price,
        image: item.image,
        tags: item.tags || {},
        sizes: item.sizes ? JSON.parse(JSON.stringify(item.sizes)) : null,
        toppings: item.toppings ? JSON.parse(JSON.stringify(item.toppings)) : null,
        hasPizzaExtras: item.hasPizzaExtras ?? false,
        rating: item.rating ?? null,
        isFavorite: item.tags?.isFavorite || false,
      },
      create: {
        id: item.id,
        categoryId: item.categoryId,
        name: item.name,
        description: item.description,
        price: item.price,
        image: item.image,
        tags: item.tags || {},
        sizes: item.sizes ? JSON.parse(JSON.stringify(item.sizes)) : null,
        toppings: item.toppings ? JSON.parse(JSON.stringify(item.toppings)) : null,
        hasPizzaExtras: item.hasPizzaExtras ?? false,
        rating: item.rating ?? null,
        isFavorite: item.tags?.isFavorite || false,
      }
    });
  }
  console.log('✅ Products seeded');

  // 4. Seed UI Content
  for (const content of UI_CONTENT) {
    await prisma.uIContent.upsert({
      where: {
        section_key: {
          section: content.section,
          key: content.key
        }
      },
      update: {
        value: content.value,
        type: content.type
      },
      create: {
        section: content.section,
        key: content.key,
        value: content.value,
        type: content.type
      }
    });
  }
  console.log('✅ UI Content seeded');

  console.log('🎉 Seeding Complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
