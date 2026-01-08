'use client';

import { TrendingUp, AlertCircle, Zap, ArrowUp, ArrowDown, Loader } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatCurrency } from '@/lib/formatter';

interface Prediction {
  nama_usaha: string;
  sektor: string;
  current_avg_omzet: number;
  forecast: Array<{
    month: number;
    predicted_omzet: number;
    confidence: number;
  }>;
}

export default function OwnerForecastAnalytics() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchForecastData();
  }, []);

  const fetchForecastData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics/forecast?scope=own');
      if (response.ok) {
        const data = await response.json();
        setPredictions(data.data?.predictions || []);
      }
    } catch (error) {
      console.error('Failed to fetch forecast data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateGrowth = (current: number, forecasted: number) => {
    if (current === 0) return 0;
    return (((forecasted - current) / current) * 100);
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Forecast Bisnis Saya</h1>
        <p className="text-white/70">Prediksi pendapatan 3 bulan ke depan</p>
      </div>

      {/* Info Banner */}
      <div className="bg-white/10 backdrop-blur-xl border border-blue-500/30 rounded-3xl p-6 flex items-start gap-4">
        <Zap className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
        <div>
          <h3 className="font-semibold text-white">Prediksi Berbasis Tren Historis</h3>
          <p className="text-white/70 text-sm mt-1">
            Forecast ini berbasis data keuangan Anda dengan analisis tren 12 bulan terakhir.
          </p>
        </div>
      </div>

      {/* Forecast Information */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp size={24} className="text-blue-400" />
          Prediksi Pendapatan
        </h2>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="animate-spin text-white/60" size={32} />
          </div>
        ) : predictions.length === 0 ? (
          <div className="text-white/60 text-center py-8 space-y-4">
            <AlertCircle className="mx-auto" size={40} />
            <p>Belum ada data forecast yang tersedia</p>
            <p className="text-sm">Mulai dengan:</p>
            <ol className="text-left space-y-2 inline-block">
              <li>1. Daftarkan UMKM Anda</li>
              <li>2. Input laporan keuangan bulanan</li>
              <li>3. Tunggu 2 bulan untuk forecast</li>
            </ol>
          </div>
        ) : (
          <div className="space-y-4">
            {predictions.slice(0, 5).map((item, idx) => {
              const forecastArray = Array.isArray(item.forecast) ? item.forecast : [];
              const latestForecast = forecastArray.length > 0 ? forecastArray[forecastArray.length - 1] : undefined;
              const growth = calculateGrowth(item.current_avg_omzet, latestForecast?.predicted_omzet || 0);
              
              return (
                <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-white/20 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-white">{item.nama_usaha}</h3>
                      <p className="text-white/60 text-sm">{item.sektor}</p>
                    </div>
                    {growth >= 0 ? (
                      <ArrowUp className="text-green-400" size={20} />
                    ) : (
                      <ArrowDown className="text-red-400" size={20} />
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-sm mb-3">
                    <div>
                      <p className="text-white/60 text-xs">Saat Ini</p>
                      <p className="text-white font-semibold">{formatCurrency(item.current_avg_omzet)}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-xs">Forecast</p>
                      <p className="text-white font-semibold">{latestForecast ? formatCurrency(latestForecast.predicted_omzet) : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-xs">Growth</p>
                      <p className={`font-semibold ${growth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  {/* Mini Monthly Forecast */}
                  <div className="border-t border-white/10 pt-2">
                    <p className="text-white/60 text-xs mb-2">Prediksi 3 Bulan</p>
                    <div className="grid grid-cols-3 gap-2">
                      {forecastArray.map((pred, fIdx) => (
                        <div key={fIdx} className="bg-white/5 rounded p-2 text-center">
                          <p className="text-white/60 text-xs">+{pred.month}bln</p>
                          <p className="text-white text-xs font-semibold">{formatCurrency(pred.predicted_omzet)}</p>
                          <p className="text-blue-400 text-xs">{(pred.confidence * 100).toFixed(0)}%</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

