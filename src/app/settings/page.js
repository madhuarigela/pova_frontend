'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function SettingsPage() {
    const { user, loading: authLoading, logout, updateUser } = useAuth();
    const router = useRouter();
    const [name, setName] = useState('');
    const [cycleLength, setCycleLength] = useState(28);
    const [periodLength, setPeriodLength] = useState(5);
    const [darkMode, setDarkMode] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [deleteEmail, setDeleteEmail] = useState('');
    const [showDelete, setShowDelete] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) { router.push('/login'); return; }
        if (user) {
            setName(user.name || '');
            setCycleLength(user.cycleLength || 28);
            setPeriodLength(user.averagePeriodLength || 5);
            setDarkMode(user.darkMode || false);
        }
    }, [user, authLoading]);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    const saveProfile = async () => {
        setSaving(true); setMessage('');
        try {
            const res = await api.put('/user/profile', { name, cycleLength, averagePeriodLength: periodLength, darkMode });
            updateUser(res.data.user);
            setMessage('Settings saved! ✨');
        } catch (err) {
            setMessage('Failed to save settings.');
        } finally { setSaving(false); }
    };

    const exportData = async () => {
        try {
            const res = await api.get('/user/export');
            const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = 'period-helper-data.json'; a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            alert('Failed to export data.');
        }
    };

    const deleteAccount = async () => {
        if (!deleteEmail) return;
        try {
            await api.delete('/user/account', { data: { confirmEmail: deleteEmail } });
            logout();
            router.push('/');
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to delete account.');
        }
    };

    if (authLoading) return null;

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="mb-8 animate-fade-in">
                <h1 className="text-3xl font-bold text-gray-800">⚙️ Settings</h1>
                <p className="text-gray-500 mt-1">Manage your profile and preferences</p>
            </div>

            {/* Profile Settings */}
            <div className="glass-card p-6 mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <h2 className="text-lg font-bold text-gray-800 mb-4">👤 Profile</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)}
                            className="input-field" placeholder="Your name" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cycle Length (days)</label>
                            <input type="number" value={cycleLength} onChange={e => setCycleLength(parseInt(e.target.value))}
                                className="input-field" min={21} max={45} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Period Length (days)</label>
                            <input type="number" value={periodLength} onChange={e => setPeriodLength(parseInt(e.target.value))}
                                className="input-field" min={1} max={10} />
                        </div>
                    </div>
                </div>
                {message && (
                    <div className="mt-4 p-2 rounded-xl bg-green-50 text-green-600 text-sm text-center">{message}</div>
                )}
                <button onClick={saveProfile} disabled={saving} className="btn-primary w-full mt-4">
                    {saving ? 'Saving...' : 'Save Settings'}
                </button>
            </div>

            {/* Appearance */}
            <div className="glass-card p-6 mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <h2 className="text-lg font-bold text-gray-800 mb-4">🎨 Appearance</h2>
                <label className="flex items-center justify-between cursor-pointer">
                    <div>
                        <p className="font-medium text-gray-800">Dark Mode</p>
                        <p className="text-sm text-gray-500">Easy on the eyes at night</p>
                    </div>
                    <div className={`w-14 h-7 rounded-full transition-colors relative cursor-pointer ${darkMode ? 'bg-pink-500' : 'bg-gray-300'
                        }`} onClick={() => setDarkMode(!darkMode)}>
                        <div className={`w-5 h-5 rounded-full bg-white absolute top-1 transition-transform ${darkMode ? 'translate-x-8' : 'translate-x-1'
                            }`} />
                    </div>
                </label>
            </div>

            {/* Privacy & Data */}
            <div className="glass-card p-6 mb-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <h2 className="text-lg font-bold text-gray-800 mb-4">🔒 Privacy & Data</h2>
                <div className="space-y-3">
                    <button onClick={exportData} className="btn-secondary w-full">
                        📥 Download My Data
                    </button>
                    <div className="p-3 rounded-xl bg-pink-50 text-xs text-gray-600">
                        <p className="font-medium text-gray-700 mb-1">Your privacy matters 💗</p>
                        <p>Your health data is encrypted and stored securely. We never share your data with third parties.
                            You can download or permanently delete your data at any time.</p>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="glass-card p-6 animate-fade-in border-red-100" style={{ animationDelay: '0.4s' }}>
                <h2 className="text-lg font-bold text-red-600 mb-4">⚠️ Danger Zone</h2>
                {!showDelete ? (
                    <button onClick={() => setShowDelete(true)} className="w-full p-3 rounded-xl border-2 border-red-200 text-red-600 font-medium hover:bg-red-50 transition">
                        Delete My Account
                    </button>
                ) : (
                    <div className="space-y-3">
                        <p className="text-sm text-gray-600">
                            This will permanently delete your account and all associated data. This action cannot be undone.
                        </p>
                        <input type="email" value={deleteEmail} onChange={e => setDeleteEmail(e.target.value)}
                            className="input-field border-red-200" placeholder="Type your email to confirm" />
                        <div className="flex gap-2">
                            <button onClick={deleteAccount} className="flex-1 p-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition">
                                Permanently Delete
                            </button>
                            <button onClick={() => setShowDelete(false)} className="flex-1 p-3 rounded-xl bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition">
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <p className="text-center text-xs text-gray-400 mt-8">
                This app does not replace professional medical advice.
            </p>
        </div>
    );
}
