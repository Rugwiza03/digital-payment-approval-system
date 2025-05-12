import { getSession } from 'next-auth/react';
import prisma from '../../../lib/db';

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session || session.user.role !== 'FINANCE_OFFICER') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const vouchers = await prisma.voucher.findMany({
        where: {
          preparedById: session.user.id,
        },
        include: {
          requisition: {
            include: {
              user: true,
              department: true,
            },
          },
          approvals: true,
        },
      });

      return res.status(200).json(vouchers);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { requisitionId, amount, reason } = req.body;

      // Update requisition status
      await prisma.requisition.update({
        where: { id: requisitionId },
        data: { status: 'VOUCHER_CREATED' },
      });

      // Create voucher
      const voucher = await prisma.voucher.create({
        data: {
          requisitionId,
          preparedById: session.user.id,
          amount: parseFloat(amount),
          reason,
          status: 'PENDING',
        },
      });

      return res.status(201).json(voucher);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
