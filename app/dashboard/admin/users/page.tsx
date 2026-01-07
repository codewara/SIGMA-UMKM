'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, AlertCircle, Loader } from 'lucide-react';

interface PejabatUser {
  _id: string;
  email: string;
  nama?: string;
  wilayah?: string;
  account_status: string;
  created_at: string;
  role: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<PejabatUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    nama: '',
    password: '',
    wilayah: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users');

      if (!response.ok) {
        throw new Error('Gagal memuat data pengguna');
      }

      const data = await response.json();
      setUsers(data.users || []);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data pengguna');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal membuat pengguna');
      }

      setSuccess('Pengguna berhasil dibuat');
      setFormData({ email: '', nama: '', password: '', wilayah: '' });
      setShowForm(false);
      
      // Refresh list
      setTimeout(() => fetchUsers(), 1000);
    } catch (err: any) {
      setError(err.message || 'Gagal membuat pengguna');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus pengguna ini?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Gagal menghapus pengguna');
      }

      setSuccess('Pengguna berhasil dihapus');
      setUsers(users.filter(u => u._id !== id));
    } catch (err: any) {
      setError(err.message || 'Gagal menghapus pengguna');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Kelola Pejabat</h1>
          <p className="text-white/70 mt-1">
            Tambah, lihat, dan kelola akun pejabat dinas
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:shadow-lg transition-all duration-300 font-semibold"
        >
          <Plus size={20} />
          Tambah Pejabat
        </button>
      </div>

      {/* Error & Success Messages */}
      {error && (
        <div className="bg-red-500/20 border border-red-400/30 rounded-3xl p-4 flex gap-3 backdrop-blur-xl">
          <AlertCircle className="text-red-400 mt-0.5 flex-shrink-0" size={20} />
          <div>
            <p className="font-semibold text-red-300">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-500/20 border border-green-400/30 rounded-3xl p-4 flex gap-3 backdrop-blur-xl">
          <div className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center text-black text-sm font-bold flex-shrink-0">✓</div>
          <div>
            <p className="font-semibold text-green-300">{success}</p>
          </div>
        </div>
      )}

      {/* Add Form */}
      {showForm && (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Tambah Pejabat Baru</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-xl transition-all"
                  placeholder="pejabat@dinas.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/90 mb-1">
                  Nama
                </label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={e =>
                    setFormData({ ...formData, nama: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-xl transition-all"
                  placeholder="Nama Pejabat"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/90 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={e =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-xl transition-all"
                  placeholder="Minimal 6 karakter"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/90 mb-1">
                  Wilayah
                </label>
                <input
                  type="text"
                  value={formData.wilayah}
                  onChange={e =>
                    setFormData({ ...formData, wilayah: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-xl transition-all"
                  placeholder="Malang, Surabaya, dll"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
              >
                Simpan
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all duration-300"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/20">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                  Terdaftar
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-white">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Loader size={20} className="animate-spin text-blue-400" />
                      <span className="text-white/70">Memuat data...</span>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-white/70">
                    Belum ada pejabat terdaftar
                  </td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-white">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-white/70">
                      {user.nama || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.account_status === 'active'
                            ? 'bg-green-500/30 text-green-300 border border-green-400/50'
                            : 'bg-yellow-500/30 text-yellow-300 border border-yellow-400/50'
                        }`}
                      >
                        {user.account_status === 'active'
                          ? 'Aktif'
                          : 'Belum Verifikasi'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-white/70">
                      {new Date(user.created_at).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

