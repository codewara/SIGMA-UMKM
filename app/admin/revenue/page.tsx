'use client';

import { Menu, LogOut, TrendingUp, BarChart3, ArrowDown, MapPin, Users, Map, Plus, Search, DollarSign } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminRevenuePage() {
  const [showSidebar, setShowSidebar] = useState(false);
  const pathname = usePathname();

  const allRevenueData = [
    { id: 1, umkm: 'Konveksi Sejahtera', revenue: 320, growth: 15.2 },
    { id: 2, umkm: 'Toko Roti Berkah', revenue: 250.5, growth: 12.5 },
    { id: 3, umkm: 'Kerajinan Tangan Indah', revenue: 180.2, growth: 22.1 },
    { id: 4, umkm: 'Toko Elektronik Jaya', revenue: 165.8, growth: 8.3 },
    { id: 5, umkm: 'Warung Makan Sedap', revenue: 155.3, growth: 18.5 },
    { id: 6, umkm: 'Toko Pakaian Modern', revenue: 145.7, growth: 5.2 },
    { id: 7, umkm: 'Bengkel Mobil ABC', revenue: 135.2, growth: 10.1 },
    { id: 8, umkm: 'Salon Kecantikan Putri', revenue: 125.9, growth: 14.3 },
    { id: 9, umkm: 'Toko Furniture Premium', revenue: 118.4, growth: 7.8 },
    { id: 10, umkm: 'Jasa Fotografi Profesional', revenue: 112.6, growth: 25.4 },
    { id: 11, umkm: 'Toko Bunga Segar', revenue: 105.3, growth: 3.1 },
    { id: 12, umkm: 'Laundry Express', revenue: 98.7, growth: 9.2 },
    { id: 13, umkm: 'Toko Mainan Anak', revenue: 92.1, growth: 11.5 },
    { id: 14, umkm: 'Kafe Cozy Corner', revenue: 87.5, growth: 6.7 },
    { id: 15, umkm: 'Toko Sepatu Sport', revenue: 82.3, growth: 4.2 },
    { id: 16, umkm: 'Jasa Cleaning Service', revenue: 78.9, growth: 2.8 },
    { id: 17, umkm: 'Toko Buku Bekas', revenue: 72.4, growth: 1.5 },
    { id: 18, umkm: 'Toko Alat Tulis', revenue: 65.8, growth: 0.9 },
    { id: 19, umkm: 'Workshop Kayu', revenue: 58.2, growth: -1.2 },
    { id: 20, umkm: 'Toko Tanaman Hias', revenue: 52.6, growth: -2.5 },
    { id: 21, umkm: 'Warung Kopi Tradisional', revenue: 48.3, growth: -3.1 },
    { id: 22, umkm: 'Toko Keramik Murah', revenue: 42.7, growth: -4.5 },
    { id: 23, umkm: 'Jasa Jahit Baju', revenue: 38.9, growth: -5.2 },
    { id: 24, umkm: 'Toko Minyak Tanah', revenue: 35.2, growth: -6.1 },
    { id: 25, umkm: 'Warung Jamu Tradisional', revenue: 31.5, growth: -7.3 },
    { id: 26, umkm: 'Toko Barang Bekas', revenue: 28.8, growth: -8.4 },
    { id: 27, umkm: 'Toko Gula Pasir', revenue: 25.1, growth: -9.2 },
    { id: 28, umkm: 'Jasa Tukang Kayu', revenue: 22.4, growth: -10.1 },
    { id: 29, umkm: 'Warung Nasi Kuning', revenue: 19.7, growth: -11.3 },
    { id: 30, umkm: 'Toko Roti Kecil', revenue: 16.2, growth: -12.5 },
  ];

  const topRevenueData = [...allRevenueData].sort((a, b) => b.revenue - a.revenue).slice(0, 3);
  const lowRevenueData = [...allRevenueData].sort((a, b) => a.revenue - b.revenue).slice(0, 3);
  const top15RevenueData = [...allRevenueData].sort((a, b) => b.revenue - a.revenue).slice(0, 15);
  const low15RevenueData = [...allRevenueData].sort((a, b) => a.revenue - b.revenue).slice(0, 15);

  // Navigasi Utama (Sama dengan Halaman Overview)
  const menuItems = [
    { name: 'Overview', href: '/admin', icon: <BarChart3 size={20} /> },
    { name: 'Revenue', href: '/admin/revenue', icon: <TrendingUp size={20} /> },
    { name: 'Growth', href: '/admin/growth', icon: <Users size={20} /> },
    { name: 'Heatmap', href: '/admin/heatmap', icon: <Map size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-[#0f172a] bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-900 to-black text-slate-200 overflow-hidden">
      
    {/* SIDEBAR - Navigasi Utama Konsisten */}
        <aside className={`
        ${showSidebar ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 fixed lg:static inset-y-0 left-0 w-72 
        bg-white/5 backdrop-blur-2xl border-r border-white/10 z-50 transition-transform duration-300 flex flex-col
        `}>
        {/* Logo Section */}
        <div className="p-8 border-b border-white/10">
            <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-blue-600/20">
                Σ
            </div>
            <span className="text-2xl font-black tracking-tighter text-white uppercase">SIGMA</span>
            </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 mt-8 px-4 space-y-2">
            <p className="px-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">
            Main Navigation
            </p>
            
            {menuItems.map((item) => (
            <Link key={item.name} href={item.href}>
                <div className={`
                flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 mb-1
                ${pathname === item.href 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                    : 'text-white/50 hover:bg-white/5 hover:text-white'}
                `}>
                {item.icon}
                <span className="font-bold text-sm tracking-wide">{item.name}</span>
                </div>
            </Link>
            ))}
        </nav>

        {/* Logout Section */}
        <div className="p-6 border-t border-white/10">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all font-bold text-sm">
            <LogOut size={18} />
            <span>Keluar</span>
            </button>
        </div>
        </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* HEADER */}
        <header className="p-6 lg:p-8 flex items-center justify-between">
          <button onClick={() => setShowSidebar(true)} className="lg:hidden p-3 bg-white/5 rounded-xl border border-white/10 text-white">
            <Menu size={24} />
          </button>
          
          <div className="ml-auto flex items-center gap-4">
            <div className="flex flex-col items-end hidden sm:block">
              <p className="text-sm font-black text-white leading-none">Admin Sigma</p>
              <p className="text-[10px] text-green-400 font-bold uppercase tracking-widest mt-1">Finance Expert</p>
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center font-black text-amber-400 shadow-xl">A</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-6 lg:px-8 pb-8">
          <div className="max-w-7xl mx-auto">
            
            <div className="mb-12">
              <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tighter uppercase">Revenue Report</h2>
              <p className="text-white/40 mt-2 font-medium tracking-wide">Data ringkasan pendapatan tertinggi dan terendah unit usaha.</p>
            </div>

            {/* TOP 3 CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {topRevenueData.map((item, idx) => (
                <div key={item.id} className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-500">
                    <TrendingUp size={80} className="text-green-400" />
                  </div>
                  <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">Rank #{idx + 1} High</p>
                  <h3 className="text-xl font-bold text-white mt-2 mb-6">{item.umkm}</h3>
                  <p className="text-white/40 text-xs font-bold uppercase mb-1">Revenue</p>
                  <p className="text-3xl font-black text-white tracking-tight">Rp {item.revenue}M</p>
                  <div className="mt-4 flex items-center gap-2 text-green-400 text-xs font-black uppercase">
                    <Plus size={14} /> {item.growth}% Growth
                  </div>
                </div>
              ))}
            </div>

            {/* LOW 3 CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {lowRevenueData.map((item, idx) => (
                <div key={item.id} className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group border-l-red-500/30">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-500">
                    <ArrowDown size={80} className="text-red-400" />
                  </div>
                  <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">Rank #{idx + 1} Low</p>
                  <h3 className="text-xl font-bold text-white mt-2 mb-6">{item.umkm}</h3>
                  <p className="text-white/40 text-xs font-bold uppercase mb-1">Revenue</p>
                  <p className="text-3xl font-black text-white tracking-tight">Rp {item.revenue}M</p>
                  <div className={`mt-4 flex items-center gap-2 text-xs font-black uppercase ${item.growth > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {item.growth > 0 ? <TrendingUp size={14} /> : <ArrowDown size={14} />} 
                    {item.growth}% Performance
                  </div>
                </div>
              ))}
            </div>

            {/* TABLE RANKING */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* TOP 15 */}
              <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col">
                <div className="p-8 bg-white/5 border-b border-white/10">
                  <h4 className="text-lg font-black text-white uppercase tracking-tighter italic">Top 15 Performance ⬆️</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="text-[10px] uppercase font-black tracking-widest text-white/30 border-b border-white/5">
                      <tr>
                        <th className="px-8 py-4">#</th>
                        <th className="px-8 py-4">UMKM</th>
                        <th className="px-8 py-4 text-right">Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {top15RevenueData.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                          <td className="px-8 py-5 text-xs font-black text-white/30">{idx + 1}</td>
                          <td className="px-8 py-5 text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{item.umkm}</td>
                          <td className="px-8 py-5 text-right font-mono text-green-400 font-bold">Rp {item.revenue}M</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* LOW 15 */}
              <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col">
                <div className="p-8 bg-white/5 border-b border-white/10">
                  <h4 className="text-lg font-black text-white uppercase tracking-tighter italic">Bottom 15 Performance ⬇️</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="text-[10px] uppercase font-black tracking-widest text-white/30 border-b border-white/5">
                      <tr>
                        <th className="px-8 py-4">#</th>
                        <th className="px-8 py-4">UMKM</th>
                        <th className="px-8 py-4 text-right">Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {low15RevenueData.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                          <td className="px-8 py-5 text-xs font-black text-white/30">{idx + 1}</td>
                          <td className="px-8 py-5 text-sm font-bold text-white group-hover:text-red-400 transition-colors">{item.umkm}</td>
                          <td className="px-8 py-5 text-right font-mono text-red-400 font-bold">Rp {item.revenue}M</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}