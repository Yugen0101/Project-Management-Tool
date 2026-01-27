import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
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
import TeamManager from '@/components/admin/TeamManager';
import { getCurrentUser } from '@/lib/auth/session';

export default async function ProjectDetailPage({ params, searchParams }: {
    params: Promise<{ id: string }>,
    searchParams: Promise<{ view?: string }>
}) {
    const { id } = await params;
    const { view = 'sprints' } = await searchParams;

    console.log('Fetching details for project ID:', id);

    const supabase = await createClient();

    const user = await getCurrentUser();
    if (!user) return notFound();

    // Fetch project with tasks, sprints, and assigned users
    // If admin, use admin client to ensure visibility regardless of RLS
    const fetchClient = user.role === 'admin' ? await createAdminClient() : supabase;

    const { data: project, error: projectError } = await fetchClient
        .from('projects')
        .select(`
            *,
            tasks:tasks(*),
            sprints:sprints(*),
            user_projects:user_projects(*, users:users(*))
        `)
        .eq('id', id)
        .single();

    if (projectError || !project) {
        console.error('Project fetch error:', {
            code: projectError?.code,
            message: projectError?.message,
            hint: projectError?.hint,
            details: projectError?.details,
            id: id
        });
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
                <div className="flex items-center gap-2 text-xs font-semibold text-secondary-600">
                    <Link href="/admin/projects" className="hover:text-primary-600 transition-colors uppercase tracking-widest">Projects</Link>
                    <span className="opacity-50">/</span>
                    <span className="text-secondary-900 uppercase tracking-widest">{project.name}</span>
                </div>
                <div className="flex gap-2">
                    <ProjectActions
                        projectId={id}
                        status={project.status}
                        isPublic={project.is_public}
                        shareToken={project.share_token}
                        userRole={user.role}
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
                                <h1 className="text-4xl font-semibold tracking-tight">{project.name}</h1>
                            </div>
                            <p className="text-white font-medium max-w-xl line-clamp-2 italic opacity-90">
                                {project.description || 'Defining the roadmap for next generation operational standards.'}
                            </p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                            <div className="text-[10px] font-semibold text-white/75 uppercase tracking-widest mb-1 text-right">Completion</div>
                            <div className="text-3xl font-semibold text-white text-right">{progressPercentage}%</div>
                        </div>
                    </div>

                    <div className="mt-12 flex gap-12 border-t border-white/10 pt-8 overflow-x-auto no-scrollbar">
                        <div>
                            <div className="text-[10px] font-semibold text-white/75 uppercase tracking-widest mb-2">Developed</div>
                            <div className="text-sm font-medium">{format(new Date(project.created_at), 'MMM dd, yyyy')}</div>
                        </div>
                        <div>
                            <div className="text-[10px] font-semibold text-white/75 uppercase tracking-widest mb-2">Target Date</div>
                            <div className="text-sm font-medium text-white">{format(new Date(project.end_date), 'MMM dd, yyyy')}</div>
                        </div>
                        <div>
                            <div className="text-[10px] font-semibold text-white/75 uppercase tracking-widest mb-2">Assigned Group</div>
                            <div className="text-sm font-medium">CORE_UNIT_{project.id.slice(0, 4).toUpperCase()}</div>
                        </div>
                        <div className="ml-auto flex -space-x-3">
                            {project.user_projects?.slice(0, 4).map((up: any) => (
                                <div key={up.id} className="w-10 h-10 rounded-full border-2 border-white/20 bg-[#1c1917] flex items-center justify-center text-[10px] font-medium text-white shadow-lg" title={up.users?.full_name}>
                                    {up.users?.full_name?.charAt(0) || '?'}
                                </div>
                            ))}
                            {(project.user_projects?.length || 0) > 4 && (
                                <div className="w-10 h-10 rounded-full border-2 border-white/20 bg-accent-500 flex items-center justify-center text-[10px] font-medium text-white shadow-lg">
                                    +{project.user_projects!.length - 4}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* View Selection Tabs */}
            <div className="flex border-b border-border gap-8 overflow-x-auto no-scrollbar">
                <Link href={`?view=sprints`} className={`pb-4 text-xs font-semibold uppercase tracking-widest transition-all relative ${view === 'sprints' ? 'text-primary-600' : 'text-secondary-600 hover:text-secondary-800'}`}>
                    Sprints & Tasks
                    {view === 'sprints' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full"></span>}
                </Link>
                <Link href={`/admin/projects/${id}/kanban`} className={`pb-4 text-xs font-semibold uppercase tracking-widest transition-all relative text-secondary-600 hover:text-secondary-800`}>
                    Execution Board
                </Link>
                <Link href={`?view=insights`} className={`pb-4 text-xs font-semibold uppercase tracking-widest transition-all relative ${view === 'insights' ? 'text-primary-600' : 'text-secondary-600 hover:text-secondary-800'}`}>
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
                                members={project.user_projects || []}
                                userRole={user.role}
                                currentUserId={user.id}
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
                            <div className="card p-6 space-y-4">
                                <h3 className="font-medium text-slate-900 flex items-center gap-2">
                                    <ClockIcon className="w-5 h-5 text-accent-500" />
                                    Recent Activity
                                </h3>
                                <ActivityFeed projectId={id} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Refined Info Sidebar */}
                <div className="space-y-8">
                    {/* Project Configuration */}
                    <div className="card space-y-6">
                        <div className="flex items-center justify-between border-b border-border pb-4">
                            <h3 className="text-xs font-semibold text-[#1c1917]/80 uppercase tracking-widest">Project Configuration</h3>
                            <button className="text-[10px] font-medium text-primary-600 hover:underline uppercase tracking-wider">Project Settings</button>
                        </div>
                        <div className="grid grid-cols-1 gap-5">
                            <div className="flex items-center gap-4 group">
                                <div className="w-9 h-9 bg-primary-50 text-primary-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <ClockIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-semibold text-secondary-600 uppercase tracking-widest">Last Activity</div>
                                    <div className="text-xs font-medium text-secondary-900">12 Minutes Ago</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="w-9 h-9 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <TagIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-semibold text-secondary-600 uppercase tracking-widest">Classification</div>
                                    <div className="flex gap-1 mt-1">
                                        <span className="badge badge-info uppercase">Operational</span>
                                        <span className="badge badge-success uppercase">V8-CORE</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="w-9 h-9 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <SignalIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-semibold text-secondary-600 uppercase tracking-widest">Current Status</div>
                                    <div className="text-xs font-medium text-secondary-900 uppercase">Strategic Expansion</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Team Distribution */}
                    <div className="card">
                        <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
                            <h3 className="text-xs font-semibold text-[#1c1917]/80 uppercase tracking-widest">Project Team</h3>
                            {user.role === 'admin' && <button className="text-[10px] font-medium text-primary-600 uppercase tracking-wider">Manage</button>}
                        </div>
                        <div className="space-y-4">
                            <TeamManager
                                projectId={id}
                                initialMembers={project.user_projects || []}
                            />
                        </div>
                    </div>

                    {/* Timeline Feed */}
                    <div className="card">
                        <div className="flex items-center gap-2 border-b border-border pb-4 mb-6">
                            <ArrowPathIcon className="w-4 h-4 text-primary-500" />
                            <h3 className="text-xs font-semibold text-[#1c1917]/80 uppercase tracking-widest">Project Timeline</h3>
                        </div>
                        <ActivityFeed projectId={id} />
                    </div>
                </div>
            </div>
        </div>
    );
}
