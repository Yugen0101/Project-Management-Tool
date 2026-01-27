import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import Link from 'next/link';
import {
    ClockIcon,
    CalendarIcon,
    UserIcon,
    ChevronLeftIcon,
    ArrowPathIcon,
    PencilSquareIcon,
    TrashIcon
} from '@heroicons/react/24/outline';
import TaskComments from '@/components/collaboration/TaskComments';
import ActivityFeed from '@/components/activity/ActivityFeed';
import TaskAssignmentClient from '@/components/tasks/TaskAssignmentClient';

export default async function AdminTaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
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
            project:projects(
                id, 
                name,
                user_projects:user_projects(*, user:users(*))
            ),
            assignee:users!tasks_assigned_to_fkey(*)
        `)
        .eq('id', id)
        .single();

    if (error || !task) {
        return notFound();
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Admin Header & Actions */}
            <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-4">
                    <Link
                        href={`/admin/projects/${task.project.id}`}
                        className="p-2 bg-beige-50 text-secondary-600 hover:text-accent-600 rounded-xl transition-all"
                    >
                        <ChevronLeftIcon className="w-5 h-5" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase text-secondary-600 tracking-widest">
                            Project: {task.project.name}
                        </div>
                        <h1 className="text-2xl font-semibold text-[#1c1917]">Task Management</h1>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn-secondary py-2.5 flex items-center gap-2">
                        <PencilSquareIcon className="w-4 h-4" />
                        Edit Task
                    </button>
                    <button className="p-2.5 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all">
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="card p-8 space-y-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className={`badge ${task.priority === 'high' ? 'badge-danger' :
                                    task.priority === 'medium' ? 'badge-warning' :
                                        'badge-info'
                                    }`}>
                                    {task.priority || 'medium'} Priority
                                </span>
                                <span className={`badge ${task.status === 'completed' ? 'badge-success' :
                                    task.status === 'in_progress' ? 'badge-warning' :
                                        'badge-info'
                                    }`}>
                                    {task.status?.replace('_', ' ') || 'todo'}
                                </span>
                            </div>
                            <h2 className="text-4xl font-semibold text-[#1c1917] leading-tight">
                                {task.title}
                            </h2>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-6 bg-beige-50/50 rounded-2xl border border-beige-100">
                            <div>
                                <p className="text-[10px] font-semibold text-secondary-600 uppercase mb-1">Status</p>
                                <p className="text-sm font-semibold text-[#1c1917] capitalize">{task.status?.replace('_', ' ') || 'To Do'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold text-secondary-600 uppercase mb-1">Due Date</p>
                                <p className="text-sm font-semibold text-[#1c1917]">
                                    {task.due_date ? format(new Date(task.due_date), 'MMM d, yyyy') : 'No Date'}
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold text-secondary-600 uppercase mb-1">Created</p>
                                <p className="text-sm font-semibold text-[#1c1917]">{format(new Date(task.created_at), 'MMM d')}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold text-secondary-600 uppercase mb-1">Owner</p>
                                <p className="text-sm font-semibold text-[#1c1917]">{task.assignee?.full_name?.split(' ')[0] || 'Member'}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold uppercase tracking-widest text-secondary-700">Description</h3>
                            <div className="p-6 bg-white border border-beige-100 rounded-2xl text-[#1c1917]/85 leading-relaxed font-medium">
                                {task.description || 'No detailed description was provided for this task.'}
                            </div>
                        </div>
                    </div>

                    {/* Collaboration Section */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-semibold text-[#1c1917]">Team Discussion</h3>
                        <TaskComments taskId={id} projectPath={`/admin/projects/${task.project.id}`} />
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Activity Feed */}
                    <div className="card p-0 overflow-hidden">
                        <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                            <h3 className="font-semibold text-[#1c1917] flex items-center gap-2 text-sm uppercase tracking-widest">
                                <ArrowPathIcon className="w-5 h-5 text-primary-600" />
                                Audit log
                            </h3>
                        </div>
                        <div className="p-6">
                            <ActivityFeed taskId={id} />
                        </div>
                    </div>

                    {/* Assignment Card */}
                    <div className="card p-6 space-y-6 bg-primary-600 text-white border-0 shadow-xl shadow-primary-900/20">
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-semibold uppercase tracking-widest text-primary-100">Task Assignee</h4>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl font-bold text-white border border-white/30">
                                    {task.assignee?.full_name?.charAt(0) || '?'}
                                </div>
                                <div>
                                    <p className="text-lg font-semibold">{task.assignee?.full_name || 'Unassigned'}</p>
                                    <p className="text-[10px] font-semibold text-primary-100 uppercase tracking-widest">Active Contributor</p>
                                </div>
                            </div>
                        </div>
                        <TaskAssignmentClient
                            taskId={id}
                            currentAssigneeId={task.assigned_to}
                            projectId={task.project.id}
                            members={(task.project as any).user_projects || []}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
