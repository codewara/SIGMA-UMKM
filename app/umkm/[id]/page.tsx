'use client';

import { MapPin, Phone, Mail, ArrowLeft, TrendingUp, BarChart3, Edit2, Calendar, Users, Award, DollarSign, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

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

  useEffect(() => {
    fetchUserAndUMKM();
  }, [params.id]);

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
    } catch (err) {
      console.error('Failed to fetch:', err);
      setError('Gagal memuat data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* Sparkles */}
        <div className="absolute top-32 right-1/4 w-2 h-2 bg-cyan-300 rounded-full animate-ping"></div>
        <div className="absolute top-48 left-1/3 w-1.5 h-1.5 bg-pink-300 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-32 right-1/3 w-2 h-2 bg-blue-300 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
      </div>

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
                { label: 'Kota', value: umkm.wilayah.kota, icon: MapPin, color: 'from-green-400 to-emerald-500', bg: 'from-green-500/20 to-emerald-500/20', roles: ['public', 'UMKM_OWNER', 'PEJABAT', 'ADMIN'] },
                { label: 'Sektor', value: umkm.sektor, icon: Award, color: 'from-blue-400 to-cyan-500', bg: 'from-blue-500/20 to-cyan-500/20', roles: ['public', 'UMKM_OWNER', 'PEJABAT', 'ADMIN'] },
                { label: 'Bergabung', value: umkm.tanggal_bergabung ? new Date(umkm.tanggal_bergabung).toLocaleDateString('id-ID', { year: 'numeric', month: 'short' }) : 'N/A', icon: Calendar, color: 'from-purple-400 to-pink-500', bg: 'from-purple-500/20 to-pink-500/20', roles: ['public', 'UMKM_OWNER', 'PEJABAT', 'ADMIN'] },
                { label: 'Karyawan', value: umkm.jumlah_karyawan || 'N/A', icon: Users, color: 'from-orange-400 to-red-500', bg: 'from-orange-500/20 to-red-500/20', roles: ['PEJABAT', 'ADMIN'] },
                { label: 'Omzet Terakhir', value: umkm.summary_terakhir?.omzet_terakhir ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(umkm.summary_terakhir.omzet_terakhir) : 'N/A', icon: DollarSign, color: 'from-cyan-400 to-blue-500', bg: 'from-cyan-500/20 to-blue-500/20', roles: ['PEJABAT', 'ADMIN'] },
                { label: 'Status Verifikasi', value: umkm.legalitas?.status_verifikasi || 'N/A', icon: Award, color: 'from-pink-400 to-rose-500', bg: 'from-pink-500/20 to-rose-500/20', roles: ['ADMIN'] },
              ].filter(stat => (!user && stat.roles.includes('public')) || (user && stat.roles.includes(user.role))).map((stat, idx) => (
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

              {/* Owner/Contact Info - PEJABAT & ADMIN only */}
              {user && (user.role === 'PEJABAT' || user.role === 'ADMIN') && (
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

                      {user.role === 'ADMIN' && umkm.pemilik?.nik && (
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
          </>
        ) : null}
      </div>
    </div>
  );
}