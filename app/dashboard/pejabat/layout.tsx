'use client';

import DashboardLayout from '@/app/components/DashboardLayout';
import { ReactNode } from 'react';

interface PejabatLayoutProps {
  children: ReactNode;
}

export default function PejabatLayout({ children }: PejabatLayoutProps) {
  return (
    <DashboardLayout role="PEJABAT">
      {children}
    </DashboardLayout>
  );
}
