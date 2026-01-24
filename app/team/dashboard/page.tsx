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
        
        teamMembers = members?.map((m: any) => m.user) || [];

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
            teamMembers = members?.map((m: any) => m.user) || [];
        }
    }

    if (!projectInfo) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-12">
                <div className="text-center space-y-6 max-w-sm">
                    <ShieldCheckIcon className="w-20 h-20 text-secondary-200 mx-auto" />
                    <h1 className="text-2xl font-bold text-secondary-900 tracking-tight">No assignments yet</h1>
                    <p className="text-secondary-500 text-sm font-medium">Your account is active but you haven't been assigned to a project yet. Please contact your manager.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header / Brand */}
            <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-border sticky top-0 z-50 flex items-center justify-between px-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white">
                        <SparklesIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-secondary-900">TaskForge</h1>
                        <p className="text-[10px] font-bold text-primary-500 uppercase tracking-widest">Team Node</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                             <p className="text-sm font-bold text-secondary-900">{user.full_name}</p>
                             <p className="text-[10px] font-medium text-secondary-400">Team Member</p>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 font-bold border border-primary-100">
                            {user.full_name.charAt(0)}
                        </div>
                    </div>
                    <form action="/api/auth/signout" method="POST" className="border-l border-border pl-6">
                        <button type="submit" className="text-secondary-400 hover:text-rose-600 transition-colors">
                            <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </header>

            <main className="flex-1 p-10 max-w-[1400px] mx-auto w-full space-y-10">
                
                {/* Dashboard Summary */}
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight text-secondary-900">
                        Operational Overview
                    </h2>
                    <p className="text-secondary-500 text-sm font-medium">
                        You have {tasks?.filter(t => t.status !== 'Completed').length || 0} active task assignments for {projectInfo.name}.
                    </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                    
                    {/* Left Details */}
                    <div className="xl:col-span-2 space-y-10">
                        
                        {/* Team Section */}
                        <section className="space-y-4">
                            <h3 className="text-sm font-bold text-secondary-400 uppercase tracking-wider flex items-center gap-2">
                                <UserIcon className="w-4 h-4" />
                                Project Unit
                            </h3>
                            <TeamOverview 
                                projectName={projectInfo.name}
                                teamName="Operational Unit"
                                adminName={adminName}
                                members={teamMembers}
                            />
                        </section>

                        {/* Task List */}
                        <section className="space-y-4">
                            <h3 className="text-sm font-bold text-secondary-400 uppercase tracking-wider flex items-center gap-2">
                                <ClipboardDocumentCheckIcon className="w-4 h-4" />
                                Assigned Tasks
                            </h3>
                            <div className="grid gap-4">
                                {tasks && tasks.length > 0 ? tasks.map((task) => (
                                    <div key={task.id} className="card p-6 group transition-all">
                                        <div className="flex flex-col lg:flex-row gap-8 lg:items-center">
                                            <div className="flex-1 space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <span className={`badge ${
                                                        task.priority === 'high' ? 'badge-danger' : 
                                                        task.priority === 'medium' ? 'badge-warning' : 'badge-info'
                                                    }`}>
                                                        {task.priority || 'Medium'}
                                                    </span>
                                                    <span className="text-[10px] font-medium text-secondary-400">
                                                        From {task.creator?.full_name}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h4 className="text-xl font-bold text-secondary-900 group-hover:text-primary-600 transition-colors">
                                                        {task.title}
                                                    </h4>
                                                    <p className="text-secondary-500 text-sm font-medium line-clamp-2 mt-1">
                                                        {task.description || 'No detailed instructions provided.'}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-6 text-xs font-semibold text-secondary-400 pt-2">
                                                    <div className="flex items-center gap-1.5">
                                                        <ClockIcon className="w-4 h-4 text-primary-500" />
                                                        Due {format(new Date(task.due_date), 'MMM dd, yyyy')}
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <ClipboardDocumentCheckIcon className="w-4 h-4 text-emerald-500" />
                                                        Status: {task.status}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="lg:w-px lg:h-24 bg-border hidden lg:block"></div>
                                            <div className="flex flex-col gap-3 min-w-[200px]">
                                                <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-wider">Update Status</p>
                                                <TaskStatusUpdate taskId={task.id} currentStatus={task.status} />
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="py-20 text-center bg-white border border-dashed border-border rounded-2xl">
                                        <ClipboardDocumentCheckIcon className="w-16 h-16 text-secondary-200 mx-auto mb-4" />
                                        <p className="text-secondary-500 font-medium">All assigned tasks completed.</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Right Comms Pane */}
                    <div className="space-y-10">
                        <section className="space-y-4">
                            <h3 className="text-sm font-bold text-secondary-400 uppercase tracking-wider flex items-center gap-2">
                                <ChatBubbleLeftRightIcon className="w-4 h-4" />
                                Project Communications
                            </h3>
                            <ProjectChat projectId={projectInfo.id} currentUserId={user.id} />
                        </section>

                        <div className="bg-primary-600 rounded-2xl p-6 text-white shadow-premium flex items-start gap-4">
                            <ShieldCheckIcon className="w-6 h-6 shrink-0" />
                            <div>
                                <h5 className="font-bold text-sm mb-1">Operational Protocol</h5>
                                <p className="text-xs text-white/70 leading-relaxed font-medium">
                                    Progress is automatically synced and logged for audit review. Maintain clear communication via the project terminal.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
