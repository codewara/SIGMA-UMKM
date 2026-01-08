'use client';
import { TrendingUp, Loader } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatCurrency } from '@/lib/formatter';

export default function AdminGrowthAnalytics() {
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
      const response = await fetch('/api/analytics/growth?scope=global');
      if (response.ok) {
        const data = await response.json();
        const { topGrowers: top, sectorGrowth: sectors, totalUmkms: total } = data.data;
        
        setTopGrowers(top || []);
        setSectorGrowth(sectors || []);
        setTotalUmkms(total || 0);
      }
    } catch (error) {
      console.error('Failed to fetch growth data:', error);
    } finally {
      setLoading(false);
    }
  };

  const avgGrowth = sectorGrowth.length > 0 
    ? (sectorGrowth.reduce((sum, s) => sum + s.avg_growth, 0) / sectorGrowth.length).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Analisis Pertumbuhan</h1>
          <p className="text-white/70">Metrik pertumbuhan UMKM berdasarkan data historis</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="animate-spin text-white/60" size={32} />
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 hover:bg-white/20 transition-all">
                <p className="text-white/70 text-sm">Total UMKM Terdaftar</p>
                <p className="text-3xl font-bold text-white mt-2">{totalUmkms}</p>
                <p className="text-green-400 text-sm mt-2">✓ Terdata lengkap</p>
              </div>

              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 hover:bg-white/20 transition-all">
                <p className="text-white/70 text-sm">Rata-rata Pertumbuhan</p>
                <p className="text-3xl font-bold text-white mt-2">+{avgGrowth}%</p>
                <p className="text-blue-400 text-sm mt-2">Lintas Sektor</p>
              </div>

              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 hover:bg-white/20 transition-all">
                <p className="text-white/70 text-sm">Sektor Terbesar</p>
                <p className="text-3xl font-bold text-white mt-2">{sectorGrowth.length > 0 ? sectorGrowth[0].sektor : 'N/A'}</p>
                <p className="text-purple-400 text-sm mt-2">{sectorGrowth.length > 0 ? sectorGrowth[0].umkm_count : 0} UMKM aktif</p>
              </div>

              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 hover:bg-white/20 transition-all">
                <p className="text-white/70 text-sm">Sektor Pertumbuhan Tertinggi</p>
                <p className="text-3xl font-bold text-white mt-2">{sectorGrowth.length > 0 ? `+${sectorGrowth[0].avg_growth}%` : 'N/A'}</p>
                <p className="text-green-400 text-sm mt-2">📈 {sectorGrowth.length > 0 ? sectorGrowth[0].sektor : ''}</p>
              </div>
            </div>

            {/* Growth by Sector */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Pertumbuhan per Sektor</h2>
              {sectorGrowth.length === 0 ? (
                <p className="text-white/60 text-center py-8">Belum ada data pertumbuhan</p>
              ) : (
                <div className="space-y-3">
                  {sectorGrowth.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
                      <div className="flex-1">
                        <p className="font-semibold text-white">{item.sektor}</p>
                        <p className="text-white/60 text-sm">{item.umkm_count} UMKM</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${item.avg_growth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {item.avg_growth >= 0 ? '+' : ''}{item.avg_growth.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top Growth UMKMs */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp size={24} className="text-green-400" />
                UMKM Pertumbuhan Tertinggi
              </h2>
              {topGrowers.length === 0 ? (
                <p className="text-white/60 text-center py-8">Belum ada data pertumbuhan UMKM</p>
              ) : (
                <div className="space-y-3">
                  {topGrowers.slice(0, 10).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
                      <div className="flex-1">
                        <p className="font-semibold text-white">{item.nama_usaha}</p>
                        <p className="text-white/60 text-sm">{item.sektor}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${item.growth_rate >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
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

