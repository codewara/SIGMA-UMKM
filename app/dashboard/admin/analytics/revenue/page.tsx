'use client';

import { DollarSign, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AdminRevenueAnalytics() {
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics/revenue?scope=global');
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

  const monthlyData = [
    { month: 'Januari', revenue: 2400, growth: '+8.5%' },
    { month: 'Februari', revenue: 2600, growth: '+8.3%' },
    { month: 'Maret', revenue: 2900, growth: '+11.5%' },
    { month: 'April', revenue: 3100, growth: '+6.9%' },
    { month: 'Mei', revenue: 2950, growth: '-4.8%' },
    { month: 'Juni', revenue: 3400, growth: '+15.3%' },
  ];

  const bySektor = [
    { sector: 'Kuliner', revenue: 1240, umkm: 42, avgRevenue: 29.5 },
    { sector: 'Fashion', revenue: 890, umkm: 28, avgRevenue: 31.8 },
    { sector: 'Kriya', revenue: 540, umkm: 18, avgRevenue: 30.0 },
    { sector: 'Jasa', revenue: 420, umkm: 22, avgRevenue: 19.1 },
    { sector: 'Lainnya', revenue: 310, umkm: 13, avgRevenue: 23.8 },
  ];

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Analisis Revenue</h1>
          <p className="text-white/70">Pantau omzet keseluruhan dan per sektor</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 hover:bg-white/20 transition-all">
            <p className="text-white/70 text-sm">Total Revenue (6 Bulan)</p>
            <p className="text-3xl font-bold text-white mt-2">Rp 15.4T</p>
            <p className="text-green-400 text-sm mt-2">↑ Rata-rata +9.1%</p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 hover:bg-white/20 transition-all">
            <p className="text-white/70 text-sm">Revenue Bulan Ini</p>
            <p className="text-3xl font-bold text-white mt-2">Rp 3.4T</p>
            <p className="text-green-400 text-sm mt-2">↑ +15.3% vs Mei</p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 hover:bg-white/20 transition-all">
            <p className="text-white/70 text-sm">Rata-rata per UMKM</p>
            <p className="text-3xl font-bold text-white mt-2">Rp 27.8M</p>
            <p className="text-blue-400 text-sm mt-2">↑ Konsisten tumbuh</p>
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Trend Revenue Bulanan</h2>
          <div className="space-y-3">
            {monthlyData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
                <div>
                  <p className="font-semibold text-white">{item.month}</p>
                  <p className="text-white/60 text-sm">Rp {item.revenue}M</p>
                </div>
                <p className={`font-semibold ${item.growth.includes('-') ? 'text-red-400' : 'text-green-400'}`}>
                  {item.growth}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* By Sector */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <DollarSign size={24} className="text-green-400" />
            Revenue per Sektor
          </h2>
          <div className="space-y-3">
            {bySektor.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
                <div className="flex-1">
                  <p className="font-semibold text-white">{item.sector}</p>
                  <p className="text-white/60 text-sm">{item.umkm} UMKM · Avg: Rp {item.avgRevenue}M</p>
                </div>
                <div className="text-right">
                  <p className="text-blue-400 font-semibold">Rp {item.revenue}M</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
  );
}

