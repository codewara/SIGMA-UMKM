'use client';
import { TrendingUp, Loader } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatCurrency } from '@/lib/formatter';

export default function OwnerGrowthAnalytics() {
  const [topGrowers, setTopGrowers] = useState<any[]>([]);
  const [sectorGrowth, setSectorGrowth] = useState<any[]>([]);
  const [totalUmkms, setTotalUmkms] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGrowthData();
  }, []);

  const fetchGrowthData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics/growth?scope=own');
      if (response.ok) {
        const data = await response.json();
        const responseData = data.data || {};
        
        setTopGrowers(responseData.topGrowers || []);
        setSectorGrowth(responseData.sectorGrowth || []);
        setTotalUmkms(responseData.totalUmkms || 0);
      }
    } catch (error) {
      console.error('Failed to fetch growth data:', error);
    } finally {
      setLoading(false);
    }
  };

  const avgGrowth = topGrowers.length > 0
    ? (topGrowers.reduce((sum, s) => sum + s.growth_rate, 0) / topGrowers.length).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Pertumbuhan Bisnis Saya</h1>
          <p className="text-white/70">Analisis pertumbuhan UMKM Anda</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="animate-spin text-white/60" size={32} />
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
                <p className="text-white/70 text-sm">UMKM Saya</p>
                <p className="text-3xl font-bold text-white mt-2">{totalUmkms}</p>
                <p className="text-blue-400 text-sm mt-2">✓ UMKM terdaftar</p>
              </div>

              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
                <p className="text-white/70 text-sm">Pertumbuhan Rata-rata</p>
                <p className="text-3xl font-bold text-white mt-2">+{avgGrowth}%</p>
                <p className="text-green-400 text-sm mt-2">📈 {avgGrowth !== '0' ? 'Pertumbuhan positif' : 'Data terbatas'}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
                <p className="text-white/70 text-sm">Sektor Bisnis</p>
                <p className="text-3xl font-bold text-white mt-2">{sectorGrowth.length > 0 ? sectorGrowth[0].sektor : '-'}</p>
                <p className="text-blue-400 text-sm mt-2">🏷️ Utama Anda</p>
              </div>
            </div>

            {/* Growth Table */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp size={24} className="text-green-400" />
                Statistik UMKM Saya
              </h2>
              {topGrowers.length === 0 ? (
                <div className="text-white/60 text-center py-8">
                  Laporan akan ditampilkan setelah Anda input data keuangan minimal 2 bulan.
                </div>
              ) : (
                <div className="space-y-3">
                  {topGrowers.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
                      <div className="flex-1">
                        <p className="font-semibold text-white">{item.nama_usaha}</p>
                        <p className="text-white/60 text-sm">{item.sektor}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${item.growth_rate >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {item.growth_rate >= 0 ? '+' : ''}{item.growth_rate}%
                        </p>
                        <p className="text-white/60 text-sm">{formatCurrency(item.latest_omzet)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
  );
}

