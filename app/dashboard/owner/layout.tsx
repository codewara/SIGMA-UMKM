'use client';

import DashboardLayout from '@/app/components/DashboardLayout';
import { ReactNode } from 'react';

interface OwnerLayoutProps {
  children: ReactNode;
}

export default function OwnerLayout({ children }: OwnerLayoutProps) {
  return (
    <DashboardLayout role="UMKM_OWNER">
      {children}
    </DashboardLayout>
  );
}
