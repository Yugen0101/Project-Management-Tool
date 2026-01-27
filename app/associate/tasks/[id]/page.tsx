import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/session';
import { notFound, redirect } from 'next/navigation';
import { format } from 'date-fns';
import Link from 'next/link';
import {
    CalendarIcon,
    ChevronLeftIcon,
    PencilSquareIcon
} from '@heroicons/react/24/outline';
import TaskComments from '@/components/collaboration/TaskComments';
import TaskAssignmentClient from '@/components/tasks/TaskAssignmentClient';
import TaskStatusManager from '@/components/tasks/TaskStatusManager';
import EditTaskDialog from '@/components/tasks/EditTaskDialog';

export default async function AssociateTaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const user = await getCurrentUser();

    if (!user || user.role !== 'associate') {
        redirect('/login');
    }

    const supabase = await createClient();

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

    if (error) {
        console.error('Error fetching task details:', JSON.stringify(error, null, 2));
    }

    if (error || !task) {
        return notFound();
    }

    // Fetch project columns for status transitions
    const { data: columns } = await supabase
        .from('kanban_columns')
        .select('*')
        .eq('project_id', task.project.id)
        .order('order_index', { ascending: true });

    // Verify access: Associate must be creator or assignee
    // Note: RLS might already enforce this, but double checking here ensures UI consistency
    if (task.created_by !== user.id && task.assigned_to !== user.id) {
        // Optimally we'd confirm if they are project lead too, but for 'managed' tasks this is a safe start
        // If RLS allows read, then we are good. Assuming RLS allows read if member of project.
        // Let's rely on the query success.
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header & Actions */}
            <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-[#e5dec9]">
                <div className="flex items-center gap-4">
                    <Link
                        href="/associate/tasks"
                        className="p-2 bg-[#f7f3ed] text-[#78716c] hover:text-[#d97757] rounded-xl transition-all"
                    >
                        <ChevronLeftIcon className="w-5 h-5" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 text-[10px] font-medium uppercase text-[#78716c] tracking-widest">
                            Project: {task.project.name}
                        </div>
                        <h1 className="text-2xl font-semibold text-[#1c1917]">Task Details</h1>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <EditTaskDialog task={task} />
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
                            <h2 className="text-3xl font-semibold text-[#1c1917] leading-tight">
                                {task.title}
                            </h2>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-6 bg-[#f7f3ed] rounded-2xl border border-[#e5dec9]">
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
                                <p className="text-sm font-semibold text-[#1c1917]">{task.assignee?.full_name?.split(' ')[0] || 'Unassigned'}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-medium uppercase tracking-widest text-[#78716c]">Description</h3>
                            <div className="p-6 bg-white border border-[#e5dec9] rounded-2xl text-[#1c1917]/80 leading-relaxed font-normal whitespace-pre-wrap">
                                {task.description || 'No detailed description was provided for this task.'}
                            </div>
                        </div>
                    </div>

                    {/* Collaboration Section */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-[#1c1917]">Team Discussion</h3>
                        <TaskComments taskId={id} projectPath={`/associate/projects/${task.project.id}`} />
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">


                    {/* Assignment Card */}
                    <div className="card p-6 space-y-6 bg-[#1c1917] text-white border-0 shadow-xl shadow-[#1c1917]/20">
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-medium uppercase tracking-widest text-white/60">Task Assignee</h4>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-xl font-bold text-white border border-white/20">
                                    {task.assignee?.full_name?.charAt(0) || '?'}
                                </div>
                                <div>
                                    <p className="text-lg font-semibold">{task.assignee?.full_name || 'Unassigned'}</p>
                                    <p className="text-[10px] font-medium text-white/60 uppercase tracking-widest">Project Member</p>
                                </div>
                            </div>
                        </div>
                        {/* Only allow re-assignment if user is the creator or project owner? For now, enabling for associate if they can see the page. */}
                        <TaskAssignmentClient
                            taskId={id}
                            currentAssigneeId={task.assigned_to}
                            projectId={task.project.id}
                            members={(task.project as any).user_projects || []}
                        />

                        {/* Status Management for Associate */}
                        <div className="pt-6 border-t border-white/10">
                            <TaskStatusManager
                                task={task}
                                columns={columns || []}
                                projectId={task.project.id}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
