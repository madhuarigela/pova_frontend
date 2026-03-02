'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function HistoryPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [cycles, setCycles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        if (!authLoading && !user) { router.push('/login'); return; }
        if (user) fetchCycles();
    }, [user, authLoading, page]);

    const fetchCycles = async () => {
        try {
            const res = await api.get(`/cycles?page=${page}&limit=10`);
            setCycles(res.data.cycles);
            setTotalPages(res.data.pagination.pages);
        } catch (err) {
            console.error(err);
        } finally { setLoading(false); }
    };

    const deleteCycle = async (id) => {
        if (!confirm('Delete this cycle log?')) return;
        try {
            await api.delete(`/cycles/${id}`);
            setCycles(prev => prev.filter(c => c._id !== id));
        } catch (err) {
            alert('Failed to delete cycle.');
        }
    };

    const moodEmojis = {
        happy: '😊', calm: '😌', energetic: '⚡', neutral: '😐',
        tired: '😴', anxious: '😰', irritable: '😤', sad: '😢', emotional: '🥺'
    };

    const flowColors = {
        spotting: 'bg-pink-100 text-pink-600',
        light: 'bg-pink-200 text-pink-700',
        medium: 'bg-pink-400 text-white',
        heavy: 'bg-pink-600 text-white'
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="text-pink-400 animate-pulse">Loading history... 📊</div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="mb-8 animate-fade-in">
                <h1 className="text-3xl font-bold text-gray-800">📊 Cycle History</h1>
                <p className="text-gray-500 mt-1">View and manage your logged cycles</p>
            </div>

            {cycles.length === 0 ? (
                <div className="glass-card p-12 text-center animate-fade-in">
                    <div className="text-5xl mb-4">📝</div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">No cycles logged yet</h2>
                    <p className="text-gray-500 mb-6">Start tracking to see your health patterns over time.</p>
                    <button onClick={() => router.push('/log')} className="btn-primary">
                        Log Your First Cycle 🌸
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {cycles.map((cycle, i) => {
                        const duration = cycle.endDate
                            ? Math.round((new Date(cycle.endDate) - new Date(cycle.startDate)) / (1000 * 60 * 60 * 24))
                            : null;

                        return (
                            <div key={cycle._id} className="glass-card p-6 animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 flex flex-col items-center justify-center text-white">
                                            <span className="text-xs font-medium">
                                                {new Date(cycle.startDate).toLocaleDateString('en-US', { month: 'short' })}
                                            </span>
                                            <span className="text-lg font-bold leading-none">
                                                {new Date(cycle.startDate).getDate()}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">
                                                {new Date(cycle.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {cycle.endDate
                                                    ? `${duration} days • Ended ${new Date(cycle.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                                                    : 'Ongoing'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${flowColors[cycle.flowIntensity] || flowColors.medium}`}>
                                            {cycle.flowIntensity}
                                        </span>
                                        <span className="text-xl" title={cycle.mood}>
                                            {moodEmojis[cycle.mood] || '😐'}
                                        </span>
                                        {cycle.symptoms?.length > 0 && (
                                            <span className="px-3 py-1 rounded-full bg-lavender-50 text-lavender-600 text-xs font-medium">
                                                {cycle.symptoms.length} symptom{cycle.symptoms.length > 1 ? 's' : ''}
                                            </span>
                                        )}
                                        <button onClick={() => deleteCycle(cycle._id)}
                                            className="ml-2 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition">
                                            🗑️
                                        </button>
                                    </div>
                                </div>

                                {cycle.notes && (
                                    <p className="mt-3 text-sm text-gray-500 pl-17 border-t border-pink-50 pt-3">
                                        📌 {cycle.notes}
                                    </p>
                                )}

                                {cycle.symptoms?.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-1 pl-17">
                                        {cycle.symptoms.map(s => (
                                            <span key={s} className="px-2 py-0.5 rounded-md bg-pink-50 text-pink-600 text-xs">
                                                {s.replace('_', ' ')}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                        className="btn-secondary px-4 py-2 disabled:opacity-50">← Prev</button>
                    <span className="px-4 py-2 text-sm text-gray-500">Page {page} of {totalPages}</span>
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                        className="btn-secondary px-4 py-2 disabled:opacity-50">Next →</button>
                </div>
            )}
        </div>
    );
}
