'use client';

import { LogOut, Menu, X, Shield, DollarSign } from 'lucide-react';
import Link from 'next/link';
import type { User } from '@/lib/types';

interface NavigationProps {
    user: User | null;
    isLoading: boolean;
    showMobileMenu: boolean;
    onToggleMobileMenu: () => void;
    onLogout: () => void;
}

export default function Navigation({
    user,
    isLoading,
    showMobileMenu,
    onToggleMobileMenu,
    onLogout
}: NavigationProps) {
    return (
        <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/10 border-b border-white/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex items-center space-x-3 group cursor-pointer">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-pink-500 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition"></div>
                            <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-2xl shadow-lg transform group-hover:scale-110 transition">
                                <span className="text-white text-xl font-bold">Σ</span>
                            </div>
                        </div>
                        <div>
                            <span className="text-2xl font-bold text-white">SIGMA UMKM</span>
                            <p className="text-xs text-cyan-200">Pemberdayaan UMKM Indonesia</p>
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        {user && (
                            <>
                                <div className="text-white/80 text-sm">
                                    {user.username} <span className="text-cyan-300">({user.role})</span>
                                </div>

                                {user.role === 'ADMIN' && (
                                    <Link href="/admin">
                                        <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg font-semibold transition">
                                            <Shield className="w-4 h-4" />
                                            <span>Admin Panel</span>
                                        </button>
                                    </Link>
                                )}

                                {user.role === 'PEJABAT' && (
                                    <Link href="/admin/revenue">
                                        <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg font-semibold transition">
                                            <DollarSign className="w-4 h-4" />
                                            <span>Input Revenue</span>
                                        </button>
                                    </Link>
                                )}

                                <button
                                    onClick={onLogout}
                                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>Keluar</span>
                                </button>
                            </>
                        )}

                        {!user && !isLoading && (
                            <Link href="/auth/login">
                                <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition">
                                    <span>Masuk</span>
                                </button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={onToggleMobileMenu}
                        className="md:hidden p-2 rounded-lg hover:bg-white/10 transition text-white"
                    >
                        {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {showMobileMenu && (
                    <div className="md:hidden py-4 border-t border-white/20 space-y-2">
                        <button className="block w-full text-left px-4 py-3 text-white hover:bg-white/10 rounded-lg transition">Dashboard</button>
                        <button className="block w-full text-left px-4 py-3 text-white hover:bg-white/10 rounded-lg transition">Pengaturan</button>
                        <button className="block w-full text-left px-4 py-3 text-pink-300 hover:bg-white/10 rounded-lg transition font-semibold">Keluar</button>
                    </div>
                )}
            </div>
        </nav>
    );
}
