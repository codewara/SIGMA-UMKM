'use client';

import { TrendingUp, AlertCircle, Zap, ArrowUp, ArrowDown } from 'lucide-react';

export default function AdminForecastAnalytics() {
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
    <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Forecast & Rekomendasi</h1>
          <p className="text-white/70">Prediksi pendapatan 3 bulan ke depan</p>
        </div>

        {/* Info Banner */}
        <div className="bg-white/10 backdrop-blur-xl border border-blue-500/30 rounded-3xl p-6 flex items-start gap-4">
          <Zap className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-white">Prediksi Berbasis AI</h3>
            <p className="text-white/70 text-sm mt-1">Forecast ini berbasis data historis dan tren pasar terkini.</p>
          </div>
        </div>

        {/* Forecast Cards */}
        <div className="space-y-4">
          {forecastData.map((item) => (
            <div key={item.id} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 hover:bg-white/20 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{item.umkm}</h3>
                  <p className="text-white/60 text-sm mt-1">Forecast 3 bulan</p>
                </div>
                {item.trend === 'naik' ? (
                  <ArrowUp className="text-green-400" size={24} />
                ) : (
                  <ArrowDown className="text-red-400" size={24} />
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-white/60 text-xs">Current Revenue</p>
                  <p className="text-white font-semibold">Rp {item.currentRevenue}M</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs">Forecast Revenue</p>
                  <p className="text-white font-semibold">Rp {item.forecastRevenue}M</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs">Growth Rate</p>
                  <p className={`font-semibold ${item.growth > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {item.growth > 0 ? '+' : ''}{item.growth}%
                  </p>
                </div>
              </div>

              <p className="text-white/70 text-sm border-t border-white/10 pt-4">
                <span className="font-semibold">Rekomendasi:</span> {item.recommendation}
              </p>
            </div>
          ))}
        </div>
      </div>
  );
}

