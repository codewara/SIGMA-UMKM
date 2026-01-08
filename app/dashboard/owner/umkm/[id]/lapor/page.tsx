'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Plus, TrendingUp, AlertCircle, Loader, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/formatter';
import { FinancialForm } from './components/FinancialForm';
import { FinancialChart } from './components/FinancialChart';
import { FinancialTable } from './components/FinancialTable';

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

interface StatsCardProps {
    label: string;
    value: string;
    icon: React.ReactNode;
}

function StatsCard({ label, value, icon }: StatsCardProps) {
    return (
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
            <div className="flex items-center justify-between mb-3">
                <span className="text-white/70 text-sm font-medium">{label}</span>
                {icon}
            </div>
            <div className="text-2xl font-bold text-white">{value}</div>
        </div>
    );
}

export default function LaporPage() {
    const params = useParams();
    const umkmId = params.id as string;
    
    const [showForm, setShowForm] = useState(false);
    const [logs, setLogs] = useState<FinancialLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [umkmName, setUmkmName] = useState('UMKM');

    // Fetch UMKM details and financial logs
    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch UMKM details
            const umkmRes = await fetch(`/api/umkm/${umkmId}`);
            if (umkmRes.ok) {
                const umkmData = await umkmRes.json();
                setUmkmName(umkmData.data?.nama_usaha || 'UMKM');
            }

            // Fetch financial logs
            const response = await fetch(`/api/financial-log?umkm_id=${umkmId}&tahun=${selectedYear}`);
            
            if (!response.ok) {
                throw new Error('Gagal memuat data keuangan');
            }
            
            const data = await response.json();
            // Handle both possible response structures
            const logsData = data.logs || data.data || [];
            // Ensure all omzet values are numbers
            const typedLogs = Array.isArray(logsData) ? logsData.map((log: any) => ({
                ...log,
                omzet: typeof log.omzet === 'number' ? log.omzet : parseInt(log.omzet) || 0,
                jumlah_karyawan: typeof log.jumlah_karyawan === 'number' ? log.jumlah_karyawan : parseInt(log.jumlah_karyawan) || 0
            })) : [];
            setLogs(typedLogs);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Gagal memuat data');
            setLogs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [umkmId, selectedYear]);

    const handleFormSubmit = async (formData: any) => {
        try {
            // Refresh the list
            await fetchData();
            setShowForm(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Gagal menyimpan');
        }
    };

    // Get available years for dropdown
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

    const totalOmzet = logs.reduce((sum, log) => sum + (log.omzet || 0), 0);
    const avgKaryawan = logs.length > 0 ? Math.round(logs.reduce((sum, log) => sum + (log.jumlah_karyawan || 0), 0) / logs.length) : 0;

    return (
        <div className="min-h-screen bg-[#0f172a] p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Back Button */}
                <Link href={`/dashboard/owner/umkm/${umkmId}`}>
                    <button className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-6 transition-colors">
                        <ArrowLeft size={20} />
                        <span>Kembali</span>
                    </button>
                </Link>

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">📊 Laporan Keuangan</h1>
                        <p className="text-white/60">Kelola dan pantau data keuangan {umkmName}</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 active:scale-95"
                    >
                        <Plus size={20} />
                        Tambah Laporan
                    </button>
                </div>

                {/* Form Section */}
                {showForm && (
                    <FinancialForm 
                        umkmId={umkmId}
                        onSubmit={handleFormSubmit}
                        onCancel={() => setShowForm(false)}
                    />
                )}

                {/* Error Alert */}
                {error && (
                    <div className="bg-red-500/20 border border-red-400/50 rounded-2xl p-4 flex items-center gap-3 mb-8">
                        <AlertCircle className="text-red-400 flex-shrink-0" size={20} />
                        <p className="text-red-200">{error}</p>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatsCard
                        label="Total Omzet (Tahun Ini)"
                        value={formatCurrency(totalOmzet)}
                        icon={<TrendingUp className="text-cyan-400" size={24} />}
                    />
                    <StatsCard
                        label="Rata-rata Karyawan"
                        value={`${avgKaryawan} Orang`}
                        icon={<AlertCircle className="text-purple-400" size={24} />}
                    />
                    <StatsCard
                        label="Total Laporan"
                        value={`${logs.length} Bulan`}
                        icon={<TrendingUp className="text-green-400" size={24} />}
                    />
                </div>

                {/* Year Selector */}
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8 flex items-center justify-between">
                    <label className="text-white font-semibold flex items-center gap-2">
                        Tahun:
                    </label>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 transition-all cursor-pointer"
                    >
                        {years.map(year => (
                            <option key={year} value={year} className="bg-slate-900">{year}</option>
                        ))}
                    </select>
                </div>

                {/* Chart Section */}
                {logs.length > 0 && (
                    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-8">
                        <h2 className="text-2xl font-bold text-white mb-6">📈 Grafik Pertumbuhan</h2>
                        <FinancialChart logs={logs} />
                    </div>
                )}

                {/* Table Section */}
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                    <div className="p-8 border-b border-white/10">
                        <h2 className="text-2xl font-bold text-white">📋 Riwayat Laporan</h2>
                    </div>
                    {loading ? (
                        <div className="p-12 text-center">
                            <Loader className="animate-spin mx-auto mb-4 text-cyan-400" size={32} />
                            <p className="text-white/60">Memuat data...</p>
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="p-12 text-center">
                            <AlertCircle className="mx-auto mb-4 text-white/40" size={40} />
                            <p className="text-white/60">Belum ada data keuangan. Mulai dengan menambah laporan baru.</p>
                        </div>
                    ) : (
                        <FinancialTable logs={logs} />
                    )}
                </div>
            </div>
        </div>
    );
}
