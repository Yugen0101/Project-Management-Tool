import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/session';
import {
<<<<<<< HEAD
    BellIcon,
} from '@heroicons/react/24/outline';
import SignOutButton from '@/components/auth/SignOutButton';
import AssociateNav from '@/components/navigation/AssociateNav';

import AssociateMobileMenu from '@/components/navigation/AssociateMobileMenu';
=======
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
>>>>>>> f8a9eddf51e5dc62867bfd05e707e9748c4cf529

export default async function AssociateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    return (
<<<<<<< HEAD
        <div className="min-h-screen bg-beige-50 text-[#1c1917] flex">
            {/* Sidebar */}
            <aside className="w-72 bg-white/50 backdrop-blur-md border-r border-[#e5dec9] hidden lg:flex flex-col fixed inset-y-0 z-50">
                <div className="p-8">
                    <div className="flex items-center gap-4">
                        <div className="relative w-32 h-32 -ml-4">
                            <Image src="/logo.png" alt="Logo" fill className="object-contain" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-[#1c1917]">
                            Task<span className="text-accent-600">Forge</span>
                            <span className="block text-xs text-accent-600 uppercase tracking-wider font-bold">Project Lead</span>
                        </h1>
                    </div>
                </div>

                <AssociateNav />

                <div className="p-6 mt-auto border-t border-beige-200">
                    <div className="flex items-center gap-3 px-4 py-3 bg-beige-50 rounded-xl border border-beige-200">
                        <div className="w-9 h-9 rounded-lg bg-beige-100 flex items-center justify-center text-xs font-bold text-accent-600 border border-beige-200">
                            {user?.full_name?.charAt(0) || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-[#1c1917] truncate">{user?.full_name}</p>
                            <p className="text-[10px] text-accent-600 uppercase font-bold tracking-wider truncate">Project Lead</p>
=======
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
>>>>>>> f8a9eddf51e5dc62867bfd05e707e9748c4cf529
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
<<<<<<< HEAD
                <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-beige-200 sticky top-0 z-40 px-6 sm:px-10 flex items-center justify-between">
                    <div className="flex items-center gap-4 lg:hidden">
                        <AssociateMobileMenu />
                        <div className="relative w-10 h-10">
                            <Image src="/logo.png" alt="Logo" fill className="object-contain" />
                        </div>
                        <h1 className="text-xl font-bold text-[#1c1917]">Task<span className="text-accent-600">Forge</span></h1>
                    </div>
                    <div className="hidden lg:block relative w-96">
                        <input type="text" placeholder="Global search..." className="input bg-white/50" />
=======
                <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-border sticky top-0 z-50 flex items-center justify-between px-10">
                    <div className="lg:block hidden">
                        <h2 className="text-sm font-bold text-secondary-400 uppercase tracking-[0.3em]">Lead Portal</h2>
>>>>>>> f8a9eddf51e5dc62867bfd05e707e9748c4cf529
                    </div>
                    
                    <div className="flex items-center gap-4">
<<<<<<< HEAD
                        <button className="p-2 text-[#1c1917]/40 hover:text-accent-600 transition-all">
                            <BellIcon className="w-6 h-6" />
                        </button>
=======
                        <NotificationCenter />
                        <div className="h-8 w-px bg-border mx-2"></div>
>>>>>>> f8a9eddf51e5dc62867bfd05e707e9748c4cf529
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
