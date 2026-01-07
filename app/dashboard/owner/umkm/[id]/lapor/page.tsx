'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Plus, TrendingUp, AlertCircle } from 'lucide-react';
import { FinancialForm } from './components/FinancialForm';
import { FinancialChart } from './components/FinancialChart';
import { FinancialTable } from './components/FinancialTable';

interface FinancialLog {
    umkm_id: string;
    bulan: number;
    tahun: number;
    omzet: number;
    pengeluaran: number;
    laba: number;
    tanggal_input: Date;
    is_flagged?: boolean;
    flag_reason?: string;
}

export default function LaporPage() {
    const params = useParams();
    const umkmId = params.id as string;
    
    const [showForm, setShowForm] = useState(false);
    const [logs, setLogs] = useState<FinancialLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    // Fetch financial logs
    const fetchLogs = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`/api/analytics/financial/${umkmId}?tahun=${selectedYear}`);
            
            if (!response.ok) {
                throw new Error('Gagal memuat data keuangan');
            }
            
            const data = await response.json();
            setLogs(data.logs || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Gagal memuat data');
            setLogs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [umkmId, selectedYear]);

    const handleFormSubmit = async (formData: any) => {
        try {
            const response = await fetch(`/api/analytics/financial/${umkmId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to save financial log');
            }

            // Refresh the list
            await fetchLogs();
            setShowForm(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save');
        }
    };

    // Get available years for dropdown
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Laporan Keuangan</h1>
                    <p className="text-gray-600 mt-1">Kelola dan pantau data keuangan UMKM Anda</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20} />
                    Tambah Laporan
                </button>
            </div>

            {/* Form Section */}
            {showForm && (
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4">Tambah Data Keuangan Baru</h2>
                    <FinancialForm 
                        umkmId={umkmId}
                        onSubmit={handleFormSubmit}
                        onCancel={() => setShowForm(false)}
                    />
                </div>
            )}

            {/* Error Alert */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-gap-3">
                    <AlertCircle className="text-red-600" size={20} />
                    <p className="text-red-800">{error}</p>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatsCard
                    label="Total Omzet (Tahun Ini)"
                    value={`Rp ${logs.reduce((sum, log) => sum + log.omzet, 0).toLocaleString('id-ID')}`}
                    icon={<TrendingUp className="text-blue-600" size={24} />}
                />
                <StatsCard
                    label="Total Pengeluaran"
                    value={`Rp ${logs.reduce((sum, log) => sum + log.pengeluaran, 0).toLocaleString('id-ID')}`}
                    icon={<AlertCircle className="text-red-600" size={24} />}
                />
                <StatsCard
                    label="Total Laba"
                    value={`Rp ${logs.reduce((sum, log) => sum + log.laba, 0).toLocaleString('id-ID')}`}
                    icon={<TrendingUp className="text-green-600" size={24} />}
                />
            </div>

            {/* Year Selector */}
            <div className="flex items-center gap-2">
                <label className="text-gray-700 font-medium">Tahun:</label>
                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>

            {/* Chart Section */}
            {logs.length > 0 && (
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4">Grafik Pertumbuhan</h2>
                    <FinancialChart logs={logs} />
                </div>
            )}

            {/* Table Section */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold">Riwayat Laporan</h2>
                </div>
                {loading ? (
                    <div className="p-6 text-center text-gray-500">
                        Memuat data...
                    </div>
                ) : logs.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                        Belum ada data keuangan. Mulai dengan menambah laporan baru.
                    </div>
                ) : (
                    <FinancialTable logs={logs} />
                )}
            </div>
        </div>
    );
}

interface StatsCardProps {
    label: string;
    value: string;
    icon: React.ReactNode;
}

function StatsCard({ label, value, icon }: StatsCardProps) {
    return (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-gray-600 text-sm font-medium">{label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
                </div>
                {icon}
            </div>
        </div>
    );
}
