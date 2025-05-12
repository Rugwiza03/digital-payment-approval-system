import { getSession } from 'next-auth/react';
import prisma from '../../../lib/db';

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const notifications = await prisma.notification.findMany({
        where: {
          userId: session.user.id,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 20,
      });

      const unreadCount = await prisma.notification.count({
        where: {
          userId: session.user.id,
          read: false,
        },
      });

      return res.status(200).json({ notifications, unreadCount });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}