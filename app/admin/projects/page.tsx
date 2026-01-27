import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { getProjectsByTab } from '@/app/actions/projects';
import ProjectsRegistryClient from '@/components/admin/ProjectsRegistryClient';

export default async function AdminProjectsPage({
    searchParams,
}: {
    searchParams: Promise<{ tab?: string }>;
}) {
    const { tab = 'active' } = await searchParams;

    // Check user and role
    const user = await getCurrentUser();

    if (!user || user.role !== 'admin') {
        redirect('/login');
    }

    // Fetch initial data
    const projectsResult = await getProjectsByTab(tab);
    const projects = projectsResult.success ? (projectsResult.data || []) : [];

    return (
        <ProjectsRegistryClient
            initialProjects={projects as any[]}
            templates={[]}
            userRole="admin"
            initialTab={tab}
        />
    );
}
