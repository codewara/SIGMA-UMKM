'use client';

import { MapPin } from 'lucide-react';

export default function OwnerHeatmapAnalytics() {
  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Peta Kompetitor</h1>
          <p className="text-white/70">Analisis persaingan bisnis Anda di wilayah</p>
        </div>

        {/* Info Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <MapPin size={24} className="text-blue-400" />
            Visualisasi Kompetitor
          </h3>
          <div className="text-white/60 text-center py-12 space-y-4">
            <p>Peta kompetitor akan ditampilkan untuk UMKM Anda</p>
            <p className="text-sm">Fitur ini membantu Anda memahami persaingan di sekitar lokasi bisnis</p>
            <p className="text-sm">Data akan tersedia setelah verifikasi UMKM selesai</p>
          </div>
        </div>

        {/* Competitor Statistics */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Statistik Wilayah</h2>
          <div className="text-white/60 text-center py-8">
            <p>Belum ada data kompetitor untuk ditampilkan</p>
            <p className="text-sm mt-2">Pastikan UMKM Anda telah terverifikasi terlebih dahulu</p>
          </div>
        </div>
      </div>
  );
}

