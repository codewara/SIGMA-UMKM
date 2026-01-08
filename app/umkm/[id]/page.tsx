'use client';

import { MapPin, Phone, Mail, ArrowLeft, TrendingUp, BarChart3, Edit2, Calendar, Users, Award, DollarSign, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { formatCurrency } from '@/lib/formatter';
import BackgroundElements from '@/components/BackgroundElements';
import dynamic from 'next/dynamic';

const MapPreview = dynamic(() => import('@/app/peta/MapComponent'), { ssr: false });

interface User {
  _id: string;
  username: string;
  role: 'ADMIN' | 'PEJABAT' | 'UMKM_OWNER';
}

interface UMKM {
  _id: string;
  nama_usaha: string;
  sektor: string;
  tanggal_bergabung?: string;
  lokasi?: {
    coordinates: [number, number];
  };
  wilayah: {
    kota: string;
    provinsi: string;
    kecamatan?: string;
    kelurahan?: string;
    alamat_lengkap?: string;
  };
  pemilik: {
    nama?: string;
    nik?: string;
    telepon?: string;
    email?: string;
  };
  legalitas?: {
    nib?: string;
    pirt?: string;
    halal?: boolean;
    status_verifikasi?: string;
    tanggal_verifikasi?: string;
  };
  summary_terakhir?: {
    omzet_terakhir?: number;
    bulan?: number;
  };
  jumlah_karyawan?: number;
  tahun_berdiri?: number;
  deskripsi?: string;
  account_status: string;
  is_deleted?: boolean;
}

export default function UmkmDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [umkm, setUmkm] = useState<UMKM | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [financialData, setFinancialData] = useState<any[]>([]);
  const [isLoadingFinancial, setIsLoadingFinancial] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  useEffect(() => {
    fetchUserAndUMKM();
  }, [params.id]);

  useEffect(() => {
    // Fetch financial data when year changes
    if (params.id) {
      fetchFinancialData(params.id as string, selectedYear);
    }
  }, [selectedYear]);

  const fetchFinancialData = async (umkmId: string, tahun: number) => {
    try {
      setIsLoadingFinancial(true);
      const res = await fetch(`/api/analytics/financial/${umkmId}?tahun=${tahun}`);
      if (res.ok) {
        const data = await res.json();
        console.log('Financial data received:', data.data);
        
        // Ensure proper data formatting
        const formattedData = (data.data || []).map((record: any) => ({
          umkm_id: record.umkm_id,
          tahun: record.tahun,
          bulan: record.bulan,
          omzet: typeof record.omzet === 'number' ? record.omzet : (record.omzet ? parseInt(record.omzet) : 0),
          jumlah_karyawan: typeof record.jumlah_karyawan === 'number' ? record.jumlah_karyawan : (record.jumlah_karyawan ? parseInt(record.jumlah_karyawan) : 0),
          catatan: record.catatan,
          tanggal_input: record.tanggal_input,
          is_flagged: record.is_flagged,
          flag_reason: record.flag_reason
        }));
        
        setFinancialData(formattedData);
      } else if (res.status === 404) {
        setFinancialData([]);
      }
    } catch (error) {
      console.error('Failed to fetch financial data:', error);
    } finally {
      setIsLoadingFinancial(false);
    }
  };

  const fetchAvailableYears = async (umkmId: string) => {
    try {
      const res = await fetch(`/api/analytics/financial/${umkmId}`);
      if (res.ok) {
        const data = await res.json();
        const rows = data.data || [];
        
        // Extract unique years from all available financial data
        const yearsSet = new Set<number>();
        rows.forEach((row: any) => {
          if (row.tahun) {
            yearsSet.add(row.tahun);
          }
        });
        
        // If no years found, default to current and 2 previous years
        if (yearsSet.size === 0) {
          const currentYear = new Date().getFullYear();
          const defaultYears = [currentYear, currentYear - 1, currentYear - 2];
          setAvailableYears(defaultYears);
        } else {
          const sortedYears = Array.from(yearsSet).sort((a, b) => b - a);
          setAvailableYears(sortedYears);
          
          // Set selected year to the most recent year with data
          if (sortedYears.length > 0 && sortedYears[0] !== selectedYear) {
            setSelectedYear(sortedYears[0]);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch available years:', error);
      // Fallback to default years
      const currentYear = new Date().getFullYear();
      setAvailableYears([currentYear, currentYear - 1, currentYear - 2]);
    }
  };

  const fetchUserAndUMKM = async () => {
    try {
      // Fetch user info
      const userRes = await fetch('/api/auth/me');
      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData.user);
      }

      // Fetch UMKM detail
      const umkmRes = await fetch(`/api/umkm/${params.id}`);
      if (!umkmRes.ok) {
        if (umkmRes.status === 403) {
          setError('Anda tidak memiliki akses untuk melihat data detail ini.');
        } else {
          setError('UMKM tidak ditemukan');
        }
        return;
      }
      const umkmData = await umkmRes.json();
      setUmkm(umkmData.data);
      
      // Fetch available years from actual financial data
      if (params.id) {
        await fetchAvailableYears(params.id as string);
      }
    } catch (err) {
      console.error('Failed to fetch:', err);
      setError('Gagal memuat data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] relative overflow-hidden">
      {/* Animated Background */}
      <BackgroundElements />

      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-3 hover:bg-white/10 rounded-2xl transition text-white group"
            >
              <ArrowLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">{isLoading ? 'Loading...' : umkm?.nama_usaha || 'UMKM Detail'}</h1>
              <p className="text-cyan-200 text-sm mt-1">{umkm?.sektor || ''}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {umkm?.account_status && (
              <span className={`px-5 py-2 rounded-full text-sm font-bold shadow-lg ${umkm.account_status === 'active'
                ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                }`}>
                {umkm.account_status === 'active' ? 'Aktif' : 'Belum Terverifikasi'}
              </span>
            )}
            {user?.role === 'ADMIN' && (
              <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-600 hover:via-purple-600 hover:to-pink-600 text-white rounded-full font-bold transition transform hover:scale-105 shadow-xl">
                <Edit2 className="w-4 h-4" />
                <span>Edit</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-12 space-y-8">
        {isLoading ? (
          <div className="text-center text-white text-xl">Loading...</div>
        ) : error ? (
          <div className="bg-red-500/20 border border-red-500/50 rounded-2xl p-8 text-center">
            <p className="text-red-200 text-xl">{error}</p>
          </div>
        ) : umkm ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Kota', value: umkm.wilayah.kota, icon: MapPin, color: 'from-green-400 to-emerald-500', bg: 'from-green-500/20 to-emerald-500/20', show: true },
                { label: 'Sektor', value: umkm.sektor, icon: Award, color: 'from-blue-400 to-cyan-500', bg: 'from-blue-500/20 to-cyan-500/20', show: true },
                { label: 'Bergabung', value: umkm.tanggal_bergabung ? new Date(umkm.tanggal_bergabung).toLocaleDateString('id-ID', { year: 'numeric', month: 'short' }) : 'N/A', icon: Calendar, color: 'from-purple-400 to-pink-500', bg: 'from-purple-500/20 to-pink-500/20', show: true },
                { label: 'Karyawan', value: umkm.jumlah_karyawan || 'N/A', icon: Users, color: 'from-orange-400 to-red-500', bg: 'from-orange-500/20 to-red-500/20', show: umkm.jumlah_karyawan !== undefined },
                { label: 'Omzet Terakhir', value: umkm.summary_terakhir?.omzet_terakhir ? formatCurrency(umkm.summary_terakhir.omzet_terakhir) : 'N/A', icon: DollarSign, color: 'from-cyan-400 to-blue-500', bg: 'from-cyan-500/20 to-blue-500/20', show: umkm.summary_terakhir?.omzet_terakhir !== undefined },
                { label: 'Status Verifikasi', value: umkm.legalitas?.status_verifikasi || 'N/A', icon: Award, color: 'from-pink-400 to-rose-500', bg: 'from-pink-500/20 to-rose-500/20', show: user?.role === 'ADMIN' },
              ].filter(stat => stat.show).map((stat, idx) => (
                <div key={idx} className="group relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.bg} rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity`}></div>
                  <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 p-6 hover:border-white/40 transition-all transform hover:-translate-y-1 shadow-xl">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-2xl shadow-lg`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{stat.label}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Location Map - Show if lokasi exists */}
            {umkm.lokasi && umkm.lokasi.coordinates && (
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/30 p-8 shadow-2xl">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl shadow-lg">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Lokasi UMKM</h2>
                  </div>
                  <div className="relative h-96 bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden">
                    <MapPreview umkms={[umkm as any]} />
                  </div>
                </div>
              </div>
            )}

            {/* Info Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Location Info - Always visible */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/30 p-8 shadow-2xl">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl shadow-lg">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Informasi Lokasi</h2>
                  </div>

                  <div className="space-y-4">
                    {umkm.wilayah.alamat_lengkap && (
                      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 border border-white/10 hover:border-white/30 transition">
                        <div className="flex items-center space-x-3 mb-2">
                          <MapPin className="w-5 h-5 text-cyan-400" />
                          <p className="text-gray-300 text-sm">Alamat Lengkap</p>
                        </div>
                        <p className="text-lg font-bold text-white ml-8">{umkm.wilayah.alamat_lengkap}</p>
                      </div>
                    )}

                    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 border border-white/10 hover:border-white/30 transition">
                      <div className="flex items-center space-x-3 mb-2">
                        <MapPin className="w-5 h-5 text-pink-400" />
                        <p className="text-gray-300 text-sm">Wilayah</p>
                      </div>
                      <p className="text-xl font-bold text-white ml-8">
                        {umkm.wilayah.kelurahan ? `${umkm.wilayah.kelurahan}, ` : ''}
                        {umkm.wilayah.kecamatan ? `${umkm.wilayah.kecamatan}, ` : ''}
                        {umkm.wilayah.kota}, {umkm.wilayah.provinsi}
                      </p>
                    </div>

                    {umkm.tanggal_bergabung && (
                      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 border border-white/10 hover:border-white/30 transition">
                        <div className="flex items-center space-x-3 mb-2">
                          <Calendar className="w-5 h-5 text-purple-400" />
                          <p className="text-gray-300 text-sm">Bergabung Sejak</p>
                        </div>
                        <p className="text-xl font-bold text-white ml-8">
                          {new Date(umkm.tanggal_bergabung).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Owner/Contact Info - PEJABAT, ADMIN, and UMKM_OWNER (their own) */}
              {umkm.pemilik && (umkm.pemilik.nama || umkm.pemilik.telepon || umkm.pemilik.email) && (
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/30 p-8 shadow-2xl">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-3 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl shadow-lg">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-white">Informasi Pemilik</h2>
                    </div>

                    <div className="space-y-4">
                      {umkm.pemilik?.nama && (
                        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 border border-white/10 hover:border-white/30 transition">
                          <div className="flex items-center space-x-3 mb-2">
                            <Users className="w-5 h-5 text-cyan-400" />
                            <p className="text-gray-300 text-sm">Nama Pemilik</p>
                          </div>
                          <p className="text-xl font-bold text-white ml-8">{umkm.pemilik.nama}</p>
                        </div>
                      )}

                      {user?.role === 'ADMIN' && umkm.pemilik?.nik && (
                        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 border border-white/10 hover:border-white/30 transition">
                          <div className="flex items-center space-x-3 mb-2">
                            <Award className="w-5 h-5 text-orange-400" />
                            <p className="text-gray-300 text-sm">NIK</p>
                          </div>
                          <p className="text-lg font-bold text-white ml-8">{umkm.pemilik.nik}</p>
                        </div>
                      )}

                      {umkm.pemilik?.telepon && (
                        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 border border-white/10 hover:border-white/30 transition">
                          <div className="flex items-center space-x-3 mb-2">
                            <Phone className="w-5 h-5 text-purple-400" />
                            <p className="text-gray-300 text-sm">Nomor Telepon</p>
                          </div>
                          <p className="text-xl font-bold text-white ml-8">{umkm.pemilik.telepon}</p>
                        </div>
                      )}

                      {umkm.pemilik?.email && (
                        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 border border-white/10 hover:border-white/30 transition">
                          <div className="flex items-center space-x-3 mb-2">
                            <Mail className="w-5 h-5 text-pink-400" />
                            <p className="text-gray-300 text-sm">Email</p>
                          </div>
                          <p className="text-lg font-bold text-white ml-8">{umkm.pemilik.email}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Legal & Administrative Info - ADMIN only */}
              {user && user.role === 'ADMIN' && umkm.legalitas && (
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/30 p-8 shadow-2xl">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-3 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl shadow-lg">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-white">Informasi Legalitas</h2>
                    </div>

                    <div className="space-y-4">
                      {umkm.legalitas.nib && (
                        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 border border-white/10 hover:border-white/30 transition">
                          <div className="flex items-center space-x-3 mb-2">
                            <Award className="w-5 h-5 text-cyan-400" />
                            <p className="text-gray-300 text-sm">Nomor Induk Berusaha (NIB)</p>
                          </div>
                          <p className="text-lg font-bold text-white ml-8">{umkm.legalitas.nib}</p>
                        </div>
                      )}

                      {umkm.legalitas.pirt && (
                        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 border border-white/10 hover:border-white/30 transition">
                          <div className="flex items-center space-x-3 mb-2">
                            <Award className="w-5 h-5 text-purple-400" />
                            <p className="text-gray-300 text-sm">PIRT</p>
                          </div>
                          <p className="text-lg font-bold text-white ml-8">{umkm.legalitas.pirt}</p>
                        </div>
                      )}

                      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 border border-white/10 hover:border-white/30 transition">
                        <div className="flex items-center space-x-3 mb-2">
                          <Award className="w-5 h-5 text-pink-400" />
                          <p className="text-gray-300 text-sm">Sertifikat Halal</p>
                        </div>
                        <p className="text-xl font-bold text-white ml-8">{umkm.legalitas.halal ? '✅ Ya' : '❌ Tidak'}</p>
                      </div>

                      {umkm.legalitas.status_verifikasi && (
                        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 border border-white/10 hover:border-white/30 transition">
                          <div className="flex items-center space-x-3 mb-2">
                            <Activity className="w-5 h-5 text-orange-400" />
                            <p className="text-gray-300 text-sm">Status Verifikasi</p>
                          </div>
                          <p className="text-xl font-bold text-white ml-8">
                            <span className={`px-3 py-1 rounded-full text-sm ${umkm.legalitas.status_verifikasi === 'VERIFIED' ? 'bg-green-500/20 text-green-300' :
                              umkm.legalitas.status_verifikasi === 'PENDING' ? 'bg-yellow-500/20 text-yellow-300' :
                                'bg-red-500/20 text-red-300'
                              }`}>
                              {umkm.legalitas.status_verifikasi}
                            </span>
                          </p>
                        </div>
                      )}

                      {umkm.is_deleted !== undefined && (
                        <div className="bg-red-500/10 backdrop-blur-lg rounded-2xl p-4 border border-red-500/30 hover:border-red-500/50 transition">
                          <div className="flex items-center space-x-3 mb-2">
                            <Activity className="w-5 h-5 text-red-400" />
                            <p className="text-gray-300 text-sm">Status Data</p>
                          </div>
                          <p className="text-xl font-bold ml-8">
                            <span className={`px-3 py-1 rounded-full text-sm ${umkm.is_deleted ? 'bg-red-500/30 text-red-200' : 'bg-green-500/30 text-green-200'
                              }`}>
                              {umkm.is_deleted ? '🗑️ Deleted' : '✅ Active'}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            {umkm.deskripsi && (
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/30 p-8 shadow-2xl">
                  <h2 className="text-2xl font-bold text-white mb-4">Deskripsi</h2>
                  <p className="text-gray-200 leading-relaxed">{umkm.deskripsi}</p>
                </div>
              </div>
            )}

            {/* Financial Data - Public access */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/30 overflow-hidden">
                <div className="p-8 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl shadow-lg">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Laporan Keuangan</h2>
                  </div>
                  
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-green-400/50 focus:ring-1 focus:ring-green-400/30 transition-all cursor-pointer"
                  >
                    {availableYears.map((year) => (
                      <option key={year} value={year} className="bg-gray-800">
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                {isLoadingFinancial ? (
                  <div className="p-12 text-center">
                    <p className="text-white/60">Memuat data keuangan...</p>
                  </div>
                ) : financialData.length === 0 ? (
                  <div className="p-12 text-center">
                    <MapPin className="mx-auto mb-4 text-white/40" size={40} />
                    <p className="text-white/60">Tidak ada data keuangan untuk tahun {selectedYear}</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                          <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">Periode</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">Omzet</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider">Karyawan</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {financialData.map((record, idx) => {
                          const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
                          return (
                            <tr key={idx} className="hover:bg-white/5 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <p className="font-semibold text-white">{monthNames[record.bulan - 1]} {record.tahun}</p>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <p className="text-green-300 font-medium">{formatCurrency(record.omzet || 0)}</p>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <p className="text-white">{record.jumlah_karyawan || '-'}</p>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}