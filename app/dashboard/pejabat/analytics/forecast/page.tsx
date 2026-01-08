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

export default function PejabatForecastAnalytics() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchForecastData();
  }, []);

  const fetchForecastData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics/forecast?scope=region');
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
          <h1 className="text-3xl font-bold text-white mb-2">Forecast Wilayah Anda</h1>
          <p className="text-white/70">Prediksi pendapatan UMKM 3 bulan ke depan</p>
        </div>

        {/* Info Banner */}
        <div className="bg-white/10 backdrop-blur-xl border border-blue-500/30 rounded-3xl p-6 flex items-start gap-4">
          <Zap className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-white">Prediksi Berbasis Tren Historis</h3>
            <p className="text-white/70 text-sm mt-1">Forecast ini berbasis data historis 12 bulan terakhir untuk UMKM di wilayah Anda.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="animate-spin text-white/60" size={32} />
          </div>
        ) : predictions.length === 0 ? (
          <p className="text-white/60 text-center py-8">Belum ada data forecast</p>
        ) : (
          <div className="space-y-4">
            {predictions.slice(0, 10).map((item, idx) => {
              const latestForecast = item.forecast[item.forecast.length - 1];
              const growth = calculateGrowth(item.current_avg_omzet, latestForecast?.predicted_omzet || 0);
              
              return (
                <div key={idx} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 hover:bg-white/20 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{item.nama_usaha}</h3>
                      <p className="text-white/60 text-sm mt-1">{item.sektor}</p>
                    </div>
                    {growth >= 0 ? (
                      <ArrowUp className="text-green-400" size={24} />
                    ) : (
                      <ArrowDown className="text-red-400" size={24} />
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-white/60 text-xs">Rata-rata Saat Ini</p>
                      <p className="text-white font-semibold">{formatCurrency(item.current_avg_omzet)}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-xs">Forecast Bulan 3</p>
                      <p className="text-white font-semibold">{latestForecast ? formatCurrency(latestForecast.predicted_omzet) : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-xs">Growth Rate</p>
                      <p className={`font-semibold ${growth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-white/60 text-xs">Confidence</p>
                      <p className="text-blue-400 font-semibold">{latestForecast ? `${(latestForecast.confidence * 100).toFixed(0)}%` : 'N/A'}</p>
                    </div>
                  </div>

                  {/* Forecast Breakdown */}
                  <div className="border-t border-white/10 pt-4">
                    <p className="text-white/70 text-sm font-semibold mb-3">Prediksi Bulanan:</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {item.forecast.map((pred, fIdx) => (
                        <div key={fIdx} className="bg-white/5 rounded-lg p-3">
                          <p className="text-white/60 text-xs">Bulan +{pred.month}</p>
                          <p className="text-white font-semibold">{formatCurrency(pred.predicted_omzet)}</p>
                          <p className="text-blue-300 text-xs mt-1">Confidence: {(pred.confidence * 100).toFixed(0)}%</p>
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
  );
}

