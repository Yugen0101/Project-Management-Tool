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
// Utility to parse @mentions (both @[id] and raw emails)
export async function processMentions(content: string, taskId: string, taskTitle: string) {
    const user = await getCurrentUser();
    if (!user) return;

    const supabase = await createClient();
    const notifiedIds = new Set<string>();

    // 1. Check for standard @[UUID] format
    const mentionRegex = /@\[([0-9a-fA-F-]+)\]/g;
    let match;
    while ((match = mentionRegex.exec(content)) !== null) {
        if (match[1] && match[1] !== user.id) {
            notifiedIds.add(match[1]);
        }
    }

    // 2. Check for raw email addresses
    // Simple regex for emails: characters@characters.domain
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
    let emailMatch;
    const foundEmails = new Set<string>();

    while ((emailMatch = emailRegex.exec(content)) !== null) {
        foundEmails.add(emailMatch[1].toLowerCase());
    }

    if (foundEmails.size > 0) {
        // Fetch users by email
        const emailsArray = Array.from(foundEmails);
        const { data: usersByEmail } = await supabase
            .from('users')
            .select('id')
            .in('email', emailsArray);

        if (usersByEmail) {
            usersByEmail.forEach(u => {
                if (u.id !== user.id) {
                    notifiedIds.add(u.id);
                }
            });
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
