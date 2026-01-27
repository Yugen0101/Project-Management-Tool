import { getCurrentUser } from '@/lib/auth/session';
import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';
import AssociateSprintsClient from '@/components/associate/AssociateSprintsClient';

export default async function AssociateSprintsPage() {
    const user = await getCurrentUser();

    if (!user || user.role !== 'associate') {
        redirect('/login');
    }

    const supabase = await createClient();

    // 1. Fetch project IDs where the associate is assigned
    const { data: userProjects } = await supabase
        .from('user_projects')
        .select('project_id')
        .eq('user_id', user.id);

    const projectIds = userProjects?.map(up => up.project_id) || [];

    // 2. Fetch sprints for these projects
    const { data: sprintsData } = await supabase
        .from('sprints')
        .select(`
            *,
            project:projects(name),
            tasks:tasks(id, status)
        `)
        .in('project_id', projectIds)
        .order('start_date', { ascending: false });

    // Transform data for the client component
    const sprints = (sprintsData || []).map(sprint => ({
        ...sprint,
        tasks_count: sprint.tasks?.length || 0,
        completed_tasks_count: sprint.tasks?.filter((t: any) => t.status === 'completed').length || 0
    }));

    return (
        <AssociateSprintsClient initialSprints={sprints as any} />
    );
}
