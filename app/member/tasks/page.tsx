import { format } from 'date-fns';
import {
    ClipboardDocumentListIcon,
    CalendarIcon,
    ArrowPathIcon,
    MagnifyingGlassIcon,
    ChevronRightIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import MemberTasksClient from '@/components/member/MemberTasksClient';

export default async function MemberTasksPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string }>;
}) {
    const { status: filterStatus = 'all' } = await searchParams;
    const user = await getCurrentUser();

    if (!user) {
        redirect('/login');
    }

    const supabase = await createClient();

    let query = supabase
        .from('tasks')
        .select(`
            *,
            project:projects(name, status)
        `)
        .eq('assigned_to', user.id);

    if (filterStatus !== 'all') {
        const dbStatus = filterStatus === 'in_progress' ? 'in_progress' :
            filterStatus === 'completed' ? 'completed' :
                filterStatus === 'not_started' ? 'not_started' : 'all';
        if (dbStatus !== 'all') {
            query = query.eq('status', dbStatus);
        }
    }

    const { data: tasks, error } = await query
        .order('due_date', { ascending: true, nullsFirst: false });

    return (
        <MemberTasksClient initialTasks={tasks || []} />
    );
}
