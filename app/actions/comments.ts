'use server';

import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/session';
import { revalidatePath } from 'next/cache';
import { processMentions } from './notifications';
import { handleActionError, successResponse } from '@/lib/errors';

export async function addComment(taskId: string, content: string, projectPath: string) {
    const user = await getCurrentUser();
    if (!user) return handleActionError({ message: 'Unauthorized', status: 401 });

    const supabase = await createClient();

    // 1. Fetch task details for notification context
    const { data: task } = await supabase
        .from('tasks')
        .select('title')
        .eq('id', taskId)
        .single();

    // 2. Insert comment
    const { data: comment, error } = await supabase
        .from('comments')
        .insert({
            task_id: taskId,
            user_id: user.id,
            content
        })
        .select()
        .single();

    if (error) return handleActionError(error);

    // 3. Process @mentions
    if (task) {
        await processMentions(content, taskId, task.title);
    }

    revalidatePath(projectPath);
    return successResponse(comment);
}

export async function getComments(taskId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('comments')
        .select(`
            *,
            user:users(id, full_name, email)
        `)
        .eq('task_id', taskId)
        .order('created_at', { ascending: true });

    if (error) return handleActionError(error);
    return successResponse(data);
}

export async function deleteComment(commentId: string, projectPath: string) {
    const user = await getCurrentUser();
    if (!user) return handleActionError({ message: 'Unauthorized', status: 401 });

    const supabase = await createClient();

    // 1. Fetch comment to verify ownership
    const { data: comment, error: fetchError } = await supabase
        .from('comments')
        .select('user_id')
        .eq('id', commentId)
        .single();

    if (fetchError || !comment) return handleActionError({ message: 'Comment not found', status: 404 });

    // 2. Check permissions: Author OR Admin OR Associate
    if (comment.user_id !== user.id && user.role !== 'admin' && user.role !== 'associate') {
        return handleActionError({ message: 'Unauthorized to delete this comment', status: 403 });
    }

    // 3. Delete comment using admin client to bypass RLS for Admins/Associates
    const { createAdminClient } = await import('@/lib/supabase/admin');
    const supabaseAdmin = await createAdminClient();

    const { error } = await supabaseAdmin
        .from('comments')
        .delete()
        .eq('id', commentId);

    if (error) return handleActionError(error);

    revalidatePath(projectPath);
    return successResponse({ message: 'Comment deleted' });
}
