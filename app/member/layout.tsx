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
import MemberMobileMenu from '@/components/navigation/MemberMobileMenu';
import { Toaster } from 'sonner';

export default async function MemberLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    return (
<<<<<<< HEAD
        <div className="min-h-screen bg-beige-50 text-[#1c1917] flex flex-col relative overflow-hidden selection:bg-accent-500 selection:text-white">
            {/* Subtle background glow */}
            <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-beige-100/50 blur-[100px] rounded-full -z-10"></div>

            <Toaster position="top-right" richColors />

            {/* Refined Top Navigation */}
            <header className="h-20 bg-white/80 border-b border-beige-200 px-6 sm:px-12 flex items-center justify-between sticky top-0 z-50 backdrop-blur-xl">
                <div className="flex items-center gap-4 sm:gap-10">
                    <div className="flex items-center gap-3">
                        <MemberMobileMenu />
                        <div className="relative w-12 h-12 flex items-center justify-center">
                            <Image src="/logo.png" alt="Logo" width={40} height={40} className="object-contain" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-[#1c1917] hidden sm:block">
                            Task<span className="text-accent-600">Forge</span>
                        </h1>
=======
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
>>>>>>> f8a9eddf51e5dc62867bfd05e707e9748c4cf529
                    </div>

                    <MemberNav />
                </div>

<<<<<<< HEAD
                <div className="flex items-center gap-5">
                    <NotificationCenter />
                    <div className="h-6 w-px bg-beige-200 mx-1"></div>
                    <div className="flex items-center gap-3 bg-beige-50 p-1.5 pr-4 rounded-xl border border-beige-100">
                        <div className="w-8 h-8 rounded-lg bg-accent-500 flex items-center justify-center text-xs font-bold text-white shadow-md shadow-accent-500/20">
                            {user?.full_name?.charAt(0) || 'M'}
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-xs font-bold text-[#1c1917] leading-tight">{user?.full_name}</p>
                            <p className="text-[10px] font-bold text-[#1c1917]/40 uppercase tracking-tight mt-0.5">
=======
                <div className="flex items-center gap-6">
                    <NotificationCenter />
                    <div className="h-8 w-px bg-border mx-1"></div>
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-secondary-900">{user?.full_name}</p>
                            <p className="text-[10px] font-bold text-primary-500 uppercase tracking-widest">
>>>>>>> f8a9eddf51e5dc62867bfd05e707e9748c4cf529
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
