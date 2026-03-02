'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

export default function DashboardPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) { router.push('/login'); return; }
        if (user) fetchDashboard();
    }, [user, authLoading]);

    const fetchDashboard = async () => {
        try {
            const res = await api.get('/user/dashboard');
            setData(res.data);
        } catch (err) {
            console.error(err);
        } finally { setLoading(false); }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="text-pink-400 animate-pulse text-xl">Loading your dashboard... 🌸</div>
            </div>
        );
    }

    const phaseNames = {
        menstrual: { label: 'Menstrual Phase', emoji: '🩸', color: 'phase-menstrual' },
        follicular: { label: 'Follicular Phase', emoji: '🌱', color: 'phase-follicular' },
        fertile: { label: 'Fertile Window', emoji: '🥚', color: 'phase-fertile' },
        luteal: { label: 'Luteal Phase', emoji: '🌙', color: 'phase-luteal' },
        unknown: { label: 'Log your cycle', emoji: '📝', color: 'bg-gray-400' },
    };
    const phase = phaseNames[data?.currentPhase] || phaseNames.unknown;

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Welcome */}
            <div className="mb-8 animate-fade-in">
                <h1 className="text-3xl font-bold text-gray-800">
                    Hello, {data?.user?.name || 'there'} 💗
                </h1>
                <p className="text-gray-500 mt-1">Here's your cycle overview</p>
            </div>

            {/* Main Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Current Phase */}
                <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`w-12 h-12 rounded-2xl ${phase.color} flex items-center justify-center text-white text-xl`}>
                            {phase.emoji}
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Current Phase</p>
                            <p className="font-bold text-gray-800">{phase.label}</p>
                        </div>
                    </div>
                </div>

                {/* Next Period */}
                <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white text-xl">
                            📅
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Next Period</p>
                            <p className="font-bold text-gray-800">
                                {data?.daysUntilNextPeriod !== null
                                    ? data.daysUntilNextPeriod > 0
                                        ? `In ${data.daysUntilNextPeriod} days`
                                        : data.daysUntilNextPeriod === 0
                                            ? 'Due today'
                                            : `${Math.abs(data.daysUntilNextPeriod)} days late`
                                    : 'Log cycle to predict'}
                            </p>
                        </div>
                    </div>
                    {data?.prediction && (
                        <p className="text-xs text-gray-400">
                            Confidence: {data.prediction.confidenceScore}% (based on {data.prediction.basedOnCycles} cycles)
                        </p>
                    )}
                </div>

                {/* Cycles Logged */}
                <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-lavender-400 to-lavender-500 flex items-center justify-center text-white text-xl">
                            📊
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Cycles Logged</p>
                            <p className="font-bold text-gray-800">{data?.totalCyclesLogged || 0}</p>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400">Average cycle: {data?.user?.cycleLength || 28} days</p>
                </div>
            </div>

            {/* Predictions Detail */}
            {data?.prediction && (
                <div className="glass-card p-6 mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <h2 className="text-lg font-bold text-gray-800 mb-4">🔮 Predictions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-4 rounded-xl bg-pink-50">
                            <p className="text-xs text-gray-500 mb-1">Next Period</p>
                            <p className="font-semibold text-pink-700">
                                {new Date(data.prediction.predictedNextPeriod).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-green-50">
                            <p className="text-xs text-gray-500 mb-1">Ovulation</p>
                            <p className="font-semibold text-green-700">
                                {data.prediction.predictedOvulation
                                    ? new Date(data.prediction.predictedOvulation).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                    : '--'}
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-emerald-50">
                            <p className="text-xs text-gray-500 mb-1">Fertility Window</p>
                            <p className="font-semibold text-emerald-700 text-sm">
                                {data.prediction.fertilityWindowStart && data.prediction.fertilityWindowEnd
                                    ? `${new Date(data.prediction.fertilityWindowStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(data.prediction.fertilityWindowEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                                    : '--'}
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-lavender-50">
                            <p className="text-xs text-gray-500 mb-1">Confidence</p>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-pink-400 to-lavender-500 rounded-full"
                                        style={{ width: `${data.prediction.confidenceScore}%` }} />
                                </div>
                                <span className="text-sm font-semibold text-lavender-600">{data.prediction.confidenceScore}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Recent Cycles */}
            <div className="glass-card p-6 mb-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-800">📋 Recent Cycles</h2>
                    <Link href="/history" className="text-sm text-pink-600 hover:underline">View all →</Link>
                </div>
                {data?.recentCycles?.length > 0 ? (
                    <div className="space-y-3">
                        {data.recentCycles.map((cycle, i) => (
                            <div key={cycle._id || i} className="flex items-center gap-4 p-3 rounded-xl bg-pink-50/50 hover:bg-pink-50 transition">
                                <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600 font-bold text-sm">
                                    {new Date(cycle.startDate).getDate()}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-800 text-sm">
                                        {new Date(cycle.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                        {cycle.endDate && ` — ${new Date(cycle.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {cycle.flowIntensity} flow • {cycle.mood} • {cycle.symptoms?.length || 0} symptoms
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-400">
                        <p className="text-3xl mb-2">📝</p>
                        <p>No cycles logged yet.</p>
                        <Link href="/log" className="btn-primary mt-4 inline-block">Log Your First Cycle</Link>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <Link href="/log" className="glass-card p-6 text-center hover:scale-[1.02] transition-transform">
                    <div className="text-3xl mb-2">📝</div>
                    <p className="font-semibold text-gray-800">Log Period</p>
                    <p className="text-xs text-gray-500">Record your cycle</p>
                </Link>
                <Link href="/chat" className="glass-card p-6 text-center hover:scale-[1.02] transition-transform">
                    <div className="text-3xl mb-2">💬</div>
                    <p className="font-semibold text-gray-800">Chat with Amma</p>
                    <p className="text-xs text-gray-500">Get health tips</p>
                </Link>
                <Link href="/history" className="glass-card p-6 text-center hover:scale-[1.02] transition-transform">
                    <div className="text-3xl mb-2">📊</div>
                    <p className="font-semibold text-gray-800">View History</p>
                    <p className="text-xs text-gray-500">Track your patterns</p>
                </Link>
            </div>
        </div>
    );
}
