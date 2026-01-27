import { getCurrentUser } from '@/lib/auth/session';
import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';
import AssociateAnalyticsClient from '@/components/associate/AssociateAnalyticsClient';

export default async function AssociateReportsPage() {
    const user = await getCurrentUser();

    if (!user || user.role !== 'associate') {
        redirect('/login');
    }

    const supabase = await createClient();

    // 1. Fetch project IDs and projects
    const { data: userProjects } = await supabase
        .from('user_projects')
        .select(`
            project_id,
            project:projects(
                id,
                name,
                tasks:tasks(id, status, assigned_to, users:users(full_name))
            )
        `)
        .eq('user_id', user.id);

    const projects = userProjects?.map(up => up.project).filter(Boolean) || [];

    // 2. Aggregate Data
    const nodeHealth = projects.map((p: any) => {
        const total = p.tasks?.length || 0;
        const completed = p.tasks?.filter((t: any) => t.status === 'completed').length || 0;
        return {
            name: p.name,
            health: total > 0 ? Math.round((completed / total) * 100) : 0
        };
    });

    const allTasks = projects.flatMap((p: any) => p.tasks || []);
    const activeTasks = allTasks.filter((t: any) => t.status !== 'completed').length;
    const completedTasks = allTasks.filter((t: any) => t.status === 'completed').length;

    // Team workload distribution
    const workloadMap: Record<string, number> = {};
    allTasks.forEach((t: any) => {
        if (t.status !== 'completed' && t.users?.full_name) {
            workloadMap[t.users.full_name] = (workloadMap[t.users.full_name] || 0) + 1;
        }
    });

    const workload = Object.entries(workloadMap).map(([name, tasks]) => ({ name, tasks }));
    const teamCount = new Set(allTasks.map((t: any) => t.assigned_to).filter(Boolean)).size;

    const data = {
        totalProjects: projects.length,
        activeTasks,
        completedTasks,
        teamCount,
        nodeHealth,
        workload
    };

    return (
        <AssociateAnalyticsClient data={data} />
    );
}
