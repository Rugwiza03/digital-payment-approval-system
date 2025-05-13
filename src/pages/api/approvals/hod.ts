import { getSession } from 'next-auth/react';
import prisma from '../../../lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session || !session.user?.email) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Fetch the full user data including role and departmentId
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      role: true,
      departmentId: true
    }
  });

  if (!user || user.role !== 'HOD') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (req.method === 'GET') {
    try {
      const requisitions = await prisma.requisition.findMany({
        where: {
          departmentId: user.departmentId,
          status: 'SUBMITTED',
        },
        include: {
          user: true,
          department: true,
        },
      });

      return res.status(200).json(requisitions);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
