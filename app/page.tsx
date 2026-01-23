export default function HomePage() {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-purple/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10 text-center space-y-8 max-w-4xl">
                {/* Logo / Name */}
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-purple rounded-2xl flex items-center justify-center text-white font-black italic text-3xl shadow-2xl shadow-primary-500/20">
                        T
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter">
                        Task<span className="text-primary-500">Forge</span>
                    </h1>
                </div>

                <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto">
                    Supercharge your teamwork. <span className="text-slate-100">Streamline your workflow.</span> Simplify tasks, boost collaboration, and achieve more.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                    <a href="/login" className="btn-primary px-8 py-4 text-lg">
                        Start for Free
                    </a>
                    <a href="/login" className="btn-secondary px-8 py-4 text-lg border-slate-700">
                        See it in Action
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
                    <div className="card bg-slate-900/40 border-slate-800/50 p-6 text-left hover:border-primary-500/50 transition-all group">
                        <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">High Velocity</h3>
                        <p className="text-sm text-slate-500">Agile methodology refined for speed and precision.</p>
                    </div>
                    <div className="card bg-slate-900/40 border-slate-800/50 p-6 text-left hover:border-accent-purple/50 transition-all group">
                        <div className="w-10 h-10 bg-accent-purple/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6 text-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Deep Insights</h3>
                        <p className="text-sm text-slate-500">Real-time analytics for your team's performance.</p>
                    </div>
                    <div className="card bg-slate-900/40 border-slate-800/50 p-6 text-left hover:border-accent-green/50 transition-all group">
                        <div className="w-10 h-10 bg-accent-green/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 21a11.955 11.955 0 01-9.618-7.016m18.236 0a11.958 11.958 0 00-18.236 0m18.236 0a11.956 11.956 0 01-18.236 0" /></svg>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Secure Governance</h3>
                        <p className="text-sm text-slate-500">Enterprise-grade security and role-based access.</p>
                    </div>
                </div>
            </div>

            {/* Subtle Grid Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
        </div>
    );
}
