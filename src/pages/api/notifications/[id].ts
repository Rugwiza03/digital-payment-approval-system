import { getSession } from 'next-auth/react';
import prisma from '../../../lib/db';

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'PATCH') {
    try {
      const notification = await prisma.notification.update({
        where: {
          id: req.query.id,
          userId: session.user.email, // Assuming userId is linked to the email
        },
        data: {
          read: true,
        },
      });

      return res.status(200).json(notification);
    } catch {
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}