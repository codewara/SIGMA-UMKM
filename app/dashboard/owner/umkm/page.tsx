'use client';

import { Plus, Eye } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface UMKM {
  _id: string;
  nama_usaha: string;
  sektor: string;
  verification_status: string;
  summary_terakhir?: { omzet_terakhir: number; bulan: number };
}

export default function OwnerUMKMListPage() {
  const [umkms, setUmkms] = useState<UMKM[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOwnerUMKMs();
  }, []);

  const fetchOwnerUMKMs = async () => {
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

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Daftar UMKM Saya</h1>
            <p className="text-white/70">Kelola semua usaha Anda</p>
          </div>
          <Link
            href="/dashboard/owner/umkm/create"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl transition-all"
          >
            <Plus size={20} />
            UMKM Baru
          </Link>
        </div>

        {/* UMKM List */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-white/20">
            <h2 className="text-xl font-semibold text-white">Usaha Anda</h2>
          </div>

          {loading ? (
            <div className="p-6 text-center text-white/60">Memuat data...</div>
          ) : umkms.length === 0 ? (
            <div className="p-6 text-center text-white/60">
              <p>Anda belum mendaftarkan UMKM apapun.</p>
              <Link href="/dashboard/owner/umkm/create" className="text-blue-400 hover:text-blue-300 mt-2 inline-block">
                Daftar UMKM Pertama Anda
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/20">
              {umkms.map((umkm) => (
                <div key={umkm._id} className="p-6 hover:bg-white/5 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-white">{umkm.nama_usaha}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          umkm.verification_status === 'APPROVED'
                            ? 'bg-green-500/30 text-green-300'
                            : umkm.verification_status === 'PENDING'
                            ? 'bg-yellow-500/30 text-yellow-300'
                            : 'bg-red-500/30 text-red-300'
                        }`}>
                          {umkm.verification_status}
                        </span>
                      </div>
                      <p className="text-white/60 text-sm">Sektor: {umkm.sektor}</p>
                      {umkm.summary_terakhir?.omzet_terakhir && (
                        <p className="text-white/60 text-sm mt-1">
                          Omzet terakhir: Rp {umkm.summary_terakhir.omzet_terakhir.toLocaleString('id-ID')}
                        </p>
                      )}
                    </div>
                    <Link
                      href={`/dashboard/owner/umkm/${umkm._id}/lapor`}
                      className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                    >
                      <Eye size={20} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
  );
}

