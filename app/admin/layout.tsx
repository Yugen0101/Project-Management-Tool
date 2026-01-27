import { getCurrentUser } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import NotificationCenter from '@/components/notifications/NotificationCenter';
import { Toaster } from 'sonner';
import { VideoCameraIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import AdminNav from '@/components/navigation/AdminNav';
import AdminMobileMenu from '@/components/navigation/AdminMobileMenu';
import SignOutButton from '@/components/auth/SignOutButton';
import TaskForgeLogo from '@/components/ui/TaskForgeLogo';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    if (!user || user.role !== 'admin') {
        redirect('/login');
    }

    const supabase = await createClient();

    // Get stats for sidebar
    const { count: projectCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true });

    const { count: userCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

    const { count: taskCount } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true });

    const counts = {
        projectCount: projectCount || 0,
        userCount: userCount || 0,
        taskCount: taskCount || 0
    };

    return (
        <div className="min-h-screen bg-[#fdfcf9] text-[#1c1917]">
            <Toaster position="top-right" richColors />

            {/* Main Header - Refined for prominent branding */}
            <header className="h-24 bg-white border-b border-[#e5dec9]/60 sticky top-0 z-50 flex items-center justify-between px-10 shadow-sm shadow-[#d9cfb0]/5">
                <div className="flex items-center gap-10">
                    <div className="flex items-center gap-6">
                        <TaskForgeLogo size="lg" />
                        <div className="flex flex-col justify-center">
                            <h1 className="text-2xl font-bold tracking-tighter uppercase leading-none">
                                Task<span className="text-accent-500">Forge</span>
                            </h1>
                            <span className="text-[10px] text-[#1c1917]/30 font-semibold tracking-[0.4em] uppercase mt-1.5">Executive Suite</span>
                        </div>
                    </div>

                    {/* Module Indicators */}
                    <div className="hidden lg:flex items-center gap-8 border-l border-[#e5dec9] pl-10">
                        <div className="flex items-center gap-2.5">
                            <div className="w-2 h-2 rounded-full bg-status-success shadow-[0_0_10px_rgba(124,148,115,0.4)]"></div>
                            <span className="text-[10px] font-semibold text-[#1c1917]/40 uppercase tracking-[0.2em]">Status: Operational</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-8">

                    <NotificationCenter />
                    <div className="flex items-center gap-8 pl-8 border-l border-[#e5dec9]">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold uppercase tracking-tight">{user.full_name}</p>
                            <p className="text-[9px] font-semibold text-accent-500 uppercase tracking-[0.2em] mt-0.5">Management</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-accent-500 text-white flex items-center justify-center font-bold text-sm shadow-xl shadow-accent-500/20">
                            {user.full_name.charAt(0)}
                        </div>
                        <div className="border-l border-[#e5dec9] pl-8">
                            <SignOutButton />
                        </div>
                    </div>
                    <div className="lg:hidden">
                        <AdminMobileMenu
                            counts={{
                                projectCount: projectCount || 0,
                                userCount: userCount || 0,
                                taskCount: taskCount || 0
                            }}
                        />
                    </div>
                </div>
            </header>

            <div className="flex items-start">
                {/* Sidebar */}
                <aside className="w-72 bg-white/50 border-r border-[#e5dec9] h-[calc(100vh-96px)] sticky top-24 overflow-y-auto hidden lg:block">
                    <AdminNav
                        counts={{
                            projectCount: projectCount || 0,
                            userCount: userCount || 0,
                            taskCount: taskCount || 0
                        }}
                    />
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-12 bg-white/30 min-h-[calc(100vh-96px)] max-w-[1600px] mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
