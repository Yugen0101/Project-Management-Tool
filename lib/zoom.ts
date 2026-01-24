/**
 * Zoom API Service (Server-side only)
 * Handles Server-to-Server OAuth and Meeting Creation
 */

interface ZoomTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    scope: string;
}

interface ZoomMeetingOptions {
    topic: string;
    agenda?: string;
    start_time: string; // ISO 8601
    duration: number;   // Minutes
    timezone?: string;
}

export async function getZoomAccessToken(): Promise<string | null> {
    const accountId = process.env.ZOOM_ACCOUNT_ID;
    const clientId = process.env.ZOOM_CLIENT_ID;
    const clientSecret = process.env.ZOOM_CLIENT_SECRET;

    if (!accountId || !clientId || !clientSecret) {
        console.warn('Zoom API credentials not found. Using Sandbox fallbacks.');
        return null;
    }

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const response = await fetch('https://zoom.us/oauth/token', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'account_credentials',
            account_id: accountId,
        }).toString(),
    });

    if (!response.ok) {
        const error = await response.json();
        console.error('Zoom Auth Error:', error);
        throw new Error(`Zoom Authentication Failed: ${error.reason || error.message || JSON.stringify(error)}`);
    }

    const data: ZoomTokenResponse = await response.json();
    return data.access_token;
}

export async function createZoomMeeting(options: ZoomMeetingOptions) {
    const token = await getZoomAccessToken();

    if (!token) {
        // Fallback to Sandbox Mode
        const sandboxId = Math.floor(Math.random() * 10000000000);
        return {
            id: sandboxId,
            topic: options.topic,
            agenda: options.agenda,
            start_time: options.start_time,
            duration: options.duration,
            join_url: `https://taskforge.io/meeting/sandbox?id=${sandboxId}`,
            start_url: `https://taskforge.io/meeting/sandbox-host?id=${sandboxId}`,
            is_sandbox: true
        };
    }

    const response = await fetch('https://api.zoom.us/v2/users/me/meetings', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            topic: options.topic,
            agenda: options.agenda || '',
            start_time: options.start_time,
            duration: options.duration,
            type: 2, // Scheduled meeting
            settings: {
                host_video: true,
                participant_video: true,
                join_before_host: false,
                mute_upon_entry: true,
                waiting_room: true,
                meeting_authentication: false,
            },
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        console.error('Zoom Create Meeting Error:', error);
        throw new Error(error.message || 'Failed to create Zoom meeting.');
    }

    return await response.json();
}

export async function cancelZoomMeeting(meetingId: string) {
    const token = await getZoomAccessToken();

    if (!token) return true; // No-op in sandbox

    const response = await fetch(`https://api.zoom.us/v2/meetings/${meetingId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok && response.status !== 404) {
        const error = await response.json();
        console.error('Zoom Cancel Meeting Error:', error);
        throw new Error(error.message || 'Failed to cancel Zoom meeting.');
    }

    return true;
}
