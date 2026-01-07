'use client';

interface FinancialLog {
    umkm_id: string;
    bulan: number;
    tahun: number;
    omzet: number;
    pengeluaran: number;
    laba: number;
    tanggal_input?: Date;
}

interface FinancialChartProps {
    logs: FinancialLog[];
}

const MONTH_NAMES = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export function FinancialChart({ logs }: FinancialChartProps) {
    if (logs.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                Tidak ada data untuk ditampilkan
            </div>
        );
    }

    // Sort logs by month
    const sortedLogs = [...logs].sort((a, b) => a.bulan - b.bulan);

    // Find max value for scaling
    const maxValue = Math.max(...sortedLogs.flatMap(log => [log.omzet, log.pengeluaran, log.laba]));
    const scale = maxValue > 0 ? 100 / maxValue : 100;

    return (
        <div className="space-y-8">
            {/* Chart 1: Omzet vs Pengeluaran vs Laba */}
            <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Perbandingan Omzet, Pengeluaran & Laba</h3>
                <div className="space-y-4">
                    {sortedLogs.map((log) => (
                        <div key={`${log.bulan}-${log.tahun}`}>
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium text-gray-600">
                                    {MONTH_NAMES[log.bulan - 1]}
                                </span>
                                <div className="flex gap-4 text-xs">
                                    <span className="text-blue-600 font-medium">
                                        Rp {(log.omzet / 1000000).toFixed(1)}M
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2 h-6 bg-gray-100 rounded overflow-hidden">
                                <div
                                    className="bg-blue-500 transition-all"
                                    style={{ width: `${(log.omzet * scale) / 3}%` }}
                                    title={`Omzet: Rp ${log.omzet.toLocaleString('id-ID')}`}
                                />
                                <div
                                    className="bg-red-500 transition-all"
                                    style={{ width: `${(log.pengeluaran * scale) / 3}%` }}
                                    title={`Pengeluaran: Rp ${log.pengeluaran.toLocaleString('id-ID')}`}
                                />
                                <div
                                    className="bg-green-500 transition-all"
                                    style={{ width: `${(log.laba * scale) / 3}%` }}
                                    title={`Laba: Rp ${log.laba.toLocaleString('id-ID')}`}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="flex gap-6 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="text-gray-600">Omzet</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span className="text-gray-600">Pengeluaran</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-gray-600">Laba</span>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1">Total Omzet</p>
                    <p className="text-lg font-bold text-blue-600">
                        Rp {(sortedLogs.reduce((sum, log) => sum + log.omzet, 0) / 1000000).toFixed(1)}M
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1">Total Pengeluaran</p>
                    <p className="text-lg font-bold text-red-600">
                        Rp {(sortedLogs.reduce((sum, log) => sum + log.pengeluaran, 0) / 1000000).toFixed(1)}M
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1">Total Laba</p>
                    <p className="text-lg font-bold text-green-600">
                        Rp {(sortedLogs.reduce((sum, log) => sum + log.laba, 0) / 1000000).toFixed(1)}M
                    </p>
                </div>
            </div>
        </div>
    );
}
