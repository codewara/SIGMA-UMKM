'use client';

import { MapPin } from 'lucide-react';

export default function PejabatHeatmapAnalytics() {
  const regionData = [
    { region: 'Kota A', umkm: 34, growth: '+18.5%', status: 'Hot', color: 'bg-red-500' },
    { region: 'Kota B', umkm: 28, growth: '+12.3%', status: 'Warm', color: 'bg-yellow-500' },
    { region: 'Kota C', umkm: 22, growth: '+8.7%', status: 'Warm', color: 'bg-yellow-500' },
    { region: 'Kota D', umkm: 18, growth: '+5.2%', status: 'Cool', color: 'bg-blue-500' },
    { region: 'Kota E', umkm: 12, growth: '+3.1%', status: 'Cool', color: 'bg-blue-500' },
    { region: 'Kota F', umkm: 9, growth: '+1.8%', status: 'Cold', color: 'bg-cyan-500' },
  ];

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Heatmap Regional Anda</h1>
          <p className="text-white/70">Visualisasi konsentrasi UMKM dan pertumbuhan per sub-wilayah</p>
        </div>

        {/* Legend */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
          <h3 className="font-semibold text-white mb-4">Legenda Intensitas</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-red-500 rounded-lg"></div>
              <span className="text-white/70 text-sm">Hot (Sangat Panas)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-yellow-500 rounded-lg"></div>
              <span className="text-white/70 text-sm">Warm (Hangat)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-blue-500 rounded-lg"></div>
              <span className="text-white/70 text-sm">Cool (Sejuk)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-cyan-500 rounded-lg"></div>
              <span className="text-white/70 text-sm">Cold (Dingin)</span>
            </div>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <MapPin size={24} className="text-blue-400" />
            Intensitas per Sub-Wilayah
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regionData.map((item, idx) => (
              <div key={idx} className="relative overflow-hidden rounded-2xl p-4 bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                {/* Background heat indicator */}
                <div className={`absolute inset-0 opacity-20 ${item.color}`}></div>
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-white">{item.region}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${item.color}`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-white/70 text-sm mb-2">{item.umkm} UMKM</p>
                  <p className="text-green-400 font-semibold">{item.growth}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Statistics */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Statistik Sub-Wilayah</h2>
          <div className="space-y-3">
            {regionData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
                <div className={`w-3 h-12 rounded-full ${item.color}`}></div>
                <div className="flex-1">
                  <p className="font-semibold text-white">{item.region}</p>
                  <p className="text-white/60 text-sm">{item.umkm} UMKM · Growth {item.growth}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
  );
}

