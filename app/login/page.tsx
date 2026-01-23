'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const errorParam = searchParams.get('error');
        if (errorParam === 'inactive') {
            setError('Your account is inactive. Please contact an administrator.');
        }
    }, [searchParams]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const supabase = createClient();

            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) {
                setError(signInError.message);
                setLoading(false);
                return;
            }

            // Force page reload to trigger middleware
            window.location.href = '/admin/dashboard';
        } catch (err) {
            console.error('Login error:', err);
            setError('An unexpected error occurred. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden px-6">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/10 blur-[150px] rounded-full"></div>

            <div className="w-full max-w-md relative z-10">
                <div className="card border-slate-800/50 bg-slate-900/40 shadow-2xl shadow-primary-500/5">
                    <div className="text-center mb-10">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-purple rounded-xl flex items-center justify-center text-white font-black italic text-xl mx-auto mb-4 shadow-lg shadow-primary-500/20">
                            T
                        </div>
                        <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
                            Task<span className="text-primary-500">Forge</span>
                        </h1>
                        <p className="text-slate-500 font-medium">
                            Enter the workspace
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-xs font-black uppercase tracking-widest text-slate-500 ml-1">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="input"
                                placeholder="you@example.com"
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label htmlFor="password" className="block text-xs font-black uppercase tracking-widest text-slate-500">
                                    Password
                                </label>
                                <a href="#" className="text-[10px] font-black uppercase tracking-widest text-primary-500 hover:text-primary-400">Forgot?</a>
                            </div>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="input"
                                placeholder="••••••••"
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed text-base font-black uppercase tracking-widest"
                        >
                            {loading ? 'Authorizing...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-8 text-center uppercase tracking-widest">
                        <p className="text-[10px] font-black text-slate-600">Restricted Access</p>
                    </div>
                </div>

                <div className="mt-8 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
                    <p>© 2026 TaskForge. Secure Project Management.</p>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
