import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import KanbanBoard from '@/components/kanban/KanbanBoard';
import { RectangleGroupIcon, SignalIcon } from '@heroicons/react/24/outline';

export default async function PublicProjectPage({
    params,
}: {
    params: Promise<{ token: string }>;
}) {
    const { token } = await params;
    const supabase = await createClient();

    // 1. Fetch project by token
    const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('share_token', token)
        .eq('is_public', true)
        .single();

    if (projectError || !project) {
        return notFound();
    }

    // 2. Fetch columns
    const { data: columns } = await supabase
        .from('kanban_columns')
        .select('*')
        .eq('project_id', project.id)
        .order('order_index');

    // 3. Fetch tasks
    const { data: tasks } = await supabase
        .from('tasks')
        .select(`
            *,
            assigned_user:users!tasks_assigned_to_fkey(full_name, email),
            sprint:sprints(name, status)
        `)
        .eq('project_id', project.id);

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            {/* Professional Public Header */}
            <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-border sticky top-0 z-50 flex items-center justify-between px-10">
                <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
                            <RectangleGroupIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-secondary-900 tracking-tight leading-tight">
                                {project.name}
                            </h1>
                            <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest mt-1">
                                Shared Project Board
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="badge badge-info flex items-center gap-2 pr-4 pl-3 py-1.5 h-auto">
                            <SignalIcon className="w-3.5 h-3.5 animate-pulse" />
                            <span>Live Sync Active</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto w-full p-10 overflow-hidden">
                <div className="h-full">
                    <KanbanBoard
                        initialTasks={tasks || []}
                        initialColumns={columns || []}
                        projectId={project.id}
                        role="member"
                        isReadOnly={true}
                    />
                </div>
            </main>

            {/* Ambient Background Elements */}
            <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-100/20 rounded-full blur-[100px] -z-10"></div>
            <div className="fixed bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-indigo-100/10 rounded-full blur-[80px] -z-10"></div>
        </div>
    );
}
