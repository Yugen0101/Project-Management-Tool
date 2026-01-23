import { format } from 'date-fns';
import {
    ClipboardDocumentListIcon,
    CalendarIcon,
    ArrowPathIcon,
    MagnifyingGlassIcon,
    ChevronRightIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/session';
import { redirect } from 'next/navigation';

export default async function MemberTasksPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string }>;
}) {
    const { status: filterStatus = 'all' } = await searchParams;
    const user = await getCurrentUser();

    if (!user) {
        redirect('/login');
    }

    const supabase = await createClient();

    let query = supabase
        .from('tasks')
        .select(`
            *,
            project:projects(name, status)
        `)
        .eq('assigned_to', user.id)
        .is('deleted_at', null);

    if (filterStatus !== 'all') {
        const dbStatus = filterStatus === 'in_progress' ? 'in_progress' :
            filterStatus === 'completed' ? 'completed' :
                filterStatus === 'not_started' ? 'not_started' : 'all';
        if (dbStatus !== 'all') {
            query = query.eq('status', dbStatus);
        }
    }

    const { data: tasks, error } = await query
        .order('due_date', { ascending: true, nullsFirst: false });

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-xl">
                            <ClipboardDocumentListIcon className="w-8 h-8 text-purple-600" />
                        </div>
                        My Workspace
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">
                        You have {tasks?.filter(t => t.status !== 'completed').length || 0} active tasks to focus on today.
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex border-b border-slate-100 gap-8">
                <Link
                    href="/member/tasks?status=all"
                    className={`pb-4 text-sm font-bold transition-all relative ${filterStatus === 'all' ? 'text-purple-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    All Tasks
                    {filterStatus === 'all' && <div className="absolute bottom-0 left-0 w-full h-1 bg-purple-600 rounded-full"></div>}
                </Link>
                <Link
                    href="/member/tasks?status=in_progress"
                    className={`pb-4 text-sm font-bold transition-all relative ${filterStatus === 'in_progress' ? 'text-purple-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    In Progress
                    {filterStatus === 'in_progress' && <div className="absolute bottom-0 left-0 w-full h-1 bg-purple-600 rounded-full"></div>}
                </Link>
                <Link
                    href="/member/tasks?status=completed"
                    className={`pb-4 text-sm font-bold transition-all relative ${filterStatus === 'completed' ? 'text-purple-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    Completed
                    {filterStatus === 'completed' && <div className="absolute bottom-0 left-0 w-full h-1 bg-purple-600 rounded-full"></div>}
                </Link>
            </div>

            {/* Task Cards/List */}
            <div className="grid grid-cols-1 gap-4">
                {tasks?.map((task) => (
                    <div key={task.id} className="group bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-xl hover:shadow-purple-500/5 hover:border-purple-100 transition-all">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="px-2 py-0.5 bg-slate-100 text-[10px] font-black uppercase text-slate-500 rounded tracking-widest">
                                        {task.project?.name}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${task.status === 'completed' ? 'bg-green-100 text-green-700' :
                                            task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                                                'bg-slate-100 text-slate-600'
                                        }`}>
                                        {task.status.replace(/_/g, ' ')}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-purple-600 transition-colors">
                                    {task.title}
                                </h3>
                                <p className="text-slate-500 text-sm line-clamp-1">
                                    {task.description || 'No description provided.'}
                                </p>
                            </div>

                            <div className="flex items-center gap-8 shrink-0">
                                <div className="text-right hidden sm:block">
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Due Date</p>
                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                        <ClockIcon className="w-4 h-4 text-slate-400" />
                                        {task.due_date ? format(new Date(task.due_date), 'MMM d, yyyy') : 'No deadline'}
                                    </div>
                                </div>
                                <Link
                                    href={`/member/tasks/${task.id}`}
                                    className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:bg-purple-600 hover:text-white transition-all shadow-sm"
                                >
                                    <ChevronRightIcon className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}

                {(!tasks || tasks.length === 0) && (
                    <div className="py-32 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100">
                        <div className="p-4 bg-white rounded-2xl shadow-sm mb-6">
                            <ClipboardDocumentListIcon className="w-12 h-12 text-slate-200" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 tracking-tight">No tasks assigned yet</h3>
                        <p className="text-slate-500 text-sm mt-1">You're all caught up! Take a break.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
