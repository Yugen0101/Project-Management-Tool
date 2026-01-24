import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { FolderIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default async function AssociateProjectsPage() {
    const user = await getCurrentUser();

    if (!user || user.role !== 'associate') {
        redirect('/login');
    }

    const supabase = await createClient();

    // Fetch projects assigned to the associate
    const { data: userProjects } = await supabase
        .from('user_projects')
        .select(`
            project:projects(
                *,
                created_by_user:users!projects_created_by_fkey(full_name)
            )
        `)
        .eq('user_id', user.id);

    const projects = userProjects?.map((up: any) => up.project) || [];

    return (
        <div className="space-y-12 animate-in fade-in duration-1000">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-accent-500 mb-2">
                        <FolderIcon className="w-5 h-5 shadow-sm" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Project Registry</span>
                    </div>
                    <h1 className="text-5xl font-black text-[#1c1917] tracking-tighter uppercase leading-none">
                        Managed <span className="text-accent-500">Nodes</span>
                    </h1>
                    <p className="text-[#1c1917]/50 font-medium text-lg italic font-serif">You are currently overseeing {projects?.length || 0} critical operational streams.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {projects && projects.length > 0 ? (
                    projects.map((project: any) => (
                        <Link
                            key={project.id}
                            href={`/associate/projects/${project.id}`}
                            className="card !p-0 bg-white border-[#e5dec9] shadow-lg shadow-[#d9cfb0]/20 group transition-all duration-500 flex flex-col hover:border-accent-200"
                        >
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <span className={`badge shrink-0 text-[9px] font-black uppercase tracking-widest py-1 px-3 ${project.status === 'active' ? 'bg-[#7c9473]/10 text-[#7c9473] border-[#7c9473]/20' : 'bg-[#7a8fa3]/10 text-[#7a8fa3] border-[#7a8fa3]/20'}`}>
                                        {project.status}
                                    </span>
                                    <div className="w-10 h-10 bg-[#f7f3ed] rounded-xl flex items-center justify-center text-[#d97757] border border-[#e5dec9] group-hover:bg-accent-500 group-hover:text-white transition-all">
                                        <FolderIcon className="w-5 h-5" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-2xl font-black text-[#1c1917] tracking-tight group-hover:text-accent-500 transition-colors uppercase leading-[0.9]">
                                        {project.name}
                                    </h3>
                                    <p className="text-[#1c1917]/40 text-sm font-medium leading-relaxed italic h-10 line-clamp-2">
                                        {project.description || 'Architectural roadmap for the specified operational stream.'}
                                    </p>

                                    <div className="pt-8 border-t border-[#e5dec9] flex items-center justify-between">
                                        <div className="text-[9px] font-black text-[#1c1917]/20 uppercase tracking-[0.2em]">
                                            Admin: {project.created_by_user?.full_name || 'System'}
                                        </div>
                                        <div className="w-10 h-10 bg-[#1c1917] rounded-xl flex items-center justify-center text-white hover:text-accent-500 transition-all shadow-lg shadow-[#1c1917]/10">
                                            <ChevronRightIcon className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="col-span-full py-32 flex flex-col items-center justify-center card bg-white border-dashed border-2 border-[#e5dec9] rounded-[3rem]">
                        <div className="w-24 h-24 bg-[#f7f3ed] rounded-[2rem] flex items-center justify-center text-[#1c1917]/10 mb-8 animate-pulse">
                            <FolderIcon className="w-12 h-12" />
                        </div>
                        <h3 className="text-3xl font-black text-[#1c1917] tracking-tighter uppercase">No Nodes Detected</h3>
                        <p className="text-[#1c1917]/30 text-sm font-bold uppercase tracking-widest mt-3 text-center max-w-sm">You haven't been deployed to any active streams. Awaiting command directives.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
