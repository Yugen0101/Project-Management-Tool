import { getCurrentUser } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import NotificationCenter from '@/components/notifications/NotificationCenter';
import { Toaster } from 'sonner';
<<<<<<< HEAD
import { VideoCameraIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import AdminNav from '@/components/navigation/AdminNav';
import AdminMobileMenu from '@/components/navigation/AdminMobileMenu';
=======
import { 
    HomeIcon, 
    BriefcaseIcon, 
    UserGroupIcon, 
    ClipboardDocumentListIcon, 
    VideoCameraIcon,
    ShieldCheckIcon,
    RectangleGroupIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import AdminProfileSection from '@/components/admin/AdminProfileSection';
>>>>>>> f8a9eddf51e5dc62867bfd05e707e9748c4cf529

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
        <div className="min-h-screen bg-background text-foreground flex">
            <Toaster position="top-right" richColors />
<<<<<<< HEAD
            {/* Header */}
            <header className="bg-white/80 border-b border-[#e5dec9] sticky top-0 z-50 backdrop-blur-xl">
                <div className="px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 py-2">
                            <AdminMobileMenu counts={counts} />
                            <div className="relative w-32 h-32 -my-6 hidden md:block">
                                <Image src="/logo.png" alt="Logo" fill className="object-contain" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black text-[#1c1917] tracking-tight">Task<span className="text-[#c26242]">Forge</span></h1>
                                <p className="text-[14px] font-black text-[#c26242] uppercase tracking-[0.2em]">Operations HUB</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <NotificationCenter />
                            {user && (
                                <div className="flex items-center gap-4 border-l border-[#e5dec9] pl-6">
                                    <div className="text-right">
                                        <p className="text-sm font-black text-[#1c1917]">{user.full_name}</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[#d97757]">{user.role}</p>
                                    </div>
                                    <form action="/api/auth/signout" method="POST">
                                        <button type="submit" className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-red-600 bg-red-50 border border-red-100 hover:bg-red-600 hover:text-white hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300">
                                            Sign Out
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
=======

            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-border h-screen sticky top-0 flex flex-col">
                <div className="h-20 px-6 border-b border-border flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
                        <RectangleGroupIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-secondary-900 leading-tight">TaskForge</h1>
                        <p className="text-[10px] font-bold text-primary-500 uppercase tracking-widest">Admin Node</p>
>>>>>>> f8a9eddf51e5dc62867bfd05e707e9748c4cf529
                    </div>
                </div>

<<<<<<< HEAD
            <div className="flex items-start">
                {/* Sidebar */}
                <aside className="w-72 bg-white/50 border-r border-[#e5dec9] h-[calc(100vh-73px)] sticky top-[73px] overflow-y-auto">
                    <AdminNav
                        counts={{
                            projectCount: projectCount || 0,
                            userCount: userCount || 0,
                            taskCount: taskCount || 0
                        }}
                    />
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-12 bg-white/30 min-h-[calc(100vh-73px)]">
                    {children}
=======
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto mt-4">
                    <div className="text-[10px] font-bold text-secondary-400 uppercase tracking-[0.2em] px-4 mb-4">Core Management</div>
                    
                    <Link href="/admin/dashboard" className="nav-link">
                        <HomeIcon className="w-5 h-5" />
                        <span>Dashboard</span>
                    </Link>

                    <Link href="/admin/projects" className="nav-link">
                        <BriefcaseIcon className="w-5 h-5" />
                        <span>Projects</span>
                        <span className="ml-auto px-2 py-0.5 bg-secondary-100 text-secondary-600 rounded-md text-[10px] font-bold">
                            {projectCount || 0}
                        </span>
                    </Link>

                    <Link href="/admin/users" className="nav-link">
                        <UserGroupIcon className="w-5 h-5" />
                        <span>Personnel</span>
                        <span className="ml-auto px-2 py-0.5 bg-secondary-100 text-secondary-600 rounded-md text-[10px] font-bold">
                            {userCount || 0}
                        </span>
                    </Link>

                    <div className="text-[10px] font-bold text-secondary-400 uppercase tracking-[0.2em] px-4 pt-6 mb-4">Operations</div>

                    <Link href="/admin/tasks" className="nav-link">
                        <ClipboardDocumentListIcon className="w-5 h-5" />
                        <span>All Tasks</span>
                        <span className="ml-auto px-2 py-0.5 bg-secondary-100 text-secondary-600 rounded-md text-[10px] font-bold">
                            {taskCount || 0}
                        </span>
                    </Link>

                    <Link href="/admin/meetings" className="nav-link">
                        <VideoCameraIcon className="w-5 h-5" />
                        <span>Meetings</span>
                    </Link>

                    <Link href="/admin/audit-logs" className="nav-link">
                        <ShieldCheckIcon className="w-5 h-5" />
                        <span>Audit Registry</span>
                    </Link>
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-border mt-auto">
                    <AdminProfileSection user={user} />
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-border sticky top-0 z-50 flex items-center justify-end px-10">
                    <div className="flex items-center gap-4">
                        <NotificationCenter />
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 p-10 overflow-y-auto animate-in fade-in duration-500">
                    <div className="max-w-[1600px] mx-auto">
                        {children}
                    </div>
>>>>>>> f8a9eddf51e5dc62867bfd05e707e9748c4cf529
                </main>
            </div>
        </div>
    );
}
