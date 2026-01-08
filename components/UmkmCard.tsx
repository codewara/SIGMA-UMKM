'use client';
import { MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { User, UMKM } from '@/lib/types';

interface UmkmCardProps {
  umkm: UMKM;
  user: User | null;
}

export default function UmkmCard({ umkm, user }: UmkmCardProps) {
  const router = useRouter();

  // Public/UMKM_OWNER View - Simple Card
  if (!user || user.role === 'UMKM_OWNER') {
    return (
      <div className="group relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition"></div>
        <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1">
          {/* Header */}
          <div className="relative bg-gradient-to-br from-cyan-500 to-blue-600 p-5 text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative flex items-start space-x-3">
              <div className="text-3xl flex-shrink-0">{umkm.icon}</div>
              <div className="flex-1">
                <h3 className="text-lg font-bold leading-tight">{umkm.name}</h3>
                <p className="text-cyan-100 text-sm mt-1">{umkm.category}</p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-5 space-y-3">
            <div className="flex items-start space-x-2 text-gray-700">
              <MapPin className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">{umkm.wilayah?.alamat_lengkap || 'Alamat tidak tersedia'}</p>
                <p className="text-xs text-gray-500">{umkm.wilayah?.kota}, {umkm.wilayah?.provinsi}</p>
              </div>
            </div>

            {umkm.tanggal_bergabung && (
              <div className="bg-cyan-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Bergabung Sejak</p>
                <p className="text-sm font-bold text-cyan-700">
                  {new Date(umkm.tanggal_bergabung).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <button
            onClick={() => router.push(`/umkm/${umkm.id}`)}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-4 font-bold transition"
          >
            Lihat Detail
          </button>
        </div>
      </div>
    );
  }

  // PEJABAT View - Medium Detail Card
  if (user.role === 'PEJABAT') {
    return (
      <div className="group relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition"></div>
        <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1">
          {/* Header */}
          <div className="relative bg-gradient-to-br from-purple-500 to-pink-500 p-4 text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
            <div className="relative flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="text-2xl flex-shrink-0">{umkm.icon}</div>
                <div>
                  <h3 className="text-base font-bold leading-tight">{umkm.name}</h3>
                  <p className="text-purple-100 text-xs mt-0.5">{umkm.category}</p>
                </div>
              </div>
              <div className="inline-block bg-white/30 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-semibold">
                {umkm.badge}
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3">
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="w-4 h-4 text-purple-600 flex-shrink-0" />
              <span className="text-sm font-medium">{umkm.location}</span>
            </div>

            {umkm.pemilik && (
              <div className="bg-purple-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Pemilik</p>
                <p className="text-sm font-bold text-gray-800">{umkm.pemilik.nama}</p>
                <p className="text-xs text-gray-600 mt-1">{umkm.pemilik.telepon}</p>
              </div>
            )}

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3">
              <p className="text-gray-600 text-xs font-medium mb-1">Omzet Terakhir</p>
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{umkm.revenue}</p>
                {umkm.bulan && (
                  <span className="text-xs text-gray-500">Bulan {umkm.bulan}</span>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <button
            onClick={() => router.push(`/umkm/${umkm.id}`)}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 font-bold transition"
          >
            Lihat Detail
          </button>
        </div>
      </div>
    );
  }

  // ADMIN View - Full Detail Card
  if (user.role === 'ADMIN') {
    return (
      <div className="group relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition"></div>
        <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1">
          {/* Header */}
          <div className="relative bg-gradient-to-br from-orange-500 to-red-500 p-4 text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
            <div className="relative">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl flex-shrink-0">{umkm.icon}</div>
                  <div>
                    <h3 className="text-base font-bold leading-tight">{umkm.name}</h3>
                    <p className="text-orange-100 text-xs mt-0.5">{umkm.category}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="inline-block bg-white/30 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-semibold">
                    {umkm.badge}
                  </div>
                  {umkm.is_deleted && (
                    <div className="inline-block bg-red-600 px-2 py-0.5 rounded-full text-xs font-semibold">
                      Deleted
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-4 space-y-2">
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="w-4 h-4 text-orange-600 flex-shrink-0" />
              <span className="text-xs font-medium">{umkm.location}</span>
            </div>

            {umkm.pemilik && (
              <div className="bg-orange-50 rounded-lg p-2">
                <p className="text-xs text-gray-500">Pemilik</p>
                <p className="text-sm font-bold text-gray-800">{umkm.pemilik.nama}</p>
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-gray-600">{umkm.pemilik.telepon}</p>
                  <p className="text-xs text-gray-600">{umkm.pemilik.email}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">NIK: {umkm.pemilik.nik}</p>
              </div>
            )}

            {umkm.legalitas && (
                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-orange-50 rounded p-2">
                        <p className="text-xs text-gray-500">NIB</p>
                        <p className="text-xs font-bold text-gray-800">{umkm.legalitas.nib || '-'}</p>
                    </div>
                    <div className="bg-orange-50 rounded p-2">
                        <p className="text-xs text-gray-500">PIRT</p>
                        <p className="text-xs font-bold text-gray-800">{umkm.legalitas.pirt || '-'}</p>
                    </div>
                </div>
            )}

            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-3">
                <p className="text-gray-600 text-xs font-medium mb-1">Omzet Terakhir</p>
                <div className="flex items-center justify-between">
                    <p className="text-lg font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">{umkm.revenue}</p>
                    {umkm.bulan && (
                        <span className="text-xs text-gray-500">Bulan {umkm.bulan}</span>
                    )}
                </div>
            </div>
          </div>

          {/* Footer */}
          <button
            onClick={() => router.push(`/umkm/${umkm.id}`)}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white py-4 font-bold transition text-sm uppercase tracking-wider"
          >
            Manage UMKM
          </button>
        </div>
      </div>
    );
  }

  return null;
}
