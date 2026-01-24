import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import {
    BriefcaseIcon,
    CalendarIcon,
    ChevronRightIcon,
    FolderIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { format } from 'date-fns';

export default async function MemberProjectsPage() {
    const user = await getCurrentUser();
    if (!user) redirect('/login');

    const supabase = await createClient();

    // Fetch projects where the user is a member
    const { data: userProjects, error } = await supabase
        .from('user_projects')
        .select(`
            role,
            project:projects (
                id,
                name,
                description,
                status,
                priority,
                end_date
            )
        `)
        .eq('user_id', user.id);

    return (
        <div className="space-y-12 animate-in fade-in duration-1000">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-accent-500 mb-2">
                        <FolderIcon className="w-5 h-5 shadow-sm" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Project Registry</span>
                    </div>
                    <h1 className="text-5xl font-black text-[#1c1917] tracking-tighter uppercase leading-none">
                        Active <span className="text-accent-500">Nodes</span>
                    </h1>
                    <p className="text-[#1c1917]/50 font-medium text-lg italic font-serif">You are currently collaborating on {userProjects?.length || 0} active operational streams.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {userProjects?.map(({ project, role }: any) => (
                    <div key={project.id} className="card !p-0 bg-white border-[#e5dec9] shadow-lg shadow-[#d9cfb0]/20 group transition-all duration-500 flex flex-col hover:border-accent-200">
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <span className={`badge shrink-0 text-[9px] font-black uppercase tracking-widest py-1 px-3 ${project.status === 'active' ? 'bg-[#7c9473]/10 text-[#7c9473] border-[#7c9473]/20' : 'bg-[#7a8fa3]/10 text-[#7a8fa3] border-[#7a8fa3]/20'}`}>
                                    {project.status}
                                </span>
                                <span className="text-[9px] font-black text-accent-500 uppercase tracking-widest bg-[#f7f3ed] px-3 py-1 rounded-xl border border-[#e5dec9]">
                                    {role === 'associate' ? 'Operations Lead' : 'Collaborator'}
                                </span>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-2xl font-black text-[#1c1917] tracking-tight group-hover:text-accent-500 transition-colors uppercase leading-[0.9]">
                                    {project.name}
                                </h3>
                                <p className="text-[#1c1917]/40 text-sm font-medium leading-relaxed italic h-10 line-clamp-2">
                                    {project.description || 'Architectural roadmap for the specified operational stream.'}
                                </p>

                                <div className="pt-8 border-t border-[#e5dec9] flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-[10px] font-black text-[#1c1917]/30">
                                        <CalendarIcon className="w-4 h-4 text-accent-500" />
                                        <span className="uppercase tracking-[0.2em]">{format(new Date(project.end_date), 'MM.dd.yyyy')}</span>
                                    </div>
                                    <Link
                                        href={`/member/projects/${project.id}`}
                                        className="w-10 h-10 bg-[#1c1917] rounded-xl flex items-center justify-center text-white hover:text-accent-500 transition-all shadow-lg shadow-[#1c1917]/10"
                                    >
                                        <ChevronRightIcon className="w-5 h-5" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {(!userProjects || userProjects.length === 0) && (
                    <div className="col-span-full py-32 flex flex-col items-center justify-center card bg-white border-dashed border-2 border-[#e5dec9] rounded-[3rem]">
                        <div className="w-24 h-24 bg-[#f7f3ed] rounded-[2rem] flex items-center justify-center text-[#1c1917]/10 mb-8 animate-pulse">
                            <FolderIcon className="w-12 h-12" />
                        </div>
                        <h3 className="text-3xl font-black text-[#1c1917] tracking-tighter uppercase">No Nodes Detected</h3>
                        <p className="text-[#1c1917]/30 text-sm font-bold uppercase tracking-widest mt-3 text-center max-w-sm">No active operational streams detected in your current registry.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
