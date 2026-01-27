import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/session';
import {
    BellIcon,
} from '@heroicons/react/24/outline';
import SignOutButton from '@/components/auth/SignOutButton';
import AssociateNav from '@/components/navigation/AssociateNav';
import TaskForgeLogo from '@/components/ui/TaskForgeLogo';
import AssociateMobileMenu from '@/components/navigation/AssociateMobileMenu';

export default async function AssociateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    return (
        <div className="min-h-screen bg-[#fdfcf9] text-[#1c1917] flex">
            {/* Sidebar */}
            <aside className="w-72 bg-white/50 backdrop-blur-md border-r border-[#e5dec9] hidden lg:flex flex-col fixed inset-y-0 z-50">
                <div className="p-10 pb-6">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <TaskForgeLogo size="lg" />
                        <div>
                            <h1 className="text-xl font-semibold tracking-tight uppercase">
                                Task<span className="text-accent-500">Forge</span>
                            </h1>
                            <span className="block text-[10px] text-accent-500 uppercase tracking-[0.3em] font-semibold mt-1">Project Lead</span>
                        </div>
                    </div>
                </div>

                <AssociateNav />

                <div className="p-6 mt-auto border-t border-[#e5dec9]">
                    <div className="flex items-center gap-3 px-4 py-4 bg-[#f7f3ed] rounded-[1.25rem] border border-[#e5dec9] shadow-sm mb-4 group hover:border-accent-200 transition-all">
                        <div className="w-9 h-9 rounded-xl bg-accent-500 text-white flex items-center justify-center font-semibold text-xs shadow-lg shadow-accent-500/20 group-hover:scale-105 transition-transform">
                            {user?.full_name?.charAt(0) || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-semibold text-[#1c1917] truncate uppercase tracking-tight">{user?.full_name}</p>
                            <p className="text-[8px] font-semibold text-accent-500 uppercase tracking-[0.2em] truncate">Operations Lead</p>
                        </div>
                    </div>
                    <div className="px-4">
                        <SignOutButton />
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 lg:ml-72 flex flex-col">
                {/* Top Header - Synchronized 96px */}
                <header className="h-24 bg-white border-b border-[#e5dec9] sticky top-0 z-40 backdrop-blur-xl px-10 flex items-center justify-between shadow-sm shadow-[#d9cfb0]/10">
                    <div className="flex items-center gap-6">
                        <div className="lg:hidden">
                            <AssociateMobileMenu />
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="w-8 h-1 bg-accent-500 rounded-full"></span>
                            <h2 className="text-[10px] font-semibold text-[#78716c] uppercase tracking-[0.4em]">Project Lead Portal</h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="w-10 h-10 bg-[#f7f3ed] hover:bg-white border border-[#e5dec9] rounded-xl flex items-center justify-center text-[#1c1917]/30 hover:text-accent-500 transition-all shadow-sm">
                            <BellIcon className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-8 lg:p-12 max-w-[1400px] w-full mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
