import { getSession } from 'next-auth/react';
import prisma from '../../../lib/db';

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session || session.user.role !== 'FINANCE_OFFICER') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const payments = await prisma.payment.findMany({
        include: {
          voucher: {
            include: {
              requisition: true,
            },
          },
          paidBy: true,
        },
        orderBy: {
          paymentDate: 'desc',
        },
      });

      return res.status(200).json(payments);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { voucherId, method } = req.body;

      // Update voucher status
      await prisma.voucher.update({
        where: { id: voucherId },
        data: { status: 'PAID' },
      });

      // Create payment record
      const payment = await prisma.payment.create({
        data: {
          voucherId,
          paidById: session.user.id,
          method,
        },
      });

      return res.status(201).json(payment);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}