import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import {
    BriefcaseIcon,
    UserGroupIcon,
    ClipboardDocumentCheckIcon,
    ExclamationTriangleIcon,
    PlusIcon,
    ArrowRightIcon,
    ChartBarIcon,
    ShieldCheckIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default async function AdminDashboard() {
    const user = await getCurrentUser();

    if (!user || user.role !== 'admin') {
        redirect('/login');
    }

    const supabase = await createClient();

    // Get statistics
    const stats = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('tasks').select('*', { count: 'exact', head: true }),
        supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
    ]);

    const totalProjects = stats[0].count || 0;
    const activeProjects = stats[1].count || 0;
    const totalUsers = stats[2].count || 0;
    const totalTasks = stats[3].count || 0;
    const completedTasks = stats[4].count || 0;

    const { count: overdueTasks } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .lt('deadline', new Date().toISOString().split('T')[0])
        .neq('status', 'completed');

    // Get recent projects
    const { data: recentProjects } = await supabase
        .from('projects')
        .select('*, created_by:users!projects_created_by_fkey(full_name)')
        .order('created_at', { ascending: false })
        .limit(5);

    // Get recent users
    const { data: recentUsers } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Welcome Section */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <span className="w-8 h-1 bg-accent-500 rounded-full"></span>
                    <h2 className="text-xs font-bold text-accent-600 uppercase tracking-wider">Control Center</h2>
                </div>
                <h1 className="text-5xl font-bold text-[#1c1917] tracking-tight">
                    System Online, <span className="text-accent-600">{user.full_name.split(' ')[0]}</span>
                </h1>
                <p className="text-[#1c1917]/50 font-medium text-lg">
                    Monitoring {activeProjects || 0} active project nodes across the organization.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="card bg-white border-beige-200 p-8 group hover:border-beige-300 transition-all duration-500 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-[#1c1917]/40 uppercase tracking-widest">Total Projects</p>
                            <p className="text-5xl font-bold text-[#1c1917] mt-3 tracking-tight">{totalProjects || 0}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-status-success"></span>
                                <p className="text-status-success text-[10px] font-bold uppercase tracking-tight">{activeProjects || 0} active</p>
                            </div>
                        </div>
                        <div className="w-14 h-14 bg-beige-100 rounded-2xl flex items-center justify-center text-[#1c1917]/30 border border-beige-200 group-hover:bg-accent-500 group-hover:text-white transition-all duration-500">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="card bg-white border-beige-200 p-8 group hover:border-beige-300 transition-all duration-500 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-[#1c1917]/40 uppercase tracking-widest">Total Users</p>
                            <p className="text-5xl font-bold text-[#1c1917] mt-3 tracking-tight">{totalUsers || 0}</p>
                            <p className="text-[#1c1917]/30 text-[10px] font-bold uppercase tracking-tight mt-2">Team members</p>
                        </div>
                        <div className="w-14 h-14 bg-beige-100 rounded-2xl flex items-center justify-center text-[#1c1917]/30 border border-beige-200 group-hover:bg-accent-500 group-hover:text-white transition-all duration-500">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="card bg-white border-beige-200 p-8 group hover:border-beige-300 transition-all duration-500 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-[#1c1917]/40 uppercase tracking-widest">Total Tasks</p>
                            <p className="text-5xl font-bold text-[#1c1917] mt-3 tracking-tight">{totalTasks || 0}</p>
                            <p className="text-status-success text-[10px] font-bold uppercase tracking-tight mt-2">{completedTasks || 0} completed</p>
                        </div>
                        <div className="w-14 h-14 bg-beige-100 rounded-2xl flex items-center justify-center text-[#1c1917]/30 border border-beige-200 group-hover:bg-accent-500 group-hover:text-white transition-all duration-500">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="card bg-status-error/5 border-status-error/20 p-8 group hover:border-status-error/30 transition-all duration-500 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-status-error/60 uppercase tracking-widest">Overdue Tasks</p>
                            <p className="text-5xl font-bold text-status-error mt-3 tracking-tight">{overdueTasks || 0}</p>
                            <p className="text-status-error/70 text-[10px] font-bold uppercase tracking-tight mt-2">Attention Required</p>
                        </div>
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-status-error border border-status-error/20 group-hover:bg-status-error group-hover:text-white transition-all duration-500 shadow-sm">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-beige-200 rounded-[2rem] p-10 relative overflow-hidden shadow-sm">
                <div className="relative z-10">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#1c1917]/40 mb-8 flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-accent-500"></span>
                        Management Interface
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Link href="/admin/projects?action=create" className="btn-primary py-4 text-sm font-bold">
                            + Initialise Project
                        </Link>
                        <Link href="/admin/users?action=create" className="btn-secondary py-4 text-sm font-bold">
                            + Enrol Personnel
                        </Link>
                        <Link href="/admin/audit-logs" className="btn-secondary py-4 text-sm font-bold">
                            Access Registries
                        </Link>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-beige-50/50 -rotate-45 translate-x-32 -translate-y-32 rounded-full"></div>
            </div>

            {/* Recent Activity Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Recent Projects */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-2xl font-bold text-[#1c1917] tracking-tight">Active Projects</h3>
                        <Link href="/admin/projects" className="text-xs font-bold text-accent-600 uppercase tracking-tight hover:opacity-70 transition-opacity flex items-center gap-2">
                            VIEW ALL →
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {recentProjects && recentProjects.length > 0 ? (
                            recentProjects.map((project: any) => (
                                <Link
                                    key={project.id}
                                    href={`/admin/projects/${project.id}`}
                                    className="block card p-6 group hover:border-beige-300 transition-all"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h4 className="font-bold text-[#1c1917] text-lg group-hover:text-accent-600 transition-colors uppercase tracking-tight">
                                                {project.name}
                                            </h4>
                                            <p className="text-sm text-[#1c1917]/60 mt-1">
                                                Created by {project.created_by?.full_name || 'Unknown'}
                                            </p>
                                        </div>
                                        <span className={`badge ${project.status === 'active' ? 'badge-success' :
                                            project.status === 'completed' ? 'badge-info' :
                                                'badge-warning'
                                            }`}>
                                            {project.status}
                                        </span>
                                    </div>
                                </Link >
                            ))
                        ) : (
                            <div className="py-12 border-2 border-dashed border-beige-200 rounded-[2rem] text-center text-[#1c1917]/30 font-bold uppercase text-sm tracking-widest">
                                No projects yet
                            </div>
                        )
                        }
                    </div>
                        )}
                </div>
            </div>

            {/* Team Roster */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-2xl font-bold text-[#1c1917] tracking-tight">Team Roster</h3>
                    <Link href="/admin/users" className="text-xs font-bold text-accent-600 uppercase tracking-tight hover:opacity-70 transition-opacity flex items-center gap-2">
                        VIEW ALL →
                    </Link>
                </div>
                <div className="card p-0 divide-y divide-beige-200 shadow-sm overflow-hidden">
                    {recentUsers && recentUsers.length > 0 ? (
                        recentUsers.map((u: any) => (
                            <div key={u.id} className="p-5 hover:bg-beige-50 transition-colors flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-beige-100 flex items-center justify-center text-sm font-bold text-accent-600 border border-beige-200">
                                        {u.full_name?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-bold text-[#1c1917] group-hover:text-accent-600 transition-colors uppercase tracking-tight">
                                            {u.full_name}
                                        </h5>
                                        <p className="text-xs text-[#1c1917]/50 uppercase tracking-tight font-bold">
                                            {u.role}
                                        </p>
                                    </div>
                                </div>
                                <span className={`badge ${u.status === 'active' ? 'badge-success' : 'badge-warning'
                                    }`}>
                                    {u.status}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="py-12 text-center text-[#1c1917]/30 font-bold uppercase text-sm tracking-widest">
                            No users yet
=======
                {/* Right Side: Roster & Intelligence */}
                            <div className="space-y-10 animate-in fade-in slide-in-from-right-6 duration-1000 delay-[600ms] fill-mode-both">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between px-2">
                                        <h3 className="text-lg font-bold text-secondary-900 tracking-tight">Recent Personnel</h3>
                                        <Link href="/admin/users" className="text-[10px] font-bold text-primary-600 uppercase tracking-widest hover:opacity-70">Manifest</Link>
                                    </div>
                                    <div className="bg-white border border-border/60 rounded-[2rem] overflow-hidden shadow-soft">
                                        <div className="divide-y divide-border/40">
                                            {recentUsers?.map((u: any) => (
                                                <div key={u.id} className="p-5 hover:bg-secondary-50/50 transition-colors group">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-secondary-50 group-hover:bg-white border border-transparent group-hover:border-border flex items-center justify-center text-primary-600 font-black text-sm shadow-sm transition-all group-hover:scale-110">
                                                            {u.full_name.charAt(0)}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-bold text-secondary-900 truncate group-hover:text-primary-600 transition-colors">{u.full_name}</p>
                                                            <p className="text-[10px] font-bold text-secondary-400 truncate uppercase tracking-tight mt-0.5">{u.email}</p>
                                                        </div>
                                                        <span className={`badge shrink-0 ${u.role === 'admin' ? 'badge-danger' :
                                                            u.role === 'associate' ? 'badge-info' : 'badge-success'
                                                            }`}>
                                                            {u.role === 'team_member' ? 'TM' : u.role.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
>>>>>>> f8a9eddf51e5dc62867bfd05e707e9748c4cf529
                                        </div>
                                        <Link href="/admin/users" className="block py-4 text-center text-[10px] font-bold text-secondary-400 uppercase tracking-[0.2em] bg-secondary-50/30 hover:bg-secondary-50 transition-colors border-t border-border/40">
                                            Access Full Directory
                                        </Link>
                                    </div>
                                </div>

                                {/* Operational Intelligence Card */}
                                <div className="bg-secondary-900 rounded-[2.5rem] p-8 text-white shadow-premium relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <ShieldCheckIcon className="w-24 h-24 rotate-12" />
                                    </div>
                                    <div className="relative z-10 space-y-4">
                                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                                            <ShieldCheckIcon className="w-7 h-7" />
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-bold text-xl tracking-tight">Security & Intelligence</h4>
                                            <p className="text-sm text-secondary-300 leading-relaxed font-medium">
                                                Automated node monitoring is active. No unauthorized access attempts detected in the last 24 cycles.
                                            </p>
                                        </div>
                                        <div className="pt-2">
                                            <button className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary-400 hover:text-white transition-colors">
                                                View Audit Registry →
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
        </div>
                );
}
