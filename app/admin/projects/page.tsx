import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
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
import { createAdminClient } from '@/lib/supabase/admin';

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
    const supabase = await createAdminClient();

    // Fetch projects with counts
    let query = supabase
        .from('projects')
        .select(`
            *,
            tasks:tasks(count),
            user_projects:user_projects(id)
        `, { count: 'exact' })
        .is('deleted_at', null); 

    if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
    }

    const { data: projects, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

    const totalPages = Math.ceil((count || 0) / pageSize);

    return (
        <div className="space-y-12 pb-20">
            {/* Elegant Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary-600 mb-2">
                        <SparklesIcon className="w-5 h-5" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Module Registry</span>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-secondary-900">
                        Operational <span className="text-gradient">Projects</span>
                    </h1>
                    <p className="text-secondary-500 text-base font-medium">Coordinate and scale multiple workstreams simultaneously.</p>
                </div>
                <Link href="/admin/projects/new" className="btn-primary">
                    <PlusIcon className="w-5 h-5" />
                    <span>Deploy New Project</span>
                </Link>
            </div>

            {/* Glass Filter & Search Bar */}
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between animate-in fade-in slide-in-from-bottom-2 duration-700 delay-[200ms] fill-mode-both">
                <div className="relative w-full lg:w-[32rem] group">
                    <MagnifyingGlassIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-300 group-focus-within:text-primary-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search workspace registry..."
                        className="input pl-14 w-full h-14 bg-white shadow-soft"
                    />
                </div>
                <div className="flex items-center gap-1.5 p-1.5 bg-white border border-border/50 rounded-2xl shadow-soft">
                    {['active', 'completed', 'all'].map((st) => (
                        <Link
                            key={st}
                            href={`/admin/projects?status=${st}`}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${filterStatus === st ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' : 'text-secondary-400 hover:text-secondary-900 hover:bg-secondary-50'}`}
                        >
                            {st}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Projects Registry Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects?.map((project, i) => (
                    <div 
                        key={project.id} 
                        className={`card flex flex-col group h-full animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both delay-[${(i % 3) * 100}ms]`}
                    >
                        <div className="flex justify-between items-start mb-8">
                            <div className="w-14 h-14 bg-secondary-50 group-hover:bg-primary-50 text-secondary-400 group-hover:text-primary-600 rounded-[1.25rem] flex items-center justify-center border border-border/50 group-hover:border-primary-100 transition-all duration-300">
                                <BriefcaseIcon className="w-7 h-7" />
                            </div>
                            <span className={`badge shrink-0 ${
                                project.status === 'active' ? 'badge-info' :
                                project.status === 'completed' ? 'badge-success' : 'badge-warning'
                            }`}>
                                {project.status}
                            </span>
                        </div>

                        <div className="flex-1 space-y-4">
                            <h3 className="text-xl font-bold text-secondary-900 leading-tight group-hover:text-primary-600 transition-colors">
                                {project.name}
                            </h3>
                            <p className="text-secondary-500 text-sm font-medium leading-relaxed line-clamp-2 h-10">
                                {project.description || 'Architectural roadmap for the specified operational stream.'}
                            </p>

                            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border/50">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-secondary-300 uppercase tracking-widest">Personnel</p>
                                    <div className="flex items-center gap-2 text-sm font-bold text-secondary-700">
                                        <UserGroupIcon className="w-4 h-4 text-primary-500" />
                                        <span>{project.user_projects?.length || 0} Nodes</span>
                                    </div>
                                </div>
                                <div className="space-y-1 text-right">
                                    <p className="text-[10px] font-bold text-secondary-300 uppercase tracking-widest">Task Load</p>
                                    <div className="flex items-center justify-end gap-2 text-sm font-bold text-secondary-700">
                                        <HashtagIcon className="w-4 h-4 text-indigo-500" />
                                        <span>{project.tasks?.[0]?.count || 0} Seq</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-secondary-400 bg-secondary-50/50 p-2.5 rounded-xl border border-secondary-100/50">
                                <CalendarIcon className="w-4 h-4 text-secondary-300" />
                                <span className="uppercase tracking-widest">Deadline Protocol: {format(new Date(project.end_date), 'MM.dd.yyyy')}</span>
                            </div>
                        </div>

                        {/* High-End Progress Bar */}
                        <div className="mt-10 space-y-3">
                            <div className="flex justify-between items-center text-[10px] font-bold text-secondary-400 tracking-[0.2em]">
                                <span>OPERATIONAL STATUS</span>
                                <span className="text-primary-600">65%</span>
                            </div>
                            <div className="w-full h-2 bg-secondary-100 rounded-full overflow-hidden p-0.5 border border-secondary-200/50">
                                <div className="h-full bg-primary-600 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.3)] animate-pulse-subtle" style={{ width: '65%' }}></div>
                            </div>
                        </div>

                        <Link
                            href={`/admin/projects/${project.id}`}
                            className="mt-8 pt-8 border-t border-border/50 flex items-center justify-center gap-2 text-[10px] font-bold text-secondary-400 group-hover:text-primary-600 uppercase tracking-[0.3em] transition-all hover:bg-primary-50/30 rounded-b-2xl -mx-8 -mb-8 py-6"
                        >
                            Open Dashboard Node
                            <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                ))}

                {(!projects || projects.length === 0) && (
                    <div className="col-span-full py-24 flex flex-col items-center justify-center card bg-white/50 border-dashed border-2">
                        <div className="w-20 h-20 bg-secondary-50 rounded-3xl flex items-center justify-center text-secondary-200 mb-8 animate-float">
                            <BriefcaseIcon className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-bold text-secondary-900">No Projects Found</h3>
                        <p className="text-secondary-400 text-base font-medium mt-2 mb-10 text-center max-w-sm">No active operational streams detected in the current workspace registry.</p>
                        <Link href="/admin/projects/new" className="btn-primary">
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
