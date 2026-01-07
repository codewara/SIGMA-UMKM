'use client';

import { useEffect, useState } from 'react';
import { Search, MapPin, DollarSign, Loader } from 'lucide-react';
import Navigation from '@/components/Navigation';
import BackgroundElements from '@/components/BackgroundElements';
import Footer from '@/components/Footer';
import type { User } from '@/lib/types';

interface UMKM {
    _id: string;
    nama_usaha: string;
    sektor: string;
    wilayah: {
        kota: string;
        provinsi: string;
    };
    summary_terakhir: {
        omzet_terakhir: number;
    };
}

export default function KatalogPage() {
    const [umkms, setUmkms] = useState<UMKM[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSector, setSelectedSector] = useState('semua');
    const [selectedCity, setSelectedCity] = useState('semua');
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
            const response = await fetch('/api/umkm?status=VERIFIED');
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

    // Filter logic
    const filteredUmkms = umkms.filter(umkm => {
        const matchesSearch = umkm.nama_usaha.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSector = selectedSector === 'semua' || umkm.sektor === selectedSector;
        const matchesCity = selectedCity === 'semua' || umkm.wilayah.kota === selectedCity;
        return matchesSearch && matchesSector && matchesCity;
    });

    // Get unique values for filters
    const sectors = ['semua', ...Array.from(new Set(umkms.map(u => u.sektor)))];
    const cities = ['semua', ...Array.from(new Set(umkms.map(u => u.wilayah.kota))).sort()];

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
                    <h1 className="text-3xl font-bold text-white">Katalog UMKM</h1>
                    <p className="text-gray-300 mt-2">Cari dan lihat daftar UMKM yang tersedia</p>
                </div>
            </div>

            {/* Content */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 mb-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Filter Pencarian</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Search */}
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                                Cari Nama UMKM
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 text-white/50" size={18} />
                                <input
                                    type="text"
                                    placeholder="Contoh: Batik Madura"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-white/50"
                                />
                            </div>
                        </div>

                        {/* Sektor */}
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                                Sektor
                            </label>
                            <select
                                value={selectedSector}
                                onChange={(e) => setSelectedSector(e.target.value)}
                                className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-white"
                            >
                                {sectors.map(sector => (
                                    <option key={sector} value={sector}>
                                        {sector === 'semua' ? 'Semua Sektor' : sector.charAt(0).toUpperCase() + sector.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Kota */}
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                                Kota
                            </label>
                            <select
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                                className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-white"
                            >
                                {cities.map(city => (
                                    <option key={city} value={city}>
                                        {city === 'semua' ? 'Semua Kota' : city}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Reset Button */}
                        <div className="flex items-end">
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedSector('semua');
                                    setSelectedCity('semua');
                                }}
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/15 transition-colors font-medium"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div>
                    <p className="text-white/70 mb-4">
                        Menampilkan {filteredUmkms.length} UMKM
                    </p>

                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <Loader className="animate-spin text-purple-400" size={32} />
                        </div>
                    ) : filteredUmkms.length === 0 ? (
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-12 text-center">
                            <p className="text-white/70">Tidak ada UMKM yang sesuai dengan pencarian Anda</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredUmkms.map(umkm => (
                                <div
                                    key={umkm._id}
                                    className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden hover:shadow-lg transition-all transform hover:-translate-y-1 group"
                                >
                                    {/* Card Header */}
                                    <div className="p-6 bg-gradient-to-br from-white/5 to-white/0">
                                        {/* Title */}
                                        <h3 className="text-lg font-semibold text-white line-clamp-2 group-hover:text-purple-200 transition">
                                            {umkm.nama_usaha}
                                        </h3>

                                        {/* Sector Badge */}
                                        <span className="inline-block mt-3 px-3 py-1 bg-purple-500/30 text-purple-200 rounded-full text-xs font-medium border border-purple-400/50">
                                            {umkm.sektor}
                                        </span>

                                        {/* Info */}
                                        <div className="mt-4 space-y-3">
                                            <div className="flex items-center gap-2 text-white/70">
                                                <MapPin size={16} className="text-purple-400" />
                                                <span className="text-sm">
                                                    {umkm.wilayah.kota}, {umkm.wilayah.provinsi}
                                                </span>
                                            </div>

                                            {umkm.summary_terakhir?.omzet_terakhir && (
                                                <div className="flex items-center gap-2 text-white/70">
                                                    <DollarSign size={16} className="text-blue-400" />
                                                    <span className="text-sm">
                                                        Omzet: Rp {(umkm.summary_terakhir.omzet_terakhir / 1000000).toFixed(1)}M
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Card Footer */}
                                    <div className="px-6 py-4 bg-white/5 border-t border-white/10">
                                        <button className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all font-medium text-sm">
                                            Lihat Detail
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}
