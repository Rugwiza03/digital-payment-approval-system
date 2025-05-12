import { useRouter } from 'next/router';

interface Approval {
  id: string;
  requisition?: {
    description?: string;
    amount?: number;
    user?: {
      name?: string;
    };
  };
  voucher?: {
    reason?: string;
    amount?: number;
    preparedBy?: {
      name?: string;
    };
  };
}

interface ApprovalItemProps {
  approval: Approval;
  role: string;
}

export default function ApprovalItem({ approval, role }: ApprovalItemProps) {
  const router = useRouter();

  const handleApprove = async () => {
    try {
      const res = await fetch(`/api/approvals/${approval.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'APPROVED',
          role,
        }),
      });

      if (res.ok) {
        router.reload();
      }
    } catch (error) {
      console.error('Error approving:', error);
    }
  };

  const handleReject = async () => {
    try {
      const res = await fetch(`/api/approvals/${approval.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'REJECTED',
          role,
        }),
      });

      if (res.ok) {
        router.reload();
      }
    } catch (error) {
      console.error('Error rejecting:', error);
    }
  };

  return (
    <li className="py-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">
            {approval.requisition?.description || approval.voucher?.reason}
          </h3>
          <p className="text-sm text-gray-500">
            Amount: ${approval.requisition?.amount || approval.voucher?.amount}
          </p>
          <p className="text-sm text-gray-500">
            Requested by: {approval.requisition?.user?.name || approval.voucher?.preparedBy?.name}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleApprove}
            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
          >
            Approve
          </button>
          <button
            onClick={handleReject}
            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
          >
            Reject
          </button>
        </div>
      </div>
    </li>
  );
}