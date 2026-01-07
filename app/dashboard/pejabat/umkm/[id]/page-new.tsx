'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  AlertCircle,
  Flag,
  Loader,
  ArrowLeft,
  MapPin,
  User,
  Phone,
  Mail,
  DollarSign,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';

interface UMKM {
  _id: string;
  nama_usaha: string;
  sektor: string;
  status: string;
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
  legalitas?: {
    nib?: string;
    pirt?: string;
    halal?: boolean;
  };
  created_at: string;
}

interface FinancialLog {
  bulan: number;
  tahun: number;
  omzet: number;
  jumlah_karyawan?: number;
  is_flagged?: boolean;
  tgl_input: string;
}

export default function DetailUMKMPage() {
  const params = useParams();
  const umkmId = params.id as string;

  const [umkm, setUmkm] = useState<UMKM | null>(null);
  const [logs, setLogs] = useState<FinancialLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [flagging, setFlagging] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [umkmId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch UMKM profile
      const umkmRes = await fetch(`/api/umkm/${umkmId}`);
      if (umkmRes.ok) {
        const umkmData = await umkmRes.json();
        setUmkm(umkmData.umkm);
      }

      // Fetch financial logs
      const logsRes = await fetch(`/api/analytics/financial/${umkmId}?tahun=2024`);
      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setLogs(logsData.logs || []);
      }
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFlag = async (tahun: number, bulan: number, flagged: boolean) => {
    try {
      setFlagging(`${tahun}-${bulan}`);
      const response = await fetch(`/api/analytics/financial/${umkmId}/flag`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tahun, bulan, flagged: !flagged }),
      });

      if (!response.ok) {
        throw new Error('Gagal mengubah status penandaan');
      }

      setSuccess('Status penandaan berhasil diubah');

      // Update local state
      setLogs(
        logs.map(log =>
          log.tahun === tahun && log.bulan === bulan
            ? { ...log, is_flagged: !flagged }
            : log
        )
      );

      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Gagal mengubah status');
    } finally {
      setFlagging(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader size={32} className="animate-spin text-blue-600" />
      </div>
    );
  }

  if (!umkm) {
    return (
      <div className="space-y-4">
        <Link
          href="/dashboard/pejabat"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft size={20} />
          Kembali
        </Link>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <AlertCircle size={48} className="mx-auto text-yellow-600 mb-3" />
          <p className="font-semibold text-yellow-900">UMKM tidak ditemukan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/pejabat/verifikasi"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{umkm.nama_usaha}</h1>
          <p className="text-gray-600 mt-1">{umkm.sektor}</p>
        </div>
      </div>

      {/* Error & Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="text-red-600 mt-0.5" size={20} />
          <div>
            <p className="font-semibold text-red-900">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
          <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center text-white text-sm">✓</div>
          <div>
            <p className="font-semibold text-green-900">{success}</p>
          </div>
        </div>
      )}

      {/* UMKM Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pemilik Info */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Data Pemilik</h2>
          <div className="space-y-3">
            <div className="flex gap-3">
              <User size={20} className="text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Nama</p>
                <p className="font-medium text-gray-900">{umkm.pemilik.nama}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Phone size={20} className="text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Telepon</p>
                <p className="font-medium text-gray-900">{umkm.pemilik.telepon}</p>
              </div>
            </div>
            {umkm.pemilik.email && (
              <div className="flex gap-3">
                <Mail size={20} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{umkm.pemilik.email}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Lokasi Info */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Lokasi Usaha</h2>
          <div className="space-y-3">
            <div className="flex gap-3">
              <MapPin size={20} className="text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Kota</p>
                <p className="font-medium text-gray-900">{umkm.wilayah.kota}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <MapPin size={20} className="text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Provinsi</p>
                <p className="font-medium text-gray-900">{umkm.wilayah.provinsi}</p>
              </div>
            </div>
            {umkm.wilayah.alamat_lengkap && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Alamat Lengkap</p>
                <p className="font-medium text-gray-900">
                  {umkm.wilayah.alamat_lengkap}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Info */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Status Verifikasi</h2>
        <div className="flex items-center gap-3">
          <div
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              umkm.status === 'VERIFIED'
                ? 'bg-green-100 text-green-800'
                : umkm.status === 'REJECTED'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {umkm.status === 'VERIFIED'
              ? 'Diverifikasi'
              : umkm.status === 'REJECTED'
                ? 'Ditolak'
                : 'Menunggu'}
          </div>
          <p className="text-gray-600 text-sm">
            Terdaftar: {new Date(umkm.created_at).toLocaleDateString('id-ID')}
          </p>
        </div>
      </div>

      {/* Financial Logs Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Log Keuangan Bulanan</h2>
          <p className="text-sm text-gray-600 mt-1">
            Pantau dan tandai data yang mencurigakan
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Periode
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Omzet
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Karyawan
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Tanggal Input
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-600">
                    Belum ada data keuangan
                  </td>
                </tr>
              ) : (
                logs.map(log => (
                  <tr
                    key={`${log.tahun}-${log.bulan}`}
                    className={`hover:bg-gray-50 ${
                      log.is_flagged ? 'bg-red-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {new Date(log.tahun, log.bulan - 1).toLocaleDateString(
                        'id-ID',
                        {
                          month: 'long',
                          year: 'numeric',
                        }
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-1">
                        <DollarSign size={16} className="text-green-600" />
                        <span className="font-medium text-gray-900">
                          Rp {log.omzet?.toLocaleString('id-ID') || '0'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {log.jumlah_karyawan || '-'} orang
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(log.tgl_input).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {log.is_flagged ? (
                        <div className="flex items-center gap-1 text-red-600 font-semibold">
                          <AlertTriangle size={16} />
                          Ditandai
                        </div>
                      ) : (
                        <span className="text-gray-600">Normal</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() =>
                          handleFlag(log.tahun, log.bulan, log.is_flagged || false)
                        }
                        disabled={flagging === `${log.tahun}-${log.bulan}`}
                        className={`flex items-center justify-center gap-2 px-3 py-1 rounded transition-colors text-sm font-medium ${
                          log.is_flagged
                            ? 'bg-red-100 text-red-600 hover:bg-red-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {flagging === `${log.tahun}-${log.bulan}` ? (
                          <Loader size={14} className="animate-spin" />
                        ) : (
                          <Flag size={14} />
                        )}
                        {log.is_flagged ? 'Hapus Flag' : 'Tandai'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
