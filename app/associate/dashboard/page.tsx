import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getCurrentUser } from '@/lib/auth/session';
import {
    BriefcaseIcon,
    CheckBadgeIcon,
    ClockIcon,
    ChartBarIcon,
    PlusIcon,
    ChevronRightIcon,
    SparklesIcon,
    CalendarDaysIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { format } from 'date-fns';

export default async function AssociateDashboard() {
    const user = await getCurrentUser();
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
            },
        }
    );

    // Fetch projects assigned to associate
    const { data: userProjects } = await supabase
        .from('user_projects')
        .select(`
            project:projects(*)
        `)
        .eq('user_id', user?.id);

    const projects = userProjects?.map((up: any) => up.project) || [];

    // Fetch tasks managed by associate or assigned to associate
    const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .or(`created_by.eq.${user?.id},assigned_to.eq.${user?.id}`)
        .order('created_at', { ascending: false })
        .limit(10);

    const activeProjectCount = projects.filter((p: any) => p.status === 'active').length;
    const highPriorityTasks = tasks?.filter((t: any) => t.priority === 'high').length || 0;

    return (
<<<<<<< HEAD
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Welcome banner (Modern Beige/Terracotta) */}
            <div className="bg-white border border-[#e5dec9] rounded-[2rem] p-10 relative overflow-hidden shadow-lg shadow-[#d9cfb0]/20">
                <div className="relative z-10 space-y-4 max-w-2xl">
                    <div className="flex items-center gap-2">
                        <span className="w-8 h-1 bg-accent-500 rounded-full"></span>
                        <h2 className="text-xs font-black text-accent-500 uppercase tracking-wider">Associate Lead</h2>
                    </div>
                    <h2 className="text-5xl font-black text-[#1c1917] tracking-tight">
                        Command Deployed, <span className="text-accent-500">{user?.full_name?.split(' ')[0]}</span>
                    </h2>
                    <p className="text-[#1c1917]/60 text-xl font-medium leading-relaxed">
                        You are currently overseeing {activeProjectCount} critical streams and {tasks?.filter((t: any) => t.priority === 'high').length || 0} urgent vectors.
                    </p>
                </div>
                {/* Decorative Elements */}
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[140%] bg-[#f7f3ed] blur-3xl -rotate-12 -z-0"></div>
                <div className="absolute right-16 top-1/2 -translate-y-1/2 hidden md:block opacity-5 grayscale scale-125">
                    <FolderIcon className="w-48 h-48 text-[#1c1917]" />
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="card bg-white border-[#e5dec9] p-8 flex items-center justify-between group hover:border-accent-100 transition-all duration-500 shadow-sm shadow-[#d9cfb0]/10">
                    <div className="space-y-3">
                        <p className="text-[10px] font-black text-[#1c1917]/40 uppercase tracking-widest">Active Projects</p>
                        <p className="text-4xl font-black text-[#1c1917] tracking-tight">{activeProjectCount}</p>
                    </div>
                    <div className="w-14 h-14 bg-[#f7f3ed] rounded-2xl flex items-center justify-center text-[#d97757] border border-[#d9cfb0] group-hover:bg-accent-500 group-hover:text-white transition-all duration-500">
                        <FolderIcon className="w-7 h-7" />
                    </div>
                </div>

                <div className="card bg-white border-[#e5dec9] p-8 flex items-center justify-between group hover:border-accent-100 transition-all duration-500 shadow-sm shadow-[#d9cfb0]/10">
                    <div className="space-y-3">
                        <p className="text-[10px] font-black text-[#1c1917]/40 uppercase tracking-widest">Recent Tasks</p>
                        <p className="text-4xl font-black text-[#1c1917] tracking-tight">{tasks?.length || 0}</p>
                    </div>
                    <div className="w-14 h-14 bg-[#f7f3ed] rounded-2xl flex items-center justify-center text-[#d97757] border border-[#d9cfb0] group-hover:bg-accent-500 group-hover:text-white transition-all duration-500">
                        <CheckBadgeIcon className="w-7 h-7" />
                    </div>
                </div>

                <div className="card bg-white border-[#e5dec9] p-8 flex items-center justify-between group hover:border-accent-100 transition-all duration-500 shadow-sm shadow-[#d9cfb0]/10">
                    <div className="space-y-3">
                        <p className="text-[10px] font-black text-[#1c1917]/40 uppercase tracking-widest">Priority Load</p>
                        <p className="text-4xl font-black text-[#d97757] tracking-tight">{tasks?.filter((t: any) => t.priority === 'high').length || 0}</p>
                    </div>
                    <div className="w-14 h-14 bg-[#f7f3ed] rounded-2xl flex items-center justify-center text-[#d97757] border border-[#d9cfb0] group-hover:bg-accent-500 group-hover:text-white transition-all duration-500">
                        <ClockIcon className="w-7 h-7" />
                    </div>
                </div>

                <div className="card bg-white border-[#e5dec9] p-8 flex items-center justify-between group hover:border-accent-100 transition-all duration-500 shadow-sm shadow-[#d9cfb0]/10">
                    <div className="space-y-3">
                        <p className="text-[10px] font-black text-[#1c1917]/40 uppercase tracking-widest">Team Performance</p>
                        <p className="text-4xl font-black text-[#1c1917] tracking-tight">82%</p>
                    </div>
                    <div className="w-14 h-14 bg-[#f7f3ed] rounded-2xl flex items-center justify-center text-[#d97757] border border-[#d9cfb0] group-hover:bg-accent-500 group-hover:text-white transition-all duration-500">
                        <ArrowTrendingUpIcon className="w-7 h-7" />
=======
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Summary Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight text-secondary-900">
                        Overseeing {activeProjectCount} Active Streams
                    </h2>
                    <p className="text-secondary-500 text-sm font-medium">
                        Welcome back, {user?.full_name?.split(' ')[0]}. You have {highPriorityTasks} high-priority tasks requiring your attention.
                    </p>
                </div>
                <Link href="/associate/projects" className="btn-secondary flex items-center gap-2">
                    <BriefcaseIcon className="w-5 h-5" />
                    <span>View Projects</span>
                </Link>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card shadow-sm border-border flex items-center justify-between group hover:border-primary-200 transition-all">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-wider">Active Projects</p>
                        <p className="text-3xl font-bold text-secondary-900 tracking-tight">{activeProjectCount}</p>
                    </div>
                    <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 border border-primary-100 group-hover:scale-105 transition-transform">
                        <BriefcaseIcon className="w-6 h-6" />
                    </div>
                </div>

                <div className="card shadow-sm border-border flex items-center justify-between group hover:border-indigo-200 transition-all">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-wider">Managed Tasks</p>
                        <p className="text-3xl font-bold text-secondary-900 tracking-tight">{tasks?.length || 0}</p>
                    </div>
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 border border-indigo-100 group-hover:scale-105 transition-transform">
                        <CheckBadgeIcon className="w-6 h-6" />
                    </div>
                </div>

                <div className="card shadow-sm border-border flex items-center justify-between group hover:border-rose-200 transition-all">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-rose-400 uppercase tracking-wider text-rose-500/80">Pending High</p>
                        <p className="text-3xl font-bold text-rose-600 tracking-tight">{highPriorityTasks}</p>
                    </div>
                    <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 border border-rose-100 group-hover:scale-105 transition-transform">
                        <ClockIcon className="w-6 h-6" />
                    </div>
                </div>

                <div className="card shadow-sm border-border flex items-center justify-between group hover:border-emerald-200 transition-all">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider text-emerald-500/80">Current Flow</p>
                        <p className="text-3xl font-bold text-emerald-600 tracking-tight">82%</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100 group-hover:scale-105 transition-transform">
                        <ChartBarIcon className="w-6 h-6" />
>>>>>>> f8a9eddf51e5dc62867bfd05e707e9748c4cf529
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Active Projects */}
                <div className="space-y-6">
<<<<<<< HEAD
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-2xl font-black text-[#1c1917] tracking-tight">Active Projections</h3>
                        <Link href="/associate/projects" className="text-xs font-black text-accent-500 uppercase tracking-tight hover:opacity-70 transition-opacity flex items-center gap-2">
                            EXPLORE ALL <ChevronRightIcon className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                        {projects.slice(0, 3).map((project: any) => (
                            <Link key={project.id} href={`/associate/projects/${project.id}`} className="card bg-white border-[#e5dec9] p-6 group hover:border-accent-200 transition-all duration-500 shadow-sm shadow-[#d9cfb0]/10">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 bg-[#f7f3ed] rounded-xl flex items-center justify-center text-[#d97757] border border-[#d9cfb0] group-hover:bg-accent-500 group-hover:text-white transition-all duration-300">
                                        <FolderIcon className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-black text-[#1c1917] tracking-tight text-lg group-hover:text-accent-500 transition-colors uppercase leading-tight">{project.name}</h4>
                                        <div className="flex items-center gap-3 text-[10px] font-black text-[#1c1917]/40 uppercase tracking-tight mt-1">
                                            <span>Stream Active</span>
                                            <span className="w-1 h-1 bg-accent-500 rounded-full"></span>
                                            <span className="text-accent-500">{project.status}</span>
                                        </div>
                                    </div>
                                    <ChevronRightIcon className="w-5 h-5 text-[#1c1917]/20 group-hover:translate-x-1 group-hover:text-accent-500 transition-all duration-300" />
=======
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-secondary-900">Active Repositories</h3>
                        <Link href="/associate/projects" className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1">
                            Browse All <ChevronRightIcon className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {projects.slice(0, 4).map((project: any) => (
                            <Link key={project.id} href={`/associate/projects/${project.id}`} className="card hover:shadow-soft transition-all p-5">
                                <div className="flex items-center gap-5">
                                    <div className="w-10 h-10 bg-secondary-50 text-secondary-400 rounded-lg flex items-center justify-center group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                        <BriefcaseIcon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-secondary-900 truncate">{project.name}</h4>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[10px] font-medium text-secondary-400">{project.tasks?.[0]?.count || 0} active vectors</span>
                                            <span className="w-1 h-1 bg-secondary-200 rounded-full"></span>
                                            <span className={`text-[10px] font-bold uppercase tracking-wider ${
                                                project.status === 'active' ? 'text-primary-600' : 'text-secondary-400'
                                            }`}>{project.status}</span>
                                        </div>
                                        </div>
                                    <ChevronRightIcon className="w-5 h-5 text-secondary-300 group-hover:translate-x-1 transition-all" />
>>>>>>> f8a9eddf51e5dc62867bfd05e707e9748c4cf529
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Task Stream */}
                <div className="space-y-6">
<<<<<<< HEAD
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-2xl font-black text-[#1c1917] tracking-tight">Registry Sync</h3>
                        <Link href="/associate/tasks" className="btn-secondary !px-4 !py-2 !text-[10px] !rounded-lg !border-[#e5dec9]">MANAGE REGISTRY</Link>
                    </div>
                    <div className="card bg-white border-[#e5dec9] divide-y divide-[#f7f3ed] shadow-sm shadow-[#d9cfb0]/10 overflow-hidden p-0">
                        {tasks?.map((task: any) => (
                            <div key={task.id} className="p-5 hover:bg-[#f7f3ed]/50 transition-colors flex items-center justify-between group">
                                <div className="space-y-1">
                                    <h5 className="text-sm font-black text-[#1c1917] tracking-tight group-hover:text-accent-500 transition-colors uppercase">{task.title}</h5>
                                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-tight text-[#1c1917]/40">
                                        <div className={`flex items-center gap-1.5 ${task.priority === 'high' ? 'text-[#d97757]' : 'text-[#1c1917]/40'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${task.priority === 'high' ? 'bg-[#d97757] animate-pulse' : 'bg-[#e5dec9]'}`}></span>
                                            {task.priority || 'NORMAL'}
                                        </div>
                                        <span className="w-1 h-1 bg-[#e5dec9] rounded-full"></span>
                                        <span className="italic">{task.status.replace('_', ' ')}</span>
                                    </div>
                                </div>
                                <div className="text-right text-[10px] font-black text-[#1c1917]/30 uppercase tracking-tight">
                                    {task.due_date ? format(new Date(task.due_date), 'MMM dd') : 'FLOATING'}
=======
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-secondary-900">Real-time Task Feed</h3>
                        <Link href="/associate/tasks" className="text-xs font-bold text-primary-600 hover:text-primary-700">Manage All</Link>
                    </div>
                    <div className="card p-0 shadow-sm overflow-hidden divide-y divide-border">
                        {tasks?.map((task: any) => (
                            <div key={task.id} className="p-4 hover:bg-secondary-50/50 transition-colors flex items-center justify-between group">
                                <div className="space-y-1 flex-1 min-w-0 pr-4">
                                    <h5 className="text-sm font-bold text-secondary-900 truncate group-hover:text-primary-600 transition-colors">{task.title}</h5>
                                    <div className="flex items-center gap-3 text-[10px] font-semibold text-secondary-400">
                                        <div className={`flex items-center gap-1.5 ${task.priority === 'high' ? 'text-rose-600' : ''}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${
                                                task.priority === 'high' ? 'bg-rose-500 animate-pulse' : 'bg-secondary-300'
                                            }`}></span>
                                            {task.priority || 'Medium'}
                                        </div>
                                        <span className="w-1 h-1 bg-secondary-200 rounded-full"></span>
                                        <span className="capitalize">{task.status.replace('_', ' ')}</span>
                                    </div>
                                </div>
                                <div className="text-right flex items-center gap-2 shrink-0">
                                     <CalendarDaysIcon className="w-3.5 h-3.5 text-secondary-300" />
                                     <span className="text-[10px] font-bold text-secondary-400">
                                        {task.due_date ? format(new Date(task.due_date), 'MMM dd') : 'No Due'}
                                     </span>
>>>>>>> f8a9eddf51e5dc62867bfd05e707e9748c4cf529
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
