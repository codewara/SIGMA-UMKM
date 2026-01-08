'use client';
import { Loader } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [timer, setTimer] = useState(5);
  const params = useParams();

  useEffect(() => {
    async function verifyEmail() {
      setLoading(true);
      try {
        const response = await fetch(`/api/auth/verify-email?token=${params.token}`);
        const data = await response.json();
        setMessage(data.message);
      } catch (error) {
        console.error(error);
      } finally { setLoading(false); }
    }
    verifyEmail();
  }, [params.token]);

  // Countdown effect
  useEffect(() => {
      if (timer <= 0) {
        close();
        return;
      };
      const interval = setInterval(() => {
          setTimer((t) => t - 1);
      }, 1000);
      return () => clearInterval(interval);
  }, [timer]);

  return (
    <div className="min-h-screen bg-[#0f172a] relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Content */}
      <div className="w-full max-w-md relative z-10">
        {/* Logo/Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl mb-4 shadow-lg shadow-blue-500/50">
            <span className="text-white text-2xl font-black">Σ</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">SIGMA UMKM</h1>
          <p className="text-white/70 text-sm">Sistem Monitoring Pendapatan UMKM SDG 8</p>
        </div>

        {/* Card */}
        {loading ? (
          <div className="flex justify-center">
            <Loader className="w-5 h-5 animate-spin" />
          </div>
        ) : (
          <div className={`bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 p-8 shadow-2xl ${loading ? 'flex justify-center' : '' }`}>
            <h2 className="text-2xl font-bold text-white mb-2">{message}</h2>
            <p className="text-white/60 text-sm">Laman ini akan otomatis tertutup dalam {timer}...</p>
          </div>
        )}
      </div>
    </div>
  );
}
