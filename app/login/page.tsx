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
<<<<<<< HEAD
        <div className="min-h-screen flex items-center justify-center bg-beige-50 relative overflow-hidden px-6 selection:bg-accent-500 selection:text-white">
            {/* Warm Beige Decorative Background Elements */}
            <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[80%] bg-beige-100/50 blur-[120px] rounded-full -z-10"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[50%] bg-accent-100/30 blur-[100px] rounded-full -z-10"></div>

            <div className="w-full max-w-md relative z-10">
                <div className="card shadow-2xl shadow-beige-300/20 border-beige-200 !p-10">
                    <div className="text-center mb-10">
                        <div className="relative w-16 h-16 flex items-center justify-center mx-auto mb-6">
                            <Image src="/logo.png" alt="Logo" width={40} height={40} className="object-contain" />
                        </div>
                        <h1 className="text-3xl font-bold text-[#1c1917] mb-2 tracking-tight">
                            Task<span className="text-accent-600">Forge</span>
                        </h1>
                        <p className="text-xs font-bold uppercase tracking-wider text-[#1c1917]/40">
                            Secure Workspace Access
=======
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
>>>>>>> f8a9eddf51e5dc62867bfd05e707e9748c4cf529
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-8">
                        {error && (
<<<<<<< HEAD
                            <div className="bg-status-error/10 border border-status-error/20 text-status-error px-4 py-3 rounded-xl text-xs font-bold tracking-tight">
=======
                            <div className="bg-rose-50 border border-rose-100 text-rose-600 px-5 py-4 rounded-2xl text-[11px] font-bold text-center italic animate-in fade-in slide-in-from-top-2">
>>>>>>> f8a9eddf51e5dc62867bfd05e707e9748c4cf529
                                {error}
                            </div>
                        )}

<<<<<<< HEAD
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-xs font-bold text-[#1c1917]/50 ml-1">
                                Email Address
=======
                        <div className="space-y-3">
                            <label htmlFor="email" className="block text-[10px] font-bold text-secondary-400 uppercase tracking-widest ml-1">
                                Identity Identifier
>>>>>>> f8a9eddf51e5dc62867bfd05e707e9748c4cf529
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
<<<<<<< HEAD
                                className="input !py-3.5"
                                placeholder="name@company.com"
=======
                                className="input"
                                placeholder="name@company.protocol"
>>>>>>> f8a9eddf51e5dc62867bfd05e707e9748c4cf529
                                disabled={loading}
                                suppressHydrationWarning
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center ml-1">
<<<<<<< HEAD
                                <label htmlFor="password" className="block text-xs font-bold text-slate-500">
                                    Password
                                </label>
                                <a href="#" className="text-[10px] font-bold text-primary-500 hover:text-primary-600">Forgot Password?</a>
=======
                                <label htmlFor="password" className="block text-[10px] font-bold text-secondary-400 uppercase tracking-widest">
                                    Access Sequence
                                </label>
                                <a href="#" className="text-[10px] font-bold text-primary-600 hover:text-primary-700 uppercase tracking-widest">Recovery</a>
>>>>>>> f8a9eddf51e5dc62867bfd05e707e9748c4cf529
                            </div>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="input !py-3.5"
                                placeholder="••••••••"
                                disabled={loading}
                                suppressHydrationWarning
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
<<<<<<< HEAD
                            className="w-full btn-primary !py-4 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-primary-500/30"
                        >
                            {loading ? 'Authorizing...' : 'Sign In to Workspace'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Enterprise Protocol 2.6.0</p>
                    </div>
                </div>

                <div className="mt-8 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <p>© 2026 TaskForge. All Rights Reserved.</p>
                </div>
            </div>

            {/* Subtle Texture Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>
=======
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
>>>>>>> f8a9eddf51e5dc62867bfd05e707e9748c4cf529
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
<<<<<<< HEAD
            <div className="min-h-screen flex items-center justify-center bg-surface-50">
                <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
=======
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
>>>>>>> f8a9eddf51e5dc62867bfd05e707e9748c4cf529
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
