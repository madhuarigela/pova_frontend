'use client';
import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [consent, setConsent] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!consent) { setError('Please consent to data collection.'); return; }
        setLoading(true);
        try {
            await signup(email, password, name, consent);
            router.push(`/verify?email=${encodeURIComponent(email)}`);
        } catch (err) {
            setError(err.response?.data?.error || 'Signup failed.');
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="glass-card p-8 w-full max-w-md animate-fade-in">
                <div className="text-center mb-8">
                    <div className="text-4xl mb-3">✨</div>
                    <h1 className="text-2xl font-bold text-gray-800">Create Your Account</h1>
                    <p className="text-gray-500 text-sm mt-1">Start tracking your cycle with care</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)}
                            className="input-field" placeholder="Your name" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                            className="input-field" placeholder="hello@example.com" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                            className="input-field" placeholder="At least 6 characters" required minLength={6} />
                    </div>

                    <label className="flex items-start gap-3 p-3 rounded-xl bg-pink-50 cursor-pointer">
                        <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)}
                            className="mt-1 w-4 h-4 accent-pink-500" />
                        <span className="text-xs text-gray-600">
                            I consent to the collection and processing of my health data as described in the{' '}
                            <span className="text-pink-600 font-medium">Privacy Policy</span>. I understand this app
                            does not replace professional medical advice.
                        </span>
                    </label>

                    <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                        {loading ? 'Creating account...' : 'Sign Up 🌸'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Already have an account?{' '}
                    <Link href="/login" className="text-pink-600 font-medium hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
}
