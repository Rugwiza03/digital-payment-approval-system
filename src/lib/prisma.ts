import { PrismaClient } from '@prisma/client';

declare global {
  // Avoid conflict in global namespace
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Prevent multiple instances of PrismaClient in development
const prisma = global.prisma ?? new PrismaClient();

if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma;
}

export default prisma;
