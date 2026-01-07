'use client';

import { Plus, MapPin, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { UMKM } from '@/lib/types';

interface UmkmSayaSectionProps {
    umkmList: UMKM[];
}

export default function UmkmSayaSection({ umkmList }: UmkmSayaSectionProps) {
    const router = useRouter();

    return (
        <div className="mb-20">
            <h2 className="text-4xl font-bold text-white mb-10 flex items-center">
                <span className="mr-3">📊</span>
                UMKM Saya
            </h2>
            {umkmList.length > 0 ? (
                <div className="space-y-6">
                    {umkmList.map((umkm) => (
                        <div key={umkm.id} className="group relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                            <div className="relative bg-white/15 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl overflow-hidden hover:shadow-pink-500/20 transition-all transform hover:-translate-y-1 flex">
                                {/* Left Section */}
                                <div className="relative bg-blue-900 p-8 text-white w-72 flex-shrink-0 flex flex-col justify-between overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                                    <div className="relative">
                                        <h3 className="text-2xl font-bold leading-tight mb-3">{umkm.name}</h3>
                                        <div className="inline-block bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-semibold">
                                            {umkm.badge}
                                        </div>
                                    </div>
                                    <p className="text-pink-100 text-base">{umkm.category}</p>
                                </div>

                                {/* Right Section */}
                                <div className="p-8 flex-1 flex flex-col justify-between">
                                    <div className="space-y-6">
                                        <div className="flex items-center space-x-3 text-gray-300">
                                            <MapPin className="w-6 h-6 text-cyan-400 flex-shrink-0" />
                                            <span className="font-medium text-lg">{umkm.location}</span>
                                        </div>
                                        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                                            <p className="text-gray-300 text-sm font-medium mb-3">Pendapatan Bulan Ini</p>
                                            <div className="flex items-center justify-between">
                                                <p className="text-4xl font-bold text-white">{umkm.revenue}</p>
                                                <div className={`text-2xl font-bold flex items-center ${umkm.growth.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                                                    <TrendingUp className="w-6 h-6 mr-2" />
                                                    {umkm.growth}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => router.push(`/umkm/${umkm.id}`)}
                                        className="w-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white px-8 py-5 rounded-2xl font-bold text-base transition transform hover:scale-[1.02] shadow-xl mt-8 uppercase tracking-widest"
                                    >
                                        Lihat Detail
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <button className="w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-600 hover:via-purple-600 hover:to-pink-600 text-white px-8 py-6 rounded-3xl font-bold inline-flex items-center justify-center space-x-3 shadow-2xl hover:shadow-pink-500/50 transform hover:scale-105 transition">
                    <Plus className="w-6 h-6" />
                    <span>Daftarkan UMKM Saya</span>
                </button>
            )}
        </div>
    );
}
