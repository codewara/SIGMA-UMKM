'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AlertCircle, Flag, Loader, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface UMKM {
    _id: string;
    nama_usaha: string;
    sektor: string;
    verification_status: string;
    pemilik: {
        nama: string;
        nik: string;
        telepon: string;
        email: string;
    };
    wilayah: {
        kota: string;
        provinsi: string;
        alamat_lengkap: string;
    };
    legalitas: {
        nib?: string;
        pirt?: string;
        halal?: boolean;
    };
}

interface FinancialLog {
    bulan: number;
    tahun: number;
    omzet: number;
    pengeluaran: number;
    laba: number;
    is_flagged: boolean;
    flag_reason?: string;
}

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

    useEffect(() => {
        fetchUMKMData();
        fetchFinancialLogs();
    }, [umkmId]);

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
            const response = await fetch(`/api/analytics/financial/${umkmId}`);
            if (response.ok) {
                const data = await response.json();
                setLogs(data.data || []);
            }
        } catch (err) {
            console.error('Failed to fetch financial logs:', err);
        }
    };

    const handleFlag = async (logKey: string) => {
        setFlagging(logKey);
        try {
            const [tahun, bulan] = logKey.split('-');
            const response = await fetch(`/api/analytics/financial/${umkmId}?tahun=${tahun}&bulan=${bulan}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    is_flagged: true,
                    flag_reason: flagReason
                })
            });

            if (response.ok) {
                setShowFlagForm(null);
                setFlagReason('');
                await fetchFinancialLogs();
            } else {
                setError('Gagal menandai data');
            }
        } catch (err) {
            setError('Terjadi kesalahan');
            console.error(err);
        } finally {
            setFlagging(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                    <Loader className="animate-spin" size={32} />
                </div>
        );
    }

    if (!umkm) {
        return (
            <div className="bg-red-500/20 border border-red-400/30 rounded-3xl p-4 flex items-gap-3">
                    <AlertCircle className="text-red-400 flex-shrink-0" size={20} />
                    <p className="text-red-200">UMKM tidak ditemukan</p>
                </div>
        );
    }

    return (
        <div className="space-y-6">
                {/* Header with Back */}
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        href="/dashboard/pejabat/monitoring"
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={24} className="text-white/70" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-white">{umkm.nama_usaha}</h1>
                        <p className="text-white/70">Audit Detail & Financial Log</p>
                    </div>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="bg-red-500/20 border border-red-400/30 rounded-3xl p-4 flex items-gap-3">
                        <AlertCircle className="text-red-400 flex-shrink-0" size={20} />
                        <p className="text-red-200">{error}</p>
                    </div>
                )}

                {/* UMKM Profile */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Informasi UMKM</h2>
                        <div className="space-y-4">
                            <InfoItem label="Sektor" value={umkm.sektor} />
                            <InfoItem label="Status Verifikasi" value={
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    umkm.verification_status === 'APPROVED'
                                        ? 'bg-green-500/30 text-green-300'
                                        : umkm.verification_status === 'PENDING'
                                        ? 'bg-yellow-500/30 text-yellow-300'
                                        : 'bg-red-500/30 text-red-300'
                                }`}>
                                    {umkm.verification_status}
                                </span>
                            } />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Informasi Pemilik</h2>
                        <div className="space-y-4">
                            <InfoItem label="Nama" value={umkm.pemilik.nama} />
                            <InfoItem label="NIK" value={umkm.pemilik.nik} />
                            <InfoItem label="Telepon" value={umkm.pemilik.telepon} />
                            <InfoItem label="Email" value={umkm.pemilik.email} />
                        </div>
                    </div>
                </div>

                {/* Wilayah & Legalitas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Lokasi</h2>
                        <div className="space-y-4">
                            <InfoItem label="Kota" value={umkm.wilayah.kota} />
                            <InfoItem label="Provinsi" value={umkm.wilayah.provinsi} />
                            <InfoItem label="Alamat Lengkap" value={umkm.wilayah.alamat_lengkap} />
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Legalitas</h2>
                        <div className="space-y-4">
                            <InfoItem label="NIB" value={umkm.legalitas.nib || '-'} />
                            <InfoItem label="PIRT" value={umkm.legalitas.pirt || '-'} />
                            <InfoItem label="Halal" value={umkm.legalitas.halal ? 'Ya' : 'Tidak'} />
                        </div>
                    </div>
                </div>

                {/* Financial Audit Log */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden">
                    <div className="p-6 border-b border-white/20">
                        <h2 className="text-xl font-semibold text-white">Audit Log Keuangan</h2>
                    </div>
                    
                    {logs.length === 0 ? (
                        <p className="text-white/60 text-center py-8">Tidak ada data keuangan</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-white/90">
                                <thead>
                                    <tr className="border-b border-white/10 bg-white/5">
                                        <th className="px-4 py-3 text-left text-xs font-medium text-white/70">Periode</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-white/70">Omzet</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-white/70">Pengeluaran</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-white/70">Laba</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-white/70">Status</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-white/70">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {logs.map((log, idx) => {
                                        const logKey = `${log.tahun}-${String(log.bulan).padStart(2, '0')}`;
                                        return (
                                            <tr key={idx} className="hover:bg-white/5 transition-colors">
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    {log.bulan}/{log.tahun}
                                                </td>
                                                <td className="px-4 py-3">
                                                    Rp {log.omzet.toLocaleString('id-ID')}
                                                </td>
                                                <td className="px-4 py-3">
                                                    Rp {log.pengeluaran.toLocaleString('id-ID')}
                                                </td>
                                                <td className="px-4 py-3">
                                                    Rp {log.laba.toLocaleString('id-ID')}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {log.is_flagged ? (
                                                        <span className="px-2 py-1 bg-red-500/30 text-red-300 rounded text-xs font-medium">
                                                            🚩 Flagged
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-1 bg-green-500/30 text-green-300 rounded text-xs font-medium">
                                                            Normal
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {!log.is_flagged && (
                                                        <button
                                                            onClick={() => setShowFlagForm(showFlagForm === logKey ? null : logKey)}
                                                            className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                                                            title="Tandai sebagai mencurigakan"
                                                        >
                                                            <Flag size={18} />
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

                    {/* Flag Form */}
                    {showFlagForm && (
                        <div className="p-6 border-t border-white/10 bg-white/5">
                            <h3 className="font-semibold text-white mb-3">
                                Tandai Data Sebagai Mencurigakan
                            </h3>
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-2">
                                    Alasan Penandaan
                                </label>
                                <textarea
                                    value={flagReason}
                                    onChange={(e) => setFlagReason(e.target.value)}
                                    placeholder="Jelaskan alasan data ini mencurigakan..."
                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-red-400"
                                    rows={3}
                                />
                            </div>
                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={() => setShowFlagForm(null)}
                                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-2xl text-white/70 hover:text-white hover:bg-white/20"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={() => handleFlag(showFlagForm)}
                                    disabled={flagging === showFlagForm}
                                    className="px-4 py-2 bg-red-500 text-white rounded-2xl hover:bg-red-600 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {flagging === showFlagForm && <Loader size={16} className="animate-spin" />}
                                    Tandai
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
    );
}

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div>
            <p className="text-sm font-medium text-white/70">{label}</p>
            <p className="text-white mt-1">{value}</p>
        </div>
    );
}
