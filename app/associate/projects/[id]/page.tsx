import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import {
    ChevronLeftIcon,
    CalendarIcon,
    UsersIcon,
    ClipboardDocumentListIcon,
    VideoCameraIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import ProjectMeetings from '@/components/meetings/ProjectMeetings';

export default async function AssociateProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const user = await getCurrentUser();

    if (!user || user.role !== 'associate') {
        return notFound();
    }

    const supabase = await createClient();

    // Fetch project and ensure association
    const { data: project, error: projectError } = await supabase
        .from('projects')
        .select(`
            *,
            user_projects!inner(role, user:users(*))
        `)
        .eq('id', id)
        .eq('user_projects.user_id', user.id)
        .single();

    if (projectError || !project) {
        return notFound();
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-1000">
            {/* Header / Breadcrumbs */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-3">
                        <span className="w-8 h-1 bg-accent-500 rounded-full shadow-[0_0_10px_rgba(217,119,87,0.4)]"></span>
                        <h2 className="text-[10px] font-black text-accent-500 uppercase tracking-[0.4em]">MISSION LOG</h2>
                    </div>
                    <h1 className="text-6xl font-black text-[#1c1917] tracking-tighter uppercase leading-none">
                        Focus <span className="text-accent-500">Protocol</span> Active
                    </h1>
                    <div className="flex items-center gap-4 text-[#1c1917]/40">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{project.name}</span>
                        <span className="w-1.5 h-1.5 bg-[#e5dec9] rounded-full"></span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Operational Stream Deployed</span>
                    </div>
                </div>
                <Link
                    href={`/associate/projects/${id}/kanban`}
                    className="btn-primary !py-4 !px-8 flex items-center gap-2 shadow-xl shadow-accent-500/20"
                >
                    <ClipboardDocumentListIcon className="w-5 h-5" />
                    Execution Board
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-12">
                    {/* Meetings Integration */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <span className="w-8 h-px bg-[#d97757]"></span>
                            <h3 className="text-xl font-black text-[#1c1917] tracking-tight uppercase">Strategic Syncs</h3>
                        </div>
                        <div className="card bg-white border-[#e5dec9] p-2 overflow-hidden shadow-sm shadow-[#d9cfb0]/10">
                            <ProjectMeetings
                                projectId={id}
                                members={project.user_projects || []}
                                currentUser={user}
                            />
                        </div>
                    </div>

                    <div className="card bg-white border-[#e5dec9] p-12 flex flex-col items-center justify-center text-center space-y-4 rounded-[3rem] shadow-sm shadow-[#d9cfb0]/10">
                        <div className="w-20 h-20 bg-[#f7f3ed] rounded-[2rem] flex items-center justify-center text-[#1c1917]/10 mb-2">
                            <CalendarIcon className="w-10 h-10" />
                        </div>
                        <h3 className="text-3xl font-black text-[#1c1917] tracking-tighter uppercase leading-none">Stream Infrastructure</h3>
                        <p className="text-[#1c1917]/40 text-sm font-bold uppercase tracking-widest mt-2 max-w-sm">
                            Architectural roadmap for milestones, sprints, and upcoming synchronization events.
                        </p>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-12">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <span className="w-8 h-px bg-[#d97757]"></span>
                            <h3 className="text-xl font-black text-[#1c1917] tracking-tight uppercase">Deployed Personnel</h3>
                        </div>
                        <div className="card bg-white border-[#e5dec9] p-8 rounded-[2rem] shadow-sm shadow-[#d9cfb0]/10">
                            <div className="space-y-6">
                                {project.user_projects.map((up: any) => (
                                    <div key={up.user.id} className="flex items-center gap-4 group">
                                        <div className="w-10 h-10 rounded-xl bg-accent-500 text-white flex items-center justify-center font-black text-xs shadow-lg shadow-accent-500/20 transition-transform group-hover:scale-110">
                                            {up.user.full_name.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-black text-[#1c1917] truncate uppercase tracking-tight">{up.user.full_name}</p>
                                            <p className="text-[9px] font-black text-accent-500 uppercase tracking-[0.2em]">{up.role === 'associate' ? 'Operations Lead' : 'Contributor'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card p-8 bg-[#1c1917] text-white border-0 rounded-[2rem] shadow-2xl shadow-[#1c1917]/20 relative overflow-hidden group">
                            <div className="relative z-10">
                                <VideoCameraIcon className="w-10 h-10 text-accent-500 mb-6 transition-transform group-hover:scale-110" />
                                <h4 className="text-2xl font-black tracking-tight uppercase mb-2">Strategic Sync</h4>
                                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                                    Direct video communications interface deployed for this stream.
                                </p>
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-500/10 blur-3xl -z-0"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
