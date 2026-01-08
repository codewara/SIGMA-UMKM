'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AlertCircle, Flag, Loader, ArrowLeft, CheckCircle, X } from 'lucide-react';
import Link from 'next/link';
import { formatCurrencyFull } from '@/lib/formatter';

interface UMKM {
    _id: string;
    nama_usaha: string;
    sektor: string;
    pemilik: {
        nama: string;
        telepon?: string;
        email?: string;
    };
    wilayah: {
        kota: string;
        provinsi?: string;
        alamat_lengkap?: string;
    };
    legalitas: {
        status_verifikasi?: string;
        nib?: string;
        pirt?: string;
        halal?: boolean;
    };
}

interface FinancialLog {
    bulan: number;
    tahun: number;
    omzet: number;
    jumlah_karyawan: number;
    catatan?: string;
    tanggal_input?: Date;
    is_flagged: boolean;
    flag_reason?: string;
}

const MONTH_NAMES = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export default function DetailUMKMPage() {
    const params = useParams();
    const umkmId = params.id as string;
    
    const [umkm, setUmkm] = useState<UMKM | null>(null);
    const [logs, setLogs] = useState<FinancialLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [flagging, setFlagging] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [flagReason, setFlagReason] = useState('');
    const [showFlagForm, setShowFlagForm] = useState<string | null>(null);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        fetchUMKMData();
    }, [umkmId]);

    useEffect(() => {
        fetchFinancialLogs();
    }, [umkmId, selectedYear]);

    const fetchUMKMData = async () => {
        try {
            const response = await fetch(`/api/umkm/${umkmId}`);
            if (response.ok) {
                const data = await response.json();
                setUmkm(data.data);
            }
        } catch (err) {
            setError('Gagal memuat data UMKM');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchFinancialLogs = async () => {
        try {
            const response = await fetch(`/api/financial-log?umkm_id=${umkmId}&tahun=${selectedYear}`);
            if (response.ok) {
                const data = await response.json();
                // Handle both possible response structures and ensure proper typing
                const logsData = data.logs || data.data || [];
                const typedLogs = Array.isArray(logsData) ? logsData.map((log: any) => ({
                    ...log,
                    omzet: typeof log.omzet === 'number' ? log.omzet : parseInt(log.omzet) || 0,
                    jumlah_karyawan: typeof log.jumlah_karyawan === 'number' ? log.jumlah_karyawan : parseInt(log.jumlah_karyawan) || 0,
                    is_flagged: log.is_flagged || false,
                    flag_reason: log.flag_reason || undefined
                })) : [];
                setLogs(typedLogs);
            }
        } catch (err) {
            console.error('Failed to fetch financial logs:', err);
            setError('Gagal memuat data keuangan');
        }
    };

    const handleFlag = async (bulan: number) => {
        if (!flagReason.trim()) {
            alert('Masukkan alasan penandaan');
            return;
        }

        const logKey = `${selectedYear}-${bulan}`;
        setFlagging(logKey);
        try {
            const response = await fetch(`/api/financial-log`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    umkm_id: umkmId,
                    tahun: selectedYear,
                    bulan,
                    is_flagged: true,
                    flag_reason: flagReason
                })
            });

            if (response.ok) {
                setShowFlagForm(null);
                setFlagReason('');
                await fetchFinancialLogs();
            } else {
                setError('Gagal menandai laporan');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Gagal menandai laporan');
        } finally {
            setFlagging(null);
        }
    };

    const handleUnflag = async (bulan: number) => {
        const logKey = `${selectedYear}-${bulan}`;
        setFlagging(logKey);
        try {
            const response = await fetch(`/api/financial-log`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    umkm_id: umkmId,
                    tahun: selectedYear,
                    bulan,
                    is_flagged: false,
                    flag_reason: null
                })
            });

            if (response.ok) {
                await fetchFinancialLogs();
            } else {
                setError('Gagal menghapus penandaan');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Gagal menghapus penandaan');
        } finally {
            setFlagging(null);
        }
    };

    const formatCurrencyDisplay = (value: number) => {
        return formatCurrencyFull(value);
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f172a] p-6 flex items-center justify-center">
                <div className="text-center">
                    <Loader className="animate-spin mx-auto mb-4 text-cyan-400" size={32} />
                    <p className="text-white/60">Memuat data...</p>
                </div>
            </div>
        );
    }

    if (!umkm) {
        return (
            <div className="min-h-screen bg-[#0f172a] p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-red-500/20 border border-red-400/50 rounded-2xl p-6 flex items-center gap-3">
                        <AlertCircle className="text-red-400 flex-shrink-0" size={20} />
                        <p className="text-red-200">UMKM tidak ditemukan</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f172a] p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Back Button */}
                <Link href="/dashboard/pejabat/monitoring">
                    <button className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-6 transition-colors">
                        <ArrowLeft size={20} />
                        <span>Kembali</span>
                    </button>
                </Link>

                {/* Header */}
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">{umkm.nama_usaha}</h1>
                    <p className="text-white/60">Audit Detail & Financial Log Monitoring</p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="bg-red-500/20 border border-red-400/50 rounded-2xl p-6 flex items-center gap-3">
                        <AlertCircle className="text-red-400 flex-shrink-0" size={20} />
                        <p className="text-red-200">{error}</p>
                    </div>
                )}

                {/* UMKM Profile Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Profile Info */}
                    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                        <h2 className="text-lg font-bold text-white mb-6">👥 Profil UMKM</h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-white/60 text-sm">Sektor</p>
                                <p className="text-white font-semibold">{umkm.sektor}</p>
                            </div>
                            <div>
                                <p className="text-white/60 text-sm">Status Verifikasi</p>
                                <p className={`text-sm font-semibold px-3 py-1 rounded-full inline-block ${
                                    umkm.legalitas?.status_verifikasi === 'VERIFIED'
                                        ? 'bg-green-500/30 text-green-300'
                                        : umkm.legalitas?.status_verifikasi === 'PENDING'
                                        ? 'bg-yellow-500/30 text-yellow-300'
                                        : 'bg-red-500/30 text-red-300'
                                }`}>
                                    {umkm.legalitas?.status_verifikasi || 'UNKNOWN'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Pemilik Info */}
                    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                        <h2 className="text-lg font-bold text-white mb-6">👤 Informasi Pemilik</h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-white/60 text-sm">Nama</p>
                                <p className="text-white font-semibold">{umkm.pemilik?.nama || '-'}</p>
                            </div>
                            <div>
                                <p className="text-white/60 text-sm">Telepon</p>
                                <p className="text-white">{umkm.pemilik?.telepon || '-'}</p>
                            </div>
                            <div>
                                <p className="text-white/60 text-sm">Email</p>
                                <p className="text-white break-all">{umkm.pemilik?.email || '-'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Wilayah */}
                    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                        <h2 className="text-lg font-bold text-white mb-6">📍 Lokasi</h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-white/60 text-sm">Kota</p>
                                <p className="text-white font-semibold">{umkm.wilayah?.kota || '-'}</p>
                            </div>
                            <div>
                                <p className="text-white/60 text-sm">Provinsi</p>
                                <p className="text-white">{umkm.wilayah?.provinsi || '-'}</p>
                            </div>
                            <div>
                                <p className="text-white/60 text-sm">Alamat Lengkap</p>
                                <p className="text-white text-sm">{umkm.wilayah?.alamat_lengkap || '-'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Legalitas */}
                    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                        <h2 className="text-lg font-bold text-white mb-6">📋 Legalitas</h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-white/60 text-sm">NIB</p>
                                <p className="text-white">{umkm.legalitas?.nib || '-'}</p>
                            </div>
                            <div>
                                <p className="text-white/60 text-sm">PIRT</p>
                                <p className="text-white">{umkm.legalitas?.pirt || '-'}</p>
                            </div>
                            <div>
                                <p className="text-white/60 text-sm">Halal</p>
                                <p className="text-white">{umkm.legalitas?.halal ? '✓ Ya' : '✗ Tidak'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Financial Audit Log */}
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                    <div className="p-8 border-b border-white/10 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-white">💰 Audit Log Keuangan</h2>
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
                    
                    {logs.length === 0 ? (
                        <div className="p-12 text-center">
                            <AlertCircle className="mx-auto mb-4 text-white/40" size={40} />
                            <p className="text-white/60">Tidak ada data keuangan untuk tahun {selectedYear}</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10 bg-white/5">
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">Periode</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">Omzet</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">Karyawan</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-center text-xs font-semibold text-cyan-300 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {logs.map((log) => {
                                        const logKey = `${selectedYear}-${String(log.bulan).padStart(2, '0')}`;
                                        return (
                                            <tr key={logKey} className="hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <p className="font-semibold text-white">{MONTH_NAMES[log.bulan - 1]} {log.tahun}</p>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <p className="text-cyan-300 font-medium">{formatCurrencyDisplay(log.omzet)}</p>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <p className="text-white/80">{log.jumlah_karyawan} Orang</p>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {log.is_flagged ? (
                                                        <span className="px-3 py-1 bg-red-500/30 text-red-300 rounded-full text-xs font-semibold">
                                                            🚩 Flagged
                                                        </span>
                                                    ) : (
                                                        <span className="px-3 py-1 bg-green-500/30 text-green-300 rounded-full text-xs font-semibold">
                                                            Normal
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {!log.is_flagged ? (
                                                        <button
                                                            onClick={() => setShowFlagForm(logKey)}
                                                            disabled={flagging === logKey}
                                                            className="text-pink-300 hover:text-pink-200 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 hover:bg-pink-500/20 px-3 py-1 rounded-lg"
                                                        >
                                                            {flagging === logKey ? <Loader size={16} className="animate-spin" /> : <Flag size={16} />}
                                                            <span className="text-sm">Flag</span>
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleUnflag(log.bulan)}
                                                            disabled={flagging === logKey}
                                                            className="text-emerald-300 hover:text-emerald-200 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 hover:bg-emerald-500/20 px-3 py-1 rounded-lg"
                                                        >
                                                            {flagging === logKey ? <Loader size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                                                            <span className="text-sm">Unflag</span>
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Flag Form Modal */}
                {showFlagForm && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-2xl p-8 max-w-md w-full">
                            <h3 className="text-xl font-bold text-white mb-4">🚩 Tandai Laporan</h3>
                            <textarea
                                value={flagReason}
                                onChange={(e) => setFlagReason(e.target.value)}
                                placeholder="Masukkan alasan penandaan..."
                                rows={4}
                                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-pink-400/50 focus:ring-1 focus:ring-pink-400/30 transition-all resize-none mb-4"
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowFlagForm(null);
                                        setFlagReason('');
                                    }}
                                    className="flex-1 px-4 py-2 border border-white/20 rounded-xl text-white hover:bg-white/10 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={() => {
                                        const bulan = parseInt(showFlagForm.split('-')[1]);
                                        handleFlag(bulan);
                                    }}
                                    disabled={flagging !== null}
                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                                >
                                    {flagging ? <Loader size={16} className="animate-spin" /> : <Flag size={16} />}
                                    Tandai
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
