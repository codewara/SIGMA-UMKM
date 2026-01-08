'use client';

import { useEffect, useState } from 'react';
import { BarChart3, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/formatter';

interface RegionalStats {
    totalUMKM: number;
    pendingVerification: number;
    flaggedRecords: number;
    totalOmzet: number;
}

export default function PejabatDashboard() {
    const [stats, setStats] = useState<RegionalStats>({
        totalUMKM: 0,
        pendingVerification: 0,
        flaggedRecords: 0,
        totalOmzet: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRegionalStats();
    }, []);

    const fetchRegionalStats = async () => {
        try {
            setLoading(true);
            // Fetch available data in parallel
            const [umkmRes, pendingRes] = await Promise.all([
                fetch('/api/umkm'),
                fetch('/api/umkm/pending')
            ]);

            let totalUMKM = 0;
            let pendingVerification = 0;
            let flaggedRecords = 0;
            let totalOmzet = 0;

            if (umkmRes.ok) {
                const umkmData = await umkmRes.json();
                const umkmList = umkmData.data || [];
                totalUMKM = umkmList.length;
                
                // Calculate total omzet from UMKM data
                totalOmzet = umkmList.reduce((sum: number, umkm: any) => {
                    return sum + (umkm.summary_terakhir?.omzet_terakhir || 0);
                }, 0);
            }

            if (pendingRes.ok) {
                const pendingData = await pendingRes.json();
                pendingVerification = pendingData.umkm?.length || 0;
            }

            // TODO: Implement flaggedRecords from financial logs later
            flaggedRecords = 0;

            setStats({
                totalUMKM,
                pendingVerification,
                flaggedRecords,
                totalOmzet,
            });
        } catch (error) {
            console.error('Failed to fetch stats:', error);
            setStats({
                totalUMKM: 0,
                pendingVerification: 0,
                flaggedRecords: 0,
                totalOmzet: 0,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Header */}
            <div className="mb-12">
                <h1 className="text-4xl font-bold text-white mb-2">Dashboard Pejabat Wilayah</h1>
                <p className="text-white/70">Kelola dan verifikasi UMKM di wilayah Anda</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatsCard
                    label="Total UMKM"
                    value={stats.totalUMKM.toString()}
                    icon={<BarChart3 className="text-blue-400" size={24} />}
                />
                <StatsCard
                    label="Menunggu Verifikasi"
                    value={stats.pendingVerification.toString()}
                    icon={<Clock className="text-yellow-400" size={24} />}
                />
                <StatsCard
                    label="Data Tercurigai"
                    value={stats.flaggedRecords.toString()}
                    icon={<AlertCircle className="text-red-400" size={24} />}
                />
                <StatsCard
                    label="Total Omzet"
                    value={formatCurrency(stats.totalOmzet)}
                    icon={<BarChart3 className="text-green-400" size={24} />}
                />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Link
                    href="/dashboard/pejabat/verifikasi"
                    className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl hover:bg-white/20 transition-all duration-300 group"
                >
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="font-semibold text-white group-hover:text-blue-300 transition-colors">Verifikasi UMKM</h3>
                            <p className="text-white/60 text-sm mt-1 group-hover:text-white/80 transition-colors">
                                Tinjau dan verifikasi permohonan UMKM baru
                            </p>
                        </div>
                        <CheckCircle className="text-green-400 flex-shrink-0 group-hover:scale-110 transition-transform" size={24} />
                    </div>
                </Link>

                <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl hover:bg-white/20 transition-all duration-300">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="font-semibold text-white">Analisis Data</h3>
                            <p className="text-white/60 text-sm mt-1">
                                Lihat statistik wilayah dan trend UMKM
                            </p>
                        </div>
                        <BarChart3 className="text-blue-400 flex-shrink-0" size={24} />
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Aktivitas Terbaru</h2>
                <p className="text-white/60 text-center py-8">Tidak ada aktivitas terbaru</p>
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
                    <p className="text-2xl font-bold text-white mt-2">{value}</p>
                </div>
                {icon}
            </div>
        </div>
    );
}

