'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import BackgroundElements from '@/components/BackgroundElements';
import HeroSection from '@/components/HeroSection';
import StatsGrid from '@/components/StatsGrid';
import UmkmSayaSection from '@/components/UmkmSayaSection';
import SearchBar from '@/components/SearchBar';
import UmkmGrid from '@/components/UmkmGrid';
import Footer from '@/components/Footer';
import { formatCurrency } from '@/lib/formatter';
import type { User, UMKM } from '@/lib/types';

export default function HomePage() {
  const router = useRouter();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [umkmData, setUmkmData] = useState<UMKM[]>([]);
  const [isLoadingUmkm, setIsLoadingUmkm] = useState(true);

  useEffect(() => {
    fetchUser();
    fetchUmkmData();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUmkmData = async () => {
    try {
      setIsLoadingUmkm(true);
      const res = await fetch('/api/umkm');
      if (res.ok) {
        const response = await res.json();
        // Map API response to expected format
        const mapped = response.data.map((umkm: any, index: number) => ({
          id: umkm._id || index,
          name: umkm.nama_usaha || 'Nama tidak tersedia',
          category: umkm.sektor || 'Kategori tidak tersedia',
          location: umkm.wilayah?.kota || umkm.wilayah?.provinsi || 'Lokasi tidak tersedia',
          revenue: umkm.summary_terakhir?.omzet_terakhir
            ? formatCurrency(umkm.summary_terakhir.omzet_terakhir)
            : 'Belum ada data',
          growth: '+0%',
          status: umkm.legalitas?.status_verifikasi || 'Aktif',
          icon: getSektorIcon(umkm.sektor),
          badge: umkm.legalitas?.status_verifikasi === 'VERIFIED' ? 'Terverifikasi' : 'Aktif',
          // Additional fields
          wilayah: umkm.wilayah,
          tanggal_bergabung: umkm.tanggal_bergabung ? new Date(umkm.tanggal_bergabung) : undefined,
          pemilik: umkm.pemilik,
          legalitas: umkm.legalitas,
          is_deleted: umkm.is_deleted,
          omzet_terakhir: umkm.summary_terakhir?.omzet_terakhir,
          bulan: umkm.summary_terakhir?.bulan,
        }));
        setUmkmData(mapped);
      }
    } catch (error) {
      console.error('Failed to fetch UMKM data:', error);
    } finally {
      setIsLoadingUmkm(false);
    }
  };

  const getSektorIcon = (sektor: string) => {
    const iconMap: { [key: string]: string } = {
      'Kuliner': '🍽️',
      'Kerajinan Tangan': '🎨',
      'Konveksi': '👕',
      'Batik': '🧵',
      'Kopi': '☕',
      'Fashion': '👗',
      'Teknologi': '💻',
      'Pertanian': '🌾',
      'default': '🏪'
    };
    return iconMap[sektor] || iconMap['default'];
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      setUser(null);
      setShowUserDropdown(false);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const umkmMilikSaya: UMKM[] = [];

  return (
    <div className="min-h-screen bg-[#0f172a] relative overflow-hidden">
      {/* Animated Background Elements */}
      <BackgroundElements />

      {/* Navigation */}
      <Navigation
        user={user}
        isLoading={isLoading}
        showMobileMenu={showMobileMenu}
        onToggleMobileMenu={() => setShowMobileMenu(!showMobileMenu)}
        onLogout={handleLogout}
      />

      {/* Hero Section */}
      <HeroSection />

      {/* Stats Grid */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StatsGrid />
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* UMKM Saya Section - Only for UMKM_OWNER */}
        {user && user.role === 'UMKM_OWNER' && (
          <UmkmSayaSection umkmList={umkmMilikSaya} />
        )}

        {/* Search Bar */}
        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        {/* Semua UMKM Section */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-8">🌐 Semua UMKM</h2>
          <UmkmGrid umkmData={umkmData} isLoading={isLoadingUmkm} user={user} />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
