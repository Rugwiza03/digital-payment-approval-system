// src/components/Layout/Header.tsx
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">Payment Approval System</h1>
        <div className="flex items-center space-x-4">
          {session && (
            <>
              <span className="text-sm text-gray-500">Hello, {session.user.name}</span>
              <button
                onClick={() => signOut()}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                Sign out
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}