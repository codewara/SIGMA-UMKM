'use client';

import { Users, BarChart3, TrendingUp, Award, LucideIcon } from 'lucide-react';

interface Stat {
    label: string;
    value: string;
    icon: LucideIcon;
    color: string;
}

const stats: Stat[] = [
    { label: 'Total UMKM', value: '1,234', icon: Users, color: 'from-blue-400 to-blue-600' },
    { label: 'Transaksi Bulan Ini', value: 'Rp 1.2M', icon: BarChart3, color: 'from-green-400 to-green-600' },
    { label: 'Pertumbuhan', value: '+23.5%', icon: TrendingUp, color: 'from-purple-400 to-purple-600' },
    { label: 'UMKM Terverifikasi', value: '892', icon: Award, color: 'from-pink-400 to-pink-600' },
];

export default function StatsGrid() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            {stats.map((stat, index) => (
                <div key={index} className="group cursor-pointer">
                    <div className="relative overflow-hidden bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 hover:border-white/40 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 p-6">
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-20 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500`}></div>
                        <div className="relative">
                            <stat.icon className="w-10 h-10 mb-4 text-white/90" />
                            <p className="text-3xl font-bold text-white mb-2">{stat.value}</p>
                            <p className="text-sm text-gray-300">{stat.label}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
