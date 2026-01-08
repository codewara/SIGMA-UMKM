'use client';

import { formatCurrency } from '@/lib/formatter';

interface FinancialLog {
    umkm_id: string;
    bulan: number;
    tahun: number;
    omzet: number;
    jumlah_karyawan: number;
    catatan?: string;
    tanggal_input?: Date;
    is_flagged?: boolean;
}

interface FinancialChartProps {
    logs: FinancialLog[];
}

const MONTH_NAMES = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
];

export function FinancialChart({ logs }: FinancialChartProps) {
    if (logs.length === 0) {
        return (
            <div className="text-center py-8 text-white/60">
                Tidak ada data untuk ditampilkan
            </div>
        );
    }

    // Sort logs by month
    const sortedLogs = [...logs].sort((a, b) => a.bulan - b.bulan);

    // Find max value for scaling
    const maxOmzet = Math.max(...sortedLogs.map(log => log.omzet), 1);
    const maxKaryawan = Math.max(...sortedLogs.map(log => log.jumlah_karyawan), 1);

    return (
        <div className="space-y-8">
            {/* Chart 1: Omzet Trend */}
            <div>
                <h3 className="text-sm font-semibold text-white/80 mb-4">📊 Tren Omzet Bulanan</h3>
                <div className="space-y-3">
                    {sortedLogs.map((log) => (
                        <div key={`${log.bulan}-${log.tahun}`}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-white/70">
                                    {MONTH_NAMES[log.bulan - 1]} {log.tahun}
                                </span>
                                <span className="text-xs font-bold text-cyan-300">
                                    {formatCurrency(log.omzet)}
                                </span>
                            </div>
                            <div className="relative h-8 bg-white/10 rounded-lg overflow-hidden border border-white/10">
                                <div
                                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-blue-500 transition-all"
                                    style={{ width: `${(log.omzet / maxOmzet) * 100}%` }}
                                    title={`Omzet: Rp ${log.omzet.toLocaleString('id-ID')}`}
                                />
                                <div className="absolute inset-0 flex items-center px-3">
                                    <span className="text-xs font-medium text-white/60">
                                        {Math.round((log.omzet / maxOmzet) * 100)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chart 2: Jumlah Karyawan Trend */}
            <div>
                <h3 className="text-sm font-semibold text-white/80 mb-4">👥 Tren Jumlah Karyawan</h3>
                <div className="space-y-3">
                    {sortedLogs.map((log) => (
                        <div key={`emp-${log.bulan}-${log.tahun}`}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-white/70">
                                    {MONTH_NAMES[log.bulan - 1]} {log.tahun}
                                </span>
                                <span className="text-xs font-bold text-purple-300">
                                    {log.jumlah_karyawan} Orang
                                </span>
                            </div>
                            <div className="relative h-8 bg-white/10 rounded-lg overflow-hidden border border-white/10">
                                <div
                                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                                    style={{ width: `${(log.jumlah_karyawan / maxKaryawan) * 100}%` }}
                                    title={`Karyawan: ${log.jumlah_karyawan}`}
                                />
                                <div className="absolute inset-0 flex items-center px-3">
                                    <span className="text-xs font-medium text-white/60">
                                        {Math.round((log.jumlah_karyawan / maxKaryawan) * 100)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="flex gap-6 text-xs border-t border-white/10 pt-4">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded"></div>
                    <span className="text-white/70">Omzet (Rp)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></div>
                    <span className="text-white/70">Jumlah Karyawan</span>
                </div>
            </div>
        </div>
    );
}
