'use server';

import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/session';
import { revalidatePath } from 'next/cache';
import { handleActionError, successResponse } from '@/lib/errors';

export async function getNotifications() {
    const user = await getCurrentUser();
    if (!user) return handleActionError({ message: 'Unauthorized', status: 401 });

    const supabase = await createClient();
    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) return handleActionError(error);
    return successResponse(data);
}

export async function markAsRead(notificationId: string) {
    const user = await getCurrentUser();
    if (!user) return handleActionError({ message: 'Unauthorized', status: 401 });

    const supabase = await createClient();
    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', user.id);

    if (error) return handleActionError(error);

    revalidatePath('/', 'layout');
    return successResponse();
}

export async function clearAllNotifications() {
    const user = await getCurrentUser();
    if (!user) return handleActionError({ message: 'Unauthorized', status: 401 });

    const supabase = await createClient();
    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id);

    if (error) return handleActionError(error);

    revalidatePath('/', 'layout');
    return successResponse();
}

/**
 * Utility to parse @mentions in a comment and create notifications
 */
export async function processMentions(content: string, taskId: string, taskTitle: string) {
    const user = await getCurrentUser();
    if (!user) return;

    const supabase = await createClient();
    const mentionRegex = /@\[([0-9a-fA-F-]+)\]/g;
    let match;
    const notifiedIds = new Set<string>();

    while ((match = mentionRegex.exec(content)) !== null) {
        const mentionedUserId = match[1];
        if (mentionedUserId && mentionedUserId !== user.id) {
            notifiedIds.add(mentionedUserId);
        }
    }

    if (notifiedIds.size > 0) {
        const notifications = Array.from(notifiedIds).map(userId => ({
            user_id: userId,
            title: 'You were mentioned',
            content: `${user.full_name} mentioned you in task: ${taskTitle}`,
            type: 'mention',
            link: `/member/tasks/${taskId}`
        }));

        await supabase.from('notifications').insert(notifications);
    }
}
