import { getSession } from 'next-auth/react';
import prisma from '../../../lib/db';

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session || session.user.role !== 'HOD') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const requisitions = await prisma.requisition.findMany({
        where: {
          departmentId: session.user.departmentId,
          status: 'SUBMITTED',
        },
        include: {
          user: true,
          department: true,
        },
      });

      return res.status(200).json(requisitions);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}