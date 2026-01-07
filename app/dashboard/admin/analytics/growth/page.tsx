'use client';
import { TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AdminGrowthAnalytics() {
  const [growthData, setGrowthData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGrowthData();
  }, []);

  const fetchGrowthData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics/growth?scope=global');
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

  const mockGrowthData = [
    { region: 'Jawa Timur', umkm: 45, growth: '+12.5%', status: 'Healthy' },
    { region: 'Jawa Barat', umkm: 32, growth: '+8.3%', status: 'Growing' },
    { region: 'Jawa Tengah', umkm: 28, growth: '+5.2%', status: 'Stable' },
    { region: 'Sumatera', umkm: 18, growth: '+2.1%', status: 'Emerging' },
  ];

  const topGrowth = [
    { umkm: 'Soto Cak Har', sector: 'Kuliner', growth: 23.4, revenue: 'Rp 52M' },
    { umkm: 'Kerajinan Indah', sector: 'Kriya', growth: 18.7, revenue: 'Rp 38M' },
    { umkm: 'Konveksi Sejahtera', sector: 'Fashion', growth: 15.2, revenue: 'Rp 45M' },
  ];

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Analisis Pertumbuhan</h1>
          <p className="text-white/70">Metrik pertumbuhan UMKM per region</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 hover:bg-white/20 transition-all">
            <p className="text-white/70 text-sm">Total UMKM Terdaftar</p>
            <p className="text-3xl font-bold text-white mt-2">123</p>
            <p className="text-green-400 text-sm mt-2">↑ +8.5% dari bulan lalu</p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 hover:bg-white/20 transition-all">
            <p className="text-white/70 text-sm">Rata-rata Pertumbuhan</p>
            <p className="text-3xl font-bold text-white mt-2">+9.8%</p>
            <p className="text-blue-400 text-sm mt-2">Tahun-ke-tahun</p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 hover:bg-white/20 transition-all">
            <p className="text-white/70 text-sm">Sektor Terbesar</p>
            <p className="text-3xl font-bold text-white mt-2">Kuliner</p>
            <p className="text-purple-400 text-sm mt-2">42 UMKM aktif</p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 hover:bg-white/20 transition-all">
            <p className="text-white/70 text-sm">Total Omzet</p>
            <p className="text-3xl font-bold text-white mt-2">Rp 2.8T</p>
            <p className="text-green-400 text-sm mt-2">↑ +15.3% YoY</p>
          </div>
        </div>

        {/* Growth by Region */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Pertumbuhan per Region</h2>
          <div className="space-y-3">
            {mockGrowthData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
                <div className="flex-1">
                  <p className="font-semibold text-white">{item.region}</p>
                  <p className="text-white/60 text-sm">{item.umkm} UMKM</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-semibold">{item.growth}</p>
                  <p className="text-white/60 text-sm">{item.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Growth UMKMs */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp size={24} className="text-green-400" />
            UMKM Pertumbuhan Tertinggi
          </h2>
          <div className="space-y-3">
            {topGrowth.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
                <div className="flex-1">
                  <p className="font-semibold text-white">{item.umkm}</p>
                  <p className="text-white/60 text-sm">{item.sector}</p>
                </div>
                <div className="text-right">
                  <p className="text-blue-400 font-semibold">{item.growth}%</p>
                  <p className="text-white/60 text-sm">{item.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
  );
}

