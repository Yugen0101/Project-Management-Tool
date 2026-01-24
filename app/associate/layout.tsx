import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/session';
import {
    HomeIcon,
    BriefcaseIcon,
    ClipboardDocumentListIcon,
    CalendarIcon,
    ChartBarIcon,
    VideoCameraIcon,
    BellIcon,
    UserCircleIcon,
    RectangleGroupIcon
} from '@heroicons/react/24/outline';
import SignOutButton from '@/components/auth/SignOutButton';
import NotificationCenter from '@/components/notifications/NotificationCenter';

export default async function AssociateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    return (
        <div className="min-h-screen bg-background text-foreground flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-border h-screen sticky top-0 hidden lg:flex flex-col">
                <div className="p-6 border-b border-border flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
                        <RectangleGroupIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-secondary-900 leading-tight">TaskForge</h1>
                        <p className="text-[10px] font-bold text-primary-500 uppercase tracking-widest">Project Lead</p>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto mt-4">
                    <div className="text-[10px] font-bold text-secondary-400 uppercase tracking-[0.2em] px-4 mb-4">Workspace</div>
                    
                    <Link href="/associate/dashboard" className="nav-link">
                        <HomeIcon className="w-5 h-5" />
                        <span>Dashboard</span>
                    </Link>

                    <Link href="/associate/projects" className="nav-link">
                        <BriefcaseIcon className="w-5 h-5" />
                        <span>My Projects</span>
                    </Link>

                    <Link href="/associate/tasks" className="nav-link">
                        <ClipboardDocumentListIcon className="w-5 h-5" />
                        <span>Task Registry</span>
                    </Link>

                    <div className="text-[10px] font-bold text-secondary-400 uppercase tracking-[0.2em] px-4 pt-6 mb-4">Operations</div>

                    <Link href="/associate/sprints" className="nav-link">
                        <CalendarIcon className="w-5 h-5" />
                        <span>Sprints</span>
                    </Link>

                    <Link href="/associate/reports" className="nav-link">
                        <ChartBarIcon className="w-5 h-5" />
                        <span>Analytics</span>
                    </Link>

                    <Link href="/associate/meetings" className="nav-link">
                        <VideoCameraIcon className="w-5 h-5" />
                        <span>Meetings</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-border mt-auto">
                    <div className="flex items-center gap-3 p-2 bg-secondary-50 rounded-xl">
                        <div className="w-9 h-9 rounded-lg bg-white border border-border flex items-center justify-center text-xs font-bold text-primary-600">
                            {user?.full_name?.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-secondary-900 truncate">{user?.full_name}</p>
                            <p className="text-[9px] text-primary-500 uppercase font-bold tracking-widest truncate">Associate Hub</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-border sticky top-0 z-50 flex items-center justify-between px-10">
                    <div className="lg:block hidden">
                        <h2 className="text-sm font-bold text-secondary-400 uppercase tracking-[0.3em]">Lead Portal</h2>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <NotificationCenter />
                        <div className="h-8 w-px bg-border mx-2"></div>
                        <SignOutButton />
                    </div>
                </header>

                <main className="flex-1 p-10 overflow-y-auto animate-in fade-in duration-500">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
