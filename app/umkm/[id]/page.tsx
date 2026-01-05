'use client';

import { MapPin, Phone, Mail, Globe, Users, Calendar, TrendingUp, BarChart3, Edit, Share2, ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';

export default function UmkmProfilePage() {
  const umkm = {
    id: 1,
    name: 'Toko Roti Berkah',
    category: 'Produksi & Penjualan Roti',
    location: 'Jl. Merdeka No. 123, Jakarta Timur 13210',
    city: 'Jakarta Timur',
    phone: '(021) 1234-5678',
    email: 'info@roti-berkah.com',
    website: 'www.roti-berkah.com',
    owner: 'Bapak Ahmad Widodo',
    established: 'Maret 2015',
    employees: 12,
    description: 'Toko Roti Berkah adalah usaha kecil menengah yang bergerak dalam produksi dan penjualan roti dengan resep tradisional. Produk kami menggunakan bahan-bahan berkualitas tinggi dan tanpa pengawet.',
    products: ['Roti Tawar', 'Roti Cokelat', 'Roti Keju', 'Roti Manis', 'Roti Gandum'],
  };

  const stats = {
    totalRevenue: 250.5,
    lastMonthRevenue: 235.2,
    growth: 6.5,
    averageMonthly: 205.3,
    activeMonths: 24,
  };

  const monthlyData = [
    { month: 'Jan', revenue: 198.5 },
    { month: 'Feb', revenue: 210.2 },
    { month: 'Mar', revenue: 215.8 },
    { month: 'Apr', revenue: 235.2 },
    { month: 'Mei', revenue: 240.1 },
    { month: 'Jun', revenue: 250.5 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Header/Navigation */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg shadow-lg">
                <span className="text-white text-lg font-bold">Σ</span>
              </div>
              <span className="ml-2 text-xl font-bold text-white">SIGMA UMKM</span>
            </div>
            <div className="flex space-x-4">
              <Link href="/" className="px-4 py-2 text-gray-200 hover:text-white font-medium transition">
                ← Kembali
              </Link>
              <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg font-medium transition shadow-lg">
                Keluar
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl overflow-hidden mb-8 shadow-2xl">
          {/* Cover Image */}
          <div className="h-72 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600"></div>

          {/* Profile Info */}
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-end md:space-x-8 -mt-56 mb-8">
              {/* Avatar */}
              <div className="w-40 h-40 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-4 border-white shadow-2xl flex items-center justify-center mb-6 md:mb-0 flex-shrink-0">
                <span className="text-7xl">🥖</span>
              </div>

              {/* Title Section */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-2">{umkm.name}</h1>
                    <div className="flex items-center space-x-3">
                      <p className="text-gray-300 font-medium">{umkm.category}</p>
                      <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-md">
                        ● Aktif
                      </span>
                    </div>
                  </div>
                  <button className="flex items-center space-x-2 px-5 py-2 border-2 border-white/30 hover:border-white text-white rounded-lg transition font-semibold">
                    <Share2 className="w-4 h-4" />
                    <span>Bagikan</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-300 leading-relaxed mb-8 -mt-4">{umkm.description}</p>

            {/* Contact Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-white/10">
              <div className="flex items-start space-x-4 p-4 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition">
                <MapPin className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase">Lokasi</p>
                  <p className="text-white font-medium text-sm">{umkm.location}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition">
                <Phone className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase">Telepon</p>
                  <p className="text-white font-medium text-sm">{umkm.phone}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition">
                <Mail className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase">Email</p>
                  <p className="text-white font-medium text-sm">{umkm.email}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition">
                <Globe className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase">Website</p>
                  <p className="text-white font-medium text-sm break-all">{umkm.website}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition">
                <Users className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase">Pemilik</p>
                  <p className="text-white font-medium text-sm">{umkm.owner}</p>
                  <p className="text-xs text-gray-400">{umkm.employees} karyawan</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition">
                <Calendar className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase">Berdiri Sejak</p>
                  <p className="text-white font-medium text-sm">{umkm.established}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-white mb-8">Produk Unggulan</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {umkm.products.map((product, idx) => (
              <div key={idx} className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-center text-white hover:shadow-xl hover:scale-105 transition transform">
                <span className="text-4xl mb-3 block">📦</span>
                <p className="font-bold text-sm">{product}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Stats Cards */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-3xl font-bold text-white mb-6">Performa</h2>

            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition">
              <div className="flex items-center justify-between mb-3">
                <p className="text-blue-100 font-semibold">Total Pendapatan (6 Bulan)</p>
                <TrendingUp className="w-6 h-6 text-cyan-200" />
              </div>
              <p className="text-4xl font-bold mb-2">Rp {stats.totalRevenue}M</p>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full w-4/5 bg-green-400 rounded-full"></div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition">
              <div className="flex items-center justify-between mb-3">
                <p className="text-green-100 font-semibold">Bulan Ini</p>
                <BarChart3 className="w-6 h-6 text-emerald-200" />
              </div>
              <p className="text-4xl font-bold mb-2">Rp {stats.lastMonthRevenue}M</p>
              <p className="text-sm text-green-100">Juni 2026</p>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition">
              <p className="text-purple-100 font-semibold mb-3">Rata-rata Bulanan</p>
              <p className="text-4xl font-bold mb-2">Rp {stats.averageMonthly}M</p>
              <p className="text-sm text-purple-100">{stats.activeMonths} bulan data</p>
            </div>

            <div className="bg-gradient-to-br from-orange-600 to-amber-600 rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition">
              <div className="flex items-center justify-between mb-3">
                <p className="text-orange-100 font-semibold">Pertumbuhan</p>
                <TrendingUp className="w-6 h-6 text-amber-200" />
              </div>
              <p className="text-4xl font-bold text-green-300">+{stats.growth}%</p>
              <p className="text-sm text-orange-100 mt-2">vs rata-rata</p>
            </div>
          </div>

          {/* Chart */}
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-8">Tren Pendapatan</h3>
            <div className="flex items-end justify-between h-80 space-x-2">
              {monthlyData.map((data, idx) => (
                <div key={idx} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t-xl hover:from-blue-600 hover:to-cyan-500 transition cursor-pointer shadow-lg"
                    style={{ height: `${(data.revenue / 250) * 320}px` }}
                    title={`Rp ${data.revenue}M`}
                  ></div>
                  <span className="text-sm text-gray-200 mt-4 font-bold">{data.month}</span>
                  <span className="text-xs text-gray-400">Rp {data.revenue}M</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
