'use client';

import { useState } from 'react';
import { AlertCircle, Loader } from 'lucide-react';

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
        pengeluaran: '',
        nama_usaha: '',
        jumlah_karyawan: '',
        sektor: 'kuliner',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'bulan' || name === 'tahun' || name === 'jumlah_karyawan' 
                ? parseInt(value) || value
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

            const omzet = parseInt(formData.omzet);

            if (omzet < 0) {
                throw new Error('Nilai tidak boleh negatif');
            }

            const payload = {
                bulan: formData.bulan,
                tahun: formData.tahun,
                omzet,
                jumlah_karyawan: formData.jumlah_karyawan ? parseInt(formData.jumlah_karyawan) : 0,
                nama_usaha: formData.nama_usaha || undefined,
                sektor: formData.sektor || undefined,
            };

            // Call API
            const response = await fetch(`/api/analytics/financial/${umkmId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
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
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-gap-3">
                    <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                    <p className="text-red-800 text-sm">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Bulan */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bulan *
                    </label>
                    <select
                        name="bulan"
                        value={formData.bulan}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                                {new Date(2024, i).toLocaleDateString('id-ID', { month: 'long' })}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Tahun */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tahun *
                    </label>
                    <select
                        name="tahun"
                        value={formData.tahun}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {Array.from({ length: 5 }, (_, i) => {
                            const year = new Date().getFullYear() - i;
                            return (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            );
                        })}
                    </select>
                </div>

                {/* Omzet */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Omzet (Rp) *
                    </label>
                    <input
                        type="number"
                        name="omzet"
                        value={formData.omzet}
                        onChange={handleChange}
                        placeholder="Contoh: 10000000"
                        required
                        min="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Pengeluaran */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pengeluaran (Rp) *
                    </label>
                    <input
                        type="number"
                        name="pengeluaran"
                        value={formData.pengeluaran}
                        onChange={handleChange}
                        placeholder="Contoh: 5000000"
                        required
                        min="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Nama Usaha */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Usaha
                    </label>
                    <input
                        type="text"
                        name="nama_usaha"
                        value={formData.nama_usaha}
                        onChange={handleChange}
                        placeholder="Nama usaha (opsional)"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Jumlah Karyawan */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Jumlah Karyawan
                    </label>
                    <input
                        type="number"
                        name="jumlah_karyawan"
                        value={formData.jumlah_karyawan}
                        onChange={handleChange}
                        placeholder="Jumlah karyawan"
                        min="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Sektor */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sektor
                    </label>
                    <select
                        name="sektor"
                        value={formData.sektor}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="kuliner">Kuliner</option>
                        <option value="fashion">Fashion</option>
                        <option value="kriya">Kriya</option>
                        <option value="jasa">Jasa</option>
                        <option value="lainnya">Lainnya</option>
                    </select>
                </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                    Batal
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                    {loading && <Loader size={16} className="animate-spin" />}
                    {loading ? 'Menyimpan...' : 'Simpan'}
                </button>
            </div>
        </form>
    );
}
