// pages/api/requisitions/index.ts
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session || !session.user?.email) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userRecord = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, departmentId: true, role: true }
  });

  if (!userRecord) {
    return res.status(403).json({ error: 'User not found' });
  }

  const userId = userRecord.id;
  const departmentId = userRecord.departmentId;
  const role = userRecord.role;

  if (req.method === 'GET') {
    try {
      let requisitions;

      if (role === 'USER') {
        requisitions = await prisma.requisition.findMany({
          where: { userId },
          include: {
            user: true,
            department: true,
            approvals: true,
            voucher: true
          }
        });
      } else if (role === 'HOD') {
        requisitions = await prisma.requisition.findMany({
          where: { departmentId },
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
    } catch (err) {
      console.error(err);
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
          userId,
          departmentId
        }
      });

      return res.status(201).json(newRequisition);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
