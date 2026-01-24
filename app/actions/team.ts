'use server';

import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/session';
import { revalidatePath } from 'next/cache';
import { logAudit } from '@/lib/audit';
import { handleActionError, successResponse } from '@/lib/errors';

export async function updateTaskStatus(taskId: string, status: string) {
  const user = await getCurrentUser();
  if (!user) return handleActionError({ message: 'Unauthorized', status: 401 });

  const supabase = await createClient();

  // 1. Check if the task is assigned to this user (unless admin/associate)
  const { data: task, error: fetchError } = await supabase
    .from('tasks')
    .select('id, assigned_to, project_id, title')
    .eq('id', taskId)
    .single();

  if (fetchError || !task) return handleActionError({ message: 'Task not found', status: 404 });

  if ((user.role as string) === 'team_member' || user.role === 'member') {
    if (task.assigned_to !== user.id) {
      return handleActionError({ message: 'Unauthorized to update this task', status: 403 });
    }
  }

  // 2. Update status
  const { error: updateError } = await supabase
    .from('tasks')
    .update({
      status,
      completed_at: status === 'Completed' ? new Date().toISOString() : null,
      kanban_column: status === 'Completed' ? 'done' :
        status === 'In Progress' ? 'in_progress' :
          status === 'To Do' ? 'todo' : 'backlog'
    })
    .eq('id', taskId);

  if (updateError) return handleActionError(updateError);

  // 3. Log Audit (MANDATORY)
  await logAudit({
    action_type: 'TASK_STATUS_UPDATED',
    resource_type: 'task',
    resource_id: taskId,
    details: {
      status,
      previous_status: (task as any).status,
      role: user.role.toUpperCase(),
      action: 'TASK_STATUS_UPDATED',
      user_name: user.full_name
    }
  });

  revalidatePath('/team/dashboard');
  revalidatePath('/admin/dashboard');
  revalidatePath(`/admin/projects/${task.project_id}`);

  return successResponse();
}

export async function sendChatMessage(projectId: string, content: string, taskId?: string) {
  const user = await getCurrentUser();
  if (!user) return handleActionError({ message: 'Unauthorized', status: 401 });

  const supabase = await createClient();

  const { error } = await supabase
    .from('project_messages')
    .insert({
      project_id: projectId,
      task_id: taskId || null,
      sender_id: user.id,
      content
    });

  if (error) return handleActionError(error);

  revalidatePath(`/team/dashboard`);
  return successResponse();
}
