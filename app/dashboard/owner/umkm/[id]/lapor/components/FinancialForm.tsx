'use client';

import { useState } from 'react';
import { AlertCircle, Loader, Send } from 'lucide-react';

interface FinancialFormProps {
    umkmId: string;
    onSubmit: (data: any) => Promise<void>;
    onCancel: () => void;
}

export function FinancialForm({ umkmId, onSubmit, onCancel }: FinancialFormProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        bulan: new Date().getMonth() + 1,
        tahun: new Date().getFullYear(),
        omzet: '',
        jumlah_karyawan: '',
        catatan: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'bulan' || name === 'tahun' || name === 'jumlah_karyawan' 
                ? (value === '' ? '' : parseInt(value))
                : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // Validate required fields
            if (!formData.omzet) {
                throw new Error('Omzet harus diisi');
            }

            if (!formData.jumlah_karyawan) {
                throw new Error('Jumlah karyawan harus diisi');
            }

            const omzet = parseInt(String(formData.omzet));
            const jumlahKaryawan = parseInt(String(formData.jumlah_karyawan));

            if (omzet < 0) {
                throw new Error('Omzet tidak boleh negatif');
            }

            if (jumlahKaryawan < 0) {
                throw new Error('Jumlah karyawan tidak boleh negatif');
            }

            const payload = {
                bulan: formData.bulan,
                tahun: formData.tahun,
                omzet,
                jumlah_karyawan: jumlahKaryawan,
                catatan: formData.catatan || null,
            };

            // Call API
            const response = await fetch(`/api/financial-log`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    umkm_id: umkmId,
                    ...payload
                }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Gagal menyimpan data');
            }

            await onSubmit(payload);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Gagal menyimpan data');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-500/20 border border-red-400/50 rounded-xl p-4 flex items-center gap-3">
                    <AlertCircle className="text-red-400 flex-shrink-0" size={20} />
                    <p className="text-red-200 text-sm">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bulan */}
                <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                        Bulan
                    </label>
                    <select
                        name="bulan"
                        value={formData.bulan}
                        onChange={handleChange}
                        required
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 transition-all cursor-pointer"
                    >
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1} className="bg-slate-900">
                                {new Date(2024, i).toLocaleDateString('id-ID', { month: 'long' })}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Tahun */}
                <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                        Tahun
                    </label>
                    <select
                        name="tahun"
                        value={formData.tahun}
                        onChange={handleChange}
                        required
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 transition-all cursor-pointer"
                    >
                        {Array.from({ length: 5 }, (_, i) => {
                            const year = new Date().getFullYear() - i;
                            return (
                                <option key={year} value={year} className="bg-slate-900">
                                    {year}
                                </option>
                            );
                        })}
                    </select>
                </div>

                {/* Omzet */}
                <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                        Omzet (Rp) *
                    </label>
                    <input
                        type="number"
                        name="omzet"
                        value={formData.omzet}
                        onChange={handleChange}
                        placeholder="Contoh: 50000000"
                        required
                        min="0"
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 transition-all"
                    />
                </div>

                {/* Jumlah Karyawan */}
                <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                        Jumlah Karyawan *
                    </label>
                    <input
                        type="number"
                        name="jumlah_karyawan"
                        value={formData.jumlah_karyawan}
                        onChange={handleChange}
                        placeholder="Contoh: 5"
                        required
                        min="0"
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 transition-all"
                    />
                </div>
            </div>

            {/* Catatan */}
            <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                    Catatan (Opsional)
                </label>
                <textarea
                    name="catatan"
                    value={formData.catatan}
                    onChange={handleChange}
                    placeholder="Tambahkan catatan atau informasi tambahan..."
                    rows={3}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 transition-all resize-none"
                />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 justify-end pt-4 border-t border-white/10">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-3 border border-white/20 rounded-xl text-white/80 hover:bg-white/10 hover:text-white font-medium transition-all"
                >
                    Batal
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all flex items-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader size={18} className="animate-spin" />
                            Menyimpan...
                        </>
                    ) : (
                        <>
                            <Send size={18} />
                            Simpan
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
