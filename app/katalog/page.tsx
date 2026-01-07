'use client';

import { useEffect, useState } from 'react';
import { Search, MapPin, DollarSign, Loader } from 'lucide-react';

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

    useEffect(() => {
        fetchUMKMs();
    }, []);

    const fetchUMKMs = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/umkm?status=APPROVED');
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
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-3xl font-bold text-gray-900">Katalog UMKM</h1>
                    <p className="text-gray-600 mt-2">Cari dan lihat daftar UMKM yang tersedia</p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4">Filter Pencarian</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Search */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cari Nama UMKM
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Contoh: Batik Madura"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Sektor */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Sektor
                            </label>
                            <select
                                value={selectedSector}
                                onChange={(e) => setSelectedSector(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Kota
                            </label>
                            <select
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div>
                    <p className="text-gray-600 mb-4">
                        Menampilkan {filteredUmkms.length} UMKM
                    </p>

                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <Loader className="animate-spin text-gray-400" size={32} />
                        </div>
                    ) : filteredUmkms.length === 0 ? (
                        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                            <p className="text-gray-600">Tidak ada UMKM yang sesuai dengan pencarian Anda</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredUmkms.map(umkm => (
                                <div
                                    key={umkm._id}
                                    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                                >
                                    {/* Card Header */}
                                    <div className="p-6">
                                        {/* Title */}
                                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                                            {umkm.nama_usaha}
                                        </h3>

                                        {/* Sector Badge */}
                                        <span className="inline-block mt-3 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                            {umkm.sektor}
                                        </span>

                                        {/* Info */}
                                        <div className="mt-4 space-y-3">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <MapPin size={16} />
                                                <span className="text-sm">
                                                    {umkm.wilayah.kota}, {umkm.wilayah.provinsi}
                                                </span>
                                            </div>

                                            {umkm.summary_terakhir?.omzet_terakhir && (
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <DollarSign size={16} />
                                                    <span className="text-sm">
                                                        Omzet: Rp {(umkm.summary_terakhir.omzet_terakhir / 1000000).toFixed(1)}M
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Card Footer */}
                                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
                                            Lihat Detail
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
