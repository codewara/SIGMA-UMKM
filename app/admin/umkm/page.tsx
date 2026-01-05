'use client';

import { Menu, LogOut, Plus, Search, Edit, Trash2, MapPin, Phone, Mail } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function AdminUmkmPage() {
  const [showSidebar, setShowSidebar] = useState(false);

  const umkmList = [
    { id: 1, name: 'Toko Roti Berkah', location: 'Jakarta Timur', phone: '08123456789', email: 'roti@berkah.com', revenue: 'Rp 250.5M', status: 'Aktif' },
    { id: 2, name: 'Kerajinan Tangan Indah', location: 'Bandung', phone: '08234567890', email: 'kerajinan@indah.com', revenue: 'Rp 180.2M', status: 'Aktif' },
    { id: 3, name: 'Konveksi Sejahtera', location: 'Surabaya', phone: '08345678901', email: 'konveksi@sejahtera.com', revenue: 'Rp 95.8M', status: 'Aktif' },
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
          <a href="/admin/umkm" className="block px-4 py-3 rounded-lg bg-blue-600 font-medium">
            📊 UMKM
          </a>
          <a href="/admin/revenue" className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition">
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
            <h1 className="text-2xl font-bold text-gray-900">Manajemen UMKM</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center bg-gray-100 rounded-lg px-4 py-2">
              <Search className="w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Cari UMKM..." className="ml-2 bg-transparent outline-none text-sm flex-1" />
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">UMKM Baru</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm mb-2">Total UMKM</p>
              <p className="text-3xl font-bold text-gray-900">256</p>
              <p className="text-green-600 text-sm mt-2">↑ 12 bulan ini</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm mb-2">UMKM Aktif</p>
              <p className="text-3xl font-bold text-gray-900">248</p>
              <p className="text-green-600 text-sm mt-2">97% aktivitas</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm mb-2">Total Pendapatan</p>
              <p className="text-3xl font-bold text-gray-900">Rp 2.5B</p>
              <p className="text-green-600 text-sm mt-2">↑ Rp 250M</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm mb-2">Rata-rata Pendapatan</p>
              <p className="text-3xl font-bold text-gray-900">Rp 9.8M</p>
              <p className="text-blue-600 text-sm mt-2">Stabil</p>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Nama UMKM</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Lokasi</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Kontak</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Pendapatan</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {umkmList.map((umkm) => (
                    <tr key={umkm.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <Link href={`/umkm/${umkm.id}`} className="font-semibold text-gray-900 hover:text-blue-600">
                          {umkm.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          {umkm.location}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center text-gray-600 text-sm">
                            <Phone className="w-4 h-4 mr-2" />
                            {umkm.phone}
                          </div>
                          <div className="flex items-center text-gray-600 text-sm">
                            <Mail className="w-4 h-4 mr-2" />
                            {umkm.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">{umkm.revenue}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          {umkm.status}
                        </span>
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
