import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import ProjectsRegistryClient from '@/components/admin/ProjectsRegistryClient';

export default async function MemberProjectsPage({ searchParams }: {
    searchParams: Promise<{ tab?: string }>
}) {
    const user = await getCurrentUser();
    if (!user) redirect('/login');

    const { tab = 'active' } = await searchParams;
    const supabase = await createClient();

    // Fetch projects where the user is a member
    const { data: userProjects } = await supabase
        .from('user_projects')
        .select(`
            project:projects(
                *,
                tasks:tasks(id),
                sprints:sprints(id),
                user_projects:user_projects(id)
            )
        `)
        .eq('user_id', user.id);

    const projects = userProjects?.map((up: any) => up.project).filter(Boolean) || [];

    return (
        <ProjectsRegistryClient
            initialProjects={projects}
            templates={[]}
            userRole="member"
            initialTab={tab}
        />
    );
}
