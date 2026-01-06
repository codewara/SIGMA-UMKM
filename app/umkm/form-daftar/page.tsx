'use client'
import { useState } from "react";

export default function Page() {
  const [form, setForm] = useState({
    nama_usaha: "",
    sektor: "",
    nama_pemilik: "",
    nik: "",
    telepon: "",
    email: "",
    kota: "",
    provinsi: "",
    alamat_lengkap: "",
    lng: "",
    lat: "",
    nib: "",
    pirt: "",
    halal: false
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = () => {
    setStatus({ type: "", message: "" });

    const payload = {
      nama_usaha: form.nama_usaha,
      sektor: form.sektor,
      pemilik: {
        nama: form.nama_pemilik,
        nik: form.nik,
        telepon: form.telepon,
        email: form.email
      },
      wilayah: {
        kota: form.kota,
        provinsi: form.provinsi,
        alamat_lengkap: form.alamat_lengkap
      },
      lokasi: form.lng && form.lat
        ? { type: "Point", coordinates: [Number(form.lng), Number(form.lat)] }
        : undefined,
      legalitas: form.nib || form.pirt || form.halal
        ? { nib: form.nib || undefined, pirt: form.pirt || undefined, halal: form.halal }
        : undefined
    };

    setLoading(true);
    setTimeout(() => {
      setStatus({ type: "success", message: "UMKM berhasil didaftarkan 🎉" });
      setLoading(false);
      setForm({
        nama_usaha: "",
        sektor: "",
        nama_pemilik: "",
        nik: "",
        telepon: "",
        email: "",
        kota: "",
        provinsi: "",
        alamat_lengkap: "",
        lng: "",
        lat: "",
        nib: "",
        pirt: "",
        halal: false
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900">
      {/* Animated background blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
      <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{animationDelay: '4s'}}></div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
            Registrasi UMKM
          </h1>
          <p className="text-purple-200 text-lg">Daftarkan usaha Anda dengan mudah dan cepat</p>
        </div>

        {/* Status Alert */}
        {status.message && (
          <div className={`mb-6 p-4 rounded-2xl backdrop-blur-xl border ${
            status.type === "success" 
              ? "bg-green-500/20 border-green-400/50 text-green-100" 
              : "bg-red-500/20 border-red-400/50 text-red-100"
          } shadow-2xl animate-pulse`}>
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${status.type === "success" ? "bg-green-400" : "bg-red-400"}`}></div>
              <span className="font-medium">{status.message}</span>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Data UMKM Card */}
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Data UMKM</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <GlassField name="nama_usaha" value={form.nama_usaha} onChange={handleChange}
                         label="Nama Usaha" error={errors["nama_usaha"]} icon="🏪" />
              <GlassField name="sektor" value={form.sektor} onChange={handleChange}
                         label="Sektor" error={errors["sektor"]} icon="📊" />
            </div>
          </div>

          {/* Pemilik Card */}
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Pemilik</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <GlassField name="nama_pemilik" label="Nama Pemilik" value={form.nama_pemilik}
                         onChange={handleChange} error={errors["pemilik.nama"]} icon="👤" />
              <GlassField name="nik" label="NIK (16 digit)" value={form.nik}
                         onChange={handleChange} error={errors["pemilik.nik"]} icon="🆔" />
              <GlassField name="telepon" label="Telepon" value={form.telepon}
                         onChange={handleChange} error={errors["pemilik.telepon"]} icon="📱" />
              <GlassField name="email" label="Email" value={form.email}
                         onChange={handleChange} error={errors["pemilik.email"]} icon="✉️" />
            </div>
          </div>

          {/* Wilayah Card */}
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Wilayah</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <GlassField name="kota" label="Kota" value={form.kota}
                         onChange={handleChange} error={errors["wilayah.kota"]} icon="🏙️" />
              <GlassField name="provinsi" label="Provinsi" value={form.provinsi}
                         onChange={handleChange} error={errors["wilayah.provinsi"]} icon="🗺️" />
              <GlassField name="alamat_lengkap" label="Alamat Lengkap"
                         value={form.alamat_lengkap} onChange={handleChange}
                         error={errors["wilayah.alamat_lengkap"]} className="md:col-span-2" icon="📍" />
            </div>
          </div>

          {/* Lokasi & Legalitas Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Lokasi Card */}
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">Lokasi</h2>
              </div>
              <div className="space-y-4">
                <GlassField name="lng" label="Longitude" value={form.lng} onChange={handleChange} icon="🌐" />
                <GlassField name="lat" label="Latitude" value={form.lat} onChange={handleChange} icon="🌐" />
              </div>
            </div>

            {/* Legalitas Card */}
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">Legalitas</h2>
              </div>
              <div className="space-y-4">
                <GlassField name="nib" label="NIB" value={form.nib} onChange={handleChange} icon="📄" />
                <GlassField name="pirt" label="PIRT" value={form.pirt} onChange={handleChange} icon="📋" />
                
                <label className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                  <input 
                    type="checkbox" 
                    name="halal" 
                    checked={form.halal} 
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-2 border-white/30 bg-white/10 checked:bg-gradient-to-br checked:from-green-400 checked:to-teal-500 focus:ring-2 focus:ring-green-400/50 transition-all"
                  />
                  <span className="text-white font-medium group-hover:text-green-300 transition-colors">✨ Sertifikasi Halal</span>
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="relative group px-12 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white text-lg font-bold rounded-2xl shadow-2xl hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    🚀 Daftar UMKM Sekarang
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function GlassField({ label, error, className = "", icon, ...props }) {
  return (
    <div className={className}>
      <label className="text-sm font-medium text-purple-200 mb-2 block">{label}</label>
      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">{icon}</span>
        )}
        <input
          className={`w-full ${icon ? 'pl-12' : 'pl-4'} pr-4 py-3 rounded-xl backdrop-blur-sm bg-white/10 border ${
            error ? "border-red-400/50" : "border-white/20"
          } text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition-all duration-300 hover:bg-white/15`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-red-300 text-xs mt-2 flex items-center gap-1">
          <span>⚠️</span> {error}
        </p>
      )}
    </div>
  );
}