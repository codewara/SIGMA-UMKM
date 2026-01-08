'use client';

import { useEffect, useState } from 'react';
import { Plus, Eye, AlertCircle, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface UMKM {
    _id: string;
    nama_usaha: string;
    sektor: string;
    legalitas?: {
        status_verifikasi?: string;
    };
    summary_terakhir?: {
        omzet_terakhir: number;
        bulan: number;
    };
}

export default function OwnerDashboard() {
    const [umkms, setUmkms] = useState<UMKM[]>([]);
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState<any[]>([]);

    useEffect(() => {
        fetchOwnerUMKMs();
    }, []);

    const fetchOwnerUMKMs = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/umkm');
            if (response.ok) {
                const data = await response.json();
                setUmkms(data.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch UMKMs:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Header */}
            <div className="flex items-center justify-between mb-12">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">Dashboard UMKM Saya</h1>
                    <p className="text-white/70">Kelola semua UMKM Anda di sini</p>
                </div>
                <Link
                    href="/dashboard/owner/umkm/create"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full transition-all duration-300 group hover:scale-105"
                >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                    UMKM Baru
                </Link>
            </div>

            {/* Notifications */}
            {notifications.length > 0 && (
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-4 mb-8">
                    <div className="flex gap-3">
                        <AlertCircle className="text-blue-400 flex-shrink-0" size={20} />
                        <div>
                            <h3 className="font-semibold text-white">Notifikasi</h3>
                            <p className="text-white/70 text-sm">Anda memiliki {notifications.length} notifikasi baru</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatsCard
                    label="Total UMKM"
                    value={umkms.length.toString()}
                    icon={<TrendingUp className="text-blue-400" size={24} />}
                />
                <StatsCard
                    label="Terverifikasi"
                    value={umkms.filter(u => u.verification_status === 'APPROVED').length.toString()}
                    icon={<TrendingUp className="text-green-400" size={24} />}
                />
                <StatsCard
                    label="Menunggu Verifikasi"
                    value={umkms.filter(u => u.verification_status === 'PENDING').length.toString()}
                    icon={<AlertCircle className="text-yellow-400" size={24} />}
                />
            </div>

            {/* UMKM List */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden">
                <div className="p-6 border-b border-white/20">
                    <h2 className="text-xl font-semibold text-white">UMKM Anda</h2>
                </div>
                {loading ? (
                    <div className="p-6 text-center text-white/60">Memuat data...</div>
                ) : umkms.length === 0 ? (
                    <div className="p-6 text-center text-white/60">
                        <p>Anda belum mendaftarkan UMKM apapun.</p>
                        <Link href="/dashboard/owner/umkm/create" className="text-blue-400 hover:text-blue-300 mt-2 inline-block transition-colors">
                            Daftar UMKM Pertama Anda
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-white/20">
                        {umkms.map((umkm) => (
                            <div key={umkm._id} className="p-6 hover:bg-white/5 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-semibold text-white">{umkm.nama_usaha}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                umkm.legalitas?.status_verifikasi === 'VERIFIED' 
                                                    ? 'bg-green-500/30 text-green-300 border border-green-400/50'
                                                    : umkm.legalitas?.status_verifikasi === 'PENDING'
                                                    ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-400/50'
                                                    : 'bg-red-500/30 text-red-300 border border-red-400/50'
                                            }`}>
                                                {umkm.legalitas?.status_verifikasi || 'UNVERIFIED'}
                                            </span>
                                        </div>
                                        <p className="text-white/60 text-sm mt-1">Sektor: {umkm.sektor}</p>
                                        {umkm.summary_terakhir?.omzet_terakhir && (
                                            <p className="text-white/60 text-sm mt-1">
                                                Omzet terakhir: Rp {umkm.summary_terakhir.omzet_terakhir.toLocaleString('id-ID')}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/dashboard/owner/umkm/${umkm._id}`}
                                            className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Eye size={20} />
                                        </Link>
                                        <Link
                                            href={`/dashboard/owner/umkm/${umkm._id}/lapor`}
                                            className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors"
                                            title="Laporan Keuangan"
                                        >
                                            <TrendingUp size={20} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

interface StatsCardProps {
    label: string;
    value: string;
    icon: React.ReactNode;
}

function StatsCard({ label, value, icon }: StatsCardProps) {
    return (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-white/70 text-sm font-medium">{label}</p>
                    <p className="text-3xl font-bold text-white mt-2">{value}</p>
                </div>
                {icon}
            </div>
        </div>
    );
}

