'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';

export default function Navbar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = user
        ? [
            { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
            { href: '/log', label: 'Log Period', icon: '📝' },
            { href: '/chat', label: 'Amma', icon: '💬' },
            { href: '/history', label: 'History', icon: '📊' },
            { href: '/settings', label: 'Settings', icon: '⚙️' },
        ]
        : [
            { href: '/login', label: 'Login', icon: '🔐' },
            { href: '/signup', label: 'Sign Up', icon: '✨' },
        ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'
            }`} style={{
                background: scrolled ? 'rgba(255,255,255,0.85)' : 'transparent',
                backdropFilter: scrolled ? 'blur(20px)' : 'none',
                borderBottom: scrolled ? '1px solid rgba(236,72,153,0.1)' : 'none'
            }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
                <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-2 group">
                    <span className="text-2xl group-hover:scale-110 transition-transform">🌸</span>
                    <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-pink-700 bg-clip-text text-transparent">
                        Period Helper
                    </span>
                </Link>

                {/* Desktop nav */}
                <div className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${pathname === link.href
                                    ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/25'
                                    : 'text-gray-600 hover:text-pink-600 hover:bg-pink-50'
                                }`}
                        >
                            <span className="mr-1">{link.icon}</span>
                            {link.label}
                        </Link>
                    ))}
                    {user && (
                        <button
                            onClick={logout}
                            className="ml-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all"
                        >
                            Logout
                        </button>
                    )}
                </div>

                {/* Mobile toggle */}
                <button
                    className="md:hidden p-2 rounded-xl hover:bg-pink-50 transition-colors"
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    <svg className="w-6 h-6 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {mobileOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden mt-2 mx-4 rounded-2xl overflow-hidden" style={{
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(236,72,153,0.1)'
                }}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            className={`block px-5 py-3 text-sm font-medium transition-all ${pathname === link.href
                                    ? 'bg-pink-500 text-white'
                                    : 'text-gray-600 hover:bg-pink-50'
                                }`}
                        >
                            <span className="mr-2">{link.icon}</span>
                            {link.label}
                        </Link>
                    ))}
                    {user && (
                        <button
                            onClick={() => { logout(); setMobileOpen(false); }}
                            className="block w-full text-left px-5 py-3 text-sm font-medium text-red-500 hover:bg-red-50"
                        >
                            🚪 Logout
                        </button>
                    )}
                </div>
            )}
        </nav>
    );
}
