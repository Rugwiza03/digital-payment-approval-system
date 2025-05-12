import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import ApprovalItem from './ApprovalItem'; // Adjust the import path as necessary

export default function ApprovalDashboard() {
  const { data: session } = useSession();
  interface Approval {
    id: string; // Adjust the type of 'id' and other fields as necessary
    [key: string]: unknown; // Add other fields if needed
  }

  const [pendingApprovals, setPendingApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApprovals = async () => {
      if (!session) return;
      
      try {
        let endpoint = '';
        if (session.user.role === 'HOD') {
          endpoint = '/api/approvals/hod';
        } else if (session.user.role === 'FINANCE_OFFICER') {
          endpoint = '/api/approvals/finance';
        } else if (session.user.role === 'GM') {
          endpoint = '/api/approvals/gm';
        } else if (session.user.role === 'COO') {
          endpoint = '/api/approvals/coo';
        }

        const res = await fetch(endpoint);
        const data = await res.json();
        setPendingApprovals(data);
      } catch (error) {
        console.error('Error fetching approvals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovals();
  }, [session]);

  if (loading) {
    return <div>Loading approvals...</div>;
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium mb-4">Pending Approvals</h2>
      {pendingApprovals.length === 0 ? (
        <p>No pending approvals</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {pendingApprovals.map((approval) => (
            <ApprovalItem key={approval.id} approval={approval} role={session?.user?.role || ''} />
          ))}
        </ul>
      )}
    </div>
  );
}