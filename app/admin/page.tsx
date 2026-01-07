'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect old /admin path to new /dashboard/admin
    router.replace('/dashboard/admin');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <p className="text-slate-400">Redirecting to Admin Dashboard...</p>
    </div>
  );
}