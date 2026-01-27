'use server';

import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/session';
import { handleActionError, successResponse } from '@/lib/errors';

export async function globalSearch(query: string) {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        return handleActionError({ message: 'Unauthorized', status: 401 });
    }

    if (!query || query.length < 2) {
        return successResponse({ projects: [], users: [] });
    }

    const supabase = await createClient();
    const searchPattern = `%${query}%`;

    // 1. Search Projects
    // For members/associates, only show projects they are assigned to
    let projectQuery = supabase
        .from('projects')
        .select('id, name, status, priority')
        .ilike('name', searchPattern)
        .limit(5);

    if (currentUser.role !== 'admin') {
        // Get project IDs user is assigned to
        const { data: userProjects } = await supabase
            .from('user_projects')
            .select('project_id')
            .eq('user_id', currentUser.id);

        const projectIds = userProjects?.map(up => up.project_id) || [];
        projectQuery = projectQuery.in('id', projectIds);
    }

    const { data: projects, error: projectError } = await projectQuery;

    // 2. Search Users (Personnel)
    const { data: users, error: userError } = await supabase
        .from('users')
        .select('id, full_name, role, email')
        .ilike('full_name', searchPattern)
        .eq('is_active', true)
        .limit(5);

    if (projectError || userError) {
        return handleActionError(projectError || userError);
    }

    return successResponse({
        projects: projects || [],
        users: users || []
    });
}
