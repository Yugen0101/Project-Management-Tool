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
            project:projects(
                *,
                tasks:tasks(count)
            )
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
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Active Projects */}
                <div className="space-y-6">
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
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Task Stream */}
                <div className="space-y-6">
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
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
