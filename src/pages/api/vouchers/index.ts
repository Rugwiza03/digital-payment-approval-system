import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';
import prisma from '../../../lib/db';

import { NextApiRequest, NextApiResponse } from 'next';

  export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({ req }) as Session & { user: { id: string } };

  if (!session || session.user?.role !== 'FINANCE_OFFICER') {
  }

  if (req.method === 'GET') {
    try {
      const vouchers = await prisma.voucher.findMany({
        where: {
          preparedById: session.user?.id as string,
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
    } catch {
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
    } catch {
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
