'use client';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) router.push('/dashboard');
    }, [user, loading, router]);

    const features = [
        { icon: '📅', title: 'Cycle Tracking', desc: 'Log periods, symptoms, mood, and flow intensity with ease.' },
        { icon: '🔮', title: 'Smart Predictions', desc: 'AI-powered predictions for your next period and ovulation.' },
        { icon: '💬', title: 'Chat with Amma', desc: 'Your friendly AI companion for period health questions.' },
        { icon: '🛡️', title: 'Privacy First', desc: 'Your data is encrypted and never shared. GDPR compliant.' },
        { icon: '📊', title: 'Health Insights', desc: 'Spot patterns and understand your body better over time.' },
        { icon: '🌙', title: 'Dark Mode', desc: 'Easy on the eyes, especially during those tough nights.' },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden px-4 pt-16 pb-24">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-pink-200 opacity-30 blur-3xl animate-float" />
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-lavender-200 opacity-30 blur-3xl animate-float" style={{ animationDelay: '3s' }} />
                </div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100 text-pink-700 text-sm font-medium mb-8 animate-fade-in">
                        🌸 Designed with empathy for women
                    </div>

                    <h1 className="text-5xl sm:text-7xl font-extrabold mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        <span className="bg-gradient-to-r from-pink-500 via-pink-600 to-lavender-500 bg-clip-text text-transparent">
                            Period Helper
                        </span>
                    </h1>

                    <p className="text-xl sm:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        Track your cycle with care. Get personalized health insights.
                        Meet <strong className="text-pink-600">Amma</strong> — your AI health companion.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
                        <Link href="/signup" className="btn-primary text-lg px-8 py-4">
                            Get Started Free ✨
                        </Link>
                        <Link href="/login" className="btn-secondary text-lg px-8 py-4">
                            Login
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="px-4 pb-24">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
                        Everything you need 💕
                    </h2>
                    <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto">
                        Built with love, privacy, and medical responsibility at its core.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((f, i) => (
                            <div
                                key={i}
                                className="glass-card p-6 animate-fade-in"
                                style={{ animationDelay: `${0.1 * i}s` }}
                            >
                                <div className="text-4xl mb-4">{f.icon}</div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">{f.title}</h3>
                                <p className="text-gray-500 text-sm">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="px-4 pb-24">
                <div className="max-w-3xl mx-auto glass-card p-10 text-center pulse-glow">
                    <h2 className="text-3xl font-bold mb-4 text-gray-800">Ready to take control? 🌷</h2>
                    <p className="text-gray-500 mb-8">
                        Join thousands of women who trust Period Helper for their cycle health.
                    </p>
                    <Link href="/signup" className="btn-primary text-lg px-8 py-4">
                        Start Tracking Today
                    </Link>
                </div>
            </section>
        </div>
    );
}
