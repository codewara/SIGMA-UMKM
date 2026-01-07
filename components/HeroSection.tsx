'use client';

import { Sparkles, Star } from 'lucide-react';

export default function HeroSection() {
    return (
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Content */}
                <div className="relative z-10">
                    <div className="mb-8">
                        <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-lg rounded-full px-4 py-2 mb-6 border border-white/20">
                            <Sparkles className="w-4 h-4 text-cyan-300" />
                            <span className="text-cyan-200 text-sm font-semibold">Platform UMKM Terpadu</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
                            Sigmaaahhh{' '}
                            <span className="bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                                UMKM PLATFORM
                            </span>
                        </h1>

                        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                            Kelola dan kembangkan bisnis UMKM Anda dengan lebih mudah dan efisien di satu tempat.
                        </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap gap-4 mb-12">
                        <button className="group relative px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white rounded-full font-bold shadow-2xl hover:shadow-pink-500/50 transition-all overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span className="relative">Daftar Sekarang</span>
                        </button>
                        <button className="px-8 py-4 bg-white/10 backdrop-blur-lg border-2 border-white/30 text-white rounded-full font-bold hover:bg-white/20 hover:border-white/50 transition-all">
                            Pelajari Lebih Lanjut
                        </button>
                    </div>

                    {/* Feature list */}
                    <div className="space-y-4">
                        {['Kelola seluruh aspek bisnis UMKM', 'Analitik mendalam untuk pertumbuhan', 'Terhubung dengan jutaan pembeli'].map((text, i) => (
                            <div key={i} className="flex items-center space-x-3 group">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                                    <Star className="w-4 h-4 text-white fill-white" />
                                </div>
                                <span className="text-gray-200 group-hover:text-white transition">{text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Content - 3D Scene Recreation */}
                <div className="hidden lg:block relative h-[600px]">
                    <div className="absolute inset-0 flex items-center justify-center">
                        {/* Main card/monitor */}
                        <div className="relative">
                            {/* Glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 blur-3xl opacity-50 animate-pulse"></div>

                            {/* Monitor/Card */}
                            <div className="relative w-80 h-96 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl p-6 transform hover:scale-105 transition-transform duration-500">
                                <div className="absolute top-4 right-4">
                                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                                </div>

                                <div className="text-white/80 text-sm font-semibold mb-4">REVENUE REPORT</div>

                                {/* Chart simulation */}
                                <div className="space-y-4 mb-6">
                                    {[85, 72, 95, 68, 90].map((width, i) => (
                                        <div key={i} className="flex items-center space-x-3">
                                            <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-full shadow-lg animate-pulse"
                                                    style={{ width: `${width}%`, animationDelay: `${i * 0.2}s` }}
                                                ></div>
                                            </div>
                                            <span className="text-white/60 text-xs font-mono">{width}%</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-4 mt-8">
                                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
                                        <div className="text-white/60 text-xs mb-1">Revenue</div>
                                        <div className="text-white text-2xl font-bold">Rp 1.2M</div>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
                                        <div className="text-white/60 text-xs mb-1">Growth</div>
                                        <div className="text-green-400 text-2xl font-bold">+23%</div>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full blur-2xl opacity-60 animate-pulse"></div>
                            <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full blur-2xl opacity-60 animate-pulse" style={{ animationDelay: '1s' }}></div>
                            {/* Small floating card */}
                            <div className="absolute -left-16 top-32 w-32 h-32 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-3 shadow-xl animate-pulse" style={{ animationDelay: '0.5s' }}>
                                <div className="text-white/60 text-xs mb-2">Today</div>
                                <div className="text-2xl">💰</div>
                                <div className="text-white font-bold text-sm mt-1">Rp 450K</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
