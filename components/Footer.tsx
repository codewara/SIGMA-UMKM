'use client';

export default function Footer() {
    return (
        <footer className="relative mt-32 bg-white/5 backdrop-blur-xl border-t border-white/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-lg">Σ</span>
                        </div>
                        <span className="text-2xl font-bold text-white">SIGMA UMKM</span>
                    </div>
                    <p className="text-gray-300">© 2026 SIGMA UMKM. Memberdayakan UMKM Indonesia</p>
                </div>
            </div>
        </footer>
    );
}
