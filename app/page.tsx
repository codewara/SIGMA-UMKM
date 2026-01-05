'use client';

import { Plus, Search, Eye, MapPin, TrendingUp, LogOut, Menu, X, Sparkles, Award, Users, BarChart3 } from 'lucide-react';
import { useState } from 'react';

export default function HomePage() {
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

  const umkmMilikSaya = [];

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
    { label: 'Total UMKM', value: '1,234', icon: Users, color: 'from-blue-500 to-blue-600' },
    { label: 'Transaksi Bulan Ini', value: 'Rp 1.2M', icon: BarChart3, color: 'from-green-500 to-green-600' },
    { label: 'Pertumbuhan', value: '+23.5%', icon: TrendingUp, color: 'from-purple-500 to-purple-600' },
    { label: 'UMKM Terverifikasi', value: '892', icon: Award, color: 'from-orange-500 to-orange-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Navigation with glassmorphism effect */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-600 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition"></div>
                <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg transform group-hover:scale-110 transition">
                  <span className="text-white text-xl font-bold">Σ</span>
                </div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">SIGMA UMKM</span>
                <p className="text-xs text-gray-500">Pemberdayaan UMKM Indonesia</p>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <button className="text-gray-700 hover:text-blue-600 font-semibold transition transform hover:scale-105">Dashboard</button>
              <button className="text-gray-700 hover:text-blue-600 font-semibold transition transform hover:scale-105">Pengaturan</button>
              <button className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition">
                <LogOut className="w-5 h-5" />
                <span>Keluar</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition">
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden py-4 border-t border-gray-200 space-y-2">
              <button className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition">Dashboard</button>
              <button className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition">Pengaturan</button>
              <button className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition font-semibold">Keluar</button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-900">Platform UMKM Terpercaya</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Dashboard UMKM
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Kelola dan kembangkan bisnis UMKM Anda dengan mudah dan efisien</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 p-6">
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform`}></div>
                  <div className="relative">
                    <stat.icon className={`w-8 h-8 mb-3 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} />
                    <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition"></div>
              <div className="relative flex items-center bg-white rounded-2xl shadow-xl px-6 py-5">
                <Search className="w-6 h-6 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari UMKM berdasarkan nama, kategori, atau lokasi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ml-3 bg-transparent outline-none text-base flex-1 text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* UMKM Saya Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">📊 UMKM Saya</h2>
            
          </div>
          {umkmMilikSaya.length > 0 ? (
            <div className="space-y-4">
                {umkmMilikSaya.map((umkm) => (
                  <div key={umkm.id} className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition"></div>
                    <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1 flex">
                      {/* Card Left - Header with solid color */}
                      <div className="relative bg-blue-600 p-6 text-white overflow-hidden w-56 flex-shrink-0 flex flex-col justify-between">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
                        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8"></div>
                        <div className="relative">
                          <div className="text-4xl mb-4">{umkm.icon}</div>
                          <h3 className="text-xl font-bold leading-tight mb-1">{umkm.name}</h3>
                          <div className="inline-block bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold">
                            {umkm.badge}
                          </div>
                        </div>
                        <p className="text-blue-100 text-sm">{umkm.category}</p>
                      </div>

                      {/* Card Right - Body */}
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2 text-gray-600">
                            <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
                            <span className="font-medium">{umkm.location}</span>
                          </div>
                          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                            <p className="text-gray-600 text-sm font-medium mb-2">Pendapatan Bulan Ini</p>
                            <div className="flex items-center justify-between">
                              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{umkm.revenue}</p>
                              <div className={`text-xl font-bold flex items-center ${umkm.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                                <TrendingUp className="w-5 h-5 mr-1" />
                                {umkm.growth}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-3">
                          <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-bold text-sm text-center transition transform hover:scale-105 shadow-md">
                            Lihat Detail
                          </button>
                          <button className="border-2 border-gray-200 hover:border-blue-600 hover:bg-blue-50 text-gray-700 hover:text-blue-600 px-4 py-2 rounded-lg font-bold text-sm transition">
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            ) : (
            <button onClick={() => setShowRegistrationForm(true)} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold inline-flex items-center justify-center space-x-3 shadow-xl hover:shadow-2xl transform hover:scale-105 transition">
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

                      {/* Action Button */}
                      <button className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg font-bold text-sm flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:scale-105 transition">
                        <Eye className="w-4 h-4" />
                        <span>Lihat Detail</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 bg-white/70 backdrop-blur-lg border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">Σ</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">SIGMA UMKM</span>
            </div>
            <p className="text-gray-600">© 2026 SIGMA UMKM. Memberdayakan UMKM Indonesia</p>
          </div>
        </div>
      </footer>

      {/* Registration Modal */}
      {showRegistrationForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setShowRegistrationForm(false)}
              className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>

            {/* Form Content */}
            <div className="p-8 md:p-12">
              <div className="mb-8">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                  Daftarkan UMKM Anda
                </h2>
                <p className="text-gray-600 text-lg">Lengkapi informasi bisnis Anda untuk memulai perjalanan bersama SIGMA UMKM</p>
              </div>

              <form className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nama UMKM</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Toko Roti Berkah"
                    className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition text-gray-900"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Kategori Bisnis</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition text-gray-900"
                  >
                    <option value="">Pilih Kategori</option>
                    <option value="produksi">Produksi</option>
                    <option value="kerajinan">Kerajinan</option>
                    <option value="konveksi">Konveksi</option>
                    <option value="pertanian">Pertanian</option>
                    <option value="kuliner">Kuliner</option>
                    <option value="fashion">Fashion</option>
                    <option value="jasa">Jasa</option>
                    <option value="lainnya">Lainnya</option>
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Lokasi/Kota</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Contoh: Jakarta Timur"
                    className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition text-gray-900"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor Telepon</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Contoh: 081234567890"
                    className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition text-gray-900"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Contoh: info@umkmsaya.com"
                    className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition text-gray-900"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi Bisnis</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Jelaskan tentang bisnis Anda..."
                    rows={4}
                    className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition text-gray-900"
                  />
                </div>

                {/* Buttons */}
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowRegistrationForm(false)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition"
                  >
                    Daftarkan UMKM
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}