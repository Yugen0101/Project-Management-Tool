'use client';

import { useEffect, useState } from 'react';
import { getTeamWorkload } from '@/app/actions/analytics';
import { UserGroupIcon, ShieldExclamationIcon } from '@heroicons/react/24/outline';

export default function TeamWorkload({ projectId }: { projectId: string }) {
    const [teamData, setTeamData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            const res = await getTeamWorkload(projectId);
            if (res.success) setTeamData(res.data);
            setLoading(false);
        }
        loadData();
    }, [projectId]);

    if (loading) return <div className="h-32 flex items-center justify-center text-secondary-600 font-semibold animate-pulse">Calculating Team Load...</div>;

    const statusColors = {
        'Optimal': 'bg-[#7c9473]',
        'High Load': 'bg-[#d97757]',
        'Overloaded': 'bg-[#c85a54]'
    };

    const statusTextColors = {
        'Optimal': 'text-[#7c9473]',
        'High Load': 'text-[#d97757]',
        'Overloaded': 'text-[#c85a54]'
    };

    return (
        <div className="card p-8 bg-white border-[#e5dec9]">
            <div className="flex items-center justify-between mb-8">
                <h4 className="font-semibold">
                    <UserGroupIcon className="w-6 h-6 text-accent-500" />
                    Team Workload
                </h4>
                <span className="text-[10px] font-semibold uppercase text-[#1c1917]/70 tracking-[0.2em]">Current Status</span>
            </div>

            <div className="space-y-6">
                {teamData.map((member) => (
                    <div key={member.user_id} className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-semibold text-[#1c1917]">{member.full_name}</span>
                                {member.workload_status !== 'Optimal' && (
                                    <span className={`flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-tight px-2 py-1 rounded-full ${statusTextColors[member.workload_status as keyof typeof statusTextColors]} bg-current/10`}>
                                        <ShieldExclamationIcon className="w-3.5 h-3.5" />
                                        {member.workload_status}
                                    </span>
                                )}
                            </div>
                            <span className="text-xs font-semibold text-[#1c1917]/75 uppercase tracking-wider">{member.active_tasks} Active</span>
                        </div>

                        <div className="flex items-center gap-2 h-2.5 w-full">
                            <div className="flex-1 h-full bg-[#f7f3ed] rounded-full overflow-hidden border border-[#e5dec9]">
                                <div
                                    className={`h-full ${statusColors[member.workload_status as keyof typeof statusColors]} transition-all duration-700 ease-out`}
                                    style={{ width: `${Math.min((member.active_tasks / 10) * 100, 100)}%` }}
                                />
                            </div>
                        </div>

                        <div className="flex justify-between items-center text-[10px] font-semibold text-[#1c1917]/70 uppercase tracking-wider">
                            <span>{member.overdue_tasks} Overdue</span>
                            <span>{member.completed_tasks} Completed</span>
                        </div>
                    </div>
                ))}

                {teamData.length === 0 && (
                    <p className="text-center text-[#1c1917]/60 text-sm italic py-8 font-medium">No data available for team members.</p>
                )}
            </div>
        </div>
    );
}
