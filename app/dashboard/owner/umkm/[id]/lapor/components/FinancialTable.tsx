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

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Periode
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Omzet
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Pengeluaran
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Laba
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Margin
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Tanggal Input
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {sortedLogs.map((log) => {
                        const margin = log.omzet > 0 ? ((log.laba / log.omzet) * 100).toFixed(1) : '0';
                        const tanggalInput = log.tanggal_input 
                            ? new Date(log.tanggal_input).toLocaleDateString('id-ID')
                            : '-';

                        return (
                            <tr key={`${log.tahun}-${log.bulan}`} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {MONTH_NAMES[log.bulan - 1]} {log.tahun}
                                        </p>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <p className="font-medium text-blue-600">
                                        {formatCurrency(log.omzet)}
                                    </p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <p className="text-red-600">
                                        {formatCurrency(log.pengeluaran)}
                                    </p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <p className={log.laba >= 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                                        {formatCurrency(log.laba)}
                                    </p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${parseFloat(margin) >= 20 ? 'bg-green-500' : parseFloat(margin) >= 10 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                style={{ width: `${Math.min(parseFloat(margin), 100)}%` }}
                                            />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700 w-10">
                                            {margin}%
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {tanggalInput}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
