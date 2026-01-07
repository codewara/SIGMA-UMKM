'use client';

import { TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function OwnerGrowthAnalytics() {
  const [growthData, setGrowthData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGrowthData();
  }, []);

  const fetchGrowthData = async () => {
    try {
      setLoading(true);
      // Fetch owner's own growth data (scoped to their UMKMs)
      const response = await fetch('/api/analytics/growth?scope=own');
      if (response.ok) {
        const data = await response.json();
        setGrowthData(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch growth data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Pertumbuhan Bisnis Saya</h1>
          <p className="text-white/70">Analisis pertumbuhan UMKM Anda</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
            <p className="text-white/70 text-sm">UMKM Saya</p>
            <p className="text-3xl font-bold text-white mt-2">-</p>
            <p className="text-blue-400 text-sm mt-2">Menunggu data</p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
            <p className="text-white/70 text-sm">Pertumbuhan Rata-rata</p>
            <p className="text-3xl font-bold text-white mt-2">-</p>
            <p className="text-green-400 text-sm mt-2">Data belum tersedia</p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
            <p className="text-white/70 text-sm">Total Omzet</p>
            <p className="text-3xl font-bold text-white mt-2">-</p>
            <p className="text-blue-400 text-sm mt-2">Lihat laporan keuangan</p>
          </div>
        </div>

        {/* Growth Table */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp size={24} className="text-green-400" />
            Statistik UMKM Saya
          </h2>
          <div className="text-white/60 text-center py-8">
            Laporan akan ditampilkan setelah Anda input data keuangan minimal 2 bulan.
          </div>
        </div>
      </div>
  );
}

