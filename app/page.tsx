'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, MapPin, Info } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency as formatCurrencyUtil } from '@/lib/formatter';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import BackgroundElements from '@/components/BackgroundElements';
import dynamic from 'next/dynamic';
import type { User } from '@/lib/types';

// Dynamically import MapComponent to avoid SSR issues
const MapPreview = dynamic(() => import('@/app/peta/MapComponent'), { ssr: false });

interface UMKM {
  _id: string;
  nama_usaha: string;
  sektor: string;
  wilayah?: {
    kota: string;
    provinsi: string;
    alamat_lengkap?: string;
  };
  summary_terakhir?: {
    omzet_terakhir: number;
    bulan: number;
  };
  legalitas?: {
    status_verifikasi: string;
  };
  pemilik?: {
    nama: string;
    telepon?: string;
    email?: string;
  };
}

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [umkmData, setUmkmData] = useState<UMKM[]>([]);
  const [filteredUmkm, setFilteredUmkm] = useState<UMKM[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingUmkm, setIsLoadingUmkm] = useState(true);

  useEffect(() => {
    fetchUser();
    fetchUmkmData();
  }, []);

  useEffect(() => {
    // Filter UMKM based on search query
    if (searchQuery.trim() === '') {
      setFilteredUmkm(umkmData.slice(0, 5));
    } else {
      const filtered = umkmData.filter(umkm =>
        umkm.nama_usaha.toLowerCase().includes(searchQuery.toLowerCase()) ||
        umkm.sektor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        umkm.wilayah?.kota.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUmkm(filtered.slice(0, 5));
    }
  }, [searchQuery, umkmData]);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        console.log('✅ User fetched from /api/auth/me:', data.user);
        setUser(data.user);
      } else {
        console.log('❌ /api/auth/me returned', res.status, '- User not authenticated');
      }
    } catch (error) {
      console.error('❌ Failed to fetch user:', error);
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
        setUmkmData(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch UMKM data:', error);
    } finally {
      setIsLoadingUmkm(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getSektorIcon = (sektor: string) => {
    const iconMap: { [key: string]: string } = {
      'pertanian': '🌾',
      'perdagangan': '🏪',
      'kerajinan': '🎨',
      'industri': '🏭',
      'jasa': '💼',
      'perikanan': '🐟',
      'pariwisata': '🏨',
      'teknologi': '💻',
      'kuliner': '🍽️',
      'konveksi': '👕',
      'batik': '🧵',
      'kopi': '☕',
      'fashion': '👗',
    };
    const key = sektor.toLowerCase();
    return iconMap[key] || '🏪';
  };

  return (
    <div className="min-h-screen bg-[#0f172a] relative overflow-hidden">
      {/* Animated Background Gradient */}
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

      {/* Search Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
          <div className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3 border border-white/20">
            <Search className="text-white/50" size={24} />
            <input
              type="text"
              placeholder="Cari UMKM, sektor, atau lokasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-white/50 outline-none"
            />
          </div>
        </div>
      </div>

      {/* UMKM Grid Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-white mb-8">✨ UMKM Terdepan</h2>
        
        {isLoadingUmkm ? (
          <div className="text-center py-12">
            <p className="text-white/60">Memuat data UMKM...</p>
          </div>
        ) : filteredUmkm.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/60">Tidak ada UMKM yang sesuai dengan pencarian Anda</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUmkm.map((umkm) => (
                <Link
                  key={umkm._id}
                  href={`/umkm/${umkm._id}`}
                  className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{getSektorIcon(umkm.sektor)}</div>
                    {umkm.legalitas?.status_verifikasi === 'VERIFIED' && (
                      <span className="px-3 py-1 bg-green-500/30 border border-green-400/50 text-green-300 text-xs font-semibold rounded-full">
                        ✓ Terverifikasi
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors line-clamp-2">
                    {umkm.nama_usaha}
                  </h3>
                  
                  <p className="text-sm text-white/60 mb-4">{umkm.sektor}</p>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-white/70 flex items-center gap-2">
                      <MapPin size={16} className="text-blue-400" />
                      {umkm.wilayah?.kota || umkm.wilayah?.provinsi || 'Lokasi tidak tersedia'}
                    </p>
                    {umkm.summary_terakhir?.omzet_terakhir && (
                      <p className="text-sm text-white/70">
                        <span className="text-blue-400 font-semibold">Omzet Terakhir:</span> {formatCurrencyUtil(umkm.summary_terakhir.omzet_terakhir)}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-purple-400 group-hover:text-purple-300 transition-colors">
                    <span className="text-sm font-semibold">Lihat Detail</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>

            {umkmData.length > 5 && (
              <div className="text-center mt-12">
                <Link
                  href="/katalog"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Lihat Semua UMKM ({umkmData.length})
                  <ArrowRight size={20} />
                </Link>
              </div>
            )}
          </>
        )}
      </div>

      {/* About Section */}
      <div id="about-section" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 sm:p-12">
          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0 w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center">
              <Info className="text-purple-400" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Tentang SIGMA-UMKM</h2>
              <p className="text-white/70 leading-relaxed mb-4">
                SIGMA-UMKM adalah platform monitoring terintegrasi yang dirancang untuk mendukung pengembangan UMKM di seluruh Indonesia. Platform ini menghubungkan UMKM, pejabat pemerintah, dan administrator dalam satu ekosistem digital yang mendukung transparansi dan pertumbuhan bisnis berkelanjutan.
              </p>
              <p className="text-white/70 leading-relaxed">
                Kami berkomitmen untuk memberikan solusi teknologi yang memudahkan pelacakan data keuangan, verifikasi legalitas, dan analisis pertumbuhan UMKM sesuai dengan Sustainable Development Goals (SDG) 8 - Pekerjaan Layak dan Pertumbuhan Ekonomi.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Map Feature Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">🗺️ Jelajahi UMKM Secara Geografis</h2>
            <p className="text-white/70 mb-4 leading-relaxed">
              Lihat sebaran UMKM di seluruh wilayah melalui peta interaktif. Filter berdasarkan sektor industri, lihat lokasi bisnis, dan temukan peluang kerjasama dengan UMKM di daerah Anda.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3 text-white/70">
                <span className="w-2 h-2 bg-purple-400 rounded-full" />
                Visualisasi distribusi UMKM secara real-time
              </li>
              <li className="flex items-center gap-3 text-white/70">
                <span className="w-2 h-2 bg-purple-400 rounded-full" />
                Filter berdasarkan sektor dan lokasi
              </li>
              <li className="flex items-center gap-3 text-white/70">
                <span className="w-2 h-2 bg-purple-400 rounded-full" />
                Informasi detail untuk setiap UMKM
              </li>
            </ul>
            <Link
              href="/peta"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              <MapPin size={20} />
              Buka Peta UMKM
              <ArrowRight size={20} />
            </Link>
          </div>
          <div className="relative h-80 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 overflow-hidden">
            {isLoadingUmkm ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-white/60">Memuat peta...</p>
              </div>
            ) : umkmData.length > 0 ? (
              <MapPreview umkms={umkmData} />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-blue-400 mx-auto mb-4 opacity-50" />
                  <p className="text-white/60">Tidak ada data UMKM</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-purple-600/50 to-blue-600/50 backdrop-blur-xl border border-white/20 rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Bergabunglah dengan SIGMA-UMKM</h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Apakah Anda seorang pengusaha UMKM atau pejabat pemerintah? Bergabunglah dengan platform kami untuk berkontribusi pada pertumbuhan ekonomi berkelanjutan.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/auth/register"
              className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Daftar Sebagai UMKM
            </Link>
            <Link
              href="/auth/login"
              className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all"
            >
              Masuk ke Platform
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-white/10 backdrop-blur-xl bg-white/5 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold text-white mb-4">SIGMA-UMKM</h3>
              <p className="text-white/60 text-sm">Platform monitoring UMKM untuk pertumbuhan ekonomi berkelanjutan</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Navigasi</h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li><Link href="/peta" className="hover:text-white transition-colors">Peta UMKM</Link></li>
                <li><Link href="/katalog" className="hover:text-white transition-colors">Katalog</Link></li>
                <li><Link href="/auth/login" className="hover:text-white transition-colors">Masuk</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Untuk UMKM</h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li><Link href="/auth/register" className="hover:text-white transition-colors">Daftar UMKM</Link></li>
                <li><Link href="/dashboard/owner" className="hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Informasi</h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li className="hover:text-white transition-colors cursor-pointer">Tentang Kami</li>
                <li className="hover:text-white transition-colors cursor-pointer">Kontak</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-white/60 text-sm">
            <p>&copy; 2026 SIGMA-UMKM. Semua hak dilindungi. Mendukung SDG 8 - Pekerjaan Layak dan Pertumbuhan Ekonomi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
