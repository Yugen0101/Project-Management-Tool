import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import {
    CalendarIcon,
    UserGroupIcon,
    ListBulletIcon,
    ArrowPathIcon,
    CheckBadgeIcon,
    ClockIcon,
    ExclamationCircleIcon,
    PlusIcon,
    TagIcon,
    UserIcon,
    SignalIcon,
    Squares2X2Icon,
    TableCellsIcon,
    CalendarDaysIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import Link from 'next/link';
import SprintManager from '@/components/sprint/SprintManager';
import ProjectInsights from '@/components/analytics/ProjectInsights';
import TeamWorkload from '@/components/analytics/TeamWorkload';
import SprintPerformance from '@/components/analytics/SprintPerformance';
import ActivityFeed from '@/components/activity/ActivityFeed';
import ProjectActions from '@/components/admin/ProjectActions';
import ProjectMeetings from '@/components/meetings/ProjectMeetings';
import { getCurrentUser } from '@/lib/auth/session';

export default async function ProjectDetailPage({ params, searchParams }: { 
    params: Promise<{ id: string }>,
    searchParams: Promise<{ view?: string }>
}) {
    const { id } = await params;
    const { view = 'sprints' } = await searchParams;
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

    const user = await getCurrentUser();
    if (!user) return notFound();

    const { data: project, error: projectError } = await supabase
        .from('projects')
        .select(`
            *,
            tasks:tasks(*, assigned_user:users(*)),
            sprints:sprints(*),
            user_projects:user_projects(*, user:users(*))
        `)
        .eq('id', id)
        .single();

    if (projectError || !project) {
        return notFound();
    }

    const tasks = project.tasks || [];
    const sprints = project.sprints || [];
    const completedTasks = tasks.filter((t: any) => t.status === 'completed').length;
    const progressPercentage = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

    return (
        <div className="space-y-10">
            {/* Breadcrumbs & Actions */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-xs font-bold text-secondary-400">
                    <Link href="/admin/projects" className="hover:text-primary-600 transition-colors uppercase tracking-widest">Projects</Link>
                    <span className="opacity-30">/</span>
                    <span className="text-secondary-900 uppercase tracking-widest">{project.name}</span>
                </div>
                <div className="flex gap-2">
                    <ProjectActions
                        projectId={id}
                        status={project.status}
                        isPublic={project.is_public}
                        shareToken={project.share_token}
                    />
                </div>
            </div>

            {/* TaskFlow Inspired Hero Card */}
            <div className="hero-card">
                <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                                <h1 className="text-4xl font-bold tracking-tight">{project.name}</h1>
                            </div>
                            <p className="text-white/80 font-medium max-w-xl line-clamp-2 italic">
                                {project.description || 'Defining the roadmap for next generation operational standards.'}
                            </p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                            <div className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1 text-right">Completion</div>
                            <div className="text-3xl font-black text-white text-right">{progressPercentage}%</div>
                        </div>
                    </div>

                    <div className="mt-12 flex gap-12 border-t border-white/10 pt-8 overflow-x-auto no-scrollbar">
                        <div>
                            <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2">Developed</div>
                            <div className="text-sm font-bold">{format(new Date(project.created_at), 'MMM dd, yyyy')}</div>
                        </div>
                        <div>
                            <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2">Target Date</div>
                            <div className="text-sm font-bold text-white">{format(new Date(project.end_date), 'MMM dd, yyyy')}</div>
                        </div>
                        <div>
                            <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2">Assigned Group</div>
                            <div className="text-sm font-bold">CORE_UNIT_{project.id.slice(0,4).toUpperCase()}</div>
                        </div>
                        <div className="ml-auto flex -space-x-3">
                            {project.user_projects?.slice(0, 4).map((up: any) => (
                                <div key={up.id} className="w-10 h-10 rounded-full border-2 border-white/20 bg-secondary-900 flex items-center justify-center text-xs font-bold text-white" title={up.user.full_name}>
                                    {up.user.full_name.charAt(0)}
                                </div>
                            ))}
                            {(project.user_projects?.length || 0) > 4 && (
                                <div className="w-10 h-10 rounded-full border-2 border-white/20 bg-primary-500 flex items-center justify-center text-[10px] font-bold text-white">
                                    +{project.user_projects!.length - 4}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* View Selection Tabs */}
            <div className="flex border-b border-border gap-8 overflow-x-auto no-scrollbar">
                <Link href={`?view=sprints`} className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all relative ${view === 'sprints' ? 'text-primary-600' : 'text-secondary-400 hover:text-secondary-600'}`}>
                    Sprints & Tasks
                    {view === 'sprints' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full"></span>}
                </Link>
                <Link href={`/admin/projects/${id}/kanban`} className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all relative text-secondary-400 hover:text-secondary-600`}>
                    Execution Board
                </Link>
                <Link href={`?view=insights`} className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all relative ${view === 'insights' ? 'text-primary-600' : 'text-secondary-400 hover:text-secondary-600'}`}>
                    Advanced Analytics
                    {view === 'insights' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full"></span>}
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Main Content Pane */}
                <div className="lg:col-span-2 space-y-8">
                    {view === 'sprints' ? (
                        <>
                            <SprintManager
                                projectId={id}
                                sprints={sprints}
                                tasks={tasks}
                            />
                            <div className="card">
                                <ProjectMeetings 
                                    projectId={id}
                                    members={project.user_projects || []}
                                    currentUser={user}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="space-y-8">
                            <ProjectInsights projectId={id} />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <TeamWorkload projectId={id} />
                                <SprintPerformance projectId={id} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Refined Info Sidebar */}
                <div className="space-y-8">
                    {/* Repository Details */}
                    <div className="card space-y-6">
                        <div className="flex items-center justify-between border-b border-border pb-4">
                            <h3 className="text-sm font-bold text-secondary-900 uppercase tracking-wider">Repository Details</h3>
                            <Link href={`/admin/projects/${id}/edit`} className="text-[10px] font-bold text-primary-600 hover:underline">Edit Hub</Link>
                        </div>
                        <div className="grid grid-cols-1 gap-5">
                            <div className="flex items-center gap-4 group">
                                <div className="w-9 h-9 bg-primary-50 text-primary-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <ClockIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest">Last Sync</div>
                                    <div className="text-xs font-bold text-secondary-900">12 Minutes Ago</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="w-9 h-9 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <TagIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest">Metadata Tags</div>
                                    <div className="flex gap-1 mt-1">
                                        <span className="badge badge-info">OPERATIONAL</span>
                                        <span className="badge badge-success">V8-CORE</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="w-9 h-9 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <SignalIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest">Operational Status</div>
                                    <div className="text-xs font-bold text-secondary-900 uppercase">Resonant - Active</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Team Distribution */}
                    <div className="card">
                        <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
                            <h3 className="text-sm font-bold text-secondary-900 uppercase tracking-wider">Operational Unit</h3>
                            <Link href="#" className="text-[10px] font-bold text-primary-600">Reassign</Link>
                        </div>
                        <div className="space-y-4">
                            {project.user_projects?.map((up: any) => (
                                <div key={up.id} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-secondary-50 flex items-center justify-center text-xs font-bold text-secondary-500 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                            {up.user.full_name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-secondary-900 group-hover:text-primary-600 transition-colors">{up.user.full_name}</p>
                                            <p className="text-[9px] font-bold text-secondary-400 uppercase tracking-widest">{up.role}</p>
                                        </div>
                                    </div>
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 ring-4 ring-emerald-50"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Timeline Feed */}
                    <div className="card">
                        <div className="flex items-center gap-2 border-b border-border pb-4 mb-6">
                            <ArrowPathIcon className="w-4 h-4 text-primary-500" />
                            <h3 className="text-sm font-bold text-secondary-900 uppercase tracking-wider">Sync Log</h3>
                        </div>
                        <ActivityFeed projectId={id} />
                    </div>
                </div>
            </div>
        </div>
    );
}
