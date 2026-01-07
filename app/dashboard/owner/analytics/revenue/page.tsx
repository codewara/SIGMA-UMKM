'use client';

import { DollarSign } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function OwnerRevenueAnalytics() {
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics/revenue?scope=own');
      if (response.ok) {
        const data = await response.json();
        setRevenueData(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch revenue data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Revenue Bisnis Saya</h1>
          <p className="text-white/70">Pantau omzet dan pendapatan UMKM Anda</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
            <p className="text-white/70 text-sm">Total Revenue</p>
            <p className="text-3xl font-bold text-white mt-2">-</p>
            <p className="text-green-400 text-sm mt-2">Menunggu data</p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
            <p className="text-white/70 text-sm">Revenue Bulan Ini</p>
            <p className="text-3xl font-bold text-white mt-2">-</p>
            <p className="text-blue-400 text-sm mt-2">Data belum tersedia</p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
            <p className="text-white/70 text-sm">Rata-rata per UMKM</p>
            <p className="text-3xl font-bold text-white mt-2">-</p>
            <p className="text-blue-400 text-sm mt-2">Input laporan untuk melihat</p>
          </div>
        </div>

        {/* Revenue Table */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <DollarSign size={24} className="text-green-400" />
            Laporan Revenue Anda
          </h2>
          <div className="text-white/60 text-center py-8">
            Laporan akan ditampilkan setelah Anda input data keuangan di halaman Laporan Keuangan.
          </div>
        </div>
      </div>
  );
}

