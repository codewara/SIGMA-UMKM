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
          <p className="text-white/70 text-sm font-medium">Status Proses</p>
          <p className="text-sm text-white/70 mt-2">Periksa UMKM satu per satu</p>
        </div>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-4">
          <p className="text-white/70 text-sm font-medium">Aksi</p>
          <p className="text-sm text-white/70 mt-2">Setujui atau Tolak</p>
        </div>
      </div>
    </div>
  );
}

