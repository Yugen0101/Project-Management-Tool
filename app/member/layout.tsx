import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/session';
import {
    HomeIcon,
    ListBulletIcon,
    ClockIcon,
    ChatBubbleLeftRightIcon,
    ArrowRightOnRectangleIcon,
    BellIcon
} from '@heroicons/react/24/outline';
import SignOutButton from '@/components/auth/SignOutButton';
import NotificationCenter from '@/components/notifications/NotificationCenter';
import { Toaster } from 'sonner';

export default async function MemberLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <Toaster position="top-right" richColors />
            {/* Simple Top Navigation */}
            <header className="h-16 bg-slate-900/50 border-b border-slate-800/50 px-6 sm:px-12 flex items-center justify-between sticky top-0 z-20 backdrop-blur-xl shadow-lg shadow-primary-500/5">
                <div className="flex items-center gap-8">
                    <h1 className="text-xl font-black tracking-tighter text-white flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-purple rounded-lg flex items-center justify-center text-white font-black italic shadow-lg shadow-primary-500/20">T</div>
                        TaskForge
                    </h1>

                    <nav className="hidden md:flex items-center gap-2">
                        <Link href="/member/tasks" className="px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary-400 transition-all bg-slate-900/50 rounded-lg border border-slate-800/50">
                            Workspace
                        </Link>
                        <Link href="/member/activity" className="px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary-400 transition-all">
                            Activity
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <NotificationCenter />
                    <div className="h-8 w-px bg-slate-800 mx-1"></div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center text-xs font-bold text-primary-400 border border-primary-500/20 shadow-inner">
                            {user?.full_name?.charAt(0) || 'M'}
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-xs font-bold text-white leading-none">{user?.full_name}</p>
                            <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest mt-1">
                                {user?.role === 'admin' ? 'Administrator' :
                                    user?.role === 'associate' ? 'Project Lead' :
                                        user?.role === 'guest' ? 'Guest View' : 'Contributor'}
                            </p>
                        </div>
                    </div>
                    <SignOutButton />
                </div>
            </header>

            {/* Content Area */}
            <main className="flex-1 max-w-6xl mx-auto w-full p-6 sm:p-12">
                {children}
            </main>
        </div>
    );
}
