'use client';

import { Menu, LogOut, TrendingUp, AlertCircle, Zap } from 'lucide-react';
import { useState } from 'react';

export default function AdminForecastPage() {
  const [showSidebar, setShowSidebar] = useState(false);

  const forecastData = [
    {
      id: 1,
      umkm: 'Toko Roti Berkah',
      currentRevenue: 250.5,
      forecastRevenue: 287.3,
      growth: 14.7,
      trend: 'naik',
      recommendation: 'Pertahankan strategi marketing, pertimbangkan ekspansi cabang'
    },
    {
      id: 2,
      umkm: 'Kerajinan Tangan Indah',
      currentRevenue: 180.2,
      forecastRevenue: 215.8,
      growth: 19.8,
      trend: 'naik',
      recommendation: 'Tingkatkan produksi, peluang besar untuk media sosial marketing'
    },
    {
      id: 3,
      umkm: 'Konveksi Sejahtera',
      currentRevenue: 95.8,
      forecastRevenue: 92.5,
      growth: -3.4,
      trend: 'turun',
      recommendation: 'Analisis kompetitor, pertimbangkan inovasi produk atau strategi pricing'
    },
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
          <a href="/admin/revenue" className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition">
            💰 Pendapatan
          </a>
          <a href="/admin/forecast" className="block px-4 py-3 rounded-lg bg-blue-600 font-medium">
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
            <h1 className="text-2xl font-bold text-gray-900">Forecast & Rekomendasi Aksi</h1>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start">
            <Zap className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900">Prediksi Pendapatan 3 Bulan ke Depan</h3>
              <p className="text-sm text-blue-700 mt-1">Forecast ini berbasis data historis dan tren pasar.</p>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm mb-2">UMKM Pertumbuhan Positif</p>
              <p className="text-3xl font-bold text-green-600">2</p>
              <p className="text-green-600 text-sm mt-2">67% dari total</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm mb-2">UMKM Perlu Perhatian</p>
              <p className="text-3xl font-bold text-red-600">1</p>
              <p className="text-red-600 text-sm mt-2">Konveksi Sejahtera</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm mb-2">Rata-rata Pertumbuhan</p>
              <p className="text-3xl font-bold text-blue-600">+10.4%</p>
              <p className="text-blue-600 text-sm mt-2">Pertumbuhan positif</p>
            </div>
          </div>

          {/* Forecast Cards */}
          <div className="space-y-4">
            {forecastData.map((item) => (
              <div key={item.id} className={`bg-white rounded-lg shadow p-6 border-l-4 ${item.trend === 'naik' ? 'border-green-500' : 'border-red-500'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Side - Data */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">{item.umkm}</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Pendapatan Saat Ini:</span>
                        <span className="font-semibold text-gray-900">Rp {item.currentRevenue}M</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Prediksi 3 Bln Depan:</span>
                        <span className="font-semibold text-gray-900">Rp {item.forecastRevenue}M</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-t border-gray-200">
                        <span className="text-gray-600 font-medium">Pertumbuhan:</span>
                        <div className={`flex items-center font-bold ${item.trend === 'naik' ? 'text-green-600' : 'text-red-600'}`}>
                          <TrendingUp className={`w-5 h-5 mr-2 ${item.trend === 'turun' ? 'rotate-180' : ''}`} />
                          {item.growth > 0 ? '+' : ''}{item.growth}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Recommendation */}
                  <div>
                    <div className={`rounded-lg p-4 ${item.trend === 'naik' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                      <div className="flex items-start">
                        {item.trend === 'naik' ? (
                          <TrendingUp className="w-5 h-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-600 mt-1 mr-3 flex-shrink-0" />
                        )}
                        <div>
                          <h4 className={`font-semibold mb-2 ${item.trend === 'naik' ? 'text-green-900' : 'text-red-900'}`}>
                            {item.trend === 'naik' ? 'Rekomendasi Aksi' : 'Perlu Tindakan'}
                          </h4>
                          <p className={`text-sm ${item.trend === 'naik' ? 'text-green-800' : 'text-red-800'}`}>
                            {item.recommendation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
