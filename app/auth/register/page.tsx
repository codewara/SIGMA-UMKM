'use client';

import { Mail, Lock, User, IdCard, Phone, Eye, EyeOff, Loader, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) alert(`Registration failed: ${data.error || 'Unknown error'}`);
      else router.replace(data.redirect);
    } catch (error) {
      console.error('Registration error:', error);
    }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-[#0f172a] relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Content */}
      <div className="w-full max-w-xl relative z-10">
        {/* Logo/Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl mb-4 shadow-lg shadow-blue-500/50">
            <span className="text-white text-2xl font-black">Σ</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">SIGMA UMKM</h1>
          <p className="text-white/70 text-sm">Sistem Monitoring Pendapatan UMKM SDG 8</p>
        </div>

        {/* Register Card */}
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 p-8 shadow-2xl mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Buat Akun</h2>
          <p className="text-white/60 text-sm mb-6">Isi formulir di bawah untuk membuat akun baru</p>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-5">
              {/* Nama Lengkap Input */}
              <div className="col-span-1">
                <label className="block text-sm font-semibold text-white/90 mb-2">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-4 text-white/50 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Nama Lengkap"
                    name="fullName"
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* NIK Input */}
              <div className="col-span-1">
                <label className="block text-sm font-semibold text-white/90 mb-2">
                  NIK
                </label>
                <div className="relative">
                  <IdCard className="absolute left-4 top-4 text-white/50 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="NIK"
                    name="NIK"
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="col-span-1">
                <label className="block text-sm font-semibold text-white/90 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-4 text-white/50 w-5 h-5" />
                  <input
                    type="email"
                    placeholder="admin@sigma-umkm.com"
                    name="email"
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Phone Input */}
              <div className="col-span-1">
                <label className="block text-sm font-semibold text-white/90 mb-2">
                  Nomor Telepon
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-4 text-white/50 w-5 h-5" />
                  <input
                    type="tel"
                    placeholder="081234567890"
                    name="phone"
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="col-span-1 mb-6">
                <label className="block text-sm font-semibold text-white/90 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-4 text-white/50 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Masukkan password"
                    name="password"
                    required
                    className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-white/50 hover:text-white/80 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="col-span-1 mb-6">
                <label className="block text-sm font-semibold text-white/90 mb-2">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-4 text-white/50 w-5 h-5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Ulangi password"
                    name="passwordConfirm"
                    required
                    className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-4 text-white/50 hover:text-white/80 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 rounded border-white/30 bg-white/10 text-blue-400 focus:ring-2 focus:ring-blue-400"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-white/70">
                Saya setuju dengan{' '}
                <Link href="#" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                  Syarat & Ketentuan
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-2xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  Daftar
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Register Link */}
        <div className="text-center text-white/60 text-sm">
          <p>
            Sudah punya akun?{' '}
            <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors" replace>
              Masuk di sini
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-medium">
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
