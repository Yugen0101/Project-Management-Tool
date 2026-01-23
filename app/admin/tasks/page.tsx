import { format } from 'date-fns';
import {
    ClipboardDocumentListIcon,
    CalendarIcon,
    UserIcon,
    TagIcon,
    ArrowPathIcon,
    MagnifyingGlassIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import Pagination from '@/components/ui/Pagination';
import { createAdminClient } from '@/lib/supabase/admin';

export default async function AdminTasksPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string, status?: string }>;
}) {
    const { page, status: filterStatus = 'all' } = await searchParams;
    const currentPage = parseInt(page || '1');
    const pageSize = 15;
    const from = (currentPage - 1) * pageSize;
    const to = from + pageSize - 1;

    const supabase = await createAdminClient();

    let query = supabase
        .from('tasks')
        .select(`
            *,
            project:projects(name),
            assigned_user:users(full_name, email)
        `, { count: 'exact' })
        .is('deleted_at', null);

    if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
    }

    const { data: tasks, count, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

    const totalPages = Math.ceil((count || 0) / pageSize);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                        <ClipboardDocumentListIcon className="w-8 h-8 text-primary-600" />
                        All Tasks
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Monitor and manage all tasks across all projects.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button className="btn-secondary flex items-center gap-2">
                        <ArrowPathIcon className="w-5 h-5" />
                        Refresh
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search tasks by name or project..."
                        className="input pl-10 w-full"
                    />
                </div>
                <div className="flex gap-2">
                    <Link
                        href="/admin/tasks?status=all"
                        className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${filterStatus === 'all' ? 'bg-primary-600 border-primary-600 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                        All
                    </Link>
                    <Link
                        href="/admin/tasks?status=in_progress"
                        className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${filterStatus === 'in_progress' ? 'bg-primary-600 border-primary-600 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                        In Progress
                    </Link>
                    <Link
                        href="/admin/tasks?status=completed"
                        className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${filterStatus === 'completed' ? 'bg-primary-600 border-primary-600 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                        Completed
                    </Link>
                </div>
            </div>

            <div className="card overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Task</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Project</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Assignee</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Status</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Due Date</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {tasks?.map((task) => (
                            <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">{task.title}</p>
                                        <p className="text-[10px] text-slate-400 truncate max-w-[200px]">{task.description}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-xs font-medium text-slate-600">
                                    {task.project?.name || 'Unknown'}
                                </td>
                                <td className="px-6 py-4">
                                    {task.assigned_user ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 bg-purple-100 rounded-full flex items-center justify-center text-[10px] font-black text-purple-600 border border-purple-200">
                                                {task.assigned_user.full_name?.charAt(0)}
                                            </div>
                                            <div className="text-[10px]">
                                                <p className="font-bold text-slate-900">{task.assigned_user.full_name}</p>
                                                <p className="text-slate-400 uppercase tracking-tighter">{task.assigned_user.email}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-slate-400 italic">Unassigned</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${task.status === 'completed' ? 'bg-green-100 text-green-700' :
                                            task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                                                'bg-slate-100 text-slate-700'
                                        }`}>
                                        {task.status.replace(/_/g, ' ')}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                                        <CalendarIcon className="w-4 h-4 text-slate-300" />
                                        {task.due_date ? format(new Date(task.due_date), 'MMM d, yyyy') : 'No date'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link
                                        href={`/admin/tasks/${task.id}`}
                                        className="text-primary-600 hover:text-primary-700"
                                    >
                                        <ChevronRightIcon className="w-5 h-5" />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {(!tasks || tasks.length === 0) && (
                    <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                        <ClipboardDocumentListIcon className="w-12 h-12 mb-4 opacity-20" />
                        <p className="text-sm font-bold uppercase tracking-widest">No tasks found</p>
                    </div>
                )}
            </div>

            <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
    );
}
