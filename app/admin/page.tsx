'use client';

import { Menu, LogOut, BarChart3, TrendingUp, MapPin, Users, Plus, Search, Edit, Trash2, Phone, Mail, Eye, X, Map } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminDashboard() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedUmkm, setSelectedUmkm] = useState<any>(null);
  const [umkmList, setUmkmList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    fetchUserInfo();
    fetchUMKM();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      setUserInfo(data);

      // Redirect if not admin
      if (!data.authenticated || data.user?.role !== 'ADMIN') {
        window.location.href = '/';
      }
    } catch (err) {
      console.error('Error fetching user info:', err);
      window.location.href = '/';
    }
  };

  const fetchUMKM = async () => {
    try {
      const res = await fetch('/api/umkm');
      const data = await res.json();
      setUmkmList(data.data || []);
    } catch (err) {
      console.error('Error fetching UMKM:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus UMKM ini?')) return;

    try {
      const res = await fetch(`/api/umkm/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setUmkmList(umkmList.filter(u => u._id !== id));
        alert('UMKM berhasil dihapus');
      }
    } catch (err) {
      alert('Gagal menghapus UMKM');
    }
  };

  const filteredUmkm = umkmList.filter(u =>
    u.nama_usaha?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.wilayah?.kota?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const menuItems = [
    { name: 'Overview', href: '/admin', icon: <BarChart3 size={20} /> },
    { name: 'Revenue', href: '/admin/revenue', icon: <TrendingUp size={20} /> },
    { name: 'Growth', href: '/admin/growth', icon: <Users size={20} /> },
    { name: 'Heatmap', href: '/admin/heatmap', icon: <Map size={20} /> },
  ];

  return (
    // FIX: Menggunakan background gelap agar glassmorphism terlihat (seperti di image kedua)
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

        {/* HEADER - Minimalist */}
        <header className="p-6 lg:p-8 flex items-center justify-between">
          <button onClick={() => setShowSidebar(true)} className="lg:hidden p-3 bg-white/5 rounded-xl border border-white/10 text-white">
            <Menu size={24} />
          </button>

          <div className="ml-auto flex items-center gap-4">
            <div className="flex flex-col items-end hidden sm:block">
              <p className="text-sm font-black text-white leading-none">Admin Sigma</p>
              <p className="text-[10px] text-green-400 font-bold uppercase tracking-widest mt-1">Verified Account</p>
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center font-black text-amber-400 shadow-xl">A</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-6 lg:px-8 pb-8">
          <div className="max-w-7xl mx-auto">

            {/* Title & Search Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tighter">Kelola UMKM</h2>
                <p className="text-white/40 mt-2 font-medium tracking-wide">Data ringkasan operasional seluruh unit usaha.</p>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-80 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Cari UMKM atau Lokasi..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600/50 text-white placeholder:text-white/20 backdrop-blur-xl transition-all"
                  />
                </div>
                <button className="p-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl shadow-lg shadow-blue-600/30 transition-all active:scale-95">
                  <Plus size={24} />
                </button>
              </div>
            </div>

            {/* STATS - Glass Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {[
                { label: 'Total UMKM', val: loading ? '...' : umkmList.length, icon: <Users className="text-blue-400" /> },
                { label: 'Total Revenue', val: 'Rp 526M', icon: <BarChart3 className="text-green-400" /> },
                { label: 'Avg Growth', val: '12.4%', icon: <TrendingUp className="text-purple-400" /> },
                { label: 'Unit Aktif', val: loading ? '...' : umkmList.length, icon: <MapPin className="text-orange-400" /> }
              ].map((s, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10">{s.icon}</div>
                  <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">{s.label}</p>
                  <p className="text-3xl font-bold text-white mt-2 tracking-tight">{s.val}</p>
                </div>
              ))}
            </div>

            {/* DATA TABLE - Glass Panel */}
            <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden">
              {loading ? (
                <div className="p-12 text-center text-white/50">Loading data...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-white/5 text-white/30 text-[10px] uppercase font-black tracking-widest">
                      <tr>
                        <th className="px-10 py-6">Entitas Bisnis</th>
                        <th className="px-10 py-6">Lokasi</th>
                        <th className="px-10 py-6">Sektor</th>
                        <th className="px-10 py-6 text-center">Contact</th>
                        <th className="px-10 py-6 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredUmkm.map((u) => (
                        <tr key={u._id} className="hover:bg-white/5 transition-colors group">
                          <td className="px-10 py-8">
                            <div className="text-white font-bold group-hover:text-blue-400 transition-colors">{u.nama_usaha}</div>
                            <div className="text-white/30 text-xs mt-1 italic line-clamp-1">{u.sektor}</div>
                          </td>
                          <td className="px-10 py-8">
                            <div className="flex items-center text-white/60 text-sm">
                              <MapPin size={14} className="mr-2 text-white/20" /> {u.wilayah?.kota || 'N/A'}
                            </div>
                          </td>
                          <td className="px-10 py-8">
                            <span className="font-mono font-bold text-white">{u.sektor}</span>
                          </td>
                          <td className="px-10 py-8">
                            <div className="flex flex-col items-center text-xs text-white/40">
                              {u.pemilik?.telepon && <div className="flex items-center gap-1"><Phone size={12} />{u.pemilik.telepon}</div>}
                              {u.pemilik?.email && <div className="flex items-center gap-1 mt-1"><Mail size={12} />{u.pemilik.email}</div>}
                            </div>
                          </td>
                          <td className="px-10 py-8">
                            <div className="flex justify-end gap-3">
                              <Link href={`/umkm/${u._id}`}>
                                <button className="p-3 bg-white/5 hover:bg-white/20 border border-white/10 rounded-xl text-white transition-all">
                                  <Eye size={18} />
                                </button>
                              </Link>
                              <button
                                onClick={() => handleDelete(u._id)}
                                className="p-3 bg-white/5 hover:bg-red-500/20 border border-white/10 rounded-xl text-red-400 transition-all">
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* DETAIL MODAL - Glassmorphism */}
      {showModal && selectedUmkm && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] px-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="bg-white/10 backdrop-blur-[50px] border border-white/20 rounded-[3rem] shadow-2xl max-w-md w-full overflow-hidden z-10 p-10 transform transition-all scale-100">
            <div className="flex justify-between items-start mb-8">
              <h2 className="text-3xl font-black text-white tracking-tighter">Profil UMKM</h2>
              <button onClick={() => setShowModal(false)} className="p-2 text-white/50 hover:text-white transition-colors"><X size={24} /></button>
            </div>
            <div className="space-y-6">
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10 text-center">
                <p className="text-2xl font-black text-white mb-2">{selectedUmkm.name}</p>
                <p className="text-sm text-white/50 italic leading-relaxed">"{selectedUmkm.description}"</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-white/5 rounded-3xl border border-white/10 text-center">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Revenue</p>
                  <p className="text-xl font-bold text-green-400">Rp {selectedUmkm.revenue}M</p>
                </div>
                <div className="p-5 bg-white/5 rounded-3xl border border-white/10 text-center">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Status</p>
                  <p className="text-xl font-bold text-blue-400">{selectedUmkm.status}</p>
                </div>
              </div>
              <div className="pt-6 border-t border-white/10 space-y-3">
                <div className="flex items-center text-sm text-white/60"><Mail size={16} className="mr-4 text-blue-500" /> {selectedUmkm.email}</div>
                <div className="flex items-center text-sm text-white/60"><Phone size={16} className="mr-4 text-blue-500" /> {selectedUmkm.phone}</div>
              </div>
            </div>
            <button onClick={() => setShowModal(false)} className="w-full mt-10 py-5 bg-white text-slate-900 font-black rounded-2xl shadow-xl hover:scale-[1.02] transition-transform uppercase tracking-widest text-xs">Tutup Panel</button>
          </div>
        </div>
      )}
    </div>
  );
}