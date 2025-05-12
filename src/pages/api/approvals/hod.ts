import { getSession } from 'next-auth/react';

// The Session type extension is already defined in another file
import prisma from '../../../lib/db';

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session || session.user.role !== 'HOD') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const requisitions = await prisma.requisition.findMany({
        where: {
          departmentId: session.user.departmentId!, // Add non-null assertion if you are sure it exists
          status: 'SUBMITTED',
        },
        include: {
          user: true,
          department: true,
        },
      });

      return res.status(200).json(requisitions);
    } catch {
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}