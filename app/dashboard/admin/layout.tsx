'use client';

import DashboardLayout from '@/app/components/DashboardLayout';
import { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <DashboardLayout role="ADMIN">
      {children}
    </DashboardLayout>
  );
}
