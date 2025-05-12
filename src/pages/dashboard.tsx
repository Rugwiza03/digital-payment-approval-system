// pages/dashboard.tsx
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Header from '../src/components/Layout/Header';
import Sidebar from '../src/components/Layout/Sidebar';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Dashboard - Payment Approval System</title>
      </Head>
      <div className="flex flex-col h-screen">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-4 md:ml-64 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-lg font-medium text-gray-900">Dashboard</h2>
              <div className="mt-4">
                <div className="bg-white shadow rounded-lg p-6">
                  <p>Welcome, {session.user.name}!</p>
                  <p className="mt-2">Your role: {session.user.role}</p>
                  {/* Add dashboard content based on role */}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}