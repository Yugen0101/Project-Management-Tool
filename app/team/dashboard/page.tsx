import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getCurrentUser } from '@/lib/auth/session';
import { notFound, redirect } from 'next/navigation';
import {
    ClockIcon,
    ClipboardDocumentCheckIcon,
    UserIcon,
    ShieldCheckIcon,
    ArrowLeftOnRectangleIcon,
    SparklesIcon,
    ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import TeamOverview from '@/components/team/TeamOverview';
import TaskStatusUpdate from '@/components/team/TaskStatusUpdate';
import ProjectChat from '@/components/team/ProjectChat';
import { format } from 'date-fns';
import Link from 'next/link';

export default async function TeamDashboard() {
    const user = await getCurrentUser();
    if (!user) redirect('/team/login');

    if ((user.role as string) !== 'team_member' && user.role !== 'member') {
        redirect('/login');
    }

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

    // 1. Fetch Assigned Tasks
    const { data: tasks } = await supabase
        .from('tasks')
        .select(`
            *,
            project:projects(id, name, created_by),
            creator:users!tasks_created_by_fkey(full_name, role)
        `)
        .eq('assigned_to', user.id)
        .order('due_date', { ascending: true, nullsFirst: false });

    // 2. Fetch Project & Team Info
    let projectInfo = null;
    let teamMembers: any[] = [];
    let adminName = 'System Admin';

    if (tasks && tasks.length > 0) {
        const projectId = tasks[0].project_id;

        const { data: project } = await supabase
            .from('projects')
            .select('*')
            .eq('id', projectId)
            .single();

        projectInfo = project;

        const { data: members } = await supabase
            .from('user_projects')
            .select(`
                user:users(id, full_name, role, email)
            `)
            .eq('project_id', projectId);

        teamMembers = members?.map((m: any) => m.user).filter(Boolean) || [];

        const { data: admin } = await supabase
            .from('users')
            .select('full_name')
            .eq('id', project?.created_by)
            .single();

        adminName = admin?.full_name || 'Project Admin';
    } else {
        const { data: userProjects } = await supabase
            .from('user_projects')
            .select(`
                project:projects(*),
                user:users(id, full_name, role, email)
            `)
            .eq('user_id', user.id);

        if (userProjects && userProjects.length > 0) {
            projectInfo = (userProjects[0] as any).project;
            const { data: members } = await supabase
                .from('user_projects')
                .select(`
                    user:users(id, full_name, role, email)
                `)
                .eq('project_id', (projectInfo as any).id);
            teamMembers = members?.map((m: any) => m.user).filter(Boolean) || [];
        }
    }

    if (!projectInfo) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-beige-50 p-12 relative overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[80%] bg-beige-100/50 blur-[120px] rounded-full -z-10"></div>
                <div className="text-center space-y-6 max-w-sm relative z-10">
                    <ShieldCheckIcon className="w-20 h-20 text-[#1c1917]/10 mx-auto" />
                    <h1 className="text-2xl font-black text-[#1c1917] tracking-tight uppercase">No assignments yet</h1>
                    <p className="text-[#1c1917]/50 text-sm font-medium">Your account is active but you haven't been assigned to a project yet. Please contact your manager.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-beige-50 flex flex-col relative overflow-hidden selection:bg-accent-500 selection:text-white">
            {/* Warm Beige Decorative Background Elements */}
            <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[80%] bg-beige-100/50 blur-[120px] rounded-full -z-10 animate-pulse duration-[10s]"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[50%] bg-accent-100/30 blur-[100px] rounded-full -z-10"></div>

            {/* Header / Brand */}
            <header className="h-20 bg-white/80 border-b border-beige-200 px-8 flex items-center justify-between sticky top-0 z-50 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-accent-500/20">
                        <SparklesIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-[#1c1917]">TaskForge</h1>
                        <p className="text-[10px] font-bold text-accent-500 uppercase tracking-widest">Team Node</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-[#1c1917]">{user.full_name}</p>
                            <p className="text-[10px] font-black text-[#1c1917]/30 uppercase tracking-widest mt-0.5">Assigned Operator</p>
                        </div>
                        <div className="w-9 h-9 rounded-xl bg-[#f7f3ed] flex items-center justify-center text-[#d97757] font-bold border border-[#e5dec9] shadow-sm">
                            {user.full_name?.charAt(0) || 'U'}
                        </div>
                    </div>
                    <form action="/api/auth/signout" method="POST" className="border-l border-beige-200 pl-6">
                        <button type="submit" className="text-[#1c1917]/20 hover:text-accent-600 transition-colors">
                            <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </header>

            <main className="flex-1 p-10 max-w-[1400px] mx-auto w-full space-y-12 relative z-10">

                {/* Dashboard Summary */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <span className="w-8 h-1 bg-accent-500 rounded-full"></span>
                        <h2 className="text-xs font-black text-accent-500 uppercase tracking-wider">Mission Log</h2>
                    </div>
                    <h2 className="text-4xl font-black text-[#1c1917] tracking-tight">Focus Protocol Active</h2>
                    <p className="text-[#1c1917]/60 text-lg font-medium">
                        You have {tasks?.filter(t => t.status !== 'Completed').length || 0} active assignments for <span className="text-[#1c1917] font-black">{projectInfo.name}</span>.
                    </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">

                    {/* Left Details */}
                    <div className="xl:col-span-2 space-y-12">

                        {/* Team Section */}
                        <section className="space-y-4">
                            <TeamOverview
                                projectName={projectInfo.name}
                                teamName="Operational Unit"
                                adminName={adminName}
                                members={teamMembers}
                            />
                        </section>

                        {/* Task List */}
                        <section className="space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <h3 className="text-sm font-black text-[#1c1917]/40 uppercase tracking-[0.3em]">Assigned Directives</h3>
                                <div className="h-px flex-1 bg-beige-200 mx-6"></div>
                            </div>
                            <div className="grid gap-6">
                                {tasks && tasks.length > 0 ? tasks.map((task) => (
                                    <div key={task.id} className="card bg-white border-[#e5dec9] p-8 group transition-all hover:border-accent-100 shadow-sm hover:shadow-xl hover:shadow-beige-300/20">
                                        <div className="flex flex-col lg:flex-row gap-10 lg:items-center">
                                            <div className="flex-1 space-y-5">
                                                <div className="flex items-center gap-4">
                                                    <span className={`badge ${task.priority === 'high' ? 'bg-[#d97757]/10 text-[#d97757] border-[#d97757]/20' :
                                                            task.priority === 'medium' ? 'badge-warning' : 'bg-beige-50 text-[#1c1917]/40'
                                                        }`}>
                                                        {task.priority || 'NORMAL'}
                                                    </span>
                                                    <span className="text-[10px] font-black text-[#1c1917]/30 uppercase tracking-widest">
                                                        Origin: {task.creator?.full_name}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h4 className="text-2xl font-black text-[#1c1917] tracking-tight group-hover:text-accent-500 transition-colors uppercase leading-tight">
                                                        {task.title}
                                                    </h4>
                                                    <p className="text-[#1c1917]/50 text-sm font-medium mt-2 italic flex items-center gap-2">
                                                        <span className="w-1 h-1 bg-accent-500 rounded-full"></span>
                                                        {task.description || 'No detailed instructions provided.'}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-8 text-[11px] font-black text-[#1c1917]/30 uppercase tracking-wider pt-3">
                                                    <div className="flex items-center gap-2">
                                                        <ClockIcon className="w-4 h-4 text-accent-500" />
                                                        Deadline: {format(new Date(task.due_date), 'MMM dd, yyyy')}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <ClipboardDocumentCheckIcon className="w-4 h-4 text-[#7c9473]" />
                                                        State: {task.status.replace('_', ' ')}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="lg:w-px lg:h-32 bg-beige-200 hidden lg:block"></div>
                                            <div className="flex flex-col gap-4 min-w-[220px]">
                                                <p className="text-[10px] font-black text-[#1c1917]/20 uppercase tracking-[0.3em] text-center">Status Control</p>
                                                <TaskStatusUpdate taskId={task.id} currentStatus={task.status} />
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="py-24 text-center bg-white/50 border-2 border-dashed border-beige-200 rounded-[2.5rem]">
                                        <ClipboardDocumentCheckIcon className="w-16 h-16 text-beige-300 mx-auto mb-6" />
                                        <h4 className="text-xl font-black text-[#1c1917]/30 uppercase tracking-widest">Repository Sync Clear</h4>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Right Comms Pane */}
                    <div className="space-y-12">
                        <section className="space-y-6">
                            <div className="flex items-center gap-3 px-2">
                                <span className="w-8 h-1 bg-accent-500 rounded-full"></span>
                                <h3 className="text-sm font-black text-[#1c1917] uppercase tracking-widest">Unit Comms</h3>
                            </div>
                            <ProjectChat projectId={projectInfo.id} currentUserId={user.id} />
                        </section>

                        <div className="bg-[#1c1917] rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden group border border-white/5">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <ShieldCheckIcon className="w-24 h-24 rotate-12" />
                            </div>
                            <div className="relative z-10 space-y-5">
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10 text-accent-500">
                                    <ShieldCheckIcon className="w-7 h-7" />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-bold text-lg tracking-tight uppercase italic">Operational Protocol</h4>
                                    <p className="text-[11px] text-white/40 leading-relaxed font-bold uppercase tracking-widest">
                                        Progress is synced and logged for audit review. Maintain clear communication via the project terminal.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            {/* Subtle Texture Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>
        </div>
    );
}
