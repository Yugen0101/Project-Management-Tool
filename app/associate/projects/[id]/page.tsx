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
        <div className="space-y-8">
            {/* Header / Breadcrumbs */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link 
                        href="/associate/dashboard"
                        className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors"
                    >
                        <ChevronLeftIcon className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900">{project.name}</h1>
                        <p className="text-slate-500 font-medium">Associate Project Control</p>
                    </div>
                </div>
                <Link 
                    href={`/associate/projects/${id}/kanban`}
                    className="btn-primary py-2.5 px-6 flex items-center gap-2"
                >
                    <ClipboardDocumentListIcon className="w-5 h-5" />
                    Open Kanban Board
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Meetings Integration */}
                    <div className="card p-6">
                        <ProjectMeetings 
                            projectId={id}
                            members={project.user_projects || []}
                            currentUser={user}
                        />
                    </div>

                    {/* Quick Stats or Tasks summary could go here later */}
                    <div className="card p-8 bg-slate-50 border-dashed border-2 flex flex-col items-center justify-center text-center">
                        <CalendarIcon className="w-12 h-12 text-slate-300 mb-3" />
                        <h3 className="text-lg font-bold text-slate-900">Project Overview</h3>
                        <p className="text-slate-500 max-w-xs mt-2">
                            Manage your project milestones, sprints, and upcoming syncs from this dashboard.
                        </p>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="card p-6">
                        <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <UsersIcon className="w-4 h-4" />
                            Project Team
                        </h4>
                        <div className="space-y-3">
                            {project.user_projects.map((up: any) => (
                                <div key={up.user.id} className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-xs">
                                        {up.user.full_name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-900 truncate">{up.user.full_name}</p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase">{up.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card p-6 bg-primary-900 text-white border-0">
                        <VideoCameraIcon className="w-10 h-10 text-primary-400 mb-4" />
                        <h4 className="font-bold text-lg mb-2">Native Zoom Sync</h4>
                        <p className="text-primary-100 text-sm leading-relaxed mb-4">
                            Schedule meetings directly. Participants will be notified automatically in-app.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
