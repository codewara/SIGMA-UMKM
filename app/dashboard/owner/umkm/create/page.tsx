'use client';

import { useState } from 'react';
import { ArrowLeft, Plus, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CreateUMKMPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        nama_usaha: '',
        sektor: 'kuliner',
        pemilik_nama: '',
        pemilik_nik: '',
        pemilik_telepon: '',
        pemilik_email: '',
        alamat_lengkap: '',
        kota: '',
        provinsi: '',
        nib: '',
        pirt: '',
        halal: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, type, value } = e.target as HTMLInputElement;
        
        if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                [name]: (e.target as HTMLInputElement).checked
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/umkm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Gagal membuat UMKM');
            }

            const result = await response.json();
            router.push(`/dashboard/owner/umkm/${result.data._id}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header with Navigation */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard/owner"
                            className="p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                            <ArrowLeft size={20} className="text-gray-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Daftar UMKM Baru</h1>
                            <p className="text-sm text-gray-600 mt-1">
                                Isi formulir lengkap untuk mendaftarkan UMKM Anda
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-900 px-4 py-3 mx-4 mt-4 rounded-lg">
                    <div className="flex items-start gap-3">
                        <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                        <p>{error}</p>
                    </div>
                </div>
            )}

            {/* Form Container */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow space-y-8 p-6 sm:p-8">
                    {/* Section 1: Info Usaha */}
                    <fieldset>
                        <legend className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold">
                                1
                            </span>
                            Informasi Usaha
                        </legend>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nama Usaha <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="nama_usaha"
                                    value={formData.nama_usaha}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Misal: Kedai Kopi Sigma"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Sektor <span className="text-red-600">*</span>
                                </label>
                                <select
                                    name="sektor"
                                    value={formData.sektor}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="kuliner">Kuliner</option>
                                    <option value="fashion">Fashion</option>
                                    <option value="kriya">Kriya</option>
                                    <option value="jasa">Jasa</option>
                                    <option value="lainnya">Lainnya</option>
                                </select>
                            </div>
                        </div>
                    </fieldset>

                    <hr />

                    {/* Section 2: Data Pemilik */}
                    <fieldset>
                        <legend className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold">
                                2
                            </span>
                            Data Pemilik
                        </legend>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nama Lengkap <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="pemilik_nama"
                                    value={formData.pemilik_nama}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    NIK
                                </label>
                                <input
                                    type="text"
                                    name="pemilik_nik"
                                    value={formData.pemilik_nik}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Telepon <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="pemilik_telepon"
                                    value={formData.pemilik_telepon}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="pemilik_email"
                                    value={formData.pemilik_email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </fieldset>

                    <hr />

                    {/* Section 3: Lokasi */}
                    <fieldset>
                        <legend className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold">
                                3
                            </span>
                            Lokasi Usaha
                        </legend>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Alamat Lengkap <span className="text-red-600">*</span>
                                </label>
                                <textarea
                                    name="alamat_lengkap"
                                    value={formData.alamat_lengkap}
                                    onChange={handleChange}
                                    required
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Jalan, Nomor, Kelurahan, Kecamatan"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Kota <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="kota"
                                        value={formData.kota}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Provinsi <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="provinsi"
                                        value={formData.provinsi}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                    </fieldset>

                    <hr />

                    {/* Section 4: Legalitas */}
                    <fieldset>
                        <legend className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold">
                                4
                            </span>
                            Legalitas
                        </legend>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nomor Induk Bisnis (NIB)
                                </label>
                                <input
                                    type="text"
                                    name="nib"
                                    value={formData.nib}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nomor PIRT (untuk Kuliner)
                                </label>
                                <input
                                    type="text"
                                    name="pirt"
                                    value={formData.pirt}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <input
                                    type="checkbox"
                                    id="halal"
                                    name="halal"
                                    checked={formData.halal}
                                    onChange={handleChange}
                                    className="w-4 h-4 rounded cursor-pointer"
                                />
                                <label htmlFor="halal" className="text-sm font-medium text-gray-700 cursor-pointer flex-1">
                                    Produk bersertifikat Halal
                                </label>
                            </div>
                        </div>
                    </fieldset>

                    {/* Submit Button */}
                    <div className="flex gap-4 pt-6 border-t">
                        <Link
                            href="/dashboard/owner"
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition flex items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <span className="animate-spin">⏳</span>
                                    Sedang membuat...
                                </>
                            ) : (
                                <>
                                    <Plus size={18} />
                                    Buat UMKM
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

