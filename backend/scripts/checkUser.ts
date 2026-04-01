import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function check() {
  const user = await prisma.user.findUnique({
    where: { email: 'brentstreetgroup@gmail.com' }
  });
  console.log('User:', JSON.stringify(user, null, 2));
  await prisma.$disconnect();
}
check();
