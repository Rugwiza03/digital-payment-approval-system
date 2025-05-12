import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined; // Use 'var' to avoid block-scoping issues
}

const prisma = global.prisma ?? new PrismaClient();

if (process.env.NODE_ENV === 'development') global.prisma = prisma;

if (process.env.NODE_ENV === 'development') global.prisma = prisma;

export default prisma;