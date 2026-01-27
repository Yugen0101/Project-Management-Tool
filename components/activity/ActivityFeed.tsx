'use client';

import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
    PlusIcon,
    UserPlusIcon,
    ArrowPathIcon,
    CheckCircleIcon,
    ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';
import { createClient } from '@/lib/supabase/client';

const actionIcons = {
    'created': <PlusIcon className="w-3.5 h-3.5" />,
    'assigned': <UserPlusIcon className="w-3.5 h-3.5" />,
    'status_changed': <ArrowPathIcon className="w-3.5 h-3.5" />,
    'completed': <CheckCircleIcon className="w-3.5 h-3.5" />,
    'updated': <ArrowPathIcon className="w-3.5 h-3.5" />,
    'comment': <ChatBubbleLeftIcon className="w-3.5 h-3.5" />
};

const actionColors = {
    'created': 'bg-[#f7f3ed] text-[#d97757] border-[#e5dec9]',
    'assigned': 'bg-[#f7f3ed] text-[#1c1917]/60 border-[#e5dec9]',
    'status_changed': 'bg-[#f7f3ed] text-[#d97757] border-[#e5dec9]',
    'completed': 'bg-[#d97757] text-white border-[#d97757]',
    'updated': 'bg-[#f7f3ed] text-[#1c1917]/40 border-[#e5dec9]',
    'comment': 'bg-[#f7f3ed] text-[#1c1917]/60 border-[#e5dec9]'
};

export default function ActivityFeed({
    activities: initialActivities,
    projectId,
    taskId
}: {
    activities?: any[],
    projectId?: string,
    taskId?: string
}) {
    const [activities, setActivities] = useState<any[]>(initialActivities || []);
    const [loading, setLoading] = useState(!initialActivities);

    useEffect(() => {
        if (initialActivities) return;

        async function loadActivity() {
            const supabase = createClient();
            let query = supabase
                .from('activity_logs')
                .select('*, user:users(full_name)')
                .order('created_at', { ascending: false })
                .limit(20);

            if (projectId) query = query.eq('project_id', projectId);
            if (taskId) query = query.eq('task_id', taskId);

            const { data } = await query;
            if (data) setActivities(data);
            setLoading(false);
        }

        loadActivity();
    }, [initialActivities, projectId, taskId]);

    if (loading) {
        return (
            <div className="space-y-4 animate-pulse">
                {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-4">
                        <div className="w-10 h-10 bg-[#f7f3ed] rounded-xl"></div>
                        <div className="flex-1 space-y-3 px-2">
                            <div className="h-4 bg-[#f7f3ed] rounded w-3/4"></div>
                            <div className="h-3 bg-[#f7f3ed] rounded w-1/4"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!activities || activities.length === 0) {
        return (
            <div className="py-20 text-center border-2 border-dashed border-[#e5dec9] rounded-[2.5rem]">
                <p className="text-[10px] font-medium uppercase text-[#78716c] tracking-[0.3em] font-serif italic">No operational logs recorded</p>
            </div>
        );
    }

    return (
        <div className="flow-root px-2">
            <ul role="list" className="-mb-10">
                {activities.map((item, idx) => (
                    <li key={item.id}>
                        <div className="relative pb-10">
                            {idx !== activities.length - 1 && (
                                <span className="absolute left-5 top-5 -ml-px h-full w-px bg-[#e5dec9]" aria-hidden="true" />
                            )}
                            <div className="relative flex space-x-5">
                                <div className="z-10">
                                    <span className={`h-10 w-10 rounded-xl flex items-center justify-center border shadow-sm transition-all group-hover:shadow-md ${actionColors[item.action_type as keyof typeof actionColors] || 'bg-[#f7f3ed] text-[#1c1917]/20 border-[#e5dec9]'}`}>
                                        {actionIcons[item.action_type as keyof typeof actionIcons] || <ArrowPathIcon className="w-4 h-4" />}
                                    </span>
                                </div>
                                <div className="flex min-w-0 flex-1 justify-between space-x-6 pt-2">
                                    <div>
                                        <p className="text-sm text-[#1c1917]/60 leading-tight">
                                            <span className="font-semibold text-[#1c1917] uppercase tracking-tight">{item.user?.full_name || 'System'}</span>
                                            <span className="italic font-serif ml-1">
                                                {item.action_type === 'status_changed' ? `moved unit to ${item.new_value}` :
                                                    item.action_type === 'assigned' ? `reallocated asset to unit` :
                                                        item.action_type === 'created' ? `initialised the node` :
                                                            item.action_type === 'completed' ? `finalized the objective` :
                                                                'updated node parameters'}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="whitespace-nowrap text-right text-[9px] font-medium uppercase tracking-[0.2em] text-[#78716c]">
                                        <time dateTime={item.created_at}>
                                            {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                                        </time>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
