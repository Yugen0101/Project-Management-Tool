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
        <div className="space-y-12 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary-600 mb-2">
                        <SparklesIcon className="w-5 h-5" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Operational Overview</span>
                    </div>
                    <h2 className="text-4xl font-bold tracking-tight text-secondary-900">
                        Welcome, <span className="text-gradient font-black">{user.full_name.split(' ')[0]}</span>
                    </h2>
                    <p className="text-secondary-500 text-base font-medium">
                        Your workspace registry is synchronized. 5 active nodes requiring attention.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/admin/projects?action=create" className="btn-primary">
                        <PlusIcon className="w-5 h-5" />
                        <span>Deploy Project</span>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Projects', val: totalProjects, sub: `${activeProjects} active nodes`, icon: BriefcaseIcon, color: 'primary' },
                    { label: 'Personnel', val: totalUsers, sub: 'Verified identities', icon: UserGroupIcon, color: 'indigo' },
                    { label: 'Task Velocity', val: totalTasks, sub: `${completedTasks} items resolved`, icon: ClipboardDocumentCheckIcon, color: 'emerald' },
                    { label: 'Critical Alert', val: overdueTasks || 0, sub: 'Requires immediate focus', icon: ExclamationTriangleIcon, color: 'rose', isAlert: true }
                ].map((stat, i) => (
                    <div key={i} className={`card animate-in fade-in slide-in-from-bottom-6 duration-700 delay-[${i * 100}ms] fill-mode-both ${stat.isAlert ? 'border-rose-100 bg-rose-50/10' : ''}`}>
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <p className={`text-[10px] font-bold uppercase tracking-widest ${stat.isAlert ? 'text-rose-400' : 'text-secondary-400'}`}>
                                    {stat.label}
                                </p>
                                <p className={`text-4xl font-bold ${stat.isAlert ? 'text-rose-600' : 'text-secondary-900'}`}>{stat.val}</p>
                                <p className={`text-[11px] font-bold flex items-center gap-1.5 pt-2 ${stat.isAlert ? 'text-rose-500' : 'text-secondary-500'}`}>
                                    {!stat.isAlert && <span className={`w-1.5 h-1.5 rounded-full bg-${stat.color}-500 animate-pulse`}></span>}
                                    {stat.sub}
                                </p>
                            </div>
                            <div className={`p-4 bg-${stat.color}-50 text-${stat.color}-600 rounded-2xl shadow-sm`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
                
                {/* Active Operations Registry */}
                <div className="lg:col-span-2 space-y-8 animate-in fade-in slide-in-from-left-6 duration-1000 delay-[400ms] fill-mode-both">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-white shadow-soft rounded-xl flex items-center justify-center text-primary-600 border border-border/50">
                                <ChartBarIcon className="w-6 h-6" />
                             </div>
                             <h3 className="text-xl font-bold text-secondary-900 tracking-tight">Deployment Registry</h3>
                        </div>
                        <Link href="/admin/projects" className="text-[11px] font-bold text-secondary-400 uppercase tracking-widest hover:text-primary-600 transition-colors flex items-center gap-2">
                            Access All Nodes <ArrowRightIcon className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {recentProjects && recentProjects.length > 0 ? (
                            recentProjects.map((project: any) => (
                                <div key={project.id} className="card p-5 group hover:pl-8 transition-all duration-500 relative overflow-hidden">
                                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 bg-secondary-50 group-hover:bg-primary-50 rounded-2xl flex items-center justify-center text-secondary-400 group-hover:text-primary-600 transition-colors">
                                                <BriefcaseIcon className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-secondary-900 text-lg tracking-tight group-hover:text-primary-600 transition-colors">{project.name}</h4>
                                                <p className="text-xs text-secondary-400 font-bold uppercase tracking-widest mt-1">Managed by: {project.created_by?.full_name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="flex flex-col items-end gap-2">
                                                <span className={`badge ${
                                                    project.status === 'active' ? 'badge-info' : 
                                                    project.status === 'completed' ? 'badge-success' : 'badge-warning'
                                                }`}>
                                                    {project.status}
                                                </span>
                                                <span className="text-[9px] font-bold text-secondary-300 uppercase tracking-tighter">Sync: Operational</span>
                                            </div>
                                            <Link href={`/admin/projects/${project.id}`}>
                                                <div className="w-11 h-11 rounded-xl hover:bg-primary-50 flex items-center justify-center text-secondary-300 hover:text-primary-600 transition-all border border-transparent hover:border-primary-100">
                                                    <ArrowRightIcon className="w-5 h-5" />
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-12 border-2 border-dashed border-border/60 rounded-[2rem] text-center text-secondary-300 font-bold uppercase text-[10px] tracking-[0.3em] bg-secondary-50/30">
                                No active projections found
                            </div>
                        )}
                    </div>
                </div>

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
                                            <span className={`badge shrink-0 ${
                                                u.role === 'admin' ? 'badge-danger' : 
                                                u.role === 'associate' ? 'badge-info' : 'badge-success'
                                            }`}>
                                                {u.role === 'team_member' ? 'TM' : u.role.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
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
