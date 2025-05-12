import prisma from '../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Test database connection
    const users = await prisma.user.findMany();
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ success: false, error: 'Database connection failed' });
  }
}