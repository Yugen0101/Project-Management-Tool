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
        .eq('assigned_to', user.id);

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
        <div className="space-y-12 animate-in fade-in duration-1000">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-accent-500 mb-2">
                        <ClipboardDocumentListIcon className="w-5 h-5 shadow-sm" />
                        <span className="text-[10px] font-semibold uppercase tracking-[0.4em]">Operational Matrix</span>
                    </div>
                    <h1 className="text-4xl font-semibold text-[#1c1917] tracking-tighter uppercase leading-none">
                        Active <span className="text-accent-500">Workspace</span>
                    </h1>
                    <p className="text-[#1c1917]/50 font-medium text-lg italic font-serif">You have {tasks?.filter(t => t.status !== 'completed').length || 0} active operational units requiring attention.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex border-b border-[#e5dec9] gap-12">
                {[
                    { id: 'all', label: 'All Units' },
                    { id: 'in_progress', label: 'Active Process' },
                    { id: 'completed', label: 'Finalized' }
                ].map((tab) => (
                    <Link
                        key={tab.id}
                        href={`/member/tasks?status=${tab.id}`}
                        className={`pb-5 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative ${filterStatus === tab.id ? 'text-accent-500' : 'text-[#78716c] hover:text-[#1c1917]'}`}
                    >
                        {tab.label}
                        {filterStatus === tab.id && <div className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-accent-500 rounded-full shadow-[0_0_10px_rgba(217,119,87,0.4)]"></div>}
                    </Link>
                ))}
            </div>

            {/* Task Cards/List */}
            <div className="grid grid-cols-1 gap-8">
                {tasks?.map((task) => (
                    <div key={task.id} className="card !p-0 bg-white border-[#e5dec9] shadow-lg shadow-[#d9cfb0]/20 group transition-all duration-500 hover:border-accent-200">
                        <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div className="flex-1 min-w-0 space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 bg-[#f7f3ed] text-[9px] font-medium uppercase text-accent-500 rounded-xl border border-[#e5dec9] tracking-widest shadow-sm">
                                        {task.project?.name}
                                    </span>
                                    <span className={`badge ${task.status === 'completed' ? 'badge-success' :
                                        task.status === 'in_progress' ? 'badge-warning' :
                                            'badge-info'
                                        }`}>
                                        {task.status?.replace('_', ' ')}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-semibold text-[#1c1917] tracking-tight group-hover:text-accent-500 transition-colors uppercase leading-[0.9]">
                                    {task.title}
                                </h3>
                                <p className="text-[#1c1917]/40 text-sm font-medium leading-relaxed italic line-clamp-1 italic">
                                    {task.description || 'Task parameters are being finalized by the coordinator.'}
                                </p>
                            </div>

                            <div className="flex items-center gap-12 shrink-0">
                                <div className="text-right hidden sm:block space-y-1">
                                    <p className="text-[9px] font-medium uppercase text-[#78716c] tracking-[0.2em]">Deadline Protocol</p>
                                    <div className="flex items-center gap-2 text-[11px] font-medium text-[#78716c] justify-end uppercase tracking-widest">
                                        <CalendarIcon className="w-4 h-4 text-accent-500" />
                                        {task.due_date ? format(new Date(task.due_date), 'MM.dd.yyyy') : 'UNSET'}
                                    </div>
                                </div>
                                <Link
                                    href={`/member/tasks/${task.id}`}
                                    className="w-12 h-12 bg-[#1c1917] rounded-xl flex items-center justify-center text-white hover:text-accent-500 transition-all shadow-lg shadow-[#1c1917]/10"
                                >
                                    <ChevronRightIcon className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}

                {(!tasks || tasks.length === 0) && (
                    <div className="py-32 flex flex-col items-center justify-center card bg-white border-dashed border-2 border-[#e5dec9] rounded-[3rem]">
                        <div className="w-24 h-24 bg-[#f7f3ed] rounded-[2rem] flex items-center justify-center text-[#1c1917]/10 mb-8 animate-pulse">
                            <ClipboardDocumentListIcon className="w-12 h-12" />
                        </div>
                        <h3 className="text-3xl font-semibold text-[#1c1917] tracking-tighter uppercase">No Assignments</h3>
                        <p className="text-[#1c1917]/30 text-sm font-medium uppercase tracking-widest mt-3 text-center max-w-sm">Current Operational Matrix is clear. No active assignments detected.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
