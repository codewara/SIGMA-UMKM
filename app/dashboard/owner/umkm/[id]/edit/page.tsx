'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, AlertCircle, Loader } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

interface UMKM {
    _id: string;
    nama_usaha: string;
    sektor: string;
    pemilik: { nama: string; nik?: string; telepon?: string; email?: string };
    wilayah: { alamat_lengkap?: string; kota: string; provinsi: string };
    legalitas?: { nib?: string };
    tahun_berdiri?: number;
    deskripsi?: string;
}

export default function EditUMKMPage() {
    const router = useRouter();
    const params = useParams();
    const umkmId = params.id as string;

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [umkm, setUmkm] = useState<UMKM | null>(null);
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
        tahun_berdiri: '',
        deskripsi: '',
    });

    // Fetch existing UMKM data
    useEffect(() => {
        const fetchUMKM = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/umkm/${umkmId}`);
                if (!response.ok) {
                    throw new Error('Gagal memuat data UMKM');
                }
                const data = await response.json();
                const umkmData = data.data;
                setUmkm(umkmData);

                // Populate form
                setFormData({
                    nama_usaha: umkmData.nama_usaha || '',
                    sektor: umkmData.sektor || 'kuliner',
                    pemilik_nama: umkmData.pemilik?.nama || '',
                    pemilik_nik: umkmData.pemilik?.nik || '',
                    pemilik_telepon: umkmData.pemilik?.telepon || '',
                    pemilik_email: umkmData.pemilik?.email || '',
                    alamat_lengkap: umkmData.wilayah?.alamat_lengkap || '',
                    kota: umkmData.wilayah?.kota || '',
                    provinsi: umkmData.wilayah?.provinsi || '',
                    nib: umkmData.legalitas?.nib || '',
                    tahun_berdiri: umkmData.tahun_berdiri?.toString() || '',
                    deskripsi: umkmData.deskripsi || '',
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Gagal memuat data');
            } finally {
                setIsLoading(false);
            }
        };

        if (umkmId) {
            fetchUMKM();
        }
    }, [umkmId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);

        try {
            const updateData = {
                nama_usaha: formData.nama_usaha,
                sektor: formData.sektor,
                pemilik: {
                    nama: formData.pemilik_nama,
                    ...(formData.pemilik_nik && { nik: formData.pemilik_nik }),
                    ...(formData.pemilik_telepon && { telepon: formData.pemilik_telepon }),
                    ...(formData.pemilik_email && { email: formData.pemilik_email }),
                },
                wilayah: {
                    kota: formData.kota,
                    provinsi: formData.provinsi,
                    ...(formData.alamat_lengkap && { alamat_lengkap: formData.alamat_lengkap }),
                },
                ...(formData.tahun_berdiri && { tahun_berdiri: parseInt(formData.tahun_berdiri) }),
                ...(formData.deskripsi && { deskripsi: formData.deskripsi }),
                legalitas: {
                    ...(formData.nib && { nib: formData.nib }),
                },
            };

            const response = await fetch(`/api/umkm/${umkmId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData),
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Gagal memperbarui UMKM');
            }

            router.push(`/dashboard/owner/umkm/${umkmId}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0f172a] p-4 sm:p-6 lg:p-8 flex items-center justify-center">
                <div className="text-white/70">Memuat data UMKM...</div>
            </div>
        );
    }

    if (!umkm) {
        return (
            <div className="min-h-screen bg-[#0f172a] p-4 sm:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto">
                    <Link href="/dashboard/owner/umkm">
                        <button className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-6 transition-colors">
                            <ArrowLeft size={20} />
                            <span>Kembali</span>
                        </button>
                    </Link>
                    <div className="bg-red-500/20 border border-red-500/50 rounded-2xl p-6">
                        <p className="text-red-300">{error || 'UMKM tidak ditemukan'}</p>
                    </div>
                </div>
            </div>
        );
    }

    const sektors = [
        'kuliner',
        'fashion',
        'jasa',
        'kriya',
        'pertanian',
        'peternakan',
        'kerajinan',
        'lainnya',
    ];

    const provinsis = [
        'Jawa Barat',
        'Jawa Timur',
        'DKI Jakarta',
        'Banten',
        'Yogyakarta',
        'Jawa Tengah',
        'Sumatera Utara',
        'Sulawesi Selatan',
        'Bali',
        'Lainnya',
    ];

    return (
        <div className="min-h-screen bg-[#0f172a] p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <Link href={`/dashboard/owner/umkm/${umkmId}`}>
                    <button className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-6 transition-colors">
                        <ArrowLeft size={20} />
                        <span>Kembali</span>
                    </button>
                </Link>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Edit Data UMKM</h1>
                    <p className="text-white/60">Perbarui informasi untuk {umkm.nama_usaha}</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-500/20 border border-red-400/50 rounded-xl p-4 flex items-center gap-3">
                            <AlertCircle className="text-red-400 flex-shrink-0" size={20} />
                            <p className="text-red-200 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Informasi Dasar */}
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 space-y-4">
                        <h2 className="text-xl font-semibold text-white pb-4 border-b border-white/20">
                            Informasi Dasar
                        </h2>

                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">
                                Nama Usaha
                            </label>
                            <input
                                type="text"
                                name="nama_usaha"
                                value={formData.nama_usaha}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all"
                                placeholder="Nama UMKM"
                            />
                        </div>

                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">
                                Sektor Industri
                            </label>
                            <select
                                name="sektor"
                                value={formData.sektor}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all"
                            >
                                {sektors.map(sektor => (
                                    <option key={sektor} value={sektor} className="bg-slate-800">
                                        {sektor.charAt(0).toUpperCase() + sektor.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">
                                Deskripsi Usaha
                            </label>
                            <textarea
                                name="deskripsi"
                                value={formData.deskripsi}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all"
                                placeholder="Deskripsi singkat tentang usaha Anda"
                            />
                        </div>

                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">
                                Tahun Berdiri
                            </label>
                            <input
                                type="number"
                                name="tahun_berdiri"
                                value={formData.tahun_berdiri}
                                onChange={handleChange}
                                min="1900"
                                max={new Date().getFullYear()}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all"
                                placeholder="Tahun berdiri"
                            />
                        </div>
                    </div>

                    {/* Informasi Pemilik */}
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 space-y-4">
                        <h2 className="text-xl font-semibold text-white pb-4 border-b border-white/20">
                            Informasi Pemilik
                        </h2>

                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">
                                Nama Pemilik *
                            </label>
                            <input
                                type="text"
                                name="pemilik_nama"
                                value={formData.pemilik_nama}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all"
                                placeholder="Nama lengkap pemilik"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">
                                    NIK
                                </label>
                                <input
                                    type="text"
                                    name="pemilik_nik"
                                    value={formData.pemilik_nik}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all"
                                    placeholder="Nomor Induk Kependudukan"
                                />
                            </div>

                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">
                                    NIB (Nomor Induk Berusaha)
                                </label>
                                <input
                                    type="text"
                                    name="nib"
                                    value={formData.nib}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all"
                                    placeholder="Nomor Induk Berusaha"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">
                                    Nomor Telepon
                                </label>
                                <input
                                    type="tel"
                                    name="pemilik_telepon"
                                    value={formData.pemilik_telepon}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all"
                                    placeholder="Nomor telepon"
                                />
                            </div>

                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="pemilik_email"
                                    value={formData.pemilik_email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all"
                                    placeholder="Email"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Lokasi */}
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 space-y-4">
                        <h2 className="text-xl font-semibold text-white pb-4 border-b border-white/20">
                            Lokasi Usaha
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">
                                    Provinsi *
                                </label>
                                <select
                                    name="provinsi"
                                    value={formData.provinsi}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all"
                                >
                                    <option value="" className="bg-slate-800">Pilih Provinsi</option>
                                    {provinsis.map(provinsi => (
                                        <option key={provinsi} value={provinsi} className="bg-slate-800">
                                            {provinsi}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">
                                    Kota/Kabupaten *
                                </label>
                                <input
                                    type="text"
                                    name="kota"
                                    value={formData.kota}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all"
                                    placeholder="Nama kota/kabupaten"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">
                                Alamat Lengkap
                            </label>
                            <textarea
                                name="alamat_lengkap"
                                value={formData.alamat_lengkap}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all"
                                placeholder="Alamat lengkap tempat usaha"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:from-gray-500 disabled:to-gray-600 text-white px-6 py-3 rounded-lg transition-all duration-300 font-medium"
                        >
                            {isSaving ? (
                                <>
                                    <Loader size={18} className="animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                'Simpan Perubahan'
                            )}
                        </button>
                        <Link href={`/dashboard/owner/umkm/${umkmId}`}>
                            <button type="button" className="px-6 py-3 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors font-medium">
                                Batal
                            </button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
