'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  LogOut,
  Menu,
  X,
  BarChart3,
  Users,
  CheckCircle2,
  Flag,
  FileText,
  Home,
  TrendingUp,
  Map,
  DollarSign,
  Plus,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: any;
  exact?: boolean;
  visible?: boolean; // Show/hide based on conditions
}

interface DashboardLayoutProps {
  children: ReactNode;
  role?: string;
  navItems?: NavItem[];
}

/**
 * Shared Dashboard Layout for all authenticated roles
 * - ADMIN: System administration
 * - PEJABAT: Government official (auditor & verifier)
 * - UMKM_OWNER: Business owner
 *
 * Features:
 * - Responsive sidebar with mobile support
 * - Dynamic navigation based on role
 * - Global logout handler
 * - Consistent styling across all dashboards
 */
export default function DashboardLayout({
  children,
  role = 'ADMIN',
  navItems = [],
}: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userSession, setUserSession] = useState<any>(null);

  // Fetch current user session
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUserSession(data.user);
        } else {
          router.push('/auth/login');
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        router.push('/auth/login');
      }
    };

    fetchUser();
  }, [router]);

  // Global logout handler
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      // Redirect to home
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/');
    }
  };

  // Default nav items based on role
  const defaultNavItems: Record<string, NavItem[]> = {
    ADMIN: [
      {
        href: '/dashboard/admin',
        label: 'Dashboard',
        icon: Home,
        exact: true,
      },
      {
        href: '/dashboard/admin/users',
        label: 'Kelola Pejabat & Admin',
        icon: Users,
      },
      // Analytics Section (Divider)
      {
        href: '/dashboard/admin/analytics/revenue',
        label: 'Analisis Revenue',
        icon: DollarSign,
      },
      {
        href: '/dashboard/admin/analytics/growth',
        label: 'Analisis Growth',
        icon: TrendingUp,
      },
      {
        href: '/dashboard/admin/analytics/forecast',
        label: 'Forecast',
        icon: BarChart3,
      },
      {
        href: '/dashboard/admin/analytics/heatmap',
        label: 'Heatmap',
        icon: Map,
      },
    ],
    PEJABAT: [
      {
        href: '/dashboard/pejabat',
        label: 'Dashboard',
        icon: Home,
        exact: true,
      },
      {
        href: '/dashboard/pejabat/verifikasi',
        label: 'Verifikasi UMKM',
        icon: CheckCircle2,
      },
      {
        href: '/dashboard/pejabat/monitoring',
        label: 'Monitoring',
        icon: BarChart3,
      },
      // Analytics Section (Divider)
      {
        href: '/dashboard/pejabat/analytics/revenue',
        label: 'Analisis Revenue',
        icon: DollarSign,
      },
      {
        href: '/dashboard/pejabat/analytics/growth',
        label: 'Analisis Growth',
        icon: TrendingUp,
      },
      {
        href: '/dashboard/pejabat/analytics/forecast',
        label: 'Forecast',
        icon: BarChart3,
      },
      {
        href: '/dashboard/pejabat/analytics/heatmap',
        label: 'Heatmap',
        icon: Map,
      },
    ],
    UMKM_OWNER: [
      {
        href: '/dashboard/owner',
        label: 'Beranda',
        icon: Home,
        exact: true,
      },
      {
        href: '/dashboard/owner/umkm',
        label: 'Usaha Saya',
        icon: FileText,
      },
      {
        href: '/dashboard/owner/umkm/create',
        label: 'Daftarkan UMKM',
        icon: Plus,
      },
      // Analytics Section (Divider)
      {
        href: '/dashboard/owner/analytics/revenue',
        label: 'Revenue Bisnis',
        icon: DollarSign,
      },
      {
        href: '/dashboard/owner/analytics/growth',
        label: 'Growth Bisnis',
        icon: TrendingUp,
      },
      {
        href: '/dashboard/owner/analytics/forecast',
        label: 'Forecast Bisnis',
        icon: BarChart3,
      },
      {
        href: '/dashboard/owner/analytics/heatmap',
        label: 'Peta Kompetitor',
        icon: Map,
      },
    ],
  };

  const displayNavItems =
    navItems.length > 0
      ? navItems
      : (defaultNavItems[role as keyof typeof defaultNavItems] || []);

  const isActive = (href: string, exact = false) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  // Role-specific colors
  const roleColors: Record<string, { bg: string; text: string }> = {
    ADMIN: { bg: 'bg-purple-600', text: 'text-purple-700' },
    PEJABAT: { bg: 'bg-green-600', text: 'text-green-700' },
    UMKM_OWNER: { bg: 'bg-blue-600', text: 'text-blue-700' },
  };

  const colors = roleColors[role] || roleColors.ADMIN;

  return (
    <div className="flex h-screen bg-[#0f172a] relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-50 w-72 bg-white/10 backdrop-blur-2xl border-r border-white/20 transition-transform duration-300 md:translate-x-0 md:relative`}
      >
        <div className="flex h-full flex-col relative z-10">
          {/* Logo */}
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-6">
            <div>
              <h1 className="text-2xl font-black text-white tracking-tighter">SIGMA</h1>
              <p className="text-xs text-white/60 mt-1 font-medium">{role}</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-white/70 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 px-4 py-6 overflow-y-auto">
            {displayNavItems
              .filter(item => item.visible !== false)
              .map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href, item.exact);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      active
                        ? 'bg-white/20 text-white border border-white/30 shadow-lg'
                        : 'text-white/70 hover:text-white hover:bg-white/10 border border-transparent'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
          </nav>

          {/* User Info & Logout */}
          <div className="border-t border-white/10 px-4 py-4 space-y-3">
            {userSession && (
              <div className="text-xs px-4 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                <p className="font-semibold text-white truncate">{userSession.email}</p>
                <p className="text-white/60 text-xs mt-1">{userSession.role}</p>
              </div>
            )}
            <Link
              href="/"
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-blue-300 hover:text-white hover:bg-blue-500/20 border border-transparent hover:border-blue-500/30 transition-all duration-200"
            >
              <Home size={18} />
              Kembali ke Beranda
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-red-300 hover:text-white hover:bg-red-500/20 border border-transparent hover:border-red-500/30 transition-all duration-200"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Top Bar */}
        <div className="flex h-16 items-center justify-between border-b border-white/10 bg-white/5 backdrop-blur-md px-6 md:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white/70 hover:text-white md:hidden transition-colors"
          >
            <Menu size={24} />
          </button>
          <div className="flex-1"></div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-white">
                {userSession?.email || 'Loading...'}
              </p>
              <p className="text-xs text-white/60">{role}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 md:p-8">{children}</div>
        </div>
      </main>
    </div>
  );
}
