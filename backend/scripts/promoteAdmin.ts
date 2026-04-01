import { PrismaClient } from '@prisma/client';
import process from 'process';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function promote() {
  const email = process.argv[2];
  const password = process.argv[3] || 'Admin@123';
  
  if (!email) {
    console.error('Email parameter missing.');
    console.log('Usage: npx ts-node scripts/promoteAdmin.ts <email> [password]');
    process.exit(1);
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      const user = await prisma.user.update({
        where: { email },
        data: { role: 'ADMIN' },
      });
      console.log(`Successfully promoted existing user '${user.email}' to ADMIN.`);
    } else {
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);

      const user = await prisma.user.create({
        data: {
          email,
          name: 'Site Admin',
          password_hash,
          role: 'ADMIN',
        }
      });
      console.log(`User '${email}' did not exist. Created new ADMIN user.`);
      console.log(`Default Password: ${password}`);
    }
  } catch (err) {
    console.error('An error occurred:');
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

promote();
