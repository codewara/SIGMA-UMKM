'use client';

import { useEffect, useState } from 'react';
import { MapPin, Loader } from 'lucide-react';
import Navigation from '@/components/Navigation';
import BackgroundElements from '@/components/BackgroundElements';
import Footer from '@/components/Footer';
import MapComponent from './MapComponent';
import type { User } from '@/lib/types';

interface UMKM {
    _id: string;
    nama_usaha: string;
    sektor: string;
    lokasi: {
        coordinates: [number, number];
    };
    wilayah: {
        kota: string;
        provinsi: string;
    };
}

export default function PetaPage() {
    const [umkms, setUmkms] = useState<UMKM[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSector, setSelectedSector] = useState('semua');
    const [user, setUser] = useState<User | null>(null);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    useEffect(() => {
        fetchUser();
        fetchUMKMs();
    }, []);

    const fetchUser = async () => {
        try {
            const res = await fetch('/api/auth/me');
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            }
        } catch (error) {
            console.error('Failed to fetch user:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            setUser(null);
            setShowMobileMenu(false);
            window.location.href = '/';
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const fetchUMKMs = async () => {
        try {
            setLoading(true);
            // Fetch ALL UMKMs (public access) - tanpa filter status
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

    const filteredUmkms = selectedSector === 'semua'
        ? umkms
        : umkms.filter(u => u.sektor === selectedSector);

    const sectors = ['semua', ...Array.from(new Set(umkms.map(u => u.sektor)))];

    return (
        <div className="min-h-screen bg-[#0f172a] relative overflow-hidden">
            {/* Animated Background Elements */}
            <BackgroundElements />

            {/* Navigation */}
            <Navigation
                user={user}
                isLoading={false}
                showMobileMenu={showMobileMenu}
                onToggleMobileMenu={() => setShowMobileMenu(!showMobileMenu)}
                onLogout={handleLogout}
            />

            {/* Header */}
            <div className="relative backdrop-blur-xl bg-white/5 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-3xl font-bold text-white">Peta Distribusi UMKM</h1>
                    <p className="text-gray-300 mt-2">Lihat lokasi dan sebaran UMKM di seluruh wilayah</p>
                </div>
            </div>

            {/* Content */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filter */}
                <div className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/20 mb-6">
                    <label className="block text-sm font-medium text-white/80 mb-2">
                        Filter Sektor
                    </label>
                    <select
                        value={selectedSector}
                        onChange={(e) => setSelectedSector(e.target.value)}
                        className="px-4 py-2 bg-white/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-white"
                    >
                        {sectors.map(sector => (
                            <option key={sector} value={sector}>
                                {sector === 'semua' ? 'Semua Sektor' : sector.charAt(0).toUpperCase() + sector.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Map placeholder & List */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Map */}
                    <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-white/20 h-96">
                        {loading ? (
                            <div className="flex items-center justify-center h-full bg-white/10">
                                <Loader className="animate-spin text-cyan-400" size={32} />
                            </div>
                        ) : (
                            <MapComponent umkms={filteredUmkms} />
                        )}
                    </div>

                    {/* Sidebar - UMKM List */}
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden flex flex-col h-96">
                        <div className="p-4 border-b border-white/10 bg-gradient-to-r from-white/5 to-white/0">
                            <h2 className="font-semibold text-white">
                                UMKM Terdekat ({filteredUmkms.length})
                            </h2>
                        </div>
                        <div className="flex-1 overflow-y-auto divide-y divide-white/10">
                            {loading ? (
                                <div className="flex items-center justify-center h-full">
                                    <Loader className="animate-spin text-purple-400" size={24} />
                                </div>
                            ) : filteredUmkms.length === 0 ? (
                                <div className="p-4 text-center text-white/60">
                                    Tidak ada UMKM di sektor ini
                                </div>
                            ) : (
                                filteredUmkms.slice(0, 10).map(umkm => (
                                    <div
                                        key={umkm._id}
                                        className="p-4 hover:bg-white/10 cursor-pointer transition-colors"
                                    >
                                        <h3 className="font-medium text-white">{umkm.nama_usaha}</h3>
                                        <p className="text-sm text-white/70 mt-1">{umkm.sektor}</p>
                                        <p className="text-xs text-white/50 mt-1">
                                            {umkm.wilayah.kota}, {umkm.wilayah.provinsi}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}
