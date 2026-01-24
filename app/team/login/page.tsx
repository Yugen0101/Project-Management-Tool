'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

function TeamLoginForm() {
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
        } else if (errorParam === 'unauthorized') {
            setError('Access denied. This login is for Team Members only.');
        } else if (errorParam === 'profile_not_found') {
            setError('Account profile not found. Contact Admin.');
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

            // Fetch user profile to check role
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('role')
                .eq('id', data.user.id)
                .single();

            if (userError || !userData) {
                await supabase.auth.signOut();
                setError('Profile validation failed.');
                setLoading(false);
                return;
            }

            if (userData.role !== 'team_member' && userData.role !== 'member') {
                await supabase.auth.signOut();
                setError('Only Team Members are permitted to use this portal.');
                setLoading(false);
                return;
            }

            // Force page reload to trigger middleware and redirect to dashboard
            window.location.href = '/team/dashboard';
        } catch (err) {
            console.error('Login error:', err);
            setError('An unexpected error occurred. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#1c1917] relative overflow-hidden px-6 selection:bg-[#d97757] selection:text-white">
            {/* Dark Mode Geometric Background Element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#292524] rounded-full -z-10 opacity-50"></div>
            <div className="absolute top-[-5%] right-[-5%] w-64 h-64 bg-[#d97757]/10 rounded-3xl rotate-12 -z-10 text-white font-black text-8xl flex items-center justify-center">T</div>

            <div className="w-full max-w-md relative z-10">
                <div className="card shadow-2xl shadow-black/50 border-[#44403c] bg-[#292524] text-[#f7f3ed]">
                    <div className="text-center mb-10">
                        <div className="relative w-48 h-48 mx-auto mb-4 grayscale invert">
                            <Image src="/logo.png" alt="Logo" fill className="object-contain" />
                        </div>
                        <h1 className="text-3xl font-black text-white mb-2 tracking-tighter uppercase italic">
                            TEAM<span className="text-[#d97757]">PORTAL</span>
                        </h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 italic">
                            Restricted Access Node
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="bg-red-950/50 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-1">
                                Team Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-5 py-4 bg-[#1c1917] border border-[#44403c] rounded-2xl text-[13px] font-bold text-white placeholder-white/20 focus:outline-none focus:border-[#d97757] transition-all"
                                placeholder="name@company.com"
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label htmlFor="password" className="block text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                                    Access Key
                                </label>
                            </div>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-5 py-4 bg-[#1c1917] border border-[#44403c] rounded-2xl text-[13px] font-bold text-white placeholder-white/20 focus:outline-none focus:border-[#d97757] transition-all"
                                placeholder="••••••••"
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-[#d97757] text-white rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed text-[11px] font-black uppercase tracking-[0.3em] hover:bg-[#c26242] transition-all active:scale-[0.98]"
                        >
                            {loading ? 'AUTHENTICATING...' : 'AUTHORIZE SESSION'}
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-white/5 pt-8">
                        <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">Operational Protocol v.2.7-TM</p>
                    </div>
                </div>

                <div className="mt-8 text-center text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
                    <p>© 2026 TaskForge Intelligence. Secure connection active.</p>
                </div>
            </div>

            {/* Subtle Texture Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
        </div>
    );
}

export default function TeamLoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#1c1917]">
                <div className="w-8 h-8 border-4 border-[#d97757] border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <TeamLoginForm />
        </Suspense>
    );
}
