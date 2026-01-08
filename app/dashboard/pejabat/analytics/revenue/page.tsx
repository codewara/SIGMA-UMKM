'use client';

import { DollarSign, TrendingUp, Loader } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatCurrency } from '@/lib/formatter';

const MONTH_NAMES = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

export default function PejabatRevenueAnalytics() {
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [byMonth, setByMonth] = useState<any[]>([]);
  const [bySector, setBySector] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics/revenue?scope=region');
      if (response.ok) {
        const data = await response.json();
        const { totalRevenue: total, byMonth: months, bySector: sectors } = data.data;
        
        setTotalRevenue(total || 0);
        setByMonth(months || []);
        setBySector(sectors || []);
      }
    } catch (error) {
      console.error('Failed to fetch revenue data:', error);
    } finally {
      setLoading(false);
    }
  };

  const monthlyAverage = byMonth.length > 0 ? Math.round(totalRevenue / byMonth.length) : 0;
  const latestMonth = byMonth.length > 0 ? byMonth[0] : null;

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Analisis Revenue Regional</h1>
          <p className="text-white/70">Pantau omzet wilayah Anda dan per sektor</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="animate-spin text-white/60" size={32} />
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 hover:bg-white/20 transition-all">
                <p className="text-white/70 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold text-white mt-2">{formatCurrency(totalRevenue)}</p>
                <p className="text-green-400 text-sm mt-2">✓ {byMonth.length} bulan data</p>
              </div>

              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 hover:bg-white/20 transition-all">
                <p className="text-white/70 text-sm">Revenue Bulan Terbaru</p>
                <p className="text-3xl font-bold text-white mt-2">{latestMonth ? formatCurrency(latestMonth.omzet) : 'N/A'}</p>
                <p className="text-blue-400 text-sm mt-2">📅 {latestMonth ? `${MONTH_NAMES[latestMonth.bulan - 1]} ${latestMonth.tahun}` : 'Belum ada data'}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 hover:bg-white/20 transition-all">
                <p className="text-white/70 text-sm">Rata-rata per Bulan</p>
                <p className="text-3xl font-bold text-white mt-2">{formatCurrency(monthlyAverage)}</p>
                <p className="text-blue-400 text-sm mt-2">📊 Dari {byMonth.length} bulan</p>
              </div>
            </div>

            {/* Monthly Trend */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Trend Revenue Bulanan Wilayah</h2>
              {byMonth.length === 0 ? (
                <p className="text-white/60 text-center py-8">Belum ada data keuangan</p>
              ) : (
                <div className="space-y-3">
                  {byMonth.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
                      <div>
                        <p className="font-semibold text-white">{MONTH_NAMES[item.bulan - 1]} {item.tahun}</p>
                        <p className="text-white/60 text-sm">{formatCurrency(item.omzet)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* By Sector */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <DollarSign size={24} className="text-green-400" />
                Revenue per Sektor
              </h2>
              {bySector.length === 0 ? (
                <p className="text-white/60 text-center py-8">Belum ada data sektor</p>
              ) : (
                <div className="space-y-3">
                  {bySector.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
                      <div className="flex-1">
                        <p className="font-semibold text-white">{item.sektor}</p>
                        <p className="text-white/60 text-sm">Total Omzet</p>
                      </div>
                      <div className="text-right">
                        <p className="text-blue-400 font-semibold">{formatCurrency(item.revenue)}</p>
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

