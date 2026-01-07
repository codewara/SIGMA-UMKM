'use client';

import { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader,
  MapPin,
  User,
  Phone,
  Mail,
  Eye,
  Check,
  X,
} from 'lucide-react';
import Link from 'next/link';

interface UMKM {
  _id: string;
  nama_usaha: string;
  sektor: string;
  pemilik: {
    nama: string;
    telepon: string;
    email?: string;
  };
  wilayah: {
    kota: string;
    provinsi: string;
    alamat_lengkap?: string;
  };
  tanggal_bergabung: string;
}

export default function VerifikasiPage() {
  const [umkms, setUmkms] = useState<UMKM[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approving, setApproving] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchPendingUMKM();
  }, []);

  const fetchPendingUMKM = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/umkm/pending');

      if (!response.ok) {
        throw new Error('Gagal memuat data UMKM pending');
      }

      const data = await response.json();
      setUmkms(data.umkm || []);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (umkmId: string) => {
    setApproving(umkmId);
    try {
      const response = await fetch(`/api/umkm/${umkmId}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Gagal menyetujui UMKM');
      }

      setUmkms(umkms.filter(u => u._id !== umkmId));
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
      console.error(err);
    } finally {
      setApproving(null);
    }
  };

  // Pagination
  const totalPages = Math.ceil(umkms.length / ITEMS_PER_PAGE);
  const paginatedUmkms = umkms.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleReject = async (umkmId: string) => {
    setRejecting(umkmId);
    try {
      const response = await fetch(`/api/umkm/${umkmId}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject' })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Gagal menolak UMKM');
      }

      setUmkms(umkms.filter(u => u._id !== umkmId));
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
      console.error(err);
    } finally {
      setRejecting(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Verifikasi UMKM</h1>
        <p className="text-white/70 mt-1">
          Tinjau dan verifikasi pendaftaran UMKM baru
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-500/20 border border-red-400/30 rounded-3xl p-4 flex gap-3 backdrop-blur-xl">
          <AlertCircle className="text-red-400 mt-0.5 flex-shrink-0" size={20} />
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-4">
          <p className="text-white/70 text-sm font-medium">Menunggu Verifikasi</p>
          <p className="text-3xl font-bold text-blue-400 mt-2">
            {loading ? '-' : umkms.length}
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-4">
          <p className="text-white/70 text-sm font-medium">Halaman</p>
          <p className="text-sm text-white/70 mt-2">
            {loading ? '-' : `${currentPage} / ${totalPages}`}
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-4">
          <p className="text-white/70 text-sm font-medium">Per Halaman</p>
          <p className="text-sm text-white/70 mt-2">{ITEMS_PER_PAGE} UMKM</p>
        </div>
      </div>

      {/* UMKM List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader className="animate-spin text-purple-400" size={32} />
        </div>
      ) : umkms.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 text-center">
          <CheckCircle2 className="mx-auto text-green-400 mb-4" size={48} />
          <p className="text-white text-lg font-semibold">Semua Terverifikasi!</p>
          <p className="text-white/60 mt-2">Tidak ada UMKM yang menunggu verifikasi saat ini</p>
        </div>
      ) : (
        <div className="space-y-4">
          {paginatedUmkms.map((umkm) => (
            <div key={umkm._id} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                {/* UMKM Info */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-3">{umkm.nama_usaha}</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-white/70">
                      <User size={16} className="text-purple-400" />
                      <span className="text-sm">{umkm.pemilik.nama}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                      <Phone size={16} className="text-blue-400" />
                      <span className="text-sm">{umkm.pemilik.telepon}</span>
                    </div>
                    {umkm.pemilik.email && (
                      <div className="flex items-center gap-2 text-white/70">
                        <Mail size={16} className="text-green-400" />
                        <span className="text-sm">{umkm.pemilik.email}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-white/70">
                      <MapPin size={16} className="text-red-400" />
                      <span className="text-sm">{umkm.wilayah.alamat_lengkap || umkm.wilayah.kota}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-purple-500/30 text-purple-200 border border-purple-400/50 rounded-full text-xs font-medium">
                      {umkm.sektor}
                    </span>
                    <span className="px-3 py-1 bg-blue-500/30 text-blue-200 border border-blue-400/50 rounded-full text-xs font-medium">
                      Bergabung: {new Date(umkm.tanggal_bergabung).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 md:w-48">
                  <button
                    onClick={() => handleApprove(umkm._id)}
                    disabled={approving === umkm._id}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl hover:from-green-700 hover:to-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {approving === umkm._id ? (
                      <>
                        <Loader size={16} className="animate-spin" />
                        <span>Proses...</span>
                      </>
                    ) : (
                      <>
                        <Check size={16} />
                        <span>Setujui</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleReject(umkm._id)}
                    disabled={rejecting === umkm._id}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 border border-red-400/30 text-red-300 rounded-xl hover:bg-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {rejecting === umkm._id ? (
                      <>
                        <Loader size={16} className="animate-spin" />
                        <span>Proses...</span>
                      </>
                    ) : (
                      <>
                        <X size={16} />
                        <span>Tolak</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && umkms.length > ITEMS_PER_PAGE && (
        <div className="flex items-center justify-center gap-2 mt-8">
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
    </div>
  );
}

