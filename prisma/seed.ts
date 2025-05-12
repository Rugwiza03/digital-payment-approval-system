import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/auth';

const prisma = new PrismaClient();

async function main() {
  // Create departments
  const financeDept = await prisma.department.create({
    data: { name: 'Finance' },
  });


  // Create users
  const adminPassword = await hashPassword('admin123');
  await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password_hash: adminPassword,
      role: 'COO',
      departmentId: financeDept.id,
    },
  });

  // Add more seed data as needed
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });