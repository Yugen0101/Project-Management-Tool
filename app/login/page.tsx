'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import { RectangleGroupIcon, ShieldCheckIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

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
                // Ensure we handle redirects based on role if needed, 
                // but usually middleware handles this after cookie is set.
            });

            if (signInError) {
                setError(signInError.message);
                setLoading(false);
                return;
            }

            // Force page reload to trigger middleware and session sync
            window.location.href = '/admin/dashboard';
        } catch (err) {
            console.error('Login error:', err);
            setError('An unexpected error occurred. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-6 selection:bg-primary-500 selection:text-white">
            {/* Ambient Animated Glows */}
            <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-primary-100/20 rounded-full blur-[120px] animate-float" style={{ animationDuration: '12s' }}></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-indigo-100/10 rounded-full blur-[100px] animate-float" style={{ animationDuration: '18s', animationDelay: '3s' }}></div>

            <div className="w-full max-w-[480px] relative z-10 animate-in fade-in zoom-in-95 duration-1000">
                <div className="card-glass p-10 md:p-14 shadow-premium backdrop-blur-2xl relative overflow-hidden">
                    {/* Interior Glow Overlay */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-600/0 via-primary-600/50 to-primary-600/0"></div>
                    
                    <div className="text-center mb-12">
                        <div className="w-20 h-20 bg-primary-600 rounded-[2rem] flex items-center justify-center text-white mx-auto mb-8 shadow-2xl shadow-primary-500/30 animate-in slide-in-from-bottom-4 duration-700">
                            <RectangleGroupIcon className="w-10 h-10" />
                        </div>
                        <h1 className="text-4xl font-bold text-secondary-900 mb-3 tracking-tighter">
                            TaskForge
                        </h1>
                        <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-[0.3em]">
                            Authenticated Node Authorization
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-8">
                        {error && (
                            <div className="bg-rose-50 border border-rose-100 text-rose-600 px-5 py-4 rounded-2xl text-[11px] font-bold text-center italic animate-in fade-in slide-in-from-top-2">
                                {error}
                            </div>
                        )}

                        <div className="space-y-3">
                            <label htmlFor="email" className="block text-[10px] font-bold text-secondary-400 uppercase tracking-widest ml-1">
                                Identity Identifier
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="input"
                                placeholder="name@company.protocol"
                                disabled={loading}
                                suppressHydrationWarning
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center ml-1">
                                <label htmlFor="password" className="block text-[10px] font-bold text-secondary-400 uppercase tracking-widest">
                                    Access Sequence
                                </label>
                                <a href="#" className="text-[10px] font-bold text-primary-600 hover:text-primary-700 uppercase tracking-widest">Recovery</a>
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
                                suppressHydrationWarning
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary h-16 text-sm font-bold flex items-center justify-center gap-3 group"
                            suppressHydrationWarning
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span>Authorize Access</span>
                                    <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 pt-10 border-t border-border/40 flex items-center justify-center gap-3 text-secondary-300">
                        <ShieldCheckIcon className="w-4 h-4 text-primary-500 animate-pulse" />
                        <span className="text-[9px] font-bold uppercase tracking-[0.4em]">End-to-End Encrypted Node</span>
                    </div>
                </div>

                <div className="mt-10 text-center animate-in fade-in duration-1000 delay-500 fill-mode-both">
                    <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest">
                        TaskForge Core Service Platform © 2026. <span className="text-secondary-300">v2.8.4-stable</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
