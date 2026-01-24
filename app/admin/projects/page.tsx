import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import {
    PlusIcon,
    BriefcaseIcon,
    CalendarIcon,
    UserGroupIcon,
    ChevronRightIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    HashtagIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { format } from 'date-fns';
import Pagination from '@/components/ui/Pagination';

export default async function AdminProjectsPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string, page?: string }>;
}) {
    const { status: filterStatus = 'active', page } = await searchParams;
    const currentPage = parseInt(page || '1');
    const pageSize = 9;
    const from = (currentPage - 1) * pageSize;
    const to = from + pageSize - 1;

    // Check user and role
    const user = await getCurrentUser();

    if (!user || user.role !== 'admin') {
        redirect('/login');
    }

    const supabase = await createClient();

    // Fetch projects with counts
    let query = supabase
        .from('projects')
        .select(`
            *,
            tasks:tasks(id),
            user_projects:user_projects(id)
        `, { count: 'exact' });

    if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
    }

    const { data: projects, count, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

    if (error) {
        console.error('AdminProjectsPage fetch error:', error);
    }

    const totalPages = Math.ceil((count || 0) / pageSize);

    return (
        <div className="space-y-12 pb-20 animate-in fade-in duration-1000">
            {/* Elegant Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-accent-500 mb-2">
                        <SparklesIcon className="w-5 h-5 shadow-sm" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Infrastructure Registry</span>
                    </div>
                    <h1 className="text-5xl font-black text-[#1c1917] tracking-tighter uppercase leading-none">
                        Operational <span className="text-accent-500">Streams</span>
                    </h1>
                    <p className="text-[#1c1917]/50 font-medium text-lg italic font-serif">Coordinate and scale multiple workstreams simultaneously.</p>
                </div>
                <Link href="/admin/projects/new" className="btn-primary flex items-center gap-3 !px-8 !py-4 !rounded-2xl shadow-xl shadow-accent-500/20">
                    <PlusIcon className="w-6 h-6" />
                    <span className="text-xs font-black uppercase tracking-widest">Deploy Infrastructure</span>
                </Link>
            </div>

            {/* Glass Filter & Search Bar */}
            <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
                <div className="relative w-full lg:w-[32rem] group">
                    <MagnifyingGlassIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1c1917]/20 group-focus-within:text-accent-500 transition-all" />
                    <input
                        type="text"
                        placeholder="Search operational nodes..."
                        className="w-full h-16 pl-16 pr-8 bg-white border border-[#e5dec9] rounded-2xl text-sm font-bold text-[#1c1917] placeholder-[#1c1917]/20 focus:outline-none focus:border-accent-500 transition-all shadow-sm shadow-[#d9cfb0]/10"
                    />
                </div>
                <div className="flex items-center gap-2 p-2 bg-[#f7f3ed] border border-[#e5dec9] rounded-2xl shadow-sm">
                    {['active', 'completed', 'all'].map((st) => (
                        <Link
                            key={st}
                            href={`/admin/projects?status=${st}`}
                            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === st ? 'bg-accent-500 text-white shadow-lg shadow-accent-500/20' : 'text-[#1c1917]/40 hover:text-[#1c1917] hover:bg-white'}`}
                        >
                            {st}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Projects Registry Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {projects?.map((project, i) => (
                    <div
                        key={project.id}
                        className="card !p-0 bg-white border-[#e5dec9] shadow-lg shadow-[#d9cfb0]/20 group transition-all duration-500 flex flex-col hover:border-accent-200"
                    >
                        <div className="p-8 pb-0">
                            <div className="flex justify-between items-start mb-8">
                                <div className="w-16 h-16 bg-[#f7f3ed] group-hover:bg-accent-50 text-[#1c1917]/40 group-hover:text-accent-500 rounded-2xl flex items-center justify-center border border-[#e5dec9] group-hover:border-accent-100 transition-all duration-300">
                                    <BriefcaseIcon className="w-8 h-8" />
                                </div>
                                <span className={`badge shrink-0 text-[9px] font-black uppercase tracking-widest py-1 px-3 ${project.status === 'active' ? 'bg-[#7c9473]/10 text-[#7c9473] border-[#7c9473]/20' :
                                    project.status === 'completed' ? 'bg-[#7a8fa3]/10 text-[#7a8fa3] border-[#7a8fa3]/20' : 'bg-[#d97757]/10 text-[#d97757] border-[#d97757]/20'
                                    }`}>
                                    {project.status}
                                </span>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-2xl font-black text-[#1c1917] tracking-tight group-hover:text-accent-500 transition-colors uppercase leading-[0.9]">
                                    {project.name}
                                </h3>
                                <p className="text-[#1c1917]/40 text-sm font-medium leading-relaxed italic h-10 line-clamp-2">
                                    {project.description || 'Architectural roadmap for the specified operational stream.'}
                                </p>

                                <div className="grid grid-cols-2 gap-6 pt-8 border-t border-[#e5dec9]">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-[#1c1917]/20 uppercase tracking-[0.2em]">Personnel</p>
                                        <div className="flex items-center gap-2 text-sm font-black text-[#1c1917]">
                                            <UserGroupIcon className="w-4 h-4 text-accent-500" />
                                            <span>{project.user_projects?.length || 0} Nodes</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <p className="text-[10px] font-black text-[#1c1917]/20 uppercase tracking-[0.2em]">Sequence</p>
                                        <div className="flex items-center justify-end gap-2 text-sm font-black text-[#1c1917]">
                                            <HashtagIcon className="w-4 h-4 text-[#d97757]" />
                                            <span>{project.tasks?.length || 0} Items</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-[10px] font-black text-[#1c1917]/30 bg-[#f7f3ed] p-3 rounded-xl border border-[#e5dec9]">
                                    <CalendarIcon className="w-4 h-4 text-accent-500" />
                                    <span className="uppercase tracking-[0.2em]">Protocol Term: {format(new Date(project.end_date), 'MM.dd.yyyy')}</span>
                                </div>
                            </div>
                        </div>

                        {/* High-End Progress Bar */}
                        <div className="p-8 pt-10 mt-auto space-y-4">
                            <div className="flex justify-between items-center text-[10px] font-black text-[#1c1917]/30 tracking-[0.3em] uppercase">
                                <span>Operational State</span>
                                <span className="text-accent-500">Optimized</span>
                            </div>
                            <div className="w-full h-1.5 bg-[#f7f3ed] rounded-full overflow-hidden border border-[#e5dec9]">
                                <div className="h-full bg-accent-500 rounded-full shadow-[0_0_10px_rgba(217,119,87,0.3)] animate-pulse" style={{ width: '100%' }}></div>
                            </div>
                        </div>

                        <Link
                            href={`/admin/projects/${project.id}`}
                            className="bg-accent-500 p-6 flex items-center justify-center gap-3 text-[10px] font-black text-white hover:bg-accent-600 uppercase tracking-[0.4em] transition-all rounded-b-[2rem] shadow-[0_-4px_20px_rgba(217,119,87,0.1)]"
                        >
                            Open Command Node
                            <ChevronRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                ))}

                {(!projects || projects.length === 0) && (
                    <div className="col-span-full py-32 flex flex-col items-center justify-center card bg-white border-dashed border-2 border-[#e5dec9] rounded-[3rem]">
                        <div className="w-24 h-24 bg-[#f7f3ed] rounded-[2rem] flex items-center justify-center text-[#1c1917]/10 mb-8 animate-pulse">
                            <BriefcaseIcon className="w-12 h-12" />
                        </div>
                        <h3 className="text-3xl font-black text-[#1c1917] tracking-tighter uppercase">No Streams Detected</h3>
                        <p className="text-[#1c1917]/30 text-sm font-bold uppercase tracking-widest mt-3 mb-12 text-center max-w-sm">No active operational streams detected in the current workspace registry.</p>
                        <Link href="/admin/projects/new" className="btn-primary !px-10 !py-4 rounded-xl shadow-xl shadow-accent-500/20">
                            Deploy Infrastructure
                        </Link>
                    </div>
                )}
            </div>

            <div className="pt-12 flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-[800ms] fill-mode-both">
                <Pagination currentPage={currentPage} totalPages={totalPages} />
            </div>
        </div>
    );
}
