'use client';

import { LogOut, Menu, X, Shield, DollarSign, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
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
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
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
                            <p className="text-xs text-cyan-200">Sistem Informasi Growth & Monitoring Analitik UMKM</p>
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        {/* Katalog & Peta Links - Always visible */}
                        <Link href="/katalog" className="text-white/80 hover:text-white transition font-medium">
                            Katalog
                        </Link>
                        <Link href="/peta" className="text-white/80 hover:text-white transition font-medium">
                            Peta
                        </Link>

                        {user && (
                            <>
                                {/* Profile Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                                        className="flex items-center space-x-3 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full font-medium transition"
                                    >
                                        <div className="flex flex-col items-start">
                                            <span className="text-white text-sm">{user.username}</span>
                                            <span className="text-xs text-cyan-300">{user.role}</span>
                                        </div>
                                        <ChevronDown className={`w-4 h-4 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {showProfileDropdown && (
                                        <div className="absolute right-0 mt-2 w-56 bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-white/20 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl">
                                            {/* Profile Info */}
                                            <div className="px-4 py-3 border-b border-white/10 bg-white/5">
                                                <p className="text-white font-semibold">{user.username}</p>
                                                <p className="text-cyan-300 text-sm">{user.role}</p>
                                            </div>

                                            {/* Menu Items */}
                                            <div className="py-2">
                                                {user.role === 'ADMIN' && (
                                                    <Link href="/admin" onClick={() => setShowProfileDropdown(false)}>
                                                        <button className="w-full text-left px-4 py-2 text-white hover:bg-white/10 transition flex items-center space-x-2">
                                                            <Shield className="w-4 h-4 text-cyan-400" />
                                                            <span>Admin Panel</span>
                                                        </button>
                                                    </Link>
                                                )}

                                                {user.role === 'PEJABAT' && (
                                                    <Link href="/dashboard/pejabat" onClick={() => setShowProfileDropdown(false)}>
                                                        <button className="w-full text-left px-4 py-2 text-white hover:bg-white/10 transition flex items-center space-x-2">
                                                            <DollarSign className="w-4 h-4 text-cyan-400" />
                                                            <span>Dashboard Pejabat</span>
                                                        </button>
                                                    </Link>
                                                )}

                                                {user.role === 'UMKM_OWNER' && (
                                                    <Link href="/dashboard/owner" onClick={() => setShowProfileDropdown(false)}>
                                                        <button className="w-full text-left px-4 py-2 text-white hover:bg-white/10 transition flex items-center space-x-2">
                                                            <DollarSign className="w-4 h-4 text-cyan-400" />
                                                            <span>Dashboard UMKM</span>
                                                        </button>
                                                    </Link>
                                                )}

                                                <button
                                                    onClick={() => {
                                                        setShowProfileDropdown(false);
                                                        onLogout();
                                                    }}
                                                    className="w-full text-left px-4 py-2 text-pink-300 hover:bg-white/10 transition flex items-center space-x-2 border-t border-white/10 mt-2 pt-3"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    <span>Keluar</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
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
                        {/* Katalog & Peta Links - Always visible */}
                        <Link href="/katalog">
                            <button className="block w-full text-left px-4 py-3 text-white hover:bg-white/10 rounded-lg transition">Katalog</button>
                        </Link>
                        <Link href="/peta">
                            <button className="block w-full text-left px-4 py-3 text-white hover:bg-white/10 rounded-lg transition">Peta</button>
                        </Link>

                        {user ? (
                            <>
                                <div className="px-4 py-2 text-white/70 text-sm border-t border-white/20 mt-2 pt-2">
                                    {user.username} ({user.role})
                                </div>

                                {/* Dashboard sesuai role */}
                                {user.role === 'ADMIN' && (
                                    <Link href="/admin">
                                        <button className="block w-full text-left px-4 py-3 text-white hover:bg-white/10 rounded-lg transition">Dashboard Admin</button>
                                    </Link>
                                )}
                                {user.role === 'PEJABAT' && (
                                    <Link href="/dashboard/pejabat">
                                        <button className="block w-full text-left px-4 py-3 text-white hover:bg-white/10 rounded-lg transition">Dashboard Pejabat</button>
                                    </Link>
                                )}
                                {user.role === 'UMKM_OWNER' && (
                                    <Link href="/dashboard/owner">
                                        <button className="block w-full text-left px-4 py-3 text-white hover:bg-white/10 rounded-lg transition">Dashboard UMKM</button>
                                    </Link>
                                )}
                                <button
                                    onClick={onLogout}
                                    className="block w-full text-left px-4 py-3 text-pink-300 hover:bg-white/10 rounded-lg transition font-semibold"
                                >
                                    Keluar
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/auth/login">
                                    <button className="block w-full text-left px-4 py-3 text-white hover:bg-white/10 rounded-lg transition font-semibold">Masuk</button>
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}
