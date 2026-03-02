'use client';
import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import api from '@/lib/api';

function VerifyContent() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const { verifyOtp } = useAuth();
    const router = useRouter();

    const handleVerify = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        setLoading(true);
        try {
            await verifyOtp(email, otp);
            router.push('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Verification failed.');
        } finally { setLoading(false); }
    };

    const handleResend = async () => {
        setError(''); setSuccess('');
        try {
            await api.post('/auth/resend-otp', { email });
            setSuccess('New OTP sent to your email!');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to resend OTP.');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="glass-card p-8 w-full max-w-md animate-fade-in">
                <div className="text-center mb-8">
                    <div className="text-4xl mb-3">📧</div>
                    <h1 className="text-2xl font-bold text-gray-800">Verify Your Email</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        We've sent a 6-digit code to <strong className="text-pink-600">{email}</strong>
                    </p>
                </div>

                {error && <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100">{error}</div>}
                {success && <div className="mb-4 p-3 rounded-xl bg-green-50 text-green-600 text-sm border border-green-100">{success}</div>}

                <form onSubmit={handleVerify} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
                        <input type="text" value={otp} onChange={e => setOtp(e.target.value)}
                            className="input-field text-center text-2xl tracking-[0.5em] font-bold"
                            placeholder="000000" maxLength={6} required />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                        {loading ? 'Verifying...' : 'Verify Email ✓'}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <button onClick={handleResend} className="text-sm text-pink-600 font-medium hover:underline">
                        Didn't receive the code? Resend
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center"><div className="text-pink-400">Loading...</div></div>}>
            <VerifyContent />
        </Suspense>
    );
}
