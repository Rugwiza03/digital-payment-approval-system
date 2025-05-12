// src/components/Layout/Sidebar.tsx
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', roles: ['USER', 'HOD', 'FINANCE_OFFICER', 'GM', 'COO'] },
  { name: 'Requisitions', href: '/requisitions', roles: ['USER', 'HOD'] },
  { name: 'Approvals', href: '/approvals', roles: ['HOD', 'FINANCE_OFFICER', 'GM', 'COO'] },
  { name: 'Vouchers', href: '/vouchers', roles: ['FINANCE_OFFICER'] },
  { name: 'Payments', href: '/payments', roles: ['FINANCE_OFFICER'] },
];

export default function Sidebar() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) return null;

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <nav className="flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              if (!item.roles.includes(session.user.role)) return null;
              const current = router.pathname === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <a
                    className={`${
                      current
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } group flex items-center px-3 py-2 text-sm font-medium border-l-4`}
                  >
                    {item.name}
                  </a>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}