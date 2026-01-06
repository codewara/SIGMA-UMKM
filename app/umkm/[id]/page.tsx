'use client';

import { MapPin, Phone, Mail, ArrowLeft, TrendingUp, BarChart3, Edit2, Calendar, Users, Award, DollarSign, Activity } from 'lucide-react';
import { useState } from 'react';

export default function UmkmDetailPage() {
  const [isOwner] = useState(true);

  const umkm = {
    id: 1,
    name: 'Toko Roti Berkah',
    category: 'Produksi & Penjualan Roti',
    location: 'Jakarta Timur',
    phone: '(021) 1234-5678',
    email: 'info@roti-berkah.com',
    owner: 'Bapak Ahmad Widodo',
    established: 'Maret 2015',
    employees: 12,
    description: 'Toko Roti Berkah adalah usaha kecil menengah yang bergerak dalam produksi dan penjualan roti dengan resep tradisional. Produk kami menggunakan bahan-bahan berkualitas tinggi dan tanpa pengawet.',
  };

  const stats = {
    totalRevenue: 250.5,
    lastMonthRevenue: 235.2,
    growth: 6.5,
    averageMonthly: 205.3,
  };

  const revenueData = [
    { month: 'Jan', revenue: 180 },
    { month: 'Feb', revenue: 195 },
    { month: 'Mar', revenue: 205 },
    { month: 'Apr', revenue: 215 },
    { month: 'May', revenue: 235 },
    { month: 'Jun', revenue: 250.5 },
  ];

  const maxRevenue = Math.max(...revenueData.map(d => d.revenue));
  const minRevenue = Math.min(...revenueData.map(d => d.revenue));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        
        {/* Sparkles */}
        <div className="absolute top-32 right-1/4 w-2 h-2 bg-cyan-300 rounded-full animate-ping"></div>
        <div className="absolute top-48 left-1/3 w-1.5 h-1.5 bg-pink-300 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-32 right-1/3 w-2 h-2 bg-blue-300 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => window.history.back()}
              className="p-3 hover:bg-white/10 rounded-2xl transition text-white group"
            >
              <ArrowLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">{umkm.name}</h1>
              <p className="text-cyan-200 text-sm mt-1">{umkm.category}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="px-5 py-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full text-sm font-bold shadow-lg">
              Aktif
            </span>
            {isOwner && (
              <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-600 hover:via-purple-600 hover:to-pink-600 text-white rounded-full font-bold transition transform hover:scale-105 shadow-xl">
                <Edit2 className="w-4 h-4" />
                <span>Edit</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-12 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Pendapatan Bulan Ini', value: `Rp ${stats.totalRevenue}M`, icon: DollarSign, color: 'from-green-400 to-emerald-500', bg: 'from-green-500/20 to-emerald-500/20' },
            { label: 'Pertumbuhan', value: `+${stats.growth}%`, icon: TrendingUp, color: 'from-blue-400 to-cyan-500', bg: 'from-blue-500/20 to-cyan-500/20' },
            { label: 'Rata-rata Bulanan', value: `Rp ${stats.averageMonthly}M`, icon: BarChart3, color: 'from-purple-400 to-pink-500', bg: 'from-purple-500/20 to-pink-500/20' },
            { label: 'Total Karyawan', value: umkm.employees, icon: Users, color: 'from-orange-400 to-red-500', bg: 'from-orange-500/20 to-red-500/20' },
          ].map((stat, idx) => (
            <div key={idx} className="group relative">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bg} rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity`}></div>
              <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 p-6 hover:border-white/40 transition-all transform hover:-translate-y-1 shadow-xl">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-2xl shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-2">{stat.label}</p>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Chart */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
          <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/30 p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Tren Pendapatan</h2>
                <p className="text-cyan-200">6 Bulan Terakhir</p>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-lg rounded-full px-4 py-2 border border-white/20">
                <Activity className="w-5 h-5 text-cyan-400" />
                <span className="text-white font-semibold">Live Data</span>
              </div>
            </div>

            {/* Custom Chart */}
            <div className="relative h-80">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-right pr-4">
                {[250, 200, 150, 100, 50, 0].map((val) => (
                  <span key={val} className="text-sm text-gray-400 font-mono">{val}M</span>
                ))}
              </div>

              {/* Chart area */}
              <div className="ml-16 h-full relative">
                {/* Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-full h-px bg-white/10"></div>
                  ))}
                </div>

                {/* Data visualization */}
                <div className="absolute inset-0 flex items-end justify-around">
                  {revenueData.map((data, idx) => {
                    const height = ((data.revenue - minRevenue) / (maxRevenue - minRevenue)) * 100;
                    return (
                      <div key={idx} className="flex flex-col items-center space-y-3 group/bar">
                        {/* Value label */}
                        <div className="opacity-0 group-hover/bar:opacity-100 transition-opacity bg-white/20 backdrop-blur-lg rounded-xl px-3 py-2 border border-white/30">
                          <span className="text-white font-bold text-sm">{data.revenue}M</span>
                        </div>
                        
                        {/* Bar */}
                        <div className="relative w-16">
                          <div className="absolute inset-0 bg-gradient-to-t from-cyan-500 via-purple-500 to-pink-500 rounded-t-2xl blur-lg opacity-50"></div>
                          <div 
                            className="relative bg-gradient-to-t from-cyan-400 via-purple-400 to-pink-400 rounded-t-2xl transition-all duration-500 group-hover/bar:scale-110 shadow-2xl"
                            style={{ height: `${height}%` }}
                          >
                            {/* Shimmer effect */}
                            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent rounded-t-2xl"></div>
                          </div>
                        </div>
                        
                        {/* Month label */}
                        <span className="text-sm text-gray-300 font-semibold">{data.month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Pendapatan Rata-rata', value: `Rp ${(revenueData.reduce((sum, d) => sum + d.revenue, 0) / revenueData.length).toFixed(1)}M`, color: 'from-blue-400 to-cyan-400', icon: BarChart3 },
            { label: 'Pendapatan Tertinggi', value: `Rp ${Math.max(...revenueData.map(d => d.revenue))}M`, color: 'from-green-400 to-emerald-400', icon: TrendingUp },
            { label: 'Pendapatan Terendah', value: `Rp ${Math.min(...revenueData.map(d => d.revenue))}M`, color: 'from-purple-400 to-pink-400', icon: Activity },
          ].map((item, idx) => (
            <div key={idx} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 p-6 hover:border-white/40 transition-all transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-3">
                  <item.icon className="w-8 h-8 text-cyan-300" />
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${item.color} animate-pulse`}></div>
                </div>
                <p className="text-gray-300 text-sm mb-2">{item.label}</p>
                <p className={`text-2xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact Info */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/30 p-8 shadow-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl shadow-lg">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Informasi Kontak</h2>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 border border-white/10 hover:border-white/30 transition">
                  <div className="flex items-center space-x-3 mb-2">
                    <Phone className="w-5 h-5 text-cyan-400" />
                    <p className="text-gray-300 text-sm">Nomor Telepon</p>
                  </div>
                  <p className="text-xl font-bold text-white ml-8">{umkm.phone}</p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 border border-white/10 hover:border-white/30 transition">
                  <div className="flex items-center space-x-3 mb-2">
                    <Mail className="w-5 h-5 text-purple-400" />
                    <p className="text-gray-300 text-sm">Email</p>
                  </div>
                  <p className="text-xl font-bold text-white ml-8">{umkm.email}</p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 border border-white/10 hover:border-white/30 transition">
                  <div className="flex items-center space-x-3 mb-2">
                    <MapPin className="w-5 h-5 text-pink-400" />
                    <p className="text-gray-300 text-sm">Lokasi</p>
                  </div>
                  <p className="text-xl font-bold text-white ml-8">{umkm.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Business Info */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/30 p-8 shadow-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl shadow-lg">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Informasi Bisnis</h2>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 border border-white/10 hover:border-white/30 transition">
                  <div className="flex items-center space-x-3 mb-2">
                    <Users className="w-5 h-5 text-cyan-400" />
                    <p className="text-gray-300 text-sm">Pemilik</p>
                  </div>
                  <p className="text-xl font-bold text-white ml-8">{umkm.owner}</p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 border border-white/10 hover:border-white/30 transition">
                  <div className="flex items-center space-x-3 mb-2">
                    <Calendar className="w-5 h-5 text-purple-400" />
                    <p className="text-gray-300 text-sm">Didirikan</p>
                  </div>
                  <p className="text-xl font-bold text-white ml-8">{umkm.established}</p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 border border-white/10 hover:border-white/30 transition">
                  <div className="flex items-center space-x-3 mb-2">
                    <Users className="w-5 h-5 text-pink-400" />
                    <p className="text-gray-300 text-sm">Jumlah Karyawan</p>
                  </div>
                  <p className="text-xl font-bold text-white ml-8">{umkm.employees} Orang</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
          <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/30 p-8 shadow-2xl">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Deskripsi Bisnis</h2>
            </div>
            <p className="text-gray-200 leading-relaxed text-lg">{umkm.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}