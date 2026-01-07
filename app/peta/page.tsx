'use client';

import { useEffect, useState } from 'react';
import { MapPin, Loader } from 'lucide-react';

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

    const filteredUmkms = selectedSector === 'semua'
        ? umkms
        : umkms.filter(u => u.sektor === selectedSector);

    const sectors = ['semua', ...Array.from(new Set(umkms.map(u => u.sektor)))];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-3xl font-bold text-gray-900">Peta Distribusi UMKM</h1>
                    <p className="text-gray-600 mt-2">Lihat lokasi dan sebaran UMKM di seluruh wilayah</p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filter */}
                <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Filter Sektor
                    </label>
                    <select
                        value={selectedSector}
                        onChange={(e) => setSelectedSector(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden h-96 flex items-center justify-center">
                            <div className="text-center">
                                <MapPin className="mx-auto mb-4 text-gray-400" size={48} />
                                <p className="text-gray-600">
                                    Integrasi map akan ditampilkan di sini
                                </p>
                                <p className="text-gray-500 text-sm mt-1">
                                    (Gunakan library seperti Leaflet atau Mapbox)
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - UMKM List */}
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col h-96">
                        <div className="p-4 border-b border-gray-200">
                            <h2 className="font-semibold text-gray-900">
                                UMKM Terdekat ({filteredUmkms.length})
                            </h2>
                        </div>
                        <div className="flex-1 overflow-y-auto divide-y divide-gray-200">
                            {loading ? (
                                <div className="flex items-center justify-center h-full">
                                    <Loader className="animate-spin text-gray-400" size={24} />
                                </div>
                            ) : filteredUmkms.length === 0 ? (
                                <div className="p-4 text-center text-gray-600">
                                    Tidak ada UMKM di sektor ini
                                </div>
                            ) : (
                                filteredUmkms.slice(0, 10).map(umkm => (
                                    <div
                                        key={umkm._id}
                                        className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        <h3 className="font-medium text-gray-900">{umkm.nama_usaha}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{umkm.sektor}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {umkm.wilayah.kota}, {umkm.wilayah.provinsi}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
