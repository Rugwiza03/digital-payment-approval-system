import { getSession } from 'next-auth/react';
import prisma from '../../../lib/db';

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const notifications = await prisma.notification.findMany({
        where: {
          userId: session.user.email, // Assuming email is used as a unique identifier
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 20,
      });

      const unreadCount = await prisma.notification.count({
        where: {
          userId: session.user.email,
          read: false,
        },
      });

      return res.status(200).json({ notifications, unreadCount });
    } catch {
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}