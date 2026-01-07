'use client';

import { TrendingUp, AlertCircle, Zap } from 'lucide-react';

export default function OwnerForecastAnalytics() {
  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Forecast Bisnis Saya</h1>
          <p className="text-white/70">Prediksi pendapatan 3 bulan ke depan</p>
        </div>

        {/* Info Banner */}
        <div className="bg-white/10 backdrop-blur-xl border border-blue-500/30 rounded-3xl p-6 flex items-start gap-4">
          <Zap className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-white">Prediksi Berbasis AI</h3>
            <p className="text-white/70 text-sm mt-1">
              Forecast ini akan tersedia setelah Anda mengumpulkan data keuangan minimal 3 bulan.
            </p>
          </div>
        </div>

        {/* Forecast Information */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp size={24} className="text-blue-400" />
            Prediksi Pendapatan
          </h2>
          <div className="text-white/60 text-center py-8 space-y-4">
            <AlertCircle className="mx-auto" size={40} />
            <p>Belum ada data forecast yang tersedia</p>
            <p className="text-sm">Mulai dengan:</p>
            <ol className="text-left space-y-2 inline-block">
              <li>1. Daftarkan UMKM Anda</li>
              <li>2. Input laporan keuangan bulanan</li>
              <li>3. Tunggu 3 bulan untuk forecast</li>
            </ol>
          </div>
        </div>
      </div>
  );
}

