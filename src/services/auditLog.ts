import prisma from '../lib/db';

export async function logAction(
  userId: string,
  action: string,
  entity: string,
  entityId: string,
  metadata?: any
) {
  try {
    await prisma.auditLog.create({
      data: {
        action,
        entity,
        entityId,
        userId,
        metadata: metadata || undefined,
      },
    });
  } catch (error) {
    console.error('Error logging action:', error);
  }
}