'use client';

import { Menu, LogOut, Plus, Search, Edit, Trash2, DollarSign, TrendingUp } from 'lucide-react';
import { useState } from 'react';

export default function AdminRevenuePage() {
  const [showSidebar, setShowSidebar] = useState(false);

  const revenueData = [
    { id: 1, umkm: 'Toko Roti Berkah', date: '2026-01-05', amount: 2500000, category: 'Penjualan', description: 'Penjualan roti harian' },
    { id: 2, umkm: 'Kerajinan Tangan Indah', date: '2026-01-05', amount: 1800000, category: 'Pesanan', description: 'Pesanan kerajinan custom' },
    { id: 3, umkm: 'Konveksi Sejahtera', date: '2026-01-04', amount: 3200000, category: 'Penjualan', description: 'Penjualan kaos dan seragam' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${showSidebar ? 'fixed' : 'hidden'} lg:static inset-0 lg:w-64 bg-gray-900 text-white z-20 lg:z-0`}>
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
              <span className="text-white text-lg font-bold">Σ</span>
            </div>
            <span className="ml-2 text-xl font-bold">SIGMA</span>
          </div>
        </div>

        <nav className="mt-8 space-y-2 px-4">
          <a href="/admin/umkm" className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition">
            📊 UMKM
          </a>
          <a href="/admin/revenue" className="block px-4 py-3 rounded-lg bg-blue-600 font-medium">
            💰 Pendapatan
          </a>
          <a href="/admin/forecast" className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition">
            🔮 Forecast
          </a>
          <a href="/" className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition">
            🏠 Beranda
          </a>
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <button className="w-full flex items-center space-x-2 px-4 py-3 rounded-lg hover:bg-gray-800 transition text-gray-300">
            <LogOut className="w-5 h-5" />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => setShowSidebar(!showSidebar)} className="lg:hidden mr-4">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Pencatatan Pendapatan</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center bg-gray-100 rounded-lg px-4 py-2">
              <Search className="w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Cari transaksi..." className="ml-2 bg-transparent outline-none text-sm flex-1" />
            </div>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Input Pendapatan</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-2">Total Pendapatan Hari Ini</p>
                  <p className="text-3xl font-bold text-gray-900">Rp 13.45M</p>
                </div>
                <DollarSign className="w-12 h-12 text-green-500 opacity-50" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-2">Total Bulan Ini</p>
                  <p className="text-3xl font-bold text-gray-900">Rp 285.7M</p>
                </div>
                <TrendingUp className="w-12 h-12 text-blue-500 opacity-50" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-2">Rata-rata Harian</p>
                  <p className="text-3xl font-bold text-gray-900">Rp 9.5M</p>
                </div>
                <TrendingUp className="w-12 h-12 text-purple-500 opacity-50" />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tanggal</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">UMKM</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Kategori</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Deskripsi</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Jumlah</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {revenueData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <p className="text-gray-900 font-medium">{item.date}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900 font-medium">{item.umkm}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-600 text-sm">{item.description}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="text-gray-900 font-semibold">Rp {(item.amount / 1000000).toFixed(1)}M</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition">
                            <Edit className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
