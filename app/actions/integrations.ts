'use server';

import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/session';
import { handleActionError, successResponse } from '@/lib/errors';

export async function sendSlackNotification(projectId: string, message: string) {
    const supabase = await createClient();

    // 1. Fetch project settings for Slack Webhook URL
    // For now, we'll use an environment variable or a projects column
    // Let's assume projects has a slack_webhook column (I'll add it in migration)
    const { data: project } = await supabase
        .from('projects')
        .select('slack_webhook, name')
        .eq('id', projectId)
        .single();

    if (!project?.slack_webhook) return successResponse({ skipped: true });

    try {
        const response = await fetch(project.slack_webhook, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: `*Project Manager Update: ${project.name}*\n${message}`,
            }),
        });

        if (!response.ok) throw new Error('Slack API returned error');

        return successResponse();
    } catch (error) {
        console.error('Slack Integration Error:', error);
        return handleActionError({ message: 'Failed to send Slack notification', status: 500 });
    }
}

export async function updateProjectIntegrations(projectId: string, data: { slack_webhook?: string }) {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') return handleActionError({ message: 'Unauthorized', status: 401 });

    const supabase = await createClient();
    const { error } = await supabase
        .from('projects')
        .update(data)
        .eq('id', projectId);

    if (error) return handleActionError(error);
    return successResponse();
}
