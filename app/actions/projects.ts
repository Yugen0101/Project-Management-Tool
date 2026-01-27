'use server';

import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/session';
import { revalidatePath } from 'next/cache';
import { logAudit } from '@/lib/audit';
import { handleActionError, successResponse } from '@/lib/errors';
import { sendSlackNotification } from './integrations';

export async function createProject(projectData: {
    name: string;
    description?: string;
    start_date?: string;
    end_date: string;
    priority?: string;
    associateId?: string;
    memberIds?: string[];
    is_template?: boolean;
    is_public?: boolean;
    category?: string;
    is_strict?: boolean;
    business_hours?: string;
    task_layout?: string;
    tags?: string[];
    roll_up_enabled?: boolean;
    tabs_config?: string[];
}) {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== 'admin') {
        return handleActionError({ message: 'Unauthorized', status: 401 });
    }

    const {
        name,
        description,
        start_date = new Date().toISOString(),
        end_date,
        priority = 'medium',
        associateId,
        memberIds = [],
        is_template = false,
        is_public = false,
        category,
        is_strict = false,
        business_hours = 'standard',
        task_layout = 'standard',
        tags = [],
        roll_up_enabled = false,
        tabs_config
    } = projectData;

    if (!name || !end_date) {
        return handleActionError({ message: 'Required fields missing', status: 400 });
    }

    const supabase = await createClient();

    const { data, error } = await supabase
        .from('projects')
        .insert({
            name,
            description,
            start_date,
            end_date,
            priority,
            status: 'active',
            created_by: currentUser.id,
            is_template,
            is_public,
            category,
            is_strict,
            business_hours,
            task_layout,
            tags,
            roll_up_enabled,
            tabs_config
        })
        .select()
        .single();

    if (error) return handleActionError(error);

    // Create user_projects entries
    const userProjects = [];

    if (associateId) {
        userProjects.push({
            project_id: data.id,
            user_id: associateId,
            role: 'associate'
        });
    }

    memberIds.forEach(memberId => {
        userProjects.push({
            project_id: data.id,
            user_id: memberId,
            role: 'member'
        });
    });

    if (userProjects.length > 0) {
        const { error: assignError } = await supabase
            .from('user_projects')
            .insert(userProjects);

        if (assignError) {
            console.error('Error assigning users to project:', assignError);
            // We could delete the project here if we wanted atomicity, but let's just log for now
        }
    }

    await logAudit({
        action_type: 'PROJECT_CREATED',
        resource_type: 'project',
        resource_id: data.id,
        details: { name: data.name, assignments_count: userProjects.length }
    });

    revalidatePath('/admin/projects');
    return successResponse(data);
}

export async function createProjectFromTemplate(templateId: string) {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
        return handleActionError({ message: 'Unauthorized', status: 401 });
    }

    const supabase = await createClient();

    // Fetch template details
    const { data: template, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', templateId)
        .single();

    if (fetchError || !template) {
        return handleActionError({ message: 'Template not found', status: 404 });
    }

    // Clone into new project
    const { data, error } = await supabase
        .from('projects')
        .insert({
            name: `${template.name} (Copy)`,
            description: template.description,
            start_date: new Date().toISOString(),
            end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from now
            priority: template.priority,
            status: 'active',
            created_by: currentUser.id,
            category: template.category,
            is_template: false
        })
        .select()
        .single();

    if (error) return handleActionError(error);

    await logAudit({
        action_type: 'PROJECT_CREATED_FROM_TEMPLATE',
        resource_type: 'project',
        resource_id: data.id,
        details: { template_name: template.name, new_name: data.name }
    });

    revalidatePath('/admin/projects');
    return successResponse(data);
}

export async function updateProject(projectId: string, data: any) {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== 'admin') {
        return handleActionError({ message: 'Unauthorized', status: 401 });
    }

    const supabase = await createClient();

    const { error } = await supabase
        .from('projects')
        .update(data)
        .eq('id', projectId);

    if (error) return handleActionError(error);

    revalidatePath('/admin/projects');
    return successResponse();
}

export async function assignUserToProject(projectId: string, userId: string, role: string) {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== 'admin') {
        return handleActionError({ message: 'Unauthorized', status: 401 });
    }

    const supabase = await createClient();

    const { error } = await supabase
        .from('user_projects')
        .insert({
            project_id: projectId,
            user_id: userId,
            role,
        });

    if (error) return handleActionError(error);

    revalidatePath('/admin/projects');
    return successResponse();
}

export async function removeUserFromProject(projectId: string, userId: string) {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== 'admin') {
        return handleActionError({ message: 'Unauthorized', status: 401 });
    }

    const supabase = await createClient();

    const { error } = await supabase
        .from('user_projects')
        .delete()
        .eq('project_id', projectId)
        .eq('user_id', userId);

    if (error) return handleActionError(error);

    revalidatePath('/admin/projects');
    return successResponse();
}

export async function archiveProject(projectId: string) {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== 'admin') {
        return handleActionError({ message: 'Unauthorized', status: 401 });
    }

    const supabase = await createClient();

    const { error } = await supabase
        .from('projects')
        .update({ status: 'archived' })
        .eq('id', projectId);

    if (error) return handleActionError(error);

    await logAudit({
        action_type: 'PROJECT_ARCHIVED',
        resource_type: 'project',
        resource_id: projectId
    });

    revalidatePath('/admin/projects');
    revalidatePath(`/admin/projects/${projectId}`);

    // Notify via Slack
    await sendSlackNotification(projectId, '⚠️ This project has been *archived* by an administrator.');

    return successResponse();
}


export async function getProjectsByTab(tab: string) {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
        return handleActionError({ message: 'Unauthorized', status: 401 });
    }

    const supabase = await createClient();
    let query = supabase
        .from('projects')
        .select(`
            *,
            tasks:tasks(id),
            user_projects:user_projects(id),
            sprints:sprints(id)
        `);

    if (tab === 'active') {
        query = query.eq('status', 'active').eq('is_template', false);
    } else if (tab === 'completed') {
        query = query.eq('status', 'completed').eq('is_template', false);
    } else if (tab === 'archived') {
        query = query.eq('status', 'archived').eq('is_template', false);
    } else if (tab === 'public') {
        query = query.eq('is_public', true).eq('is_template', false);
    } else if (tab === 'templates') {
        query = query.eq('is_template', true);
    } else if (tab === 'groups') {
        // For now just show all active non-templates, grouping logic can be added later
        query = query.eq('is_template', false);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) return handleActionError(error);
    return successResponse(data);
}

export async function getProjectTemplates(category?: string) {
    const currentUser = await getCurrentUser();
    if (!currentUser) return handleActionError({ message: 'Unauthorized', status: 401 });

    const supabase = await createClient();
    let query = supabase
        .from('projects')
        .select(`
            *,
            tasks:tasks(id),
            sprints:sprints(id)
        `)
        .eq('is_template', true);

    if (category && category !== 'All') {
        query = query.eq('category', category);
    }

    const { data, error } = await query.order('name', { ascending: true });

    if (error) return handleActionError(error);
    return successResponse(data);
}

export async function deleteProject(projectId: string) {
    const currentUser = await getCurrentUser();
    // ... rest of the file

    if (!currentUser || currentUser.role !== 'admin') {
        return handleActionError({ message: 'Unauthorized', status: 401 });
    }

    const supabase = await createClient();

    // Perform hard delete
    const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

    if (error) return handleActionError(error);

    await logAudit({
        action_type: 'PROJECT_DELETED_HARD',
        resource_type: 'project',
        resource_id: projectId
    });

    revalidatePath('/admin/projects');
    return successResponse();
}

export async function exportProjectData(projectId: string) {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
        return handleActionError({ message: 'Unauthorized', status: 401 });
    }

    const supabase = await createClient();
    const { data: project } = await supabase
        .from('projects')
        .select(`*, tasks(*), sprints(*)`)
        .eq('id', projectId)
        .single();

    if (!project) return handleActionError({ message: 'Project not found', status: 404 });

    await logAudit({
        action_type: 'PROJECT_DATA_EXPORTED',
        resource_type: 'project',
        resource_id: projectId
    });

    // Simple CSV conversion
    const headers = ['Type', 'Title/Name', 'Status', 'Priority', 'Start Date', 'End Date'];
    const rows = [
        ['PROJECT', project.name, project.status, project.priority, project.start_date, project.end_date]
    ];

    project.sprints?.forEach((s: any) => {
        rows.push(['SPRINT', s.name, s.status, '', s.start_date, s.end_date]);
    });

    project.tasks?.forEach((t: any) => {
        rows.push(['TASK', t.title, t.status, t.priority, '', t.deadline || '']);
    });

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    return successResponse({
        csv: csvContent,
        fileName: `${project.name.replace(/\s+/g, '_')}_export.csv`
    });
}
