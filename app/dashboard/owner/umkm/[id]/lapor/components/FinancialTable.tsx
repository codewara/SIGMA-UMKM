'use client';

import { formatCurrencyFull } from '@/lib/formatter';

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

interface FinancialTableProps {
    logs: FinancialLog[];
}

const MONTH_NAMES = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export function FinancialTable({ logs }: FinancialTableProps) {
    const sortedLogs = [...logs].sort((a, b) => {
        if (a.tahun !== b.tahun) return b.tahun - a.tahun;
        return b.bulan - a.bulan;
    });

    const formatCurrencyDisplay = (value: number) => {
        return formatCurrencyFull(value);
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-white/20 bg-white/5">
                        <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                            Periode
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                            Omzet
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                            Karyawan
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                            Catatan
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                            Tanggal Input
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                    {sortedLogs.map((log) => {
                        const tanggalInput = log.tanggal_input 
                            ? new Date(log.tanggal_input).toLocaleDateString('id-ID')
                            : '-';

                        return (
                            <tr key={`${log.tahun}-${log.bulan}`} className="hover:bg-white/5 transition-colors border-white/10">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div>
                                        <p className="font-semibold text-white">
                                            {MONTH_NAMES[log.bulan - 1]} {log.tahun}
                                        </p>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <p className="font-medium text-cyan-300">
                                        {formatCurrencyDisplay(log.omzet)}
                                    </p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <p className="text-white/80">
                                        {log.jumlah_karyawan} Orang
                                    </p>
                                </td>
                                <td className="px-6 py-4 max-w-xs">
                                    <p className="text-white/70 text-sm truncate" title={log.catatan}>
                                        {log.catatan || '-'}
                                    </p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <p className="text-white/60 text-sm">
                                        {tanggalInput}
                                    </p>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
