'use client';

import { Plus, Eye, Loader, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { formatCurrencyFull } from '@/lib/formatter';

interface UMKM {
  _id: string;
  nama_usaha: string;
  sektor: string;
  legalitas?: { status_verifikasi?: string };
  summary_terakhir?: { omzet_terakhir: number; bulan: number };
}

export default function OwnerUMKMListPage() {
  const [umkms, setUmkms] = useState<UMKM[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOwnerUMKMs() {
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
    fetchOwnerUMKMs();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">💼 Usaha Saya</h1>
            <p className="text-white/60">Kelola semua UMKM Anda dan input laporan keuangan</p>
          </div>
          <Link
            href="/dashboard/owner/umkm/create"
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 active:scale-95"
          >
            <Plus size={20} />
            UMKM Baru
          </Link>
        </div>

        {/* UMKM List */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-8 border-b border-white/10">
            <h2 className="text-2xl font-bold text-white">📋 Daftar Usaha</h2>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <Loader className="animate-spin mx-auto mb-4 text-cyan-400" size={32} />
              <p className="text-white/60">Memuat data UMKM Anda...</p>
            </div>
          ) : umkms.length === 0 ? (
            <div className="p-12 text-center">
              <AlertCircle className="mx-auto mb-4 text-white/40" size={40} />
              <p className="text-white/60 mb-4">Anda belum mendaftarkan UMKM apapun.</p>
              <Link href="/dashboard/owner/umkm/create" className="inline-block px-6 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 rounded-xl transition-colors">
                Daftar UMKM Pertama Anda →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {umkms.map((umkm) => (
                <div key={umkm._id} className="p-6 hover:bg-white/5 transition-colors border-white/10">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-bold text-white text-lg">{umkm.nama_usaha}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                          umkm.legalitas?.status_verifikasi === 'VERIFIED'
                            ? 'bg-green-500/30 text-green-300'
                            : umkm.legalitas?.status_verifikasi === 'PENDING'
                            ? 'bg-yellow-500/30 text-yellow-300'
                            : 'bg-red-500/30 text-red-300'
                        }`}>
                          {umkm.legalitas?.status_verifikasi || 'PENDING'}
                        </span>
                      </div>
                      <div className="space-y-2 text-white/70 text-sm">
                        <p>🏢 Sektor: <span className="text-white font-medium">{umkm.sektor}</span></p>
                        {umkm.summary_terakhir?.omzet_terakhir && (
                          <p>💰 Omzet Terakhir: <span className="text-cyan-300 font-medium">{formatCurrencyFull(umkm.summary_terakhir.omzet_terakhir)}</span></p>
                        )}
                      </div>
                    </div>
                    <Link
                      href={`/dashboard/owner/umkm/${umkm._id}/lapor`}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/40 hover:to-blue-500/40 border border-cyan-400/50 text-cyan-300 hover:text-cyan-200 rounded-xl transition-all whitespace-nowrap font-semibold"
                    >
                      <Eye size={18} />
                      <span>Lapor</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}