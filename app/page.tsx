'use client';

import { Plus, Search, Eye, MapPin, TrendingUp, LogOut, Menu, X, Sparkles, Award, Users, BarChart3, Star } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface UMKM {
  id: number;
  name: string;
  category: string;
  location: string;
  revenue: string;
  growth: string;
  status: string;
  icon: string;
  badge: string;
}

export default function HomePage() {
  const router = useRouter();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    location: '',
    phone: '',
    email: '',
    description: '',
  });

  const umkmMilikSaya: UMKM[] = [];

  const umkmLain = [
    {
      id: 2,
      name: 'Kerajinan Tangan Indah',
      category: 'Kerajinan Tangan',
      location: 'Bandung',
      revenue: 'Rp 180.2M',
      growth: '+8.3%',
      status: 'Aktif',
      icon: '🎨',
      badge: 'Populer'
    },
    {
      id: 3,
      name: 'Konveksi Sejahtera',
      category: 'Konveksi',
      location: 'Surabaya',
      revenue: 'Rp 95.8M',
      growth: '-2.1%',
      status: 'Aktif',
      icon: '👕',
      badge: 'Baru'
    },
    {
      id: 4,
      name: 'Batik Tulis Nusantara',
      category: 'Batik',
      location: 'Yogyakarta',
      revenue: 'Rp 142.3M',
      growth: '+5.7%',
      status: 'Aktif',
      icon: '🧵',
      badge: 'Terverifikasi'
    },
    {
      id: 5,
      name: 'Kopi Robusta Asli',
      category: 'Kopi',
      location: 'Lampung',
      revenue: 'Rp 320.7M',
      growth: '+15.2%',
      status: 'Aktif',
      icon: '☕',
      badge: 'Trending'
    },
  ];

  const stats = [
    { label: 'Total UMKM', value: '1,234', icon: Users, color: 'from-blue-400 to-blue-600' },
    { label: 'Transaksi Bulan Ini', value: 'Rp 1.2M', icon: BarChart3, color: 'from-green-400 to-green-600' },
    { label: 'Pertumbuhan', value: '+23.5%', icon: TrendingUp, color: 'from-purple-400 to-purple-600' },
    { label: 'UMKM Terverifikasi', value: '892', icon: Award, color: 'from-pink-400 to-pink-600' },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  }

  return (
    <div className="min-h-screen bg-blue-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-pink-500/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* Sparkle particles */}
        <div className="absolute top-32 right-1/4 w-2 h-2 bg-cyan-300 rounded-full animate-ping"></div>
        <div className="absolute top-48 right-1/3 w-1.5 h-1.5 bg-pink-300 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-64 right-1/2 w-2 h-2 bg-blue-300 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-96 left-1/3 w-1 h-1 bg-purple-300 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>

        {/* Gradient mesh */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-cyan-400 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-tl from-pink-400 to-transparent rounded-full blur-2xl"></div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/10 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-pink-500 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition"></div>
                <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-2xl shadow-lg transform group-hover:scale-110 transition">
                  <span className="text-white text-xl font-bold">Σ</span>
                </div>
              </div>
              <div>
                <span className="text-2xl font-bold text-white">SIGMA UMKM</span>
                <p className="text-xs text-cyan-200">Pemberdayaan UMKM Indonesia</p>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <button className="text-white/90 hover:text-white font-semibold transition transform hover:scale-105">Dashboard</button>
              <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition">
                <LogOut className="w-5 h-5" />
                <span>Keluar</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="md:hidden p-2 rounded-lg hover:bg-white/10 transition text-white">
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden py-4 border-t border-white/20 space-y-2">
              <button className="block w-full text-left px-4 py-3 text-white hover:bg-white/10 rounded-lg transition">Dashboard</button>
              <button className="block w-full text-left px-4 py-3 text-white hover:bg-white/10 rounded-lg transition">Pengaturan</button>
              <button className="block w-full text-left px-4 py-3 text-pink-300 hover:bg-white/10 rounded-lg transition font-semibold">Keluar</button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="relative z-10">
            <div className="mb-8">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-lg rounded-full px-4 py-2 mb-6 border border-white/20">
                <Sparkles className="w-4 h-4 text-cyan-300" />
                <span className="text-cyan-200 text-sm font-semibold">Platform UMKM Terpadu</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
                Sigmaaahhh{' '}
                <span className="bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                  UMKM PLATFORM
                </span>
              </h1>

              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Kelola dan kembangkan bisnis UMKM Anda dengan lebih mudah dan efisien di satu tempat.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-12">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white rounded-full font-bold shadow-2xl hover:shadow-pink-500/50 transition-all overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative">Daftar Sekarang</span>
              </button>
              <button className="px-8 py-4 bg-white/10 backdrop-blur-lg border-2 border-white/30 text-white rounded-full font-bold hover:bg-white/20 hover:border-white/50 transition-all">
                Pelajari Lebih Lanjut
              </button>
            </div>

            {/* Feature list */}
            <div className="space-y-4">
              {['Kelola seluruh aspek bisnis UMKM', 'Analitik mendalam untuk pertumbuhan', 'Terhubung dengan jutaan pembeli'].map((text, i) => (
                <div key={i} className="flex items-center space-x-3 group">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                    <Star className="w-4 h-4 text-white fill-white" />
                  </div>
                  <span className="text-gray-200 group-hover:text-white transition">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - 3D Scene Recreation */}
          <div className="hidden lg:block relative h-[600px]">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Main card/monitor */}
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 blur-3xl opacity-50 animate-pulse"></div>

                {/* Monitor/Card */}
                <div className="relative w-80 h-96 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl p-6 transform hover:scale-105 transition-transform duration-500">
                  <div className="absolute top-4 right-4">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                  </div>

                  <div className="text-white/80 text-sm font-semibold mb-4">REVENUE REPORT</div>

                  {/* Chart simulation */}
                  <div className="space-y-4 mb-6">
                    {[85, 72, 95, 68, 90].map((width, i) => (
                      <div key={i} className="flex items-center space-x-3">
                        <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-full shadow-lg animate-pulse"
                            style={{ width: `${width}%`, animationDelay: `${i * 0.2}s` }}
                          ></div>
                        </div>
                        <span className="text-white/60 text-xs font-mono">{width}%</span>
                      </div>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
                      <div className="text-white/60 text-xs mb-1">Revenue</div>
                      <div className="text-white text-2xl font-bold">Rp 1.2M</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
                      <div className="text-white/60 text-xs mb-1">Growth</div>
                      <div className="text-green-400 text-2xl font-bold">+23%</div>
                    </div>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full blur-2xl opacity-60 animate-pulse"></div>
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full blur-2xl opacity-60 animate-pulse" style={{ animationDelay: '1s' }}></div>
                {/* Small floating card */}
                <div className="absolute -left-16 top-32 w-32 h-32 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-3 shadow-xl animate-pulse" style={{ animationDelay: '0.5s' }}>
                  <div className="text-white/60 text-xs mb-2">Today</div>
                  <div className="text-2xl">💰</div>
                  <div className="text-white font-bold text-sm mt-1">Rp 450K</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
          {stats.map((stat, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="relative overflow-hidden bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 hover:border-white/40 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 p-6">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-20 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500`}></div>
                <div className="relative">
                  <stat.icon className="w-10 h-10 mb-4 text-white/90" />
                  <p className="text-3xl font-bold text-white mb-2">{stat.value}</p>
                  <p className="text-sm text-gray-300">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search Bar */}
        <div className="mt-16">
          <div className="relative group max-w-3xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative flex items-center bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl px-8 py-6 border border-white/30">
              <Search className="w-6 h-6 text-gray-300" />
              <input
                type="text"
                placeholder="Cari UMKM berdasarkan nama, kategori, atau lokasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ml-4 bg-transparent outline-none text-base flex-1 text-white placeholder-gray-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* UMKM Saya Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-white mb-10 flex items-center">
            <span className="mr-3">📊</span>
            UMKM Saya
          </h2>
          {umkmMilikSaya.length > 0 ? (
            <div className="space-y-6">
              {umkmMilikSaya.map((umkm) => (
                <div key={umkm.id} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  <div className="relative bg-white/15 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl overflow-hidden hover:shadow-pink-500/20 transition-all transform hover:-translate-y-1 flex">
                    {/* Left Section */}
                    <div className="relative bg-blue-900 p-8 text-white w-72 flex-shrink-0 flex flex-col justify-between overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                      <div className="relative">

                        <h3 className="text-2xl font-bold leading-tight mb-3">{umkm.name}</h3>
                        <div className="inline-block bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-semibold">
                          {umkm.badge}
                        </div>
                      </div>
                      <p className="text-pink-100 text-base">{umkm.category}</p>
                    </div>

                    {/* Right Section */}
                    <div className="p-8 flex-1 flex flex-col justify-between">
                      <div className="space-y-6">
                        <div className="flex items-center space-x-3 text-gray-300">
                          <MapPin className="w-6 h-6 text-cyan-400 flex-shrink-0" />
                          <span className="font-medium text-lg">{umkm.location}</span>
                        </div>
                        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                          <p className="text-gray-300 text-sm font-medium mb-3">Pendapatan Bulan Ini</p>
                          <div className="flex items-center justify-between">
                            <p className="text-4xl font-bold text-white">{umkm.revenue}</p>
                            <div className={`text-2xl font-bold flex items-center ${umkm.growth.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                              <TrendingUp className="w-6 h-6 mr-2" />
                              {umkm.growth}
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => router.push(`/umkm/${umkm.id}`)}
                        className="w-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white px-8 py-5 rounded-2xl font-bold text-base transition transform hover:scale-[1.02] shadow-xl mt-8 uppercase tracking-widest"
                      >
                        Lihat Detail
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <button className="w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-600 hover:via-purple-600 hover:to-pink-600 text-white px-8 py-6 rounded-3xl font-bold inline-flex items-center justify-center space-x-3 shadow-2xl hover:shadow-pink-500/50 transform hover:scale-105 transition">
              <Plus className="w-6 h-6" />
              <span>Daftarkan UMKM Saya</span>
            </button>
          )}
        </div>

        {/* Semua UMKM Section */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">🌐 Semua UMKM</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {umkmLain.map((umkm) => (
              <div key={umkm.id} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition"></div>
                <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1">
                  {/* Card Header */}
                  <div className="relative bg-blue-500 p-4 text-white overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8"></div>
                    <div className="relative flex items-start space-x-3">
                      <div className="text-2xl flex-shrink-0 mt-1">{umkm.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-base font-bold leading-tight text-white">{umkm.name}</h3>
                        <p className="text-blue-100 text-xs mt-0.5">{umkm.category}</p>
                      </div>
                      <div className="inline-block bg-white/30 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-semibold text-white flex-shrink-0">
                        {umkm.badge}
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="w-4 h-4 text-purple-600 flex-shrink-0" />
                        <span className="text-sm font-medium">{umkm.location}</span>
                      </div>
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3">
                        <p className="text-gray-600 text-xs font-medium mb-1">Pendapatan Bulan Ini</p>
                        <div className="flex items-center justify-between">
                          <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{umkm.revenue}</p>
                          <div className={`text-lg font-bold flex items-center ${umkm.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                            <TrendingUp className="w-4 h-4 mr-1" />
                            {umkm.growth}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <button
                    onClick={() => router.push(`/umkm/${umkm.id}`)}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-5 rounded-2xl font-bold text-base transition transform hover:scale-[1.02] shadow-xl mt-8 uppercase tracking-widest"
                  >
                    Lihat Detail
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative mt-32 bg-white/5 backdrop-blur-xl border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">Σ</span>
              </div>
              <span className="text-2xl font-bold text-white">SIGMA UMKM</span>
            </div>
            <p className="text-gray-300">© 2026 SIGMA UMKM. Memberdayakan UMKM Indonesia</p>
          </div>
        </div>
      </footer>
    </div>
  );
}