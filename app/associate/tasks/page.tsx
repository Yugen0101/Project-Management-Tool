import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import AssociateTasksClient from '@/components/associate/AssociateTasksClient';

export default async function AssociateTasksPage() {
    const user = await getCurrentUser();

    if (!user || user.role !== 'associate') {
        redirect('/login');
    }

    const supabase = await createClient();

    // 1. Fetch projects where the associate is a member to get the project IDs
    const { data: userProjects } = await supabase
        .from('user_projects')
        .select('project_id')
        .eq('user_id', user.id);

    const projectIds = userProjects?.map((up: any) => up.project_id) || [];

    // 2. Fetch ALL tasks for these projects (monitoring view)
    const { data: tasks } = await supabase
        .from('tasks')
        .select(`
            *,
            project:projects(name),
            assigned_user:users!tasks_assigned_to_fkey(full_name)
        `)
        .in('project_id', projectIds)
        .order('created_at', { ascending: false });

    return (
        <AssociateTasksClient initialTasks={(tasks as any) || []} />
    );
}
