import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { format } from 'date-fns';
import Link from 'next/link';
import {
    ClockIcon,
    CalendarIcon,
    TagIcon,
    UserIcon,
    ChevronLeftIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';
import TaskComments from '@/components/collaboration/TaskComments';
import ActivityFeed from '@/components/activity/ActivityFeed';
import TaskStatusManager from '@/components/tasks/TaskStatusManager';

export default async function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
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

    const { data: task, error } = await supabase
        .from('tasks')
        .select(`
            *,
            project:projects(id, name),
            assignee:users!tasks_assigned_to_fkey(*)
        `)
        .eq('id', id)
        .single();

    if (error || !task) {
        return notFound();
    }

    // Fetch project columns for status transitions
    const { data: columns } = await supabase
        .from('kanban_columns')
        .select('*')
        .eq('project_id', task.project.id)
        .order('order_index', { ascending: true });

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Breadcrumbs & Navigation */}
            <div className="flex items-center justify-between">
                <Link
                    href="/member/dashboard"
                    className="flex items-center gap-2 text-sm font-semibold text-secondary-600 hover:text-accent-600 transition-colors"
                >
                    <ChevronLeftIcon className="w-4 h-4" />
                    Back to Dashboard
                </Link>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase text-secondary-500">Project</span>
                    <span className="px-3 py-1 bg-[#f7f3ed] rounded-full text-xs font-semibold text-[#1c1917] border border-[#e5dec9]">
                        {task.project.name}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="card p-8 space-y-6 border-slate-100">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className={`badge ${task.priority === 'high' ? 'badge-danger' :
                                    task.priority === 'medium' ? 'badge-warning' :
                                        'badge-info'
                                    }`}>
                                    {task.priority || 'medium'}
                                </span>
                                <span className={`badge ${task.status === 'completed' ? 'badge-success' :
                                    task.status === 'in_progress' ? 'badge-warning' :
                                        'badge-info'
                                    }`}>
                                    {task.status?.replace('_', ' ') || 'todo'}
                                </span>
                            </div>
                            <h1 className="text-3xl font-semibold text-[#1c1917] leading-tight">
                                {task.title}
                            </h1>
                            <div className="flex items-center gap-6 text-sm font-medium text-secondary-600">
                                <div className="flex items-center gap-2">
                                    <CalendarIcon className="w-4 h-4" />
                                    Created {format(new Date(task.created_at), 'MMM d')}
                                </div>
                                {task.due_date && (
                                    <div className="flex items-center gap-2 text-orange-600">
                                        <ClockIcon className="w-4 h-4" />
                                        Due {format(new Date(task.due_date), 'MMM d, yyyy')}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="prose prose-slate max-w-none">
                            <h3 className="text-sm font-semibold uppercase tracking-widest text-[#1c1917]/80 mb-2">Description</h3>
                            <p className="text-[#1c1917]/85 leading-relaxed font-medium">
                                {task.description || 'No description provided.'}
                            </p>
                        </div>
                    </div>

                    {/* Collaboration Section */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-[#1c1917] flex items-center gap-2">
                            Discussion
                            <span className="text-xs font-medium text-[#1c1917]/60 px-2 py-0.5 bg-[#f7f3ed] rounded-full">
                                Mentions enabled
                            </span>
                        </h3>
                        <TaskComments taskId={id} projectPath={`/member/tasks/${id}`} />
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Activity Feed */}
                    <div className="card p-6 border-[#e5dec9]">
                        <h3 className="font-semibold text-[#1c1917] mb-6 flex items-center gap-2">
                            <ArrowPathIcon className="w-5 h-5 text-[#d97757]" />
                            Activity Log
                        </h3>
                        <ActivityFeed taskId={id} />
                    </div>

                    {/* Meta Data */}
                    <div className="card p-6 space-y-6 border-[#e5dec9] bg-[#f7f3ed]/50">
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-semibold uppercase tracking-widest text-secondary-600">Assigned To</h4>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white border border-[#e5dec9] flex items-center justify-center text-sm font-semibold text-[#1c1917] shadow-sm">
                                    {task.assignee?.full_name?.charAt(0) || '?'}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-[#1c1917]">{task.assignee?.full_name || 'Unassigned'}</p>
                                    <p className="text-[10px] font-semibold text-secondary-500 uppercase tracking-tighter">Primary Owner</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <p className="text-[10px] font-semibold text-secondary-600 uppercase">Status</p>
                            <p className="text-sm font-semibold text-[#1c1917] capitalize">{task.status?.replace('_', ' ') || 'To Do'}</p>
                        </div>

                        {task.assignee?.id === user?.id && user?.role !== 'guest' && (
                            <div className="pt-6 border-t border-[#e5dec9]">
                                <TaskStatusManager
                                    task={task}
                                    columns={columns || []}
                                    projectId={task.project.id}
                                />
                            </div>
                        )}
                        {user?.role === 'guest' && (
                            <div className="pt-6 border-t border-slate-100">
                                <p className="text-[10px] font-semibold text-[#1c1917]/60 uppercase tracking-widest text-center italic">
                                    Read-only access enabled
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function CheckBadgeIcon(props: any) {
    return (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
        </svg>
    );
}
