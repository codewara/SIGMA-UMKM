'use client';

import { MapPin, Loader } from 'lucide-react';
import { useEffect, useState } from 'react';

interface HeatmapData {
  clusters: Array<{ city: string; count: number; lat: number; lng: number }>;
  totalUmkms: number;
}

export default function AdminHeatmapAnalytics() {
  const [clusters, setClusters] = useState<HeatmapData['clusters']>([]);
  const [totalUmkms, setTotalUmkms] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHeatmapData();
  }, []);

  const fetchHeatmapData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics/heatmap?scope=global');
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

  // Get heat intensity color based on count
  const getHeatColor = (count: number, maxCount: number) => {
    const intensity = count / maxCount;
    if (intensity > 0.75) return { bg: 'bg-red-500', status: 'Hot', label: 'Sangat Panas' };
    if (intensity > 0.5) return { bg: 'bg-yellow-500', status: 'Warm', label: 'Hangat' };
    if (intensity > 0.25) return { bg: 'bg-blue-500', status: 'Cool', label: 'Sejuk' };
    return { bg: 'bg-cyan-500', status: 'Cold', label: 'Dingin' };
  };

  const maxCount = clusters.length > 0 ? Math.max(...clusters.map(c => c.count)) : 1;

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Heatmap Konsentrasi UMKM</h1>
          <p className="text-white/70">Visualisasi distribusi UMKM berdasarkan lokasi geografis</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="animate-spin text-white/60" size={32} />
          </div>
        ) : (
          <>
            {/* Total UMKM Card */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
              <p className="text-white/70 text-sm">Total UMKM Terdata</p>
              <p className="text-4xl font-bold text-white mt-2">{totalUmkms}</p>
              <p className="text-blue-400 text-sm mt-2">📍 Tersebar di {clusters.length} kota</p>
            </div>

            {/* Legend */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
              <h3 className="font-semibold text-white mb-4">Legenda Intensitas</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-red-500 rounded-lg"></div>
                  <span className="text-white/70 text-sm">Sangat Panas ({'>'}75%)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-yellow-500 rounded-lg"></div>
                  <span className="text-white/70 text-sm">Hangat (50-75%)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-lg"></div>
                  <span className="text-white/70 text-sm">Sejuk (25-50%)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-cyan-500 rounded-lg"></div>
                  <span className="text-white/70 text-sm">Dingin ({"<"}25%)</span>
                </div>
              </div>
            </div>

            {/* Heatmap Grid */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <MapPin size={24} className="text-blue-400" />
                Intensitas per Kota
              </h2>

              {clusters.length === 0 ? (
                <p className="text-white/60 text-center py-8">Belum ada data heatmap</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {clusters.map((item, idx) => {
                    const heat = getHeatColor(item.count, maxCount);
                    return (
                      <div key={idx} className="relative overflow-hidden rounded-2xl p-4 bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                        {/* Background heat indicator */}
                        <div className={`absolute inset-0 opacity-20 ${heat.bg}`}></div>
                        
                        {/* Content */}
                        <div className="relative z-10">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-white">{item.city}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${heat.bg}`}>
                              {heat.status}
                            </span>
                          </div>
                          <p className="text-white/70 text-sm mb-2">{item.count} UMKM</p>
                          <p className="text-white/60 text-xs">📍 {item.lat.toFixed(4)}, {item.lng.toFixed(4)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Regional Statistics */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Statistik Kota</h2>
              {clusters.length === 0 ? (
                <p className="text-white/60 text-center py-8">Belum ada data statistik</p>
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

