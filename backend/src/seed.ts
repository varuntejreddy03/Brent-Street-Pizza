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
  },
  {
    id: 'ice-cream-banana-split',
    categoryId: 'cat-ice-cream',
    name: 'Banana Split',
    description: 'Fresh banana, 3 scoops of ice cream, whipped cream, and sprinkles.',
    price: 12,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&q=80',
    tags: {},
  },
  {
    id: 'ice-cream-triple-sundae',
    categoryId: 'cat-ice-cream',
    name: 'Triple Sundae',
    description: '3 scoops of your favourite flavours with 3 toppings and sauce.',
    price: 10,
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&q=80',
    tags: {},
  },
];

async function main() {
  console.log('Cleaning up old data...');
  // Remove drinks category and products totally
  await prisma.cartItem.deleteMany({ where: { product: { categoryId: 'cat-drinks' } } });
  await prisma.orderItem.deleteMany({ where: { product: { categoryId: 'cat-drinks' } } });
  await prisma.product.deleteMany({ where: { categoryId: 'cat-drinks' } });
  await prisma.category.deleteMany({ where: { id: 'cat-drinks' } });

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
        hasPizzaExtras: item.hasPizzaExtras ?? false
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
        hasPizzaExtras: item.hasPizzaExtras ?? false
      }
    });
  }
  console.log('✅ Products seeded');

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
