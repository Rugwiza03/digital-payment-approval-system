// pages/api/requisitions/index.ts
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/db';

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (session && session.user) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, departmentId: true }
    });
    session.user = { ...session.user, id: user?.id || '', departmentId: user?.departmentId || null, role: session.user.role || '' } as typeof session.user & { id: string; departmentId: string | null; role: string };
  }

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      let requisitions;
      
      if (session.user.role === 'USER') {
        requisitions = await prisma.requisition.findMany({
          where: { userId: session.user.id as string },
          include: {
            user: true,
            department: true,
            approvals: true,
            voucher: true
          }
        });
      } else if (session.user.role === 'HOD') {
        requisitions = await prisma.requisition.findMany({
          where: { departmentId: session.user.departmentId },
          include: {
            user: true,
            department: true,
            approvals: true,
            voucher: true
          }
        });
      } else {
        return res.status(403).json({ error: 'Forbidden' });
      }

      return res.status(200).json(requisitions);
    } catch {
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { description, amount, urgent } = req.body;

      const newRequisition = await prisma.requisition.create({
        data: {
          description,
          amount: parseFloat(amount),
          urgent: Boolean(urgent),
          status: 'DRAFT',
          userId: session.user.id,
          departmentId: session.user.departmentId || null
        }
      });

      return res.status(201).json(newRequisition);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}