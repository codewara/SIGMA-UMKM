'use client';

import { MapPin, Loader } from 'lucide-react';
import { useEffect, useState } from 'react';

interface HeatmapData {
  clusters: Array<{ city: string; count: number; lat: number; lng: number }>;
  totalUmkms: number;
}

export default function OwnerHeatmapAnalytics() {
  const [clusters, setClusters] = useState<HeatmapData['clusters']>([]);
  const [totalUmkms, setTotalUmkms] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHeatmapData();
  }, []);

  const fetchHeatmapData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics/heatmap?scope=own');
      if (response.ok) {
        const data = await response.json();
        const { clusters: cls, totalUmkms: total } = data.data;
        
        setClusters((cls || []).sort((a, b) => b.count - a.count));
        setTotalUmkms(total || 0);
      }
    } catch (error) {
      console.error('Failed to fetch heatmap data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getHeatColor = (count: number, maxCount: number) => {
    const intensity = count / maxCount;
    if (intensity > 0.75) return { bg: 'bg-red-500', status: 'Banyak', label: 'Sangat Ramai' };
    if (intensity > 0.5) return { bg: 'bg-yellow-500', status: 'Sedang', label: 'Ramai' };
    if (intensity > 0.25) return { bg: 'bg-blue-500', status: 'Sedikit', label: 'Sepi' };
    return { bg: 'bg-cyan-500', status: 'Sangat Sedikit', label: 'Sangat Sepi' };
  };

  const maxCount = clusters.length > 0 ? Math.max(...clusters.map(c => c.count)) : 1;

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Peta Kompetitor</h1>
          <p className="text-white/70">Analisis kompetitor di sekitar lokasi bisnis Anda (radius 5km)</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="animate-spin text-white/60" size={32} />
          </div>
        ) : (
          <>
            {/* Info Card */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <MapPin size={24} className="text-blue-400" />
                Analisis Kepadatan Kompetitor
              </h3>
              {clusters.length === 0 ? (
                <div className="text-white/60 text-center py-8">
                  Belum ada data kompetitor untuk UMKM Anda
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-white/70">Total {totalUmkms} UMKM serupa terdeteksi dalam radius 5km dari lokasi Anda</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-white/5 p-3 rounded-lg">
                      <p className="text-white/60 text-xs">Sangat Ramai</p>
                      <div className="w-8 h-6 bg-red-500 mt-1 rounded"></div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg">
                      <p className="text-white/60 text-xs">Ramai</p>
                      <div className="w-8 h-6 bg-yellow-500 mt-1 rounded"></div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg">
                      <p className="text-white/60 text-xs">Sepi</p>
                      <div className="w-8 h-6 bg-blue-500 mt-1 rounded"></div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg">
                      <p className="text-white/60 text-xs">Sangat Sepi</p>
                      <div className="w-8 h-6 bg-cyan-500 mt-1 rounded"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Competitor Statistics */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Statistik Kompetitor per Kota</h2>
              {clusters.length === 0 ? (
                <div className="text-white/60 text-center py-8">
                  <p>Belum ada data kompetitor untuk ditampilkan</p>
                  <p className="text-sm mt-2">Pastikan UMKM Anda telah terverifikasi terlebih dahulu</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {clusters.map((item, idx) => {
                    const heat = getHeatColor(item.count, maxCount);
                    const percentage = ((item.count / totalUmkms) * 100).toFixed(1);
                    return (
                      <div key={idx} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
                        <div className={`w-3 h-12 rounded-full ${heat.bg}`}></div>
                        <div className="flex-1">
                          <p className="font-semibold text-white">{item.city}</p>
                          <p className="text-white/60 text-sm">{item.count} UMKM · {percentage}% dari total</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-xs font-semibold px-2 py-1 rounded-full ${heat.bg} text-white`}>
                            {heat.status}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  }
