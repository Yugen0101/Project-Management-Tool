import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/session';
import {
    HomeIcon,
    ListBulletIcon,
    ClockIcon,
    ChatBubbleLeftRightIcon,
    ArrowRightOnRectangleIcon,
    BellIcon,
    RectangleGroupIcon,
    VideoCameraIcon
} from '@heroicons/react/24/outline';
import SignOutButton from '@/components/auth/SignOutButton';
import NotificationCenter from '@/components/notifications/NotificationCenter';
import MemberNav from '@/components/member/MemberNav';
import { Toaster } from 'sonner';

export default async function MemberLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Toaster position="top-right" richColors />
            
            {/* Professional Top Navigation */}
            <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-border sticky top-0 z-50 flex items-center justify-between px-10">
                <div className="flex items-center gap-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
                            <RectangleGroupIcon className="w-6 h-6" />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-secondary-900 leading-tight">TaskForge</h1>
                    </div>

                    <MemberNav />
                </div>

                <div className="flex items-center gap-6">
                    <NotificationCenter />
                    <div className="h-8 w-px bg-border mx-1"></div>
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-secondary-900">{user?.full_name}</p>
                            <p className="text-[10px] font-bold text-primary-500 uppercase tracking-widest">
                                {user?.role === 'admin' ? 'Administrator' :
                                    user?.role === 'associate' ? 'Project Lead' : 'Contributor'}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-sm font-bold text-primary-600 border border-primary-100">
                            {user?.full_name?.charAt(0) || 'M'}
                        </div>
                    </div>
                    <SignOutButton />
                </div>
            </header>

            {/* Content Area */}
            <main className="flex-1 p-10 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
