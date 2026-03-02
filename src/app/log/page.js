'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

const SYMPTOMS = [
    { id: 'cramps', emoji: '😣', label: 'Cramps' },
    { id: 'headache', emoji: '🤕', label: 'Headache' },
    { id: 'bloating', emoji: '🫧', label: 'Bloating' },
    { id: 'fatigue', emoji: '😴', label: 'Fatigue' },
    { id: 'backache', emoji: '💆', label: 'Backache' },
    { id: 'breast_tenderness', emoji: '😖', label: 'Breast Pain' },
    { id: 'nausea', emoji: '🤢', label: 'Nausea' },
    { id: 'acne', emoji: '😕', label: 'Acne' },
    { id: 'insomnia', emoji: '🌙', label: 'Insomnia' },
    { id: 'dizziness', emoji: '💫', label: 'Dizziness' },
    { id: 'appetite_changes', emoji: '🍽️', label: 'Appetite' },
    { id: 'constipation', emoji: '😐', label: 'Constipation' },
];

const MOODS = [
    { id: 'happy', emoji: '😊', label: 'Happy' },
    { id: 'calm', emoji: '😌', label: 'Calm' },
    { id: 'energetic', emoji: '⚡', label: 'Energetic' },
    { id: 'neutral', emoji: '😐', label: 'Neutral' },
    { id: 'tired', emoji: '😴', label: 'Tired' },
    { id: 'anxious', emoji: '😰', label: 'Anxious' },
    { id: 'irritable', emoji: '😤', label: 'Irritable' },
    { id: 'sad', emoji: '😢', label: 'Sad' },
    { id: 'emotional', emoji: '🥺', label: 'Emotional' },
];

const FLOW_LEVELS = [
    { id: 'spotting', label: 'Spotting', dots: 1 },
    { id: 'light', label: 'Light', dots: 2 },
    { id: 'medium', label: 'Medium', dots: 3 },
    { id: 'heavy', label: 'Heavy', dots: 4 },
];

export default function LogPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState('');
    const [flow, setFlow] = useState('medium');
    const [symptoms, setSymptoms] = useState([]);
    const [mood, setMood] = useState('neutral');
    const [notes, setNotes] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) router.push('/login');
    }, [user, authLoading]);

    const toggleSymptom = (id) => {
        setSymptoms(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        setLoading(true);
        try {
            await api.post('/cycles', {
                startDate, endDate: endDate || null,
                flowIntensity: flow, symptoms, mood, notes
            });
            setSuccess('Cycle logged successfully! 🌸');
            setTimeout(() => router.push('/dashboard'), 1500);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to log cycle.');
        } finally { setLoading(false); }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="glass-card p-8 animate-fade-in">
                <div className="text-center mb-8">
                    <div className="text-4xl mb-3">📝</div>
                    <h1 className="text-2xl font-bold text-gray-800">Log Your Period</h1>
                    <p className="text-gray-500 text-sm mt-1">Every entry helps improve your predictions</p>
                </div>

                {error && <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm">{error}</div>}
                {success && <div className="mb-4 p-3 rounded-xl bg-green-50 text-green-600 text-sm">{success}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                                className="input-field" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                                className="input-field" />
                        </div>
                    </div>

                    {/* Flow Intensity */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Flow Intensity</label>
                        <div className="grid grid-cols-4 gap-2">
                            {FLOW_LEVELS.map(f => (
                                <button key={f.id} type="button" onClick={() => setFlow(f.id)}
                                    className={`p-3 rounded-xl text-center transition-all ${flow === f.id
                                            ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/25'
                                            : 'bg-pink-50 text-gray-600 hover:bg-pink-100'
                                        }`}>
                                    <div className="flex justify-center gap-0.5 mb-1">
                                        {Array.from({ length: f.dots }, (_, i) => (
                                            <span key={i} className={`w-2 h-2 rounded-full ${flow === f.id ? 'bg-white' : 'bg-pink-400'}`} />
                                        ))}
                                    </div>
                                    <span className="text-xs font-medium">{f.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Symptoms */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Symptoms <span className="text-gray-400">({symptoms.length} selected)</span>
                        </label>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {SYMPTOMS.map(s => (
                                <button key={s.id} type="button" onClick={() => toggleSymptom(s.id)}
                                    className={`p-2 rounded-xl text-center transition-all ${symptoms.includes(s.id)
                                            ? 'bg-pink-500 text-white shadow-md shadow-pink-500/20'
                                            : 'bg-pink-50 text-gray-600 hover:bg-pink-100'
                                        }`}>
                                    <div className="text-lg">{s.emoji}</div>
                                    <span className="text-xs font-medium">{s.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Mood */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Mood</label>
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                            {MOODS.map(m => (
                                <button key={m.id} type="button" onClick={() => setMood(m.id)}
                                    className={`p-2 rounded-xl text-center transition-all ${mood === m.id
                                            ? 'bg-pink-500 text-white shadow-md shadow-pink-500/20'
                                            : 'bg-pink-50 text-gray-600 hover:bg-pink-100'
                                        }`}>
                                    <div className="text-lg">{m.emoji}</div>
                                    <span className="text-xs font-medium">{m.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <textarea value={notes} onChange={e => setNotes(e.target.value)}
                            className="input-field resize-none" rows={3}
                            placeholder="Any additional notes..." maxLength={500} />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                        {loading ? 'Saving...' : 'Log Cycle 🌸'}
                    </button>
                </form>
            </div>
        </div>
    );
}
