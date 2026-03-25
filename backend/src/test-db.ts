import prisma from './config/db';

async function test() {
  try {
    console.log('Testing DB connection...');
    const catCount = await prisma.category.count();
    console.log('Category count:', catCount);
    const products = await prisma.product.findMany({ take: 1 });
    console.log('Sample product:', products[0]?.name || 'None');
    console.log('✅ Connection successful');
    process.exit(0);
  } catch (err) {
    console.error('❌ Connection failed:', err);
    process.exit(1);
  }
}

test();
