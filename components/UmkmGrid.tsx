'use client';

import UmkmCard from './UmkmCard';
import type { User, UMKM } from '@/lib/types';

interface UmkmGridProps {
    umkmData: UMKM[];
    isLoading: boolean;
    user: User | null;
}

export default function UmkmGrid({ umkmData, isLoading, user }: UmkmGridProps) {
    if (isLoading) {
        return (
            <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
                <p className="text-white mt-4">Memuat data UMKM...</p>
            </div>
        );
    }

    if (umkmData.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-white text-lg">Belum ada data UMKM tersedia</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {umkmData.map((umkm) => (
                <UmkmCard key={umkm.id} umkm={umkm} user={user} />
            ))}
        </div>
    );
}
