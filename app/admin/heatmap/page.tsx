'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminHeatmapPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/admin/heatmap');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <p className="text-slate-400">Redirecting to Admin Dashboard...</p>
    </div>
  );

  const locationData = [
    { id: 1, location: 'Jakarta Timur', umkmCount: 45, totalRevenue: 1200, avgRevenue: 26.7, topUmkm: 'Toko Roti Berkah', x: 65, y: 35, intensity: 90 },
    { id: 2, location: 'Bandung', umkmCount: 32, totalRevenue: 890, avgRevenue: 27.8, topUmkm: 'Kerajinan Tangan Indah', x: 45, y: 50, intensity: 65 },
    { id: 3, location: 'Surabaya', umkmCount: 28, totalRevenue: 750, avgRevenue: 26.8, topUmkm: 'Konveksi Sejahtera', x: 75, y: 70, intensity: 55 },
    { id: 4, location: 'Yogyakarta', umkmCount: 18, totalRevenue: 420, avgRevenue: 23.3, topUmkm: 'Batik Jogja Solo', x: 50, y: 65, intensity: 35 },
    { id: 5, location: 'Medan', umkmCount: 15, totalRevenue: 350, avgRevenue: 23.3, topUmkm: 'Kopi Gayo Medan', x: 35, y: 20, intensity: 28 },
  ];

  const menuItems = [
    { name: 'Overview', href: '/admin', icon: <BarChart3 size={20} /> },
    { name: 'Revenue', href: '/admin/revenue', icon: <TrendingUp size={20} /> },
    { name: 'Growth', href: '/admin/growth', icon: <Users size={20} /> },
    { name: 'Heatmap', href: '/admin/heatmap', icon: <MapIcon size={20} /> },
  ];

  const getHeatmapColor = (intensity: number) => {
    if (intensity >= 80) return '#ef4444'; // Red
    if (intensity >= 60) return '#f97316'; // Orange
    if (intensity >= 40) return '#eab308'; // Yellow
    if (intensity >= 20) return '#84cc16'; // Lime
    return '#22c55e'; // Green
  };

  return (
    <div className="flex h-screen bg-[#0f172a] bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-900 to-black text-slate-200 overflow-hidden">
      
      {/* SIDEBAR - Konsisten dengan Overview, Revenue, & Growth */}
      <aside className={`
        ${showSidebar ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 fixed lg:static inset-y-0 left-0 w-72 
        bg-white/5 backdrop-blur-2xl border-r border-white/10 z-50 transition-transform duration-300 flex flex-col
      `}>
        <div className="p-8 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-blue-600/20">Σ</div>
            <span className="text-2xl font-black tracking-tighter text-white uppercase">SIGMA</span>
          </div>
        </div>

        <nav className="flex-1 mt-8 px-4 space-y-2">
          <p className="px-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">Main Navigation</p>
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

        <div className="p-6 border-t border-white/10">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all font-bold text-sm">
            <LogOut size={18} /> Keluar
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="p-6 lg:p-8 flex items-center justify-between">
          <button onClick={() => setShowSidebar(true)} className="lg:hidden p-3 bg-white/5 rounded-xl border border-white/10 text-white">
            <Menu size={24} />
          </button>
          <div className="ml-auto flex items-center gap-4">
            <div className="flex flex-col items-end hidden sm:block">
              <p className="text-sm font-black text-white leading-none">Admin Sigma</p>
              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mt-1">SIG Expert</p>
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center font-black text-amber-400 shadow-xl">A</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-6 lg:px-8 pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tighter uppercase italic">Geographic Heatmap</h2>
              <p className="text-white/40 mt-2 font-medium tracking-wide">Pemetaan densitas UMKM berdasarkan wilayah administratif.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Heatmap Glass Panel */}
              <div className="lg:col-span-2 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-white tracking-tight italic">Distribusi UMKM Indonesia</h3>
                  <div className="flex gap-2">
                    <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/10 text-[10px] font-bold text-white/50">LIVE MAP</div>
                  </div>
                </div>
                
                <div className="relative group">
                  <svg viewBox="0 0 100 100" className="w-full h-auto bg-black/20 rounded-[2rem] border border-white/5 overflow-hidden">
                    {/* Grid lines */}
                    <g stroke="white" strokeWidth="0.05" opacity="0.1">
                      {[10, 20, 30, 40, 50, 60, 70, 80, 90].map(i => (
                        <line key={`v${i}`} x1={i} y1="0" x2={i} y2="100" />
                      ))}
                      {[10, 20, 30, 40, 50, 60, 70, 80, 90].map(i => (
                        <line key={`h${i}`} x1="0" y1={i} x2="100" y2={i} />
                      ))}
                    </g>

                    {/* Heatmap circles */}
                    {locationData.map((loc) => (
                      <g key={loc.id} className="cursor-pointer" onClick={() => setSelectedLocation(loc)}>
                        <circle
                          cx={loc.x}
                          cy={loc.y}
                          r={Math.sqrt(loc.intensity) * 0.8}
                          fill={getHeatmapColor(loc.intensity)}
                          className="opacity-40 animate-pulse"
                        />
                        <circle
                          cx={loc.x}
                          cy={loc.y}
                          r={Math.sqrt(loc.intensity) * 0.4}
                          fill={getHeatmapColor(loc.intensity)}
                          className="opacity-80"
                        />
                        <text
                          x={loc.x}
                          y={loc.y + 1}
                          textAnchor="middle"
                          fontSize="2.5"
                          fontWeight="900"
                          fill="white"
                          style={{ pointerEvents: 'none' }}
                        >
                          {loc.umkmCount}
                        </text>
                        <text
                          x={loc.x}
                          y={loc.y + Math.sqrt(loc.intensity) * 0.8 + 4}
                          textAnchor="middle"
                          fontSize="2"
                          fontWeight="700"
                          fill="white"
                          opacity="0.6"
                        >
                          {loc.location}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>

                {/* Legend Glass */}
                <div className="mt-8 p-6 bg-white/5 rounded-3xl border border-white/5">
                  <p className="text-xs font-black text-white/30 uppercase tracking-[0.2em] mb-4">Indikator Intensitas:</p>
                  <div className="flex flex-wrap gap-6">
                    {[
                      { label: 'Sangat Tinggi', color: 'bg-red-500' },
                      { label: 'Tinggi', color: 'bg-orange-500' },
                      { label: 'Sedang', color: 'bg-yellow-500' },
                      { label: 'Rendah', color: 'bg-lime-500' },
                      { label: 'Minimal', color: 'bg-green-500' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${item.color} shadow-lg shadow-black/20`}></div>
                        <span className="text-[10px] font-bold text-white/50 uppercase tracking-tighter">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Info Panel Glass */}
              <div className="space-y-6">
                {selectedLocation ? (
                  <div className="bg-blue-600/20 backdrop-blur-3xl border border-blue-500/30 rounded-[2.5rem] shadow-2xl p-8 animate-in fade-in slide-in-from-right-4">
                    <div className="flex items-start justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-500/20 rounded-2xl">
                          <MapPin className="text-blue-400" />
                        </div>
                        <h3 className="text-2xl font-black text-white">{selectedLocation.location}</h3>
                      </div>
                      <button onClick={() => setSelectedLocation(null)} className="text-white/30 hover:text-white"><X size={20}/></button>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <p className="text-[10px] font-black text-white/30 uppercase mb-1">Populasi UMKM</p>
                        <p className="text-3xl font-black text-white">{selectedLocation.umkmCount} Unit</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <p className="text-[10px] font-black text-white/30 uppercase mb-1">Total Revenue</p>
                        <p className="text-3xl font-black text-green-400">Rp {selectedLocation.totalRevenue}M</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <p className="text-[10px] font-black text-white/30 uppercase mb-1">Top Business</p>
                        <p className="text-lg font-bold text-white italic">"{selectedLocation.topUmkm}"</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
                    <MapIcon size={48} className="text-white/10 mb-4" />
                    <p className="text-white/40 font-bold uppercase text-xs tracking-widest">Pilih titik lokasi untuk detail statistik</p>
                  </div>
                )}

                {/* All Locations Glass List */}
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl">
                  <div className="p-6 border-b border-white/10 bg-white/5">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Daftar Wilayah</h3>
                  </div>
                  <div className="divide-y divide-white/5 max-h-[400px] overflow-y-auto custom-scrollbar">
                    {locationData.map((loc) => (
                      <div
                        key={loc.id}
                        onClick={() => setSelectedLocation(loc)}
                        className={`p-5 flex items-center justify-between cursor-pointer transition-all hover:bg-white/5 ${selectedLocation?.id === loc.id ? 'bg-white/10' : ''}`}
                      >
                        <div>
                          <p className="font-bold text-white text-sm">{loc.location}</p>
                          <div className="flex gap-4 mt-1">
                            <span className="text-[10px] font-bold text-white/30 uppercase tracking-tighter flex items-center gap-1"><Users size={10}/> {loc.umkmCount}</span>
                            <span className="text-[10px] font-bold text-white/30 uppercase tracking-tighter flex items-center gap-1"><DollarSign size={10}/> {loc.totalRevenue}M</span>
                          </div>
                        </div>
                        <div
                          className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                          style={{ backgroundColor: getHeatmapColor(loc.intensity) }}
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}