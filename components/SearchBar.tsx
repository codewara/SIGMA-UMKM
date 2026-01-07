'use client';

import { Search } from 'lucide-react';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
    return (
        <div className="mb-20">
            <div className="relative group max-w-3xl mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative flex items-center bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl px-8 py-6 border border-white/30">
                    <Search className="w-6 h-6 text-gray-300" />
                    <input
                        type="text"
                        placeholder="Cari UMKM berdasarkan nama, kategori, atau lokasi..."
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="ml-4 bg-transparent outline-none text-base flex-1 text-white placeholder-gray-400"
                    />
                </div>
            </div>
        </div>
    );
}
