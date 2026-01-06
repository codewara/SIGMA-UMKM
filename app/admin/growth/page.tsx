'use client';

import { Menu, LogOut, TrendingUp, BarChart3, ArrowUp, ArrowDown, MapPin, Users, Map } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminGrowthPage() {
  const [showSidebar, setShowSidebar] = useState(false);
  const pathname = usePathname();

  const allGrowthData = [
    { id: 1, umkm: 'Jasa Fotografi Profesional', growth: 25.4, lastMonth: 90, currentMonth: 112.6 },
    { id: 2, umkm: 'Kerajinan Tangan Indah', growth: 22.1, lastMonth: 147.4, currentMonth: 180.2 },
    { id: 3, umkm: 'Warung Makan Sedap', growth: 18.5, lastMonth: 131, currentMonth: 155.3 },
    { id: 4, umkm: 'Salon Kecantikan Putri', growth: 14.3, lastMonth: 110, currentMonth: 125.9 },
    { id: 5, umkm: 'Konveksi Sejahtera', growth: 15.2, lastMonth: 277.2, currentMonth: 320 },
    { id: 6, umkm: 'Toko Roti Berkah', growth: 12.5, lastMonth: 222.8, currentMonth: 250.5 },
    { id: 7, umkm: 'Toko Elektronik Jaya', growth: 8.3, lastMonth: 153, currentMonth: 165.8 },
    { id: 8, umkm: 'Bengkel Mobil ABC', growth: 10.1, lastMonth: 122.8, currentMonth: 135.2 },
    { id: 9, umkm: 'Toko Furniture Premium', growth: 7.8, lastMonth: 110, currentMonth: 118.4 },
    { id: 10, umkm: 'Toko Pakaian Modern', growth: 5.2, lastMonth: 138.5, currentMonth: 145.7 },
    { id: 11, umkm: 'Laundry Express', growth: 9.2, lastMonth: 90.3, currentMonth: 98.7 },
    { id: 12, umkm: 'Toko Mainan Anak', growth: 11.5, lastMonth: 82.5, currentMonth: 92.1 },
    { id: 13, umkm: 'Kafe Cozy Corner', growth: 6.7, lastMonth: 82, currentMonth: 87.5 },
    { id: 14, umkm: 'Toko Sepatu Sport', growth: 4.2, lastMonth: 79, currentMonth: 82.3 },
    { id: 15, umkm: 'Toko Bunga Segar', growth: 3.1, lastMonth: 102.2, currentMonth: 105.3 },
    { id: 16, umkm: 'Jasa Cleaning Service', growth: 2.8, lastMonth: 76.7, currentMonth: 78.9 },
    { id: 17, umkm: 'Toko Buku Bekas', growth: 1.5, lastMonth: 71.4, currentMonth: 72.4 },
    { id: 18, umkm: 'Toko Alat Tulis', growth: 0.9, lastMonth: 65.2, currentMonth: 65.8 },
    { id: 19, umkm: 'Workshop Kayu', growth: -1.2, lastMonth: 59, currentMonth: 58.2 },
    { id: 20, umkm: 'Toko Tanaman Hias', growth: -2.5, lastMonth: 54, currentMonth: 52.6 },
    { id: 21, umkm: 'Warung Kopi Tradisional', growth: -3.1, lastMonth: 49.8, currentMonth: 48.3 },
    { id: 22, umkm: 'Toko Keramik Murah', growth: -4.5, lastMonth: 44.7, currentMonth: 42.7 },
    { id: 23, umkm: 'Jasa Jahit Baju', growth: -5.2, lastMonth: 41, currentMonth: 38.9 },
    { id: 24, umkm: 'Toko Minyak Tanah', growth: -6.1, lastMonth: 37.5, currentMonth: 35.2 },
    { id: 25, umkm: 'Warung Jamu Tradisional', growth: -7.3, lastMonth: 34, currentMonth: 31.5 },
    { id: 26, umkm: 'Toko Barang Bekas', growth: -8.4, lastMonth: 31.5, currentMonth: 28.8 },
    { id: 27, umkm: 'Toko Gula Pasir', growth: -9.2, lastMonth: 27.6, currentMonth: 25.1 },
    { id: 28, umkm: 'Jasa Tukang Kayu', growth: -10.1, lastMonth: 24.9, currentMonth: 22.4 },
    { id: 29, umkm: 'Warung Nasi Kuning', growth: -11.3, lastMonth: 22.2, currentMonth: 19.7 },
    { id: 30, umkm: 'Toko Roti Kecil', growth: -12.5, lastMonth: 18.6, currentMonth: 16.2 },
  ];

  const topGrowthData = [...allGrowthData].filter(d => d.growth > 0).sort((a, b) => b.growth - a.growth).slice(0, 3);
  const lowGrowthData = [...allGrowthData].filter(d => d.growth < 0).sort((a, b) => a.growth - b.growth).slice(0, 3);
  const top15GrowthData = [...allGrowthData].sort((a, b) => b.growth - a.growth).slice(0, 15);
  const low15GrowthData = [...allGrowthData].sort((a, b) => a.growth - b.growth).slice(0, 15);

  const menuItems = [
    { name: 'Overview', href: '/admin', icon: <BarChart3 size={20} /> },
    { name: 'Revenue', href: '/admin/revenue', icon: <TrendingUp size={20} /> },
    { name: 'Growth', href: '/admin/growth', icon: <Users size={20} /> },
    { name: 'Heatmap', href: '/admin/heatmap', icon: <Map size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-[#0f172a] bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-900 to-black text-slate-200 overflow-hidden font-sans">
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
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="p-6 lg:p-8 flex items-center justify-between">
          <button onClick={() => setShowSidebar(true)} className="lg:hidden p-3 bg-white/5 rounded-xl border border-white/10 text-white">
            <Menu size={24} />
          </button>
          <div className="ml-auto flex items-center gap-4">
            <div className="flex flex-col items-end hidden sm:block">
              <p className="text-sm font-black text-white leading-none">Admin Sigma</p>
              <p className="text-[10px] text-green-400 font-bold uppercase tracking-widest mt-1">Growth Analyst</p>
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center font-black text-amber-400 shadow-xl">A</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-6 lg:px-8 pb-8">
          <div className="max-w-7xl mx-auto">
            
            <div className="mb-12">
              <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tighter uppercase">Growth Analysis</h2>
              <p className="text-white/40 mt-2 font-medium tracking-wide">Analisis percepatan dan perlambatan ekonomi unit usaha.</p>
            </div>

            {/* TOP 3 GROWTH CARDS */}
            <div className="mb-12">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <ArrowUp className="text-green-400" /> Akselerasi Tertinggi
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {topGrowthData.map((item, idx) => (
                  <div key={item.id} className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <TrendingUp size={100} className="text-green-400" />
                    </div>
                    <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">Growth Leader #{idx + 1}</p>
                    <h4 className="text-xl font-bold text-white mt-2 mb-6 line-clamp-1">{item.umkm}</h4>
                    <div className="flex items-end gap-3 mb-6">
                      <p className="text-4xl font-black text-green-400 tracking-tight">+{item.growth}%</p>
                      <ArrowUp className="text-green-400 mb-2" size={24} />
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                      <div>
                        <p className="text-[10px] text-white/30 uppercase font-bold">Prev</p>
                        <p className="text-sm font-bold text-white/80">Rp {item.lastMonth}M</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/30 uppercase font-bold">Current</p>
                        <p className="text-sm font-bold text-white">Rp {item.currentMonth}M</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* LOW 3 GROWTH CARDS */}
            <div className="mb-12">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <ArrowDown className="text-red-400" /> Perlambatan Terendah
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {lowGrowthData.map((item, idx) => (
                  <div key={item.id} className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <ArrowDown size={100} className="text-red-400" />
                    </div>
                    <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">Bottom Growth #{idx + 1}</p>
                    <h4 className="text-xl font-bold text-white mt-2 mb-6 line-clamp-1">{item.umkm}</h4>
                    <div className="flex items-end gap-3 mb-6">
                      <p className="text-4xl font-black text-red-400 tracking-tight">{item.growth}%</p>
                      <ArrowDown className="text-red-400 mb-2" size={24} />
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                      <div>
                        <p className="text-[10px] text-white/30 uppercase font-bold">Prev</p>
                        <p className="text-sm font-bold text-white/80">Rp {item.lastMonth}M</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/30 uppercase font-bold">Current</p>
                        <p className="text-sm font-bold text-white">Rp {item.currentMonth}M</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* QUARTERLY CHART (GLASS VERSION) */}
            <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-8 rounded-[3rem] shadow-2xl mb-12 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50"></div>
               <h3 className="text-2xl font-black text-white mb-10 tracking-tight italic">Quarterly Growth Velocity (%)</h3>
               <div className="overflow-x-auto">
                 <div className="flex items-end justify-around h-72 min-w-[500px] gap-8">
                   {[
                     { quarter: 'Q1', k: 15.2, t: 8.5, c: 5.2 },
                     { quarter: 'Q2', k: 18.7, t: 10.2, c: -2.1 },
                     { quarter: 'Q3', k: 22.1, t: 12.5, c: -3.4 },
                   ].map((data, idx) => (
                     <div key={idx} className="flex flex-col items-center flex-1">
                       <div className="flex items-end gap-4 h-full border-b border-white/10 pb-2 w-full justify-center">
                         <div className="w-8 bg-blue-500 rounded-t-lg shadow-[0_0_15px_rgba(59,130,246,0.5)]" style={{ height: `${data.k * 8}px` }}></div>
                         <div className="w-8 bg-purple-500 rounded-t-lg shadow-[0_0_15px_rgba(168,85,247,0.5)]" style={{ height: `${data.t * 8}px` }}></div>
                         <div className={`w-8 rounded-t-lg shadow-lg ${data.c < 0 ? 'bg-red-500 shadow-red-500/30' : 'bg-emerald-500 shadow-emerald-500/30'}`} style={{ height: `${Math.abs(data.c) * 8}px` }}></div>
                       </div>
                       <p className="text-sm font-black text-white/40 mt-4 tracking-widest">{data.quarter}</p>
                     </div>
                   ))}
                 </div>
               </div>
               <div className="flex justify-center gap-8 mt-10">
                 <div className="flex items-center gap-2 text-[10px] font-black text-white/50 uppercase"><div className="w-3 h-3 bg-blue-500 rounded"></div> Kerajinan</div>
                 <div className="flex items-center gap-2 text-[10px] font-black text-white/50 uppercase"><div className="w-3 h-3 bg-purple-500 rounded"></div> Toko Roti</div>
                 <div className="flex items-center gap-2 text-[10px] font-black text-white/50 uppercase"><div className="w-3 h-3 bg-red-500 rounded"></div> Konveksi</div>
               </div>
            </div>

            {/* GROWTH TABLES */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {/* TOP 15 */}
               <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden">
                 <div className="p-8 bg-white/5 border-b border-white/10">
                   <h4 className="text-xl font-black text-white uppercase tracking-tighter">Performance Ranking ⬆️</h4>
                 </div>
                 <div className="overflow-x-auto">
                   <table className="w-full text-left">
                     <thead className="text-[10px] uppercase font-black tracking-widest text-white/30">
                       <tr className="border-b border-white/5">
                         <th className="px-8 py-4 text-center">#</th>
                         <th className="px-8 py-4">UMKM</th>
                         <th className="px-8 py-4 text-right">Growth</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5">
                       {top15GrowthData.map((item, idx) => (
                         <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                           <td className="px-8 py-5 text-center font-black text-white/20">{idx + 1}</td>
                           <td className="px-8 py-5 font-bold text-white group-hover:text-blue-400 transition-colors">{item.umkm}</td>
                           <td className="px-8 py-5 text-right font-mono font-bold text-green-400">+{item.growth}%</td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               </div>

               {/* LOW 15 */}
               <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden">
                 <div className="p-8 bg-white/5 border-b border-white/10">
                   <h4 className="text-xl font-black text-white uppercase tracking-tighter">Growth Slowdown ⬇️</h4>
                 </div>
                 <div className="overflow-x-auto">
                   <table className="w-full text-left">
                     <thead className="text-[10px] uppercase font-black tracking-widest text-white/30">
                       <tr className="border-b border-white/5">
                         <th className="px-8 py-4 text-center">#</th>
                         <th className="px-8 py-4">UMKM</th>
                         <th className="px-8 py-4 text-right">Growth</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5">
                       {low15GrowthData.map((item, idx) => (
                         <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                           <td className="px-8 py-5 text-center font-black text-white/20">{idx + 1}</td>
                           <td className="px-8 py-5 font-bold text-white group-hover:text-red-400 transition-colors">{item.umkm}</td>
                           <td className="px-8 py-5 text-right font-mono font-bold text-red-400">{item.growth}%</td>
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