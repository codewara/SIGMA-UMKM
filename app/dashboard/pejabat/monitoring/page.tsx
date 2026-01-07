'use client';

import { Eye, Filter, Loader, Users, CheckCircle, AlertCircle, BarChart3, Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface UMKM {
  _id: string;
  nama_usaha: string;
  sektor: string;
  pemilik: { nama: string; telepon?: string; email?: string };
  wilayah: { kota: string; provinsi?: string; alamat_lengkap?: string };
  legalitas: { status_verifikasi?: string; nib?: string; pirt?: string; halal?: boolean };
  summary_terakhir?: { omzet_terakhir: number; bulan: number };
  tanggal_bergabung?: string;
}

export default function PejabatMonitoringPage() {
  const [umkms, setUmkms] = useState<UMKM[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchUMKMs();
  }, []);

  const fetchUMKMs = async () => {
    try {
      setLoading(true);
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

  // Filter UMKMs based on status and search
  const filteredUmkms = umkms.filter(umkm => {
    const statusMatch = selectedStatus === 'all' || 
      (selectedStatus === 'verified' && umkm.legalitas?.status_verifikasi === 'VERIFIED') ||
      (selectedStatus === 'unverified' && umkm.legalitas?.status_verifikasi !== 'VERIFIED');
    
    const searchMatch = umkm.nama_usaha.toLowerCase().includes(searchQuery.toLowerCase()) ||
      umkm.sektor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      umkm.pemilik.nama.toLowerCase().includes(searchQuery.toLowerCase());
    
    return statusMatch && searchMatch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUmkms.length / ITEMS_PER_PAGE);
  const paginatedUmkms = filteredUmkms.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const verifiedCount = umkms.filter(u => u.legalitas?.status_verifikasi === 'VERIFIED').length;
  const unverifiedCount = umkms.length - verifiedCount;

  return (
    <div className="min-h-screen bg-[#0f172a] p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <BarChart3 size={32} className="text-purple-400" />
          Monitoring UMKM
        </h1>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 hover:bg-white/15 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/70 text-sm">Total UMKM</span>
              <Users className="text-purple-400" size={20} />
            </div>
            <div className="text-3xl font-bold text-white">{umkms.length}</div>
          </div>
          <div className="bg-gradient-to-br from-green-500/30 to-emerald-500/30 backdrop-blur-xl border border-green-400/50 rounded-2xl p-4 hover:from-green-500/40 hover:to-emerald-500/40 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/70 text-sm">Terverifikasi</span>
              <CheckCircle className="text-green-400" size={20} />
            </div>
            <div className="text-3xl font-bold text-green-300">{verifiedCount}</div>
          </div>
          <div className="bg-gradient-to-br from-orange-500/30 to-red-500/30 backdrop-blur-xl border border-orange-400/50 rounded-2xl p-4 hover:from-orange-500/40 hover:to-red-500/40 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/70 text-sm">Belum Terverifikasi</span>
              <AlertCircle className="text-orange-400" size={20} />
            </div>
            <div className="text-3xl font-bold text-orange-300">{unverifiedCount}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-white/70 text-sm mb-2 block font-medium flex items-center gap-2">
                <Search size={16} /> Cari UMKM
              </label>
              <input
                type="text"
                placeholder="Cari nama, sektor, atau pemilik..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-2.5 text-white placeholder-white/50 focus:outline-none focus:border-purple-400/50 focus:ring-1 focus:ring-purple-400/50 transition-all"
              />
            </div>
            <div>
              <label className="text-white/70 text-sm mb-2 block font-medium flex items-center gap-2">
                <Filter size={16} /> Filter Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-400/50 focus:ring-1 focus:ring-purple-400/50 transition-all cursor-pointer"
              >
                <option value="all" className="bg-slate-900">Semua Status ({umkms.length})</option>
                <option value="verified" className="bg-slate-900">Terverifikasi ({verifiedCount})</option>
                <option value="unverified" className="bg-slate-900">Belum Terverifikasi ({unverifiedCount})</option>
              </select>
            </div>
          </div>
        </div>

        {/* UMKM List */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <Loader className="animate-spin mx-auto mb-4 text-purple-400" size={32} />
              <p className="text-white/60">Memuat data UMKM...</p>
            </div>
          ) : filteredUmkms.length === 0 ? (
            <div className="p-12 text-center">
              <AlertCircle className="mx-auto mb-4 text-white/40" size={40} />
              <p className="text-white/60">Tidak ada UMKM untuk ditampilkan</p>
            </div>
          ) : (
            <>
              <div className="p-6 border-b border-white/20">
                <h2 className="text-lg font-semibold text-white">
                  Daftar UMKM ({filteredUmkms.length}) - Halaman {currentPage} dari {totalPages}
                </h2>
              </div>
              <div className="divide-y divide-white/20">
                {paginatedUmkms.map((umkm, idx) => (
                  <div key={umkm._id} className="p-6 hover:bg-white/5 transition-all duration-200 border-l-4 border-transparent hover:border-purple-500">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <span className="text-white/50 text-sm font-medium">#{((currentPage - 1) * ITEMS_PER_PAGE) + idx + 1}</span>
                          <h3 className="font-semibold text-white text-lg">{umkm.nama_usaha}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                            umkm.legalitas?.status_verifikasi === 'VERIFIED'
                              ? 'bg-green-500/30 text-green-300 border border-green-400/50'
                              : 'bg-orange-500/30 text-orange-300 border border-orange-400/50'
                          }`}>
                            {umkm.legalitas?.status_verifikasi === 'VERIFIED' ? 'Terverifikasi' : 'Menunggu'}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4 text-sm text-white/60">
                          <div>
                            <span className="text-white/50">Sektor:</span>
                            <p className="text-white font-medium">{umkm.sektor}</p>
                          </div>
                          <div>
                            <span className="text-white/50">Lokasi:</span>
                            <p className="text-white font-medium">{umkm.wilayah.kota}</p>
                          </div>
                          <div>
                            <span className="text-white/50">Pemilik:</span>
                            <p className="text-white font-medium">{umkm.pemilik.nama}</p>
                          </div>
                          {umkm.summary_terakhir && (
                            <div>
                              <span className="text-white/50">Omzet Terakhir:</span>
                              <p className="text-white font-medium">Rp {umkm.summary_terakhir.omzet_terakhir.toLocaleString('id-ID')}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <Link
                        href={`/dashboard/pejabat/umkm/${umkm._id}`}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 flex items-center gap-2 transition-all duration-200 flex-shrink-0 whitespace-nowrap"
                      >
                        <Eye size={18} />
                        <span className="hidden sm:inline">Detail</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {filteredUmkms.length > ITEMS_PER_PAGE && (
                <div className="p-6 border-t border-white/20 flex items-center justify-center gap-2">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all"
                  >
                    Sebelumnya
                  </button>
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-3 py-2 rounded-lg transition-all ${
                          currentPage === page
                            ? 'bg-purple-600 text-white'
                            : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all"
                  >
                    Selanjutnya
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

