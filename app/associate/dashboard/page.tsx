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
    CalendarDaysIcon,
    FolderIcon,
    ArrowTrendingUpIcon
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

    // 1. Fetch projects where the associate is a member
    const { data: userProjects } = await supabase
        .from('user_projects')
        .select(`
            project_id,
            project:projects(*)
        `)
        .eq('user_id', user?.id);

    const managedProjectIds = userProjects?.map((up: any) => up.project_id) || [];
    const projects = userProjects?.map((up: any) => up.project) || [];

    // 2. Fetch all members for these projects to monitor workload
    const { data: projectMembers } = await supabase
        .from('user_projects')
        .select(`
            user_id,
            project_id,
            role,
            user:profiles(id, full_name, role)
        `)
        .in('project_id', managedProjectIds);

    // 3. Fetch all tasks for these projects
    const { data: allTasks } = await supabase
        .from('tasks')
        .select(`
            *,
            assignee:profiles(id, full_name)
        `)
        .in('project_id', managedProjectIds)
        .order('created_at', { ascending: false });

    // 4. Aggregate Member Workload
    const membersMap = new Map();
    projectMembers?.forEach((pm: any) => {
        if (!pm.user) return;
        if (!membersMap.has(pm.user.id)) {
            membersMap.set(pm.user.id, {
                id: pm.user.id,
                name: pm.user.full_name,
                role: pm.role,
                tasks: 0,
                completed: 0
            });
        }
    });

    allTasks?.forEach((task: any) => {
        if (task.assigned_to && membersMap.has(task.assigned_to)) {
            const member = membersMap.get(task.assigned_to);
            member.tasks++;
            if (task.status === 'completed') member.completed++;
        }
    });

    const membersList = Array.from(membersMap.values());

    // 5. Calculate Dynamic Performance
    const totalProjectsTasks = allTasks?.length || 0;
    const completedProjectsTasks = allTasks?.filter((t: any) => t.status === 'completed').length || 0;
    const performanceScore = totalProjectsTasks > 0
        ? Math.round((completedProjectsTasks / totalProjectsTasks) * 100)
        : 0;

    const activeProjectCount = projects.filter((p: any) => p.status === 'active').length;
    const highPriorityTasks = allTasks?.filter((t: any) => t.priority === 'high').length || 0;

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Welcome banner (Modern Beige/Terracotta) */}
            <div className="bg-white border border-[#e5dec9] rounded-[2rem] p-10 relative overflow-hidden shadow-lg shadow-[#d9cfb0]/20">
                <div className="relative z-10 space-y-4 max-w-2xl">
                    <div className="flex items-center gap-2">
                        <span className="w-8 h-1 bg-accent-500 rounded-full"></span>
                        <h2 className="text-xs font-semibold">Associate Lead</h2>
                    </div>
                    <h2 className="text-5xl font-semibold">
                        Command Deployed, <span className="text-accent-500">{user?.full_name?.split(' ')[0]}</span>
                    </h2>
                    <p className="text-[#1c1917]/80 text-xl font-medium leading-relaxed">
                        You are currently overseeing {activeProjectCount} critical streams and {highPriorityTasks} urgent vectors across {allTasks?.length || 0} active nodes.
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
                        <p className="text-[10px] font-medium text-[#1c1917]/70 uppercase tracking-widest">Active Projects</p>
                        <p className="text-4xl font-semibold">{activeProjectCount}</p>
                    </div>
                    <div className="w-14 h-14 bg-[#f7f3ed] rounded-2xl flex items-center justify-center text-[#d97757] border border-[#d9cfb0] group-hover:bg-accent-500 group-hover:text-white transition-all duration-500">
                        <FolderIcon className="w-7 h-7" />
                    </div>
                </div>

                <div className="card bg-white border-[#e5dec9] p-8 flex items-center justify-between group hover:border-accent-100 transition-all duration-500 shadow-sm shadow-[#d9cfb0]/10">
                    <div className="space-y-3">
                        <p className="text-[10px] font-medium text-[#1c1917]/70 uppercase tracking-widest">Active Units</p>
                        <p className="text-4xl font-semibold">{allTasks?.length || 0}</p>
                    </div>
                    <div className="w-14 h-14 bg-[#f7f3ed] rounded-2xl flex items-center justify-center text-[#d97757] border border-[#d9cfb0] group-hover:bg-accent-500 group-hover:text-white transition-all duration-500">
                        <CheckBadgeIcon className="w-7 h-7" />
                    </div>
                </div>

                <div className="card bg-white border-[#e5dec9] p-8 flex items-center justify-between group hover:border-accent-100 transition-all duration-500 shadow-sm shadow-[#d9cfb0]/10">
                    <div className="space-y-3">
                        <p className="text-[10px] font-medium text-[#1c1917]/70 uppercase tracking-widest">Priority Load</p>
                        <p className="text-4xl font-semibold text-[#d97757] tracking-tight">{allTasks?.filter((t: any) => t.priority === 'high').length || 0}</p>
                    </div>
                    <div className="w-14 h-14 bg-[#f7f3ed] rounded-2xl flex items-center justify-center text-[#d97757] border border-[#d9cfb0] group-hover:bg-accent-500 group-hover:text-white transition-all duration-500">
                        <ClockIcon className="w-7 h-7" />
                    </div>
                </div>

                <div className="card bg-white border-[#e5dec9] p-8 flex items-center justify-between group hover:border-accent-100 transition-all duration-500 shadow-sm shadow-[#d9cfb0]/10">
                    <div className="space-y-3">
                        <p className="text-[10px] font-medium text-[#1c1917]/70 uppercase tracking-widest">Team Performance</p>
                        <p className="text-4xl font-semibold">{performanceScore}%</p>
                    </div>
                    <div className="w-14 h-14 bg-[#f7f3ed] rounded-2xl flex items-center justify-center text-[#d97757] border border-[#d9cfb0] group-hover:bg-accent-500 group-hover:text-white transition-all duration-500">
                        <ArrowTrendingUpIcon className="w-7 h-7" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Active Projects */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-2xl font-semibold">Active Projections</h3>
                        <Link href="/associate/projects" className="text-xs font-medium text-accent-500 uppercase tracking-tight hover:opacity-70 transition-opacity flex items-center gap-2">
                            EXPLORE ALL <ChevronRightIcon className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                        {projects.slice(0, 3).map((project: any) => (
                            <Link key={project.id} href={`/associate/projects/${project.id}`} className="card bg-white border-[#e5dec9] p-6 group hover:border-accent-200 transition-all duration-500 shadow-sm shadow-[#d9cfb0]/10">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 bg-[#f7f3ed] rounded-xl flex items-center justify-center text-[#d97757] border border-[#d9cfb0] group-hover:bg-accent-500 group-hover:text-white transition-all duration-300">
                                        <BriefcaseIcon className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-lg group-hover:text-accent-500 transition-colors uppercase leading-tight">{project.name}</h4>
                                        <div className="flex items-center gap-3 text-[10px] font-medium text-[#1c1917]/70 uppercase tracking-tight mt-1">
                                            <span>Stream Active</span>
                                            <span className="w-1 h-1 bg-accent-500 rounded-full"></span>
                                            <span className="text-accent-500">{project.status}</span>
                                        </div>
                                    </div>
                                    <ChevronRightIcon className="w-5 h-5 text-[#1c1917]/60 group-hover:translate-x-1 group-hover:text-accent-500 transition-all duration-300" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Task Stream */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-2xl font-semibold">Registry Sync</h3>
                        <Link href="/associate/tasks" className="btn-secondary !px-4 !py-2 !text-[10px] !rounded-lg !border-[#e5dec9]">MANAGE REGISTRY</Link>
                    </div>
                    <div className="card bg-white border-[#e5dec9] divide-y divide-[#f7f3ed] shadow-sm shadow-[#d9cfb0]/10 overflow-hidden p-0">
                        {allTasks?.slice(0, 10).map((task: any) => (
                            <div key={task.id} className="p-5 hover:bg-[#f7f3ed]/50 transition-colors flex items-center justify-between group">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h5 className="text-sm font-semibold group-hover:text-accent-500 transition-colors uppercase">{task.title}</h5>
                                        <span className="text-[8px] font-bold text-secondary-400 border border-secondary-100 px-1.5 py-0.5 rounded uppercase">
                                            {task.assignee?.full_name?.split(' ')[0] || 'UNSET'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] font-medium uppercase tracking-tight text-[#1c1917]/70">
                                        <div className={`flex items-center gap-1.5 ${task.priority === 'high' ? 'text-[#d97757]' : 'text-[#1c1917]/40'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${task.priority === 'high' ? 'bg-[#d97757] animate-pulse' : 'bg-[#e5dec9]'}`}></span>
                                            {task.priority || 'NORMAL'}
                                        </div>
                                        <span className="w-1 h-1 bg-[#e5dec9] rounded-full"></span>
                                        <span className={`badge shrink-0 scale-75 origin-left ${task.status === 'completed' ? 'badge-success' :
                                            task.status === 'in_progress' ? 'badge-warning' :
                                                'badge-info'
                                            }`}>
                                            {task.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right text-[10px] font-medium text-[#1c1917]/60 uppercase tracking-tight">
                                    {task.due_date ? format(new Date(task.due_date), 'MMM dd') : 'FLOATING'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Team Workload Monitor */}
            <div className="lg:col-span-2 space-y-6 pt-4">
                <div className="flex items-center justify-between px-2">
                    <div className="space-y-1">
                        <h3 className="text-2xl font-semibold uppercase tracking-tight">Team Workload Monitor</h3>
                        <p className="text-[10px] font-bold text-secondary-500 uppercase tracking-widest">Oversight of operational capacity across current streams</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {membersList.filter(m => m.id !== user?.id).map((member: any) => (
                        <div key={member.id} className="card bg-white border-[#e5dec9] p-6 hover:border-accent-100 transition-all duration-300 group">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-[#f7f3ed] flex items-center justify-center text-accent-600 font-bold border border-[#e5dec9] group-hover:bg-accent-500 group-hover:text-white transition-all">
                                    {member.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-[#1c1917] truncate uppercase tracking-tight">{member.name}</p>
                                    <p className="text-[8px] font-bold text-secondary-400 uppercase tracking-widest">{member.role}</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                                    <span className="text-secondary-500">Task Load</span>
                                    <span className="text-[#1c1917]">{member.tasks} Units</span>
                                </div>
                                <div className="w-full h-1.5 bg-[#f7f3ed] rounded-full overflow-hidden border border-[#e5dec9]">
                                    <div
                                        className="h-full bg-accent-500 transition-all duration-1000"
                                        style={{ width: `${member.tasks > 0 ? (member.completed / member.tasks) * 100 : 0}%` }}
                                    ></div>
                                </div>
                                <div className="flex items-center justify-between text-[9px] font-bold uppercase text-secondary-500">
                                    <span>{Math.round(member.tasks > 0 ? (member.completed / member.tasks) * 100 : 0)}% Integrity</span>
                                    <span>{member.completed}/{member.tasks} Done</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
