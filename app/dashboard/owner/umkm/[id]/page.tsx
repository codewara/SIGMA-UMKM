'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit2, MapPin, Users, Briefcase, Calendar } from 'lucide-react';
import Link from 'next/link';

interface UMKM {
    _id: string;
    nama_usaha: string;
    sektor: string;
    pemilik: {
        nama: string;
        nik?: string;
        telepon?: string;
        email?: string;
    };
    wilayah: {
        kota: string;
        provinsi: string;
        alamat_lengkap?: string;
    };
    lokasi?: {
        type: string;
        coordinates: [number, number];
    };
    tanggal_bergabung: string;
    legalitas?: {
        nib?: string;
        status_verifikasi?: string;
    };
    jumlah_karyawan?: number;
    tahun_berdiri?: number;
    deskripsi?: string;
    summary_terakhir?: {
        omzet_terakhir: number;
        bulan: number;
    };
}

interface InfoItemProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
}

function InfoItem({ icon, label, value }: InfoItemProps) {
    return (
        <div className="flex items-start gap-3">
            <div className="text-cyan-400 mt-1">{icon}</div>
            <div>
                <p className="text-white/60 text-sm">{label}</p>
                <p className="text-white font-medium">{value}</p>
            </div>
        </div>
    );
}

export default function OwnerUMKMDetailPage() {
    const params = useParams();
    const router = useRouter();
    const umkmId = params.id as string;

    const [umkm, setUmkm] = useState<UMKM | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUMKM = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`/api/umkm/${umkmId}`);
                if (!response.ok) {
                    if (response.status === 404) {
                        setError('UMKM tidak ditemukan');
                    } else {
                        setError('Gagal memuat data UMKM');
                    }
                    return;
                }

                const data = await response.json();
                setUmkm(data.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Gagal memuat data');
            } finally {
                setLoading(false);
            }
        };

        if (umkmId) {
            fetchUMKM();
        }
    }, [umkmId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f172a] p-4 sm:p-6 lg:p-8 flex items-center justify-center">
                <div className="text-white/70">Memuat data UMKM...</div>
            </div>
        );
    }

    if (error || !umkm) {
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

    const verificationStatusColor = {
        VERIFIED: 'bg-green-500/30 text-green-300 border-green-400/50',
        PENDING: 'bg-yellow-500/30 text-yellow-300 border-yellow-400/50',
        REJECTED: 'bg-red-500/30 text-red-300 border-red-400/50',
    };

    return (
        <div className="min-h-screen bg-[#0f172a] p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <Link href="/dashboard/owner/umkm">
                    <button className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-6 transition-colors">
                        <ArrowLeft size={20} />
                        <span>Kembali ke Daftar Usaha</span>
                    </button>
                </Link>

                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">{umkm.nama_usaha}</h1>
                        <div className="flex gap-2 items-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                                verificationStatusColor[umkm.legalitas?.status_verifikasi as keyof typeof verificationStatusColor] || 'bg-gray-500/30 text-gray-300 border-gray-400/50'
                            }`}>
                                {umkm.legalitas?.status_verifikasi || 'Status Tidak Diketahui'}
                            </span>
                        </div>
                    </div>
                    <Link href={`/dashboard/owner/umkm/${umkmId}/edit`}>
                        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                            <Edit2 size={18} />
                            Edit
                        </button>
                    </Link>
                </div>

                {/* Main Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* Informasi Dasar */}
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
                            <h2 className="text-xl font-semibold text-white mb-4 pb-4 border-b border-white/20">
                                Informasi Dasar
                            </h2>
                            <div className="space-y-4">
                                <InfoItem
                                    icon={<Briefcase size={20} />}
                                    label="Sektor Industri"
                                    value={umkm.sektor}
                                />
                                <InfoItem
                                    icon={<MapPin size={20} />}
                                    label="Lokasi"
                                    value={`${umkm.wilayah.kota}, ${umkm.wilayah.provinsi}`}
                                />
                                {umkm.wilayah.alamat_lengkap && (
                                    <InfoItem
                                        icon={<MapPin size={20} />}
                                        label="Alamat Lengkap"
                                        value={umkm.wilayah.alamat_lengkap}
                                    />
                                )}
                                <InfoItem
                                    icon={<Calendar size={20} />}
                                    label="Tahun Bergabung"
                                    value={new Date(umkm.tanggal_bergabung).getFullYear()}
                                />
                                {umkm.tahun_berdiri && (
                                    <InfoItem
                                        icon={<Calendar size={20} />}
                                        label="Tahun Berdiri"
                                        value={umkm.tahun_berdiri}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Informasi Pemilik */}
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
                            <h2 className="text-xl font-semibold text-white mb-4 pb-4 border-b border-white/20">
                                Informasi Pemilik
                            </h2>
                            <div className="space-y-4">
                                <InfoItem
                                    icon={<Users size={20} />}
                                    label="Nama Pemilik"
                                    value={umkm.pemilik.nama}
                                />
                                {umkm.pemilik.nik && (
                                    <InfoItem
                                        icon={<Users size={20} />}
                                        label="NIK"
                                        value={umkm.pemilik.nik}
                                    />
                                )}
                                {umkm.pemilik.telepon && (
                                    <div className="flex items-start gap-3">
                                        <div className="text-cyan-400 mt-1">📱</div>
                                        <div>
                                            <p className="text-white/60 text-sm">Nomor Telepon</p>
                                            <a
                                                href={`tel:${umkm.pemilik.telepon}`}
                                                className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
                                            >
                                                {umkm.pemilik.telepon}
                                            </a>
                                        </div>
                                    </div>
                                )}
                                {umkm.pemilik.email && (
                                    <div className="flex items-start gap-3">
                                        <div className="text-cyan-400 mt-1">✉️</div>
                                        <div>
                                            <p className="text-white/60 text-sm">Email</p>
                                            <a
                                                href={`mailto:${umkm.pemilik.email}`}
                                                className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
                                            >
                                                {umkm.pemilik.email}
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Legalitas */}
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
                            <h2 className="text-xl font-semibold text-white mb-4 pb-4 border-b border-white/20">
                                Legalitas
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-white/60 text-sm">Status Verifikasi</p>
                                    <p className={`text-lg font-bold mt-1 ${
                                        umkm.legalitas?.status_verifikasi === 'VERIFIED' ? 'text-green-300' :
                                        umkm.legalitas?.status_verifikasi === 'PENDING' ? 'text-yellow-300' :
                                        'text-red-300'
                                    }`}>
                                        {umkm.legalitas?.status_verifikasi || 'Tidak Diketahui'}
                                    </p>
                                </div>
                                {umkm.legalitas?.nib && (
                                    <InfoItem
                                        icon={<Briefcase size={20} />}
                                        label="NIB (Nomor Induk Berusaha)"
                                        value={umkm.legalitas.nib}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Statistik Operasional */}
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
                            <h2 className="text-xl font-semibold text-white mb-4 pb-4 border-b border-white/20">
                                Statistik Operasional
                            </h2>
                            <div className="space-y-4">
                                {umkm.jumlah_karyawan !== undefined && (
                                    <InfoItem
                                        icon={<Users size={20} />}
                                        label="Jumlah Karyawan"
                                        value={umkm.jumlah_karyawan}
                                    />
                                )}
                                {umkm.summary_terakhir?.omzet_terakhir && (
                                    <div className="flex items-start gap-3">
                                        <div className="text-green-400 mt-1">💰</div>
                                        <div>
                                            <p className="text-white/60 text-sm">Omzet Terakhir</p>
                                            <p className="text-white font-medium text-lg">
                                                Rp {umkm.summary_terakhir.omzet_terakhir.toLocaleString('id-ID')}
                                            </p>
                                            <p className="text-white/50 text-xs mt-1">
                                                Bulan ke-{umkm.summary_terakhir.bulan}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Deskripsi */}
                {umkm.deskripsi && (
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 mb-8">
                        <h2 className="text-xl font-semibold text-white mb-4 pb-4 border-b border-white/20">
                            Deskripsi Usaha
                        </h2>
                        <p className="text-white/70 whitespace-pre-wrap">{umkm.deskripsi}</p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 mt-8">
                    <Link href={`/dashboard/owner/umkm/${umkmId}/lapor`}>
                        <button className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-300">
                            <span>📊</span>
                            Laporan Keuangan
                        </button>
                    </Link>
                    <Link href={`/dashboard/owner/umkm/${umkmId}/edit`}>
                        <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg border border-white/20 transition-all duration-300">
                            <Edit2 size={18} />
                            Edit Data
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
