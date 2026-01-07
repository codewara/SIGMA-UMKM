'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminForecastPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/admin/forecast');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <p className="text-slate-400">Redirecting to Admin Dashboard...</p>
    </div>
  );


}

