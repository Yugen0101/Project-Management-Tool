import { getCurrentUser } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Toaster } from 'sonner';
import AdminNav from '@/components/navigation/AdminNav';
import SignOutButton from '@/components/auth/SignOutButton';
import TaskForgeLogo from '@/components/ui/TaskForgeLogo';
import AdminHeader from '@/components/navigation/AdminHeader';

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
        <div className="min-h-screen bg-[#fdfcf9] text-[#1c1917] flex flex-col">
            <Toaster position="top-right" richColors />

            {/* Application Layer */}
            <div className="flex flex-1 min-h-screen">
                {/* Sidebar - Branded Identity Hub */}
                <aside className="w-72 bg-white/50 border-r border-[#e5dec9] hidden lg:flex flex-col fixed inset-y-0 z-50">
                    <div className="p-10 pb-4">
                        <div className="flex flex-col items-center gap-4 text-center">
                            <TaskForgeLogo size="lg" />
                            <div>
                                <h1 className="text-xl font-bold tracking-tight uppercase leading-none">
                                    Task<span className="text-accent-500">Forge</span>
                                </h1>
                                <span className="block text-[10px] text-accent-500 uppercase tracking-[0.35em] font-bold mt-2">Executive Suite</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <AdminNav counts={counts} />
                    </div>

                    {/* Footer Profile & Sign Out - Matches Member */}
                    <div className="p-6 border-t border-[#e5dec9] bg-white/30">
                        <div className="flex items-center gap-3 px-4 py-4 bg-[#f7f3ed] rounded-[1.25rem] border border-[#e5dec9] shadow-sm mb-4 group hover:border-accent-200 transition-all">
                            <div className="w-9 h-9 rounded-xl bg-accent-500 text-white flex items-center justify-center font-bold text-xs shadow-lg shadow-accent-500/20 group-hover:scale-105 transition-transform">
                                {user.full_name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-bold text-[#1c1917] truncate uppercase tracking-tight">{user.full_name}</p>
                                <p className="text-[8px] font-bold text-accent-500 uppercase tracking-[0.2em] truncate">Management</p>
                            </div>
                        </div>
                        <div className="px-4">
                            <SignOutButton />
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 lg:ml-72 flex flex-col min-h-screen">
                    <AdminHeader counts={counts} />

                    <main className="p-12 relative z-10 max-w-[1600px] w-full mx-auto">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
