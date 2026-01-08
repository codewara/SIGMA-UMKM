'use client';

import { useEffect, useState } from 'react';
import { BarChart3, Users, Lock, AlertCircle, Clock } from 'lucide-react';
import Link from 'next/link';

interface AdminStats {
    totalPejabat: number;
    totalAdmin: number;
    totalUMKM: number;
    pendingVerification: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<AdminStats>({
        totalPejabat: 0,
        totalAdmin: 0,
        totalUMKM: 0,
        pendingVerification: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const [usersRes, umkmRes, pendingRes] = await Promise.all([
                fetch('/api/admin/users'),
                fetch('/api/umkm'),
                fetch('/api/umkm/pending')
            ]);

            let totalPejabat = 0;
            let totalAdmin = 0;
            let totalUMKM = 0;
            let pendingVerification = 0;

            if (usersRes.ok) {
                const usersData = await usersRes.json();
                const usersList = usersData.users || [];
                totalPejabat = usersList.filter((u: any) => u.role === 'PEJABAT').length;
                totalAdmin = usersList.filter((u: any) => u.role === 'ADMIN').length;
            }

            if (umkmRes.ok) {
                const umkmData = await umkmRes.json();
                totalUMKM = umkmData.data?.length || 0;
            }

            if (pendingRes.ok) {
                const pendingData = await pendingRes.json();
                pendingVerification = pendingData.umkm?.length || 0;
            }

            setStats({
                totalPejabat,
                totalAdmin,
                totalUMKM,
                pendingVerification,
            });
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
                    <p className="text-white/70">Kelola sistem dan akun pejabat</p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <Link
                        href="/dashboard/admin/users"
                        className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl hover:bg-white/20 transition-all duration-300 group"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="font-semibold text-white group-hover:text-blue-300 transition-colors">Kelola Pejabat</h3>
                                <p className="text-white/60 text-sm mt-1 group-hover:text-white/80 transition-colors">
                                    Tambah, edit, atau hapus akun pejabat
                                </p>
                            </div>
                            <Users className="text-purple-400 flex-shrink-0 group-hover:scale-110 transition-transform" size={24} />
                        </div>
                    </Link>

                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl hover:bg-white/20 transition-all duration-300">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="font-semibold text-white">Laporan Sistem</h3>
                                <p className="text-white/60 text-sm mt-1">
                                    Lihat statistik dan analytics sistem
                                </p>
                            </div>
                            <BarChart3 className="text-blue-400 flex-shrink-0" size={24} />
                        </div>
                    </div>
                </div>

                {/* System Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <StatsCard
                        label="Total Pejabat"
                        value={stats.totalPejabat.toString()}
                        icon={<Users className="text-blue-400" size={24} />}
                    />
                    <StatsCard
                        label="Total Admin"
                        value={stats.totalAdmin.toString()}
                        icon={<Lock className="text-purple-400" size={24} />}
                    />
                    <StatsCard
                        label="Total UMKM"
                        value={stats.totalUMKM.toString()}
                        icon={<BarChart3 className="text-green-400" size={24} />}
                    />
                    <StatsCard
                        label="Verifikasi Pending"
                        value={stats.pendingVerification.toString()}
                        icon={<Clock className="text-yellow-400" size={24} />}
                    />
                </div>

                {/* Info Section */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
                    <div className="flex items-start gap-4">
                        <Lock className="text-blue-400 flex-shrink-0 mt-1" size={24} />
                        <div>
                            <h3 className="font-semibold text-white mb-2">Informasi Sistem</h3>
                            <p className="text-white/70 text-sm">
                                SIGMA-UMKM adalah sistem manajemen UMKM berbasis role yang memungkinkan pengelolaan data keuangan dan verifikasi UMKM secara terdistribusi.
                            </p>
                        </div>
                    </div>
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

